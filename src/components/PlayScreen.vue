<template>
	<div class="play-screen">
		<div class="game-header">
			<button class="back-btn" @click="confirmBack">
				← Trở về
			</button>

			<div class="game-stats">
				<div class="stat-item">
					<span class="stat-icon">⏱️</span>
					<span class="stat-value">{{ formattedTime }}</span>
				</div>
				<div class="stat-item">
					<span class="stat-icon">🔄</span>
					<span class="stat-value">{{ moves }} lượt</span>
				</div>
				<div class="stat-item">
					<span class="stat-icon">✅</span>
					<span class="stat-value">{{ matchedPairs }}/{{ totalPairs }}</span>
				</div>
			</div>

			<div class="action-buttons">
				<button class="sound-btn" @click="toggleSound" :title="soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'">
					{{ soundEnabled ? '🔊' : '🔇' }}
				</button>
				<button class="restart-btn" @click="confirmRestart">
					🔄 Chơi lại
				</button>
			</div>
		</div>

		<div v-if="loading" class="loading-screen">
			<div class="pokeball-loader">
				<div class="pokeball-loader-inner"></div>
			</div>
			<p>Đang tải Pokemon...</p>
		</div>

		<div v-else class="game-board" :style="gridStyle">
			<CardFlip
				v-for="(card, index) in cards"
				:key="index"
				:pokemon="card.pokemon"
				:isFlipped="card.isFlipped"
				:isMatched="card.isMatched"
				@card-click="handleCardClick(index)"
			/>
		</div>

		<!-- Confirm Dialog -->
		<div v-if="showConfirm" class="modal-overlay" @click="closeConfirm">
			<div class="confirm-dialog" @click.stop>
				<h3>⚠️ Xác nhận</h3>
				<p>{{ confirmMessage }}</p>
				<div class="confirm-actions">
					<button @click="closeConfirm" class="btn-cancel">Hủy</button>
					<button @click="confirmAction" class="btn-confirm">Đồng ý</button>
				</div>
			</div>
		</div>

		<!-- Victory Animation -->
		<div v-if="showVictory" class="victory-overlay">
			<div class="victory-content">
				<div class="trophy">🏆</div>
				<h2>Chúc mừng!</h2>
				<p>Bạn đã hoàn thành trò chơi!</p>
			</div>
		</div>
	</div>
</template>

<script>
import CardFlip from './CardGame.vue'
import axios from 'axios'
import audioService from '../services/audioService'

