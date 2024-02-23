<script lang="ts">

  import { onMount } from 'svelte'

  import { div } from '$lib/utils'

  const { min, max, floor } = Math
  const rand = (n = 1) => Math.random() * n

  const formatRgb = ([ r, g, b ]:RgbColor):string =>
    `rgb(${floor(r*255)},${floor(g*255)},${floor(b*255)})`

  const pos = (x:number, y =  x) => ({ x, y })

  import Meme  from '$lib/meme'
  import Grid  from '$lib/grid'
  import World from '$lib/world'


  // Setup

  const RESOLUTION = 800
  const WORLD_SIZE  = 15
  const FILL_RATE = 12
  const DECAY = 0.9
  const MIN_KERNEL_LEVEL = 1
  const TICK_LENGTH   = 100


  // State

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  let mouse = { x: 0, y: 0, active: false }

  const game = {
    world: new World(WORLD_SIZE, WORLD_SIZE),

    players: [
      { id: '0001', name: 'Alice',   beacon: pos(div(WORLD_SIZE, 2)) },
      { id: '0002', name: 'Bob',     beacon: pos(div(WORLD_SIZE, 2)) },
      { id: '0003', name: 'Charlie', beacon: pos(div(WORLD_SIZE, 2)) },
    ],

    memes: [
      new Meme('RED', WORLD_SIZE, [ 1, 0, 0 ], "Red team iz best team"),
      new Meme('GRN', WORLD_SIZE, [ 0, 1, 0 ], "Red team sux, up the green"),
    ],

    membership: [
      { player_id: '0001', meme_id: 'RED' },
      { player_id: '0002', meme_id: 'GRN' },
      { player_id: '0003', meme_id: 'GRN' },
    ],
  }

  game.membership.forEach(({ player_id, meme_id }) => {
    let player = game.players.find(p => p.id === player_id)
    let meme   = game.memes.find(m => m.id === meme_id)
    meme.joinMember(player)
  })

  game.memes[0].setPolicy(() => game.memes[0].kernels.BLAST)
  game.memes[1].setPolicy(() => game.memes[1].kernels.GAUSSIAN)

  let placeIx = 0


  // Functions

  function setMouse (e:MouseEvent) {
    mouse.x = floor((e.clientX - canvas.getBoundingClientRect().left) / (RESOLUTION / WORLD_SIZE))
    mouse.y = floor((e.clientY - canvas.getBoundingClientRect().top)  / (RESOLUTION / WORLD_SIZE))
  }

  function mouseDown () {
    mouse.active = true
    const b = game.memes[placeIx].members[0].beacon
    b.x = mouse.x
    b.y = mouse.y
  }

  function mouseUp () {
    mouse.active = false
  }

  function keyDown (key:KeyboardEvent) {
    if (key.key === ' ') {
      placeIx = 1
    }
  }

  function keyUp (key:KeyboardEvent) {
    if (key.key === ' ') {
      placeIx = 0
    }
  }


  // Drawing

  function draw () {
    let stride = RESOLUTION / WORLD_SIZE

    ctx.clearRect(0, 0, RESOLUTION, RESOLUTION)
    ctx.globalCompositeOperation = 'lighter'

    // Draw color levels
    game.memes.forEach(meme => {
      ctx.fillStyle = formatRgb(meme.color)
      meme.thisField.each((x, y, v) => {
        ctx.globalAlpha = min(1, v/10)
        ctx.fillRect(x * stride, y * stride, stride, stride)
      })
    })

    ctx.globalAlpha = 1
    ctx.lineWidth   = 3

    // Draw beacon positions
    game.memes.forEach(meme => {
      ctx.strokeStyle = formatRgb(meme.color)
      meme.members.forEach(member => {
        ctx.strokeRect(member.beacon.x * stride, member.beacon.y * stride, stride, stride)
      })
    })

    // Draw mouse position
    ctx.lineWidth   = 1
    ctx.strokeStyle = 'white'
    ctx.strokeRect(mouse.x * stride, mouse.y * stride, stride, stride)
  }


  // Init

  let frame = 0

  onMount(() => {
    ctx = canvas.getContext('2d')

    game.players.find(p => p.id === '0001').beacon = pos(12)
    game.players.find(p => p.id === '0002').beacon = pos(3)

    let Z = setInterval(() => {
      frame++
      game.memes.forEach(meme => meme.step(null, frame))
      draw()
    }, TICK_LENGTH)

    return () => clearInterval(Z)
  })
</script>


<canvas class="border border-slate-800 mx-auto select-none bg-black" 
        bind:this={canvas}
        width={RESOLUTION}
        height={RESOLUTION} />

<svelte:window
  on:mousemove={setMouse}
  on:mouseup={mouseUp}
  on:mousedown={mouseDown}
  on:keydown={keyDown}
  on:keyup={keyUp} />
