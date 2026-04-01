import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Building2, Image, IndianRupee, MapPin, ShieldCheck, Sparkles, Upload } from 'lucide-react';

import api from '../utils/api';
import { getAllStates, getAreasByCity, getCitiesByState } from '../utils/locations';
import { Button } from '../new-src/app/components/ui/button';
import { Input } from '../new-src/app/components/ui/input';
import { Label } from '../new-src/app/components/ui/label';
import { Textarea } from '../new-src/app/components/ui/textarea';

const INITIAL_FORM_DATA = {
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
};

const SECTION_CARD_CLASS = 'rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8';
const FIELD_CLASS = 'h-11 rounded-xl border-slate-200 bg-white shadow-none';
const SELECT_CLASS = 'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-none focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50';

export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stateOptions = useMemo(() => getAllStates(), []);
  const availableCities = useMemo(
    () => (formData.state ? getCitiesByState(formData.state) : []),
    [formData.state]
  );
  const availableAreas = useMemo(
    () => (formData.city ? getAreasByCity(formData.city) : []),
    [formData.city]
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const state = event.target.value;
    setFormData((current) => ({
      ...current,
      state,
      city: '',
      area: '',
    }));
    setError('');
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setFormData((current) => ({
      ...current,
      city,
      area: '',
    }));
    setError('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    setSelectedFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'amenities' && value) {
          payload.append(key, value);
        }
      });

      if (formData.amenities.trim()) {
        payload.append('amenities', formData.amenities);
      }

      selectedFiles.forEach((file) => {
        payload.append('imageFiles', file);
      });

      const response = await api.post('/listings', payload);
      const createdListingId = response.data?._id || response.data?.id;

      if (!createdListingId) {
        throw new Error('Invalid response from server');
      }

      navigate(`/listings/${createdListingId}`);
    } catch (submissionError: any) {
      console.error('Error creating listing:', submissionError);
      const errorDetails = submissionError.response?.data;

      if (submissionError.response?.status === 400 && errorDetails?.errors) {
        const validationErrors = errorDetails.errors.map((item: any) => item.msg).join(', ');
        setError(`Validation Error: ${validationErrors}`);
      } else {
        setError(errorDetails?.details || errorDetails?.error || submissionError.message || 'Failed to create listing');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 md:pt-24 md:pb-20">
      <Helmet>
        <title>Create Listing | Real Estate Pro</title>
      </Helmet>

      <section className="px-4 pb-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[34px] border border-slate-900/5 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_28%),linear-gradient(135deg,#020617,#111827_58%,#1e293b)] px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:px-10 md:py-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
                  <Sparkles className="h-4 w-4" />
                  Seller Studio
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  Create a listing that feels premium before anyone even opens it.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  Add the essentials, upload property images once, and publish a cleaner listing experience that matches the rest of Real Estate Pro.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <div className="space-y-4 text-sm text-slate-200">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300" />
                    <p>Buyer enquiries will use the contact details on your account, so the listing stays tidy.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Image className="mt-0.5 h-5 w-5 text-amber-300" />
                    <p>Image URLs are removed here. Upload files directly so the experience stays simple and consistent.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-amber-300" />
                    <p>State, city, and locality stay structured to support better search and map behavior later.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4">
        <div className="mx-auto max-w-6xl">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={SECTION_CARD_CLASS}>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Section 01</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Basic Information</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Start with the headline, price, and listing format buyers will see first.
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-slate-900 p-3 text-white md:flex">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Contemporary 3 BHK in Lohgaon with balcony views"
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Describe the space, building highlights, nearby conveniences, and why the listing stands out."
                    className="min-h-[140px] rounded-2xl border-slate-200 bg-white shadow-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="listingType">Listing Type <span className="text-red-500">*</span></Label>
                    <select
                      id="listingType"
                      name="listingType"
                      value={formData.listingType}
                      onChange={handleInputChange}
                      required
                      className={SELECT_CLASS}
                    >
                      <option value="SELL">Sell</option>
                      <option value="BUY">Buy</option>
                      <option value="RENT">Rent</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type <span className="text-red-500">*</span></Label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      required
                      className={SELECT_CLASS}
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

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                        className={`${FIELD_CLASS} pl-10`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className={SECTION_CARD_CLASS}
            >
              <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Section 02</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Property Details</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Capture the numbers buyers filter against most often.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Number of bedrooms"
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Number of bathrooms"
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areaSqFt">Area (sq.ft.)</Label>
                  <Input
                    id="areaSqFt"
                    name="areaSqFt"
                    type="number"
                    value={formData.areaSqFt}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="Property area"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className={SECTION_CARD_CLASS}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Section 03</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Location</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Structured location data keeps search, maps, and locality filters working properly.
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-amber-50 p-3 text-amber-600 md:flex">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address / Locality <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address, landmark, or building name"
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      required
                      className={SELECT_CLASS}
                    >
                      <option value="">Select State</option>
                      {stateOptions.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
                      required
                      disabled={!formData.state}
                      className={SELECT_CLASS}
                    >
                      <option value="">Select City</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area / Locality</Label>
                    <select
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      disabled={availableAreas.length === 0}
                      className={SELECT_CLASS}
                    >
                      <option value="">Select Area</option>
                      {availableAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="Zip code"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className={SECTION_CARD_CLASS}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Section 04</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Additional Information</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Keep the extras helpful, not noisy. Upload the images here and skip the duplicate URL step.
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-slate-900 p-3 text-white md:flex">
                  <Image className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="amenities"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="e.g. Parking, Gym, Clubhouse, Security"
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors hover:border-slate-400 hover:bg-slate-100/80">
                  <Label htmlFor="imageFiles" className="cursor-pointer">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-slate-900">Upload property images</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Add clear exterior, interior, and amenity shots. You can select multiple images at once.
                    </p>
                  </Label>
                  <Input
                    id="imageFiles"
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  {selectedFiles.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 shadow-sm">
                      <p className="font-medium text-slate-900">{selectedFiles.length} image file(s) selected</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {selectedFiles.slice(0, 3).map((file) => file.name).join(', ')}
                        {selectedFiles.length > 3 ? `, +${selectedFiles.length - 3} more` : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="h-11 rounded-xl border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800"
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
