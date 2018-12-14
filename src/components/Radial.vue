<template>
	<canvas ref="canvas"></canvas>
</template>
<script>

import Dot from '@/dot.js';

export default {
	data() {
		return {
			canvas: null,
			context: null,
			width: 0,
			height: 0,
			dots: [],
			background: '#EFFFFA',
			dotsPerLayer: [1, 8, 16, 24, 32, 40, 48, 56, 64, 72],
			colours: ['#C3BEF7', '#E5A4CB', '#80CED7', '#EDBBB4'],
			layerSpacing: 90,
			dotRadius: 25,
			clickCount: [],
		};
	},
	mounted() {
		this.canvas = this.$refs.canvas;
		this.context = this.canvas.getContext('2d');
		this.resizeCanvas();
		this.createDots();
		this.gameLoop();

		for (let i = 0; i < this.dotsPerLayer.length; i += 1) {
			this.clickCount.push(1);
		}

		window.addEventListener('resize', this.resizeCanvas);
		window.addEventListener('click', this.handleClick);
		window.addEventListener('keydown', this.handleKeyInput);
	},
	methods: {
		resizeCanvas() {
			this.canvas.width = window.innerWidth * window.devicePixelRatio;
			this.canvas.height = window.innerHeight * window.devicePixelRatio;
			this.width = this.canvas.width;
			this.height = this.canvas.height;
		},
		createDots() {

			for (let i = 0; i < this.dotsPerLayer.length; i += 1) {
				let angle = 0;
				for (let j = 0; j < this.dotsPerLayer[i]; j += 1) {

					const step = (Math.PI * 2) / this.dotsPerLayer[i];
					const x = (this.width / 2) + ((this.layerSpacing + this.dotRadius) * i) * Math.cos(angle);
					const y = (this.height / 2) + ((this.layerSpacing + this.dotRadius) * i) * Math.sin(angle);

					angle += step;

					const dot = new Dot(
						this.context,
						{x: this.width / 2, y: this.height / 2},
						{x: x, y: y},
						i,
						this.dotRadius,
						this.colours[Math.floor(Math.random() * this.colours.length)],
					);

					this.dots.push(dot);
				}
			}

		},
		gameLoop() {
			window.requestAnimationFrame(this.gameLoop);
			this.context.fillStyle = this.background;
			this.context.fillRect(0, 0, this.width, this.height);

			for (let i = 0; i < this.dots.length; i += 1) {
				this.dots[i].draw();
				this.dots[i].update();
			}
		},
		handleRotate(index) {

			if (!index) return;

			const layer = index;

			// Get reference array of dots with the layer we want to move.
			const dotsToTransform = this.dots.filter(dot => dot.layer === layer);

			// Calculate the step size for this layer
			const step = (Math.PI * 2) / dotsToTransform.length;

			let angle = step * this.clickCount[layer];

			for (let i = 0; i < dotsToTransform.length; i += 1) {
				const x = (this.width / 2) + ((this.layerSpacing + this.dotRadius) * layer) * Math.cos(angle);
				const y = (this.height / 2) + ((this.layerSpacing + this.dotRadius) * layer) * Math.sin(angle);

				// dotsToTransform[i].position.x = x;
				// dotsToTransform[i].position.y = y;
				dotsToTransform[i].destination.x = x;
				dotsToTransform[i].destination.y = y;
				angle += step;
			}

			this.clickCount[layer]++;
		},
		handleKeyInput(event) {
			const key = event.key;
			const n = parseInt(event.key);
			if (!isNaN(n)) {
				this.handleRotate(n);
			}
		},
		handleClick() {
			for (let i = 0; i < this.clickCount.length; i += 1) {
				this.handleRotate(i);
			}
		},
	},
};
</script>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>