
//
// Like several grids overlaid, but efficient
//

export default class World {

  w: number
  h: number
  d: number

  data: number[]

  constructor (w: number, h: number, d = 1) {
    this.w = w
    this.h = h
    this.d = d

    this.data = new Array(w * h * d).fill(0)
  }

}

