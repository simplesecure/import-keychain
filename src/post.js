const request = require('request-promise');
var CryptoJS = require("crypto-js");
let headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

export function encryptMnemonic(mnemonic, password) {
  const ciphertext = CryptoJS.AES.encrypt(mnemonic, password);
  return ciphertext.toString();
}

export function importKeychain(dataString) {
  const options = { url: "https://i7sev8z82g.execute-api.us-west-2.amazonaws.com/dev/importKeychain", method: 'POST', headers: headers, form: dataString };
  return request(options)
  .then(async (body) => {
    // POST succeeded...
    return {
      success: true,
      body: body
    }
  })
  .catch(error => {
    // POST failed...
    console.log('ERROR: ', error)
    return {
      success: false,
      body: error
    }
  });
}