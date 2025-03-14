import React, { useState, createRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, FacebookOutlined } from '@ant-design/icons';
import { useStateContext } from '../../context/ContextProvider'; 
import { loginUser } from '../../Services/authService'; 

const { Title } = Typography;

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext(); 
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      // Call the login API function
      await loginUser(values.email, values.password, setUser, setToken, navigate, setMessage, setLoading);
    } catch (error) {
      console.error('Login failed', error);
      setMessage('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '40px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2}>Welcome Back</Title>
          <Typography.Text type="secondary">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Typography.Text>
        </div>

        {message && <div style={{ color: 'red', textAlign: 'center' }}>{message}</div>}

        <Form
          name="login"
          initialValues={{ remember: rememberMe }}
          onFinish={onSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              ref={emailRef}
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Email address"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              ref={passwordRef}
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox checked={rememberMe} onChange={handleRememberMeChange}>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Form.Item>

          <Divider>Or continue with</Divider>

          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button
              icon={<FacebookOutlined />}
              size="large"
              style={{ width: '120px' }}
            />
            <Button
              icon={<GithubOutlined />}
              size="large"
              style={{ width: '120px' }}
            />
          </Space>
        </Form>
      </div>
    </div>
  );
}
