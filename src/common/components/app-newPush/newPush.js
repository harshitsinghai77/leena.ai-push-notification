import React, { Component  } from 'react';
import '../../../project-bootstap'
import { message, Form, Button, Typography, Card, Input, DatePicker } from 'antd';
import SelectAudience from './newPush-component/selectAudience/selectAudience'

import CustomAudience from './newPush-component/customAudience/customAudience'
import QuerySelector from './newPush-component/querySelector/querySelector'

const { Title } = Typography;

const OPTIONS = ["everyone", "custom","filter"];

const OptionToComponentMap = {
  'custom':  <CustomAudience />,
  'filter':  <QuerySelector />,
  'everyone': null
};

class CreatePush extends Component {

  success = (text) => {
    message.success(text);
  };

  error = (text) => {
    message.error(text);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          const obj = {
            fixedTime: values.time.toString(),
            contentType: "custom",
            content: {
                subject: values.subject,
                message: values.message
            },
            audience: {
                type: values.select,
            },
            params: []
          }

          if(values.select === "custom"){
            Object.assign(obj.audience, {customAudienceId: values.audienceType} )
          }

          console.log(obj)

          window.axiosInstance.post('https://dev.chatteron.io/api/bots/5ce25bf42424130017b8307a/notifications', obj )
            .then(response =>  {
              console.log(response)
              if(response.status === 200){
                this.props.form.resetFields();
                this.success(response.data.message)
              }else {
                this.error(this.response.data)
              }
            })
            .catch(error => {
              this.error("Internal Error")
            });
      }
    });
  };  

  render() {
    
      const { getFieldDecorator, getFieldValue } = this.props.form;

      const selectAudience = getFieldValue('select')
      // const audienceType =   getFieldValue('audienceType');
      // const messageValue =   getFieldValue('message');
      // const subjectValue =   getFieldValue('subject');
      // const time =           getFieldValue('time');

      return(
        <Card bodyStyle = {{margin: "auto",width: "50%",}} hoverable = {true}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Title level={4}>Select Audience</Title>
                <Form.Item >
                      {
                        getFieldDecorator("select", {
                        rules: [{ required: true, message: 'Please select an audience'}],
                      })(
                        <SelectAudience options = {OPTIONS} />
                      )}
                </Form.Item>

                <Form.Item >
                  {
                   Boolean(OptionToComponentMap[selectAudience]) && getFieldDecorator("audienceType", {
                        rules: [{ required: true, message: 'Please select audience'}]
                      })(OptionToComponentMap[selectAudience])
                  }
                </Form.Item>
           
                <Title level={4}>Your message here</Title>
                <Form.Item >
                  {getFieldDecorator("subject", {
                        rules: [{ required: false }]
                      })( <Input placeholder="Type your subject here" /> )}
                </Form.Item>

                <Form.Item >
                  {getFieldDecorator("message", {
                        rules: [{ required: true, message: 'Message cannot be left blank!'}]
                      })(
                        <Input.TextArea rows={4} placeholder="Type your message here"
                    />
                  )}
                </Form.Item>
                
                <Title level={4}>Select Time</Title>
                <Form.Item>
                  {getFieldDecorator('time', {
                    rules: [{ required: true, message: 'Please select appropriate time' }],
                  })(
                    <DatePicker showToday  = {true} showTime placeholder="Select Time"  />
                  )}
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>

          </Form>
        </Card>
      )
  }
}

const Create = Form.create({ name: 'normal_login' })(CreatePush);

export default Create;