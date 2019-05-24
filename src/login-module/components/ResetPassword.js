/* global window */
import React from 'react';
import qs from 'query-string';
import { navigate } from '@reach/router';
import { Button, Form, Input, notification, Typography } from 'antd';
import style from './login.module.css';
import logo from './assests/logo.svg';
import { resetPassword } from '../actions/login-action';
import {
  saveToken,
  setCurrentBot,
  setUserId,
} from '../../libs/storage/tokenStorage';

const FormItem = Form.Item;

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submittingForm: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // this.props.form.validateFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ submittingForm: true });
        const payload = {
          resetToken: qs.parse(window.location.search).token,
          ...values,
        };
        resetPassword(payload)
          .then((res) => {
            const { token } = res.data;
            saveToken(token);
            navigate('/bots', { replace: true });
          })
          .catch((apiErr) => {
            // notification.error({
            //   message: 'Login Error',
            //   description: apiErr.response.data.errors[0].message,
            // });
          })
          .then(() => {
            this.setState({ submittingForm: false });
          });
      }
    });
  }

  render() {
    const { submittingForm } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style.container}>
        <Form onSubmit={this.handleSubmit} className={style.form}>
          <img className={style.logo} alt="logo" src={logo} />
          <Typography.Title className={style.header_reset_pass} level={3}>Reset Password</Typography.Title>
          <FormItem>
            {getFieldDecorator('newPassword', {
              rules: [{ required: true, message: 'Please Enter Password!' }],
            })(
              <Input size="large" type="password" placeholder="New Password" />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirmPassword', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input size="large" type="password" placeholder="Confirm Password" />,
            )}
          </FormItem>
          <FormItem>
            <Button loading={submittingForm} block roundEdges size="large" type="primary" htmlType="submit" className="login-form-button">
              Reset
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create({ name: 'reset-password' })(ResetPassword);
