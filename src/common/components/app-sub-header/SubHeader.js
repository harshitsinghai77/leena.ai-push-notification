/* global window */
import React from 'react';
import { Tabs } from 'antd';
import styles from './header.module.css';
import { ParamsContext } from '../../../Context';
import './tabs.css';
import openTickets from './assests/open-tickets.svg';
import openTicketsHighlighted from './assests/open-tickets-highlighted.svg';
import closeTickets from './assests/close-tickets.svg';
import closeTicketsHighlighted from './assests/close-tickets-highlighted.svg';
import category from './assests/category.svg';
import categoryHighlighted from './assests/category-highlighted.svg';
import users from './assests/users.svg';
import usersHighlighted from './assests/users-highlighted.svg';

const { TabPane } = Tabs;

const TABS = [
  {
    label: 'Create',
    key: 'create',
    actionUrl: '/push-notification/create',
    icon: openTickets,
    selectedIcon: openTicketsHighlighted,
  },
  {
    label: 'Scheduled',
    key: 'schedule',
    actionUrl: '/push-notification/schedule',
    icon: closeTickets,
    selectedIcon: closeTicketsHighlighted,
  },
  {
    label: 'Sent',
    actionUrl: '/push-notification/sent-notification',
    activity: 'categories',
    key: 'sent',
    role: 'settings',
    icon: category,
    selectedIcon: categoryHighlighted,
  },
  {
    label: 'Cancelled',
    actionUrl: '/settings/users',
    activity: 'users',
    key: 'cancelled',
    role: 'settings',
    icon: users,
    selectedIcon: usersHighlighted,
  },
  {
    label: 'Audience',
    actionUrl: '/push-notification/audience',
    activity: 'users',
    key: 'audience',
    role: 'settings',
    icon: users,
    selectedIcon: usersHighlighted,
  },
];

function AppSubHeader(props) {
  const { botId, roles, style } = props;
  const { navigate, tabId, activity } = React.useContext(ParamsContext);
  const currentTab = tabId || activity;
  return (
    <div className={styles.header} style={style}>
      <Tabs activeKey={currentTab} defaultActiveKey = "create" animated = {true} >
        {
          TABS 
            .map(({ label, icon, actionUrl, key, selectedIcon }) => (
              <TabPane
                key={key}
                tab={(
                  <span onClick={e => navigate(`/bots/${botId}${actionUrl}`)} className={styles.tabItem}>
                    <img src={currentTab === key ? selectedIcon : icon} />
                    {label}
                  </span>
            )}
              />
            ))
        }
      </Tabs>
    </div>
  );
}

export default AppSubHeader;
