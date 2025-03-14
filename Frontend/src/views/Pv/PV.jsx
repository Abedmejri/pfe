import React, { useState, useEffect } from 'react';
import axiosClient from '../../axios-client'; // Use pre-configured axiosClient
import { FileText, Download, Plus, Search } from 'lucide-react';
import { Button, Modal, Input, Select, Form, Table, Space, DatePicker, Spin, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment'; // Make sure to import moment for date formatting

const { Option } = Select;

export default function PV() {
  const [minutes, setMinutes] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm(); // Form instance
  const [loading, setLoading] = useState(true); // State for loading data
  const [loadingAction, setLoadingAction] = useState(false); // State for loading during create/edit actions

  useEffect(() => {
    const fetchData = async () => {
      await fetchCommissions(); // Wait for commissions to be fetched
      await fetchMinutes(); // Then fetch minutes
    };
    fetchData();
  }, []);

  // Fetch meeting minutes from Laravel API
  const fetchMinutes = async () => {
    setLoading(true); // Set loading state to true when fetching data
    try {
      const response = await axiosClient.get('/pvs');
      const minutesWithCommissionNames = response.data.map(minute => ({
        ...minute,
        commission: commissions.find(commission => commission.id === minute.commission_id)?.name || 'Unknown',
      }));
      setMinutes(minutesWithCommissionNames);
    } catch (error) {
      console.error("Error fetching meeting minutes:", error);
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  const fetchCommissions = async () => {
    try {
      const { data } = await axiosClient.get("/commissions");
      setCommissions(data);
    } catch (error) {
      console.error("Error fetching commissions:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoadingAction(true); // Set loadingAction to true while submitting
    try {
      // Find the selected commission's ID based on the selected name
      const selectedCommission = commissions.find(
        (commission) => commission.name === values.commission
      );

      if (!selectedCommission) {
        throw new Error("Selected commission not found.");
      }

      // Format the date to YYYY-MM-DD
      const formattedDate = moment(values.date).format('YYYY-MM-DD');

      // Prepare the payload with commission_id
      const payload = {
        title: values.title,
        date: formattedDate, // Use the formatted date
        commission_id: selectedCommission.id, // Send commission_id instead of commission
        content: values.content,
        attendees: values.attendees.split(",").map((a) => a.trim()),
        author: "Current User", // Replace with authenticated user if needed
        status: "Draft", // Default status
      };

      console.log("Payload being sent:", payload); // Debugging: Log the payload

      const response = await axiosClient.post("/pvs", payload);

      // Map commission_id to commission name for the new PV
      const newPV = {
        ...response.data,
        commission: selectedCommission.name, // Add commission name
      };

      setMinutes([...minutes, newPV]); // Add the new PV to the minutes state
      setShowModal(false);
      form.resetFields(); // Reset the form fields
      message.success('Meeting minutes created successfully!'); // Show success message
    } catch (error) {
      console.error("Error creating minutes:", error.response?.data || error.message);
      message.error('Failed to create meeting minutes. Please try again.'); // Show error message
    } finally {
      setLoadingAction(false); // Set loadingAction to false when submission is done
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Attendees',
      dataIndex: 'attendees',
      key: 'attendees',
      render: (attendees) => attendees.join(', '),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<FileText />} type="link">View</Button>
          <Button icon={<Download />} type="link">Download</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Meeting Minutes (PV)</h1>
        <Button
          type="primary"
          icon={<Plus />}
          onClick={() => setShowModal(true)}
          loading={loadingAction} // Show loading spinner on the button when submitting
        >
          New Minutes
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 flex items-center space-x-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search minutes..."
            style={{ width: '100%' }}
          />
        </div>

        {/* Show Spin loader while data is loading */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={minutes}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>

      <Modal
        title="Create New Minutes"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form} // Pass the form instance
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the title' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select the date' }]}>
            <DatePicker
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Commission"
            name="commission"
            rules={[{ required: true, message: 'Please select the commission' }]}>
            <Select>
              <Option value="">Select Commission</Option>
              {commissions.map((commission) => (
                <Option key={commission.id} value={commission.name}>
                  {commission.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please enter the content' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Attendees (comma-separated)"
            name="attendees"
            rules={[{ required: true, message: 'Please enter the attendees' }]}>
            <Input />
          </Form.Item>

          <div className="flex justify-end space-x-3">
            <Button type="default" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loadingAction}>
              Create
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}