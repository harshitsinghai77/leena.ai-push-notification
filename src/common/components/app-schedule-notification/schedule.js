import React from 'react';
import { Modal, message, Table, Icon, Card, Tag } from 'antd';
import '../../../project-bootstap';
import axios from 'axios';
import io from 'socket.io-client';
import { ParamsContext } from '../../../Context';
import { getToken } from '../../../libs/storage/tokenStorage';

const { confirm } = Modal;

function SentNotification() {
  const [audience, setAudience] = React.useState([]);
  const [notification, setNotification] = React.useState([]);
  const { botId } = React.useContext(ParamsContext) || {};

  const baseURL = process.env.REACT_APP_BASE_URL;

  const socket = io.connect(`${baseURL}admin-dashboard`, {
    transports: ['websocket'],
    reconnection: true,
  });

  const getNotification = () => window.axiosInstance.get(`api/bots/${botId}/notifications`);

  const getAudience = () => window.axiosInstance.get(`api/bots/${botId}/notifications/audiences`);


  React.useEffect(() => {
    axios.all([getNotification(), getAudience()])
      .then(axios.spread((acct, perms) => {
        setNotification(acct.data.notifications);
        setAudience(perms.data.audiences);
      }));
  }, []);


  React.useEffect(() => {
    bootstrapSocket();
    return () => socket.disconnect();
  }, [notification]);


  const bootstrapSocket = () => {
    socket.on('connect', (res) => {
      socket.emit('authentication', {
        authorization: getToken(),
        'bot-Id': botId,
      });
  });

  socket.on('authenticated', (res) => {
      if (res) {
        socket.on('notifications.progress', (res) => {
          if (res.status) {
            changeStatus(res);
          }
        });
      }
    });
  };

  const changeStatus = (res) => {
    const tempIndex = notification.find(notification => notification._id === res._id);
    if (typeof tempIndex === 'undefined') return;
    tempIndex.status = res.status;
    setNotification([...notification]);
  };

  const successMessage = () => {
    message.success('Notification has been cancelled');
  };

  const handleCancel = (key) => {
    window.axiosInstance.put(`api/bots/${botId}/notifications/${key}/cancel`)
      .then(() => {
        const tempIndex = notification.find(notification => notification._id === key);
        if (typeof tempIndex === 'undefined') return;
        tempIndex.status = 'cancelled';
        setNotification([...notification]);
        successMessage();
      })
      .catch((error) => {

      });
  };

  const getAudienceName = (newId) => {
    const value = audience.find(audience => audience._id === newId);
    return value ? value.name : '-';
  };

  const getData = notification.map((value, key) => {
    if (value.contentType !== 'custom') return;
    return (
      {
        key: value._id,
        id: key + 1,
        audience: value.audience.type === 'custom' ? getAudienceName(value.audience.customAudienceId) : value.audience.type,
        message: value.content.message,
        subject: value.content.subject,
        status: [value.status],
        scheduleTime: new Date(value.scheduleTime).toLocaleString(),
      }
    );
  }).filter(item => item);

  const getColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'yellow';
      case 'running':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
    }
  };

  const showDeleteConfirmBox = (key) => {
    confirm({
      title: 'Are you sure you want to delete?',
      content: 'This action is irreversible.The data will be lost.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleCancel(key);
      },
      onCancel() {

      },
    });
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Audience',
      dataIndex: 'audience',
      key: 'audience',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {status.map((status) => {
            const color = getColor(status);
            return (
              <Tag color={color} key={status}>
                {status.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Schedule Time',
      dataIndex: 'scheduleTime',
      key: 'scheduleTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: text => (
        <Icon type="delete" onClick={() => showDeleteConfirmBox(text.key)} />
      ),
    },
  ];

  return (
    <Card bodyStyle={{ margin: 'auto', width: '80%' }} hoverable>
      <Table
        columns={columns}
        scroll={{ x: '100% ' }}
        dataSource={getData}
        pagination={{ pageSize: 20 }}
      />
    </Card>
  );
}


export default SentNotification;
