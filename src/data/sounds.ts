import { SoundConfig } from '../audio/AudioEngine';

export const soundLibrary: SoundConfig[] = [
  // === ТАВЕРНА ===
  {
    id: 'tavern-fire',
    name: 'Камин',
    icon: '🔥',
    category: 'tavern',
    type: 'noise',
    description: 'Потрескивание дров в камине',
    params: { noiseType: 'brown', filterFreq: 800, filterQ: 0.5 }
  },
  {
    id: 'tavern-crowd',
    name: 'Разговоры',
    icon: '🗣️',
    category: 'tavern',
    type: 'noise',
    description: 'Гул голосов в таверне',
    params: { noiseType: 'pink', filterFreq: 2000, filterQ: 2 }
  },
  {
    id: 'tavern-music',
    name: 'Лютня',
    icon: '🎵',
    category: 'tavern',
    type: 'ambient',
    description: 'Тихая музыка барда',
    params: { frequencies: [262, 330, 392, 523], lfoRate: 0.3, lfoDepth: 4 }
  },
  {
    id: 'tavern-glasses',
    name: 'Посуда',
    icon: '🍺',
    category: 'tavern',
    type: 'rhythm',
    description: 'Звон кружек и посуды',
    params: { frequencies: [2000], rhythmPattern: [0.3, 0, 0, 0, 0.2, 0, 0.4, 0], rhythmBpm: 40 }
  },

  // === ЛЕС ===
  {
    id: 'forest-wind',
    name: 'Ветер',
    icon: '🌬️',
    category: 'forest',
    type: 'noise',
    description: 'Шелест листвы на ветру',
    params: { noiseType: 'pink', filterFreq: 1500, filterQ: 1 }
  },
  {
    id: 'forest-birds',
    name: 'Птицы',
    icon: '🐦',
    category: 'forest',
    type: 'tone',
    description: 'Пение лесных птиц',
    params: { frequencies: [2400, 3200, 4000], lfoRate: 5, lfoDepth: 200, detune: 100 }
  },
  {
    id: 'forest-creek',
    name: 'Ручей',
    icon: '💧',
    category: 'forest',
    type: 'noise',
    description: 'Журчание лесного ручья',
    params: { noiseType: 'white', filterFreq: 4000, filterQ: 3 }
  },
  {
    id: 'forest-crickets',
    name: 'Сверчки',
    icon: '🦗',
    category: 'forest',
    type: 'tone',
    description: 'Стрекотание сверчков',
    params: { frequencies: [4500, 4800], lfoRate: 15, lfoDepth: 100, detune: 50 }
  },
  {
    id: 'forest-owl',
    name: 'Сова',
    icon: '🦉',
    category: 'forest',
    type: 'rhythm',
    description: 'Уханье совы в ночи',
    params: { frequencies: [350], rhythmPattern: [0.4, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0], rhythmBpm: 20 }
  },

  // === БИТВА ===
  {
    id: 'battle-drums',
    name: 'Барабаны',
    icon: '🥁',
    category: 'battle',
    type: 'rhythm',
    description: 'Боевые барабаны',
    params: { frequencies: [60], rhythmPattern: [1, 0, 0.5, 0, 0.8, 0, 0.5, 0.3], rhythmBpm: 120 }
  },
  {
    id: 'battle-horns',
    name: 'Рога',
    icon: '📯',
    category: 'battle',
    type: 'tone',
    description: 'Боевые горны',
    params: { frequencies: [130, 195, 260], lfoRate: 0.5, lfoDepth: 8 }
  },
  {
    id: 'battle-clash',
    name: 'Звон мечей',
    icon: '⚔️',
    category: 'battle',
    type: 'noise',
    description: 'Лязг металла',
    params: { noiseType: 'white', filterFreq: 6000, filterQ: 8 }
  },
  {
    id: 'battle-chaos',
    name: 'Хаос битвы',
    icon: '💥',
    category: 'battle',
    type: 'noise',
    description: 'Общий шум сражения',
    params: { noiseType: 'pink', filterFreq: 3000, filterQ: 1.5 }
  },
  {
    id: 'battle-chants',
    name: 'Вопли',
    icon: '🗡️',
    category: 'battle',
    type: 'ambient',
    description: 'Боевые кличи',
    params: { frequencies: [150, 200, 300], lfoRate: 2, lfoDepth: 30 }
  },

  // === ПОДЗЕМЕЛЬЕ ===
  {
    id: 'dungeon-drips',
    name: 'Капли',
    icon: '💧',
    category: 'dungeon',
    type: 'rhythm',
    description: 'Капающая вода',
    params: { frequencies: [3000], rhythmPattern: [0.3, 0, 0, 0, 0, 0, 0, 0.2, 0, 0, 0.4, 0, 0, 0, 0, 0], rhythmBpm: 30 }
  },
  {
    id: 'dungeon-wind',
    name: 'Сквозняк',
    icon: '🌫️',
    category: 'dungeon',
    type: 'noise',
    description: 'Зловещий сквозняк',
    params: { noiseType: 'brown', filterFreq: 400, filterQ: 3 }
  },
  {
    id: 'dungeon-chains',
    name: 'Цепи',
    icon: '⛓️',
    category: 'dungeon',
    type: 'rhythm',
    description: 'Звон цепей',
    params: { frequencies: [5000], rhythmPattern: [0, 0, 0, 0.2, 0, 0, 0, 0, 0, 0.15, 0, 0], rhythmBpm: 50 }
  },
  {
    id: 'dungeon-drone',
    name: 'Зловещий гул',
    icon: '👁️',
    category: 'dungeon',
    type: 'ambient',
    description: 'Мистический гул подземелья',
    params: { frequencies: [55, 82, 110], lfoRate: 0.05, lfoDepth: 10 }
  },
  {
    id: 'dungeon-rats',
    name: 'Крысы',
    icon: '🐀',
    category: 'dungeon',
    type: 'noise',
    description: 'Шорох крыс',
    params: { noiseType: 'white', filterFreq: 8000, filterQ: 5 }
  },

  // === ГОРОД ===
  {
    id: 'city-market',
    name: 'Рынок',
    icon: '🏪',
    category: 'city',
    type: 'noise',
    description: 'Шум городского рынка',
    params: { noiseType: 'pink', filterFreq: 2500, filterQ: 1 }
  },
  {
    id: 'city-forge',
    name: 'Кузница',
    icon: '🔨',
    category: 'city',
    type: 'rhythm',
    description: 'Стук молота кузнеца',
    params: { frequencies: [800], rhythmPattern: [1, 0, 0, 0.6, 0, 0, 1, 0, 0, 0.6, 0, 0], rhythmBpm: 60 }
  },
  {
    id: 'city-bells',
    name: 'Колокола',
    icon: '🔔',
    category: 'city',
    type: 'tone',
    description: 'Звон городских колоколов',
    params: { frequencies: [523, 659, 784], lfoRate: 0.1, lfoDepth: 2 }
  },
  {
    id: 'city-horses',
    name: 'Лошади',
    icon: '🐴',
    category: 'city',
    type: 'rhythm',
    description: 'Цокот копыт',
    params: { frequencies: [300], rhythmPattern: [0.5, 0.3, 0.5, 0.3, 0, 0, 0, 0], rhythmBpm: 90 }
  },

  // === ХРАМ ===
  {
    id: 'temple-choir',
    name: 'Хор',
    icon: '🎶',
    category: 'temple',
    type: 'ambient',
    description: 'Мистическое хоровое пение',
    params: { frequencies: [220, 277, 330, 440], lfoRate: 0.2, lfoDepth: 5 }
  },
  {
    id: 'temple-incense',
    name: 'Благовония',
    icon: '🕯️',
    category: 'temple',
    type: 'noise',
    description: 'Тихое потрескивание',
    params: { noiseType: 'brown', filterFreq: 600, filterQ: 0.5 }
  },
  {
    id: 'temple-chant',
    name: 'Молитва',
    icon: '🙏',
    category: 'temple',
    type: 'tone',
    description: 'Монотонное пение монахов',
    params: { frequencies: [130, 195, 260], lfoRate: 0.08, lfoDepth: 3 }
  },
  {
    id: 'temple-bowl',
    name: 'Чаша',
    icon: '🔮',
    category: 'temple',
    type: 'tone',
    description: 'Поющая тибетская чаша',
    params: { frequencies: [174, 348, 522], lfoRate: 0.15, lfoDepth: 2, detune: 5 }
  },

  // === НОЧЬ ===
  {
    id: 'night-crickets',
    name: 'Ночные сверчки',
    icon: '🌙',
    category: 'night',
    type: 'tone',
    description: 'Стрекотание ночных насекомых',
    params: { frequencies: [4200, 4600], lfoRate: 12, lfoDepth: 80, detune: 30 }
  },
  {
    id: 'night-wolf',
    name: 'Волки',
    icon: '🐺',
    category: 'night',
    type: 'rhythm',
    description: 'Вой волков вдали',
    params: { frequencies: [250], rhythmPattern: [0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], rhythmBpm: 15 }
  },
  {
    id: 'night-wind',
    name: 'Ночной ветер',
    icon: '🌬️',
    category: 'night',
    type: 'noise',
    description: 'Холодный ночной ветер',
    params: { noiseType: 'pink', filterFreq: 800, filterQ: 2 }
  },
  {
    id: 'night-frog',
    name: 'Лягушки',
    icon: '🐸',
    category: 'night',
    type: 'rhythm',
    description: 'Кваканье лягушек у болота',
    params: { frequencies: [400], rhythmPattern: [0.5, 0.3, 0, 0.5, 0.3, 0, 0, 0], rhythmBpm: 70 }
  },

  // === МАГИЯ ===
  {
    id: 'magic-crystal',
    name: 'Кристаллы',
    icon: '💎',
    category: 'magic',
    type: 'tone',
    description: 'Звон магических кристаллов',
    params: { frequencies: [880, 1108, 1320, 1760], lfoRate: 0.5, lfoDepth: 10, detune: 15 }
  },
  {
    id: 'magic-portal',
    name: 'Портал',
    icon: '🌀',
    category: 'magic',
    type: 'ambient',
    description: 'Гул магического портала',
    params: { frequencies: [100, 150, 200, 300], lfoRate: 1, lfoDepth: 20 }
  },
  {
    id: 'magic-sparkle',
    name: 'Искры',
    icon: '✨',
    category: 'magic',
    type: 'noise',
    description: 'Магические искры',
    params: { noiseType: 'white', filterFreq: 10000, filterQ: 10 }
  },
  {
    id: 'magic-ethereal',
    name: 'Эфир',
    icon: '🌌',
    category: 'magic',
    type: 'ambient',
    description: 'Звуки потустороннего мира',
    params: { frequencies: [174, 220, 261, 349], lfoRate: 0.08, lfoDepth: 15 }
  },
];

