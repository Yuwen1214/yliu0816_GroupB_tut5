// [My Change 4th Iteration] Change the ink drop color to a randomly generated Chinese style color
let circles = [];      // [Group code] an array to store all circle objects
let rippleCircles = []; // Store ripple effect objects triggered by user clicks

function setup() {
  // [Group Code] Create the canvas using the size of the window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // [Group Code] Use radians for angle measurements
  background('#f4f1e3');   // Set the background to a light beige
}

function draw() {
  background('#f4f1e3'); 

  // Loop through and render all ripple (ink spread) animations
  for (let r of rippleCircles) {
    r.update();            // update animations
    r.draw();              // draw each circle
  }

  for (let c of circles) {
    c.update(); // update animations
    c.draw();   // draw each circle
  }
}

function mousePressed() {
  let radius = 200;
  let x = mouseX;
  let y = mouseY;
  circles.push(new PatternCircle(x, y, radius));
  rippleCircles.push(new RippleCircle(x, y));
}

// Trigger ink drops on latest ripple circle
function keyPressed() {
  if (key === '1') {
    if (rippleCircles.length > 0) {
      rippleCircles[rippleCircles.length - 1].addInkDrop();
    }
  }
}

// [My Change 4th Iteration] Add Chinese style colors
class RippleCircle {
  constructor(x, y) {
  // Set initial position (center of the ripple)
    this.x = x;
    this.y = y;
    this.radius = 0;       // Initial radius 
    this.maxRadius = 130;  // Maximum radius the ripple can reach
    this.alpha = 40;       // Transparency of the ripple circle
    this.inkDrops = [];    // Add ink drop effects
    this.inkColors = [
      color(36, 39, 30),      // #24271E
      color(211, 164, 136),   // #D3A488
      color(59, 78, 61),      // #3B4E3D
      color(175, 95, 84),     // #AF5F54
      color(151, 8, 4),       // #970804
      color(46, 47, 37),      // #2E2F25
      color(29, 76, 80),      // #1D4C50
    ];
  }

  // Gradually increase the radius of the ripple
  update() {
    // If the current radius is less than the maximum allowed, increase the radius to create the expanding effect.
    if (this.radius < this.maxRadius) {
      this.radius += 2;     // increase radius by 2 units per frame
    }
  }

  // Display the expanding ripple circle
  draw() {
    fill(5, 7, 5, this.alpha); // origanal is fill(30, 30, 30, this.alpha)
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);

    for (let drop of this.inkDrops) {
      let c = drop.color;
      c.setAlpha(drop.alpha); 
      // [My Change 4th Iteration] Use p5.Color.setAlpha() to apply alpha to each ink drop
      // Source:https://p5js.org/reference/p5.Color/setAlpha/
      fill(c);                // Added color attribute
      noStroke();
      ellipse(this.x + drop.offsetX, this.y + drop.offsetY, drop.r * 2);
    }
  }
  
  addInkDrop() {
    for (let i = 0; i < 6; i++) {
      let c = random(this.inkColors);  // [My Change 4th Iteration] Randomly select a color from the set color array
      this.inkDrops.push({
        // Random horizontal and vertical offset to create scattered ink drop effect
        offsetX: random(-this.radius / 2, this.radius / 2),
        offsetY: random(-this.radius / 2, this.radius / 2),
        r: random(6, 12),  // Random radius to vary the size of each ink drop
        alpha: 80,
        color: c
      });
    }
  }
}

