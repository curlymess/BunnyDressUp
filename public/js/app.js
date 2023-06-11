import Bunny from "./bunny.js";
import User from "./user.js";
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

    this.saveBunnyClick = this.saveBunnyClick.bind(this);

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

  downloadBunny(event) {
    event.preventDefault();
    console.log("download bunny...");

    let imageURL = document.querySelector("#bunnyImg").src; // fix here
    let toDataResult = this.toDataURL(imageURL);
    this.downloadImg(toDataResult);
  }

  // from https://incoderweb.blogspot.com/2022/05/create-button-to-download-image.html
  toDataURL(url) {
    return fetch(url).then((response) => {
      return response.blob();
    }).then((blob) => {
      return URL.createObjectURL(blob);
    });
  }

  async downloadImg(url) {
    const a = document.createElement("a");
    a.href = await url;
    a.download = "Download.png";
    document.body.append(a); // was appendChild but didnt like
    a.click();
    document.body.removeChild(a);
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
