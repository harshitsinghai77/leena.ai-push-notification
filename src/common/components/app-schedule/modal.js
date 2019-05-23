import React, { Component } from 'react'
import { Form, Modal, Icon, Input, Switch  } from 'antd';

class Modals extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <React.Fragment>
        <Icon type="plus" style={{ fontSize: '20px'}} onClick={this.showModal} />
        <Modal
          title="Title"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
           <Form className="login-form" onSubmit={this.handleSubmit} >
                <Form.Item label="Name"> 
                    <Input
                        placeholder="Title"
                    />
                </Form.Item>
                <Form.Item label="Sent to everyone">
                     <Switch defaultChecked  />
                </Form.Item>
            </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Modals;
