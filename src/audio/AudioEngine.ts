// Audio Engine with realistic procedural sound generation

export type SoundType = 'noise' | 'tone' | 'rhythm' | 'ambient' | 'fire' | 'bird' | 'wind' | 'water' | 'drum' | 'metal' | 'howl' | 'cricket' | 'footstep' | 'bell' | 'magic' | 'custom';
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
  rhythmPattern?: number[];
  rhythmBpm?: number;
  detune?: number;
  attackTime?: number;
  decayTime?: number;
  sustainLevel?: number;
  releaseTime?: number;
  duration?: number;
  pitchEnvelope?: { from: number; to: number; time: number };
  filterEnvelope?: { from: number; to: number; time: number };
  crackleIntensity?: number;
  chirpFreqRange?: [number, number];
  gustIntensity?: number;
  bubbleRate?: number;
  drumTone?: number;
  metalHarmonics?: number[];
  howlFormant?: number;
  cricketSpeed?: number;
  bellPartial?: number[];
  magicShimmer?: number;
  // Custom sound support
  fileDataUrl?: string;
  fileMimeType?: string;
}

interface ActiveSound {
  nodes: AudioNode[];
  gain: GainNode;
  timeoutId?: number;
  intervalIds?: number[];
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
    const intervalIds: number[] = [];
    const params = config.params;

