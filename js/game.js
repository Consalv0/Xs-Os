/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0, no-trailing-spaces: 0 */
/* global $, createCanvas, loadFont, colorMode, blendMode, fill, text, textFont, textSize, DIFFERENCE, HSB, width,
   ellipse, ellipseMode, RADIUS, rect, rectMode, rotate, noStroke, height, BLEND, push, translate,
   pop, angleMode, DEGREES, mouseX, mouseY, CENTER, pmouseX, pmouseY, map */

// let UbuntuMono
let grids = []
let mouseIsCliked = false
let zoom = 1
let zPos = ({x: 0, y: 0})
let _posX
let _posY
let _size
let clock = 0
let GRIDSIZE = 3
let LEVELS = 2

let mapX = 0
let mapY = 0

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

  if (Array.isArray(arr)) {
    for (let i = 1; i < arr.length; i++) {
      drawSharp(posX +column, posY +line, size, innSize)
      drawGrids(arr[i], posX +column, posY +line, innSize, lvl +1, (i-1))
    }
  } else {
    // (lvl, idx+1)
    // if (arr===0) // Click zone
    if (arr===1) drawO(posX +column, posY +line, innSize)
    if (arr===2) drawX(posX +column, posY +line, innSize)
  }
}

function drawSharp(posX, posY, size, innSize) {
  let extg = 1/(GRIDSIZE+extgThing())
  for (var i = 1; i < GRIDSIZE; i += 1.08) {
    rect(posX +innSize*i -innSize*extg*i,
         posY +innSize*(GRIDSIZE*0.5) -innSize*GRIDSIZE*0.25*extg, size*0.03, size*0.8, 8)

    rect(posX +innSize*(GRIDSIZE*0.5) -innSize*GRIDSIZE*0.25*extg,
         posY +innSize*i -innSize*extg*i, size*0.8, size*0.03, 8)
  }
}

function drawO(posX, posY, size) {
  let extg = size+size*GRIDSIZE*1.5*(1/(GRIDSIZE+extgThing()))
  // rect(posX+extg, posY+extg, size*2, size*2)
  ellipse(posX+extg, posY+extg, size*0.8, size*0.8)
  blendMode(DIFFERENCE)
  ellipse(posX+extg, posY+extg, size*0.4, size*0.4)
  blendMode(BLEND)
}

function drawX(posX, posY, size) {
  let extg = size+size*GRIDSIZE*1.5*(1/(GRIDSIZE+extgThing()))
  push()
  translate(posX+extg, posY+extg +size*1.4)
  rotate(45)
  rect(-size, -size, size*1.8, size *0.4, 25)
  rect(-size, -size, size *0.4, size*1.8, 25)
  translate(posX+extg, posY+extg)
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
  // frameRate(1)
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
  rect(width*0.5, height*0.5, width, height)
  fill(100, 0, 92)
  blendMode(BLEND)

  _size = $(window).width() > $(window).height() ? $(window).height()*zoom : $(window).width()*zoom
  _posX = $(window).width() > $(window).height()
    ? $(window).width()*0.5 -_size*0.5 +_size*(1/(GRIDSIZE+extgThing()))*zoom -mapX*(_size/GRIDSIZE) +mapX*(_size*0.1)
    : _size*(1/(GRIDSIZE+extgThing()))*(1/zoom) -mapX*(_size/GRIDSIZE) +mapX*(_size*0.1)
  _posY = $(window).width() > $(window).height()
    ? _size*(1/(GRIDSIZE+extgThing()))*(1/zoom) -mapY*(_size/GRIDSIZE) +mapY*(_size*0.1)
    : $(window).height()*0.5 -_size*0.5 +_size*(1/(GRIDSIZE+extgThing()))*zoom -mapY*(_size/GRIDSIZE) +mapY*(_size*0.1)

  drawGrids(grids, _posX, _posY, _size)
}

// eslint-disable-next-line
function touchEnded() {
  console.log(mapX, mapY)
  if (zoom > 1) {
    mapX = 0
    mapY = 0
    zoom = 1
    zPos = ({
      x: 0,
      y: 0
    })
  } else {
    if (pmouseX > _posX && pmouseX < _posX+(_size*0.85)) {
      if (pmouseY > _posY && pmouseY < _posY+(_size*0.85)) {
        mapX = Math.floor(map(pmouseX, +_posX, _size*0.85 +_posX, 0, GRIDSIZE))
        mapY = Math.floor(map(pmouseY, +_posY, _size*0.85 +_posY, 0, GRIDSIZE))
        zoom = zoom*2
        zPos = ({
          x: mapX,
          y: mapY
        })
      }
    }
  }
}
