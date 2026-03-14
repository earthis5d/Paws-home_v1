import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { supabase } from '../components/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('contacts')
      .insert([formData]);

    // Simulate success for demo
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-warm-bg min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-display font-bold text-warm-text mb-6">Get in Touch</h1>
          <p className="text-warm-muted text-lg">Have questions about adoption or want to support our mission? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 bg-primary text-white shadow-xl shadow-primary/20">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-100/60 uppercase tracking-wider mb-1">Email Us</p>
                    <p className="text-lg font-bold">hello@pawsandhome.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-100/60 uppercase tracking-wider mb-1">Call Us</p>
                    <p className="text-lg font-bold">(555) 123-4567</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-100/60 uppercase tracking-wider mb-1">Visit Us</p>
                    <p className="text-lg font-bold">123 Pet Lane, Animal City</p>
                  </div>
                </li>
              </ul>

              <div className="mt-12 pt-12 border-t border-white/10">
                <p className="text-orange-100/70 mb-4">Follow our journey:</p>
                <div className="flex gap-4">
                  {['Instagram', 'Twitter', 'Facebook'].map(social => (
                    <div key={social} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all cursor-pointer">
                      <span className="sr-only">{social}</span>
                      <div className="w-5 h-5 bg-current rounded-sm opacity-50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 md:p-12">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-warm-text mb-4">Message Sent!</h2>
                  <p className="text-warm-muted text-lg mb-8">Thank you for reaching out. Our team will get back to you as soon as possible.</p>
                  <button onClick={() => setSuccess(false)} className="btn-outline">Send Another Message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-4 py-4 bg-warm-bg border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-4 py-4 bg-warm-bg border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Subject</label>
                    <input 
                      required
                      type="text" 
                      placeholder="How can we help?"
                      className="w-full px-4 py-4 bg-warm-bg border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-warm-muted uppercase tracking-wider">Message</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="Tell us more..."
                      className="w-full px-4 py-4 bg-warm-bg border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
