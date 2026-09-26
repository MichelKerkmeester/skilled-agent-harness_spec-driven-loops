// The public Rust path, end to end: `supercov -- cargo test` on a small crate,
// through the exact compiler chain and the libtest companion, then queries
// for what each test proved. Two tests reach library code indirectly -- one
// from a spawned thread, one from a child binary -- because that attribution
// rests on the runtime taking over thread and process creation, which is
// interposition on POSIX and import-table patching on Windows. A doctest is
// the only thing that reaches one branch, so the rustdoc wrapper is proven
// too; and when cargo-nextest is on PATH, a test that fails its first attempt
// runs again under `cargo nextest run --retries 1`.
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const launcher = resolve(repository, 'bin/supercov.js');
// The runner spells TEMP as an 8.3 short name; the product resolves paths to
// long names. Hand it long names, as real installations have.
const temporary = mkdtempSync(resolve(realpathSync.native(tmpdir()), 'supercov-rust-public-'));
const project = resolve(temporary, 'fixture');

const library = [
  '/// ```',
  '/// assert_eq!(public_rust_fixture::classify(0), "zero");',
  '/// ```',
  'pub fn classify(value: i32) -> &\'static str {',
  '    if value < 0 {',
  '        "negative"',
  '    } else if value == 0 {',
  '        "zero"',
  '    } else {',
  '        "positive"',
  '    }',
  '}',
  '',
  'pub fn doubled(value: i32) -> i32 {',
  '    value * 2',
  '}',
  '',
  'pub fn greeting(word: &str) -> String {',
  '    format!("child:{word}")',
  '}',
  '',
  'pub fn never_called() -> i32 {',
  '    99',
  '}',
  '',
];
const line = (text) => library.indexOf(text) + 1;
const zeroLine = line('        "zero"');
const neverLine = line('    99');
const doubledLine = line('    value * 2');
const greetingLine = line('    format!("child:{word}")');

function environment() {
  return { ...process.env, SUPERCOV_RUST_BINARY: binary };
}

function supercov(args, env = environment()) {
  return spawnSync(process.execPath, [launcher, ...args], {
    cwd: project,
    encoding: 'utf8',
    env,
    timeout: 900_000,
  });
}

// The runner's nextest contract is verified against 0.9.138 and 0.9.140. This
// leg used to skip when cargo-nextest was not on PATH, which is how a runner
// that refused every nextest command passed this gate locally while CI failed
// (1c8bf35). A verified nextest on PATH is used; otherwise the pinned build is
// fetched once into the temp directory. The leg never skips.
const NEXTEST_VERSION = '0.9.140';
const VERIFIED_NEXTEST = /cargo-nextest 0\.9\.(?:138|140)\b/;
async function nextestEnvironment() {
  const windows = process.platform === 'win32';
  const probe = (env) => spawnSync('cargo', ['nextest', '--version'], { encoding: 'utf8', env, shell: windows });
  const onPath = probe(environment());
  if (onPath.status === 0 && VERIFIED_NEXTEST.test(onPath.stdout)) {
    return { env: environment(), version: onPath.stdout.trim().split('\n')[0] };
  }
  const archive = {
    darwin: 'mac',
    linux: process.arch === 'arm64' ? 'linux-arm' : 'linux',
    win32: process.arch === 'x64' ? 'windows-tar' : undefined,
  }[process.platform];
  assert.ok(
    archive,
    `no verified cargo-nextest on PATH (${onPath.stdout.trim() || onPath.stderr.trim() || 'absent'}) and no pinned build for ${process.platform}/${process.arch}: install cargo-nextest ${NEXTEST_VERSION}`,
  );
  const directory = resolve(realpathSync.native(tmpdir()), `supercov-cargo-nextest-${NEXTEST_VERSION}`);
  const executable = resolve(directory, windows ? 'cargo-nextest.exe' : 'cargo-nextest');
  if (!existsSync(executable)) {
    mkdirSync(directory, { recursive: true });
    const response = await fetch(`https://get.nexte.st/${NEXTEST_VERSION}/${archive}`);
    assert.ok(response.ok, `fetching cargo-nextest ${NEXTEST_VERSION}: HTTP ${response.status}`);
    const tarball = resolve(directory, 'cargo-nextest.tar.gz');
    writeFileSync(tarball, Buffer.from(await response.arrayBuffer()));
    const extracted = spawnSync('tar', ['xzf', tarball, '-C', directory], { encoding: 'utf8' });
    assert.equal(extracted.status, 0, `extracting cargo-nextest: ${extracted.stderr}`);
    rmSync(tarball, { force: true });
  }
  const env = { ...environment(), PATH: `${directory}${delimiter}${process.env.PATH}` };
  const fetched = probe(env);
  assert.equal(fetched.status, 0, `the fetched cargo-nextest does not run: ${fetched.stderr}`);
  assert.match(fetched.stdout, VERIFIED_NEXTEST, fetched.stdout);
  return { env, version: `${fetched.stdout.trim().split('\n')[0]} (fetched)` };
}

function query(args) {
  const result = supercov([...args, '--json']);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true, result.stdout);
  return payload.data;
}

