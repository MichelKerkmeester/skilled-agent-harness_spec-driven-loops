// Adversarial follow-up: can preparePendingTransition make the flip reachable?
import { mkdtempSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const base='/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime';
const { AuthorityRegistry, AUTHORITY_FLIP_MODE_ORDER } = await import(`${base}/lib/per-mode-authority-flip/index.ts`);
const root = mkdtempSync(join(tmpdir(),'pend-'));
const reg = new AuthorityRegistry(root);
const mode = AUTHORITY_FLIP_MODE_ORDER[0];
const input = { mode, expectedState:'cutover_ready', expectedEpoch:1, nextSelectedWriter:'spine',
  candidateSha:'a'.repeat(64), policyVersion:1, cutoverCertificateDigest:'b'.repeat(64),
  lastTransitionDigest:'c'.repeat(64), at:new Date().toISOString() };

reg.preparePendingTransition(input, new Date().toISOString());
console.log('files after prepare:', readdirSync(root));
for (const f of readdirSync(root)) {
  const t = readFileSync(join(root,f),'utf8');
  console.log(`  ${f}: contains cutover_ready = ${t.includes('cutover_ready')}`);
}
console.log('record state after prepare:', reg.read(mode).state);
// Does a prepared pending transition let the flip proceed?
try { reg.compareAndSwap(input); console.log('compareAndSwap AFTER PREPARE: SUCCEEDED -> record now', reg.read(mode).state); }
catch(e){ console.log('compareAndSwap AFTER PREPARE: REFUSED:', e.message.slice(0,120)); }
console.log('final record state:', reg.read(mode).state);
