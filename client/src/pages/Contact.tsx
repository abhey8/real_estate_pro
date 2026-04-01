import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Clock3, ExternalLink, Mail, MapPin, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { Button } from '../new-src/app/components/ui/button';
import { Input } from '../new-src/app/components/ui/input';
import { Textarea } from '../new-src/app/components/ui/textarea';
import { Label } from '../new-src/app/components/ui/label';
import { buildOsmEmbedUrl } from '../utils/locationMap';

const OFFICE_COORDINATES: [number, number] = [18.5957701, 73.9245544];
const OFFICE_QUERY = 'Yawspace Boys Hostel near Revel Orchard Lohgaon Pune Maharashtra';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const officeMapUrl = useMemo(() => buildOsmEmbedUrl(OFFICE_COORDINATES, 0.012), []);
  const googleMapsUrl = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_QUERY)}`,
    []
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    window.setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-24">
      <Helmet>
        <title>Contact Us | Real Estate Pro</title>
      </Helmet>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[34px] border border-slate-900/5 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),linear-gradient(135deg,#020617,#111827_58%,#1e293b)] px-6 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.15)] md:px-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
                  <Mail className="h-4 w-4" />
                  Contact Real Estate Pro
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">Let’s make property decisions feel easier and more personal.</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  Reach out for listing help, buyer support, or product questions. The contact experience now points to Pune instead of placeholder demo locations.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <div className="space-y-4 text-sm text-slate-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-amber-300" />
                    <p>Office map centered on Lohgaon, near Revel Orchard, so the page now reflects your actual working base.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 text-amber-300" />
                    <p>Support hours are aligned to India time to feel consistent with the rest of the experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Contact Information</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Use the channel that fits the conversation. For property-specific questions, linking the listing title in your message helps us reply faster.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Email</h3>
                      <p className="mt-1 text-slate-600">contact@realestatepro.com</p>
                      <p className="mt-1 text-sm text-slate-400">Best for enquiries, support, and callback requests.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Office</h3>
                      <p className="mt-1 text-slate-600">Yawspace Boys Hostel, near Revel Orchard</p>
                      <p className="text-slate-600">Lohgaon, Pune, Maharashtra 411047</p>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-700"
                      >
                        Open in Google Maps
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Working Hours</h3>
                      <div className="mt-3 space-y-2 text-sm text-slate-300">
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                          <span>Monday - Friday</span>
                          <span>10:00 AM - 7:00 PM IST</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                          <span>Saturday</span>
                          <span>11:00 AM - 4:00 PM IST</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>Sunday</span>
                          <span className="text-slate-400">By appointment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-5"
          >
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Send us a Message</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Share what you need and we’ll get back to you with the right next step.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-[24px] bg-slate-50 px-6 py-16 text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-900">Message sent</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Thank you for reaching out. We’ll respond as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                        placeholder="Your name"
                        required
                        className="h-11 rounded-xl border-slate-200 bg-white shadow-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                        placeholder="Optional"
                        className="h-11 rounded-xl border-slate-200 bg-white shadow-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                      placeholder="you@example.com"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-white shadow-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                      placeholder="How can we help?"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-white shadow-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                      rows={6}
                      placeholder="Tell us more about your enquiry..."
                      required
                      className="min-h-[170px] rounded-2xl border-slate-200 bg-white shadow-none"
                    />
                  </div>

                  <Button type="submit" className="h-12 w-full rounded-xl bg-slate-900 text-base text-white hover:bg-slate-800">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="overflow-hidden rounded-[22px] border border-slate-200">
                <iframe
                  title="office-location"
                  src={officeMapUrl}
                  className="h-[420px] w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </div>
              <p className="px-3 pb-1 pt-3 text-xs leading-5 text-slate-500">
                Map pin is centered on the Lohgaon / Revel Orchard area based on available open map geocoding for your shared address.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
