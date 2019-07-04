/* global window */
import React from 'react';
import { Tabs } from 'antd';
import styles from './header.module.css';
import { ParamsContext } from '../../../Context';
import './tabs.css';
import ScheduleSVG from './assests/calendar.svg';
import CancelledSVG from './assests/cancel.svg';
import CreatePushSVG from './assests/push.svg';
import SentSVG from './assests/sent.svg';
import AudienceSVG from './assests/audience.svg';

const { TabPane } = Tabs;

const TABS = [
  {
    label: 'Create',
    actionUrl: '/push-notification/create',
    key: 'create',
    icon: CreatePushSVG,
  },
  {
    label: 'Scheduled',
    actionUrl: '/push-notification/schedule',
    key: 'schedule',
    icon: ScheduleSVG,
  },
  {
    label: 'Sent',
    actionUrl: '/push-notification/sent-notification',
    key: 'sent-notification',
    icon: SentSVG,
  },
  {
    label: 'Cancelled',
    actionUrl: '/push-notification/cancelled-notification',
    key: 'cancelled-notification',
    icon: CancelledSVG,
  },
  {
    label: 'Audience',
    actionUrl: '/push-notification/audience',
    key: 'audience',
    icon: AudienceSVG,
  },
];

function AppSubHeader(props) {
  const { style } = props;
  const { navigate, tabId, botId, uri } = React.useContext(ParamsContext);

  const n = uri.lastIndexOf('/');
  const currentTab = uri.substring(n + 1);

  return (
    <div className={styles.header} style={style}>
      <Tabs activeKey={currentTab}>
        {
          TABS
            .map(({ label, icon, actionUrl, key, selectedIcon }) => (
              <TabPane
                key={key}
                tab={(
                  <span onClick={() => navigate(`/bots/${botId}${actionUrl}`)} className={styles.tabItem}>
                    <img src={icon} />
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

export default React.memo(AppSubHeader);
