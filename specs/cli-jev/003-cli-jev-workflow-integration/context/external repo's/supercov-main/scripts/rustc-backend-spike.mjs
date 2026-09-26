import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {createHash, randomBytes} from 'node:crypto';
import {
  closeSync,
  chmodSync,
  cpSync,
  existsSync,
  ftruncateSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  realpathSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
  writeSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename, dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifest = join(root, 'spikes/rustc-backend/Cargo.toml');
const fixture = join(root, 'spikes/rustc-backend/fixture/Cargo.toml');
const fixtureRoot = dirname(fixture);
const wrapper = join(
  root,
  `spikes/rustc-backend/target/debug/supercov-rustc-backend-spike${process.platform === 'win32' ? '.exe' : ''}`,
);
const supercov = join(root, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const scratch = mkdtempSync(join(tmpdir(), 'supercov-rustc-spike-'));
const rustcTargetLibdirResult = spawnSync('rustc', ['--print', 'target-libdir'], {
  encoding: 'utf8',
});
assert.equal(rustcTargetLibdirResult.status, 0, rustcTargetLibdirResult.stderr);
const rustcTargetLibdir = rustcTargetLibdirResult.stdout.trim();
assert(rustcTargetLibdir.length > 0, 'rustc returned an empty target libdir');
const fixtureSourcePath = join(root, 'spikes/rustc-backend/fixture/src/lib.rs');
const fixtureSourceBytes = readFileSync(fixtureSourcePath);
const fixtureSourceDigest = createHash('sha256')
  .update(fixtureSourceBytes)
  .digest('hex');
const fixtureSource = fixtureSourceBytes.toString('utf8').split('\n');
const noStdFixtureSourcePath = join(
  root,
  'spikes/rustc-backend/fixture/no-std-fixture/src/lib.rs',
);
const noStdFixtureSource = readFileSync(noStdFixtureSourcePath, 'utf8').split('\n');
const transportHeaderSize = 128;
const transportDescriptorSize = 40;
const transportContext = 42;
let commandInputOrdinal = 0;

function cargoWorkspace(projectRoot) {
  const canonical = realpathSync(projectRoot);
  const digest = createHash('sha256').update(canonical).digest('hex').slice(0, 24);
  return join(
    dirname(canonical),
    `.supercov-cargo-${digest}`,
    'workspace',
    'root',
    basename(canonical),
  );
}

function createTransport(
  name,
  descriptorCapacity = 32_768,
  payloadCapacity = 4 * 1024 * 1024,
) {
  const path = join(scratch, `${name}.transport`);
  const token = randomBytes(16);
  const header = Buffer.alloc(transportHeaderSize);
  header.write('SCVRUST3', 0, 'ascii');
  header.writeUInt32LE(3, 8);
  header.writeUInt32LE(transportHeaderSize, 12);
  header.writeUInt32LE(transportDescriptorSize, 16);
  header.writeUInt32LE(descriptorCapacity, 20);
  header.writeUInt32LE(payloadCapacity, 24);
  header.writeUInt32LE(0x01020304, 28);
  token.copy(header, 56);
  const descriptorBytes = descriptorCapacity * transportDescriptorSize;
  const file = openSync(path, 'wx+');
  try {
    ftruncateSync(file, transportHeaderSize + descriptorBytes + payloadCapacity);
    writeSync(file, header, 0, header.length, 0);
  } finally {
    closeSync(file);
  }
  return {path, token, tokenHex: token.toString('hex')};
}

function readTransport(transport) {
  const bytes = readFileSync(transport.path);
  assert.equal(bytes.subarray(0, 8).toString('ascii'), 'SCVRUST3');
  assert.equal(bytes.readUInt32LE(8), 3);
  assert.deepEqual(bytes.subarray(56, 72), transport.token);
  const descriptorCapacity = bytes.readUInt32LE(20);
  const payloadCapacity = bytes.readUInt32LE(24);
  const payloadBase = transportHeaderSize + descriptorCapacity * transportDescriptorSize;
  assert.equal(bytes.length, payloadBase + payloadCapacity);
  const reserved = Number(bytes.readBigUInt64LE(32));
  const ordinals = [];
  const decisions = [];
  const phases = [];
  const threadPhases = [];
  const threadEnds = [];
  const testBoundaries = [];
  let committed = 0;
  for (let index = 0; index < Math.min(reserved, descriptorCapacity); index += 1) {
    const descriptor = transportHeaderSize + index * transportDescriptorSize;
    if (bytes[descriptor] === 0) continue;
    committed += 1;
    const kind = bytes[descriptor + 1];
    const context = bytes.readBigUInt64LE(descriptor + 8).toString();
    const payloadOffset = bytes.readUInt32LE(descriptor + 16);
    const payloadLength = bytes.readUInt32LE(descriptor + 20);
    const idLength = bytes.readUInt32LE(descriptor + 24);
    const valueLength = bytes.readUInt32LE(descriptor + 28);
    assert(payloadOffset + payloadLength <= payloadCapacity);
    assert.equal(payloadLength, idLength + valueLength);
    const payload = payloadBase + payloadOffset;
    if (kind === 3) {
      assert.equal(payloadLength, 8);
      assert.equal(idLength, 0);
      assert.equal(valueLength, 8);
      ordinals.push({
        context,
        ordinal: bytes.readBigUInt64LE(payload).toString(),
      });
    } else if (kind === 2) {
      decisions.push({
        context,
        id: bytes.subarray(payload, payload + idLength).toString('utf8'),
        outcome: bytes[descriptor + 2] !== 0,
        values: [...bytes.subarray(payload + idLength, payload + payloadLength)].map(
          (value) => (value === 0 ? null : value === 2),
        ),
      });
    } else if (kind === 4) {
      assert.equal(bytes[descriptor + 2], 0);
      assert.equal(valueLength, 16);
      phases.push({
        child: context,
        parent: bytes.readBigUInt64LE(payload + idLength).toString(),
        nonce: bytes.readBigUInt64LE(payload + idLength + 8).toString(),
        decisionId: bytes.subarray(payload, payload + idLength).toString('utf8'),
      });
    } else if (kind === 5) {
      assert.equal(bytes[descriptor + 2], 0);
      assert.equal(idLength, 0);
      assert.equal(valueLength, 16);
      threadPhases.push({
        child: context,
        parent: bytes.readBigUInt64LE(payload).toString(),
        nonce: bytes.readBigUInt64LE(payload + 8).toString(),
        index,
      });
    } else if (kind === 6) {
      assert.equal(bytes[descriptor + 2], 0);
      assert.equal(payloadLength, 0);
      threadEnds.push({context, index});
    } else if (kind === 7) {
      assert.equal(bytes[descriptor + 2], 0);
      assert.equal(payloadLength, 0);
      testBoundaries.push({context, index});
    } else {
      assert.fail(`unexpected Rust transport record kind ${kind}`);
    }
  }
  return {
    attachments: Number(bytes.readBigUInt64LE(72)),
    committed,
    dropped: Number(bytes.readBigUInt64LE(48)),
    incomplete: Math.min(reserved, descriptorCapacity) - committed,
    decisions,
    ordinals,
    phases,
    threadPhases,
    threadEnds,
    testBoundaries,
  };
}

function sourceLine(fragment) {
  const index = fixtureSource.findIndex((line) => line.includes(fragment));
  assert.notEqual(index, -1, `missing fixture fragment: ${fragment}`);
  return index + 1;
}

function llvmTool(name) {
  for (const [command, args] of [
    ['rustup', ['which', name]],
    ...(process.platform === 'darwin' ? [['xcrun', ['--find', name]]] : []),
  ]) {
    const result = spawnSync(command, args, {encoding: 'utf8'});
    if (result.status === 0 && result.stdout.trim().length > 0) {
      return result.stdout.trim();
    }
  }
  assert.fail(
    `the Rust development-oracle gate requires ${name} from rustup llvm-tools or Xcode`,
  );
}

function sourceTokenLocation(lines, lineFragment, token, occurrence = 0) {
  const lineIndex = lines.findIndex((line) => line.includes(lineFragment));
  assert.notEqual(lineIndex, -1, `missing oracle source fragment: ${lineFragment}`);
  let start = -1;
  let from = 0;
  for (let index = 0; index <= occurrence; index += 1) {
    start = lines[lineIndex].indexOf(token, from);
    assert.notEqual(start, -1, `missing oracle token ${token} in ${lineFragment}`);
    from = start + token.length;
  }
  return {
    line: lineIndex + 1,
    start: start + 1,
    end: start + 1 + token.length,
  };
}

function generatedBooleanCorpus(caseCount) {
  const structuralCaseCount = 16;
  const expressions = [
    'observe(&mut trace, 1, a) && observe(&mut trace, 2, b)',
    'observe(&mut trace, 1, a) || observe(&mut trace, 2, b)',
    '(observe(&mut trace, 1, a) || observe(&mut trace, 2, b)) && observe(&mut trace, 3, c)',
    'observe(&mut trace, 1, a) && (observe(&mut trace, 2, b) || observe(&mut trace, 3, c))',
    '(observe(&mut trace, 1, a) && observe(&mut trace, 2, b)) || observe(&mut trace, 3, c)',
    'observe(&mut trace, 1, a) || (observe(&mut trace, 2, b) && observe(&mut trace, 3, c))',
    '(observe(&mut trace, 1, a) || observe(&mut trace, 2, b)) && (observe(&mut trace, 3, c) || observe(&mut trace, 4, a))',
    '(observe(&mut trace, 1, a) && observe(&mut trace, 2, b)) || (observe(&mut trace, 3, c) && observe(&mut trace, 4, a))',
  ];
  const functions = Array.from({length: caseCount}, (_, index) => `
#[inline(never)]
fn case_${index}(a: bool, b: bool, c: bool) -> (u64, u64) {
    let mut trace = ${index + 1}u64;
    let outcome = if ${expressions[index % expressions.length]} {
        ${1000 + index}
    } else {
        ${2000 + index}
    };
    (outcome, trace)
}`).join('\n');
  const calls = Array.from(
    {length: caseCount},
    (_, index) => `
        let (outcome, trace) = case_${index}(a, b, c);
        checksum = checksum.rotate_left(7) ^ outcome ^ trace;`,
  ).join('');
  const structuralFunctions = Array.from(
    {length: structuralCaseCount},
    (_, index) => `
#[inline(never)]
fn pattern_case_${index}(value: Option<bool>, enabled: bool) -> u64 {
    if let Some(inner) = value && inner && enabled {
        ${3000 + index}
    } else {
        ${4000 + index}
    }
}

#[inline(never)]
fn guard_case_${index}(value: Option<bool>, enabled: bool) -> u64 {
    match value {
        Some(inner) if inner && enabled => ${5000 + index},
        Some(_) => ${6000 + index},
        None => ${7000 + index},
    }
}

#[inline(never)]
fn error_case_${index}(first: Result<u64, u64>, second: Option<u64>) -> Result<u64, u64> {
    let first = first?;
    let Some(second) = second else {
        return Err(${8000 + index});
    };
    Ok(first + second + ${index})
}

#[inline(never)]
fn ownership_case_${index}(enabled: bool) -> (u64, Vec<u64>) {
    let log = std::cell::RefCell::new(Vec::new());
    let result = {
        let first = DropMark { id: ${9000 + index}, log: &log };
        let second = DropMark { id: ${10000 + index}, log: &log };
        let evaluate = || {
            let _captures = (&first, &second);
            if enabled { ${11000 + index} } else { ${12000 + index} }
        };
        evaluate()
    };
    (result, log.into_inner())
}
`,
  ).join('\n');
  const structuralCalls = Array.from(
    {length: structuralCaseCount},
    (_, index) => `
    for (value, enabled) in [(None, false), (Some(false), false), (Some(true), false), (Some(true), true)] {
        checksum = checksum.rotate_left(7) ^ pattern_case_${index}(value, enabled);
        checksum = checksum.rotate_left(7) ^ guard_case_${index}(value, enabled);
    }
    for result in [
        error_case_${index}(Err(${13000 + index}), Some(1)),
        error_case_${index}(Ok(2), None),
        error_case_${index}(Ok(2), Some(3)),
    ] {
        checksum = checksum.rotate_left(7) ^ match result { Ok(value) | Err(value) => value };
    }
    for enabled in [false, true] {
        let (value, drops) = ownership_case_${index}(enabled);
        checksum = checksum.rotate_left(7) ^ value;
        for drop in drops { checksum = checksum.rotate_left(7) ^ drop; }
    }
`,
  ).join('');
  const pointFunctions = `
#[inline(never)]
fn point_case_both(flag: bool) -> u64 {
    let seed = 13001u64;
    if flag {
        let taken = seed + 3;
        return taken + 7;
    }
    let fallback = seed + 5;
    fallback + 7
}

#[inline(never)]
fn point_case_partial(flag: bool) -> u64 {
    let seed = 14009u64;
    if flag {
        let taken = seed + 11;
        return taken + 13;
    }
    let fallback = seed + 17;
    fallback + 19
}

#[inline(never)]
fn point_case_never(flag: bool) -> u64 {
    let seed = 15013u64;
    if flag {
        let taken = seed + 23;
        return taken + 29;
    }
    let fallback = seed + 31;
    fallback + 37
}
`;
  return `
#[inline(never)]
fn observe(trace: &mut u64, slot: u64, value: bool) -> bool {
    *trace = trace.rotate_left(5) ^ (slot << 1) ^ u64::from(value);
    value
}
${functions}

struct DropMark<'a> {
    id: u64,
    log: &'a std::cell::RefCell<Vec<u64>>,
}

impl Drop for DropMark<'_> {
    fn drop(&mut self) {
        self.log.borrow_mut().push(self.id);
    }
}
${structuralFunctions}
${pointFunctions}

fn main() {
    let mut checksum = 0u64;
    for mask in 0u8..8 {
        let a = mask & 1 != 0;
        let b = mask & 2 != 0;
        let c = mask & 4 != 0;${calls}
    }
    ${structuralCalls}
    checksum = checksum.rotate_left(7) ^ point_case_both(false);
    checksum = checksum.rotate_left(7) ^ point_case_both(true);
    checksum = checksum.rotate_left(7) ^ point_case_partial(true);
    println!("generated-boolean={checksum}");
}
`.trimStart();
}

function generatedEditionCorpus() {
  return `
#[inline(never)]
fn choice(first: bool, second: bool) -> u64 {
    if first && second { 17 } else { 29 }
}

fn main() {
    let checksum = choice(false, false) ^ choice(true, false) ^ choice(true, true);
    println!("edition={}", checksum);
}
`.trimStart();
}

function byteRangeLocation(source, start, end) {
  assert(Number.isInteger(start) && Number.isInteger(end) && start < end);
  const bytes = Buffer.from(source);
  const prefix = bytes.subarray(0, start).toString('utf8');
  const selected = bytes.subarray(start, end).toString('utf8');
  assert.equal(Buffer.byteLength(prefix) + Buffer.byteLength(selected), end);
  assert(!selected.includes('\n'), 'generated oracle condition unexpectedly spans lines');
  const lines = prefix.split('\n');
  return {
    line: lines.length,
    start: Buffer.byteLength(lines.at(-1)) + 1,
    end: Buffer.byteLength(lines.at(-1)) + 1 + Buffer.byteLength(selected),
  };
}

async function verifyGeneratedPackageIsolation({
  cargo,
  rustc,
  rustcHost,
  wrapper,
  supercov,
}) {
  const generatedPackageWorkspace = join(scratch, 'generated-package-workspace');
  mkdirSync(generatedPackageWorkspace);
  writeFileSync(
    join(generatedPackageWorkspace, 'Cargo.toml'),
    '[workspace]\nmembers = ["alpha", "beta"]\nresolver = "3"\n',
  );
  for (const packageName of ['alpha', 'beta']) {
    const packageRoot = join(generatedPackageWorkspace, packageName);
    mkdirSync(join(packageRoot, 'src'), {recursive: true});
    writeFileSync(
      join(packageRoot, 'Cargo.toml'),
      `[package]\nname = "${packageName}"\nversion = "0.0.0"\nedition = "2024"\nbuild = "build.rs"\n`,
    );
    writeFileSync(
      join(packageRoot, 'build.rs'),
      [
        'fn main() {',
        '    let output = std::path::PathBuf::from(std::env::var_os("OUT_DIR").expect("OUT_DIR"));',
        '    std::fs::write(output.join("generated.rs"), "pub fn generated_choice(value: bool) -> usize { if value { 17 } else { 19 } }\\n").expect("generated source");',
        '}',
        '',
      ].join('\n'),
    );
    writeFileSync(
      join(packageRoot, 'src/lib.rs'),
      [
        'include!(concat!(env!("OUT_DIR"), "/generated.rs"));',
        '',
        '#[cfg(test)]',
        'mod tests {',
        '    #[test]',
        '    fn generated_both_paths() {',
        '        assert_eq!(super::generated_choice(false), 19);',
        '        assert_eq!(super::generated_choice(true), 17);',
        '    }',
        '}',
        '',
      ].join('\n'),
    );
  }
  const generatedPackageOutput = join(scratch, 'generated-package-output');
  run(cargo, ['build', '--quiet', '--workspace'], {
    cwd: generatedPackageWorkspace,
    env: {
      CARGO_TARGET_DIR: join(scratch, 'generated-package-target'),
      RUSTC: rustc,
      RUSTC_WRAPPER: wrapper,
      DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
        .filter(Boolean)
        .join(':'),
      LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
        .filter(Boolean)
        .join(':'),
      SUPERCOV_RUST_COMPILER_OUTPUT: generatedPackageOutput,
      SUPERCOV_RUST_SOURCE_ROOT: generatedPackageWorkspace,
    },
  });
  const generatedPackageFacts = ['alpha', 'beta'].map((packageName) => {
    const manifest = crateManifest(generatedPackageOutput, packageName);
    const sources = compilerSources(generatedPackageOutput, packageName);
    const obligation = obligationFor(manifest, 'generated_choice');
    assert(obligation, `${packageName} omitted its generated function obligation`);
    assert.equal(obligation.provenance, 'generated-source');
    assert.equal(
      obligation.sourceKey,
      `generated:package:${packageName}:generated.rs`,
    );
    assert.equal(
      sources[obligation.sourceKey]?.source,
      'pub fn generated_choice(value: bool) -> usize { if value { 17 } else { 19 } }\n',
    );
    const normalizedPackage = JSON.parse(
      run(supercov, ['__normalize-rust-compiler-manifest'], {
        input: JSON.stringify({manifest, sources}),
      }).stdout,
    );
    return {
      id: obligation.id,
      sourceKey: obligation.sourceKey,
      fingerprint: normalizedPackage.manifest.scope.sourceFingerprint.digest,
    };
  });
  assert.notEqual(
    generatedPackageFacts[0].id,
    generatedPackageFacts[1].id,
    'identical generated functions from different packages shared one obligation identity',
  );
  assert.notEqual(
    generatedPackageFacts[0].sourceKey,
    generatedPackageFacts[1].sourceKey,
    'identical generated files from different packages shared one source identity',
  );
  assert.notEqual(
    generatedPackageFacts[0].fingerprint,
    generatedPackageFacts[1].fingerprint,
    'generated-source fingerprints omitted workspace package ownership',
  );

  const sourceDigest = () => {
    const hash = createHash('sha256');
    for (const packageName of ['alpha', 'beta']) {
      for (const file of ['Cargo.toml', 'build.rs', 'src/lib.rs']) {
        hash.update(`${packageName}/${file}\0`);
        hash.update(readFileSync(join(generatedPackageWorkspace, packageName, file)));
      }
    }
    return hash.digest('hex');
  };
  const sourceBeforeRun = sourceDigest();
  const generatedPackageRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {
        RUSTC: rustc,
        DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
          .filter(Boolean)
          .join(':'),
        LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
          .filter(Boolean)
          .join(':'),
      },
      input: JSON.stringify({
        root: generatedPackageWorkspace,
        command: [cargo, 'test', '--workspace', '--lib'],
        runId: 'run_c123456789abcdef',
        startedAt: '2026-08-26T00:00:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(generatedPackageRun.exitCode, 0);
  assert.equal(generatedPackageRun.tests, 2);
  assert.equal(generatedPackageRun.libtests, 2);
  assert.equal(generatedPackageRun.doctests, 0);
  assert(generatedPackageRun.denominator.points >= 6);
  assert(generatedPackageRun.denominator.branches >= 2);
  assert(generatedPackageRun.denominator.decisions >= 2);
  assert(generatedPackageRun.summary.lines.covered >= 4);
  assert(generatedPackageRun.summary.branches.covered >= 4);
  assert(generatedPackageRun.summary.coveredConditions >= 2);
  assert.equal(generatedPackageRun.transportHealth.length, 4);
  assert.equal(
    generatedPackageRun.transportHealth.filter(
      ({scopeKind}) => scopeKind === 'runner-invocation',
    ).length,
    2,
  );
  assert.equal(
    generatedPackageRun.transportHealth.filter(
      ({scopeKind}) => scopeKind === 'test-attempt',
    ).length,
    2,
  );
  assert(
    generatedPackageRun.transportHealth.every(
      ({status, transport}) =>
        status === 'passed' &&
        transport.dropped === 0 &&
        transport.incomplete === 0,
    ),
    'generated workspace published unhealthy per-test transport',
  );
  const generatedPackageQuery = JSON.parse(
    run(supercov, ['__query-stored-run'], {
      input: JSON.stringify({
        root: generatedPackageWorkspace,
        query: {
          runId: generatedPackageRun.runId,
          filter: 'all',
          command: 'test',
          selector: 'generated_both_paths',
        },
      }),
    }).stdout,
  );
  assert.equal(generatedPackageQuery.ok, true);
  assert.deepEqual(
    new Set(generatedPackageQuery.data.tests.map(({id}) => id)),
    new Set([
      `rust:libtest:${rustcHost}:package:alpha:lib:alpha:alpha/src/lib.rs::tests::generated_both_paths`,
      `rust:libtest:${rustcHost}:package:beta:lib:beta:beta/src/lib.rs::tests::generated_both_paths`,
    ]),
    'generated package tests lost exact relocatable package identity',
  );
  assert.equal(sourceDigest(), sourceBeforeRun, 'generated package run modified project source');
  assert(
    !existsSync(
      join(generatedPackageWorkspace, '.supercov/work/run_c123456789abcdef'),
    ),
    'generated package run retained terminal transaction state',
  );

  const priorRunDirectory = join(
    generatedPackageWorkspace,
    '.supercov/runs',
    generatedPackageRun.runId,
  );
  const priorRunDigest = () =>
    createHash('sha256')
      .update(readFileSync(join(priorRunDirectory, 'run.json')))
      .update(readFileSync(join(priorRunDirectory, 'evidence.raw.gz')))
      .digest('hex');
  const priorDigest = priorRunDigest();
  const faultCases = [
    {
      fault: 'archive-enospc',
      runId: 'run_d123456789abcdef',
      startedAt: '2026-08-26T00:00:01.000Z',
      error: /injected ENOSPC while writing evidence archive/u,
    },
    {
      fault: 'final-rename',
      runId: 'run_e123456789abcdef',
      startedAt: '2026-08-26T00:00:02.000Z',
      error: /injected final run publication rename failure/u,
    },
  ];
  for (const faultCase of faultCases) {
    const failure = run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      expectFailure: true,
      env: {
        RUSTC: rustc,
        DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
          .filter(Boolean)
          .join(':'),
        LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
          .filter(Boolean)
          .join(':'),
        SUPERCOV_RUSTC_SPIKE_PUBLICATION_FAULT: faultCase.fault,
      },
      input: JSON.stringify({
        root: generatedPackageWorkspace,
        command: [cargo, 'test', '--workspace', '--lib'],
        runId: faultCase.runId,
        startedAt: faultCase.startedAt,
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    });
    assert.match(failure.stderr, faultCase.error);
    assert(
      !existsSync(join(generatedPackageWorkspace, '.supercov/runs', faultCase.runId)),
      `${faultCase.fault} exposed a partial compiler run`,
    );
    assert(
      !existsSync(join(generatedPackageWorkspace, '.supercov/work', faultCase.runId)),
      `${faultCase.fault} retained terminal publication work`,
    );
    assert(
      !existsSync(
        join(
          cargoWorkspace(generatedPackageWorkspace),
          '.supercov/work',
          faultCase.runId,
        ),
      ),
      `${faultCase.fault} retained terminal compiler work`,
    );
    assert.equal(
      priorRunDigest(),
      priorDigest,
      `${faultCase.fault} changed the previously published run`,
    );
    const priorQuery = JSON.parse(
      run(supercov, ['__query-stored-run'], {
        input: JSON.stringify({
          root: generatedPackageWorkspace,
          query: {
            runId: generatedPackageRun.runId,
            filter: 'all',
            command: 'test',
            selector: 'generated_both_paths',
          },
        }),
      }).stdout,
    );
    assert.equal(priorQuery.ok, true);
    assert.equal(priorQuery.data.tests.length, 2);
    assert.equal(
      sourceDigest(),
      sourceBeforeRun,
      `${faultCase.fault} modified project source`,
    );
  }

  const recoveryRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {
        RUSTC: rustc,
        DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
          .filter(Boolean)
          .join(':'),
        LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
          .filter(Boolean)
          .join(':'),
      },
      input: JSON.stringify({
        root: generatedPackageWorkspace,
        command: [cargo, 'test', '--workspace', '--lib'],
        runId: 'run_f123456789abcdef',
        startedAt: '2026-08-26T00:00:03.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(recoveryRun.exitCode, 0);
  assert.equal(recoveryRun.tests, 2);
  assert.equal(recoveryRun.transportHealth.length, 4);
  assert.equal(priorRunDigest(), priorDigest);
  assert.equal(sourceDigest(), sourceBeforeRun);

  const leaderRunId = 'run_a123456789abcdef';
  const contenderRunId = 'run_b123456789abcdef';
  const leader = spawnCommand(supercov, ['__run-rust-compiler'], {
    env: {
      RUSTC: rustc,
      DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
        .filter(Boolean)
        .join(':'),
      LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
        .filter(Boolean)
        .join(':'),
      SUPERCOV_RUSTC_SPIKE_PUBLICATION_FAULT: 'wait-before-publication',
    },
    input: JSON.stringify({
      root: generatedPackageWorkspace,
      command: [cargo, 'test', '--workspace', '--lib'],
      runId: leaderRunId,
      startedAt: '2026-08-26T00:00:04.000Z',
      wrapperPath: supercov,
      companionCandidates: [wrapper],
      requirePublicCapabilities: false,
    }),
  });
  const publicationWork = join(
    generatedPackageWorkspace,
    '.supercov/work',
    leaderRunId,
  );
  const publicationReady = join(publicationWork, 'spike-publication-ready');
  const publicationRelease = join(publicationWork, 'spike-publication-release');
  let reachedPublication = false;
  // This is a lifecycle gate, not a compile-performance gate. Match the
  // enclosing compiler-run allowance so a cold or contended build cannot be
  // mistaken for a publication-lock failure.
  for (let attempt = 0; attempt < 12_000; attempt += 1) {
    if (existsSync(publicationReady)) {
      reachedPublication = true;
      break;
    }
    assert.equal(
      leader.child.exitCode,
      null,
      'the concurrent-run leader exited before reaching publication',
    );
    await delay(25);
  }
  if (!reachedPublication) {
    leader.child.kill('SIGKILL');
    const completed = await leader.result;
    assert.fail(
      `the concurrent-run leader never reached publication (exit=${completed.status ?? completed.signal})${completed.stdout ? `\nstdout:\n${completed.stdout.slice(-4_000)}` : ''}${completed.stderr ? `\nstderr:\n${completed.stderr.slice(-4_000)}` : ''}`,
    );
  }
  const contender = run(supercov, ['__run-rust-compiler'], {
    expectFailure: true,
    env: {RUSTC: rustc},
    input: JSON.stringify({
      root: generatedPackageWorkspace,
      command: [cargo, 'test', '--workspace', '--lib'],
      runId: contenderRunId,
      startedAt: '2026-08-26T00:00:05.000Z',
      wrapperPath: supercov,
      companionCandidates: [wrapper],
      requirePublicCapabilities: false,
    }),
  });
  assert.match(contender.stderr, /coverage run .* is already active/u);
  assert(
    !existsSync(join(generatedPackageWorkspace, '.supercov/work', contenderRunId)),
    'the rejected concurrent compiler run created transaction work',
  );
  assert(
    !existsSync(join(generatedPackageWorkspace, '.supercov/runs', contenderRunId)),
    'the rejected concurrent compiler run became visible',
  );
  assert.equal(priorRunDigest(), priorDigest);
  writeFileSync(publicationRelease, 'release\n', {flag: 'wx'});
  const leaderTimeout = setTimeout(() => leader.child.kill('SIGKILL'), 300_000);
  const leaderResult = await leader.result;
  clearTimeout(leaderTimeout);
  assert.equal(leaderResult.signal, null, leaderResult.stderr);
  assert.equal(leaderResult.status, 0, leaderResult.stderr);
  const publishedLeader = JSON.parse(leaderResult.stdout);
  assert.equal(publishedLeader.runId, leaderRunId);
  assert.equal(publishedLeader.tests, 2);
  assert.equal(publishedLeader.transportHealth.length, 4);
  assert(!existsSync(publicationWork));
  assert.equal(priorRunDigest(), priorDigest);
  assert.equal(sourceDigest(), sourceBeforeRun);

  if (process.platform !== 'win32') {
    const readOnlyOuter = join(scratch, 'read-only-parent');
    const readOnlyProject = join(readOnlyOuter, 'project');
    mkdirSync(join(readOnlyProject, 'src'), {recursive: true});
    writeFileSync(
      join(readOnlyProject, 'Cargo.toml'),
      '[package]\nname="read-only-parent-fixture"\nversion="0.0.0"\nedition="2024"\n',
    );
    writeFileSync(
      join(readOnlyProject, 'src/lib.rs'),
      [
        'pub fn choice(value: bool) -> usize {',
        '    if value { 17 } else { 19 }',
        '}',
        '',
        '#[cfg(test)]',
        'mod tests {',
        '    #[test]',
        '    fn both_paths() {',
        '        assert_eq!(super::choice(false), 19);',
        '        assert_eq!(super::choice(true), 17);',
        '    }',
        '}',
        '',
      ].join('\n'),
    );
    const readOnlySourceDigest = createHash('sha256')
      .update(readFileSync(join(readOnlyProject, 'Cargo.toml')))
      .update(readFileSync(join(readOnlyProject, 'src/lib.rs')))
      .digest('hex');
    chmodSync(readOnlyOuter, 0o555);
    let readOnlyRun;
    try {
      readOnlyRun = JSON.parse(
        run(supercov, ['__run-rust-compiler'], {
          timeout: 300_000,
          env: {
            RUSTC: rustc,
            DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
              .filter(Boolean)
              .join(':'),
            LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
              .filter(Boolean)
              .join(':'),
          },
          input: JSON.stringify({
            root: readOnlyProject,
            command: [cargo, 'test', '--lib'],
            runId: 'run_7123456789abcdef',
            startedAt: '2026-08-26T00:00:06.000Z',
            wrapperPath: supercov,
            companionCandidates: [wrapper],
            requirePublicCapabilities: false,
          }),
        }).stdout,
      );
    } finally {
      chmodSync(readOnlyOuter, 0o755);
    }
    assert.equal(readOnlyRun.exitCode, 0);
    assert.equal(readOnlyRun.tests, 1);
    assert.equal(readOnlyRun.transportHealth.length, 2);
    assert.equal(
      readOnlyRun.transportHealth.find(
        ({scopeKind}) => scopeKind === 'runner-invocation',
      )?.status,
      'passed',
    );
    assert.equal(
      readOnlyRun.transportHealth.find(
        ({scopeKind}) => scopeKind === 'test-attempt',
      )?.status,
      'passed',
    );
    const locatorPath = join(readOnlyProject, '.supercov/cargo-workspace.json');
    const locator = JSON.parse(readFileSync(locatorPath, 'utf8'));
    assert.equal(locator.placement, 'temporary');
    assert.match(locator.rootSha256, /^[0-9a-f]{64}$/u);
    assert.match(locator.token, /^[0-9a-f]{64}$/u);
    const fallbackContainer = join(
      realpathSync(tmpdir()),
      `.supercov-cargo-${locator.rootSha256.slice(0, 24)}-${locator.token.slice(0, 32)}`,
    );
    assert(existsSync(fallbackContainer));
    assert(
      !realpathSync(fallbackContainer).startsWith(`${realpathSync(readOnlyProject)}/`),
      'read-only-parent fallback remained beneath the Cargo ancestor workspace',
    );
    const readOnlyQuery = JSON.parse(
      run(supercov, ['__query-stored-run'], {
        input: JSON.stringify({
          root: readOnlyProject,
          query: {
            runId: readOnlyRun.runId,
            filter: 'all',
            command: 'test',
            selector: 'both_paths',
          },
        }),
      }).stdout,
    );
    assert.equal(readOnlyQuery.ok, true);
    assert.equal(readOnlyQuery.data.tests.length, 1);
    assert.equal(
      createHash('sha256')
        .update(readFileSync(join(readOnlyProject, 'Cargo.toml')))
        .update(readFileSync(join(readOnlyProject, 'src/lib.rs')))
        .digest('hex'),
      readOnlySourceDigest,
    );
    run(supercov, ['runs', 'clean'], {cwd: readOnlyProject});
    assert(!existsSync(fallbackContainer));
    assert(!existsSync(locatorPath));
  }
}

function run(command, args, options = {}) {
  const commandEnvironment = options.env ?? {};
  let inputFile = null;
  let inputDescriptor = null;
  if (options.input !== undefined) {
    inputFile = join(scratch, `.command-input-${commandInputOrdinal++}`);
    writeFileSync(inputFile, options.input, {flag: 'wx', mode: 0o600});
    inputDescriptor = openSync(inputFile, 'r');
  }
  let result;
  try {
    result = spawnSync(command, args, {
      cwd: options.cwd ?? root,
      encoding: 'utf8',
      timeout: options.timeout ?? 120_000,
      killSignal: 'SIGKILL',
      ...(inputDescriptor === null
        ? {}
        : {stdio: [inputDescriptor, 'pipe', 'pipe']}),
      env: {
        ...process.env,
        SUPERCOV_RUST_SOURCE_ROOT: fixtureRoot,
        // Every corpus compile binds strictly: an obligation the binder cannot
        // prove must stay a hard, discoverable failure here. User builds
        // degrade the same obligation to a recorded limitation instead, and
        // the lattice gate below proves that path explicitly.
        SUPERCOV_RUST_STRICT_BINDING: '1',
        ...(commandEnvironment.CARGO_TARGET_DIR
          ? {SUPERCOV_RUST_TARGET_ROOT: commandEnvironment.CARGO_TARGET_DIR}
          : {}),
        ...commandEnvironment,
      },
    });
  } finally {
    if (inputDescriptor !== null) closeSync(inputDescriptor);
    if (inputFile !== null) rmSync(inputFile, {force: true});
  }
  if (result.error) {
    throw new Error(
      `${command} could not complete: ${result.error.message}`,
      {cause: result.error},
    );
  }
  if (result.status === null) {
    const output = [result.stdout, result.stderr]
      .filter((value) => typeof value === 'string' && value.length > 0)
      .join('\n')
      .slice(-8_000);
    throw new Error(
      `${command} terminated without an exit status${result.signal ? ` (${result.signal})` : ''}${
        output.length > 0 ? `\n${output}` : ''
      }`,
    );
  }
  if (options.expectFailure) {
    assert.notEqual(result.status, 0, `${command} unexpectedly succeeded`);
  } else if (result.status !== 0) {
    process.stderr.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    throw new Error(`${command} exited ${result.status}`);
  }
  return result;
}

function spawnCommand(command, args, options = {}) {
  const commandEnvironment = options.env ?? {};
  const child = spawn(command, args, {
    cwd: options.cwd ?? root,
    env: {
      ...process.env,
      SUPERCOV_RUST_SOURCE_ROOT: fixtureRoot,
      ...(commandEnvironment.CARGO_TARGET_DIR
        ? {SUPERCOV_RUST_TARGET_ROOT: commandEnvironment.CARGO_TARGET_DIR}
        : {}),
      ...commandEnvironment,
    },
    stdio: [options.input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
  });
  if (options.input !== undefined) child.stdin.end(options.input);
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });
  const result = new Promise((resolveResult, rejectResult) => {
    child.once('error', rejectResult);
    child.once('close', (status, signal) => {
      resolveResult({status, signal, stdout, stderr});
    });
  });
  return {child, result};
}

async function runAsync(command, args, options = {}) {
  const {result} = spawnCommand(command, args, options);
  const completed = await result;
  if (completed.status !== 0) {
    process.stderr.write(completed.stdout);
    process.stderr.write(completed.stderr);
    throw new Error(`${command} exited ${completed.status ?? completed.signal}`);
  }
  return completed;
}

const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
const nextestOnlyComplete = Symbol('nextest-only-complete');

function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error?.code === 'ESRCH') return false;
    throw error;
  }
}

async function waitForProcessExit(pid, timeoutMs = 5_000) {
  const deadline = Date.now() + timeoutMs;
  while (processExists(pid) && Date.now() < deadline) await delay(25);
  return !processExists(pid);
}

function compilerSources(directory, crate) {
  const snapshots = readdirSync(directory)
    .filter(
      (name) =>
        name.startsWith('sources-') &&
        name.endsWith(`-${crate}.json`),
    )
    .map((name) => JSON.parse(readFileSync(join(directory, name), 'utf8')));
  assert(snapshots.length > 0, `expected compiler source snapshots for ${crate}`);
  for (const snapshot of snapshots) {
    assert.equal(snapshot.schema, 'supercov-rust-source-snapshots-v1');
    assert.equal(snapshot.crate, crate);
    assert.deepEqual(
      snapshot.sources,
      snapshots[0].sources,
      `compiler source snapshots changed across ${crate} compilations`,
    );
  }
  return snapshots[0].sources;
}

function manifests(directory) {
  return readdirSync(directory)
    .filter((name) => name.startsWith('manifest-') && name.endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(join(directory, name), 'utf8')));
}

function crateManifest(directory, crate) {
  const available = manifests(directory);
  const matches = available.filter(
    (manifestRecord) => manifestRecord.crate === crate,
  );
  assert.equal(
    matches.length,
    1,
    `expected one manifest candidate for ${crate}, found ${matches.length}; available: ${available.map(({crate: name}) => name).join(', ')}`,
  );
  return matches[0];
}

function allManifestedHitOrdinals(directory) {
  return new Set(
    manifests(directory).flatMap((manifestRecord) => [
      ...manifestRecord.points.map(({probeOrdinal}) => probeOrdinal),
      ...manifestRecord.branches.flatMap(({alternatives}) =>
        alternatives.map(({probeOrdinal}) => probeOrdinal),
      ),
    ]),
  );
}

function obligationFor(manifestRecord, definition) {
  return manifestRecord.points.find(
    (obligation) =>
      obligation.kind === 'function' &&
      obligation.definitions.includes(definition),
  );
}

// Obligation ranges are Rust BYTE offsets. Slicing a JS string by them silently
// desynchronises after the first multi-byte character: one em dash is three
// bytes and one string index, so a file with four of them shifts every later
// extraction by eight positions. That is not a visible failure — the text comes
// back sliced mid-token, which can make an assertion pass as easily as fail,
// and it produced a confident wrong root cause during the maps-to-zero
// investigation before it was caught. Slice bytes and decode the slice.
const sourceBytes = new Map();
function obligationSource(sources, obligation) {
  const source = sources[obligation.sourceKey];
  assert(source, `missing source snapshot ${obligation.sourceKey}`);
  let bytes = sourceBytes.get(source.source);
  if (!bytes) {
    bytes = Buffer.from(source.source, 'utf8');
    sourceBytes.set(source.source, bytes);
  }
  return bytes.subarray(obligation.start, obligation.end).toString('utf8');
}

function decisionFor(manifestRecord, definition) {
  return manifestRecord.decisions.find((decision) =>
    decision.definitions.includes(definition),
  );
}

function decisionForConditions(manifestRecord, definition, sources) {
  const matches = manifestRecord.decisions.filter(
    (decision) =>
      decision.definitions.includes(definition) &&
      JSON.stringify(decision.conditions.map(({source}) => source)) ===
        JSON.stringify(sources),
  );
  assert.equal(
    matches.length,
    1,
    `expected one ${definition} decision with conditions ${JSON.stringify(sources)}; found ${JSON.stringify(
      manifestRecord.decisions
        .filter((decision) => decision.definitions.includes(definition))
        .map((decision) => decision.conditions.map(({source}) => source)),
    )}`,
  );
  return matches[0];
}

function branchFor(manifestRecord, definition, kind) {
  const matches = branchesFor(manifestRecord, definition, kind);
  assert.equal(matches.length, 1, `expected one ${definition} ${kind} branch`);
  return matches[0];
}

function branchesFor(manifestRecord, definition, kind) {
  return manifestRecord.branches.filter(
    (branch) => branch.kind === kind && branch.definitions.includes(definition),
  ).sort((left, right) => left.start - right.start || left.end - right.end);
}

function matchGroupsFor(manifestRecord, definition) {
  return manifestRecord.selectionGroups
    .filter(
      (group) =>
        group.kind === 'match' && group.definitions.includes(definition),
    )
    .sort((left, right) => left.start - right.start || left.end - right.end);
}

function loopAlternativeOrdinals(branch) {
  const zero = branch.alternatives.find(
    ({label}) => label === 'zero iterations',
  )?.probeOrdinal;
  const entered = branch.alternatives.find(
    ({label}) => label === 'entered',
  )?.probeOrdinal;
  assert(zero && entered, `incomplete loop alternatives for ${branch.id}`);
  return {zero, entered};
}

function records(directory) {
  return readdirSync(directory)
    .filter((name) => name.endsWith('.jsonl'))
    .flatMap((name) =>
      readFileSync(join(directory, name), 'utf8')
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line)),
    );
}

