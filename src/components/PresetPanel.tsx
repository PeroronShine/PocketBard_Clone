import { Preset, soundLibrary } from '../data/sounds';

interface PresetPanelProps {
  presets: Preset[];
  onLoadPreset: (preset: Preset) => void;
  activeSounds: Map<string, number>;
}

export function PresetPanel({ presets, onLoadPreset, activeSounds }: PresetPanelProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-purple-200">Пресеты атмосферы</h2>
        <p className="text-sm text-purple-400/60">Готовые наборы звуков для типичных ситуаций</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map(preset => {
          const isActive = preset.sounds.every(({ id }) => activeSounds.has(id));
          
          return (
            <div
              key={preset.id}
              className={`relative rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer group ${
                isActive
                  ? 'border-purple-500/50 bg-purple-900/30 shadow-lg shadow-purple-900/20'
                  : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-purple-700/30'
              }`}
              onClick={() => onLoadPreset(preset)}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{preset.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{preset.name}</h3>
                      <p className="text-xs text-purple-300/60 mt-0.5">{preset.description}</p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="px-2 py-0.5 bg-purple-600/30 rounded-full text-xs text-purple-300 border border-purple-500/30">
                      ▶ Активен
                    </div>
                  )}
                </div>

                {/* Sound list */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {preset.sounds.map(({ id, volume }) => {
                    const sound = soundLibrary.find(s => s.id === id);
                    if (!sound) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-900/50 rounded-md border border-slate-700/30"
                      >
                        <span className="text-xs">{sound.icon}</span>
                        <span className="text-xs text-slate-300">{sound.name}</span>
                        <span className="text-xs text-purple-400/60">{Math.round(volume * 100)}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Load button */}
                <div className="mt-4 flex justify-end">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-700/50 text-purple-200 border border-purple-600/50'
                        : 'bg-purple-900/30 text-purple-300 border border-purple-700/30 group-hover:bg-purple-800/40 group-hover:border-purple-600/40'
                    }`}
                  >
                    {isActive ? '✓ Воспроизводится' : '▶ Запустить'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
