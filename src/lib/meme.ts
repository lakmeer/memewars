
import { min, max, floor } from '$lib/utils'

import { K5X5 } from '$lib/kernels'
import Grid from '$lib/grid'

const POOL_PER_PLAYER  = 10
const MIN_KERNEL_LEVEL = 1
const KERNEL_SIZE      = 5
const DEATH_THRESHOLD  = 1
const HISTORY_LENGTH   = 50


//
// Meme
//
// - Placement is always calculated from the current field.
// - Spread is calculated from the current field and put in the next one.
// - Calling 'step' will do the calculations AND swap the fields
//
// TODO:
// - Chat threads:
//   - 1 per member?
//   - Each member either votes for a policy or captains their own?
//

export default class Meme {
  id: string          // Unique ID

  color: RgbColor
  banner: string
  members: Player[]   // Original owner is always first in this list

  thisField: Grid     // Current state (last frame's grid)
  nextField: Grid     // Upcoming state (next frame's grid, swaps with thisField))
  placement: Grid     // Temporary grid for placement allocation

  kernels: { [key:string]: Grid }     // Kernel library, can be modified and expanded
  policy: Policy      // Current kernel policy

  pool: number        // How much can be placed per tick
  active: boolean     // Running or not

  stats: MemeStats

  constructor (id: string, worldSize:number, color: RgbColor, banner: string) {
    this.id = id

    this.color = color
    this.banner = banner
    this.members = []

    this.thisField = Grid.blank(worldSize, worldSize)
    this.nextField = Grid.from(this.thisField)
    this.placement = Grid.from(this.thisField)

    this.kernels = K5X5
    this.pool = POOL_PER_PLAYER

    this.policy = (clip:Grid) => this.kernels.UNITARY

    this.active = true

    this.stats = {
      total: 0,
      hist: [ 0 ]
    }
  }


  allocate (inject:boolean) {
    this.thisField.each((x, y, v) => {
      if (v > MIN_KERNEL_LEVEL) {
        let input  = this.thisField.clip(x, y, KERNEL_SIZE)
        let output = this.policy(input)
        this.placement.merge(output, x, y, v)
      }
    })

    // Beacon pulse
    if (inject) {
      this.members.forEach((member:Player) => {
        this.nextField.add(member.beacon.x, member.beacon.y, POOL_PER_PLAYER)
      })
    }
  }

  spread () {
    this.thisField.each((x, y, v) => {
      let total = 0

      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          total += this.thisField.get(x + i, y + j)
        }
      }

      let n = max(0, (total/10)) // denom +1 to create decay
      this.nextField.set(x, y, n > DEATH_THRESHOLD ? n : 0)
    })
  }

  step (world:Grid, frame:number, inject:boolean) {
    if (!this.active) {
      this.spread()           // writes to next field
      let temp = this.thisField
      this.thisField = this.nextField
      this.nextField = temp
      this.pushHistory()
      return
    }

    this.spread()           // writes to next field
    this.allocate(inject)   // writes to placement field

    this.nextField.blend(this.placement, this.pool)   // updates next field

    // Swap next field to current one
    let temp = this.thisField
    this.thisField = this.nextField
    this.nextField = temp
    this.pushHistory()

    // Prepare a clean frame
    this.placement.clear()
    this.nextField.clear()
  }

  pushHistory () {
    this.stats.total = this.thisField.sum()
    this.stats.hist.push(this.stats.total)
    if (this.stats.hist.length > HISTORY_LENGTH) this.stats.hist.shift()
  }

  joinMember (player:Player) {
    this.members.push(player)
    this.pool += POOL_PER_PLAYER
  }

  setPolicy (policy:Policy) {
    this.policy = policy
  }

}

