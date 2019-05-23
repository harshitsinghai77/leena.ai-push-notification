/* global window */
import React, { Component } from 'react';
import { Table, Input, Button, Icon, Card, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import '../../../project-bootstap'
import Modals from './modal';


class Scheduled extends Component {
    state = {
      searchText: '',
      data : []
    };

    componentDidUpdate(){
        this.state.data.map((data, index) => {
          console.log(data)
        })
    }

    componentDidMount() {
        window.axiosInstance.get('https://dev.chatteron.io/api/bots/5ce100ae6d951400100308b9/notifications')
        .then(response =>  {
          console.log(response.data.notifications)
          this.setState({data : response.data.notifications})
        })
        .catch(error => {
          console.log(error);
      });
    }
  
    getColumnSearchProps = dataIndex => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: text => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ),
    });
  
    handleSearch = (selectedKeys, confirm) => {
      confirm();
      this.setState({ searchText: selectedKeys[0] });
    };
  
    handleReset = clearFilters => {
      clearFilters();
      this.setState({ searchText: '' });
    };
  
    render() {

      const data = [
        {
          key: '1',
          id : 1,
          name: "King of the North",
          createdBy: 'Jon Snow',
          createdOn: '5pm',
          action  : ['sent']
        }
      ];

      const columns = [
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          width: '30%',
          ...this.getColumnSearchProps('id'),
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Created By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          ...this.getColumnSearchProps('createdBy'),
        },
        {
          title: 'Created On',
          dataIndex: 'createdOn',
          key: 'createdOn',
          ...this.getColumnSearchProps('createdOn'),
        },
        {
          title: 'Actions',
          key: 'action',
          dataIndex: 'action',
          render: action => (
            <span>
              {action.map(action => {
                let color = action === "sent" ? 'green' : 'yellow';
                if (action === 'cancelled') {
                  color = 'red';
                }
                return (
                  <Tag color={color} key={action}>
                    {action.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          ),
        }
      ];

      return (
            <Card bodyStyle = {{margin: "auto",width: "80%",}} hoverable = {true} >
                <Modals />
                <Table columns={columns} dataSource={data} />
            </Card>
        );
    }
  }

export default Scheduled;
