import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2, MapPin } from 'lucide-react';
import api from '../utils/api';
import { Button } from '../new-src/app/components/ui/button';
import { Input } from '../new-src/app/components/ui/input';
import { Label } from '../new-src/app/components/ui/label';
import { Textarea } from '../new-src/app/components/ui/textarea';

export default function LoanApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const listing = location.state?.listing;

  const [formData, setFormData] = useState({
    listingId: listing?._id || listing?.id || '',
    loanAmount: listing ? (listing.price * 0.8).toFixed(0) : '',
    tenure: '240',
    purpose: 'Home Purchase',
    employment: 'Salaried',
    annualIncome: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    try {
      await api.post('/loans/apply', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Error applying for loan:', error);
      setError(error.response?.data?.error || 'Failed to apply for loan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Application Submitted!</h2>
          <p className="text-gray-500 mb-2">
            Your loan application has been submitted successfully. We will review it and get back to you soon.
          </p>
          <p className="text-sm font-medium text-gray-900 mt-6">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
      <Helmet>
        <title>Apply for Loan | RealEstate Pro</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl text-black tracking-tight mb-2">Apply for Home Loan</h1>
          <p className="text-gray-500 text-lg">Fill in your details to apply for a property loan</p>
        </div>

        {listing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center gap-6 mb-8"
          >
            <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              <img 
                src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800'} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{listing.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4" />
                {listing.city}, {listing.state}
              </p>
              <div className="text-xl font-bold text-black tracking-tight">
                {listing.currency === 'USD' ? '$' : listing.currency}{listing.price?.toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Loan Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (₹) <span className="text-red-500">*</span></Label>
                <Input
                  type="number"
                  id="loanAmount"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1000"
                  placeholder="Loan amount"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Loan Tenure (Months) <span className="text-red-500">*</span></Label>
                <select
                  id="tenure"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="60">5 Years (60 months)</option>
                  <option value="120">10 Years (120 months)</option>
                  <option value="180">15 Years (180 months)</option>
                  <option value="240">20 Years (240 months)</option>
                  <option value="300">25 Years (300 months)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Loan Purpose <span className="text-red-500">*</span></Label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Home Purchase">Home Purchase</option>
                  <option value="Home Construction">Home Construction</option>
                  <option value="Home Improvement">Home Improvement</option>
                  <option value="Property Investment">Property Investment</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment">Employment Type <span className="text-red-500">*</span></Label>
                <select
                  id="employment"
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Salaried">Salaried</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Business">Business</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income (₹) <span className="text-red-500">*</span></Label>
                <Input
                  type="number"
                  id="annualIncome"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  required
                  min="0"
                  step="10000"
                  placeholder="Annual income"
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Personal Information</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter your complete address"
                className="w-full"
              />
            </div>
          </motion.div>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-8"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-8 bg-black text-white hover:bg-gray-800">
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
