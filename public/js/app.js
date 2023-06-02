import Bunny from "./bunny.js";
import CLOSET from "./closet.js";

export default class App {
  constructor() {
    this.bunny = new Bunny();
    this.closet = null;
    this.user = null;
    this._updateBg = this._updateBg.bind(this);
    this._updateClothes = this._updateClothes.bind(this);
    this._updateExtra = this._updateExtra.bind(this);

    this._onLogin = this._onLogin.bind(this); // TODO TO DO

    /// adds 'click' eventlistener to all elements w the css class
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("bgBttn")) {
        this._updateBg(event, event.target.getAttribute("id"));
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("cBttn")) {
        this._updateClothes(event, event.target.getAttribute("id"));
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("eBttn")) {
        this._updateExtra(event, event.target.getAttribute("id"));
      }
    });
  }

  loadData(data) {
    // reset
    this.bunny = null;
    this.closet = null;
    this.user = null;
    // set
    this.bunny = new Bunny(); // start w clean bunny
    this.closet = data;
    this.user = null; // not signed in yet ?
  }

  _updateBg(event, bgSrc) {
    event.preventDefault();
    let bgImg = document.querySelector("#bgImg");
    bgImg.src = CLOSET.bg[bgSrc];
    this.bunny.updateBg(bgSrc);
  }

  _updateClothes(event, imgSrc) {
    event.preventDefault();
    let imgElem = document.querySelector("#outfitImg");
    imgElem.src = CLOSET.clothes[imgSrc];
    this.bunny.updateClothes(imgSrc);
  }

  _updateExtra(event, imgSrc) {
    event.preventDefault();
    let imgElem = document.querySelector("#extraImg");
    imgElem.src = CLOSET.extra[imgSrc];
    this.bunny.updateExtra(imgSrc);
  }

  _onLogin( event ) {
    event.preventDefault();
    this.user = 0;
    //await this._loadProfile();
  }
}
window.App = App;
