import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, X, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ai, LISA_SYSTEM_PROMPT } from '@/src/lib/gemini';
import { getAudioStream, float32ToInt16, arrayBufferToBase64, base64ToUint8Array } from '@/src/lib/audio-utils';
import { Modality } from "@google/genai";
import { toast } from 'sonner';

interface VoiceChatProps {
  onClose: () => void;
}

export default function VoiceChat({ onClose }: VoiceChatProps) {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      
      // Initialize Audio Context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      // Connect to Live API
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            console.log("Live API connection opened");
            setIsConnecting(false);
            setIsActive(true);
            startMic();
          },
          onmessage: async (message) => {
            // Handle audio output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const pcmData = new Int16Array(base64ToUint8Array(base64Audio).buffer);
              audioQueueRef.current.push(pcmData);
              if (!isPlayingRef.current) {
                playNextInQueue();
              }
            }
            
            // Handle interruption
            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            console.log("Live API connection closed");
            stopSession();
          },
          onerror: (error) => {
            console.error("Live API error:", error);
            toast.error("Voice connection error. Please try again.");
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }, // Kore sounds warm/professional
          },
          systemInstruction: LISA_SYSTEM_PROMPT,
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Failed to start voice session:", error);
      setIsConnecting(false);
      toast.error("Could not access microphone or connect to AI.");
    }
  };

  const startMic = async () => {
    try {
      const stream = await getAudioStream();
      streamRef.current = stream;
      
      if (!audioContextRef.current) return;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted || !sessionRef.current) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = float32ToInt16(inputData);
        const base64Data = arrayBufferToBase64(pcmData.buffer);
        
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error("Mic error:", error);
    }
  };

  const playNextInQueue = async () => {
    if (audioQueueRef.current.length === 0 || !audioContextRef.current) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);
    const pcmData = audioQueueRef.current.shift()!;
    
    const audioBuffer = audioContextRef.current.createBuffer(1, pcmData.length, 16000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) {
      channelData[i] = pcmData[i] / 0x7fff;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => playNextInQueue();
    source.start();
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    onClose();
  };

  useEffect(() => {
    startSession();
    return () => stopSession();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <Card className="w-full max-w-md bg-white border-border shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-border p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{
                  scale: isSpeaking ? [1, 1.2, 1] : 1,
                  opacity: isSpeaking ? [0.3, 0.6, 0.3] : 0.2,
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-accent rounded-full"
              />
              <div className="relative h-24 w-24 rounded-full bg-accent/5 border-2 border-accent flex items-center justify-center text-4xl shadow-inner">
                👩‍⚕️
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Lisa</CardTitle>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
            {isConnecting ? 'Connecting to Dental Studio...' : (isSpeaking ? 'Lisa is speaking...' : 'Lisa is listening...')}
          </p>
        </CardHeader>

        <CardContent className="p-12 flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            {isActive && (
              <motion.div
                animate={{
                  height: [10, 30, 10],
                }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                className="w-1.5 bg-accent rounded-full"
              />
            )}
            {isActive && (
              <motion.div
                animate={{
                  height: [15, 45, 15],
                }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                className="w-1.5 bg-accent rounded-full"
              />
            )}
            {isActive && (
              <motion.div
                animate={{
                  height: [10, 30, 10],
                }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                className="w-1.5 bg-accent rounded-full"
              />
            )}
          </div>

          <div className="flex gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className={`h-16 w-16 rounded-full border-2 transition-all ${
                isMuted 
                  ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                  : 'bg-slate-50 border-border text-slate-400 hover:text-primary hover:border-primary'
              }`}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={stopSession}
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
            >
              <Phone className="h-6 w-6 rotate-[135deg]" />
            </Button>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 p-4 border-t border-border flex justify-center">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Secure Voice Channel Active
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
