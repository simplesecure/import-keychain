import React from 'react';
import './App.css';
import logo from './logo.png';
import { importKeychain } from './post';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "", 
      success: "",
      username: "", 
      email: "",
      password: "", 
      mnemonic: "", 
      loading: false
    }
  }

  importSeed = async (e) => {
    e.preventDefault();
    const { username, password, email, mnemonic } = this.state;
    this.setState({ error: "" });
    
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
        let dataString = {
          username,
          email,
          password, 
          development: process.env.NODE_ENV === "production" ? false : true,
          mnemonic 
        }
        this.setState({ loading: true });
        const imported = await importKeychain(dataString);
        if(imported.success) {
          this.setState({ loading: false, email: "", password: "", username: "", mnemonic: "", success: "Successfully imported identity" });
        } else {
          this.setState({ loading: false, error: imported.body.error });
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
    this.setState({ mnemonic: e.target.value });
  }

  render() {
    const { loading, error, username, password, email, mnemonic, success } = this.state;
    return (
      <div className="container flex-container">
        
        <div className="center content">
          <img src={logo} alt="SimpleID" className="logo" />
          <div>
              <h2>Import your existing decentralized identity to SimpleID</h2>
              <p>Your encrypted seed phrase is all that's stored and by importing it, you'll be able to sign into apps that use SimpleID with just your username and password.</p>
              <p>The username and password you select here are what you will use for apps that use SimpleID.</p>
              <p>If you paste in a password-encrypted seed phrase, make sure the password you use with apps that use SimpleID is the same as the one used to encrypt that seed phrase originally.</p>
            </div>
        </div>
        <div className="form-section">
          {
            !loading ? 
              <div>
                <form onSubmit={this.importSeed}>
                  <div className="group">
                    <input onChange={this.handleUsername} value={username} type="text" id="username" /><span className="highlight"></span><span className="bar"></span>
                    <label htmlFor="username">Username</label>
                  </div>
                  <div className="group">
                  <input onChange={this.handlePassword} value={password} type="password" id="password" /><span className="highlight"></span><span className="bar"></span>
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="group">
                    <input onChange={this.handleEmail} value={email} type="email" id="email" /><span className="highlight"></span><span className="bar"></span>
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="group">
                    <input type="text" onChange={this.handleMnemonic} value={mnemonic} id="mnemonic" /><span className="highlight"></span><span className="bar"></span>
                    <label htmlFor="mnemonic">Seed Phrase or Key</label>
                  </div>
                  <button type="submit" className="button buttonBlue">Import
                    <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
                  </button>
                </form>
              </div> : 
              <div>
                <h3>Just a moment...</h3>
              </div>
          }
          <div><h3 className="center error">{error}</h3></div>
          <div><h3 className="center success">{success}</h3></div>
        </div>
      </div>
    );
  }
}

export default App;