export default {
	name: 'PlayScreen',
	components: {
		CardFlip
	},
	props: {
		totalCards: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			cards: [],
			flippedCards: [],
			matchedPairs: 0,
			moves: 0,
			time: 0,
			timer: null,
			loading: true,
			showConfirm: false,
			confirmMessage: '',
			confirmCallback: null,
			showVictory: false,
			canFlip: true,
			soundEnabled: true
		};
	},
	computed: {
		totalPairs() {
			return this.totalCards / 2;
		},
		gridStyle() {
			const columns = Math.sqrt(this.totalCards);
			return {
				gridTemplateColumns: `repeat(${columns}, 1fr)`
			};
		},
		formattedTime() {
			const minutes = Math.floor(this.time / 60);
			const seconds = this.time % 60;
			return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}
	},
	async mounted() {
		await this.initializeGame();
		this.startTimer();
	},
	beforeUnmount() {
		this.stopTimer();
	},
	methods: {
		async initializeGame() {
			this.loading = true;
			try {
				// Lấy danh sách Pokemon ngẫu nhiên
				const pokemonData = await this.fetchRandomPokemon(this.totalPairs);

				// Tạo các cặp thẻ và xáo trộn
				const pairs = [...pokemonData, ...pokemonData];
				this.cards = this.shuffleArray(pairs).map((pokemon, index) => ({
					id: index,
					pokemon,
					isFlipped: false,
					isMatched: false
				}));
			} catch (error) {
				console.error('Error loading Pokemon:', error);
				alert('Lỗi khi tải dữ liệu Pokemon. Vui lòng thử lại!');
			} finally {
				this.loading = false;
			}
		},

		async fetchRandomPokemon(count) {
			const pokemonList = [];
			const usedIds = new Set();

			// Lấy Pokemon từ ID 1-898 (Gen 1-8)
			while (pokemonList.length < count) {
				const randomId = Math.floor(Math.random() * 898) + 1;

				if (!usedIds.has(randomId)) {
					usedIds.add(randomId);
					try {
						const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
						pokemonList.push({
							id: response.data.id,
							name: response.data.name,
							image: response.data.sprites.other['official-artwork'].front_default ||
								response.data.sprites.front_default
						});
					} catch (error) {
						console.error(`Error fetching Pokemon ${randomId}:`, error);
					}
				}
			}

			return pokemonList;
		},

		shuffleArray(array) {
			const shuffled = [...array];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			return shuffled;
		},

		handleCardClick(index) {
			if (!this.canFlip || this.flippedCards.length >= 2) return;

			const card = this.cards[index];
			if (card.isFlipped || card.isMatched) return;

			// Phát âm thanh lật thẻ
			if (this.soundEnabled) {
				audioService.playFlip();
			}

			// Lật thẻ
			card.isFlipped = true;
			this.flippedCards.push(index);

			// Nếu đã lật 2 thẻ
			if (this.flippedCards.length === 2) {
				this.moves++;
				this.canFlip = false;
				this.checkMatch();
			}
		},

		checkMatch() {
			const [index1, index2] = this.flippedCards;
			const card1 = this.cards[index1];
			const card2 = this.cards[index2];

			if (card1.pokemon.id === card2.pokemon.id) {
				// Khớp!
				// Phát âm thanh match
				if (this.soundEnabled) {
					audioService.playMatch();
					audioService.playPokemonCatch();
				}

				setTimeout(() => {
					card1.isMatched = true;
					card2.isMatched = true;
					this.matchedPairs++;
					this.flippedCards = [];
					this.canFlip = true;

					// Kiểm tra thắng
					if (this.matchedPairs === this.totalPairs) {
						this.handleVictory();
					}
				}, 500);
			} else {
				// Không khớp
				// Phát âm thanh mismatch
				if (this.soundEnabled) {
					audioService.playMismatch();
				}

				setTimeout(() => {
					card1.isFlipped = false;
					card2.isFlipped = false;
					this.flippedCards = [];
					this.canFlip = true;
				}, 1000);
			}
		},

		handleVictory() {
			this.stopTimer();

			// Phát âm thanh chiến thắng
			if (this.soundEnabled) {
				audioService.playVictory();
			}

			this.showVictory = true;

			setTimeout(() => {
				this.showVictory = false;
				this.$emit('gameFinished', {
					moves: this.moves,
					time: this.time
				});
			}, 2000);
		},

		startTimer() {
			this.timer = setInterval(() => {
				this.time++;
			}, 1000);
		},

		stopTimer() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},

		confirmRestart() {
			this.confirmMessage = 'Bạn có chắc muốn chơi lại? Tiến trình hiện tại sẽ bị mất.';
			this.confirmCallback = this.restart;
			this.showConfirm = true;
		},

		confirmBack() {
			this.confirmMessage = 'Bạn có chắc muốn quay về menu? Tiến trình hiện tại sẽ bị mất.';
			this.confirmCallback = () => {
				this.$emit('backToMenu');
			};
			this.showConfirm = true;
		},

		closeConfirm() {
			this.showConfirm = false;
			this.confirmCallback = null;
		},

		confirmAction() {
			if (this.confirmCallback) {
				this.confirmCallback();
			}
			this.closeConfirm();
		},

		async restart() {
			this.stopTimer();
			this.moves = 0;
			this.time = 0;
			this.matchedPairs = 0;
			this.flippedCards = [];
			this.canFlip = true;
			await this.initializeGame();
			this.startTimer();
		},

		toggleSound() {
			this.soundEnabled = !this.soundEnabled;
			// Phát âm thanh click khi toggle
			if (this.soundEnabled) {
				audioService.playClick();
			}
		}
	},
}
</script>