function recordFiles(directory) {
  return readdirSync(directory)
    .filter((name) => name.endsWith('.jsonl'))
    .map((name) => ({
      name,
      records: readFileSync(join(directory, name), 'utf8')
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line)),
    }));
}

function ctfeBundles(directory) {
  return readdirSync(directory)
    .filter((name) => name.startsWith('ctfe-unit-') && name.endsWith('.json'))
    .map((name) => ({
      name,
      value: JSON.parse(readFileSync(join(directory, name), 'utf8')),
    }));
}

function normalizeTestOutput(output) {
  return output.replace(/\d+(?:\.\d+)?s/g, '<time>');
}

function passedTests(output) {
  return [...output.matchAll(/(\d+) passed/g)].reduce(
    (total, match) => total + Number(match[1]),
    0,
  );
}

function testContextId(testName) {
  let value = 0xcbf29ce484222325n;
  for (const byte of Buffer.from(`supercov-rust-test-v1\0${testName}`)) {
    value ^= BigInt(byte);
    value = BigInt.asUintN(64, value * 0x100000001b3n);
  }
  if (value === 0n || value === 0xffffffffffffffffn) {
    value ^= 0xa5a5a5a5a5a5a5a5n;
  }
  return value.toString();
}

function assertionPhaseContextId(parent, decisionId, nonce) {
  const digest = decisionId.replace(/^rs:decision:/, '');
  assert.match(digest, /^[0-9a-f]{24}$/);
  const bytes = Buffer.alloc(
    Buffer.byteLength('supercov-rust-assertion-phase-v2') + 8 + 8 + 4 + 8,
  );
  let offset = bytes.write('supercov-rust-assertion-phase-v2');
  bytes.writeBigUInt64LE(BigInt(parent), offset);
  offset += 8;
  bytes.writeBigUInt64LE(BigInt(`0x${digest.slice(0, 16)}`), offset);
  offset += 8;
  bytes.writeUInt32LE(Number.parseInt(digest.slice(16), 16), offset);
  offset += 4;
  bytes.writeBigUInt64LE(BigInt(nonce), offset);
  let value = 0xcbf29ce484222325n;
  for (const byte of bytes) {
    value ^= BigInt(byte);
    value = BigInt.asUintN(64, value * 0x100000001b3n);
  }
  if (value === 0n || value === 0xffffffffffffffffn) {
    value ^= 0xa5a55a5ad3c3b4b4n;
  }
  return value.toString();
}

function threadPhaseContextId(parent, nonce) {
  const bytes = Buffer.alloc(
    Buffer.byteLength('supercov-rust-thread-phase-v1\0') + 8 + 8,
  );
  let offset = bytes.write('supercov-rust-thread-phase-v1\0', 'binary');
  bytes.writeBigUInt64LE(BigInt(parent), offset);
  offset += 8;
  bytes.writeBigUInt64LE(BigInt(nonce), offset);
  let value = 0xcbf29ce484222325n;
  for (const byte of bytes) {
    value ^= BigInt(byte);
    value = BigInt.asUintN(64, value * 0x100000001b3n);
  }
  if (value === 0n || value === 0xffffffffffffffffn) {
    value ^= 0xa5a55a5ad3c3b4b4n;
  }
  return value.toString();
}

function validatePhaseContexts(evidence, baseContexts) {
  const definitions = new Map();
  for (const phase of evidence.phases) {
    assert.equal(
      phase.child,
      assertionPhaseContextId(phase.parent, phase.decisionId, phase.nonce),
      'runtime phase definition failed deterministic authentication',
    );
    const serialized = `${phase.parent}:${phase.nonce}:${phase.decisionId}`;
    assert(
      !definitions.has(phase.child) || definitions.get(phase.child) === serialized,
      `phase context collision for ${phase.child}`,
    );
    definitions.set(phase.child, serialized);
  }
  for (const phase of evidence.threadPhases ?? []) {
    assert.equal(
      phase.child,
      threadPhaseContextId(phase.parent, phase.nonce),
      'runtime thread-phase definition failed deterministic authentication',
    );
    const serialized = `${phase.parent}:${phase.nonce}:thread`;
    assert(
      !definitions.has(phase.child) || definitions.get(phase.child) === serialized,
      `phase context collision for ${phase.child}`,
    );
    definitions.set(phase.child, serialized);
  }
  const roots = new Set([...baseContexts].map(String));
  for (const start of [
    ...evidence.decisions.map(({context}) => context),
    ...evidence.ordinals.map(({context}) => context),
    ...(evidence.threadEnds ?? []).map(({context}) => context),
  ]) {
    if (start === '0' || roots.has(start)) continue;
    const path = new Set();
    let context = start;
    while (!roots.has(context)) {
      assert(!path.has(context), `phase context cycle at ${context}`);
      path.add(context);
      const definition = definitions.get(context);
      assert(definition, `phase context ${context} has no authenticated parent`);
      context = definition.slice(0, definition.indexOf(':'));
      assert.notEqual(context, '0', 'phase context crossed into background');
    }
  }
}

function assertionPhaseContexts(evidence, parent, decisionId) {
  return evidence.phases
    .filter(
      (phase) =>
        phase.parent === String(parent) && phase.decisionId === decisionId,
    )
    .map(({child}) => child);
}

function assertionPhaseContext(evidence, parent, decisionId) {
  const contexts = assertionPhaseContexts(evidence, parent, decisionId);
  assert.equal(
    contexts.length,
    1,
    `expected one dynamic phase for ${decisionId} under ${parent}`,
  );
  return contexts[0];
}

function threadPhaseContext(evidence, parent) {
  const contexts = (evidence.threadPhases ?? [])
    .filter((phase) => phase.parent === String(parent))
    .map(({child}) => child);
  assert.equal(
    contexts.length,
    1,
    `expected one thread phase under ${parent}`,
  );
  return contexts[0];
}

function buildSharedRuntime() {
  const directory = join(scratch, 'shared-rust-runtime');
  const source = join(directory, 'runtime.rs');
  const archive = join(directory, 'libsupercov_runtime.a');
  mkdirSync(directory);
  const runtimeModule = readFileSync(
    join(root, 'crates/supercov-engine/runtime-assets/rust-mmap-runtime.rs'),
    'utf8',
  ).replace('__SUPERCOV_MODULE__', '__supercov_shared_runtime');
  const runtimeExports = `
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_ordinal_hit(ordinal: u64) { __supercov_shared_runtime::ordinal_hit(ordinal) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_active_context() -> u64 { __supercov_shared_runtime::active_context() }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_enter_context(context_id: u64) -> u64 { __supercov_shared_runtime::enter_context(context_id) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_exit_context(previous: u64) { __supercov_shared_runtime::exit_context(previous) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_exit_test_context(context_id: u64, previous: u64) { __supercov_shared_runtime::exit_test_context(context_id, previous) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_enter_assertion_context(id_high: u64, id_low: u32) -> u64 { __supercov_shared_runtime::enter_assertion_context(id_high, id_low) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_decision_start(id_high: u64, id_low: u32, conditions: u64) -> u64 { __supercov_shared_runtime::mir_decision_start(id_high, id_low, conditions) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_decision_condition(token: u64, index: u64, value: bool) { __supercov_shared_runtime::mir_decision_condition(token, index, value) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_decision_finish(token: u64, outcome: bool) { __supercov_shared_runtime::mir_decision_finish(token, outcome) }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_branch_start() -> u64 { __supercov_shared_runtime::mir_branch_start() }
#[unsafe(no_mangle)] pub extern "C" fn __supercov_rt_branch_hit(token: u64, ordinal: u64) { __supercov_shared_runtime::mir_branch_hit(token, ordinal) }
`;
  writeFileSync(source, `${runtimeModule}\n${runtimeExports}`);
  run('rustc', [
    '--edition=2024',
    '--crate-name=supercov_runtime',
    '--crate-type=staticlib',
    '-o',
    archive,
    source,
  ]);
  return directory;
}

