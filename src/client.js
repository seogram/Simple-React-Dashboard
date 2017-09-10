
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore , applyMiddleware,compose} from 'redux';
import { Provider } from 'react-redux';
import {Router, Route, IndexRoute,browserHistory} from 'react-router';
import {render} from 'react-dom';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import home  from './components/pages/home';
import Main from  './main';

const Routes = (

  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={home}/>

      <Route path="*" component={home} />
    </Route>
  </Router>

)
ReactDOM.render(
  Routes,document.getElementById('root')
);
