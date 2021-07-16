let SCALE,
  bgType,
  colorPalette,
  showStar2,
  showStar3,
  showCircles,
  star1Middle,
  star2Middle,
  star3Middle,
  star1XOff,
  star1YOff,
  star2XOff,
  star2YOff,
  star3XOff,
  star3YOff,
  star1Scale,
  star2Scale,
  star3Scale,
  star1W,
  star2W,
  star3W,
  star1Points,
  star2Points,
  star3Points,
  xShadow,
  yShadow,
  bgC,
  bgStrokeC,
  shadowC,
  borderC,
  lineC,
  middleLineC,
  colorAlpha

function setup() {
  const size = min(window.innerWidth, window.innerHeight);
  createCanvas(size, size)
  SCALE = size / 500
  const bgSeed = hshrnd(0)
  bgType = bgSeed < 0.5 ? "matrix" : bgSeed < 0.9375 ? "stipple" : ""
  const colorSeed = hshrnd(1)
  colorPalette = colorSeed < 0.125 ? "bw" : "color"
  showStar2 = hshrnd(2) < 0.5
  showStar3 = hshrnd(3) < 0.125
  showCircles = hshrnd(4) < 0.0625
  star1Middle = hshrnd(5) < 0.5
  star2Middle = hshrnd(6) < 0.5
  star3Middle = hshrnd(7) < 0.5
  depthExtension = hshrnd(8) < 0.0625 ? rnd(2, 3) : 1
  colorAlpha = hshrnd(9) < 0.0625 ? 0.5 : 1
  star1XOff = rnd(-500, 500)
  star1YOff = rnd(-500, 500)
  star2XOff = rnd(-500, 500)
  star2YOff = rnd(-500, 500)
  star3XOff = rnd(-500, 500)
  star3YOff = rnd(-500, 500)
  star1Scale = rnd(0.2, 5)
  star2Scale = rnd(0.2, 5)
  star3Scale = rnd(0.2, 5)
  star1W = rnd(2, 17)
  star2W = star1W < 10 ? rnd(2, 17) : rnd(star1W / 2)
  star3W = star1W < 10 ? rnd(2, 17) : rnd(star1W / 2)
  star1Points = int(rnd(30, 60))
  star2Points = int(rnd(30, 60))
  star3Points = int(rnd(30, 60))
  xShadow = 3 * posOrNeg()
  yShadow = 3 * posOrNeg()
  colorMode(HSB, 360, 1, 1)
  setColors()
  noLoop()
  document.body.style.backgroundColor = "#000000"
  console.log("What do you see when you close your eyes?")
}

const posOrNeg = () => (rnd() < 0.5 ? 1 : -1);

function draw() {
  noFill()
  translate(width / 2, height / 2)
  scale(SCALE)
  drawBg()
  layer(star1XOff, star1YOff, star1Points, star1W, star1Scale, star1Middle)

  if (showStar2) {
    layer(star2XOff, star2YOff, star2Points, star2W, star2Scale, star2Middle)
  }
  if (showStar3) {
    layer(star3XOff, star3YOff, star3Points, star3W, star3Scale, star3Middle)
  }
}

function layer(xOffset, yOffset, points, starW, starScale, showMiddleLine) {
  push()
  scale(starScale);
  const n = showCircles ? 1.2 * starW : 0;
  strokeWeight(starW)
  stroke(shadowC)
  multiStar(xOffset + xShadow, yOffset + yShadow, points, n)
  stroke(borderC)
  multiStar(xOffset, yOffset, points, n)
  strokeWeight(starW - 2)
  stroke(lineC)
  multiStar(xOffset, yOffset, points, n)
  strokeWeight(0.1 * starW)
  stroke(middleLineC)
  if (showMiddleLine) {
    multiStar(xOffset, yOffset, points)
  }
  pop()
}

function multiStar(x, y, points, circleSize) {
  for (let i = 3; i < 80; i++) {
    star(x, y, 20 * i, points, 20 * depthExtension, 0.6 * i, circleSize);
  }
}

