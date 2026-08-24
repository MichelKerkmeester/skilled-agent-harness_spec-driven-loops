import { mkdtempSync, mkdirSync, writeFileSync, appendFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const RT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime';
const { canonicalBytes, sha256Bytes } = await import(`${RT}/lib/event-envelope/index.ts`);
const CLI = `${RT}/scripts/check-direct-append.cjs`;
const MODE = 'deep-review', ARTIFACT = 'review-state';

const dir = mkdtempSync(join(tmpdir(), 'direct-append-'));
const artifactRoot = join(dir, 'artifacts');
const authRoot = join(dir, 'authority');
mkdirSync(join(artifactRoot, '.legacy-projection-watermarks'), { recursive: true });
mkdirSync(authRoot, { recursive: true });
const legacyFile = join(artifactRoot, 'review-state.jsonl');

function writeAuthority(state) {
  const core = {
    schemaVersion: 1, mode: MODE, state, epoch: 1,
    selectedWriter: state === 'new_authoritative_reversible' ? 'dark' : 'legacy',
    candidateSha: null, policyVersion: 0, cutoverCertificateDigest: null,
    lastTransitionDigest: null, updatedAt: new Date('2026-08-19T12:00:00Z').toISOString(),
  };
  const rec = { ...core, recordDigest: sha256Bytes(canonicalBytes(core)) };
  writeFileSync(join(authRoot, `authority-${MODE}.json`), JSON.stringify(rec, null, 2));
}
function publish(content) {
  writeFileSync(legacyFile, content);
  const bytes = readFileSync(legacyFile);
  writeFileSync(join(artifactRoot, '.legacy-projection-watermarks', `${ARTIFACT}.json`), JSON.stringify({
    watermark_version: 1, artifact_id: ARTIFACT, ledger_id: 'l1', ledger_sequence: 3,
    ledger_record_hash: 'a'.repeat(64), projection_version: 1, reducer_version: 1,
    replay_fingerprint: 'b'.repeat(64), base_sha: 'c'.repeat(40), base_digest: 'd'.repeat(64),
    prior_ledger_sequence: null, prior_output_digest: null,
    output_digest: createHash('sha256').update(bytes).digest('hex'),
    output_byte_length: bytes.length, refreshed_at: '2026-08-19T12:00:00Z',
  }, null, 2));
}
function run() {
  const r = spawnSync(process.execPath, [CLI, '--mode', MODE, '--artifact-root', artifactRoot,
    '--artifact-id', ARTIFACT, '--legacy-file', legacyFile, '--authority-root', authRoot],
    { encoding: 'utf8', cwd: RT });
  const last = (r.stdout || '').trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let j = {}; try { j = JSON.parse(last); } catch { j = { raw: last, stderr: r.stderr }; }
  return { exit: r.status, j };
}
const results = [];
const check = (name, cond, got) => { results.push([cond, name, got]); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}  -> ${got}`); };

publish('{"iteration":1}\n');
writeAuthority('new_authoritative_reversible');
let r = run();
check('gateway-published file passes under ledger authority', r.exit === 0 && r.j.status === 'ok', `exit=${r.exit} status=${r.j.status}`);

// THE REAL DIRECT APPEND
appendFileSync(legacyFile, '{"iteration":2,"injected":"direct append"}\n');
r = run();
check('a real direct append is DETECTED', r.exit === 2 && r.j.status === 'violation', `exit=${r.exit} status=${r.j.status} code=${r.j.code}`);
check('it names the drift', typeof r.j.actualDigest === 'string' || /digest/i.test(JSON.stringify(r.j)), `${JSON.stringify(r.j).slice(0,110)}`);

// state gate: same tampered file, but authority still legacy
writeAuthority('legacy_authoritative');
r = run();
check('inert while legacy is still the sanctioned writer', r.exit === 0 && r.j.status === 'not-enforced', `exit=${r.exit} status=${r.j.status}`);

// missing watermark
writeAuthority('new_authoritative_reversible');
rmSync(join(artifactRoot, '.legacy-projection-watermarks', `${ARTIFACT}.json`));
r = run();
check('missing watermark is a violation, not a pass', r.exit === 2 && r.j.status === 'violation', `exit=${r.exit} status=${r.j.status} code=${r.j.code}`);

// malformed authority record
writeFileSync(join(authRoot, `authority-${MODE}.json`), '{ not json');
r = run();
check('unreadable authority record fails rather than passes', r.exit === 1, `exit=${r.exit} status=${r.j.status}`);

rmSync(dir, { recursive: true, force: true });
const passed = results.filter(x => x[0]).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(passed === results.length ? 0 : 1);
