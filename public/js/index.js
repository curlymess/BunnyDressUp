import App from "./app.js";
import CLOSET from "./closet.js";
import Bunny from "./bunny.js";
import User from "./user.js";

let app = new App();
app.loadData(CLOSET);

/* Expose to console */
window.Bunny = Bunny;
window.User = User;
window.app = app;

/* can put tests here */