// Build the iteration 3 delta from the saved record; the first line is the exact
// record handed to the gateway, followed by the ruled-out directions of this pass.
const fs = require('node:fs');

const [recordPath, deltaPath] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const rows = [JSON.stringify(record)];
rows.push(JSON.stringify({
  type: 'ruled_out',
  direction: 'The MK_ rows are stale after the env-aliases bridge',
  reason: 'env-aliases.cjs maps the older names onto the new ones and the resolver also lists them directly.',
  iteration: record.iteration,
}));
rows.push(JSON.stringify({
  type: 'ruled_out',
  direction: 'The Codex, Cursor and Devin rows name a per-runtime advisor build that does not exist',
  reason: 'The arrow names the compiled shim under system-spec-kit/runtime/dist/hooks/<runtime>/, which exists and then spawns the one advisor handler.',
  iteration: record.iteration,
}));
rows.push(JSON.stringify({
  type: 'ruled_out',
  direction: 'The Python CLI also reads the newer switch names',
  reason: 'It reads only COMPAT_CONTRACT["disabledEnv"] and compares to exactly "1".',
  iteration: record.iteration,
}));
fs.writeFileSync(deltaPath, rows.join('\n') + '\n');
process.stdout.write(`delta rows: ${rows.length}\n`);
