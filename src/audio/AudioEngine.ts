// Audio Engine using Web Audio API for procedural sound generation

export type SoundType = 'noise' | 'tone' | 'rhythm' | 'ambient';

export interface SoundConfig {
  id: string;
  name: string;
  icon: string;
  category: string;
  type: SoundType;
  description: string;
  params: SoundParams;
}

export interface SoundParams {
  frequencies?: number[];
  noiseType?: 'white' | 'pink' | 'brown';
  filterFreq?: number;
  filterQ?: number;
  lfoRate?: number;
  lfoDepth?: number;
  rhythmPattern?: number[];
  rhythmBpm?: number;
  gainBase?: number;
  detune?: number;
  reverbMix?: number;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private activeSounds: Map<string, { nodes: AudioNode[]; gain: GainNode; source?: OscillatorNode | AudioBufferSourceNode }> = new Map();
  private masterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    
    // Create reverb
    this.convolver = this.ctx.createConvolver();
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.3;
    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.value = 0.7;
    
    this.createReverbIR(2.5, 3);
    
    this.masterGain.connect(this.dryGain);
    this.masterGain.connect(this.convolver);
    this.convolver.connect(this.reverbGain);
    this.dryGain.connect(this.ctx.destination);
    this.reverbGain.connect(this.ctx.destination);
  }

  private createReverbIR(duration: number, decay: number) {
    if (!this.ctx || !this.convolver) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    this.convolver.buffer = impulse;
  }

  setMasterVolume(vol: number) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx!.currentTime, 0.05);
    }
  }

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
    if (!this.ctx) throw new Error('Audio context not initialized');
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750754;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else { // brown
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
    return buffer;
  }

  playSound(soundId: string, config: SoundConfig, volume: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    
    // Stop existing sound if playing
    this.stopSound(soundId);

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(this.masterGain);
    
    // Fade in
    gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.5);

    const nodes: AudioNode[] = [gainNode];
    let source: OscillatorNode | AudioBufferSourceNode | undefined;

    const params = config.params;

    switch (config.type) {
      case 'noise': {
        const buffer = this.createNoiseBuffer(params.noiseType || 'white');
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        
        if (params.filterFreq) {
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = params.filterFreq;
          filter.Q.value = params.filterQ || 1;
          src.connect(filter);
          filter.connect(gainNode);
          nodes.push(filter);
        } else {
          src.connect(gainNode);
        }
        
        src.start();
        source = src;
        break;
      }
      
      case 'tone': {
        const freqs = params.frequencies || [440];
        const oscillators: OscillatorNode[] = [];
        
        freqs.forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          if (params.detune && i > 0) {
            osc.detune.value = (Math.random() - 0.5) * params.detune;
          }
          
          const oscGain = this.ctx!.createGain();
          oscGain.gain.value = 1 / freqs.length;
          
          if (params.lfoRate) {
            const lfo = this.ctx!.createOscillator();
            lfo.frequency.value = params.lfoRate + (Math.random() * 0.5);
            const lfoGain = this.ctx!.createGain();
            lfoGain.gain.value = params.lfoDepth || 5;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            nodes.push(lfo, lfoGain);
          }
          
          osc.connect(oscGain);
          oscGain.connect(gainNode);
          osc.start();
          oscillators.push(osc);
          nodes.push(oscGain);
        });
        
        source = oscillators[0];
        break;
      }
      
      case 'rhythm': {
        const pattern = params.rhythmPattern || [1, 0, 0.5, 0];
        const bpm = params.rhythmBpm || 80;
        const beatDuration = 60 / bpm;
        
        const scheduleLoop = () => {
          if (!this.ctx || !this.activeSounds.has(soundId)) return;
          
          pattern.forEach((velocity, i) => {
            if (velocity > 0) {
              const time = this.ctx!.currentTime + i * beatDuration;
              const osc = this.ctx!.createOscillator();
              osc.type = 'triangle';
              osc.frequency.value = params.frequencies?.[0] || 80;
              
              const env = this.ctx!.createGain();
              env.gain.setValueAtTime(0, time);
              env.gain.linearRampToValueAtTime(velocity * 0.5, time + 0.01);
              env.gain.exponentialRampToValueAtTime(0.001, time + beatDuration * 0.8);
              
              osc.connect(env);
              env.connect(gainNode);
              osc.start(time);
              osc.stop(time + beatDuration);
              nodes.push(osc, env);
            }
          });
          
          setTimeout(scheduleLoop, pattern.length * beatDuration * 1000 - 50);
        };
        
        scheduleLoop();
        break;
      }
      
      case 'ambient': {
        // Complex ambient with multiple layers
        const freqs = params.frequencies || [220, 330, 440];
        
        freqs.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          const lfo = this.ctx!.createOscillator();
          lfo.frequency.value = (params.lfoRate || 0.1) + Math.random() * 0.2;
          const lfoGain = this.ctx!.createGain();
          lfoGain.gain.value = params.lfoDepth || 3;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          
          const ampLfo = this.ctx!.createOscillator();
          ampLfo.frequency.value = 0.05 + Math.random() * 0.1;
          const ampLfoGain = this.ctx!.createGain();
          ampLfoGain.gain.value = 0.3;
          ampLfo.connect(ampLfoGain);
          
          const oscGain = this.ctx!.createGain();
          oscGain.gain.value = 0.2;
          ampLfoGain.connect(oscGain.gain);
          
          osc.connect(oscGain);
          oscGain.connect(gainNode);
          
          osc.start();
          lfo.start();
          ampLfo.start();
          nodes.push(osc, lfo, lfoGain, ampLfo, ampLfoGain, oscGain);
        });
        
        source = nodes[1] as OscillatorNode;
        break;
      }
    }

    this.activeSounds.set(soundId, { nodes, gain: gainNode, source });
  }

  setSoundVolume(soundId: string, volume: number) {
    const sound = this.activeSounds.get(soundId);
    if (sound && this.ctx) {
      sound.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
    }
  }

  stopSound(soundId: string) {
    const sound = this.activeSounds.get(soundId);
    if (sound && this.ctx) {
      // Fade out
      sound.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      
      setTimeout(() => {
        sound.nodes.forEach(node => {
          try {
            if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
              node.stop();
            }
            node.disconnect();
          } catch (e) { /* ignore */ }
        });
      }, 500);
      
      this.activeSounds.delete(soundId);
    }
  }

  stopAll() {
    this.activeSounds.forEach((_, id) => this.stopSound(id));
  }

  isPlaying(soundId: string): boolean {
    return this.activeSounds.has(soundId);
  }

  getAnalyserNode(): AnalyserNode | null {
    if (!this.ctx || !this.masterGain) return null;
    const analyser = this.ctx.createAnalyser();
    analyser.fftSize = 256;
    this.masterGain.connect(analyser);
    return analyser;
  }
}

export const audioEngine = new AudioEngine();
