import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playSectionChange: () => void;
  playAmbientInteract: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientNodesRef = useRef<any[]>([]);

  // Initialize Audio Context
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      const ctx = audioContextRef.current;
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.connect(ctx.destination);
      masterGainRef.current.gain.value = isMuted ? 0 : 0.4;
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const startAmbient = () => {
    if (!audioContextRef.current) return;
    stopAmbient();

    const ctx = audioContextRef.current;
    const t = ctx.currentTime;

    // Create a deep, throbbing space drone
    // Oscillator 1: Base low tone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 60;

    // Oscillator 2: Slightly detuned for binaural beating
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 62;

    // Oscillator 3: Very low sub-bass
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = 30;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.15;

    // Lowpass filter to muffle the sound (distant space feel)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;
    filter.Q.value = 1;

    // Connect graph
    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(masterGainRef.current!);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);

    ambientNodesRef.current.push(osc1, osc2, osc3, droneGain, filter);
  };

  const stopAmbient = () => {
    ambientNodesRef.current.forEach(node => {
      if (node.stop) try { node.stop(); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    ambientNodesRef.current = [];
  };

  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      const gainNode = masterGainRef.current.gain;
      
      // Smooth volume transition
      gainNode.cancelScheduledValues(ctx.currentTime);
      
      if (isMuted) {
        gainNode.setTargetAtTime(0, ctx.currentTime, 0.2);
        // We don't fully stop ambient here to allow quick unmute resume, 
        // but for performance we could stop it if muted for long.
        // For now, we keep it running at 0 volume or restart it.
        setTimeout(stopAmbient, 300);
      } else {
        initAudio();
        startAmbient();
        gainNode.setTargetAtTime(0.4, ctx.currentTime, 0.2);
      }
    } else if (!isMuted) {
      // First time initialization
      initAudio();
      startAmbient();
    }
  }, [isMuted]);

  // Sound Effect: High pitch chirp for hover
  const playHover = () => {
    if (isMuted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    
    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc.connect(gain);
    gain.connect(masterGainRef.current!);
    
    osc.start(t);
    osc.stop(t + 0.05);
  };

  // Sound Effect: Digital bleep for click
  const playClick = () => {
    if (isMuted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(gain);
    gain.connect(masterGainRef.current!);
    
    osc.start(t);
    osc.stop(t + 0.1);
  };

  // Sound Effect: Sci-fi sweep for section change
  const playSectionChange = () => {
    if (isMuted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(600, t + 0.3);
    
    gain.gain.setValueAtTime(0.03, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);
    
    osc.connect(gain);
    gain.connect(masterGainRef.current!);
    
    osc.start(t);
    osc.stop(t + 0.3);
  };

  // Sound Effect: Low thrum when interacting with galaxy
  const playAmbientInteract = () => {
    if (isMuted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.4);
    
    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    // Filter to make it subtle
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current!);
    
    osc.start(t);
    osc.stop(t + 0.4);
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playHover, playClick, playSectionChange, playAmbientInteract }}>
      {children}
      <button 
        onClick={toggleMute}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full border transition-all duration-300 backdrop-blur-sm ${
            isMuted 
            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]'
        }`}
        title={isMuted ? "Initialize Audio Systems" : "Mute Audio Systems"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </SoundContext.Provider>
  );
};