import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { playSound, initSounds } from '../utils/sounds';

// --- Rain Effect Component ---
const RainEffect = () => {
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

    const raindrops: { x: number, y: number, length: number, speed: number, opacity: number }[] = [];
    for (let i = 0; i < 150; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 15,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      raindrops.forEach(drop => {
        ctx.strokeStyle = `rgba(150, 180, 255, ${drop.opacity})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.2, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x -= drop.speed * 0.2; // Slight angle

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width + width * 0.2; // Reset with offset to account for angle
        }
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-60" />;
};

export const BrotherRoom = ({ onBack }: { onBack: () => void }) => {
  const [activeApp, setActiveApp] = useState<'home' | 'music' | 'deepweb'>('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!showIntro) return;
    initSounds();
    const flashTimer = setTimeout(() => {
      playSound('shutter');
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
      setTimeout(() => setShowText(true), 200);
    }, 1500);

    const endTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4500);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(endTimer);
    };
  }, [showIntro]);

  // Scroll animations for the giant phone
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const phoneScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.2], [200, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <>
      {/* Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Ambient Room Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,40,60,0.2)_0%,#000_100%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

            {/* Global Flash Effect */}
            {showFlash && (
              <div className="absolute inset-0 bg-white z-40 pointer-events-none mix-blend-screen" />
            )}

            {/* High-Quality Phone Model */}
            <motion.div
              className="absolute bottom-[-5vh] w-[90vw] max-w-[400px] h-[85vh] rounded-[3.5rem] p-[3px] z-20 shadow-[0_-30px_80px_rgba(0,0,0,0.8)]"
              style={{
                background: 'linear-gradient(135deg, #555 0%, #222 20%, #111 50%, #333 80%, #666 100%)',
              }}
              initial={{ y: '100%', rotateX: 20 }}
              animate={{ y: '0%', rotateX: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.5 }}
            >
              {/* Inner Bezel */}
              <div className="w-full h-full bg-black rounded-[3.3rem] p-[8px] relative overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                {/* Screen */}
                <div className="w-full h-full bg-[#0a0a0c] rounded-[2.8rem] relative overflow-hidden flex flex-col items-center justify-center">
                  {/* Screen Flash */}
                  {showFlash && (
                    <div className="absolute inset-0 bg-white z-20" />
                  )}

                  {/* Final Image / Text */}
                  {showText && (
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0 flex justify-center items-center bg-gradient-to-b from-zinc-900 to-black"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] z-10" />
                      <h1
                        className="text-6xl md:text-7xl font-bold text-slate-200 tracking-widest whitespace-nowrap z-20"
                        style={{
                          fontFamily: "'Gowun Batang', serif",
                          textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(100,150,255,0.6), 0 0 80px rgba(50,100,255,0.4)',
                        }}
                      >
                        의붓동생
                      </h1>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div ref={containerRef} className="relative w-full bg-[#0a0a0c] text-slate-300 font-sans selection:bg-red-900 selection:text-white" style={{ minHeight: '200vh' }}>
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(https://i.postimg.cc/LXqgNmxN/year-2026-year-2025-year-2024-animated-production-art-promotional-art-no-t-s-1639780823.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4) contrast(1.2) saturate(0.8)'
        }}
      />
      
      {/* Rain Effect */}
      <RainEffect />

      {/* Dark Vignette / Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none z-0" />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-3 text-slate-400 hover:text-white transition-colors bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg font-mono tracking-widest text-sm uppercase"
      >
        <ArrowLeft size={18} />
        Exit
      </button>

      {/* Intro Section (Profile) */}
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 pt-20 gap-12 max-w-7xl mx-auto">
        
        {/* Profile Image (Top Left) */}
        <motion.div 
          className="w-full md:w-1/3 flex justify-center md:justify-start"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative p-2 bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/80">
            <img 
              src="https://i.postimg.cc/nLpsbvT5/1.webp" 
              alt="Kim Sihyeok" 
              className="w-full max-w-[300px] object-contain filter contrast-125 brightness-90"
              referrerPolicy="no-referrer"
            />
            {/* Glitch/Scanline overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent animate-[scan_4s_linear_infinite] pointer-events-none" />
          </div>
        </motion.div>

        {/* Profile Info (Right) */}
        <motion.div 
          className="w-full md:w-2/3 bg-black/60 backdrop-blur-xl p-8 md:p-12 border border-zinc-800/50 shadow-2xl relative overflow-hidden"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/20 blur-[50px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-900/20 blur-[50px] pointer-events-none" />
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">김시혁</h1>
          <p className="text-zinc-500 font-mono text-sm tracking-widest mb-8 uppercase border-b border-zinc-800 pb-4">Target Profile // Classified</p>

          <div className="space-y-8 font-mono text-sm md:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-cyan-600/80 uppercase tracking-widest text-xs mb-2">■ 기본정보</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li><span className="text-zinc-600 mr-2">나이:</span>유저 보다 3살 연하</li>
                  <li><span className="text-zinc-600 mr-2">외모:</span>짧은 푸른빛 도는 검은 머리 / 검은 눈</li>
                  <li><span className="text-zinc-600 mr-2">신체:</span>184cm / 71kg</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-cyan-600/80 uppercase tracking-widest text-xs mb-2">■ 성격</h3>
                <ul className="space-y-2 text-zinc-300">
                  <li><span className="text-zinc-600 mr-2">겉:</span>과묵함 / 존재감 희미</li>
                  <li><span className="text-zinc-600 mr-2">속:</span>유저의 '몸'에 대한 병적인 집착과 왜곡된 소유욕 / 감정적 공감 능력 결여 / 쓰레기 / 갱생 불가</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-sm">
              <h3 className="text-red-500/80 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                ■ 특징 (Warning)
              </h3>
              <ul className="space-y-2 text-red-200/80 list-disc list-inside">
                <li>유저와의 행위를 대놓고 촬영</li>
                <li>유저의 방/욕실 등 사적인 공간 곳곳에 초소형 카메라를 설치 및 감시</li>
                <li>촬영본을 딥웹 사이트에 판매하여 돈을 벌어들임</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 font-mono text-xs tracking-widest"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>SCROLL DOWN</span>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
      </motion.div>

      {/* Giant Smartphone Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div 
          className="w-full max-w-[400px] aspect-[9/19.5] bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-[3rem] p-2 md:p-3 shadow-[0_0_50px_rgba(255,255,255,0.15),inset_0_0_10px_rgba(0,0,0,0.5)] border-2 border-zinc-500 relative"
          style={{ scale: phoneScale, y: phoneY }}
        >
          {/* Phone Screen */}
          <div className="w-full h-full bg-[#050505] rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            
            {/* Status Bar */}
            <div className="h-8 w-full flex justify-between items-center px-6 text-[10px] text-zinc-300 font-sans z-50 bg-black/40 backdrop-blur-md absolute top-0 left-0">
              <span>03:17</span>
              {/* Dynamic Island */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1 w-24 h-6 bg-black rounded-full shadow-sm" />
              <div className="flex gap-1.5 items-center">
                <div className="w-3 h-3 border border-zinc-300 rounded-sm" />
                <div className="w-4 h-3 bg-zinc-300 rounded-sm" />
              </div>
            </div>

            {/* App Content Area */}
            <div className="flex-1 pt-8 relative overflow-hidden">
              
              {/* HOME SCREEN */}
              {activeApp === 'home' && (
                <div className="absolute inset-0 bg-[url('https://i.postimg.cc/LXqgNmxN/year-2026-year-2025-year-2024-animated-production-art-promotional-art-no-t-s-1639780823.png')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                  
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Clock Widget */}
                    <div className="mt-12 mb-12 text-center">
                      <h2 className="text-6xl font-light text-white tracking-tighter">03:17</h2>
                      <p className="text-zinc-400 text-sm mt-2">화요일, 3월 17일</p>
                    </div>

                    {/* App Grid */}
                    <div className="grid grid-cols-4 gap-y-8 gap-x-4 mt-auto mb-8">
                      {/* Messages App */}
                      <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => window.open('https://share.crack.wrtn.ai/lzojfba', '_blank')}>
                        <div className="w-16 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(34,197,94,0.5)] group-hover:scale-105 transition-transform border border-green-300/30">
                          <MessageCircle fill="white" size={32} className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Messages</span>
                      </div>

                      {/* Music App */}
                      <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveApp('music')}>
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-transform border border-pink-300/30">
                          <Play fill="white" size={32} className="ml-1 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Music</span>
                      </div>

                      {/* DeepWeb App */}
                      <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActiveApp('deepweb')}>
                        <div className="w-16 h-16 bg-red-950 border-2 border-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.8)] group-hover:scale-105 transition-transform relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay" />
                          <span className="text-red-500 font-black text-3xl tracking-tighter z-10 drop-shadow-[0_0_8px_rgba(255,0,0,1)]">DW</span>
                        </div>
                        <span className="text-sm text-red-400 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">DEEPWEB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MUSIC APP */}
              {activeApp === 'music' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-zinc-900 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center p-4">
                    <button onClick={() => setActiveApp('home')} className="p-2 text-zinc-400 hover:text-white"><ArrowLeft size={20} /></button>
                    <span className="text-xs font-bold tracking-widest uppercase">Now Playing</span>
                    <button className="p-2 text-zinc-400"><MoreHorizontal size={20} /></button>
                  </div>

                  {/* Album Art / Video Player */}
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className={`w-full aspect-square bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden relative ${isPlaying ? 'scale-100' : 'scale-95'} transition-transform duration-500`}>
                      {!isPlaying ? (
                        <>
                          <img src="https://i.postimg.cc/nLpsbvT5/1.webp" alt="Album Art" className="w-full h-full object-cover filter contrast-125 brightness-75" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </>
                      ) : (
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src="https://www.youtube.com/embed/GToAIpJKUkA?autoplay=1" 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="p-8 pb-12">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Obsession</h3>
                        <p className="text-sm text-zinc-400">Sihyeok</p>
                      </div>
                      <Heart size={24} className="text-zinc-500" />
                    </div>

                    {/* Progress */}
                    <div className="mb-8">
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-1/3" />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                        <span>1:24</span>
                        <span>-2:45</span>
                      </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex justify-between items-center px-4">
                      <SkipBack size={28} className="text-white" fill="currentColor" />
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                      >
                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                      </button>
                      <SkipForward size={28} className="text-white" fill="currentColor" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* DEEPWEB APP */}
              {activeApp === 'deepweb' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-black flex flex-col font-mono"
                >
                  {/* Glitch Overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none z-50" />
                  
                  {/* Header */}
                  <div className="bg-zinc-900 border-b border-red-900/30 p-4 flex items-center justify-between sticky top-0 z-40">
                    <button onClick={() => setActiveApp('home')} className="text-red-500"><ArrowLeft size={20} /></button>
                    <span className="text-red-500 font-bold tracking-widest text-sm">DarkNest</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </div>

                  {/* Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-12 custom-scrollbar">
                    
                    {/* Post 1 */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-900 text-white text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse">LIVE</span>
                        <h4 className="text-zinc-200 text-sm font-bold truncate">의붓누나 샤워하는 거 도촬 ㅋㅋ</h4>
                      </div>
                      
                      {/* Fake Video Player */}
                      <div className="w-full aspect-video bg-black border border-zinc-800 rounded mb-3 relative flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-zinc-900 animate-pulse opacity-20" />
                        <Play size={32} className="text-zinc-700 group-hover:text-red-500 transition-colors relative z-10" />
                        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-red-500 bg-black/80 px-1.5 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> 1,204 watching
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                        지금 실시간으로 도촬 중. 몸매 지리지 않냐? 아무것도 모르고 꼼꼼하게 씻는 거 진짜 ㅋㅋㅋ 명령 아무거나 내려줘봐. 불 끄면 무슨 반응일지 궁금하진 않냐? 아니면 그냥 카메라 들이밀고 들어갈까 ㅋㅋㅋ
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-zinc-500 border-t border-zinc-800 pt-3 mb-3">
                        <span className="flex items-center gap-1 text-red-500/80"><Heart size={14} fill="currentColor" /> 892</span>
                        <span className="flex items-center gap-1"><MessageCircle size={14} /> 156</span>
                        <span className="flex items-center gap-1"><Share2 size={14} /> Share</span>
                      </div>

                      {/* Comments */}
                      <div className="bg-black/40 rounded p-3 space-y-3 text-[10px]">
                        <div className="flex gap-2">
                          <span className="text-cyan-600 font-bold shrink-0">user_shock:</span>
                          <span className="text-zinc-400">와 ㅋㅋㅋ 리얼하네. 가족한테 저래도 되냐? ㅋㅋㅋㅋ</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-600 font-bold shrink-0">user_medic:</span>
                          <span className="text-zinc-400">야, 할 거면 기절하지 않게 잘 다뤄.</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-600 font-bold shrink-0">user_sadist:</span>
                          <span className="text-zinc-400">XX에 XX 넣는 건 어떰? 아니면 XX하거나 ㅋㅋㅋ</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-yellow-600 font-bold shrink-0">user_rich:</span>
                          <span className="text-zinc-400">영상 통화 가능? 실시간으로 명령 내리고 돈 쏠게.</span>
                        </div>
                        <div className="flex gap-2 border-l-2 border-red-900 pl-2">
                          <span className="text-red-500 font-bold shrink-0">Admin_Dark:</span>
                          <span className="text-zinc-300">@Writer 이거 대박이다. 메인 배너 확정. 라이브 방송 기능 열어줄 테니까 제대로 보여줘 봐.</span>
                        </div>
                      </div>
                    </div>

                    {/* Post 2 */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-orange-900 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">HOT</span>
                        <h4 className="text-zinc-200 text-sm font-bold truncate">자는 ASMR (feat. 이불 걷어올리기)</h4>
                      </div>
                      
                      {/* Fake Audio Player */}
                      <div className="w-full h-12 bg-black border border-zinc-800 rounded mb-3 flex items-center px-3 gap-3">
                        <Play size={16} className="text-zinc-500" />
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-orange-900" />
                        </div>
                        <span className="text-[10px] text-zinc-500">14:20</span>
                      </div>

                      <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                        잘 때 입 벌리고 자는 거 XX지 않냐? ㅋㅋㅋㅋ 저 입에 XX하고 싶네. 입술 만지면 깨려나?
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-zinc-500 border-t border-zinc-800 pt-3 mb-3">
                        <span className="flex items-center gap-1 text-orange-500/80"><Heart size={14} fill="currentColor" /> 512</span>
                        <span className="flex items-center gap-1"><MessageCircle size={14} /> 89</span>
                      </div>

                      {/* Comments */}
                      <div className="bg-black/40 rounded p-3 space-y-3 text-[10px]">
                        <div className="flex gap-2">
                          <span className="text-cyan-600 font-bold shrink-0">ChokeMeDaddy:</span>
                          <span className="text-zinc-400">와 형님 취향 배우신 분 ㄷㄷ 저 표정 리얼함 미쳤네</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-600 font-bold shrink-0">User_88:</span>
                          <span className="text-zinc-400">저러다 일어나는 거 아님? ㅋㅋㅋ 일어나서 놀라면 더 좋고</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-600 font-bold shrink-0">User_Master:</span>
                          <span className="text-zinc-400">자는 모습 예술이네. ㅊㅊ</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-green-600 font-bold shrink-0">Newbie:</span>
                          <span className="text-zinc-400">와 숨 소리 쥑인다... 이어폰 필수네 이거</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

            </div>
            
            {/* Home Indicator */}
            <div className="h-6 w-full flex justify-center items-center bg-black/50 backdrop-blur-md z-50 absolute bottom-0 left-0">
              <div 
                className="w-1/3 h-1 bg-zinc-600 rounded-full cursor-pointer hover:bg-white transition-colors"
                onClick={() => setActiveApp('home')}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.5);
        }
      `}} />
    </div>
    </>
  );
};
