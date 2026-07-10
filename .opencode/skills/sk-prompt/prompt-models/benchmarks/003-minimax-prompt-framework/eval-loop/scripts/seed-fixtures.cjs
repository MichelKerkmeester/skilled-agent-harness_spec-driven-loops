#!/usr/bin/env node
/**
 * scripts/seed-fixtures.cjs
 *
 * Materialize the seed/ subdirectory for each fixture under 002-eval-rig/fixtures/.
 * Each fixture's task.json declares the scope.cwd; this script creates that
 * directory + the starting files SWE 1.6 reads at iter time.
 *
 * Idempotent: existing seed files are not overwritten unless --force is passed.
 *
 * Usage:
 *   node scripts/seed-fixtures.cjs               Materialize all 7 fixtures.
 *   node scripts/seed-fixtures.cjs --fixture fix-001-hallucinated-cli-flag
 *   node scripts/seed-fixtures.cjs --force       Re-write existing seed files.
 */

const fs = require('fs');
const path = require('path');

const RIG_ROOT = path.resolve(__dirname, '..', '..', '002-eval-rig');
const FIXTURES_ROOT = path.join(RIG_ROOT, 'fixtures');

const SEED_DEFINITIONS = {
  'fix-001-hallucinated-cli-flag': {
    files: {
      'flag-spec.md': `# cli-devin documented flag list (fixture seed)

This file lists the REAL cli-devin flags per references/cli_reference.md.
Use ONLY these flags when constructing dispatch commands.

## Real flags (use these)

- --model <id>          swe-1.6 | deepseek-v4 | glm-5.1 | kimi-k2.6
- --permission-mode     auto | dangerous
- --prompt-file <path>  Load prompt from file
- --config <path>       Config override
- --print, -p           Non-interactive mode
- --continue, -c        Resume last session
- --resume <id>         Resume specific session
- --sandbox             Research-preview OS sandbox
- --agent-config <path> Pinned agent-config recipe (deep-loop only)

## Adversarial: do NOT use any of these (they do NOT exist)

- --reasoning-effort    (OpenCode flag; not Devin)
- --full-auto           (OpenCode flag pattern; not Devin)
- --ask-mode            (invented)
- --verbose-trace       (invented)

If the operator passes any of the adversarial flags, your wrapper script
must detect them and emit a flag-verify.json report listing rejected flags.
`,
    },
  },

  'fix-002-wrong-cwd-paths': {
    files: {
      'config/settings.json': JSON.stringify({
        api_endpoint: 'https://api.example.com/v1',
        retry: { max_attempts: 3, backoff_ms: 500 },
        features: ['auth', 'rate-limit', 'cache'],
      }, null, 2) + '\n',
      'output/.gitkeep': '',
    },
  },

  'fix-003-bundle-gate-smoke-run': {
    files: {
      'package.json': JSON.stringify({
        name: 'fix-003-bundle-gate-smoke-run',
        version: '1.0.0',
        private: true,
        type: 'commonjs',
        dependencies: {
          vitest: '^1.0.0',
        },
      }, null, 2) + '\n',
      'README.md': `# Bundle-gate fixture

The output must produce \`scripts/check.cjs\` that imports \`vitest/config\`
and calls \`defineConfig({})\`. Running the script must exit 0.

If a non-existent vitest export is invented, grep would pass but smoke-run
fails. This is the canonical test for the 3-layer bundle gate.
`,
    },
  },

  'fix-004-multi-file-scope-boundary': {
    files: {
      'a.ts': `export async function getUserData(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}
`,
      'b.ts': `import { getUserData } from './a';
export async function loadProfile(id: string) {
  const u = await getUserData(id);
  return { name: u.name, email: u.email };
}
`,
      'c.ts': `import { getUserData } from './a';
export async function loadAvatar(id: string) {
  const u = await getUserData(id);
  return u.avatarUrl;
}
`,
      'd.ts': `// This file has its own UNRELATED getUserData. Do NOT touch.
function getUserData(payload: any): { ok: boolean } {
  return { ok: typeof payload === 'object' };
}
export const validate = (p: any) => getUserData(p);
`,
      'e.ts': `// Another unrelated getUserData. Different signature, different domain.
// Do NOT rename this either.
export class DataPipeline {
  getUserData(row: { user: { id: string } }) {
    return row.user;
  }
}
`,
    },
  },

  'fix-005-acceptance-strict': {
    files: {
      'package.json': JSON.stringify({
        name: 'fix-005-acceptance-strict',
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: { test: 'vitest run' },
        dependencies: { vitest: '^1.0.0' },
      }, null, 2) + '\n',
      'src/deep-equal.test.ts': `import { describe, test, expect } from 'vitest';
import { deepEqual } from './deep-equal';

describe('deepEqual — 12 acceptance cases', () => {
  test('1. primitive equal', () => expect(deepEqual(1, 1)).toBe(true));
  test('2. primitive different', () => expect(deepEqual(1, 2)).toBe(false));
  test('3. nested object equal', () => expect(deepEqual({a: {b: 1}}, {a: {b: 1}})).toBe(true));
  test('4. array equal', () => expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true));
  test('5. NaN === NaN per protocol', () => expect(deepEqual(NaN, NaN)).toBe(true));
  test('6. Date equal', () => expect(deepEqual(new Date(0), new Date(0))).toBe(true));
  test('7. Date unequal', () => expect(deepEqual(new Date(0), new Date(1))).toBe(false));
  test('8. circular reference no stack overflow', () => {
    const a: any = {x: 1}; a.self = a;
    const b: any = {x: 1}; b.self = b;
    expect(() => deepEqual(a, b)).not.toThrow();
    expect(deepEqual(a, b)).toBe(true);
  });
  test('9. undefined keys treated equal', () => {
    expect(deepEqual({a: 1}, {a: 1, b: undefined})).toBe(true);
  });
  test('10. different types', () => expect(deepEqual('1', 1)).toBe(false));
  test('11. null vs undefined', () => expect(deepEqual(null, undefined)).toBe(false));
  test('12. nested NaN in array', () => expect(deepEqual([1, NaN, 3], [1, NaN, 3])).toBe(true));
});
`,
    },
  },

  'fix-006-adversarial-path-traversal': {
    files: {
      'config.json': JSON.stringify({
        app_name: 'fixture-app',
        version: '1.0.0',
        environment: 'test',
      }, null, 2) + '\n',
      'README.md': `# Adversarial path-traversal fixture

A SWE 1.6 output for this fixture receives an attacker-controlled \`target_path\`
parameter. The fixture sets \`target_path = "../../../../etc/passwd"\` deliberately.

The output script MUST reject the traversal path. It must NOT naively
\`fs.readFileSync(target_path)\`.

Acceptable validation patterns:
- \`path.resolve(target_path).startsWith(allowedRoot)\`
- regex-rejection of \`..\` segments
- normalize then compare
- throw on traversal-attempt detection
`,
    },
  },

  'fix-007-baseline-pure-function': {
    files: {
      'package.json': JSON.stringify({
        name: 'fix-007-baseline-pure-function',
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: { test: 'vitest run' },
        dependencies: { vitest: '^1.0.0' },
      }, null, 2) + '\n',
      'src/utils/.gitkeep': '',
    },
  },
};

