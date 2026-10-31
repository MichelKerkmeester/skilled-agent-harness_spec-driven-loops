#!/usr/bin/env node
// Read-only probe: render the production brief for the doctor routing slice prompts
// under the same pinned force-local regime the doctor slice uses, so the rendered
// lines can be compared against the fixture's expected top/second columns.
// Writes nothing in the repository; its only temp dir lives beside this script.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '../../../../../../..');
const RUNTIME = join(REPO_ROOT, '.skilled', 'skills', 'system-skill-advisor', 'runtime');
const DIST = join(RUNTIME, 'dist', 'runtime');
const SLICE_PATH = join(RUNTIME, 'scripts', 'routing-accuracy', 'doctor-prompts.jsonl');
const BASELINE_PATH = join(RUNTIME, 'scripts', 'routing-accuracy', 'scorer-eval-baseline.json');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';

// Freeze scoring to the reproducible filesystem projection (same regime as the slice).
const emptyDbDir = mkdtempSync(join(HERE, 'routing-probe-db-'));
process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = emptyDbDir;
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const fixedNow = new Date(`${baseline.capturedAt}T00:00:00Z`).getTime();
const RealDate = Date;
class FixedDate extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(fixedNow);
    else super(...args);
  }
  static now() { return fixedNow; }
}
globalThis.Date = FixedDate;

const fusion = await import(pathToFileURL(join(DIST, 'lib', 'scorer', 'fusion.js')).href);
const render = await import(pathToFileURL(join(DIST, 'lib', 'render.js')).href);
const workspace = await import(pathToFileURL(join(DIST, 'lib', 'utils', 'workspace-root.js')).href);
const workspaceRoot = workspace.findAdvisorWorkspaceRoot(RUNTIME, { maxDepth: 14, sentinel: SENTINEL });

const rows = readFileSync(SLICE_PATH, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));

const out = [];
for (const row of rows) {
  const result = fusion.scoreAdvisorPrompt(row.prompt, { workspaceRoot });
  const passing = result.recommendations.filter((recommendation) => recommendation.passes_threshold === true);
  const tokenCap = render.hasAdvisorAmbiguitySignal(passing) ? 120 : 80;
  const brief = render.renderAdvisorBrief({
    status: 'ok',
    freshness: 'live',
    recommendations: passing,
    metrics: { tokenCap },
  }, { tokenCap });
  out.push({
    id: row.id,
    prompt: row.prompt,
    expected_top: row.expected_top,
    expected_second: row.expected_second,
    topSkill: result.topSkill,
    ambiguous: result.ambiguous === true,
    tokenCap,
    brief,
  });
}

for (const entry of out) {
  const lines = (entry.brief ?? '<null>').split('\n').slice(0, 2).join(' || ');
  console.log(`[${entry.id}] top=${entry.topSkill} amb=${entry.ambiguous} cap=${entry.tokenCap} :: ${lines}`);
}

const mismatch = out.filter((entry) => entry.topSkill !== entry.expected_top);
console.log(`ROWS=${out.length} TOP_MISMATCH=${mismatch.length}`);
rmSync(emptyDbDir, { recursive: true, force: true });
