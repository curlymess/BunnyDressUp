/* a JWT library that works in the browser */
import * as jose from "https://cdn.jsdelivr.net/npm/jose@4/+esm";

/* A small class that manages Sign In with Google functionality. */
export default class GoogleAuth {
  /* You should only create one instance of GoogleAuth for your app.
     clientId is the client ID you got from Google. */
  constructor(clientId) {
    this._callback = null;
    this._clientId = clientId;
    this._keys = null;

    this._onLogin = this._onLogin.bind(this);
    google.accounts.id.initialize({
      client_id: clientId,
      callback: this._onLogin
    });
  }

  /* Render a Sign In with Google button.
     parent is the element to put the button in.
     callback is a function to call when login is successful. It is passed the ID token as argument.
     opts are options to pass to renderButton. Defaults to { theme: "outline" } */
  render(parent, callback, opts) {
    if (!opts) opts = { theme: "outline" };
    this._callback = callback;
    google.accounts.id.renderButton(parent, opts);
  }

  /* Verify that an I token passed to the callback is valid.
     If it is, returns the data object stored in the token. Otherwise, throws an exception.
     Note: You don't need to call this if you are going to pass the ID token to your API and verify it in your backend. */
  async verifyIdToken(token) {
    if (!this._keys) this._keys = await jose.createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
    let data = await jose.jwtVerify(token, this._keys, { audience: this._clientId });
    return data;
  }

  _onLogin(response) {
    if (!this._callback) return;
    this._callback(response.credential);
  }
}
