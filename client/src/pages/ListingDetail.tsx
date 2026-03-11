import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Heart,
  Share2,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../new-src/app/components/ui/button';
import { MapView } from '../new-src/app/components/MapView';
import { Input } from '../new-src/app/components/ui/input';
import { Textarea } from '../new-src/app/components/ui/textarea';
import { Label } from '../new-src/app/components/ui/label';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    loadListing();
    if (isAuthenticated && localStorage.getItem('token')) {
      checkFavorite();
    }
  }, [id, isAuthenticated]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listings/${id}`);
      
      const listing = response.data;
      // Adapt listing data to match what the redesigned UI expects
      const adaptedProperty = {
        id: listing._id || listing.id,
        title: listing.title,
        location: `${listing.address}, ${listing.city}`,
        price: listing.price,
        status: listing.listingType?.toLowerCase() || 'buy',
        description: listing.description || 'No description provided.',
        // Generate array of image URLs
        images: listing.images?.length > 0 
            ? listing.images.map((img: any) => img.url) 
            : ['https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800'],
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        area: listing.areaSqFt || listing.area || listing.squareFootage || 0,
        yearBuilt: listing.yearBuilt || 2020, // default if not on backend yet
        coordinates: [listing.latitude || 37.7749, listing.longitude || -122.4194],
        features: listing.amenities?.length > 0 
            ? listing.amenities 
            : ['Central Air', 'Hardwood Floors', 'Updated Kitchen'],
        owner: listing.owner
      };

      setProperty(adaptedProperty);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get('/favorites');
      const favorites = response.data.favorites || [];
      setIsFavorite(favorites.some((f: any) => f.listingId === id || f.listing === id || f._id === id));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center">
        <div className="text-2xl font-light text-gray-500">Loading details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-4xl mb-4">Property Not Found</h1>
          <p className="text-lg opacity-60 mb-8">The property you're looking for doesn't exist.</p>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, status: string) => {
    if (status === 'rent') {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowContact(true);
    // In a real app we would post this form data to the backend here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <Helmet>
        <title>{property.title} | RealEstate Pro</title>
      </Helmet>

      {/* Back Button */}
      <div className="px-4 py-6 bg-white sticky top-16 z-40 border-b">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-gray-100"
            >
              <img
                src={property.images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
                    }`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Share2 className="w-6 h-6 text-gray-700" />
                </motion.button>
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm uppercase tracking-wider font-semibold">
                  For {property.status}
                </span>
              </div>
            </motion.div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {property.images.map((image: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ${
                    selectedImage === index ? 'ring-4 ring-black' : ''
                  }`}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  {selectedImage !== index && (
                    <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
                  )}
                </motion.button>
              ))}
              
              {/* Fill empty spots if less than 4 images */}
              {Array.from({ length: Math.max(0, 4 - property.images.length) }).map((_, idx) => (
                 <div key={`empty-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100/50" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Title and Price */}
                <div className="mb-8">
                  <h1 className="text-4xl md:text-5xl mb-4 tracking-tight">{property.title}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <span className="text-3xl md:text-4xl">
                      {formatPrice(property.price, property.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-lg opacity-60">
                    <MapPin className="w-5 h-5" />
                    <span>{property.location}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <Bed className="w-8 h-8 mb-2 opacity-60" />
                      <span className="text-2xl mb-1">{property.bedrooms}</span>
                      <span className="text-sm opacity-60">Bedrooms</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Bath className="w-8 h-8 mb-2 opacity-60" />
                      <span className="text-2xl mb-1">{property.bathrooms}</span>
                      <span className="text-sm opacity-60">Bathrooms</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Square className="w-8 h-8 mb-2 opacity-60" />
                      <span className="text-2xl mb-1">{property.area?.toLocaleString() || 0}</span>
                      <span className="text-sm opacity-60">Sq Ft</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Calendar className="w-8 h-8 mb-2 opacity-60" />
                      <span className="text-2xl mb-1">{property.yearBuilt}</span>
                      <span className="text-sm opacity-60">Year Built</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl mb-4">Description</h2>
                  <p className="text-lg opacity-70 leading-relaxed whitespace-pre-wrap">{property.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h2 className="text-2xl mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((feature: string) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div>
                  <h2 className="text-2xl mb-4">Location</h2>
                  <div className="h-[400px] rounded-2xl overflow-hidden border">
                    <MapView
                      properties={[property]}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form Wrapper */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-32"
              >
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-2xl mb-6">Interested?</h3>
                  
                  {!showContact ? (
                     <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="I'm interested in this property..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Contact Agent
                        </Button>
                      </form>
                  ) : (
                     <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="mb-3 text-green-600 font-medium flex items-center gap-2">
                           <CheckCircle className="w-5 h-5" /> Request Sent successfully!
                        </div>
                        <div className="text-sm font-semibold mt-4 mb-2">Seller Contact Info:</div>
                        <div className="text-sm mb-1"><strong>Name:</strong> {property.owner?.name || 'Seller Direct'}</div>
                        <div className="text-sm"><strong>Email:</strong> {property.owner?.email || 'N/A'}</div>
                     </div>
                  )}

                  <div className="mt-6 pt-6 border-t space-y-3">
                    <a
                      href={`tel:${property.owner?.phone || '+15551234567'}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{property.owner?.phone || '+1 (555) 123-4567'}</span>
                    </a>
                    <a
                      href={`mailto:${property.owner?.email || 'contact@luxe.com'}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>{property.owner?.email || 'contact@luxe.com'}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
