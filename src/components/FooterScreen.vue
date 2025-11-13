<template>
	<footer class="footer">
		<div class="footer-content">
			<p class="footer-text">
				From Kieet with ❤️
				<a href="https://www.facebook.com/nguyen.tuan.kiet.279051/" target="_blank" rel="noopener">LOVE</a>
			</p>
			<p class="footer-subtext">
				Pokemon data from
				<a href="https://pokeapi.co" target="_blank" rel="noopener">PokéAPI</a>
			</p>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'FooterScreen'
}
</script>

<style scoped>
.footer {
	padding: 20px;
	background: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(10px);
	margin-top: auto;
}

.footer-content {
	text-align: center;
	color: white;
}

.footer-text {
	font-size: 16px;
	margin-bottom: 5px;
}

.footer-subtext {
	font-size: 14px;
	opacity: 0.8;
}

.footer a {
	color: var(--primary);
	text-decoration: none;
	font-weight: 600;
	transition: all 0.3s;
}

.footer a:hover {
	color: var(--sencondary);
	text-decoration: underline;
}

@media (max-width: 480px) {
	.footer-text {
		font-size: 14px;
	}

	.footer-subtext {
		font-size: 12px;
	}
}
</style>

