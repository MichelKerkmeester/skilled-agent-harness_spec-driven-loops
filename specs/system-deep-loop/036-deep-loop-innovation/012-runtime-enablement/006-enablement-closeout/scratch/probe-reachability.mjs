// Probe: which authority states can a real AuthorityRegistry actually persist?
// Enumerates the public surface, then drives every mutator against a live
// registry in a temp root and reports the state each one leaves on disk.
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime';
const { AuthorityRegistry, AUTHORITY_FLIP_MODE_ORDER } =
  await import(`${base}/lib/per-mode-authority-flip/index.ts`);

const methods = Object.getOwnPropertyNames(AuthorityRegistry.prototype)
  .filter((n) => n !== 'constructor');
console.log('PUBLIC SURFACE:', JSON.stringify(methods, null, 0));

const root = mkdtempSync(join(tmpdir(), 'auth-probe-'));
const reg = new AuthorityRegistry(root);
const mode = AUTHORITY_FLIP_MODE_ORDER[0];
const recPath = join(root, `authority-${mode}.json`);

const onDisk = () => (existsSync(recPath)
  ? JSON.parse(readFileSync(recPath, 'utf8')).state ?? JSON.parse(readFileSync(recPath, 'utf8'))?.core?.state
  : '(no record)');

console.log(`mode under test: ${mode}`);
console.log('after construction:', onDisk());

let seed;
try { seed = reg.read(mode); console.log('read() ->', seed?.state ?? seed?.core?.state); }
catch (e) { console.log('read() threw:', e.message); }
console.log('after read:', onDisk());

// Attempt the forward flip from the default record, WITHOUT first reaching
// cutover_ready. This is expected to refuse, and the refusal is not evidence
// that the flip is unreachable — only that this is the wrong starting state.
// The earlier version of this probe stopped here and concluded the forward
// flip could never fire, which was wrong: it never exercised the promotion.
try {
  reg.compareAndSwap({
    mode, expectedState: 'cutover_ready', expectedEpoch: 1,
    nextSelectedWriter: 'spine', candidateSha: 'a'.repeat(64),
    policyVersion: 1, cutoverCertificateDigest: 'b'.repeat(64),
    lastTransitionDigest: 'c'.repeat(64), at: new Date().toISOString(),
  });
  console.log('compareAndSwap: SUCCEEDED ->', onDisk());
} catch (e) {
  console.log('compareAndSwap REFUSED:', e.message.slice(0, 200));
}
// The promotion the earlier probe never drove. prepareCutover is the writer
// that moves legacy_authoritative -> cutover_ready at the SAME epoch; the flip
// then expects cutover_ready at epoch N and writes epoch N+1, so bumping here
// would make every flip fail its compare-and-swap.
try {
  const before = reg.read(mode);
  const prep = reg.prepareCutover({
    mode, expectedEpoch: before.epoch,
    candidateSha: 'a'.repeat(64), policyVersion: 1,
    at: new Date().toISOString(),
  });
  console.log('prepareCutover: SUCCEEDED ->', onDisk(), '| epoch', prep.record.epoch, '| resumed', prep.resumed);
} catch (e) {
  console.log('prepareCutover REFUSED:', e.message.slice(0, 200));
}

// Now the forward flip from the state it actually demands.
try {
  const cur = reg.read(mode);
  reg.compareAndSwap({
    mode, expectedState: 'cutover_ready', expectedEpoch: cur.epoch,
    nextSelectedWriter: 'spine', candidateSha: 'a'.repeat(64),
    policyVersion: 1, cutoverCertificateDigest: 'b'.repeat(64),
    lastTransitionDigest: 'c'.repeat(64), at: new Date().toISOString(),
  });
  console.log('compareAndSwap AFTER promotion: SUCCEEDED ->', onDisk(), '| epoch', reg.read(mode).epoch);
} catch (e) {
  console.log('compareAndSwap AFTER promotion REFUSED:', e.message.slice(0, 200));
}

console.log('final on-disk state:', onDisk());
console.log('ROOT:', root);
