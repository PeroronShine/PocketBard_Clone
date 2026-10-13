import { SoundConfig } from '../audio/AudioEngine';

interface SoundCardProps {
  sound: SoundConfig;
  isActive: boolean;
  volume: number;
  onToggle: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
}

export function SoundCard({ sound, isActive, volume, onToggle, onVolumeChange }: SoundCardProps) {
  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
        isActive
          ? 'border-purple-500/50 bg-purple-900/30 shadow-lg shadow-purple-900/20'
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50'
      }`}
    >
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />
      )}
      
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{sound.icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-white">{sound.name}</h3>
              <p className="text-xs text-purple-300/60">{sound.description}</p>
            </div>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={() => onToggle(sound.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isActive
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-110'
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-300'
            }`}
          >
            {isActive ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Volume Slider */}
        {isActive && (
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

        {/* Active indicator */}
        {isActive && (
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
      </div>
    </div>
  );
}
