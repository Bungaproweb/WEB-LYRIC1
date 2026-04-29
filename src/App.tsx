import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Volume2, Music2, Settings2, Plus, Minus } from 'lucide-react';

interface LyricLine {
  text: string;
  start: number;
  end: number;
}

const LYRICS: LyricLine[] = [
  { text: "Hills have eyes, the hills have eyes", start: 145.00, end: 156.70 },
  { text: "Who are you to judge, who are you to judge?", start: 156.70, end: 167.00 },
  { text: "Hide your lies, girl, hide your lies", start: 165.00, end: 174.00 },
  { text: "Only you to trust, only you", start: 174.00, end: 181.10 },
  { text: "I only call you when it's half past five", start: 180.15, end: 185.30 },
  { text: "The only time that I'll be by your side", start: 185.30, end: 189.40 },
  { text: "I only love it when you touch me, not feel me", start: 189.40, end: 192.80 },
  { text: "When I'm ****** up, that's the real me", start: 192.80, end: 195.00 },
  { text: "When I'm ****** up, that's the real me, yeah", start: 195.00, end: 197.00 }
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(148);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [lyricOffset, setLyricOffset] = useState(0);
  const [showSyncControls, setShowSyncControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  // Calculate active index dynamically so offset changes update immediately
  const adjustedTime = currentTime + lyricOffset;
  const activeLyricIndex = LYRICS.findIndex(
    (l) => adjustedTime >= l.start && adjustedTime < l.end
  );

  // Audio source - Primary local asset
  const SONG_URL = "/assets/MUSIC.m4a";

  const handleAudioError = () => {
    console.error("Audio failed to load from:", SONG_URL);
    setError("Failed to load music asset at /assets/MUSIC.m4a. Make sure the file exists.");
  };

  const startExperience = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 148; // 2:28
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setError(null);
      }).catch(e => {
        console.error("Start error:", e);
        setError("Browser blocked playback. Please press Play manually.");
      });
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setError(null);
        if (audioRef.current.currentTime < 148 || audioRef.current.currentTime >= 197) {
          audioRef.current.currentTime = 148;
        }
        audioRef.current.play().catch(e => {
          console.error("Play error:", e);
          setError("Your browser blocked playback.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 148;
      setCurrentTime(148);
      if (!isPlaying) togglePlay();
    }
  };

  useEffect(() => {
    if (activeLyricIndex !== -1 && scrollRef.current && itemRefs.current[activeLyricIndex]) {
      const container = scrollRef.current;
      const activeItem = itemRefs.current[activeLyricIndex]!;
      
      const scrollPos = activeItem.offsetTop - container.offsetHeight / 2 + activeItem.offsetHeight / 2;
      container.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  }, [activeLyricIndex, isStarted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let timeUpdateReq: number;

    const updateTime = () => {
      let time = audio.currentTime;

      // Ensure boundaries (End at 3:17 = 197 seconds)
      if (time >= 197) {
        audio.pause();
        audio.currentTime = 148;
        setIsPlaying(false);
        time = 148;
      }

      setCurrentTime(time);

      if (isPlaying) {
        timeUpdateReq = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      timeUpdateReq = requestAnimationFrame(updateTime);
    }

    return () => cancelAnimationFrame(timeUpdateReq);
  }, [isPlaying]);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-sans overflow-hidden relative">
        <div className="absolute inset-0 bg-red-950/20 blur-xl pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="z-10 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm w-full mx-4 shadow-2xl text-center flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-6">
            <Volume2 className="text-red-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Ready to Play</h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            The music has been set to play from 2:28 to 3:17.
          </p>
          <button 
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
            onClick={startExperience}
          >
            <Play fill="currentColor" size={16} />
            Start Music
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background Cinematic Gradient */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-red-900 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-zinc-900 rounded-full blur-[120px]" />
      </div>

      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 mb-8 text-center"
      >
        <h2 className="text-red-600 uppercase tracking-[0.3em] text-[10px] font-bold mb-2">The Weeknd</h2>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter drop-shadow-2xl">THE HILLS</h1>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-red-200 text-xs font-mono max-w-sm mx-auto"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Lyrics Display Area */}
      <div 
        ref={scrollRef}
        className="z-10 h-[50vh] flex flex-col w-full max-w-4xl px-4 overflow-y-auto no-scrollbar scroll-smooth relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="py-[20vh] flex flex-col items-start gap-6 md:gap-8 min-h-full w-full">
          {LYRICS.map((lyric, index) => {
            const isActive = index === activeLyricIndex;
            const isPast = index < activeLyricIndex;
            
            return (
              <h3 
                key={index}
                // @ts-ignore
                ref={el => itemRefs.current[index] = el}
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = lyric.start;
                    setCurrentTime(lyric.start);
                    if (!isPlaying) togglePlay();
                  }
                }}
                className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter transition-all duration-700 cursor-pointer w-full
                  ${isActive 
                    ? 'text-white opacity-100' 
                    : 'text-white/30 hover:text-white/50 opacity-40'} 
                `}
                style={{
                  transformOrigin: 'left center'
                }}
              >
                {lyric.text}
              </h3>
            );
          })}
        </div>

        {activeLyricIndex === -1 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20 transition-opacity">
            <Music2 className="w-16 h-16 mb-4" />
          </div>
        )}
      </div>

      {/* Controls Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 mt-12 flex flex-col items-center gap-6 w-full max-w-sm px-6"
      >
        {/* Progress Bar */}
        <div className="w-full bg-zinc-900/50 h-1.5 rounded-full overflow-hidden group cursor-pointer relative backdrop-blur-sm shadow-inner">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            style={{ 
              width: `${Math.max(0, Math.min(100, ((currentTime - 148) / (197 - 148)) * 100))}%` 
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-10">
            <button 
              onClick={reset}
              className="p-3 text-zinc-500 hover:text-red-500 transition-colors"
              title="Reset"
            >
              <RefreshCw size={20} />
            </button>

            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] group"
            >
              {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" className="ml-1 group-hover:text-red-600 transition-colors" size={28} />}
            </button>

            <div className="p-3 text-zinc-500">
              <Volume2 size={20} />
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-3">
          <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
          <span className="opacity-30">/</span>
          <span>SYNC: {(lyricOffset >= 0 ? '+' : '') + lyricOffset.toFixed(1)}s</span>
        </div>
      </motion.div>

      {/* Sync Controls (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
        <button 
          onClick={() => setShowSyncControls(!showSyncControls)}
          className={`p-3 rounded-full transition-all duration-300 ${showSyncControls ? 'bg-red-600 text-white' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
          title="Sync Settings"
        >
          <Settings2 size={18} />
        </button>
        
        <AnimatePresence>
          {showSyncControls && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 bg-zinc-900 border border-white/10 p-2 rounded-xl shadow-2xl"
            >
              <button 
                onClick={() => setLyricOffset(prev => prev - 0.5)}
                className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                title="Delay Lyrics"
              >
                <Minus size={14} />
              </button>
              <span className="text-[10px] font-mono w-12 text-center text-red-500 font-bold">
                {lyricOffset.toFixed(1)}s
              </span>
              <button 
                onClick={() => setLyricOffset(prev => prev + 0.5)}
                className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                title="Advance Lyrics"
              >
                <Plus size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={SONG_URL}
        onError={handleAudioError}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* Visualizer Accents */}
      <div className="absolute bottom-0 left-0 w-full flex items-end justify-around h-32 opacity-15 pointer-events-none px-4 gap-1">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [10, Math.random() * 80 + 10, 10] : 8 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.4 + Math.random() * 0.6,
              ease: "easeInOut"
            }}
            className="flex-1 bg-red-900/60 rounded-t-sm"
          />
        ))}
      </div>
    </div>
  );
}
