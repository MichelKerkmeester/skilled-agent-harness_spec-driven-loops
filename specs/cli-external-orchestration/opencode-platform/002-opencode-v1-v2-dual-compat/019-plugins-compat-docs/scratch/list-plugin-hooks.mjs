import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const dir = path.resolve(process.argv[2]);
const stubClient = new Proxy({}, { get: () => new Proxy(() => Promise.resolve({ data: [] }), { get: (t, k) => k === 'then' ? undefined : (() => Promise.resolve({ data: [] })) }) });
for (const f of readdirSync(dir).filter((n) => n.endsWith('.js')).sort()) {
  try {
    const mod = (await import(pathToFileURL(path.join(dir, f)))).default;
    const shape = Object.keys(mod).sort().join(',');
    const hooks = await mod.server({ client: stubClient, directory: process.cwd(), worktree: process.cwd(), project: {}, $: undefined }, {});
    const keys = Object.keys(hooks ?? {}).sort();
    const tools = hooks?.tool ? Object.keys(hooks.tool).length : 0;
    console.log(`${f} | export:${shape} | hooks:${keys.join(' ')} | tools:${tools}`);
    if (typeof hooks?.dispose === 'function') await hooks.dispose().catch(() => {});
  } catch (e) { console.log(`${f} | ERROR ${e.message.slice(0, 120)}`); }
}
process.exit(0);
