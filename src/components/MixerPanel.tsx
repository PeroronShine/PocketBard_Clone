import { soundLibrary } from '../data/sounds';

interface MixerPanelProps {
  activeSounds: Map<string, number>;
  onVolumeChange: (id: string, volume: number) => void;
  onStop: (id: string) => void;
  onStopAll: () => void;
}

export function MixerPanel({ activeSounds, onVolumeChange, onStop, onStopAll }: MixerPanelProps) {
  const activeEntries = Array.from(activeSounds.entries());

  if (activeEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4 opacity-50">🎛️</div>
        <h2 className="text-xl font-semibold text-purple-200 mb-2">Микшер пуст</h2>
        <p className="text-purple-400/60 max-w-md">
          Перейдите во вкладку «Звуки» и активируйте фоновые звуки, чтобы создать уникальную атмосферу для вашей сессии.
        </p>
        <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 max-w-md text-left">
          <p className="text-sm text-purple-300/80 mb-2">💡 <strong>Совет:</strong></p>
          <ul className="text-xs text-purple-400/60 space-y-1">
            <li>• <span className="text-purple-300">∞ Фоновые звуки</span> — зацикленные, настраиваются в микшере</li>
            <li>• <span className="text-amber-300">⚡ Эффекты</span> — одноразовые, для ключевых моментов</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-purple-200">Микшер фоновых звуков</h2>
          <p className="text-sm text-purple-400/60">Управляйте громкостью каждого активного эмбиента</p>
        </div>
        <button
          onClick={onStopAll}
          className="px-4 py-2 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm hover:bg-red-900/50 transition-all flex items-center gap-2"
        >
          <span>🛑</span> Остановить всё
        </button>
      </div>

      {/* Mixer Channels */}
      <div className="space-y-3">
        {activeEntries.map(([soundId, volume]) => {
          const sound = soundLibrary.find(s => s.id === soundId);
          if (!sound) return null;

          return (
            <div
              key={soundId}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-purple-700/30 transition-all"
            >
              {/* Icon */}
              <div className="text-2xl w-10 text-center">{sound.icon}</div>

              {/* Name */}
              <div className="w-32 flex-shrink-0">
                <div className="text-sm font-medium text-white truncate">{sound.name}</div>
                <div className="text-xs text-purple-400/50 truncate">{sound.description}</div>
              </div>

              {/* Volume Slider */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs text-purple-400/60">🔈</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(soundId, parseFloat(e.target.value))}
                    className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                  {/* Volume bar visualization */}
                  <div
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg pointer-events-none opacity-50"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <span className="text-xs text-purple-400/60">🔊</span>
              </div>

              {/* Volume percentage */}
              <div className="w-12 text-right">
                <span className="text-sm font-mono text-purple-300">{Math.round(volume * 100)}%</span>
              </div>

              {/* Mute/Stop button */}
              <button
                onClick={() => onStop(soundId)}
                className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-red-900/50 hover:text-red-300 transition-all"
                title="Остановить"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Mixer Summary */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-slate-900/20 border border-purple-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-purple-200">
              Активно: {activeEntries.length} канал{activeEntries.length === 1 ? '' : activeEntries.length < 5 ? 'а' : 'ов'}
            </span>
          </div>
          <div className="text-xs text-purple-400/50">
            {getMoodText(activeEntries.length)}
          </div>
        </div>
      </div>

      {/* Info about one-shots */}
      <div className="mt-4 p-3 rounded-lg bg-amber-900/10 border border-amber-800/20">
        <p className="text-xs text-amber-300/70 flex items-center gap-2">
          <span>⚡</span>
          <span>Одноразовые эффекты воспроизводятся со вкладки «Звуки» и не отображаются в микшере</span>
        </p>
      </div>
    </div>
  );
}

function getMoodText(count: number): string {
  if (count === 1) return '🎵 Тихая атмосфера';
  if (count === 2) return '🎶 Приятный дуэт';
  if (count <= 4) return '🎼 Богатая палитра';
  return '🎭 Полная иммерсия';
}
