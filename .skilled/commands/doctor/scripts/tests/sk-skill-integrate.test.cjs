#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sk-skill-integrate.test: the conversion's six integration rows            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Proves the integration rows a conversion ends with: the advisor scan and its
 * manual fallback, the compiled skill graph, the reach and budget report, the
 * regression cases, the Hermes mirror and the changelog link. Every case builds
 * its own repository under the OS temp directory, so no case can read or write
 * this checkout: the advisor, the compiler and the Hermes sync are stand-in
 * scripts inside that temporary tree, spawned for real so the argv the rows build
 * is the argv a run uses. Two cases close the loop with real tools: the freshness
 * panel reads the graph the row compiled, and the package check reads the skill
 * after the rows wrote into it.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const surface = require('../lib/sk-skill-surface.cjs');
const integrate = require('../lib/sk-skill-integrate.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = surface.findRepoRoot(__dirname);
const DOCTOR_SCRIPTS = path.join(REPO_ROOT, '.skilled', 'commands', 'doctor', 'scripts');
const FRESHNESS = path.join(DOCTOR_SCRIPTS, 'skill-graph-freshness.cjs');
const SKILL_DOC_SCRIPTS = path.join(REPO_ROOT, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
const PACKAGE_SKILL = path.join(SKILL_DOC_SCRIPTS, 'package_skill.py');
const REACH = path.join(SKILL_DOC_SCRIPTS, 'ci-router-vocabulary-reach.cjs');

const ADVISOR_SCRIPTS = path.join(
  REPO_ROOT, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts',
);
const REGRESSION_RUNNER = path.join(ADVISOR_SCRIPTS, 'skill_advisor_regression.py');
const SPAWN_TIMEOUT_MS = 300000;
const PYTHON = process.env.PYTHON || 'python3';
const SKILL = 'demo-skill';
const PHRASES = ['demo phrase one', 'demo phrase two', 'demo phrase three'];
const DESCRIPTION = 'Convert an example skill end to end.';

// A stand-in advisor: it records the argv it was given and answers in the live
// envelope the rows and the reach check both require. The log is what proves the
// fallback rebuild is never invoked.
const ADVISOR_STUB = `'use strict';
const fs = require('node:fs');
const log = process.env.INTEGRATE_TEST_LOG;
const argv = process.argv.slice(2);
if (log) fs.appendFileSync(log, JSON.stringify({ tool: 'advisor', argv }) + '\\n');
const command = argv[0];
if (command === 'skill_graph_scan') {
  const exitCode = Number(process.env.INTEGRATE_TEST_SCAN_EXIT || 0);
  process.stdout.write(exitCode === 0 ? 'scan complete\\n' : 'scan failed\\n');
  process.exit(exitCode);
}
if (command === 'advisor_recommend') {
  const exitCode = Number(process.env.INTEGRATE_TEST_ADVISOR_EXIT || 0);
  if (exitCode !== 0) {
    process.stderr.write('backend unavailable\\n');
    process.exit(exitCode);
  }
  const prompt = JSON.parse(argv[2]).prompt;
  const scenario = JSON.parse(process.env.INTEGRATE_TEST_SCENARIO || '{"*":[]}');
  const recommendations = scenario[prompt] || scenario['*'] || [];
  process.stdout.write(JSON.stringify({
    data: {
      trustState: { state: 'live', generation: 3 },
      effectiveThresholds: { confidenceThreshold: 0.8 },
      recommendations,
    },
  }));
  process.exit(0);
}
process.stderr.write('unexpected command: ' + command + '\\n');
process.exit(2);
`;

// The real compiler writes its output beside itself and reads the skills root
// three levels up, so the stand-in derives both from its own path the same way.
const COMPILER_STUB = `#!/usr/bin/env python3
import glob
import json
import os
import sys
from datetime import datetime, timezone

if '--export-json' not in sys.argv:
    sys.stderr.write('expected --export-json')
    sys.exit(2)
here = os.path.dirname(os.path.realpath(__file__))
skills = os.path.abspath(os.path.join(here, '..', '..', '..'))
families = {}
signals = {}
for meta_path in sorted(glob.glob(os.path.join(skills, '*', 'graph-metadata.json'))):
    with open(meta_path, encoding='utf-8') as handle:
        data = json.load(handle)
    skill_id = data['skill_id']
    families.setdefault(data.get('family', 'system'), []).append(skill_id)
    signals[skill_id] = list(dict.fromkeys(data.get('intent_signals', [])))
graph = {
    'schema_version': 1,
    'generated_at': datetime.now(timezone.utc).isoformat(),
    'skill_count': len(signals),
    'families': families,
    'adjacency': {},
    'signals': signals,
    'conflicts': [],
    'hub_skills': [],
    'topology_warnings': {},
}
with open(os.path.join(here, 'skill-graph.json'), 'w', encoding='utf-8') as handle:
    json.dump(graph, handle)
print('Compiled skill-graph.json: %d skills' % len(signals))
`;

const HERMES_STUB = `'use strict';
const fs = require('node:fs');
const path = require('node:path');
const log = process.env.INTEGRATE_TEST_LOG;
const argv = process.argv.slice(2);
if (log) fs.appendFileSync(log, JSON.stringify({ tool: 'hermes', argv }) + '\\n');
const check = argv.includes('--check');
const exitCode = Number(process.env[check ? 'INTEGRATE_TEST_HERMES_CHECK_EXIT' : 'INTEGRATE_TEST_HERMES_SYNC_EXIT'] || 0);
// A sync writes the copy folder; a --check only reads it. The write toggle keeps
// the "sync reported success but wrote nothing" case reachable.
if (!check && exitCode === 0 && process.env.INTEGRATE_TEST_HERMES_WRITE !== '0') {
  const output = process.env.HERMES_SKILLS_OUTPUT_DIR || path.join(process.cwd(), '.hermes', 'skills');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'copied.txt'), 'copy\\n');
}
process.stdout.write(check
  ? (exitCode === 0 ? 'PASS: in sync\\n' : 'DRIFT demo-skill\\n')
  : 'SYNCED\\n');
process.exit(exitCode);
`;

const REACH_ADVISOR_STUB = `'use strict';
const fs = require('node:fs');
const scenario = JSON.parse(fs.readFileSync(process.env.REACH_TEST_SCENARIO, 'utf8'));
const prompt = JSON.parse(process.argv.slice(2)[2]).prompt;
const recommendations = Array.isArray(scenario) ? scenario : (scenario[prompt] || scenario['*'] || []);
process.stdout.write(JSON.stringify({
  data: {
    trustState: { state: 'live', generation: 11 },
    effectiveThresholds: { confidenceThreshold: 0.8 },
    recommendations,
  },
}));
`;

// The fleet report is pinned to a golden recorded from the script as it was before
// --skill existed. Reading that version back with git show would return this same
// file once the flag is committed, and a baseline that follows the file under test
// can never disagree with it.
const FLEET_REPORT = path.join(
  DOCTOR_SCRIPTS, 'tests', 'fixtures', 'sk-skill-integrate', 'router-reach-fleet-report.json',
);

// The case owns the fleet rather than copying a shipped hub, so the golden moves
// only when this fixture does. No declared phrase is on the allowlist either: an
// allowlisted one would tie the golden to that file as well.
const FLEET_ROUTER = `# mcp-tooling Router

## 3. MACHINE ROUTER

\`\`\`python
INTENT_SIGNALS = {
    "PRIMARY": {"weight": 1.0, "keywords": ["plan a tool server", "wire an mcp server"]},
    "SECONDARY": {"weight": 0.6, "keywords": ["audit tool routing", "choose a transport layer"]},
}
\`\`\`
`;

// One phrase per outcome the fleet path can report, so the golden covers a hit that
// prints no row, an outranked row, a wrong-hub row and a phrase that reaches nobody.
const FLEET_SCENARIO = {
  'plan a tool server': [{ skillId: 'mcp-tooling', confidence: 0.95 }],
  'wire an mcp server': [{ skillId: 'sk-code', confidence: 0.95 }, { skillId: 'mcp-tooling', confidence: 0.9 }],
  'audit tool routing': [{ skillId: 'sk-doc', confidence: 0.95 }],
  'choose a transport layer': [],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEMP REPOSITORY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function makeTempRepo(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-skill-integrate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function writeFile(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function skillDocument(name, phrases, version) {
  return [
    '---',
    `name: ${name}`,
    `description: "${DESCRIPTION}"`,
    'allowed-tools:',
    '  - Read',
    '  - Grep',
    `version: ${version}`,
    '---',
    '',
    `# ${name}`,
    '',
    '## WHEN TO USE',
    '',
    'Use this skill for the demo case.',
    '',
    '## SMART ROUTING',
    '',
    'The machine router lives in the sibling [`ROUTER.md`](./ROUTER.md).',
    '',
    '## HOW IT WORKS',
    '',
    'Read `references/guide.md` and follow it.',
    '',
    '## RULES',
    '',
    '### ✅ ALWAYS',
    '',
    '- Read the guide.',
    '',
    '### ❌ NEVER',
    '',
    '- Skip the guide.',
    '',
    '### ⚠️ ESCALATE IF',
    '',
    '- The guide is missing.',
    '',
    '## REFERENCES',
    '',
    '- `references/guide.md`',
    '',
  ].join('\n');
}

function routerDocument(name, phrases, version) {
  // The reach check reads a block that ends on its own closing brace, the shape
  // every shipped router uses.
  const keywords = phrases.map((phrase) => `"${phrase}"`).join(', ');
  return [
    '---',
    `title: "${name} Router"`,
    `description: "Sibling router for ${name}: the intent signals, the resource map and the no-match fallback."`,
    'trigger_phrases:',
    `  - "${name} router"`,
    `  - "${name} routing"`,
    'importance_tier: normal',
    'contextType: general',
    `version: ${version}`,
    'router_state: active',
    'skill_pointer: SKILL.md',
    '---',
    '',
    `# ${name} Router`,
    '',
    '## 3. MACHINE ROUTER',
    '',
    '```python',
    'INTENT_SIGNALS = {',
    `    "PRIMARY": {"weight": 1.0, "keywords": [${keywords}]}`,
    '}',
    'RESOURCE_MAP = {"PRIMARY": ["references/guide.md"]}',
    'DEFAULT_RESOURCE = "references/guide.md"',
    'UNKNOWN_FALLBACK_CHECKLIST = ["references/guide.md"]',
    '',
    'def discover_markdown_resources(root):',
    '    return [root]',
    '',
    'def _guard_in_skill(candidate):',
    '    return candidate',
    '',
    'UNKNOWN_FALLBACK = "references/guide.md"',
    '```',
    '',
  ].join('\n');
}

function graphMetadata(name, phrases) {
  return `${JSON.stringify({
    schema_version: 1,
    skill_id: name,
    family: 'sk-util',
    category: 'utility',
    edges: {
      depends_on: [],
      enhances: [],
      siblings: [],
      conflicts_with: [],
      prerequisite_for: [],
    },
    domains: ['demo'],
    intent_signals: phrases,
    derived: { generated_at: '2020-01-01T00:00:00+00:00' },
  }, null, 2)}\n`;
}

// A skill that passes the package check on its own, written where the case says.
function writeSkillPackage(skillRoot, options = {}) {
  const name = options.name || SKILL;
  const version = options.version || '1.0.0.0';
  const phrases = options.phrases || PHRASES;
  writeFile(path.join(skillRoot, 'SKILL.md'), skillDocument(name, phrases, version));
  writeFile(path.join(skillRoot, 'ROUTER.md'), routerDocument(name, phrases, version));
  writeFile(path.join(skillRoot, 'graph-metadata.json'), graphMetadata(name, phrases));
  writeFile(path.join(skillRoot, 'references', 'guide.md'), [
    '---',
    'title: "Demo guide"',
    'description: "The one reference document the demo skill loads."',
    'trigger_phrases:',
    '  - "demo guide"',
    'importance_tier: normal',
    'contextType: general',
    `version: ${version}`,
    '---',
    '',
    '# Demo guide',
    '',
    'Read this document.',
    '',
  ].join('\n'));
}

function writeStubs(repoRoot) {
  writeFile(path.join(repoRoot, '.skilled', 'bin', 'skill-advisor.cjs'), ADVISOR_STUB);
  writeFile(
    path.join(repoRoot, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts', 'skill_graph_compiler.py'),
    COMPILER_STUB,
  );
  writeFile(
    path.join(repoRoot, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli', 'hermes', 'sync-skills-hermes.cjs'),
    HERMES_STUB,
  );
}

function makeRepo(t, options = {}) {
  const repoRoot = makeTempRepo(t);
  writeStubs(repoRoot);
  const name = (options.skill && options.skill.name) || SKILL;
  const skillRoot = options.skillOutside
    ? path.join(repoRoot, 'adopter', name)
    : path.join(repoRoot, '.skilled', 'skills', name);
  writeSkillPackage(skillRoot, options.skill);
  return { repoRoot, skillRoot, name, skillsDir: path.join(repoRoot, '.skilled', 'skills') };
}

function makeContext(repoRoot, skillsDir, env = {}, paths = {}) {
  return surface.createContext({
    repoRoot,
    skillsDir: skillsDir || path.join(repoRoot, '.skilled', 'skills'),
    cwd: repoRoot,
    python: PYTHON,
    paths,
    env: { ...process.env, PYTHON: PYTHON, INTEGRATE_TEST_LOG: path.join(repoRoot, 'calls.log'), ...env },
  });
}

function callLog(repoRoot) {
  const log = path.join(repoRoot, 'calls.log');
  if (!fs.existsSync(log)) return [];
  return fs.readFileSync(log, 'utf8')
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

function listFiles(root) {
  const found = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      found.push(path.relative(root, absolute));
      if (entry.isDirectory() && !entry.isSymbolicLink()) walk(absolute);
    }
  };
  walk(root);
  return found.sort();
}

function plan(repo, options = {}) {
  return integrate.planIntegration({
    context: makeContext(repo.repoRoot, repo.skillsDir, options.env, options.paths),
    skillRoot: repo.skillRoot,
    ...options,
  });
}

function apply(repo, options = {}) {
  return integrate.applyIntegration({
    context: makeContext(repo.repoRoot, repo.skillsDir, options.env, options.paths),
    skillRoot: repo.skillRoot,
    apply: true,
    ...options,
  });
}

function outcomeOf(result, id) {
  return result.results.find((row) => row.id === id);
}

function bodyLines(lines) {
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLAN
// ─────────────────────────────────────────────────────────────────────────────

test('plan names all six rows and writes nothing', (t) => {
  const repo = makeRepo(t);
  const before = listFiles(repo.repoRoot);

  const planned = plan(repo);

  assert.equal(planned.lines[0], `Integration plan: ${SKILL}`);
  for (const id of ['I1', 'I2', 'I3', 'I4', 'I5', 'I6']) {
    assert.ok(
      planned.lines.some((line) => line.startsWith(`${id} `)),
      `plan omits row ${id}`,
    );
  }
  assert.deepEqual(listFiles(repo.repoRoot), before, 'planning wrote into the repository');
  assert.equal(planned.version, '1.0.0.0');
  assert.deepEqual(planned.rows.map((row) => row.id), ['I1', 'I2', 'I3', 'I4', 'I5', 'I6']);
  // The plan declares every write before it happens, so the yes covers files and not
  // a summary of them.
  const declared = planned.writes.map((write) => write.file);
  assert.ok(declared.some((file) => file.endsWith('skill-graph.json')), 'the plan hides the compiled graph write');
  assert.ok(declared.some((file) => file.endsWith('v1.0.0.0.md')), 'the plan hides the changelog entry');
  assert.ok(
    declared.some((file) => file === path.join(repo.repoRoot, '.skilled', 'changelog', SKILL)),
    'the plan hides the changelog link',
  );
});

test('applyIntegration without apply is a printed plan and no writes', (t) => {
  const repo = makeRepo(t);
  const before = listFiles(repo.repoRoot);

  const result = integrate.applyIntegration({
    context: makeContext(repo.repoRoot, repo.skillsDir),
    skillRoot: repo.skillRoot,
    apply: false,
  });

  assert.equal(result.applied, false);
  // A plan is not a success: the work it describes has not run yet, and a caller
  // reading ok beside applied: false would report an unwired skill as integrated.
  assert.equal(result.ok, false, 'an unapplied plan reported ok');
  assert.deepEqual(result.results, []);
  assert.deepEqual(listFiles(repo.repoRoot), before, 'an unapplied plan wrote into the repository');
  assert.equal(callLog(repo.repoRoot).length, 0, 'an unapplied plan spawned a child process');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. I1 ADVISOR DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

test('the rows refuse an operator-local skill before any row runs', (t) => {
  const repo = makeRepo(t);
  // Assembled at run time so this file names no private skill.
  const reserved = ['local', 'demo'].join('-');

  assert.throws(
    () => integrate.planIntegration({
      context: makeContext(repo.repoRoot, repo.skillsDir),
      skillRoot: repo.skillRoot,
      name: reserved,
    }),
    (error) => error.code === 'RESERVED_PREFIX',
  );
  assert.equal(callLog(repo.repoRoot).length, 0, 'a refused skill still spawned a child process');
});

test('I1 scans with --trusted and prints the rebuild fallback instead of running it', (t) => {
  const repo = makeRepo(t);

  const result = apply(repo);

  assert.equal(outcomeOf(result, 'I1').status, 'DONE');
  const scans = callLog(repo.repoRoot)
    .filter((call) => call.tool === 'advisor' && call.argv[0] === 'skill_graph_scan');
  assert.equal(scans.length, 1, 'the advisor was not scanned exactly once');
  assert.deepEqual(scans[0].argv, ['skill_graph_scan', '--trusted']);
  const calls = bodyLines(callLog(repo.repoRoot).map((call) => call.argv.join(' ')));
  assert.ok(!calls.includes('advisor_rebuild'), 'a manual rebuild was run without being asked');
  assert.match(bodyLines(result.lines), /\/doctor:skill-advisor rebuild/);
});

test('I1 reports UNKNOWN, never a pass, when the advisor backend is down', (t) => {
  const repo = makeRepo(t);

  const result = apply(repo, { env: { INTEGRATE_TEST_SCAN_EXIT: '75' } });

  const row = outcomeOf(result, 'I1');
  assert.equal(row.status, 'UNKNOWN');
  assert.match(bodyLines(row.lines), /UNKNOWN/);
  assert.match(bodyLines(row.lines), /\/doctor:skill-advisor rebuild/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. I2 COMPILED SKILL GRAPH
// ─────────────────────────────────────────────────────────────────────────────

test('I2 refreshes the tracked compiled graph and the freshness panel exits 0', (t) => {
  const repo = makeRepo(t);
  const planned = plan(repo);
  assert.match(bodyLines(planned.lines), /skill-graph\.json/);
  assert.match(bodyLines(planned.lines), /--export-json/);

  const result = apply(repo);

  assert.equal(outcomeOf(result, 'I2').status, 'DONE');
  const compiled = path.join(
    repo.repoRoot, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts', 'skill-graph.json',
  );
  assert.equal(outcomeOf(result, 'I2').writes[0].file, compiled);
  assert.ok(fs.existsSync(compiled), 'the compiled graph was not written');

  const freshness = spawnSync(process.execPath, [FRESHNESS, '--strict'], {
    cwd: repo.repoRoot,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    env: {
      ...process.env,
      SKILL_GRAPH_FRESHNESS_ROOT: repo.repoRoot,
      SYSTEM_SKILL_ADVISOR_DB_DIR: path.join(repo.repoRoot, 'no-database'),
    },
  });
  assert.equal(freshness.status, 0, `freshness --strict failed:\n${freshness.stdout}${freshness.stderr}`);
  assert.match(freshness.stdout, /STALE COMPILED: none/);
});

test('I2 reports n/a when the compiler is absent', (t) => {
  const repo = makeRepo(t);
  fs.unlinkSync(path.join(
    repo.repoRoot, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts', 'skill_graph_compiler.py',
  ));

  const result = apply(repo);

  assert.equal(outcomeOf(result, 'I2').status, 'N/A');
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. I3 REACH AND BUDGET
// ─────────────────────────────────────────────────────────────────────────────

function scenarioFor(phrases, skill = SKILL, confidence = 0.95) {
  const scenario = {};
  for (const phrase of phrases) scenario[phrase] = [{ skillId: skill, confidence }];
  return scenario;
}

test('I3 probes exactly three approved phrases and reports the rank', (t) => {
  const repo = makeRepo(t);

  const result = apply(repo, {
    env: { INTEGRATE_TEST_SCENARIO: JSON.stringify(scenarioFor(PHRASES)) },
  });

  const row = outcomeOf(result, 'I3');
  assert.equal(row.status, 'DONE');
  const probes = callLog(repo.repoRoot)
    .filter((call) => call.tool === 'advisor' && call.argv[0] === 'advisor_recommend');
  assert.equal(probes.length, 3, 'the row did not probe exactly three phrases');
  for (const probe of probes) assert.ok(probe.argv.includes('--warm-only'));
  for (const phrase of PHRASES) {
    assert.match(bodyLines(row.lines), new RegExp(`"${phrase}" -> ${SKILL} ranks 1 of 1`));
  }
  assert.match(bodyLines(row.lines), new RegExp(`description budget ${DESCRIPTION.length}/130 characters`));
});

test('I3 reports UNKNOWN when a probe cannot reach the advisor', (t) => {
  const repo = makeRepo(t);

  const result = apply(repo, { env: { INTEGRATE_TEST_ADVISOR_EXIT: '75' } });

  const row = outcomeOf(result, 'I3');
  assert.equal(row.status, 'UNKNOWN');
  assert.match(bodyLines(row.lines), /UNKNOWN/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. I4 REGRESSION CORPUS
// ─────────────────────────────────────────────────────────────────────────────

function writeCorpus(repoRoot) {
  const corpus = path.join(
    repoRoot, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'scripts', 'fixtures',
    'skill-advisor-regression-cases.jsonl',
  );
  writeFile(corpus, '{"id":"P0-KEEP-001","priority":"P0","prompt":"keep this row","confidence_only":false,'
    + '"expect_result":true,"expected_top_any":["kept-skill"],"expect_kind":"skill","allow_command_bridge":false}\n');
  return corpus;
}

test('I4 keeps an adopter skill out of the framework corpus', (t) => {
  const repo = makeRepo(t, { skillOutside: true });
  const corpus = writeCorpus(repo.repoRoot);
  const corpusBytes = fs.readFileSync(corpus);

  const planned = plan(repo);
  assert.ok(
    planned.lines.some((line) => line.startsWith('I4 proposed row: ')),
    'the plan omits the proposed case rows',
  );

  const result = apply(repo);

  assert.deepEqual(fs.readFileSync(corpus), corpusBytes, 'the framework corpus was written');
  const local = path.join(repo.skillRoot, 'benchmark', 'advisor-cases.jsonl');
  assert.ok(fs.existsSync(local), 'the skill-local case file was not written');
  const rows = fs.readFileSync(local, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((row) => row.prompt), PHRASES);
  assert.deepEqual(rows.map((row) => row.priority), ['P0', 'P1', 'P1']);
  assert.deepEqual(rows[0].expected_top_any, [SKILL]);
  assert.match(bodyLines(outcomeOf(result, 'I4').lines), /--dataset .*benchmark\/advisor-cases\.jsonl/);
  // The file did not exist before the row ran, so the undo removes it rather than
  // asking version control to restore a path it never tracked.
  const write = outcomeOf(result, 'I4').writes[0];
  assert.equal(write.kind, 'create');
  assert.equal(write.backup, undefined);
});

test('I4 appends a framework skill to the tracked corpus and appends once', (t) => {
  const repo = makeRepo(t);
  const corpus = writeCorpus(repo.repoRoot);
  const corpusBytes = fs.readFileSync(corpus);
  const backupDirectory = path.join(repo.repoRoot, 'backups');

  const first = apply(repo, { backupDirectory });
  assert.equal(outcomeOf(first, 'I4').status, 'DONE');
  const afterFirst = fs.readFileSync(corpus, 'utf8').split('\n').filter(Boolean);
  assert.equal(afterFirst.length, 4);
  assert.ok(!fs.existsSync(path.join(repo.skillRoot, 'benchmark', 'advisor-cases.jsonl')));
  // The corpus existed before the row ran, so the run keeps the operator's bytes
  // in a backup instead of trusting version control to hold them.
  const write = outcomeOf(first, 'I4').writes[0];
  assert.equal(write.kind, 'overwrite');
  assert.ok(write.backup, 'the overwritten corpus was not backed up');
  assert.deepEqual(fs.readFileSync(write.backup), corpusBytes);

  const second = apply(repo, { backupDirectory });
  const afterSecond = fs.readFileSync(corpus, 'utf8').split('\n').filter(Boolean);
  assert.equal(afterSecond.length, 4, 'a second run appended the same rows again');
  assert.match(bodyLines(outcomeOf(second, 'I4').lines), /already a case/);
  assert.deepEqual(outcomeOf(second, 'I4').writes, [], 'a row that wrote nothing reported a write');
});

test('the package check accepts the skill-local case file', (t) => {
  const repo = makeRepo(t, { skillOutside: true });
  apply(repo);

  const local = path.join(repo.skillRoot, 'benchmark', 'advisor-cases.jsonl');
  assert.ok(fs.existsSync(local));
  const checked = spawnSync(PYTHON, [PACKAGE_SKILL, repo.skillRoot, '--check', '--strict'], {
    cwd: repo.repoRoot,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  assert.equal(checked.status, 0, `strict package check failed:\n${checked.stdout}${checked.stderr}`);
  assert.match(checked.stdout, /Result: PASS/);
});

test('the printed dataset command runs the skill-local cases', (t) => {
  // The rows a conversion proposes name the skill's own phrases, so a dataset only
  // passes where those phrases really route. The fixture borrows a shipped skill's
  // phrases to prove the command runs the file end to end.
  const routed = ['create a pull request on github', 'resolve merge conflict and rebase branch'];
  const repo = makeRepo(t, {
    skillOutside: true,
    skill: { name: 'sk-git', phrases: routed },
  });
  const result = apply(repo, { paths: { regressionRunner: REGRESSION_RUNNER } });

  const line = outcomeOf(result, 'I4').lines.find((entry) => entry.includes('run them with '));
  assert.ok(line, 'the row printed no dataset command');
  const command = line.slice(line.indexOf('run them with ') + 'run them with '.length);
  const [python, script, datasetFlag, dataset, minFlag, minCases] = command.split(' ');
  assert.equal(minFlag, '--min-total-cases');
  assert.equal(minCases, String(routed.length));

  const ran = spawnSync(python, [script, datasetFlag, dataset, minFlag, minCases], {
    cwd: repo.repoRoot,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  assert.equal(ran.status, 0, `the dataset command failed:\n${ran.stdout}${ran.stderr}`);
  assert.match(ran.stdout, /"overall_pass": true/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. I5 RUNTIME MIRRORS
// ─────────────────────────────────────────────────────────────────────────────

test('I5 reports n/a and creates nothing when .hermes is absent', (t) => {
  const repo = makeRepo(t);

  const result = apply(repo);

  assert.equal(outcomeOf(result, 'I5').status, 'N/A');
  assert.ok(!fs.existsSync(path.join(repo.repoRoot, '.hermes')), '.hermes was created');
  assert.ok(!callLog(repo.repoRoot).some((call) => call.tool === 'hermes'), 'the sync ran with no mirror to sync');
  assert.match(bodyLines(plan(repo).lines), /I5 runtime mirrors: n\/a/);
});

test('I5 records the override folder the copies land in', (t) => {
  const repo = makeRepo(t);
  const output = path.join(repo.repoRoot, 'hermes-output');

  const result = apply(repo, { env: { HERMES_SKILLS_OUTPUT_DIR: output } });

  assert.equal(outcomeOf(result, 'I5').status, 'DONE');
  const hermes = callLog(repo.repoRoot).filter((call) => call.tool === 'hermes');
  assert.deepEqual(hermes.map((call) => call.argv), [[], ['--check']]);
  assert.ok(!fs.existsSync(path.join(repo.repoRoot, '.hermes')), '.hermes was created');
  const write = outcomeOf(result, 'I5').writes[0];
  assert.equal(write.file, output, 'the row records a folder other than the one the sync writes');
  assert.equal(write.kind, 'create');
  assert.equal(write.directory, true);
  assert.equal(write.backup, undefined);
});

test('I5 backs up an existing mirror before the sync replaces it', (t) => {
  const repo = makeRepo(t);
  const output = path.join(repo.repoRoot, 'hermes-output');
  writeFile(path.join(output, 'kept.txt'), 'operator copy\n');
  const backupDirectory = path.join(repo.repoRoot, 'backups');

  const result = apply(repo, { env: { HERMES_SKILLS_OUTPUT_DIR: output }, backupDirectory });

  assert.equal(outcomeOf(result, 'I5').status, 'DONE');
  const write = outcomeOf(result, 'I5').writes[0];
  assert.equal(write.kind, 'overwrite');
  assert.ok(write.backup, 'the existing mirror was not backed up');
  assert.equal(fs.readFileSync(path.join(write.backup, 'kept.txt'), 'utf8'), 'operator copy\n');
  assert.equal(fs.readFileSync(path.join(output, 'kept.txt'), 'utf8'), 'operator copy\n');
});

test('I5 records no write when the sync reports success but writes nothing', (t) => {
  const repo = makeRepo(t);
  const output = path.join(repo.repoRoot, 'hermes-output');

  const result = apply(repo, {
    env: { HERMES_SKILLS_OUTPUT_DIR: output, INTEGRATE_TEST_HERMES_WRITE: '0' },
  });

  assert.equal(outcomeOf(result, 'I5').status, 'DONE');
  assert.ok(!fs.existsSync(output));
  assert.deepEqual(outcomeOf(result, 'I5').writes, [], 'a folder the run never wrote was recorded');
});

test('I5 records the Hermes skills folder and not the runtime folder above it', (t) => {
  const repo = makeRepo(t);
  fs.mkdirSync(path.join(repo.repoRoot, '.hermes'), { recursive: true });
  const mirror = path.join(repo.repoRoot, '.hermes', 'skills');

  const result = apply(repo);

  assert.equal(outcomeOf(result, 'I5').status, 'DONE');
  // The sync regenerates <repo>/.hermes/skills, so an undo built from the ledger has
  // to name that folder: the runtime folder holds more than the row ever wrote.
  assert.deepEqual(
    outcomeOf(result, 'I5').writes.map((write) => write.file),
    [mirror],
    'the row records a folder the sync never writes',
  );
  assert.deepEqual(
    plan(repo).writes.filter((write) => write.file.includes('.hermes')).map((write) => write.file),
    [mirror],
    'the plan declares a folder the sync never writes',
  );
});

test('I5 fails when the Hermes check reports drift', (t) => {
  const repo = makeRepo(t);

  const result = apply(repo, {
    env: { HERMES_SKILLS_OUTPUT_DIR: path.join(repo.repoRoot, 'hermes-output'), INTEGRATE_TEST_HERMES_CHECK_EXIT: '1' },
  });

  const row = outcomeOf(result, 'I5');
  assert.equal(row.status, 'FAILED');
  assert.match(bodyLines(row.lines), /DRIFT/);
  assert.equal(result.ok, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. I6 CHANGELOG
// ─────────────────────────────────────────────────────────────────────────────

test('I6 creates the versioned entry and the relative index link', (t) => {
  const repo = makeRepo(t);

  const result = apply(repo);

  const entry = path.join(repo.skillRoot, 'changelog', 'v1.0.0.0.md');
  const link = path.join(repo.repoRoot, '.skilled', 'changelog', SKILL);
  assert.equal(outcomeOf(result, 'I6').status, 'DONE');
  assert.ok(fs.existsSync(entry), 'the changelog entry was not created');
  assert.match(fs.readFileSync(entry, 'utf8'), /^---\n[\s\S]*\nversion: 1\.0\.0\.0\n/);
  assert.equal(fs.readlinkSync(link), `../skills/${SKILL}/changelog`);
  assert.ok(fs.statSync(link).isDirectory(), 'the index link does not resolve');

  const checked = spawnSync(PYTHON, [PACKAGE_SKILL, repo.skillRoot, '--check', '--strict'], {
    cwd: repo.repoRoot,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  assert.equal(checked.status, 0, `strict package check failed after the changelog write:\n${checked.stdout}`);
});

test('I6 keeps an existing entry and never replaces an existing link', (t) => {
  const repo = makeRepo(t);
  const entry = path.join(repo.skillRoot, 'changelog', 'v1.0.0.0.md');
  writeFile(entry, 'kept entry\n');
  const elsewhere = path.join(repo.repoRoot, 'elsewhere');
  fs.mkdirSync(elsewhere, { recursive: true });
  const link = path.join(repo.repoRoot, '.skilled', 'changelog', SKILL);
  fs.mkdirSync(path.dirname(link), { recursive: true });
  fs.symlinkSync('../../elsewhere', link);

  const planned = plan(repo);
  const result = apply(repo);

  assert.equal(fs.readFileSync(entry, 'utf8'), 'kept entry\n');
  assert.equal(fs.readlinkSync(link), '../../elsewhere');
  assert.match(bodyLines(planned.lines), /I6 changelog: keep the existing/);
  assert.match(bodyLines(result.lines), /left as it is/);
});

test('I6 reports the index link n/a when the skill is outside the skills root', (t) => {
  const repo = makeRepo(t, { skillOutside: true });
  const link = path.join(repo.repoRoot, '.skilled', 'changelog', SKILL);

  const planned = plan(repo);
  const result = apply(repo);

  const entry = path.join(repo.skillRoot, 'changelog', 'v1.0.0.0.md');
  assert.equal(outcomeOf(result, 'I6').status, 'DONE');
  assert.ok(fs.existsSync(entry), 'the changelog entry was not created');
  // The index resolves ../skills/<name>/changelog, which an outside root never is, so
  // a link here would point at nothing the operator can read.
  assert.ok(!fs.existsSync(link), 'a link was made for a root outside the skills folder');
  assert.equal(
    planned.writes.some((write) => write.file === link),
    false,
    'the plan declares a link it cannot make',
  );
  assert.match(bodyLines(planned.lines), /I6 changelog: n\/a - .*not a direct child of \.skilled\/skills/);
  assert.match(bodyLines(result.lines), /I6 changelog: n\/a - /);
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. THE REACH SCRIPT'S OPT-IN --skill
// ─────────────────────────────────────────────────────────────────────────────

function makeReachHarness(t, options = {}) {
  const root = makeTempRepo(t);
  const advisor = path.join(root, 'advisor.cjs');
  const scenario = path.join(root, 'scenario.json');
  fs.writeFileSync(advisor, REACH_ADVISOR_STUB);
  fs.writeFileSync(scenario, JSON.stringify(options.scenario || []));
  const skillRoot = path.join(root, 'skills', SKILL);
  writeSkillPackage(skillRoot);
  return { root, advisor, scenario, skillRoot };
}

function runReach(harness, args, cwd) {
  return spawnSync(process.execPath, [REACH, ...args], {
    cwd: cwd || REPO_ROOT,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    env: {
      ...process.env,
      ROUTER_REACH_ADVISOR: harness.advisor,
      REACH_TEST_SCENARIO: harness.scenario,
      CI: '',
    },
  });
}

test('the reach script reports one row for a named standalone root', (t) => {
  const harness = makeReachHarness(t, { scenario: [{ skillId: SKILL, confidence: 0.95 }] });

  const result = runReach(harness, ['--skill', harness.skillRoot, '--limit', '1']);

  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const rows = result.stdout.split('\n').filter((line) => /^(?:OK  |FAIL) /.test(line));
  assert.equal(rows.length, 1, `expected one report row:\n${result.stdout}`);
  assert.match(rows[0], new RegExp(`^OK\\s+${SKILL} `));
  assert.match(result.stdout, /RESULT: PASSED/);
});

test('the reach script refuses --hub together with --skill', (t) => {
  const harness = makeReachHarness(t);

  const result = runReach(harness, ['--hub', 'mcp-tooling', '--skill', harness.skillRoot]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /--hub and --skill/);
});

function makeFleetHarness(t) {
  const root = makeTempRepo(t);
  const advisor = path.join(root, 'advisor.cjs');
  const scenario = path.join(root, 'scenario.json');
  fs.writeFileSync(advisor, REACH_ADVISOR_STUB);
  fs.writeFileSync(scenario, JSON.stringify(FLEET_SCENARIO));
  // The script reads its repository five levels above its own folder, so the copy
  // keeps that depth and the fleet is built beside it.
  const scripts = path.join(root, 'a', 'b', 'c', 'd', 'scripts');
  fs.mkdirSync(scripts, { recursive: true });
  const script = path.join(scripts, 'reach.cjs');
  fs.copyFileSync(REACH, script);
  const hub = path.join(root, '.skilled', 'skills', 'mcp-tooling');
  writeFile(path.join(hub, 'ROUTER.md'), FLEET_ROUTER);
  writeFile(path.join(hub, 'mode-registry.json'), '{}\n');
  return { root, advisor, scenario, script };
}

test('the fleet report matches the golden recorded before the flag existed', (t) => {
  const harness = makeFleetHarness(t);

  const result = spawnSync(process.execPath, [harness.script, '--hub', 'mcp-tooling', '--json'], {
    cwd: harness.root,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    env: {
      ...process.env,
      ROUTER_REACH_ADVISOR: harness.advisor,
      REACH_TEST_SCENARIO: harness.scenario,
      CI: '',
    },
  });

  // The wrong-hub row is what fails the run, so the golden pins the verdict as well
  // as the bytes, and the phrase that lands contributes no row at all.
  assert.equal(result.status, 1, `${result.stdout}${result.stderr}`);
  assert.equal(result.stdout, fs.readFileSync(FLEET_REPORT, 'utf8'), 'the fleet report changed');
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. THE ENHANCE PROPOSAL A ZERO-EDGE ROOT NEEDS
// ─────────────────────────────────────────────────────────────────────────────

// A converted root's edges map starts empty and the compiler refuses a skill with
// no edges, so the conversion proposes one target: the skill the advisor ranks
// highest for the phrases it approved, never the skill itself and never a private one.
test('the enhance proposal ranks the advisor answer without the skill itself or a private one', (t) => {
  const repo = makeRepo(t);
  // Assembled at run time so this file names no private skill.
  const reserved = ['local', 'peer'].join('-');
  const context = makeContext(repo.repoRoot, repo.skillsDir, {
    INTEGRATE_TEST_SCENARIO: JSON.stringify({
      [PHRASES[0]]: [
        { skillId: SKILL, confidence: 0.95 },
        { skillId: 'peer-one', confidence: 0.9 },
        { skillId: reserved, confidence: 0.9 },
        { skillId: 'peer-two', confidence: 0.85 },
      ],
    }),
  });

  const proposed = integrate.proposeEnhanceTargets({
    context,
    phrases: [...PHRASES, 'demo phrase four', 'demo phrase five'],
    excludeName: SKILL,
  });

  assert.equal(proposed.unavailable, false);
  assert.deepEqual(proposed.candidates, ['peer-one', 'peer-two']);
  const probes = callLog(repo.repoRoot).filter((call) => call.argv[0] === 'advisor_recommend');
  assert.equal(probes.length, 3, 'the proposal probed more phrases than the reach row does');
});

test('the enhance proposal says nobody ranked, rather than calling the advisor unavailable', (t) => {
  const repo = makeRepo(t);
  const context = makeContext(repo.repoRoot, repo.skillsDir);

  const proposed = integrate.proposeEnhanceTargets({ context, phrases: PHRASES, excludeName: SKILL });

  assert.equal(proposed.unavailable, false);
  assert.deepEqual(proposed.candidates, []);
  assert.match(proposed.detail, /ranked no skill/);
});

test('the enhance proposal reports the backend unavailable rather than ranking nobody', (t) => {
  const repo = makeRepo(t);
  const context = makeContext(repo.repoRoot, repo.skillsDir, { INTEGRATE_TEST_ADVISOR_EXIT: '75' });

  const proposed = integrate.proposeEnhanceTargets({ context, phrases: PHRASES, excludeName: SKILL });

  assert.equal(proposed.unavailable, true);
  assert.deepEqual(proposed.candidates, []);
  assert.match(proposed.detail, /unavailable/);
});
