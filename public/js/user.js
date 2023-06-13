import apiRequest from "./apirequest.js";
import Bunny from "./bunny.js";

export default class User {
  constructor(data) {
    this.id = data.id;
    this.savedBunnies = data.bunnies ? data.bunnies : [];
  }

  /* Returns an array of user IDs. */
  static async listUsers() {
    let data = await apiRequest("GET", "/users");
    return data.users;
  }

  /* Returns a User instance, creating the user if necessary. */
  static async loadOrCreate(id) {
    let data;
    try {
      data = await apiRequest("GET", `/users/${id}`);
    } catch (e) {
      console.log("User not found... now creating user");
      data = await apiRequest("POST", "/users", { id: id });
    }
    return new User(data);
  }

  // save curr bunnys to server
  async save() {
    let data = await apiRequest( "PATCH", `/users/${this.id}`, { savedBunnies: this.savedBunnies });
    return data;
  }

  /* Gets the user's current bunnies. Returns an Array of Bunny objects. */
  async getFeed() {
    let data = await apiRequest("GET", `/users/${this.id}/savedBunnies`);
    return data.savedBunnies.map((b) => {
      return new Bunny(b);
    });
  }

  /* Create a new bunny with the given stuff. */
  async postBunny(text) {
    let data = await apiRequest("POST", `/users/${this.id}/posts`, { text: text });
    return data;
  }

  toString() {
    return `${this.id}`;
  }
}
