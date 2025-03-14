import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { Users, Calendar, FileText } from 'lucide-react';
import axiosClient from './axios-client';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_commissions: 0,
    upcoming_meetings: 0,
    recent_minutes: 0,
    last_added_minutes: 'N/A',
    next_meeting: 'No upcoming meetings'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get('/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Commissions",
      value: stats.total_commissions,
      icon: Users,
      change: "+2 this month",
      color: "#1890ff"
    },
    {
      title: "Upcoming Meetings",
      value: stats.upcoming_meetings,
      icon: Calendar,
      change: `Next: ${stats.next_meeting}`,
      color: "#52c41a"
    },
    {
      title: "Recent Minutes",
      value: stats.recent_minutes,
      icon: FileText,
      change: `Last added: ${stats.last_added_minutes}`,
      color: "#722ed1"
    }
  ];

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>Dashboard</h1>

      <Row gutter={16}>
        {statCards.map((stat, index) => (
          <Col span={8} key={index}>
            <Card
              title={stat.title}
              bordered={false}
              extra={<stat.icon className="icon" style={{ color: stat.color, fontSize: '24px' }} />}
              bodyStyle={{ padding: '20px' }}
              style={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            >
              <div>
                <p style={{ fontSize: '20px', fontWeight: '600' }}>{stat.value}</p>
                <p style={{ color: '#8c8c8c' }}>{stat.change}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
