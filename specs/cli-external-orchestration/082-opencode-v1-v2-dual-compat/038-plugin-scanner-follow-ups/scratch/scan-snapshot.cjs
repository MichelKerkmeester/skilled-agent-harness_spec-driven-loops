// Prints handledEventNames and unscannedEventChecks for every bridged plugin, using the helper path given.
const fs = require('node:fs');
const path = require('node:path');
const helper = require(path.resolve(process.argv[2]));
const dir = helper.PLUGIN_DIR;
const out = {};
for (const stem of helper.readInventory().bridged) {
  const src = fs.readFileSync(path.join(dir, stem + '.js'), 'utf8');
  out[stem] = { handled: helper.handledEventNames(src), unscanned: helper.unscannedEventChecks(src) };
}
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
