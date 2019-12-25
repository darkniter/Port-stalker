import ReactDOM from 'react-dom';
import AddSite from './NetBoxSite';
import Header from './Header';
import React from 'react'
import { BrowserRouter,Switch, Route } from 'react-router-dom';
import MainPage from './MainPage';
import AddIp from './NetBoxIP';
import PortStalker from './Port-Stalker-Shell';



const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={MainPage}/>
      <Route path='/NetBoxSite' component={AddSite}/>
      <Route path='/NetBoxIp' component={AddIp}/>
      <Route path='/PortStalker' component = {PortStalker}/>
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