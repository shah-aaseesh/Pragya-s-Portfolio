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
  const part3 = " to look at my work and ";
  const part4 = "Ring 2";
  const part5 = " to leave me a message";
  
  const fullTextLength = part1.length + part2.length + part3.length + part4.length + part5.length;

  const handleTextStart = () => {
    setShowText(true);
  };

  const handleDial = (num: string) => {
    if (num === '0') {
      handleHangUp();
      return;
    }
    
    // Only display popup if text has fully been displayed
    if (showText && typeIndex === fullTextLength) {
      if (num === '1') setActivePopup('PROJECTS');
      if (num === '2') setActivePopup('CONTACT');
      if (num === '3') setActivePopup('EXPERIENCE');
    }
  };

  const handleHangUp = () => {
    setIsHungUp(true);
    setShowText(false);
    setActivePopup('NONE');
  };

  const resetExperience = () => {
    setIsHungUp(false);
    setShowText(false);
    setActivePopup('NONE');
    // Start text again? Or just wait?
    // Let's just show text immediately after picking up again so they don't have to wait.
    setTimeout(() => {
      setShowText(true);
      setTypeIndex(fullTextLength); // Instant text
    }, 500);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showText && typeIndex < fullTextLength) {
      timeout = setTimeout(() => {
        playTypewriterClick();
        setTypeIndex(prev => prev + 1);
      }, 40);
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
        "5": "5",
        "0": "0"
      };
      if (map[e.key]) {
        landingSceneRef.current?.simulateDial(map[e.key]);
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showText, typeIndex, activePopup]);

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

    return (
      <>
        {p1}
        {p2 && (
          <span 
            className="text-red-500 underline underline-offset-4 cursor-pointer hover:text-red-700 transition-colors"
            onClick={() => landingSceneRef.current?.simulateDial('1')}
          >
            {p2}
          </span>
        )}
        {p3}
        {p4 && (
          <span 
            className="text-red-500 underline underline-offset-4 cursor-pointer hover:text-red-700 transition-colors"
            onClick={() => landingSceneRef.current?.simulateDial('2')}
          >
            {p4}
          </span>
        )}
        {p5}
      </>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      
      {/* Background overlay for hangup state */}
      <AnimatePresence>
        {isHungUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/90 z-40 flex flex-col items-center justify-center text-paper font-hand text-2xl sm:text-4xl gap-6 sm:gap-8 p-4"
          >
            <div className="text-center">
              <p>— CLICK —</p>
            </div>
            <div className="text-center mt-6 sm:mt-12 leading-relaxed">
              <p>Thanks for calling.</p>
              <p>Talk soon. ♡</p>
            </div>
            <button 
              onClick={resetExperience}
              className="mt-8 sm:mt-12 px-6 py-2 border-2 border-paper rounded-full text-lg sm:text-xl hover:bg-paper hover:text-ink transition-colors cursor-pointer"
            >
              Pick up again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1100px] flex items-center justify-center relative z-10">
        <LandingScene ref={landingSceneRef} onDial={handleDial} onTextStart={handleTextStart} />
      </div>

      {showText && (
        <div className="fixed bottom-3 sm:bottom-8 left-3 right-3 sm:left-auto sm:right-8 z-20 font-retro text-ink text-center sm:text-right max-w-none sm:max-w-[420px] md:max-w-[500px] pointer-events-none">
          <p className="text-xs sm:text-base md:text-xl font-bold leading-snug sm:leading-relaxed pointer-events-auto bg-[#fdfaf6]/92 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg sm:rounded-none shadow-sm sm:shadow-none border border-ink/20 sm:border-none backdrop-blur-xs sm:backdrop-blur-none inline-block">
            {renderText()}
          </p>
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
