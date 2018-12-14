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
			dotsPerLayer: [1, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96],
			colours: ['#C3BEF7', '#E5A4CB', '#80CED7', '#EDBBB4'],
			layerSpacing: 90,
			dotRadius: 10,
			clickCount: [],
			rotationDirections: [],
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
			this.rotationDirections.push(true);
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
		handleRotate(index, clockwise) {

			/**
			 * Index refers to which layer
			 * we will be rotating.
			 *
			 * 0 = middle, 1 = 1 row from center and so on.
			 */

			if (!index) return;
			const layer = index;

			/**
			 * Direction
			 * True = clockwise
			 * False = anti-clockwise
			 */

			let direction = false;
			if (clockwise) direction = clockwise;

			if (!direction) {
				if (this.rotationDirections[layer] === true) {
					this.clickCount[layer] -= 2;
				}
			} else {
				if (!this.rotationDirections[layer]) {
					this.clickCount[layer] += 2;
				}
			}

			// Get reference array of dots with the layer we want to move.
			const dotsToTransform = this.dots.filter(dot => dot.layer === layer);

			// Calculate the step size for this layer
			const step = (Math.PI * 2) / dotsToTransform.length;

			let angle = (step * this.clickCount[layer]);

			for (let i = 0; i < dotsToTransform.length; i += 1) {
				const x = (this.width / 2) + ((this.layerSpacing + this.dotRadius) * layer) * Math.cos(angle);
				const y = (this.height / 2) + ((this.layerSpacing + this.dotRadius) * layer) * Math.sin(angle);

				dotsToTransform[i].destination.x = x;
				dotsToTransform[i].destination.y = y;
				angle += step;
			}

			if (direction) {
				this.clickCount[layer]++;
			} else {
				this.clickCount[layer]--;
			}

			this.rotationDirections[layer] = direction;
		},
		handleKeyInput(event) {
			const key = event.key;

			const n = parseInt(event.key);

			if (!isNaN(n)) {
				this.handleRotate(n, true);
			}

			if (key === 'ArrowLeft') {
				this.rotateAll(false);
			} else if (key === 'ArrowRight') {
				this.rotateAll(true);
			}
		},
		handleClick(event) {
			const direction = ((event.clientX * window.devicePixelRatio) > (this.width / 2)) ? true : false;
			this.rotateAll(direction);
		},
		rotateAll(direction) {
			for (let i = 0; i < this.clickCount.length; i += 1) {
				this.handleRotate(i, direction);
			}
		}
	},
};
</script>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>