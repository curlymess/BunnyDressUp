import Bunny from "./bunny.js";
import User from "./user.js";
import CLOSET from "./closet.js";
import apiRequest from "./apirequest.js";
import GoogleAuth from "./googleauth.js";

let auth = null;
const CLIENT_ID = "297076872738-tpnj678k0m7690tqfu04n6pk75s3osrj.apps.googleusercontent.com";

export default class App {
  constructor() {
    this.bunny = new Bunny();
    this.closet = null;
    this.user = null;
    this._updateBg = this._updateBg.bind(this);
    this._updateClothes = this._updateClothes.bind(this);
    this._updateExtra = this._updateExtra.bind(this);

    this._onLogin = this._onLogin.bind(this);

    this.saveBunnyClick = this.saveBunnyClick.bind(this);
    this.deleteBunnyClick = this.deleteBunnyClick.bind(this);

    this.downloadBunny = this.downloadBunny.bind(this);
    document.querySelector("#downloadBttn").addEventListener("click", this.downloadBunny);

    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("saveBunnyBttn")) {
        this.saveBunnyClick(event, event.target.getAttribute("id"), Number(event.target.getAttribute("id").slice(-1)));
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("deleteBunnyBttn")) {
        this.deleteBunnyClick(event, event.target.getAttribute("id"), Number(event.target.getAttribute("id").slice(-1)));
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

    this.API_KEY = null;
    auth = new GoogleAuth(CLIENT_ID); // only ONE googleauth per app
    auth.render(document.querySelector("#loginForm"), this._onLogin);
  }

  async _onLogin(idToken) {
    console.log("inside login");
    document.querySelector("#notLoggedInDiv").style.visibility = "hidden";
    document.querySelector("#notLoggedInDiv").style.display = "none";
    document.querySelector("#loggedInDiv").style.visibility = "visible";
    document.querySelector("#loggedInDiv").style.display = "flex";

    let data = await auth.verifyIdToken(idToken);
    console.log(data.payload.email);

    // data contains user email aka id - check if new user or old one to load savedBunnies
    this.user = await User.loadOrCreate(data.payload.email);
    this.user.id = data.payload.email;
    // load saved bunnies
    if (this.user.savedBunnies.length !== 0) {
      if (this.user.savedBunnies[0]) {
        document.querySelector("#saveBunnyBttn0").innerHTML = "outfit #1";
        document.querySelector("#deleteBunnyBttn0").style.visibility = "visible";
      }
      if (this.user.savedBunnies[1]) {
        document.querySelector("#saveBunnyBttn1").innerHTML = "outfit #2";
        document.querySelector("#deleteBunnyBttn1").style.visibility = "visible";
      }
      if (this.user.savedBunnies[2]) {
        document.querySelector("#saveBunnyBttn2").innerHTML = "outfit #3";
        document.querySelector("#deleteBunnyBttn2").style.visibility = "visible";
      }
    }
    let resJson = await apiRequest("POST", `/login`, { idToken: idToken });
    this.API_KEY = resJson.apiKey;
  };

  loadData(data) {
    // reset
    this.bunny = null;
    this.closet = null;
    this.user = null;
    // set
    this.bunny = new Bunny(); // start w clean bunny
    this.closet = data;
    // this.user = null; // not signed in yet ?
  }

  async saveBunnyClick(event, slotId, slotNum) {
    event.preventDefault();
    let data;
    let innerTxt = document.querySelector("#" + slotId).innerHTML;
    if (innerTxt === "save outfit") {
      //this.bunny.updateUser(this.user.id);
      this.bunny.user = this.user.id;
      document.querySelector("#" + slotId).innerHTML = "outfit #" + (slotNum + 1);
      document.querySelector("#deleteBunnyBttn" + (slotNum)).style.visibility = "visible";
      data = await apiRequest("PATCH", `/users/${this.user.id}/savedBunnys`, { savedBunnies: this.user.savedBunnies });
      this.user.savedBunnies = data.savedBunnies;
    } else { // load outfit
      this.bunny = this.user.savedBunnies[slotNum];
      this._updateBg(event, this.bunny.bg);
      this._updateClothes(event, this.bunny.clothes);
      this._updateExtra(event, this.bunny.extra);
    }
  }

  async deleteBunnyClick(event, slotId, slotNum) {
    event.preventDefault();
    this.user.savedBunnies[slotNum] = null;
    document.querySelector("#" + slotId).style.visibility = "hidden";
    document.querySelector("#saveBunnyBttn" + (slotNum)).innerHTML = "save outfit";
    await apiRequest("PATCH", `/users/${this.user.id}/savedBunnys`, { savedBunnies: this.user.savedBunnies });
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
    //this.bunny.updateBg(bgSrc);
    this.bunny.bg= bgSrc;
  }

  _updateClothes(event, imgSrc) {
    event.preventDefault();
    let imgElem = document.querySelector("#outfitImg");
    imgElem.src = CLOSET.clothes[imgSrc];
    // this.bunny.updateClothes(imgSrc);
    this.bunny.clothes = imgSrc;
  }

  _updateExtra(event, imgSrc) {
    event.preventDefault();
    let imgElem = document.querySelector("#extraImg");
    imgElem.src = CLOSET.extra[imgSrc];
    // this.bunny.updateExtra(imgSrc);
    this.bunny.extra = imgSrc;
  }
}
window.App = App;

