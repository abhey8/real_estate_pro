import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Button } from '../new-src/app/components/ui/button';
import { Input } from '../new-src/app/components/ui/input';
import { Label } from '../new-src/app/components/ui/label';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result && result.success) {
      navigate('/dashboard');
    } else {
      setError(result?.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
      <Helmet>
        <title>Login | RealEstate Pro</title>
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Login</h1>
          <p className="text-gray-500">Welcome back! Please login to your account.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
