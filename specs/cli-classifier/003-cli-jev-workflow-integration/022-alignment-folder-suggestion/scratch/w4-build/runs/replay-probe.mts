import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateContentAlignment, validateFolderAlignment } from '../../../../../../../.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator';
const data = { recentContext: [{ request: 'quantum lattice orchard telemetry' }], observations: [] };
async function run(kind: string, fn: typeof validateContentAlignment, target: string, dir: string) {
  const lines: string[] = [];
  const orig = console.log;
  console.log = (...a: unknown[]) => { lines.push(a.map(String).join(' ')); };
  Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
  Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
  let r;
  try { r = await fn(data, target, dir); } finally { console.log = orig; }
  console.log(kind, JSON.stringify(r)); console.log(lines.join('\n')); console.log('---');
}
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'alignment-replay-probe-'));
for (const d of ['001-billing-export', '002-quantum-lattice-orchard', '003-quantum-telemetry', 'z_archive']) fs.mkdirSync(path.join(root, d));
await run('cli-real', validateContentAlignment, '000-replay-target', '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration/specs');
await run('data-synth', validateFolderAlignment, '001-billing-export', root);
await run('cli-synth', validateContentAlignment, '001-billing-export', root);
await run('data-empty', validateFolderAlignment, '000-replay-target', '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration/specs');
fs.rmSync(root, { recursive: true, force: true });
