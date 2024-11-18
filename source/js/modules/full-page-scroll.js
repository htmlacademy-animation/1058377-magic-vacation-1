import throttle from 'lodash/throttle';
import {Screens} from '../const/screens';
import {animateText} from '../const/accentTypography.js';
import {ColorTheme, setTheme} from "../const/colorTheme";
import Timer from "./timer";

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.screenOverlay = document.querySelector('.screen-overlay');

    this.activeScreen = Screens.MAIN;
    this.previousScreen = null;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.timer = new Timer();
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        if(this.previousScreen === Screens.MAIN) {
          this.screenOverlay.classList.add("hiding");
          setTimeout(() => {
            this.changePageDisplay();
            this.screenOverlay.classList.remove("hiding");
          }, 300);
        } else {
          this.changePageDisplay();
        }
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.previousScreen = (newIndex < 0) ? null : this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    if(this.previousScreen === Screens.MAIN) {
      document.body.classList.add("hiding");
      setTimeout(() => {
        this.changePageDisplay();
        document.body.classList.remove("hiding");
      }, 300);
    } else {
      this.changePageDisplay();
    }
  }

  changePageDisplay() {
    this.destroyTitleAnimations();
    this.timer.stopTimer();
    setTheme(ColorTheme.PURPLE);
    if(this.activeScreen === Screens.MAIN) {
      this.mainPageTitleAnimation = animateText(".intro__title");
      this.mainPageDateAnimation = animateText(".intro__date", 1200, false);
    }
    if(this.activeScreen === Screens.HISTORY) {
      setTheme(ColorTheme.DARK_PURPLE);
      this.historyPageTitleAnimation = animateText(".slider__item-title");
    }
    if(this.activeScreen === Screens.PRIZES) {
      this.prizesPageTitleAnimation = animateText(".prizes__title");
    }
    if(this.activeScreen === Screens.RULES) {
      this.rulesTitleAnimation = animateText(".rules__title");
    }
    if(this.activeScreen === Screens.GAME) {
      this.gameTitleAnimation = animateText(".game__title");
      this.timer.startTimer();
    }
    if(this.activeScreen === Screens.PRIZES && this.previousScreen === Screens.HISTORY) {
      this.screenOverlay.classList.add("loading");
      this.changeActiveMenuItem();
      setTimeout(() => {
        this.changeVisibilityDisplay();
        this.emitChangeDisplayEvent();
        this.screenOverlay.classList.remove("loading");
      }, 400);
    } else {
      this.changeVisibilityDisplay();
      this.changeActiveMenuItem();
      this.emitChangeDisplayEvent();
    }
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }

  destroyTitleAnimations() {
    if(this.mainPageTitleAnimation) {
      this.mainPageTitleAnimation.destroyAnimation();
    }
    if(this.mainPageDateAnimation) {
      this.mainPageDateAnimation.destroyAnimation();
    }
    if(this.historyPageTitleAnimation) {
      this.historyPageTitleAnimation.destroyAnimation();
    }
    if(this.prizesPageTitleAnimation) {
      this.prizesPageTitleAnimation.destroyAnimation();
    }
    if(this.rulesTitleAnimation) {
      this.rulesTitleAnimation.destroyAnimation();
    }
    if(this.gameTitleAnimation) {
      this.gameTitleAnimation.destroyAnimation();
    }
  }
}
