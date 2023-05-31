export default class Closet {
  constructor() {
    this.bg = null;
    this.outfit = "images/outfit/o0.png";
    this.extra = "images/extra/a0.png";
  }

  fillCloset() {
    this.bg = [
      "images/bg/bg0.png",
      "images/bg/bg1.png",
      "images/bg/bg2.png",
      "images/bg/bg3.png",
      "images/bg/bg4.png"
    ];
  }

  toString() {
    return this.bg;
  }
}
