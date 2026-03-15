"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus, User, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register", { email, password, name });
      setAuth(res.data.user, res.data.token);
      router.push("/");
    } catch (err: any) {
      const errMsg = err.response?.data?.error;
      if (Array.isArray(errMsg)) {
        setError(errMsg[0]?.message || "Invalid input");
      } else {
        setError(errMsg || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Sky Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/auth-bg.png"
          alt="Sky Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top Left Branding */}
      <div className="absolute top-8 left-8 z-10 hidden md:flex items-center gap-2">
        <div className="bg-secondary p-1.5 rounded-lg shadow-soft">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-[#111827]">LMS</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[750px] overflow-hidden"
      >
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle light arc at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white/60 rounded-2xl border border-white/40 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <UserPlus className="w-8 h-8 text-[#111827]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#111827] mb-3">Sign up with email</h1>
            <p className="text-gray-600 font-medium">Create your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/60 border border-white/40 rounded-full py-4 pl-14 pr-6 text-[#111827] placeholder:text-gray-400 outline-none focus:bg-white/80 focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="new-password"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/60 border border-white/40 rounded-full py-4 pl-14 pr-6 text-[#111827] placeholder:text-gray-400 outline-none focus:bg-white/80 focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/60 border border-white/40 rounded-full py-4 pl-14 pr-14 text-[#111827] placeholder:text-gray-400 outline-none focus:bg-white/80 focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 text-center font-bold"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#111827] text-white rounded-full py-4 px-6 font-bold shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Get Started
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-600 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="font-extrabold text-[#111827] hover:underline ml-1">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
