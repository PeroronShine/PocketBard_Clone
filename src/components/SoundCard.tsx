import { SoundConfig } from '../audio/AudioEngine';

interface SoundCardProps {
  sound: SoundConfig;
  isActive: boolean;
  volume: number;
  isPlaying: boolean;
  onToggle: (id: string) => void;
  onPlayOneShot: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
}

export function SoundCard({ sound, isActive, volume, isPlaying, onToggle, onPlayOneShot, onVolumeChange }: SoundCardProps) {
  const isLoop = sound.mode === 'loop';

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
        isActive || isPlaying
          ? isLoop
            ? 'border-purple-500/50 bg-purple-900/30 shadow-lg shadow-purple-900/20'
            : 'border-amber-500/50 bg-amber-900/20 shadow-lg shadow-amber-900/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50'
      }`}
    >
      {/* Glow effect when active */}
      {(isActive || isPlaying) && (
        <div className={`absolute inset-0 pointer-events-none ${
          isLoop 
            ? 'bg-gradient-to-br from-purple-600/10 to-transparent' 
            : 'bg-gradient-to-br from-amber-600/10 to-transparent'
        }`} />
      )}
      
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{sound.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">{sound.name}</h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isLoop 
                    ? 'bg-purple-800/50 text-purple-300 border border-purple-600/30'
                    : 'bg-amber-800/50 text-amber-300 border border-amber-600/30'
                }`}>
                  {isLoop ? '∞ фон' : '▶ раз'}
                </span>
              </div>
              <p className="text-xs text-purple-300/60">{sound.description}</p>
            </div>
          </div>
          
          {/* Action Button */}
          {isLoop ? (
            <button
              onClick={() => onToggle(sound.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-110'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-300'
              }`}
            >
              {isActive ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          ) : (
            <button
              onClick={() => onPlayOneShot(sound.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-110'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-amber-700/50 hover:text-amber-200'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Volume Slider for loops */}
        {isLoop && isActive && (
          <div className="flex items-center gap-2 mt-3 animate-fadeIn">
            <span className="text-xs text-purple-400/60">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <span className="text-xs text-purple-400/60">🔊</span>
            <span className="text-xs text-purple-300/80 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}

        {/* Volume for oneshots */}
        {!isLoop && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-amber-400/60">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume || 0.7}
              onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-amber-900/30 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-xs text-amber-400/60">🔊</span>
            <span className="text-xs text-amber-300/80 w-8 text-right">
              {Math.round((volume || 0.7) * 100)}%
            </span>
          </div>
        )}

        {/* Active indicator for loops */}
        {isLoop && isActive && (
          <div className="absolute top-2 right-2">
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-purple-400 rounded-full animate-soundbar"
                  style={{
                    height: `${8 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Playing indicator for oneshots */}
        {!isLoop && isPlaying && (
          <div className="absolute top-2 right-2">
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-amber-400 rounded-full animate-soundbar"
                  style={{
                    height: `${8 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
