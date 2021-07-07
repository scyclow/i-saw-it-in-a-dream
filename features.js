// const features = []
// const featuresReduced = []
// tokenData = {
//   hash: '0x14a62c825ea01065d6fced8fd5efee8b2be99442962bead06ccad5b3375f9abb'
// }













function getFeatures(hash, features, featuresReduced) {
  let __randomSeed = parseInt(hash.slice(0, 16), 16);

  function rnd(r, t) {
       __randomSeed ^= __randomSeed << 13, __randomSeed ^= __randomSeed >> 17;
       const e = ((__randomSeed ^= __randomSeed << 5) < 0 ? 1 + ~__randomSeed : __randomSeed) % 1e3 / 1e3;
       return null != t ? r + e * (t - r) : null != r ? e * r : e
  }

  function hshrnd(r) {
       const t = hash.slice(2 + r, 3 + r);
       return parseInt(t, 16) / 16
  }
  const posOrNeg = () => rnd() < .5 ? 1 : -1;
  const sample = (r, t) => {
    const e = r[Math.floor(rnd(0, r.length))];
    return e === t ? sample(r, t) : e
  };
  const color = (...args) => args.join(',')
  const width = 500
  const height = 500

  let SCALE, bgType, colorPalette, showStar2, showStar3, showCircles, star1Middle, star2Middle, star3Middle, star1XOff, star1YOff, star2XOff, star2YOff, star3XOff, star3YOff, star1Scale, star2Scale, star3Scale, star1W, star2W, star3W, star1Points, star2Points, star3Points, xShadow, yShadow, bgC, bgStrokeC, shadowC, borderC, lineC, middleLineC, colorAlpha;


  const t = hshrnd(0);
  bgType = t < .5 ? "stipple" : t < .9375 ? "matrix" : "";
  const e = hshrnd(1);
  colorPalette = e < .125 ? "bw" : "color"
  showStar2 = hshrnd(2) < .5
  showStar3 = hshrnd(3) < .125
  showCircles = hshrnd(4) < .0625
  star1Middle = hshrnd(5) < .5
  star2Middle = hshrnd(6) < .5
  star3Middle = hshrnd(7) < .5
  depthExtension = hshrnd(8) < .0625 ? rnd(2, 3) : 1
  colorAlpha = hshrnd(9) < .0625 ? .5 : 1
  star1XOff = rnd(-500, 500), star1YOff = rnd(-500, 500)
  star2XOff = rnd(-500, 500), star2YOff = rnd(-500, 500)
  star3XOff = rnd(-500, 500), star3YOff = rnd(-500, 500)
  star1Scale = rnd(.2, 5)
  star2Scale = rnd(.2, 5)
  star3Scale = rnd(.2, 5)
  star1W = rnd(2, 17)
  star2W = star1W < 10 ? rnd(2, 17) : rnd(star1W / 2)
  star3W = star1W < 10 ? rnd(2, 17) : rnd(star1W / 2)
  star1Points = Math.floor(rnd(30, 60))
  star2Points = Math.floor(rnd(30, 60))
  star3Points = Math.floor(rnd(30, 60))
  xShadow = 3 * posOrNeg()
  yShadow = 3 * posOrNeg()


  const lightColors = [{
    c: color(0, 0, 1, colorAlpha),
    type: "l"
  }, {
    c: color(150, .55, .95, colorAlpha),
    type: "l"
  }, {
    c: color(200, .55, 1, colorAlpha),
    type: "l"
  }, {
    c: color(90, .7, .95, colorAlpha),
    type: "l"
  }]

  const mediumColors = [{
    c: color(0, .75, 1, colorAlpha),
    type: "m"
  }, {
    c: color(25, .9, .95, colorAlpha),
    type: "m"
  }]
  const darkColors = [{
    c: color(0, 0, 0, colorAlpha),
    type: "d"
  }, {
    c: color(250, .72, .31, colorAlpha),
    type: "d"
  }]
  const allColors = [...lightColors, ...mediumColors, ...darkColors]
  const bwColors = [lightColors[0].c, darkColors[0].c, color(0, 0, .5, colorAlpha)]
  const getC = c => "l" === c.type ? sample([...mediumColors, ...darkColors]) : "m" === c.type ? sample([...lightColors, ...darkColors]) : sample([...lightColors, ...mediumColors]);

  if ("bw" === colorPalette) {
    bgC = sample(bwColors)
    bgStrokeC = sample(bwColors, bgC)
    shadowC = sample(bwColors)
    borderC = sample(bwColors, bgC)
    lineC = sample(bwColors, borderC)
    middleLineC = sample(bwColors, lineC)
  } else {
    const lightColors = sample(allColors)
    const mediumColors = sample(allColors)
    bgC = lightColors.c
    bgStrokeC = getC(lightColors).c
    shadowC = sample(allColors).c
    borderC = getC(lightColors).c
    lineC = mediumColors.c
    middleLineC = getC(mediumColors).c
  }
  if (bgType === 'matrix') {
    features.push('Background: Matrix')
    featuresReduced.push('Background: Matrix')
  } else if (bgType === 'stipple') {
    features.push('Background: Stipple')
    featuresReduced.push('Background: Stipple')
  } else {
    features.push('Background: Empty')
    featuresReduced.push('Background: Empty')
  }
  
  if (colorPalette === 'bw') {
    features.push('Palette: Monochrome')
    featuresReduced.push('Palette: Monochrome')
  } else {
    features.push('Palette: Saturated')
    featuresReduced.push('Palette: Saturated')
  }
  
  if (showCircles) {
    features.push('Elbows')
    featuresReduced.push('Elbows')
  }
  
  let layers = 1
  let middleLines = 0
  let eyes = 0

  if (star1Middle) middleLines += 1
  SCALE = SCALE || 1
  const wAdj = width/(SCALE*2) + 40
  const hAdj = height/(SCALE*2) + 40


  if (
    (star1XOff)*star1Scale < wAdj
    && (star1XOff)*star1Scale > -wAdj
    && (star1YOff)*star1Scale < hAdj
    && (star1YOff)*star1Scale > -hAdj
  ) {
    eyes += 1
  }
  
  
  if (showStar2) {
    layers += 1
    if (star2Middle) middleLines += 1
    if (
      star2XOff*star2Scale-60 < wAdj
      && star2XOff*star2Scale+60 > -wAdj
      && star2YOff*star2Scale-60 < hAdj
      && star2YOff*star2Scale+60 > -hAdj
    ) {
      eyes += 1
    }
  }
  
  if (showStar3) {
    layers += 1
    if (star3Middle) middleLines += 1
    if (
      star3XOff*star3Scale-60 < wAdj
      && star3XOff*star3Scale+60 > -wAdj
      && star3YOff*star3Scale-60 < hAdj
      && star3YOff*star3Scale+60 > -hAdj
    ) {
      eyes += 1
    }
  }
  
  features.push(`Layers: ${layers}`)
  featuresReduced.push(`Layers: ${layers}`)
  features.push(`Eyes: ${eyes}`)
  featuresReduced.push(`Eyes: ${eyes}`)


  const colorList = [
    bgStrokeC.toString(), 
    shadowC.toString(), 
    borderC.toString(), 
    lineC.toString(),
  ]

  if (bgType !== 'empty') {
    colorList.push(bgC.toString())
  }


  if (middleLines) {
    features.push(`Middle Lines: ${middleLines}`)
    featuresReduced.push(`Middle Lines: ${middleLines}`)
    colorList.push(middleLineC.toString())
  }
  
  features.push(`Colors: ${new Set(colorList).size}`)
  featuresReduced.push(`Colors: ${new Set(colorList).size}`)
  const depth = depthExtension !== 1 ? 'Extended' : 'Normal'
  features.push(`Depth: ${depth}`)
  featuresReduced.push(`Depth: ${depth}`)
  

  features.push(`Transparent: ${colorAlpha < 1}`)
  featuresReduced.push(`Transparent: ${colorAlpha < 1}`)


  features.push(`Layer 1 Points: ${star1Points % 2 === 0 ? 'Even' : 'Odd'}`)
  featuresReduced.push(`Layer 1 Points: ${star1Points % 2 === 0 ? 'Even' : 'Odd'}`)
  features.push(`Layer 1 Scale: ${star1Scale.toFixed(1)}`)
  features.push(`Layer 1 Weight: ${star1W.toFixed(1)}`)

  if (showStar2) {
    features.push(`Layer 2 Points: ${star2Points % 2 === 0 ? 'Even' : 'Odd'}`)
    featuresReduced.push(`Layer 2 Points: ${star2Points % 2 === 0 ? 'Even' : 'Odd'}`)
    features.push(`Layer 2 Scale: ${star2Scale.toFixed(1)}`)
    features.push(`Layer 2 Weight: ${star2W.toFixed(1)}`)
  } else if (showStar3) {
    features.push(`Layer 2 Points: ${star3Points % 2 === 0 ? 'Even' : 'Odd'}`)
    featuresReduced.push(`Layer 2 Points: ${star3Points % 2 === 0 ? 'Even' : 'Odd'}`)
    features.push(`Layer 2 Scale: ${star3Scale.toFixed(1)}`)
    features.push(`Layer 2 Weight: ${star3W.toFixed(1)}`)
  }

  if (showStar2 && showStar3) {
    features.push(`Layer 3 Points: ${star3Points % 2 === 0 ? 'Even' : 'Odd'}`)
    featuresReduced.push(`Layer 3 Points: ${star3Points % 2 === 0 ? 'Even' : 'Odd'}`)
    features.push(`Layer 3 Scale: ${star3Scale.toFixed(1)}`)
    features.push(`Layer 3 Weight: ${star3W.toFixed(1)}`)
  }
  
  
  return {
    features, featuresReduced
  }
}


getFeatures(tokenData.hash, features, featuresReduced)
// const f = getFeatures(tokenData.hash, features, featuresReduced)
// console.log(JSON.stringify(f, null, 3))
