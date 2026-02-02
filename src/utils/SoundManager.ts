class SoundManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;

    constructor() {
        try {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.3; // Default volume
        } catch (e) {
            console.error('Web Audio API not supported');
        }
    }

    private ensureContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
        }
        return this.isMuted;
    }

    // Procedural sound generation

    public playPop() {
        if (this.isMuted || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Pop sound: rapid pitch drop, short envelope
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    public playDrip() {
        if (this.isMuted || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Water drop: sine wave with pitch bend up
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + Math.random() * 100, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600 + Math.random() * 100, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    public playExplosion() {
        if (this.isMuted || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        // "Splash" noise
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 sec
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 1000;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start();
    }

    public playLevelUp() {
        if (this.isMuted || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        const now = this.ctx.currentTime;

        // Simple arpeggio
        [440, 554, 659, 880].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.frequency.value = freq;

            const start = now + i * 0.1;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.5, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.4);

            osc.start(start);
            osc.stop(start + 0.4);
        });
    }

    public playGameOver() {
        if (this.isMuted || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 1);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);

        osc.start();
        osc.stop(this.ctx.currentTime + 1);
    }
}

export const soundManager = new SoundManager();
