export {CanvasPainter, randomStrokeData}

class CanvasPainter {
	// the 'view' of the mvc
	ctx;
	strokeFn;
	targetFr;
	state = true;
	constructor(elId, strokeFn, targetFr=30){
		this.ctx = document.getElementById(elId).getContext("2d");
		/** Stroke Function**/
		this.strokeFn = strokeFn; 
		// function to get rendering data from a separate program 
		// designed to work with canvas painter
		this.targetFr=1000/targetFr;
	}
	stroke = async function(x, y, radius, color){
		// create path
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI *2, false);
	
		// create gradient
		var grd = this.ctx.createRadialGradient(x, y, 0, x+radius, y+radius, 100);
		grd.addColorStop(0, color);
		grd.addColorStop(1, "transparent");
	
		// fill with gradient
		this.ctx.fillStyle = grd;
		this.ctx.fill();
		this.ctx.closePath();
	}
	getStrokeData = function(){
		// connect to output of model
		// output function should return an vector of [x, y, radius, color]
		console.log("gathering stroke data");
		return this.strokeFn();
	}
	draw = async function(){
		if (this.state){
			let strokeData = this.getStrokeData();
			for (let s in strokeData){
				let _s = strokeData[s];
				this.stroke(_s[0], _s[1], _s[2], _s[3], this.ctx);
				setInterval(this.targetFr);
			}
			await window.requestAnimationFrame(this.draw.bind(this));
		}
	}
	play = function(){
		this.draw();
	}
	togglePause = function(){
		this.state = !this.state;
		if (this.state){
			this.play()
		}
	}
	reset = function(strokeFn){
		// clears screen and sets strokeFn
		this.state = false;
		this.strokeFn = strokeFn;
	}
}

let randomStrokeData = _ => {
	let strokes = []
	// pass into strokeFn when instancing CanvasPainter
	let colors = [
		"orange",
		"red",
		"pink",
		"purple",
		"green",
	];
	while (strokes.length < 100){    
		let x = Math.floor(Math.random() * innerWidth);
		let y = Math.floor(Math.random() * innerHeight);
		let radius = Math.random() * (0.001 * ((innerHeight*.1) * innerWidth*.1));
		let color = colors[Math.floor(Math.random() * colors.length)];
		strokes.push([x, y, radius, color]);
	}    
	return strokes;
}
