import Bunny from './bunny.js';
import CLOSET from "./closet.js";

export default class App {
  constructor() {
    this.bunny = new Bunny();
    this.closet = null;
    this.user = null;
    console.log('in here');
    this._updateBg = this._updateBg.bind(this);

    /// adds 'click' eventlistener to all elements w the css class 
    document.addEventListener('click', event => {
      console.log("inside");
      console.log(event.target)
      if (event.target.classList.contains('bgBttn')) {
        console.log("done");
          this._updateBg(event, event.target.getAttribute('id'));
      }
  });
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

  _updateBg(event, bgSrc) {
    console.log("clicked");
      event.preventDefault();
      var bgImg = document.getElementById("bgImg");
      bgImg.src = CLOSET.bg[bgSrc];
      this.bg = bgSrc;
    }

  render() {
    return this.bg;
  }
}
window.App = App;
