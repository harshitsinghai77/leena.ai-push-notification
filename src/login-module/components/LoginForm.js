import React from 'react';
import { Link } from '@reach/router';
import { Button, Form, Input, Typography } from 'antd';

import style from './login.module.css';
import logo from './assests/logo.svg';
import { ParamsContext } from '../../Context';
import { loginUser } from '../actions/login-action';
import { saveToken, setCurrentBot } from '../../libs/storage/tokenStorage';

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
        loginUser(values)
          .then((res) => {
            saveToken(res.data.user.token);
            setCurrentBot(res.data.user.bots[0].botId);
            navigate(`/bots/${res.data.user.bots[0].botId}/push-notification/create`, { replace: true });
          })
          .catch((apiErr) => {
            // notification.error({
            //   message: 'Login Error',
            //   description: apiErr.response.data.errors[0].message,
            // });
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
            rules: [{ required: true, message: 'Please input your Email!' }],
          })(
            <Input size="large" placeholder="Email" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input size="large" type="password" placeholder="Password" />,
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
            LOG IN
          </Button>
          <div className={style.links}>
            <Link to="/forgot-password" href="">Forgot password</Link>
          </div>
        </FormItem>
      </Form>
    </div>
  );
}
export default Form.create({ name: 'login' })(LoginForm);
