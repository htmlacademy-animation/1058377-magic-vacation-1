export default class Timer {
  constructor() {
    this._timeComponent = null;
    this._minutesComponent = null;
    this._secondsComponent = null;
    this._countdownDuration = 5 * 60 * 1000;
    this._fps = 1;
    this._fpsInterval = 1000 / this._fps;
    this._then = Date.now();
    this._elapsed = 0
    this._startTime = null;
    this._endTime = null;
    this._running = false;
    this._timerId = null;
  }

  startTimer() {
    if (this._timerId) {
      return;
    }
    this._timeComponent = document.querySelector('.game__counter');
    this._minutesComponent = this._timeComponent.querySelector('.game__counter-minutes');
    this._secondsComponent = this._timeComponent.querySelector('.game__counter-seconds');
    this.renderTime(this._countdownDuration);
    this._startTime = Date.now();
    this._endTime = this._startTime + this._countdownDuration;
    this._running = true;
    this.tick();
  }

  stopTimer() {
    this._running = false;
    if(this._timerId) {
      cancelAnimationFrame(this._timerId);
      this._timerId = null;
    }
  }

  renderTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    this._minutesComponent.textContent = String(minutes).padStart(2, '0');
    this._secondsComponent.textContent = String(seconds).padStart(2, '0');
  }

  draw() {
    if (!this._running) return;

    const milliseconds = this._endTime - Date.now();
    if (milliseconds > 0) {
      this.renderTime(milliseconds);
    } else {
      this.renderTime(0);
      this.stopTimer();
    }
  }

  tick() {
    if (!this._running) return;

    this._timerId = requestAnimationFrame(() => this.tick());
    const now = Date.now();
    this._elapsed = now - this._then;

    if (this._elapsed > this._fpsInterval) {
      this._then = now - (this._elapsed % this._fpsInterval);
      this.draw();
    }
  }
}
