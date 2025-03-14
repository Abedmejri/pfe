import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react";
import { Layout, Menu, Button, Avatar, Typography, Space, Badge } from 'antd';
import { MenuOutlined, LogoutOutlined, DashboardOutlined, UserOutlined, FileTextOutlined, CalendarOutlined, BellOutlined, MessageOutlined } from '@ant-design/icons';
import Chat from '../views/Chat/Chat.jsx';  // Import your Chat component

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notificationMessage } = useStateContext();
  const [collapsed, setCollapsed] = useState(false);
  const [showChat, setShowChat] = useState(false); // State to control chat visibility

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      });
  };

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
      });
  }, []);

  const menuItems = [
    { icon: <DashboardOutlined />, text: 'Dashboard', link: '/dashboard' },
    { icon: <UserOutlined />, text: 'Commissions', link: '/commissions' },
    { icon: <CalendarOutlined />, text: 'Meetings', link: '/meetings' },
    { icon: <FileTextOutlined />, text: 'PV', link: '/pv' },
    { icon: <FileTextOutlined />, text: 'profile', link: '/prf' }
  ];

  // Add additional items for admin users
  if (user?.role === 'admin') {
    menuItems.unshift({ icon: <DashboardOutlined />, text: 'Admin Dashboard', link: '/admin-dashboard' });
    menuItems.unshift({ icon: <UserOutlined />, text: 'Users', link: '/users' });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Avatar size={64} src="https://joeschmoe.io/api/v1/random" />
          <Text style={{ color: 'white' }}>{user?.email}</Text>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          {menuItems.map((item, index) => (
            <Menu.Item key={index} icon={item.icon}>
              <Link to={item.link}>{item.text}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '20px', color: '#1890ff' }}
            />
            <Space>
              <Text>{user.email}</Text>
              {/* Notification Bell */}
              <Badge count={notificationMessage ? 1 : 0} overflowCount={99} showZero>
                <BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              </Badge>
              <Button
                icon={<LogoutOutlined />}
                type="text"
                onClick={onLogout}
                style={{ color: '#ff4d4f' }}
              >
                Logout
              </Button>
            </Space>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      {/* Messenger Icon (Floating on the bottom right) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#1890ff',
        borderRadius: '50%',
        padding: '10px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease',
      }} 
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => setShowChat((prev) => !prev)} // Toggle chat visibility on click
      >
        <MessageOutlined style={{ fontSize: '24px', color: 'white' }} />
      </div>

      {/* Show Chat Window when the state is true */}
      {showChat && <Chat />}
    </Layout>
  );
}
