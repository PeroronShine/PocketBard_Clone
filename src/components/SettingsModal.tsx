import { useState, useRef, useEffect } from 'react';
import {
  UnifiedSound,
  AppSettings,
  loadSettings,
  saveSettings,
  getAllSoundsUnified,
  addCustomSound,
  deleteCustomSound,
  updateSoundEdit,
  resetSoundEdit,
  categoryNames,
} from '../store/customSounds';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AppSettings) => void;
  onSoundsChange: () => void;
}

const iconGroups = [
  { name: 'Существа', icons: ['🐺', '🐻', '🐉', '🦇', '🐍', '🐗', '🦅', '🐦', '🦉', '🦗', '🐸', '🐀', '🐴', '🐲', '🦂', '🕷️'] },
  { name: 'Мистика', icons: ['👻', '💀', '☠️', '🧟', '👹', '👺', '🧙', '🧝', '🧚', '🧞', '🦹', '🧛', '🧜', '👁️', '🔮', '👑'] },
  { name: 'Природа', icons: ['🌊', '🌋', '⛰️', '🌪️', '⚡', '🌧️', '☀️', '🌙', '⭐', '💫', '🌌', '🔥', '💧', '🌿', '🍃', '🌸'] },
  { name: 'Битва', icons: ['⚔️', '🗡️', '🏹', '🛡️', '💣', '💥', '🩸', '👊', '🪓', '🏴', '🚩', '🪖', '🎯', '🔱', '⛏️', '🪝'] },
  { name: 'Эмоции', icons: ['😱', '😂', '😡', '😈', '🤫', '🤐', '🎭', '💢', '✨', '💎', '🌟', '💫', '🎉', '😇', '🥶', '🤢'] },
  { name: 'Предметы', icons: ['🚪', '🔔', '🪙', '📜', '📖', '🕯️', '⛓️', '🪨', '🍺', '🍻', '🥃', '🍷', '🗝️', '⚱️', '🏺', '📯'] },
  { name: 'Локации', icons: ['🏰', '🏚️', '⛪', '🏪', '🏕️', '🌲', '🌌', '🕸️', '🏛️', '⛺', '🗿', '🌉', '🏔️', '🌁', '🏜️', '🌅'] },
  { name: 'Звуки', icons: ['🎵', '🎶', '🎼', '🔊', '🔈', '📢', '📣', '🎙️', '🎤', '💬', '🗣️', '👣', '🔗', '⏰', '🎪', '🎠'] },
];

