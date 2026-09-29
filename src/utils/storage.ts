import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ONBOARDING: '@fitpro_onboarding_complete',
  USER_PROFILE: '@fitpro_user_profile',
  WORKOUT_HISTORY: '@fitpro_workout_history',
  WORKOUT_SETS: '@fitpro_workout_sets',
  EXERCISE_HISTORY: '@fitpro_exercise_history',
  PERSONAL_RECORDS: '@fitpro_personal_records',
  REST_TIMER_CONFIG: '@fitpro_rest_timer_config',
  SAVED_VIDEOS: '@fitpro_saved_videos',
  WORKOUT_PROGRESS: '@fitpro_workout_progress',
  USER_SETTINGS: '@fitpro_user_settings',
};

export const storage = {
  // Onboarding
  async isOnboardingComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.ONBOARDING);
      return value === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ONBOARDING, 'true');
    } catch {
      // silently fail
    }
  },

  // User Profile
  async getUserProfile(): Promise<any> {
    try {
      const json = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async saveUserProfile(profile: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch {
      // silently fail
    }
  },

  // Workout History
  async getWorkoutHistory(): Promise<any[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.WORKOUT_HISTORY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async saveWorkoutHistory(history: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.WORKOUT_HISTORY, JSON.stringify(history));
    } catch {
      // silently fail
    }
  },

  // Workout Sets (detailed set logs)
  async getWorkoutSets(): Promise<Record<string, any[]>> {
    try {
      const json = await AsyncStorage.getItem(KEYS.WORKOUT_SETS);
      return json ? JSON.parse(json) : {};
    } catch {
      return {};
    }
  },

  async saveWorkoutSets(sets: Record<string, any[]>): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.WORKOUT_SETS, JSON.stringify(sets));
    } catch {
      // silently fail
    }
  },

  // Exercise History (per exercise)
  async getExerciseHistory(): Promise<Record<string, any[]>> {
    try {
      const json = await AsyncStorage.getItem(KEYS.EXERCISE_HISTORY);
      return json ? JSON.parse(json) : {};
    } catch {
      return {};
    }
  },

  async saveExerciseHistory(history: Record<string, any[]>): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.EXERCISE_HISTORY, JSON.stringify(history));
    } catch {
      // silently fail
    }
  },

  // Personal Records
  async getPersonalRecords(): Promise<Record<string, any>> {
    try {
      const json = await AsyncStorage.getItem(KEYS.PERSONAL_RECORDS);
      return json ? JSON.parse(json) : {};
    } catch {
      return {};
    }
  },

  async savePersonalRecords(records: Record<string, any>): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.PERSONAL_RECORDS, JSON.stringify(records));
    } catch {
      // silently fail
    }
  },

  // Rest Timer Config
  async getRestTimerConfig(): Promise<any> {
    try {
      const json = await AsyncStorage.getItem(KEYS.REST_TIMER_CONFIG);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async saveRestTimerConfig(config: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.REST_TIMER_CONFIG, JSON.stringify(config));
    } catch {
      // silently fail
    }
  },

  // Saved Videos
  async getSavedVideos(): Promise<any[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.SAVED_VIDEOS);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async saveSavedVideos(videos: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SAVED_VIDEOS, JSON.stringify(videos));
    } catch {
      // silently fail
    }
  },

  // Active Workout
  async getActiveWorkout(): Promise<any> {
    try {
      const json = await AsyncStorage.getItem(KEYS.WORKOUT_PROGRESS);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async saveActiveWorkout(workout: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.WORKOUT_PROGRESS, JSON.stringify(workout));
    } catch {
      // silently fail
    }
  },

  async clearActiveWorkout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.WORKOUT_PROGRESS);
    } catch {
      // silently fail
    }
  },

  // User Settings
  async getUserSettings(): Promise<any> {
    try {
      const json = await AsyncStorage.getItem(KEYS.USER_SETTINGS);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async saveUserSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch {
      // silently fail
    }
  },

  // Clear all
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch {
      // silently fail
    }
  },
};
