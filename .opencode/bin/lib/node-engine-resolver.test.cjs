#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: Node Engine Resolver                                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const path = require('node:path');
const { describe, test } = require('node:test');
const {
  enumerateNodeCandidates,
  parseNodeEngineRange,
  resolveNodeInterpreter,
} = require('./node-engine-resolver.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const FIXTURE_MANIFEST_PATH = '/fixture/code-mode/package.json';
const FIXTURE_HOME = '/fixture/home';

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
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. RESOLUTION TESTS
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

  test('resolves the real host to the currently compatible interpreter', () => {
    const manifestPath = path.join(
      __dirname,
      '..',
      '..',
      'skills',
      'mcp-code-mode',
      'mcp-server',
      'package.json',
    );

    const result = resolveNodeInterpreter({ manifestPath });

    assert.equal(result.path, '/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node');
    assert.equal(result.range, '>=24.0.0 <25.0.0');
  });
});
