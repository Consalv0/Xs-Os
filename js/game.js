/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0, no-trailing-spaces: 0 */
/* global $, createCanvas, loadFont, colorMode, blendMode, fill, text, textFont, textSize, DIFFERENCE, HSB, width,
   ellipse, ellipseMode, RADIUS, CENTER, print, rect, rectMode, rotate, PI, noStroke, height, BLEND */

let outerGrid = new Grid({
  width: 3,
  height: 3,
  values: [0, 0, 0,
           0, 0, 0,
           0, 0, 0]
})

let innerGrid = new Grid({
  width: 3,
  height: 3,
  values: [1, 1, 2,
           2, 2, 1,
           2, 1, 1]
})

let UbuntuMono

// eslint-disable-next-line
function preload() {
  UbuntuMono = loadFont('assets/UbuntuMono-Regular.ttf')
}

// eslint-disable-next-line
function setup() {
  // frameRate(1)
  createCanvas($(window).width(), $(window).height()).parent('game')

  noStroke()
  ellipseMode(RADIUS)
  rectMode(RADIUS)
  textFont(UbuntuMono)
  colorMode(HSB, 360, 100, 100)
  fill(100, 0, 92)
}

// eslint-disable-next-line
function draw() {
  // rect(width/2, height/2, width, height)
  blendMode(BLEND)

  drawGrid(innerGrid, width, height)
}

function Grid(options) {
  this.width = 0
  this.height = 0
  this.values = []

  if (options) {
    for (let prop in options) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = options[prop]
      }
    }
  }
}

function drawGrid(grid, width, height) {
  this.grid = grid
  this.width = width
  this.height = height

  let size = height > width ? width /grid.width : height /grid.height
  let newline = height *0.5 -(size *grid.height *0.5)
  let space = width *0.5 -(size *grid.width *0.5)
  let value = -1

  drawSharp(grid, width, height, size)

  for (let i = 0; i < grid.height; i++) {
    newline += i===0 ? 0 : size
    for (let j = 0; j < grid.width; j++) {
      value++
      space += j===0 ? 0 : size
      drawValue(grid.values[value], size *0.5 +space, size *0.5+newline, size/3)
    }
    space = width *0.5 -(size *grid.width *0.5)
  }
}

function drawOs(posX, posY, radius) {
  this.radius = radius
  this.posX = posX
  this.posY = posY

  ellipse(posX, posY, radius, radius)
  blendMode(DIFFERENCE)
  ellipse(posX, posY, radius*0.8, radius*0.8)
  blendMode(BLEND)
}

function drawXx(posX, posY, radius) {
  this.radius = radius
  this.posX = posX
  this.posY = posY

  // rotate(45)
  rect(posX, posY, radius, radius*0.2, 25)
  // rotate(45)
  rect(posX, posY, radius*0.2, radius, 25)
}

function drawValue(value, posX, posY, radius) {
  this.value = value
  this.radius = radius
  this.posX = posX
  this.posY = posY

  switch (value) {
    case 1: drawOs(posX, posY, radius); break
    case 2: drawXx(posX, posY, radius); break
    default:
  }
}

function drawSharp(grid, width, height, size) {
  this.grid = grid
  this.width = width
  this.height = height
  this.lSpace = size

  let newline = height *0.5 -(size *grid.height *0.5)
  let space = width *0.5 -(size *grid.width *0.5)

  for (let i = 1; i < grid.width; i++) {
    newline += i===1 ? 0 : size *grid.height
      space += i===1 ? 0 : size *grid.width

    rect((width +space) /grid.width, height *0.5, size*0.03, size*grid.height*0.45, 8) // verticals
    rect(width *0.5, (height +newline) /grid.height, size*grid.width*0.45, size*0.03, 8) // horizontals
  }
}
