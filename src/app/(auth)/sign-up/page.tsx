'use client';
import React, { useState } from 'react';
import { User, Mail, Lock, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useSignupMutation } from '@/store/api/authApi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Basic validation
    if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
    } else if (name === 'password' && value.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else if (name === 'confirmPassword' && value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await signup({ email: formData.email, password: formData.password, name: formData.username }).unwrap();
      if (res.success) {
        toast.success(res.message || 'Signup successful! Please log in.');
        router.push('/login');
      } else {
        toast.error(res.message || 'Signup failed.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen border flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-white relative overflow-hidden">
      {/* Decorative cannabis leaf watermark */}
      <Leaf className="absolute -left-20 -bottom-20 w-96 h-96 text-indigo-200/80" />
      <Leaf className="absolute -right-20 -top-20 w-96 h-96 text-purple-900/20 transform rotate-45" />
      
      {/* Signup Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          {/* Logo and Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Join AI Budtender
            </h1>
            <p className="text-slate-600">Create your account to get personalized cannabis recommendations</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-xl bg-white/70 border ${errors.username ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-xl bg-white/70 border ${errors.email ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-xl bg-white/70 border ${errors.password ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-xl bg-white/70 border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}