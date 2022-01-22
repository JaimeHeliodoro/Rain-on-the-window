let seed = "openprocessing";
let nums;
let maxLife = 20;
let noiseScale = 400;
let	simulationSpeed = 0.2;
let fadeFrame = 0;

let padding_top = 100;
let padding_side = 100;
let inner_square = 512;

let particles = [];
let backgroundColor;
let color_from;
let color_to;

function setup(){
	randomSeed(seed);
	noiseSeed(seed);
	nums = 100;
	
	backgroundColor = color(20, 20, 20);
	color_from = color('purple');
	color_to = color('cyan');
	
	createCanvas(windowWidth, windowHeight);
	background(backgroundColor);
	
	noStroke();
	smooth();
	
	padding_top = (height - inner_square)/2;
	padding_side = (width - inner_square)/2;
	
	for(let i = 0; i < nums; i++){
		let p = new Particle();
		p.pos.x = random(padding_side, width-padding_side);
		p.pos.y = padding_top;
		particles[i] = p;
	}
	
	background(color(0));
	fill(color(0,0,200));
}

function draw(){
	
	++fadeFrame;
	if(fadeFrame % 5 == 0){
		
		blendMode(DIFFERENCE);
		fill(1, 1, 1);
		rect(0,0,width,height);

		blendMode(LIGHTEST);
		fill(backgroundColor);
		rect(0,0,width,height);
	}
	
	blendMode(BLEND);
	
	for(let i = 0; i < nums; i++){
		let iterations = map(i,0,nums,5,1);
		let radius = map(i,0,nums,2,6);
		
		particles[i].move(iterations);
		particles[i].checkEdge();
		
		let alpha = 200;
		
		let particle_heading = particles[i].vel.heading()/PI;
		if(particle_heading < 0){
				particle_heading *= -1;
		}
		let particle_color = lerpColor(particles[i].color1, particles[i].color2, particle_heading);
		
		let fade_ratio;
		fade_ratio = min(particles[i].life * 5 / maxLife, 1);
		fade_ratio = min((maxLife - particles[i].life) * 5 / maxLife, fade_ratio);

		fill(red(particle_color), green(particle_color), blue(particle_color), alpha * fade_ratio);
		particles[i].display(radius);
	} 
}

function Particle(){
	this.vel = createVector(0, 0);
	this.pos = createVector(random(0, width), random(0, height));
	this.life = random(0, maxLife);
	this.flip = int(random(0,2)) * 2 - 1;
	this.color1 = this.color2 = color('white');
	
	if(int(random(3)) == 1){
		this.color1 = color_from;
		this.color2 = color_to;
	}
	

	this.move = function(iterations){
		if((this.life -= 0.01666) < 0)
			this.respawnTop();
		while(iterations > 0){
			
			let transition = map(this.pos.x, padding_side, width-padding_side, 0, 1);
			let angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*transition*TWO_PI*noiseScale;

			this.vel.x = cos(angle);
			this.vel.y = sin(angle);
			this.vel.mult(simulationSpeed);
			this.pos.add(this.vel);
			--iterations;
		}
	}

	this.checkEdge = function(){
		if(this.pos.x > width - padding_side
		|| this.pos.x < padding_side
		|| this.pos.y > height - padding_top
		|| this.pos.y < padding_top){
			this.respawnTop();
		}
	}
	
	this.respawn = function(){
		this.pos.x = random(0, width);
		this.pos.y = random(0, height);
		this.life = maxLife;
	}
	
	this.respawnTop = function() {
		this.pos.x = random(padding_side, width-padding_side);
		this.pos.y = padding_top;
		this.life = maxLife;
	
	}

	this.display = function(r){
		ellipse(this.pos.x, this.pos.y, r, r);
	}
}