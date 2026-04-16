import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Mic, Phone, MapPin, Clock, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getLisaResponse } from '@/src/lib/gemini';
import { toast } from 'sonner';
import VoiceChat from './VoiceChat';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isBooking?: boolean;
  bookingDetails?: any;
}

interface ChatBotProps {
  externalOpen?: boolean;
  setExternalOpen?: (open: boolean) => void;
}

export default function ChatBot({ externalOpen, setExternalOpen }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
      if (setExternalOpen) setExternalOpen(false);
    }
  }, [externalOpen, setExternalOpen]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! Welcome to Dental Studio in Masaki. I'm Lisa, your virtual receptionist. How can I help you achieve your perfect smile today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));
    
    history.push({ role: 'user', parts: [{ text: input }] });

    const response = await getLisaResponse(history);

    if (response.functionCalls) {
      const bookingCall = response.functionCalls.find(call => call.name === 'book_appointment');
      if (bookingCall) {
        const details = bookingCall.args;
        const modelMessage: Message = {
          role: 'model',
          text: `Thank you, ${details.fullName}! I've noted your request for a ${details.service} on ${details.preferredDateTime}. Our clinical manager will call you at ${details.phoneNumber} shortly to confirm the final slot.`,
          timestamp: new Date(),
          isBooking: true,
          bookingDetails: details,
        };
        setMessages((prev) => [...prev, modelMessage]);
        setIsLoading(false);
        return;
      }
    }

    const modelMessage: Message = {
      role: 'model',
      text: response.text || "I'm sorry, I couldn't process that. Please try again.",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isVoiceOpen && <VoiceChat onClose={() => setIsVoiceOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[380px] sm:w-[420px] max-h-[600px] shadow-2xl rounded-2xl overflow-hidden border border-border/50"
          >
            <Card className="border-none rounded-none flex flex-col h-[600px]">
              <CardHeader className="bg-white border-b border-border p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/5 border border-accent flex items-center justify-center text-xl">
                    👩‍⚕️
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-primary">Lisa</CardTitle>
                    <div className="flex items-center gap-1.5">
                      <div className="status-dot-active"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Virtual Receptionist</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-primary hover:bg-slate-50">
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>

              <ScrollArea className="flex-1 p-4 bg-slate-50/50" viewportRef={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-secondary text-primary rounded-tr-none'
                            : 'bg-accent text-white rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                        
                        {msg.isBooking && (
                          <div className={`mt-3 p-3 rounded-xl border space-y-2 ${
                            msg.role === 'user' ? 'bg-white/50 border-primary/10' : 'bg-white/10 border-white/20'
                          }`}>
                            <div className={`flex items-center gap-2 font-semibold text-xs uppercase tracking-wider ${
                              msg.role === 'user' ? 'text-primary' : 'text-white'
                            }`}>
                              <CheckCircle2 className="h-3 w-3" /> Appointment Request
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <p className={`uppercase opacity-70`}>Service</p>
                                <p className="font-medium">{msg.bookingDetails.service}</p>
                              </div>
                              <div>
                                <p className={`uppercase opacity-70`}>Time</p>
                                <p className="font-medium">{msg.bookingDetails.preferredDateTime}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-border/50 shadow-sm">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-1.5 w-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-1.5 w-1.5 bg-accent rounded-full animate-bounce"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <CardFooter className="p-3 border-t bg-white flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 rounded-full bg-secondary/50 border-none focus-visible:ring-accent"
                  />
                  <Button size="icon" onClick={handleSend} disabled={isLoading} className="rounded-full bg-accent hover:bg-accent/90">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setIsVoiceOpen(true)} 
                    className="rounded-full border-accent text-accent hover:bg-accent/10"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center gap-4 text-[10px] text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> +255 753 601 155
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Masaki, Dar es Salaam
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-xl bg-accent hover:bg-accent/90 flex items-center justify-center p-0"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  );
}
