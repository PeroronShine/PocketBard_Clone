// Simplified Audio Engine with basic sound generation

export type SoundType = 'noise' | 'tone' | 'ambient' | 'custom';
export type SoundMode = 'loop' | 'oneshot';

export interface SoundConfig {
  id: string;
  name: string;
  icon: string;
  category: string;
  type: SoundType;
  mode: SoundMode;
  subCategory: 'music' | 'ambient' | 'effect';
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
  detune?: number;
  attackTime?: number;
  decayTime?: number;
  sustainLevel?: number;
  releaseTime?: number;
  duration?: number;
  pitchEnvelope?: { from: number; to: number; time: number };
  filterEnvelope?: { from: number; to: number; time: number };
  // Custom sound support
  fileDataUrl?: string;
  fileMimeType?: string;
}

interface ActiveSound {
  nodes: AudioNode[];
  gain: GainNode;
  timeoutId?: number;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private activeSounds: Map<string, ActiveSound> = new Map();
  private masterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    this.convolver = this.ctx.createConvolver();
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.35;
    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.value = 0.65;
    this.createReverbIR(3, 2.5);
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
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    }
  }

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown', durationSec: number = 4): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * durationSec;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    if (type === 'white') {
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
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
    } else {
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

  // ===================== LOOP SOUNDS =====================
  playSound(soundId: string, config: SoundConfig, volume: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.stopSound(soundId);
    const ctx = this.ctx;
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(this.masterGain);
    gainNode.gain.setTargetAtTime(volume, ctx.currentTime, 0.5);
    const nodes: AudioNode[] = [gainNode];
    const params = config.params;

    switch (config.type) {
      case 'noise': this.generateNoise(ctx, gainNode, nodes, params); break;
      case 'tone': this.generateTone(ctx, gainNode, nodes, params); break;
      case 'ambient': this.generateAmbient(ctx, gainNode, nodes, params); break;
      case 'custom': this.generateCustom(ctx, gainNode, nodes, params, 'loop'); break;
      default: this.generateNoise(ctx, gainNode, nodes, params);
    }
    this.activeSounds.set(soundId, { nodes, gain: gainNode });
  }

  // ===================== BASIC GENERATORS =====================
  private generateNoise(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], params: SoundParams) {
    const buffer = this.createNoiseBuffer(params.noiseType || 'white');
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    if (params.filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = params.filterFreq;
      filter.Q.value = params.filterQ || 1;
      src.connect(filter);
      filter.connect(gain);
      nodes.push(filter);
    } else {
      src.connect(gain);
    }
    src.start();
    nodes.push(src);
  }

  private generateTone(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], params: SoundParams) {
    const freqs = params.frequencies || [440];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      if (params.detune && i > 0) osc.detune.value = (Math.random() - 0.5) * params.detune;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 1 / freqs.length;
      if (params.lfoRate) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = params.lfoRate + (Math.random() * 0.5);
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = params.lfoDepth || 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        nodes.push(lfo, lfoGain);
      }
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
      nodes.push(osc, oscGain);
    });
  }

  private generateAmbient(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], params: SoundParams) {
    const freqs = params.frequencies || [220, 330, 440];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = (params.lfoRate || 0.1) + Math.random() * 0.2;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = params.lfoDepth || 3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      const ampLfo = ctx.createOscillator();
      ampLfo.frequency.value = 0.05 + Math.random() * 0.1;
      const ampLfoGain = ctx.createGain();
      ampLfoGain.gain.value = 0.3;
      ampLfo.connect(ampLfoGain);
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.2;
      ampLfoGain.connect(oscGain.gain);
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
      lfo.start();
      ampLfo.start();
      nodes.push(osc, lfo, lfoGain, ampLfo, ampLfoGain, oscGain);
    });
  }

  // ===================== CUSTOM FILE =====================
  private generateCustom(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], params: SoundParams, mode: 'loop' | 'oneshot') {
    if (!params.fileDataUrl) return;
    
    fetch(params.fileDataUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const src = ctx.createBufferSource();
        src.buffer = audioBuffer;
        src.loop = mode === 'loop';
        src.connect(gain);
        src.start(0);
        nodes.push(src);
      })
      .catch(err => console.error('Failed to load custom sound:', err));
  }

  // ===================== ONE-SHOT SOUNDS =====================
  playOneShot(soundId: string, config: SoundConfig, volume: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const params = config.params;
    const now = ctx.currentTime;
    const duration = params.duration || 2;
    const attack = params.attackTime || 0.01;
    const decay = params.decayTime || 0.3;
    const sustain = params.sustainLevel || 0.3;
    const release = params.releaseTime || 0.5;
    const gainNode = ctx.createGain();
    gainNode.connect(this.masterGain);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.linearRampToValueAtTime(volume * sustain, now + attack + decay);
    gainNode.gain.setValueAtTime(volume * sustain, now + duration - release);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);
    const nodes: AudioNode[] = [gainNode];

    switch (config.type) {
      case 'noise': this.generateOneshotNoise(ctx, gainNode, nodes, now, duration, params); break;
      case 'tone': this.generateOneshotTone(ctx, gainNode, nodes, now, duration, params); break;
      case 'ambient': this.generateOneshotAmbient(ctx, gainNode, nodes, now, duration, params); break;
      case 'custom': this.generateCustom(ctx, gainNode, nodes, params, 'oneshot'); break;
      default: this.generateOneshotNoise(ctx, gainNode, nodes, now, duration, params);
    }

    const timeoutId = window.setTimeout(() => {
      nodes.forEach(n => { try { n.disconnect(); } catch(e) {} });
      this.activeSounds.delete(soundId);
    }, duration * 1000 + 100);
    this.activeSounds.set(soundId, { nodes, gain: gainNode, timeoutId });
  }

  private generateOneshotNoise(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, duration: number, params: SoundParams) {
    const buffer = this.createNoiseBuffer(params.noiseType || 'white', duration + 1);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    if (params.filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = params.filterQ && params.filterQ > 3 ? 'bandpass' : 'lowpass';
      if (params.filterEnvelope) {
        filter.frequency.setValueAtTime(params.filterEnvelope.from, now);
        filter.frequency.linearRampToValueAtTime(params.filterEnvelope.to, now + params.filterEnvelope.time);
      } else {
        filter.frequency.value = params.filterFreq;
      }
      filter.Q.value = params.filterQ || 1;
      src.connect(filter);
      filter.connect(gain);
      nodes.push(filter);
    } else {
      src.connect(gain);
    }
    src.start(now);
    src.stop(now + duration);
    nodes.push(src);
  }

  private generateOneshotTone(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, duration: number, params: SoundParams) {
    const freqs = params.frequencies || [440];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      if (params.pitchEnvelope) {
        osc.frequency.setValueAtTime(params.pitchEnvelope.from, now);
        osc.frequency.linearRampToValueAtTime(params.pitchEnvelope.to, now + params.pitchEnvelope.time);
      } else {
        osc.frequency.value = freq;
      }
      if (params.detune) osc.detune.value = (Math.random() - 0.5) * params.detune;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 1 / freqs.length;
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start(now);
      osc.stop(now + duration);
      nodes.push(osc, oscGain);
    });
  }

  private generateOneshotAmbient(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, duration: number, params: SoundParams) {
    const freqs = params.frequencies || [220, 330];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      if (params.lfoRate) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = params.lfoRate;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = params.lfoDepth || 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);
        nodes.push(lfo, lfoGain);
      }
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.3 / freqs.length;
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start(now);
      osc.stop(now + duration);
      nodes.push(osc, oscGain);
    });
  }

  // ===================== CONTROL =====================
  setSoundVolume(soundId: string, volume: number) {
    const sound = this.activeSounds.get(soundId);
    if (sound && this.ctx) {
      sound.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
    }
  }

  stopSound(soundId: string) {
    const sound = this.activeSounds.get(soundId);
    if (sound && this.ctx) {
      if (sound.timeoutId) clearTimeout(sound.timeoutId);
      sound.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      setTimeout(() => {
        sound.nodes.forEach(node => {
          try {
            if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) node.stop();
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

  getAnalyserNode(): AnalyserNode | null {
    if (!this.ctx || !this.masterGain) return null;
    const analyser = this.ctx.createAnalyser();
    analyser.fftSize = 256;
    this.masterGain.connect(analyser);
    return analyser;
  }
}

export const audioEngine = new AudioEngine();
