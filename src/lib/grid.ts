
import { floor, div } from '$lib/utils'


//
// Grid class
//

export default class Grid {
  w: number
  h: number
  data: number[]
  max: number

  constructor (w: number, h: number) {
    this.w = w
    this.h = h
    this.data = new Array(w * h).fill(0)
    this.max = 0
  }

  inBounds (x: number, y: number) {
    return (x >= 0 && x < this.w && y >= 0 && y < this.h)
  }

  get (x: number, y: number) {
    return !this.inBounds(x, y) ? 0 : this.data[y * this.w + x]
  }

  set (x: number, y: number, value: number) {
    if (!this.inBounds(x, y)) return
    this.data[y * this.w + x] = value
  }

  add (x: number, y: number, value: number) {
    if (!this.inBounds(x, y)) return
    this.data[y * this.w + x] += value
  }

  clip (x: number, y: number, size: number) {
    let clip = new Grid(size, size)
    let off  = div(size, 2)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        clip.set(j, i, this.get(x - off + j, y - off + i))
      }
    }
    return clip
  }

  merge (clip:Grid, x: number, y: number, factor = 1) {
    const ox = div(clip.w, 2), oy = div(clip.h, 2)

    clip.each((x2, y2, v) => this.add(x + x2 - ox, y + y2 - oy, v * factor))
  }

  each (λ:Function) {
    for (let i = 0; i < this.data.length; i++) {
      λ(i % this.w, floor(i / this.h), this.data[i])
    }
  }

  sum () {
    let total = 0
    for (let i = 0; i < this.data.length; i++) {
      total += this.data[i]
    }
    return total
  }

  normalise () {
    let total = this.sum()
    if (total === 0) return
    let ratio = 1 / total
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] *= ratio
    }
  }

  clear () {
    this.data.fill(0)
    this.max = 0
  }

  blend (grid:Grid, pool:number) {
    if (grid.w > this.w || grid.h > this.h) return console.error('Grid:blend - size mismatch')
    if (pool <= 0) return
    let total = grid.sum()
    if (total <= 0) return
    let ratio = pool / grid.sum()

    grid.each((x, y, value) => this.add(x, y, grid.get(x, y) * ratio))
  }

  render () {
    let str = ''
    for (let i = 0; i < this.data.length; i++) {
      str += this.data[i] + ' '
      if (i % this.w === this.w - 1) {
        str += '\n'
      }
    }
    return str
  }


  // Static constructors

  static blank (w:number, h:number) {
    return new Grid(w, h)
  }

  static from (grid:Grid) {
    return new Grid(grid.w, grid.h)
  }

  static values (w:number, h:number, values:number[]) {
    let grid = new Grid(w, h)
    for (let i = 0; i < values.length; i++) {
      grid.data[i] = values[i]
    }
    return grid
  }

}

