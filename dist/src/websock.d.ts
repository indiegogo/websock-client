import Timer from "./timer";
import BrowserActivity from "./browser_activity";
declare type SubscriptionSuccess = {
    status: "success";
};
declare type SubscriptionFailure = {
    status: "failure";
    message: string;
};
declare type SubscriptionResponse = SubscriptionSuccess | SubscriptionFailure;
declare type MessageCallbackFunction = (message: any) => void;
declare type Config = {
    url: string;
    port?: string;
    heartbeatMs?: number;
    browseractivityTimeout?: number;
};
declare class Channel {
    callbacks: MessageCallbackFunction[];
    keyedCallbacks: {
        [key: string]: MessageCallbackFunction[];
    };
    addCallback(callback: MessageCallbackFunction, key?: string): void;
    addKeyedCallback(callback: MessageCallbackFunction, key: string): void;
    handleMessage(message: any): void;
}
export default class Websock {
    initialConnection: boolean;
    channels: {
        [key: string]: Channel;
    };
    socket: WebSocket | null;
    hearbeatInterval: ReturnType<typeof setInterval>;
    reconnectTimer: Timer;
    browserActivity: BrowserActivity;
    closeWasClean: boolean;
    connectionString: string;
    heartbeatMs: number;
    browseractivityTimeout: number;
    constructor(config: Config);
    subscribe(channel_name: string, callback: MessageCallbackFunction, key?: string): SubscriptionResponse;
    private connect;
    private handleIncoming;
    private handleConnectionOpen;
    private handleConnectionClose;
    private closeDueToInactivity;
    private connectChannel;
    private resubscribeChannels;
    private startHeartBeat;
    private stopHeartBeat;
    private pingHeartbeat;
    private reconnectAfterMs;
}
export {};
