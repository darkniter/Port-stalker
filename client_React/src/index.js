import ReactDOM from 'react-dom';
import AddSite from './NetBoxSite';
import Header from './Header';
import React from 'react'
import { BrowserRouter,Switch, Route } from 'react-router-dom';
import MainPage from './MainPage';
import AddIp from './NetBoxIP';

class NetBoxPage extends React.Component{
  handleClick=()=>{
    const wrapper = document.getElementById('wrapper');
    wrapper.classList.toggle('is-nav-open')
  }

  render(){
    return(
      <div className = "container">
        <div id = "wrapper" className = "wrapper.NetBox" >
          <div className="nav.NetBox"></div>
            <input type="button" className="nav_button.NetBox" value="Site" onClick={() => this.handleClick()} />
          <div className="nav_body.NetBox">
            <AddSite/>
            <AddIp/>
          </div>

        </div>
      </div>
    )
  }
}

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={MainPage}/>
      <Route path='/NetBox' component={NetBoxPage}/>
      {/* <Route path='/schedule' component={STALKER}/> */}
    </Switch>
  </main>
)

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>),
  document.getElementById('root')
);