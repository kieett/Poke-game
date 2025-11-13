// Audio Service for Pokemon Game
class AudioService {
	constructor() {
		this.audioContext = null;
		this.initialized = false;
	}

	// Khởi tạo Audio Context (cần user interaction)
	init() {
		if (!this.initialized && !this.audioContext) {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			this.initialized = true;
		}
	}

	// Tạo âm thanh flip card
	playFlip() {
		this.init();
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		oscillator.frequency.value = 400;
		oscillator.type = 'sine';

		gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + 0.1);
	}

	// Tạo âm thanh match (khi khớp cặp)
	playMatch() {
		this.init();
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
		oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
		oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
		oscillator.type = 'sine';

		gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + 0.4);
	}

	// Tạo âm thanh mismatch (khi không khớp)
	playMismatch() {
		this.init();
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		oscillator.frequency.value = 200;
		oscillator.type = 'sawtooth';

		gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + 0.3);
	}

	// Tạo âm thanh victory (chúc mừng chiến thắng)
	playVictory() {
		this.init();
		// Tạo một melody vui vẻ
		const notes = [
			{ freq: 523.25, time: 0 },    // C5
			{ freq: 659.25, time: 0.15 },  // E5
			{ freq: 783.99, time: 0.3 },   // G5
			{ freq: 1046.5, time: 0.45 },  // C6
			{ freq: 783.99, time: 0.6 },   // G5
			{ freq: 1046.5, time: 0.75 },  // C6
			{ freq: 1318.5, time: 0.9 }    // E6
		];

		notes.forEach(note => {
			const oscillator = this.audioContext.createOscillator();
			const gainNode = this.audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(this.audioContext.destination);

			oscillator.frequency.value = note.freq;
			oscillator.type = 'sine';

			const startTime = this.audioContext.currentTime + note.time;
			gainNode.gain.setValueAtTime(0.3, startTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

			oscillator.start(startTime);
			oscillator.stop(startTime + 0.3);
		});

		// Thêm bass drum
		this.playDrum(0);
		this.playDrum(0.45);
		this.playDrum(0.9);
	}

	// Tạo âm thanh drum
	playDrum(delay = 0) {
		if (!this.audioContext) return;

		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		const startTime = this.audioContext.currentTime + delay;

		oscillator.frequency.setValueAtTime(150, startTime);
		oscillator.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.1);
		oscillator.type = 'sine';

		gainNode.gain.setValueAtTime(0.5, startTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

		oscillator.start(startTime);
		oscillator.stop(startTime + 0.1);
	}

	// Tạo âm thanh khi click button
	playClick() {
		this.init();
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		oscillator.frequency.value = 800;
		oscillator.type = 'sine';

		gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

		oscillator.start(this.audioContext.currentTime);
		oscillator.stop(this.audioContext.currentTime + 0.05);
	}

	// Tạo âm thanh Pokemon được bắt (giống Pokeball)
	playPokemonCatch() {
		this.init();
		// Âm thanh "bóp" của Pokeball
		const frequencies = [800, 600, 400, 800];
		frequencies.forEach((freq, index) => {
			const oscillator = this.audioContext.createOscillator();
			const gainNode = this.audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(this.audioContext.destination);

			const startTime = this.audioContext.currentTime + (index * 0.1);
			oscillator.frequency.value = freq;
			oscillator.type = 'square';

			gainNode.gain.setValueAtTime(0.2, startTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

			oscillator.start(startTime);
			oscillator.stop(startTime + 0.08);
		});
	}
}

export default new AudioService();
