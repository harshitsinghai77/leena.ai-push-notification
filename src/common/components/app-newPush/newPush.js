/* global window */
import React from 'react';
import '../../../project-bootstap';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Checkbox, message, Form, Button, Typography, Card, Input, DatePicker, Spin, Icon, AutoComplete } from 'antd';
import moment from 'moment';
import SelectAudience from './selectAudience';
import { ParamsContext } from '../../../Context';
import CustomAudience from './customAudience';
import QueryBuilder from '../app-queryBuilder/QueryBuilder';
import Time from './Time';
import PollOptions from './PollOptions'
import FileUpload from './fileUpload'

const OPTIONS = ['everyone', 'custom', 'filter'];

const OptionToComponentMap = {
  custom: <CustomAudience />,
  everyone: '',
  filter: <QueryBuilder />,
};

const CreatePush = (props) => {
  const { botId } = React.useContext(ParamsContext) || {};
  const [totalAudience, setTotalAudience] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [disableTime, setDisableTime] = React.useState(false);

  const antIcon = <Icon type="loading" style={{ fontSize: 10, paddingBottom: '18px' }} spin />;

  const success = (text) => {
    message.success(text);
  };

  const getDate = (dateValue, timeValue) => {
    const date = moment(`${dateValue.format('MM/DD/YYYY')} ${timeValue.toTimeString()}`, 'MM-DD-YYYY hh:mm:ss');
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const date = disableTime ? values.date : getDate(values.date, values.time);
        const obj = {
          scheduleTime: date.time < moment() ? moment().toISOString() : date.toISOString(),
          contentType: 'custom',
          content: {
            subject: values.subject,
            message: values.message,
            attachmentUrl : values.file,
            isPoll:  values.isPoll,
            //isPublic: values.isPublic,
            pollOptions: values.pollOptions
          },
          audience: {
            type: values.select,
            customAudienceId: values.select === 'custom' ? values.audienceValue : null,
            filter: values.select === 'filter' ? values.audienceValue : null,
          },
          params: [],
        };

        window.axiosInstance.post(`api/bots/${botId}/notifications`, obj)
          .then((response) => {
            props.form.resetFields();
            success(response.data.message);
          });
      }
    });
  };

  const getTotalUser = (obj) => {
    setLoading(true);
    window.axiosInstance.post(`api/bots/${botId}/notifications/calculate-audience`, obj)
      .then((resp) => {
        setLoading(false);
        setTotalAudience(resp.data.audience.numTotal);
      });
  };

  const { getFieldDecorator, getFieldValue } = props.form;

  const selectAudience = getFieldValue('select');
  const audienceValue  = getFieldValue('audienceValue');
  const isPoll  = getFieldValue('isPoll');

  const Debounced = AwesomeDebouncePromise(
    getTotalUser,
    500,
    { key: obj => obj },
  );

  React.useEffect(() => {
    async function callFunction() {
      if (selectAudience === 'everyone') {
        await Debounced({
          audience: {
            type: selectAudience,
          },
        });
      }
    }
    callFunction();
  }, [selectAudience]);

  React.useEffect(() => {
    async function callFunction() {
      if (audienceValue) {
        await Debounced({
          audience: {
            type: selectAudience,
            customAudienceId: selectAudience === 'custom' ? audienceValue : null,
            filter: selectAudience === 'filter' ? audienceValue : null,
          },
        });
      }
    }
    callFunction();
  }, [audienceValue]);

  return (
    <Card bodyStyle={{display: 'flex', justifyContent: 'center'}} hoverable>
      <Form onSubmit={handleSubmit} className="login-form">
        <Typography.Title level={4}>Select Audience</Typography.Title>
        <Form.Item>
          {
            getFieldDecorator('select', {
              rules: [{ required: true, message: 'Please select an audience' }],
            })(<SelectAudience placeholder="Select an audience" options={OPTIONS} />)
          }
        </Form.Item>

        <Form.Item>
          {
            Boolean(OptionToComponentMap[selectAudience]) && getFieldDecorator('audienceValue', {
              rules: [{ required: true, message: 'Please select audience' }],
            })(OptionToComponentMap[selectAudience])
          }
        </Form.Item>

        <Typography.Text code>
            Total User {loading ? <Spin indicator={antIcon} /> : totalAudience}
        </Typography.Text>

        <Typography.Title level={4}>Your message here</Typography.Title>
        <Form.Item>
          {getFieldDecorator('subject', {
            rules: [{ required: false }],
          })(<Input placeholder="Type your subject here" />)}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('message', {
            rules: [{ required: true, initialValue: null, message: 'Message cannot be left blank!' }],
          })(<Input.TextArea rows={4} placeholder="Type your message here" />)}
        </Form.Item>
        
        <Form.Item>
          {getFieldDecorator('file', {
            rules: [{ initialValue: undefined }],
          })
          (<FileUpload  />)}
        </Form.Item>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Form.Item>
            {getFieldDecorator('isPoll', {
              valuePropName: "checked",
              initialValue: false
            })
            (<Checkbox> Convert to Poll </Checkbox>)}
          </Form.Item>

          {/* <Form.Item>
            {getFieldDecorator('isPublic', {
                initialValue : false
            })
            (<Checkbox> Make results public </Checkbox>)}
          </Form.Item> */}
        </div>

        <Form.Item>
          {Boolean(isPoll) && getFieldDecorator('pollOptions', {
            rules: [{ required: true, message : 'Please add atleast one option' }]
          })
            (<PollOptions />)
          }
        </Form.Item>

        <Typography.Title level={4}>Select Time</Typography.Title>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Form.Item>
            {getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please select appropriate date' }],
            })(
              <DatePicker
                disabledDate={(current) => {
                  const today = moment();
                  return !moment(current).isBetween(today.subtract(1, 'days'), moment(today).add(142, 'days'));
                }}
                showToday
                showTime
                format={disableTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD'}
                onChange={(value) => {
                  const date = new Date().toString();
                  const temp = new Date(value).toString();
                  if (date === temp) return setDisableTime(true);
                  return setDisableTime(false);
                }}
                placeholder="Select Date"
              />,
            )}
          </Form.Item>

          <Form.Item style={{ marginLeft: '20px' }}>
            {getFieldDecorator('time', {
              rules: [{ required: !disableTime, message: 'Please select appropriate time' }],
            })(
              <Time disabletime={disableTime} />,
            )}
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
              Submit
          </Button>
        </Form.Item>

      </Form>
    </Card>
  );
};


const Create = Form.create({ name: 'normal_login' })(CreatePush);

export default Create;