export function SettingsModal({ isOpen, onClose, onSettingsChange, onSoundsChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [allSounds, setAllSounds] = useState<UnifiedSound[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'sounds'>('general');
  const [showForm, setShowForm] = useState(false);
  const [editingSound, setEditingSound] = useState<UnifiedSound | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('🎵');
  const [formCategory, setFormCategory] = useState('tavern');
  const [formSubCategory, setFormSubCategory] = useState<'music' | 'ambient' | 'effect'>('ambient');
  const [formDescription, setFormDescription] = useState('');
  const [formFileData, setFormFileData] = useState<{ dataUrl: string; mimeType: string } | null>(null);
  const [formFileName, setFormFileName] = useState('');
  const [formFileChanged, setFormFileChanged] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setAllSounds(getAllSoundsUnified());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getAutoMode = (subCategory: 'music' | 'ambient' | 'effect'): 'loop' | 'oneshot' => {
    return subCategory === 'effect' ? 'oneshot' : 'loop';
  };

  const handleVolumeChange = (vol: number) => {
    const newSettings = { ...settings, masterVolume: vol };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormFileName(file.name);
    setFormFileChanged(true);
    const reader = new FileReader();
    reader.onload = () => {
      setFormFileData({ dataUrl: reader.result as string, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormName('');
    setFormIcon('🎵');
    setFormCategory('tavern');
    setFormSubCategory('ambient');
    setFormDescription('');
    setFormFileData(null);
    setFormFileName('');
    setFormFileChanged(false);
    setShowForm(false);
    setShowIconPicker(false);
    setEditingSound(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!formName.trim()) return;

    if (editingSound) {
      // Update existing sound
      const updates: any = {
        name: formName,
        icon: formIcon,
        category: formCategory,
        subCategory: formSubCategory,
        description: formDescription,
      };
      if (formFileChanged && formFileData) {
        updates.fileDataUrl = formFileData.dataUrl;
        updates.fileMimeType = formFileData.mimeType;
      }
      updateSoundEdit(editingSound.id, updates);
    } else {
      // Add new custom sound
      if (!formFileData) return;
      const mode = getAutoMode(formSubCategory);
      addCustomSound({
        name: formName,
        icon: formIcon,
        category: formCategory,
        subCategory: formSubCategory,
        mode,
        description: formDescription,
        fileDataUrl: formFileData.dataUrl,
        fileMimeType: formFileData.mimeType,
        volume: 0.7,
      });
    }

    setAllSounds(getAllSoundsUnified());
    onSoundsChange();
    resetForm();
  };

  const handleEdit = (sound: UnifiedSound) => {
    setEditingSound(sound);
    setFormName(sound.name);
    setFormIcon(sound.icon);
    setFormCategory(sound.category);
    setFormSubCategory(sound.subCategory);
    setFormDescription(sound.description);
    if (sound.fileDataUrl) {
      setFormFileData({ dataUrl: sound.fileDataUrl, mimeType: sound.fileMimeType || '' });
      setFormFileName('Текущий файл загружен');
    }
    setFormFileChanged(false);
    setShowForm(true);
  };

  const handleDelete = (sound: UnifiedSound) => {
    if (sound.isDefault) {
      if (confirm('Сбросить изменения этого звука до исходных?')) {
        resetSoundEdit(sound.id);
        setAllSounds(getAllSoundsUnified());
        onSoundsChange();
      }
    } else {
      if (confirm('Удалить этот звук?')) {
        deleteCustomSound(sound.id);
        setAllSounds(getAllSoundsUnified());
        onSoundsChange();
      }
    }
  };

  const handleSubCategoryChange = (subCategory: 'music' | 'ambient' | 'effect') => {
    setFormSubCategory(subCategory);
  };

  const filteredSounds = filterCategory === 'all' 
    ? allSounds 
    : allSounds.filter(s => s.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-700/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-800/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-bold text-white">Настройки</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-red-900/50 hover:text-red-300 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-800/30">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'general'
                ? 'border-purple-400 text-purple-200 bg-purple-900/20'
                : 'border-transparent text-purple-400/60 hover:text-purple-300'
            }`}
          >
            🔊 Общие
          </button>
          <button
            onClick={() => setActiveTab('sounds')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'sounds'
                ? 'border-purple-400 text-purple-200 bg-purple-900/20'
                : 'border-transparent text-purple-400/60 hover:text-purple-300'
            }`}
          >
            🎵 Все звуки ({allSounds.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-3">🔊 Общая громкость</label>
                <div className="flex items-center gap-4">
                  <span className="text-sm">🔈</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.masterVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                  <span className="text-sm">🔊</span>
                  <span className="text-sm font-mono text-purple-300 w-12 text-right">
                    {Math.round(settings.masterVolume * 100)}%
                  </span>
                </div>
                <p className="text-xs text-purple-400/50 mt-2">Регулирует громкость всех звуков в приложении</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <h3 className="text-sm font-semibold text-purple-200 mb-2">💡 О приложении</h3>
                <p className="text-xs text-purple-400/60 leading-relaxed">
                  PocketBard — атмосферный микшер для мастеров D&D. Создавайте уникальную звуковую атмосферу для ваших игровых сессий.
                  Вы можете редактировать любые звуки или добавлять свои собственные.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-800/20">
                <h3 className="text-sm font-semibold text-amber-200 mb-2">⚡ Советы</h3>
                <ul className="text-xs text-amber-300/60 space-y-1.5">
                  <li>• Все звуки можно редактировать — нажмите ✏️ рядом с нужным звуком</li>
                  <li>• Для сброса изменений дефолтного звука нажмите 🔄</li>
                  <li>• Режим воспроизведения определяется автоматически по типу звука</li>
                  <li>• Поддерживаемые форматы: MP3, WAV, OGG, M4A</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sounds' && (
            <div className="space-y-4">
              {/* Add button */}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-purple-600/30 text-purple-300 hover:border-purple-500/50 hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span>
                  <span className="text-sm font-medium">Добавить свой звук</span>
                </button>
              )}

              {/* Form */}
              {showForm && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-purple-700/30 space-y-4">
                  <h3 className="text-sm font-semibold text-purple-200">
                    {editingSound ? '✏️ Редактирование звука' : '➕ Новый звук'}
                  </h3>

                  <div>
                    <label className="block text-xs text-purple-300/70 mb-1.5">
                      Аудиофайл {editingSound?.isDefault && !formFileData ? '(необязательно)' : editingSound ? '(оставьте пустым, чтобы сохранить текущий)' : '*'}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="block w-full text-xs text-purple-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-purple-600/30 file:text-purple-200 hover:file:bg-purple-600/50 file:cursor-pointer cursor-pointer"
                    />
                    {formFileName && (
                      <p className={`text-xs mt-1 ${formFileChanged ? 'text-amber-300/70' : 'text-purple-400/50'}`}>
                        {formFileChanged ? '🔄 Будет заменён на: ' : '📎 '}
                        {formFileName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div>
                      <label className="block text-xs text-purple-300/70 mb-1.5">Название *</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Например: Старинная баллада"
                        className="w-full px-3 py-2 bg-slate-900/50 border border-purple-700/30 rounded-lg text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs text-purple-300/70 mb-1.5">Иконка</label>
                      <button
                        type="button"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        className="w-14 h-[38px] flex items-center justify-center bg-slate-900/50 border border-purple-700/30 rounded-lg text-2xl hover:bg-purple-900/30 transition-all"
                      >
                        {formIcon}
                      </button>
                      {showIconPicker && (
                        <div className="absolute top-full right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-slate-900 border border-purple-700/50 rounded-xl shadow-2xl z-10 p-3">
                          {iconGroups.map(group => (
                            <div key={group.name} className="mb-3">
                              <div className="text-[10px] font-semibold text-purple-300/60 uppercase tracking-wider mb-1.5">{group.name}</div>
                              <div className="grid grid-cols-8 gap-1">
                                {group.icons.map(icon => (
                                  <button
                                    key={icon}
                                    type="button"
                                    onClick={() => { setFormIcon(icon); setShowIconPicker(false); }}
                                    className={`w-7 h-7 flex items-center justify-center rounded text-lg hover:bg-purple-700/30 transition-all ${
                                      formIcon === icon ? 'bg-purple-700/50 ring-1 ring-purple-400' : ''
                                    }`}
                                  >
                                    {icon}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-purple-300/70 mb-1.5">Описание</label>
                    <input
                      type="text"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Краткое описание звука"
                      className="w-full px-3 py-2 bg-slate-900/50 border border-purple-700/30 rounded-lg text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-purple-300/70 mb-1.5">Локация</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-purple-700/30 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                      >
                        {Object.entries(categoryNames).map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-purple-300/70 mb-1.5">Тип звука</label>
                      <select
                        value={formSubCategory}
                        onChange={(e) => handleSubCategoryChange(e.target.value as 'music' | 'ambient' | 'effect')}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-purple-700/30 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                      >
                        <option value="music">🎵 Фоновая музыка</option>
                        <option value="ambient">🎧 Эмбиент</option>
                        <option value="effect">⚡ Эффект</option>
                      </select>
                    </div>
                  </div>

                  <div className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                    formSubCategory === 'effect'
                      ? 'bg-amber-900/20 border border-amber-700/30 text-amber-300'
                      : 'bg-purple-900/20 border border-purple-700/30 text-purple-300'
                  }`}>
                    <span>{formSubCategory === 'effect' ? '▶' : '∞'}</span>
                    <span>Режим: <strong>{formSubCategory === 'effect' ? 'одноразовый' : 'зацикленный'}</strong>
                      <span className="opacity-60"> (определяется типом автоматически)</span>
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={!formName.trim() || (!editingSound && !formFileData)}
                      className="flex-1 py-2 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {editingSound ? '💾 Сохранить' : '➕ Добавить'}
                    </button>
                    <button
                      onClick={resetForm}
                      className="py-2 px-4 rounded-lg bg-slate-800/50 text-slate-300 text-sm hover:bg-slate-700/50 transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    filterCategory === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  Все
                </button>
                {Object.entries(categoryNames).map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => setFilterCategory(id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      filterCategory === id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Sounds list */}
              <div className="space-y-2">
                {filteredSounds.map(sound => (
                  <div
                    key={sound.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-700/30 transition-all"
                  >
                    <span className="text-xl">{sound.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{sound.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                          sound.mode === 'loop'
                            ? 'bg-purple-800/50 text-purple-300 border border-purple-600/30'
                            : 'bg-amber-800/50 text-amber-300 border border-amber-600/30'
                        }`}>
                          {sound.mode === 'loop' ? '∞' : '▶'}
                        </span>
                        {sound.hasEdits && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-800/50 text-blue-300 border border-blue-600/30">
                            ✎
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-400/50 truncate">
                        {categoryNames[sound.category]} • {
                          sound.subCategory === 'music' ? 'Музыка' :
                          sound.subCategory === 'ambient' ? 'Эмбиент' : 'Эффект'
                        }
                        {sound.description && ` • ${sound.description}`}
                        {!sound.isDefault && ' • 🆕'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(sound)}
                      className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-purple-900/50 hover:text-purple-300 transition-all text-xs"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(sound)}
                      className={`w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-red-900/50 hover:text-red-300 transition-all text-xs ${
                        sound.isDefault && !sound.hasEdits ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                      title={sound.isDefault ? (sound.hasEdits ? 'Сбросить изменения' : 'Нет изменений') : 'Удалить'}
                      disabled={sound.isDefault && !sound.hasEdits}
                    >
                      {sound.isDefault ? '🔄' : '🗑️'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
