import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { playSound } from '../utils/sounds';
import { ArrowLeft, Music, FileText, Globe, X } from 'lucide-react';

interface RoomProps {
  onBack: () => void;
}

export const LickRoom = ({ onBack }: RoomProps) => {
  const [showText, setShowText] = useState(false);
  const [dropFallen, setDropFallen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [activeWindow, setActiveWindow] = useState<'none' | 'music' | 'notepad'>('none');

  useEffect(() => {
    // Sequence:
    // 0.5s: Drop starts falling
    // 1.5s: Drop hits ground, sound plays
    // 1.8s: Text appears
    // 4.5s: Text fades out
    // 5.5s: Intro finishes, main content appears

    const dropTimer = setTimeout(() => {
      setDropFallen(true);
      playSound('water');
    }, 1500);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1800);

    const finishTimer = setTimeout(() => {
      setShowText(false);
      setTimeout(() => setIntroFinished(true), 1000);
    }, 4500);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans relative overflow-hidden selection:bg-green-900 selection:text-white">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-3 text-slate-400 hover:text-white transition-colors bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg font-mono tracking-widest text-sm uppercase"
      >
        <ArrowLeft size={18} />
        Exit
      </button>

      {/* Intro Sequence */}
      <AnimatePresence>
        {!introFinished && (
          <motion.div 
            className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Water Drop Animation */}
            <motion.div
              className="absolute top-0 w-8 h-12 bg-blue-300 rounded-full opacity-80"
              style={{
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.2), 0 0 10px rgba(147,197,253,0.5)',
              }}
              initial={{ y: -100, scaleY: 1.2, scaleX: 0.8 }}
              animate={{
                y: ['-100px', '50vh'],
                scaleY: [1.2, 0.8],
                scaleX: [0.8, 1.2],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeIn",
                times: [0, 1],
              }}
            />

            {/* Splash Effect */}
            {dropFallen && (
              <motion.div
                className="absolute top-[50vh] w-16 h-4 border-2 border-blue-400 rounded-[50%] opacity-0"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}

            {/* Text Animation */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  className="z-10 mt-16"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <h1
                    className="text-6xl md:text-8xl font-bold text-blue-200 tracking-wider"
                    style={{
                      fontFamily: "'Gaegu', cursive",
                      textShadow: '0 4px 10px rgba(0,0,0,0.5), 0 0 20px rgba(147,197,253,0.3)',
                    }}
                  >
                    옆집남자
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Ambient lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/80 to-slate-950 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {introFinished && (
        <motion.div 
          className="relative min-h-screen w-full flex flex-col xl:flex-row items-center justify-center p-4 md:p-12 gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Background Image with claustrophobic overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://i.postimg.cc/Y2RzTr7X/year-2026-year-2025-year-2024-animated-production-art-promotional-art-no-t-s-567200246.png" 
              alt="Room Background" 
              className="w-full h-full object-cover filter brightness-[0.35] contrast-125 saturate-50"
              referrerPolicy="no-referrer"
            />
            {/* Vignette & Scanlines for depressing/game vibe */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.95)_100%)]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
          </div>

          {/* Profile Section */}
          <motion.div 
            className="relative z-10 w-full xl:w-1/3 max-w-md bg-black/80 backdrop-blur-md border border-green-900/50 p-6 shadow-[0_0_30px_rgba(0,255,0,0.05)] flex flex-col gap-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {/* Cyberpunk/Game UI Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500/50" />
            
            <div className="flex items-start gap-4 border-b border-green-900/30 pb-6">
              <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 border border-green-800/50 p-1 bg-black relative overflow-hidden group">
                <img 
                  src="https://i.postimg.cc/Hx49YHyD/image.webp" 
                  alt="Yoo Sun-woo" 
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-green-400 tracking-tighter mb-1">유선우</h2>
                <p className="text-green-600/60 font-mono text-[10px] uppercase tracking-widest">Lv.1 NPC?? / Target: {'{{user}}'}</p>
                <div className="mt-3 space-y-1 font-mono text-xs text-slate-400">
                  <p><span className="text-green-700/80">AGE:</span> 25세</p>
                  <p><span className="text-green-700/80">PHY:</span> 174cm / 58kg</p>
                </div>
              </div>
            </div>

            <div className="space-y-5 font-mono text-sm">
              <div>
                <h3 className="text-green-500/80 mb-2 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <span className="w-1 h-1 bg-green-500 inline-block" />
                  기본정보
                </h3>
                <ul className="text-slate-400 space-y-2 pl-3 border-l border-green-900/30 text-xs leading-relaxed">
                  <li><span className="text-green-700">외형:</span> 검은머리 / 검은눈</li>
                  <li><span className="text-green-700">생활:</span> 마땅한 직업이 있는 건 아니나 가끔 ai캐릭터챗을 만들어 용돈벌이중</li>
                </ul>
              </div>

              <div>
                <h3 className="text-green-500/80 mb-2 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <span className="w-1 h-1 bg-green-500 inline-block" />
                  성격
                </h3>
                <ul className="text-slate-400 space-y-2 pl-3 border-l border-green-900/30 text-xs leading-relaxed">
                  <li><span className="text-green-700">겉:</span> 찌질함</li>
                  <li><span className="text-green-700">속:</span> 상대방의 작은 친절에도 김칫국을 마시는 편</li>
                </ul>
              </div>

              <div className="bg-green-950/10 border border-green-900/20 p-3">
                <h3 className="text-green-500/60 mb-1 text-[10px] tracking-widest uppercase">■ 특징</h3>
                <p className="text-slate-400 text-xs">찐따같음</p>
              </div>
            </div>
          </motion.div>

          {/* Computer Interface */}
          <motion.div 
            className="relative z-10 w-full max-w-2xl aspect-[4/3] md:aspect-video bg-[#0a0a0a] border-4 border-[#1a1a1a] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,1)] p-2 flex flex-col"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {/* Monitor Bezel Details */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-32 h-5 bg-[#1a1a1a] rounded-b-lg flex justify-center items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
            </div>

            {/* Screen Content */}
            <div className="w-full h-full bg-[#002b36] relative overflow-hidden border border-black shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
              {/* Desktop Wallpaper/Grid */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#073642 1px, transparent 1px), linear-gradient(90deg, #073642 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              {/* Desktop Icons */}
              <div className="absolute top-4 left-4 flex flex-col gap-6">
                <button 
                  onClick={() => setActiveWindow('music')}
                  className="flex flex-col items-center gap-1 group w-16"
                >
                  <div className="w-10 h-10 bg-[#2aa198]/10 border border-[#2aa198]/50 flex items-center justify-center group-hover:bg-[#2aa198]/30 transition-colors">
                    <Music size={20} className="text-[#2aa198]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#839496] bg-black/50 px-1 group-hover:bg-[#2aa198] group-hover:text-black">Music.exe</span>
                </button>

                <button 
                  onClick={() => setActiveWindow('notepad')}
                  className="flex flex-col items-center gap-1 group w-16"
                >
                  <div className="w-10 h-10 bg-[#b58900]/10 border border-[#b58900]/50 flex items-center justify-center group-hover:bg-[#b58900]/30 transition-colors">
                    <FileText size={20} className="text-[#b58900]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#839496] bg-black/50 px-1 group-hover:bg-[#b58900] group-hover:text-black">메모장.txt</span>
                </button>

                <button 
                  onClick={() => window.open('https://share.crack.wrtn.ai/zl3gyv', '_blank')}
                  className="flex flex-col items-center gap-1 group w-16"
                >
                  <div className="w-10 h-10 bg-[#268bd2]/10 border border-[#268bd2]/50 flex items-center justify-center group-hover:bg-[#268bd2]/30 transition-colors">
                    <Globe size={20} className="text-[#268bd2]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#839496] bg-black/50 px-1 group-hover:bg-[#268bd2] group-hover:text-black">Internet</span>
                </button>
              </div>

              {/* Windows */}
              <AnimatePresence>
                {activeWindow === 'music' && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="absolute top-10 left-20 md:left-24 w-[80%] max-w-[400px] bg-[#002b36] border border-[#586e75] shadow-2xl flex flex-col"
                  >
                    {/* Window Title Bar */}
                    <div className="h-6 bg-[#073642] flex items-center justify-between px-2 border-b border-[#586e75]">
                      <span className="text-[10px] font-mono text-[#93a1a1] flex items-center gap-2">
                        <Music size={12} /> YouTube Player
                      </span>
                      <div className="flex gap-1">
                        <button className="w-3 h-3 bg-[#586e75] hover:bg-[#93a1a1]" />
                        <button className="w-3 h-3 bg-[#586e75] hover:bg-[#93a1a1]" />
                        <button onClick={() => setActiveWindow('none')} className="w-3 h-3 bg-[#dc322f] hover:bg-[#cb4b16] flex items-center justify-center">
                          <X size={10} className="text-black" />
                        </button>
                      </div>
                    </div>
                    {/* Window Content */}
                    <div className="p-1 aspect-video bg-black">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/fGizrX4JjPg?autoplay=1" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  </motion.div>
                )}

                {activeWindow === 'notepad' && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="absolute top-20 left-10 md:left-32 w-[80%] max-w-[300px] bg-[#fdf6e3] border border-[#93a1a1] shadow-2xl flex flex-col"
                  >
                    {/* Window Title Bar */}
                    <div className="h-6 bg-[#eee8d5] flex items-center justify-between px-2 border-b border-[#93a1a1]">
                      <span className="text-[10px] font-mono text-[#586e75] flex items-center gap-2">
                        <FileText size={12} /> 메모장.txt - Notepad
                      </span>
                      <div className="flex gap-1">
                        <button className="w-3 h-3 bg-[#93a1a1] hover:bg-[#586e75]" />
                        <button className="w-3 h-3 bg-[#93a1a1] hover:bg-[#586e75]" />
                        <button onClick={() => setActiveWindow('none')} className="w-3 h-3 bg-[#dc322f] hover:bg-[#cb4b16] flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    </div>
                    {/* Window Content */}
                    <div className="p-4 font-mono text-xs md:text-sm text-[#002b36] min-h-[200px] leading-relaxed">
                      <p>1. 옆집 사람과 인사</p>
                      <p>2. 편의점 다녀오기...</p>
                      <p>3. 배고파...</p>
                      <p>4. 옆집 사람 너무 친절해... 나, 나 좋아하시나?</p>
                      <div className="w-2 h-4 bg-[#002b36] animate-pulse mt-2" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
