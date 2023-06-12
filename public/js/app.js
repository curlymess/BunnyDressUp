import Bunny from "./bunny.js";
import User from "./user.js";
import CLOSET from "./closet.js";

// https://www.cssscript.com/merge-multiple-images-one-image/
// import mergeImages from "merge-images";

export default class App {
  constructor() {
    this.bunny = new Bunny();
    this.closet = null;
    this.user = null;
    this._updateBg = this._updateBg.bind(this);
    this._updateClothes = this._updateClothes.bind(this);
    this._updateExtra = this._updateExtra.bind(this);

    this._onLogin = this._onLogin.bind(this); // TODO TO DO

    this.saveBunnyClick = this.saveBunnyClick.bind(this);

    // this.download = this.download.bind(this);
    this.downloadBunny = this.downloadBunny.bind(this);
    document.querySelector(".downloadBttn").addEventListener("click", this.downloadBunny);

    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("saveBunnyBttn")) {
        this.saveBunnyClick(event, event.target.getAttribute("id"));
      }
    });

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
    // this.user = null; // not signed in yet ?
    this.user = new User({ id: "tester1", savedBunnies: [] });
  }

  saveBunnyClick(event, slotId) {
    event.preventDefault();
    console.log(slotId);
    //this.bunny.updateUser(this.user);
    if (slotId === "saveBunnyBttn0") {
      console.log("1");
      this.user.savedBunnies[0] = this.bunny;
    } else if (slotId === "saveBunnyBttn1") {
      this.user.savedBunnies[1] = this.bunny;
    } else if (slotId === "saveBunnyBttn2") {
      this.user.savedBunnies[2] = this.bunny;
    } else {
      console.log("ERROR SAVING BUNNY");
    }
  }

  // creating img
  // https://www.tutorialspoint.com/combining-multiple-images-into-a-single-one-using-javascript
  _mergeBunny() {
    let imageURL = document.querySelector("#bgImg");
    let imageURL0 = document.querySelector("#bgImg");
    let imageURL1 = document.querySelector("#bunnyImg");
    let imageURL2 = document.querySelector("#outfitImg");
    let imageURL3 = document.querySelector("#extraImg");

    let canvas = document.querySelector("#canvas");
    let context = canvas.getContext("2d");

    canvas.width = imageURL.naturalWidth;
    canvas.height = imageURL.naturalHeight;
    context.globalAlpha = 1;
    context.drawImage(imageURL0, 0, 0);
    context.drawImage(imageURL1, 0, 0);
    context.drawImage(imageURL2, 0, 0);
    context.drawImage(imageURL3, 0, 0);
  }

  downloadBunny(event) {
    event.preventDefault();

    let canvas = document.querySelector("#canvas");
    this._mergeBunny();

    // download img
    let image = canvas.toDataURL("image/png");
    let link = document.createElement("a");
    link.download = "bunny.png";
    link.href = image;
    link.click();
  }

  _updateBg(event, bgSrc) {
    event.preventDefault();
    let bgImg = document.querySelector("#bgImg");
    bgImg.src = CLOSET.bg[bgSrc];
    this.bunny.updateBg(CLOSET.bg[bgSrc]);
    console.log(CLOSET.bg[bgSrc]);
  }

  _updateClothes(event, imgSrc) {
    event.preventDefault();
    let imgElem = document.querySelector("#outfitImg");
    imgElem.src = CLOSET.clothes[imgSrc];
    this.bunny.updateClothes(CLOSET.clothes[imgSrc]);
  }

  _updateExtra(event, imgSrc) {
    event.preventDefault();
    let imgElem = document.querySelector("#extraImg");
    imgElem.src = CLOSET.extra[imgSrc];
    this.bunny.updateExtra(CLOSET.extra[imgSrc]);
  }

  _onLogin(event) {
    event.preventDefault();
    this.user = new User({ id: "tester", savedBunnies: [] });
    //await this._loadProfile();
  }
}
window.App = App;
