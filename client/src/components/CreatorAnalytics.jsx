import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COHORT_COLORS = ["#4F46E5", "#F59E0B", "#EF4444"];

const CreatorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [rfmData, setRfmData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, rfmRes] = await Promise.all([
          api.get("/analytics/creator"),
          api.get("/analytics/rfm-cohorts"),
        ]);

        setAnalytics(analyticsRes.data);
        setRfmData(rfmRes.data.rfmCohorts || []);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">
        Loading Creator Analytics...
      </div>
    );
  }

  const pieChartData = rfmData.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] max-w-6xl mx-auto my-6 space-y-8">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">
          Performance Dashboard
        </p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Creator & Behavioral Analytics
        </h2>
        <p className="text-slate-400 text-xs font-semibold mt-1">
          Real-time view trends, reader engagement metrics, and RFM cohort segmentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Views</p>
          <p className="text-4xl font-black text-indigo-600 mt-2">
            {analytics?.summary?.totalViews || 0}
          </p>
        </div>
        <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Published Blogs</p>
          <p className="text-4xl font-black text-emerald-500 mt-2">
            {analytics?.summary?.totalBlogs || 0}
          </p>
        </div>
        <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Likes</p>
          <p className="text-4xl font-black text-purple-600 mt-2">
            {analytics?.summary?.totalLikes || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 mb-6">
            View Trends (Time-Series)
          </h3>
          {analytics?.chartData && analytics.chartData.length > 0 ? (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={analytics.chartData}>
                  <XAxis dataKey="_id" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                      color: "#0F172A",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dailyViews"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ fill: "#4F46E5", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400 text-xs font-semibold text-center py-16">
              No view history recorded yet. Read some blogs to generate view logs!
            </p>
          )}
        </div>

        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 mb-6">
            RFM User Behavioral Cohorts
          </h3>
          {pieChartData.length > 0 ? (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COHORT_COLORS[index % COHORT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                      color: "#0F172A",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400 text-xs font-semibold text-center py-16">
              No user cohort data available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorAnalytics;
