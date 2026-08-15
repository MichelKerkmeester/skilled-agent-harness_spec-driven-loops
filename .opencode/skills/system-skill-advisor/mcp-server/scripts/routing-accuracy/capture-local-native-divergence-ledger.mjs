// ───────────────────────────────────────────────────────────────
// MODULE: Local-vs-native divergence ledger capture
// ───────────────────────────────────────────────────────────────
//
// Recomputes the strict Python/native top-1 divergence set used by
// local-native-divergence-ratchet.vitest.ts. Existing approvals are retained
// only when their prompt hash and both current tops still match. The output is
// therefore a capture of live source behavior, not a hand-edited fixture.
//
// Usage:
//   node capture-local-native-divergence-ledger.mjs
//   node capture-local-native-divergence-ledger.mjs --write
//   node capture-local-native-divergence-ledger.mjs --write --summary

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = resolve(HERE, '../../tests/parity/fixtures/local-native-approved-divergences.json');
const LABELED_CORPUS_PATH = resolve(HERE, 'labeled-prompts.jsonl');
const HARDER_CORPUS_PATH = resolve(HERE, '../../tests/scorer/fixtures/harder-intent-prompt-corpus.ts');
const DIST = resolve(HERE, '../../dist/mcp-server');

function findWorkspaceRoot(start) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, '.opencode/skills/system-spec-kit/SKILL.md'))) return current;
    current = dirname(current);
  }
  throw new Error('Unable to locate the workspace root.');
}

const WORKSPACE_ROOT = findWorkspaceRoot(HERE);

delete process.env.MK_SKILL_ADVISOR_DB_DIR;
delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.PYTHONDONTWRITEBYTECODE = '1';
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function promptHash(prompt) {
  return `sha256:${sha256(prompt)}`;
}

function readJsonl(path) {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readHarderCorpus() {
  const source = readFileSync(HARDER_CORPUS_PATH, 'utf8');
  const arrayStart = source.indexOf('[', source.indexOf('HARDER_INTENT_PROMPT_CORPUS'));
  const arrayEnd = source.lastIndexOf(']');
  if (arrayStart < 0 || arrayEnd < arrayStart) {
    throw new Error(`Unable to locate the harder corpus literal in ${HARDER_CORPUS_PATH}`);
  }
  // The fixture is a data-only array. Evaluating just that literal avoids
  // duplicating the corpus in a second source of truth.
  return Function(`return ${source.slice(arrayStart, arrayEnd + 1)}`)();
}

function runPython(prompts) {
  const script = `
import importlib.util, json, os, sys
workspace = sys.argv[1]
path = os.path.join(workspace, '.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor_capture', path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
prompts = json.loads(sys.stdin.read())
out = []
for prompt in prompts:
    recs = mod.analyze_prompt(prompt=prompt, confidence_threshold=0.8, uncertainty_threshold=0.35, confidence_only=False, show_rejections=False)
    out.append({'prompt': prompt, 'top': recs[0]['skill'] if recs else None})
print(json.dumps(out))
`;
  const result = spawnSync('python3', ['-c', script, WORKSPACE_ROOT], {
    input: JSON.stringify(prompts),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 1024 * 1024 * 16,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Python scorer failed: ${result.error?.message ?? result.stderr ?? result.stdout}`);
  }
  return JSON.parse(result.stdout);
}

function migrationReason(row, previous) {
  const values = [row.gold, row.localTop, row.nativeTop, previous?.gold, previous?.localTop, previous?.nativeTop]
    .filter(Boolean)
    .join(' ');
  if (values.includes('mcp-chrome-devtools') || values.includes('mcp-tooling')) {
    return 'current-state capture after the MCP tooling hub reconciliation; browser and connector labels use the current hub identity';
  }
  if (values.includes('deep-improvement') || values.includes('system-deep-loop') || values.includes('deep-research') || values.includes('deep-review')) {
    return 'current-state capture after the deep-loop skill consolidation; legacy mode aliases remain represented by the current hub';
  }
  return 'current-state capture after the merged skill inventory and command-bridge reconciliation';
}

const labeled = readJsonl(LABELED_CORPUS_PATH).map((row) => ({
  id: row.id,
  corpus: 'labeled',
  prompt: row.prompt,
  gold: row.skill_top_1 === 'none' ? 'none' : row.skill_top_1,
}));
const harder = readHarderCorpus().map((row) => ({
  id: `harder:${sha256(row.prompt).slice(0, 12)}`,
  corpus: 'harder',
  prompt: row.prompt,
  gold: row.expectedSkill === 'none' ? 'none' : row.expectedSkill,
}));
const corpus = [...labeled, ...harder];
const pythonRows = runPython(corpus.map((row) => row.prompt));
const pythonByPrompt = new Map(pythonRows.map((row) => [row.prompt, row.top ?? 'none']));
const divergences = corpus.flatMap((row) => {
  const localTop = pythonByPrompt.get(row.prompt) ?? 'none';
  const nativeTop = scoreAdvisorPrompt(row.prompt, { workspaceRoot: WORKSPACE_ROOT }).topSkill ?? 'none';
  if (localTop === nativeTop) return [];
  return [{
    ...row,
    promptHash: promptHash(row.prompt),
    localTop,
    nativeTop,
  }];
});

const priorLedger = JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
const priorById = new Map(priorLedger.entries.map((entry) => [entry.id, entry]));
const capturedAt = new Date().toISOString().slice(0, 10);
const capturedById = new Map(divergences.map((row) => {
  const previous = priorById.get(row.id);
  const unchanged = previous
    && previous.promptHash === row.promptHash
    && previous.localTop === row.localTop
    && previous.nativeTop === row.nativeTop;
  const entry = unchanged
    ? { ...previous, gold: row.gold }
    : {
      ...row,
      reason: migrationReason(row, previous),
      approvedAt: capturedAt,
    };
  return [row.id, entry];
}));
// Preserve the existing ledger order for stable, reviewable diffs; newly
// captured divergences follow in current corpus order.
const entries = [
  ...priorLedger.entries.flatMap((entry) => capturedById.has(entry.id) ? [capturedById.get(entry.id)] : []),
  ...divergences.filter((row) => !priorById.has(row.id)).map((row) => capturedById.get(row.id)),
];

const currentIds = new Set(entries.map((entry) => entry.id));
const priorIds = new Set(priorLedger.entries.map((entry) => entry.id));
const added = entries.filter((entry) => !priorIds.has(entry.id)).map((entry) => entry.id);
const resolved = priorLedger.entries.filter((entry) => !currentIds.has(entry.id)).map((entry) => entry.id);
const changed = entries
  .filter((entry) => {
    const previous = priorById.get(entry.id);
    return previous && (previous.promptHash !== entry.promptHash || previous.localTop !== entry.localTop || previous.nativeTop !== entry.nativeTop);
  })
  .map((entry) => entry.id);

const output = JSON.stringify({ schemaVersion: 1, entries }, null, 2) + '\n';
console.log(JSON.stringify({
  corpusSize: corpus.length,
  currentDivergences: entries.length,
  priorEntries: priorLedger.entries.length,
  added,
  resolved,
  changed,
}));
if (process.argv.includes('--write')) {
  writeFileSync(LEDGER_PATH, output, 'utf8');
  console.log(`wrote ledger -> ${LEDGER_PATH}`);
}
if (!process.argv.includes('--summary')) console.log(output);