    switch (config.type) {
      case 'fire': this.generateFire(ctx, gainNode, nodes, intervalIds, params); break;
      case 'bird': this.generateBirds(ctx, gainNode, nodes, intervalIds, params); break;
      case 'wind': this.generateWind(ctx, gainNode, nodes, params); break;
      case 'water': this.generateWater(ctx, gainNode, nodes, intervalIds, params); break;
      case 'cricket': this.generateCrickets(ctx, gainNode, nodes, intervalIds, params); break;
      case 'drum': this.generateDrumLoop(ctx, gainNode, nodes, intervalIds, params); break;
      case 'noise': this.generateNoise(ctx, gainNode, nodes, params); break;
      case 'tone': this.generateTone(ctx, gainNode, nodes, params); break;
      case 'rhythm': this.generateRhythm(ctx, gainNode, nodes, intervalIds, params); break;
      case 'ambient': this.generateAmbient(ctx, gainNode, nodes, params); break;
      case 'custom': this.generateCustom(ctx, gainNode, nodes, params, config.mode); break;
      default: this.generateNoise(ctx, gainNode, nodes, params);
    }
    this.activeSounds.set(soundId, { nodes, gain: gainNode, intervalIds });
  }

  // ===================== FIRE =====================
  private generateFire(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], intervals: number[], params: SoundParams) {
    const fireBuffer = this.createNoiseBuffer('brown', 4);
    const fireSrc = ctx.createBufferSource();
    fireSrc.buffer = fireBuffer;
    fireSrc.loop = true;
    const fireFilter = ctx.createBiquadFilter();
    fireFilter.type = 'lowpass';
    fireFilter.frequency.value = params.filterFreq || 600;
    fireFilter.Q.value = 0.7;
    const fireLfo = ctx.createOscillator();
    fireLfo.frequency.value = 0.15 + Math.random() * 0.1;
    const fireLfoGain = ctx.createGain();
    fireLfoGain.gain.value = 150;
    fireLfo.connect(fireLfoGain);
    fireLfoGain.connect(fireFilter.frequency);
    fireLfo.start();
    const fireGain = ctx.createGain();
    fireGain.gain.value = 0.6;
    fireSrc.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(gain);
    fireSrc.start();
    nodes.push(fireSrc, fireFilter, fireLfo, fireLfoGain, fireGain);

    const crackleIntensity = params.crackleIntensity || 3;
    const scheduleCrackle = () => {
      const now = ctx.currentTime;
      const crackleBuffer = this.createNoiseBuffer('white', 0.05);
      const crackleSrc = ctx.createBufferSource();
      crackleSrc.buffer = crackleBuffer;
      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.value = 2000 + Math.random() * 4000;
      crackleFilter.Q.value = 2 + Math.random() * 3;
      const crackleGain = ctx.createGain();
      const intensity = 0.1 + Math.random() * 0.3;
      crackleGain.gain.setValueAtTime(0, now);
      crackleGain.gain.linearRampToValueAtTime(intensity, now + 0.002);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03 + Math.random() * 0.05);
      crackleSrc.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      crackleGain.connect(gain);
      crackleSrc.start(now);
      crackleSrc.stop(now + 0.1);
      const nextDelay = (0.3 + Math.random() * 1.5) / crackleIntensity;
      const id = window.setTimeout(scheduleCrackle, nextDelay * 1000);
      intervals.push(id);
    };
    scheduleCrackle();
  }

  // ===================== BIRDS =====================
  private generateBirds(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], intervals: number[], params: SoundParams) {
    const freqRange = params.chirpFreqRange || [2000, 5000];
    const scheduleBird = () => {
      const now = ctx.currentTime;
      const baseFreq = freqRange[0] + Math.random() * (freqRange[1] - freqRange[0]);
      const chirpCount = 2 + Math.floor(Math.random() * 4);
      const chirpDuration = 0.08 + Math.random() * 0.05;
      for (let i = 0; i < chirpCount; i++) {
        const chirpTime = now + i * (chirpDuration + 0.02);
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const freq = baseFreq * (1 + Math.random() * 0.3);
        osc.frequency.setValueAtTime(freq, chirpTime);
        osc.frequency.linearRampToValueAtTime(freq * (0.8 + Math.random() * 0.4), chirpTime + chirpDuration);
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, chirpTime);
        osc2.frequency.linearRampToValueAtTime(freq * 2 * 0.9, chirpTime + chirpDuration);
        const chirpGain = ctx.createGain();
        const vol = 0.08 + Math.random() * 0.12;
        chirpGain.gain.setValueAtTime(0, chirpTime);
        chirpGain.gain.linearRampToValueAtTime(vol, chirpTime + 0.005);
        chirpGain.gain.linearRampToValueAtTime(vol * 0.7, chirpTime + chirpDuration * 0.5);
        chirpGain.gain.linearRampToValueAtTime(0, chirpTime + chirpDuration);
        const harmGain = ctx.createGain();
        harmGain.gain.value = 0.3;
        osc.connect(chirpGain);
        osc2.connect(harmGain);
        harmGain.connect(chirpGain);
        chirpGain.connect(gain);
        osc.start(chirpTime);
        osc.stop(chirpTime + chirpDuration + 0.01);
        osc2.start(chirpTime);
        osc2.stop(chirpTime + chirpDuration + 0.01);
      }
      const nextDelay = 1 + Math.random() * 4;
      const id = window.setTimeout(scheduleBird, nextDelay * 1000);
      intervals.push(id);
    };
    scheduleBird();
  }

  // ===================== WIND =====================
  private generateWind(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], params: SoundParams) {
    const windBuffer = this.createNoiseBuffer('pink', 6);
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = windBuffer;
    windSrc.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = params.filterFreq || 800;
    windFilter.Q.value = params.filterQ || 1.5;
    const lfo1 = ctx.createOscillator();
    lfo1.frequency.value = 0.08;
    const lfo1Gain = ctx.createGain();
    lfo1Gain.gain.value = 300;
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(windFilter.frequency);
    lfo1.start();
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.05;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 1;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(windFilter.Q);
    lfo2.start();
    const windGain = ctx.createGain();
    windGain.gain.value = 0.7;
    windSrc.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(gain);
    windSrc.start();
    nodes.push(windSrc, windFilter, lfo1, lfo1Gain, lfo2, lfo2Gain, windGain);

    const gustIntensity = params.gustIntensity || 0.5;
    const scheduleGust = () => {
      const now = ctx.currentTime;
      const gustDuration = 1.5 + Math.random() * 2;
      windGain.gain.setValueAtTime(0.7, now);
      windGain.gain.linearRampToValueAtTime(0.7 + gustIntensity, now + gustDuration * 0.3);
      windGain.gain.linearRampToValueAtTime(0.7, now + gustDuration);
    };
    window.setInterval(scheduleGust, 6000);
  }

  // ===================== WATER =====================
  private generateWater(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], intervals: number[], params: SoundParams) {
    const waterBuffer = this.createNoiseBuffer('white', 4);
    const waterSrc = ctx.createBufferSource();
    waterSrc.buffer = waterBuffer;
    waterSrc.loop = true;
    const waterFilter = ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.value = params.filterFreq || 3500;
    waterFilter.Q.value = params.filterQ || 2;
    const flowLfo = ctx.createOscillator();
    flowLfo.frequency.value = 0.2 + Math.random() * 0.2;
    const flowLfoGain = ctx.createGain();
    flowLfoGain.gain.value = 500;
    flowLfo.connect(flowLfoGain);
    flowLfoGain.connect(waterFilter.frequency);
    flowLfo.start();
    const waterGain = ctx.createGain();
    waterGain.gain.value = 0.4;
    waterSrc.connect(waterFilter);
    waterFilter.connect(waterGain);
    waterGain.connect(gain);
    waterSrc.start();
    nodes.push(waterSrc, waterFilter, flowLfo, flowLfoGain, waterGain);

    const bubbleRate = params.bubbleRate || 2;
    const scheduleBubble = () => {
      const now = ctx.currentTime;
      const bubbleOsc = ctx.createOscillator();
      bubbleOsc.type = 'sine';
      const freq = 400 + Math.random() * 600;
      bubbleOsc.frequency.setValueAtTime(freq * 1.5, now);
      bubbleOsc.frequency.exponentialRampToValueAtTime(freq, now + 0.05);
      const bubbleGain = ctx.createGain();
      bubbleGain.gain.setValueAtTime(0, now);
      bubbleGain.gain.linearRampToValueAtTime(0.15 + Math.random() * 0.1, now + 0.005);
      bubbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      bubbleOsc.connect(bubbleGain);
      bubbleGain.connect(gain);
      bubbleOsc.start(now);
      bubbleOsc.stop(now + 0.15);
      const nextDelay = (0.5 + Math.random() * 1.5) / bubbleRate;
      const id = window.setTimeout(scheduleBubble, nextDelay * 1000);
      intervals.push(id);
    };
    scheduleBubble();
  }

  // ===================== CRICKETS =====================
  private generateCrickets(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], intervals: number[], params: SoundParams) {
    const baseFreq = 4500 + Math.random() * 500;
    const scheduleChirp = () => {
      const now = ctx.currentTime;
      const chirpDuration = 0.015;
      const chirpsInBurst = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < chirpsInBurst; i++) {
        const t = now + i * (chirpDuration + 0.005);
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseFreq + (Math.random() - 0.5) * 200;
        const chirpGain = ctx.createGain();
        chirpGain.gain.setValueAtTime(0, t);
        chirpGain.gain.linearRampToValueAtTime(0.12, t + 0.002);
        chirpGain.gain.linearRampToValueAtTime(0, t + chirpDuration);
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = baseFreq * 2;
        const harmGain = ctx.createGain();
        harmGain.gain.value = 0.3;
        osc.connect(chirpGain);
        osc2.connect(harmGain);
        harmGain.connect(chirpGain);
        chirpGain.connect(gain);
        osc.start(t);
        osc.stop(t + chirpDuration + 0.01);
        osc2.start(t);
        osc2.stop(t + chirpDuration + 0.01);
      }
      const patternPos = Math.random();
      let nextDelay: number;
      if (patternPos < 0.6) nextDelay = 0.3 + Math.random() * 0.3;
      else if (patternPos < 0.9) nextDelay = 0.8 + Math.random() * 0.5;
      else nextDelay = 2 + Math.random() * 3;
      const id = window.setTimeout(scheduleChirp, nextDelay * 1000);
      intervals.push(id);
    };
    scheduleChirp();
  }

  // ===================== DRUM LOOP =====================
  private generateDrumLoop(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], intervals: number[], params: SoundParams) {
    const pattern = params.rhythmPattern || [1, 0, 0.5, 0];
    const bpm = params.rhythmBpm || 80;
    const beatDuration = 60 / bpm;
    const drumTone = params.drumTone || 60;
    const scheduleLoop = () => {
      pattern.forEach((velocity, i) => {
        if (velocity > 0) {
          const time = ctx.currentTime + i * beatDuration;
          const bodyOsc = ctx.createOscillator();
          bodyOsc.type = 'sine';
          bodyOsc.frequency.setValueAtTime(drumTone * 2.5, time);
          bodyOsc.frequency.exponentialRampToValueAtTime(drumTone, time + 0.08);
          const bodyGain = ctx.createGain();
          bodyGain.gain.setValueAtTime(0, time);
          bodyGain.gain.linearRampToValueAtTime(velocity * 0.8, time + 0.003);
          bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
          const attackBuffer = this.createNoiseBuffer('brown', 0.1);
          const attackSrc = ctx.createBufferSource();
          attackSrc.buffer = attackBuffer;
          const attackFilter = ctx.createBiquadFilter();
          attackFilter.type = 'lowpass';
          attackFilter.frequency.value = 500;
          const attackGain = ctx.createGain();
          attackGain.gain.setValueAtTime(0, time);
          attackGain.gain.linearRampToValueAtTime(velocity * 0.4, time + 0.001);
          attackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
          bodyOsc.connect(bodyGain);
          bodyGain.connect(gain);
          attackSrc.connect(attackFilter);
          attackFilter.connect(attackGain);
          attackGain.connect(gain);
          bodyOsc.start(time);
          bodyOsc.stop(time + 0.4);
          attackSrc.start(time);
          attackSrc.stop(time + 0.1);
        }
      });
      const id = window.setTimeout(scheduleLoop, pattern.length * beatDuration * 1000 - 50);
      intervals.push(id);
    };
    scheduleLoop();
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

  private generateRhythm(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], intervals: number[], params: SoundParams) {
    const pattern = params.rhythmPattern || [1, 0, 0.5, 0];
    const bpm = params.rhythmBpm || 80;
    const beatDuration = 60 / bpm;
    const scheduleLoop = () => {
      pattern.forEach((velocity, i) => {
        if (velocity > 0) {
          const time = ctx.currentTime + i * beatDuration;
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.value = params.frequencies?.[0] || 80;
          const env = ctx.createGain();
          env.gain.setValueAtTime(0, time);
          env.gain.linearRampToValueAtTime(velocity * 0.5, time + 0.01);
          env.gain.exponentialRampToValueAtTime(0.001, time + beatDuration * 0.8);
          osc.connect(env);
          env.connect(gain);
          osc.start(time);
          osc.stop(time + beatDuration);
        }
      });
      const id = window.setTimeout(scheduleLoop, pattern.length * beatDuration * 1000 - 50);
      intervals.push(id);
    };
    scheduleLoop();
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
      case 'metal': this.generateMetalHit(ctx, gainNode, nodes, now, params); break;
      case 'howl': this.generateHowl(ctx, gainNode, nodes, now, duration, params); break;
      case 'bell': this.generateBell(ctx, gainNode, nodes, now, duration, params); break;
      case 'magic': this.generateMagic(ctx, gainNode, nodes, now, duration, params); break;
      case 'footstep': this.generateFootstep(ctx, gainNode, nodes, now, params); break;
      case 'noise': this.generateOneshotNoise(ctx, gainNode, nodes, now, duration, params); break;
      case 'tone': this.generateOneshotTone(ctx, gainNode, nodes, now, duration, params); break;
      case 'rhythm': this.generateOneshotRhythm(ctx, gainNode, nodes, now, params); break;
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

  private generateMetalHit(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, params: SoundParams) {
    const harmonics = params.metalHarmonics || [800, 1547, 2341, 3477, 5123];
    harmonics.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq + (Math.random() - 0.5) * 20;
      const partialGain = ctx.createGain();
      const amp = 0.5 / (i + 1);
      partialGain.gain.setValueAtTime(0, now);
      partialGain.gain.linearRampToValueAtTime(amp, now + 0.001);
      partialGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + i * 0.2);
      osc.connect(partialGain);
      partialGain.connect(gain);
      osc.start(now);
      osc.stop(now + 1.5);
      nodes.push(osc, partialGain);
    });
    const impactBuffer = this.createNoiseBuffer('white', 0.1);
    const impactSrc = ctx.createBufferSource();
    impactSrc.buffer = impactBuffer;
    const impactFilter = ctx.createBiquadFilter();
    impactFilter.type = 'highpass';
    impactFilter.frequency.value = 3000;
    const impactGain = ctx.createGain();
    impactGain.gain.setValueAtTime(0.6, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    impactSrc.connect(impactFilter);
    impactFilter.connect(impactGain);
    impactGain.connect(gain);
    impactSrc.start(now);
    impactSrc.stop(now + 0.1);
    nodes.push(impactSrc, impactFilter, impactGain);
  }

  private generateHowl(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, duration: number, params: SoundParams) {
    const formant = params.howlFormant || 250;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(formant * 0.7, now);
    osc.frequency.linearRampToValueAtTime(formant * 1.3, now + duration * 0.3);
    osc.frequency.setValueAtTime(formant * 1.3, now + duration * 0.6);
    osc.frequency.linearRampToValueAtTime(formant * 0.9, now + duration);
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5 + Math.random() * 2;
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 8;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(now);
    vibrato.stop(now + duration);
    const formantFilter = ctx.createBiquadFilter();
    formantFilter.type = 'bandpass';
    formantFilter.frequency.value = formant * 3;
    formantFilter.Q.value = 5;
    const formantFilter2 = ctx.createBiquadFilter();
    formantFilter2.type = 'bandpass';
    formantFilter2.frequency.value = formant * 5;
    formantFilter2.Q.value = 8;
    const formantGain1 = ctx.createGain();
    formantGain1.gain.value = 0.7;
    const formantGain2 = ctx.createGain();
    formantGain2.gain.value = 0.3;
    osc.connect(formantFilter);
    formantFilter.connect(formantGain1);
    formantGain1.connect(gain);
    osc.connect(formantFilter2);
    formantFilter2.connect(formantGain2);
    formantGain2.connect(gain);
    osc.start(now);
    osc.stop(now + duration);
    nodes.push(osc, vibrato, vibratoGain, formantFilter, formantFilter2, formantGain1, formantGain2);
  }

  private generateBell(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, duration: number, params: SoundParams) {
    const partials = params.bellPartial || [1, 2.0, 2.4, 3.0, 4.2, 5.4, 6.7];
    const baseFreq = params.frequencies?.[0] || 200;
    partials.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = baseFreq * ratio;
      const partialGain = ctx.createGain();
      const amp = 0.4 / (i + 1);
      const decayTime = duration * (1 - i * 0.1);
      partialGain.gain.setValueAtTime(0, now);
      partialGain.gain.linearRampToValueAtTime(amp, now + 0.005);
      partialGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.5, decayTime));
      osc.connect(partialGain);
      partialGain.connect(gain);
      osc.start(now);
      osc.stop(now + duration);
      nodes.push(osc, partialGain);
    });
    const strikeBuffer = this.createNoiseBuffer('white', 0.05);
    const strikeSrc = ctx.createBufferSource();
    strikeSrc.buffer = strikeBuffer;
    const strikeFilter = ctx.createBiquadFilter();
    strikeFilter.type = 'bandpass';
    strikeFilter.frequency.value = baseFreq * 3;
    strikeFilter.Q.value = 2;
    const strikeGain = ctx.createGain();
    strikeGain.gain.setValueAtTime(0.3, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    strikeSrc.connect(strikeFilter);
    strikeFilter.connect(strikeGain);
    strikeGain.connect(gain);
    strikeSrc.start(now);
    strikeSrc.stop(now + 0.05);
    nodes.push(strikeSrc, strikeFilter, strikeGain);
  }

  private generateMagic(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, duration: number, params: SoundParams) {
    const shimmer = params.magicShimmer || 10;
    const baseFreq = params.frequencies?.[0] || 440;
    for (let i = 0; i < shimmer; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const freq = baseFreq * (1 + i * 0.1) + Math.random() * 50;
      osc.frequency.setValueAtTime(freq * 0.5, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 2, now + duration * 0.7);
      osc.frequency.exponentialRampToValueAtTime(freq, now + duration);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 2 + Math.random() * 8;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 5 + Math.random() * 15;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      const oscGain = ctx.createGain();
      const amp = 0.15 / Math.sqrt(i + 1);
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(amp, now + duration * 0.3);
      oscGain.gain.linearRampToValueAtTime(0, now + duration);
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start(now);
      osc.stop(now + duration);
      lfo.start(now);
      lfo.stop(now + duration);
      nodes.push(osc, lfo, lfoGain, oscGain);
    }
    for (let i = 0; i < 5; i++) {
      const t = now + (duration / 5) * i + Math.random() * 0.2;
      const sparkleBuffer = this.createNoiseBuffer('white', 0.05);
      const sparkleSrc = ctx.createBufferSource();
      sparkleSrc.buffer = sparkleBuffer;
      const sparkleFilter = ctx.createBiquadFilter();
      sparkleFilter.type = 'highpass';
      sparkleFilter.frequency.value = 8000;
      const sparkleGain = ctx.createGain();
      sparkleGain.gain.setValueAtTime(0, t);
      sparkleGain.gain.linearRampToValueAtTime(0.1, t + 0.005);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      sparkleSrc.connect(sparkleFilter);
      sparkleFilter.connect(sparkleGain);
      sparkleGain.connect(gain);
      sparkleSrc.start(t);
      sparkleSrc.stop(t + 0.1);
      nodes.push(sparkleSrc, sparkleFilter, sparkleGain);
    }
  }

  private generateFootstep(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, _params: SoundParams) {
    const impactOsc = ctx.createOscillator();
    impactOsc.type = 'sine';
    impactOsc.frequency.setValueAtTime(150, now);
    impactOsc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    const impactGain = ctx.createGain();
    impactGain.gain.setValueAtTime(0.5, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    const scuffBuffer = this.createNoiseBuffer('brown', 0.2);
    const scuffSrc = ctx.createBufferSource();
    scuffSrc.buffer = scuffBuffer;
    const scuffFilter = ctx.createBiquadFilter();
    scuffFilter.type = 'bandpass';
    scuffFilter.frequency.value = 1500;
    scuffFilter.Q.value = 2;
    const scuffGain = ctx.createGain();
    scuffGain.gain.setValueAtTime(0, now);
    scuffGain.gain.linearRampToValueAtTime(0.2, now + 0.01);
    scuffGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    impactOsc.connect(impactGain);
    impactGain.connect(gain);
    scuffSrc.connect(scuffFilter);
    scuffFilter.connect(scuffGain);
    scuffGain.connect(gain);
    impactOsc.start(now);
    impactOsc.stop(now + 0.2);
    scuffSrc.start(now);
    scuffSrc.stop(now + 0.2);
    nodes.push(impactOsc, impactGain, scuffSrc, scuffFilter, scuffGain);
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

  private generateOneshotRhythm(ctx: AudioContext, gain: GainNode, nodes: AudioNode[], now: number, params: SoundParams) {
    const pattern = params.rhythmPattern || [1, 0, 0.5, 0];
    const bpm = params.rhythmBpm || 80;
    const beatDuration = 60 / bpm;
    pattern.forEach((velocity, i) => {
      if (velocity > 0) {
        const time = now + i * beatDuration;
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = params.frequencies?.[0] || 80;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, time);
        env.gain.linearRampToValueAtTime(velocity * 0.5, time + 0.005);
        env.gain.exponentialRampToValueAtTime(0.001, time + beatDuration * 0.6);
        osc.connect(env);
        env.connect(gain);
        osc.start(time);
        osc.stop(time + beatDuration);
        nodes.push(osc, env);
      }
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
      if (sound.intervalIds) sound.intervalIds.forEach(id => clearTimeout(id));
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
