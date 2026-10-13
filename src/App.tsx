import { useState, useCallback, useEffect, useRef } from 'react';
import { audioEngine } from './audio/AudioEngine';
import { soundLibrary, categories, presets, Preset } from './data/sounds';
import { SoundCard } from './components/SoundCard';
import { MixerPanel } from './components/MixerPanel';
import { PresetPanel } from './components/PresetPanel';
import { Visualizer } from './components/Visualizer';

type Tab = 'sounds' | 'mixer' | 'presets';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sounds');
  const [selectedCategory, setSelectedCategory] = useState<string>('tavern');
  const [activeSounds, setActiveSounds] = useState<Map<string, number>>(new Map());
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

  const toggleSound = useCallback((soundId: string) => {
    initAudio();
    
    setActiveSounds(prev => {
      const next = new Map(prev);
      if (next.has(soundId)) {
        audioEngine.stopSound(soundId);
        next.delete(soundId);
      } else {
        const sound = soundLibrary.find(s => s.id === soundId);
        if (sound) {
          audioEngine.playSound(soundId, sound, 0.5);
          next.set(soundId, 0.5);
        }
      }
      return next;
    });
  }, [initAudio]);

  const setSoundVolume = useCallback((soundId: string, volume: number) => {
    audioEngine.setSoundVolume(soundId, volume);
    setActiveSounds(prev => {
      const next = new Map(prev);
      next.set(soundId, volume);
      return next;
    });
  }, []);

  const loadPreset = useCallback((preset: Preset) => {
    initAudio();
    audioEngine.stopAll();
    const newActive = new Map<string, number>();
    
    preset.sounds.forEach(({ id, volume }) => {
      const sound = soundLibrary.find(s => s.id === id);
      if (sound) {
        audioEngine.playSound(id, sound, volume);
        newActive.set(id, volume);
      }
    });
    
    setActiveSounds(newActive);
    setActiveTab('mixer');
  }, [initAudio]);

  const stopAll = useCallback(() => {
    audioEngine.stopAll();
    setActiveSounds(new Map());
  }, []);

  const handleMasterVolume = useCallback((vol: number) => {
    setMasterVolume(vol);
    audioEngine.setMasterVolume(vol);
  }, []);

  // Visualizer animation
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

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isInitialized]);

  const filteredSounds = soundLibrary.filter(s => s.category === selectedCategory);
  const activeCount = activeSounds.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/30 backdrop-blur-sm">
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
                <span className="text-sm text-purple-200">{activeCount} звук{activeCount === 1 ? '' : activeCount < 5 ? 'а' : 'ов'}</span>
                <button 
                  onClick={stopAll}
                  className="ml-1 text-red-400 hover:text-red-300 transition-colors"
                  title="Остановить всё"
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Master Volume */}
            <div className="flex items-center gap-2">
              <span className="text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Visualizer */}
      {isInitialized && activeCount > 0 && (
        <div className="h-16 border-b border-purple-800/20 bg-black/20">
          <canvas
            ref={canvasRef}
            width={1200}
            height={64}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="border-b border-purple-800/30 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {[
            { id: 'sounds' as Tab, label: 'Звуки', icon: '🎵' },
            { id: 'mixer' as Tab, label: `Микшер${activeCount > 0 ? ` (${activeCount})` : ''}`, icon: '🎛️' },
            { id: 'presets' as Tab, label: 'Пресеты', icon: '📋' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {activeTab === 'sounds' && (
          <div>
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sound Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSounds.map(sound => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  isActive={activeSounds.has(sound.id)}
                  volume={activeSounds.get(sound.id) || 0}
                  onToggle={toggleSound}
                  onVolumeChange={setSoundVolume}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mixer' && (
          <MixerPanel
            activeSounds={activeSounds}
            onVolumeChange={setSoundVolume}
            onStop={toggleSound}
            onStopAll={stopAll}
          />
        )}

        {activeTab === 'presets' && (
          <PresetPanel
            presets={presets}
            onLoadPreset={loadPreset}
            activeSounds={activeSounds}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-800/20 bg-black/20 py-3 text-center">
        <p className="text-xs text-purple-400/50">
          🎭 PocketBard v1.0 — Создавай атмосферу для своих приключений
        </p>
      </footer>
    </div>
  );
}

export default App;
