import React from 'react';
import { ParamsContext } from './Context';
import { Redirect } from '@reach/router';
import styles from './index.module.css';
import AppHeader from './common/components/app-header/AppHeader';
import SubHeader from './common/components/app-sub-header/SubHeader';
import { getToken, getCurrentBot } from './libs/storage/tokenStorage';
import NewPush from './common/components/app-newPush/newPush'
import SentNotification from './common/components/app-sent-notifcation/sent-notification'
import Audience from './common/components/app-audience/audience'
import Schedule from './common/components/app-schedule-notification/schedule'
import LoginForm from './login-module/LoginPage';
import ForgotPasswordForm from './login-module/components/ForgotPasswordForm';
import ResetPassword from './login-module/components/ResetPassword';
import Register from './login-module/components/Register';
import Enterpassword from './login-module/components/Enterpassword';

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
    if (getToken()) return <Redirect noThrow to={`bots/${getCurrentBot()}/push-notification/create`} />;
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
  {
    path: '/',
    component: checkedLogedIn(withParams(LoginForm)),
  },
  {
    path: '/register',
    component: withParams(Register),
  },
  {
    path: '/register-user',
    component: withParams(Enterpassword),
  },
  {
    path: 'login',
    component: checkedLogedIn(withParams(LoginForm)),
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordForm,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  },
  {
    path: 'bots/:botId/push-notification/create',
    component: isLoggedIn(withParams(withDashboard(NewPush))),
  },
  {
    path: 'bots/:botId/push-notification/audience',
    component: isLoggedIn(withParams(withDashboard(Audience))),
  },
  {
    path: 'bots/:botId/push-notification/sent-notification',
    component: isLoggedIn(withParams(withDashboard(SentNotification))),
  },
  {
    path: 'bots/:botId/push-notification/schedule',
    component: isLoggedIn(withParams(withDashboard(Schedule))),
  },
];

export default routes.map(({ component, ...props }) => React.createElement(component, { ...props, key: props.path }));