// [Group code] This class creates each circle design
class PatternCircle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angleDots = random(TWO_PI); // start rotation from a random angle
    this.dotSizes = [];              
    this.generateColors();           // pick random colors
  }

  // [Group Code] Pick random colors for this circle
  generateColors() {
    this.strokeColor = color(random(0, 255), random(0, 100), random(10, 150));
    this.baseCircleColor = color(random(200, 255), random(200, 255), random(200, 255));
    this.bgColor = color(random(150, 255), random(150, 255), random(150, 255));
    this.lineColor = color(random(200, 255), random(200, 255), random(0, 100));
    this.outerDotColor = color(random(0, 255), random(0, 80), random(0, 255), 120);

  // Adjusted the maximum radius for outer red dot rings
    this.dotSizes = [];
    let maxRadius = this.r * 0.2;  // originally r * 0.6
    for (let r = 9; r < maxRadius; r += 10) {
      this.dotSizes.push(random(3, 6)); // choose size for each ring of dots
    }
  }

  // Slowly rotate the red dots
  update() {
    this.angleDots += 0.005;
  }

  // Draw everything in this circle
  draw() {
    push();
    translate(this.x, this.y); // move to the circle’s center

    fill(this.baseCircleColor);
    noStroke();
    circle(0, 0, this.r * 0.5);  // originally r * 1.3


    // Draw rotating red dots
    push();
    rotate(this.angleDots); 
    this.drawOuterDots(0, 0, this.r);
    pop();

    fill(this.bgColor);
    stroke(this.strokeColor);
    strokeWeight(5);
    circle(0, 0, this.r * 0.3); // originally r * 0.63

    // Draw lines from center like spikes
    stroke(this.lineColor);
    let spikes = 20; // [My change] Draw radiating spokes (reduced from 30 to 20 for visual simplicity)
    let innerR = 10;
    let outerR = 30;
    for (let i = 0; i < spikes; i++) {
      strokeWeight(i % 2 === 0 ? 3 : 1.5); // thick and thin lines
      let angle1 = TWO_PI * i / spikes;
      let angle2 = TWO_PI * (i + 1) / spikes;
      let x1 = cos(angle1) * innerR;
      let y1 = sin(angle1) * innerR;
      let x2 = cos(angle2) * outerR;
      let y2 = sin(angle2) * outerR;
      line(x1, y1, x2, y2);
    }

    // Draw several small colored circles in the center
    noStroke();
    fill(255, 65, 70);
    circle(0, 0, this.r * 0.23);

    fill(100, 130, 100); 
    circle(0, 0, this.r * 0.02); // originally r * 0.2

    noFill();
    stroke(80, 255, 120, 60);
    strokeWeight(2.5);

    fill(180, 50, 80); 
    circle(0, 0, this.r * 0.1); // originally r * 0.15

    fill(30, 180, 60);
    circle(0, 0, this.r * 0.07);

    fill(255);
    circle(0, 0, this.r * 0.03);

    // Draw two black arcs for decoration
    stroke(30, 40, 50, 90);
    strokeWeight(2);
    noFill();
    arc(0, 0, 24, 23, PI * 1.05, PI * 1.85);
    arc(0, 0, 20, 25, PI * 0.45, PI * 0.75);

    // Inspired by traditional Chinese oil-paper umbrella rib patterns
    let stamenCount = 17; // Number of ribs to draw
    let rotateAngle = frameCount * 0.02;
    push();
    rotate(rotateAngle);

    stroke(0, 0, 0, 60);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < stamenCount; i++) {
      let angle = TWO_PI * i / stamenCount; // Angle for each rib
      push();
      rotate(angle);

      // Bezier curve shaped like an umbrella rib
      bezier(0, 0, this.r * 0.09, -this.r * 0.1, this.r * 0.2, this.r * 0.05, this.r * 0.6, this.r * 0.2);
      pop(); // End rotation for current rib
    }
    pop(); // end bezier rotation
    pop(); // end main drawing
  }

  // [Group code] Draw red dots in rings around the center
  drawOuterDots(x, y, r) {
    let maxRadius = r * 0.2; // originally r * 0.23
    let ringIndex = 0;
    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10); // how many dots on this ring
      let dotSize = this.dotSizes[ringIndex];
      for (let j = 0; j < numDots; j++) {
        let angle = TWO_PI * j / numDots;
        let dx = x + cos(angle) * i;
        let dy = y + sin(angle) * i;
        fill(this.outerDotColor);
        noStroke();
        ellipse(dx, dy, dotSize); // draw each dot
      }
      ringIndex++;
    }
  }
}

// Allow canvas to resize with browser window
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  background('#f4f1e3'); // Reset background after resizing
}
