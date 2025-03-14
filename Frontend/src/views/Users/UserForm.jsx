import { useNavigate, useParams } from "react-router-dom"; 
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import { Form, Input, Button, Alert, Spin, Card, Select, Checkbox, Space, Typography } from "antd";
import { SaveOutlined, ArrowLeftOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    role: '',
    permissions: []
  });
  
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    fetchRolesAndPermissions();

    if (id) {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setUser(data);
          form.setFieldsValue(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, form]);

  const fetchRolesAndPermissions = async () => {
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        axiosClient.get("/roles"),
        axiosClient.get("/permissions")
      ]);
      setRoles(rolesResponse.data);
      setPermissions(permissionsResponse.data);
    } catch (error) {
      console.error("Error fetching roles and permissions:", error);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const { password_confirmation, ...userData } = values;

    try {
      if (user.id) {
        await axiosClient.put(`/users/${user.id}`, userData);
        setNotification('User was successfully updated');
      } else {
        await axiosClient.post('/users', userData);
        setNotification('User was successfully created');
      }
      navigate('/users');
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const onDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        await axiosClient.delete(`/users/${user.id}`);
        setNotification('User was successfully deleted');
        navigate('/users');
      } catch (error) {
        setLoading(false);
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      <Card 
        className="shadow-md"
        title={
          <Space className="w-full justify-between">
            <Title level={4} className="!mb-0">
              {user.id ? `Update User: ${user.name}` : 'New User'}
            </Title>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/users')}
            >
              Back to Users
            </Button>
          </Space>
        }
      >
        {loading && (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        )}

        {errors && (
          <Alert
            message="Validation Error"
            description={
              <ul className="list-disc pl-4">
                {Object.keys(errors).map(key => (
                  <li key={key}>{errors[key][0]}</li>
                ))}
              </ul>
            }
            type="error"
            showIcon
            closable
            className="mb-6"
          />
        )}

        {!loading && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={user}
            className="mt-4"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter full name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input the email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter email address"
                size="large"
              />
            </Form.Item>

            {!user.id && (
              <>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input the password!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Enter password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="password_confirmation"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm the password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('The passwords do not match!');
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm password"
                    size="large"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select
                placeholder="Select user role"
                size="large"
                className="w-full"
              >
                {roles.map((role) => (
                  <Option key={role.id} value={role.name}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Permissions"
              name="permissions"
            >
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permissions.map((permission) => (
                    <Checkbox key={permission.id} value={permission.name}>
                      {permission.name}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-4">
                <Button 
                  size="large"
                  onClick={() => navigate('/users')}
                >
                  Cancel
                </Button>
                {user.id && (
                  <Button
                    type="danger"
                    size="large"
                    onClick={onDelete}
                  >
                    Delete User
                  </Button>
                )}
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  {user.id ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}
