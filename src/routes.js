import React from 'react';
import { Redirect } from '@reach/router';
import { ParamsContext } from './Context';
import styles from './index.module.css';
import AppHeader from './common/components/app-header/AppHeader';
import SubHeader from './common/components/app-sub-header/SubHeader';
import { getToken, getCurrentBot } from './libs/storage/tokenStorage';
import { notification } from 'antd';


const NewPush = React.lazy(() => import('./common/components/app-newPush/NewPush'));
const SentNotification = React.lazy(() => import('./common/components/app-sent-notifcation/sent-notification'));
const Audience = React.lazy(() => import('./common/components/app-audience/audience'));
const Schedule = React.lazy(() => import('./common/components/app-schedule-notification/schedule'));
const LoginForm = React.lazy(() => import('./login-module/LoginPage'));
const ForgotPasswordForm = React.lazy(() => import('./login-module/components/ForgotPasswordForm'));
const ResetPassword = React.lazy(() => import('./login-module/components/ResetPassword'));
const Cancelled = React.lazy(() => import('./common/components/app-cancelled/CancelledNotification'));


function openNotification(type , message) {
  notification.destroy()
  notification[type]({
    message: message,
    duration : 5
  });
}

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

function DashboardWrapperComponent(props){
  
  window.addEventListener('online', function(e){
    openNotification('success' , "You're back online")
  });
  
  window.addEventListener('offline', function(e){
    openNotification('error', "We cannot establish a connection. Please check you're internet connection")
  });

  return (
    <div className={styles.container}>
      <AppHeader />
      <SubHeader />
      <div className={styles.bodyWrapper}>
        {props.children}
      </div>
    </div>
  );
}

function withDashboard(WrapperComponent) {
  return props => {
    return(
      <DashboardWrapperComponent >
        <WrapperComponent {...props} />
      </DashboardWrapperComponent>
    );
  }
}

const routes = [
  {
    path: '/',
    component: checkedLogedIn(withParams(LoginForm)),
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
    path: 'bots/:botId/push-notification/cancelled-notification',
    component: isLoggedIn(withParams(withDashboard(Cancelled))),
  },
  {
    path: 'bots/:botId/push-notification/schedule',
    component: isLoggedIn(withParams(withDashboard(Schedule))),
  },
];

export default routes.map(({ component, ...props }) => React.createElement(component, { ...props, key: props.path }));
