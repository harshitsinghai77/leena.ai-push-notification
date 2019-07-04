import React from 'react';
import { Table, Card, Tag, Modal } from 'antd';
import '../../../project-bootstap';
import { ParamsContext } from '../../../Context';
import View from '../app-view-details/view';


function SentNotification() {
  const [notification, setNotification] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [viewData, setViewData] = React.useState(null);
  const { botId } = React.useContext(ParamsContext) || {};

  React.useEffect(() => {
    window.axiosInstance.get(`api/bots/${botId}/sent-notifications`)
      .then((response) => {
        setNotification(response.data.notifications);
      });
  }, []);

  const shortenString = (str) => {
    if (str.length > 200) return str.substring(0, 200).concat(' ....');
    return str;
  }

  const getData = notification.map((value, key) => {
    if (value.contentType !== 'custom') return;
    return (
      {
        key: key + 1,
        id: value._id,
        recipients: value.numAllUsers,
        message: shortenString(value.content.message),
        subject: value.content.subject,
        status: [value.status],
        time: new Date(value.scheduleTime).toLocaleString(),

        // Information required for view page
        isPoll : value.content.isPoll,
        completeMessage : value.content.message,
        audienceType: value.audience.type,
        numSuccess: value.numSuccess,
        numFailed: value.numFailed,
        option: value.content.pollOptions,
        url: value.content.attachmentUrl
      }
    );
  }).filter(item => item);

  const ViewDetails = () => (
    <Modal
      centered
      visible={modal}
      closable
      footer={null}
      onCancel={() => setModal(false)}
      width='70%'
    >
      <View data={viewData} />
    </Modal>
  );

  const columns = [
    {
      title: 'Id',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
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
          {status.map((status) => {
            const color = status === 'completed' ? 'green' : 'yellow';
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
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <Card bodyStyle={{ margin: 'auto', width: '80%' }} hoverable>
      <Table
        style={{ margin: 0 }}
        onRow={rowValue => ({
          onClick: () => {
            setModal(true);
            setViewData(rowValue);
          },
        })}
        columns={columns}
        scroll={{ x: '100% ' }}
        dataSource={getData}
        pagination={{ pageSize: 20 }}
      />
      {<ViewDetails />}
    </Card>
  );
}


export default SentNotification;
