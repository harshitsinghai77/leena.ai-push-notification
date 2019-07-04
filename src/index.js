import React from 'react';
import ReactDOM from 'react-dom';
import { PageLoader } from 'leena-components';
import { Router } from '@reach/router';
import './index.css';
import 'antd/dist/antd.css';
import applicationRoutes from './routes';
import * as serviceWorker from './serviceWorker';
import PageNotFound from './common/components/app-pageNotFound/PageNotFound';

ReactDOM.render(
  <React.Suspense fallback={<PageLoader />}>
    <Router style={{ minHeight: '100%', background: '#efefef' }}>
      {applicationRoutes}
      <PageNotFound default />
    </Router>
  </React.Suspense>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
