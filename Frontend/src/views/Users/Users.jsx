import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { Input, Button, Table, Space, Typography, Popconfirm, Spin, Alert } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setNotification } = useStateContext();

  useEffect(() => {
    getUsers();
  }, [searchQuery]);

  const getUsers = () => {
    setLoading(true);
    axiosClient.get('/users', {
      params: { search: searchQuery }
    })
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted');
        getUsers();
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Create Date',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => (
        <Space size="middle">
          <Link className="btn-edit" to={`/users/${user.id}`}>
            <EditOutlined />
            Edit
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => onDeleteClick(user)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <DeleteOutlined />
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center", marginBottom: '20px' }}>
        <Title level={3}>Users</Title>
        <Link className="btn-add" to="/users/new">
          <Button icon={<PlusOutlined />} type="primary">
            Add New User
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <Input.Search
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={getUsers}
          enterButton={<SearchOutlined />}
          loading={loading}
          allowClear
          style={{ width: 300 }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}