try {
  run('cargo', ['build', '--manifest-path', manifest], {
    env: {RUSTC_BOOTSTRAP: '1'},
  });
  run('cargo', ['build', '-p', 'supercov']);
  const bundleRustc = run('rustup', ['which', 'rustc']).stdout.trim();
  const bundleSysroot = run(bundleRustc, ['--print', 'sysroot']).stdout.trim();
  const bundleWork = join(scratch, 'libtest-companion-build');
  mkdirSync(bundleWork);
  const libtestBundle = JSON.parse(
    run(supercov, [
      '__build-rust-libtest-companion',
      join(bundleSysroot, 'lib/rustlib/src/rust/library/test'),
      bundleWork,
      bundleRustc,
      wrapper,
    ]).stdout,
  );
  assert.equal(libtestBundle.schemaVersion, 3);
  assert.equal(libtestBundle.eventProtocolVersion, 1);
  assert.equal(
    libtestBundle.compilerCompanionBuildId,
    createHash('sha256').update(readFileSync(wrapper)).digest('hex'),
  );
  assert.match(
    libtestBundle.artifactFile,
    /^libtest-supercov-v[0-9]+-[0-9a-f-]+\.rlib$/u,
  );
  assert.match(libtestBundle.artifactSha256, /^[0-9a-f]{64}$/u);
  const sharedRuntimeDirectory = buildSharedRuntime();

  // Generic functions, trait defaults and async state machines are serialized
  // into the library and instantiated by this downstream binary. Keep this
  // focused gate before the large lifecycle matrix: a probe that references a
  // non-serializable compiler-injected Rust wrapper fails here immediately.
  const genericAsyncBaseline = run(
    'cargo',
    ['run', '--quiet', '--manifest-path', fixture, '--bin', 'behavior'],
    {env: {CARGO_TARGET_DIR: join(scratch, 'generic-async-baseline-target')}},
  );
  const genericAsyncTransport = createTransport('generic-async-smoke');
  const genericAsyncInstrumented = run(
    'cargo',
    ['run', '--quiet', '--manifest-path', fixture, '--bin', 'behavior'],
    {
      env: {
        CARGO_TARGET_DIR: join(scratch, 'generic-async-instrumented-target'),
        RUSTC_WRAPPER: wrapper,
        SUPERCOV_RUST_COMPILER_OUTPUT: join(scratch, 'generic-async-output'),
        SUPERCOV_RUST_INSTRUMENT_MIR: '1',
        SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
        SUPERCOV_RUST_TRANSPORT_FILE: genericAsyncTransport.path,
        SUPERCOV_RUST_TRANSPORT_TOKEN: genericAsyncTransport.tokenHex,
        SUPERCOV_RUST_CONTEXT_ID: transportContext.toString(16).padStart(16, '0'),
      },
    },
  );
  assert.equal(genericAsyncInstrumented.stdout, genericAsyncBaseline.stdout);
  assert.equal(genericAsyncInstrumented.stderr, genericAsyncBaseline.stderr);
  assert.match(
    genericAsyncBaseline.stdout,
    /generic-trait=\[233, 239, 211, 223, 211, 223, 229, 227\]/,
  );
  assert.match(genericAsyncBaseline.stdout, /async=\[251, 241\]/);
  assert.match(
    genericAsyncBaseline.stdout,
    /advanced-generic-async=\[277, 281, 281, 257, 263, 263, 271, 269, 293, 283, 16, 12\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /async-drop=\["async-drop", "async-drop"\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /nested-generic=\[false, true, true, false\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /logical-value=\[false, true, true, false\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /advanced-types=\[307, 311, 311, 313, 317, 317, 331, 337, 337, 347, 349, 349\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /nested-expansions=\[353, 359, 359, 181, 191\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /no-std=\[409, 409, 401, 0, 1, 1, 419, 421\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /opaque-macro-compound=\[439, 439, 433\]/,
  );
  assert.match(
    genericAsyncBaseline.stdout,
    /opaque-macro-nested=\[449, 449, 443, 443, 449, 449, 443\]/,
  );
  assert.match(genericAsyncBaseline.stdout, /opaque-macro-guard=\[461, 461, 457\]/);
  assert.match(
    genericAsyncBaseline.stdout,
    /ctfe-logical-value=\[false, true, true, false\]/,
  );
  const genericAsyncManifest = crateManifest(
    join(scratch, 'generic-async-output'),
    'supercov_rustc_spike_fixture',
  );
  const noStdManifest = crateManifest(
    join(scratch, 'generic-async-output'),
    'no_std_fixture',
  );
  const genericAsyncEvidence = readTransport(genericAsyncTransport);
  const genericAsyncOrdinals = new Set(
    genericAsyncEvidence.ordinals.map(({ordinal}) => ordinal),
  );
  const functionPoints = (definition) =>
    genericAsyncManifest.points.filter(
      ({kind, definitions}) =>
        kind === 'function' && definitions.includes(definition),
    );
  assert.equal(
    functionPoints('generic_choice').length,
    1,
    'generic monomorphizations created duplicate source function obligations',
  );
  assert.equal(
    functionPoints('RuntimeChoice::default_choice').length,
    1,
    'trait default dispatch created duplicate source function obligations',
  );
  assert.equal(
    functionPoints('async_choice').length,
    0,
    'constructing an async future incorrectly created a function-entry obligation',
  );
  assert.equal(
    functionPoints('async_choice::{closure#0}').length,
    1,
    'an async function must contribute exactly one first-poll body obligation',
  );
  for (const constructor of [
    'async_trait_choice',
    'AsyncRuntimeChoice::async_default_choice',
    '<OverrideChoice as AsyncRuntimeChoice>::async_default_choice',
    'async_closure_choice',
    'async_closure_choice::{closure#0}::{closure#0}',
    'suspended_borrow_choice',
  ]) {
    assert.equal(
      functionPoints(constructor).length,
      0,
      `${constructor} incorrectly created an async future-constructor obligation`,
    );
  }
  for (const definition of [
    'generic_choice',
    'RuntimeChoice::default_choice',
    '<OverrideChoice as RuntimeChoice>::default_choice',
    'async_choice::{closure#0}',
    'AsyncRuntimeChoice::async_default_choice::{closure#0}',
    '<OverrideChoice as AsyncRuntimeChoice>::async_default_choice::{closure#0}',
    'async_trait_choice::{closure#0}',
    'EnabledChoice::associated_generic_choice',
    'nested_generic_choice',
    'logical_value_choice',
    'AssociatedRuntimeChoice::associated_default',
    '<EnabledChoice as AssociatedRuntimeChoice>::associated_enabled',
    '<DisabledChoice as AssociatedRuntimeChoice>::associated_enabled',
    'GatRuntimeChoice::gat_default',
    '<EnabledChoice as GatRuntimeChoice>::borrow_choice',
    '<DisabledChoice as GatRuntimeChoice>::borrow_choice',
    'OpaqueRuntimeChoice::opaque_values',
    'opaque_choice',
    'opaque_macro_compound',
    'opaque_macro_guard',
    'opaque_macro_nested',
    'hrtb_choice',
    'DerivedChoice::derived_choice',
    'attributed_choice',
    'generated_nested_external_by_proc',
    'async_closure_choice::{closure#0}',
    'async_closure_choice::{closure#0}::{closure#0}::{closure#0}',
    'suspended_borrow_choice::{closure#0}',
    "<AsyncDrop<'_> as std::ops::Drop>::drop",
  ]) {
    const [point] = functionPoints(definition);
    assert(
      point && genericAsyncOrdinals.has(point.probeOrdinal),
      `${definition} did not publish its exact function-entry ordinal`,
    );
  }
  const pointsForDefinition = (definition) =>
    genericAsyncManifest.points.filter(({definitions}) =>
      definitions.includes(definition),
    );
  const observedDerivedPoints = pointsForDefinition(
    'DerivedChoice::derived_choice',
  );
  assert(
    observedDerivedPoints.length >= 4,
    'the executed derive expansion did not retain its complete point denominator',
  );
  assert(
    observedDerivedPoints.every(({probeOrdinal}) =>
      genericAsyncOrdinals.has(probeOrdinal),
    ),
    'the executed derive expansion lost one of its exact point observations',
  );
  const unusedDerivedPoints = pointsForDefinition(
    'UnusedDerivedChoice::derived_choice',
  );
  assert(
    unusedDerivedPoints.length >= 4,
    'the uncalled derive expansion disappeared from the point denominator',
  );
  assert(
    unusedDerivedPoints.every(({probeOrdinal}) =>
      !genericAsyncOrdinals.has(probeOrdinal),
    ),
    'the executed derive expansion contaminated an identical uncalled expansion',
  );
  assert(
    genericAsyncEvidence.decisions.every(
      ({id}) =>
        id !==
        decisionFor(
          genericAsyncManifest,
          'UnusedDerivedChoice::derived_choice',
        )?.id,
    ),
    'the uncalled derive decision received fabricated runtime evidence',
  );
  const smokeDecisionVectors = (definition) => {
    const decision = decisionFor(genericAsyncManifest, definition);
    assert(decision, `missing ${definition} decision`);
    return genericAsyncEvidence.decisions
      .filter(({id}) => id === decision.id)
      .map(({values, outcome}) => JSON.stringify({values, outcome}))
      .sort();
  };
  const smokeDecisionVectorsIn = (manifest, definition) => {
    const decision = decisionFor(manifest, definition);
    assert(decision, `missing ${definition} decision`);
    return genericAsyncEvidence.decisions
      .filter(({id}) => id === decision.id)
      .map(({values, outcome}) => JSON.stringify({values, outcome}))
      .sort();
  };
  const bothBooleanVectors = [
    JSON.stringify({values: [false], outcome: false}),
    JSON.stringify({values: [true], outcome: true}),
  ].sort();
  {
    const definition = 'opaque_macro_compound';
    const decision = decisionFor(genericAsyncManifest, definition);
    assert(decision, 'an authored opaque macro nested in a decision was dropped');
    assert.deepEqual(
      decision.conditions.map(({source}) => source),
      ['matches!(value, Some(1 | 2))', 'enabled'],
      'macro implementation control leaked into the authored denominator',
    );
    assert.deepEqual(
      smokeDecisionVectors(definition),
      [
        JSON.stringify({values: [false, null], outcome: false}),
        JSON.stringify({values: [true, false], outcome: false}),
        JSON.stringify({values: [true, true], outcome: true}),
      ].sort(),
    );
    const logicalBranch = branchFor(
      genericAsyncManifest,
      definition,
      'logical-selection',
    );
    assert.deepEqual(decision.logicalSelections, [
      {branchId: logicalBranch.id, rightConditionIndex: 1},
    ]);
  }
  {
    const definition = 'opaque_macro_nested';
    const decision = decisionFor(genericAsyncManifest, definition);
    assert(decision, 'nested authored opaque macro conditions were dropped');
    assert.deepEqual(
      decision.conditions.map(({source}) => source),
      [
        'first',
        'matches!(first_value, Some(1 | 2))',
        'matches!(second_value, Some(3 | 5))',
        'fallback',
      ],
      'nested macro implementation control leaked into the authored denominator',
    );
    assert.deepEqual(
      smokeDecisionVectors(definition),
      [
        JSON.stringify({values: [false, null, false, null], outcome: false}),
        JSON.stringify({values: [false, null, true, false], outcome: false}),
        JSON.stringify({values: [false, null, true, true], outcome: true}),
        JSON.stringify({values: [true, false, false, null], outcome: false}),
        JSON.stringify({values: [true, false, true, false], outcome: false}),
        JSON.stringify({values: [true, false, true, true], outcome: true}),
        JSON.stringify({values: [true, true, null, null], outcome: true}),
      ].sort(),
    );
    const logicalBranches = branchesFor(
      genericAsyncManifest,
      definition,
      'logical-selection',
    );
    assert.equal(logicalBranches.length, 3);
    assert.deepEqual(
      decision.logicalSelections.map(({rightConditionIndex}) => rightConditionIndex),
      [1, 2, 3],
    );
    assert(
      logicalBranches.every((branch) =>
        branch.alternatives.every(
          ({probeOrdinal}) => !genericAsyncOrdinals.has(probeOrdinal),
        ),
      ),
      'nested opaque logical selections emitted redundant branch probes',
    );
  }
  {
    const definition = 'opaque_macro_guard';
    const decision = decisionFor(genericAsyncManifest, definition);
    assert(decision, 'an authored opaque macro inside a match guard was dropped');
    assert.equal(decision.kind, 'match-guard');
    assert.deepEqual(decision.conditions.map(({source}) => source), [
      'matches!(candidate, Some(1 | 2))',
      'enabled',
    ]);
    assert.deepEqual(
      smokeDecisionVectors(definition),
      [
        JSON.stringify({values: [false, null], outcome: false}),
        JSON.stringify({values: [true, false], outcome: false}),
        JSON.stringify({values: [true, true], outcome: true}),
      ].sort(),
    );
    const logicalBranch = branchFor(
      genericAsyncManifest,
      definition,
      'logical-selection',
    );
    assert.deepEqual(decision.logicalSelections, [
      {branchId: logicalBranch.id, rightConditionIndex: 1},
    ]);
  }
  assert.deepEqual(smokeDecisionVectors('generic_choice'), bothBooleanVectors);
  assert.deepEqual(
    smokeDecisionVectors('RuntimeChoice::default_choice'),
    [...bothBooleanVectors, ...bothBooleanVectors].sort(),
  );
  assert.deepEqual(
    smokeDecisionVectors('<OverrideChoice as RuntimeChoice>::default_choice'),
    bothBooleanVectors,
  );
  assert.deepEqual(
    smokeDecisionVectors('async_choice::{closure#0}'),
    bothBooleanVectors,
  );
  assert.deepEqual(
    smokeDecisionVectors('EnabledChoice::associated_generic_choice'),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    smokeDecisionVectors('AsyncRuntimeChoice::async_default_choice::{closure#0}'),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    smokeDecisionVectors('nested_generic_choice'),
    [
      JSON.stringify({values: [false, null, false], outcome: false}),
      JSON.stringify({values: [false, null, true], outcome: true}),
      JSON.stringify({values: [true, false, false], outcome: false}),
      JSON.stringify({values: [true, true, null], outcome: true}),
    ].sort(),
  );
  for (const definition of [
    'AssociatedRuntimeChoice::associated_default',
    'GatRuntimeChoice::gat_default',
    'OpaqueRuntimeChoice::opaque_values',
    'hrtb_choice',
    'attributed_choice',
  ]) {
    assert.deepEqual(
      smokeDecisionVectors(definition),
      [
        JSON.stringify({values: [false, null], outcome: false}),
        JSON.stringify({values: [true, false], outcome: false}),
        JSON.stringify({values: [true, true], outcome: true}),
      ].sort(),
      `${definition} did not preserve its exact short-circuit vectors`,
    );
  }
  // One set, not two. The external macro's obligation used to aggregate the
  // observations of every expansion, so this definition carried a duplicate of
  // each vector -- one from its own call site and one from the other. Per
  // expanding definition it reports only what it actually observed.
  assert.deepEqual(
    smokeDecisionVectors('generated_nested_external_by_proc'),
    [...bothBooleanVectors].sort(),
  );
  for (const definition of [
    'no_std_choice',
    'no_std_logical_value',
    'no_std_match',
  ]) {
    const points = noStdManifest.points.filter(
      ({kind, definitions}) =>
        kind === 'function' && definitions.includes(definition),
    );
    assert.equal(points.length, 1, `${definition} has no exact no_std entry`);
    assert(
      genericAsyncOrdinals.has(points[0].probeOrdinal),
      `${definition} did not publish its no_std function-entry ordinal`,
    );
  }
  assert.deepEqual(
    smokeDecisionVectorsIn(noStdManifest, 'no_std_choice'),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  {
    const definition = 'no_std_choice';
    const decision = decisionFor(noStdManifest, definition);
    const logicalBranch = branchFor(
      noStdManifest,
      definition,
      'logical-selection',
    );
    assert.deepEqual(decision.logicalSelections, [
      {branchId: logicalBranch.id, rightConditionIndex: 1},
    ]);
  }
  {
    const logicalBranch = branchFor(
      noStdManifest,
      'no_std_logical_value',
      'logical-selection',
    );
    assert.equal(decisionFor(noStdManifest, 'no_std_logical_value'), undefined);
    assert(
      logicalBranch.alternatives.every(({probeOrdinal}) =>
        genericAsyncOrdinals.has(probeOrdinal),
      ),
      'no_std logical value selection did not emit both alternatives',
    );
  }
  {
    const matchBranches = branchesFor(noStdManifest, 'no_std_match', 'match-arm');
    assert.equal(matchBranches.length, 2);
    assert(
      matchBranches.every((branch) =>
        branch.alternatives
          .filter(({label}) => label === 'selected')
          .every(({probeOrdinal}) => genericAsyncOrdinals.has(probeOrdinal)),
      ),
      'no_std match did not emit both selected-arm observations',
    );
  }
  {
    const llvmProfdata = llvmTool('llvm-profdata');
    const llvmCov = llvmTool('llvm-cov');
    const oracleDirectory = join(scratch, 'llvm-condition-oracle');
    const oracleProfiles = join(oracleDirectory, 'profiles');
    const oracleTarget = join(oracleDirectory, 'target');
    mkdirSync(oracleProfiles, {recursive: true});
    const oracleRun = run(
      'cargo',
      ['run', '--quiet', '--manifest-path', fixture, '--bin', 'behavior'],
      {
        env: {
          CARGO_TARGET_DIR: oracleTarget,
          LLVM_PROFILE_FILE: join(oracleProfiles, '%p-%m.profraw'),
          RUSTC_BOOTSTRAP: '1',
          RUSTFLAGS: '-Cinstrument-coverage -Zcoverage-options=condition',
        },
      },
    );
    assert.equal(oracleRun.stdout, genericAsyncBaseline.stdout);
    assert.equal(oracleRun.stderr, genericAsyncBaseline.stderr);
    const rawProfiles = readdirSync(oracleProfiles)
      .filter((name) => name.endsWith('.profraw'))
      .map((name) => join(oracleProfiles, name))
      .sort();
    assert(rawProfiles.length > 0, 'rustc/LLVM oracle emitted no raw profiles');
    const mergedProfile = join(oracleDirectory, 'merged.profdata');
    run(llvmProfdata, ['merge', '-sparse', ...rawProfiles, '-o', mergedProfile]);
    const oracleExport = JSON.parse(
      run(llvmCov, [
        'export',
        '--format=text',
        `--instr-profile=${mergedProfile}`,
        join(oracleTarget, 'debug/behavior'),
      ]).stdout,
    );
    assert.equal(oracleExport.type, 'llvm.coverage.json.export');
    const noStdOracle = oracleExport.data
      .flatMap(({files}) => files)
      .find(({filename}) => realpathSync(filename) === realpathSync(noStdFixtureSourcePath));
    assert(noStdOracle, 'LLVM oracle omitted the no_std fixture');
    const oracleCounts = (location) => {
      const matches = noStdOracle.branches.filter(
        ([line, start, endLine, end]) =>
          line === location.line &&
          start === location.start &&
          endLine === location.line &&
          end === location.end,
      );
      assert.equal(matches.length, 1, `LLVM oracle location is ambiguous: ${JSON.stringify(location)}`);
      return {truthy: matches[0][4], falsy: matches[0][5]};
    };
    const choiceFirst = oracleCounts(
      sourceTokenLocation(noStdFixtureSource, 'if first && second', 'first'),
    );
    const choiceSecond = oracleCounts(
      sourceTokenLocation(noStdFixtureSource, 'if first && second', 'second'),
    );
    assert.deepEqual(choiceFirst, {truthy: 2, falsy: 1});
    assert.deepEqual(choiceSecond, {truthy: 1, falsy: 1});
    const noStdDecision = decisionFor(noStdManifest, 'no_std_choice');
    const ownedConditionCounts = noStdDecision.conditions.map((_, index) => {
      let truthy = 0;
      let falsy = 0;
      for (const observation of genericAsyncEvidence.decisions.filter(
        ({id}) => id === noStdDecision.id,
      )) {
        if (observation.values[index] === true) truthy += 1;
        if (observation.values[index] === false) falsy += 1;
      }
      return {truthy, falsy};
    });
    assert.deepEqual(ownedConditionCounts, [choiceFirst, choiceSecond]);

    const logicalFirst = oracleCounts(
      sourceTokenLocation(noStdFixtureSource, 'first || second', 'first'),
    );
    assert.deepEqual(logicalFirst, {truthy: 1, falsy: 2});
    const logicalBranch = branchFor(
      noStdManifest,
      'no_std_logical_value',
      'logical-selection',
    );
    const ordinalCount = (label) => {
      const ordinal = logicalBranch.alternatives.find(
        (alternative) => alternative.label === label,
      ).probeOrdinal;
      return genericAsyncEvidence.ordinals.filter(
        (observation) => observation.ordinal === ordinal,
      ).length;
    };
    assert.equal(ordinalCount('short-circuited'), logicalFirst.truthy);
    assert.equal(ordinalCount('right operand evaluated'), logicalFirst.falsy);
  }
  {
    const propertyRoot = join(scratch, 'generated-boolean-corpus');
    const propertySourceDirectory = join(propertyRoot, 'src');
    const propertySourcePath = join(propertySourceDirectory, 'main.rs');
    const propertySource = generatedBooleanCorpus(48);
    const propertyToolchain = {RUSTUP_TOOLCHAIN: '1.95.0'};
    mkdirSync(propertySourceDirectory, {recursive: true});
    writeFileSync(
      join(propertyRoot, 'Cargo.toml'),
      '[package]\nname = "supercov-rust-property-fixture"\nversion = "0.0.0"\nedition = "2024"\npublish = false\n',
      {flag: 'wx'},
    );
    writeFileSync(propertySourcePath, propertySource, {flag: 'wx'});
    const canonicalPropertyRoot = realpathSync(propertyRoot);
    const propertyBaseline = run('cargo', ['run', '--quiet'], {
      cwd: canonicalPropertyRoot,
      env: {
        ...propertyToolchain,
        CARGO_TARGET_DIR: join(scratch, 'property-baseline-target'),
      },
    });
    const propertyTransport = createTransport('property-corpus');
    const propertyOutput = join(scratch, 'property-output');
    const propertyInstrumented = run('cargo', ['run', '--quiet'], {
      cwd: canonicalPropertyRoot,
      env: {
        ...propertyToolchain,
        CARGO_TARGET_DIR: join(scratch, 'property-instrumented-target'),
        RUSTC_WRAPPER: wrapper,
        SUPERCOV_RUST_COMPILER_OUTPUT: propertyOutput,
        SUPERCOV_RUST_INSTRUMENT_MIR: '1',
        SUPERCOV_RUST_SOURCE_ROOT: canonicalPropertyRoot,
        SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
        SUPERCOV_RUST_TRANSPORT_FILE: propertyTransport.path,
        SUPERCOV_RUST_TRANSPORT_TOKEN: propertyTransport.tokenHex,
        SUPERCOV_RUST_CONTEXT_ID: transportContext.toString(16).padStart(16, '0'),
      },
    });
    assert.equal(propertyInstrumented.stdout, propertyBaseline.stdout);
    assert.equal(propertyInstrumented.stderr, propertyBaseline.stderr);
    assert.match(propertyBaseline.stdout, /^generated-boolean=\d+\n$/);
    const propertyManifest = crateManifest(
      propertyOutput,
      'supercov_rust_property_fixture',
    );
    const propertyEvidence = readTransport(propertyTransport);
    const propertyDecisions = propertyManifest.decisions.filter(({definitions}) =>
      definitions.some((definition) => /^case_\d+$/.test(definition)),
    );
    assert.equal(propertyDecisions.length, 48);
    assert(
      propertyDecisions.every(
        (decision) =>
          propertyEvidence.decisions.filter(({id}) => id === decision.id).length === 8,
      ),
      'generated Boolean cases did not publish one exact vector per input tuple',
    );
    const observedOrdinals = new Set(
      propertyEvidence.ordinals.map(({ordinal}) => ordinal),
    );
    const exactVectors = (decision) =>
      propertyEvidence.decisions
        .filter(({id}) => id === decision.id)
        .map(({values, outcome}) => JSON.stringify({values, outcome}))
        .sort();
    for (let index = 0; index < 16; index += 1) {
      const patternDefinition = `pattern_case_${index}`;
      const patternDecision = decisionFor(propertyManifest, patternDefinition);
      assert(patternDecision, `${patternDefinition} has no exact decision`);
      assert.equal(patternDecision.kind, 'let-chain');
      assert.deepEqual(exactVectors(patternDecision), [
        JSON.stringify({values: [false, null, null], outcome: false}),
        JSON.stringify({values: [true, false, null], outcome: false}),
        JSON.stringify({values: [true, true, false], outcome: false}),
        JSON.stringify({values: [true, true, true], outcome: true}),
      ].sort());
      assert.equal(
        branchesFor(propertyManifest, patternDefinition, 'logical-selection').length,
        2,
      );

      const guardDefinition = `guard_case_${index}`;
      const guardDecision = decisionFor(propertyManifest, guardDefinition);
      assert(guardDecision, `${guardDefinition} has no exact decision`);
      assert.equal(guardDecision.kind, 'match-guard');
      assert.deepEqual(exactVectors(guardDecision), [
        JSON.stringify({values: [false, null], outcome: false}),
        JSON.stringify({values: [true, false], outcome: false}),
        JSON.stringify({values: [true, true], outcome: true}),
      ].sort());
      const guardArms = branchesFor(propertyManifest, guardDefinition, 'match-arm');
      assert.equal(guardArms.length, 3);
      assert(
        guardArms.every((branch) =>
          observedOrdinals.has(
            branch.alternatives.find(({label}) => label === 'selected').probeOrdinal,
          ),
        ),
        `${guardDefinition} did not select every match arm`,
      );

      const errorDefinition = `error_case_${index}`;
      assert.equal(decisionFor(propertyManifest, errorDefinition), undefined);
      for (const kind of ['try-operator', 'let-else']) {
        const branch = branchFor(propertyManifest, errorDefinition, kind);
        assert(
          branch.alternatives.every(({probeOrdinal}) =>
            observedOrdinals.has(probeOrdinal),
          ),
          `${errorDefinition} did not observe every ${kind} alternative`,
        );
      }

      const ownershipDefinition = `ownership_case_${index}::{closure#0}`;
      const ownershipDecision = decisionFor(propertyManifest, ownershipDefinition);
      assert(ownershipDecision, `${ownershipDefinition} has no exact decision`);
      assert.deepEqual(exactVectors(ownershipDecision), [
        JSON.stringify({values: [false], outcome: false}),
        JSON.stringify({values: [true], outcome: true}),
      ].sort());
    }
    const propertyPointSource = (point) =>
      Buffer.from(propertySource)
        .subarray(point.start, point.end)
        .toString('utf8')
        .trim();
    const pointsFor = (definition) =>
      propertyManifest.points.filter(({definitions}) =>
        definitions.includes(definition),
      );
    const pointForSource = (definition, source) => {
      const matches = pointsFor(definition).filter(
        (point) => propertyPointSource(point) === source,
      );
      assert.equal(
        matches.length,
        1,
        `${definition} has ${matches.length} point obligations for ${source}`,
      );
      return matches[0];
    };
    const pointObserved = (point) => observedOrdinals.has(point.probeOrdinal);
    const pointExpectations = [
      {
        definition: 'point_case_both',
        called: true,
        sources: [
          ['let seed = 13001u64;', true],
          ['let taken = seed + 3;', true],
          ['return taken + 7;', true],
          ['let fallback = seed + 5;', true],
          ['fallback + 7', true],
        ],
      },
      {
        definition: 'point_case_partial',
        called: true,
        sources: [
          ['let seed = 14009u64;', true],
          ['let taken = seed + 11;', true],
          ['return taken + 13;', true],
          ['let fallback = seed + 17;', false],
          ['fallback + 19', false],
        ],
      },
      {
        definition: 'point_case_never',
        called: false,
        sources: [
          ['let seed = 15013u64;', false],
          ['let taken = seed + 23;', false],
          ['return taken + 29;', false],
          ['let fallback = seed + 31;', false],
          ['fallback + 37', false],
        ],
      },
    ];
    for (const expectation of pointExpectations) {
      const functionPoints = pointsFor(expectation.definition).filter(
        ({kind}) => kind === 'function',
      );
      assert.equal(functionPoints.length, 1);
      assert.equal(pointObserved(functionPoints[0]), expectation.called);
      for (const [source, observed] of expectation.sources) {
        assert.equal(
          pointObserved(pointForSource(expectation.definition, source)),
          observed,
          `${expectation.definition} point ${source} has the wrong observation state`,
        );
      }
    }
    const propertyManifestOrdinals = allManifestedHitOrdinals(propertyOutput);
    assert(
      propertyEvidence.ordinals.every(({ordinal}) =>
        propertyManifestOrdinals.has(ordinal),
      ),
      'generated Boolean corpus emitted an ordinal outside its denominator',
    );

    const oracleDirectory = join(scratch, 'generated-boolean-oracle');
    const oracleProfiles = join(oracleDirectory, 'profiles');
    const oracleTarget = join(oracleDirectory, 'target');
    mkdirSync(oracleProfiles, {recursive: true});
    const oracleRun = run('cargo', ['run', '--quiet'], {
      cwd: canonicalPropertyRoot,
      env: {
        ...propertyToolchain,
        CARGO_TARGET_DIR: oracleTarget,
        LLVM_PROFILE_FILE: join(oracleProfiles, '%p-%m.profraw'),
        RUSTC_BOOTSTRAP: '1',
        RUSTFLAGS: '-Cinstrument-coverage -Zcoverage-options=condition',
      },
    });
    assert.equal(oracleRun.stdout, propertyBaseline.stdout);
    assert.equal(oracleRun.stderr, propertyBaseline.stderr);
    const rawProfiles = readdirSync(oracleProfiles)
      .filter((name) => name.endsWith('.profraw'))
      .map((name) => join(oracleProfiles, name))
      .sort();
    assert(rawProfiles.length > 0, 'generated corpus oracle emitted no profiles');
    const mergedProfile = join(oracleDirectory, 'merged.profdata');
    run(llvmTool('llvm-profdata'), [
      'merge',
      '-sparse',
      ...rawProfiles,
      '-o',
      mergedProfile,
    ]);
    const oracleExport = JSON.parse(
      run(llvmTool('llvm-cov'), [
        'export',
        '--format=text',
        `--instr-profile=${mergedProfile}`,
        join(oracleTarget, 'debug/supercov-rust-property-fixture'),
      ]).stdout,
    );
    const oracleFile = oracleExport.data
      .flatMap(({files}) => files)
      .find(({filename}) => realpathSync(filename) === realpathSync(propertySourcePath));
    assert(oracleFile, 'LLVM oracle omitted the generated Boolean source');
    const oracleFunctions = oracleExport.data
      .flatMap(({functions}) => functions)
      .filter(({filenames}) =>
        filenames.some(
          (filename) => realpathSync(filename) === realpathSync(propertySourcePath),
        ),
      );
    for (const expectation of pointExpectations) {
      const functionMatches = oracleFunctions.filter(({name}) =>
        name.includes(expectation.definition),
      );
      assert.equal(
        functionMatches.length,
        1,
        `LLVM oracle has ${functionMatches.length} functions for ${expectation.definition}`,
      );
      const [oracleFunction] = functionMatches;
      const [functionPoint] = pointsFor(expectation.definition).filter(
        ({kind}) => kind === 'function',
      );
      assert.equal(
        pointObserved(functionPoint),
        oracleFunction.count > 0,
        `${expectation.definition} function-entry disagrees with LLVM`,
      );
      for (const [source] of expectation.sources) {
        const point = pointForSource(expectation.definition, source);
        const location = byteRangeLocation(propertySource, point.start, point.end);
        const regions = oracleFunction.regions.filter(
          ([line, start, endLine, end, _count, fileId, _expandedFileId, kind]) =>
            fileId === 0 &&
            kind === 0 &&
            line === location.line &&
            endLine === location.line &&
            start >= location.start &&
            end <= location.end,
        );
        assert(
          regions.length > 0,
          `LLVM oracle has no code region within ${expectation.definition}: ${source}`,
        );
        const oracleObserved = new Set(regions.map((region) => region[4] > 0));
        assert.equal(
          oracleObserved.size,
          1,
          `LLVM regions disagree within ${expectation.definition}: ${source}`,
        );
        assert.equal(
          pointObserved(point),
          [...oracleObserved][0],
          `${expectation.definition} point ${source} disagrees with LLVM`,
        );
      }
    }
    const oracleDecisions = propertyManifest.decisions.filter(({definitions}) =>
      definitions.some((definition) =>
        /^(?:case|pattern_case|guard_case)_\d+$/.test(definition) ||
        /^ownership_case_\d+::\{closure#0\}$/.test(definition),
      ),
    );
    assert.equal(oracleDecisions.length, 96);
    for (const decision of oracleDecisions) {
      const observations = propertyEvidence.decisions.filter(
        ({id}) => id === decision.id,
      );
      for (const [index, condition] of decision.conditions.entries()) {
        let start = condition.start;
        let end = condition.end;
        if (condition.source.startsWith('let ')) {
          const patternStart = condition.source.indexOf(' ') + 1;
          const patternEnd = condition.source.lastIndexOf(' =');
          assert(patternEnd > patternStart, 'generated let condition has no pattern');
          start += Buffer.byteLength(condition.source.slice(0, patternStart));
          end = condition.start + Buffer.byteLength(
            condition.source.slice(0, patternEnd),
          );
        }
        const location = byteRangeLocation(propertySource, start, end);
        const matches = oracleFile.branches.filter(
          ([line, start, endLine, end]) =>
            line === location.line &&
            start === location.start &&
            endLine === location.line &&
            end === location.end,
        );
        assert.equal(
          matches.length,
          1,
          `LLVM oracle condition is ambiguous for ${decision.id}:${index}`,
        );
        const owned = observations.reduce(
          (counts, observation) => {
            if (observation.values[index] === true) counts.truthy += 1;
            if (observation.values[index] === false) counts.falsy += 1;
            return counts;
          },
          {truthy: 0, falsy: 0},
        );
        assert.deepEqual(owned, {truthy: matches[0][4], falsy: matches[0][5]});
      }
    }
  }
  if (process.env.SUPERCOV_RUSTC_SPIKE_PROPERTY_ONLY === '1') {
    throw nextestOnlyComplete;
  }
  {
    const editionSource = generatedEditionCorpus();
    let frozenDenominator = null;
    for (const {edition, rustVersion} of [
      {edition: '2015', rustVersion: '1.83'},
      {edition: '2018', rustVersion: '1.83'},
      {edition: '2021', rustVersion: '1.83'},
      {edition: '2024', rustVersion: '1.85'},
    ]) {
      const editionRoot = join(scratch, `edition-${edition}`);
      const editionSourceDirectory = join(editionRoot, 'src');
      mkdirSync(editionSourceDirectory, {recursive: true});
      writeFileSync(
        join(editionRoot, 'Cargo.toml'),
        `[package]\nname = "supercov-rust-edition-${edition}"\nversion = "0.0.0"\nedition = "${edition}"\nrust-version = "${rustVersion}"\npublish = false\n`,
        {flag: 'wx'},
      );
      writeFileSync(join(editionSourceDirectory, 'main.rs'), editionSource, {
        flag: 'wx',
      });
      const canonicalEditionRoot = realpathSync(editionRoot);
      const toolchain = {RUSTUP_TOOLCHAIN: '1.95.0'};
      const baseline = run('cargo', ['run', '--quiet'], {
        cwd: canonicalEditionRoot,
        env: {
          ...toolchain,
          CARGO_TARGET_DIR: join(scratch, `edition-${edition}-baseline-target`),
        },
      });
      const transport = createTransport(`edition-${edition}`);
      const output = join(scratch, `edition-${edition}-output`);
      const instrumented = run('cargo', ['run', '--quiet'], {
        cwd: canonicalEditionRoot,
        env: {
          ...toolchain,
          CARGO_TARGET_DIR: join(scratch, `edition-${edition}-instrumented-target`),
          RUSTC_WRAPPER: wrapper,
          SUPERCOV_RUST_COMPILER_OUTPUT: output,
          SUPERCOV_RUST_INSTRUMENT_MIR: '1',
          SUPERCOV_RUST_SOURCE_ROOT: canonicalEditionRoot,
          SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
          SUPERCOV_RUST_TRANSPORT_FILE: transport.path,
          SUPERCOV_RUST_TRANSPORT_TOKEN: transport.tokenHex,
          SUPERCOV_RUST_CONTEXT_ID: transportContext.toString(16).padStart(16, '0'),
        },
      });
      assert.equal(instrumented.stdout, baseline.stdout);
      assert.equal(instrumented.stderr, baseline.stderr);
      assert.equal(baseline.stdout, 'edition=17\n');
      const manifest = crateManifest(output, `supercov_rust_edition_${edition}`);
      const evidence = readTransport(transport);
      const decision = decisionFor(manifest, 'choice');
      assert(decision, `edition ${edition} has no choice decision`);
      assert.deepEqual(
        evidence.decisions
          .filter(({id}) => id === decision.id)
          .map(({values, outcome}) => JSON.stringify({values, outcome}))
          .sort(),
        [
          JSON.stringify({values: [false, null], outcome: false}),
          JSON.stringify({values: [true, false], outcome: false}),
          JSON.stringify({values: [true, true], outcome: true}),
        ].sort(),
      );
      assert(
        evidence.ordinals.every(({ordinal}) =>
          allManifestedHitOrdinals(output).has(ordinal),
        ),
        `edition ${edition} emitted an ordinal outside its denominator`,
      );
      const {crate: _crate, ...denominator} = manifest;
      if (frozenDenominator === null) frozenDenominator = denominator;
      else assert.deepEqual(denominator, frozenDenominator);
    }
  }
  for (const definition of [
    '<OverrideChoice as AsyncRuntimeChoice>::async_default_choice::{closure#0}',
    'async_closure_choice::{closure#0}::{closure#0}::{closure#0}',
    'suspended_borrow_choice::{closure#0}',
  ]) {
    assert.deepEqual(smokeDecisionVectors(definition), bothBooleanVectors);
  }
  {
    const definition = 'nested_generic_choice';
    const decision = decisionFor(genericAsyncManifest, definition);
    const logicalBranches = branchesFor(
      genericAsyncManifest,
      definition,
      'logical-selection',
    );
    assert.equal(logicalBranches.length, 2);
    assert.deepEqual(
      decision.logicalSelections
        .map(({rightConditionIndex}) => rightConditionIndex)
        .sort((left, right) => left - right),
      [1, 2],
    );
    const vectors = genericAsyncEvidence.decisions.filter(
      ({id}) => id === decision.id,
    );
    for (const selection of decision.logicalSelections) {
      const branch = logicalBranches.find(({id}) => id === selection.branchId);
      assert(branch, 'nested logical-selection relation references no branch');
      const observed = new Set(
        vectors.map(({values}) =>
          values[selection.rightConditionIndex] === null
            ? 'short-circuited'
            : 'right operand evaluated',
        ),
      );
      assert.deepEqual(
        [...observed].sort(),
        branch.alternatives.map(({label}) => label).sort(),
      );
    }
  }
  {
    const definition = 'logical_value_choice';
    assert.equal(
      decisionFor(genericAsyncManifest, definition),
      undefined,
      'a logical value selection must not invent an MC/DC control decision',
    );
    const logicalBranches = branchesFor(
      genericAsyncManifest,
      definition,
      'logical-selection',
    );
    assert.equal(logicalBranches.length, 2);
    assert(
      logicalBranches.every((branch) =>
        branch.alternatives.every(({probeOrdinal}) =>
          genericAsyncOrdinals.has(probeOrdinal),
        ),
      ),
      'logical value selections did not emit every exact runtime alternative',
    );
  }
  for (const definition of [
    'EnabledChoice::associated_generic_choice',
    'AsyncRuntimeChoice::async_default_choice::{closure#0}',
    'AssociatedRuntimeChoice::associated_default',
    'GatRuntimeChoice::gat_default',
    'OpaqueRuntimeChoice::opaque_values',
    'hrtb_choice',
    'attributed_choice',
  ]) {
    const decision = decisionFor(genericAsyncManifest, definition);
    const logicalBranch = branchFor(
      genericAsyncManifest,
      definition,
      'logical-selection',
    );
    assert.deepEqual(
      decision.logicalSelections,
      [{branchId: logicalBranch.id, rightConditionIndex: 1}],
      `${definition} did not publish the exact logical-selection relation`,
    );
    const observedAlternatives = new Set(
      genericAsyncEvidence.decisions
        .filter(({id}) => id === decision.id)
        .map(({values}) =>
          values[1] === null ? 'short-circuited' : 'right operand evaluated',
        ),
    );
    assert.deepEqual(
      [...observedAlternatives].sort(),
      logicalBranch.alternatives.map(({label}) => label).sort(),
      `${definition} decision vectors did not prove every logical-selection alternative`,
    );
    assert(
      logicalBranch.alternatives.every(
        ({probeOrdinal}) => !genericAsyncOrdinals.has(probeOrdinal),
      ),
      `${definition} emitted redundant logical-selection probes`,
    );
  }
  assert(
    genericAsyncEvidence.ordinals.length > 0,
    'downstream generic/async execution emitted no authenticated probes',
  );
  const genericAsyncManifestOrdinals = allManifestedHitOrdinals(
    join(scratch, 'generic-async-output'),
  );
  assert(
    genericAsyncEvidence.ordinals.every(({ordinal}) =>
      genericAsyncManifestOrdinals.has(ordinal),
    ),
    'generic/trait/async runtime emitted an ordinal outside its frozen denominator',
  );
  if (
    process.env.SUPERCOV_RUSTC_SPIKE_FOCUSED_ONLY === '1' &&
    process.env.SUPERCOV_RUSTC_SPIKE_PROPERTY_ONLY !== '1'
  ) {
    throw nextestOnlyComplete;
  }

  const rustc = run('rustup', ['which', 'rustc']).stdout.trim();
  const cargo = run('rustup', ['which', 'cargo']).stdout.trim();
  const rustcHost = run(rustc, ['-vV']).stdout
    .split('\n')
    .find((line) => line.startsWith('host: '))
    ?.slice('host: '.length);
  assert(rustcHost, 'selected rustc did not report its host triple');
  const selectionRequest = {
    rustcPath: rustc,
    candidates: [wrapper],
    requirePublicCapabilities: false,
  };
  const selectedCompanion = JSON.parse(
    run(supercov, ['__select-rust-compiler-companion'], {
      input: JSON.stringify(selectionRequest),
    }).stdout,
  );
  assert.equal(selectedCompanion.rustcPath, rustc);
  assert.equal(selectedCompanion.companionPath, wrapper);
  assert.equal(selectedCompanion.handshake.protocolVersion, 1);
  assert.equal(selectedCompanion.handshake.frontendId, 'rust');
  assert.equal(
    selectedCompanion.handshake.coverageModelVariant,
    'rust-source-v1',
  );
  assert.equal(selectedCompanion.handshake.evidenceSchemaVersion, 3);
  assert.equal(
    selectedCompanion.handshake.companionBuildId,
    createHash('sha256').update(readFileSync(wrapper)).digest('hex'),
    'selector accepted a companion build ID that did not match its executable bytes',
  );
  assert.deepEqual(
    selectedCompanion.handshake.compiler,
    selectedCompanion.compiler,
    'selector accepted a companion built for a different compiler identity',
  );
  assert.equal(selectedCompanion.handshake.capabilities.ctfePathTracing, false);
  assert.equal(
    selectedCompanion.handshake.capabilities.rustdocDoctestTracing,
    false,
  );
  const publicSelection = run(
    supercov,
    ['__select-rust-compiler-companion'],
    {
      input: JSON.stringify({
        ...selectionRequest,
        requirePublicCapabilities: true,
      }),
      expectFailure: true,
    },
  );
  assert.match(
    publicSelection.stderr,
    /Rust companion lacks public coverage capabilities/,
  );
  const missingSelection = run(
    supercov,
    ['__select-rust-compiler-companion'],
    {
      input: JSON.stringify({...selectionRequest, candidates: []}),
      expectFailure: true,
    },
  );
  assert.match(
    missingSelection.stderr,
    /no exact compiler companion matches the selected rustc/,
  );
  const duplicateSelection = run(
    supercov,
    ['__select-rust-compiler-companion'],
    {
      input: JSON.stringify({...selectionRequest, candidates: [wrapper, wrapper]}),
      expectFailure: true,
    },
  );
  assert.match(
    duplicateSelection.stderr,
    /multiple exact compiler companions match the selected rustc/,
  );

  await verifyGeneratedPackageIsolation({cargo, rustc, rustcHost, wrapper, supercov});
  if (process.env.SUPERCOV_RUSTC_SPIKE_GENERATED_ONLY === '1') {
    throw nextestOnlyComplete;
  }

  const productionFixture = join(scratch, 'production-fixture');
  cpSync(fixtureRoot, productionFixture, {
    recursive: true,
    filter: (path) =>
      !path.startsWith(join(fixtureRoot, 'target')) &&
      !path.startsWith(join(fixtureRoot, '.supercov')),
  });
  const productionRunner = join(
    productionFixture,
    'bin with spaces',
    'configured-runner.mjs',
  );
  const productionRunnerLog = join(scratch, 'configured-runner.jsonl');
  mkdirSync(dirname(productionRunner), {recursive: true});
  mkdirSync(join(productionFixture, '.cargo'), {recursive: true});
  const configuredRunnerCfgKey =
    process.platform === 'darwin'
      ? 'cfg(target_vendor = "apple")'
      : process.platform === 'win32'
        ? 'cfg(windows)'
        : 'cfg(unix)';
  writeFileSync(
    join(productionFixture, '.cargo/config.toml'),
    '[target.' + JSON.stringify(configuredRunnerCfgKey) + ']\n' +
      'runner=["bin with spaces/configured-runner.mjs","--fixed","two words"]\n' +
      '[build]\n' +
      'rustflags=["--cfg","supercov_config_once"]\n',
  );
  const productionBuildScript = join(productionFixture, 'build.rs');
  const productionBuildScriptSource = readFileSync(productionBuildScript, 'utf8');
  writeFileSync(
    productionBuildScript,
    productionBuildScriptSource.replace(
      'fn main() {',
      'fn main() {\n    supercov_config_loaded_once();',
    ) +
      '\n#[allow(dead_code)]\nfn supercov_config_loaded_once() {\n' +
      '    let flags = std::env::var("CARGO_ENCODED_RUSTFLAGS").unwrap_or_default();\n' +
      '    assert_eq!(flags.matches("supercov_config_once").count(), 1, "Cargo config was applied more than once: {flags:?}");\n' +
      '}\n',
  );
  writeFileSync(
    productionRunner,
    [
      '#!/usr/bin/env node',
      "import {appendFileSync} from 'node:fs';",
      "import {spawnSync} from 'node:child_process';",
      "import {fileURLToPath} from 'node:url';",
      'const [mode, spaced, artifact, ...args] = process.argv.slice(2);',
      "if (!['--fixed', '--cfg', '--cli'].includes(mode) || spaced !== 'two words' || !artifact) process.exit(97);",
      'if (process.env.SUPERCOV_PRODUCTION_RUNNER_LOG) appendFileSync(process.env.SUPERCOV_PRODUCTION_RUNNER_LOG, JSON.stringify({program: fileURLToPath(import.meta.url), mode, artifact, args}) + "\\n");',
      'const env = {...process.env};',
      "if (env.SUPERCOV_NEXTEST_CRASH_PID) env.SUPERCOV_NEXTEST_TARGET_RUNNER_PID = String(process.ppid);",
      "const result = spawnSync(artifact, args, {stdio: 'inherit', env});",
      'if (result.error) throw result.error;',
      'if (result.signal) process.kill(process.pid, result.signal);',
      'process.exit(result.status ?? 98);',
      '',
    ].join('\n'),
  );
  chmodSync(productionRunner, 0o755);
  const productionRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      env: {RUSTC: rustc, SUPERCOV_PRODUCTION_RUNNER_LOG: productionRunnerLog},
      // This is the corpus's full cold compiler + Cargo/libtest/rustdoc path,
      // including project-owned dependency/proc-macro crates. Keep it bounded
      // independently of the short command probes below.
      timeout: 300_000,
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test'],
        runId: 'run_0123456789abcdef',
        startedAt: '2026-08-26T00:00:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(productionRun.exitCode, 0);
  assert.equal(productionRun.selection.companionPath, wrapper);
  assert(productionRun.denominator.points > 0);
  assert(productionRun.denominator.branches > 0);
  assert(productionRun.denominator.decisions > 0);
  assert(productionRun.artifacts > 0);
  assert(productionRun.tests > 0);
  assert(
    productionRun.setupResults > 0,
    'production compiler run did not publish CTFE build-phase evidence',
  );
  assert.equal(productionRun.tests, productionRun.libtests + productionRun.doctests);
  assert.equal(productionRun.doctests, 6);
  const manifestOnlyRunId = 'run_7123456789abcdef';
  const manifestOnlyReady = join(scratch, 'manifest-only-crash.ready');
  const manifestOnlyFailure = run(supercov, ['__run-rust-compiler'], {
    timeout: 300_000,
    expectFailure: true,
    env: {
      RUSTC: rustc,
      SUPERCOV_RUSTC_SPIKE_ABORT_AFTER_MANIFEST: manifestOnlyReady,
      SUPERCOV_RUSTC_SPIKE_ABORT_CRATE: 'supercov_rustc_spike_fixture',
    },
    input: JSON.stringify({
      root: productionFixture,
      command: [cargo, 'test', '--lib', '--no-run'],
      runId: manifestOnlyRunId,
      startedAt: '2026-08-26T00:00:05.000Z',
      wrapperPath: supercov,
      companionCandidates: [wrapper],
      requirePublicCapabilities: false,
    }),
  });
  assert.notEqual(manifestOnlyFailure.status, 0);
  assert.equal(
    readFileSync(manifestOnlyReady, 'utf8'),
    'supercov_rustc_spike_fixture',
    'the manifest-only crash gate did not reach the root-crate publication boundary',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/runs', manifestOnlyRunId)),
    'a compiler crash between manifest and snapshot publication exposed a run',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work', manifestOnlyRunId)),
    'a compiler crash between manifest and snapshot publication retained transaction state',
  );
  assert(
    !existsSync(
      join(cargoWorkspace(productionFixture), '.supercov/work', manifestOnlyRunId),
    ),
    'a compiler crash between manifest and snapshot publication retained isolated work state',
  );
  let productionFixtureSourceDigest = fixtureSourceDigest;
  const pinnedNextest = process.env.SUPERCOV_NEXTEST_BIN;
  if (pinnedNextest) {
    const nextestVersion = spawnSync(pinnedNextest, ['nextest', '--version'], {
      encoding: 'utf8',
    });
    assert.equal(nextestVersion.status, 0, nextestVersion.stderr);
    assert.match(nextestVersion.stdout, /^cargo-nextest 0\.9\.140 /u);
    const pluginDirectory = join(scratch, 'nextest-plugin');
    mkdirSync(pluginDirectory, { recursive: true });
    symlinkSync(
      realpathSync(pinnedNextest),
      join(pluginDirectory, 'cargo-nextest'),
    );
    const productionSource = join(productionFixture, 'src/lib.rs');
    writeFileSync(
      productionSource,
      readFileSync(productionSource, 'utf8') +
        '\n#[cfg(supercov_spike_instrumented)]\n' +
        '#[test]\n' +
        '#[ignore = "nextest retry identity corpus"]\n' +
        'fn supercov_nextest_flaky_attempt() {\n' +
        '    assert_ne!(std::env::var("NEXTEST_ATTEMPT").as_deref(), Ok("1"));\n' +
        '}\n\n' +
        '#[cfg(supercov_spike_instrumented)]\n' +
        '#[test]\n' +
        '#[ignore = "nextest fail-fast identity corpus"]\n' +
        'fn supercov_nextest_fail_fast_a_fails() {\n' +
        '    assert!(std::env::var_os("SUPERCOV_NEXTEST_FAIL_FAST_PASS").is_some());\n' +
        '}\n\n' +
        '#[cfg(supercov_spike_instrumented)]\n' +
        '#[test]\n' +
        '#[ignore = "nextest fail-fast identity corpus"]\n' +
        'fn supercov_nextest_fail_fast_z_unstarted() {\n' +
        '    assert!(std::env::var_os("SUPERCOV_NEXTEST_FAIL_FAST_PASS").is_none());\n' +
        '}\n\n' +
        '#[cfg(supercov_spike_instrumented)]\n' +
        'fn supercov_nextest_parallel_barrier(name: &str, peer: &str) {\n' +
        '    let root = std::path::PathBuf::from(std::env::var_os("SUPERCOV_NEXTEST_PARALLEL_DIR").unwrap());\n' +
        '    std::fs::write(root.join(name), b"ready").unwrap();\n' +
        '    let deadline = std::time::Instant::now() + std::time::Duration::from_secs(10);\n' +
        '    while !root.join(peer).is_file() {\n' +
        '        assert!(std::time::Instant::now() < deadline, "nextest attempts did not overlap");\n' +
        '        std::thread::sleep(std::time::Duration::from_millis(10));\n' +
        '    }\n' +
        '    std::thread::sleep(std::time::Duration::from_millis(100));\n' +
        '}\n\n' +
        '#[cfg(supercov_spike_instrumented)]\n' +
        '#[test]\n' +
        '#[ignore = "nextest concurrency identity corpus"]\n' +
        'fn supercov_nextest_parallel_a() {\n' +
        '    supercov_nextest_parallel_barrier("a", "b");\n' +
        '}\n\n' +
        '#[cfg(supercov_spike_instrumented)]\n' +
        '#[test]\n' +
        '#[ignore = "nextest concurrency identity corpus"]\n' +
        'fn supercov_nextest_parallel_b() {\n' +
        '    supercov_nextest_parallel_barrier("b", "a");\n' +
        '}\n\n' +
        '#[cfg(all(supercov_spike_instrumented, unix))]\n' +
        '#[test]\n' +
        '#[ignore = "nextest target-runner crash corpus"]\n' +
        'fn supercov_nextest_kills_runner() {\n' +
        '    unsafe extern "C" {\n' +
        '        fn getppid() -> i32;\n' +
        '        fn kill(pid: i32, signal: i32) -> i32;\n' +
        '    }\n' +
        '    std::fs::write(std::env::var_os("SUPERCOV_NEXTEST_CRASH_PID").unwrap(), std::process::id().to_string()).unwrap();\n' +
        '    let parent = std::env::var("SUPERCOV_NEXTEST_TARGET_RUNNER_PID").ok().and_then(|value| value.parse().ok()).unwrap_or_else(|| unsafe { getppid() });\n' +
        '    assert_eq!(unsafe { kill(parent, 9) }, 0);\n' +
        '    std::thread::sleep(std::time::Duration::from_secs(30));\n' +
        '    panic!("the target-runner watchdog did not contain the test process");\n' +
        '}\n',
    );
    productionFixtureSourceDigest = createHash('sha256')
      .update(readFileSync(productionSource))
      .digest('hex');
    const nextestRun = JSON.parse(
      run(supercov, ['__run-rust-compiler'], {
        env: {
          RUSTC: rustc,
          PATH: `${pluginDirectory}:${process.env.PATH ?? ''}`,
        },
        input: JSON.stringify({
          root: productionFixture,
          command: [
            cargo,
            'nextest',
            'run',
            '--retries',
            '1',
            '--run-ignored',
            'all',
            '--',
            '--exact',
            'supercov_nextest_flaky_attempt',
          ],
          runId: 'run_e000000000000001',
          startedAt: '2026-08-27T00:00:00.000Z',
          wrapperPath: supercov,
          companionCandidates: [wrapper],
          requirePublicCapabilities: false,
        }),
        timeout: 300_000,
      }).stdout,
    );
    assert.equal(nextestRun.exitCode, 0);
    assert.equal(nextestRun.libtests, 1);
    assert.equal(nextestRun.doctests, 0);
    assert.equal(nextestRun.tests, 1);
    assert.equal(nextestRun.transportHealth.length, 4);
    assert(nextestRun.metadata.rawEvidence.files >= 2);
    assert(nextestRun.denominator.points > 0);
    assert(
      !existsSync(
        join(productionFixture, '.supercov/work/run_e000000000000001'),
      ),
      'nextest compiler run left terminal work state behind',
    );

    const emptyPassingRun = JSON.parse(
      run(supercov, ['__run-rust-compiler'], {
        env: {
          RUSTC: rustc,
          PATH: `${pluginDirectory}:${process.env.PATH ?? ''}`,
        },
        input: JSON.stringify({
          root: productionFixture,
          command: [
            cargo,
            'nextest',
            'run',
            '--no-tests',
            'pass',
            '__supercov_no_such_test__',
          ],
          runId: 'run_e000000000000002',
          startedAt: '2026-08-27T00:00:01.000Z',
          wrapperPath: supercov,
          companionCandidates: [wrapper],
          requirePublicCapabilities: false,
        }),
        timeout: 300_000,
      }).stdout,
    );
    assert.equal(emptyPassingRun.exitCode, 0);
    assert.equal(emptyPassingRun.tests, 0);
    assert.equal(emptyPassingRun.transportHealth.length, 0);

    const emptyFailingProcess = run(supercov, ['__run-rust-compiler'], {
      env: {
        RUSTC: rustc,
        PATH: `${pluginDirectory}:${process.env.PATH ?? ''}`,
      },
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'nextest', 'run', '__supercov_no_such_test__'],
        runId: 'run_e000000000000003',
        startedAt: '2026-08-27T00:00:02.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
      expectFailure: true,
      timeout: 300_000,
    });
    assert.equal(emptyFailingProcess.status, 4);
    const emptyFailingRun = JSON.parse(emptyFailingProcess.stdout);
    assert.equal(emptyFailingRun.exitCode, 4);
    assert.equal(emptyFailingRun.tests, 0);

    const failFastProcess = run(supercov, ['__run-rust-compiler'], {
      env: {
        RUSTC: rustc,
        PATH: `${pluginDirectory}:${process.env.PATH ?? ''}`,
      },
      input: JSON.stringify({
        root: productionFixture,
        command: [
          cargo,
          'nextest',
          'run',
          '--test-threads',
          '1',
          '--fail-fast',
          '--run-ignored',
          'all',
          '-E',
          'test(/supercov_nextest_fail_fast_/)',
        ],
        runId: 'run_e000000000000004',
        startedAt: '2026-08-27T00:00:03.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
      expectFailure: true,
      timeout: 300_000,
    });
    assert.equal(
      failFastProcess.status,
      100,
      `${failFastProcess.stdout}\n${failFastProcess.stderr}`,
    );
    const failFastRun = JSON.parse(failFastProcess.stdout);
    assert.equal(failFastRun.exitCode, 100);
    assert.equal(failFastRun.tests, 2);
    assert.equal(failFastRun.transportHealth.length, 2);
    const failFastQuery = JSON.parse(
      run(supercov, ['__query-stored-run'], {
        input: JSON.stringify({
          root: productionFixture,
          query: {
            runId: failFastRun.runId,
            filter: 'all',
            command: 'test',
            selector: 'supercov_nextest_fail_fast_',
          },
        }),
      }).stdout,
    );
    assert.equal(failFastQuery.ok, true);
    assert.deepEqual(
      failFastQuery.data.tests.map(({ outcome }) => outcome).sort(),
      ['failed', 'unstarted'],
      'nextest fail-fast invented an attempt or lost the selected unstarted test',
    );
    const unstartedMatch = failFastQuery.data.tests.find(
      ({ outcome }) => outcome === 'unstarted',
    );
    assert(unstartedMatch);
    const unstartedQuery = JSON.parse(
      run(supercov, ['__query-stored-run'], {
        input: JSON.stringify({
          root: productionFixture,
          query: {
            runId: failFastRun.runId,
            filter: 'all',
            command: 'test',
            selector: unstartedMatch.id,
          },
        }),
      }).stdout,
    );
    assert.equal(unstartedQuery.ok, true);
    assert.equal(unstartedQuery.data.tests.length, 1);
    assert.deepEqual(unstartedQuery.data.tests[0].retries, []);
    assert.deepEqual(unstartedQuery.data.tests[0].attempts, []);

    const flakyFailProcess = run(supercov, ['__run-rust-compiler'], {
      env: {
        RUSTC: rustc,
        PATH: `${pluginDirectory}:${process.env.PATH ?? ''}`,
      },
      input: JSON.stringify({
        root: productionFixture,
        command: [
          cargo,
          'nextest',
          'run',
          '--retries',
          '1',
          '--flaky-result',
          'fail',
          '--run-ignored',
          'all',
          'supercov_nextest_flaky_attempt',
        ],
        runId: 'run_e000000000000005',
        startedAt: '2026-08-27T00:00:04.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
      expectFailure: true,
      timeout: 300_000,
    });
    assert.equal(
      flakyFailProcess.status,
      100,
      `${flakyFailProcess.stdout}\n${flakyFailProcess.stderr}`,
    );
    const flakyFailRun = JSON.parse(flakyFailProcess.stdout);
    assert.equal(flakyFailRun.exitCode, 100);
    assert.equal(flakyFailRun.tests, 1);
    assert.equal(flakyFailRun.transportHealth.length, 4);
    const flakyFailQuery = JSON.parse(
      run(supercov, ['__query-stored-run'], {
        input: JSON.stringify({
          root: productionFixture,
          query: {
            runId: flakyFailRun.runId,
            filter: 'all',
            command: 'test',
            selector: 'supercov_nextest_flaky_attempt',
          },
        }),
      }).stdout,
    );
    assert.equal(flakyFailQuery.ok, true);
    assert.equal(flakyFailQuery.data.tests.length, 1);
    assert.equal(flakyFailQuery.data.tests[0].outcome, 'flaky');
    assert.deepEqual(
      flakyFailQuery.data.tests[0].attempts.map(({ retry, status }) => ({
        retry,
        status,
      })),
      [
        { retry: 0, status: 'failed' },
        { retry: 1, status: 'passed' },
      ],
    );

    const nextestParallelDirectory = join(scratch, 'nextest-parallel-barrier');
    mkdirSync(nextestParallelDirectory);
    const parallelRun = JSON.parse(
      run(supercov, ['__run-rust-compiler'], {
        env: {
          RUSTC: rustc,
          PATH: `${pluginDirectory}:${process.env.PATH ?? ''}`,
          SUPERCOV_NEXTEST_PARALLEL_DIR: nextestParallelDirectory,
        },
        input: JSON.stringify({
          root: productionFixture,
          command: [
            cargo,
            'nextest',
            'run',
            '--test-threads',
            '2',
            '--run-ignored',
            'all',
            '-E',
            'test(/supercov_nextest_parallel_/)',
          ],
          runId: 'run_e000000000000006',
          startedAt: '2026-08-27T00:00:05.000Z',
          wrapperPath: supercov,
          companionCandidates: [wrapper],
          requirePublicCapabilities: false,
        }),
        timeout: 300_000,
      }).stdout,
    );
    assert.equal(parallelRun.exitCode, 0);
    assert.equal(parallelRun.tests, 2);
    assert.equal(parallelRun.transportHealth.length, 4);
    const parallelQuery = JSON.parse(
      run(supercov, ['__query-stored-run'], {
        input: JSON.stringify({
          root: productionFixture,
          query: {
            runId: parallelRun.runId,
            filter: 'all',
            command: 'test',
            selector: 'supercov_nextest_parallel_',
          },
        }),
      }).stdout,
    );
    assert.equal(parallelQuery.ok, true);
    assert.deepEqual(
      parallelQuery.data.tests.map(({ outcome }) => outcome).sort(),
      ['passed', 'passed'],
    );
    assert.equal(new Set(parallelQuery.data.tests.map(({ id }) => id)).size, 2);
    const parallelDetails = parallelQuery.data.tests.map(({id}) => {
      const detail = JSON.parse(
        run(supercov, ['__query-stored-run'], {
          input: JSON.stringify({
            root: productionFixture,
            query: {
              runId: parallelRun.runId,
              filter: 'all',
              command: 'test',
              selector: id,
            },
          }),
        }).stdout,
      );
      assert.equal(detail.ok, true);
      assert.equal(detail.data.tests.length, 1);
      return detail.data.tests[0];
    });
    assert(
      parallelDetails.every(
        ({ attempts }) =>
          attempts.length === 1 &&
          attempts[0].retry === 0 &&
          attempts[0].status === 'passed',
      ),
      'concurrent nextest attempts lost their exact zero-based retry or outcome',
    );
    assert(
      !existsSync(
        join(productionFixture, '.supercov/work/run_e000000000000006'),
      ),
      'concurrent nextest compiler run left terminal work state behind',
    );

    if (process.platform !== 'win32') {
      const crashPidPath = join(scratch, 'nextest-crash-test.pid');
      const crashedRunner = run(supercov, ['__run-rust-compiler'], {
        env: {
          RUSTC: rustc,
          PATH: `${pluginDirectory}:${process.env.PATH ?? ''}`,
          SUPERCOV_NEXTEST_CRASH_PID: crashPidPath,
        },
        input: JSON.stringify({
          root: productionFixture,
          command: [
            cargo,
            'nextest',
            'run',
            '--run-ignored',
            'all',
            '--',
            '--exact',
            'supercov_nextest_kills_runner',
          ],
          runId: 'run_e000000000000007',
          startedAt: '2026-08-27T00:00:06.000Z',
          wrapperPath: supercov,
          companionCandidates: [wrapper],
          requirePublicCapabilities: false,
        }),
        expectFailure: true,
        timeout: 300_000,
      });
      assert.equal(
        crashedRunner.status,
        100,
        `${crashedRunner.stdout}\n${crashedRunner.stderr}`,
      );
      assert.match(
        crashedRunner.stderr,
        /reserved an invocation without publishing its unit/u,
      );
      const crashedTestPid = Number.parseInt(readFileSync(crashPidPath, 'utf8'), 10);
      assert(Number.isSafeInteger(crashedTestPid) && crashedTestPid > 1);
      assert(
        await waitForProcessExit(crashedTestPid),
        'nextest target-runner death let the supervised test process escape',
      );
      assert(
        !existsSync(
          join(productionFixture, '.supercov/work/run_e000000000000007'),
        ),
        'nextest target-runner death left terminal work state behind',
      );
      assert(
        !existsSync(
          join(productionFixture, '.supercov/runs/run_e000000000000007'),
        ),
        'nextest target-runner death published unauthenticated coverage',
      );
    }
  }
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(productionFixture, 'src/lib.rs')))
      .digest('hex'),
    productionFixtureSourceDigest,
    'production nextest orchestration modified project source',
  );
  if (process.env.SUPERCOV_SPIKE_NEXTEST_ONLY === '1') {
    assert(pinnedNextest, 'nextest-only mode requires SUPERCOV_NEXTEST_BIN');
    console.log(
      '[rustc-backend-spike] production nextest catalog, retries, fail-fast, concurrency and crash contracts passed',
    );
    throw nextestOnlyComplete;
  }
  const productionRunnerInvocations = readFileSync(productionRunnerLog, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  assert(
    productionRunnerInvocations.some(({args}) => args.includes('--list')),
    'configured runner did not wrap libtest discovery',
  );
  const listedArtifacts = new Set(
    productionRunnerInvocations
      .filter(({args}) => args.includes('--list'))
      .map(({artifact}) => artifact),
  );
  const stockLibtestInvocations = productionRunnerInvocations.filter(
    ({artifact, args}) =>
      listedArtifacts.has(artifact) && !args.includes('--list'),
  );
  assert(
    stockLibtestInvocations.length > 0,
    'configured runner did not wrap stock libtest artifact execution',
  );
  assert(
    stockLibtestInvocations.every(({args}) => !args.includes('--exact')),
    'stock libtest execution was split into synthetic exact-test invocations',
  );
  assert(
    productionRunnerInvocations.some(
      ({artifact, args}) =>
        !args.includes('--list') && !listedArtifacts.has(artifact),
    ),
    'configured runner did not wrap rustdoc test execution',
  );
  assert(
    productionRunnerInvocations.every(({program}) =>
      program.startsWith(cargoWorkspace(productionFixture)),
    ),
    'workspace-relative configured runner was not relocated into the isolated workspace',
  );
  const productionAttemptHealth = productionRun.transportHealth.filter(
    ({scopeKind}) => scopeKind === 'test-attempt',
  );
  const productionRunnerHealth = productionRun.transportHealth.filter(
    ({scopeKind}) => scopeKind === 'runner-invocation',
  );
  const productionCargoRunnerHealth = productionRunnerHealth.filter(
    ({scopeId}) => scopeId.startsWith('background:rust-runner:'),
  );
  const productionRustdocRunnerHealth = productionRunnerHealth.filter(
    ({scopeId}) => scopeId.startsWith('rustdoc:'),
  );
  assert.equal(productionAttemptHealth.length, productionRun.libtests);
  assert.equal(productionCargoRunnerHealth.length, listedArtifacts.size);
  assert.equal(productionRustdocRunnerHealth.length, 1);
  assert.equal(
    productionRunnerHealth.length,
    productionCargoRunnerHealth.length + productionRustdocRunnerHealth.length,
  );
  assert(
    productionRun.transportHealth.every(
      ({scopeKind, status, transport}) =>
        transport.dropped === 0 &&
        transport.incomplete === 0 &&
        ((scopeKind === 'runner-invocation' && status === 'passed') ||
          (scopeKind === 'test-attempt' &&
            transport.attachments === 0 &&
            ['passed', 'skipped', 'unstarted'].includes(status))),
    ),
    'production compiler run lost or dropped authenticated test evidence',
  );
  assert(
    productionRustdocRunnerHealth[0].transport.attachments > 0,
    'production rustdoc invocation published no authenticated transport attachment',
  );
  assert(productionRun.summary.lines.covered > 0);
  assert(productionRun.summary.branches.covered > 0);
  assert(productionRun.metadata.rawEvidence.files > productionRun.tests);
  assert(productionRun.metadata.rawEvidence.compressedBytes > 0);
  assert(
    productionRun.metadata.rawEvidence.compressedBytes <
      productionRun.metadata.rawEvidence.uncompressedBytes,
    'production compiler evidence archive was not compressed',
  );
  assert(
    existsSync(join(productionRun.runDirectory, 'evidence.raw.gz')),
    'production compiler run did not atomically publish its archive',
  );
  assert(
    !existsSync(
      join(
        productionFixture,
        '.supercov/work/run_0123456789abcdef',
      ),
    ),
    'production compiler run left terminal work state behind',
  );
  const productionQuery = run(
    supercov,
    ['runs', 'run_0123456789abcdef', '--json'],
    {cwd: productionFixture},
  );
  assert.match(productionQuery.stdout, /run_0123456789abcdef/);
  const productionTestQuery = JSON.parse(
    run(supercov, ['__query-stored-run'], {
      input: JSON.stringify({
        root: productionFixture,
        query: {
          runId: productionRun.runId,
          filter: 'all',
          command: 'test',
          selector: 'records_real_runtime_probes',
        },
      }),
    }).stdout,
  );
  assert.equal(productionTestQuery.ok, true);
  assert.equal(productionTestQuery.data.tests.length, 1);
  assert.equal(
    productionTestQuery.data.tests[0].id,
    `rust:libtest:${rustcHost}:package:.:lib:supercov_rustc_spike_fixture:src/lib.rs::tests::records_real_runtime_probes`,
    'production libtest identity omitted its relocatable package and exact target',
  );

  const includedRunnerConfig = join(
    productionFixture,
    '.cargo',
    'included-runner.toml',
  );
  writeFileSync(
    includedRunnerConfig,
    '[target.' + JSON.stringify(rustcHost) + ']\n' +
      'runner=["bin with spaces/configured-runner.mjs","--fixed","two words"]\n',
  );
  writeFileSync(
    join(productionFixture, '.cargo/config.toml'),
    'include=["included-runner.toml"]\n' +
      '[build]\n' +
      'rustflags=["--cfg","supercov_config_once"]\n',
  );
  const includedRunnerLog = join(scratch, 'included-runner.jsonl');
  const includedRunnerRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {RUSTC: rustc, SUPERCOV_PRODUCTION_RUNNER_LOG: includedRunnerLog},
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test', 'records_real_runtime_probes'],
        runId: 'run_7123456789abcdef',
        startedAt: '2026-08-26T00:00:10.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(includedRunnerRun.exitCode, 0);
  assert(includedRunnerRun.tests > 0);
  assert(
    readFileSync(includedRunnerLog, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .every(({mode}) => mode === '--fixed'),
    'included exact-target runner was not preserved',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work/run_7123456789abcdef')),
    'included-runner compiler run left terminal work state behind',
  );

  writeFileSync(
    includedRunnerConfig,
    '[target.' + JSON.stringify(configuredRunnerCfgKey) + ']\n' +
      'runner=["bin with spaces/configured-runner.mjs","--cfg","two words"]\n',
  );
  const includedCfgRunnerLog = join(scratch, 'included-cfg-runner.jsonl');
  const includedCfgRunnerRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {RUSTC: rustc, SUPERCOV_PRODUCTION_RUNNER_LOG: includedCfgRunnerLog},
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test', 'records_real_runtime_probes'],
        runId: 'run_9123456789abcdef',
        startedAt: '2026-08-26T00:00:12.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(includedCfgRunnerRun.exitCode, 0);
  assert(includedCfgRunnerRun.tests > 0);
  assert(
    readFileSync(includedCfgRunnerLog, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .every(({mode}) => mode === '--cfg'),
    'included cfg runner was not selected from rustc\'s exact target cfg set',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work/run_9123456789abcdef')),
    'included-cfg-runner compiler run left terminal work state behind',
  );

  const configuredCompiler = join(productionFixture, 'compiler-proxy.mjs');
  const configuredCompilerLog = join(scratch, 'configured-compiler.jsonl');
  const includedCompilerConfig = join(
    productionFixture,
    '.cargo',
    'included-compiler.toml',
  );
  writeFileSync(
    configuredCompiler,
    [
      '#!/usr/bin/env node',
      "import {appendFileSync} from 'node:fs';",
      "import {spawnSync} from 'node:child_process';",
      "import {fileURLToPath} from 'node:url';",
      'const args = process.argv.slice(2);',
      'appendFileSync(process.env.SUPERCOV_CONFIGURED_COMPILER_LOG, JSON.stringify({program: fileURLToPath(import.meta.url), args}) + "\\n");',
      'const result = spawnSync(process.env.SUPERCOV_REAL_RUSTC, args, {stdio: "inherit", env: process.env});',
      'if (result.error) throw result.error;',
      'if (result.signal) process.kill(process.pid, result.signal);',
      'process.exit(result.status ?? 98);',
      '',
    ].join('\n'),
  );
  chmodSync(configuredCompiler, 0o755);
  writeFileSync(
    includedCompilerConfig,
    '[build]\nrustc="./compiler-proxy.mjs"\n',
  );
  writeFileSync(
    join(productionFixture, '.cargo/config.toml'),
    'include=["included-runner.toml","included-compiler.toml"]\n' +
      '[build]\n' +
      'rustflags=["--cfg","supercov_config_once"]\n',
  );
  const configuredCompilerRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {
        SUPERCOV_PRODUCTION_RUNNER_LOG: join(
          scratch,
          'configured-compiler-runner.jsonl',
        ),
        SUPERCOV_CONFIGURED_COMPILER_LOG: configuredCompilerLog,
        SUPERCOV_REAL_RUSTC: rustc,
      },
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test', 'records_real_runtime_probes'],
        runId: 'run_b123456789abcdef',
        startedAt: '2026-08-26T00:00:13.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(configuredCompilerRun.exitCode, 0);
  assert(configuredCompilerRun.tests > 0);
  const configuredCompilerInvocations = readFileSync(
    configuredCompilerLog,
    'utf8',
  )
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  assert(
    configuredCompilerInvocations.some(({args}) => args.includes('-vV')),
    'included build.rustc did not drive exact host/compiler selection',
  );
  assert(
    configuredCompilerInvocations.some(
      ({args}) => args.includes('--print') && args.includes('cfg'),
    ),
    'included build.rustc did not drive target cfg runner selection',
  );
  assert(
    configuredCompilerInvocations.every(({program}) =>
      program.startsWith(cargoWorkspace(productionFixture)),
    ),
    'workspace-relative build.rustc was not relocated into the isolated workspace',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work/run_b123456789abcdef')),
    'configured-compiler run left terminal work state behind',
  );
  const compilerWrapperLog = join(scratch, 'compiler-wrappers.jsonl');
  const generalCompilerWrapper = join(
    productionFixture,
    'general-compiler-wrapper.mjs',
  );
  const workspaceCompilerWrapper = join(
    productionFixture,
    'workspace-compiler-wrapper.mjs',
  );
  const compilerWrapperSource = (layer) =>
    [
      '#!/usr/bin/env node',
      "import {appendFileSync} from 'node:fs';",
      "import {spawnSync} from 'node:child_process';",
      "import {fileURLToPath} from 'node:url';",
      'const [compiler, ...args] = process.argv.slice(2);',
      `appendFileSync(process.env.SUPERCOV_COMPILER_WRAPPER_LOG, JSON.stringify({layer: ${JSON.stringify(layer)}, program: fileURLToPath(import.meta.url), compiler, args, rustcWrapper: process.env.RUSTC_WRAPPER ?? null, workspaceWrapper: process.env.RUSTC_WORKSPACE_WRAPPER ?? null}) + "\\n");`,
      `if (${JSON.stringify(layer)} === 'workspace' && process.env.SUPERCOV_FAIL_COMPILER_WRAPPER === '1' && args.includes('--crate-name')) process.exit(73);`,
      'const result = spawnSync(compiler, args, {stdio: "inherit", env: process.env});',
      'if (result.error) throw result.error;',
      'if (result.signal) process.kill(process.pid, result.signal);',
      'process.exit(result.status ?? 98);',
      '',
    ].join('\n');
  writeFileSync(generalCompilerWrapper, compilerWrapperSource('general'));
  writeFileSync(workspaceCompilerWrapper, compilerWrapperSource('workspace'));
  chmodSync(generalCompilerWrapper, 0o755);
  chmodSync(workspaceCompilerWrapper, 0o755);
  writeFileSync(
    includedCompilerConfig,
    '[build]\n' +
      'rustc-wrapper="./general-compiler-wrapper.mjs"\n' +
      'rustc-workspace-wrapper="./workspace-compiler-wrapper.mjs"\n',
  );
  const configuredWrapperRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      env: {
        RUSTC: rustc,
        SUPERCOV_COMPILER_WRAPPER_LOG: compilerWrapperLog,
      },
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test', 'records_real_runtime_probes'],
        runId: 'run_c123456789abcdef',
        startedAt: '2026-08-26T00:00:13.500Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
      // This path intentionally composes both user compiler-wrapper layers
      // with Supercov across a clean target. It is a full corpus build, not a
      // short command probe, and retains the same bounded five-minute budget
      // as the primary production run.
      timeout: 300_000,
    }).stdout,
  );
  assert.equal(configuredWrapperRun.exitCode, 0);
  assert(configuredWrapperRun.tests > 0);
  const compilerWrapperInvocations = readFileSync(compilerWrapperLog, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const generalCompilerInvocations = compilerWrapperInvocations.filter(
    ({layer}) => layer === 'general',
  );
  const workspaceCompilerInvocations = compilerWrapperInvocations.filter(
    ({layer}) => layer === 'workspace',
  );
  assert(
    generalCompilerInvocations.length > 0 &&
      workspaceCompilerInvocations.length > 0,
    'configured compiler-wrapper chain did not execute both layers',
  );
  assert(
    compilerWrapperInvocations.every(
      ({program, rustcWrapper, workspaceWrapper}) =>
        program.startsWith(cargoWorkspace(productionFixture)) &&
        rustcWrapper === null &&
        workspaceWrapper === null,
    ),
    'compiler wrappers were not relocated or saw Supercov replace their original environment',
  );
  assert(
    generalCompilerInvocations.some(({compiler}) =>
      compiler.endsWith('workspace-compiler-wrapper.mjs'),
    ),
    'general compiler wrapper did not retain the workspace wrapper as its compiler',
  );
  assert(
    workspaceCompilerInvocations.some(({compiler}) => compiler === supercov),
    'workspace compiler wrapper did not receive the Supercov inner compiler relay',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work/run_c123456789abcdef')),
    'configured-wrapper compiler run left terminal work state',
  );
  const configuredWrapperFailure = run(
    supercov,
    ['__run-rust-compiler'],
    {
      expectFailure: true,
      env: {
        RUSTC: rustc,
        SUPERCOV_COMPILER_WRAPPER_LOG: compilerWrapperLog,
        SUPERCOV_FAIL_COMPILER_WRAPPER: '1',
      },
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test', 'records_real_runtime_probes'],
        runId: 'run_d123456789abcdef',
        startedAt: '2026-08-26T00:00:13.750Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    },
  );
  assert.match(configuredWrapperFailure.stderr, /exit status: 73/u);
  assert(
    !existsSync(join(productionFixture, '.supercov/work/run_d123456789abcdef')),
    'failed configured-wrapper compiler run left terminal work state',
  );
  writeFileSync(
    join(productionFixture, '.cargo/config.toml'),
    'include=["included-runner.toml"]\n' +
      '[build]\n' +
      'rustflags=["--cfg","supercov_config_once"]\n',
  );

  const duplicateCfgKeys =
    process.platform === 'darwin'
      ? ['cfg(target_vendor = "apple")', 'cfg(target_os = "macos")']
      : process.platform === 'win32'
        ? ['cfg(windows)', 'cfg(target_family = "windows")']
        : ['cfg(unix)', 'cfg(target_family = "unix")'];
  writeFileSync(
    includedRunnerConfig,
    duplicateCfgKeys
      .map(
        (key, index) =>
          `[target.${JSON.stringify(key)}]\nrunner=["bin with spaces/configured-runner.mjs","--cfg","two words","${index}"]\n`,
      )
      .join(''),
  );
  const cargoDuplicateCfg = run(
    cargo,
    ['test', 'records_real_runtime_probes'],
    {cwd: productionFixture, env: {RUSTC: rustc}, expectFailure: true},
  );
  assert.match(cargoDuplicateCfg.stderr, /several matching instances/u);
  const supercovDuplicateCfg = run(supercov, ['__run-rust-compiler'], {
    env: {RUSTC: rustc},
    expectFailure: true,
    input: JSON.stringify({
      root: productionFixture,
      command: [cargo, 'test', 'records_real_runtime_probes'],
      runId: 'run_a123456789abcdef',
      startedAt: '2026-08-26T00:00:14.000Z',
      wrapperPath: supercov,
      companionCandidates: [wrapper],
      requirePublicCapabilities: false,
    }),
  });
  assert.match(supercovDuplicateCfg.stderr, /several matching instances/u);
  assert(
    !existsSync(join(productionFixture, '.supercov/work/run_a123456789abcdef')),
    'duplicate cfg preflight created terminal work state',
  );

  writeFileSync(
    includedRunnerConfig,
    '[target.' + JSON.stringify(configuredRunnerCfgKey) + ']\n' +
      'runner=["bin with spaces/configured-runner.mjs","--cfg","two words"]\n',
  );

  const cliRunnerLog = join(scratch, 'cli-runner.jsonl');
  const cliRunnerRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {RUSTC: rustc, SUPERCOV_PRODUCTION_RUNNER_LOG: cliRunnerLog},
      input: JSON.stringify({
        root: productionFixture,
        command: [
          cargo,
          'test',
          'records_real_runtime_probes',
          '--config',
          `target.${rustcHost}.runner=["bin with spaces/configured-runner.mjs","--cli","two words"]`,
        ],
        runId: 'run_8123456789abcdef',
        startedAt: '2026-08-26T00:00:15.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(cliRunnerRun.exitCode, 0);
  assert(cliRunnerRun.tests > 0);
  assert(
    readFileSync(cliRunnerLog, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .every(({mode}) => mode === '--cli'),
    'CLI exact-target runner did not override included configuration',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work/run_8123456789abcdef')),
    'CLI-runner compiler run left terminal work state behind',
  );

  const selectedToolchainRunnerLog = join(
    scratch,
    'selected-toolchain-runner.jsonl',
  );
  const selectedToolchainRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {
        SUPERCOV_PRODUCTION_RUNNER_LOG: selectedToolchainRunnerLog,
      },
      input: JSON.stringify({
        root: productionFixture,
        command: [
          'cargo',
          '+1.95.0',
          'test',
          'records_real_runtime_probes',
        ],
        runId: 'run_3123456789abcdef',
        startedAt: '2026-08-26T00:00:20.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(selectedToolchainRun.exitCode, 0);
  assert.equal(selectedToolchainRun.selection.companionPath, wrapper);
  assert.equal(
    selectedToolchainRun.selection.rustcPath,
    rustc,
    'explicit +toolchain did not select the matching rustc without RUSTC',
  );
  assert(
    selectedToolchainRun.tests > 0,
    'explicit +toolchain run selected no exact tests',
  );
  const selectedToolchainRunnerInvocations = readFileSync(
    selectedToolchainRunnerLog,
    'utf8',
  )
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  assert(
    selectedToolchainRunnerInvocations.length > 0 &&
      selectedToolchainRunnerInvocations.every(({program}) =>
        program.startsWith(cargoWorkspace(productionFixture)),
      ),
    'explicit +toolchain did not preserve the relocated configured runner',
  );
  assert(
    !existsSync(
      join(productionFixture, '.supercov/work/run_3123456789abcdef'),
    ),
    'explicit +toolchain run left terminal work state behind',
  );

  const killedRunId = 'run_4123456789abcdef';
  const killedProduction = spawnCommand(supercov, ['__run-rust-compiler'], {
    env: {RUSTC: rustc},
    input: JSON.stringify({
      root: productionFixture,
      command: [cargo, 'test', '--doc'],
      runId: killedRunId,
      startedAt: '2026-08-26T00:00:30.000Z',
      wrapperPath: supercov,
      companionCandidates: [wrapper],
      requirePublicCapabilities: false,
    }),
  });
  const killedWorkspaceRun = join(
    cargoWorkspace(productionFixture),
    '.supercov/work',
    killedRunId,
  );
  const killedSelection = join(
    killedWorkspaceRun,
    'rust-compiler/selections',
  );
  for (let attempt = 0; attempt < 1_200; attempt += 1) {
    if (existsSync(killedSelection) && readdirSync(killedSelection).length > 0) break;
    assert.equal(
      killedProduction.child.exitCode,
      null,
      'the compiler run exited before its supervised Cargo child was active',
    );
    await delay(25);
  }
  assert(
    existsSync(killedSelection) && readdirSync(killedSelection).length > 0,
    'the compiler run never reached its supervised Cargo child',
  );
  assert(
    killedProduction.child.kill('SIGKILL'),
    'failed to kill the compiler-run supervisor',
  );
  const killedProductionResult = await killedProduction.result;
  assert.equal(killedProductionResult.signal, 'SIGKILL');
  await delay(100);
  assert(
    existsSync(killedWorkspaceRun),
    'SIGKILL unexpectedly ran cooperative compiler-work cleanup',
  );

  const filteredProductionRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {RUSTC: rustc},
      input: JSON.stringify({
        root: productionFixture,
        command: [
          cargo,
          'test',
          '--lib',
          'records_real_runtime_probes',
          '--',
          '--include-ignored',
        ],
        runId: 'run_1123456789abcdef',
        startedAt: '2026-08-26T00:01:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(filteredProductionRun.exitCode, 0);
  assert.equal(
    filteredProductionRun.tests,
    1,
    'the production compiler runner discarded Cargo TESTNAME filtering',
  );
  assert.equal(filteredProductionRun.libtests, 1);
  assert.equal(filteredProductionRun.doctests, 0);
  assert.equal(filteredProductionRun.transportHealth.length, 2);
  assert.equal(
    filteredProductionRun.transportHealth.find(
      ({scopeKind}) => scopeKind === 'runner-invocation',
    )?.status,
    'passed',
  );
  assert.equal(
    filteredProductionRun.transportHealth.find(
      ({scopeKind}) => scopeKind === 'test-attempt',
    )?.status,
    'passed',
  );
  assert(
    filteredProductionRun.recoveredRuns.includes(killedRunId),
    'the next compiler run did not report the abandoned SIGKILL transaction',
  );
  assert(
    !existsSync(killedWorkspaceRun),
    'the next compiler run retained abandoned compiler workspace state',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work', killedRunId)),
    'the next compiler run retained abandoned publication state',
  );
  assert(
    !existsSync(
      join(
        productionFixture,
        '.supercov/work/run_1123456789abcdef',
      ),
    ),
    'filtered production compiler run left terminal work state behind',
  );

  // The configured runner fixture has now covered a normal mixed
  // libtest/rustdoc run, a killed rustdoc run and an exact filtered libtest
  // run. Remove it before the later dylib-heavy proc-macro workspace: a Node
  // shebang runner is not a valid baseline launcher for macOS DYLD paths.
  rmSync(join(productionFixture, '.cargo'), {recursive: true});
  rmSync(dirname(productionRunner), {recursive: true});
  writeFileSync(productionBuildScript, productionBuildScriptSource);

  const productionManifest = join(productionFixture, 'Cargo.toml');
  const productionManifestSource = readFileSync(productionManifest, 'utf8');
  const multiPackageManifest = productionManifestSource.replace(
    /^members = \[(.*)\]$/m,
    (_line, members) =>
      `members = [${members}, "sibling-a", "sibling-b"]`,
  );
  assert.notEqual(
    multiPackageManifest,
    productionManifestSource,
    'the multi-package corpus could not extend the fixture workspace members',
  );
  writeFileSync(
    productionManifest,
    multiPackageManifest,
  );
  for (const sibling of ['sibling-a', 'sibling-b']) {
    const siblingRoot = join(productionFixture, sibling);
    mkdirSync(join(siblingRoot, 'src'), {recursive: true});
    writeFileSync(
      join(siblingRoot, 'Cargo.toml'),
      [
        '[package]',
        `name = "${sibling}"`,
        'version = "0.0.0"',
        'edition = "2024"',
        '',
        '[lib]',
        'name = "shared_target"',
        '',
      ].join('\n'),
    );
    writeFileSync(
      join(siblingRoot, 'src/lib.rs'),
      [
        'pub fn selected(value: bool) -> usize {',
        '    if value { 1 } else { 0 }',
        '}',
        '',
        '#[test]',
        'fn same_name() {',
        '    assert_eq!(selected(true), 1);',
        '}',
        '',
      ].join('\n'),
    );
  }
  const multiPackageRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {RUSTC: rustc},
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test', '--workspace', '--lib', 'same_name'],
        runId: 'run_6123456789abcdef',
        startedAt: '2026-08-26T00:01:15.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(multiPackageRun.exitCode, 0);
  assert.equal(multiPackageRun.libtests, 2);
  assert.equal(multiPackageRun.doctests, 0);
  const multiPackageQuery = JSON.parse(
    run(supercov, ['__query-stored-run'], {
      input: JSON.stringify({
        root: productionFixture,
        query: {
          runId: multiPackageRun.runId,
          filter: 'passed',
          command: 'test',
          selector: 'same_name',
        },
      }),
    }).stdout,
  );
  assert.equal(multiPackageQuery.ok, true);
  assert.deepEqual(
    new Set(multiPackageQuery.data.tests.map(({id}) => id)),
    new Set([
      `rust:libtest:${rustcHost}:package:sibling-a:lib:shared_target:sibling-a/src/lib.rs::same_name`,
      `rust:libtest:${rustcHost}:package:sibling-b:lib:shared_target:sibling-b/src/lib.rs::same_name`,
    ]),
    'colliding libtest names did not retain exact relocatable package identity',
  );

  const interruptedRunId = 'run_5123456789abcdef';
  const interruptedProduction = spawnCommand(supercov, ['__run-rust-compiler'], {
    env: {RUSTC: rustc},
    input: JSON.stringify({
      root: productionFixture,
      command: [cargo, 'test', '--doc'],
      runId: interruptedRunId,
      startedAt: '2026-08-26T00:01:30.000Z',
      wrapperPath: supercov,
      companionCandidates: [wrapper],
      requirePublicCapabilities: false,
    }),
  });
  const interruptedWorkspaceRun = join(
    cargoWorkspace(productionFixture),
    '.supercov/work',
    interruptedRunId,
  );
  const interruptedSelection = join(
    interruptedWorkspaceRun,
    'rust-compiler/selections',
  );
  for (let attempt = 0; attempt < 1_200; attempt += 1) {
    if (existsSync(interruptedSelection) && readdirSync(interruptedSelection).length > 0) break;
    assert.equal(
      interruptedProduction.child.exitCode,
      null,
      'the interrupt gate exited before its supervised Cargo child was active',
    );
    await delay(25);
  }
  assert(
    existsSync(interruptedSelection) && readdirSync(interruptedSelection).length > 0,
    'the interrupt gate never reached its supervised Cargo child',
  );
  assert(
    interruptedProduction.child.kill('SIGTERM'),
    'failed to interrupt the compiler-run supervisor',
  );
  const interruptedProductionResult = await interruptedProduction.result;
  assert.equal(interruptedProductionResult.status, 143);
  assert.equal(interruptedProductionResult.signal, null);
  assert.match(interruptedProductionResult.stderr, /interrupted by SIGTERM/);
  assert(
    !existsSync(interruptedWorkspaceRun),
    'cooperative compiler interruption retained isolated work state',
  );
  assert(
    !existsSync(join(productionFixture, '.supercov/work', interruptedRunId)),
    'cooperative compiler interruption retained publication work state',
  );

  const docOnlyProductionRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      timeout: 300_000,
      env: {RUSTC: rustc},
      input: JSON.stringify({
        root: productionFixture,
        command: [cargo, 'test', '--doc'],
        runId: 'run_2123456789abcdef',
        startedAt: '2026-08-26T00:02:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(docOnlyProductionRun.exitCode, 0);
  assert.equal(docOnlyProductionRun.tests, 6);
  assert.equal(docOnlyProductionRun.libtests, 0);
  assert.equal(docOnlyProductionRun.doctests, 6);
  assert.equal(docOnlyProductionRun.artifacts, 0);
  assert.equal(docOnlyProductionRun.transportHealth.length, 1);
  assert.equal(
    docOnlyProductionRun.transportHealth[0].scopeKind,
    'runner-invocation',
  );
  assert.equal(docOnlyProductionRun.transportHealth[0].status, 'passed');
  assert.equal(docOnlyProductionRun.transportHealth[0].transport.dropped, 0);
  assert.equal(docOnlyProductionRun.transportHealth[0].transport.incomplete, 0);
  assert(
    docOnlyProductionRun.transportHealth[0].transport.attachments > 0,
    'doc-only production run published no authenticated transport attachment',
  );
  assert(
    !existsSync(
      join(
        productionFixture,
        '.supercov/work/run_2123456789abcdef',
      ),
    ),
    'doc-only production compiler run left terminal work state behind',
  );
  const docOnlyProductionQuery = run(
    supercov,
    ['runs', 'run_2123456789abcdef', '--json'],
    {cwd: productionFixture},
  );
  assert.match(docOnlyProductionQuery.stdout, /run_2123456789abcdef/);

  const failingDoctestFixture = join(scratch, 'failing-doctest-fixture');
  cpSync(fixtureRoot, failingDoctestFixture, {
    recursive: true,
    filter: (path) =>
      !path.startsWith(join(fixtureRoot, 'target')) &&
      !path.startsWith(join(fixtureRoot, '.supercov')),
  });
  writeFileSync(
    join(failingDoctestFixture, 'src/lib.rs'),
    '\n/// ```\n/// assert_eq!(1, 2);\n/// ```\npub fn deliberately_failing_doctest() {}\n',
    {flag: 'a'},
  );
  const failingDoctestRun = JSON.parse(
    run(supercov, ['__run-rust-compiler'], {
      env: {RUSTC: rustc},
      expectFailure: true,
      timeout: 300_000,
      input: JSON.stringify({
        root: failingDoctestFixture,
        command: [cargo, 'test', '--doc'],
        runId: 'run_3123456789abcdef',
        startedAt: '2026-08-26T00:03:00.000Z',
        wrapperPath: supercov,
        companionCandidates: [wrapper],
        requirePublicCapabilities: false,
      }),
    }).stdout,
  );
  assert.equal(failingDoctestRun.exitCode, 101);
  assert.equal(failingDoctestRun.libtests, 0);
  assert.equal(failingDoctestRun.doctests, 7);
  assert.equal(failingDoctestRun.metadata.testExitCode, 101);
  assert.equal(failingDoctestRun.transportHealth.length, 1);
  assert.equal(failingDoctestRun.transportHealth[0].scopeKind, 'runner-invocation');
  assert.equal(failingDoctestRun.transportHealth[0].transport.dropped, 0);
  assert.equal(failingDoctestRun.transportHealth[0].transport.incomplete, 0);
  assert(
    !existsSync(
      join(
        failingDoctestFixture,
        '.supercov/work/run_3123456789abcdef',
      ),
    ),
    'failed doctest run left terminal work state behind',
  );
  const failingDoctestQuery = run(
    supercov,
    ['runs', 'run_3123456789abcdef', '--json'],
    {cwd: failingDoctestFixture},
  );
  assert.match(failingDoctestQuery.stdout, /run_3123456789abcdef/);
  assert.match(failingDoctestQuery.stdout, /failed/);
  assert.equal(
    createHash('sha256')
      .update(readFileSync(join(productionFixture, 'src/lib.rs')))
      .digest('hex'),
    productionFixtureSourceDigest,
    'production compiler orchestration modified project source',
  );

  const observedDirectory = join(scratch, 'observed');
  const observedTarget = join(scratch, 'observed-target');
  run('cargo', ['test', '--manifest-path', fixture, '--no-run'], {
    env: {
      CARGO_TARGET_DIR: observedTarget,
      RUSTC_WRAPPER: wrapper,
      SUPERCOV_RUST_COMPILER_OUTPUT: observedDirectory,
    },
  });
  const observed = records(observedDirectory);
  const find = (definition) =>
    observed.find(
      (record) =>
        record.crate === 'supercov_rustc_spike_fixture' &&
        record.definition === definition,
    );

  const declarative = find('generated_by_rules');
  assert.equal(declarative?.expanded, true);
  assert.match(
    declarative.span,
    new RegExp(`src/lib\\.rs:${sourceLine('pub fn generated_by_rules')}:`),
  );
  assert.match(
    declarative.callsite,
    new RegExp(`src/lib\\.rs:${sourceLine('generated_function!();')}:`),
  );

  const procedural = find('generated_by_proc');
  assert.equal(procedural?.expanded, true);
  assert.match(
    procedural.callsite,
    new RegExp(
      `src/lib\\.rs:${sourceLine('probe_macros::generated_function!();')}:`,
    ),
  );

  const externalDeclarative = find('generated_by_external_rules');
  assert.equal(externalDeclarative?.expanded, true);
  assert.match(externalDeclarative.span, /external-rules\/src\/lib\.rs:/);
  assert.match(
    externalDeclarative.callsite,
    new RegExp(
      `src/lib\\.rs:${sourceLine('external_rules::external_choice_function!(generated_by_external_rules);')}:`,
    ),
  );

  const derived = find('DerivedChoice::derived_choice');
  assert.equal(derived?.expanded, true);
  assert.match(
    derived.callsite,
    new RegExp(
      `src/lib\\.rs:${sourceLine('#[derive(probe_macros::SupercovChoice)]')}:`,
    ),
  );

  const generated = find('generated_by_build_script');
  assert.equal(generated?.expanded, false);
  assert.match(generated.span, /\/out\/generated\.rs:/);

  assert.equal(find('const_decision')?.kind, 'Fn');
  assert.equal(find('CONST_VALUE')?.kind, 'Const');
  assert.equal(find('authored')?.expanded, false);

  const identityDirectoryA = join(scratch, 'identity-a');
  const identityDirectoryB = join(scratch, 'identity-b');
  run('cargo', ['build', '--quiet', '--manifest-path', fixture, '--lib'], {
    env: {
      CARGO_TARGET_DIR: join(scratch, 'identity-target-a'),
      RUSTC_WRAPPER: wrapper,
      SUPERCOV_RUST_COMPILER_OUTPUT: identityDirectoryA,
    },
  });
  run('cargo', ['build', '--quiet', '--manifest-path', fixture, '--lib'], {
    env: {
      CARGO_TARGET_DIR: join(scratch, 'identity-target-b'),
      RUSTC_WRAPPER: wrapper,
      SUPERCOV_RUST_COMPILER_OUTPUT: identityDirectoryB,
    },
  });
  const identityManifestA = crateManifest(
    identityDirectoryA,
    'supercov_rustc_spike_fixture',
  );
  const identityManifestB = crateManifest(
    identityDirectoryB,
    'supercov_rustc_spike_fixture',
  );
  const identityManifestPath = join(
    identityDirectoryA,
    readdirSync(identityDirectoryA).find(
      (name) =>
        name.startsWith('manifest-') &&
        name.endsWith('-supercov_rustc_spike_fixture.json'),
    ),
  );
  const productionValidation = run(
    supercov,
    ['__validate-rust-compiler-manifest'],
    {env: {SUPERCOV_INTERNAL_INPUT_FILE: identityManifestPath}},
  );
  assert.equal(productionValidation.stdout.trim(), 'supercov_rustc_spike_fixture');
  const identitySourcesA = compilerSources(
    identityDirectoryA,
    'supercov_rustc_spike_fixture',
  );
  const identitySourcesB = compilerSources(
    identityDirectoryB,
    'supercov_rustc_spike_fixture',
  );
  const normalized = JSON.parse(
    run(supercov, ['__normalize-rust-compiler-manifest'], {
      input: JSON.stringify({
        manifest: identityManifestA,
        sources: identitySourcesA,
      }),
    }).stdout,
  );
  assert.equal(normalized.manifest.scope.language, 'rust');
  assert.equal(normalized.manifest.scope.crate, 'supercov_rustc_spike_fixture');
  assert.equal(normalized.manifest.scope.sourceFingerprint.algorithm, 'sha256');
  assert.match(normalized.manifest.scope.sourceFingerprint.digest, /^[0-9a-f]{64}$/);
  assert.equal(
    normalized.manifest.scope.sourceFingerprint.files,
    Object.keys(identitySourcesA).length,
  );
  assert(
    normalized.manifest.scope.sourceFingerprint.generatedFiles > 0,
    'the compiler source fingerprint omitted build-script output',
  );
  assert.equal(normalized.manifest.points.length, identityManifestA.points.length);
  assert.equal(normalized.manifest.branches.length, identityManifestA.branches.length);
  assert.equal(normalized.manifest.decisions.length, identityManifestA.decisions.length);
  assert(
    Object.keys(normalized.hitObligationsByOrdinal).length >
      identityManifestA.points.length,
    'normalized ordinal resolver omitted branch alternatives',
  );
  assert.deepEqual(
    identityManifestA,
    identityManifestB,
    'manifest candidate changed across clean target directories',
  );
  const normalizedB = JSON.parse(
    run(supercov, ['__normalize-rust-compiler-manifest'], {
      input: JSON.stringify({
        manifest: identityManifestB,
        sources: identitySourcesB,
      }),
    }).stdout,
  );
  assert.equal(
    normalized.manifest.scope.sourceFingerprint.digest,
    normalizedB.manifest.scope.sourceFingerprint.digest,
    'full compiler source fingerprint changed across clean target directories',
  );

  const changedGeneratedDirectory = join(scratch, 'generated-variant-output');
  run('cargo', ['build', '--quiet', '--manifest-path', fixture, '--lib'], {
    env: {
      // Reuse the exact baseline target. Cargo must rerun the build script and
      // root compilation when its declared input changes; a clean target would
      // not exercise stale generated-output reuse.
      CARGO_TARGET_DIR: join(scratch, 'identity-target-a'),
      RUSTC_WRAPPER: wrapper,
      SUPERCOV_RUST_COMPILER_OUTPUT: changedGeneratedDirectory,
      SUPERCOV_GENERATED_VARIANT: 'changed!',
    },
  });
  const changedGeneratedManifest = crateManifest(
    changedGeneratedDirectory,
    'supercov_rustc_spike_fixture',
  );
  const changedGeneratedSources = compilerSources(
    changedGeneratedDirectory,
    'supercov_rustc_spike_fixture',
  );
  assert.deepEqual(
    changedGeneratedManifest,
    identityManifestA,
    'a comment outside generated obligations changed the frozen denominator candidate',
  );
  assert.notEqual(
    changedGeneratedSources['generated:package:.:generated.rs']?.source,
    identitySourcesA['generated:package:.:generated.rs']?.source,
    'the generated-source variant fixture did not change its full bytes',
  );
  const changedGeneratedNormalized = JSON.parse(
    run(supercov, ['__normalize-rust-compiler-manifest'], {
      input: JSON.stringify({
        manifest: changedGeneratedManifest,
        sources: changedGeneratedSources,
      }),
    }).stdout,
  );
  assert.notEqual(
    changedGeneratedNormalized.manifest.scope.sourceFingerprint.digest,
    normalized.manifest.scope.sourceFingerprint.digest,
    'full compiler source fingerprint ignored generated bytes outside obligations',
  );
  const normalizedWithoutFingerprint = structuredClone(normalized.manifest);
  const changedWithoutFingerprint = structuredClone(
    changedGeneratedNormalized.manifest,
  );
  delete normalizedWithoutFingerprint.scope.sourceFingerprint;
  delete changedWithoutFingerprint.scope.sourceFingerprint;
  assert.deepEqual(
    changedWithoutFingerprint,
    normalizedWithoutFingerprint,
    'the generated variant changed more than its full-source fingerprint',
  );

  assert.equal(identityManifestA.schema, 'supercov-rust-manifest-candidate-v4');
  assert.equal(identityManifestA.model, 'rust-source-v1');
  assert.equal(identityManifestA.measurementComplete, false);
  assert.deepEqual(identityManifestA.limitations, [
    'RUST_FRONTEND_PRIVATE: the frozen R1-R4 promotion matrix is not complete',
  ]);
  const allIds = [
    ...identityManifestA.points.map(({id}) => id),
    ...identityManifestA.branches.flatMap((branch) => [
      branch.id,
      ...branch.alternatives.map(({id}) => id),
    ]),
    ...identityManifestA.decisions.map(({id}) => id),
    ...identityManifestA.selectionGroups.map(({id}) => id),
  ];
  assert.equal(
    new Set(allIds).size,
    allIds.length,
    'manifest candidate contains colliding obligation IDs',
  );
  assert(
    identityManifestA.points.some(({kind}) => kind === 'statement'),
    'compiler manifest did not emit statement points',
  );
  assert(
    identityManifestA.branches.every(({kind}) =>
      [
        'decision-outcome',
        'loop-entry',
        'match-arm',
        'let-else',
        'try-operator',
        'assertion-outcome',
        'logical-selection',
      ].includes(kind),
    ),
    'compiler manifest emitted a branch kind outside the frozen Rust contract',
  );
  assert(
    identityManifestA.decisions.every(({kind}) =>
      [
        'if',
        'if-let',
        'while',
        'while-let',
        'let-chain',
        'match-guard',
        'assertion',
      ].includes(kind),
    ),
    'compiler manifest emitted a decision kind outside the frozen Rust contract',
  );
  for (const definition of [
    'for_values',
    'for_break',
    'two_for_values',
    'nested_for_values',
    'interrupted_for',
  ]) {
    assert(
      !identityManifestA.points.some(
        (point) =>
          point.definitions.includes(definition) &&
          point.provenance === 'synthetic-expansion',
      ),
      `compiler for-loop scaffolding leaked into ${definition} points`,
    );
  }
  const compoundDecision = decisionFor(identityManifestA, 'compound');
  assert.equal(compoundDecision?.kind, 'if');
  assert.equal(compoundDecision?.conditions.length, 2);
  assert.deepEqual(
    compoundDecision?.conditions.map(({source}) => source),
    ['left', 'right'],
  );
  assert.deepEqual(
    decisionFor(identityManifestA, 'disjoined')?.conditions.map(({source}) => source),
    ['left', 'right'],
  );
  assert.deepEqual(
    decisionFor(identityManifestA, 'mixed')?.conditions.map(({source}) => source),
    ['first', 'second', 'third'],
  );
  const patternDecision = decisionFor(identityManifestA, 'pattern');
  assert.equal(patternDecision?.kind, 'if-let');
  assert.equal(patternDecision?.conditions.length, 1);
  const chainedDecision = decisionFor(identityManifestA, 'chained');
  assert.equal(chainedDecision?.kind, 'let-chain');
  assert.deepEqual(
    chainedDecision?.conditions.map(({source}) => source),
    ['let Some(value) = value', 'value', 'enabled'],
  );
  // Both arms of shared_arm_body come from ONE macro body fragment, so they
  // share a body span and can only be separated by the discriminant. Two
  // distinct arm obligations must survive, and neither may be declined —
  // binding them by span collapses both onto one block and the misbind
  // post-condition then declines the whole body's match plans.
  const sharedArms = branchesFor(
    identityManifestA,
    'shared_arm_body',
    'match-arm',
  );
  assert.equal(sharedArms.length, 2, 'both shared-body arms must bind');
  assert.equal(new Set(sharedArms.map(({id}) => id)).size, 2);
  // Binding is deliberately NOT asserted here: the identity manifests are
  // built without SUPERCOV_RUST_INSTRUMENT_MIR, so they carry no
  // unmeasuredObligations and any "did not decline" check against them passes
  // vacuously. Two distinct arm obligations surviving is the part this
  // manifest can actually prove; the binding itself is covered by the
  // corpus crates, where the shape appears throughout either and http.
  // A negated chain decomposes: `!(first || second)` has two conditions and one
  // short-circuit selection, not the single merged condition it was recorded as
  // before. Values are read from the fixture source, not from observed output.
  const negatedChainDecision = decisionFor(identityManifestA, 'negated_chain');
  assert.equal(negatedChainDecision?.kind, 'if');
  assert.deepEqual(
    negatedChainDecision?.conditions.map(({source}) => source),
    ['first', 'second'],
  );
  assert.equal(negatedChainDecision?.logicalSelections.length, 1);
  // The cfg! operand folds at compile time, so decomposing would produce
  // conditions with no switch to bind to. Falling back to one atomic condition
  // keeps the decision measurable; dropping it would be a silent coverage hole,
  // and leaving its short-circuits unclaimed would strand them as orphan
  // selection obligations that can never bind.
  const negatedCfgDecision = decisionFor(
    identityManifestA,
    'negated_chain_with_cfg',
  );
  assert.equal(negatedCfgDecision?.kind, 'if');
  assert.equal(negatedCfgDecision?.conditions.length, 1);
  assert.deepEqual(negatedCfgDecision?.logicalSelections, []);
  assert.ok(
    branchFor(identityManifestA, 'negated_chain_with_cfg', 'decision-outcome'),
    'the authored decision must stay in the denominator',
  );
  assert.deepEqual(
    branchesFor(
      identityManifestA,
      'negated_chain_with_cfg',
      'logical-selection',
    ),
    [],
    'subsumed short-circuits must not reappear as standalone obligations',
  );
  const declarativeRoot = obligationFor(
    identityManifestA,
    'generated_by_rules',
  );
  const declarativeRepeated = obligationFor(
    identityManifestA,
    'repeated_expansions::generated_by_rules',
  );
  // Two invocations of one macro_rules body are two obligations, matching what
  // the procedural case below has always done. They used to share an id, so
  // exercising either call site marked BOTH covered -- coverage reported for
  // code that never ran. The bodies are identical, so only the expanding
  // definition tells them apart.
  assert.notEqual(declarativeRoot?.id, declarativeRepeated?.id);
  assert.equal(declarativeRoot?.provenance, 'authored-expansion');
  assert.equal(declarativeRepeated?.provenance, 'authored-expansion');
  assert.deepEqual(declarativeRoot?.definitions, ['generated_by_rules']);
  assert.deepEqual(declarativeRepeated?.definitions, [
    'repeated_expansions::generated_by_rules',
  ]);
  assert.notEqual(
    decisionFor(identityManifestA, 'generated_by_rules')?.id,
    decisionFor(identityManifestA, 'repeated_expansions::generated_by_rules')
      ?.id,
  );
  assert.deepEqual(decisionFor(identityManifestA, 'generated_by_rules')
    ?.definitions, ['generated_by_rules']);
  const proceduralRoot = obligationFor(identityManifestA, 'generated_by_proc');
  const proceduralRepeated = obligationFor(
    identityManifestA,
    'repeated_expansions::generated_by_proc',
  );
  assert.equal(proceduralRoot?.provenance, 'synthetic-expansion');
  assert.equal(proceduralRepeated?.provenance, 'synthetic-expansion');
  assert.notEqual(proceduralRoot?.id, proceduralRepeated?.id);
  assert.notEqual(
    decisionFor(identityManifestA, 'generated_by_proc')?.id,
    decisionFor(identityManifestA, 'repeated_expansions::generated_by_proc')?.id,
  );
  assert.deepEqual(
    decisionFor(identityManifestA, 'generated_by_proc')?.conditions.map(
      ({source}) => source,
    ),
    ['value'],
  );
  const externalRoot = obligationFor(
    identityManifestA,
    'generated_by_external_rules',
  );
  const externalRepeated = obligationFor(
    identityManifestA,
    'repeated_expansions::generated_by_external_rules',
  );
  // Same rule across a crate boundary: a macro from another crate expanded at
  // three sites is three obligations, all still attributed to the macro's own
  // source file.
  assert.notEqual(externalRoot?.id, externalRepeated?.id);
  assert.equal(externalRoot?.provenance, 'authored-expansion');
  assert.equal(externalRepeated?.provenance, 'authored-expansion');
  assert.equal(externalRoot?.sourceKey, 'source:external-rules/src/lib.rs');
  assert.equal(externalRepeated?.sourceKey, 'source:external-rules/src/lib.rs');
  assert.deepEqual(externalRoot?.definitions, ['generated_by_external_rules']);
  assert.deepEqual(externalRepeated?.definitions, [
    'repeated_expansions::generated_by_external_rules',
  ]);
  const externalDecision = decisionFor(
    identityManifestA,
    'generated_by_external_rules',
  );
  assert.equal(externalDecision?.sourceKey, 'source:external-rules/src/lib.rs');
  assert.deepEqual(externalDecision?.conditions.map(({source}) => source), [
    'value',
  ]);
  assert.deepEqual(externalDecision?.definitions, externalRoot?.definitions);
  assert.match(
    identitySourcesA['source:external-rules/src/lib.rs']?.source ?? '',
    /macro_rules! external_choice_function/,
  );

  const attributedRoot = obligationFor(identityManifestA, 'attributed_choice');
  assert.equal(attributedRoot?.provenance, 'synthetic-expansion');
  assert.equal(attributedRoot?.sourceKey, 'source:src/lib.rs');
  assert.match(
    attributedRoot?.canonical ?? '',
    /probe_macros::generated_choice/,
  );
  const attributedDecision = decisionFor(identityManifestA, 'attributed_choice');
  assert.deepEqual(
    attributedDecision?.conditions.map(({source}) => source),
    ['first', 'second'],
  );
  assert.equal(attributedDecision?.logicalSelections.length, 1);

  const deriveRoot = obligationFor(
    identityManifestA,
    'DerivedChoice::derived_choice',
  );
  assert.equal(deriveRoot?.provenance, 'synthetic-expansion');
  assert.equal(deriveRoot?.sourceKey, 'source:src/lib.rs');
  assert.match(deriveRoot?.canonical ?? '', /probe_macros::SupercovChoice/);
  assert.deepEqual(
    decisionFor(
      identityManifestA,
      'DerivedChoice::derived_choice',
    )?.conditions.map(({source}) => source),
    ['value'],
  );
  const unusedDeriveRoot = obligationFor(
    identityManifestA,
    'UnusedDerivedChoice::derived_choice',
  );
  assert.equal(unusedDeriveRoot?.provenance, 'synthetic-expansion');
  assert.equal(unusedDeriveRoot?.sourceKey, 'source:src/lib.rs');
  assert.match(
    unusedDeriveRoot?.canonical ?? '',
    /probe_macros::SupercovChoice/,
  );
  assert.notEqual(
    unusedDeriveRoot?.id,
    deriveRoot?.id,
    'two derive invocations incorrectly shared one synthetic point identity',
  );
  assert.notEqual(
    decisionFor(
      identityManifestA,
      'UnusedDerivedChoice::derived_choice',
    )?.id,
    decisionFor(
      identityManifestA,
      'DerivedChoice::derived_choice',
    )?.id,
    'two derive invocations incorrectly shared one synthetic decision identity',
  );
  const probeMacroManifest = crateManifest(identityDirectoryA, 'probe_macros');
  const opaqueAuthoredMacroGuard = probeMacroManifest.decisions.find(
    ({kind, definitions, conditions}) =>
      kind === 'match-guard' &&
      definitions.includes('derive_choice::{closure#0}') &&
      conditions.length === 1 &&
      conditions[0].source ===
        'matches!(identifier.to_string().as_str(), "struct" | "enum" | "union")',
  );
  assert(opaqueAuthoredMacroGuard, 'authored matches! guard lost its callsite decision');
  assert.equal(
    opaqueAuthoredMacroGuard.sourceKey,
    'source:probe-macros/src/lib.rs',
  );
  const deriveParserGroup = probeMacroManifest.selectionGroups.find(({arms}) =>
    arms.some(({guardDecisionId}) =>
      guardDecisionId === opaqueAuthoredMacroGuard.id,
    ),
  );
  assert(deriveParserGroup, 'authored matches! guard lost its match-arm ownership');
  assert(
    deriveParserGroup.arms
      .filter(({guarded}) => guarded)
      .every(({guardDecisionId}) => guardDecisionId !== null),
    'an authored macro match guard normalized without a decision identity',
  );
  const generatedObligation = obligationFor(
    identityManifestA,
    'generated_by_build_script',
  );
  assert.equal(generatedObligation?.provenance, 'generated-source');
  assert.equal(
    generatedObligation?.sourceKey,
    'generated:package:.:generated.rs',
  );
  const externalGeneratedSource = join(scratch, 'external-generated.rs');
  writeFileSync(
    externalGeneratedSource,
    'pub fn generated_by_build_script(value: bool) -> usize { if value { 7 } else { 9 } }\n',
  );
  const symlinkOutput = join(scratch, 'generated-symlink-output');
  run('cargo', ['build', '--quiet', '--manifest-path', fixture, '--lib'], {
    env: {
      CARGO_TARGET_DIR: join(scratch, 'generated-symlink-target'),
      RUSTC_WRAPPER: wrapper,
      SUPERCOV_RUST_COMPILER_OUTPUT: symlinkOutput,
      SUPERCOV_GENERATED_SYMLINK_TARGET: externalGeneratedSource,
    },
  });
  const symlinkManifest = crateManifest(
    symlinkOutput,
    'supercov_rustc_spike_fixture',
  );
  assert(
    !obligationFor(symlinkManifest, 'generated_by_build_script') &&
      !decisionFor(symlinkManifest, 'generated_by_build_script'),
    'an unowned generated-source symlink entered the measured denominator',
  );
  assert.equal(
    symlinkManifest.limitations.filter((limitation) =>
      limitation.includes('RUST_SOURCE_IDENTITY_UNRESOLVED: generated_by_build_script'),
    ).length,
    3,
    'an unowned generated-source symlink was not reported at every source obligation surface',
  );
  assert(
    symlinkManifest.limitations.every(
      (limitation) =>
        !limitation.includes('generated_by_build_script') ||
        /generated source is not a regular file|generated source escaped its target root/.test(
          limitation,
        ),
    ),
    'an unowned generated-source symlink produced an unrelated limitation',
  );
  assert(
    !JSON.stringify(identityManifestA).includes(scratch),
    'manifest candidate leaked an ephemeral target path',
  );
  const collision = run(
    'cargo',
    ['build', '--quiet', '--manifest-path', fixture, '--lib'],
    {
      expectFailure: true,
      env: {
        CARGO_TARGET_DIR: join(scratch, 'collision-target'),
        RUSTC_WRAPPER: wrapper,
        SUPERCOV_RUST_COMPILER_OUTPUT: join(scratch, 'collision-output'),
        SUPERCOV_RUSTC_SPIKE_FORCE_ID_COLLISION: '1',
      },
    },
  );
  assert.match(collision.stderr, /Supercov Rust obligation ID collision/);
  const probeCollision = run(
    'cargo',
    ['build', '--quiet', '--manifest-path', fixture, '--lib'],
    {
      expectFailure: true,
      env: {
        CARGO_TARGET_DIR: join(scratch, 'probe-collision-target'),
        RUSTC_WRAPPER: wrapper,
        SUPERCOV_RUST_COMPILER_OUTPUT: join(scratch, 'probe-collision-output'),
        SUPERCOV_RUSTC_SPIKE_FORCE_PROBE_COLLISION: '1',
      },
    },
  );
  assert.match(probeCollision.stderr, /Supercov Rust probe ordinal collision/);

  const baselineBehavior = run(
    'cargo',
    ['run', '--quiet', '--manifest-path', fixture, '--bin', 'behavior'],
    {env: {CARGO_TARGET_DIR: join(scratch, 'baseline-behavior-target')}},
  );
  const instrumentedDirectory = join(scratch, 'instrumented');
  const behaviorTransport = createTransport('instrumented-behavior');
  const instrumentedEnvironment = {
    CARGO_TARGET_DIR: join(scratch, 'instrumented-target'),
    RUSTC_WRAPPER: wrapper,
    SUPERCOV_RUST_COMPILER_OUTPUT: instrumentedDirectory,
    SUPERCOV_RUST_INSTRUMENT_MIR: '1',
    SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
    SUPERCOV_RUST_TRANSPORT_FILE: behaviorTransport.path,
    SUPERCOV_RUST_TRANSPORT_TOKEN: behaviorTransport.tokenHex,
    SUPERCOV_RUST_CONTEXT_ID: transportContext.toString(16).padStart(16, '0'),
    LLVM_PROFILE_FILE: join(scratch, 'must-not-exist-%p.profraw'),
  };
  const instrumentedBehavior = run(
    'cargo',
    ['run', '--quiet', '--manifest-path', fixture, '--bin', 'behavior'],
    {env: instrumentedEnvironment},
  );
  assert.equal(instrumentedBehavior.stdout, baselineBehavior.stdout);
  assert.equal(instrumentedBehavior.stderr, baselineBehavior.stderr);
  const compileFailCase = (name) => {
    const source = join(fixtureRoot, `compile-fail/${name}.rs`);
    const baselineOutput = join(scratch, `${name}-baseline.rmeta`);
    const instrumentedOutput = join(scratch, `${name}-instrumented.rmeta`);
    const compilerOutput = join(scratch, `${name}-output`);
    const baseline = run(
      'rustc',
      [
        '--edition=2024',
        '--crate-type=lib',
        '--emit=metadata',
        '-o',
        baselineOutput,
        source,
      ],
      {expectFailure: true},
    );
    const instrumented = run(
      wrapper,
      [
        'rustc',
        '--edition=2024',
        '--crate-type=lib',
        '--emit=metadata',
        '-o',
        instrumentedOutput,
        source,
      ],
      {
        expectFailure: true,
        env: {
          SUPERCOV_RUST_COMPILER_OUTPUT: compilerOutput,
          SUPERCOV_RUST_INSTRUMENT_MIR: '1',
          SUPERCOV_RUST_INSTRUMENT_CTFE: '1',
          DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
            .filter(Boolean)
            .join(':'),
          LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
            .filter(Boolean)
            .join(':'),
        },
      },
    );
    const normalize = (value) =>
      value
        .replaceAll(source, `<${name}>`)
        .replaceAll(baselineOutput, '<output>')
        .replaceAll(instrumentedOutput, '<output>');
    assert.equal(
      normalize(instrumented.stderr),
      normalize(baseline.stderr),
      `Supercov changed the stable Rust 1.95 ${name} compile failure`,
    );
    assert(
      !existsSync(compilerOutput) || readdirSync(compilerOutput).length === 0,
      `a rejected ${name} compilation published partial coverage evidence`,
    );
    return {baseline, instrumented};
  };
  const {baseline: constTryBaseline, instrumented: constTryInstrumented} =
    compileFailCase('const-try');
  assert.doesNotMatch(constTryInstrumented.stderr, /std::result::Result/);
  assert.match(constTryBaseline.stderr, /E0658/);
  assert.match(constTryBaseline.stderr, /Try.*not yet stable as a const trait/s);
  const {baseline: constAssertFailure} = compileFailCase('const-assert');
  assert.match(constAssertFailure.stderr, /E0080/);
  assert.match(
    constAssertFailure.stderr,
    /evaluation panicked: assertion failed: value/,
  );
  for (const assertion of ['const-assert-eq', 'const-assert-ne']) {
    const {baseline} = compileFailCase(assertion);
    assert.match(baseline.stderr, /E0015/);
    assert.match(baseline.stderr, /assert_failed/);
    assert.match(baseline.stderr, /cannot call non-const function/);
  }
  const {baseline: constTraitBaseline} = compileFailCase('const-trait');
  assert.match(constTraitBaseline.stderr, /E0658/);
  assert.match(constTraitBaseline.stderr, /const trait impls are experimental/);
  assert.match(constTraitBaseline.stderr, /const traits are not yet supported on stable Rust/);
  const loggingSource = join(fixtureRoot, 'compile-pass/const-log.rs');
  const baselineLog = join(scratch, 'const-log-baseline.jsonl');
  const instrumentedLog = join(scratch, 'const-log-instrumented.jsonl');
  const loggingCompilerOutput = join(scratch, 'const-log-output');
  const loggingEnvironment = (output) => ({
    RUSTC_LOG: 'rustc_const_eval::interpret::step=info',
    RUSTC_LOG_COLOR: 'never',
    RUSTC_LOG_FORMAT_JSON: '1',
    RUSTC_LOG_OUTPUT_TARGET: output,
  });
  const ctfeCompilerEnvironment = (output, extra = {}) => ({
    SUPERCOV_RUST_COMPILER_OUTPUT: output,
    SUPERCOV_RUST_INSTRUMENT_MIR: '1',
    SUPERCOV_RUST_INSTRUMENT_CTFE: '1',
    DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
      .filter(Boolean)
      .join(':'),
    LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
      .filter(Boolean)
      .join(':'),
    ...extra,
  });
  const baselineLoggedCompilation = run(
    'rustc',
    [
      '--edition=2024',
      '--crate-name=const_log',
      '--crate-type=lib',
      '--emit=metadata',
      '-o',
      join(scratch, 'const-log-baseline.rmeta'),
      loggingSource,
    ],
    {env: loggingEnvironment(baselineLog)},
  );
  const instrumentedLoggedCompilation = run(
    wrapper,
    [
      'rustc',
      '--edition=2024',
      '--crate-name=const_log',
      '--crate-type=lib',
      '--emit=metadata',
      '-o',
      join(scratch, 'const-log-instrumented.rmeta'),
      loggingSource,
    ],
    {
      env: {
        ...loggingEnvironment(instrumentedLog),
        ...ctfeCompilerEnvironment(loggingCompilerOutput),
      },
    },
  );
  assert.equal(baselineLoggedCompilation.stdout, '');
  assert.equal(baselineLoggedCompilation.stderr, '');
  assert.equal(instrumentedLoggedCompilation.stdout, '');
  assert.equal(instrumentedLoggedCompilation.stderr, '');
  for (const [kind, path] of [
    ['baseline', baselineLog],
    ['instrumented', instrumentedLog],
  ]) {
    const records = readFileSync(path, 'utf8').trim().split('\n').map(JSON.parse);
    assert(records.length > 0, `${kind} RUSTC_LOG output was empty`);
    assert(
      records.some(({target}) => target === 'rustc_const_eval::interpret::step'),
      `${kind} RUSTC_LOG output omitted the requested CTFE target`,
    );
  }
  assert(
    ctfeBundles(loggingCompilerOutput).some(({value}) => value.events.length > 0),
    'user RUSTC_LOG configuration suppressed Supercov CTFE observations',
  );

  const directCtfeCompileArguments = (crateName, output) => [
    'rustc',
    '--edition=2024',
    `--crate-name=${crateName}`,
    '--crate-type=lib',
    '--emit=metadata',
    '-o',
    output,
    loggingSource,
  ];
  const enospcCompilerOutput = join(scratch, 'const-log-enospc-output');
  const enospcCompilation = run(
    wrapper,
    directCtfeCompileArguments(
      'const_log_enospc',
      join(scratch, 'const-log-enospc.rmeta'),
    ),
    {
      expectFailure: true,
      env: ctfeCompilerEnvironment(enospcCompilerOutput, {
        SUPERCOV_RUSTC_SPIKE_CTFE_WRITE_FAULT: 'enospc',
      }),
    },
  );
  assert.match(enospcCompilation.stderr, /No space left on device/);
  assert.deepEqual(
    readdirSync(enospcCompilerOutput).filter((name) => name.includes('ctfe-unit-')),
    [],
    'an ENOSPC publication failure left a final or partial CTFE unit',
  );

  const killedCompilerOutput = join(scratch, 'const-log-killed-output');
  const killedCompilerReady = join(scratch, 'const-log-killed.ready');
  const killedCompilation = spawnCommand(
    wrapper,
    directCtfeCompileArguments(
      'const_log_killed',
      join(scratch, 'const-log-killed.rmeta'),
    ),
    {
      env: ctfeCompilerEnvironment(killedCompilerOutput, {
        SUPERCOV_RUSTC_SPIKE_CTFE_WRITE_FAULT: 'wait-after-write',
        SUPERCOV_RUSTC_SPIKE_CTFE_WRITE_READY: killedCompilerReady,
      }),
    },
  );
  for (let attempt = 0; attempt < 200 && !existsSync(killedCompilerReady); attempt += 1) {
    assert.equal(
      killedCompilation.child.exitCode,
      null,
      'the compiler exited before reaching the CTFE publication fault point',
    );
    await delay(25);
  }
  assert(existsSync(killedCompilerReady), 'the CTFE publication fault point was not reached');
  assert(killedCompilation.child.kill('SIGKILL'), 'failed to kill the CTFE compiler');
  const killedResult = await killedCompilation.result;
  assert.equal(killedResult.signal, 'SIGKILL');
  assert.deepEqual(
    ctfeBundles(killedCompilerOutput),
    [],
    'a killed compiler published a final CTFE unit',
  );
  assert.equal(
    readdirSync(killedCompilerOutput).filter(
      (name) => name.startsWith('.ctfe-unit-') && name.endsWith('.partial'),
    ).length,
    1,
    'a killed compiler must leave exactly one recognizable unpublished CTFE unit',
  );

  const concurrentCompilerOutput = join(scratch, 'const-log-concurrent-output');
  await Promise.all(
    Array.from({length: 4}, (_, index) =>
      runAsync(
        wrapper,
        directCtfeCompileArguments(
          'const_log_concurrent',
          join(scratch, `const-log-concurrent-${index}.rmeta`),
        ),
        {env: ctfeCompilerEnvironment(concurrentCompilerOutput)},
      ),
    ),
  );
  const concurrentBundles = ctfeBundles(concurrentCompilerOutput);
  assert.equal(concurrentBundles.length, 4);
  assert.equal(new Set(concurrentBundles.map(({name}) => name)).size, 4);
  for (const {value} of concurrentBundles) {
    assert(value.mappings.length > 0, 'concurrent CTFE unit omitted mappings');
    assert(value.events.length > 0, 'concurrent CTFE unit omitted events');
  }
  assert.deepEqual(
    readdirSync(concurrentCompilerOutput).filter((name) => name.endsWith('.partial')),
    [],
    'successful concurrent CTFE publication left partial units',
  );
  assert.deepEqual(
    readdirSync(scratch).filter((name) => name.endsWith('.profraw')),
    [],
    'Supercov-owned instrumentation must not emit an LLVM profile',
  );
  const instrumentedBinary = readFileSync(
    join(scratch, 'instrumented-target/debug/behavior'),
  );
  assert(
    !instrumentedBinary.includes(Buffer.from('__llvm_profile')) &&
      !instrumentedBinary.includes(Buffer.from('__llvm_cov')),
    'the compiler companion linked native LLVM coverage machinery',
  );
  assert.match(baselineBehavior.stdout, /drop-order=\["panic-drop", "second", "first"\]/);
  assert.match(baselineBehavior.stdout, /decision-panic=true/);
  assert.match(
    baselineBehavior.stdout,
    /expanded=\[5, 3, 191, 181, 197, 193, 19, 17, 9\]/,
  );
  assert.match(baselineBehavior.stdout, /conditions=\[29, 31, 31, 4, 6, 1, 37, 41, 43, 43\]/);
  assert.match(baselineBehavior.stdout, /or-mixed=\[47, 47, 49, 53, 59, 53, 59\]/);
  assert.match(baselineBehavior.stdout, /nested=\[79, 71, 73, 73\]/);
  assert.match(baselineBehavior.stdout, /nested-expression=\[89, 83, 89, 83, 89\]/);
  assert.match(baselineBehavior.stdout, /while=\[0, 2, 0\]/);
  assert.match(baselineBehavior.stdout, /while-let=\[0, 5, 0, 0\]/);
  assert.match(baselineBehavior.stdout, /for=\[0, 5\]/);
  assert.match(baselineBehavior.stdout, /for-break=\[0, 7\]/);
  assert.match(baselineBehavior.stdout, /for-two=\[2, 3\]/);
  assert.match(baselineBehavior.stdout, /for-nested=\[0, 5\]/);
  assert.match(baselineBehavior.stdout, /for-panic=true/);
  assert.match(baselineBehavior.stdout, /match-panic=true/);
  assert.match(
    baselineBehavior.stdout,
    /assertion-panics=\[true, true, false, false, true, false, true, true, true, false, false, true, false, true, true, true, false, false, true, false, true, true, false, true, false, false, true\]/,
  );
  assert.match(baselineBehavior.stdout, /assertion-edge-panics=\[true, true\]/);
  assert.match(baselineBehavior.stdout, /assertion-order=\["left", "right"\]/);
  assert.match(baselineBehavior.stdout, /match=\[3, 2, 2, 0\]/);
  assert.match(baselineBehavior.stdout, /match-identical=\[7, 7, 9\]/);
  assert.match(baselineBehavior.stdout, /match-empty=true/);
  assert.match(baselineBehavior.stdout, /match-irrefutable=5/);
  assert.match(baselineBehavior.stdout, /match-generated-nested-proc=\[13, 24, 0\]/);
  assert.match(
    baselineBehavior.stdout,
    /match-generated-nested-scrutinee-proc=\[1, 2, 0\]/,
  );
  assert.match(
    baselineBehavior.stdout,
    /match-generated-nested-guard-proc=\[3, 2, 2, 0\]/,
  );
  assert.match(baselineBehavior.stdout, /let-else=\[7, 0\]/);
  assert.match(baselineBehavior.stdout, /let-else-nested=\[7, 0, 0\]/);
  assert.match(baselineBehavior.stdout, /let-else-two=\[5, 0, 2\]/);
  assert.match(baselineBehavior.stdout, /let-else-generated-proc=\[8, 0\]/);
  assert.match(baselineBehavior.stdout, /let-else-generated-two-proc=\[5, 0, 2\]/);
  assert.match(baselineBehavior.stdout, /try-result=\[Ok\(8\), Err\("no"\)\]/);
  assert.match(baselineBehavior.stdout, /try-option=\[Some\(8\), None\]/);
  assert.match(
    baselineBehavior.stdout,
    /try-two=\[Ok\(5\), Err\("first"\), Err\("second"\)\]/,
  );
  assert.match(
    baselineBehavior.stdout,
    /try-generated-proc=\[Ok\(9\), Err\("no"\)\]/,
  );
  assert.match(
    baselineBehavior.stdout,
    /try-generated-two-proc=\[Ok\(5\), Err\("first"\), Err\("second"\)\]/,
  );
  assert.match(
    baselineBehavior.stdout,
    /try-nested=\[Ok\(8\), Err\("inner"\), Err\("outer"\)\]/,
  );
  assert.match(
    baselineBehavior.stdout,
    /try-generated-nested-proc=\[Ok\(8\), Err\("inner"\), Err\("outer"\)\]/,
  );
  assert.match(baselineBehavior.stdout, /try-panic=true/);
  assert.match(baselineBehavior.stdout, /promoted=\[157, 3\]/);
  assert.match(
    baselineBehavior.stdout,
    /ctfe-surfaces=\[17, 29, 31, 43, 47, 53, 59, 61, 2, 67, 79, 89, 83, 89, 83, 103, 101, 97, 107, 109, 113, 131, 127, 0, 2, 0, 137, 137, 139, 149, 149, 151\]/,
  );
  assert.match(baselineBehavior.stdout, /match-unreachable=\[1, 2\]/);
  assert.match(baselineBehavior.stdout, /match-generated=\[23, 29\]/);
  assert.match(baselineBehavior.stdout, /match-generated-proc=\[31, 37\]/);
  assert.match(
    baselineBehavior.stdout,
    /match-generated-guarded-proc=\[3, 2, 2, 0\]/,
  );
  assert.match(baselineBehavior.stdout, /match-nested=\[3, 14, 0\]/);
  assert.match(baselineBehavior.stdout, /derived-order=\[true, false\]/);
  assert.match(baselineBehavior.stdout, /derived-if-let=\[3, 7\]/);
  assert.match(baselineBehavior.stdout, /loop-nested-match-proc=111/);
  assert.match(baselineBehavior.stdout, /adapter-flavor=\[11, 11, 12\]/);
  // One macro body invoked inside a match arm and outside any arm aggregates
  // into a single obligation; the enclosing arm belongs to the callsite, not
  // to the obligation, so the disagreement must not fail the compilation.
  assert.match(baselineBehavior.stdout, /macro-arm-aggregate=\[11, 22\]/);
  const runtimeManifest = crateManifest(
    instrumentedDirectory,
    'supercov_rustc_spike_fixture',
  );
  const runtimeSources = compilerSources(
    instrumentedDirectory,
    'supercov_rustc_spike_fixture',
  );
  const behaviorManifest = crateManifest(instrumentedDirectory, 'behavior');
  assert(
    behaviorManifest.decisions
      .filter((decision) => decision.definitions.includes('main'))
      .every((decision) => decision.kind === 'assertion'),
    'hidden assert!/println! implementation control flow leaked into the authored decision denominator',
  );
  const runtimeProbe = (definition) =>
    obligationFor(runtimeManifest, definition)?.probeOrdinal;
  const authoredProbe = runtimeProbe('authored');
  const fallibleProbe = runtimeProbe('fallible');
  const dropOrderProbe = runtimeProbe('drop_order');
  const panicProbe = runtimeProbe('panic_path');
  const promotedDefinitions = ['promoted_literal', 'promoted_array'];
  const promotedPoints = runtimeManifest.points.filter(({definitions}) =>
    definitions.some((definition) => promotedDefinitions.includes(definition)),
  );
  assert(
    promotedPoints.length >= 4,
    'promoted expressions lost their authored function/statement denominator',
  );
  assert.equal(
    runtimeManifest.decisions.filter(({definitions}) =>
      definitions.some((definition) => promotedDefinitions.includes(definition)),
    ).length,
    0,
    'constant promotion invented a source control decision',
  );
  assert.equal(
    runtimeManifest.branches.filter(({definitions}) =>
      definitions.some((definition) => promotedDefinitions.includes(definition)),
    ).length,
    0,
    'constant promotion invented a source branch alternative',
  );
  const whileInvocation = branchFor(
    runtimeManifest,
    'while_compound',
    'loop-entry',
  );
  const whileZero = whileInvocation.alternatives.find(
    ({label}) => label === 'zero iterations',
  )?.probeOrdinal;
  const whileEntered = whileInvocation.alternatives.find(
    ({label}) => label === 'entered',
  )?.probeOrdinal;
  const whileLetInvocation = branchFor(
    runtimeManifest,
    'while_let_chain',
    'loop-entry',
  );
  const whileLetZero = whileLetInvocation.alternatives.find(
    ({label}) => label === 'zero iterations',
  )?.probeOrdinal;
  const whileLetEntered = whileLetInvocation.alternatives.find(
    ({label}) => label === 'entered',
  )?.probeOrdinal;
  const {zero: forZero, entered: forEntered} = loopAlternativeOrdinals(
    branchFor(runtimeManifest, 'for_values', 'loop-entry'),
  );
  const {zero: forBreakZero, entered: forBreakEntered} =
    loopAlternativeOrdinals(
      branchFor(runtimeManifest, 'for_break', 'loop-entry'),
    );
  const twoForBranches = branchesFor(runtimeManifest, 'two_for_values', 'loop-entry');
  assert.equal(twoForBranches.length, 2, 'expected two sequential for branches');
  const twoForOrdinals = twoForBranches.map(loopAlternativeOrdinals);
  const nestedForBranches = branchesFor(
    runtimeManifest,
    'nested_for_values',
    'loop-entry',
  );
  assert.equal(nestedForBranches.length, 2, 'expected outer and inner for branches');
  const nestedForOrdinals = nestedForBranches.map(loopAlternativeOrdinals);
  const interruptedForOrdinals = loopAlternativeOrdinals(
    branchFor(runtimeManifest, 'interrupted_for', 'loop-entry'),
  );
  const letElseBranch = branchFor(runtimeManifest, 'let_else_value', 'let-else');
  const letElseMatched = letElseBranch.alternatives.find(
    ({label}) => label === 'matched',
  )?.probeOrdinal;
  const letElseFallback = letElseBranch.alternatives.find(
    ({label}) => label === 'else',
  )?.probeOrdinal;
  const letElseOrdinals = (branch) => ({
    matched: branch.alternatives.find(({label}) => label === 'matched')?.probeOrdinal,
    fallback: branch.alternatives.find(({label}) => label === 'else')?.probeOrdinal,
  });
  const nestedLetElse = letElseOrdinals(
    branchFor(runtimeManifest, 'nested_let_else', 'let-else'),
  );
  const twoLetElse = branchesFor(runtimeManifest, 'two_let_else', 'let-else')
    .sort((left, right) => left.start - right.start)
    .map(letElseOrdinals);
  assert.equal(twoLetElse.length, 2, 'expected two sequential let-else branches');
  const generatedLetElse = letElseOrdinals(
    branchFor(runtimeManifest, 'generated_let_else_by_proc', 'let-else'),
  );
  const generatedTwoLetElse = branchesFor(
    runtimeManifest,
    'generated_two_let_else_by_proc',
    'let-else',
  ).map(letElseOrdinals);
  assert.equal(
    generatedTwoLetElse.length,
    2,
    'expected two sequential synthetic let-else branches',
  );
  const additionalLetElseOrdinals = [
    nestedLetElse.matched,
    nestedLetElse.fallback,
    ...twoLetElse.flatMap(({matched, fallback}) => [matched, fallback]),
    generatedLetElse.matched,
    generatedLetElse.fallback,
    ...generatedTwoLetElse.flatMap(({matched, fallback}) => [matched, fallback]),
  ];
  const tryOrdinals = (branch) => ({
    continued: branch.alternatives.find(({label}) => label === 'continued')
      ?.probeOrdinal,
    returned: branch.alternatives.find(({label}) => label === 'early return')
      ?.probeOrdinal,
  });
  const tryResult = tryOrdinals(
    branchFor(runtimeManifest, 'try_result', 'try-operator'),
  );
  const tryOption = tryOrdinals(
    branchFor(runtimeManifest, 'try_option', 'try-operator'),
  );
  const twoTry = branchesFor(runtimeManifest, 'two_try_results', 'try-operator')
    .sort((left, right) => left.start - right.start)
    .map(tryOrdinals);
  assert.equal(twoTry.length, 2, 'expected two sequential authored try operators');
  const generatedTry = tryOrdinals(
    branchFor(runtimeManifest, 'generated_try_by_proc', 'try-operator'),
  );
  const generatedTwoTry = branchesFor(
    runtimeManifest,
    'generated_two_try_by_proc',
    'try-operator',
  ).map(tryOrdinals);
  assert.equal(
    generatedTwoTry.length,
    2,
    'expected two sequential synthetic try operators',
  );
  const panicTry = tryOrdinals(
    branchFor(runtimeManifest, 'panic_before_try', 'try-operator'),
  );
  const nestedTry = branchesFor(runtimeManifest, 'nested_try_result', 'try-operator')
    .sort((left, right) => left.start - right.start)
    .map(tryOrdinals);
  assert.equal(nestedTry.length, 2, 'expected two nested authored try operators');
  const generatedNestedTry = branchesFor(
    runtimeManifest,
    'generated_nested_try_by_proc',
    'try-operator',
  ).map(tryOrdinals);
  assert.equal(
    generatedNestedTry.length,
    2,
    'expected two nested synthetic try operators',
  );
  const committedTryOrdinals = [
    tryResult.continued,
    tryResult.returned,
    tryOption.continued,
    tryOption.returned,
    ...twoTry.flatMap(({continued, returned}) => [continued, returned]),
    generatedTry.continued,
    generatedTry.returned,
    ...generatedTwoTry.flatMap(({continued, returned}) => [continued, returned]),
    ...nestedTry.flatMap(({continued, returned}) => [continued, returned]),
    ...generatedNestedTry.flatMap(({continued, returned}) => [continued, returned]),
  ];
  const matchValueGroups = matchGroupsFor(runtimeManifest, 'match_value');
  const matchIdenticalGroups = matchGroupsFor(runtimeManifest, 'match_identical');
  const matchEmptyGroups = matchGroupsFor(runtimeManifest, 'match_empty');
  const generatedMatchGroups = matchGroupsFor(runtimeManifest, 'generated_match');
  const unreachableMatchGroups = matchGroupsFor(
    runtimeManifest,
    'match_unreachable',
  );
  const generatedProcMatchGroups = matchGroupsFor(
    runtimeManifest,
    'generated_match_by_proc',
  );
  const generatedGuardedProcMatchGroups = matchGroupsFor(
    runtimeManifest,
    'generated_guarded_match_by_proc',
  );
  const generatedNestedProcMatchGroups = matchGroupsFor(
    runtimeManifest,
    'generated_nested_match_by_proc',
  );
  const generatedNestedScrutineeProcMatchGroups = matchGroupsFor(
    runtimeManifest,
    'generated_nested_scrutinee_match_by_proc',
  );
  const generatedNestedGuardProcMatchGroups = matchGroupsFor(
    runtimeManifest,
    'generated_nested_guard_match_by_proc',
  );
  const nestedMatchGroups = matchGroupsFor(runtimeManifest, 'nested_match');
  const interruptedMatchGroups = matchGroupsFor(
    runtimeManifest,
    'interrupted_match',
  );
  assert.equal(matchValueGroups.length, 1);
  assert.equal(matchIdenticalGroups.length, 1);
  assert.equal(matchEmptyGroups.length, 1);
  assert.equal(generatedMatchGroups.length, 1);
  assert.equal(unreachableMatchGroups.length, 1);
  assert.equal(
    unreachableMatchGroups[0].arms.length,
    2,
    'a statically unreachable match arm remained in the branch denominator',
  );
  assert.equal(generatedProcMatchGroups.length, 1);
  assert.equal(generatedGuardedProcMatchGroups.length, 1);
  assert.equal(
    matchGroupsFor(runtimeManifest, 'match_irrefutable').length,
    0,
    'an irrefutable single-arm match created an impossible branch obligation',
  );
  assert.equal(nestedMatchGroups.length, 2);
  assert.equal(interruptedMatchGroups.length, 1);
  const matchSelectedOrdinals = [
    ...matchValueGroups,
    ...matchIdenticalGroups,
    ...matchEmptyGroups,
    ...generatedMatchGroups,
    ...unreachableMatchGroups,
    ...generatedProcMatchGroups,
    ...generatedGuardedProcMatchGroups,
    ...generatedNestedProcMatchGroups,
    ...generatedNestedScrutineeProcMatchGroups,
    ...generatedNestedGuardProcMatchGroups,
    ...nestedMatchGroups,
  ].flatMap((group) => group.arms.map(({selectedOrdinal}) => selectedOrdinal));
  const interruptedMatchOrdinals = interruptedMatchGroups[0].arms.flatMap(
    ({selectedOrdinal, notSelectedOrdinal}) => [
      selectedOrdinal,
      notSelectedOrdinal,
    ],
  );
  const committedForOrdinals = [
    forZero,
    forEntered,
    forBreakZero,
    forBreakEntered,
    ...twoForOrdinals.flatMap(({zero, entered}) => [zero, entered]),
    ...nestedForOrdinals.flatMap(({zero, entered}) => [zero, entered]),
  ];
  assert(
    [
      authoredProbe,
      fallibleProbe,
      dropOrderProbe,
      panicProbe,
      whileZero,
      whileEntered,
      whileLetZero,
      whileLetEntered,
      ...committedForOrdinals,
      letElseMatched,
      letElseFallback,
      ...additionalLetElseOrdinals,
      ...committedTryOrdinals,
      ...matchSelectedOrdinals,
    ].every(Boolean),
    'runtime probe is not bound to its manifest obligation',
  );
  const behaviorEvidence = readTransport(behaviorTransport);
  validatePhaseContexts(behaviorEvidence, [transportContext, 303, 404]);
  assert(
    behaviorEvidence.attachments > 0,
    'instrumented behavior did not attach any owned runtime',
  );
  assert.equal(behaviorEvidence.dropped, 0);
  assert.equal(
    behaviorEvidence.incomplete,
    3,
    'decision-condition, iterator-next and match-guard panics must remain explicit incomplete health',
  );
  const observedOrdinals = new Set(
    behaviorEvidence.ordinals.map(({ordinal}) => ordinal),
  );

  // #24 execution differential: rustc's own LLVM counters are an independent
  // whole-run oracle for the same behavior binary. Any line supercov reports
  // covered that the oracle reports unexecuted is a misbind -- confident
  // wrong numbers, the failure mode the structural post-conditions guard.
  // The oracle's executed-line set is derived generously (whole segment
  // spans), so it can only weaken the check, never false-positive it.
  const llvmDirectory = join(scratch, 'misbind-differential');
  mkdirSync(llvmDirectory, {recursive: true});
  const llvmProfile = join(llvmDirectory, 'behavior.profraw');
  run('cargo', ['run', '--quiet', '--manifest-path', fixture, '--bin', 'behavior'], {
    env: {
      ...process.env,
      RUSTFLAGS: '-C instrument-coverage',
      LLVM_PROFILE_FILE: llvmProfile,
      CARGO_TARGET_DIR: join(llvmDirectory, 'target'),
    },
  });
  const oracleRustc = run('rustup', ['which', 'rustc']).stdout.trim();
  const oracleSysroot = run(oracleRustc, ['--print', 'sysroot']).stdout.trim();
  const llvmToolDirectories = readdirSync(join(oracleSysroot, 'lib/rustlib'))
    .map((entry) => join(oracleSysroot, 'lib/rustlib', entry, 'bin'))
    .filter((directory) => existsSync(join(directory, 'llvm-profdata')));
  assert.equal(llvmToolDirectories.length, 1, 'expected one llvm-tools directory');
  const [llvmBin] = llvmToolDirectories;
  const llvmProfdata = join(llvmDirectory, 'behavior.profdata');
  run(join(llvmBin, 'llvm-profdata'), ['merge', '-sparse', llvmProfile, '-o', llvmProfdata]);
  const llvmExport = JSON.parse(
    run(join(llvmBin, 'llvm-cov'), [
      'export',
      '--instr-profile',
      llvmProfdata,
      join(llvmDirectory, 'target/debug/behavior'),
      '-format=text',
    ]).stdout,
  );
  const oracleFile = llvmExport.data[0].files.find((file) =>
    file.filename.endsWith('/fixture/src/lib.rs'),
  );
  assert(oracleFile, 'oracle export is missing the fixture library');
  // A line the oracle never mapped is oracle silence, not disagreement:
  // rustc's coverage pass skips whole functions (`#[automatically_derived]`
  // impls, for one), leaving their lines without any counted segment. The
  // differential's valid claim is only where both models speak: a fired
  // obligation on a line the oracle mapped must be executed there too.
  const oracleExecuted = new Set();
  const oracleMapped = new Set();
  const {segments} = oracleFile;
  for (let index = 0; index + 1 < segments.length; index += 1) {
    const [line, , count, hasCount] = segments[index];
    const [nextLine] = segments[index + 1];
    if (!hasCount) continue;
    for (let mapped = line; mapped <= nextLine; mapped += 1) {
      oracleMapped.add(mapped);
      if (count > 0) oracleExecuted.add(mapped);
    }
  }
  const differentialLineStarts = new Map();
  const lineOfOffset = (sourceKey, offset) => {
    let starts = differentialLineStarts.get(sourceKey);
    if (!starts) {
      const source = runtimeSources[sourceKey];
      assert(source, `missing source snapshot ${sourceKey}`);
      const bytes = Buffer.from(source.source, 'utf8');
      starts = [0];
      for (let index = 0; index < bytes.length; index += 1) {
        if (bytes[index] === 10) starts.push(index + 1);
      }
      differentialLineStarts.set(sourceKey, starts);
    }
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (starts[mid] <= offset) low = mid;
      else high = mid - 1;
    }
    return low + 1;
  };
  let differentialChecked = 0;
  for (const obligation of [
    ...runtimeManifest.points,
    ...runtimeManifest.branches,
    ...runtimeManifest.decisions,
  ]) {
    if (obligation.sourceKey !== 'source:src/lib.rs') continue;
    // Macro-expanded obligations are attributed to the authored callsite by
    // design (#22); llvm-cov leaves generated bodies unattributed, so the two
    // models legitimately diverge there. The oracle applies to source-exact
    // obligations only.
    if (obligation.provenance !== 'authored-source') continue;
    if (!observedOrdinals.has(obligation.probeOrdinal)) continue;
    const line = lineOfOffset(obligation.sourceKey, obligation.start);
    if (!oracleMapped.has(line)) continue;
    assert(
      oracleExecuted.has(line),
      `misbind differential: supercov reports ${obligation.id} covered at src/lib.rs:${line}, but the LLVM oracle reports the line unexecuted`,
    );
    differentialChecked += 1;
  }
  assert(
    differentialChecked > 100,
    `misbind differential compared only ${differentialChecked} fired obligations; the oracle join is broken`,
  );
  console.log(
    `[rustc-backend-spike] misbind differential: ${differentialChecked} fired obligations agree with the LLVM oracle`,
  );
  const previouslyProvenOrdinals = new Set([
      authoredProbe,
      fallibleProbe,
      dropOrderProbe,
      panicProbe,
      whileZero,
      whileEntered,
      whileLetZero,
      whileLetEntered,
      ...committedForOrdinals,
      letElseMatched,
      letElseFallback,
      ...additionalLetElseOrdinals,
      ...committedTryOrdinals,
      ...matchSelectedOrdinals,
  ]);
  assert(
    [...previouslyProvenOrdinals].every((ordinal) => observedOrdinals.has(ordinal)),
    'general point instrumentation lost a previously proven branch or function observation',
  );
  const instrumentedManifests = manifests(instrumentedDirectory);
  const instrumentedDecisions = instrumentedManifests.flatMap(
    (manifestRecord) => manifestRecord.decisions,
  );
  const instrumentedBranches = instrumentedManifests.flatMap(
    (manifestRecord) => manifestRecord.branches,
  );
  for (const observed of behaviorEvidence.decisions) {
    const decision = instrumentedDecisions.find(({id}) => id === observed.id);
    assert(decision, `runtime emitted unknown decision ${observed.id}`);
    const outcomeBranch = instrumentedBranches.find(
      ({id}) => id === decision.outcomeBranchId,
    );
    assert(
      outcomeBranch,
      `decision ${decision.id} has no exact outcome branch relation`,
    );
    const label = decision.kind === 'assertion'
      ? (observed.outcome ? 'passed' : 'failed')
      : (observed.outcome ? 'condition true' : 'condition false');
    const outcomeOrdinal = outcomeBranch.alternatives.find(
      (alternative) => alternative.label === label,
    )?.probeOrdinal;
    assert(
      outcomeOrdinal && observedOrdinals.has(outcomeOrdinal),
      `decision ${decision.id} did not commit its exact ${label} branch alternative`,
    );
  }
  const manifestedHitOrdinals = allManifestedHitOrdinals(instrumentedDirectory);
  assert(
    [...observedOrdinals].every((ordinal) => manifestedHitOrdinals.has(ordinal)),
    'runtime emitted an ordinal outside the frozen point/branch denominator',
  );
  const fullyExecutedPointOrdinals = runtimeManifest.points
    .filter(({definitions}) =>
      definitions.some((definition) =>
        ['drop_order', 'panic_path', 'fallible'].includes(definition),
      ),
    )
    .map(({probeOrdinal}) => probeOrdinal);
  assert(fullyExecutedPointOrdinals.length > 4);
  assert(
    fullyExecutedPointOrdinals.every((ordinal) => observedOrdinals.has(ordinal)),
    'executed function/statement points did not all publish their manifest ordinals',
  );
  assert(
    promotedPoints.every(({probeOrdinal}) => observedOrdinals.has(probeOrdinal)),
    'runtime execution did not cover every authored point containing a promoted value',
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === letElseMatched).length,
    1,
    'the matched let-else alternative must commit exactly once',
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === letElseFallback).length,
    1,
    'the else let-else alternative must commit exactly once',
  );
  for (const [ordinal, count] of [
    [nestedLetElse.matched, 1],
    [nestedLetElse.fallback, 2],
    [twoLetElse[0].matched, 2],
    [twoLetElse[0].fallback, 1],
    [twoLetElse[1].matched, 1],
    [twoLetElse[1].fallback, 1],
    [generatedLetElse.matched, 1],
    [generatedLetElse.fallback, 1],
  ]) {
    assert.equal(
      behaviorEvidence.ordinals.filter((hit) => hit.ordinal === ordinal).length,
      count,
      `let-else alternative ${ordinal} did not retain exact invocation count`,
    );
  }
  assert.deepEqual(
    generatedTwoLetElse
      .map(({matched}) =>
        behaviorEvidence.ordinals.filter((hit) => hit.ordinal === matched).length,
      )
      .sort(),
    [1, 2],
    'sequential synthetic let-else matched alternatives lost semantic order/counts',
  );
  assert.deepEqual(
    generatedTwoLetElse
      .map(({fallback}) =>
        behaviorEvidence.ordinals.filter((hit) => hit.ordinal === fallback).length,
      )
      .sort(),
    [1, 1],
    'sequential synthetic let-else fallback alternatives lost semantic order/counts',
  );
  for (const [ordinal, count] of [
    [tryResult.continued, 1],
    [tryResult.returned, 1],
    [tryOption.continued, 1],
    [tryOption.returned, 1],
    [twoTry[0].continued, 2],
    [twoTry[0].returned, 1],
    [twoTry[1].continued, 1],
    [twoTry[1].returned, 1],
    [generatedTry.continued, 1],
    [generatedTry.returned, 1],
    [nestedTry[0].continued, 2],
    [nestedTry[0].returned, 1],
    [nestedTry[1].continued, 1],
    [nestedTry[1].returned, 1],
  ]) {
    assert.equal(
      behaviorEvidence.ordinals.filter((hit) => hit.ordinal === ordinal).length,
      count,
      `try-operator alternative ${ordinal} did not retain exact invocation count`,
    );
  }
  assert.deepEqual(
    generatedTwoTry
      .map(({continued}) =>
        behaviorEvidence.ordinals.filter((hit) => hit.ordinal === continued).length,
      )
      .sort(),
    [1, 2],
    'sequential synthetic try continuations lost semantic order/counts',
  );
  assert.deepEqual(
    generatedTwoTry
      .map(({returned}) =>
        behaviorEvidence.ordinals.filter((hit) => hit.ordinal === returned).length,
      )
      .sort(),
    [1, 1],
    'sequential synthetic try residuals lost semantic order/counts',
  );
  assert.deepEqual(
    generatedNestedTry
      .map(({continued}) =>
        behaviorEvidence.ordinals.filter((hit) => hit.ordinal === continued).length,
      )
      .sort(),
    [1, 2],
    'nested synthetic try continuations lost semantic order/counts',
  );
  assert.deepEqual(
    generatedNestedTry
      .map(({returned}) =>
        behaviorEvidence.ordinals.filter((hit) => hit.ordinal === returned).length,
      )
      .sort(),
    [1, 1],
    'nested synthetic try residuals lost semantic order/counts',
  );
  assert.equal(
    behaviorEvidence.ordinals.some(({ordinal}) =>
      [panicTry.continued, panicTry.returned].includes(ordinal),
    ),
    false,
    'a panic while evaluating the try operand must not commit either alternative',
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === whileZero).length,
    2,
    'two zero-iteration while invocations must remain distinct observations',
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === whileEntered).length,
    1,
    'the entered while invocation must commit exactly once across all iterations',
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === whileLetZero)
      .length,
    3,
    `three zero-iteration while-let invocations must remain distinct observations: ${JSON.stringify(
      behaviorEvidence.ordinals.filter(({ordinal}) =>
        [whileLetZero, whileLetEntered].includes(ordinal),
      ),
    )}`,
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === whileLetEntered)
      .length,
    1,
    'the entered while-let invocation must commit exactly once across iterations',
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === forZero).length,
    1,
    'the empty for invocation must commit zero iterations exactly once',
  );
  assert.equal(
    behaviorEvidence.ordinals.filter(({ordinal}) => ordinal === forEntered).length,
    1,
    'the entered for invocation must commit exactly once across iterations',
  );
  for (const ordinal of committedForOrdinals.slice(2)) {
    assert.equal(
      behaviorEvidence.ordinals.filter((hit) => hit.ordinal === ordinal).length,
      1,
      `for alternative ${ordinal} must commit exactly once`,
    );
  }
  assert(
    !behaviorEvidence.ordinals.some(({ordinal}) =>
      [interruptedForOrdinals.zero, interruptedForOrdinals.entered].includes(ordinal),
    ),
    'a panicking iterator committed a false zero/entered alternative',
  );
  assert(
    !behaviorEvidence.ordinals.some(({ordinal}) =>
      interruptedMatchOrdinals.includes(ordinal),
    ),
    'a panicking match guard committed a false selected/not-selected alternative',
  );
  const allMatchGroups = runtimeManifest.selectionGroups.filter(
    ({kind}) => kind === 'match',
  );
  const allNotSelectedOrdinals = allMatchGroups.flatMap((group) =>
    group.arms.map(({notSelectedOrdinal}) => notSelectedOrdinal),
  );
  assert(
    !behaviorEvidence.ordinals.some(({ordinal}) =>
      allNotSelectedOrdinals.includes(ordinal),
    ),
    'derived match not-selected alternatives leaked into raw evidence',
  );
  const ordinalCount = (ordinal) =>
    behaviorEvidence.ordinals.filter((hit) => hit.ordinal === ordinal).length;
  assert.deepEqual(
    matchValueGroups[0].arms.map(({selectedOrdinal}) => ordinalCount(selectedOrdinal)),
    [1, 2, 1],
    'guarded match invocations did not select the exact authored arms',
  );
  assert.deepEqual(
    matchIdenticalGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 1, 1],
    'identical match bodies lost distinct arm selection identity',
  );
  assert.deepEqual(
    matchEmptyGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 1],
    'empty match bodies lost distinct arm selection identity',
  );
  assert.deepEqual(
    generatedMatchGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 1],
    'a declarative-macro match lost authored arm selection identity',
  );
  const orPatternGroups = matchGroupsFor(runtimeManifest, 'adapter_flavor');
  assert.equal(
    orPatternGroups.length,
    1,
    'an or-pattern match did not record its selection group',
  );
  assert.deepEqual(
    orPatternGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [2, 1],
    'an or-pattern arm did not commit once per selecting alternative',
  );
  const derivedOrderGroups = matchGroupsFor(
    runtimeManifest,
    '<DerivedOrderLine as std::cmp::PartialOrd>::partial_cmp',
  );
  assert.equal(
    derivedOrderGroups.length,
    1,
    'derived PartialOrd did not record its builtin-derive match group',
  );
  assert.deepEqual(
    derivedOrderGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 1],
    'derived PartialOrd match arms did not select exactly',
  );
  assert.deepEqual(
    unreachableMatchGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 1],
    'reachable arms changed when the compiler excluded an unreachable pattern',
  );
  assert.deepEqual(
    generatedProcMatchGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 1],
    'a proc-macro match lost semantic arm marker identity after borrow checking',
  );
  assert.deepEqual(
    generatedGuardedProcMatchGroups[0].arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 2, 1],
    'a guarded proc-macro match lost semantic arm marker identity after borrow checking',
  );
  assert.equal(generatedNestedProcMatchGroups.length, 2);
  const generatedNestedProcRoot = generatedNestedProcMatchGroups.find(
    ({parentGroupId}) => parentGroupId === null,
  );
  const generatedNestedProcChild = generatedNestedProcMatchGroups.find(
    ({parentGroupId}) => parentGroupId === generatedNestedProcRoot?.id,
  );
  assert.deepEqual(
    generatedNestedProcRoot?.arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [2, 1],
    'the outer proc-macro match lost nested parent/arm identity',
  );
  assert.deepEqual(
    generatedNestedProcChild?.arms.map(({selectedOrdinal}) =>
      ordinalCount(selectedOrdinal),
    ),
    [1, 1],
    'the inner proc-macro match lost nested parent/arm identity',
  );
  const nestedSelectionCounts = (groups) => {
    const root = groups.find(({parentGroupId}) => parentGroupId === null);
    const child = groups.find(({parentGroupId}) => parentGroupId === root?.id);
    return {
      root: root?.arms.map(({selectedOrdinal}) => ordinalCount(selectedOrdinal)),
      child: child?.arms.map(({selectedOrdinal}) => ordinalCount(selectedOrdinal)),
      childSite: child?.parentSite,
    };
  };
  assert.deepEqual(
    nestedSelectionCounts(generatedNestedScrutineeProcMatchGroups),
    {root: [1, 1], child: [2, 1], childSite: 'scrutinee'},
    'a proc-macro match nested in a scrutinee lost semantic identity',
  );
  assert.deepEqual(
    nestedSelectionCounts(
      matchGroupsFor(runtimeManifest, 'generated_loop_nested_match_by_proc'),
    ),
    {root: [2, 1], child: [1, 1], childSite: 'body'},
    'a loop back edge broke exclusive arm membership for a nested proc-macro match',
  );
  assert.deepEqual(
    nestedSelectionCounts(generatedNestedGuardProcMatchGroups),
    {root: [1, 2, 1], child: [2, 1], childSite: 'guard'},
    'a proc-macro match nested in a guard lost semantic identity',
  );
  assert.deepEqual(
    nestedMatchGroups.map((group) =>
      group.arms.map(({selectedOrdinal}) => ordinalCount(selectedOrdinal)),
    ),
    [
      [2, 1],
      [1, 1],
    ],
    'nested matches did not preserve independent outer and inner selections',
  );
  for (const group of allMatchGroups) {
    for (const selected of group.arms) {
      const rawSelections = ordinalCount(selected.selectedOrdinal);
      const derived = new Map(
        group.arms.map((arm) => [
          arm.branchId,
          {
            selected: arm.branchId === selected.branchId ? rawSelections : 0,
            notSelected: arm.branchId === selected.branchId ? 0 : rawSelections,
          },
        ]),
      );
      assert.equal(
        [...derived.values()].filter(({selected}) => selected > 0).length,
        rawSelections > 0 ? 1 : 0,
        `match selection ${group.id}/${selected.branchId} did not derive one selected arm`,
      );
      assert.equal(
        [...derived.values()].filter(({notSelected}) => notSelected > 0).length,
        rawSelections > 0 ? group.arms.length - 1 : 0,
        `match selection ${group.id}/${selected.branchId} did not derive every sibling rejection`,
      );
    }
  }
  const vectorsForDecision = (decision) => {
    const id = decision?.id;
    assert(id, 'missing runtime decision');
    return behaviorEvidence.decisions
      .filter((decision) => decision.id === id)
      .map(({values, outcome}) => JSON.stringify({values, outcome}))
      .sort();
  };
  const decisionVectors = (definition) =>
    vectorsForDecision(decisionFor(runtimeManifest, definition));
  assert(
    !behaviorEvidence.decisions.some(
      ({id}) => id === decisionFor(runtimeManifest, 'interrupted_decision')?.id,
    ),
    'an interrupted decision was incorrectly committed as a complete vector',
  );
  assert.deepEqual(decisionVectors('compound'), [
    JSON.stringify({values: [false, null], outcome: false}),
    JSON.stringify({values: [true, false], outcome: false}),
    JSON.stringify({values: [true, true], outcome: true}),
  ].sort());
  assert.deepEqual(decisionVectors('disjoined'), [
    JSON.stringify({values: [false, false], outcome: false}),
    JSON.stringify({values: [false, true], outcome: true}),
    JSON.stringify({values: [true, null], outcome: true}),
  ].sort());
  assert.deepEqual(decisionVectors('mixed'), [
    JSON.stringify({values: [false, false, null], outcome: false}),
    JSON.stringify({values: [false, true, true], outcome: true}),
    JSON.stringify({values: [true, null, false], outcome: false}),
    JSON.stringify({values: [true, null, true], outcome: true}),
  ].sort());
  assert.deepEqual(decisionVectors('pattern'), [
    JSON.stringify({values: [false], outcome: false}),
    JSON.stringify({values: [true], outcome: true}),
  ].sort());
  assert.deepEqual(decisionVectors('chained'), [
    JSON.stringify({values: [false, null, null], outcome: false}),
    JSON.stringify({values: [true, false, null], outcome: false}),
    JSON.stringify({values: [true, true, true], outcome: true}),
  ].sort());
  const assertionVectors = {
    compound: [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
    equality: [
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [true], outcome: true}),
    ].sort(),
  };
  assert.deepEqual(decisionVectors('assert_compound'), assertionVectors.compound);
  const literalTrueAssertion = decisionForConditions(
    runtimeManifest,
    'assert_literal_true',
    ['true'],
  );
  const literalFalseAssertion = decisionForConditions(
    runtimeManifest,
    'assert_literal_false',
    ['false'],
  );
  assert.deepEqual(vectorsForDecision(literalTrueAssertion), [
    JSON.stringify({values: [true], outcome: true}),
  ]);
  assert.deepEqual(vectorsForDecision(literalFalseAssertion), [
    JSON.stringify({values: [false], outcome: false}),
  ]);
  assert.deepEqual(decisionVectors('debug_assert_literal_true'), [
    JSON.stringify({values: [true], outcome: true}),
  ]);
  assert.deepEqual(decisionVectors('debug_assert_literal_false'), [
    JSON.stringify({values: [false], outcome: false}),
  ]);
  const literalFirstVectors = [
    JSON.stringify({values: [true, false], outcome: false}),
    JSON.stringify({values: [true, true], outcome: true}),
  ].sort();
  assert.deepEqual(
    decisionVectors('assert_literal_conjunction'),
    literalFirstVectors,
  );
  const falseLiteralFirstVectors = [
    JSON.stringify({values: [false, false], outcome: false}),
    JSON.stringify({values: [false, true], outcome: true}),
  ].sort();
  assert.deepEqual(
    decisionVectors('assert_literal_disjunction'),
    falseLiteralFirstVectors,
  );
  assert.deepEqual(decisionVectors('assert_constant_expression_true'), [
    JSON.stringify({values: [true], outcome: true}),
  ]);
  assert.deepEqual(decisionVectors('assert_named_constant_false'), [
    JSON.stringify({values: [false], outcome: false}),
  ]);
  assert.deepEqual(decisionVectors('assert_equal'), assertionVectors.equality);
  assert.deepEqual(decisionVectors('assert_not_equal'), assertionVectors.equality);
  assert.deepEqual(
    decisionVectors('debug_assert_compound'),
    assertionVectors.compound,
  );
  assert.deepEqual(decisionVectors('debug_assert_equal'), assertionVectors.equality);
  assert.deepEqual(
    decisionVectors('debug_assert_not_equal'),
    assertionVectors.equality,
  );
  assert.deepEqual(
    decisionVectors('generated_assertion_by_proc'),
    assertionVectors.compound,
  );
  assert.deepEqual(decisionVectors('assert_panicking_message_argument'), [
    JSON.stringify({values: [false], outcome: false}),
  ]);
  assert.deepEqual(decisionVectors('assert_equal_evaluation_order'), [
    JSON.stringify({values: [true], outcome: true}),
  ]);
  assert(
    !behaviorEvidence.decisions.some(
      ({id}) => id === decisionFor(runtimeManifest, 'assert_panicking_condition')?.id,
    ),
    'an assertion condition panic was incorrectly committed as a failed assertion',
  );
  for (const definition of [
    'assert_compound',
    'assert_literal_true',
    'assert_literal_false',
    'debug_assert_literal_true',
    'debug_assert_literal_false',
    'assert_literal_conjunction',
    'assert_literal_disjunction',
    'assert_constant_expression_true',
    'assert_named_constant_false',
    'assert_equal',
    'assert_not_equal',
    'debug_assert_compound',
    'debug_assert_equal',
    'debug_assert_not_equal',
    'generated_assertion_by_proc',
  ]) {
    const assertion = decisionFor(runtimeManifest, definition);
    assert.equal(assertion?.kind, 'assertion');
    const outcome = branchFor(runtimeManifest, definition, 'assertion-outcome');
    assert.deepEqual(
      outcome.alternatives.map(({label}) => label).sort(),
      ['failed', 'passed'],
    );
    assert(
      behaviorEvidence.decisions
        .filter(({id}) => id === assertion.id)
        .every(({context}) =>
          assertionPhaseContexts(
            behaviorEvidence,
            transportContext,
            assertion.id,
          ).includes(context),
        ),
      `${definition} evidence escaped its exact assertion phase`,
    );
  }
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(runtimeManifest, 'match_value', [
        'value > 0',
        'enabled',
      ]),
    ),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    decisionVectors('generated_nested_guard_match_by_proc'),
    [
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [true], outcome: true}),
    ].sort(),
  );
  assert(
    !behaviorEvidence.decisions.some(
      ({id}) => id === decisionFor(runtimeManifest, 'interrupted_match')?.id,
    ),
    'a panicking match guard was incorrectly committed as a complete decision vector',
  );
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(runtimeManifest, 'generated_guarded_match_by_proc', [
        'value > 0',
        'enabled',
      ]),
    ),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  // Each expansion reports only its OWN call site. behavior.rs calls
  // `generated_by_rules(false)` and `repeated_expansions::generated_by_rules(
  // true)`, so neither site exercises both branches -- and that is the point.
  // While the two shared one obligation it carried both vectors and looked
  // fully covered, which is coverage credited to a branch no call site took.
  assert.deepEqual(decisionVectors('generated_by_rules'), [
    JSON.stringify({values: [false], outcome: false}),
  ]);
  assert.deepEqual(
    decisionVectors('repeated_expansions::generated_by_rules'),
    [JSON.stringify({values: [true], outcome: true})],
  );
  // Same across a crate boundary: behavior.rs calls the external macro's two
  // expansions with false and true respectively.
  assert.deepEqual(
    decisionVectors('generated_by_external_rules'),
    [JSON.stringify({values: [false], outcome: false})],
  );
  assert.deepEqual(
    decisionVectors('repeated_expansions::generated_by_external_rules'),
    [JSON.stringify({values: [true], outcome: true})],
  );
  assert.deepEqual(decisionVectors('DerivedChoice::derived_choice'), [
    JSON.stringify({values: [false], outcome: false}),
    JSON.stringify({values: [true], outcome: true}),
  ].sort());
  assert.deepEqual(
    decisionVectors('attributed_choice'),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(decisionVectors('generated_by_proc'), [
    JSON.stringify({values: [false], outcome: false}),
  ]);
  assert.deepEqual(decisionVectors('repeated_expansions::generated_by_proc'), [
    JSON.stringify({values: [true], outcome: true}),
  ]);
  assert.deepEqual(decisionVectors('generated_by_build_script'), [
    JSON.stringify({values: [false], outcome: false}),
  ]);
  assert.deepEqual(
    vectorsForDecision(decisionForConditions(runtimeManifest, 'nested', ['first'])),
    [
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [true], outcome: true}),
      JSON.stringify({values: [true], outcome: true}),
      JSON.stringify({values: [true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(runtimeManifest, 'nested', ['second', 'third']),
    ),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(runtimeManifest, 'nested_expression', [
        'first',
        '(if second { third } else { fourth })',
      ]),
    ),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(runtimeManifest, 'nested_expression', ['second']),
    ),
    [
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [true], outcome: true}),
      JSON.stringify({values: [true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(runtimeManifest, 'while_compound', [
        'remaining > 0',
        'enabled',
      ]),
    ),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(runtimeManifest, 'while_let_chain', [
        'let Some(Some(value)) = values.pop()',
        'value > 0',
        'enabled',
      ]),
    ),
    [
      JSON.stringify({values: [false, null, null], outcome: false}),
      JSON.stringify({values: [false, null, null], outcome: false}),
      JSON.stringify({values: [true, false, null], outcome: false}),
      JSON.stringify({values: [true, true, false], outcome: false}),
      JSON.stringify({values: [true, true, true], outcome: true}),
      JSON.stringify({values: [true, true, true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    vectorsForDecision(
      decisionForConditions(
        runtimeManifest,
        '<DerivedStyleIfLet as UnwrapOrSeven>::unwrap_or_seven',
        ['let Ok(value) = input'],
      ),
    ),
    [
      JSON.stringify({values: [true], outcome: true}),
      JSON.stringify({values: [false], outcome: false}),
    ].sort(),
    'a coverage-ineligible if-let did not discriminate its pattern switch by variant',
  );
  const behaviorPairs = new Set(
    behaviorEvidence.ordinals.map(({context, ordinal}) => `${context}:${ordinal}`),
  );
  assert(
    behaviorPairs.has(`303:${authoredProbe}`),
    'normal scope did not activate context 303',
  );
  assert(
    behaviorPairs.has(`404:${panicProbe}`),
    'panic scope did not activate context 404',
  );
  assert(
    behaviorPairs.has(`${transportContext}:${authoredProbe}`),
    `context was not restored after scope exit: ${JSON.stringify([...behaviorPairs])}`,
  );

  const ctfeDirectory = join(scratch, 'ctfe');
  const ctfeBehavior = run(
    'cargo',
    ['run', '--quiet', '--manifest-path', fixture, '--bin', 'behavior'],
    {
      env: {
        CARGO_TARGET_DIR: join(scratch, 'ctfe-target'),
        RUSTC_WRAPPER: wrapper,
        SUPERCOV_RUST_COMPILER_OUTPUT: ctfeDirectory,
        SUPERCOV_RUST_INSTRUMENT_MIR: '1',
        SUPERCOV_RUST_INSTRUMENT_CTFE: '1',
        SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
      },
    },
  );
  assert.equal(ctfeBehavior.stdout, baselineBehavior.stdout);
  assert.equal(ctfeBehavior.stderr, baselineBehavior.stderr);
  assert.match(ctfeBehavior.stdout, /const-values=11,13/);
  const ctfeMaps = ctfeBundles(ctfeDirectory);
  const ctfeRecordFiles = ctfeMaps.map(({name, value}) => ({
    name,
    records: value.events,
  }));
  assert(ctfeMaps.length > 0, 'compiler emitted no CTFE obligation maps');
  const manifestedCtfeHits = allManifestedHitOrdinals(ctfeDirectory);
  const mappingsByMarker = new Map();
  for (const {name, value} of ctfeMaps) {
    assert.equal(value.schema, 'supercov-rust-ctfe-unit-v1', `${name}: schema`);
    assert.equal(typeof value.crate, 'string', `${name}: crate`);
    assert(Array.isArray(value.events), `${name}: events`);
    for (const mapping of value.mappings) {
      assert.match(mapping.marker, /^\d+$/, `${name}: marker must be lossless text`);
      const mappingKey = `${value.crate}:${mapping.marker}`;
      const existing = mappingsByMarker.get(mappingKey);
      if (existing) {
        assert.deepEqual(
          mapping,
          existing,
          `${name}: CTFE mapping ${mapping.marker} changed across compiler units`,
        );
      } else {
        mappingsByMarker.set(mappingKey, mapping);
      }
      for (const ordinal of mapping.hitOrdinals) {
        assert.match(ordinal, /^\d+$/, `${name}: hit ordinal must be lossless text`);
        assert(
          manifestedCtfeHits.has(ordinal),
          `${name}: CTFE hit ordinal ${ordinal} is absent from the frozen denominator`,
        );
      }
    }
  }
  assert(
    [...mappingsByMarker.values()].some(({hitOrdinals}) => hitOrdinals.length > 0),
    'CTFE maps contain no function or statement obligations',
  );
  const ctfeSequences = ctfeRecordFiles.map(({records: fileRecords}) =>
    fileRecords
      .filter(({definition}) => definition.endsWith('const_decision'))
      .map((record) => `${record.observationKind}:${record.ordinal}`),
  );
  assert(
    ctfeSequences.some((observations) =>
      [
        'entry:0',
        'block:1',
        'block:2',
        'block:3',
        'edge:0',
        'edge:1',
        'exit:3',
      ].every((observation) => observations.includes(observation)),
    ),
    `expected both concurrency-safe CTFE edges and all original blocks, got ${JSON.stringify(ctfeSequences)}`,
  );
  const ctfeInvocations = [];
  for (const {name, records: fileRecords} of ctfeRecordFiles) {
    const threadStacks = new Map();
    for (const record of fileRecords) {
      assert.equal(record.kind, 'ctfe-marker', `${name}: invalid CTFE record kind`);
      assert.match(record.marker, /^\d+$/, `${name}: marker must be lossless text`);
      assert.equal(typeof record.thread, 'string', `${name}: CTFE thread missing`);
      assert(record.thread.length > 0, `${name}: CTFE thread empty`);
      const mapping = mappingsByMarker.get(`${record.crate}:${record.marker}`);
      assert(mapping, `${name}: observed CTFE marker has no obligation mapping`);
      assert.equal(mapping.definition, record.definition, `${name}: definition drift`);
      assert.equal(
        mapping.observationKind,
        record.observationKind,
        `${name}: observation kind drift`,
      );
      assert.equal(mapping.ordinal, record.ordinal, `${name}: ordinal drift`);
      const stack = threadStacks.get(record.thread) ?? [];
      threadStacks.set(record.thread, stack);
      if (record.observationKind === 'entry') {
        stack.push({definition: record.definition, records: [record]});
        continue;
      }
      assert(
        stack.length > 0,
        `${name}: ${record.observationKind} observed outside a CTFE invocation on ${record.thread}`,
      );
      const frame = stack.at(-1);
      assert.equal(
        frame.definition,
        record.definition,
        `${name}: CTFE event crossed invocation identity on ${record.thread}`,
      );
      frame.records.push(record);
      if (record.observationKind === 'exit') {
        ctfeInvocations.push(stack.pop());
      }
    }
    for (const [thread, stack] of threadStacks) {
      assert.deepEqual(
        stack,
        [],
        `${name}: successful compilation left incomplete CTFE frames on ${thread}`,
      );
    }
  }
  const constDecisionInvocations = ctfeInvocations.filter(
    ({definition}) => definition === 'const_decision',
  );
  assert.equal(
    constDecisionInvocations.length,
    2,
    'expected exactly two independently framed const_decision evaluations',
  );
  assert.deepEqual(
    constDecisionInvocations
      .map(({records: invocationRecords}) =>
        invocationRecords
          .filter(({observationKind}) => observationKind === 'edge')
          .map(({ordinal}) => ordinal)
          .join(','),
      )
      .sort(),
    ['0', '1'],
    'CTFE invocation frames did not preserve the independent false/true paths',
  );
  const ctfeVectorsForDecision = (definition, decision) => {
    assert(
      decision?.definitions.includes(definition),
      `${definition} has no matching frozen decision obligation`,
    );
    const invocations = ctfeInvocations.filter(
      (invocation) => invocation.definition === definition,
    );
    assert(invocations.length > 0, `${definition} has no CTFE invocation`);
    const vectors = [];
    for (const {records: invocationRecords} of invocations) {
      const active = [];
      for (const record of invocationRecords) {
        const semantic = mappingsByMarker.get(
          `${record.crate}:${record.marker}`,
        ).decision;
        if (!semantic) continue;
        if (semantic.event === 'start') {
          const meta = runtimeManifest.decisions.find(({id}) => id === semantic.id);
          assert(
            meta?.definitions.includes(definition),
            `${definition} started unknown CTFE decision ${semantic.id}`,
          );
          active.push({id: semantic.id, values: Array(meta.conditions.length).fill(null)});
        } else if (semantic.event === 'condition') {
          const frame = active.at(-1);
          assert(frame, `${definition} CTFE condition has no active decision`);
          assert.equal(
            frame.id,
            semantic.id,
            `${definition} CTFE condition crossed nested decision identity`,
          );
          assert.equal(
            frame.values[semantic.conditionIndex],
            null,
            `${definition} CTFE condition was observed twice`,
          );
          frame.values[semantic.conditionIndex] = semantic.value;
        } else if (semantic.event === 'finish') {
          const frame = active.pop();
          assert(frame, `${definition} CTFE finish has no active decision`);
          assert.equal(
            frame.id,
            semantic.id,
            `${definition} CTFE finish crossed nested decision identity`,
          );
          if (frame.id === decision.id) {
            vectors.push(JSON.stringify({values: frame.values, outcome: semantic.outcome}));
          }
        }
      }
      assert.deepEqual(active, [], `${definition} CTFE decision frame remained open`);
    }
    assert(vectors.length > 0, `${definition} CTFE decision never completed`);
    return vectors.sort();
  };
  const ctfeVectorsForDefinition = (definition) => {
    const decisions = runtimeManifest.decisions.filter(({definitions}) =>
      definitions.includes(definition),
    );
    assert.equal(decisions.length, 1, `${definition} does not have exactly one decision`);
    return ctfeVectorsForDecision(definition, decisions[0]);
  };
  const ctfeVectors = ctfeVectorsForDefinition('const_decision');
  assert.deepEqual(
    ctfeVectors,
    [
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [true], outcome: true}),
    ].sort(),
    'CTFE semantic mappings did not reconstruct the exact false/true vectors',
  );
  const oneVector = (value) => [JSON.stringify({values: [value], outcome: value})];
  assert.deepEqual(ctfeVectorsForDefinition('DIRECT_CONST_TRUE'), oneVector(true));
  assert.deepEqual(ctfeVectorsForDefinition('DIRECT_CONST_FALSE'), oneVector(false));
  assert.deepEqual(ctfeVectorsForDefinition('STATIC_CONST_TRUE'), oneVector(true));
  assert.deepEqual(ctfeVectorsForDefinition('STATIC_CONST_FALSE'), oneVector(false));
  assert.deepEqual(
    ctfeVectorsForDefinition('const_generic_decision'),
    [...oneVector(false), ...oneVector(true)].sort(),
  );
  assert.deepEqual(
    ctfeVectorsForDefinition('ConstGenericValue::<ENABLED>::VALUE'),
    [...oneVector(false), ...oneVector(true)].sort(),
  );
  assert.deepEqual(
    ctfeVectorsForDefinition('ARRAY_DECISION_LEN::{constant#0}'),
    oneVector(true),
  );
  assert.deepEqual(
    ctfeVectorsForDefinition('inline_const_values::{constant#1}'),
    oneVector(true),
  );
  assert.deepEqual(
    ctfeVectorsForDefinition('inline_const_values::{constant#2}'),
    oneVector(false),
  );
  assert.deepEqual(
    ctfeVectorsForDecision(
      'const_mixed',
      decisionForConditions(runtimeManifest, 'const_mixed', ['first', 'second', 'third']),
    ),
    [
      JSON.stringify({values: [false, false, null], outcome: false}),
      JSON.stringify({values: [false, true, true], outcome: true}),
      JSON.stringify({values: [true, null, false], outcome: false}),
      JSON.stringify({values: [true, null, true], outcome: true}),
    ].sort(),
  );
  assert.equal(
    decisionFor(runtimeManifest, 'const_logical_value'),
    undefined,
    'const logical value selection invented an MC/DC control decision',
  );
  const constLogicalBranches = branchesFor(
    runtimeManifest,
    'const_logical_value',
    'logical-selection',
  );
  assert.equal(constLogicalBranches.length, 2);
  const constLogicalOrdinals = new Set(
    constLogicalBranches.flatMap(({alternatives}) =>
      alternatives.map(({probeOrdinal}) => probeOrdinal),
    ),
  );
  const observedConstLogicalOrdinals = new Set(
    ctfeInvocations
      .filter(({definition}) => definition === 'const_logical_value')
      .flatMap(({records: invocationRecords}) =>
        invocationRecords
          .flatMap((record) =>
            mappingsByMarker.get(`${record.crate}:${record.marker}`).hitOrdinals,
          )
          .filter((ordinal) => constLogicalOrdinals.has(ordinal)),
      ),
  );
  assert.deepEqual(
    [...observedConstLogicalOrdinals].sort(),
    [...constLogicalOrdinals].sort(),
    'CTFE logical value selections did not commit every exact alternative',
  );
  assert.deepEqual(
    ctfeVectorsForDecision(
      'const_nested',
      decisionForConditions(runtimeManifest, 'const_nested', ['first']),
    ),
    [
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [true], outcome: true}),
      JSON.stringify({values: [true], outcome: true}),
    ].sort(),
  );
  assert.deepEqual(
    ctfeVectorsForDecision(
      'const_nested',
      decisionForConditions(runtimeManifest, 'const_nested', ['second']),
    ),
    [
      JSON.stringify({values: [false], outcome: false}),
      JSON.stringify({values: [true], outcome: true}),
    ].sort(),
  );
  const [constMatchGroup] = matchGroupsFor(runtimeManifest, 'const_match');
  assert(constMatchGroup, 'const_match has no frozen selection group');
  const constMatchOrdinals = new Set(
    constMatchGroup.arms.map(({selectedOrdinal}) => selectedOrdinal),
  );
  const constMatchSelections = ctfeInvocations
    .filter(({definition}) => definition === 'const_match')
    .map(({records: invocationRecords}) =>
      invocationRecords
        .flatMap((record) =>
          mappingsByMarker.get(`${record.crate}:${record.marker}`).hitOrdinals,
        )
        .filter((ordinal) => constMatchOrdinals.has(ordinal)),
    );
  assert.deepEqual(
    constMatchSelections.map((ordinals) => ordinals.join(',')).sort(),
    [...constMatchOrdinals].sort(),
    'CTFE match invocations did not select each exact arm once',
  );
  for (const selected of constMatchGroup.arms) {
    const derived = normalized.hitObligationsByOrdinal[selected.selectedOrdinal];
    assert.equal(
      derived.length,
      constMatchGroup.arms.length,
      `CTFE match selection ${selected.branchId} did not derive every sibling outcome`,
    );
    for (const arm of constMatchGroup.arms) {
      assert(
        derived.includes(
          arm.branchId === selected.branchId
            ? runtimeManifest.branches
                .find(({id}) => id === arm.branchId)
                .alternatives.find(({label}) => label === 'selected').id
            : runtimeManifest.branches
                .find(({id}) => id === arm.branchId)
                .alternatives.find(({label}) => label === 'not selected').id,
        ),
        `CTFE match selection ${selected.branchId} lost derived arm ${arm.branchId}`,
      );
    }
  }
  const constLetElse = branchFor(runtimeManifest, 'const_let_else', 'let-else');
  const constLetElseOrdinals = new Set(
    constLetElse.alternatives.map(({probeOrdinal}) => probeOrdinal),
  );
  assert.deepEqual(
    ctfeInvocations
      .filter(({definition}) => definition === 'const_let_else')
      .map(({records: invocationRecords}) =>
        invocationRecords
          .flatMap((record) =>
            mappingsByMarker.get(`${record.crate}:${record.marker}`).hitOrdinals,
          )
          .filter((ordinal) => constLetElseOrdinals.has(ordinal))
          .join(','),
      )
      .sort(),
    [...constLetElseOrdinals].sort(),
    'CTFE let-else invocations did not commit matched and fallback alternatives',
  );
  const constWhileDecision = decisionForConditions(runtimeManifest, 'const_while', [
    'remaining > 0',
    'enabled',
  ]);
  assert.deepEqual(
    ctfeVectorsForDecision('const_while', constWhileDecision),
    [
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [false, null], outcome: false}),
      JSON.stringify({values: [true, false], outcome: false}),
      JSON.stringify({values: [true, true], outcome: true}),
      JSON.stringify({values: [true, true], outcome: true}),
    ].sort(),
    'CTFE while did not preserve every evaluated short-circuit vector',
  );
  assert.match(
    constWhileDecision.loopBranchId,
    /^rs:branch:/,
    'CTFE while decision has no exact loop-entry relation',
  );
  const constWhileBranch = runtimeManifest.branches.find(
    ({id}) => id === constWhileDecision.loopBranchId,
  );
  assert.equal(constWhileBranch?.kind, 'loop-entry');
  const whileOrdinals = new Map(
    constWhileBranch.alternatives.map(({label, probeOrdinal}) => [probeOrdinal, label]),
  );
  const whileInvocationOutcomes = ctfeInvocations
    .filter(({definition}) => definition === 'const_while')
    .map(({records: invocationRecords}) =>
      invocationRecords
        .map((record) => mappingsByMarker.get(`${record.crate}:${record.marker}`))
        .filter(
          ({decision}) =>
            decision?.id === constWhileDecision.id && decision.event === 'finish',
        )
        .map(({hitOrdinals}) =>
          hitOrdinals.map((ordinal) => whileOrdinals.get(ordinal)).find(Boolean),
        ),
    );
  assert.deepEqual(
    whileInvocationOutcomes.map(([first]) => first).sort(),
    ['entered', 'zero iterations', 'zero iterations'],
    'CTFE while did not bind loop-entry to the first condition outcome per invocation',
  );
  const enteredWhile = whileInvocationOutcomes.find(([first]) => first === 'entered');
  assert.deepEqual(
    enteredWhile,
    ['entered', 'entered', 'zero iterations'],
    'entered CTFE while corpus did not exercise its terminating false condition',
  );
  const constAssertionDecision = decisionForConditions(
    runtimeManifest,
    'const_assertion',
    ['first', 'second'],
  );
  assert.equal(constAssertionDecision.kind, 'assertion');
  assert.deepEqual(
    ctfeVectorsForDecision('const_assertion', constAssertionDecision),
    [
      JSON.stringify({values: [false, true], outcome: true}),
      JSON.stringify({values: [true, null], outcome: true}),
    ].sort(),
    'CTFE assertion did not preserve both successful short-circuit paths',
  );
  const directConstAssertion = decisionForConditions(
    runtimeManifest,
    'DIRECT_CONST_ASSERTION',
    ['true'],
  );
  assert.equal(directConstAssertion.kind, 'assertion');
  assert.deepEqual(
    ctfeVectorsForDecision('DIRECT_CONST_ASSERTION', directConstAssertion),
    oneVector(true),
    'direct const assertion did not publish its successful decision',
  );
  const constDebugAssertionDecision = decisionForConditions(
    runtimeManifest,
    'const_debug_assertion',
    ['first', 'second'],
  );
  assert.equal(constDebugAssertionDecision.kind, 'assertion');
  assert.deepEqual(
    ctfeVectorsForDecision(
      'const_debug_assertion',
      constDebugAssertionDecision,
    ),
    [
      JSON.stringify({values: [false, true], outcome: true}),
      JSON.stringify({values: [true, null], outcome: true}),
    ].sort(),
    'CTFE debug assertion did not preserve both successful short-circuit paths',
  );
  const directConstDebugAssertion = decisionForConditions(
    runtimeManifest,
    'DIRECT_CONST_DEBUG_ASSERTION',
    ['true'],
  );
  assert.equal(directConstDebugAssertion.kind, 'assertion');
  assert.deepEqual(
    ctfeVectorsForDecision(
      'DIRECT_CONST_DEBUG_ASSERTION',
      directConstDebugAssertion,
    ),
    oneVector(true),
    'direct const debug assertion did not publish its successful decision',
  );
  const ctfeDefinitions = new Set(
    ctfeRecordFiles.flatMap(({records: fileRecords}) =>
      fileRecords.map(({definition}) => definition),
    ),
  );
  assert(
    promotedDefinitions.every(
      (definition) => ![...ctfeDefinitions].some((name) => name.endsWith(definition)),
    ),
    'compiler implementation promotion was exposed as a second authored CTFE execution',
  );
  assert(
    ctfeDefinitions.size > 1,
    'CTFE instrumentation remained restricted to one fixture function',
  );

  const testTransport = createTransport('instrumented-test');
  const probeTest = run(
    'cargo',
    [
      'test',
      '--quiet',
      '--manifest-path',
      fixture,
      '--lib',
      'records_real_runtime_probes',
      '--',
      '--ignored',
    ],
    {
      env: {
        ...instrumentedEnvironment,
        SUPERCOV_RUST_TRANSPORT_FILE: testTransport.path,
        SUPERCOV_RUST_TRANSPORT_TOKEN: testTransport.tokenHex,
      },
    },
  );
  assert.match(probeTest.stdout, /1 passed/);
  const testEvidence = readTransport(testTransport);
  assert(testEvidence.attachments > 0);
  assert.equal(testEvidence.dropped, 0);
  assert.equal(testEvidence.incomplete, 0);
  const testOrdinals = new Set(
    testEvidence.ordinals.map(({ordinal}) => ordinal),
  );
  assert(
    [authoredProbe, fallibleProbe, dropOrderProbe, panicProbe].every((ordinal) =>
      testOrdinals.has(ordinal),
    ),
    'the focused libtest lost its four original function observations',
  );
  assert(
    [...testOrdinals].every((ordinal) =>
      allManifestedHitOrdinals(instrumentedDirectory).has(ordinal),
    ),
    'the focused libtest emitted an ordinal outside its compiler manifests',
  );
  const pathPoints = runtimeManifest.points.filter(
    ({kind, definitions}) =>
      kind === 'statement' && definitions.includes('statement_paths'),
  );
  const pathOrdinal = (fragment) => {
    const matches = pathPoints.filter((point) =>
      obligationSource(runtimeSources, point).includes(`"${fragment}"`) &&
      !obligationSource(runtimeSources, point).includes('if value'),
    );
    assert.equal(matches.length, 1, `expected one statement point for ${fragment}`);
    return matches[0].probeOrdinal;
  };
  assert(testOrdinals.has(pathOrdinal('true-path')));
  assert(testOrdinals.has(pathOrdinal('after-path')));
  assert(
    !testOrdinals.has(pathOrdinal('false-path')),
    'unexecuted false-branch statement was falsely reported as covered',
  );

  // The uncovered-vs-unmeasured defect (fixed in 413d2e2): a body whose first
  // statement failure was unmeasurable got NO statement probes at all, so every
  // other statement in it never fired and was reported UNCOVERED. Classification
  // alone cannot catch that — it needs execution evidence, which is why this
  // lives here rather than in the build-only lattice gate.
  const neighbourPoints = runtimeManifest.points.filter(
    ({kind, definitions}) =>
      kind === 'statement' && definitions.includes('eliminated_neighbours'),
  );
  const neighbourOrdinal = (fragment) => {
    const matches = neighbourPoints.filter(
      (point) =>
        obligationSource(runtimeSources, point).includes(fragment) &&
        // The enclosing `let total = if cfg!(..)` statement spans the whole
        // if-else, so its text contains the inner fragments too. Exclude it the
        // same way the statement_paths assertions exclude their `if`.
        !obligationSource(runtimeSources, point).includes('cfg!'),
    );
    assert.equal(
      matches.length,
      1,
      `expected one eliminated_neighbours statement point for ${fragment}`,
    );
    return matches[0];
  };
  const neighbourDeclined = new Set(runtimeManifest.unmeasuredObligations ?? []);
  for (const fragment of ['"before-eliminated"', '"after-eliminated"']) {
    const point = neighbourOrdinal(fragment);
    assert(
      !neighbourDeclined.has(point.id),
      `${fragment} must stay measured despite sharing a body with an eliminated statement`,
    );
    assert(
      testOrdinals.has(point.probeOrdinal),
      `${fragment} executed but was not reported covered`,
    );
  }
  const eliminatedPoint = neighbourOrdinal('value + 211');
  assert(
    neighbourDeclined.has(eliminatedPoint.id),
    'the cfg-eliminated statement must be declined as unmeasured',
  );
  assert(
    !testOrdinals.has(eliminatedPoint.probeOrdinal),
    'the cfg-eliminated statement cannot have executed',
  );

  // The zmij family: a monomorphic `const` condition folds like the cfg!
  // literal above (const_eliminated_neighbours), and when the arm the
  // constant selects ends in a tail `return`, everything after that `if` in
  // the block never lowers either (const_diverging_neighbours).
  // #32: two decisions meeting on one CFG edge keep exact, independent
  // vectors -- neither is declined, and neither absorbs the other's outcomes.
  const sharedEdgeFirst = decisionForConditions(
    runtimeManifest,
    'shared_edge_decisions',
    ['first'],
  );
  const sharedEdgeSecond = decisionForConditions(
    runtimeManifest,
    'shared_edge_decisions',
    ['second'],
  );
  assert.deepEqual(vectorsForDecision(sharedEdgeFirst), [
    JSON.stringify({values: [false], outcome: false}),
    JSON.stringify({values: [true], outcome: true}),
  ].sort());
  assert.deepEqual(vectorsForDecision(sharedEdgeSecond), [
    JSON.stringify({values: [false], outcome: false}),
    JSON.stringify({values: [true], outcome: true}),
  ].sort());
  for (const decision of [sharedEdgeFirst, sharedEdgeSecond]) {
    assert(
      !neighbourDeclined.has(decision.id),
      'a decision sharing a CFG edge must stay measured',
    );
  }
  const constFamilyOrdinal = (definition, fragment, exclude) => {
    const matches = runtimeManifest.points.filter(
      (point) =>
        point.kind === 'statement' &&
        point.definitions.includes(definition) &&
        obligationSource(runtimeSources, point).includes(fragment) &&
        (!exclude || !obligationSource(runtimeSources, point).includes(exclude)),
    );
    assert.equal(
      matches.length,
      1,
      `expected one ${definition} statement point for ${fragment}`,
    );
    return matches[0];
  };
  for (const [fragment, exclude] of [
    ['"before-const-eliminated"', undefined],
    ['"after-const-eliminated"', undefined],
    ['value + 331', 'CONST_ELIMINATION_WIDE'],
  ]) {
    const point = constFamilyOrdinal('const_eliminated_neighbours', fragment, exclude);
    assert(
      !neighbourDeclined.has(point.id),
      `${fragment} must stay measured beside a const-eliminated arm`,
    );
    assert(
      testOrdinals.has(point.probeOrdinal),
      `${fragment} executed but was not reported covered`,
    );
  }
  const constEliminated = constFamilyOrdinal(
    'const_eliminated_neighbours',
    'value + 337',
    'CONST_ELIMINATION_WIDE',
  );
  assert(
    neighbourDeclined.has(constEliminated.id),
    'the const-eliminated arm statement must be declined as unmeasured',
  );
  assert(
    !testOrdinals.has(constEliminated.probeOrdinal),
    'the const-eliminated arm statement cannot have executed',
  );
  for (const [fragment, liveExclude] of [
    ['"before-const-diverging"', undefined],
    ['"const-diverging-live"', 'ConstEliminationTable'],
  ]) {
    const point = constFamilyOrdinal(
      'const_diverging_neighbours',
      fragment,
      liveExclude,
    );
    assert(
      !neighbourDeclined.has(point.id),
      `${fragment} must stay measured before a const-selected diverging arm`,
    );
    assert(
      testOrdinals.has(point.probeOrdinal),
      `${fragment} executed but was not reported covered`,
    );
  }
  for (const [fragment, exclude] of [
    ['value + 409', 'if value >= 7'],
    ['"after-const-diverging"', undefined],
  ]) {
    const point = constFamilyOrdinal('const_diverging_neighbours', fragment, exclude);
    assert(
      neighbourDeclined.has(point.id),
      `${fragment} sits after a const-selected diverging arm and must be declined`,
    );
    assert(
      !testOrdinals.has(point.probeOrdinal),
      `${fragment} cannot have executed`,
    );
  }
  const deadTailDecision = runtimeManifest.decisions.find(
    (decision) =>
      decision.definitions.includes('const_diverging_neighbours') &&
      obligationSource(runtimeSources, decision).includes('value >= 7'),
  );
  assert(deadTailDecision, 'the dead-tail decision must stay in the denominator');
  assert(
    neighbourDeclined.has(deadTailDecision.id),
    'a decision inside the dead tail must be declined as unmeasured, not unbound',
  );
  // A constant operand is not a run-time condition: the while decision keeps
  // only its live condition and stays measured, and a negated constant folds
  // exactly as its operand does.
  const constOperandWhile = runtimeManifest.decisions.find(
    (decision) =>
      decision.definitions.includes('const_operand_neighbours') &&
      obligationSource(runtimeSources, decision).includes('index < limit'),
  );
  assert(constOperandWhile, 'the const-operand while decision must exist');
  assert.equal(
    constOperandWhile.conditions.length,
    1,
    'the constant operand must leave the while decision, keeping the live condition',
  );
  assert(
    !neighbourDeclined.has(constOperandWhile.id),
    'the while decision must stay measured through its live condition',
  );
  const negatedDead = constFamilyOrdinal(
    'const_operand_neighbours',
    '"negated-const-dead"',
    'ConstEliminationTable',
  );
  assert(
    neighbourDeclined.has(negatedDead.id),
    'the negated-constant arm statement must be declined as unmeasured',
  );
  assert(
    !testOrdinals.has(negatedDead.probeOrdinal),
    'the negated-constant arm statement cannot have executed',
  );
  const afterConstOperand = constFamilyOrdinal(
    'const_operand_neighbours',
    '"after-const-operand"',
    undefined,
  );
  assert(
    !neighbourDeclined.has(afterConstOperand.id),
    'the statement after the negated-constant if must stay measured',
  );
  assert(
    testOrdinals.has(afterConstOperand.probeOrdinal),
    'the statement after the negated-constant if executed but was not reported covered',
  );

  const concurrentTransport = createTransport('concurrent-tests');
  const concurrentTests = run(
    'cargo',
    [
      'test',
      '--quiet',
      '--manifest-path',
      fixture,
      '--lib',
      'context',
      '--',
      '--ignored',
      '--test-threads=5',
    ],
    {
      env: {
        ...instrumentedEnvironment,
        SUPERCOV_RUST_TRANSPORT_FILE: concurrentTransport.path,
        SUPERCOV_RUST_TRANSPORT_TOKEN: concurrentTransport.tokenHex,
        SUPERCOV_RUST_CONTEXT_ID: '0000000000000000',
      },
    },
  );
  assert.match(concurrentTests.stdout, /9 passed/);
  const concurrentEvidence = readTransport(concurrentTransport);
  assert(concurrentEvidence.attachments > 0);
  assert.equal(concurrentEvidence.dropped, 0);
  assert.equal(concurrentEvidence.incomplete, 0);
  const contextNames = [
    'tests::context_one',
    'tests::context_two',
    'tests::attribute_context',
    'tests::panic_context',
    'tests::decision_context_true',
    'tests::decision_context_short_circuit',
  ];
  const contextIds = contextNames.map(testContextId);
  assert.equal(new Set(contextIds).size, contextIds.length, 'test context collision');
  const concurrentManifests = manifests(instrumentedDirectory);
  const assertionDecisionsFor = (name) => {
    const decisions = new Map(
      concurrentManifests.flatMap((manifestRecord) =>
        manifestRecord.decisions
          .filter(
            (decision) =>
              decision.kind === 'assertion' &&
              decision.definitions.includes(name),
          )
          .map((decision) => [decision.id, decision]),
      ),
    );
    return [...decisions.values()].sort(
      (left, right) =>
        right.end - right.start - (left.end - left.start) ||
        left.start - right.start,
    );
  };
  const assertionDecisionIdFor = (name) => {
    const decisions = assertionDecisionsFor(name);
    assert.equal(decisions.length, 1, `expected one assertion decision for ${name}`);
    return decisions[0].id;
  };
  const assertionContextIds = contextNames.map((name, index) => {
    return name === 'tests::panic_context'
      ? null
      : assertionPhaseContext(
          concurrentEvidence,
          contextIds[index],
          assertionDecisionIdFor(name),
        );
  });
  const resolvedAssertionContextIds = assertionContextIds.filter(Boolean);
  assert.equal(
    new Set([...contextIds, ...resolvedAssertionContextIds]).size,
    contextIds.length + resolvedAssertionContextIds.length,
    'test/assertion context collision',
  );
  const restoreTestContext = testContextId('tests::assertion_restore_context');
  const restoreAssertions = assertionDecisionsFor('tests::assertion_restore_context');
  assert.equal(restoreAssertions.length, 2);
  const restoreAuthoredAssertion = restoreAssertions.find((decision) =>
    decision.conditions.some(({source}) => source.includes('authored')),
  );
  assert(restoreAuthoredAssertion);
  const restoreAuthoredContext = assertionPhaseContext(
    concurrentEvidence,
    restoreTestContext,
    restoreAuthoredAssertion.id,
  );
  const nestedTestContext = testContextId('tests::nested_assertion_context');
  const nestedAssertions = assertionDecisionsFor('tests::nested_assertion_context');
  assert.equal(nestedAssertions.length, 2);
  const nestedOuterAssertion = nestedAssertions.find((decision) =>
    decision.conditions.some(({source}) => source.includes('fallible')),
  );
  const nestedInnerAssertion = nestedAssertions.find(
    (decision) => decision.id !== nestedOuterAssertion?.id,
  );
  assert(nestedOuterAssertion && nestedInnerAssertion);
  const nestedOuterContext = assertionPhaseContext(
    concurrentEvidence,
    nestedTestContext,
    nestedOuterAssertion.id,
  );
  const nestedInnerContext = assertionPhaseContext(
    concurrentEvidence,
    nestedOuterContext,
    nestedInnerAssertion.id,
  );
  const childTestContext = testContextId('tests::child_context');
  validatePhaseContexts(concurrentEvidence, [
    ...contextIds,
    restoreTestContext,
    nestedTestContext,
    childTestContext,
  ]);
  const concurrentOrdinalPairs = new Set(
    concurrentEvidence.ordinals.map(
      ({context, ordinal}) => `${context}:${ordinal}`,
    ),
  );
  const childAssertionContext = assertionPhaseContext(
    concurrentEvidence,
    childTestContext,
    assertionDecisionIdFor('tests::child_context'),
  );
  // The thread spawned inside assert_eq! runs under a derived thread-phase
  // context whose parent is the assertion phase, never the assertion phase
  // context itself: join-bounded partitioning needs the thread identity.
  const childThreadContext = threadPhaseContext(
    concurrentEvidence,
    childAssertionContext,
  );
  const previouslyProvenContextPairs = new Set([
      `${assertionContextIds[0]}:${authoredProbe}`,
      `${assertionContextIds[1]}:${fallibleProbe}`,
      `${assertionContextIds[2]}:${authoredProbe}`,
      `${contextIds[3]}:${panicProbe}`,
      `${restoreAuthoredContext}:${authoredProbe}`,
      `${restoreTestContext}:${fallibleProbe}`,
      `${nestedInnerContext}:${authoredProbe}`,
      `${nestedOuterContext}:${fallibleProbe}`,
      `${childThreadContext}:${authoredProbe}`,
  ]);
  const missingPreviouslyProvenContextPairs = [
    ...previouslyProvenContextPairs,
  ].filter((pair) => !concurrentOrdinalPairs.has(pair));
  assert(
    missingPreviouslyProvenContextPairs.length === 0,
    `general point instrumentation lost previously proven exact-context observations: ${missingPreviouslyProvenContextPairs.join(', ')}`,
  );
  assert(
    !concurrentOrdinalPairs.has(`0:${authoredProbe}`),
    'child-thread work escaped automatic context inheritance into background',
  );
  assert(
    !concurrentOrdinalPairs.has(`${childTestContext}:${authoredProbe}`),
    'child-thread work spawned inside an assertion lost its assertion phase',
  );
  assert(
    !concurrentOrdinalPairs.has(`${childAssertionContext}:${authoredProbe}`),
    'child-thread work was recorded directly under the assertion phase instead of its thread phase',
  );
  assert(
    concurrentEvidence.ordinals.every(({ordinal}) =>
      allManifestedHitOrdinals(instrumentedDirectory).has(ordinal),
    ),
    'a concurrent statement/function hit lost its denominator identity',
  );
  const compoundDecisionId = decisionFor(runtimeManifest, 'compound')?.id;
  assert(compoundDecisionId);
  assert(
    concurrentEvidence.decisions.some(
      ({context, id, values, outcome}) =>
        context === assertionContextIds[4] &&
        id === compoundDecisionId &&
        JSON.stringify(values) === JSON.stringify([true, true]) &&
        outcome === true,
    ),
    'concurrent true decision vector lost its exact libtest context',
  );
  assert(
    concurrentEvidence.decisions.some(
      ({context, id, values, outcome}) =>
        context === assertionContextIds[5] &&
        id === compoundDecisionId &&
        JSON.stringify(values) === JSON.stringify([false, null]) &&
        outcome === false,
    ),
    'concurrent short-circuit vector lost its exact libtest context',
  );
  const isolatedTransport = createTransport('isolated-child-thread');
  const isolatedTestContext = testContextId('tests::child_context');
  const isolatedTest = run(
    'cargo',
    [
      'test',
      '--quiet',
      '--manifest-path',
      fixture,
      '--lib',
      'tests::child_context',
      '--',
      '--ignored',
      '--exact',
      '--test-threads=1',
    ],
    {
      env: {
        ...instrumentedEnvironment,
        SUPERCOV_RUST_TRANSPORT_FILE: isolatedTransport.path,
        SUPERCOV_RUST_TRANSPORT_TOKEN: isolatedTransport.tokenHex,
        SUPERCOV_RUST_CONTEXT_ID: BigInt(isolatedTestContext)
          .toString(16)
          .padStart(16, '0'),
      },
    },
  );
  assert.match(isolatedTest.stdout, /1 passed/);
  const isolatedEvidence = readTransport(isolatedTransport);
  validatePhaseContexts(isolatedEvidence, [isolatedTestContext]);
  assert(isolatedEvidence.attachments > 0);
  assert.equal(isolatedEvidence.dropped, 0);
  assert.equal(isolatedEvidence.incomplete, 0);
  const isolatedAssertionId = assertionDecisionIdFor('tests::child_context');
  const isolatedAssertionContext = assertionPhaseContext(
    isolatedEvidence,
    isolatedTestContext,
    isolatedAssertionId,
  );
  const isolatedThreadContext = threadPhaseContext(
    isolatedEvidence,
    isolatedAssertionContext,
  );
  assert(
    isolatedEvidence.ordinals.some(
      ({context, ordinal}) =>
        context === isolatedThreadContext && ordinal === authoredProbe,
    ),
    'supervisor-isolated run did not bind child-thread work to the thread phase under its exact assertion phase',
  );
  assert(
    isolatedEvidence.ordinals.every(
      ({context, ordinal}) =>
        ordinal !== authoredProbe || context === isolatedThreadContext,
    ),
    'supervisor-isolated child-thread work leaked outside its thread phase',
  );
  assert(
    isolatedEvidence.decisions.some(
      ({context, id, outcome}) =>
        context === isolatedAssertionContext &&
        id === isolatedAssertionId &&
        outcome === true,
    ),
    'supervisor-isolated base context lost the parent assertion verdict',
  );
  const isolatedManifest = manifests(instrumentedDirectory).find(
    (manifestRecord) =>
      manifestRecord.crate === 'supercov_rustc_spike_fixture' &&
      manifestRecord.decisions.some(({id}) => id === isolatedAssertionId),
  );
  assert(isolatedManifest, 'isolated test compiler manifest was not emitted');
  const productionProjection = JSON.parse(
    run(supercov, ['__project-rust-compiler-evidence'], {
      input: JSON.stringify({
        normalization: {
          manifest: isolatedManifest,
          sources: compilerSources(
            instrumentedDirectory,
            'supercov_rustc_spike_fixture',
          ),
        },
        transportPath: isolatedTransport.path,
        tokenHex: isolatedTransport.tokenHex,
        baseContextId: isolatedTestContext,
        basePhase: {
          id: 'rust-test-phase',
          kind: 'test',
          operation: 'tests::child_context',
          source: 'src/lib.rs',
          causedByPhaseId: null,
          startedAtMs: 0,
          endedAtMs: 1,
          status: 'passed',
          error: null,
        },
      }),
    }).stdout,
  );
  assert.equal(productionProjection.health.dropped, 0);
  assert.equal(productionProjection.health.incomplete, 0);
  assert(productionProjection.attributed.hits.length > 0);
  assert.equal(productionProjection.background.hits.length, 0);
  assert(
    productionProjection.assertionPhases.some(
      ({status, causedByPhaseId}) =>
        status === 'passed' && causedByPhaseId === 'rust-test-phase',
    ),
    'production evidence projection lost the exact passed assertion phase',
  );
  const instrumentedRecords = records(instrumentedDirectory);
  assert(instrumentedRecords.some((record) => record.definition === 'authored'));
  assert(
    !instrumentedRecords.some((record) =>
      record.definition.includes('__supercov_spike_runtime'),
    ),
    'runtime ABI declarations leaked into authored compiler records',
  );
  assert.equal(
    createHash('sha256').update(readFileSync(fixtureSourcePath)).digest('hex'),
    fixtureSourceDigest,
    'the compiler companion modified the fixture source',
  );

  const doctestDirectory = join(scratch, 'doctest');
  const doctest = run('cargo', ['test', '--quiet', '--manifest-path', fixture, '--doc'], {
    env: {
      CARGO_TARGET_DIR: join(scratch, 'doctest-target'),
      RUSTC_WRAPPER: wrapper,
      SUPERCOV_RUST_COMPILER_OUTPUT: doctestDirectory,
    },
  });
  assert.equal(passedTests(doctest.stdout), 5);
  const doctestRecords = records(doctestDirectory);
  assert(
    !doctestRecords.some((record) => record.span.includes('src/lib.rs - (line 3)')),
    'ordinary RUSTC_WRAPPER unexpectedly observed rustdoc extracted source',
  );

  const rustdocLauncher = join(scratch, 'supercov-rustdoc-backend-spike');
  symlinkSync(wrapper, rustdocLauncher);
  const realRustdoc = run('rustup', ['which', 'rustdoc']).stdout.trim();
  const wrappedDoctestDirectory = join(scratch, 'wrapped-doctest');
  const doctestTransport = createTransport('wrapped-doctest');
  const wrappedDoctest = run(
    'cargo',
    ['test', '--quiet', '--manifest-path', fixture, '--doc'],
    {
      env: {
        CARGO_TARGET_DIR: join(scratch, 'wrapped-doctest-target'),
        RUSTDOC: rustdocLauncher,
        RUSTC_WRAPPER: wrapper,
        SUPERCOV_RUST_COMPANION_PATH: wrapper,
        SUPERCOV_RUST_COMPILER_OUTPUT: wrappedDoctestDirectory,
        SUPERCOV_RUST_CONTEXT_ID: transportContext.toString(16).padStart(16, '0'),
        SUPERCOV_RUST_INSTRUMENT_MIR: '1',
        SUPERCOV_RUST_REAL_RUSTDOC: realRustdoc,
        SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
        SUPERCOV_RUST_TRANSPORT_FILE: doctestTransport.path,
        SUPERCOV_RUST_TRANSPORT_TOKEN: doctestTransport.tokenHex,
      },
    },
  );
  assert.equal(
    normalizeTestOutput(wrappedDoctest.stdout),
    normalizeTestOutput(doctest.stdout),
  );
  assert.equal(
    normalizeTestOutput(wrappedDoctest.stderr),
    normalizeTestOutput(doctest.stderr),
  );
  const capturedDoctestDirectory = join(scratch, 'captured-doctest');
  const capturedDoctest = run(
    'cargo',
    ['test', '--quiet', '--manifest-path', fixture, '--doc'],
    {
      env: {
        CARGO_TARGET_DIR: join(scratch, 'captured-doctest-target'),
        RUSTDOC: rustdocLauncher,
        RUSTC_WRAPPER: wrapper,
        SUPERCOV_RUST_COMPANION_PATH: wrapper,
        SUPERCOV_RUST_COMPILER_OUTPUT: capturedDoctestDirectory,
        SUPERCOV_RUST_CONTEXT_ID: transportContext
          .toString(16)
          .padStart(16, '0'),
        SUPERCOV_RUST_INSTRUMENT_MIR: '1',
        SUPERCOV_RUST_REAL_RUSTDOC: realRustdoc,
        SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
        SUPERCOV_RUSTDOC_CAPTURE_OUTCOMES: '1',
        SUPERCOV_RUSTDOC_ENGINE_PATH: supercov,
      },
    },
  );
  const capturedEvents = capturedDoctest.stdout
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.equal(
    capturedEvents.filter(({type, event}) => type === 'test' && event === 'ok')
      .length,
    5,
  );
  assert.equal(
    capturedEvents.filter(
      ({type, event}) => type === 'test' && event === 'ignored',
    ).length,
    1,
  );
  const outcomeFiles = readdirSync(capturedDoctestDirectory).filter((name) =>
    name.startsWith('doctest-outcome-') && name.endsWith('.json'),
  );
  assert.equal(outcomeFiles.length, 1);
  assert(
    !readdirSync(capturedDoctestDirectory).some((name) =>
      name.startsWith('.doctest-outcome-'),
    ),
    'rustdoc outcome publication retained a partial file',
  );
  const outcomeUnit = JSON.parse(
    readFileSync(join(capturedDoctestDirectory, outcomeFiles[0]), 'utf8'),
  );
  assert.equal(outcomeUnit.schema, 'supercov-rustdoc-outcome-unit-v4');
  assert.equal(outcomeUnit.catalog.format_version, 2);
  assert.equal(outcomeUnit.catalog.doctests.length, 6);
  assert.equal(
    outcomeUnit.rawCatalogSha256,
    createHash('sha256')
      .update(JSON.stringify(outcomeUnit.catalog))
      .digest('hex'),
    'rustdoc outcome unit was not bound to the exact extracted catalog',
  );
  // The transport contains full-width u64 identities, so JavaScript cannot
  // parse and reserialize it byte-exactly. Rust validates this digest before
  // publication and again on ingestion; the JS spike only checks its shape.
  assert.match(outcomeUnit.transportSha256, /^[0-9a-f]{64}$/);
  assert.equal(outcomeUnit.transport.dropped, 0);
  assert.equal(outcomeUnit.transport.incomplete, 0);
  assert(
    outcomeUnit.transport.ordinalHits.length >= 2,
    'captured rustdoc outcome unit contains no runtime probes',
  );
  assert(
    !readdirSync(capturedDoctestDirectory).some((name) =>
      name.startsWith('doctest-transport-'),
    ),
    'published rustdoc outcome retained its terminal transport file',
  );
  assert.equal(
    outcomeUnit.rawEventsSha256,
    createHash('sha256').update(capturedDoctest.stdout).digest('hex'),
    'rustdoc outcome unit was not bound to the exact captured libtest stream',
  );
  assert.equal(
    outcomeUnit.companionBuildId,
    selectedCompanion.handshake.companionBuildId,
  );
  assert.equal(outcomeUnit.group, 'supercov_rustc_spike_fixture');
  assert.equal(outcomeUnit.report.plannedTests, 6);
  assert.equal(outcomeUnit.report.outcomes.length, 6);
  assert.equal(outcomeUnit.report.unstartedTests, 0);
  assert.deepEqual(outcomeUnit.report.unfinishedStarted, []);
  const wrappedDoctestRecords = records(wrappedDoctestDirectory);
  const doctestTestRecords = wrappedDoctestRecords.filter(
    ({testName, testContextId}) => testName && testContextId,
  );
  assert(
    doctestTestRecords.length >= 2,
    `rustdoc test markers were not preserved: ${JSON.stringify(
      wrappedDoctestRecords
        .filter(({doctestRole}) => doctestRole)
        .map(({definition, doctestRole, bodySnippet, testName}) => ({
          definition,
          doctestRole,
          bodySnippet,
          testName,
        })),
    )}`,
  );
  const doctestContexts = new Set(
    doctestTestRecords.map(({testName, testContextId: compilerContext}) => {
      const expected = testContextId(testName).toString();
      assert.equal(compilerContext, expected, `wrong compiler context for ${testName}`);
      return expected;
    }),
  );
  const doctestRuntime = readTransport(doctestTransport);
  assert.equal(doctestRuntime.dropped, 0);
  assert.equal(doctestRuntime.incomplete, 0);
  assert(doctestRuntime.ordinals.length >= 2, 'doctests emitted no runtime probes');
  const authoredDoctestOrdinals = new Set(
    manifests(wrappedDoctestDirectory).flatMap((manifestRecord) =>
      manifestRecord.points
        .filter(
          ({kind, definitions}) =>
            kind === 'function' && definitions.includes('authored'),
        )
        .map(({probeOrdinal}) => probeOrdinal),
    ),
  );
  assert.equal(authoredDoctestOrdinals.size, 1);
  const authoredDoctestHits = doctestRuntime.ordinals.filter(({ordinal}) =>
    authoredDoctestOrdinals.has(ordinal),
  );
  assert(authoredDoctestHits.length >= 2, 'authored doctest calls emitted no probes');
  const observedDoctestContexts = new Set(
    authoredDoctestHits.map(({context}) => context),
  );
  const doctestPhaseParents = new Map(
    doctestRuntime.phases.map(({child, parent}) => [child, parent]),
  );
  const doctestRootContext = (context) => {
    const seen = new Set();
    while (doctestPhaseParents.has(context)) {
      assert(!seen.has(context), `doctest phase context cycle at ${context}`);
      seen.add(context);
      context = doctestPhaseParents.get(context);
    }
    return context;
  };
  assert(
    [...observedDoctestContexts].every((context) =>
      doctestContexts.has(doctestRootContext(context)),
    ),
    `doctest probes escaped exact test contexts: ${JSON.stringify([...observedDoctestContexts])}`,
  );
  assert(
    observedDoctestContexts.size >= 2,
    'standalone and merged doctest probes did not retain distinct contexts',
  );
  const standalone = wrappedDoctestRecords.find(
    (record) => record.doctestRole === 'standalone',
  );
  assert.match(standalone?.doctestPath ?? '', /(^|\/)src\/lib\.rs$/);
  assert.match(standalone?.doctestLine ?? '', /^\d+$/);
  const standaloneManifest = crateManifest(wrappedDoctestDirectory, 'rust_out');
  const standaloneSources = compilerSources(wrappedDoctestDirectory, 'rust_out');
  const standaloneDoctestPoints = standaloneManifest.points.filter(
    ({provenance}) => provenance === 'doctest-source',
  );
  assert.equal(
    standaloneDoctestPoints.length,
    5,
    `standalone doctest statements were not added to the owned denominator: ${JSON.stringify(
      standaloneManifest.points.map(({kind, provenance, sourceKey, start, end}) => ({
        kind,
        provenance,
        sourceKey,
        start,
        end,
      })),
    )}`,
  );
  const standalonePointSources = standaloneDoctestPoints.map((point) =>
    obligationSource(standaloneSources, point),
  );
  assert(
    standalonePointSources.some((source) => source.includes('let hidden')),
    `hidden doctest statement was not mapped to authored bytes: ${JSON.stringify(standalonePointSources)}`,
  );
  assert(
    standalonePointSources.some(
      (source) =>
        source.includes('let combined = hidden') &&
        source.includes('std::hint::black_box(2)'),
    ),
    `multiline doctest statement was not mapped to authored bytes: ${JSON.stringify(standalonePointSources)}`,
  );
  assert(
    standalonePointSources.some((source) => source.includes('hidden + 2')),
    `visible doctest assertion was not mapped to authored bytes: ${JSON.stringify(standalonePointSources)}`,
  );
  assert(
    standalonePointSources.some((source) => source.includes('authored(false)')),
    `dependency-calling doctest assertion was not mapped to authored bytes: ${JSON.stringify(standalonePointSources)}`,
  );
  assert(
    standalonePointSources.every((source) => !source.includes('fn main')),
    'rustdoc wrapper code became an authored coverage obligation',
  );
  const standaloneContext = doctestTestRecords.find(({testName}) =>
    testName.includes(':src/lib.rs:'),
  )?.testContextId;
  assert(standaloneContext, 'standalone doctest context identity is missing');
  const standaloneOrdinals = new Set(
    standaloneDoctestPoints.map(({probeOrdinal}) => probeOrdinal),
  );
  const observedStandaloneOrdinals = new Set(
    doctestRuntime.ordinals
      .filter(({context}) => doctestRootContext(context) === standaloneContext)
      .map(({ordinal}) => ordinal),
  );
  const missingStandaloneOrdinals = [...standaloneOrdinals].filter(
    (ordinal) => !observedStandaloneOrdinals.has(ordinal),
  );
  assert.deepEqual(
    missingStandaloneOrdinals,
    [],
    `standalone doctest source probes were not all attributed to their exact context: ${JSON.stringify(
      missingStandaloneOrdinals,
    )}`,
  );
  assert(
    wrappedDoctestRecords.some(
      (record) =>
        record.doctestRole === 'merged-bundle' &&
        record.definition.includes('__doctest_0'),
    ),
    'the companion did not observe merged doctest user code',
  );
  assert(
    wrappedDoctestRecords.some(
      (record) =>
        record.doctestRole === 'merged-runner' &&
        record.definition.includes('__doctest_0'),
    ),
    'the companion did not observe the merged doctest identity map',
  );
  const mergedIdentity = wrappedDoctestRecords.find(
    (record) =>
      record.doctestRole === 'merged-runner' &&
      record.definition === '__doctest_0::TEST',
  );
  assert.match(mergedIdentity?.bodySnippet ?? '', /src\/lib\.rs/);
  assert.match(mergedIdentity?.bodySnippet ?? '', /line 3/);
  const mergedRunnerContext = wrappedDoctestRecords.find(
    (record) =>
      record.doctestRole === 'merged-runner' &&
      record.definition === '__doctest_0::TEST::{closure#0}',
  );
  const mergedBundleContext = wrappedDoctestRecords.find(
    (record) =>
      record.doctestRole === 'merged-bundle' &&
      record.definition === '__doctest_0::main',
  );
  assert.equal(
    mergedRunnerContext?.testName,
    'rustdoc:supercov_rustc_spike_fixture:__doctest_0',
  );
  assert.equal(mergedBundleContext?.testName, mergedRunnerContext?.testName);
  assert.equal(mergedBundleContext?.testContextId, mergedRunnerContext?.testContextId);
  assert.equal(mergedRunnerContext?.doctestDisplayName, 'src/lib.rs - (line 3)');
  const mergedMaps = readdirSync(wrappedDoctestDirectory)
    .filter((name) => name.startsWith('doctest-map-') && name.endsWith('.json'))
    .map((name) =>
      JSON.parse(readFileSync(join(wrappedDoctestDirectory, name), 'utf8')),
    );
  assert(
    !readdirSync(wrappedDoctestDirectory).some((name) =>
      name.includes('doctest-map-') && name.endsWith('.partial'),
    ),
    'merged doctest map publication retained a partial file',
  );
  const ignoredDoctestLine = sourceLine('```ignore');
  const noRunDoctestLine = sourceLine('```no_run');
  const shouldPanicDoctestLine = sourceLine('```should_panic');
  assert.deepEqual(mergedMaps, [
    {
      schema: 'supercov-rustdoc-merged-map-v2',
      group: 'supercov_rustc_spike_fixture',
      entries: [
        {
          module: '__doctest_0',
          displayName: 'src/lib.rs - (line 3)',
          path: 'src/lib.rs',
          line: 3,
          ignored: false,
          noRun: false,
          shouldPanic: false,
        },
        {
          module: '__doctest_1',
          displayName: `src/lib.rs - doctest_execution_modes (line ${ignoredDoctestLine})`,
          path: 'src/lib.rs',
          line: ignoredDoctestLine,
          ignored: true,
          noRun: false,
          shouldPanic: false,
        },
        {
          module: '__doctest_2',
          displayName: `src/lib.rs - doctest_execution_modes (line ${noRunDoctestLine})`,
          path: 'src/lib.rs',
          line: noRunDoctestLine,
          ignored: false,
          noRun: true,
          shouldPanic: false,
        },
        {
          module: '__doctest_3',
          displayName: `src/lib.rs - doctest_execution_modes (line ${shouldPanicDoctestLine})`,
          path: 'src/lib.rs',
          line: shouldPanicDoctestLine,
          ignored: false,
          noRun: false,
          shouldPanic: true,
        },
      ],
    },
  ]);
  const capturedOutcomeNames = new Set(
    outcomeUnit.report.outcomes.map(({displayName}) => displayName),
  );
  assert.deepEqual(
    capturedOutcomeNames,
    new Set(outcomeUnit.catalog.doctests.map(({name}) => name)),
    'the extracted rustdoc catalog and terminal names differ',
  );
  assert(
    mergedMaps[0].entries.every(({displayName}) =>
      capturedOutcomeNames.has(displayName),
    ),
    'merged rustdoc descriptors did not join to exact terminal outcome names',
  );
  assert.equal(
    outcomeUnit.report.outcomes.filter(
      ({displayName}) =>
        !mergedMaps[0].entries.some((entry) => entry.displayName === displayName),
    ).length,
    2,
    'fixture did not retain its standalone and compile-fail doctests',
  );
  const standaloneCatalog = outcomeUnit.catalog.doctests.find(
    ({name}) => name.includes('standalone_doctest_surface'),
  );
  const compileFailCatalog = outcomeUnit.catalog.doctests.find(
    ({name}) => name.includes('stable_feature_gate_doctest_surface'),
  );
  assert.equal(
    standaloneCatalog?.doctest_attributes.standalone_crate,
    true,
  );
  assert.equal(compileFailCatalog?.doctest_attributes.compile_fail, true);
  assert.equal(compileFailCatalog?.doctest_attributes.no_run, true);
  const mergedPendingManifest = crateManifest(
    wrappedDoctestDirectory,
    'doctest_bundle_2024',
  );
  const mergedPendingSources = compilerSources(
    wrappedDoctestDirectory,
    'doctest_bundle_2024',
  );
  assert(mergedPendingManifest.points.length >= 2);
  assert(mergedPendingManifest.branches.length >= 2);
  assert(mergedPendingManifest.decisions.length >= 2);
  const invalidPendingObligations = [
      ...mergedPendingManifest.points,
      ...mergedPendingManifest.branches,
      ...mergedPendingManifest.decisions,
    ].filter(
      ({sourceKey, provenance, definitions}) =>
        sourceKey !== 'doctest-pending:supercov_rustc_spike_fixture' ||
        provenance !== 'doctest-pending' ||
        !definitions.some(
          (definition) =>
            /^__doctest_\d+::main(?:$|::)/u.test(definition),
        ),
    );
  assert.deepEqual(
    invalidPendingObligations,
    [],
    'merged bundle obligations leaked temporary source identity',
  );
  const pendingSyntheticCanonicals = [
    ...mergedPendingManifest.points,
    ...mergedPendingManifest.branches,
    ...mergedPendingManifest.branches.flatMap(({alternatives}) => alternatives),
    ...mergedPendingManifest.decisions,
  ].filter(({canonical}) => canonical.includes('\0synthetic-expansion\0'));
  assert(
    pendingSyntheticCanonicals.length >= 4,
    'the real merged proc-macro expression emitted no complete synthetic identity family',
  );
  const authoredPendingPoint = mergedPendingManifest.points.find(
    (point) =>
      obligationSource(mergedPendingSources, point) ===
      'assert_eq!(supercov_rustc_spike_fixture::authored(true), 1)',
  );
  assert(authoredPendingPoint, 'merged authored assertion statement is missing');
  assert.equal(
    obligationSource(mergedPendingSources, authoredPendingPoint),
    'assert_eq!(supercov_rustc_spike_fixture::authored(true), 1)',
  );
  const mergedJoin = JSON.parse(
    run(supercov, ['__join-rustdoc-merged-manifest'], {
      input: JSON.stringify({
        pendingManifest: mergedPendingManifest,
        pendingSources: {
          schema: 'supercov-rust-source-snapshots-v1',
          crate: 'doctest_bundle_2024',
          sources: mergedPendingSources,
        },
        map: mergedMaps[0],
        authoredSources: {
          'source:src/lib.rs': {
            file: 'src/lib.rs',
            source: readFileSync(fixtureSourcePath, 'utf8'),
          },
        },
      }),
    }).stdout,
  );
  assert.equal(
    mergedJoin.manifest.points.length,
    mergedPendingManifest.points.length,
  );
  assert.equal(
    mergedJoin.manifest.branches.length,
    mergedPendingManifest.branches.length,
  );
  assert.equal(
    mergedJoin.manifest.decisions.length,
    mergedPendingManifest.decisions.length,
  );
  const stableDoctestRoots = mergedMaps[0].entries.map(
    ({path, line}) => `doctest:${path}:${line}`,
  );
  assert(
    [
      ...mergedJoin.manifest.points,
      ...mergedJoin.manifest.branches,
      ...mergedJoin.manifest.decisions,
    ].every(
      ({sourceKey, provenance, canonical, definitions}) =>
        sourceKey === 'source:src/lib.rs' &&
        ['doctest-source', 'synthetic-expansion'].includes(provenance) &&
        !canonical.includes('doctest-pending:') &&
        !canonical.includes('__doctest_') &&
        definitions.some(
          (definition) => stableDoctestRoots.some(
            (root) => definition === root || definition.startsWith(`${root}::`),
          ),
        ),
    ),
    'the strict merged-doctest join retained a temporary identity',
  );
  assert(
    [
      ...mergedJoin.manifest.points,
      ...mergedJoin.manifest.branches,
      ...mergedJoin.manifest.decisions,
    ].some(({provenance}) => provenance === 'synthetic-expansion'),
    'the final merged manifest lost synthetic expansion provenance',
  );
  const authoredFinalPoint = mergedJoin.manifest.points.find(
    ({id}) => id === mergedJoin.obligationIds[authoredPendingPoint.id],
  );
  assert(authoredFinalPoint, 'merged authored statement ID was not translated');
  assert.equal(
    obligationSource(
      mergedJoin.sources.sources,
      authoredFinalPoint,
    ),
    'assert_eq!(supercov_rustc_spike_fixture::authored(true), 1)',
  );
  assert.equal(
    mergedJoin.obligationIds[authoredPendingPoint.id],
    authoredFinalPoint.id,
  );
  assert.equal(
    mergedJoin.probeOrdinals[authoredPendingPoint.probeOrdinal],
    authoredFinalPoint.probeOrdinal,
  );
  const mergedRoots = new Map(
    doctestTestRecords
      .filter(
        ({doctestRole, definition, testContextId}) =>
          doctestRole === 'merged-runner' &&
          definition.endsWith('::TEST::{closure#0}') &&
          testContextId,
      )
      .map(({definition, testContextId}) => [
        definition.replace(/::TEST::\{closure#0\}$/u, ''),
        testContextId,
      ]),
  );
  for (const entry of mergedMaps[0].entries) {
    const points = mergedPendingManifest.points.filter(({definitions}) =>
      definitions.some(
        (definition) =>
          definition === `${entry.module}::main` ||
          definition.startsWith(`${entry.module}::main::`),
      ),
    );
    const root = mergedRoots.get(entry.module);
    assert(root, `merged doctest ${entry.module} has no exact test context`);
    const observed = new Set(
      doctestRuntime.ordinals
        .filter(({context}) => doctestRootContext(context) === root)
        .map(({ordinal}) => ordinal),
    );
    if (entry.ignored || entry.noRun) {
      assert(
        points.every(({probeOrdinal}) => !observed.has(probeOrdinal)),
        `non-executed merged doctest ${entry.module} emitted source probes`,
      );
    } else {
      assert(
        points.every(({probeOrdinal}) => observed.has(probeOrdinal)),
        `executed merged doctest ${entry.module} lost source probes`,
      );
    }
  }
  const mergedRoot = mergedRoots.get('__doctest_0');
  assert(mergedRoot, 'primary merged doctest test context is missing');
  const pendingSyntheticDecision = mergedPendingManifest.decisions.find(
    ({canonical}) => canonical.includes('\0synthetic-expansion\0'),
  );
  assert(pendingSyntheticDecision, 'merged synthetic decision is missing');
  assert(
    doctestRuntime.decisions.some(
      ({context, id}) =>
        doctestRootContext(context) === mergedRoot &&
        id === pendingSyntheticDecision.id,
    ),
    'merged pending synthetic decision was not attributed to its exact test root',
  );
  assert.equal(
    createHash('sha256').update(readFileSync(fixtureSourcePath)).digest('hex'),
    fixtureSourceDigest,
    'the rustdoc companion modified the fixture source',
  );

  // Binding lattice: an obligation the binder cannot prove exactly must never
  // silently become an approximate number. Under Supercov's own gates it fails
  // the build (every corpus compile above ran strict); in a user's build the
  // same obligation is left uninstrumented and recorded as an explicit
  // limitation, so arbitrary code still compiles and the report can separate
  // "not covered" from "not measured". Both directions are proven here through
  // a fault injection, because an untested degradation path would be exactly
  // the silent-wrongness this design exists to prevent.
  const latticeCrate = join(scratch, 'lattice-gate');
  mkdirSync(join(latticeCrate, 'src'), {recursive: true});
  writeFileSync(
    join(latticeCrate, 'Cargo.toml'),
    '[package]\nname = "lattice-gate"\nversion = "0.0.0"\nedition = "2021"\npublish = false\n\n[workspace]\n',
  );
  writeFileSync(
    join(latticeCrate, 'src/lib.rs'),
    'pub enum Kind { A, B, C }\n' +
      'pub fn unbindable(k: Kind) -> usize {\n' +
      '    match k { Kind::A | Kind::B => 1, Kind::C => 2 }\n' +
      '}\n' +
      'pub fn neighbor(flag: bool) -> usize {\n' +
      '    if flag { 3 } else { 4 }\n' +
      '}\n' +
      // `cfg!(target_os = "none")` is a bool literal by the time HIR sees it,
      // so the taken branch is decided at compile time and the other never
      // lowers. Its statement is unmeasurable in this configuration.
      'pub fn cfg_eliminated(value: usize) -> usize {\n' +
      '    if cfg!(target_os = "none") {\n' +
      '        let eliminated = value + 107;\n' +
      '        eliminated\n' +
      '    } else {\n' +
      '        value + 109\n' +
      '    }\n' +
      '}\n' +
      // A short-circuit whose left operand is a compile-time constant makes no
      // run-time decision, so rustc emits no branch for it.
      'pub fn short_circuit_constant(v: usize) -> bool {\n' +
      '    let decided = cfg!(target_os = "none") && v > 3;\n' +
      '    decided\n' +
      '}\n' +
      'pub fn paired(first: bool, second: bool) -> usize {\n' +
      '    if first && second { 5 } else { 6 }\n' +
      '}\n' +
      'pub fn narrow(flag: bool, k: Kind) -> usize {\n' +
      '    let base = 7;\n' +
      '    let chosen = if flag { base } else { base + 1 };\n' +
      '    match k { Kind::A => chosen, Kind::B => chosen + 1, Kind::C => chosen + 2 }\n' +
      '}\n',
  );
  const latticeOutput = join(scratch, 'lattice-gate-out');
  const latticeEnvironment = {
    CARGO_TARGET_DIR: join(scratch, 'lattice-gate-target'),
    RUSTC_WRAPPER: wrapper,
    DYLD_LIBRARY_PATH: [rustcTargetLibdir, process.env.DYLD_LIBRARY_PATH]
      .filter(Boolean)
      .join(':'),
    LD_LIBRARY_PATH: [rustcTargetLibdir, process.env.LD_LIBRARY_PATH]
      .filter(Boolean)
      .join(':'),
    SUPERCOV_RUST_COMPILER_OUTPUT: latticeOutput,
    SUPERCOV_RUST_INSTRUMENT_MIR: '1',
    SUPERCOV_RUST_SOURCE_ROOT: latticeCrate,
    SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY: sharedRuntimeDirectory,
    SUPERCOV_RUST_FORCE_UNBINDABLE: 'unbindable',
  };
  run(cargo, ['build', '--manifest-path', join(latticeCrate, 'Cargo.toml')], {
    env: {...latticeEnvironment, SUPERCOV_RUST_STRICT_BINDING: ''},
  });
  const latticeManifest = crateManifest(latticeOutput, 'lattice_gate');
  const unboundLimitations = latticeManifest.limitations.filter((limitation) =>
    limitation.startsWith('RUST_OBLIGATION_UNBOUND:'),
  );
  assert.deepEqual(
    unboundLimitations,
    [
      'RUST_OBLIGATION_UNBOUND: bind injected unbindable shape in unbindable: SUPERCOV_RUST_FORCE_UNBINDABLE fault injection',
    ],
    'a degraded obligation did not record its exact unbound limitation',
  );
  assert(
    latticeManifest.decisions.some((decision) =>
      decision.definitions.includes('neighbor'),
    ),
    'degrading one body dropped an unrelated body\'s obligations',
  );
  // This crate lives under the scratch directory, which macOS reaches through
  // the /var -> /private/var symlink, so owning its obligations at all also
  // proves source ownership compares physical paths. Comparing them lexically
  // made every file "external" and measured nothing at all.
  //
  // The declined body's obligations must reach the manifest as explicitly
  // unmeasured. Without this the analyzer would see obligations with no hits
  // and count them as uncovered, reporting a measurement gap as a coverage
  // gap. The analyzer half is unit tested; this proves the seam between the
  // two, which is where such a defect would otherwise hide.
  const obligationsOf = (definition) =>
    [
      ...latticeManifest.points,
      ...latticeManifest.branches,
      ...latticeManifest.decisions,
      ...latticeManifest.selectionGroups,
    ]
      .filter((obligation) => obligation.definitions.includes(definition))
      .map(({id}) => id)
      .sort();
  // A branch a constant condition eliminates must reach the manifest as
  // NOT_COMPILED, never UNBOUND and never silently absent. Reporting it
  // uncovered would claim a coverage gap in code this build did not compile;
  // reporting it unbound would claim a binder defect that does not exist. The
  // deepEqual on unboundLimitations above is the other half of this: it fails
  // if such a statement ever lands in the unbound bucket instead.
  const eliminatedLimitations = latticeManifest.limitations.filter(
    (limitation) =>
      limitation.startsWith('RUST_OBLIGATION_NOT_COMPILED:') &&
      limitation.includes('cfg_eliminated'),
  );
  assert(
    eliminatedLimitations.length > 0,
    'a cfg-eliminated statement must record a not-compiled limitation',
  );
  assert(
    eliminatedLimitations.every((limitation) =>
      limitation.includes('a constant condition eliminates'),
    ),
    'the not-compiled reason must name the constant condition',
  );
  const eliminatedObligations = [
    ...latticeManifest.points,
    ...latticeManifest.branches,
  ]
    .filter((obligation) => obligation.definitions.includes('cfg_eliminated'))
    .map(({id}) => id);
  assert(
    eliminatedObligations.some((id) =>
      latticeManifest.unmeasuredObligations.includes(id),
    ),
    'the eliminated branch must be explicitly unmeasured, not uncovered',
  );
  // Same rule as the eliminated branch above, one level down: a constant
  // operand removes the switch, so the selection is unmeasurable rather than a
  // binder blind spot. The deepEqual on unboundLimitations is again the other
  // half — it fails if this lands in the unbound bucket instead.
  assert(
    latticeManifest.limitations.some(
      (limitation) =>
        limitation.startsWith('RUST_OBLIGATION_NOT_COMPILED:') &&
        limitation.includes('short_circuit_constant') &&
        limitation.includes('constant operand decides the short-circuit'),
    ),
    'a constant-operand short-circuit must record a not-compiled limitation',
  );
  const declined = [...latticeManifest.unmeasuredObligations].sort();
  const unbindableObligations = obligationsOf('unbindable');
  assert(
    unbindableObligations.length > 0,
    'the declined body recorded no obligations to check',
  );
  assert.deepEqual(
    unbindableObligations.filter((id) => !declined.includes(id)),
    [],
    'a declined body left obligations that would be counted as uncovered',
  );
  assert.deepEqual(
    obligationsOf('neighbor').filter((id) => declined.includes(id)),
    [],
    'declining one body wrongly marked an unrelated body unmeasured',
  );

  // Declining is scoped to what the failed phase actually cost. A phase that
  // degrades its own plan list to empty leaves the rest of the body
  // instrumented and firing, so declining that body wholesale would report
  // measured obligations as unmeasured — honest in direction, but it was
  // costing more exactness than every binder fix in this file recovered
  // (zmij declined 368 of 593 obligations from eleven narrow failures).
  //
  // The narrowing is the direction that can produce a wrong number, so it is
  // proven rather than argued: fail only the decision bind phase and require
  // that the same body's statements and match selections stay measured, while
  // the decision and the branches it owns are declined.
  const narrowOutput = join(scratch, 'lattice-gate-narrow-out');
  run(cargo, ['build', '--manifest-path', join(latticeCrate, 'Cargo.toml')], {
    env: {
      ...latticeEnvironment,
      CARGO_TARGET_DIR: join(scratch, 'lattice-gate-narrow-target'),
      SUPERCOV_RUST_COMPILER_OUTPUT: narrowOutput,
      SUPERCOV_RUST_STRICT_BINDING: '',
      SUPERCOV_RUST_FORCE_UNBINDABLE: '',
      SUPERCOV_RUST_FORCE_UNBOUND_DECISIONS: 'narrow',
    },
  });
  const narrowManifest = crateManifest(narrowOutput, 'lattice_gate');
  assert.deepEqual(
    narrowManifest.limitations.filter((limitation) =>
      limitation.startsWith('RUST_OBLIGATION_UNBOUND:'),
    ),
    [
      'RUST_OBLIGATION_UNBOUND: bind Rust decision probes in narrow: SUPERCOV_RUST_FORCE_UNBOUND_DECISIONS fault injection',
    ],
    'the narrow fault injection did not record exactly one unbound limitation',
  );
  const narrowDeclined = new Set(narrowManifest.unmeasuredObligations);
  const narrowOf = (collection) =>
    collection
      .filter((obligation) => obligation.definitions.includes('narrow'))
      .map(({id}) => id);
  const narrowDecisions = narrowOf(narrowManifest.decisions);
  const narrowPoints = narrowOf(narrowManifest.points);
  const narrowGroups = narrowOf(narrowManifest.selectionGroups);
  assert(
    narrowDecisions.length > 0 && narrowPoints.length > 0 && narrowGroups.length > 0,
    'the narrow gate body did not record all three obligation kinds',
  );
  assert.deepEqual(
    narrowDecisions.filter((id) => !narrowDeclined.has(id)),
    [],
    'a failed decision phase left its own decisions measured',
  );
  assert.deepEqual(
    narrowPoints.filter((id) => narrowDeclined.has(id)),
    [],
    'a failed decision phase declined statements that are still instrumented',
  );
  assert.deepEqual(
    narrowGroups.filter((id) => narrowDeclined.has(id)),
    [],
    'a failed decision phase declined match selections that are still instrumented',
  );
  // Branch obligations split by owner: the ones carrying the decision's
  // outcome are instrumented from the decision's plan, which is now empty, so
  // they must be declined with it. The arm branches come from the match plan,
  // which bound normally, so they must survive.
  const narrowBranches = (kinds) =>
    narrowManifest.branches
      .filter(
        (branch) =>
          branch.definitions.includes('narrow') && kinds.includes(branch.kind),
      )
      .map(({id}) => id);
  const ownedByDecision = narrowBranches([
    'decision-outcome',
    'loop-entry',
    'logical-selection',
  ]);
  const ownedByMatch = narrowBranches(['match-arm']);
  assert(
    ownedByDecision.length > 0 && ownedByMatch.length > 0,
    'the narrow gate body did not record both decision-owned and match-owned branches',
  );
  assert.deepEqual(
    ownedByDecision.filter((id) => !narrowDeclined.has(id)),
    [],
    'a declined decision left the branches it owns measured',
  );
  assert.deepEqual(
    ownedByMatch.filter((id) => narrowDeclined.has(id)),
    [],
    'a declined decision wrongly took the match arms down with it',
  );
  // The never-misbind invariant is the one that outranks everything, and a
  // misbind yields confident wrong numbers rather than no numbers, so
  // fail-closed uniqueness never exercises it. The structural post-conditions
  // are the automatic half of that guarantee — proven here by injecting one,
  // because a safety check never shown to fire is not a guarantee.
  const misbindStrict = spawnSync(
    cargo,
    ['build', '--manifest-path', join(latticeCrate, 'Cargo.toml')],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        ...latticeEnvironment,
        CARGO_TARGET_DIR: join(scratch, 'misbind-strict-target'),
        SUPERCOV_RUST_COMPILER_OUTPUT: join(scratch, 'misbind-strict-out'),
        SUPERCOV_RUST_FORCE_UNBINDABLE: '',
        SUPERCOV_RUST_FORCE_MISBIND: 'paired',
        SUPERCOV_RUST_STRICT_BINDING: '1',
      },
    },
  );
  assert.notEqual(
    misbindStrict.status,
    0,
    'strict binding accepted a decision bound to an already-claimed switch edge',
  );
  assert.match(
    misbindStrict.stderr,
    /misbind check: .* bound the same switch edge/u,
    'the misbind post-condition did not name the duplicated switch edge',
  );
  // Match arms of one group are alternatives, so they cannot share an entry.
  const misbindArms = spawnSync(
    cargo,
    ['build', '--manifest-path', join(latticeCrate, 'Cargo.toml')],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        ...latticeEnvironment,
        CARGO_TARGET_DIR: join(scratch, 'misbind-arms-target'),
        SUPERCOV_RUST_COMPILER_OUTPUT: join(scratch, 'misbind-arms-out'),
        SUPERCOV_RUST_FORCE_UNBINDABLE: '',
        SUPERCOV_RUST_FORCE_MISBIND: 'unbindable',
        SUPERCOV_RUST_STRICT_BINDING: '1',
      },
    },
  );
  assert.notEqual(
    misbindArms.status,
    0,
    'strict binding accepted two match arms entering the same block',
  );
  assert.match(
    misbindArms.stderr,
    /misbind check: match arms .* both enter block/u,
    'the match misbind post-condition did not name the shared entry block',
  );

  const strictLattice = spawnSync(
    cargo,
    ['build', '--manifest-path', join(latticeCrate, 'Cargo.toml')],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        ...latticeEnvironment,
        CARGO_TARGET_DIR: join(scratch, 'lattice-gate-strict-target'),
        SUPERCOV_RUST_COMPILER_OUTPUT: join(scratch, 'lattice-gate-strict-out'),
        SUPERCOV_RUST_STRICT_BINDING: '1',
      },
    },
  );
  assert.notEqual(
    strictLattice.status,
    0,
    'strict binding accepted an unbindable obligation instead of failing closed',
  );
  assert.match(
    strictLattice.stderr,
    /Supercov could not bind injected unbindable shape in unbindable/u,
    'strict binding did not name the exact unbindable obligation',
  );

  console.log(
    '[rustc-backend-spike] expanded-HIR obligations keep deterministic identities; compiler mappings become exact Supercov nested/short-circuit/pattern/while/match-guard/assertion vectors and pre-optimization for-loop/match/let-else/try first-commit branches with libtest contexts, while MIR/CTFE/rustdoc interception preserves behavior and source',
  );
} catch (error) {
  if (error !== nextestOnlyComplete) throw error;
} finally {
  if (process.env.SUPERCOV_RUSTC_SPIKE_KEEP_SCRATCH === '1') {
    process.stderr.write(`[rustc-backend-spike] retained scratch: ${scratch}\n`);
  } else {
    rmSync(scratch, {recursive: true, force: true});
  }
}
