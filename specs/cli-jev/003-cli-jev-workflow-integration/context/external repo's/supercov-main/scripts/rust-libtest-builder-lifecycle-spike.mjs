import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename, join, resolve} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const supercov = join(root, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const sourceCompanion = join(
  root,
  `spikes/rustc-backend/target/debug/supercov-rustc-backend-spike${process.platform === 'win32' ? '.exe' : ''}`,
);
const scratch = mkdtempSync(join(tmpdir(), 'supercov-libtest-builder-lifecycle-'));

function run(program, commandArguments, options = {}) {
  const result = spawnSync(program, commandArguments, {
    cwd: options.cwd ?? root,
    env: {...process.env, ...options.env},
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

function spawnCaptured(program, commandArguments, options = {}) {
  const child = spawn(program, commandArguments, {
    cwd: options.cwd ?? root,
    env: {...process.env, ...options.env},
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (value) => {
    stdout += value;
  });
  child.stderr.on('data', (value) => {
    stderr += value;
  });
  let settled = false;
  const completed = new Promise((resolveCompleted, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => {
      settled = true;
      resolveCompleted({code, signal, stdout, stderr});
    });
  });
  return {child, completed, isSettled: () => settled};
}

function builderArguments(source, work, rustc, companion) {
  return [
    '__build-rust-libtest-companion',
    source,
    work,
    rustc,
    companion,
  ];
}

function assertSuccessful(result) {
  assert.equal(result.signal, null, result.stderr);
  assert.equal(result.code, 0, `${result.stderr}\n${result.stdout}`);
  return JSON.parse(result.stdout);
}

function partialsBelow(directory) {
  const found = [];
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...partialsBelow(path));
    if (entry.name.endsWith('.partial')) found.push(path);
  }
  return found;
}

async function waitFor(predicate, message, timeout = 30_000) {
  const started = Date.now();
  while (!predicate()) {
    assert(Date.now() - started < timeout, message);
    await delay(20);
  }
}

try {
  run('cargo', ['build', '--manifest-path', 'spikes/rustc-backend/Cargo.toml'], {
    env: {RUSTC_BOOTSTRAP: '1'},
  });
  run('cargo', ['build', '-p', 'supercov']);
  const rustc = run('rustup', ['which', 'rustc']).stdout.trim();
  const sysroot = run(rustc, ['--print', 'sysroot']).stdout.trim();
  const source = join(sysroot, 'lib/rustlib/src/rust/library/test');

  const concurrentRoot = join(scratch, 'concurrent');
  const concurrentWork = join(concurrentRoot, 'work');
  const concurrentCompanion = join(concurrentRoot, basename(sourceCompanion));
  mkdirSync(concurrentWork, {recursive: true});
  cpSync(sourceCompanion, concurrentCompanion);
  const concurrentArguments = builderArguments(
    source,
    concurrentWork,
    rustc,
    concurrentCompanion,
  );
  const first = spawnCaptured(supercov, concurrentArguments);
  const second = spawnCaptured(supercov, concurrentArguments);
  const [firstResult, secondResult] = await Promise.all([
    first.completed,
    second.completed,
  ]);
  const firstBundle = assertSuccessful(firstResult);
  const secondBundle = assertSuccessful(secondResult);
  assert.deepEqual(secondBundle, firstBundle);
  assert.equal(partialsBelow(concurrentRoot).length, 0);
  assert(statSync(join(concurrentRoot, firstBundle.artifactFile)).isFile());

  const killedRoot = join(scratch, 'killed');
  const killedWork = join(killedRoot, 'work');
  const killedCompanion = join(killedRoot, basename(sourceCompanion));
  mkdirSync(killedWork, {recursive: true});
  cpSync(sourceCompanion, killedCompanion);
  const killedArguments = builderArguments(source, killedWork, rustc, killedCompanion);
  const killed = spawnCaptured(supercov, killedArguments);
  await waitFor(
    () => {
      assert.equal(
        killed.isSettled(),
        false,
        'real libtest builder exited before its publication lock was observed',
      );
      return existsSync(`${killedCompanion}.libtest.lock`);
    },
    'real libtest builder did not acquire its publication lock',
  );
  assert.equal(killed.child.kill('SIGKILL'), true);
  const killedResult = await killed.completed;
  assert.equal(killedResult.signal, 'SIGKILL');

  const recovered = spawnCaptured(supercov, killedArguments);
  const recoveredBundle = assertSuccessful(await recovered.completed);
  assert(statSync(join(killedRoot, recoveredBundle.artifactFile)).isFile());
  assert.equal(partialsBelow(killedRoot).length, 0);
  assert.doesNotThrow(() =>
    JSON.parse(readFileSync(`${killedCompanion}.libtest.json`, 'utf8')),
  );

  console.log(
    '[rust-libtest-builder-lifecycle-spike] concurrent real-toolchain builders converge and SIGKILL recovery publishes one authenticated companion without partial debris',
  );
} finally {
  rmSync(scratch, {recursive: true, force: true});
}
