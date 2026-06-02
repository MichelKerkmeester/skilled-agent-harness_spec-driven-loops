// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ materialize-benchmark-fixtures — render benchmark fixtures to output md  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
// F017-P2-09 (017 review): the profiles-dir default and fixturePathFor are shared
// with run-benchmark.cjs via ../lib/profile-resolve.cjs so the F-P1-4b "resolves
// identically in both steps" invariant is one source of truth, not a byte-aligned
// hand-maintained copy.
const { DEFAULT_PROFILES_DIR, fixturePathFor } = require('../lib/profile-resolve.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];
    if (!entry.startsWith('--')) continue;
    const [key, ...rest] = entry.slice(2).split('=');
    if (rest.length > 0) args[key] = rest.join('=');
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) args[key] = argv[++index];
    else args[key] = true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveInput(value, baseDir) {
  if (path.isAbsolute(value)) return value;
  const fromCwd = path.resolve(process.cwd(), value);
  return fs.existsSync(fromCwd) ? fromCwd : path.resolve(baseDir, value);
}

// F017-P1-01 (017 review): the materializer is the FIRST writer in the wired
// plan (loop-host runs materialize before run-benchmark) and writes
// path.join(outputsDir, `${fixture.id}.md`) below. An unsanitized id like
// '../escaped' or 'a/b' escapes outputsDir at materialization time. Apply the
// SAME guard run-benchmark.cjs uses (SAFE_FIXTURE_ID + assertSafeFixtureId):
// restrict ids to a basename charset and reject path separators / parent-dir
// traversal before any path.join.
const SAFE_FIXTURE_ID = /^[A-Za-z0-9._-]+$/;

function assertSafeFixtureId(id) {
  if (typeof id !== 'string' || id.length === 0 || !SAFE_FIXTURE_ID.test(id) || id === '.' || id === '..') {
    throw new Error(`materialize: unsafe fixture id '${id}' (must match ${SAFE_FIXTURE_ID} and not be '.'/'..' or contain path separators)`);
  }
  return id;
}

function renderFixture(fixture) {
  if (typeof fixture.markdown === 'string') {
    return fixture.markdown.endsWith('\n') ? fixture.markdown : `${fixture.markdown}\n`;
  }

  const lines = [
    `# ${fixture.title || fixture.id}`,
    '',
    fixture.description || '',
    '',
    '## Candidate',
    '',
    `candidateId: ${fixture.id}`,
    '',
    '## Evidence',
    '',
    ...(fixture.content || []),
  ];
  if ((fixture.requiredHeadings || []).some((heading) => /legal stop/i.test(heading))) {
    lines.push('', '## Legal Stop', '', 'details.gateResults: present');
  }
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.profile || !args['outputs-dir']) {
    process.stderr.write('Usage: node materialize-benchmark-fixtures.cjs --profile <path> --outputs-dir <path>\n');
    process.exit(2);
  }

  // F-P1-4b: resolve --profile as a direct path OR a profile id under --profiles-dir,
  // matching run-benchmark.cjs loadProfile so a profile-by-id does not fail here before run-benchmark.
  const profilesDir = args['profiles-dir'] || DEFAULT_PROFILES_DIR;
  const directPath = path.resolve(process.cwd(), args.profile);
  const profilePath = fs.existsSync(directPath) ? directPath : path.join(profilesDir, `${args.profile}.json`);
  if (!fs.existsSync(profilePath)) {
    process.stderr.write(`Benchmark profile not found (tried direct path and id under ${profilesDir}): ${args.profile}\n`);
    process.exit(1);
  }

  const profile = readJson(profilePath);
  const fixtureDir = resolveInput(profile.fixtureDir || profile.benchmark?.fixtureDir, path.dirname(profilePath));
  const fixtureRefs = profile.fixtures || profile.benchmark?.fixtures || [];
  const outputsDir = path.resolve(process.cwd(), args['outputs-dir']);

  // F017-P1-01: load + validate every fixture (existence AND id safety) BEFORE
  // creating outputsDir or writing any file, so a single hostile id aborts with
  // a non-zero exit and writes nothing inside OR outside outputsDir.
  const materialized = [];
  for (const fixtureRef of fixtureRefs) {
    const filePath = fixturePathFor(fixtureRef, fixtureDir);
    if (!fs.existsSync(filePath)) {
      process.stderr.write(`Benchmark fixture not found: ${filePath}\n`);
      process.exit(1);
    }
    const fixture = readJson(filePath);
    try {
      assertSafeFixtureId(fixture.id);
    } catch (error) {
      process.stderr.write(`${error.message}\n`);
      process.exit(1);
    }
    materialized.push(fixture);
  }

  fs.mkdirSync(outputsDir, { recursive: true });
  for (const fixture of materialized) {
    fs.writeFileSync(path.join(outputsDir, `${fixture.id}.md`), renderFixture(fixture), 'utf8');
  }

  process.stdout.write(JSON.stringify({
    status: 'fixtures-materialized',
    profileId: profile.profileId || profile.id,
    outputsDir,
    fixtures: fixtureRefs.length,
  }) + '\n');
}

main();