try {
  mkdirSync(resolve(project, 'src/bin'), { recursive: true });
  mkdirSync(resolve(project, 'tests'), { recursive: true });
  writeFileSync(
    resolve(project, 'Cargo.toml'),
    ['[package]', 'name = "public_rust_fixture"', 'version = "0.0.0"', 'edition = "2024"', ''].join('\n'),
  );
  writeFileSync(resolve(project, 'src/lib.rs'), library.join('\n'));
  writeFileSync(
    resolve(project, 'src/bin/worker.rs'),
    [
      'fn main() {',
      '    let word = std::env::args().nth(1).unwrap_or_default();',
      '    println!("{}", public_rust_fixture::greeting(&word));',
      '}',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'tests/suite.rs'),
    [
      'use public_rust_fixture::{classify, doubled};',
      '',
      '#[test]',
      'fn classifies_negative() {',
      '    assert_eq!(classify(-1), "negative");',
      '}',
      '',
      '#[test]',
      'fn classifies_positive() {',
      '    assert_eq!(classify(5), "positive");',
      '}',
      '',
      '#[test]',
      'fn doubles_on_a_thread() {',
      '    let handle = std::thread::spawn(|| doubled(21));',
      '    assert_eq!(handle.join().unwrap(), 42);',
      '}',
      '',
      '#[test]',
      'fn greets_from_a_child() {',
      '    let output = std::process::Command::new(env!("CARGO_BIN_EXE_worker"))',
      '        .arg("hi")',
      '        .output()',
      '        .unwrap();',
      '    assert!(output.status.success());',
      '    assert_eq!(String::from_utf8_lossy(&output.stdout).trim(), "child:hi");',
      '}',
      '',
      '// Fails on its first nextest attempt and passes on the second; under',
      '// plain cargo test the variable is absent and it passes at once.',
      '#[test]',
      'fn passes_on_retry() {',
      '    assert_ne!(std::env::var("NEXTEST_ATTEMPT").as_deref(), Ok("1"));',
      '}',
      '',
    ].join('\n'),
  );

  const run = supercov(['--', 'cargo', 'test']);
  assert.equal(run.status, 0, `${run.stdout}\n${run.stderr}`);
  assert.match(run.stderr, /\[supercov\] detected Rust/);
  // Five integration tests and one doctest.
  assert.match(run.stderr, /\[supercov\] Rust coverage: 6 test\(s\)/, run.stderr);

  const summary = query(['runs', 'latest', 'summary']);
  const { lines } = summary.coverage;
  assert.ok(lines.covered > 0 && lines.covered < lines.total, `never_called is never called: ${JSON.stringify(lines)}`);

  // The zero branch is reached only from the doctest, through the rustdoc wrapper.
  const documented = JSON.stringify(query(['runs', 'latest', 'line', `src/lib.rs:${zeroLine}`]));
  assert.match(documented, /src\/lib\.rs - classify \(line \d+\)/, `the zero branch belongs to the doctest: ${documented}`);
  assert.doesNotMatch(documented, /classifies_/, `no integration test reaches the zero branch: ${documented}`);

  // What each test proved, through the paths that depend on the platform hooks.
  const threaded = query(['runs', 'latest', 'line', `src/lib.rs:${doubledLine}`]);
  assert.match(
    JSON.stringify(threaded),
    /doubles_on_a_thread/,
    `a line reached only from a spawned thread must belong to the test that spawned it: ${JSON.stringify(threaded)}`,
  );
  const child = query(['runs', 'latest', 'line', `src/lib.rs:${greetingLine}`]);
  assert.match(
    JSON.stringify(child),
    /greets_from_a_child/,
    `a line reached only in a child process must belong to the test that started it: ${JSON.stringify(child)}`,
  );
  const untaken = JSON.stringify(query(['runs', 'latest', 'line', `src/lib.rs:${neverLine}`]));
  assert.doesNotMatch(untaken, /classifies_|doubles_|greets_|passes_on_retry|\(line \d+\)/, `nothing reaches never_called: ${untaken}`);

  // nextest: the same crate, one test retried once.
  const nextest = await nextestEnvironment();
  const retried = supercov(['--', 'cargo', 'nextest', 'run', '--retries', '1'], nextest.env);
  assert.equal(retried.status, 0, `${retried.stdout}\n${retried.stderr}`);
  // nextest colors its summary on CI; compare the plain text.
  const plain = (retried.stdout + retried.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  assert.match(plain, /1 flaky/, `one test must have passed on its second attempt: ${plain}`);
  // nextest runs the integration tests, not the doctest.
  assert.match(retried.stderr, /\[supercov\] Rust coverage: 5 test\(s\)/, retried.stderr);
  const retriedLine = JSON.stringify(query(['runs', 'latest', 'line', `src/lib.rs:${doubledLine}`]));
  assert.match(retriedLine, /doubles_on_a_thread/, `attribution holds under nextest: ${retriedLine}`);
  const nextestNote = `${nextest.version} retried one test once`;

  console.log(
    `[rust-public-cargo] ${process.platform} ran the public cargo test path through the exact compiler chain; a spawned thread, a child process and a doctest kept their tests; ${nextestNote}`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
