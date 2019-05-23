import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@reach/router';
import './index.css';
import 'antd/dist/antd.css';
import applicationRoutes from './routes';
import * as serviceWorker from './serviceWorker';

function PageNotFound(){
  return <div>PageNotFound</div>;
}


ReactDOM.render(
    <Router style={{ minHeight: '100%', background: '#efefef' }}>
      {applicationRoutes}
      <PageNotFound default />
    </Router>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
