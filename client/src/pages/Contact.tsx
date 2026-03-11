import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '../new-src/app/components/ui/button';
import { Input } from '../new-src/app/components/ui/input';
import { Textarea } from '../new-src/app/components/ui/textarea';
import { Label } from '../new-src/app/components/ui/label';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate contact form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <Helmet>
        <title>Contact Us | RealEstate Pro</title>
      </Helmet>
      
      {/* Header */}
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl mb-4 tracking-tight">Get in Touch</h1>
            <p className="text-xl opacity-80 max-w-2xl">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl mb-8 border-b pb-4">Contact Information</h2>
              
              <div className="space-y-6 mb-12">
                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border"
                >
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Phone</h3>
                    <p className="opacity-60">+1 (555) 123-4567</p>
                    <p className="text-sm opacity-40 mt-1">Mon-Fri 9am-6pm EST</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border"
                >
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Email</h3>
                    <p className="opacity-60">contact@luxe.com</p>
                    <p className="text-sm opacity-40 mt-1">We'll respond within 24 hours</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border"
                >
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Office</h3>
                    <p className="opacity-60">123 Luxury Ave, Suite 100</p>
                    <p className="opacity-60">Beverly Hills, CA 90210</p>
                  </div>
                </motion.div>
              </div>

              {/* Working Hours */}
              <div className="bg-black text-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl mb-6">Working Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="opacity-80">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="opacity-80">Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-80">Sunday</span>
                    <span className="opacity-60">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white border rounded-2xl p-8 shadow-xl">
                <h2 className="text-3xl mb-6 border-b pb-4">Send us a Message</h2>
                
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-2xl mb-2">Message Sent!</h3>
                    <p className="text-center opacity-60">
                      Thank you for contacting us. We'll get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        required
                        className="w-full"
                      />
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-[400px] rounded-2xl border overflow-hidden shadow-lg p-2 bg-white"
          >
            <iframe
              title="office-location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-118.40860366821291%2C34.069152527330265%2C-118.39215278625489%2C34.078034863536854&layer=mapnik&marker=34.073593822097546%2C-118.40037822723389"
              className="w-full h-full rounded-xl"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
