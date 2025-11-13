<template>
	<div class="result-screen">
		<div class="result-container">
			<div class="trophy-animation">
				<div class="trophy">🏆</div>
				<div class="stars">
					<span class="star">⭐</span>
					<span class="star">⭐</span>
					<span class="star">⭐</span>
				</div>
			</div>

			<h1 class="result-title">Chúc mừng!</h1>
			<p class="result-subtitle">Bạn đã hoàn thành trò chơi</p>

			<div class="stats-container">
				<div class="stat-card">
					<div class="stat-icon">⏱️</div>
					<div class="stat-label">Thời gian</div>
					<div class="stat-value">{{ formattedTime }}</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">🔄</div>
					<div class="stat-label">Số lượt</div>
					<div class="stat-value">{{ moves }}</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">📊</div>
					<div class="stat-label">Độ khó</div>
					<div class="stat-value">{{ difficulty }}</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">⭐</div>
					<div class="stat-label">Đánh giá</div>
					<div class="stat-value">{{ rating }}</div>
				</div>
			</div>

			<div class="performance-message">
				<p class="performance-text">{{ performanceMessage }}</p>
				<div class="performance-emoji">{{ performanceEmoji }}</div>
			</div>

			<div class="action-buttons">
				<button @click="handlePlayAgain" class="btn-primary">
					🎮 Chơi lại
				</button>
				<button @click="handleBackToMenu" class="btn-secondary">
					🏠 Về menu
				</button>
			</div>

			<div class="share-section">
				<p>Chia sẻ kết quả của bạn:</p>
				<div class="share-buttons">
					<button @click="copyResult" class="share-btn">
						📋 Copy
					</button>
					<button class="share-btn">
						🐦 Twitter
					</button>
					<button class="share-btn">
						📘 Facebook
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import audioService from '../services/audioService'

export default {
	name: 'ResultScreen',
	props: {
		moves: {
			type: Number,
			required: true
		},
		time: {
			type: Number,
			required: true
		},
		difficulty: {
			type: String,
			required: true
		}
	},
	mounted() {
		// Phát âm thanh victory khi hiển thị kết quả
		setTimeout(() => {
			audioService.playVictory();
		}, 300);
	},
	computed: {
		formattedTime() {
			const minutes = Math.floor(this.time / 60);
			const seconds = this.time % 60;
			return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		},
		rating() {
			// Tính điểm dựa trên số lượt và thời gian
			let score = 5;

			// Điểm theo độ khó
			const difficultyMultiplier = {
				'Easy': 1,
				'Normal': 1.5,
				'Hard': 2,
				'Super Hard': 2.5
			};

			const multiplier = difficultyMultiplier[this.difficulty] || 1;

			// Giảm điểm nếu lượt đi quá nhiều
			const expectedMoves = this.getExpectedMoves();
			if (this.moves > expectedMoves * 2) {
				score -= 2;
			} else if (this.moves > expectedMoves * 1.5) {
				score -= 1;
			}

			// Giảm điểm nếu thời gian quá lâu
			const expectedTime = this.getExpectedTime();
			if (this.time > expectedTime * 2) {
				score -= 1;
			}

			return Math.max(1, Math.min(5, Math.round(score * multiplier))) + '⭐';
		},
		performanceMessage() {
			const expectedMoves = this.getExpectedMoves();
			const efficiency = (expectedMoves / this.moves) * 100;

			if (efficiency >= 90) {
				return 'Xuất sắc! Trí nhớ của bạn tuyệt vời!';
			} else if (efficiency >= 75) {
				return 'Rất tốt! Bạn có trí nhớ ấn tượng!';
			} else if (efficiency >= 60) {
				return 'Tốt! Tiếp tục cố gắng nhé!';
			} else if (efficiency >= 45) {
				return 'Được rồi! Lần sau sẽ tốt hơn!';
			} else {
				return 'Cần cố gắng hơn! Đừng bỏ cuộc!';
			}
		},
		performanceEmoji() {
			const expectedMoves = this.getExpectedMoves();
			const efficiency = (expectedMoves / this.moves) * 100;

			if (efficiency >= 90) return '🌟';
			if (efficiency >= 75) return '😄';
			if (efficiency >= 60) return '😊';
			if (efficiency >= 45) return '🙂';
			return '💪';
		}
	},
	methods: {
		getExpectedMoves() {
			// Số lượt tối ưu = số cặp * 2 (mỗi cặp 2 lượt nếu nhớ hoàn hảo)
			const pairs = {
				'Easy': 8,
				'Normal': 18,
				'Hard': 32,
				'Super Hard': 50
			};
			return (pairs[this.difficulty] || 8) * 1.5; // Thêm 50% buffer
		},
		getExpectedTime() {
			// Thời gian dự kiến (giây)
			const times = {
				'Easy': 60,
				'Normal': 180,
				'Hard': 300,
				'Super Hard': 600
			};
			return times[this.difficulty] || 60;
		},
		copyResult() {
			audioService.playClick();
			const text = `🎮 Poké Memories
Độ khó: ${this.difficulty}
Thời gian: ${this.formattedTime}
Số lượt: ${this.moves}
Đánh giá: ${this.rating}

${this.performanceMessage}`;

			navigator.clipboard.writeText(text).then(() => {
				alert('Đã copy kết quả vào clipboard!');
			}).catch(() => {
				alert('Không thể copy. Vui lòng thử lại!');
			});
		},
		handlePlayAgain() {
			audioService.playClick();
			this.$emit('playAgain');
		},
		handleBackToMenu() {
			audioService.playClick();
			this.$emit('backToMenu');
		}
	}
}
</script>

