export default class Bunny {
  constructor() {
    this.body = "images/bunny.png";
    this.bg = "images/no.png";
    this.clothes = "images/no.png";
    this.extra = "images/no.png";
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
