export default class PrizeCounter {
  constructor(elementSelector, values, animationDelay = 0) {
    this._elementSelector = elementSelector;
    this._element = null;
    this._values = values;
    this._delay = animationDelay;
    this._fps = 12;
    this._fpsInterval = 1000 / this._fps;
    this._running = false;
    this._currentValue = 0;
    this._counterId = null;
    this._elapsed = 0;
    this._then = Date.now();
  }

  startCounter() {
    if (this._counterId || !this._values) {
      return;
    }
    this._element = document.querySelector(this._elementSelector);
    this._running = true;
    this.renderValue(this._values[0]);

    if (this._delay) {
      setTimeout(() => {
        this.tick();
      }, this._delay);
    } else {
      this.tick();
    }
  }

  stopCounter() {
    this._running = false;
    this._currentValue = 0;
    if (this._counterId) {
      cancelAnimationFrame(this._counterId);
      this._counterId = null;
    }
  }

  renderValue(value) {
    this._element.textContent = value;
  }

  draw() {
    let value = this._values[this._currentValue];
    if (!this._running || !value) {
      return;
    }
    this.renderValue(value);

    this._currentValue++;
  }

  tick() {
    if (this._currentValue < this._values.length) {
      this._counterId = requestAnimationFrame(() => this.tick());
      const now = Date.now();
      this._elapsed = now - this._then;

      if (this._elapsed > this._fpsInterval) {
        this._then = now - (this._elapsed % this._fpsInterval);
        this.draw();
      }
    }
  }
}
