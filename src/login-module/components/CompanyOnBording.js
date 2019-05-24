import React from 'react';
import { Link } from '@reach/router';
import { Button, Form, Input, notification, Typography, Select } from 'antd';
import style from './login.module.css';
import logo from './assests/logo.svg';
import { ParamsContext } from '../../Context';
import { registerCompany, registerUser } from '../actions/login-action';
import { saveToken } from '../../libs/storage/tokenStorage';

const FormItem = Form.Item;

const INDUSTRY_MASTER = [
  'Automobiles',
  'Communication Services',
  'Consumer Durables & Apparel',
  'Energy',
  'Financials',
  'Food & Beverage',
  'Health Care',
  'Hospitality',
  'Information Technology',
  'Materials',
  'Real Estate',
  'Retail',
  'Transportation',
  'Other',
];

const SIZE_MASTER = [
  'Less than 10',
  '11-25',
  '26-50',
  '51-100',
  '101-1000',
  '1001-10000',
  'Greater than 10000',
];

function LoginForm(props) {
  const [submittingForm, setSubmittingForm] = React.useState(false);
  const { navigate } = React.useContext(ParamsContext);
  const { getFieldDecorator } = props.form;

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        setSubmittingForm(true);
        registerCompany(values)
          .then((res) => {
            navigate('/bots', { replace: true });
          })
          .catch((apiErr) => {
            notification.error({
              message: 'Login Error',
              description: apiErr.response.data.errors[0].message,
            });
          })
          .then(() => {
            setSubmittingForm(false);
          });
      }
    });
  }

  return (
    <div className={style.container}>
      <Form onSubmit={handleSubmit} className={style.form}>
        <img className={style.logo} alt="logo" src={logo} />
        <Typography.Title className={style.header_reset_pass} level={3}>Set up your company</Typography.Title>
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please select industry!' }],
          })(
            <Input size="large" placeholder="Company Name" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('industry', {
            rules: [{ required: true, message: 'Please enter Company Name!' }],
          })(
            <Select
              size="large"
              placeholder="Company Industry"
              optionFilterProp="children"
            >
              {INDUSTRY_MASTER.map(opt => <Select.Option value={opt}>{opt}</Select.Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('size', {
            rules: [{ required: true, message: 'Please enter Company Name!' }],
          })(
            <Select
              size="large"
              placeholder="Company Size"
              optionFilterProp="children"
            >
              {SIZE_MASTER.map(opt => <Select.Option value={opt}>{opt}</Select.Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem>
          <Button
            loading={submittingForm}
            block
            roundEdges
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Confirm
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'register-company' })(LoginForm);
