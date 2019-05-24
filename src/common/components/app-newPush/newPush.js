import React from 'react';
import '../../../project-bootstap'
import { message, Form, Button, Typography, Card, Input, DatePicker } from 'antd';
import SelectAudience from './selectAudience'
import queryBuilder from './queryBuilder'
import {ParamsContext} from '../../../Context'
import CustomAudience from './customAudience'

const { Title } = Typography;

const OPTIONS = ["everyone", "custom"];


const OptionToComponentMap = {
  'custom':  <CustomAudience />,
  'filter':  <queryBuilder />,
  'everyone': null
};

const CreatePush = (props) => {

  const { botId } = React.useContext(ParamsContext) || {};

  const success = (text) => {
    message.success(text);
  };

  const error = (text) => {
    message.error(text);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
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
                customAudienceId: values.select === "custom" ?  values.audienceType : undefined,
            },
            params: []
          }

          window.axiosInstance.post(`bots/${botId}/notifications`, obj )
            .then(response =>  {
              if(response.status === 200){
                props.form.resetFields();
                success(response.data.message)
              }else {
                error(response.data)
              }
            })
            .catch(error => {
              console.log(error)
            });
      }
    });
  };  

      const { getFieldDecorator, getFieldValue } = props.form;

      const selectAudience = getFieldValue('select')
      // const audienceType =   getFieldValue('audienceType');
      // const messageValue =   getFieldValue('message');
      // const subjectValue =   getFieldValue('subject');
      // const time =           getFieldValue('time');

      return(
        <Card bodyStyle = {{margin: "auto",width: "50%",}} hoverable = {true}>
          <Form onSubmit={handleSubmit} className="login-form">
            <Title level={4}>Select Audience</Title>
                <Form.Item >
                      {
                        getFieldDecorator("select", {
                        rules: [{ required: true, message: 'Please select an audience'}],
                      })(
                        <SelectAudience placeholder = {"Select an audience"} options = {OPTIONS} />
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


const Create = Form.create({ name: 'normal_login' })(CreatePush);

export default Create;