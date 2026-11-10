// Loads the built sk-vision bundle through the .opencode/plugins link, as OpenCode does,
// and asserts what each switch leaves registered. Run from the worktree root with bun.
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

for (const key of Object.keys(process.env)) {
  if (key.endsWith('_DISABLED') || key === 'SK_VISION_AUTOINSPECT') delete process.env[key];
}
process.env.HOOK_FLAGS_CONFIG = join(mkdtempSync(join(tmpdir(), 'sk-vision-bundle-')), 'absent.env');

const plugin = (await import(pathToFileURL(resolve('.opencode/plugins/sk-vision.js')).href)).default;
const makeCtx = () => {
  const seen = [];
  return { seen, ctx: {
    location: { directory: process.cwd() },
    command: { transform: async (cb) => { cb({ add: (d) => seen.push('command:' + d.name) }); return { dispose: async () => {} }; } },
    session: { context: async () => [], prompt: async () => ({}), hook: async (n) => { seen.push('hook:' + n); return { dispose: async () => {} }; } },
  } };
};

const cases = [
  [null, ['command.execute.before'], ['command:vision', 'hook:prompt']],
  ['SYSTEM_HOOKS_DISABLED', ['dispose'], []],
  ['SYSTEM_SK_VISION_DISABLED', ['dispose'], []],
];
for (const [sw, v1Expected, v2Expected] of cases) {
  if (sw) process.env[sw] = '1';
  const v1 = Object.keys(await plugin.server({ directory: process.cwd() }, {}));
  const c = makeCtx(); const cleanup = await plugin.setup(c.ctx); await cleanup();
  console.log(`${sw ?? 'no switch'}: v1 keys=${JSON.stringify(v1)} v2 registered=${JSON.stringify(c.seen)}`);
  assert.deepEqual(v1, v1Expected, `${sw ?? 'no switch'}: v1 keys`);
  assert.deepEqual(c.seen, v2Expected, `${sw ?? 'no switch'}: v2 registrations`);
  if (sw) delete process.env[sw];
}
console.log('bundle-check: all assertions passed');
