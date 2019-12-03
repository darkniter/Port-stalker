import React from 'react';

import ReactDOM from 'react-dom';
import AppRouted from './NetBox';
import Header from './Header';

import { BrowserRouter,Switch, Route } from 'react-router-dom';
import MainPage from './MainPage';



const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={MainPage}/>
      <Route path='/NetBox' component={AppRouted}/>
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