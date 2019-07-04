import React from 'react';
import { Card, Tag, Table } from 'antd';
import '../../../project-bootstap';
import axios from 'axios';
import { ParamsContext } from '../../../Context';

function SentNotification() {
  const [audience, setAudience] = React.useState([]);
  const [notification, setNotification] = React.useState([]);
  const { botId } = React.useContext(ParamsContext) || {};


  const getNotification = () => window.axiosInstance.get(`api/bots/${botId}/notifications?status=cancelled`);

  const getAudience = () => window.axiosInstance.get(`api/bots/${botId}/notifications/audiences`);

  React.useEffect(() => {
    axios.all([getNotification(), getAudience()])
      .then(axios.spread((acct, perms) => {
        setNotification(acct.data.notifications);
        setAudience(perms.data.audiences);
      }));
  }, []);

  const getAudienceName = (newId) => {
    const value = audience.find(audienceValue => audienceValue._id === newId);
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
      }
    );
  }).filter(item => item);

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
      width: 200,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 200,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {status.map(status => (
            <Tag color="red" key={status}>
              {status.toUpperCase()}
            </Tag>
          ))}
        </span>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ margin: 'auto', width: '80%' }} hoverable>
      <Table
        columns={columns}
        dataSource={getData}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 'auto' }}
      />
    </Card>
  );
}


export default SentNotification;
