import React, { Component  } from 'react';
import '../../../project-bootstap'
import { Form, Button, Typography, Card, Input, DatePicker } from 'antd';
import SelectAudience from './newPush-component/selectAudience/selectAudience'

import CustomAudience from './newPush-component/customAudience/customAudience'
import QuerySelector from './newPush-component/querySelector/querySelector'
import '../../../project-bootstap'

const { Title } = Typography;

const OPTIONS = ["everyone", "custom","filter"];

const OptionToComponentMap = {
  'custom':  <CustomAudience />,
  'filter':  <QuerySelector />,
  'everyone': null
};

class CreatePush extends Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          console.log("Done")
          const obj = {
            fixedTime: values.time.toString(),
            contentType: values.select,
            content: {
                subject: values.subject,
                message: values.message
            },
            audience: {
                type: "custom",
                customAudienceId: values.audienceType
            },
            params: []
          }

          window.axiosInstance.post('https://dev.chatteron.io/api/bots/5ce25bf42424130017b8307a/notifications', obj )
            .then(response =>  {
              console.log(response)
              if(response.status === 200){
                this.props.form.resetFields();
              }
            })
            .catch(error => {
              console.log(error);
          });
      }
    });
  };  

  render() {
    
      const { getFieldDecorator, getFieldValue,  } = this.props.form;

      const selectAudience = getFieldValue('select')
      const audienceType =   getFieldValue('audienceType');
      const messageValue =   getFieldValue('message');
      const subjectValue =   getFieldValue('subject');
      const time =           getFieldValue('time');

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