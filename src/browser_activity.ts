const logging = require("ulog")
var logger = logging("BrowserActivity");

type Callback = () => void;
const PressEvents = [ 'mousedown', 'keydown', 'touchstart' ];

export default class BrowserActivity {
  timeout: number;
  inactivityCallback: Callback;
  reactivateCallback: Callback;
  timer: ReturnType<typeof setTimeout> | null = null;
  inactive: boolean = false;
  lastActivity: number = Date.now();
  scrollingObserver: IntersectionObserver;
  stopped: boolean = false;
  lastScrollY: number;
  lastScrollX: number;
  lastHeight: number;
  lastWidth: number;
  handlingActivity: boolean = false;
  windowChangeInterval: number;
  windowWatchTimer: ReturnType<typeof setTimeout> | null = null;

  public constructor(timeout: number, windowChangeInterval: number) {
    this.timeout = timeout;
    this.windowChangeInterval = windowChangeInterval;
  }

  public register(inactivityCallback: Callback, reactivateCallback: Callback): void {
    if(typeof this.inactivityCallback !== 'undefined'){ this.stopWatching() }
    this.inactivityCallback = inactivityCallback;
    this.reactivateCallback = reactivateCallback;
  }

  public startWatching(): void {
    logger.debug("startWatching")
    this.stopped = false;
    PressEvents.forEach((activityEvent) => {
      document.addEventListener(activityEvent, (e) => { this.handlePressActivity(e) }, { once: true});
    });
    this.scheduleWindowWatcher();
    this.scheduleInactivityCallback();
  }

  public stopWatching(): void {
    logger.debug("stopWatching")
    clearInterval(this.timer)
    clearInterval(this.windowWatchTimer)
    this.stopped = true
  }

  //////////////////////////
  // Functions to handle user activity
  // Activity resets lastActivity so we don't shut the user down for another interval
  //////////////////////////

  // Press activity includes keydown, mousedown, and touchstart, fairly self-describing
  private handlePressActivity(event: Event): void {
    logger.debug("handlePressActivity")
    if(this.stopped){ return };
    document.addEventListener(event.type, (e) => { this.handlePressActivity(e) }, { once: true });
    if(this.handlingActivity){ return }; // Can't remove an event listener with a bound function, so here we are
    this.handlingActivity = true;
    if(this.inactive){ this.reactivate() }
    this.lastActivity = Date.now();
    setTimeout(() => { this.handlingActivity = false; }, 1000)
  }


  // Window activity includes any scrolling or resizing, handled by taking snapshots and comparing
  private handleWindowActivity(): void {
    logger.debug("handleWindowActivity")
    if(this.stopped || this.handlingActivity){ return };
    this.handlingActivity = true;
    if(this.inactive){ this.reactivate() }
    this.lastActivity = Date.now();
    this.takeWindowSnapshot();
    setTimeout(() => { this.handlingActivity = false; }, 1000)
  }

  private reactivate(): void {
    logger.debug("reactivate")
    this.inactive = false;
    clearInterval(this.timer)
    clearInterval(this.windowWatchTimer)
    this.reactivateCallback();
  }

  //////////////////////////
  // Functions to handle inactivity
  //////////////////////////

  private scheduleInactivityCallback(): void {
    logger.debug("scheduleInactivityCallback")
    clearInterval(this.timer);
    this.timer = setInterval(() => { this.checkIfInactive() }, this.timeout);
  }

  private checkIfInactive(): void {
    logger.debug("checkIfInactive")
    if(((Date.now() - this.lastActivity) > this.timeout) && !this.windowChanged()){
      this.deactivate();
    }
  }

  private deactivate(): void {
    this.inactive = true;
    this.inactivityCallback();
    clearInterval(this.timer);
  }

  //////////////////////////
  // Functions to handle changes to the window--scrolling or resizing
  //////////////////////////

  private scheduleWindowWatcher(): void {
    logger.debug("scheduleWindowWatcher")
    this.takeWindowSnapshot();
    clearInterval(this.windowWatchTimer)
    this.windowWatchTimer = setInterval(() => { this.checkIfWindowChanged() }, this.windowChangeInterval)
  }

  private checkIfWindowChanged(): void {
    logger.debug("checkIfWindowChanged")
    if(this.windowChanged()){
      this.handleWindowActivity()
    }
  }

  private takeWindowSnapshot(): void {
    logger.debug("takeWindowSnapshot")
    this.lastScrollY = window.scrollY;
    this.lastScrollX = window.scrollX;
    this.lastHeight = window.outerHeight;
    this.lastWidth = window.outerWidth;

  }

  private windowChanged(): boolean {
    return this.lastScrollY !== window.scrollY ||
      this.lastScrollX !== window.scrollX ||
      this.lastHeight !== window.outerHeight ||
      this.lastWidth !== window.outerWidth
  }
}
