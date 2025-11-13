<template>
	<div class="main-screen">
		<div class="title-container">
			<h1 class="game-title">🎮 Poke Memories</h1>
			<p class="subtitle">Trò chơi lật thẻ Pokemon - Test trí nhớ của bạn!</p>
		</div>

		<div class="mode-selection">
			<h3>Chọn độ khó để bắt đầu</h3>
			<div class="mode-grid">
				<button class="mode-btn easy" @click="onStart(16, 'Easy')">
					<div class="mode-icon">😊</div>
					<span class="mode-size">4x4</span>
					<span class="mode-label">Dễ</span>
					<span class="mode-desc">16 thẻ</span>
				</button>

				<button class="mode-btn normal" @click="onStart(36, 'Normal')">
					<div class="mode-icon">😐</div>
					<span class="mode-size">6x6</span>
					<span class="mode-label">Trung bình</span>
					<span class="mode-desc">36 thẻ</span>
				</button>

				<button class="mode-btn hard" @click="onStart(64, 'Hard')">
					<div class="mode-icon">😰</div>
					<span class="mode-size">8x8</span>
					<span class="mode-label">Khó</span>
					<span class="mode-desc">64 thẻ</span>
				</button>

				<button class="mode-btn super-hard" @click="onStart(100, 'Super Hard')">
					<div class="mode-icon">🔥</div>
					<span class="mode-size">10x10</span>
					<span class="mode-label">Siêu khó</span>
					<span class="mode-desc">100 thẻ</span>
				</button>
			</div>
		</div>

		<div class="instructions">
			<h4>📖 Cách chơi:</h4>
			<ul>
				<li>Lật 2 thẻ mỗi lượt để tìm cặp Pokemon giống nhau</li>
				<li>Nhớ vị trí các Pokemon để ghép cặp nhanh hơn</li>
				<li>Hoàn thành tất cả các cặp để thắng game!</li>
			</ul>
		</div>
	</div>
</template>

<script>
import audioService from '../services/audioService'

export default {
	name: 'MainScreen',
	methods: {
		onStart(totalCard, difficulty) {
			// Phát âm thanh click
			audioService.playClick();
			this.$emit("onStart", { totalCard, difficulty });
		}
	}
}
</script>

<style scoped>
.main-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: calc(100vh - 100px);
	padding: 40px 20px;
}

.title-container {
	text-align: center;
	margin-bottom: 50px;
	animation: fadeInDown 0.8s ease;
}

@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.game-title {
	font-size: 64px;
	font-weight: bold;
	color: var(--primary);
	text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
	margin-bottom: 10px;
	letter-spacing: 2px;
}

.subtitle {
	font-size: 20px;
	color: var(--light);
	font-weight: 300;
}

.mode-selection {
	text-align: center;
	margin-bottom: 40px;
	animation: fadeIn 1s ease 0.3s both;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.mode-selection h3 {
	font-size: 24px;
	margin-bottom: 30px;
	color: var(--light);
}

.mode-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 20px;
	max-width: 900px;
}

.mode-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 30px 20px;
	background: rgba(255, 255, 255, 0.1);
	border: 4px solid rgba(255, 255, 255, 0.2);
	border-radius: 20px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
	position: relative;
	overflow: hidden;
	backdrop-filter: blur(10px);
}

.mode-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 100%);
	opacity: 0;
	transition: opacity 0.3s;
}

.mode-btn:hover::before {
	opacity: 1;
}

.mode-btn:hover {
	transform: translateY(-10px) scale(1.05);
	box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.mode-btn.easy {
	border-color: #4caf50;
}

.mode-btn.easy:hover {
	background: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
	color: white;
}

.mode-btn.normal {
	border-color: #2196f3;
}

.mode-btn.normal:hover {
	background: linear-gradient(135deg, #64b5f6 0%, #2196f3 100%);
	color: white;
}

.mode-btn.hard {
	border-color: #ff9800;
}

.mode-btn.hard:hover {
	background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
	color: white;
}

.mode-btn.super-hard {
	border-color: #f44336;
}

.mode-btn.super-hard:hover {
	background: linear-gradient(135deg, #e57373 0%, #f44336 100%);
	color: white;
}

.mode-icon {
	font-size: 48px;
	margin-bottom: 8px;
}

.mode-size {
	font-size: 28px;
	font-weight: bold;
	color: white;
}

.mode-btn:hover .mode-size,
.mode-btn:hover .mode-label,
.mode-btn:hover .mode-desc {
	color: white;
	transform: scale(1.05);
}

.mode-label {
	font-size: 18px;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
}

.mode-desc {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.7);
}

.instructions {
	background: rgba(255, 255, 255, 0.1);
	padding: 30px;
	border-radius: 15px;
	max-width: 600px;
	backdrop-filter: blur(10px);
	animation: fadeIn 1s ease 0.6s both;
}

.instructions h4 {
	font-size: 22px;
	margin-bottom: 15px;
	color: var(--primary);
}

.instructions ul {
	list-style: none;
	padding: 0;
}

.instructions li {
	font-size: 16px;
	margin-bottom: 10px;
	padding-left: 25px;
	position: relative;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.9);
}

.instructions li::before {
	content: "✓";
	position: absolute;
	left: 0;
	color: var(--primary);
	font-weight: bold;
	font-size: 20px;
}

@media (max-width: 768px) {
	.game-title {
		font-size: 48px;
	}

	.subtitle {
		font-size: 16px;
	}

	.mode-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.instructions {
		padding: 20px;
	}
}

@media (max-width: 480px) {
	.game-title {
		font-size: 36px;
	}

	.mode-grid {
		grid-template-columns: 1fr;
	}
}
</style>
