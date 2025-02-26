import React, { useEffect, useState } from 'react';
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
      color: "bg-blue-500"
    },
    {
      title: "Upcoming Meetings",
      value: stats.upcoming_meetings,
      icon: Calendar,
      change: `Next: ${stats.next_meeting}`,
      color: "bg-green-500"
    },
    {
      title: "Recent Minutes",
      value: stats.recent_minutes,
      icon: FileText,
      change: `Last added: ${stats.last_added_minutes}`,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
