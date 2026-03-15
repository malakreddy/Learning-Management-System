"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { 
  BookOpen, LogOut, Clock, Award, 
  TrendingUp, Search, Filter, PlayCircle,
  MoreVertical, LayoutDashboard, Settings,
  GraduationCap, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string;
}

interface Enrollment {
  id: string;
  subject_id: string;
  subject: Subject;
  progress: number;
  totalVideos: number;
  completedVideos: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get("/enrollments");
        setEnrollments(res.data);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const totalCompletedLessons = enrollments.reduce((acc, curr) => acc + Number(curr.completedVideos || 0), 0);

  return (
    <div className="min-h-screen mesh-gradient flex font-sans selection:bg-primary/20 text-slate-900">
      {/* 1. Sidebar - Glassmorphism 2.0 */}
      <aside className="hidden lg:flex w-80 flex-col bg-white/40 backdrop-blur-2xl border-r border-white/40 h-screen sticky top-0 p-8 z-50">
        <div className="flex items-center gap-4 mb-14">
          <div className="bg-primary p-3 rounded-[1.25rem] shadow-[0_10px_20px_rgba(62,130,247,0.3)]">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tightest text-slate-800">KODNEST</span>
        </div>

        <nav className="flex-1 space-y-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-4">Architecture</p>
           {[
             { label: 'Overview', icon: LayoutDashboard, href: '/dashboard', active: true },
             { label: 'Learning Path', icon: GraduationCap, href: '/dashboard' },
             { label: 'Certificates', icon: Award, href: '#' },
             { label: 'System Logs', icon: Clock, href: '#' },
           ].map((item) => (
             <Link 
               key={item.label} 
               href={item.href}
               className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  item.active 
                  ? 'bg-primary text-white shadow-premium font-black' 
                  : 'text-slate-500 hover:bg-white/60 hover:text-primary realistic-border'
               }`}
             >
               <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
               <span className="text-xs uppercase tracking-widest">{item.label}</span>
               {item.active && (
                 <motion.div 
                   layoutId="side-nav-glow"
                   className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" 
                 />
               )}
             </Link>
           ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-200/60 space-y-4">
           <Link href="#" className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-white/60 transition-all realistic-border">
              <Settings className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
           </Link>
           <button 
             onClick={logout}
             className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all w-full"
           >
             <LogOut className="w-5 h-5" />
             <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* 2. Main content area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto relative">
        {/* Integrated Sophisticated Background Asset */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-40">
           <img 
             src="/images/dashboard-bg-v2.png" 
             className="w-full h-full object-cover mix-blend-multiply" 
             alt=""
           />
        </div>

        <div className="max-w-7xl mx-auto p-8 lg:p-12 relative z-10">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
             >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-green-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 realistic-border">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                   Neural Sync: Active
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-black tracking-tightest mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
                   {getTimeGreeting()}, <span className="text-black">{user?.name?.split(' ')[0] || 'Learner'}</span>
                </h1>
                <p className="text-slate-500 font-medium text-xl">System online. What intelligence shall we decode today?</p>
             </motion.div>

             <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative group flex-1 md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                   <input 
                      type="text" 
                      placeholder="Identify knowledge..." 
                      className="w-full pl-14 pr-8 py-5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-soft text-sm font-medium"
                   />
                </div>
                <button className="p-5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] shadow-soft hover:bg-primary/5 transition-all realistic-border">
                   <Filter className="w-5 h-5 text-slate-400" />
                </button>
             </div>
          </header>

          {/* Stats Section - High Precision Engineering */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 text-slate-800">
              {[
                { label: 'Active Modules', value: enrollments.length, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'Nodes Completed', value: totalCompletedLessons, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-emerald-500/10' },
                { label: 'Neural Points', value: (totalCompletedLessons * 50).toLocaleString(), icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 1 }}
                  className="group relative glass p-10 rounded-[3rem] border-white/40 hover:translate-y-[-8px] transition-all duration-500 realistic-border overflow-hidden"
                >
                   {/* Background Glow */}
                   <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-700" />
                   
                   <div className="flex flex-col gap-8 relative z-10">
                      <div className={`${stat.bg} w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-soft`}>
                         <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                      <div>
                         <p className="text-4xl font-black mb-2 tracking-tightest">{stat.value}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
                      </div>
                   </div>
                </motion.div>
              ))}
          </div>

          {/* Main Path Section */}
          <section className="relative">
            <header className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tightest">Intelligence Matrix</h2>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Primary Learning Path</p>
               </div>
               <Link href="/" className="px-8 py-3.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary/5 transition-all shadow-soft flex items-center gap-3 realistic-border">
                  Expand Access <GraduationCap className="w-5 h-5" />
               </Link>
            </header>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {[1,2,3].map(i => (
                     <div key={i} className="h-72 rounded-[3.5rem] bg-white/20 animate-pulse border border-white/20"></div>
                 ))}
              </div>
            ) : enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrollments.map((enrollment, idx) => (
                  <motion.div 
                    key={enrollment.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="group glass rounded-[2.5rem] p-8 hover:shadow-premium transition-all duration-700 flex flex-col h-full relative border-white/40 realistic-border"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 items-center justify-center flex rounded-2xl bg-white/60 group-hover:bg-primary/5 transition-all duration-500 relative realistic-border shadow-soft">
                          <BookOpen className="h-8 w-8 text-slate-600 group-hover:text-primary transition-colors" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="min-w-0">
                           <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-primary transition-all line-clamp-1">{enrollment.subject.title}</h3>
                           <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/60 px-2.5 py-1 rounded-lg border border-white/40 shadow-sm">
                                 <PlayCircle className="w-3.5 h-3.5 text-primary" /> {enrollment.totalVideos} {enrollment.totalVideos === 1 ? 'Node' : 'Nodes'}
                              </span>
                              <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest">Premium</span>
                           </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 shrink-0">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mb-10 flex-1">
                       <div className="flex items-center justify-between text-[9px] font-bold mb-3 uppercase tracking-widest">
                          <span className="text-slate-400">Knowledge Integration</span>
                          <span className="text-primary">{enrollment.progress}%</span>
                       </div>
                       <div className="h-2.5 w-full bg-slate-200/40 rounded-full relative realistic-border shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${enrollment.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full relative shadow-[0_0_15px_rgba(62,130,247,0.3)]"
                          >
                             {/* Floating Mastery Indicator */}
                             {enrollment.progress > 0 && (
                                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-premium border-[3px] border-primary z-10" />
                             )}
                          </motion.div>
                       </div>
                    </div>
 
                    <Link 
                      href={`/course/${enrollment.subject.slug}`}
                      className="group/btn relative inline-flex items-center justify-center gap-3 w-full py-5 bg-[#1F2937] text-white rounded-2xl font-black shadow-premium hover:shadow-soft hover:translate-y-[-4px] transition-all text-[10px] tracking-[0.3em] uppercase"
                    >
                      <PlayCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      <span className="relative z-10">{enrollment.progress > 0 ? "Resume Module" : "Initialize Path"}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 px-12 glass rounded-[4rem] realistic-border"
              >
                  <div className="relative z-10">
                     <div className="w-full max-w-md mx-auto mb-14 drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] animate-float-slow">
                         <img 
                           src="/images/premium-empty.png" 
                           alt="System Empty" 
                           className="w-full h-auto opacity-90" 
                         />
                     </div>
                     <h3 className="text-4xl font-black text-slate-800 mb-6 tracking-tightest">Your Neural Web is Empty</h3>
                     <p className="text-slate-500 mb-16 max-w-lg mx-auto text-xl leading-relaxed font-medium">
                       The architecture is ready. Initialize your first module to begin the decoding process.
                     </p>
                     <Link 
                         href="/" 
                         className="inline-flex items-center justify-center rounded-[2.5rem] bg-[#1F2937] px-16 py-6 text-[10px] font-black text-white shadow-premium hover:shadow-soft hover:translate-y-[-4px] transition-all uppercase tracking-[0.4em]"
                     >
                         Browse Knowledge Base
                     </Link>
                  </div>
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
