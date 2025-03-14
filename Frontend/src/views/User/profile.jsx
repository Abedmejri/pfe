import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Button, Input, Form, Space, Upload, message, Typography } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useStateContext } from '../../context/ContextProvider';  
import axiosClient from '../../axios-client';  

const { Content } = Layout;
const { Title } = Typography;

const Profile = () => {
  const { user } = useStateContext();  // Get current user from context
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(user.avatar || 'https://joeschmoe.io/api/v1/random'); // Default avatar

  useEffect(() => {
    // Pre-fill form fields when the page loads
    form.setFieldsValue({
      name: user.name,
      email: user.email,
    });
  }, [user, form]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const { data } = await axiosClient.post('/upload-avatar', formData, {  // Replace with your actual API endpoint
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatar(data.avatar); // Update avatar after upload
      message.success('Avatar updated successfully!');
    } catch (error) {
      message.error('Avatar upload failed.');
    }
    return false; // Prevent automatic upload behavior
  };

  const onFinish = async (values) => {
    try {
      await axiosClient.put('/update-profile', values);  // Replace with your API endpoint to update user info
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Profile update failed.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '30px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Title level={2}>Profile</Title>
          
          {/* Avatar Section */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Avatar size={100} src={avatar} icon={<UserOutlined />} />
            <Upload
              customRequest={({ file, onSuccess }) => {
                handleUpload(file);
                onSuccess();
              }}
              showUploadList={false}
              beforeUpload={(file) => file.type.startsWith('image/')}
            >
              <Button icon={<UploadOutlined />} style={{ marginTop: '10px' }}>
                Change Avatar
              </Button>
            </Upload>
          </div>

          {/* Profile Edit Form */}
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item label="Name" name="name">
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled placeholder="Enter your email" />
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" htmlType="submit" style={{ width: '200px' }}>
                Save Changes
              </Button>
            </Space>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
