import { Link } from "react-router-dom";
import { useState } from "react";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { UserPlus } from 'lucide-react';
import { signupUser } from "../../Services/authService.js";
import { Form, Input, Button, Alert, Typography, Spin, Select } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function Signup() {
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);
    signupUser(
      values.name,
      values.email,
      values.password,
      values.password_confirmation,
      values.role,
      setUser,
      setToken,
      setErrors,
      setLoading
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7f7f7' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Create Your Account</Title>
        
        {errors && (
          <Alert message={Object.keys(errors).map((key) => errors[key][0]).join(', ')} type="error" showIcon closable style={{ marginBottom: '20px' }} />
        )}

        <Form onFinish={onSubmit}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email address!' }, { type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="name@company.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            dependencies={['password']}
            rules={[ 
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          {/* Hidden role field with default "user" */}
          <Form.Item name="role" initialValue="user" hidden>
            <Select defaultValue="user">
              
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={loading ? <Spin size="small" /> : <UserPlus />}
              size="large"
              loading={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
