import Timer from "./timer.ts"
import BrowserActivity from "./browser_activity.ts"

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

export type Config = {
  url: string;
  port?: string;
  heartbeatMs?: number;
  browseractivityTimeout?: number;
}

class Channel {
  callbacks: MessageCallbackFunction[] = [];
  keyedCallbacks: { [key: string]: MessageCallbackFunction[] } = {};

  public addCallback (callback: MessageCallbackFunction, key: string): void {
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
    console.log("message:")
    console.log(message)
    for(let callback_key in this.callbacks) {
      this.callbacks[callback_key](message)
    }
    for(let message_key in this.keyedCallbacks) {
      console.log("message_key: " + message_key)
      if(typeof message[message_key] !== 'undefined'){
        console.log("message has key")
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
  socket: WebSocket | null = null;
  hearbeatInterval: ReturnType<typeof setInterval>;
  reconnectTimer: Timer = new Timer(() => { this.connect() }, this.reconnectAfterMs)
  browserActivity: BrowserActivity;
  closeWasClean: boolean = false;
  connectionString: string;
  heartbeatMs: number = 50000;
  browseractivityTimeout: number = 180000;

  public constructor (config: Config) {
    console.log("config:")
    console.log(config)
    let port: string = '';
    if(config.port){
      port = ':' + port;
    }
    this.connectionString = config.url + port + "/sock"
    if(config.heartbeatMs){ this.heartbeatMs = config.heartbeatMs }
    if(config.browseractivityTimeout){ this.browseractivityTimeout = config.browseractivityTimeout }
    this.browserActivity = new BrowserActivity(this.browseractivityTimeout, 5000);
    this.browserActivity.register(
      () => { console.log("browseractivity callback inactive..."); this.closeDueToInactivity() },
      () => { console.log("browseractivity callback reactivating..."); this.connect() }
    )
  }

  public subscribe (channel_name: string, callback: MessageCallbackFunction, key: string): SubscriptionResponse {
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
console.log("igg_websocket subscribe:")
console.log(channel_name)
console.log(callback)
    return response;
  }

  private connect (): void {
    console.log("connecting...")
    this.closeWasClean = false;
    if(this.socket){ this.socket.close() }
    this.socket = new WebSocket(this.connectionString);

    this.socket.addEventListener("message", (event) => { this.handleIncoming(event) })
    this.socket.addEventListener("open", () => { this.handleConnectionOpen() })
    this.socket.addEventListener("close", () => { this.handleConnectionClose() })
  }

  private handleIncoming (event: MessageEvent) {
    console.log("handleIncoming event:")
    console.log(event)
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
      console.log("unexpected connection close...")
      this.browserActivity.stopWatching();
      this.reconnectTimer.scheduleTimeout();
    }
    this.stopHeartBeat();
    this.initialConnection = false;
  }

  private closeDueToInactivity(): void {
    console.log("closeDueToInactivity")
    if(this.socket.readyState === WebSocket.OPEN){
      console.log("connection was open, closing")
      this.closeWasClean = true;
      this.socket.close(1000);
    }
  }

  private connectChannel (channel_name: string, socket: WebSocket): void {
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
    console.log("pingHeartbeat");
    this.socket.send(JSON.stringify({heart: "beat"}));
  }

  private reconnectAfterMs (tries: number): number {
    return [50, 100, 200, 500, 1000, 2000, 5000][tries - 1] || 10000;
  }
}
