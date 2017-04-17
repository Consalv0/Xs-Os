/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0, no-trailing-spaces: 0, no-irregular-whitespace: 0 */
/* global $, SVG, _ */

/* SETUP */
// =================
var make = SVG('gameCanvas').size('100%', '100%')
// eslint-disable-next-line
var viewbox = make.viewbox(0, 0, $(window).width(), $(window).height())

var GRIDSIZE = 3
var LEVELS = 2

var boardMeta = []
var turn = false
var board = make.group().addClass('board')
var boardBox = board.bbox()

var width = $(window).width()
var height = $(window).height()
var boardSize = $(window).width() > $(window).height() ? $(window).height()*0.9 : $(window).width()*0.9
// =======END======= */

/* METADATA FUNCTIONS */
// =================
// MAKE METADATA //
makeMeta(LEVELS, boardMeta = [])

function makeMeta(root, value) {
  if (root > 1) {
    for (let i = 0; i < GRIDSIZE**2; i++) {
      let newGrid = []
      value.push(newGrid)
      makeMeta(root -1, newGrid)
    }
  } else {
    for (let i = 0; i < GRIDSIZE**2; i++) {
      value.push(0)
      // value.push(Math.floor(Math.random()*3))
    }
  }
}

// MODIFY METADATA //
function modifyMeta(element, turn, boardMeta, board, levels = 0, pathList = []) {
  if (element.node.className.baseVal !== board.node.className.baseVal) {
    let parent = element
    pathList.push('[' + parent.node.className.baseVal + ']')
    parent = element.parent()
    return modifyMeta(parent, turn, boardMeta, board, levels + 1, pathList)
  } else {
    pathList.reverse()
    let value = turn ? 1 : 2
    let path = pathList.toString()
    path = path.replace(/,/g, '')
    _.set(boardMeta, path, value)
    if (checkMove(boardMeta, path)) {
      if (checkMove(boardMeta, path)==='tie') {
        let ipath = path.substr(0, path.lastIndexOf('['))
        let emptyArray = []
        for (let i = 0; i < GRIDSIZE**2; i++) {
          emptyArray.push(0)
        }
        _.set(boardMeta, ipath, emptyArray)
      } else return true
    }
    return false
  }
}

