/**
 * Taken from https://github.com/phoenixframework/phoenix/blob/v1.5.8/assets/js/phoenix.js
 * Converted to Typescript - eric.draut@indiegogo.com
 *
 * Creates a timer that accepts a `timerCalc` function to perform
 * calculated timeout retries, such as exponential backoff.
 *
 * @example
 * let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *   return [1000, 5000, 10000][tries - 1] || 10000
 * })
 * reconnectTimer.scheduleTimeout() // fires after 1000
 * reconnectTimer.scheduleTimeout() // fires after 5000
 * reconnectTimer.reset()
 * reconnectTimer.scheduleTimeout() // fires after 1000
 *
 * @param {Function} callback
 * @param {Function} timerCalc
 */
declare type timerCallback = () => void;
declare type timerCalculator = (tries: number) => number;
export default class Timer {
    callback: timerCallback;
    timerCalc: timerCalculator;
    timer: ReturnType<typeof setTimeout> | null;
    tries: number;
    constructor(callback: timerCallback, timerCalc: timerCalculator);
    reset(): void;
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout(): void;
}
export {};
