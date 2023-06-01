export default class User {
  constructor(email, bunnies) {
    this.email = email;
    this.savedBunnies = bunnies;
  }

  email() {
    return this.email;
  }

  bunnies() {
    return this.savedBunnies;
  }

  toString() {
    return `${this.email}`;
  }


}
