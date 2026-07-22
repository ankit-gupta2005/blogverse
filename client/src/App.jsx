import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Eye,
  FileText,
  Heart,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COHORT_COLORS = ["#6366F1", "#F59E0B", "#EF4444"];

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest">
          Fetching Analytics Engine...
        </p>
      </div>
    );
  }

  const pieChartData = rfmData.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
                Real-Time Insights
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Creator Dashboard
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Monitor growth metrics, audience reach, and user engagement cohorts.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Pipeline Active
            </span>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Views Card */}
          <div className="relative group bg-white p-7 rounded-[2rem] border border-slate-200/70 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Total Views
              </span>
              <div className="p-3.5 rounded-2xl bg-blue-50/80 text-blue-600 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {analytics?.summary?.totalViews || 0}
              </p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live
              </span>
            </div>
          </div>

          {/* Published Stories Card */}
          <div className="relative group bg-white p-7 rounded-[2rem] border border-slate-200/70 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-teal-600"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Published Stories
              </span>
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 text-emerald-600 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {analytics?.summary?.totalBlogs || 0}
              </p>
              <span className="text-xs font-bold text-slate-400">Articles</span>
            </div>
          </div>

          {/* Engagement Likes Card */}
          <div className="relative group bg-white p-7 rounded-[2rem] border border-slate-200/70 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-rose-500 to-pink-600"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Total Likes
              </span>
              <div className="p-3.5 rounded-2xl bg-rose-50/80 text-rose-500 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {analytics?.summary?.totalLikes || 0}
              </p>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                Appreciation
              </span>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Time Series Area Chart (2 Columns Wide) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200/70 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> View Traffic Trends
                </h3>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Daily time-series impression volume</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
                30-Day Window
              </span>
            </div>

            {analytics?.chartData && analytics.chartData.length > 0 ? (
              <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="_id" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E2E8F0",
                        borderRadius: "16px",
                        boxShadow: "0 20px 30px -10px rgba(0,0,0,0.08)",
                        color: "#0F172A",
                        padding: "12px 16px",
                        fontWeight: "700"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="dailyViews"
                      stroke="#6366F1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 p-6 text-center">
                <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-slate-500 font-bold text-sm">No view history recorded yet</p>
                <p className="text-slate-400 text-xs mt-1">Read your published stories to populate this graph.</p>
              </div>
            )}
          </div>

          {/* RFM Donut Chart (1 Column Wide) */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/70 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" /> Behavioral Cohorts
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-0.5">RFM Segmentation model</p>
            </div>

            {pieChartData.length > 0 ? (
              <div className="h-[260px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      paddingAngle={6}
                    >
                      {pieChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COHORT_COLORS[index % COHORT_COLORS.length]}
                          cornerRadius={8}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E2E8F0",
                        borderRadius: "14px",
                        boxShadow: "0 15px 25px -10px rgba(0,0,0,0.08)",
                        fontWeight: "700"
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 p-6 text-center">
                <Users className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-slate-500 font-bold text-sm">No cohort data yet</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CreatorAnalytics;
