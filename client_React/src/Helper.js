import logo from './assets/logo.png';
import fireBox from './assets/fireBox.png'
import Stalker from './assets/Stalker.png'
import React from 'react';

function Logo(){
return (<div>

          <div width = {document.documentElement.clientWidth} className="container">
            <div className="btn-group btn-group-justified " role="group" >

                <a href='http://172.18.29.49:3000/'>
                  <button width = {document.documentElement.clientWidth}  type="button" className="btn btn-dark" aria-label="Left Align">
                    <img width="50" alt="logo" src={logo} />
                    Home
                </button>
                </a>


                <a href='http://172.18.29.49:3000/'>
                    <button type="button" className="btn btn-dark col-sm" aria-label="Left Align">
                      <img width="50" alt="fireBox" src={fireBox} />
                      NetBox
                   </button>
                </a>


                <a href='http://172.18.29.49:3000/'>
                  <button type="button" className="btn btn-dark col-sm" aria-label="Left Align">
                    <img width="50" alt="Stalker" src={Stalker} />
                      Port-Stalker
                  </button>
                </a>

                <a href='http://172.18.29.49:3000/'>
                  <button width="50" type="button" className="btn btn-dark col-sm" aria-label="Left Align">

                    Log In
                </button>
                </a>
              </div>
            </div>

        </div>);
}

export default Logo