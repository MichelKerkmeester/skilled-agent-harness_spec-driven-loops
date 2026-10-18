// Loads each plugin the way OpenCode 1.19.x does: import the module, take the
// default export, and call its server entry (or the export itself when it is a
// function) with a v1-shaped input. Prints one JSON line per plugin.
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.argv[2] || '.');
const dir = join(root, '.opencode', 'plugins');
const noop = () => {};
const client = new Proxy(noop, { get: () => client, apply: async () => ({ data: [] }) });
const input = { client, project: { id: 'harness' }, worktree: root, directory: root, experimental_workspace: undefined, serverUrl: new URL('http://127.0.0.1:0'), $: client };
const out = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
  const name = file.replace(/\.js$/, '');
  try {
    const mod = await import(pathToFileURL(join(dir, file)).href);
    const def = mod.default;
    const entry = typeof def === 'function' ? def : def && typeof def.server === 'function' ? def.server : null;
    if (!entry) { out.push({ name, v1: 'failed', detail: 'no callable v1 entry' }); continue; }
    const hooks = await entry(input);
    out.push({ name, v1: hooks && typeof hooks === 'object' ? 'loaded' : 'failed', detail: hooks ? Object.keys(hooks).sort().join(',') : 'entry returned nothing' });
  } catch (error) {
    out.push({ name, v1: 'failed', detail: String(error && error.message || error).slice(0, 200) });
  }
}
for (const row of out) console.log(JSON.stringify(row));
process.exit(0);
