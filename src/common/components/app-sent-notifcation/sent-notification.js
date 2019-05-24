import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Icon, Card, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import '../../../project-bootstap'
import axios from 'axios';
import {ParamsContext} from '../../../Context'

function SentNotification() {
    
    const [searchText, setSearchText] = useState('');
    const [audience, setAudience] = useState([])
    const [notification, setNotification] = useState([]);
    const {botId} = React.useContext(ParamsContext) || {};
    
    function getNotification() {
      return window.axiosInstance.get(`bots/${botId}/sent-notifications`);
    }
    
    function getAudience() {
      return window.axiosInstance.get(`bots/${botId}/notifications/audiences`)
    }


    useEffect(() => {

        axios.all([getNotification(), getAudience()])
        .then(axios.spread((acct, perms) => {
          setNotification(acct.data.notifications)
          setAudience(perms.data.audiences)
        }));
    }, [])
   
   const getColumnSearchProps = dataIndex => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
       
      },
      render: text => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ),
    });
  
    const handleSearch = (selectedKeys, confirm) => {
      confirm();
      setSearchText(selectedKeys[0]);
    };
  
    const handleReset = clearFilters => {
      clearFilters();
      setSearchText('');
    };

    const getAudienceName = (newId) => {
        const value = audience.find(audience => audience._id === newId)
        return value ? value.name : '';
    } 

    const getData =  notification.map((value,key) => {
        return (
            {
                key: value._id,
                id: key+1,
                audience: getAudienceName(value.audience.customAudienceId),
                message: value.content.message,
                subject: value.content.subject,
                status : [value.status],
                time: new Date(value.updatedAt)
            }
        )
    })
    
    const columns = [
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          ...getColumnSearchProps('id'),
        },
        {
          title: 'Audience',
          dataIndex: 'audience',
          key: 'audience',
          ...getColumnSearchProps('audience'),
        },
        {
          title: 'Message',
          dataIndex: 'message',
          key: 'message',
          width: 200,
          ...getColumnSearchProps('message'),
        },
        {
          title: 'Subject',
          dataIndex: 'subject',
          key: 'subject',
          width: 200,
          ...getColumnSearchProps('subject'),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => (
              <span>
                {status.map(status => {
                  let color = status === "completed" ? 'green' : 'yello';
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
            ...getColumnSearchProps('time'),
          }
      ];
      
      return (
            <Card bodyStyle = {{margin: "auto",width: "80%",}} hoverable = {true} >
                <Table  columns={columns} 
                        dataSource={getData}
                        pagination={{ pageSize: 20 }}
                        />
            </Card>
        );
      }
  

export default SentNotification;
