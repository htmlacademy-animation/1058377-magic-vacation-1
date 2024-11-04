class AccentTypographyBuild {
  constructor(elementSelector, timer, classForActivate, property, splitWords) {
    this._TIME_SPACE = 100;
    this._WAVE_LENGTH = 4;
    this._HALF_WAVE = 2;
    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this._splitWords = splitWords;

    this._element = document.querySelector(this._elementSelector);
    this._timeOffset = 0;

    this.prepareText();
  }

  createElement(letter, index) {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.transition = `${this._property} ${this._timer}ms ease ${this._timeOffset}ms`;

    if (index % this._WAVE_LENGTH < this._HALF_WAVE) {
      this._timeOffset = this._timeOffset - this._TIME_SPACE;
    } else {
      this._timeOffset = this._timeOffset + this._TIME_SPACE;
    }

    return span;
  }

  prepareText() {
    if(!this._element) {
      return;
    }
    if(this._element.classList.contains("text")) {
      return;
    }
    this._element.classList.add("text");
    const text = this._element.textContent.trim().split(/\s+/).filter(letter => letter !== "");
    const content = text.reduce((fragmentParent, word, wordIndex) => {
      const wordElement = Array.from(word).reduce((fragment, letter, index) => {
        fragment.appendChild(this.createElement(letter, index));
        return fragment;
      }, document.createDocumentFragment());
      const wordCountainer = document.createElement("span");
      wordCountainer.classList.add("text__word");
      wordCountainer.appendChild(wordElement);
      fragmentParent.appendChild(wordCountainer);
      if(this._splitWords) {
        this._timeOffset += (this._WAVE_LENGTH * this._TIME_SPACE);
      } else {
        this._timeOffset = 0;
      }
      return fragmentParent;
    }, document.createDocumentFragment());

    this._element.innerHTML = "";
    this._element.appendChild(content);
  }

  runAnimation() {
    if(!this._element) {
      return;
    }
    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    if(!this._element) {
      return;
    }
    this._element.classList.remove(this._classForActivate);
  }
}

const animateText = (elementSelector, delay = 500, splitWords = true) => {
  const accentTypography = new AccentTypographyBuild(
    elementSelector,
    500,
    "active",
    "transform",
    splitWords,
  );
  setTimeout(() => {
    accentTypography.runAnimation();
  }, delay);
  return accentTypography;
};

export {animateText};
