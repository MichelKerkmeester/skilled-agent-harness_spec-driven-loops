#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: Node Engine Resolver                                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, describe, test } = require('node:test');
const {
  enumerateNodeCandidates,
  isNodeVersionInRange,
  parseNodeEngineRange,
  resolveNodeInterpreter,
} = require('./node-engine-resolver.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const FIXTURE_MANIFEST_PATH = '/fixture/code-mode/package.json';
const FIXTURE_HOME = '/fixture/home';
const SERVER_MANIFEST_PATH = path.join(
  __dirname,
  '..',
  '..',
  'skills',
  'mcp-code-mode',
  'mcp-server',
  'package.json',
);

function createFixtureHost(range, directories = {}, options = {}) {
  return {
    manifestPath: FIXTURE_MANIFEST_PATH,
    readFile(filePath) {
      assert.equal(filePath, FIXTURE_MANIFEST_PATH);
      const currentRange = typeof range === 'function' ? range() : range;
      return JSON.stringify({ engines: { node: currentRange } });
    },
    listDirectory(directoryPath) {
      return directories[directoryPath] ?? [];
    },
    homeDirectory: FIXTURE_HOME,
    pathEntries: options.pathEntries ?? [],
    runningInterpreter: options.runningInterpreter ?? {
      path: '/fixture/runtime/v25.6.1/bin/node',
      version: '25.6.1',
    },
  };
}

// A real directory tree, read through the default host access. The defect this
// guards against was invisible to injected fixtures: a listing of bare strings
// passes an entry test that every real directory entry fails.
const REAL_HOST_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'node-engine-resolver-'));

after(() => fs.rmSync(REAL_HOST_ROOT, { force: true, recursive: true }));

function writeInterpreterStub(stubPath, reportedVersion) {
  fs.mkdirSync(path.dirname(stubPath), { recursive: true });
  const body = reportedVersion === null
    ? '#!/bin/sh\nexit 1\n'
    : `#!/bin/sh\necho ${reportedVersion}\n`;
  fs.writeFileSync(stubPath, body, { mode: 0o755 });
  return stubPath;
}

function realHostCandidates(pathEntries) {
  return enumerateNodeCandidates({
    environment: {},
    homeDirectory: path.join(REAL_HOST_ROOT, 'absent-home'),
    pathEntries,
  });
}

function candidateFor(candidates, candidatePath) {
  return candidates.find((candidate) => candidate.path === candidatePath) ?? null;
}

function formatVersion(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}

// The server manifest is untracked, so a checkout that has not installed the
// server does not carry it. Skipping with the reason keeps that state legible
// instead of failing the workspace gate on a clean clone.
const SERVER_MANIFEST_SKIP = fs.existsSync(SERVER_MANIFEST_PATH)
  ? false
  : 'the vendored server manifest is absent from this checkout';

