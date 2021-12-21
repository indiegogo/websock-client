import Timer from "./timer"
import BrowserActivity from "./browser_activity"
const logging = require("ulog")
var logger = logging("Websock");

type SubscriptionSuccess = {
  status: "success"
}
type SubscriptionFailure = {
  status: "failure";
  message: string;
}
type SubscriptionResponse =
  | SubscriptionSuccess
  | SubscriptionFailure

type SocketMessage = {
  message: any;
  channel: string;
  type: string;
}

type MessageCallbackFunction = (message: any) => void;

type AbstractWebSocket = WebSocket | FakeWebSocket | null

type Config = {
  url: string;
  port?: string;
  heartbeatMs?: number;
  browseractivityTimeout?: number;
  liveMode?: boolean;
}

class Channel {
  callbacks: MessageCallbackFunction[] = [];
  keyedCallbacks: { [key: string]: MessageCallbackFunction[] } = {};

  public addCallback (callback: MessageCallbackFunction, key?: string): void {
    if(key){
      this.addKeyedCallback(callback, key)
    } else {
      this.callbacks.push(callback);
    }
  }

  public addKeyedCallback (callback: MessageCallbackFunction, key: string): void {
    if(typeof this.keyedCallbacks[key] === 'undefined'){ this.keyedCallbacks[key] = [] }
    this.keyedCallbacks[key].push(callback);
  }

  public handleMessage (message: any): void {
    logger.info("Channel handling message:")
    logger.info(message)
    for(let callback_key in this.callbacks) {
      this.callbacks[callback_key](message)
    }
    for(let message_key in this.keyedCallbacks) {
      logger.info("trying message_key: " + message_key)
      if(typeof message[message_key] !== 'undefined'){
        logger.info("message has key")
        for(let callback_key in this.keyedCallbacks[message_key]) {
          this.keyedCallbacks[message_key][callback_key](message)
        }
      }
    }
  }
}

export default class Websock {
  initialConnection: boolean = true;
  channels: { [key: string]: Channel } = {};
  socket: AbstractWebSocket = null;
  hearbeatInterval: ReturnType<typeof setInterval>;
  reconnectTimer: Timer = new Timer(() => { this.connect() }, this.reconnectAfterMs)
  browserActivity: BrowserActivity;
  closeWasClean: boolean = false;
  connectionString: string;
  heartbeatMs: number = 50000;
  browseractivityTimeout: number = 180000;
  config: Config

  public constructor (config: Config) {
    this.config = config
    let port: string = '';
    if(config.port){
      port = ':' + config.port;
    }
    this.connectionString = config.url + port + "/sock"
    if(config.heartbeatMs){ this.heartbeatMs = config.heartbeatMs }
    if(config.browseractivityTimeout){ this.browseractivityTimeout = config.browseractivityTimeout }
    this.browserActivity = new BrowserActivity(this.browseractivityTimeout, 5000);
    this.browserActivity.register(
      () => { this.closeDueToInactivity() },
      () => { this.connect() }
    )
  }

  public subscribe (channel_name: string, callback: MessageCallbackFunction, key?: string): SubscriptionResponse {
    const response: SubscriptionSuccess = { status: "success" }

    if(null === this.socket){ this.connect() }
    let preexisting_channel = this.channels[channel_name]
    if(preexisting_channel) {
      preexisting_channel.addCallback(callback, key);
      return response;
    }
    this.connectChannel(channel_name, this.socket)
    let channel: Channel = new Channel();
    channel.addCallback(callback, key);
    this.channels[channel_name] = channel;
    return response;
  }

  private connect (): void {
    logger.info("connecting...")
    logger.info("websock liveMode: " + this.config.liveMode)
    this.closeWasClean = false;
    if(this.config.liveMode){
      if(this.socket){ this.socket.close() }
      this.socket = new WebSocket(this.connectionString);
    } else {
      this.socket = new FakeWebSocket("")
    }


    this.socket.addEventListener("message", (event: MessageEvent) => { this.handleIncoming(event) })
    this.socket.addEventListener("open", () => { this.handleConnectionOpen() })
    this.socket.addEventListener("close", () => { this.handleConnectionClose() })
  }

  private handleIncoming (event: MessageEvent) {
    logger.info("handleIncoming event:")
    logger.info(event)

    let push_event: SocketMessage = JSON.parse(event.data);
    switch (push_event.type) {
      case 'USER':
        let channel: Channel = this.channels[push_event.channel];
        if(channel){
          channel.handleMessage(push_event.message);
        }
        break;
      case 'SYSTEM':
        // DEBUG subscription responses here
        break;
    }
  }

  private handleConnectionOpen(): void {
    this.startHeartBeat();
    this.reconnectTimer.reset();
    this.resubscribeChannels();
    this.browserActivity.startWatching()
  }

  private handleConnectionClose(): void {
    if(!this.closeWasClean){
      logger.info("unexpected connection close...")
      this.browserActivity.stopWatching();
      this.reconnectTimer.scheduleTimeout();
    }
    this.stopHeartBeat();
    this.initialConnection = false;
  }

  private closeDueToInactivity(): void {
    logger.info("closeDueToInactivity")
    if(this.socket.readyState === WebSocket.OPEN){
      logger.info("connection was open, closing")
      this.closeWasClean = true;
      this.socket.close(1000);
    }
  }

  private connectChannel (channel_name: string, socket: AbstractWebSocket): void {
    // If the connection is already open, we need to subscribe now as the open
    // event below may never fire.
    if(this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({subscribe: channel_name}));
    }
    // Regardless of current connection state, we need to ensure this channel
    // will subscribe/resubscribe whenever the socket opens at a later time.
    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({subscribe: channel_name}));
    })
  }

  private resubscribeChannels(): void {
    if(this.initialConnection){ return; }
    for(let channel_name in this.channels){
      this.socket.send(JSON.stringify({subscribe: channel_name}));
    }
  }

  private startHeartBeat(): void {
    clearInterval(this.hearbeatInterval);
    this.hearbeatInterval = setInterval(() => { this.pingHeartbeat() }, this.heartbeatMs);
  }

  private stopHeartBeat(): void {
    clearInterval(this.hearbeatInterval);
  }

  private pingHeartbeat(): void {
    logger.info("pingHeartbeat");
    this.socket.send(JSON.stringify({heart: "beat"}));
  }

  private reconnectAfterMs (tries: number): number {
    return [50, 100, 200, 500, 1000, 2000, 5000][tries - 1] || 10000;
  }
}

class FakeWebSocket extends EventTarget {
  readyState: number = WebSocket.OPEN;

  public constructor(connection: string) {
    super()
    logger.info("FakeWebSocket initialized")
  }
  public send(message: any): void {
    logger.info("sent message to websock service via FakeWebSocket:")
    logger.info(message)
  }

  public close(): void {
    logger.info("close FakeWebSocket:")
  }
}
