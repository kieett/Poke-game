<template>
	<div id="app">
		<MainScreen
			v-if="status === 'default'"
			@onStart="chooseMode($event)"
		/>
		<PlayScreen
			v-else-if="status === 'playing'"
			:totalCards="totalCards"
			@gameFinished="handleGameFinished"
			@backToMenu="backToMenu"
		/>
		<ResultScreen
			v-else-if="status === 'finished'"
			:moves="moves"
			:time="time"
			:difficulty="difficulty"
			@playAgain="playAgain"
			@backToMenu="backToMenu"
		/>
		<FooterScreen />
	</div>
</template>

<script>
import MainScreen from './components/MainScreen.vue'
import PlayScreen from './components/PlayScreen.vue'
import ResultScreen from './components/ResultScreen.vue'
import FooterScreen from './components/FooterScreen.vue'

export default {
	name: 'App',
	components: {
		MainScreen,
		PlayScreen,
		ResultScreen,
		FooterScreen
	},
	data() {
		return {
			status: 'default', // default, playing, finished
			totalCards: 16,
			moves: 0,
			time: 0,
			difficulty: 'Easy'
		};
	},
	methods: {
		chooseMode(config) {
			console.log("Starting game with config:", config);
			this.totalCards = config.totalCard;
			this.difficulty = config.difficulty;
			this.status = "playing";
		},
		handleGameFinished(data) {
			this.moves = data.moves;
			this.time = data.time;
			this.status = "finished";
		},
		playAgain() {
			this.status = "playing";
			this.moves = 0;
			this.time = 0;
		},
		backToMenu() {
			this.status = "default";
			this.moves = 0;
			this.time = 0;
		}
	}
}
</script>

<style>
@import './assets/styles/global.css';

#app {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: var(--light);
}
</style>
