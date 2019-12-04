import logo from './assets/n_logo.png';
import fireBox from './assets/n_firebox.png';
import Stalker from './assets/n_stalker.png';
import eye from './assets/bullseye.svg';
import React from 'react';

function Header(){
const NotDone=()=>{return(alert('In the work, please stay with us !'))}
return (

              <nav className="navbar navbar-default navbar-fixed-top">
              {/* <div className="row" > */}
                {/* <div className="navbar-collapse collapse in"> */}
              <div className ="nav navbar-nav">
                <div className ="btn-group" role="group">
                <a href='http://localhost:3000/'>
                  <button  type="button" className="btn btn-dark btn-secondary" aria-label="Left Align">
                    <img  className = "menu" alt="logo" src={logo} />
                    Home
                </button>
                </a>

                <a href='http://localhost:3000/NetBox'>
                    <button type="button" className="btn btn-dark btn-secondary" aria-label="Left Align">
                      <img className = "menu" alt="fireBox" src={fireBox} />
                      NetBox
                   </button>
                </a>


                  <button type="button" className="btn btn-dark btn-secondary" aria-label="Left Align" onClick={NotDone}>
                    <img  className = "menu" alt="Stalker" src={Stalker} />
                      Port-Stalker
                  </button>

              </div>
              </div>

              <div className="nav navbar-nav navbar-right">

                    <button width="50"  type="button" className="btn btn-danger col-sm" aria-label="Left Align" onClick={NotDone}>
                      <img src={eye} alt="bullseye" width="32" height="32" title="Bootstrap"/>
                      Log In
                    </button>

          </div>
          {/* </div> */}
        {/* </div> */}
      </nav>);

}
export default Header
