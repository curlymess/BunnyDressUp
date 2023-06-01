import Bunny from './bunny.js';

export default class App {
  constructor() {
    this.bunny = null;
    this.closet = null;
    this.user = null;
  }

  loadData(data){
    // reset
    this.bunny = null;
    this.closet = null;
    this.user = null;
    // set
    this.bunny = new Bunny(); // start w clean bunny
    this.closet = data;
    this.user = null; // not signed in yet ?
  }

  render() {
    return this.bg;
  }
}
window.App = App;
