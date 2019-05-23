import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Icon, Card, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import '../../../project-bootstap'


function SentNotification() {
    
    const [searchText, setSearchText] = useState('');
    const [audience, setAudience] = useState([])
    const [notification, setNotification] = useState([]);


    useEffect(() => {
        window.axiosInstance.get('https://dev.chatteron.io/api/bots/5ce25bf42424130017b8307a/sent-notifications')
        .then(response =>  {
            setNotification(response.data.notifications)
        })
        .catch(error => {
          console.log(error);
        });

        window.axiosInstance.get('https://dev.chatteron.io/api/bots/5ce100ae6d951400100308b9/notifications/audiences')
        .then(response =>  {
            setAudience(response.data.audiences)
        })
        .catch(error => {
          console.log(error);
        });
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
        if(value){
            console.log(value['name'])
            return (value['name'])
        }
        // audience.map((value) => {
        //     console.log(typeof value)
        //     //console.log(value.find(value => value._id === newId).name)
        // })
    }

    const getData =  notification.map((value) => {
        return (
            {
                key: value._id,
                id: value._id,
                audience: value.audience.customAudienceId,
                message: value.content.message,
                subject: value.content.subject,
                priority: [value.priority],
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
          width: 150,
          ...getColumnSearchProps('message'),
        },
        {
          title: 'Subject',
          dataIndex: 'subject',
          key: 'subject',
          ...getColumnSearchProps('subject'),
        },
        {
          title: 'Priority',
          key: 'priority',
          dataIndex: 'priority',
          render: priority => (
            <span>
              {priority.map(priority => {
                let color = priority === "high" ? 'red' : 'blue';
                if (priority === 'low') {
                  color = 'green';
                }
                return (
                  <Tag color={color} key={priority}>
                    {priority.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
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
      {getAudienceName("5ce39af03bad7e001865d47f")}
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
