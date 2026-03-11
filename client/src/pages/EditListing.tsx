import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import api from '../utils/api';
import { Button } from '../new-src/app/components/ui/button';
import { Input } from '../new-src/app/components/ui/input';
import { Label } from '../new-src/app/components/ui/label';
import { Textarea } from '../new-src/app/components/ui/textarea';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listings/${id}`);
      const listing = response.data;

      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price?.toString() || '',
        listingType: listing.listingType || 'SELL',
        propertyType: listing.propertyType || '',
        status: listing.status || 'ACTIVE',
        bedrooms: listing.bedrooms?.toString() || '',
        bathrooms: listing.bathrooms?.toString() || '',
        areaSqFt: listing.areaSqFt?.toString() || '',
        address: listing.address || '',
        city: listing.city || '',
        state: listing.state || '',
        zipCode: listing.zipCode || '',
        amenities: Array.isArray(listing.amenities)
          ? listing.amenities.join(', ')
          : '',
      });
    } catch (error) {
      console.error('Error loading listing:', error);
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        areaSqFt: formData.areaSqFt ? parseFloat(formData.areaSqFt) : null,
        amenities: formData.amenities
          ? formData.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a)
          : [],
      };

      await api.put(`/listings/${id}`, payload);
      navigate(`/listings/${id}`);
    } catch (error: any) {
      console.error('Error updating listing:', error);
      setError(error.response?.data?.error || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center">
        <div className="text-2xl font-light text-gray-500">Loading listing...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Listing not found</h2>
        <Button onClick={() => navigate('/dashboard')} variant="default">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
      <Helmet>
        <title>Edit Listing | RealEstate Pro</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl text-black tracking-tight mb-2">Edit Listing</h1>
          <p className="text-gray-500 text-lg">Update your property listing</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Basic Information</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="listingType">Listing Type <span className="text-red-500">*</span></Label>
                <select
                  id="listingType"
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                  <option value="RENT">Rent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type <span className="text-red-500">*</span></Label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Property Type</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="CONDOMINIUM">Condominium</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="OFFICE">Office</option>
                  <option value="RETAIL">Retail</option>
                  <option value="WAREHOUSE">Warehouse</option>
                  <option value="INDUSTRIAL">Industrial</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SOLD">Sold</option>
                  <option value="RENTED">Rented</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_NEGOTIATION">Under Negotiation</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
          >
           <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Property Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaSqFt">Area (sq ft)</Label>
                <Input
                  type="number"
                  id="areaSqFt"
                  name="areaSqFt"
                  value={formData.areaSqFt}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
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
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Location</h2>

            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Additional Information</h2>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input
                type="text"
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="e.g., Parking, Gym, Swimming Pool"
                className="w-full"
              />
            </div>
          </motion.div>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/listings/${id}`)}
              className="px-8"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="px-8 bg-black text-white hover:bg-gray-800">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
