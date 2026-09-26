import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {cpSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixture = join(root, 'spikes/rustc-backend/async-attribution-fixture');
const supercov = join(root, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const companion = join(
  root,
  `spikes/rustc-backend/target/debug/supercov-rustc-backend-spike${process.platform === 'win32' ? '.exe' : ''}`,
);
const scratch = mkdtempSync(join(tmpdir(), 'supercov-rust-async-attribution-'));
const archiveMagic = Buffer.from('SUPERCOV-EVIDENCE-3\n');

function run(program, commandArguments, options = {}) {
  const result = spawnSync(program, commandArguments, {
    cwd: options.cwd ?? root,
    env: {...process.env, ...options.env},
    input: options.input,
    encoding: 'utf8',
    timeout: options.timeout ?? 300_000,
    maxBuffer: 64 * 1024 * 1024,
  });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.signal, null, `${program} terminated by ${result.signal}`);
  assert.equal(
    result.status,
    options.status ?? 0,
    `${program} ${commandArguments.join(' ')}\n${result.stderr}\n${result.stdout}`,
  );
  return result;
}

function readArchive(path) {
  const bytes = gunzipSync(readFileSync(path));
  assert(bytes.subarray(0, archiveMagic.length).equals(archiveMagic));
  let offset = archiveMagic.length;
  const entries = new Map();
  while (offset < bytes.length) {
    assert(offset + 4 <= bytes.length, 'truncated evidence entry header length');
    const headerLength = bytes.readUInt32BE(offset);
    offset += 4;
    assert(offset + headerLength <= bytes.length, 'truncated evidence entry header');
    const header = JSON.parse(bytes.subarray(offset, offset + headerLength));
    offset += headerLength;
    assert(offset + header.bytes <= bytes.length, 'truncated evidence entry body');
    entries.set(header.path, bytes.subarray(offset, offset + header.bytes));
    offset += header.bytes;
  }
  return entries;
}

function sourceLine(project, needle) {
  const lines = readFileSync(join(project, 'src/lib.rs'), 'utf8').split('\n');
  const index = lines.findIndex((line) => line.includes(needle));
  assert.notEqual(index, -1, `missing ${needle}`);
  return index + 1;
}

try {
  const project = join(scratch, 'fixture');
  cpSync(fixture, project, {recursive: true});
  const cargo = run('rustup', ['which', 'cargo']).stdout.trim();
  const rustc = run('rustup', ['which', 'rustc']).stdout.trim();

  const baseline = run(cargo, ['test', '--test', 'async_context'], {
    cwd: project,
    env: {CARGO_TARGET_DIR: join(scratch, 'baseline-target')},
  });
  assert.match(baseline.stdout + baseline.stderr, /2 passed/u);

  const covered = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      cwd: project,
      env: {RUSTC: rustc},
      input: JSON.stringify({
        root: project,
        command: [cargo, 'test', '--test', 'async_context'],
        runId: 'run_9123456789abcdef',
        startedAt: '2026-08-28T00:00:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [companion],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(covered.exitCode, 0);
  assert.equal(covered.tests, 2);
  assert.equal(covered.backgroundResults, 0);
  assert.equal(covered.transportHealth.length, 3);
  assert(covered.transportHealth.every(({transport}) => transport.dropped === 0));
  const migratedHealth = covered.transportHealth.find(({scopeId}) =>
    scopeId.includes('assertion_context_crosses_executor_threads'),
  );
  const cancelledHealth = covered.transportHealth.find(({scopeId}) =>
    scopeId.includes('cancelled_assertion_restores_the_executor_context'),
  );
  assert.equal(migratedHealth?.transport.incomplete, 0);
  assert.equal(cancelledHealth?.transport.incomplete, 0);

  const entries = readArchive(
    join(project, '.supercov/runs', covered.runId, 'evidence.raw.gz'),
  );
  const manifest = JSON.parse(entries.get('manifest.json'));
  const result = [...entries]
    .filter(([path]) => /^results\/\d+\/mcdc\.json$/u.test(path))
    .map(([, contents]) => JSON.parse(contents))
    .find(({test}) => test.includes('assertion_context_crosses_executor_threads'));
  assert(result, 'missing exact async test result');
  const basePhase = result.phases.find(({kind}) => kind === 'test');
  const assertionPhase = result.phases.find(
    ({kind, source}) => kind === 'assertion' && source?.includes('YieldOnce::new'),
  );
  assert(basePhase, 'missing base test phase');
  assert(assertionPhase, 'missing assertion phase');

  const decisionLine = sourceLine(project, 'assert!(YieldOnce::new(value).await)');
  const decision = manifest.decisions.find(
    ({file, line}) => file === 'src/lib.rs' && line === decisionLine,
  );
  assert(decision, 'missing async assertion decision');
  const outsideLine = sourceLine(project, 'pub fn outside_assertion_probe');
  const outsidePoint = manifest.points.find(
    ({file, line, kind}) =>
      file === 'src/lib.rs' && line === outsideLine && kind === 'function',
  );
  assert(outsidePoint, 'missing outside-assertion function obligation');

  const events = result.runtime.flatMap(({events}) => events);
  const decisionEvent = events.find(({id}) => id === decision.id);
  const outsideEvent = events.find(({id}) => id === outsidePoint.id);
  assert(decisionEvent, 'async assertion decision emitted no evidence');
  assert(outsideEvent, 'outside-assertion probe emitted no evidence');
  assert.equal(
    decisionEvent.phaseId,
    assertionPhase.id,
    'decision after executor migration escaped its assertion phase',
  );
  assert.equal(
    outsideEvent.phaseId,
    basePhase.id,
    'work after a pending poll was contaminated by the suspended assertion phase',
  );

  const cancelled = [...entries]
    .filter(([path]) => /^results\/\d+\/mcdc\.json$/u.test(path))
    .map(([, contents]) => JSON.parse(contents))
    .find(({test}) => test.includes('cancelled_assertion_restores_the_executor_context'));
  assert(cancelled, 'missing cancelled async test result');
  const cancelledBase = cancelled.phases.find(({kind}) => kind === 'test');
  const cancelledOutside = cancelled.runtime
    .flatMap(({events}) => events)
    .find(({id}) => id === outsidePoint.id);
  assert(cancelledBase && cancelledOutside);
  assert.equal(
    cancelledOutside.phaseId,
    cancelledBase.id,
    'cancellation cleanup retained the suspended assertion context',
  );

  console.log(
    '[rust-async-attribution-spike] assertion context suspends/resumes exactly across executor threads and cancellation restores base context',
  );
} finally {
  if (process.env.SUPERCOV_RUST_SPIKE_KEEP_SCRATCH === '1') {
    process.stderr.write(`[rust-async-attribution-spike] retained scratch: ${scratch}\n`);
  } else {
    rmSync(scratch, {recursive: true, force: true});
  }
}
