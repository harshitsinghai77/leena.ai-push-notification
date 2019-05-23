import React, {useState, useEffect} from 'react'
import { Modal, Button, Form, Input, Switch } from 'antd';
import '../../../project-bootstap'
import QuerySelector from '../app-newPush/newPush-component/querySelector/querySelector'

function CreateAudience(props) {

  const [visible , setVisible] = useState(false)
  const [confirmLoading , setConfirmLoading] = useState(false)

  const showModal = () => {
    setVisible(true);
  }

  const handleOk = (e) => {
    setConfirmLoading(true)

    e.preventDefault();
    props.form.validateFields((err, values) => {
    if (!err) {

      const obj = {
        name: values.name,
        type: values.select ? "everyone" : "filter",
        filter: {

        }
      }
      console.log(obj)

      window.axiosInstance.post('https://dev.chatteron.io/api/bots/5ce25bf42424130017b8307a/notifications/audiences', obj)
        .then(response =>  {
          console.log(response)
          props.form.resetFields();
          setConfirmLoading(false)
          setVisible(false)
        })
        .catch(error => {
          console.log(error)
        });
      }
    })
    props.onDone()
  };

  const handleCancel = () => {
    setVisible(false)
    setConfirmLoading(false)
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

    const { getFieldDecorator , getFieldValue } = props.form;
    const queryBuilderToggle = getFieldValue('select')
    return (
      <div>
        <Button type="primary" onClick={showModal}>
          Create new audience
        </Button>
        <Modal
          title="Create Audience"
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
                <Form  {...formItemLayout} >
                  <Form.Item label="Name" >
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Name of the audience' }],
                    })(
                      <Input
                        placeholder="Name"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item label="Everyone" >
                    {getFieldDecorator('select', {
                      initialValue: true
                    })(
                      <Switch defaultChecked />
                    )}
                  </Form.Item>
                  <Form.Item >
                      {!queryBuilderToggle ? <QuerySelector /> : null }
                  </Form.Item>
                </Form>
        </Modal>
      </div>
    );
}

const CreateAudienceForm = Form.create({ name: 'create_audience' })(CreateAudience);
export default CreateAudienceForm;