// Loads the built sk-vision bundle through the .opencode/plugins link, as OpenCode does.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
process.env.HOOK_FLAGS_CONFIG = resolve('no-such-hook-flags.env');
const url = pathToFileURL(resolve('.opencode/plugins/sk-vision.js')).href;
const plugin = (await import(url)).default;
const ctx = () => { const seen = []; return { seen, ctx: {
  location: { directory: process.cwd() },
  command: { transform: async (cb) => { cb({ add: (d) => seen.push('command:' + d.name) }); return { dispose: async () => {} }; } },
  session: { context: async () => [], prompt: async () => ({}), hook: async (n) => { seen.push('hook:' + n); return { dispose: async () => {} }; } },
} }; };
for (const sw of [null, 'SYSTEM_HOOKS_DISABLED', 'SYSTEM_SK_VISION_DISABLED']) {
  if (sw) process.env[sw] = '1';
  const v1 = Object.keys(await plugin.server({ directory: process.cwd() }, {}));
  const c = ctx(); const cleanup = await plugin.setup(c.ctx); await cleanup();
  console.log(`${sw ?? 'no switch'}: v1 keys=${JSON.stringify(v1)} v2 registered=${JSON.stringify(c.seen)}`);
  if (sw) delete process.env[sw];
}
