import React, { useState, useEffect, useRef } from "react";
import { User, Shield, Save, Loader2, Globe, Github, Twitter, CheckCircle2, AlertCircle, Camera, Image as ImageIcon } from "lucide-react";
import { updateProfile, updatePassword } from "../services/api";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    twitter: "",
    github: "",
    website: "",
    profileImage: "",
    profileBanner: ""
  });

  const [previews, setPreviews] = useState({ profile: null, banner: null });
  const [files, setFiles] = useState({ profile: null, banner: null });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setProfileData({
      name: storedUser.name || "",
      bio: storedUser.bio || "",
      twitter: storedUser.socialLinks?.twitter || "",
      github: storedUser.socialLinks?.github || "",
      website: storedUser.socialLinks?.website || "",
      profileImage: storedUser.profileImage || "",
      profileBanner: storedUser.profileBanner || ""
    });
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "", message: "" }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("bio", profileData.bio);
      formData.append("socialLinks", JSON.stringify({
        twitter: profileData.twitter,
        github: profileData.github,
        website: profileData.website
      }));

      if (files.profile) formData.append("profileImage", files.profile);
      if (files.banner) formData.append("profileBanner", files.banner);

      const res = await updateProfile(formData);
      
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        showStatus("success", "Profile updated successfully!");
      }
    } catch (err) {
      showStatus("error", "Failed to update profile.");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showStatus("error", "New passwords don't match.");
    }
    setLoading(true);
    try {
      await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      showStatus("success", "Password updated!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showStatus("error", err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-8 selection:bg-indigo-100 mb-25 md:mb-5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8  ">
        <aside className="w-full md:w-72 space-y-2">
          <div className="px-4 mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Personal Preferences</p>
          </div>
          
          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white/60'}`}>
            <User size={18} /> Public Profile
          </button>
          
          <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white/60'}`}>
            <Shield size={18} /> Security
          </button>
        </aside>

        <main className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden ">
          {status.message && (
            <div className={`absolute top-0 left-0 w-full px-6 py-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest animate-in slide-in-from-top duration-300 z-50 ${status.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {status.message}
            </div>
          )}

          <div className={status.message ? "mt-12" : ""}>
            {activeTab === "profile" ? (
              <form onSubmit={handleProfileUpdate} className="space-y-10">
                <section>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Visual Identity</h2>
                  <div className="relative group">
                    <div onClick={() => bannerInputRef.current.click()} className="h-48 w-full rounded-3xl bg-slate-100 overflow-hidden cursor-pointer relative border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-all">
                      {previews.banner || profileData.profileBanner ? (
                        <img src={previews.banner || profileData.profileBanner} className="w-full h-full object-cover" alt="Banner" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                          <ImageIcon size={24} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Upload Banner Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="text-white" size={24} />
                      </div>
                    </div>
                    <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />

                    <div className="absolute -bottom-8 left-8 group/avatar">
                      <div onClick={(e) => { e.stopPropagation(); profileInputRef.current.click(); }} className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden cursor-pointer relative shadow-xl hover:scale-105 transition-all">
                        {previews.profile || profileData.profileImage ? (
                          <img src={previews.profile || profileData.profileImage} className="w-full h-full object-cover aspect-square" alt="Avatar" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <User size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="text-white" size={20} />
                        </div>
                      </div>
                      <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                    </div>
                  </div>
                </section>

                <section className="pt-8">
                  <div className="grid gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Display Name</label>
                      <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Bio</label>
                      <textarea rows="4" placeholder="Tell the Verse about yourself..." value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none" />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Social Network</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="Twitter URL" value={profileData.twitter} onChange={(e) => setProfileData({...profileData, twitter: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:bg-white transition-all" />
                    </div>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="text" placeholder="GitHub URL" value={profileData.github} onChange={(e) => setProfileData({...profileData, github: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:bg-white transition-all" />
                    </div>
                  </div>
                </section>

                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  Commit Changes
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-8">
                <header>
                  <h2 className="text-lg font-black text-slate-900 mb-2">Access Control</h2>
                  <p className="text-xs font-medium text-slate-400">Regularly update your keys for maximum security.</p>
                </header>
                <div className="space-y-5">
                  <input type="password" placeholder="Current Password" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all" />
                  <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all" />
                  <input type="password" placeholder="Confirm Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Change Password"}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;