<style scoped>
.play-screen {
	padding: 20px;
	min-height: calc(100vh - 100px);
}

.game-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;
	background: rgba(255, 255, 255, 0.1);
	padding: 15px 20px;
	border-radius: 15px;
	backdrop-filter: blur(10px);
	flex-wrap: wrap;
	gap: 15px;
}

.back-btn, .restart-btn {
	padding: 10px 20px;
	background: white;
	color: #667eea;
	border: none;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.back-btn:hover, .restart-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.game-stats {
	display: flex;
	gap: 30px;
	flex-wrap: wrap;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 18px;
	font-weight: 600;
	color: white;
}

.stat-icon {
	font-size: 24px;
}

.loading-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	color: white;
}

.pokeball-loader {
	width: 80px;
	height: 80px;
	background: linear-gradient(to bottom, #ee1515 0%, #ee1515 50%, white 50%, white 100%);
	border-radius: 50%;
	border: 5px solid #212121;
	position: relative;
	animation: spin 1s linear infinite;
}

.pokeball-loader::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 20px;
	height: 20px;
	background: white;
	border-radius: 50%;
	border: 5px solid #212121;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-screen p {
	margin-top: 20px;
	font-size: 20px;
}

.game-board {
	display: grid;
	gap: 10px;
	max-width: 1200px;
	margin: 0 auto;
	justify-content: center;
}

/* Modal */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	animation: fadeIn 0.3s;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

.confirm-dialog {
	background: white;
	padding: 30px;
	border-radius: 15px;
	max-width: 400px;
	text-align: center;
	animation: slideUp 0.3s;
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.confirm-dialog h3 {
	color: #333;
	margin-bottom: 15px;
	font-size: 24px;
}

.confirm-dialog p {
	color: #666;
	margin-bottom: 25px;
	font-size: 16px;
}

.confirm-actions {
	display: flex;
	gap: 15px;
	justify-content: center;
}

.btn-cancel, .btn-confirm {
	padding: 10px 30px;
	border: none;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
}

.btn-cancel {
	background: #f5f5f5;
	color: #666;
}

.btn-cancel:hover {
	background: #e0e0e0;
}

.btn-confirm {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
}

.btn-confirm:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Victory Animation */
.victory-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2000;
	animation: fadeIn 0.5s;
}

.victory-content {
	text-align: center;
	color: white;
	animation: bounceIn 0.8s;
}

@keyframes bounceIn {
	0% {
		opacity: 0;
		transform: scale(0.3);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

.trophy {
	font-size: 120px;
	margin-bottom: 20px;
	animation: rotate 2s ease-in-out infinite;
}

@keyframes rotate {
	0%, 100% { transform: rotate(-10deg); }
	50% { transform: rotate(10deg); }
}

.victory-content h2 {
	font-size: 48px;
	color: var(--primary);
	margin-bottom: 10px;
}

.victory-content p {
	font-size: 24px;
}

/* Responsive */
@media (max-width: 768px) {
	.game-header {
		flex-direction: column;
		text-align: center;
	}

	.game-stats {
		justify-content: center;
	}

	.stat-item {
		font-size: 16px;
	}

	.game-board {
		gap: 5px;
	}
}

@media (max-width: 480px) {
	.play-screen {
		padding: 10px;
	}

	.stat-item {
		font-size: 14px;
	}

	.stat-icon {
		font-size: 20px;
	}

	.victory-content h2 {
		font-size: 36px;
	}

	.trophy {
		font-size: 80px;
	}
}
</style>

