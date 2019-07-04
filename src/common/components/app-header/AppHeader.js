/* global window */
import React from 'react';
import { Avatar, Dropdown, Icon, Layout, Menu, Typography } from 'antd';
import styles from './header.module.css';
import { ParamsContext } from '../../../Context';
import Logo from '../../../assets/logo.svg';
import {
  clearCurrentBot,
  clearUserEmail,
  clearUserId,
  deleteToken,
} from '../../../libs/storage/tokenStorage';

const { Header } = Layout;

function AppHeader(props) {
  const { navigate } = React.useContext(ParamsContext);

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          deleteToken();
          clearUserId();
          clearCurrentBot();
          clearUserEmail();
          navigate(`/login${window.location.search}`, { replace: true });
        }}
      >
        <Icon type="poweroff" />
          Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.header}>
      <img onClick={() => navigate('/')} style={{ maxHeight: 60, cursor: 'pointer' }} alt="logo" src={Logo} />

      {/* <SubHeader /> */}
      <div>
        <Typography.Text>Leena user</Typography.Text>
        {' '}
        <Dropdown overlay={menu}>
          <Avatar icon="user" />
        </Dropdown>
      </div>
    </div>
  );
}

export default AppHeader;