// CHECK MOVE //
function checkMove(boardMeta, path) {
  let ipath = path.substr(0, path.lastIndexOf('['))
  let element = path.match(/[[]/gi).length !== 1 ? _.get(boardMeta, ipath) : boardMeta
  let item = (path.slice(path.lastIndexOf('[')+1, path.lastIndexOf(']')))
  let isTrue = false
  element.forEach(function(value, idx) {
    if (idx.toString()===item) {
      if (checkMatch(idx, element, value)) {
        if (checkMatch(idx, element, value)==='tie') {
          isTrue = 'tie'; return
        }
        isTrue = true; return
      }
    }
  })
  return isTrue
}

// CHECK MATCH //
function checkMatch(idx, element, value) {
  if (checkColumn(idx, element, value)) return true
  if (checkLine(idx, element, value)) return true
  if (checkCross(idx, element, value)) return true
  if (checkTie(idx, element, value)) return 'tie'
  return false
}

function checkColumn(idx, element = '', value) {
  if (element==='') return (idx-GRIDSIZE* checkLine(idx))
  let count = 0
  for (let i = checkColumn(idx); i < GRIDSIZE**2; i += GRIDSIZE) {
    if (element[i] === value) count++
    if (count===GRIDSIZE) return true // console.log((value===1 ? 'O ':'X ') + 'win InColum: ', checkColumn(idx))
  }
  return false
}

function checkLine(idx, element = '', value) {
  if (element==='') return (Math.floor(idx/GRIDSIZE))
  let count = 0
  for (let i = checkLine(idx)*(GRIDSIZE); i < checkLine(idx)*(GRIDSIZE)+GRIDSIZE; i += 1) {
    if (element[i] === value) count++
    if (count===GRIDSIZE) return true// console.log((value===1 ? 'O ':'X ') + 'win InLine: ', checkLine(idx))
  }
  return false
}

function checkCross(idx, element, value) {
  let isNegCross = ((checkColumn(idx)+checkLine(idx))*0.5) === checkColumn(idx)
  let isPosCross = (checkColumn(idx)+checkLine(idx)) === GRIDSIZE-1
  if (isPosCross) {
    if (checkPosCross(idx, element, value)) return true
    if (isNegCross) if (checkNegCross(idx, element, value)) return true
  } else if (isNegCross) if (checkNegCross(idx, element, value)) return true
  return false
}

function checkPosCross(idx, element, value) {
  let count = 0
  for (let i = GRIDSIZE-1; i <= (GRIDSIZE-1)*GRIDSIZE; i += GRIDSIZE-1) {
    if (element[i] === value) count++
    if (count===GRIDSIZE) return true// console.log((value===1 ? 'O ':'X ') + 'win InCross: ++')
  }
  return false
}

function checkNegCross(idx, element, value) {
  let count = 0
  for (let i = 0; i <= GRIDSIZE**2; i += GRIDSIZE+1) {
    if (element[i] === value) count++
    if (count===GRIDSIZE) return true// console.log((value===1 ? 'O ':'X ') + 'win InCross: --')
  }
  return false
}

function checkTie(idx, element, value) {
  let count = 0
  for (let i = 0; i < GRIDSIZE**2; i++) {
    if (element[i] === 1 | element[i] === 2) count++
  }
  if (count >= GRIDSIZE**2) return true
  return false
}
// =======END======= */

/* OBJECTS */
// =================
// MAKE CROSS //
function makeCross(group, size, plusX, plusY, className) {
  if (className===undefined) className = 'cross'
  let cross = group.nested().addClass(className)
  make.rect(size*0.7, size*0.2).dmove(plusX+size*0.12, plusY).rotate(+45)
      .dmove(+size*0.282, size*0.282).radius(5).addTo(cross)
  make.rect(size*0.7, size*0.2).dmove(plusX+size*0.12, plusY).rotate(-45)
      .dmove(-size*0.282, size*0.282).radius(5).addTo(cross)
}

// MAKE DONUT //
function makeDonut(group, size, plusX, plusY, className) {
  if (className===undefined) className = 'donut'
  let donut = group.nested().addClass(className)
  make.circle(size*0.7).dmove(size*0.15, size*0.15)
      .dmove(plusX, plusY).addTo(donut)
  make.circle(size*0.35).fill('#000').dmove(size*0.325, size*0.325)
      .dmove(plusX, plusY).addTo(donut)
}

// MAKE BLANK SPACE //
function makeBSpace(group, size, plusX, plusY) {
  let bSpace = group.nested().addClass('bSpace')
  make.rect(size, size).dmove(plusX, plusY)
      .click(function() { clickElement(this) }).fill({ opacity: 0 }).addTo(bSpace)
}

// MAKE SHARP //
function makeSharp(group, size, plusX, plusY) {
  let grid = group.nested().addClass('grid')
  for (var i = 1; i < GRIDSIZE; i++) {
    make.rect(size*0.8, size*0.03).move(size*0.1, size*i/(GRIDSIZE)-size*0.015)
        .radius(10).dmove(plusX, plusY).addTo(grid)
    make.rect(size*0.03, size*0.8).move(size*i/(GRIDSIZE)-size*0.015, size*0.1)
        .radius(10).dmove(plusX, plusY).addTo(grid)
  }
}
// =======END======= */

/* BOARD FUNCTIONS */
// =================
// BOARD BUILD //
createBoard(boardMeta, 0, board, boardSize, -boardSize*0.01, -boardSize*0.01)
function createBoard(value, idx, element, size, plusX, plusY) {
  if (value === boardMeta) makeSharp(element, size, plusX, plusY)
  let innerSize = size/GRIDSIZE
  if (Array.isArray(value)) {
    value.forEach(function(value, idx) {
      let nest = element.nested().addClass(idx)
      let posX = checkColumn(idx)*innerSize +plusX
      let posY = checkLine(idx)*innerSize +plusY
      if (Array.isArray(value)) {
        makeSharp(nest, innerSize, posX, posY)
        createBoard(value, idx, nest, innerSize, posX, posY)
      } else {
        if (value === 0) makeBSpace(nest, innerSize, posX, posY)
        if (value === 1) makeDonut(nest, innerSize, posX, posY)
        if (value === 2) makeCross(nest, innerSize, posX, posY)
      }
    })
  }
  // FILL COLOR ALL //
  $('#gameCanvas g.board').each(function() {
    this.instance.fill('#fff')
  })
}

// BOARD LISTENER //
  // $('#gameCanvas').on('touchend', function() {
  // })
function createMarker(parent, element, turn) {
  if (turn) {
    makeDonut(parent, element.width(), element.x(), element.y())
  } else {
    makeCross(parent, element.width(), element.x(), element.y())
  }
}
function createParentMarker(parent, element, turn, parentName) {
  if (turn) {
    makeDonut(parent, element.w, element.x, element.y, parentName)
  } else {
    makeCross(parent, element.w, element.x, element.y, parentName)
  }
}
function clickElement(element) {
  let parent = element.parent().parent(SVG.Nested)
  createMarker(parent, element, turn)
  modifyBoard(element, turn, boardMeta, board)
  turn = !turn
}

// MODIFY BOARD //
function modifyBoard(element, turn, boardMeta, board) {
  let parent = element.parent().parent(SVG.Nested)
  if (modifyMeta(parent, turn, boardMeta, board)) {
    // let parentBBox = parent.parent().bbox()
    // let parentName = parent.parent().node.className.baseVal
    let parent2 = element.parent().parent(SVG.Nested).parent()
    parent.parent().clear()
    // createParentMarker(parent2.parent(), parentBBox, turn, parentName)
    modifyMeta(parent2, turn, boardMeta, board)
  } else element.parent(SVG.Nested).remove()
  board.clear()
  createBoard(boardMeta, 0, board, boardSize, -boardSize*0.01, -boardSize*0.01)
  transCanvas()
  $('#gameCanvas g.board').each(function() {
    this.instance.finish()
  })
}
// =======END======= */

/* CANVAS FUNCTIONS */
// =================
// CANVAS LISTENER //
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
