import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { playSound, initSounds } from '../utils/sounds';

interface HallwayProps {
  onEnterRoom: (room: 'sweat' | 'brother' | 'lick') => void;
}

export const Hallway = ({ onEnterRoom }: HallwayProps) => {
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);
  const [openedDoor, setOpenedDoor] = useState<string | null>(null);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize audio on mount if possible, or on first interaction
    const handleFirstInteraction = () => {
      initSounds();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleDoorClick = (room: 'sweat' | 'brother' | 'lick', event: React.MouseEvent) => {
    if (openedDoor) return; // Prevent multiple clicks
    initSounds(); // Ensure sounds are initialized
    playSound('creak');
    setOpenedDoor(room);

    // Calculate exact center of the clicked door to zoom into it
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const doorCenterX = rect.left + rect.width / 2;
    const doorCenterY = rect.top + rect.height / 2;

    setCameraOffset({
      x: centerX - doorCenterX,
      y: centerY - doorCenterY
    });
    
    // Wait 4 seconds for the slow door opening & zoom animation before entering
    setTimeout(() => {
      onEnterRoom(room);
    }, 4000);
  };

  const doors = [
    {
      id: 'sweat',
      label: 'Sweat',
      color: '#fcd34d',
      bg: 'linear-gradient(145deg, #4a2e1b, #2a160b)',
      panel: 'border-[#5c3a21] bg-[#3d2212]',
      glow: 'rgba(252, 211, 77, 0.4)'
    },
    {
      id: 'brother',
      label: 'Brother',
      color: '#e0f2fe',
      bg: 'linear-gradient(145deg, #27272a, #18181b)',
      panel: 'border-[#3f3f46] bg-[#202023]',
      glow: 'rgba(224, 242, 254, 0.4)'
    },
    {
      id: 'lick',
      label: 'Lick',
      color: '#93c5fd',
      bg: 'linear-gradient(145deg, #1e293b, #0f172a)',
      panel: 'border-[#334155] bg-[#152033]',
      glow: 'rgba(147, 197, 253, 0.4)'
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#030303] overflow-hidden relative" style={{ perspective: '1200px' }}>
      {/* Ambient Fog / Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-30 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-30 pointer-events-none" />

      {/* 3D Zoom Container */}
      <motion.div
        className="w-full h-full absolute inset-0 flex items-center justify-center"
        initial={{ translateZ: -800, x: 0, y: 0, opacity: 0 }}
        animate={{ 
          translateZ: openedDoor ? 900 : 0, 
          x: openedDoor ? cameraOffset.x : 0,
          y: openedDoor ? cameraOffset.y : 0,
          opacity: 1 
        }}
        transition={{ duration: openedDoor ? 4 : 3.5, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Scene Wrapper */}
        <div className="relative w-full max-w-7xl h-[80vh] flex justify-center items-end gap-8 md:gap-24 pb-10" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* 3D Floor with Realistic Reflections */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] h-[800px] origin-top"
            style={{ 
              transform: 'rotateX(75deg) translateY(10px) translateZ(-50px)',
              background: 'linear-gradient(to bottom, #0a0a0a, #020202)',
              boxShadow: 'inset 0 300px 200px -50px #000'
            }}
          >
            {/* Floor Tiles Pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
              backgroundSize: '100px 100px'
            }} />

            {/* Light Reflections on Floor */}
            <div className="flex justify-center gap-8 md:gap-24 w-full max-w-7xl mx-auto h-full px-10 relative z-10">
              {doors.map(door => (
                <div key={`reflection-${door.id}`} className="w-40 md:w-56 h-full relative">
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[600px]"
                    style={{
                      background: `linear-gradient(to bottom, ${door.glow} 0%, transparent 100%)`,
                      filter: 'blur(30px)'
                    }}
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: (hoveredDoor === door.id || openedDoor === door.id) ? 0.6 : 0.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Door opening light spill */}
                  {openedDoor === door.id && (
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-[300%] h-[800px]"
                      style={{
                        background: `linear-gradient(to bottom, #ffffff 0%, transparent 100%)`,
                        filter: 'blur(40px)'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{ duration: 2 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Doors */}
          {doors.map((door) => (
            <div key={door.id} className="relative flex flex-col items-center group z-10" style={{ transformStyle: 'preserve-3d' }}>
              
              {/* Hanging Lamp */}
              <div className="absolute -top-[600px] left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                <div className="w-1 h-[550px] bg-gradient-to-r from-neutral-800 to-neutral-600 shadow-[2px_0_5px_rgba(0,0,0,0.8)]" />
                <div className="w-28 h-14 bg-gradient-to-b from-neutral-700 to-neutral-900 rounded-t-full border-b-[4px] border-black relative flex justify-center shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
                  <motion.div
                    className="absolute -bottom-2 w-10 h-10 rounded-full"
                    style={{ backgroundColor: door.color }}
                    animate={{ 
                      opacity: (hoveredDoor === door.id || openedDoor === door.id) ? 1 : 0.3,
                      boxShadow: (hoveredDoor === door.id || openedDoor === door.id)
                        ? `0 0 60px 20px ${door.color}, 0 40px 120px 40px ${door.color}` 
                        : `0 0 20px 5px ${door.color}`
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Door Frame */}
              <div className="relative w-40 md:w-56 h-[22rem] md:h-[30rem]" style={{ perspective: '1200px' }}>
                {/* Frame Depth */}
                <div className="absolute inset-0 border-[16px] md:border-[20px] border-neutral-900 shadow-[0_0_50px_rgba(0,0,0,1)_inset,_0_30px_60px_rgba(0,0,0,0.9)] rounded-t-xl bg-black overflow-visible">
                  
                  {/* The Void (Behind the door) */}
                  <div className="absolute inset-0 bg-white shadow-[0_0_100px_rgba(255,255,255,0.8)_inset]" style={{ opacity: openedDoor === door.id ? 1 : 0, transition: 'opacity 2s' }} />

                  {/* Actual Door */}
                  <motion.div
                    className="w-full h-full origin-left relative flex flex-col items-center py-8 md:py-12 cursor-pointer shadow-[inset_-10px_0_40px_rgba(0,0,0,0.9)] border-r border-t border-white/10"
                    style={{ background: door.bg }}
                    onHoverStart={() => !openedDoor && setHoveredDoor(door.id)}
                    onHoverEnd={() => !openedDoor && setHoveredDoor(null)}
                    onClick={(e) => handleDoorClick(door.id, e)}
                    animate={{ 
                      rotateY: openedDoor === door.id ? -105 : (hoveredDoor === door.id && !openedDoor ? -10 : 0),
                      scale: (hoveredDoor === door.id && !openedDoor) ? 1.02 : 1
                    }}
                    transition={{ 
                      duration: openedDoor === door.id ? 4 : 0.4, 
                      ease: openedDoor === door.id ? [0.25, 0.1, 0.25, 1] : "easeOut" 
                    }}
                  >
                    {/* Nameplate */}
                    <div className="bg-gradient-to-b from-neutral-200 to-neutral-400 border-2 border-neutral-500 px-4 py-2 md:px-6 md:py-3 rounded shadow-[0_5px_15px_rgba(0,0,0,0.8)] mb-6 md:mb-10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-50" />
                      <span 
                        className="text-black font-mono text-xs md:text-sm tracking-widest uppercase font-black relative z-10"
                        style={{ textShadow: '0 1px 1px rgba(255,255,255,0.8)' }}
                      >
                        {door.label}
                      </span>
                    </div>
                    
                    {/* Door Panels (High Quality) */}
                    <div className={`w-2/3 h-1/4 ${door.panel} shadow-[inset_0_10px_30px_rgba(0,0,0,0.9),_0_2px_0_rgba(255,255,255,0.15)] rounded mb-4 md:mb-6 border border-black/50`} />
                    <div className={`w-2/3 h-1/4 ${door.panel} shadow-[inset_0_10px_30px_rgba(0,0,0,0.9),_0_2px_0_rgba(255,255,255,0.15)] rounded border border-black/50`} />

                    {/* Door Knob (Realistic) */}
                    <div className="absolute right-3 md:right-5 top-1/2 flex items-center justify-center">
                      {/* Backplate */}
                      <div className="absolute w-6 h-12 md:w-8 md:h-16 bg-gradient-to-b from-yellow-700 to-yellow-900 rounded-sm shadow-[0_5px_10px_rgba(0,0,0,0.8)] border border-yellow-600/50" />
                      {/* Knob */}
                      <div className="relative w-5 h-5 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-900 shadow-[0_5px_15px_rgba(0,0,0,0.9),_inset_0_2px_5px_rgba(255,255,255,0.6)] border border-yellow-800" />
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
