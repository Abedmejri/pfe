import React, { useState } from 'react';
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Typography, Avatar, Space, Divider, Badge } from 'antd';


const { Title, Text } = Typography;

export default function UserDashboard() {
  const [meetings] = useState([
    {
      id: 1,
      title: "Commission Finance",
      date: "2024-03-20",
      time: "14:00",
      participants: ["Jean Dupont", "Marie Martin", "Pierre Bernard"]
    },
    {
      id: 2,
      title: "Commission RH",
      date: "2024-03-22",
      time: "10:00",
      participants: ["Sophie Dubois", "Lucas Petit", "Emma Grand"]
    }
  ]);

  return (
    <>
    
      

      <div className="min-h-screen p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Title level={1} style={{ marginBottom: 24 }}>
            Gestion des Commissions
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming Meetings Card */}
            <Card
              title={<Space><CalendarOutlined style={{ fontSize: 20, color: '#f5222d' }} /> Réunions à venir</Space>}
              bordered={false}
              bodyStyle={{ padding: 0 }}
              style={{ background: '#f7f7f7', borderRadius: '8px' }}
            >
              <div>
                {meetings.map(meeting => (
                  <div key={meeting.id} style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8' }}>
                    <Title level={5} style={{ marginBottom: 8 }}>{meeting.title}</Title>
                    <Space size="middle">
                      <ClockCircleOutlined style={{ color: '#f5222d' }} />
                      <Text>{meeting.date} à {meeting.time}</Text>
                    </Space>
                  </div>
                ))}
              </div>
            </Card>

            {/* Commission Members Card */}
            <Card
              title={<Space><UserOutlined style={{ fontSize: 20, color: '#722ed1' }} /> Membres des Commissions</Space>}
              bordered={false}
              bodyStyle={{ padding: 0 }}
              style={{ background: '#f7f7f7', borderRadius: '8px' }}
            >
              <div>
                {meetings[0].participants.map((participant, index) => (
                  <div key={index} style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8' }}>
                    <Space>
                      <Avatar size="small" style={{ backgroundColor: '#722ed1', color: '#fff' }}>
                        {participant.charAt(0)}
                      </Avatar>
                      <Text>{participant}</Text>
                    </Space>
                  </div>
                ))}
              </div>
            </Card>

            {/* Minutes Card */}
            <Card
              title={<Space><FileTextOutlined style={{ fontSize: 20, color: '#eb2f96' }} /> Procès-verbaux récents</Space>}
              bordered={false}
              bodyStyle={{ padding: 0 }}
              style={{ background: '#f7f7f7', borderRadius: '8px' }}
            >
              <div>
                {['PV Commission Finance', 'PV Commission RH'].map((title, index) => (
                  <div key={index} style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{title}</Text>
                      <Text type="secondary">15 Mars 2024</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
