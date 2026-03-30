import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import api from '../utils/api';
import { getAllStates, getCitiesByState, getAreasByCity } from '../utils/locations';
import { Button } from '../new-src/app/components/ui/button';
import { Input } from '../new-src/app/components/ui/input';
import { Label } from '../new-src/app/components/ui/label';
import { Textarea } from '../new-src/app/components/ui/textarea';

export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    listingType: 'SELL',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    areaSqFt: '',
    address: '',
    city: '',
    state: '',
    area: '',
    country: 'India',
    zipCode: '',
    amenities: '',
    images: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    if (selectedState) {
      const cities = getCitiesByState(selectedState);
      setAvailableCities(cities);
      setFormData(prev => ({ ...prev, state: selectedState, city: '', area: '' }));
    }
  }, [selectedState]);

  useEffect(() => {
    if (formData && formData.city) {
      const areas = getAreasByCity(formData.city);
      setAvailableAreas(areas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.city]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    setFormData({ ...formData, state, city: '', area: '' });
    setAvailableCities(getCitiesByState(state));
    setAvailableAreas([]);
  };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'amenities') {
          formDataToSend.append(key, (formData as any)[key]);
        }
      });

      if (formData.amenities) {
        formDataToSend.append('amenities', formData.amenities);
      }

      if (formData.images) {
        formDataToSend.append('images', formData.images);
      }

      selectedFiles.forEach(file => {
        formDataToSend.append('imageFiles', file);
      });

      const response = await api.post('/listings', formDataToSend);

      if (response.data && response.data._id) {
        alert('Listing created successfully!');
        navigate(`/listings/${response.data._id}`);
      } else if (response.data && response.data.id) {
        navigate(`/listings/${response.data.id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error creating listing:', error);
      const errorDetails = error.response?.data;

      if (error.response?.status === 400 && errorDetails?.errors) {
        const validationErrors = errorDetails.errors.map((err: any) => err.msg).join(', ');
        setError(`Validation Error: ${validationErrors}`);
      } else {
        const errorMessage = errorDetails?.details || errorDetails?.error || error.message || 'Failed to create listing';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-50">
      <Helmet>
        <title>Create Listing | Real Estate Pro</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl text-black tracking-tight mb-2">Create New Listing</h1>
          <p className="text-gray-500 text-lg">Add a new property listing to your portfolio</p>
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
                placeholder="e.g., Beautiful 3 BHK Apartment in Downtown"
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
                placeholder="Describe your property..."
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <optgroup label="Residential">
                    <option value="APARTMENT">Apartment / Flat</option>
                    <option value="HOUSE">Independent House</option>
                    <option value="VILLA">Villa</option>
                    <option value="CONDOMINIUM">Condominium</option>
                    <option value="TOWNHOUSE">Townhouse</option>
                    <option value="LAND">Residential Plot / Land</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="STUDIO">Studio Apartment</option>
                    <option value="FARMHOUSE">Farmhouse</option>
                  </optgroup>
                  <optgroup label="Commercial">
                    <option value="COMMERCIAL">Commercial Property</option>
                    <option value="OFFICE">Office Space</option>
                    <option value="RETAIL">Retail Shop / Showroom</option>
                    <option value="WAREHOUSE">Warehouse / Godown</option>
                    <option value="INDUSTRIAL">Industrial Property</option>
                    <option value="HOTEL">Hotel / Restaurant</option>
                    <option value="MALL">Shopping Mall</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="AGRICULTURAL">Agricultural Land</option>
                    <option value="PLOT">Plot / Site</option>
                    <option value="OTHER">Other</option>
                  </optgroup>
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
                placeholder="Enter price"
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
                  placeholder="Number of bedrooms"
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
                  placeholder="Number of bathrooms"
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
                  placeholder="Property area"
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
              <Label htmlFor="address">Address / Locality <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Street address or locality name"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select State</option>
                  {getAllStates().map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!selectedState}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area / Locality</Label>
                <select
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  disabled={availableAreas.length === 0}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Area</option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Zip code"
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
                placeholder="e.g., Parking, Gym, Swimming Pool, Security"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <Textarea
                id="images"
                name="images"
                value={formData.images}
                onChange={handleChange}
                rows={4}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="w-full"
              />
            </div>

            <div className="space-y-2 border-dashed border-2 p-6 rounded-lg border-gray-300 text-center hover:bg-gray-50 transition-colors">
              <Label htmlFor="imageFiles" className="cursor-pointer block">
                <div className="font-semibold text-gray-700">Upload Images (Max 5)</div>
                <div className="text-sm text-gray-500 mt-1">Click to select files from your computer</div>
              </Label>
              <Input
                type="file"
                id="imageFiles"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              {selectedFiles.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  {selectedFiles.length} file(s) selected
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="px-8"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-8 bg-black text-white hover:bg-gray-800">
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
