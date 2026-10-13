import { SoundConfig } from '../audio/AudioEngine';

export const soundLibrary: SoundConfig[] = [
  // ===========================
  // 🍺 ТАВЕРНА
  // ===========================
  // Музыка
  {
    id: 'tavern-music-lute', name: 'Лютня барда', icon: '🎵', category: 'tavern',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Весёлая мелодия на лютне',
    params: { frequencies: [262, 330, 392], lfoRate: 0.3, lfoDepth: 4 }
  },
  {
    id: 'tavern-music-drink', name: 'Застольная песня', icon: '🍻', category: 'tavern',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Пьяная песнь пьяниц',
    params: { frequencies: [196, 247, 294], lfoRate: 0.5, lfoDepth: 6 }
  },
  {
    id: 'tavern-music-dance', name: 'Танцевальный мотив', icon: '💃', category: 'tavern',
    type: 'tone', mode: 'loop', subCategory: 'music', description: 'Ритм для танцев',
    params: { frequencies: [220, 330], lfoRate: 2, lfoDepth: 10 }
  },
  // Эмбиент
  {
    id: 'tavern-fire', name: 'Камин', icon: '🔥', category: 'tavern',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Потрескивание дров',
    params: { noiseType: 'brown', filterFreq: 600, filterQ: 0.7 }
  },
  {
    id: 'tavern-crowd', name: 'Гул толпы', icon: '🗣️', category: 'tavern',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Разговоры посетителей',
    params: { noiseType: 'pink', filterFreq: 2000, filterQ: 2 }
  },
  {
    id: 'tavern-rain', name: 'Дождь за окном', icon: '🌧️', category: 'tavern',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Стук капель по крыше',
    params: { noiseType: 'white', filterFreq: 3000, filterQ: 1 }
  },
  // Эффекты
  {
    id: 'tavern-door', name: 'Стук в дверь', icon: '🚪', category: 'tavern',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Тяжёлый стук',
    params: { noiseType: 'brown', filterFreq: 300, filterQ: 2, duration: 0.8, attackTime: 0.005, decayTime: 0.1, releaseTime: 0.3 }
  },
  {
    id: 'tavern-glass', name: 'Разбитый стакан', icon: '🥃', category: 'tavern',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Звон стекла',
    params: { noiseType: 'white', filterFreq: 8000, filterQ: 8, duration: 1.2, attackTime: 0.001, decayTime: 0.1, releaseTime: 0.8,
      filterEnvelope: { from: 10000, to: 2000, time: 0.8 } }
  },
  {
    id: 'tavern-laugh', name: 'Громкий хохот', icon: '😂', category: 'tavern',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Хохот пьяницы',
    params: { frequencies: [180, 220, 280], duration: 1.5, attackTime: 0.05, decayTime: 0.3, releaseTime: 0.5, lfoRate: 8, lfoDepth: 30 }
  },
  {
    id: 'tavern-coin', name: 'Монеты', icon: '🪙', category: 'tavern',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Звон монет',
    params: { frequencies: [3000, 4500, 6000], duration: 1.0, attackTime: 0.001, decayTime: 0.05, releaseTime: 0.7, detune: 50 }
  },
  {
    id: 'tavern-brawl', name: 'Драка', icon: '💢', category: 'tavern',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Перевёрнутый стол',
    params: { noiseType: 'pink', filterFreq: 3000, filterQ: 1, duration: 2.0, attackTime: 0.01, decayTime: 0.2, sustainLevel: 0.7, releaseTime: 0.8 }
  },

  // ===========================
  // 🌲 ЛЕС
  // ===========================
  // Музыка
  {
    id: 'forest-music-flute', name: 'Эльфийская флейта', icon: '🎶', category: 'forest',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Нежная мелодия',
    params: { frequencies: [523, 659, 784], lfoRate: 0.2, lfoDepth: 3 }
  },
  {
    id: 'forest-music-harp', name: 'Арфа друидов', icon: '🎼', category: 'forest',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Мистическая арфа',
    params: { frequencies: [330, 440, 554], lfoRate: 0.15, lfoDepth: 2 }
  },
  // Эмбиент
  {
    id: 'forest-wind', name: 'Ветер в кронах', icon: '🌬️', category: 'forest',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Шелест листвы',
    params: { noiseType: 'pink', filterFreq: 1500, filterQ: 1 }
  },
  {
    id: 'forest-birds', name: 'Пение птиц', icon: '🐦', category: 'forest',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Лесные птицы',
    params: { frequencies: [2400, 3200, 4000], lfoRate: 5, lfoDepth: 200, detune: 100 }
  },
  {
    id: 'forest-creek', name: 'Лесной ручей', icon: '💧', category: 'forest',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Журчание воды',
    params: { noiseType: 'white', filterFreq: 4000, filterQ: 3 }
  },
  {
    id: 'forest-crickets', name: 'Сверчки', icon: '🦗', category: 'forest',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Стрекотание',
    params: { frequencies: [4500, 4800], lfoRate: 15, lfoDepth: 100, detune: 50 }
  },
  // Эффекты
  {
    id: 'forest-branch', name: 'Треск ветки', icon: '🌿', category: 'forest',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Хруст под ногой',
    params: { noiseType: 'brown', filterFreq: 2000, filterQ: 3, duration: 0.4, attackTime: 0.001, decayTime: 0.05, releaseTime: 0.2 }
  },
  {
    id: 'forest-howl', name: 'Волчий вой', icon: '🐺', category: 'forest',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Далёкий вой',
    params: { frequencies: [200, 250, 300], duration: 3.0, attackTime: 0.5, decayTime: 0.5, sustainLevel: 0.6, releaseTime: 1.0,
      pitchEnvelope: { from: 180, to: 350, time: 1.0 }, lfoRate: 3, lfoDepth: 15 }
  },
  {
    id: 'forest-thunder', name: 'Раскат грома', icon: '⛈️', category: 'forest',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Гром вдали',
    params: { noiseType: 'brown', filterFreq: 200, filterQ: 0.5, duration: 3.0, attackTime: 0.01, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 2.0 }
  },
  {
    id: 'forest-rustle', name: 'Шорох в кустах', icon: '🍃', category: 'forest',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Что-то шевелится',
    params: { noiseType: 'pink', filterFreq: 3000, filterQ: 4, duration: 1.5, attackTime: 0.1, decayTime: 0.3, releaseTime: 0.8 }
  },
  {
    id: 'forest-owl', name: 'Уханье совы', icon: '🦉', category: 'forest',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Два ухания',
    params: { frequencies: [350], duration: 2.0, attackTime: 0.05, decayTime: 0.3, releaseTime: 0.5,
      pitchEnvelope: { from: 400, to: 300, time: 0.4 } }
  },

  // ===========================
  // ⚔️ БИТВА
  // ===========================
  // Музыка
  {
    id: 'battle-music-epic', name: 'Эпическая тема', icon: '🎺', category: 'battle',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Героическая музыка',
    params: { frequencies: [130, 196, 262], lfoRate: 0.3, lfoDepth: 5 }
  },
  {
    id: 'battle-music-dark', name: 'Тёмная тема', icon: '🎻', category: 'battle',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Зловещая музыка',
    params: { frequencies: [110, 139, 165], lfoRate: 0.2, lfoDepth: 8 }
  },
  // Эмбиент
  {
    id: 'battle-drums', name: 'Боевые барабаны', icon: '🥁', category: 'battle',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Ритм битвы',
    params: { frequencies: [60, 120], lfoRate: 2, lfoDepth: 20 }
  },
  {
    id: 'battle-horns', name: 'Боевые горны', icon: '📯', category: 'battle',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Гул рогов',
    params: { frequencies: [130, 195, 260], lfoRate: 0.5, lfoDepth: 8 }
  },
  {
    id: 'battle-chaos', name: 'Шум битвы', icon: '💥', category: 'battle',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Общий гул',
    params: { noiseType: 'pink', filterFreq: 3000, filterQ: 1.5 }
  },
  // Эффекты
  {
    id: 'battle-sword', name: 'Звон мечей', icon: '⚔️', category: 'battle',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Удар стали',
    params: { noiseType: 'white', filterFreq: 8000, filterQ: 10, duration: 0.8, attackTime: 0.001, decayTime: 0.05, releaseTime: 0.5,
      filterEnvelope: { from: 12000, to: 1000, time: 0.6 } }
  },
  {
    id: 'battle-arrow', name: 'Свист стрелы', icon: '🏹', category: 'battle',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Стрела пролетает',
    params: { noiseType: 'white', filterFreq: 5000, filterQ: 15, duration: 1.0, attackTime: 0.01, decayTime: 0.1, releaseTime: 0.5,
      filterEnvelope: { from: 2000, to: 8000, time: 0.4 } }
  },
  {
    id: 'battle-shield', name: 'Удар в щит', icon: '🛡️', category: 'battle',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Тяжёлый удар',
    params: { noiseType: 'brown', filterFreq: 1500, filterQ: 5, duration: 0.6, attackTime: 0.001, decayTime: 0.08, releaseTime: 0.3 }
  },
  {
    id: 'battle-cry', name: 'Боевой клич', icon: '🗡️', category: 'battle',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Крик воина',
    params: { frequencies: [150, 200, 300], duration: 1.5, attackTime: 0.05, decayTime: 0.2, sustainLevel: 0.8, releaseTime: 0.5,
      pitchEnvelope: { from: 120, to: 250, time: 0.3 }, lfoRate: 6, lfoDepth: 20 }
  },
  {
    id: 'battle-explosion', name: 'Взрыв', icon: '💣', category: 'battle',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Магический взрыв',
    params: { noiseType: 'brown', filterFreq: 500, filterQ: 1, duration: 2.0, attackTime: 0.005, decayTime: 0.1, sustainLevel: 0.6, releaseTime: 1.5,
      filterEnvelope: { from: 2000, to: 100, time: 1.5 } }
  },

  // ===========================
  // 🏚️ ПОДЗЕМЕЛЬЕ
  // ===========================
  // Музыка
  {
    id: 'dungeon-music-creepy', name: 'Зловещая мелодия', icon: '🎹', category: 'dungeon',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Мрачные аккорды',
    params: { frequencies: [110, 131, 165], lfoRate: 0.1, lfoDepth: 6 }
  },
  {
    id: 'dungeon-music-ancient', name: 'Древний мотив', icon: '📜', category: 'dungeon',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Забытая мелодия',
    params: { frequencies: [98, 147, 196], lfoRate: 0.08, lfoDepth: 4 }
  },
  // Эмбиент
  {
    id: 'dungeon-drips', name: 'Капли воды', icon: '💧', category: 'dungeon',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Капает с потолка',
    params: { noiseType: 'white', filterFreq: 3000, filterQ: 3 }
  },
  {
    id: 'dungeon-wind', name: 'Сквозняк', icon: '🌫️', category: 'dungeon',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Холодный ветер',
    params: { noiseType: 'brown', filterFreq: 400, filterQ: 3 }
  },
  {
    id: 'dungeon-drone', name: 'Мистический гул', icon: '👁️', category: 'dungeon',
    type: 'ambient', mode: 'loop', subCategory: 'ambient', description: 'Гул подземелья',
    params: { frequencies: [55, 82, 110], lfoRate: 0.05, lfoDepth: 10 }
  },
  // Эффекты
  {
    id: 'dungeon-chains', name: 'Звон цепей', icon: '⛓️', category: 'dungeon',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Цепи волочатся',
    params: { noiseType: 'white', filterFreq: 6000, filterQ: 8, duration: 1.5, attackTime: 0.01, decayTime: 0.1, releaseTime: 1.0,
      filterEnvelope: { from: 8000, to: 2000, time: 1.2 } }
  },
  {
    id: 'dungeon-stone', name: 'Движение камня', icon: '🪨', category: 'dungeon',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Скрежет плиты',
    params: { noiseType: 'brown', filterFreq: 600, filterQ: 2, duration: 2.5, attackTime: 0.2, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 1.0 }
  },
  {
    id: 'dungeon-scream', name: 'Крик в темноте', icon: '😱', category: 'dungeon',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Леденящий крик',
    params: { frequencies: [600], duration: 2.0, attackTime: 0.05, decayTime: 0.3, sustainLevel: 0.4, releaseTime: 1.0,
      pitchEnvelope: { from: 800, to: 400, time: 1.5 }, lfoRate: 10, lfoDepth: 50 }
  },
  {
    id: 'dungeon-footstep', name: 'Шаги в темноте', icon: '👣', category: 'dungeon',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Кто-то приближается',
    params: { noiseType: 'brown', filterFreq: 800, filterQ: 3, duration: 2.0, attackTime: 0.005, decayTime: 0.05, releaseTime: 0.1 }
  },
  {
    id: 'dungeon-roar', name: 'Рык чудовища', icon: '🐲', category: 'dungeon',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Глухой рык',
    params: { frequencies: [150, 200], duration: 2.5, attackTime: 0.1, decayTime: 0.3, sustainLevel: 0.7, releaseTime: 1.0,
      pitchEnvelope: { from: 100, to: 200, time: 1.0 }, lfoRate: 5, lfoDepth: 30 }
  },

  // ===========================
  // 🏰 ГОРОД
  // ===========================
  // Музыка
  {
    id: 'city-music-march', name: 'Городской марш', icon: '🎺', category: 'city',
    type: 'tone', mode: 'loop', subCategory: 'music', description: 'Торжественный марш',
    params: { frequencies: [262, 330], lfoRate: 1, lfoDepth: 10 }
  },
  {
    id: 'city-music-bard', name: 'Городской бард', icon: '🎸', category: 'city',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Уличная музыка',
    params: { frequencies: [330, 440, 523], lfoRate: 0.4, lfoDepth: 5 }
  },
  // Эмбиент
  {
    id: 'city-market', name: 'Шум рынка', icon: '🏪', category: 'city',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Городской базар',
    params: { noiseType: 'pink', filterFreq: 2500, filterQ: 1 }
  },
  {
    id: 'city-forge', name: 'Кузница', icon: '🔨', category: 'city',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Стук молота',
    params: { frequencies: [800], lfoRate: 1, lfoDepth: 20 }
  },
  {
    id: 'city-bells', name: 'Колокола', icon: '🔔', category: 'city',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Звон колоколов',
    params: { frequencies: [523, 659, 784], lfoRate: 0.1, lfoDepth: 2 }
  },
  // Эффекты
  {
    id: 'city-horses', name: 'Пролетка кареты', icon: '🐴', category: 'city',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Карета по мостовой',
    params: { noiseType: 'brown', filterFreq: 1500, filterQ: 2, duration: 3.0, attackTime: 0.3, decayTime: 0.5, sustainLevel: 0.6, releaseTime: 1.5 }
  },
  {
    id: 'city-guard', name: 'Клич стражи', icon: '💂', category: 'city',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: '«Стой, кто идёт!»',
    params: { frequencies: [200, 250], duration: 1.5, attackTime: 0.05, decayTime: 0.2, sustainLevel: 0.7, releaseTime: 0.5, lfoRate: 4, lfoDepth: 10 }
  },
  {
    id: 'city-announcement', name: 'Труба герольда', icon: '📜', category: 'city',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Важное объявление',
    params: { frequencies: [440, 554, 659], duration: 2.0, attackTime: 0.1, decayTime: 0.3, sustainLevel: 0.5, releaseTime: 0.8,
      pitchEnvelope: { from: 350, to: 500, time: 0.5 } }
  },
  {
    id: 'city-alarm', name: 'Колокольный набат', icon: '🚨', category: 'city',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Тревога!',
    params: { frequencies: [300, 380], duration: 3.0, attackTime: 0.05, decayTime: 0.2, sustainLevel: 0.8, releaseTime: 1.0, lfoRate: 6, lfoDepth: 5 }
  },

  // ===========================
  // ⛪ ХРАМ
  // ===========================
  // Музыка
  {
    id: 'temple-music-choir', name: 'Хорал', icon: '🎶', category: 'temple',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Священное пение',
    params: { frequencies: [220, 277, 330, 440], lfoRate: 0.2, lfoDepth: 5 }
  },
  {
    id: 'temple-music-organ', name: 'Орган', icon: '🎹', category: 'temple',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Торжественный орган',
    params: { frequencies: [130, 196, 262, 330], lfoRate: 0.1, lfoDepth: 3 }
  },
  // Эмбиент
  {
    id: 'temple-incense', name: 'Благовония', icon: '🕯️', category: 'temple',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Тихое потрескивание',
    params: { noiseType: 'brown', filterFreq: 600, filterQ: 0.5 }
  },
  {
    id: 'temple-chant', name: 'Молитва монахов', icon: '🙏', category: 'temple',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Монотонное пение',
    params: { frequencies: [130, 195, 260], lfoRate: 0.08, lfoDepth: 3 }
  },
  {
    id: 'temple-echo', name: 'Эхо храма', icon: '🏛️', category: 'temple',
    type: 'ambient', mode: 'loop', subCategory: 'ambient', description: 'Просторное эхо',
    params: { frequencies: [174, 220], lfoRate: 0.05, lfoDepth: 2 }
  },
  // Эффекты
  {
    id: 'temple-bell', name: 'Колокол храма', icon: '🔔', category: 'temple',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Один удар',
    params: { frequencies: [130, 260, 390], duration: 4.0, attackTime: 0.01, decayTime: 0.5, sustainLevel: 0.3, releaseTime: 3.0, detune: 5 }
  },
  {
    id: 'temple-divine', name: 'Божественный свет', icon: '✨', category: 'temple',
    type: 'ambient', mode: 'oneshot', subCategory: 'effect', description: 'Вспышка энергии',
    params: { frequencies: [523, 659, 784], duration: 3.0, attackTime: 0.3, decayTime: 0.5, sustainLevel: 0.4, releaseTime: 2.0, lfoRate: 0.5, lfoDepth: 3 }
  },
  {
    id: 'temple-page', name: 'Перелистнутие', icon: '📖', category: 'temple',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Страница фолианта',
    params: { noiseType: 'white', filterFreq: 5000, filterQ: 2, duration: 0.5, attackTime: 0.005, decayTime: 0.1, releaseTime: 0.3 }
  },
  {
    id: 'temple-omen', name: 'Зловещее знамение', icon: '☠️', category: 'temple',
    type: 'ambient', mode: 'oneshot', subCategory: 'effect', description: 'Тёмная аура',
    params: { frequencies: [65, 98, 130], duration: 4.0, attackTime: 0.5, decayTime: 1.0, sustainLevel: 0.6, releaseTime: 2.0, lfoRate: 0.1, lfoDepth: 8 }
  },

  // ===========================
  // 🌙 НОЧЬ
  // ===========================
  // Музыка
  {
    id: 'night-music-lullaby', name: 'Колыбельная', icon: '🎵', category: 'night',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Тихая колыбельная',
    params: { frequencies: [262, 330, 392], lfoRate: 0.15, lfoDepth: 2 }
  },
  {
    id: 'night-music-mystery', name: 'Ночная тайна', icon: '🌌', category: 'night',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Загадочная мелодия',
    params: { frequencies: [196, 247, 294, 370], lfoRate: 0.1, lfoDepth: 4 }
  },
  // Эмбиент
  {
    id: 'night-crickets', name: 'Ночные сверчки', icon: '🌙', category: 'night',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Стрекотание',
    params: { frequencies: [4200, 4600], lfoRate: 12, lfoDepth: 80, detune: 30 }
  },
  {
    id: 'night-wind', name: 'Ночной ветер', icon: '🌬️', category: 'night',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Холодный ветер',
    params: { noiseType: 'pink', filterFreq: 800, filterQ: 2 }
  },
  // Эффекты
  {
    id: 'night-wolf', name: 'Вой волка', icon: '🐺', category: 'night',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Одинокий вой',
    params: { frequencies: [200, 250, 300], duration: 3.5, attackTime: 0.5, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 1.5,
      pitchEnvelope: { from: 180, to: 380, time: 1.0 }, lfoRate: 4, lfoDepth: 20 }
  },
  {
    id: 'night-ghost', name: 'Призрак', icon: '👻', category: 'night',
    type: 'ambient', mode: 'oneshot', subCategory: 'effect', description: 'Ледяной шёпот',
    params: { frequencies: [300, 450, 600], duration: 3.0, attackTime: 0.5, decayTime: 0.5, sustainLevel: 0.3, releaseTime: 2.0, lfoRate: 2, lfoDepth: 30 }
  },
  {
    id: 'night-owl', name: 'Сова', icon: '🦉', category: 'night',
    type: 'tone', mode: 'oneshot', subCategory: 'effect', description: 'Угу-угу!',
    params: { frequencies: [380], duration: 1.5, attackTime: 0.05, decayTime: 0.2, releaseTime: 0.5,
      pitchEnvelope: { from: 420, to: 340, time: 0.3 } }
  },
  {
    id: 'night-door', name: 'Скрип двери', icon: '🚪', category: 'night',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Старая дверь',
    params: { noiseType: 'pink', filterFreq: 2000, filterQ: 8, duration: 1.5, attackTime: 0.1, decayTime: 0.3, releaseTime: 0.8,
      filterEnvelope: { from: 1000, to: 3000, time: 1.0 } }
  },

  // ===========================
  // ✨ МАГИЯ
  // ===========================
  // Музыка
  {
    id: 'magic-music-arcane', name: 'Арканная мелодия', icon: '🎼', category: 'magic',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Магическая музыка',
    params: { frequencies: [220, 277, 330, 440, 554], lfoRate: 0.25, lfoDepth: 6 }
  },
  {
    id: 'magic-music-ethereal', name: 'Эфирная музыка', icon: '🌌', category: 'magic',
    type: 'ambient', mode: 'loop', subCategory: 'music', description: 'Потусторонние звуки',
    params: { frequencies: [174, 220, 261, 349], lfoRate: 0.08, lfoDepth: 15 }
  },
  // Эмбиент
  {
    id: 'magic-crystal', name: 'Кристаллы', icon: '💎', category: 'magic',
    type: 'tone', mode: 'loop', subCategory: 'ambient', description: 'Звон кристаллов',
    params: { frequencies: [880, 1108, 1320], lfoRate: 0.5, lfoDepth: 10, detune: 15 }
  },
  {
    id: 'magic-portal', name: 'Портал', icon: '🌀', category: 'magic',
    type: 'ambient', mode: 'loop', subCategory: 'ambient', description: 'Гул портала',
    params: { frequencies: [100, 150, 200, 300], lfoRate: 1, lfoDepth: 20 }
  },
  {
    id: 'magic-sparkle-bg', name: 'Магический фон', icon: '✨', category: 'magic',
    type: 'noise', mode: 'loop', subCategory: 'ambient', description: 'Мерцание маны',
    params: { noiseType: 'white', filterFreq: 8000, filterQ: 5 }
  },
  // Эффекты
  {
    id: 'magic-cast', name: 'Заклинание', icon: '🪄', category: 'magic',
    type: 'ambient', mode: 'oneshot', subCategory: 'effect', description: 'Вспышка магии',
    params: { frequencies: [440, 660, 880], duration: 1.5, attackTime: 0.01, decayTime: 0.2, sustainLevel: 0.4, releaseTime: 1.0,
      pitchEnvelope: { from: 200, to: 1200, time: 0.5 } }
  },
  {
    id: 'magic-sparkle', name: 'Искры', icon: '✨', category: 'magic',
    type: 'noise', mode: 'oneshot', subCategory: 'effect', description: 'Россыпь искр',
    params: { noiseType: 'white', filterFreq: 10000, filterQ: 10, duration: 0.8, attackTime: 0.005, decayTime: 0.1, releaseTime: 0.5,
      filterEnvelope: { from: 12000, to: 3000, time: 0.6 } }
  },
  {
    id: 'magic-summon', name: 'Призыв', icon: '🔮', category: 'magic',
    type: 'ambient', mode: 'oneshot', subCategory: 'effect', description: 'Ритуал призыва',
    params: { frequencies: [55, 110, 165, 220], duration: 4.0, attackTime: 0.5, decayTime: 1.0, sustainLevel: 0.7, releaseTime: 2.0, lfoRate: 2, lfoDepth: 15 }
  },
  {
    id: 'magic-teleport', name: 'Телепортация', icon: '💫', category: 'magic',
    type: 'ambient', mode: 'oneshot', subCategory: 'effect', description: 'Исчезновение',
    params: { frequencies: [500, 800, 1200], duration: 1.0, attackTime: 0.01, decayTime: 0.1, sustainLevel: 0.2, releaseTime: 0.5,
      pitchEnvelope: { from: 2000, to: 100, time: 0.8 } }
  },
  {
    id: 'magic-heal', name: 'Исцеление', icon: '💚', category: 'magic',
    type: 'ambient', mode: 'oneshot', subCategory: 'effect', description: 'Свет исцеления',
    params: { frequencies: [392, 494, 587], duration: 2.5, attackTime: 0.3, decayTime: 0.5, sustainLevel: 0.5, releaseTime: 1.5, lfoRate: 0.3, lfoDepth: 3 }
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
    id: 'tavern-evening', name: 'Вечер в таверне',
    description: 'Уютный вечер у камина с кружкой эля', icon: '🍺',
    sounds: [
      { id: 'tavern-fire', volume: 0.7 },
      { id: 'tavern-crowd', volume: 0.4 },
      { id: 'tavern-music-lute', volume: 0.3 },
    ]
  },
  {
    id: 'forest-journey', name: 'Путешествие через лес',
    description: 'Дневной переход через чащу', icon: '🌲',
    sounds: [
      { id: 'forest-wind', volume: 0.5 },
      { id: 'forest-birds', volume: 0.4 },
      { id: 'forest-creek', volume: 0.3 },
    ]
  },
  {
    id: 'boss-fight', name: 'Битва с боссом',
    description: 'Эпическое сражение', icon: '🐉',
    sounds: [
      { id: 'battle-drums', volume: 0.8 },
      { id: 'battle-horns', volume: 0.5 },
      { id: 'battle-chaos', volume: 0.6 },
    ]
  },
  {
    id: 'dungeon-explore', name: 'Исследование подземелья',
    description: 'Тихое продвижение вглубь', icon: '🕯️',
    sounds: [
      { id: 'dungeon-drips', volume: 0.5 },
      { id: 'dungeon-wind', volume: 0.4 },
      { id: 'dungeon-drone', volume: 0.3 },
    ]
  },
  {
    id: 'city-morning', name: 'Утро в городе',
    description: 'Пробуждение города', icon: '🌅',
    sounds: [
      { id: 'city-market', volume: 0.4 },
      { id: 'city-forge', volume: 0.3 },
      { id: 'city-bells', volume: 0.5 },
    ]
  },
  {
    id: 'dark-ritual', name: 'Тёмный ритуал',
    description: 'Зловещий обряд', icon: '🔮',
    sounds: [
      { id: 'temple-music-choir', volume: 0.5 },
      { id: 'temple-chant', volume: 0.6 },
      { id: 'magic-portal', volume: 0.4 },
    ]
  },
  {
    id: 'night-camp', name: 'Ночной лагерь',
    description: 'Отдых у костра', icon: '🏕️',
    sounds: [
      { id: 'tavern-fire', volume: 0.6 },
      { id: 'night-crickets', volume: 0.4 },
      { id: 'night-wind', volume: 0.3 },
    ]
  },
  {
    id: 'swamp-horror', name: 'Ужас на болоте',
    description: 'Зловещая трясина', icon: '🐊',
    sounds: [
      { id: 'dungeon-wind', volume: 0.4 },
      { id: 'night-wind', volume: 0.3 },
      { id: 'dungeon-drone', volume: 0.2 },
    ]
  },
];