// ─────────────────────────────────────────────────────────────────────────────
// 3. RANGE CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('node engine range parsing', () => {
  test('supports comparator ranges and major-version shorthand', () => {
    assert.deepEqual(parseNodeEngineRange('>=24.0.0 <25.0.0'), {
      lowerBound: { major: 24, minor: 0, patch: 0 },
      upperBound: { major: 25, minor: 0, patch: 0 },
    });
    assert.deepEqual(parseNodeEngineRange('24'), {
      lowerBound: { major: 24, minor: 0, patch: 0 },
      upperBound: { major: 25, minor: 0, patch: 0 },
    });
  });

  test('rejects range syntax outside the supported contract', () => {
    for (const range of ['^24.0.0', '~24.0.0', '>=24.0.0', '24.x', '24 || 25']) {
      assert.equal(parseNodeEngineRange(range), null, range);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. CANDIDATE ENUMERATION TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('node engine candidate enumeration', () => {
  test('collects the running interpreter, search path, and version managers', () => {
    const directories = {
      [`${FIXTURE_HOME}/.nvm/versions/node`]: ['v20.19.5'],
      [`${FIXTURE_HOME}/.fnm/node-versions`]: ['v22.23.1'],
      [`${FIXTURE_HOME}/.volta/tools/image/node`]: ['24.9.0'],
      '/fixture/path/v25.6.1/bin': ['node'],
    };
    const host = createFixtureHost('24', directories, {
      pathEntries: ['/fixture/path/v25.6.1/bin'],
    });

    const candidates = enumerateNodeCandidates(host);
    const candidatePaths = candidates.map((candidate) => candidate.path);

    assert.ok(candidatePaths.includes('/fixture/runtime/v25.6.1/bin/node'));
    assert.ok(candidatePaths.includes('/fixture/path/v25.6.1/bin/node'));
    assert.ok(candidatePaths.includes(`${FIXTURE_HOME}/.nvm/versions/node/v20.19.5/bin/node`));
    assert.ok(candidatePaths.includes(
      `${FIXTURE_HOME}/.fnm/node-versions/v22.23.1/installation/bin/node`,
    ));
    assert.ok(candidatePaths.includes(`${FIXTURE_HOME}/.volta/tools/image/node/24.9.0/bin/node`));
  });

  test(
    'continues with running and search-path candidates when manager directories are absent',
    () => {
      const host = createFixtureHost('>=24.0.0 <25.0.0', {}, {
        pathEntries: ['/fixture/path/v24.2.0/bin'],
        runningInterpreter: {
          path: '/fixture/runtime/v25.6.1/bin/node',
          version: '25.6.1',
        },
      });
      host.listDirectory = (directoryPath) => (
        directoryPath === '/fixture/path/v24.2.0/bin' ? ['node'] : (() => {
          throw new Error(`unexpected directory access: ${directoryPath}`);
        })()
      );

      const result = resolveNodeInterpreter(host);

      assert.equal(result.path, '/fixture/path/v24.2.0/bin/node');
    },
  );

  test('stops probing once the budget is spent', () => {
    const directories = {};
    const pathEntries = [];
    for (let index = 0; index < 25; index += 1) {
      const directoryPath = `/fixture/opaque-${index}/bin`;
      directories[directoryPath] = ['node'];
      pathEntries.push(directoryPath);
    }

    let probeCount = 0;
    const host = createFixtureHost('>=24.0.0 <25.0.0', directories, { pathEntries });
    host.realPath = (filePath) => filePath;
    host.probeVersion = (interpreterPath) => {
      probeCount += 1;
      assert.match(interpreterPath, /^\/fixture\/opaque-\d+\/bin\/node$/);
      return 'v24.5.0\n';
    };

    const candidates = enumerateNodeCandidates(host);
    const probed = candidates.filter((candidate) => candidate.source === 'PATH-probe');

    assert.equal(probeCount, 16);
    assert.equal(probed.length, 16);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. REAL SEARCH-PATH ENUMERATION TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('node engine search path enumeration on a real host', () => {
  test('returns an interpreter whose own path carries the version', () => {
    const binDirectory = path.join(REAL_HOST_ROOT, 'versioned', 'v24.11.0', 'bin');
    const interpreterPath = writeInterpreterStub(path.join(binDirectory, 'node'), 'v24.11.0');

    const candidate = candidateFor(realHostCandidates([binDirectory]), interpreterPath);

    assert.ok(candidate, 'a real search-path interpreter must be enumerated');
    assert.equal(candidate.source, 'PATH');
    assert.equal(formatVersion(candidate.version), '24.11.0');
  });

  test('reads the version from the link target when the entry path carries none', () => {
    const targetPath = writeInterpreterStub(
      path.join(REAL_HOST_ROOT, 'cellar', 'node@24', '24.12.0', 'bin', 'node'),
      'v24.12.0',
    );
    const linkDirectory = path.join(REAL_HOST_ROOT, 'opt-bin');
    const linkPath = path.join(linkDirectory, 'node');
    fs.mkdirSync(linkDirectory, { recursive: true });
    fs.symlinkSync(targetPath, linkPath);

    const candidate = candidateFor(realHostCandidates([linkDirectory]), linkPath);

    assert.ok(candidate, 'a linked interpreter must be enumerated');
    assert.equal(candidate.source, 'PATH-link');
    assert.equal(formatVersion(candidate.version), '24.12.0');
  });

  test('asks the interpreter when no path in the chain carries a version', () => {
    const binDirectory = path.join(REAL_HOST_ROOT, 'usr-local', 'bin');
    const interpreterPath = writeInterpreterStub(path.join(binDirectory, 'node'), 'v24.13.0');

    const candidate = candidateFor(realHostCandidates([binDirectory]), interpreterPath);

    assert.ok(candidate, 'an unversioned interpreter must still be enumerated');
    assert.equal(candidate.source, 'PATH-probe');
    assert.equal(formatVersion(candidate.version), '24.13.0');
  });

  test('drops a candidate that cannot report a version, without failing the search', () => {
    const silentDirectory = path.join(REAL_HOST_ROOT, 'silent', 'bin');
    const silentPath = writeInterpreterStub(path.join(silentDirectory, 'node'), null);
    const workingDirectory = path.join(REAL_HOST_ROOT, 'working', 'v24.14.0', 'bin');
    const workingPath = writeInterpreterStub(path.join(workingDirectory, 'node'), 'v24.14.0');

    const candidates = realHostCandidates([silentDirectory, workingDirectory]);

    assert.equal(candidateFor(candidates, silentPath), null);
    assert.ok(candidateFor(candidates, workingPath), 'a later candidate must still be found');
  });

  test('does not treat a directory named node as an interpreter', () => {
    const binDirectory = path.join(REAL_HOST_ROOT, 'decoy', 'v24.15.0', 'bin');
    fs.mkdirSync(path.join(binDirectory, 'node'), { recursive: true });

    const candidates = realHostCandidates([binDirectory]);

    assert.equal(candidateFor(candidates, path.join(binDirectory, 'node')), null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. RESOLUTION TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('node engine resolution', () => {
  test('returns no interpreter instead of a nearest out-of-range candidate', () => {
    const range = '>=24.0.0 <25.0.0';
    const host = createFixtureHost(range, {
      [`${FIXTURE_HOME}/.nvm/versions/node`]: ['v20.19.5', 'v22.23.1'],
    });

    const result = resolveNodeInterpreter(host);

    assert.equal(result.path, null);
    assert.equal(result.range, range);
    assert.equal(result.reason, 'unsatisfied');
  });

  test('changes selection when only the fixture manifest range changes', () => {
    let range = '>=22.0.0 <23.0.0';
    const directories = {
      [`${FIXTURE_HOME}/.nvm/versions/node`]: ['v20.19.5', 'v22.23.1', 'v24.9.0'],
    };
    const host = createFixtureHost(() => range, directories);

    const first = resolveNodeInterpreter(host);
    range = '>=24.0.0 <25.0.0';
    const second = resolveNodeInterpreter(host);

    assert.equal(first.path, `${FIXTURE_HOME}/.nvm/versions/node/v22.23.1/bin/node`);
    assert.equal(second.path, `${FIXTURE_HOME}/.nvm/versions/node/v24.9.0/bin/node`);
  });

  test('selects the highest satisfying candidate deterministically', () => {
    const directories = {
      [`${FIXTURE_HOME}/.nvm/versions/node`]: ['v24.9.0', 'v24.8.0'],
    };
    const host = createFixtureHost('>=24.0.0 <25.0.0', directories);

    const first = resolveNodeInterpreter(host);
    const second = resolveNodeInterpreter(host);

    assert.deepEqual(second, first);
    assert.equal(first.path, `${FIXTURE_HOME}/.nvm/versions/node/v24.9.0/bin/node`);
  });

  // Asserted as a property of the answer rather than as one machine's path, so
  // the suite travels to a host with a different interpreter layout.
  test('resolves the real host to an interpreter satisfying the declared range', {
    skip: SERVER_MANIFEST_SKIP,
  }, () => {
    const declaredRange = JSON.parse(
      fs.readFileSync(SERVER_MANIFEST_PATH, 'utf8'),
    ).engines.node;

    const result = resolveNodeInterpreter({ manifestPath: SERVER_MANIFEST_PATH });

    assert.equal(result.range, declaredRange);
    assert.equal(result.reason, null);
    assert.ok(result.path, `no interpreter on this host satisfies ${declaredRange}`);

    const selected = enumerateNodeCandidates().find(
      (candidate) => candidate.path === result.path,
    );
    assert.ok(selected, 'the resolved interpreter must be one of the enumerated candidates');
    assert.ok(
      isNodeVersionInRange(selected.version, parseNodeEngineRange(declaredRange)),
      `${formatVersion(selected.version)} does not satisfy ${declaredRange}`,
    );
  });
});
