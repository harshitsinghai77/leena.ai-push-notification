import React from 'react';
import { Modal, Form, Input } from 'antd';
import '../../../project-bootstap';
import { ParamsContext } from '../../../Context';
import QueryBuilder from '../app-queryBuilder/QueryBuilder';


function CreateAudience(props) {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const { botId } = React.useContext(ParamsContext) || {};

  const [value, setValue] = React.useState();

  React.useEffect(() => {
    const { value } = props;
    if (value && 'filter' in value) {
      setValue(value);
    }
  }, []);

  const getMethod = () => {
    if (value) return 'put';
    return 'post';
  };

  const getPOSTURL = () => {
    if (value && value.id) return `api/bots/${botId}/notifications/audiences/${value.id}`;
    return `api/bots/${botId}/notifications/audiences`;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setConfirmLoading(true);
    props.form.validateFields((err, values) => {
      if (err) setConfirmLoading(false);
      if (!err) {
        const obj = {
          name: values.name,
          type: 'filter',
          filter: values.filter,
        };

        window.axiosInstance({
          method: getMethod(),
          url: getPOSTURL(),
          data: obj,
        })
          .then((response) => {
            props.addOrEditAudience(response.data.audience);
            setConfirmLoading(false);
            props.form.resetFields();
            props.handleCancel();
          });


        // window.axiosInstance.post(`api/bots/${botId}/notifications/audiences`, obj)
        //   .then((response) => {
        //     props.onDone(response.data.audience);
        //     setConfirmLoading(false);
        //     props.form.resetFields();
        //     props.handleCancel();
        //   })
        //   .catch((error) => {
        //     setConfirmLoading(false);
        //   });
      }
    });
  };

  const handleCancel = () => {
    setConfirmLoading(false);
    props.form.resetFields();
    props.handleCancel();
  };

  const { getFieldDecorator } = props.form;

  return (
    <div>
      <Modal
        title="Create Audience"
        visible
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        onOk={onSubmit}
        centered
        width="60%"
      >
        <Form onSubmit={onSubmit}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              initialValue: value ? value.name : '',
              rules: [{ required: true, message: 'Name of the audience' }],
            })(
              <Input placeholder="Name" />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('filter', {
              initialValue: value ? value.filter : null,
              rules: [{ required: true, message: 'Filter must be valid' }],
            })(
              <QueryBuilder />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const CreateAudienceForm = Form.create({ name: 'create_audience' })(CreateAudience);
export default CreateAudienceForm;
