import React from 'react';
import { Button, Form, Input, notification, Typography } from 'antd';
import style from './login.module.css';
import logo from './assests/logo.svg';
import { forgetPassword } from '../actions/login-action';

const FormItem = Form.Item;

class ForgotPasswordForm extends React.Component {
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
        forgetPassword(values)
          .then((res) => {
            notification.success({
              message: 'Change Password',
              description: res.data.message,
            });
          })
          .catch((apiErr) => {
            // notification.error({
            //   message: 'Change Password',
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
          <Typography.Text style={{ paddingBottom: 20 }} size={2}>Please type your email to reset password.</Typography.Text>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your Email!' }],
            })(
              <Input size="large" placeholder="Email" />,
            )}
          </FormItem>
          <FormItem>
            <Button loading={submittingForm} block size="large" type="primary" htmlType="submit" className="login-form-button">
              Reset Password
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create({ name: 'forget-password' })(ForgotPasswordForm);
