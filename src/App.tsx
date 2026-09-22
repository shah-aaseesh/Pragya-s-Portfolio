import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingScene, LandingSceneRef } from './components/LandingScene';
import { Popups } from './components/Popups';
import { PopupState } from './types';

const playTypewriterClick = () => {
  if (typeof window === 'undefined') return;
  try {
    if (!(window as any).typewriterCtx) {
      (window as any).typewriterCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = (window as any).typewriterCtx as AudioContext;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Noise burst for mechanical clack
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1200 + Math.random() * 500; 
    bandpass.Q.value = 1;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0025, ctx.currentTime + 0.03);
    
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(ctx.currentTime);

    // Minor low pitched click for body of the key press
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200 + Math.random() * 50, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.03);
    
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.01, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.0025, ctx.currentTime + 0.03);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // ignore
  }
};

export default function App() {
  const landingSceneRef = useRef<LandingSceneRef>(null);
  const [activePopup, setActivePopup] = useState<PopupState>('NONE');
  const [isHungUp, setIsHungUp] = useState(false);
  const [showText, setShowText] = useState(false);
  const [typeIndex, setTypeIndex] = useState(0);
  
  const part1 = "Hi, you've reached Pragya. I'm away right now, but feel free to stick around. ";
  const part2 = "Ring 1";
  const part3 = " to look at my work, ";
  const part4 = "Ring 2";
  const part5 = " to leave me a message, or ";
  const part6 = "Ring 3";
  const part7 = " for experience.";
  
  const fullTextLength = part1.length + part2.length + part3.length + part4.length + part5.length + part6.length + part7.length;

  // Auto-start typewriter prompt shortly after load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleTextStart = () => {
    setShowText(true);
  };

  const handleDial = (num: string) => {
    if (num === '0') {
      handleHangUp();
      return;
    }
    
    // Instant popup activation without blocking
    if (num === '1') setActivePopup('PROJECTS');
    else if (num === '2') setActivePopup('CONTACT');
    else if (num === '3') setActivePopup('EXPERIENCE');
    else if (num === '4' || num === '5') setActivePopup('WHO');
  };

  const handleHangUp = () => {
    setIsHungUp(true);
    setShowText(false);
    setActivePopup('NONE');
  };

  const resetExperience = () => {
    setIsHungUp(false);
    setShowText(true);
    setTypeIndex(fullTextLength);
    setActivePopup('NONE');
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showText && typeIndex < fullTextLength) {
      timeout = setTimeout(() => {
        playTypewriterClick();
        setTypeIndex(prev => prev + 1);
      }, 35);
    }
    return () => clearTimeout(timeout);
  }, [showText, typeIndex, fullTextLength]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (activePopup !== 'NONE') {
        if (e.key === 'Escape') setActivePopup('NONE');
        return;
      }
      const map: Record<string, string> = {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "0": "0"
      };
      if (map[e.key]) {
        landingSceneRef.current?.simulateDial(map[e.key]);
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activePopup]);

  const renderText = () => {
    let remaining = typeIndex;
    const getChunk = (text: string) => {
      const chunk = text.substring(0, remaining);
      remaining = Math.max(0, remaining - text.length);
      return chunk;
    };

    const p1 = getChunk(part1);
    const p2 = getChunk(part2);
    const p3 = getChunk(part3);
    const p4 = getChunk(part4);
    const p5 = getChunk(part5);
    const p6 = getChunk(part6);
    const p7 = getChunk(part7);

    return (
      <>
        {p1}
        {p2 && (
          <span 
            className="text-red-600 font-bold underline underline-offset-4 cursor-pointer hover:text-red-800 transition-colors"
            onClick={() => {
              landingSceneRef.current?.simulateDial('1');
            }}
          >
            {p2}
          </span>
        )}
        {p3}
        {p4 && (
          <span 
            className="text-red-600 font-bold underline underline-offset-4 cursor-pointer hover:text-red-800 transition-colors"
            onClick={() => {
              landingSceneRef.current?.simulateDial('2');
            }}
          >
            {p4}
          </span>
        )}
        {p5}
        {p6 && (
          <span 
            className="text-red-600 font-bold underline underline-offset-4 cursor-pointer hover:text-red-800 transition-colors"
            onClick={() => {
              landingSceneRef.current?.simulateDial('3');
            }}
          >
            {p6}
          </span>
        )}
        {p7}
      </>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      
      {/* Quick Access Top Bar */}
      <header className="fixed top-2 sm:top-4 z-30 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 bg-[#fdfaf6]/95 border-2 border-ink py-1.5 px-3 sm:py-2 sm:px-4 rounded-full shadow-md backdrop-blur-sm">
        <span className="font-retro text-[10px] sm:text-xs font-bold text-ink/70 hidden md:inline mr-1">
          DIAL MENU:
        </span>
        <button 
          onClick={() => landingSceneRef.current?.simulateDial('1')}
          className="font-retro text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full border border-ink/40 bg-white hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <span className="text-red-500 mr-1">[1]</span> Projects
        </button>
        <button 
          onClick={() => landingSceneRef.current?.simulateDial('2')}
          className="font-retro text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full border border-ink/40 bg-white hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <span className="text-red-500 mr-1">[2]</span> Contact
        </button>
        <button 
          onClick={() => landingSceneRef.current?.simulateDial('3')}
          className="font-retro text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full border border-ink/40 bg-white hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <span className="text-red-500 mr-1">[3]</span> Experience
        </button>
        <button 
          onClick={() => landingSceneRef.current?.simulateDial('0')}
          className="font-retro text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full border border-ink/40 bg-white hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <span className="text-ink/60 mr-1">[0]</span> Hang Up
        </button>
      </header>

      {/* Background overlay for hangup state */}
      <AnimatePresence>
        {isHungUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/95 z-40 flex flex-col items-center justify-center text-paper font-hand text-2xl sm:text-4xl gap-6 sm:gap-8 p-4"
          >
            <div className="text-center font-retro text-lg sm:text-2xl text-paper/80">
              <p>— CLICK / CALL ENDED —</p>
            </div>
            <div className="text-center mt-4 sm:mt-8 leading-relaxed">
              <p className="text-3xl sm:text-5xl font-bold mb-2">Thanks for calling.</p>
              <p className="text-xl sm:text-3xl text-pink-300">Talk soon. ♡</p>
            </div>
            <button 
              onClick={resetExperience}
              className="mt-6 sm:mt-10 px-8 py-3 border-2 border-paper rounded-full text-lg sm:text-2xl hover:bg-paper hover:text-ink transition-all cursor-pointer shadow-lg active:scale-95 font-bold font-retro"
            >
              📞 Pick up phone again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1100px] flex items-center justify-center relative z-10 pt-10 sm:pt-6">
        <LandingScene ref={landingSceneRef} onDial={handleDial} onTextStart={handleTextStart} />
      </div>

      {showText && (
        <div className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-20 font-retro text-ink text-center sm:text-right max-w-none sm:max-w-[440px] md:max-w-[520px] pointer-events-none">
          <div className="pointer-events-auto bg-[#fdfaf6]/95 p-3 sm:p-4 rounded-xl shadow-lg border-2 border-ink backdrop-blur-xs inline-block text-left sm:text-right">
            <p className="text-xs sm:text-sm md:text-base font-bold leading-snug sm:leading-relaxed">
              {renderText()}
            </p>
            <div className="mt-2 pt-1 border-t border-ink/15 text-[10px] sm:text-xs text-ink/60 font-medium">
              💡 Tip: Click any number on the rotary dial or press keys [1], [2], [3], [0]
            </div>
          </div>
        </div>
      )}

      <Popups 
        activePopup={activePopup} 
        onClose={() => setActivePopup('NONE')} 
        onNavigate={setActivePopup}
      />
      
    </div>
  );
}
