import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {cpSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixture = join(root, 'spikes/rustc-backend/custom-harness-fixture');
const supercov = join(root, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const companion = join(
  root,
  `spikes/rustc-backend/target/debug/supercov-rustc-backend-spike${process.platform === 'win32' ? '.exe' : ''}`,
);
const scratch = mkdtempSync(join(tmpdir(), 'supercov-custom-harness-'));

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

function digestSources(project) {
  const digest = createHash('sha256');
  for (const path of ['Cargo.toml', 'src/lib.rs', 'tests/custom.rs']) {
    digest.update(path).update('\0').update(readFileSync(join(project, path)));
  }
  return digest.digest('hex');
}

try {
  const project = join(scratch, 'fixture');
  cpSync(fixture, project, {recursive: true});
  const cargo = run('rustup', ['which', 'cargo']).stdout.trim();
  const rustc = run('rustup', ['which', 'rustc']).stdout.trim();
  const host = run(rustc, ['-vV']).stdout
    .split('\n')
    .find((line) => line.startsWith('host: '))
    ?.slice('host: '.length);
  assert(host, 'selected rustc reported no host triple');
  const sourceDigest = digestSources(project);
  const harnessArguments = [
    '--test-threads=1',
    '--include-ignored',
    '--show-output',
  ];

  const baselineLog = join(scratch, 'baseline.log');
  run(cargo, ['test', '--', ...harnessArguments], {
    cwd: project,
    env: {
      CARGO_TARGET_DIR: join(scratch, 'baseline-target'),
      SUPERCOV_CUSTOM_HARNESS_LOG: baselineLog,
    },
  });
  assert.equal(
    readFileSync(baselineLog, 'utf8'),
    '--test-threads=1\u001f--include-ignored\u001f--show-output\n',
  );

  const coveredLog = join(scratch, 'covered.log');
  const covered = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      cwd: project,
      env: {
        RUSTC: rustc,
        SUPERCOV_CUSTOM_HARNESS_LOG: coveredLog,
      },
      input: JSON.stringify({
        root: project,
        command: [cargo, 'test', '--', ...harnessArguments],
        runId: 'run_7123456789abcdef',
        startedAt: '2026-08-28T00:00:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [companion],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(covered.exitCode, 0);
  assert.equal(covered.tests, 3);
  assert.equal(covered.libtests, 3);
  assert.equal(covered.doctests, 0);
  assert(covered.transportHealth.length >= 2);
  assert(covered.transportHealth.every(({status}) => status === 'passed'));
  assert.equal(
    readFileSync(coveredLog, 'utf8'),
    '--test-threads=1\u001f--include-ignored\u001f--show-output\n',
  );
  assert.equal(digestSources(project), sourceDigest);

  const query = JSON.parse(
    run(supercov, ['__query-stored-run'], {
      input: JSON.stringify({
        root: project,
        query: {
          runId: covered.runId,
          filter: 'passed',
          command: 'test',
          selector: 'custom-harness',
        },
      }),
    }).stdout,
  );
  assert.equal(query.ok, true);
  assert.equal(query.data.tests.length, 1);
  assert.equal(
    query.data.tests[0].id,
    `rust:custom-harness:${host}:package:.:test:custom:tests/custom.rs`,
  );
  assert.equal(
    query.data.tests[0].provenance.runner,
    'rust-custom-harness',
  );

  console.log(
    '[rust-custom-harness-spike] Cargo harness=false executes once with exact argv and invocation-level evidence',
  );
} finally {
  rmSync(scratch, {recursive: true, force: true});
}
