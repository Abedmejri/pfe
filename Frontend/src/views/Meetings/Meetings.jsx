import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Plus, Users, FileText, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import * as meetingService from "../../Services/meetingService";
import { Button, Modal, Form, Input, Select, DatePicker, TimePicker, Spin, notification } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMeetingId, setEditMeetingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    commission: "",
    attendees: "",
  });
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [newCommissionName, setNewCommissionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");  // For the search query

  useEffect(() => {
    fetchMeetings();
    fetchCommissions();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredMeetings(meetings);
    } else {
      setFilteredMeetings(
        meetings.filter((meeting) =>
          meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meeting.commission.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, meetings]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const data = await meetingService.fetchMeetings();
      setMeetings(data);
      setFilteredMeetings(data);  // Initially set the filtered meetings to all meetings
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissions = async () => {
    try {
      const data = await meetingService.fetchCommissions();
      setCommissions(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editMeetingId) {
        // Update existing meeting
        const data = await meetingService.updateMeeting(editMeetingId, values);
        setMeetings(meetings.map((m) => (m.id === editMeetingId ? data : m)));
      } else {
        // Create new meeting
        const data = await meetingService.createMeeting(values);
        setMeetings([...meetings, data]);
      }

      setShowModal(false);
      setFormData({ title: "", date: "", time: "", location: "", commission: "", attendees: "" });
      setEditMeetingId(null);
      notification.success({ message: "Meeting saved successfully!" });
    } catch (error) {
      console.error("Error creating/updating meeting:", error.message);
      notification.error({ message: "Failed to save meeting" });
    }
  };

  const handleEdit = (meeting) => {
    setEditMeetingId(meeting.id);
    setFormData(meeting);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await meetingService.deleteMeeting(id);
      setMeetings(meetings.filter((meeting) => meeting.id !== id));
      notification.success({ message: "Meeting deleted successfully!" });
    } catch (error) {
      console.error("Error deleting meeting:", error.message);
      notification.error({ message: "Failed to delete meeting" });
    }
  };

  const handleAddCommission = async () => {
    if (!newCommissionName) {
      notification.error({ message: "Please enter a commission name!" });
      return;
    }

    try {
      const newCommission = { name: newCommissionName };
      const data = await meetingService.createCommission(newCommission); // Assuming this API endpoint exists
      setCommissions([...commissions, data]);
      setShowCommissionModal(false);
      setNewCommissionName("");
      notification.success({ message: "Commission added successfully!" });
    } catch (error) {
      console.error("Error adding commission:", error.message);
      notification.error({ message: "Failed to add commission" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
        <Button
          type="primary"
          icon={<Plus />}
          onClick={() => {
            setShowModal(true);
            setEditMeetingId(null);
            setFormData({ title: "", date: "", time: "", location: "", commission: "", attendees: "" });
          }}
        >
          Schedule Meeting
        </Button>
      </div>

      {/* Search filter input */}
      <div className="my-4">
        <Input
          placeholder="Search by Title or Commission"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{meeting.title}</h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {meeting.status}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{format(new Date(meeting.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{meeting.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{meeting.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{meeting.commission}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>{meeting.attendees} attendees</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(meeting)}
                  type="link"
                  size="small"
                >
                  Edit
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(meeting.id)}
                  type="link"
                  size="small"
                  danger
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editMeetingId ? "Edit Meeting" : "Schedule New Meeting"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          initialValues={formData}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Meeting Title"
            name="title"
            rules={[{ required: true, message: "Please enter the meeting title!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the meeting date!" }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please select the meeting time!" }]}>
            <TimePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter the location!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Commission"
            name="commission"
            rules={[{ required: true, message: "Please select a commission!" }]}>
            <Select>
              {commissions.map((commission) => (
                <Select.Option key={commission.id} value={commission.id}>
                  {commission.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => setShowCommissionModal(true)}
            className="w-full"
          >
            Add New Commission
          </Button>
          <Form.Item
            label="Number of Attendees"
            name="attendees"
            rules={[{ required: true, message: "Please enter the number of attendees!" }]}>
            <Input type="number" />
          </Form.Item>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setShowModal(false)}
              className="bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
            >
              {editMeetingId ? "Update" : "Schedule"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal to Add Commission */}
      <Modal
        title="Add New Commission"
        visible={showCommissionModal}
        onCancel={() => setShowCommissionModal(false)}
        footer={null}
        destroyOnClose
      >
        <div>
          <Input
            placeholder="Enter Commission Name"
            value={newCommissionName}
            onChange={(e) => setNewCommissionName(e.target.value)}
          />
          <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={() => setShowCommissionModal(false)}>Cancel</Button>
            <Button type="primary" onClick={handleAddCommission}>
              Add Commission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
