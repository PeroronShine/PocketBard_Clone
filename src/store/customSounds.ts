import { SoundConfig, SoundType, SoundMode } from '../audio/AudioEngine';

export interface CustomSound {
  id: string;
  name: string;
  icon: string;
  category: string;
  subCategory: 'music' | 'ambient' | 'effect';
  mode: SoundMode;
  description: string;
  fileDataUrl: string; // base64 data URL
  fileMimeType: string;
  volume: number;
  createdAt: number;
}

const STORAGE_KEY = 'pocketbard_custom_sounds';
const SETTINGS_KEY = 'pocketbard_settings';

export interface AppSettings {
  masterVolume: number;
}

export function loadCustomSounds(): CustomSound[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomSounds(sounds: CustomSound[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sounds));
  } catch (e) {
    console.error('Failed to save custom sounds', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { masterVolume: 0.7 };
    return JSON.parse(raw);
  } catch {
    return { masterVolume: 0.7 };
  }
}

export function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function addCustomSound(sound: Omit<CustomSound, 'id' | 'createdAt'>): CustomSound {
  const sounds = loadCustomSounds();
  const newSound: CustomSound = {
    ...sound,
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  sounds.push(newSound);
  saveCustomSounds(sounds);
  return newSound;
}

export function updateCustomSound(id: string, updates: Partial<CustomSound>) {
  const sounds = loadCustomSounds();
  const idx = sounds.findIndex(s => s.id === id);
  if (idx !== -1) {
    sounds[idx] = { ...sounds[idx], ...updates };
    saveCustomSounds(sounds);
  }
}

export function deleteCustomSound(id: string) {
  const sounds = loadCustomSounds().filter(s => s.id !== id);
  saveCustomSounds(sounds);
}

// Convert custom sounds to SoundConfig for the audio engine
export function customSoundToConfig(sound: CustomSound): SoundConfig {
  return {
    id: sound.id,
    name: sound.name,
    icon: sound.icon,
    category: sound.category,
    type: 'custom' as SoundType,
    mode: sound.mode,
    subCategory: sound.subCategory,
    description: sound.description || 'Пользовательский звук',
    params: {
      fileDataUrl: sound.fileDataUrl,
      fileMimeType: sound.fileMimeType,
    },
  };
}

export const categoryIcons: Record<string, string> = {
  tavern: '🍺',
  forest: '🌲',
  battle: '⚔️',
  dungeon: '🏚️',
  city: '🏰',
  temple: '⛪',
  night: '🌙',
  magic: '✨',
};

export const categoryNames: Record<string, string> = {
  tavern: 'Таверна',
  forest: 'Лес',
  battle: 'Битва',
  dungeon: 'Подземелье',
  city: 'Город',
  temple: 'Храм',
  night: 'Ночь',
  magic: 'Магия',
};
