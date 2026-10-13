import { SoundConfig } from '../audio/AudioEngine';

type CardVariant = 'music' | 'ambient' | 'effect';

interface SoundCardProps {
  sound: SoundConfig;
  isActive: boolean;
  volume: number;
  isPlaying: boolean;
  onToggle: (id: string) => void;
  onPlayOneShot: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
  variant: CardVariant;
}

const variantStyles: Record<CardVariant, {
  activeBorder: string;
  activeBg: string;
  activeShadow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glowFrom: string;
  buttonActive: string;
  buttonActiveShadow: string;
  playButtonHover: string;
  playingButton: string;
  playingShadow: string;
  barColor: string;
  sliderAccent: string;
  sliderBg: string;
  percentText: string;
  iconMuted: string;
  iconLoud: string;
}> = {
  music: {
    activeBorder: 'border-fuchsia-500/50',
    activeBg: 'bg-fuchsia-900/20',
    activeShadow: 'shadow-fuchsia-900/20',
    badgeBg: 'bg-fuchsia-800/50',
    badgeText: 'text-fuchsia-300',
    badgeBorder: 'border-fuchsia-600/30',
    glowFrom: 'from-fuchsia-600/10',
    buttonActive: 'bg-fuchsia-600',
    buttonActiveShadow: 'shadow-fuchsia-600/30',
    playButtonHover: 'hover:bg-fuchsia-700/50 hover:text-fuchsia-200',
    playingButton: 'bg-fuchsia-600',
    playingShadow: 'shadow-fuchsia-600/30',
    barColor: 'bg-fuchsia-400',
    sliderAccent: 'accent-fuchsia-400',
    sliderBg: 'bg-fuchsia-900/30',
    percentText: 'text-fuchsia-300/80',
    iconMuted: 'text-fuchsia-400/60',
    iconLoud: 'text-fuchsia-400/60',
  },
  ambient: {
    activeBorder: 'border-purple-500/50',
    activeBg: 'bg-purple-900/30',
    activeShadow: 'shadow-purple-900/20',
    badgeBg: 'bg-purple-800/50',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-600/30',
    glowFrom: 'from-purple-600/10',
    buttonActive: 'bg-purple-600',
    buttonActiveShadow: 'shadow-purple-600/30',
    playButtonHover: 'hover:bg-purple-700/50 hover:text-purple-200',
    playingButton: 'bg-purple-600',
    playingShadow: 'shadow-purple-600/30',
    barColor: 'bg-purple-400',
    sliderAccent: 'accent-purple-400',
    sliderBg: 'bg-purple-900/50',
    percentText: 'text-purple-300/80',
    iconMuted: 'text-purple-400/60',
    iconLoud: 'text-purple-400/60',
  },
  effect: {
    activeBorder: 'border-amber-500/50',
    activeBg: 'bg-amber-900/20',
    activeShadow: 'shadow-amber-900/10',
    badgeBg: 'bg-amber-800/50',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-600/30',
    glowFrom: 'from-amber-600/10',
    buttonActive: 'bg-amber-600',
    buttonActiveShadow: 'shadow-amber-600/30',
    playButtonHover: 'hover:bg-amber-700/50 hover:text-amber-200',
    playingButton: 'bg-amber-600',
    playingShadow: 'shadow-amber-600/30',
    barColor: 'bg-amber-400',
    sliderAccent: 'accent-amber-400',
    sliderBg: 'bg-amber-900/30',
    percentText: 'text-amber-300/80',
    iconMuted: 'text-amber-400/60',
    iconLoud: 'text-amber-400/60',
  },
};

const variantLabels: Record<CardVariant, string> = {
  music: '♪ муз.',
  ambient: '∞ эмб.',
  effect: '▶ эффект',
};

export function SoundCard({ sound, isActive, volume, isPlaying, onToggle, onPlayOneShot, onVolumeChange, variant }: SoundCardProps) {
  const isLoop = sound.mode === 'loop';
  const s = variantStyles[variant];
  const active = isLoop ? isActive : isPlaying;

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
        active
          ? `${s.activeBorder} ${s.activeBg} shadow-lg ${s.activeShadow}`
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50'
      }`}
    >
      {/* Glow */}
      {active && (
        <div className={`absolute inset-0 bg-gradient-to-br ${s.glowFrom} to-transparent pointer-events-none`} />
      )}
      
      <div className="relative p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl flex-shrink-0">{sound.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-white truncate">{sound.name}</h3>
                <span className={`text-[9px] px-1 py-0 rounded-full flex-shrink-0 ${s.badgeBg} ${s.badgeText} border ${s.badgeBorder}`}>
                  {variantLabels[variant]}
                </span>
              </div>
              <p className="text-[11px] text-purple-300/50 truncate">{sound.description}</p>
            </div>
          </div>
          
          {/* Action Button */}
          {isLoop ? (
            <button
              onClick={() => onToggle(sound.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ml-2 ${
                isActive
                  ? `${s.buttonActive} text-white shadow-lg ${s.buttonActiveShadow} scale-105`
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-300'
              }`}
            >
              {isActive ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          ) : (
            <button
              onClick={() => onPlayOneShot(sound.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ml-2 ${
                isPlaying
                  ? `${s.playingButton} text-white shadow-lg ${s.playingShadow} scale-105`
                  : `bg-slate-700/50 text-slate-400 ${s.playButtonHover}`
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[10px] ${s.iconMuted}`}>🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
            className={`flex-1 h-1 ${s.sliderBg} rounded-lg appearance-none cursor-pointer ${s.sliderAccent}`}
          />
          <span className={`text-[10px] ${s.iconLoud}`}>🔊</span>
          <span className={`text-[10px] ${s.percentText} w-7 text-right font-mono`}>
            {Math.round(volume * 100)}
          </span>
        </div>

        {/* Active indicator bars */}
        {active && (
          <div className="absolute top-2 right-2">
            <div className="flex gap-px">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-0.5 ${s.barColor} rounded-full animate-soundbar`}
                  style={{
                    height: `${6 + Math.random() * 8}px`,
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
