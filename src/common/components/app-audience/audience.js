import React from 'react';
import { Modal, Icon, Card, Button, Table } from 'antd';
import CreateAudience from './createAudience';
import '../../../project-bootstap';
import { ParamsContext } from '../../../Context';

function Audience() {
  const [audience, setAudience] = React.useState([]);
  const { botId } = React.useContext(ParamsContext) || {};
  const [visible, setVisible] = React.useState(false);

  const [viewData, setViewData] = React.useState(null);

  React.useEffect(() => {
    window.axiosInstance.get(`api/bots/${botId}/notifications/audiences`)
      .then((response) => {
        setAudience(response.data.audiences);
      });
  }, []);

  const addNewAudience = (data) => {
    const newAudience = [...audience.slice(0, 0), data, ...audience.slice(0, audience.length)];
    setAudience(newAudience);
  };

  const updateAudience = (data, index) => {
    const updatedAudience = [...audience.slice(0, index), data, ...audience.slice(index + 1, audience.length)];
    setAudience(updatedAudience);
  };

  const addOrEditAudience = (data) => {
    const audienceIndex = audience.findIndex(audienceValue => audienceValue._id === data._id);
    if (audienceIndex === -1) return addNewAudience(data);
    updateAudience(data, audienceIndex);
  };

  const handleDelete = (key) => {
    window.axiosInstance.delete(`api/bots/${botId}/notifications/audiences/${key}`)
      .then(() => {
        const arr = audience.filter(audienceValue => audienceValue._id !== key);
        setAudience([...arr]);
      });
  };

  const showDeleteConfirm = (e, key) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Are you sure you want to delete?',
      content: 'This action is irreversible.The data will be lost.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(key);
      },
    });
  };

  const getData = audience.map((value, defaultKey) => (
    {
      key: defaultKey + 1,
      id: value._id,
      filter: value.filter,
      name: value.name,
      type: value.type,
      users: value.numTotal,
      createdAt: new Date(value.createdAt).toLocaleString(),
    }
  ));

  const columns = [
    {
      title: 'Id',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
    },
    {
      title: 'Action',
      key: 'action',
      width: 20,
      render: text => (
        <Icon type="delete" onClick={e => showDeleteConfirm(e, text.id)} />
      ),
    },
  ];

  const handleCancel = () => {
    setVisible(false);
    setViewData(null);
  };

  return (
    <Card bodyStyle={{ margin: 'auto', width: '80%' }} hoverable>
      <Button type="primary" onClick={() => setVisible(true)}>
                      Create new audience
      </Button>
      { visible ? <CreateAudience value={viewData} handleCancel={handleCancel} addOrEditAudience={addOrEditAudience} /> : null}
      <Table
        style={{ margin: 0 }}
        onRow={rowValue => ({
          onClick: () => {
            setVisible(true);
            setViewData(rowValue);
          },
        })}
        columns={columns}
        scroll={{ x: '100% ' }}
        dataSource={getData}
        pagination={{ pageSize: 20 }}
      />
    </Card>
  );
}


export default Audience;
