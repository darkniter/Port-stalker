import logo from './assets/n_logo.png';
import fireBox from './assets/n_firebox.png';
import Stalker from './assets/n_stalker.png';
import eye from './assets/bullseye.svg';
import React from 'react';

function Logo(){
return (

              <div className="navbar navbar-default navbar-fixed-top">
              {/* <div className="row" > */}
                {/* <div className="navbar-collapse collapse in"> */}
              <div className="nav navbar-nav">
                <div class="btn-group" role="group">
                <a href='http://172.18.29.49:3000/'>
                  <button  type="button" className="btn btn-dark btn-secondary" aria-label="Left Align">
                    <img  className = "menu" alt="logo" src={logo} />
                    Home
                </button>
                </a>

                <a href='http://172.18.29.49:3000/'>
                    <button type="button" className="btn btn-dark btn-secondary" aria-label="Left Align">
                      <img className = "menu" alt="fireBox" src={fireBox} />
                      NetBox
                   </button>
                </a>

                <a href='http://172.18.29.49:3000/'>
                  <button type="button" className="btn btn-dark btn-secondary" aria-label="Left Align">
                    <img  className = "menu" alt="Stalker" src={Stalker} />
                      Port-Stalker
                  </button>
                </a>
              </div>
              </div>

              <div className="nav navbar-nav navbar-right">
                  <a href='http://172.18.29.49:3000/'>
                    <button width="50"  type="button" className="btn btn-danger col-sm" aria-label="Left Align">
                      <img src={eye} width="32" height="32" title="Bootstrap"/>
                      Log In
                    </button>
                  </a>
          </div>
          {/* </div> */}
        {/* </div> */}
      </div>);
}

export default Logo