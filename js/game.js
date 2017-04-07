/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0, no-trailing-spaces: 0 */
/* global $, createCanvas, loadFont, colorMode, blendMode, fill, text, textFont, textSize, DIFFERENCE, HSB, width,
   ellipse, ellipseMode, RADIUS, CENTER, print, rect, rectMode, rotate, PI, noStroke, height, BLEND, push, translate,
   pop, angleMode, DEGREES, mouseX, mouseY */

let outerGrid = new Grid({
  lvl: 0,
  width: 3,
  height: 3,
  values: [0, 0, 0,
           0, 0, 0,
           0, 0, 0]
})

let innerGrid = new Grid({
  lvl: 1,
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
  angleMode(DEGREES)
  fill(100, 0, 92)
}

// eslint-disable-next-line
function draw() {
  fill(0, 100, 0)
  rect(width/2, height/2, width, height)
  fill(100, 0, 92)
  blendMode(BLEND)

  drawGrid(outerGrid, width, height, 0, 0)
}

function Grid(options) {
  this.lvl = 0
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

function drawGrid(grid, width, height, posX, posY) {
  let lvl = grid.lvl
  let size = height > width ? width /grid.width : height /grid.height
  let newline = height *0.5 -(size *grid.height *0.5)
  let space = width *0.5 -(size *grid.width *0.5)
  let value = -1

  drawSharp(grid, width, height, size, posX, posY)

  for (let i = 0; i < grid.height; i++) {
    newline += i===0 ? 0 : size
    for (let j = 0; j < grid.width; j++) {
      value++
      space += j===0 ? 0 : size

      if (detectBlock(grid.values[value], posX +(size *0.5 +space), posY +(size *0.5+newline), size/2.4)) {
        rect(posX +(size *0.5 +space), posY +(size *0.5+newline), size/2.4, size/2.4)
      }

      if (lvl===0) {
        drawGrid(innerGrid, width*0.25, height*0.25, -width/8 +(size *0.5 +space), -height/8 +(size *0.5 +newline))
      } else {
        drawValue(grid.values[value], posX +(size *0.5 +space), posY +(size *0.5+newline), size/3)
      }
    }
    space = width *0.5 -(size *grid.width *0.5)
  }
}

function drawOs(posX, posY, radius) {
  ellipse(posX, posY, radius, radius)
  blendMode(DIFFERENCE)
  ellipse(posX, posY, radius*0.8, radius*0.8)
  blendMode(BLEND)
}

function drawXx(posX, posY, radius) {
  push()
  translate(posX, posY +radius*0.7)
  rotate(45)
  rect(-radius*0.5, -radius*0.5, radius, radius*0.2, 25)
  rect(-radius*0.5, -radius*0.5, radius*0.2, radius, 25)
  translate(posX, posY)
  pop()
}

function drawValue(value, posX, posY, radius) {
  switch (value) {
    case 1: drawOs(posX, posY, radius); break
    case 2: drawXx(posX, posY, radius); break
    default:
  }
}

function drawSharp(grid, width, height, size, posX, posY) {
  let newline = height *0.5 -(size *grid.height *0.5)
  let space = width *0.5 -(size *grid.width *0.5)

  for (let i = 1; i < grid.width; i++) {
    newline += i===1 ? 0 : size *grid.height
      space += i===1 ? 0 : size *grid.width

    rect(posX +((width +space) /grid.width), posY +(height *0.5), size*0.03, size*grid.height*0.45, 8) // verticals
    rect(posX +(width *0.5), posY +((height +newline) /grid.height), size*grid.width*0.45, size*0.03, 8) // horizontals
  }
}

function detectBlock(grid, posX, posY, size) {
  if (mouseX > posX -size && mouseX < posX +size) {
    if (mouseY > posY -size && mouseY < posY +size) {
      return true
    }
  } else return
}
