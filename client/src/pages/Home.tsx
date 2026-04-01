import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Shield, Award, Map, Sparkles, Crown, Globe } from 'lucide-react';
import { Button } from '../new-src/app/components/ui/button';
import { PropertyCard } from '../new-src/app/components/PropertyCard';
import api from '../utils/api';
import './Home.css';

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter-related states we used to have, we can use if needed later
  // We'll keep the loadListings logic for the featured properties section
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      // Fetch latest active listings for featured
      const response = await api.get('/listings?status=ACTIVE&limit=3');
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Find Your Dream Property | Real Estate Pro</title>
        <meta name="description" content="Browse premium residential and commercial properties for sale and rent. Search by location, type, and price." />
      </Helmet>

      {/* Hero Section - Monochrome Mountains */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax Effect */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center grayscale"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1521080755838-d2311117f767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vY2hyb21lJTIwbW91bnRhaW5zJTIwbGFuZHNjYXBlJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzE5NTI0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          {/* Animated overlay pattern */}
          <motion.div
            animate={{
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 text-white/90 text-sm"
          >
            <Crown className="w-4 h-4" />
            <span>Exclusive Properties for Discerning Clients</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl text-white mb-6 tracking-tighter font-light"
          >
            Elevate Your<br />
            <span className="font-normal">Living Experience</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light tracking-wide"
          >
            Curated collection of ultra-premium properties for high net worth individuals
            seeking extraordinary residences
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/properties">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 h-14 px-10 text-base">
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/map-view">
              <Button size="lg" variant="outline" className="h-14 px-10 text-base bg-transparent border-white/30 text-white hover:bg-white/10">
                <Map className="w-5 h-5 mr-2" />
                Map Search
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section - Monochrome */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$2.5B+', label: 'Portfolio Value' },
              { value: '450+', label: 'Luxury Properties' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '25+', label: 'Prime Locations' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center border-l border-white/10 first:border-l-0"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="text-4xl md:text-5xl mb-2 font-light tracking-tight"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-white/60 tracking-wider uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Features Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl mb-6 tracking-tighter font-light">
              The Real Estate Pro Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Unparalleled service and expertise in ultra-luxury real estate for the world's
              most distinguished clientele
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Globe,
                title: 'Global Portfolio',
                description: 'Access to an exclusive collection of premium properties across the world\'s most prestigious locations and sought-after neighborhoods.',
              },
              {
                icon: Shield,
                title: 'Discretion Assured',
                description: 'Complete privacy and confidentiality throughout your property journey, with white-glove service tailored to your requirements.',
              },
              {
                icon: Crown,
                title: 'Bespoke Concierge',
                description: 'Dedicated property consultants providing personalized guidance and insider market intelligence for informed decisions.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-full p-10 bg-gray-50 hover:bg-black transition-colors duration-500 rounded-none border border-gray-200 hover:border-black"
                >
                  <div className="w-16 h-16 bg-black group-hover:bg-white transition-colors duration-500 flex items-center justify-center mb-8">
                    <feature.icon className="w-8 h-8 text-white group-hover:text-black transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl mb-4 font-light tracking-tight group-hover:text-white transition-colors duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/80 leading-relaxed font-light transition-colors duration-500">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Monochrome Architecture Showcase */}
      <section className="relative py-32 px-4 bg-black text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1672331713329-65c270686b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBibGFjayUyMHdoaXRlfGVufDF8fHx8MTc3MTk1MjQxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/80 z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl mb-8 tracking-tighter font-light leading-tight">
                Architectural<br />
                Excellence<br />
                Redefined
              </h2>
              <p className="text-xl text-white/70 mb-8 font-light leading-relaxed">
                Each property in our portfolio represents the pinnacle of design, 
                craftsmanship, and innovation. Experience residences that transcend 
                ordinary luxury.
              </p>
              <Link to="/properties">
                <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 h-14 px-8">
                  View Portfolio
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-96 md:h-[500px]"
            >
              <div className="absolute inset-0 border-2 border-white/20" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-4 bg-cover bg-center grayscale"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1729040268167-b89ff6b163c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbHV4dXJ5JTIwaW50ZXJpb3IlMjBtb25vY2hyb21lfGVufDF8fHx8MTc3MTk1MjQxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-32 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
          >
            <div>
              <h2 className="text-5xl md:text-6xl mb-4 tracking-tighter font-light">
                Featured Collection
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Handpicked ultra-premium residences
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden md:flex items-center gap-2 h-12 px-6 border-2">
                View All Properties
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
             <div className="text-center py-10 text-gray-500">Loading featured properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing, index) => {
                // Adapt listing to the PropertyCard expected format (if needed)
                // PropertyCard interface expects { id, title, location, price, status, image, bedrooms, bathrooms, area }
                const propAdapter = {
                   id: listing._id || listing.id,
                   title: listing.title,
                   location: `${listing.address}, ${listing.city}`,
                   price: listing.price,
                   status: listing.listingType?.toLowerCase() || 'buy',
                   image: listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800',
                   bedrooms: listing.bedrooms || 0,
                   bathrooms: listing.bathrooms || 0,
                   area: listing.area || listing.squareFootage || 0
                } as any;
                return <PropertyCard key={propAdapter.id} property={propAdapter} index={index} />;
              })}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/properties">
              <Button variant="outline" className="w-full h-14 border-2">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Monochrome */}
      <section className="relative py-32 px-4 bg-white overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1761392676464-2d518ffa243d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMG1vZGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3NzE5NTI0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center justify-center w-20 h-20 border-2 border-black mb-8"
            >
              <Award className="w-10 h-10" />
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl mb-8 tracking-tighter font-light leading-tight">
              Begin Your Property<br />
              Journey Today
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Connect with our elite property consultants to discover exceptional 
              residences tailored to your distinguished lifestyle
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-black text-white hover:bg-gray-900 h-14 px-10 text-base">
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/map-view">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base border-2">
                  <Map className="w-5 h-5 mr-2" />
                  Explore Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
