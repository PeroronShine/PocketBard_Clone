import { useState, useCallback, useEffect, useRef } from 'react';
import { audioEngine, SoundConfig } from './audio/AudioEngine';
import { soundLibrary, categories, presets, Preset } from './data/sounds';
import { SoundCard } from './components/SoundCard';
import { MixerPanel } from './components/MixerPanel';
import { PresetPanel } from './components/PresetPanel';

type Tab = 'sounds' | 'mixer' | 'presets';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sounds');
  const [selectedCategory, setSelectedCategory] = useState<string>('tavern');
  // Loop sounds: Map<soundId, volume>
  const [loopSounds, setLoopSounds] = useState<Map<string, number>>(new Map());
  // One-shot volumes: Map<soundId, volume>
  const [oneshotVolumes, setOneshotVolumes] = useState<Map<string, number>>(new Map());
  // Currently playing one-shots
  const [playingOneshots, setPlayingOneshots] = useState<Set<string>>(new Set());
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [isInitialized, setIsInitialized] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const initAudio = useCallback(() => {
    if (!isInitialized) {
      audioEngine.init();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const toggleLoopSound = useCallback((soundId: string) => {
    initAudio();
    setLoopSounds(prev => {
      const next = new Map(prev);
      if (next.has(soundId)) {
        audioEngine.stopSound(soundId);
        next.delete(soundId);
      } else {
        const sound = soundLibrary.find(s => s.id === soundId);
        if (sound) {
          const vol = 0.5;
          audioEngine.playSound(soundId, sound, vol);
          next.set(soundId, vol);
        }
      }
      return next;
    });
  }, [initAudio]);

  const playOneshot = useCallback((soundId: string) => {
    initAudio();
    const sound = soundLibrary.find(s => s.id === soundId);
    if (!sound) return;
    const vol = oneshotVolumes.get(soundId) || 0.7;
    audioEngine.playOneShot(soundId, sound, vol);
    
    setPlayingOneshots(prev => {
      const next = new Set(prev);
      next.add(soundId);
      return next;
    });

    const duration = (sound.params.duration || 2) * 1000 + 200;
    setTimeout(() => {
      setPlayingOneshots(prev => {
        const next = new Set(prev);
        next.delete(soundId);
        return next;
      });
    }, duration);
  }, [initAudio, oneshotVolumes]);

  const setLoopVolume = useCallback((soundId: string, volume: number) => {
    audioEngine.setSoundVolume(soundId, volume);
    setLoopSounds(prev => {
      const next = new Map(prev);
      next.set(soundId, volume);
      return next;
    });
  }, []);

  const setOneshotVolume = useCallback((soundId: string, volume: number) => {
    setOneshotVolumes(prev => {
      const next = new Map(prev);
      next.set(soundId, volume);
      return next;
    });
  }, []);

  const loadPreset = useCallback((preset: Preset) => {
    initAudio();
    audioEngine.stopAll();
    const newLoop = new Map<string, number>();
    preset.sounds.forEach(({ id, volume }) => {
      const sound = soundLibrary.find(s => s.id === id);
      if (sound && sound.mode === 'loop') {
        audioEngine.playSound(id, sound, volume);
        newLoop.set(id, volume);
      }
    });
    setLoopSounds(newLoop);
    setPlayingOneshots(new Set());
    setActiveTab('mixer');
  }, [initAudio]);

  const stopAll = useCallback(() => {
    audioEngine.stopAll();
    setLoopSounds(new Map());
    setPlayingOneshots(new Set());
  }, []);

  const handleMasterVolume = useCallback((vol: number) => {
    setMasterVolume(vol);
    audioEngine.setMasterVolume(vol);
  }, []);

  // Visualizer
  useEffect(() => {
    if (!isInitialized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!analyserRef.current) {
      analyserRef.current = audioEngine.getAnalyserNode();
    }
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(15, 15, 30, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        const hue = (i / bufferLength) * 60 + 260;
        const lightness = 40 + (dataArray[i] / 255) * 30;
        ctx.fillStyle = `hsla(${hue}, 70%, ${lightness}%, 0.8)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };
    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isInitialized]);

  const getVolumeForSound = (sound: SoundConfig): number => {
    if (sound.mode === 'loop') return loopSounds.get(sound.id) || 0;
    return oneshotVolumes.get(sound.id) || 0.7;
  };

  const activeCount = loopSounds.size + playingOneshots.size;
  const categorySounds = soundLibrary.filter(s => s.category === selectedCategory);
  const musicSounds = categorySounds.filter(s => s.subCategory === 'music');
  const ambientSounds = categorySounds.filter(s => s.subCategory === 'ambient');
  const effectSounds = categorySounds.filter(s => s.subCategory === 'effect');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/30 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎭</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-purple-400 bg-clip-text text-transparent">
                PocketBard
              </h1>
              <p className="text-xs text-purple-300/70">Атмосферный микшер для D&D</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {activeCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/50 rounded-full border border-purple-600/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-purple-200 hidden sm:inline">
                  {loopSounds.size > 0 && `${loopSounds.size} фон`}
                  {playingOneshots.size > 0 && ` • ${playingOneshots.size} эффект`}
                </span>
                <button 
                  onClick={stopAll}
                  className="ml-1 text-red-400 hover:text-red-300 transition-colors"
                  title="Остановить всё"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                className="w-20 sm:w-24 h-1.5 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="border-t border-purple-800/20">
          <div className="max-w-7xl mx-auto px-4 flex gap-1">
            {[
              { id: 'sounds' as Tab, label: 'Звуки', icon: '🎵' },
              { id: 'mixer' as Tab, label: `Микшер${loopSounds.size > 0 ? ` (${loopSounds.size})` : ''}`, icon: '🎛️' },
              { id: 'presets' as Tab, label: 'Пресеты', icon: '📋' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-200 bg-purple-900/20'
                    : 'border-transparent text-purple-400/60 hover:text-purple-300 hover:bg-purple-900/10'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Category Buttons (only on sounds tab) */}
        {activeTab === 'sounds' && (
          <div className="border-t border-purple-800/10 bg-black/20">
            <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-slate-700/30'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Visualizer */}
      {isInitialized && activeCount > 0 && (
        <div className="h-12 border-b border-purple-800/20 bg-black/20 flex-shrink-0">
          <canvas ref={canvasRef} width={1200} height={48} className="w-full h-full" />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {activeTab === 'sounds' && (
          <div className="space-y-6">
            {/* Music Section */}
            {musicSounds.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-fuchsia-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold text-fuchsia-300 uppercase tracking-wider">
                    🎵 Фоновая музыка
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {musicSounds.map(sound => (
                    <SoundCard
                      key={sound.id}
                      sound={sound}
                      isActive={loopSounds.has(sound.id)}
                      volume={getVolumeForSound(sound)}
                      isPlaying={false}
                      onToggle={toggleLoopSound}
                      onPlayOneShot={() => {}}
                      onVolumeChange={setLoopVolume}
                      variant="music"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ambient Section */}
            {ambientSounds.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    🎧 Эмбиент
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {ambientSounds.map(sound => (
                    <SoundCard
                      key={sound.id}
                      sound={sound}
                      isActive={loopSounds.has(sound.id)}
                      volume={getVolumeForSound(sound)}
                      isPlaying={false}
                      onToggle={toggleLoopSound}
                      onPlayOneShot={() => {}}
                      onVolumeChange={setLoopVolume}
                      variant="ambient"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Effects Section */}
            {effectSounds.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                    ⚡ Одноразовые эффекты
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {effectSounds.map(sound => (
                    <SoundCard
                      key={sound.id}
                      sound={sound}
                      isActive={false}
                      volume={getVolumeForSound(sound)}
                      isPlaying={playingOneshots.has(sound.id)}
                      onToggle={() => {}}
                      onPlayOneShot={playOneshot}
                      onVolumeChange={setOneshotVolume}
                      variant="effect"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mixer' && (
          <MixerPanel
            activeSounds={loopSounds}
            onVolumeChange={setLoopVolume}
            onStop={toggleLoopSound}
            onStopAll={stopAll}
          />
        )}

        {activeTab === 'presets' && (
          <PresetPanel
            presets={presets}
            onLoadPreset={loadPreset}
            activeSounds={loopSounds}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-800/20 bg-black/20 py-3 text-center flex-shrink-0">
        <p className="text-xs text-purple-400/50">
          🎭 PocketBard — Создавай атмосферу для своих приключений
        </p>
      </footer>
    </div>
  );
}

export default App;
