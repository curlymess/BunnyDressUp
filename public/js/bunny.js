import CLOSET from "./closet.js";

export default class Bunny {
  constructor() {
    this.body = "images/bunny.png";
    this.bg = "images/no.png";
    this.clothes = "images/no.png";
    this.extra = "images/no.png";
  }

  updateBg(newItem) {
    this.outfit = newItem;
  }
  updateClothes(newItem) {
    this.clothes = newItem;
  }

  updateExtra(newItem) {
    this.extra = newItem;
  }

  toString() {
    return `bg: ${this.bg}\n outfit: ${this.outfit}`;
  }
}
