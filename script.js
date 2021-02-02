const canvas = document.getElementById('canvas1')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Create Bounding box for collision ///

let titleElement = document.querySelector('#title1')
let titleMeasurements = titleElement.getBoundingClientRect() //Built in method to find the measurements of the bounding area around the title
// Converting the measurements received into an object for comparison
//We will not draw this in the animate function since this object contains the four values needed
// to draw a rectangle
let title = {
  x: titleMeasurements.left,
  y: titleMeasurements.top,
  width: titleMeasurements.width, 
  height: 10 // Reducing height of block so that particles dont bounce off of the full right side
}
///////////////////////////////////////////////////


//We used let here instead onf const because if we want to assign it to a new array later we will not be able to.
// (Even though we const we would be able to modify the individual particles)
let particlesArray = [];

// We want to make MANY particles, so we are making an object factory
class Particle {
  //mandatory method, runs once per each object (particle). A method is a function in a class

  // For each particle, we need two starting arguments, the starting x and y coordinates
  constructor(x, y) {
    this.x = x            // like Ruby's self.property = x
    this.y = y
    this.size = Math.random()*16        // Not passed in as an argument
    this.weight = Math.random() * 2        // how heavy they are.. affects bounce and physics 
    this.directionX = Math.floor(Math.random() * 3) === 2 ? 0.75 : -0.75     // Force moving particles
  }    
  
  update(){      
    if (this.y > canvas.height) {   // Reset particles when they fall below screen
        this.y = 0 - this.size
        this.weight = Math.random() * 3
        this.x = Math.random() * canvas.width
    }
    if (this.x < 0){     // Reset particles wehn they move off screen
      this.x = canvas.width + this.size
    }
    if (this.x > canvas.width){     // Reset particles wehn they move off screen
      this.x = 0 - this.size
    }
      this.weight += 0.01           // This should adjust particles properties. We want to increase particles weight the longer it exists
      this.y += this.weight         // Want particles to "fall". By incrementing by weight, the y will change more with each frame
      this.x += this.directionX     // This increases the x position at a constant value to the right (like wind)

    //Check for collision -- pretend particles are squares
    if (
      this.x < title.x + title.width &&   // Checks for collision along horizontal axis
      this.x + this.size > title.x &&       // ensures the right edge of "box" will not clip corner
      this.y < title.y + title.height &&   // Checks for collision along vertical axis
      this.y + this.size > title.y   // ensures bottom edge doesnt extend into boundary
      ) {            // All four conditions must be met to ensure collision and be sure particle didnt cross hor / vert boundary elsewhere
        this.y -= 10
        this.weight *= -0.2
      }

  }
  
  draw(){          // Each particle must be able to be drawn
    context.fillStyle = "hsl(0, 0%, 33%)"
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath();
    context.fill()
  }
}
// CREATING PARTICLES ONE BY ONE
// const particle1 = new Particle(100, 100)
// const particle2 = new Particle(800, 400)

// CREATING 300 PARTICLES
const numberOfParticles = 300
const init = _ => {
  particlesArray = [] // start with an empty array each time, to account for resize event listener
  for (i = 0; i < numberOfParticles; i++){
    particlesArray.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height ))
  }
}

function animate(){
  // Create semi-transparent rectangle that will get laid down with each frame. This will give the appearance of fading out
  // As older drawings will have more layers of rectangles over them.
  context.fillStyle = 'rgba(255,255,255, 0.02)'
  context.fillRect(0,0, canvas.width, canvas.height)
  
  particlesArray.forEach(particle => {
    particle.draw()
    particle.update()
  })
  context.fillRect(title.x, title.y, title.width, title.height);
  
  requestAnimationFrame(animate)
}

init()
animate()


window.addEventListener('resize', function(){
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  init()
  titleMeasurements= titleElement.getBoundingClientRect()
  title = {
    x: titleMeasurements.left,
    y: titleMeasurements.top,
    width: titleMeasurements.width, 
    height: 20
  }
})