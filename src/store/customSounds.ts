import { SoundConfig } from '../audio/AudioEngine';
import { soundLibrary as defaultSounds } from '../data/sounds';

export interface CustomSound {
  id: string;
  name: string;
  icon: string;
  category: string;
  subCategory: 'music' | 'ambient' | 'effect';
  mode: 'loop' | 'oneshot';
  description: string;
  fileDataUrl: string;
  fileMimeType: string;
  volume: number;
  createdAt: number;
  isDefault?: boolean;
}

const CUSTOM_SOUNDS_KEY = 'pocketbard_custom_sounds';
const SOUND_EDITS_KEY = 'pocketbard_sound_edits';
const SETTINGS_KEY = 'pocketbard_settings';

export interface AppSettings {
  masterVolume: number;
}

export interface SoundEdit {
  id: string;
  name?: string;
  icon?: string;
  description?: string;
  category?: string;
  subCategory?: 'music' | 'ambient' | 'effect';
  fileDataUrl?: string;
  fileMimeType?: string;
}

// Settings
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

// Custom sounds (user-added)
export function loadCustomSounds(): CustomSound[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SOUNDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomSounds(sounds: CustomSound[]) {
  try {
    localStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(sounds));
  } catch (e) {
    console.error('Failed to save custom sounds', e);
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

export function deleteCustomSound(id: string) {
  const sounds = loadCustomSounds().filter(s => s.id !== id);
  saveCustomSounds(sounds);
}

// Sound edits (modifications to default sounds)
export function loadSoundEdits(): Record<string, SoundEdit> {
  try {
    const raw = localStorage.getItem(SOUND_EDITS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveSoundEdits(edits: Record<string, SoundEdit>) {
  try {
    localStorage.setItem(SOUND_EDITS_KEY, JSON.stringify(edits));
  } catch (e) {
    console.error('Failed to save sound edits', e);
  }
}

export function updateSoundEdit(id: string, updates: Partial<SoundEdit>) {
  const edits = loadSoundEdits();
  edits[id] = { ...edits[id], ...updates, id };
  saveSoundEdits(edits);
}

export function resetSoundEdit(id: string) {
  const edits = loadSoundEdits();
  delete edits[id];
  saveSoundEdits(edits);
}

// Get all sounds (default + custom, with edits applied)
export function getAllSounds(): SoundConfig[] {
  const edits = loadSoundEdits();
  const customSounds = loadCustomSounds();
  
  // Apply edits to default sounds
  const editedDefaults = defaultSounds.map(sound => {
    const edit = edits[sound.id];
    if (!edit) return sound;
    
    return {
      ...sound,
      name: edit.name || sound.name,
      icon: edit.icon || sound.icon,
      description: edit.description || sound.description,
      category: edit.category || sound.category,
      subCategory: edit.subCategory || sound.subCategory,
      params: {
        ...sound.params,
        fileDataUrl: edit.fileDataUrl || sound.params.fileDataUrl,
        fileMimeType: edit.fileMimeType || sound.params.fileMimeType,
      },
      type: edit.fileDataUrl ? 'custom' as const : sound.type,
    };
  });
  
  // Convert custom sounds to SoundConfig
  const customConfigs: SoundConfig[] = customSounds.map(sound => ({
    id: sound.id,
    name: sound.name,
    icon: sound.icon,
    category: sound.category,
    type: 'custom' as const,
    mode: sound.mode,
    subCategory: sound.subCategory,
    description: sound.description,
    params: {
      fileDataUrl: sound.fileDataUrl,
      fileMimeType: sound.fileMimeType,
    },
  }));
  
  return [...editedDefaults, ...customConfigs];
}

// Get all sounds as a unified list for settings (with metadata)
export interface UnifiedSound {
  id: string;
  name: string;
  icon: string;
  category: string;
  subCategory: 'music' | 'ambient' | 'effect';
  mode: 'loop' | 'oneshot';
  description: string;
  isDefault: boolean;
  hasEdits: boolean;
  fileDataUrl?: string;
  fileMimeType?: string;
}

export function getAllSoundsUnified(): UnifiedSound[] {
  const edits = loadSoundEdits();
  const customSounds = loadCustomSounds();
  
  // Default sounds with edits
  const defaultUnified: UnifiedSound[] = defaultSounds.map(sound => {
    const edit = edits[sound.id];
    const mode = sound.subCategory === 'effect' ? 'oneshot' as const : 'loop' as const;
    
    return {
      id: sound.id,
      name: edit?.name || sound.name,
      icon: edit?.icon || sound.icon,
      category: edit?.category || sound.category,
      subCategory: edit?.subCategory || sound.subCategory,
      mode,
      description: edit?.description || sound.description,
      isDefault: true,
      hasEdits: !!edit,
      fileDataUrl: edit?.fileDataUrl,
      fileMimeType: edit?.fileMimeType,
    };
  });
  
  // Custom sounds
  const customUnified: UnifiedSound[] = customSounds.map(sound => ({
    id: sound.id,
    name: sound.name,
    icon: sound.icon,
    category: sound.category,
    subCategory: sound.subCategory,
    mode: sound.mode,
    description: sound.description,
    isDefault: false,
    hasEdits: false,
    fileDataUrl: sound.fileDataUrl,
    fileMimeType: sound.fileMimeType,
  }));
  
  return [...defaultUnified, ...customUnified];
}

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
