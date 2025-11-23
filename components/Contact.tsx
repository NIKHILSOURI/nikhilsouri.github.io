import React, { useState } from 'react';
import { Layout } from './Layout';
import { SOCIAL_LINKS } from '../constants';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Contact = () => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const encodeURIComponentSafe = (str: string): string => {
      return encodeURIComponent(str).replace(/'/g, '%27').replace(/"/g, '%22');
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
              setSubmitStatus('error');
              setIsSubmitting(false);
              return;
          }

          // Encode the email content properly
          const subject = encodeURIComponentSafe(`Portfolio Inquiry from ${formData.name}`);
          const body = encodeURIComponentSafe(
              `Name: ${formData.name}\n\n` +
              `Email: ${formData.email}\n\n` +
              `Message:\n${formData.message}`
          );

          // Create mailto link
          const mailtoLink = `mailto:${SOCIAL_LINKS.email.replace('mailto:', '')}?subject=${subject}&body=${body}`;
          
          // Open email client
          window.location.href = mailtoLink;
          
          // Show success message
          setSubmitStatus('success');
          
          // Reset form after a delay
          setTimeout(() => {
              setFormData({ name: '', email: '', message: '' });
              setSubmitStatus('idle');
          }, 3000);
      } catch (error) {
          setSubmitStatus('error');
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
      if (submitStatus !== 'idle') {
          setSubmitStatus('idle');
      }
  };

  return (
    <Layout title="Communicate" subtitle="Establish Connection">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <h3 className="text-2xl font-orbitron text-white mb-6">Transmission Channels</h3>
          <div className="space-y-6">
            <ContactCard 
                icon={Mail} 
                label="Email" 
                value="mymedia.yns@gmail.com" 
                href={SOCIAL_LINKS.email}
            />
            <ContactCard 
                icon={Phone} 
                label="Phone" 
                value="+91 85199 80985" 
                href={SOCIAL_LINKS.phone}
            />
            <ContactCard 
                icon={MapPin} 
                label="Base of Operations" 
                value="Karlskrona, Sweden" 
            />
          </div>

          <div className="mt-12 p-6 border border-cyan-500/30 rounded-xl bg-cyan-500/5 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-shadow">
            <p className="text-cyan-400 font-rajdhani">
              "Open to opportunities in Backend Engineering, DevOps, and Cloud Infrastructure. Ready to deploy."
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative group hover:border-cyan-500/30 transition-colors">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 opacity-50"></div>

            <h3 className="text-xl font-orbitron text-white mb-6 flex items-center gap-2">
                <Send size={20} className="text-cyan-500" /> Send Message
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-bold">Identity</label>
                    <input 
                        type="text" 
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/20 rounded p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-rajdhani focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]" 
                        placeholder="Name" 
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-bold">Coordinates</label>
                    <input 
                        type="email" 
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/20 rounded p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-rajdhani focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]" 
                        placeholder="Email" 
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-bold">Payload</label>
                    <textarea 
                        id="message"
                        rows={4} 
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/20 rounded p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-rajdhani focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]" 
                        placeholder="Message..." 
                        required
                    ></textarea>
                </div>
                <AnimatePresence mode="wait">
                    {submitStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400 text-sm"
                        >
                            <CheckCircle size={18} />
                            <span>Message prepared! Your email client should open shortly.</span>
                        </motion.div>
                    )}
                    {submitStatus === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm"
                        >
                            <AlertCircle size={18} />
                            <span>Please check your email address and try again.</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-cyan-600/80 hover:bg-cyan-500 disabled:bg-cyan-600/40 disabled:cursor-not-allowed text-white font-orbitron font-bold py-3 rounded uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Transmit
                        </>
                    )}
                </button>
            </form>
        </div>
      </div>
    </Layout>
  );
};

const ContactCard = ({ icon: Icon, label, value, href }: any) => (
    <motion.a 
        href={href}
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className={`flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-black/20 hover:bg-white/5 transition-all duration-300 group ${href ? 'cursor-pointer' : 'cursor-default'}`}
    >
        <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-400 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold group-hover:text-slate-400">{label}</p>
            <p className="text-lg text-white font-rajdhani font-medium group-hover:text-cyan-100">{value}</p>
        </div>
    </motion.a>
);
