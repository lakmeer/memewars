# MEMEWAR

- Each player controls a meme, which is collection of behaviours that govern the
  replication of a patch of color values in the cells of a 2d-grid world
- Each step, each cell's color values are averaged with their neighbours and rounded down
- Each player gets:
  - a color
  - banner (128 char text to convince people to join you)
  - to place their beacon (1 cell)
  - a script that runs as a kernel over the beacon cell
  - a chat thread
- Players can join their meme's resources to another meme
- Beacons can't die, every n frames they will inject a certain amount of color, which is
  then used to run the kernel they have selected

# The Kernel Script

- The kernel script runs for each cell in which the level of your meme is greater than
  the minimum threshold.
- Each tick the script outputs an allocation field which describes the relative weights
  of where your color should be placed next tick
- Each meme gets an allocation of color per-tick that is distributed weighted by the
  alloction field
- If you don't have a script running, your allocation will be dumped onto your beacon
  location
- The kernel script receives a clip of the world grid in a 9x9 window around it, and
  outputs a clip of the same size which will be added to the allocation field
- The script has access to the following things:
  - Read colors and their levels from the input clip
  - Read allocation levels of enemy memes
  - Beacons position and flags
  - Total member count and color values for players with cells in the input window
  - A chunk of storage space
- The script can do the following actions:
  - Move beacons (that allow it)
  - Write to storage
  - Allocate positive or negative weight to the allocation field
  - Change allegience / defect
- The kernel script has a cap of 1024 tokens + 16 tokens per additional supporter. This
  limit can't go down if supporters leave, and forks of this script will inherit this
  limit. The limit can go up if the number of supporters surpasses the previous record.
  - This privileges older memes since even if they dwindle in popularity

## Policy Strategy

A strategy belongs to a single player but can be supported by other players to make it
stronger. A strategy consists of:

  - A beacon position
  - A number of supporting votes
  - A policy script

- Each tick, the policy script will execute centered on the beacon position, scanning
  each cell in the strategy's radius of influence.
- The radius is proportional to the number of supporting votes.
- If a cell contains more than the threshold amount of it's color, the policy kernel runs
  and adds weight to the allocation field.
- New color will be placed in the world weighted by the allocation field, proportional to
  the number of supporting votes.
- The owning player can place the beacon manually before the end of a tick if they want to.
- The policy script can choose to move the beacon position programatically each tick.

### Option 1: Parallel Competing Branches

Memes can have multiple running strategies, for example, a large, well-supported simple
strategy that maintains a strong core, and several edge strategies focused on detecting
incoming attacks and launching strikes against enemies. Strategy radius and pool depends
on the number of supporting voters. Each strategy is proposed and managed by a single
player and it remains under their control. The banner text is immutable.

### Option 2: Single Branch, Full Allocation

Memes run one large, complex strategy script, and members vote on pull requests to change
the script. Whichever branch has the most votes runs with the full pool to spend. 
Players can still place their beacons manually, which creates inputs to the strategy
script. Each beacon can have a group flag, which allows each beacon to serve a different
function, such as defence or attack. Each player can choose whether to allow the script
to move their beacon or change their flags. The banner text is voted on.

### Option 3: Single Branch, Proportional Allocation

There are completing strategies, and only the one with the most voters runs. It only has
the radius and allocation proportional to the number of votes, which means that memes
with high internal alignment will be able to deploy more resources. All strategies are
immutable and changes are proposed as a branch/PR which becomes enacted if it attracts
more voters than the current leader. Diffs are available to all voters. Strategies don't
belong to any particular member, members can promote new branches and shift their votes
at any time. The banner text is tied to the winning branch and can only be changed by
switching branches.

### Option 4: Original Owner is Leader

The founder of the meme controls (A) which of the above options is active or (B) which
strategy script will be run with full resources. They can also change the banner, color,
etc and expel members.


## Forking

Members supporting a certain branch can vote to defect either to their own meme or to
join an enemy meme. If this happens the whole branch, it's members, associated banner
text and chat history all go together intact to the new meme.


