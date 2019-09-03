import React from 'react';
import './App.css';
import logo from './logo.png';
import { importKeychain, encryptMnemonic } from './post';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      encryptedMnemonic: true, 
      error: "", 
      username: "", 
      email: "",
      password: "", 
      seedphrase: "", 
      mnemonic: "", 
      loading: false
    }
  }

  importSeed = async () => {
    const { encryptedMnemonic, username, password, email, seedphrase, mnemonic } = this.state;
    this.setState({ error: "" });
    

    if(encryptedMnemonic) {
      if(!mnemonic) {
        this.setState({ error: "Please provide your password-encrypted seed phrase"});
      } else {
        if(!username) {
          this.setState({ error: "Please provide a username"});
        } else if(!password) {
          this.setState({ error: "Please enter your password"});
        } else if(!email){
          this.setState({ error: "Please enter your email"});
        } else {
          const dataString = {
            username,
            email,
            password, 
            development: process.env.NODE_ENV === "production" ? false : true,
            mnemonic
          }
          this.setState({ loading: true });
          const imported = await importKeychain(dataString);
          console.log(imported);
        }
      }
    } else {
      if(!seedphrase) {
        this.setState({ error: "Please provide your 12-word seed phrase"});
      } else {
        if(!username) {
          this.setState({ error: "Please provide a username"});
        } else if(!password) {
          this.setState({ error: "Please enter your password"});
        } else {
          const encryptedSeed = await encryptMnemonic(seedphrase, password);
          console.log(encryptedSeed);
          const dataString = {
            username,
            email,
            password,
            development: process.env.NODE_ENV === "production" ? false : true,
            mnemonic: encryptedSeed
          }
          this.setState({ loading: true });
          const imported = await importKeychain(dataString);
          console.log(imported);
        }
      }
    }

    
  }

  handleUsername = (e) => {
    this.setState({ username: e.target.value });
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  handleEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  handleMnemonic = (e) => {
    if(this.state.encryptedMnemonic) {
      this.setState({ mnemonic: e.target.value });
    } else {
      this.setState({ seedphrase: e.target.value });
    }
  }

  render() {
    const { loading, encryptedMnemonic, error, username, password, email, mnemonic, seedphrase } = this.state;
    console.log(loading);
    return (
      <div className="container">
        <div className="center">
          <img src={logo} alt="SimpleID" className="logo" />
        </div>
        <div className="main center">
          {
            !loading ?
            <div>
              <h2>Import your existing decentralized identity to SimpleID</h2>
              <p>Your encrypted seed phrase is all that's stored and by importing it, you'll be able to sign into apps that use SimpleID with just your username and password.</p>
              <p>The username and password you select here are what you will use for apps that use SimpleID.</p>
              <p>If you paste in a password-encrypted seed phrase, make sure the password you use with apps that use SimpleID is the same as the one used to encrypt that seed phrase originally.</p>
              <form onSubmit={this.importSeed}>
                <div>
                  <input onChange={this.handleUsername} value={username} type="text" id="username" placeholder="username" />
                </div>
                <div>
                  <input onChange={this.handlePassword} value={password} type="password" id="password" placeholder="password" />
                </div>
                <div>
                  <input onChange={this.handleEmail} value={email} type="email" id="email" placeholder="email" />
                </div>
                <div>
                  {
                    encryptedMnemonic ? 
                    <div>
                      <textarea onChange={this.handleMnemonic} value={mnemonic} placeholder="Your password-encrypted seed phrase" id="mnemonic"></textarea> 
                      <p>Don't have your encrypted seed phrase but have the 12 words? <a onClick={() => this.setState({ encryptedMnemonic: false})} style={{cursor: "pointer",  textDecoration: "underline"}}>Click here</a>.</p>
                    </div>
                    : 
                    <div>
                      <textarea value={seedphrase} onChange={this.handleMnemonic} placeholder="Your 12-word seed phrase" id="seed-phrase"></textarea>
                      <p>Want to use your password encrypted seed-phrase? <a onClick={() => this.setState({ encryptedMnemonic: true})} style={{cursor: "pointer", textDecoration: "underline"}}>Click here</a>.</p>
                    </div>
                  }
                </div>
                <div>
                  <button type="submit">Import</button>
                </div>
                <div><p className="error">{error}</p></div>
              </form>
            </div> : 
            <div>
              <h2>Just a moment...</h2>
            </div>
          }
         
        </div>
      </div>
    );
  }
}

export default App;
