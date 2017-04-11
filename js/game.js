/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0, no-trailing-spaces: 0 */
/* global $, createCanvas, loadFont, colorMode, blendMode, fill, text, textFont, textSize, DIFFERENCE, HSB, width,
   ellipse, ellipseMode, RADIUS, rect, rectMode, rotate, noStroke, height, BLEND, push, translate,
   pop, angleMode, DEGREES, mouseX, mouseY, CENTER */

// let UbuntuMono
let grids = []
let mouseIsCliked = false
let zoom
let clock = 0
let GRIDSIZE = 2
let LEVELS = 2

// function Grid(options) {
//   this.lvl = LEVELS
//   this.width = width
//   this.height = height
//   // this.values = []
//
//   if (options) {
//     for (let prop in options) {
//       if (this.hasOwnProperty(prop)) {
//         this[prop] = options[prop]
//       }
//     }
//   }
//
//   this.values = []
//   for (let i = 0; i < GRIDSIZE**2; i++) {
//     if (this.lvl <= LEVELS-1) {
//       // this.values.push(Math.ceil(Math.random()*3))
//       this.values.push(3)
//     } else {
//       this.values.push(Math.floor(Math.random()*3))
//     }
//   }
// }
//
// Grid.prototype = {
//
//   draw: function(lvl, num) {
//     this.__drawSharp(this._posX(), this._posY(), this._size())
//     for (var i = 0; i < this.values.length; i++) {
//       if (this.values[i] === 1) {
//         this.__drawX(this._posX(), this._posY(), this._size())
//       }
//       if (this.values[i] === 2) {
//         this.__drawO(this._posX(), this._posY(), this._size())
//       }
//     }
//   },
//
//   _posX: function() {
//     let posX
//     let colum
//     colum = this.num-GRIDSIZE*Math.floor(this.num/GRIDSIZE)
//     posX = colum *this._size() +this._size() *0.5
//     return posX
//   },
//
//   _posY: function() {
//     let posY
//     let line
//     line = Math.floor(this.num/GRIDSIZE)
//     posY = line *this._size() +this._size() *0.5
//     return posY
//   },
//
//   _size: function() {
//     let size
//     size = width/GRIDSIZE/this.lvl
//     return size
//   },
//
//   __drawSharp: function(posX, posY, size) {
//     rect(posX, posY, size*0.1, size*2, 8)
//   },
//
//   __drawO: function(posX, posY, size) {
//     ellipse(posX, posY, size*0.4, size*0.4)
//     blendMode(DIFFERENCE)
//     ellipse(posX, posY, size*0.2, size*0.2)
//     blendMode(BLEND)
//   },
//
//   __drawX: function(posX, posY, size) {
//     push()
//     translate(posX, posY +size*0.7)
//     rotate(45)
//     rect(-size*0.5, -size*0.5, size, size *0.2, 25)
//     rect(-size*0.5, -size*0.5, size *0.2, size, 25)
//     translate(posX, posY)
//     pop()
//   }
// }



function makeGrids(levels, innerGrids) {
  if (levels > 1) {
    for (let i = 0; i < GRIDSIZE**2; i++) {
      let newGrid = ([LEVELS-levels+2])
      innerGrids.push(newGrid)
      makeGrids(levels -1, newGrid)
    }
  } else {
    for (let i = 0; i < GRIDSIZE**2; i++) {
      innerGrids.push(Math.floor(Math.random()*2)+1)
    }
  }
}

function drawGrids(arr, posX, posY, size, lvl = 1, idx = 0) {
  let column = (idx -GRIDSIZE *Math.floor(idx/GRIDSIZE)) *size
  let line = (Math.floor(idx/GRIDSIZE)) *size

  let innSize = size*(1/GRIDSIZE)*0.9
  let extg = (1/size)*(1/GRIDSIZE)*(1/LEVELS)

  if (Array.isArray(arr)) {
    for (let i = 1; i < arr.length; i++) {
      drawSharp(posX +column +extg, posY +line +extg, size)
      drawGrids(arr[i], posX +column +extg, posY +line +extg, innSize, lvl +1, (i-1))
    }
  } else {
    // (lvl, idx+1)
    // if (arr===0) // Click zone
    if (arr===1) drawO(posX +column +extg, posY +line +extg, innSize)
    if (arr===2) drawX(posX +column +extg, posY +line +extg, innSize)
  }
}

function drawSharp(posX, posY, size) {
  for (var i = 0; i < GRIDSIZE; i++) {
    rect(posX+size*0.425, posY+size*0.425, size*0.03, size*0.85, 8)
    rect(posX+size*0.425, posY+size*0.425, size*0.85, size*0.03, 8)
  }
}

function drawO(posX, posY, size) {
  ellipse(posX+size, posY+size, size*0.8, size*0.8)
  blendMode(DIFFERENCE)
  ellipse(posX+size, posY+size, size*0.4, size*0.4)
  blendMode(BLEND)
}

function drawX(posX, posY, size) {
  push()
  translate(posX+size, posY+size +size*1.4)
  rotate(45)
  rect(-size, -size, size*1.8, size *0.4, 25)
  rect(-size, -size, size *0.4, size*1.8, 25)
  translate(posX+size, posY+size)
  pop()
}

function extgThing() {
  if (GRIDSIZE < 2) {
    return 0
  } else if (GRIDSIZE === 2) {
    return 10.33
  } else if (GRIDSIZE === 3) {
    return 9.25
  } else if (GRIDSIZE === 4) {
    return 9.33
  } else if (GRIDSIZE === 5) {
    return 9.4
  } else {
    return 9.3
  }
}

// eslint-disable-next-line
function preload() {
  makeGrids(LEVELS, grids = ([1]))
  // UbuntuMono = loadFont('assets/UbuntuMono-Regular.ttf')
  setInterval(function() {
    clock = clock < 500 ? clock +1 : 0
  }, 1)
}

// eslint-disable-next-line
function setup() {
  frameRate(1)
  createCanvas($(window).width(), $(window).height()).parent('game')

  noStroke()
  ellipseMode(RADIUS)
  rectMode(CENTER)
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

  let size = $(window).width() > $(window).height() ? $(window).height() : $(window).width()
  let posX = $(window).width() > $(window).height()
    ? $(window).width()*0.5 -size*0.5 +size*(1/(GRIDSIZE+extgThing()))
    : size*(1/(GRIDSIZE+extgThing()))
  let posY = $(window).width() > $(window).height()
    ? size*(1/(GRIDSIZE+extgThing()))
    : $(window).height()*0.5 -size*0.5 +size*(1/(GRIDSIZE+extgThing()))

  drawGrids(grids, posX, posY, size)
}
