/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0, no-trailing-spaces: 0 */
/* global $, SVG */

/* SETUP */
// =================
var make = SVG('gameCanvas').size('100%', '100%')

var GRIDSIZE = 3
var LEVELS = 3

var values = []
var turn = false
var board = make.group().addClass('board')
var boardBox = board.bbox()
make.rect(boardBox.width, boardBox.height).fill('#fff')
// eslint-disable-next-line
var viewbox = make.viewbox(0, 0, $(window).width(), $(window).height())

var width = $(window).width()
var height = $(window).height()
var boardSize = $(window).width() > $(window).height() ? $(window).height()*0.9 : $(window).width()*0.9

// MAKE GRIDS //
ValuesTree(LEVELS, values = [])

function ValuesTree(root, value) {
  if (root > 1) {
    for (let i = 0; i < GRIDSIZE**2; i++) {
      let newGrid = []
      value.push(newGrid)
      ValuesTree(root -1, newGrid)
    }
  } else {
    for (let i = 0; i < GRIDSIZE**2; i++) {
      value.push(0)
      // value.push(Math.floor(Math.random()*3))
    }
  }
}
// =======END======= */

/* OBJECTS */
// =================
function makeCross(group, size, plusX, plusY) {
  let cross = group.nested().addClass('cross')
  make.rect(size*0.7, size*0.2).dmove(plusX+size*0.12, plusY).rotate(+45)
      .dmove(+size*0.282, size*0.282).radius(5).addTo(cross)
  make.rect(size*0.7, size*0.2).dmove(plusX+size*0.12, plusY).rotate(-45)
      .dmove(-size*0.282, size*0.282).radius(5).addTo(cross)
}

function makeDonut(group, size, plusX, plusY) {
  let donut = group.nested().addClass('donut')
  make.circle(size*0.7).dmove(size*0.15, size*0.15)
      .dmove(plusX, plusY).addTo(donut)
  make.circle(size*0.35).fill('#000').dmove(size*0.325, size*0.325)
      .dmove(plusX, plusY).addTo(donut)
}

function makeBSpace(group, size, plusX, plusY) {
  let bSpace = group.nested().addClass('bSpace')
  make.rect(size, size).dmove(plusX, plusY)
      .click(function() { clicked(this) }).fill({ opacity: 0 }).addTo(bSpace)
}

function makeSharp(group, size, plusX, plusY) {
  let grid = group.nested().addClass('grid')
  for (var i = 1; i < GRIDSIZE; i++) {
    make.rect(size*0.8, size*0.03).move(size*0.1, size*i/(GRIDSIZE)-size*0.015)
        .radius(10).dmove(plusX, plusY).addTo(grid)
    make.rect(size*0.03, size*0.8).move(size*i/(GRIDSIZE)-size*0.015, size*0.1)
        .radius(10).dmove(plusX, plusY).addTo(grid)
  }
}

$('#gameCanvas g.board').each(function() {
  this.instance.fill('#fff')
})
// =======END======= */

/* BOARD BUILD */
// =================
createBoard(values, 0, boardSize, -boardSize*0.01, -boardSize*0.01)

function createBoard(element, idx, size, plusX, plusY) {
  if (element === values) makeSharp(board, size, plusX, plusY)
  let innerSize = size/GRIDSIZE
  if (Array.isArray(element)) {
    element.forEach(function(element, idx) {
      let posX = (idx-GRIDSIZE *Math.floor(idx/GRIDSIZE))*innerSize +plusY
      let posY = (Math.floor(idx/GRIDSIZE))*innerSize +plusX
      if (Array.isArray(element)) {
        makeSharp(board, innerSize, posX, posY)
        createBoard(element, idx, innerSize, posX, posY)
      } else {
        if (element === 0) makeBSpace(board, innerSize, posX, posY)
        if (element === 1) makeDonut(board, innerSize, posX, posY)
        if (element === 2) makeCross(board, innerSize, posX, posY)
      }
    })
  }
}
// =======END======= */

/* BOARD LISTENER */
// =================
  // $('#gameCanvas').on('touchend', function() {
  //   turn = !turn
  // })
  function clicked(element) {
    if (turn) {
      makeDonut(element.parent(SVG.G), element.width(), element.x(), element.y())
    } else {
      makeCross(element.parent(SVG.G), element.width(), element.x(), element.y())
    }
    turn = !turn
    element.remove()
  }
// =======END======= */

/* CANVAS LISTENER */
// =================
window.addEventListener('resize', transCanvas, false)
transCanvas()
$('#gameCanvas g.board').each(function() {
  this.instance.finish()
})

function transCanvas() {
  width = $(window).width()
  height = $(window).height()

  viewbox = make.viewbox(0, 0, $(window).width(), $(window).height())
  $('#gameCanvas g.board').each(function() {
    this.instance.finish().animate(1000, '>', 0).center(width*0.5, height*0.5)
  })
}
// =======END======= */
