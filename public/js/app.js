import Bunny from "./bunny.js";
import User from "./user.js";
import CLOSET from "./closet.js";

import apiRequest from "./apirequest.js";
import GoogleAuth from "./googleauth.js";
// https://www.cssscript.com/merge-multiple-images-one-image/
// import mergeImages from "merge-images";

let auth = null;
let API_KEY = null;
const CLIENT_ID = "297076872738-tpnj678k0m7690tqfu04n6pk75s3osrj.apps.googleusercontent.com";

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

    auth = new GoogleAuth(CLIENT_ID); // only ONE googleauth per app
    auth.render(document.querySelector("#loginForm"), this._onLogin);
  }

  async _onLogin(idToken) {
    console.log("inside login");
    document.querySelector("#notLoggedInDiv").style.visibility = "hidden";
    document.querySelector("#notLoggedInDiv").style.display = "none";
    document.querySelector("#loggedInDiv").style.visibility = "visible";
    document.querySelector("#loggedInDiv").style.display = "block";
    document.querySelector("#loginForm").style.display = "none";

    let data = await auth.verifyIdToken(idToken);
    // console.log(data);
    console.log(data.payload.email);

    // data contains user email aka id - check if new user or old one to load savedBunnies
    this.user = await User.loadOrCreate(data.payload.email);

    let resJson = await apiRequest("POST", `/login`, { idToken: idToken });
    API_KEY = resJson.apiKey;
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
    this.user = new User({ id: "tester1", savedBunnies: [] });
  }

  async saveBunnyClick(event, slotId) {
    event.preventDefault();
    console.log(slotId);
    let data;
    //this.bunny.updateUser(this.user);
    if (slotId === "saveBunnyBttn0") {
      console.log("0");
      this.user.savedBunnies[0] = this.bunny;
      let slot0 = document.querySelector("#saveBunnyBttn0");
      slot0.innerHTML = "0";
      data = await apiRequest("PATCH", `/users/${this.id}`, { savedBunnies: this.savedBunnies });
    } else if (slotId === "saveBunnyBttn1") {
      this.user.savedBunnies[1] = this.bunny;
      let slot0 = document.querySelector("#saveBunnyBttn1");
      slot0.innerHTML = "1";
      data = await apiRequest("PATCH", `/users/${this.id}`, { savedBunnies: this.savedBunnies });
    } else if (slotId === "saveBunnyBttn2") {
      this.user.savedBunnies[2] = this.bunny;
      let slot0 = document.querySelector("#saveBunnyBttn2");
      slot0.innerHTML = "2";
      data = await apiRequest("PATCH", `/users/${this.id}`, { savedBunnies: this.savedBunnies });
    } else {
      console.log("ERROR SAVING BUNNY");
    }
    console.log(this.user.savedBunnies);
    return data;
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

  // _onLogin(event) {
  //   event.preventDefault();
  //   this.user = new User({ id: "tester", savedBunnies: [] });
  //   //await this._loadProfile();
  // }
}
window.App = App;
