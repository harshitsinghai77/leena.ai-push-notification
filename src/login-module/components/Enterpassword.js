/* global window */
import React from 'react';
import qs from 'query-string';
import { Link } from '@reach/router';
import { Button, Form, Input, notification, Typography } from 'antd';
import style from './login.module.css';
import logo from './assests/logo.svg';
import { ParamsContext } from '../../Context';
import {
  savePassword,
} from '../actions/login-action';
import { saveToken } from '../../libs/storage/tokenStorage';

const FormItem = Form.Item;


function LoginForm(props) {
  const [submittingForm, setSubmittingForm] = React.useState(false);
  const { navigate } = React.useContext(ParamsContext);
  const { token } = qs.parse(window.location.search);
  const { getFieldDecorator } = props.form;

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        setSubmittingForm(true);
        savePassword({ ...values, confirmPassword: values.newPassword, resetToken: token })
          .then((res) => {
            if (res.data) {
              const { newUser, message } = res.data;
              if (newUser) {
                notification.success({ message });
              } else {
                saveToken(res.data.token);
                if (res.data.userAccount.company && res.data.userAccount.company.name) {
                  navigate('/bots');
                } else {
                  navigate('/register-company');
                }
              }
            }
          })
          .catch((apiErr) => {
            notification.error({
              message: 'Login Error',
              description: apiErr.data.errors[0].message,
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
        <Typography.Title className={style.header_reset_pass} level={3}>Activate Account</Typography.Title>
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please enter you name!' }],
          })(
            <Input size="large" placeholder="Name" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('newPassword', {
            rules: [{ required: true, message: 'Please input your Email!' }],
          })(
            <Input.Password size="large" placeholder="password" />,
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
            SAVE
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'register-user' })(LoginForm);
