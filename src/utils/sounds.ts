export const SOUND_URLS = {
  creak: 'https://actions.google.com/sounds/v1/doors/creaking_wooden_door.ogg', // Door creaking
};

const audioInstances: Record<string, HTMLAudioElement> = {};
let audioCtx: AudioContext | null = null;
let isUnlocked = false;

export const initSounds = () => {
  try {
    if (typeof window === 'undefined') return;
    
    // Initialize Web Audio API context
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    
    // Resume context if suspended (unlocks Web Audio API)
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    // Preload HTML5 Audio for the creak
    if (!isUnlocked) {
      if (!audioInstances['creak']) {
        const audio = new Audio(SOUND_URLS.creak);
        audio.preload = 'auto';
        audioInstances['creak'] = audio;
      }
      isUnlocked = true;
    }
  } catch (e) {
    console.warn('Audio initialization failed:', e);
  }
};

// --- Synthesized Sounds (100% reliable, no network requests, plays inside setTimeouts) ---

const playSynthesizedShutter = () => {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  
  // Mechanical click 1
  const createClick = (time: number, freq: number) => {
    const osc = audioCtx!.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.03);
    
    const gain = audioCtx!.createGain();
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);
    
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    osc.start(time);
    osc.stop(time + 0.03);
  };

  createClick(t, 800); // Mirror up
  createClick(t + 0.08, 600); // Mirror down

  // Shutter noise burst
  const bufferSize = audioCtx.sampleRate * 0.15;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.3, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(t);
};

const playSynthesizedDrop = () => {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1); // Bloop up
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.8, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.1);
};

const playSynthesizedSplash = () => {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  
  const bufferSize = audioCtx.sampleRate * 0.4;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0, t);
  noiseGain.gain.linearRampToValueAtTime(0.6, t + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.8;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  
  noise.start(t);
};

export const playSound = (type: 'creak' | 'shutter' | 'drop' | 'water') => {
  try {
    // Ensure Web Audio API is running
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (type === 'shutter') {
      playSynthesizedShutter();
      return;
    }
    if (type === 'drop') {
      playSynthesizedDrop();
      return;
    }
    if (type === 'water') {
      playSynthesizedSplash();
      return;
    }

    // HTML5 Audio for the creak (triggered directly by user click)
    if (type === 'creak') {
      let audio = audioInstances['creak'];
      if (!audio) {
        audio = new Audio(SOUND_URLS.creak);
        audioInstances['creak'] = audio;
      }
      
      // Clear any existing fade timeouts
      if ((audio as any).fadeTimeout) clearTimeout((audio as any).fadeTimeout);
      if ((audio as any).fadeInterval) clearInterval((audio as any).fadeInterval);

      audio.currentTime = 0;
      audio.volume = 1.0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          (audio as any).fadeTimeout = setTimeout(() => {
            let vol = 1.0;
            (audio as any).fadeInterval = setInterval(() => {
              if (vol > 0.1) {
                vol -= 0.1;
                audio.volume = vol;
              } else {
                clearInterval((audio as any).fadeInterval);
                audio.pause();
              }
            }, 50);
          }, 1500); // Start fading out at 1.5s, finishes around 2.0s
        }).catch(e => console.warn("Creak play failed:", e));
      }
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};
