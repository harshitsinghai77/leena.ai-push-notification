import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Icon, Card } from 'antd';
import Highlighter from 'react-highlight-words';
import CreateAudience from './createAudience'
import '../../../project-bootstap'

function Audience() {
    
    const [searchText, setSearchText] = useState('');
    const [audience, setAudience] = useState([]);


    useEffect(() => {
        window.axiosInstance.get('https://dev.chatteron.io/api/bots/5ce25bf42424130017b8307a/notifications/audiences')
            .then(response => {
                setAudience(response.data.audiences)
            })
            .catch(error => {
                console.log(error)
            })
    },[])

  
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

    const onDone = () => {
      window.axiosInstance.get('https://dev.chatteron.io/api/bots/5ce25bf42424130017b8307a/notifications/audiences')
      .then(response => {
          setAudience(response.data.audiences)
      })
      .catch(error => {
          console.log(error)
      })
    }

    const handleDelete = (key) => {
      console.log(key)
      window.axiosInstance.delete(`https://dev.chatteron.io/api/bots/5ce25bf42424130017b8307a/notifications/audiences/${key}`)
        .then(response => {
          console.log(response)
          let arr = audience.filter(audience => audience._id !== key)
          setAudience([ ...arr])
        })
        .catch(error => {
          console.log("this is error")
        })
    }

  
    const getData =  audience.map((value,defaultKey) => {
        return (
            {
                key: value._id,
                id: defaultKey+1,
                name: value.name,
                type: value.type,
                createdAt : new Date(value.createdAt),
            }
        )
    })

    const columns = [
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          width: 10,
          ...getColumnSearchProps('id'),
        },
        {
          title: 'Name',
          dataIndex: 'name',
          width: 20,
          key: 'name',
          ...getColumnSearchProps('name'),
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          width: 50,
          ...getColumnSearchProps('type'),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            width: 50,
            key: 'createdAt',
            ...getColumnSearchProps('createdAt'),
        },
        {
          title: 'Action',
          key: 'action',
          width: 20,
          render: (text) => (
            <Icon type="delete" onClick = {() => handleDelete(text.key)} />
          ),
        }
      ];
      
      return (
            <Card bodyStyle = {{margin: "auto",width: "80%",}} hoverable = {true} hoverable = {true} >
                <CreateAudience onDone = {onDone} />
                <Table  columns={columns} 
                        dataSource={getData}
                        pagination={{ pageSize: 20 }}
                        />
            </Card>
        );
    }
  

export default Audience;
