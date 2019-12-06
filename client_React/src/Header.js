import logo from './assets/n_logo.png';
// import fireBox from './assets/n_firebox.png';
import Stalker from './assets/n_stalker.png';
import eye from './assets/bullseye.svg';
import ip from './assets/wifi.svg';
import site from './assets/house-fill.svg';
import React from 'react';
import config from './config.json';

function Header(){
const NotDone=()=>{return(alert('In the work, please stay with us !'))}
return (

              <nav className="navbar navbar-default navbar-fixed-top">
              {/* <div className="row" > */}
                {/* <div className="navbar-collapse collapse in"> */}
              <div className ="nav navbar-nav">
                <div className ="btn-group" role="group">
                <a href={`${config.noda}/`}>
                  <button  type="button" className="btn btn-dark btn-secondary" aria-label="Left Align">
                    <img  className = "menu" alt="logo" src={logo} />
                    Home
                </button>
                </a>

                <a href={`${config.noda}/NetBoxSite`}>
                    <button type="button" className="btn btn-warning btn-secondary" aria-label="Left Align">
                      <img className = "menu" alt="fireBox" src={site} />
                      NetBoxSite
                   </button>
                </a>
                <a href={`${config.noda}/NetBoxIp`}>
                    <button type="button" className="btn btn-warning btn-secondary" aria-label="Left Align">
                      <img className = "menu" alt="fireBox" src={ip} />
                      NetBoxIP
                   </button>
                </a>
                <a href={`${config.flask}`}>
                  <button
                    type="button"
                    className="btn btn-dark btn-secondary"
                    aria-label="Left Align"
                    // onClick={NotDone}
                    >
                    <img  className = "menu" alt="Stalker" src={Stalker} />
                      Port-Stalker
                  </button>
                </a>
              </div>
              </div>

              <div className="nav navbar-nav navbar-right">
                {/* <a href={`${config.flask}/NetBoxIp`}> */}
                    <button
                      width="50"
                      type="button"
                       className="btn btn-danger col-sm"
                        aria-label="Left Align"
                         onClick={NotDone}
                         >
                      <img src={eye} alt="bullseye" width="32" height="32" title="Bootstrap"/>
                      Log In
                    </button>
                {/* </a> */}
              </div>
          {/* </div> */}
        {/* </div> */}
      </nav>);

}
export default Header
