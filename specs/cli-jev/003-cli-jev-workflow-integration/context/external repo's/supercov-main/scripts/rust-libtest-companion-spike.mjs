import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const source = join(
  root,
  'spikes/rustc-backend/libtest-presentation-fixture/src/lib.rs',
);
const engine = join(root, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const scratch = mkdtempSync(join(tmpdir(), 'supercov-libtest-companion-'));
const eventToken = '0123456789abcdef0123456789abcdef';
const eventModule = readFileSync(
  join(root, 'crates/supercov-engine/runtime-assets/rust-libtest-events.rs'),
  'utf8',
);
const eventTokenBytes = Buffer.from(eventToken, 'hex');
const eventMagic = Buffer.from('SCVLTST1');
const eventHeaderSize = 64;
const eventRecordHeaderSize = 48;

function createEventFile(path) {
  const header = Buffer.alloc(eventHeaderSize);
  eventMagic.copy(header, 0);
  header.writeUInt32LE(1, 8);
  header.writeUInt32LE(eventHeaderSize, 12);
  header.writeUInt32LE(eventRecordHeaderSize, 16);
  header.writeUInt32LE(0x01020304, 20);
  eventTokenBytes.copy(header, 24);
  writeFileSync(path, header, {flag: 'wx', mode: 0o600});
}

function fnv64(parts) {
  let value = 0xcbf29ce484222325n;
  for (const part of parts) {
    for (const byte of part) {
      value ^= BigInt(byte);
      value = BigInt.asUintN(64, value * 0x100000001b3n);
    }
  }
  return value;
}

function readEvents(path) {
  const bytes = readFileSync(path);
  assert.equal(bytes.subarray(0, 8).equals(eventMagic), true);
  assert.equal(bytes.readUInt32LE(8), 1);
  assert.equal(bytes.readUInt32LE(12), eventHeaderSize);
  assert.equal(bytes.readUInt32LE(16), eventRecordHeaderSize);
  assert.equal(bytes.readUInt32LE(20), 0x01020304);
  assert.equal(bytes.subarray(24, 40).equals(eventTokenBytes), true);
  assert.equal(bytes.subarray(40, 64).every((byte) => byte === 0), true);
  const events = [];
  let offset = eventHeaderSize;
  while (offset < bytes.length) {
    assert(bytes.length - offset >= eventRecordHeaderSize);
    const length = bytes.readUInt32LE(offset);
    assert(length >= eventRecordHeaderSize);
    assert(offset + length <= bytes.length);
    const record = bytes.subarray(offset, offset + length);
    assert.equal(record.readBigUInt64LE(8), BigInt(events.length));
    assert.equal(record.readUInt32LE(32), length - eventRecordHeaderSize);
    assert.equal(record.readUInt32LE(36), 0);
    assert.equal(
      record.readBigUInt64LE(40),
      fnv64([
        eventTokenBytes,
        record.subarray(0, 40),
        record.subarray(eventRecordHeaderSize),
      ]),
    );
    events.push({
      kind: record[4],
      result: record[5],
      count: Number(record.readBigUInt64LE(16)),
      name: record.subarray(eventRecordHeaderSize).toString('utf8'),
    });
    offset += length;
  }
  assert.equal(offset, bytes.length);
  return events;
}

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
  if (options.status !== undefined) {
    assert.equal(
      result.status,
      options.status,
      `${program} ${commandArguments.join(' ')}\n${result.stderr}\n${result.stdout}`,
    );
  }
  return result;
}

function one(directory, pattern) {
  // Mirror the production builder: only a metadata file whose full .rlib
  // sibling exists identifies the linkable crate. Toolchains ship an extra
  // orphan .rmeta whose sort order differs across platforms.
  const matches = readdirSync(directory)
    .filter((entry) => pattern.test(entry))
    .map((entry) => join(directory, entry))
    .filter(
      (entry) =>
        statSync(entry).isFile() &&
        statSync(entry.replace(/\.rmeta$/u, '.rlib'), {
          throwIfNoEntry: false,
        })?.isFile(),
    )
    .sort();
  assert.equal(matches.length, 1, `expected one full ${pattern} under ${directory}`);
  return matches[0];
}

function normalized(output) {
  return output
    .replace(/finished in \d+(?:\.\d+)?s/gu, 'finished in <time>')
    .replace(/(thread '[^\n]+' \()\d+(\) panicked at)/gu, '$1<id>$2');
}

