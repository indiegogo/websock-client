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
type timerCallback = () => void;
type timerCalculator = (tries: number) => number;

export default class Timer {
  callback: timerCallback;
  timerCalc: timerCalculator;
  timer: ReturnType<typeof setTimeout> | null = null;
  tries: number = 0;

  public constructor(callback: timerCallback, timerCalc: timerCalculator) {
    this.callback  = callback;
    this.timerCalc = timerCalc;
  }

  public reset(){
    this.tries = 0;
    clearTimeout(this.timer);
  }

  /**
   * Cancels any previous scheduleTimeout and schedules callback
   */
  public scheduleTimeout(){
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
}
