import { create } from 'zustand';
import { storage } from '../utils/storage';

export interface UserProfile {
  name: string;
  goals: string[];
  experience: string | null;
  location: string[];
  equipment: string[];
  age: string;
  height: string;
  weight: string;
  daysPerWeek: string;
  workoutDuration: string;
  trainingStyle: string;
}

interface UserState {
  profile: UserProfile;
  isLoaded: boolean;
  setProfile: (profile: Partial<UserProfile>) => void;
  loadProfile: () => Promise<void>;
  saveProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: 'Alex',
  goals: [],
  experience: null,
  location: [],
  equipment: [],
  age: '',
  height: '',
  weight: '',
  daysPerWeek: '4',
  workoutDuration: '60 min',
  trainingStyle: 'custom',
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: defaultProfile,
  isLoaded: false,

  setProfile: (updates) => {
    set((state) => ({
      profile: { ...state.profile, ...updates },
    }));
  },

  loadProfile: async () => {
    const saved = await storage.getUserProfile();
    if (saved) {
      set({ profile: { ...defaultProfile, ...saved }, isLoaded: true });
    } else {
      set({ isLoaded: true });
    }
  },

  saveProfile: async () => {
    const { profile } = get();
    await storage.saveUserProfile(profile);
  },
}));