try {
  const rustc = run('rustup', ['which', 'rustc'], {status: 0}).stdout.trim();
  const sysroot = run(rustc, ['--print', 'sysroot'], {status: 0}).stdout.trim();
  const libdir = run(rustc, ['--print', 'target-libdir'], {
    status: 0,
  }).stdout.trim();
  const libtestRoot = join(scratch, 'libtest');
  run('cargo', ['build', '-p', 'supercov'], {status: 0});
  const sourceIdentity = JSON.parse(
    run(
      engine,
      [
        '__prepare-rust-libtest-source',
        join(sysroot, 'lib/rustlib/src/rust/library/test'),
        libtestRoot,
        rustc,
      ],
      {status: 0},
    ).stdout,
  );
  assert.equal(sourceIdentity.eventProtocolVersion, 1);
  assert.match(sourceIdentity.originalSourceSha256, /^[0-9a-f]{64}$/u);
  assert.match(sourceIdentity.eventRuntimeSha256, /^[0-9a-f]{64}$/u);
  assert.match(sourceIdentity.patchedSourceSha256, /^[0-9a-f]{64}$/u);
  const patchedLib = join(libtestRoot, 'src/lib.rs');
  const patchedConsole = join(libtestRoot, 'src/console.rs');
  assert.equal(readFileSync(patchedLib, 'utf8').includes('mod supercov_events;'), true);
  assert.equal(
    readFileSync(patchedConsole, 'utf8').includes(
      'crate::supercov_events::emit(event)?;',
    ),
    true,
  );
  assert.equal(
    readFileSync(join(libtestRoot, 'src/supercov_events.rs'), 'utf8'),
    eventModule,
  );
  const getopts = one(libdir, /^libgetopts-.*\.rmeta$/u);
  const libc = one(libdir, /^liblibc-.*\.rmeta$/u);
  const companion = join(scratch, 'libtest-supercov.rlib');
  const contextStubSource = join(scratch, 'context-stub.rs');
  // A bare object file links unconditionally on both GNU ld and ld64; a
  // staticlib archive is either dead-stripped (GNU member selection) or
  // duplicates rustc runtime shims (ld64 force_load).
  const contextStub = join(scratch, 'supercov-context-stub.o');
  const baseline = join(scratch, 'baseline');
  const candidate = join(scratch, 'candidate');
  mkdirSync(join(scratch, 'out'));

  run(
    rustc,
    [
      patchedLib,
      '--crate-name',
      'test',
      '--crate-type',
      'rlib',
      '--edition',
      '2024',
      '-Zcrate-attr=feature(rustc_private)',
      '-L',
      `dependency=${libdir}`,
      '--extern',
      `getopts=${getopts}`,
      '--extern',
      `libc=${libc}`,
      '-o',
      companion,
    ],
    {status: 0, env: {RUSTC_BOOTSTRAP: '1'}},
  );
  run(rustc, ['--test', source, '--edition', '2024', '-o', baseline], {
    status: 0,
  });
  writeFileSync(
    contextStubSource,
    '#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_enter_context(_: u64) -> u64 { 0 }\n#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_exit_context(_: u64) {}\n#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_exit_test_context(_: u64, _: u64) {}\n',
  );
  run(
    rustc,
    [
      contextStubSource,
      '--crate-name',
      'supercov_context_stub',
      '--crate-type',
      'lib',
      '--emit=obj',
      '-o',
      contextStub,
    ],
    {status: 0},
  );
  run(
    rustc,
    [
      '--test',
      source,
      '--edition',
      '2024',
      '--extern',
      `test=${companion}`,
      '-L',
      `dependency=${libdir}`,
      '-C',
      `link-arg=${contextStub}`,
      '-o',
      candidate,
    ],
    {status: 0},
  );

  let eventRun = 0;
  for (const [listArguments, expectedCounts] of [
    [['--list', '--format=terse'], [0, 4]],
    [['--list', '--format=terse', 'observes'], [3, 1]],
  ]) {
    const expected = run(baseline, listArguments);
    const eventFile = join(scratch, `events-${eventRun}.log`);
    eventRun += 1;
    createEventFile(eventFile);
    const actual = run(candidate, listArguments, {
      env: {
        SUPERCOV_RUST_LIBTEST_EVENTS: eventFile,
        SUPERCOV_RUST_LIBTEST_TOKEN: eventToken,
      },
    });
    assert.equal(actual.status, expected.status, listArguments.join(' '));
    assert.equal(actual.stdout, expected.stdout, listArguments.join(' '));
    assert.equal(actual.stderr, expected.stderr, listArguments.join(' '));
    assert.deepEqual(
      readEvents(eventFile).map(({kind, count}) => ({kind, count})),
      [
        {kind: 1, count: expectedCounts[0]},
        {kind: 2, count: expectedCounts[1]},
      ],
      `authenticated listing differs for ${listArguments.join(' ')}`,
    );
  }

  for (const runArguments of [
    ['--test-threads=1'],
    ['--test-threads=1', '--show-output'],
    ['--test-threads=1', '--nocapture'],
    ['--test-threads=1', '--format=pretty'],
    ['--test-threads=1', '--quiet'],
    ['--ignored', '--test-threads=1'],
  ]) {
    const expected = run(baseline, runArguments);
    const eventFile = join(scratch, `events-${eventRun}.log`);
    eventRun += 1;
    createEventFile(eventFile);
    const actual = run(candidate, runArguments, {
      env: {
        SUPERCOV_RUST_LIBTEST_EVENTS: eventFile,
        SUPERCOV_RUST_LIBTEST_TOKEN: eventToken,
      },
    });
    assert.equal(actual.status, expected.status, runArguments.join(' '));
    assert.equal(
      normalized(actual.stdout),
      normalized(expected.stdout),
      `stdout differs for ${runArguments.join(' ')}`,
    );
    assert.equal(
      normalized(actual.stderr),
      normalized(expected.stderr),
      `stderr differs for ${runArguments.join(' ')}`,
    );
    const events = readEvents(eventFile);
    assert.equal(events[0]?.kind, 1);
    assert.equal(events[1]?.kind, 2);
    assert(events.some((event) => event.kind === 3 && event.name.length > 0));
    assert(
      events.some(
        (event) =>
          event.kind === 5 && [1, 2, 3].includes(event.result) && event.name.length > 0,
      ),
    );
  }

  console.log(
    '[rust-libtest-companion-spike] an exact-toolchain libtest replacement emits authenticated outcomes while preserving stock scheduling, process state, capture and presentation',
  );
} finally {
  rmSync(scratch, {recursive: true, force: true});
}
