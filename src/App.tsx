import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  ChevronRight, 
  Sparkles, 
  Stethoscope, 
  HeartPulse,
  Award,
  CheckCircle2,
  MessageSquare,
  Mic,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChatBot from '@/src/components/ChatBot';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20">
      <Toaster position="top-center" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-accent rounded-md flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight text-primary">
                Dental Studio
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Masaki, Dar es Salaam
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#services" className="hover:text-accent transition-colors">Services</a>
            <a href="#assistant" className="hover:text-accent transition-colors">AI Assistant</a>
            <a href="#location" className="hover:text-accent transition-colors">Location</a>
            <div className="status-badge-active">
              <div className="status-dot-active"></div>
              LISA AI • ACTIVE
            </div>
            <Button 
              onClick={() => setIsChatOpen(true)}
              className="bg-accent hover:bg-accent/90 text-white rounded-md px-6 h-10 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat with Lisa
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-primary mb-8 tracking-tight">
              Modern Dental Care <br />
              <span className="text-accent">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              Experience world-class dental care at Dental Studio. Led by British-trained Dr. Abbas Haji, we combine modern technology with compassionate care in the heart of Masaki.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={() => setIsChatOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white rounded-md px-8 h-12 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Talk to Lisa
              </Button>
              <Button size="lg" variant="outline" className="border-border text-primary hover:bg-slate-50 rounded-md px-8 h-12 text-sm font-bold uppercase tracking-widest">
                View Services
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[16/10] rounded-xl overflow-hidden border border-border shadow-sm">
              <img 
                src="https://picsum.photos/seed/dental-minimal/1200/800" 
                alt="Modern Dental Studio" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Assistant Section */}
      <section id="assistant" className="py-24 px-6 bg-slate-50 border-y border-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-xl max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl">
                  👩‍⚕️
                </div>
                <div>
                  <h3 className="font-bold text-lg">Meet Lisa</h3>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Your AI Receptionist</p>
                </div>
                <div className="ml-auto status-badge-active">
                  <div className="status-dot-active"></div>
                  ONLINE
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 italic">
                  "Hello! I'm Lisa. I can help you book an appointment, answer questions about our British dental standards, or handle emergencies."
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-border rounded-lg text-center">
                    <Calendar className="h-4 w-4 mx-auto mb-2 text-accent" />
                    <p className="text-[10px] font-bold uppercase text-slate-400">Booking</p>
                  </div>
                  <div className="p-3 border border-border rounded-lg text-center">
                    <Mic className="h-4 w-4 mx-auto mb-2 text-accent" />
                    <p className="text-[10px] font-bold uppercase text-slate-400">Voice AI</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest py-6"
              >
                Start Conversation
              </Button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">24/7 Assistance</p>
            <h2 className="text-4xl font-bold text-primary mb-6 tracking-tight">Your Virtual Concierge</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Lisa is our state-of-the-art AI assistant trained to provide the same high standard of care you expect from our clinical team.
            </p>
            <ul className="space-y-4">
              {[
                "Instant appointment scheduling",
                "Emergency triage and priority routing",
                "Detailed information on all dental services",
                "Available 24/7 via text or real-time voice"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Our Expertise</p>
            <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">Specialized Dental Services</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "General Dentistry",
                desc: "Routine cleanings, fillings, and extractions to maintain your oral health.",
                icon: <Stethoscope className="h-5 w-5" />,
                items: ["Scaling & Polishing", "White Fillings", "Extractions"]
              },
              {
                title: "Advanced Care",
                desc: "Complex procedures including implants and root canal treatments.",
                icon: <HeartPulse className="h-5 w-5" />,
                items: ["Dental Implants", "Root Canals", "Crowns & Bridges"]
              },
              {
                title: "Cosmetic Smile",
                desc: "Transform your smile with braces, aligners, and professional whitening.",
                icon: <Sparkles className="h-5 w-5" />,
                items: ["Orthodontics", "Smile Makeovers", "Teeth Whitening"]
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                className="bg-white p-8 rounded-xl border border-border shadow-sm hover:border-accent/50 transition-colors"
              >
                <div className="h-10 w-10 bg-accent/5 rounded-lg flex items-center justify-center text-accent mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{service.title}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {service.desc}
                </p>
                <ul className="space-y-3">
                  {service.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="location" className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-12 tracking-tight">Visit Our Studio</h2>
            <div className="space-y-10">
              <div className="flex gap-5">
                <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Location</p>
                  <p className="text-lg">1st Floor, Sea Cliff Village, Masaki, Dar es Salaam</p>
                </div>
              </div>
              
              <div className="flex gap-5">
                <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Operating Hours</p>
                  <p className="text-lg">Mon – Sat: 09:00 AM – 05:00 PM</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Contact</p>
                  <p className="text-lg">+255 753 601 155</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="aspect-square rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/masaki-minimal/800/800" 
              alt="Masaki Location" 
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-accent rounded flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold text-sm text-primary">
              Dental Studio
            </span>
          </div>
          
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            © 2024 Dental Studio Masaki. British Standards of Dentistry.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-accent transition-colors"><Phone className="h-4 w-4" /></a>
            <a href="#" className="text-slate-400 hover:text-accent transition-colors"><Mail className="h-4 w-4" /></a>
            <a href="#" className="text-slate-400 hover:text-accent transition-colors"><MapPin className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>

      {/* ChatBot Component */}
      <ChatBot externalOpen={isChatOpen} setExternalOpen={setIsChatOpen} />
    </div>
  );
}
