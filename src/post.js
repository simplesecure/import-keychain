const request = require('request-promise');
let headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

export function importKeychain(dataString) {
  //check if mnemonic is encrypted
  if(dataString.mnemonic.includes(" ")) {
    dataString.isEncrypted = false;
  } else {
    dataString.isEncrypted = true;
  }
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