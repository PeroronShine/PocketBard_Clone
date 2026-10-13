import { SoundConfig } from '../audio/AudioEngine';

export const soundLibrary: SoundConfig[] = [
  // ===========================
  // 🍺 ТАВЕРНА
  // ===========================
  // Ambient
  {
    id: 'tavern-fire', name: 'Камин', icon: '🔥', category: 'tavern',
    type: 'noise', mode: 'loop', description: 'Потрескивание дров в камине',
    params: { noiseType: 'brown', filterFreq: 800, filterQ: 0.5 }
  },
  {
    id: 'tavern-crowd', name: 'Разговоры', icon: '🗣️', category: 'tavern',
    type: 'noise', mode: 'loop', description: 'Гул голосов в таверне',
    params: { noiseType: 'pink', filterFreq: 2000, filterQ: 2 }
  },
  {
    id: 'tavern-music', name: 'Лютня', icon: '🎵', category: 'tavern',
    type: 'ambient', mode: 'loop', description: 'Тихая музыка барда',
    params: { frequencies: [262, 330, 392, 523], lfoRate: 0.3, lfoDepth: 4 }
  },
  // One-shots
  {
    id: 'tavern-door', name: 'Стук в дверь', icon: '🚪', category: 'tavern',
    type: 'noise', mode: 'oneshot', description: 'Тяжёлый стук в дубовую дверь',
    params: { noiseType: 'brown', filterFreq: 300, filterQ: 2, duration: 0.8, attackTime: 0.005, decayTime: 0.1, releaseTime: 0.3 }
  },
  {
    id: 'tavern-glass', name: 'Разбитый стакан', icon: '🥃', category: 'tavern',
    type: 'noise', mode: 'oneshot', description: 'Звон разбивающегося стекла',
    params: { noiseType: 'white', filterFreq: 8000, filterQ: 8, duration: 1.2, attackTime: 0.001, decayTime: 0.1, releaseTime: 0.8,
      filterEnvelope: { from: 10000, to: 2000, time: 0.8 } }
  },
  {
    id: 'tavern-laugh', name: 'Хохот', icon: '😂', category: 'tavern',
    type: 'tone', mode: 'oneshot', description: 'Громкий хохот пьяницы',
    params: { frequencies: [180, 220, 280], duration: 1.5, attackTime: 0.05, decayTime: 0.3, releaseTime: 0.5,
      lfoRate: 8, lfoDepth: 30 }
  },
  {
    id: 'tavern-coin', name: 'Монеты', icon: '🪙', category: 'tavern',
    type: 'tone', mode: 'oneshot', description: 'Звон монет на стойке',
    params: { frequencies: [3000, 4500, 6000], duration: 1.0, attackTime: 0.001, decayTime: 0.05, releaseTime: 0.7, detune: 50 }
  },
  {
    id: 'tavern-brawl', name: 'Начало драки', icon: '💢', category: 'tavern',
    type: 'noise', mode: 'oneshot', description: 'Перевёрнутый стол и крики',
    params: { noiseType: 'pink', filterFreq: 3000, filterQ: 1, duration: 2.0, attackTime: 0.01, decayTime: 0.2, sustainLevel: 0.7, releaseTime: 0.8 }
  },

  // ===========================
  // 🌲 ЛЕС
  // ===========================
  // Ambient
  {
    id: 'forest-wind', name: 'Ветер', icon: '🌬️', category: 'forest',
    type: 'noise', mode: 'loop', description: 'Шелест листвы на ветру',
    params: { noiseType: 'pink', filterFreq: 1500, filterQ: 1 }
  },
  {
    id: 'forest-birds', name: 'Птицы', icon: '🐦', category: 'forest',
    type: 'tone', mode: 'loop', description: 'Пение лесных птиц',
    params: { frequencies: [2400, 3200, 4000], lfoRate: 5, lfoDepth: 200, detune: 100 }
  },
  {
    id: 'forest-creek', name: 'Ручей', icon: '💧', category: 'forest',
    type: 'noise', mode: 'loop', description: 'Журчание лесного ручья',
    params: { noiseType: 'white', filterFreq: 4000, filterQ: 3 }
  },
  {
    id: 'forest-crickets', name: 'Сверчки', icon: '🦗', category: 'forest',
    type: 'tone', mode: 'loop', description: 'Стрекотание сверчков',
    params: { frequencies: [4500, 4800], lfoRate: 15, lfoDepth: 100, detune: 50 }
  },
  // One-shots
  {
    id: 'forest-branch', name: 'Треск ветки', icon: '🌿', category: 'forest',
    type: 'noise', mode: 'oneshot', description: 'Хруст сухой ветки под ногой',
    params: { noiseType: 'brown', filterFreq: 2000, filterQ: 3, duration: 0.4, attackTime: 0.001, decayTime: 0.05, releaseTime: 0.2 }
  },
  {
    id: 'forest-howl', name: 'Волчий вой', icon: '🐺', category: 'forest',
    type: 'tone', mode: 'oneshot', description: 'Далёкий вой волка',
    params: { frequencies: [200], duration: 3.0, attackTime: 0.5, decayTime: 0.5, sustainLevel: 0.6, releaseTime: 1.0,
      pitchEnvelope: { from: 180, to: 350, time: 1.0 }, lfoRate: 3, lfoDepth: 15 }
  },
  {
    id: 'forest-thunder', name: 'Гром', icon: '⛈️', category: 'forest',
    type: 'noise', mode: 'oneshot', description: 'Раскат грома вдали',
    params: { noiseType: 'brown', filterFreq: 200, filterQ: 0.5, duration: 3.0, attackTime: 0.01, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 2.0 }
  },
  {
    id: 'forest-rustle', name: 'Шорох в кустах', icon: '🍃', category: 'forest',
    type: 'noise', mode: 'oneshot', description: 'Загадочный шорох в зарослях',
    params: { noiseType: 'pink', filterFreq: 3000, filterQ: 4, duration: 1.5, attackTime: 0.1, decayTime: 0.3, releaseTime: 0.8 }
  },
  {
    id: 'forest-owl', name: 'Уханье совы', icon: '🦉', category: 'forest',
    type: 'tone', mode: 'oneshot', description: 'Два ухания совы',
    params: { frequencies: [350], duration: 2.0, attackTime: 0.05, decayTime: 0.3, releaseTime: 0.5,
      pitchEnvelope: { from: 400, to: 300, time: 0.4 } }
  },

  // ===========================
  // ⚔️ БИТВА
  // ===========================
  // Ambient
  {
    id: 'battle-drums', name: 'Барабаны', icon: '🥁', category: 'battle',
    type: 'rhythm', mode: 'loop', description: 'Боевые барабаны',
    params: { frequencies: [60], rhythmPattern: [1, 0, 0.5, 0, 0.8, 0, 0.5, 0.3], rhythmBpm: 120 }
  },
  {
    id: 'battle-horns', name: 'Рога', icon: '📯', category: 'battle',
    type: 'tone', mode: 'loop', description: 'Боевые горны',
    params: { frequencies: [130, 195, 260], lfoRate: 0.5, lfoDepth: 8 }
  },
  {
    id: 'battle-chaos', name: 'Хаос битвы', icon: '💥', category: 'battle',
    type: 'noise', mode: 'loop', description: 'Общий шум сражения',
    params: { noiseType: 'pink', filterFreq: 3000, filterQ: 1.5 }
  },
  // One-shots
  {
    id: 'battle-sword', name: 'Звон мечей', icon: '⚔️', category: 'battle',
    type: 'noise', mode: 'oneshot', description: 'Удар стали о сталь',
    params: { noiseType: 'white', filterFreq: 8000, filterQ: 10, duration: 0.8, attackTime: 0.001, decayTime: 0.05, releaseTime: 0.5,
      filterEnvelope: { from: 12000, to: 1000, time: 0.6 } }
  },
  {
    id: 'battle-arrow', name: 'Свист стрелы', icon: '🏹', category: 'battle',
    type: 'noise', mode: 'oneshot', description: 'Стрела пролетает мимо',
    params: { noiseType: 'white', filterFreq: 5000, filterQ: 15, duration: 1.0, attackTime: 0.01, decayTime: 0.1, releaseTime: 0.5,
      filterEnvelope: { from: 2000, to: 8000, time: 0.4 } }
  },
  {
    id: 'battle-shield', name: 'Удар в щит', icon: '🛡️', category: 'battle',
    type: 'noise', mode: 'oneshot', description: 'Тяжёлый удар по щиту',
    params: { noiseType: 'brown', filterFreq: 1500, filterQ: 5, duration: 0.6, attackTime: 0.001, decayTime: 0.08, releaseTime: 0.3 }
  },
  {
    id: 'battle-cry', name: 'Боевой клич', icon: '🗡️', category: 'battle',
    type: 'tone', mode: 'oneshot', description: 'Яростный крик воина',
    params: { frequencies: [150, 200, 300], duration: 1.5, attackTime: 0.05, decayTime: 0.2, sustainLevel: 0.8, releaseTime: 0.5,
      pitchEnvelope: { from: 120, to: 250, time: 0.3 }, lfoRate: 6, lfoDepth: 20 }
  },
  {
    id: 'battle-explosion', name: 'Взрыв', icon: '💣', category: 'battle',
    type: 'noise', mode: 'oneshot', description: 'Взрыв магического снаряда',
    params: { noiseType: 'brown', filterFreq: 500, filterQ: 1, duration: 2.0, attackTime: 0.005, decayTime: 0.1, sustainLevel: 0.6, releaseTime: 1.5,
      filterEnvelope: { from: 2000, to: 100, time: 1.5 } }
  },

  // ===========================
  // 🏚️ ПОДЗЕМЕЛЬЕ
  // ===========================
  // Ambient
  {
    id: 'dungeon-drips', name: 'Капли', icon: '💧', category: 'dungeon',
    type: 'rhythm', mode: 'loop', description: 'Капающая вода',
    params: { frequencies: [3000], rhythmPattern: [0.3, 0, 0, 0, 0, 0, 0, 0.2, 0, 0, 0.4, 0, 0, 0, 0, 0], rhythmBpm: 30 }
  },
  {
    id: 'dungeon-wind', name: 'Сквозняк', icon: '🌫️', category: 'dungeon',
    type: 'noise', mode: 'loop', description: 'Зловещий сквозняк',
    params: { noiseType: 'brown', filterFreq: 400, filterQ: 3 }
  },
  {
    id: 'dungeon-drone', name: 'Зловещий гул', icon: '👁️', category: 'dungeon',
    type: 'ambient', mode: 'loop', description: 'Мистический гул подземелья',
    params: { frequencies: [55, 82, 110], lfoRate: 0.05, lfoDepth: 10 }
  },
  // One-shots
  {
    id: 'dungeon-chains', name: 'Звон цепей', icon: '⛓️', category: 'dungeon',
    type: 'noise', mode: 'oneshot', description: 'Цепи волочатся по камню',
    params: { noiseType: 'white', filterFreq: 6000, filterQ: 8, duration: 1.5, attackTime: 0.01, decayTime: 0.1, releaseTime: 1.0,
      filterEnvelope: { from: 8000, to: 2000, time: 1.2 } }
  },
  {
    id: 'dungeon-stone', name: 'Движение камня', icon: '🪨', category: 'dungeon',
    type: 'noise', mode: 'oneshot', description: 'Скрежет каменной плиты',
    params: { noiseType: 'brown', filterFreq: 600, filterQ: 2, duration: 2.5, attackTime: 0.2, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 1.0 }
  },
  {
    id: 'dungeon-scream', name: 'Крик в темноте', icon: '😱', category: 'dungeon',
    type: 'tone', mode: 'oneshot', description: 'Леденящий крик из глубины',
    params: { frequencies: [600], duration: 2.0, attackTime: 0.05, decayTime: 0.3, sustainLevel: 0.4, releaseTime: 1.0,
      pitchEnvelope: { from: 800, to: 400, time: 1.5 }, lfoRate: 10, lfoDepth: 50 }
  },
  {
    id: 'dungeon-footstep', name: 'Шаги', icon: '👣', category: 'dungeon',
    type: 'noise', mode: 'oneshot', description: 'Чьи-то шаги в темноте',
    params: { noiseType: 'brown', filterFreq: 800, filterQ: 3, duration: 2.0, attackTime: 0.005, decayTime: 0.05, releaseTime: 0.1,
      rhythmPattern: [0.5, 0, 0, 0.4, 0, 0, 0.5, 0, 0, 0.4, 0, 0], rhythmBpm: 60 }
  },
  {
    id: 'dungeon-roar', name: 'Рык чудовища', icon: '🐲', category: 'dungeon',
    type: 'noise', mode: 'oneshot', description: 'Глухой рык из темноты',
    params: { noiseType: 'brown', filterFreq: 400, filterQ: 4, duration: 2.5, attackTime: 0.1, decayTime: 0.3, sustainLevel: 0.7, releaseTime: 1.0,
      filterEnvelope: { from: 800, to: 200, time: 2.0 } }
  },

  // ===========================
  // 🏰 ГОРОД
  // ===========================
  // Ambient
  {
    id: 'city-market', name: 'Рынок', icon: '🏪', category: 'city',
    type: 'noise', mode: 'loop', description: 'Шум городского рынка',
    params: { noiseType: 'pink', filterFreq: 2500, filterQ: 1 }
  },
  {
    id: 'city-forge', name: 'Кузница', icon: '🔨', category: 'city',
    type: 'rhythm', mode: 'loop', description: 'Стук молота кузнеца',
    params: { frequencies: [800], rhythmPattern: [1, 0, 0, 0.6, 0, 0, 1, 0, 0, 0.6, 0, 0], rhythmBpm: 60 }
  },
  {
    id: 'city-bells', name: 'Колокола', icon: '🔔', category: 'city',
    type: 'tone', mode: 'loop', description: 'Звон городских колоколов',
    params: { frequencies: [523, 659, 784], lfoRate: 0.1, lfoDepth: 2 }
  },
  // One-shots
  {
    id: 'city-horses', name: 'Пролетка кареты', icon: '🐴', category: 'city',
    type: 'noise', mode: 'oneshot', description: 'Карета проехала по мостовой',
    params: { noiseType: 'brown', filterFreq: 1500, filterQ: 2, duration: 3.0, attackTime: 0.3, decayTime: 0.5, sustainLevel: 0.6, releaseTime: 1.5 }
  },
  {
    id: 'city-guard', name: 'Клич стражи', icon: '💂', category: 'city',
    type: 'tone', mode: 'oneshot', description: '«Стой, кто идёт!»',
    params: { frequencies: [200, 250], duration: 1.5, attackTime: 0.05, decayTime: 0.2, sustainLevel: 0.7, releaseTime: 0.5,
      lfoRate: 4, lfoDepth: 10 }
  },
  {
    id: 'city-announcement', name: 'Герольд', icon: '📜', category: 'city',
    type: 'tone', mode: 'oneshot', description: 'Труба герольда',
    params: { frequencies: [440, 554, 659], duration: 2.0, attackTime: 0.1, decayTime: 0.3, sustainLevel: 0.5, releaseTime: 0.8,
      pitchEnvelope: { from: 350, to: 500, time: 0.5 } }
  },
  {
    id: 'city-alarm', name: 'Тревога!', icon: '🚨', category: 'city',
    type: 'tone', mode: 'oneshot', description: 'Колокольный набат',
    params: { frequencies: [300, 380], duration: 3.0, attackTime: 0.05, decayTime: 0.2, sustainLevel: 0.8, releaseTime: 1.0,
      lfoRate: 6, lfoDepth: 5 }
  },

  // ===========================
  // ⛪ ХРАМ
  // ===========================
  // Ambient
  {
    id: 'temple-choir', name: 'Хор', icon: '🎶', category: 'temple',
    type: 'ambient', mode: 'loop', description: 'Мистическое хоровое пение',
    params: { frequencies: [220, 277, 330, 440], lfoRate: 0.2, lfoDepth: 5 }
  },
  {
    id: 'temple-incense', name: 'Благовония', icon: '🕯️', category: 'temple',
    type: 'noise', mode: 'loop', description: 'Тихое потрескивание',
    params: { noiseType: 'brown', filterFreq: 600, filterQ: 0.5 }
  },
  {
    id: 'temple-chant', name: 'Молитва', icon: '🙏', category: 'temple',
    type: 'tone', mode: 'loop', description: 'Монотонное пение монахов',
    params: { frequencies: [130, 195, 260], lfoRate: 0.08, lfoDepth: 3 }
  },
  // One-shots
  {
    id: 'temple-bell', name: 'Колокол храма', icon: '🔔', category: 'temple',
    type: 'tone', mode: 'oneshot', description: 'Один удар большого колокола',
    params: { frequencies: [130, 260, 390], duration: 4.0, attackTime: 0.01, decayTime: 0.5, sustainLevel: 0.3, releaseTime: 3.0, detune: 5 }
  },
  {
    id: 'temple-divine', name: 'Божественный свет', icon: '✨', category: 'temple',
    type: 'ambient', mode: 'oneshot', description: 'Вспышка священной энергии',
    params: { frequencies: [523, 659, 784, 1047], duration: 3.0, attackTime: 0.3, decayTime: 0.5, sustainLevel: 0.4, releaseTime: 2.0,
      lfoRate: 0.5, lfoDepth: 3 }
  },
  {
    id: 'temple-page', name: 'Перелистнутие', icon: '📖', category: 'temple',
    type: 'noise', mode: 'oneshot', description: 'Страница древнего фолианта',
    params: { noiseType: 'white', filterFreq: 5000, filterQ: 2, duration: 0.5, attackTime: 0.005, decayTime: 0.1, releaseTime: 0.3 }
  },
  {
    id: 'temple-omen', name: 'Зловещее знамение', icon: '☠️', category: 'temple',
    type: 'ambient', mode: 'oneshot', description: 'Тёмная аура заполняет храм',
    params: { frequencies: [65, 98, 130], duration: 4.0, attackTime: 0.5, decayTime: 1.0, sustainLevel: 0.6, releaseTime: 2.0,
      lfoRate: 0.1, lfoDepth: 8 }
  },

  // ===========================
  // 🌙 НОЧЬ
  // ===========================
  // Ambient
  {
    id: 'night-crickets', name: 'Ночные сверчки', icon: '🌙', category: 'night',
    type: 'tone', mode: 'loop', description: 'Стрекотание ночных насекомых',
    params: { frequencies: [4200, 4600], lfoRate: 12, lfoDepth: 80, detune: 30 }
  },
  {
    id: 'night-wind', name: 'Ночной ветер', icon: '🌬️', category: 'night',
    type: 'noise', mode: 'loop', description: 'Холодный ночной ветер',
    params: { noiseType: 'pink', filterFreq: 800, filterQ: 2 }
  },
  // One-shots
  {
    id: 'night-wolf', name: 'Волчий вой', icon: '🐺', category: 'night',
    type: 'tone', mode: 'oneshot', description: 'Одинокий вой в ночи',
    params: { frequencies: [200], duration: 3.5, attackTime: 0.5, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 1.5,
      pitchEnvelope: { from: 180, to: 380, time: 1.0 }, lfoRate: 4, lfoDepth: 20 }
  },
  {
    id: 'night-frog', name: 'Кваканье', icon: '🐸', category: 'night',
    type: 'rhythm', mode: 'oneshot', description: 'Всплеск лягушачьего хора',
    params: { frequencies: [400], duration: 3.0, rhythmPattern: [0.5, 0.3, 0, 0.5, 0.3, 0, 0.4, 0.2, 0, 0.5, 0.3, 0], rhythmBpm: 70 }
  },
  {
    id: 'night-ghost', name: 'Призрак', icon: '👻', category: 'night',
    type: 'ambient', mode: 'oneshot', description: 'Ледяной шёпот призрака',
    params: { frequencies: [300, 450, 600], duration: 3.0, attackTime: 0.5, decayTime: 0.5, sustainLevel: 0.3, releaseTime: 2.0,
      lfoRate: 2, lfoDepth: 30 }
  },
  {
    id: 'night-owl', name: 'Сова', icon: '🦉', category: 'night',
    type: 'tone', mode: 'oneshot', description: 'Угу-угу!',
    params: { frequencies: [380], duration: 1.5, attackTime: 0.05, decayTime: 0.2, releaseTime: 0.5,
      pitchEnvelope: { from: 420, to: 340, time: 0.3 } }
  },

  // ===========================
  // ✨ МАГИЯ
  // ===========================
  // Ambient
  {
    id: 'magic-crystal', name: 'Кристаллы', icon: '💎', category: 'magic',
    type: 'tone', mode: 'loop', description: 'Звон магических кристаллов',
    params: { frequencies: [880, 1108, 1320, 1760], lfoRate: 0.5, lfoDepth: 10, detune: 15 }
  },
  {
    id: 'magic-portal', name: 'Портал', icon: '🌀', category: 'magic',
    type: 'ambient', mode: 'loop', description: 'Гул магического портала',
    params: { frequencies: [100, 150, 200, 300], lfoRate: 1, lfoDepth: 20 }
  },
  {
    id: 'magic-ethereal', name: 'Эфир', icon: '🌌', category: 'magic',
    type: 'ambient', mode: 'loop', description: 'Звуки потустороннего мира',
    params: { frequencies: [174, 220, 261, 349], lfoRate: 0.08, lfoDepth: 15 }
  },
  // One-shots
  {
    id: 'magic-cast', name: 'Заклинание', icon: '🪄', category: 'magic',
    type: 'tone', mode: 'oneshot', description: 'Вспышка магической энергии',
    params: { frequencies: [440, 660, 880, 1320], duration: 1.5, attackTime: 0.01, decayTime: 0.2, sustainLevel: 0.4, releaseTime: 1.0,
      pitchEnvelope: { from: 200, to: 1200, time: 0.5 } }
  },
  {
    id: 'magic-sparkle', name: 'Искры', icon: '✨', category: 'magic',
    type: 'noise', mode: 'oneshot', description: 'Россыпь магических искр',
    params: { noiseType: 'white', filterFreq: 10000, filterQ: 10, duration: 0.8, attackTime: 0.005, decayTime: 0.1, releaseTime: 0.5,
      filterEnvelope: { from: 12000, to: 3000, time: 0.6 } }
  },
  {
    id: 'magic-summon', name: 'Призыв', icon: '🔮', category: 'magic',
    type: 'ambient', mode: 'oneshot', description: 'Мощный ритуал призыва',
    params: { frequencies: [55, 110, 165, 220, 330], duration: 4.0, attackTime: 0.5, decayTime: 1.0, sustainLevel: 0.7, releaseTime: 2.0,
      lfoRate: 2, lfoDepth: 15 }
  },
  {
    id: 'magic-teleport', name: 'Телепортация', icon: '💫', category: 'magic',
    type: 'tone', mode: 'oneshot', description: 'Исчезновение и появление',
    params: { frequencies: [500, 800, 1200], duration: 1.0, attackTime: 0.01, decayTime: 0.1, sustainLevel: 0.2, releaseTime: 0.5,
      pitchEnvelope: { from: 2000, to: 100, time: 0.8 } }
  },
  {
    id: 'magic-heal', name: 'Исцеление', icon: '💚', category: 'magic',
    type: 'ambient', mode: 'oneshot', description: 'Тёплый свет исцеления',
    params: { frequencies: [392, 494, 587], duration: 2.5, attackTime: 0.3, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 1.5,
      lfoRate: 0.3, lfoDepth: 3 }
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
    ]
  },
  {
    id: 'swamp-horror',
    name: 'Ужас на болоте',
    description: 'Зловещая трясина полна опасностей',
    icon: '🐊',
    sounds: [
      { id: 'dungeon-wind', volume: 0.4 },
      { id: 'night-wind', volume: 0.3 },
      { id: 'dungeon-drone', volume: 0.2 },
    ]
  },
];
