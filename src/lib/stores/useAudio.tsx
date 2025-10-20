import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  clickSound: HTMLAudioElement | null;
  cardSlideSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setClickSound: (sound: HTMLAudioElement) => void;
  setCardSlideSound: (sound: HTMLAudioElement) => void;
  
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playClick: () => void;
  playCardSlide: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  clickSound: null,
  cardSlideSound: null,
  isMuted: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setClickSound: (sound) => set({ clickSound: sound }),
  setCardSlideSound: (sound) => set({ cardSlideSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playClick: () => {
    const { clickSound, isMuted } = get();
    if (clickSound && !isMuted) {
      const soundClone = clickSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.2;
      soundClone.play().catch(error => {
        console.log("Click sound play prevented:", error);
      });
    }
  },
  
  playCardSlide: () => {
    const { cardSlideSound, isMuted } = get();
    if (cardSlideSound && !isMuted) {
      const soundClone = cardSlideSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(error => {
        console.log("Card slide sound play prevented:", error);
      });
    }
  }
}));
