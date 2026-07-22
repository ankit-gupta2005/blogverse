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

const COHORT_COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

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
      <div className="p-6 text-center text-gray-400">
        Loading Creator Analytics...
      </div>
    );
  }

  const pieChartData = rfmData.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg max-w-6xl mx-auto my-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-indigo-400">
          Creator & Behavioral Analytics
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Real-time view trends, reader engagement, and RFM cohort
          segmentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-sm font-medium">Total Views</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {analytics?.summary?.totalViews || 0}
          </p>
        </div>
        <div className="p-5 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-sm font-medium">Published Blogs</p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {analytics?.summary?.totalBlogs || 0}
          </p>
        </div>
        <div className="p-5 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-sm font-medium">Total Likes</p>
          <p className="text-3xl font-bold text-purple-400 mt-2">
            {analytics?.summary?.totalLikes || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">
            View Trends (Time-Series)
          </h3>
          {analytics?.chartData && analytics.chartData.length > 0 ? (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={analytics.chartData}>
                  <XAxis dataKey="_id" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dailyViews"
                    stroke="#3B82F6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-12">
              No view history recorded yet. Read some blogs to generate view logs!
            </p>
          )}
        </div>

        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">
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
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COHORT_COLORS[index % COHORT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-12">
              No user cohort data available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorAnalytics;
