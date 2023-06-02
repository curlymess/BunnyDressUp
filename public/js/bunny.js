export default class Bunny {
  constructor() {
    this.body = "images/bunny.png";
    this.bg = "images/no.png";
    this.outfit = "images/no.png";
    this.extra = "images/no.png";
  }

  updateBg(event, bgSrc) {
    console.log("clicked");
      event.preventDefault();
      var bgImg = document.getElementById("bgImg");
      bgImg.src = bgSrc;
      this.bg = bgSrc;
    }

  updateOutfit(newItem) {
    this.outfit = newItem;
  }

  updateExtra(newItem) {
    this.extra = newItem;
  }

  toString() {
    return `bg: ${this.bg}\n outfit: ${this.outfit}`;
  }
}
