import { useState, useRef, useEffect } from 'react';
import {
  CustomSound,
  AppSettings,
  loadCustomSounds,
  addCustomSound,
  updateCustomSound,
  deleteCustomSound,
  loadSettings,
  saveSettings,
  categoryNames,
} from '../store/customSounds';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AppSettings) => void;
  onCustomSoundsChange: () => void;
}

export function SettingsModal({ isOpen, onClose, onSettingsChange, onCustomSoundsChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [customSounds, setCustomSounds] = useState<CustomSound[]>(loadCustomSounds());
  const [activeTab, setActiveTab] = useState<'general' | 'sounds'>('general');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSound, setEditingSound] = useState<CustomSound | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('🎵');
  const [formCategory, setFormCategory] = useState('tavern');
  const [formSubCategory, setFormSubCategory] = useState<'music' | 'ambient' | 'effect'>('ambient');
  const [formMode, setFormMode] = useState<'loop' | 'oneshot'>('loop');
  const [formDescription, setFormDescription] = useState('');
  const [formFileData, setFormFileData] = useState<{ dataUrl: string; mimeType: string } | null>(null);
  const [formFileName, setFormFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setCustomSounds(loadCustomSounds());
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

    const reader = new FileReader();
    reader.onload = () => {
      setFormFileData({
        dataUrl: reader.result as string,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormName('');
    setFormIcon('🎵');
    setFormCategory('tavern');
    setFormSubCategory('ambient');
    setFormMode('loop');
    setFormDescription('');
    setFormFileData(null);
    setFormFileName('');
    setShowAddForm(false);
    setEditingSound(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!formName.trim() || !formFileData) return;

    if (editingSound) {
      updateCustomSound(editingSound.id, {
        name: formName,
        icon: formIcon,
        category: formCategory,
        subCategory: formSubCategory,
        mode: formMode,
        description: formDescription,
        fileDataUrl: formFileData.dataUrl,
        fileMimeType: formFileData.mimeType,
      });
    } else {
      addCustomSound({
        name: formName,
        icon: formIcon,
        category: formCategory,
        subCategory: formSubCategory,
        mode: formMode,
        description: formDescription,
        fileDataUrl: formFileData.dataUrl,
        fileMimeType: formFileData.mimeType,
        volume: 0.7,
      });
    }

    setCustomSounds(loadCustomSounds());
    onCustomSoundsChange();
    resetForm();
  };

  const handleEdit = (sound: CustomSound) => {
    setEditingSound(sound);
    setFormName(sound.name);
    setFormIcon(sound.icon);
    setFormCategory(sound.category);
    setFormSubCategory(sound.subCategory);
    setFormMode(sound.mode);
    setFormDescription(sound.description);
    setFormFileData({ dataUrl: sound.fileDataUrl, mimeType: sound.fileMimeType });
    setFormFileName('Текущий файл');
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить этот звук?')) {
      deleteCustomSound(id);
      setCustomSounds(loadCustomSounds());
      onCustomSoundsChange();
    }
  };

  const iconOptions = ['🎵', '🎶', '🎼', '🎹', '🎸', '🥁', '🎺', '🎻', '🔔', '🔊', '🎤', '🎧', '🎙️', '📯', '🪘', '🪗'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-700/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
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
            🎵 Мои звуки ({customSounds.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Master Volume */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-3">
                  🔊 Общая громкость
                </label>
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
                <p className="text-xs text-purple-400/50 mt-2">
                  Регулирует громкость всех звуков в приложении
                </p>
              </div>

              {/* Info */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <h3 className="text-sm font-semibold text-purple-200 mb-2">💡 О приложении</h3>
                <p className="text-xs text-purple-400/60 leading-relaxed">
                  PocketBard — атмосферный микшер для мастеров D&D. Создавайте уникальную звуковую атмосферу для ваших игровых сессий.
                  Вы можете добавлять свои собственные звуки, музыку и эмбиент из локальных файлов.
                </p>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-800/20">
                <h3 className="text-sm font-semibold text-amber-200 mb-2">⚡ Советы</h3>
                <ul className="text-xs text-amber-300/60 space-y-1.5">
                  <li>• Используйте короткие файлы (до 30 сек) для эффектов</li>
                  <li>• Для фоновой музыки и эмбиента подходят длинные зацикленные файлы</li>
                  <li>• Поддерживаемые форматы: MP3, WAV, OGG, M4A</li>
                  <li>• Все добавленные звуки сохраняются в браузере</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sounds' && (
            <div className="space-y-4">
              {/* Add button */}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-purple-600/30 text-purple-300 hover:border-purple-500/50 hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span>
                  <span className="text-sm font-medium">Добавить свой звук</span>
                </button>
              )}

              {/* Add/Edit Form */}
              {showAddForm && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-purple-700/30 space-y-4">
                  <h3 className="text-sm font-semibold text-purple-200">
                    {editingSound ? '✏️ Редактирование звука' : '➕ Новый звук'}
                  </h3>

                  {/* File upload */}
                  <div>
                    <label className="block text-xs text-purple-300/70 mb-1.5">Аудиофайл *</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="block w-full text-xs text-purple-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-purple-600/30 file:text-purple-200 hover:file:bg-purple-600/50 file:cursor-pointer cursor-pointer"
                    />
                    {formFileName && (
                      <p className="text-xs text-purple-400/50 mt-1">📎 {formFileName}</p>
                    )}
                  </div>

                  {/* Name & Icon */}
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
                    <div>
                      <label className="block text-xs text-purple-300/70 mb-1.5">Иконка</label>
                      <div className="relative">
                        <select
                          value={formIcon}
                          onChange={(e) => setFormIcon(e.target.value)}
                          className="appearance-none w-16 h-[38px] px-2 bg-slate-900/50 border border-purple-700/30 rounded-lg text-xl text-center focus:outline-none focus:border-purple-500/50 cursor-pointer"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
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

                  {/* Category & SubCategory */}
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
                      <label className="block text-xs text-purple-300/70 mb-1.5">Тип</label>
                      <select
                        value={formSubCategory}
                        onChange={(e) => setFormSubCategory(e.target.value as 'music' | 'ambient' | 'effect')}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-purple-700/30 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                      >
                        <option value="music">🎵 Фоновая музыка</option>
                        <option value="ambient">🎧 Эмбиент</option>
                        <option value="effect">⚡ Эффект</option>
                      </select>
                    </div>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-xs text-purple-300/70 mb-1.5">Режим воспроизведения</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormMode('loop')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          formMode === 'loop'
                            ? 'bg-purple-600/50 text-purple-200 border border-purple-500/50'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50'
                        }`}
                      >
                        ∞ Зацикленный
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormMode('oneshot')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          formMode === 'oneshot'
                            ? 'bg-amber-600/50 text-amber-200 border border-amber-500/50'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50'
                        }`}
                      >
                        ▶ Одноразовый
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={!formName.trim() || !formFileData}
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

              {/* Custom sounds list */}
              {customSounds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">
                    Добавленные звуки
                  </h3>
                  {customSounds.map(sound => (
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
                        </div>
                        <p className="text-xs text-purple-400/50 truncate">
                          {categoryNames[sound.category]} • {
                            sound.subCategory === 'music' ? 'Музыка' :
                            sound.subCategory === 'ambient' ? 'Эмбиент' : 'Эффект'
                          }
                          {sound.description && ` • ${sound.description}`}
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
                        onClick={() => handleDelete(sound.id)}
                        className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-red-900/50 hover:text-red-300 transition-all text-xs"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {customSounds.length === 0 && !showAddForm && (
                <div className="text-center py-8 text-purple-400/50">
                  <div className="text-4xl mb-2">🎵</div>
                  <p className="text-sm">Пока нет добавленных звуков</p>
                  <p className="text-xs mt-1">Нажмите «Добавить свой звук», чтобы загрузить аудиофайл</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
