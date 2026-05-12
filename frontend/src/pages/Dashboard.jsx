import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LayoutDashboard, TrendingUp, History, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const mockHistoryData = [
  { date: '2024-01-10', risk: 15 },
  { date: '2024-02-15', risk: 12 },
  { date: '2024-03-20', risk: 25 },
  { date: '2024-04-25', risk: 18 },
];

const mockPieData = [
  { name: 'Low Risk', value: 4 },
  { name: 'Medium Risk', value: 2 },
  { name: 'High Risk', value: 1 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || 'Guest User';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <LayoutDashboard className="text-health-500" />
          Health Analytics Dashboard
        </h1>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <User className="w-4 h-4 text-health-500" />
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Predictions" value="7" change="+2 this month" />
        <StatCard title="Average Risk Score" value="18.5%" change="-2.4% vs last" />
        <StatCard title="Health Status" value="Stable" color="text-green-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-health-500" /> Risk Trends (Last 4 Months)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="risk" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-health-500" /> Risk Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {mockPieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-slate-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6">Recent Prediction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-sm">
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Mode</th>
                <th className="pb-4 font-medium">Result</th>
                <th className="pb-4 font-medium">Score</th>
                <th className="pb-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <HistoryRow date="May 10, 2024" mode="Advanced" result="No Disease" score="12.4%" />
              <HistoryRow date="Apr 25, 2024" mode="Basic" result="Low Risk" score="18.2%" />
              <HistoryRow date="Mar 20, 2024" mode="Basic" result="Medium Risk" score="45.1%" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, color = "text-white" }) {
  return (
    <div className="glass-card p-6">
      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <div className="flex items-end gap-3">
        <p className={`text-3xl font-black ${color}`}>{value}</p>
        <p className="text-xs text-health-500 mb-1 font-medium">{change}</p>
      </div>
    </div>
  );
}

function HistoryRow({ date, mode, result, score }) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="py-4 text-slate-300">{date}</td>
      <td className="py-4 font-medium">{mode}</td>
      <td className="py-4">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${result.includes('Risk') ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
          {result}
        </span>
      </td>
      <td className="py-4 font-bold text-health-500">{score}</td>
      <td className="py-4">
        <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-white/5 transition-colors">Details</button>
      </td>
    </tr>
  );
}
