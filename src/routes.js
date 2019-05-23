import React from 'react';
import { ParamsContext } from './Context';
import { Redirect } from '@reach/router';
import styles from './index.module.css';
import AppHeader from './common/components/app-header/AppHeader';
import SubHeader from './common/components/app-sub-header/SubHeader';
import NewPush from './common/components/app-newPush/newPush'
import SentNotification from './common/components/app-sent-notifcation/sent-notification'
import Audience from './common/components/app-audience/audience'
import Schedule from './common/components/app-schedule-notification/schedule'
import { notification } from 'antd';

function Demo() {
  return <div>HELLO</div>;
}

function create(){
  return <NewPush />
}

function schedule(){
  return <Schedule />
}

function sentNotification(){
  return <SentNotification />
}

function audience(){
  return <Audience />
}

function getToken() {
  return "token";
}


// function withPreLoad(WrapperComponent) {
//   return props => (
//     <PreLoad value={props}>
//       <WrapperComponent {...props} />
//     </PreLoad>
//   );
// }

function withParams(WrapperComponent) {
  return props => (
    <ParamsContext.Provider value={props}>
      <WrapperComponent {...props} />
    </ParamsContext.Provider>
  );
}

function isLoggedIn(WrapperComponent, url) {
  return (props) => {
    if (!getToken()) return <Redirect noThrow to={url || '/login'} />;
    return <WrapperComponent {...props} />;
  };
}

function checkedLogedIn(WrapperComponent) {
  return (props) => {
    if (getToken()) return <Redirect noThrow to="/" />;
    return <WrapperComponent {...props} />;
  };
}

function withDashboard(WrapperComponent) {
  return props => (
    <div className={styles.container}>
      <AppHeader />
      <SubHeader />
      <div className={styles.bodyWrapper}>
        <WrapperComponent {...props} />
      </div>
    </div>
  );
}

const routes = [
  // {
  //   path: '/',
  //   component: checkedLogedIn(withParams(Demo)),
  // },
  // {
  //   path: '/register',
  //   component: withParams(Demo),
  // },
  // {
  //   path: '/register-user',
  //   component: withParams(Demo),
  // },
  // {
  //   path: '/register-company',
  //   component: withParams(Demo),
  // },
  // {
  //   path: 'login',
  //   component: checkedLogedIn(withParams(Demo)),
  // },
  // {
  //   path: 'forgot-password',
  //   component: Demo,
  // },
  // {
  //   path: 'reset-password',
  //   component: Demo,
  // },
  {
    path: '/',
    component: isLoggedIn(withParams(withDashboard(Demo))),
  },
  {
    path: 'bots/:botId/push-notification/create',
    component: isLoggedIn(withParams(withDashboard(create))),
  },
  {
    path: 'bots/:botId/push-notification/audience',
    component: isLoggedIn(withParams(withDashboard(audience))),
  },
  {
    path: 'bots/:botId/push-notification/sent-notification',
    component: isLoggedIn(withParams(withDashboard(sentNotification))),
  },
  {
    path: 'bots/:botId/push-notification/schedule',
    component: isLoggedIn(withParams(withDashboard(schedule))),
  },
];

export default routes.map(({ component, ...props }) => React.createElement(component, { ...props, key: props.path }));
