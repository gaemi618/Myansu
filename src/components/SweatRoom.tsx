import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';

// --- Snowfall Canvas Component ---
const Snowfall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const snowflakes: { x: number, y: number, radius: number, speed: number, wind: number }[] = [];
    // Create 200 snowflakes
    for (let i = 0; i < 200; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        wind: Math.random() * 1 - 0.5
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      snowflakes.forEach(flake => {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
      });
      ctx.fill();

      snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.wind;
        if (flake.y > height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export const SweatRoom = ({ onBack }: { onBack: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[100] bg-[#fdfaf6] flex flex-col items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Candy Drop */}
            <motion.div
              className="w-16 h-16 bg-red-500 rounded-full shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.3),0_10px_20px_rgba(239,68,68,0.4)] relative"
              initial={{ y: -500 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 1.5 }}
            >
              <div className="absolute top-2 left-3 w-4 h-4 bg-white/60 rounded-full blur-[1px]" />
            </motion.div>

            {/* Text Pop */}
            <motion.div
              className="absolute mt-32 text-5xl md:text-7xl font-black text-yellow-400 tracking-widest"
              style={{ 
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                WebkitTextStroke: '2px #d97706',
                textShadow: '0 4px 10px rgba(217,119,6,0.3)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring", bounce: 0.5 }}
            >
              キャラメリゼ
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative w-full min-h-screen text-gray-900 overflow-x-hidden font-serif selection:bg-gray-300 selection:text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
      {/* Custom Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(https://i.postimg.cc/cLGTVbYx/year-2026-year-2025-year-2024-animated-production-art-promotional-art-no-t-s-3007674862.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Subtle overlay to make text readable and give a literary mood */}
      <div className="fixed inset-0 bg-white/40 backdrop-blur-[3px] z-0 pointer-events-none" />

      {/* Falling Snow Effect */}
      <Snowfall />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-3 text-gray-800 hover:text-black transition-colors bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-sm font-sans tracking-widest text-sm uppercase"
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        돌아가기
      </button>

      {/* Main Content - Novel Style */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-64 flex flex-col items-center">
        
        {/* Profile Image (Top, Original Ratio) */}
        <motion.div 
          className="w-full flex justify-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <img 
            src="https://i.postimg.cc/mkMp9fMy/image.webp" 
            alt="Saito Tohru" 
            className="w-full max-w-2xl max-h-[70vh] object-contain drop-shadow-2xl rounded-sm"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Profile Information (Bottom, Literary Style) */}
        <motion.div 
          className="w-full bg-white/85 backdrop-blur-xl p-10 md:p-20 shadow-2xl rounded-sm border border-white/60 relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {/* Decorative vertical Japanese text */}
          <div 
            className="absolute top-12 right-8 md:right-12 text-2xl md:text-3xl text-gray-300 font-serif tracking-[0.5em] select-none pointer-events-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            災藤 透
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-gray-900 mb-4">사이토 토오루</h1>
            <h2 className="text-lg md:text-xl text-gray-500 tracking-[0.3em] font-light">Saito Tohru</h2>
          </div>

          <div className="w-px h-16 bg-gray-300 mx-auto mb-12" />

          <div className="max-w-xl mx-auto space-y-8 text-lg md:text-xl text-gray-800 leading-relaxed font-serif">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-gray-200/60 pb-4">
              <span className="text-sm text-gray-400 tracking-widest uppercase w-24 shrink-0">직업</span>
              <span>주간연재 만화가 <span className="text-gray-500 text-base">(필명: 캬라멜)</span></span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-gray-200/60 pb-4">
              <span className="text-sm text-gray-400 tracking-widest uppercase w-24 shrink-0">나이</span>
              <span>33세</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-gray-200/60 pb-4">
              <span className="text-sm text-gray-400 tracking-widest uppercase w-24 shrink-0">생년월일</span>
              <span>1992년 2월 29일</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-gray-200/60 pb-4">
              <span className="text-sm text-gray-400 tracking-widest uppercase w-24 shrink-0">체형</span>
              <span>175cm / 58kg</span>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <span className="text-sm text-gray-400 tracking-widest uppercase">능력(?)</span>
              <div className="pl-4 md:pl-12 border-l-2 border-gray-300">
                <p className="mb-2">숨쉬듯 일어나는 초월적 불운</p>
                <p className="text-red-800/80 italic">+ 유저 한정 럭키스케베 lv. 999</p>
              </div>
            </div>
          </div>

          {/* Easter Egg Button: Wax Seal */}
          <motion.a
            href="https://share.crack.wrtn.ai/iyfa84r"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-20 h-20 md:w-24 md:h-24 bg-[#8b0000] rounded-full flex items-center justify-center shadow-2xl border-2 border-[#ff4d4d]/30 cursor-pointer group z-50"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ['0px 0px 20px rgba(139,0,0,0.4)', '0px 0px 50px rgba(255,0,0,0.8)', '0px 0px 20px rgba(139,0,0,0.4)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            title="Secret"
          >
            <div className="absolute inset-2 border border-white/30 rounded-full border-dashed group-hover:animate-[spin_4s_linear_infinite] transition-all duration-700" />
            <div className="absolute inset-3 border border-white/20 rounded-full" />
            <span className="text-white/90 font-serif text-sm md:text-base tracking-[0.2em] font-bold ml-1 drop-shadow-md">
              秘密
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* Full-width LP Player at the bottom */}
      <motion.div 
        className="fixed bottom-0 left-0 w-full bg-zinc-900/95 backdrop-blur-2xl border-t border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring", damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-32 md:h-40 flex items-center justify-between relative">
          
          {/* Left Side: Giant Record & Info */}
          <div 
            className="flex items-center gap-6 md:gap-12 cursor-pointer group"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {/* The Vinyl Record (Peeking out from the player deck) */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 -mt-16 md:-mt-24 shrink-0">
              <div className={`absolute inset-0 bg-black rounded-full border-4 border-zinc-800 shadow-2xl flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'group-hover:scale-105'}`}>
                {/* Grooves */}
                <div className="absolute inset-2 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-4 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-8 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-12 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-16 rounded-full border border-zinc-800/50" />
                
                {/* Center Label */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#8b0000] rounded-full flex items-center justify-center relative">
                  <div className="w-3 h-3 bg-zinc-900 rounded-full" />
                  <div className="absolute text-[6px] text-white/70 uppercase tracking-widest top-2">Tohru</div>
                </div>

                {/* Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full pointer-events-none" />
              </div>
            </div>

            {/* Track Info */}
            <div className="text-white font-serif">
              <p className="text-xs md:text-sm text-zinc-500 tracking-[0.2em] mb-2 uppercase">
                {isPlaying ? 'Now Playing' : 'Paused'}
              </p>
              <p className="text-lg md:text-2xl tracking-widest text-zinc-200 flex items-center gap-4">
                Track 01
                <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white transition-colors">
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </span>
              </p>
            </div>
          </div>

          {/* Right Side: YouTube Iframe (Hidden visually but playing audio) */}
          <div className="w-48 h-16 bg-black rounded border border-zinc-800 overflow-hidden opacity-30 hover:opacity-100 transition-opacity hidden md:block">
            {isPlaying && (
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/1_lap6dzSUc?autoplay=1&controls=0" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              ></iframe>
            )}
          </div>
          
          {/* Mobile hidden iframe for audio */}
          <div className="hidden">
            {isPlaying && (
              <iframe 
                src="https://www.youtube.com/embed/1_lap6dzSUc?autoplay=1&controls=0" 
                allow="autoplay"
              />
            )}
          </div>

        </div>
      </motion.div>
        </motion.div>
    </>
  );
};