function star(x, y, radius, points, depth, rotation, circleSize) {
  const getXY = (p) => {
    const r =
      p % 2 == 0
        ? radius - depth
        : radius
      deg = TWO_PI / points;
    return [sin(deg * p + rotation) * r + x, cos(deg * p + rotation) * r + y];
  };
  beginShape()
  curveVertex(...getXY(points - 1));
  for (let i = 0; i <= points + 1; i++) {
    const [x, y] = getXY(i);
    if (circleSize) circle(x, y, circleSize)
    curveVertex(x, y)
  }
  endShape();
}
const sample = (a, dup) => {
  const color = a[int(rnd(0, a.length))];
  return color === dup ? sample(a, dup) : color;
};
function setColors() {
  const light = [
    { c: color(0, 0, 1, colorAlpha), type: "l" },
    { c: color(150, 0.55, 0.95, colorAlpha), type: "l" },
    { c: color(200, 0.55, 1, colorAlpha), type: "l" },
    { c: color(90, 0.7, 0.95, colorAlpha), type: "l" },
  ]
  const med = [
    { c: color(0, 0.75, 1, colorAlpha), type: "m" },
    { c: color(25, 0.9, 0.95, colorAlpha), type: "m" },
  ]
  const dark = [
    { c: color(0, 0, 0, colorAlpha), type: "d" },
    { c: color(250, 0.72, 0.31, colorAlpha), type: "d" },
  ]
  const o = [...light, ...med, ...dark]
  const s = [light[0].c, dark[0].c, color(0, 0, 0.5, colorAlpha)]
  const contrast = (c) => {
    if (c.type === 'l') return sample([...med, ...dark])
    if (c.type === 'm') return sample([...light, ...dark])
    else return sample([...light, ...med])
  }

  if ("bw" === colorPalette) {
    bgC = sample(s)
    bgStrokeC = sample(s, bgC)
    shadowC = sample(s)
    borderC = sample(s, bgC)
    lineC = sample(s, borderC)
    middleLineC = sample(s, lineC)
  } else {
    const light = sample(o)
    const med = sample(o);
    bgC = light.c
    bgStrokeC = contrast(light).c
    shadowC = sample(o).c
    borderC = contrast(light).c
    lineC = med.c
    middleLineC = contrast(med).c
  }
}

function drawBg() {
  push()
  background(bgC)
  stroke(bgStrokeC);
  const w = width/SCALE
  const h = height/SCALE

  if (bgType === 'matrix') {
    matrixBg(w, h)
  } else if (bgType === 'stipple') {
    stippleBg(w, h)
  }

  pop()
}

function stippleBg(w, h) {
  const xGrow = int(rnd(-2, 0, 2))
  const yGrow = int(rnd(-2, 0, 2))

  for (let x = 0; x < w + 1; x += 5)
  for (let y = 0; y < h + 1; y += 5) {
    const xProg = xGrow > 0 ? x / w : 1 - x / w
    const yProg = yGrow > 0 ? y / h : 1 - y / h

    const rad = (xProg * xGrow) + (yProg * yGrow)
    circle(x - w / 2, y - h / 2, 1 + 4 * rad)
  }
}

const mult = () => rnd(1, 25);
function matrixBg(w,h) {
  const x1 = mult()
  const x2 = mult()
  const y1 = mult()
  const y2 = mult()
  for (let x = -w; x < w + 1; x += 5) {
    line(x*x1, -h/2, x*x2, h/2)
  }
  for (let y = -h; y < h + 1; y += 5) {
    line(-w/2, y*y1, w/2, y*y2)
  }
}

let __randomSeed = parseInt(tokenData.hash.slice(0, 16), 16)
function rnd(mn, mx) {
  __randomSeed ^= __randomSeed << 13
  __randomSeed ^= __randomSeed >> 17
  __randomSeed ^= __randomSeed << 5
  const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

function hshrnd(h) {
  const str = tokenData.hash.slice(2 + h, 3 + h)
  return parseInt(str, 16) / 16
}