<style scoped>
.result-screen {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: calc(100vh - 100px);
	padding: 20px;
}

.result-container {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 30px;
	padding: 50px;
	max-width: 800px;
	width: 100%;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	animation: slideIn 0.6s ease;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(50px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.trophy-animation {
	text-align: center;
	margin-bottom: 30px;
	position: relative;
}

.trophy {
	font-size: 120px;
	display: inline-block;
	animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
	0%, 100% {
		transform: translateY(0) scale(1);
	}
	50% {
		transform: translateY(-20px) scale(1.1);
	}
}

.stars {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-top: 20px;
}

.star {
	font-size: 40px;
	display: inline-block;
	animation: twinkle 1.5s ease-in-out infinite;
}

.star:nth-child(1) {
	animation-delay: 0s;
}

.star:nth-child(2) {
	animation-delay: 0.3s;
}

.star:nth-child(3) {
	animation-delay: 0.6s;
}

@keyframes twinkle {
	0%, 100% {
		transform: scale(1) rotate(0deg);
		opacity: 1;
	}
	50% {
		transform: scale(1.3) rotate(180deg);
		opacity: 0.7;
	}
}

.result-title {
	text-align: center;
	font-size: 48px;
	color: #667eea;
	margin-bottom: 10px;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.result-subtitle {
	text-align: center;
	font-size: 20px;
	color: #666;
	margin-bottom: 40px;
}

.stats-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 20px;
	margin-bottom: 40px;
}

.stat-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	padding: 25px;
	border-radius: 15px;
	text-align: center;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	transition: transform 0.3s;
}

.stat-card:hover {
	transform: translateY(-5px);
}

.stat-icon {
	font-size: 36px;
	margin-bottom: 10px;
}

.stat-label {
	font-size: 14px;
	opacity: 0.9;
	margin-bottom: 8px;
}

.stat-value {
	font-size: 24px;
	font-weight: bold;
}

.performance-message {
	background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
	padding: 25px;
	border-radius: 15px;
	margin-bottom: 30px;
	text-align: center;
	border: 3px solid #ff9800;
}

.performance-text {
	font-size: 20px;
	font-weight: 600;
	color: #e65100;
	margin-bottom: 10px;
}

.performance-emoji {
	font-size: 48px;
}

.action-buttons {
	display: flex;
	gap: 15px;
	margin-bottom: 30px;
}

.btn-primary, .btn-secondary {
	flex: 1;
	padding: 15px 30px;
	border: none;
	border-radius: 12px;
	font-size: 18px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s;
}

.btn-primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
	transform: translateY(-3px);
	box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
	background: white;
	color: #667eea;
	border: 3px solid #667eea;
}

.btn-secondary:hover {
	background: #f5f5f5;
	transform: translateY(-3px);
}

.share-section {
	text-align: center;
	padding-top: 30px;
	border-top: 2px solid #e0e0e0;
}

.share-section p {
	color: #666;
	margin-bottom: 15px;
	font-size: 16px;
}

.share-buttons {
	display: flex;
	justify-content: center;
	gap: 10px;
	flex-wrap: wrap;
}

.share-btn {
	padding: 10px 20px;
	background: white;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.3s;
	font-size: 14px;
}

.share-btn:hover {
	background: #f5f5f5;
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
	.result-container {
		padding: 30px 20px;
	}

	.result-title {
		font-size: 36px;
	}

	.trophy {
		font-size: 80px;
	}

	.stars .star {
		font-size: 30px;
	}

	.stats-container {
		grid-template-columns: repeat(2, 1fr);
	}

	.action-buttons {
		flex-direction: column;
	}
}

@media (max-width: 480px) {
	.result-container {
		padding: 20px 15px;
	}

	.result-title {
		font-size: 28px;
	}

	.result-subtitle {
		font-size: 16px;
	}

	.trophy {
		font-size: 60px;
	}

	.stats-container {
		grid-template-columns: 1fr;
	}

	.performance-text {
		font-size: 16px;
	}

	.btn-primary, .btn-secondary {
		font-size: 16px;
		padding: 12px 20px;
	}
}
</style>