export const categories = [
  { id: 'tavern', name: 'Таверна', icon: '🍺', color: 'from-amber-600 to-orange-700' },
  { id: 'forest', name: 'Лес', icon: '🌲', color: 'from-green-600 to-emerald-700' },
  { id: 'battle', name: 'Битва', icon: '⚔️', color: 'from-red-600 to-rose-800' },
  { id: 'dungeon', name: 'Подземелье', icon: '🏚️', color: 'from-gray-600 to-slate-800' },
  { id: 'city', name: 'Город', icon: '🏰', color: 'from-blue-600 to-indigo-700' },
  { id: 'temple', name: 'Храм', icon: '⛪', color: 'from-purple-600 to-violet-800' },
  { id: 'night', name: 'Ночь', icon: '🌙', color: 'from-indigo-700 to-slate-900' },
  { id: 'magic', name: 'Магия', icon: '✨', color: 'from-fuchsia-600 to-purple-800' },
];

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  sounds: { id: string; volume: number }[];
}

export const presets: Preset[] = [
  {
    id: 'tavern-evening',
    name: 'Вечер в таверне',
    description: 'Уютный вечер у камина с кружкой эля',
    icon: '🍺',
    sounds: [
      { id: 'tavern-fire', volume: 0.7 },
      { id: 'tavern-crowd', volume: 0.4 },
      { id: 'tavern-music', volume: 0.3 },
      { id: 'tavern-glasses', volume: 0.2 },
    ]
  },
  {
    id: 'forest-journey',
    name: 'Путешествие через лес',
    description: 'Дневной переход через чащу',
    icon: '🌲',
    sounds: [
      { id: 'forest-wind', volume: 0.5 },
      { id: 'forest-birds', volume: 0.4 },
      { id: 'forest-creek', volume: 0.3 },
    ]
  },
  {
    id: 'boss-fight',
    name: 'Битва с боссом',
    description: 'Эпическое сражение с древним злом',
    icon: '🐉',
    sounds: [
      { id: 'battle-drums', volume: 0.8 },
      { id: 'battle-horns', volume: 0.5 },
      { id: 'battle-clash', volume: 0.4 },
      { id: 'battle-chaos', volume: 0.6 },
    ]
  },
  {
    id: 'dungeon-explore',
    name: 'Исследование подземелья',
    description: 'Тихое и напряжённое продвижение вглубь',
    icon: '🕯️',
    sounds: [
      { id: 'dungeon-drips', volume: 0.5 },
      { id: 'dungeon-wind', volume: 0.4 },
      { id: 'dungeon-drone', volume: 0.3 },
      { id: 'dungeon-rats', volume: 0.15 },
    ]
  },
  {
    id: 'city-morning',
    name: 'Утро в городе',
    description: 'Пробуждение крупного торгового города',
    icon: '🌅',
    sounds: [
      { id: 'city-market', volume: 0.4 },
      { id: 'city-forge', volume: 0.3 },
      { id: 'city-bells', volume: 0.5 },
      { id: 'city-horses', volume: 0.3 },
    ]
  },
  {
    id: 'dark-ritual',
    name: 'Тёмный ритуал',
    description: 'Культисты проводят зловещий обряд',
    icon: '🔮',
    sounds: [
      { id: 'temple-choir', volume: 0.5 },
      { id: 'temple-chant', volume: 0.6 },
      { id: 'magic-portal', volume: 0.4 },
      { id: 'magic-ethereal', volume: 0.3 },
    ]
  },
  {
    id: 'night-camp',
    name: 'Ночной лагерь',
    description: 'Отдых у костра под звёздным небом',
    icon: '🏕️',
    sounds: [
      { id: 'tavern-fire', volume: 0.6 },
      { id: 'night-crickets', volume: 0.4 },
      { id: 'night-wind', volume: 0.3 },
      { id: 'night-wolf', volume: 0.2 },
    ]
  },
  {
    id: 'swamp-horror',
    name: 'Ужас на болоте',
    description: 'Зловещая трясина полна опасностей',
    icon: '🐊',
    sounds: [
      { id: 'night-frog', volume: 0.5 },
      { id: 'dungeon-wind', volume: 0.4 },
      { id: 'night-wind', volume: 0.3 },
      { id: 'dungeon-drone', volume: 0.2 },
    ]
  },
];
