export default class Bunny {
  constructor() {
    // this.body = "images/bunny.png";
    this.bg = "bgNone";
    this.clothes = "cNone";
    this.extra = "eNone";
    this.user = null;
  }

  updateBg(newItem) {
    this.bg = newItem;
  }
  updateClothes(newItem) {
    this.clothes = newItem;
  }

  updateExtra(newItem) {
    this.extra = newItem;
  }

  updateUser(userid) {
    this.user = userid;
  }

  toString() {
    return `bg: ${this.bg}\n outfit: ${this.outfit}`;
  }
}
