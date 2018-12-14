export default class Dot {
	constructor(_context, _position, _destination, _layer, _radius, _fill) {
		this.context = _context;
		this.position = _position;
		this.destination = _destination;
		this.layer = _layer;
		this.radius = _radius;
		this.fill = _fill;
		this.easing = 0.08;
	}

	draw() {
		this.context.beginPath();
		this.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = this.fill;
		this.context.fill();
	}

	update() {
		if (!this.destination.x || !this.destination.y) return;

		const distX = this.position.x + (this.destination.x - this.position.x) * this.easing;
		if (distX > 0.1) {
			this.position.x = (distX);
		}

		const distY = this.position.y + (this.destination.y - this.position.y) * this.easing;
		if (distY > 0.1) {
			this.position.y = (distY);
		}

		// console.log(distX, distY);
	}
}