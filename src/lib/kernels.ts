
//
// Common Kernel Library
//

import Grid from '$lib/grid'


// 5x5 Kernels

const UNIFORM = Grid.values(5, 5, Array(25).fill(1))

const UNITARY = Grid.values(5, 5, [
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0
])

const GAUSSIAN = Grid.values(5, 5, [
  1,  4,  7,  4, 1,
  4, 16, 26, 16, 4,
  7, 26, 41, 26, 7,
  4, 16, 26, 16, 4,
  1,  4,  7,  4, 1,
])

const BLAST = Grid.values(5, 5, [
  9, 2, 0, 0, 0,
  2, 6, 1, 0, 0,
  0, 1, 3, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
])


// Export

export const K5X5 = { UNIFORM, UNITARY, GAUSSIAN, BLAST }


