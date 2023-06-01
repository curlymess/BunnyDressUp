export default class Bunny {
  constructor() {
    this.bg = "images/bg/bg0.png";
    this.outfit = "images/outfit/o0.png";
    this.extra = "images/extra/a0.png";
  }

  updateBg(newItem) {
    this.bg = newItem;
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
