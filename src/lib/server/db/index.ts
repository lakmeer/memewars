
import db from '$db/instance'

import { ok } from '$lib/log'
import { migrate } from '$db/migrations'

await migrate(db)

ok('db/init', `loaded`)


// Done

export default db
