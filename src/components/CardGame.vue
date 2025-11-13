<template>
	<div
		class="card"
		:class="{ 'is-flipped': isFlipped, 'is-matched': isMatched }"
		@click="handleClick"
	>
		<div class="card_inner">
			<div class="card_face card_face--front">
				<div class="card_content">
					<div class="pokeball">
						<div class="pokeball-button"></div>
					</div>
				</div>
			</div>
			<div class="card_face card_face--back">
				<div class="card_content">
					<img
						v-if="pokemon"
						:src="pokemon.image"
						:alt="pokemon.name"
						class="pokemon-image"
					/>
					<div class="pokemon-name">{{ pokemon?.name }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CardGame',
	props: {
		pokemon: {
			type: Object,
			required: true
		},
		isFlipped: {
			type: Boolean,
			default: false
		},
		isMatched: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		handleClick() {
			if (!this.isFlipped && !this.isMatched) {
				this.$emit('card-click');
			}
		}
	}
}
</script>

<style scoped>
.card {
	display: inline-block;
	margin: 5px;
	width: 100px;
	height: 140px;
	perspective: 1000px;
	cursor: pointer;
}

.card_inner {
	position: relative;
	width: 100%;
	height: 100%;
	transition: transform 0.6s;
	transform-style: preserve-3d;
}

.card.is-flipped .card_inner {
	transform: rotateY(180deg);
}

.card.is-matched .card_inner {
	transform: rotateY(180deg);
	opacity: 0.6;
}

.card_face {
	position: absolute;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	overflow: hidden;
	border-radius: 12px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
}

.card_face--front {
	background: linear-gradient(135deg, #ee1515 0%, #f34949 50%, #ffffff 50%, #ffffff 100%);
	border: 3px solid #212121;
}

.card_face--back {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	transform: rotateY(180deg);
	border: 3px solid var(--primary);
}

.card_content {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 8px;
}

/* Pokeball on front */
.pokeball {
	width: 50px;
	height: 50px;
	background: #fff;
	border-radius: 50%;
	position: relative;
	border: 3px solid #212121;
	overflow: hidden;
}

.pokeball::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 50%;
	background: #ee1515;
}

.pokeball::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	height: 3px;
	background: #212121;
	transform: translateY(-50%);
}

.pokeball-button {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 15px;
	height: 15px;
	background: white;
	border-radius: 50%;
	border: 3px solid #212121;
	z-index: 10;
}

/* Pokemon on back */
.pokemon-image {
	width: 70px;
	height: 70px;
	object-fit: contain;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.pokemon-name {
	font-size: 11px;
	font-weight: bold;
	color: white;
	text-align: center;
	text-transform: capitalize;
	margin-top: 5px;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.card:hover:not(.is-matched) .card_inner {
	transform: scale(1.05);
}

.card.is-flipped:hover .card_inner,
.card.is-matched:hover .card_inner {
	transform: rotateY(180deg) scale(1.05);
}

/* Animation for matched cards */
@keyframes matchPulse {
	0%, 100% {
		transform: rotateY(180deg) scale(1);
	}
	50% {
		transform: rotateY(180deg) scale(1.1);
	}
}

.card.is-matched .card_inner {
	animation: matchPulse 0.5s ease;
}

/* Responsive */
@media (max-width: 768px) {
	.card {
		width: 80px;
		height: 110px;
		margin: 4px;
	}

	.pokemon-image {
		width: 55px;
		height: 55px;
	}

	.pokemon-name {
		font-size: 9px;
	}

	.pokeball {
		width: 40px;
		height: 40px;
	}

	.pokeball-button {
		width: 12px;
		height: 12px;
	}
}

@media (max-width: 480px) {
	.card {
		width: 65px;
		height: 90px;
		margin: 3px;
	}

	.pokemon-image {
		width: 45px;
		height: 45px;
	}

	.pokemon-name {
		font-size: 8px;
	}

	.pokeball {
		width: 35px;
		height: 35px;
	}
}
</style>
