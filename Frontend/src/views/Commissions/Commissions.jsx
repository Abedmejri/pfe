import React, { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Input, Form, notification, Spin } from "antd";
import { fetchCommissions, saveCommission, deleteCommission } from "../../Services/commissionService";

export default function Commissions() {
  const [commissions, setCommissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    president: "",
    members: "",
  });
  const [editingCommission, setEditingCommission] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for fetching data and actions
  const [loadingAction, setLoadingAction] = useState(false); // Loading state for creating, editing, or deleting a commission

  useEffect(() => {
    setLoading(true);
    fetchCommissions()
      .then((data) => {
        setCommissions(data); // Use data directly returned from fetchCommissions
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        notification.error({
          message: "Error",
          description: "Failed to load commissions.",
        });
      });
  }, []);

  const handleSubmit = (values) => {
    setLoadingAction(true);
    saveCommission(values, editingCommission, commissions, setCommissions, setShowModal, setFormData, setEditingCommission)
      .then(() => {
        notification.success({
          message: editingCommission ? "Commission Updated" : "Commission Created",
          description: `The commission "${values.name}" has been successfully ${editingCommission ? "updated" : "created"}.`,
        });
        setLoadingAction(false);
      })
      .catch(() => {
        setLoadingAction(false);
        notification.error({
          message: "Error",
          description: "Failed to save the commission.",
        });
      });
  };

  const handleDelete = (id) => {
    setLoadingAction(true);
    deleteCommission(id, commissions, setCommissions)
      .then(() => {
        notification.success({
          message: "Commission Deleted",
          description: "The commission has been deleted successfully.",
        });
        setLoadingAction(false);
      })
      .catch(() => {
        setLoadingAction(false);
        notification.error({
          message: "Error",
          description: "Failed to delete the commission.",
        });
      });
  };

  const columns = [
    {
      title: "Commission Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (members) => <span>{members} members</span>,
    },
    {
      title: "President",
      dataIndex: "president",
      key: "president",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, commission) => (
        <div>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setEditingCommission(commission);
              setFormData({
                name: commission.name,
                president: commission.president,
                members: commission.members,
              });
              setShowModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(commission.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Commissions</h1>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            setEditingCommission(null);
            setFormData({ name: "", president: "", members: "" });
            setShowModal(true);
          }}
        >
          New Commission
        </Button>
      </div>

      {/* Loading animation when data is being fetched */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={commissions}
          rowKey="id"
          pagination={false}
          bordered
        />
      )}

      {/* Modal for creating/editing commission */}
      <Modal
        title={editingCommission ? "Edit Commission" : "New Commission"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          initialValues={formData}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Commission Name"
            name="name"
            rules={[{ required: true, message: "Please input the commission name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="President"
            name="president"
            rules={[{ required: true, message: "Please input the president!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Number of Members"
            name="members"
            rules={[{ required: true, message: "Please input the number of members!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={() => setShowModal(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loadingAction}>
              {editingCommission ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
