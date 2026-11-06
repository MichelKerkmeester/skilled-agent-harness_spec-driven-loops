import { writeFileSync } from 'node:fs'

export function apply(ctx, config) {
  if (config && config.marker) writeFileSync(config.marker, `applied ${new Date().toISOString()}\n`)
}
