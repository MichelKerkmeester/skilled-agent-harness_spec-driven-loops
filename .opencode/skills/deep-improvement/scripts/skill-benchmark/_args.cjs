'use strict';

/**
 * Shared space-form arg parser for Lane C scripts. Lane C is invoked by
 * loop-host with space-separated flags (--skill <v> --outputs-dir <v> ...),
 * matching the Lane B run surface. Bare flags with no following value (or a
 * following --flag) become boolean true.
 */
function parse(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const entry = argv[i];
    const eq = /^--([a-z][a-z0-9-]*)=(.*)$/.exec(entry);
    if (eq) { args[eq[1]] = eq[2]; continue; }
    const bare = /^--([a-z][a-z0-9-]*)$/.exec(entry);
    if (!bare) continue;
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) { args[bare[1]] = next; i += 1; }
    else args[bare[1]] = true;
  }
  return args;
}

module.exports = { parse };
