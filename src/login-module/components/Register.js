import React from 'react';
import { Link } from '@reach/router';
import { Button, Form, Input, notification, Typography } from 'antd';
import style from './login.module.css';
import logo from './assests/logo.svg';
import { ParamsContext } from '../../Context';
import { registerUser } from '../actions/login-action';

const FormItem = Form.Item;


function LoginForm(props) {
  const [submittingForm, setSubmittingForm] = React.useState(false);
  const { navigate } = React.useContext(ParamsContext);
  const { getFieldDecorator } = props.form;

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        setSubmittingForm(true);
        registerUser(values)
          .then((res) => {
            const { newUser, message } = res.data;
            if (newUser) {
              notification.success({ message });
            } else {
              notification.warning({ message });
              navigate('/login');
            }
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
        <Typography.Title className={style.header_reset_pass} level={3}>Welcome To Notification</Typography.Title>
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
          <Button
            loading={submittingForm}
            block
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            CREATE ACCOUNT
          </Button>
        </FormItem>
        <div className={style.links}>
          <Link to="/login" href="">Already have an account? Login</Link>
        </div>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'register' })(LoginForm);
