import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Volume2, Music2, Settings2, Plus, Minus } from 'lucide-react';

interface LyricLine {
  text: string;
  start: number;
  end: number;
}

const LYRICS: LyricLine[] = [
  // Verse 1
  { text: "Your man on the road, he doin' promo", start: 13.5, end: 17.0 },
  { text: "You said, 'Keep our business on the low-low'", start: 17.0, end: 20.5 },
  { text: "I'm just tryna get you out the friend zone", start: 20.5, end: 24.0 },
  { text: "Cause you look even better than the photos", start: 24.0, end: 27.5 },
  { text: "I can't find your house, send me the info", start: 27.5, end: 31.0 },
  { text: "Drivin' through the gated residential", start: 31.0, end: 34.5 },
  { text: "Found out I was comin', sent your friends home", start: 34.5, end: 38.0 },
  { text: "Keep on tryna hide it but your friends know", start: 38.0, end: 41.5 },
  
  // Chorus 1
  { text: "I only call you when it's half past five", start: 51.5, end: 56.5 },
  { text: "The only time that I'd be by your side", start: 56.5, end: 61.5 },
  { text: "I only love it when you touch me, not feel me", start: 61.5, end: 66.5 },
  { text: "When I'm f-ed up, that's the real me", start: 66.5, end: 71.5 },
  { text: "When I'm f-ed up, that's the real me, yeah", start: 71.5, end: 76.5 },
  
  { text: "I only call you when it's half past five", start: 76.5, end: 81.5 },
  { text: "The only time I'd ever call you mine", start: 81.5, end: 86.5 },
  { text: "I only love it when you touch me, not feel me", start: 86.5, end: 91.5 },
  { text: "When I'm f-ed up, that's the real me", start: 91.5, end: 96.5 },
  { text: "When I'm f-ed up, that's the real me, babe", start: 96.5, end: 101.5 },
  
  // Verse 2
  { text: "I'ma let you know and keep it simple", start: 118.5, end: 122.0 },
  { text: "Tryna keep it up don't seem so simple", start: 122.0, end: 125.5 },
  { text: "I just f-ed two b- 'fore I saw you", start: 125.5, end: 129.0 },
  { text: "And you gon' have to do it at my tempo", start: 129.0, end: 132.5 },
  { text: "Always tryna send me off to rehab", start: 132.5, end: 136.0 },
  { text: "D- started feelin' like it's decaf", start: 136.0, end: 139.5 },
  { text: "I'm just tryna live life for the moment", start: 139.5, end: 143.0 },
  { text: "And all these motherf- want a relapse", start: 143.0, end: 146.5 },
  
  // Chorus 2
  { text: "I only call you when it's half past five", start: 156.5, end: 161.5 },
  { text: "The only time that I'd be by your side", start: 161.5, end: 166.5 },
  { text: "I only love it when you touch me, not feel me", start: 161.5, end: 171.5 },
  { text: "When I'm f-ed up, that's the real me", start: 171.5, end: 176.5 },
  { text: "When I'm f-ed up, that's the real me, yeah", start: 176.5, end: 181.5 },
  
  { text: "I only call you when it's half past five", start: 181.5, end: 186.5 },
  { text: "The only time I'd ever call you mine", start: 186.5, end: 191.5 },
  { text: "I only love it when you touch me, not feel me", start: 191.5, end: 196.5 },
  { text: "When I'm f-ed up, that's the real me", start: 196.5, end: 201.5 },
  { text: "When I'm f-ed up, that's the real me, babe", start: 201.5, end: 210.0 },
  
  // Bridge
  { text: "Hills have eyes, the hills have eyes", start: 221.5, end: 226.5 },
  { text: "Who are you to judge? Who are you to judge?", start: 226.5, end: 231.5 },
  { text: "Hide your lies, girl, hide your lies", start: 231.5, end: 236.5 },
  { text: "Only you to trust, only you", start: 236.5, end: 247.0 },
  
  // Chorus 3
  { text: "I only call you when it's half past five", start: 247.0, end: 252.0 },
  { text: "The only time that I'd be by your side", start: 252.0, end: 257.0 },
  { text: "I only love it when you touch me, not feel me", start: 257.0, end: 262.0 },
  { text: "When I'm f-ed up, that's the real me", start: 262.0, end: 267.0 },
  { text: "When I'm f-ed up, that's the real me, yeah", start: 267.0, end: 272.0 },
  
  { text: "I only call you when it's half past five", start: 272.0, end: 277.0 },
  { text: "The only time I'd ever call you mine", start: 277.0, end: 282.0 },
  { text: "I only love it when you touch me, not feel me", start: 282.0, end: 287.0 },
  { text: "When I'm f-ed up, that's the real me", start: 287.0, end: 292.0 },
  { text: "When I'm f-ed up, that's the real me, babe", start: 292.0, end: 305.0 },
  
  // Outro
  { text: "Ewedihalehu", start: 313.5, end: 317.0 },
  { text: "Yene konjo, ewedihalehu", start: 317.0, end: 320.5 },
  { text: "Yene fikir, fikir, fikir, fikir", start: 320.5, end: 324.0 },
  { text: "Yene fikir, fikir, fikir, fikir", start: 324.0, end: 327.5 },
  { text: "Ewedihalehu", start: 327.5, end: 331.0 },
  { text: "Yene konjo, ewedihalehu", start: 331.0, end: 340.0 }
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [lyricOffset, setLyricOffset] = useState(0);
  const [showSyncControls, setShowSyncControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio source - Primary local asset
  const SONG_URL = "/assets/MUSIC.m4a";

  const handleAudioError = () => {
    console.error("Audio failed to load from:", SONG_URL);
    setError("Failed to load music asset at /assets/MUSIC.m4a. Make sure the file exists.");
  };

  const startExperience = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Start error:", e);
        setError("Browser blocked playback. Please click Play.");
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
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      const adjustedTime = time + lyricOffset;
      const index = LYRICS.findIndex(
        (l) => adjustedTime >= l.start && adjustedTime < l.end
      );
      setActiveLyricIndex(index);
    };

    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, [lyricOffset]);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-sans overflow-hidden cursor-pointer" onClick={startExperience}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tighter mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">THE HILLS</h1>
          <button 
            className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 rounded-full"
            onClick={startExperience}
          >
            Start Experience
          </button>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 to-black pointer-events-none" />
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
      <div className="z-10 h-[300px] flex flex-col items-center justify-center w-full max-w-3xl px-6 relative">
        <AnimatePresence mode="wait">
          {activeLyricIndex !== -1 ? (
            <motion.div
              key={activeLyricIndex}
              initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(15px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h3 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] max-w-2xl mx-auto px-4">
                {LYRICS[activeLyricIndex].text}
              </h3>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-800 flex flex-col items-center gap-4"
            >
              <Music2 className="w-12 h-12 opacity-50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small Preview of Next Lyric */}
        <div className="absolute bottom-4 opacity-10 pointer-events-none transition-opacity duration-500">
          {activeLyricIndex + 1 < LYRICS.length && (
            <p className="text-sm md:text-base font-medium italic">
              {LYRICS[activeLyricIndex + 1].text}
            </p>
          )}
        </div>
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
              width: `${Math.max(0, Math.min(100, (currentTime / (audioRef.current?.duration || 242)) * 100))}%` 
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
