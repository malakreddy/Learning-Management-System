"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { 
  BookOpen, CheckCircle2, Star, Plus, Minus, 
  Play, Users, Shield, Zap, ArrowRight, Instagram, 
  Twitter, Github, Facebook, Mail, Phone, MapPin, 
  TrendingUp, Award, LayoutDashboard, GraduationCap,
  Settings, LogOut, Search, Clock, Filter, MoreVertical,
  PlayCircle, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        setSubjects(res.data);
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const faqs = [
    { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time from your account settings. You will retain access until the end of your billing cycle." },
    { q: "Is this beginner-friendly?", a: "Absolutely! Our courses are designed to take you from absolute zero to job-ready proficiency with clear, step-by-step guidance." },
    { q: "Do I get certificates?", a: "Yes, upon successful completion of any course, you will receive a digital certificate verified by our platform." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Header / Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 glass">
        <nav className="flex items-center justify-between p-4 lg:px-12 max-w-7xl mx-auto" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-secondary p-1.5 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-black">LMS</span>
            </Link>
          </div>
          
          <div className="hidden lg:flex lg:gap-x-10">
            {['Home', 'Features', 'Pricing', 'Testimonials'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="text-lg font-bold leading-6 text-black hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 justify-end gap-x-4 items-center">
            {isAuthenticated ? (
               <Link href="/dashboard" className="text-lg font-bold text-black hover:text-primary transition-all flex items-center gap-1">
                  Dashboard <ArrowRight className="w-4 h-4" />
               </Link>
            ) : (
               <>
                <Link href="/login" className="rounded-full bg-slate-800 px-6 py-2 text-sm font-semibold text-white shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all outline-none border-none">
                  Log in
                </Link>
                <Link href="/register" className="rounded-full bg-secondary px-6 py-2 text-sm font-semibold text-white shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all outline-none border-none">
                  Sign up
                </Link>
               </>
            )}
          </div>
        </nav>
      </header>

      <main className="mesh-gradient">
        {/* 2. Premium Hero Section - Industry Refined */}
        <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden">
          {/* Subtle Dynamic Mesh Background (simulated with large blurs) */}
          <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-soft mb-10"
              >
                 <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(62,130,247,0.5)] animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Premium Engineering LMS</span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-[5.5rem] font-black text-[#1F2937] leading-[0.95] mb-10 tracking-tightest">
                Decode <br />
                <span className="text-primary">Intelligence.</span>
              </h1>
              
              <p className="text-xl text-slate-500/90 mb-12 leading-relaxed max-w-xl font-medium">
                The world's most sophisticated learning environment for forward-thinking engineers and digital visionaries.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  href="/register" 
                  className="group relative px-12 py-6 bg-primary text-white rounded-[2rem] font-black shadow-premium hover:shadow-soft hover:translate-y-[-4px] transition-all text-lg overflow-hidden flex items-center justify-center gap-3"
                >
                  <span className="relative z-10">Join Now — It's Free</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link 
                  href="#courses" 
                  className="px-12 py-6 bg-white/40 backdrop-blur-xl border border-white/60 text-[#1F2937] rounded-[2rem] font-black shadow-soft hover:bg-white/80 hover:translate-y-[-2px] transition-all text-lg flex items-center justify-center gap-3"
                >
                  Explore Features <LayoutDashboard className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="mt-20 flex items-center gap-12 border-t border-slate-200/60 pt-10">
                 <div>
                    <p className="text-3xl font-black text-[#111827]">10.2k</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global Users</p>
                 </div>
                 <div className="w-px h-12 bg-slate-200" />
                 <div>
                    <p className="text-3xl font-black text-[#111827]">98%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Success Rate</p>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative z-10 w-full aspect-square max-w-[650px] mx-auto group">
                 <div className="absolute inset-[-5%] bg-primary/20 rounded-[4rem] blur-[80px] group-hover:scale-110 transition-transform duration-[3s] pointer-events-none" />
                 <img 
                   src="/images/premium-hero-v2.png" 
                   alt="Learning Intelligence" 
                   className="w-full h-full object-contain relative z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)] animate-float-slow"
                 />
              </div>
              
              {/* Floating Realistic Badges */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] -left-10 glass p-6 rounded-[2.5rem] z-20 hidden xl:block realistic-border"
              >
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-[0_10px_20px_rgba(74,222,128,0.3)]">
                        <TrendingUp className="w-7 h-7 text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Impact Layer</p>
                        <p className="text-xl font-black text-slate-800">+124% Growth</p>
                     </div>
                  </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[10%] -right-10 glass p-6 rounded-[2.5rem] z-20 hidden xl:block realistic-border"
              >
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-[0_10px_20px_rgba(62,130,247,0.3)]">
                        <Award className="w-7 h-7 text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Recognition</p>
                        <p className="text-xl font-black text-slate-800">Elite Tier</p>
                     </div>
                  </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2.5 Course Catalog - Industry Refined */}
        <section className="py-32 relative bg-transparent" id="courses">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl text-left">
                <h2 className="text-4xl lg:text-6xl font-black text-slate-800 tracking-tightest mb-6">Mastery Modules</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">Choose from our curated collection of industry-standard masterclasses.</p>
              </div>
              <Link href="#" className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-xs hover:gap-5 transition-all">
                Full Curriculum <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-80 rounded-[3.5rem] bg-white/20 animate-pulse border border-white/20 realistic-border"></div>
                ))}
              </div>
            ) : subjects.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {subjects.map((subject, idx) => (
                  <motion.div 
                    key={subject.id}
                    variants={fadeIn}
                    className="group glass rounded-[3.5rem] p-10 hover:shadow-premium hover:-translate-y-3 transition-all duration-700 flex flex-col h-full relative border-white/40 realistic-border overflow-hidden"
                  >
                    {/* Interior Glow */}
                    <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="bg-white/60 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-primary/5 transition-all duration-500 realistic-border shadow-soft">
                        <BookOpen className="w-8 h-8 text-primary/80 group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-3xl font-black mb-4 text-slate-800 tracking-tightest group-hover:text-primary transition-colors line-clamp-2">{subject.title}</h3>
                      <p className="text-slate-500/80 mb-10 flex-1 line-clamp-3 font-medium leading-relaxed">
                        {subject.description || "Master the fundamentals and advanced concepts in this comprehensive industry course."}
                      </p>
                      <Link 
                        href={`/course/${subject.slug}`}
                        className="group/btn relative inline-flex items-center justify-center gap-4 w-full py-6 bg-[#1F2937] text-white rounded-[2.5rem] font-black shadow-premium hover:shadow-soft hover:translate-y-[-4px] transition-all text-[10px] tracking-[0.4em] uppercase"
                      >
                        <PlayCircle className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                        <span className="relative z-10">Initialize Path</span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 glass rounded-[4rem] realistic-border">
                <p className="text-slate-500 font-bold uppercase tracking-widest">No modules identified in matrix. Check back soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* 3. Features - Industry Refined */}
        <section className="py-32 relative group" id="features">
          <div className="absolute inset-0 bg-white/40 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-24">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 realistic-border">System Capabilities</div>
              <h2 className="text-4xl lg:text-7xl font-black text-slate-800 tracking-tightest mb-6">Engineered for <br /><span className="text-primary italic">Precision.</span></h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xl leading-relaxed">The architecture is designed to provide the most fluid learning experience on the planet.</p>
            </div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { title: "Neural Sync", desc: "Our intelligent engine keeps your progress synchronized across all neural branches in real-time.", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
                { title: "Elite Proof", desc: "Acquire high-precision certificates recognized by world-leading tech organizations.", icon: Shield, color: "text-orange-500", bg: "bg-orange-50" },
                { title: "Fluid Native", desc: "A hyper-responsive interface that adapts to your environment with zero latency.", icon: Smartphone, color: "text-green-500", bg: "bg-green-50" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={fadeIn}
                  className="p-12 rounded-[4rem] glass shadow-soft hover:shadow-premium transition-all duration-700 group/feat realistic-border relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-slate-100 rounded-full blur-3xl group-hover/feat:bg-primary/10 transition-colors" />
                  
                  <div className={`${feature.bg} w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-10 group-hover/feat:scale-110 group-hover/feat:rotate-12 transition-all duration-500 shadow-soft`}>
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-slate-800 tracking-tightest">{feature.title}</h3>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Your journey to mastery in three simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-12 z-0"></div>
              
              {[
                { step: "01", title: "Sign Up", desc: "Create your free account and browse our extensive library of premium courses.", icon: Plus },
                { step: "02", title: "Enroll & Learn", desc: "Choose your subject and start watching high-quality video modules immediately.", icon: Play },
                { step: "03", title: "Scale Career", desc: "Apply what you've learned and build a portfolio that stands out from the crowd.", icon: ArrowRight }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="relative z-10 flex flex-col items-center text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center text-xl font-bold mb-6 shadow-premium ring-8 ring-white">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Testimonials */}
        <section className="py-24 bg-white" id="testimonials">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
             <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">Happy Students</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Join 10,000+ students already learning on our platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: "John Doe", role: "Frontend Dev", text: "The quality of video content here is unmatched. I landed a job within 3 months of starting." },
                 { name: "Sarah Smith", role: "UI Designer", text: "Minimalist, clean, and focus-driven. Exactly what I needed to stay productive while learning." },
                 { name: "Mike Ross", role: "Fullstack Eng", text: "The cross-platform experience is flawless. I learn on my iPad during commute and PC at home." }
               ].map((t, i) => (
                 <div key={i} className="p-8 rounded-3xl border border-border bg-card shadow-soft hover:shadow-premium transition-all">
                    <div className="flex gap-1 mb-4 text-orange-400">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-foreground/80 italic mb-6">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {t.name[0]}
                       </div>
                       <div>
                          <p className="font-bold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* 6. Pricing - Industry Refined */}
        <section className="py-32 relative" id="pricing">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-24">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 realistic-border">Access Models</div>
              <h2 className="text-4xl lg:text-7xl font-black text-slate-800 tracking-tightest mb-6">Investment in <span className="text-primary italic">Intelligence.</span></h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xl leading-relaxed">Choose the tier that aligns with your professional evolution.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { title: "Standard", price: "Free", color: "bg-slate-400", features: ["Access to Core Modules", "Public Community", "Standard Credentials"] },
                 { title: "Elite Pro", price: "$29", color: "bg-primary", features: ["Full Mastery Catalog", "Priority Neural Sync", "Industry Mentorship", "Direct Repository Access"], featured: true },
                 { title: "Enterprise", price: "$149", color: "bg-slate-800", features: ["Team Infrastructure", "API Integration", "Custom Curriculum", "24/7 Priority Ops"] }
               ].map((plan, i) => (
                 <div key={i} className={`relative flex flex-col p-12 rounded-[4rem] glass transition-all duration-700 ${plan.featured ? 'ring-2 ring-primary shadow-premium -translate-y-4 realistic-border' : 'shadow-soft hover:shadow-premium realistic-border'}`}>
                    {plan.featured && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-premium">Most Evolved</span>}
                    <div className={`${plan.color} text-white px-5 py-1.5 rounded-full w-fit text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-soft`}>{plan.title}</div>
                    <div className="flex items-baseline gap-2 mb-10 text-slate-800">
                       <span className="text-5xl font-black tracking-tightest">{plan.price}</span>
                       <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Matrix Year</span>
                    </div>
                    <ul className="space-y-6 mb-12 flex-1">
                       {plan.features.map(f => (
                         <li key={f} className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                           <CheckCircle2 className="w-5 h-5 text-primary/60" /> {f}
                         </li>
                       ))}
                    </ul>
                    <button className={`w-full py-6 rounded-[2rem] font-black transition-all uppercase tracking-[0.2em] text-[10px] ${plan.featured ? 'bg-[#1F2937] text-white shadow-premium hover:shadow-soft hover:translate-y-[-4px]' : 'bg-white/60 text-slate-800 realistic-border hover:bg-white/80'}`}>
                       Initialize Access
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="py-24 bg-white" id="faq">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">FAQ</h2>
              <p className="text-muted-foreground text-lg">Common questions about our platform.</p>
            </div>
            <div className="space-y-4">
               {faqs.map((faq, i) => (
                 <div key={i} className="border border-border rounded-2xl overflow-hidden bg-card">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/5 transition-colors"
                    >
                       <span className="font-bold">{faq.q}</span>
                       {expandedFaq === i ? <Minus className="w-5 h-5 text-secondary" /> : <Plus className="w-5 h-5 text-secondary" />}
                    </button>
                    <AnimatePresence>
                       {expandedFaq === i && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed"
                         >
                            {faq.a}
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* 8. Footer */}
        <footer className="bg-[#111827] text-white py-16">
           <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
              <div className="col-span-1 md:col-span-1">
                 <div className="flex items-center gap-2 mb-6">
                   <div className="bg-secondary p-1.5 rounded-lg">
                     <BookOpen className="w-6 h-6 text-white" />
                   </div>
                   <span className="font-bold text-2xl tracking-tight">LMS</span>
                 </div>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Providing the best learning experience for modern thinkers and builders.
                 </p>
                 <div className="flex gap-4 mt-6">
                    <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                 </div>
              </div>
              
              <div>
                 <h4 className="font-bold mb-6">Company</h4>
                 <ul className="space-y-4 text-sm text-gray-400">
                    <li className="hover:text-white cursor-pointer">About Us</li>
                    <li className="hover:text-white cursor-pointer">Careers</li>
                    <li className="hover:text-white cursor-pointer">Press</li>
                    <li className="hover:text-white cursor-pointer">News</li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold mb-6">Services</h4>
                 <ul className="space-y-4 text-sm text-gray-400">
                    <li className="hover:text-white cursor-pointer">Tutorials</li>
                    <li className="hover:text-white cursor-pointer">Documentation</li>
                    <li className="hover:text-white cursor-pointer">Mentorship</li>
                    <li className="hover:text-white cursor-pointer">Enterprise</li>
                 </ul>
              </div>

              <div>
                 <h4 className="font-bold mb-6">Contact Us</h4>
                 <ul className="space-y-4 text-sm text-gray-400">
                    <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> info@example.com</li>
                    <li className="flex items-center gap-3"><Phone className="w-4 h-4" /> (555) 123-4567</li>
                    <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> 123 Learning Way, CA</li>
                 </ul>
              </div>
           </div>
           <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:row items-center justify-between text-xs text-gray-500 gap-4">
              <p>&copy; 2026 LMS Platform. All rights reserved.</p>
              <div className="flex gap-6 uppercase tracking-widest font-bold">
                 <span>Privacy Policy</span>
                 <span>Terms of Service</span>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}
