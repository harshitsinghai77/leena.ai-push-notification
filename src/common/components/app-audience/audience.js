import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Icon, Card } from 'antd';
import Highlighter from 'react-highlight-words';
import CreateAudience from './createAudience'
import '../../../project-bootstap'
import {ParamsContext} from '../../../Context' 

function Audience() {
    
    const [searchText, setSearchText] = useState('');
    const [audience, setAudience] = useState([]);
    const {botId} = React.useContext(ParamsContext) || {};
    
    useEffect(() => {
        window.axiosInstance.get(`bots/${botId}/notifications/audiences`)
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

    const onDone = (newAudience) => {
      setAudience([ ...audience, newAudience ])
    }

    const handleDelete = (key) => {
      window.axiosInstance.delete(`bots/${botId}/notifications/audiences/${key}`)
        .then(response => {
          let arr = audience.filter(audience => audience._id !== key)
          setAudience([...arr])
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
                createdAt : new Date(value.createdAt).toLocaleString(),
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
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          ...getColumnSearchProps('name'),
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          ...getColumnSearchProps('type'),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
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
             <Card bodyStyle = {{margin: "auto",width: "80%"}} hoverable = {true}>
                <CreateAudience onDone = {onDone} />
                <Table  columns={columns} 
                        dataSource={getData}
                        pagination={{ pageSize: 20 }}
                        />
            </Card>
        );
    }
  

export default Audience;
