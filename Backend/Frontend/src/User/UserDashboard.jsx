import React, { useState } from 'react';
import { Calendar, Clock, FileText, Users } from 'lucide-react';
import PlanetBackground from './PlanetBackground';

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
      {/* Planet Background Component */}
      <PlanetBackground />

      <div className="min-h-screen p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-8">
            Gestion des Commissions
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming Meetings Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-black border border-white/10 shadow-lg shadow-purple-500/10">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 mr-2 text-pink-400" />
                <h2 className="text-xl font-semibold text-black">Réunions à venir</h2>
              </div>
              <div className="space-y-4">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="border-l-4 border-pink-500 pl-4">
                    <h3 className="font-medium text-black">{meeting.title}</h3>
                    <div className="flex items-center text-sm text-black">
                      <Clock className="w-4 h-4 mr-1 text-pink-400" />
                      <span>{meeting.date} à {meeting.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Members Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-black border border-white/10 shadow-lg shadow-purple-500/10">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 mr-2 text-violet-400" />
                <h2 className="text-xl font-semibold text-black">Membres des Commissions</h2>
              </div>
              <div className="space-y-2">
                {meetings[0].participants.map((participant, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                      {participant.charAt(0)}
                    </div>
                    <span className="text-black">{participant}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 text-black border border-white/10 shadow-lg shadow-purple-500/10">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 mr-2 text-fuchsia-400" />
                <h2 className="text-xl font-semibold text-black">Procès-verbaux récents</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <h3 className="font-medium text-black">PV Commission Finance</h3>
                  <p className="text-sm text-black">15 Mars 2024</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <h3 className="font-medium text-black">PV Commission RH</h3>
                  <p className="text-sm text-black">12 Mars 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
