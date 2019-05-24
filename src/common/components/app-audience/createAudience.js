import React, {useState} from 'react'
import { Modal, Button, Form, Input, Switch } from 'antd';
import '../../../project-bootstap'
import {ParamsContext} from '../../../Context'


function CreateAudience(props) {

  const [visible , setVisible] = useState(false)
  const [confirmLoading , setConfirmLoading] = useState(false)
  const { botId } = React.useContext(ParamsContext) || {};
  
  const showModal = () => {
    setVisible(true);
  }

  const onSubmit = (e) => {
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
     
      window.axiosInstance.post(`bots/${botId}/notifications/audiences`, obj)
        .then(response =>  {
          props.form.resetFields();
          setConfirmLoading(false)
          setVisible(false)
          props.onDone(response.data.audience);
        })
        .catch(error => {
          console.log(error)
        });
      }
    });
  };

  const handleCancel = () => {
    setVisible(false)
    setConfirmLoading(false)
    props.form.resetFields();
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
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          centered = {true}
        >
                <Form onSubmit = {onSubmit} {...formItemLayout} >
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
                      {!queryBuilderToggle ? "This is the query builder component" : null }
                  </Form.Item>
                </Form>
        </Modal>
      </div>
    );
}

const CreateAudienceForm = Form.create({ name: 'create_audience' })(CreateAudience);
export default CreateAudienceForm;