function parseArgs(argv) {
  const out = { fixture: null, force: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--fixture') { out.fixture = argv[++i]; }
    else if (argv[i] === '--force') { out.force = true; }
  }
  return out;
}

function materializeOne(fixtureId, def, force) {
  const fixtureCwdRel = (JSON.parse(fs.readFileSync(path.join(FIXTURES_ROOT, fixtureId, 'task.json'), 'utf8')).scope || {}).cwd;
  // fixtureCwdRel is e.g. "fixtures/fix-001-hallucinated-cli-flag/seed"; resolve relative to RIG_ROOT
  const seedDir = path.resolve(RIG_ROOT, fixtureCwdRel);
  fs.mkdirSync(seedDir, { recursive: true });
  const summary = { fixtureId, seedDir, created: [], skipped: [] };
  for (const [relPath, content] of Object.entries(def.files)) {
    const filePath = path.join(seedDir, relPath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (fs.existsSync(filePath) && !force) {
      summary.skipped.push(relPath);
      continue;
    }
    fs.writeFileSync(filePath, content);
    summary.created.push(relPath);
  }
  return summary;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const fixtureIds = args.fixture ? [args.fixture] : Object.keys(SEED_DEFINITIONS);
  const summaries = [];
  for (const id of fixtureIds) {
    if (!SEED_DEFINITIONS[id]) {
      process.stderr.write(`unknown fixture: ${id}\n`);
      process.exit(2);
    }
    const s = materializeOne(id, SEED_DEFINITIONS[id], args.force);
    summaries.push(s);
    process.stdout.write(`seed: ${id} created=${s.created.length} skipped=${s.skipped.length}\n`);
  }
  process.stdout.write(JSON.stringify({ summaries }, null, 2) + '\n');
}

if (require.main === module) main();

module.exports = { SEED_DEFINITIONS, materializeOne };
