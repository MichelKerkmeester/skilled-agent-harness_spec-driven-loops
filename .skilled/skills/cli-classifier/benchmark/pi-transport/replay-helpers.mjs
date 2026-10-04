// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Transport Replay Helpers
// ───────────────────────────────────────────────────────────────────
// The CLI-shaped readers and call helpers the Pi transport replay shares: the
// option rotations and argument text, the probability and top-key readers, the
// recorded call writer, the jev gate, the bounded child spawner and the census
// the replay plan is rebuilt from. The benchmark owns them, so its replay
// reaches into no other skill's eval code.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'node:child_process';
import { accessSync, appendFileSync, constants, mkdirSync, mkdtempSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const NONE_DESCRIPTION = 'None of these skills fits the request';
const JEV_VERSION = 'jev 0.6.2';

// The advisor's routing corpora and compiled scorer live under its own runtime;
// the census loader reads both from there.
const CORPORA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../../system-skill-advisor/runtime/scripts/routing-accuracy');
const DIST = resolve(CORPORA_DIR, '../../dist/runtime');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const CORPORA = { labeled: ['labeled-prompts.jsonl', 195], holdout: ['holdout-prompts.jsonl', 70], ambiguity: ['ambiguity-prompts.jsonl', 24] };

// ───────────────────────────────────────────────────────────────────
// 3. OPTION, ROTATION AND PROBABILITY READERS
// ───────────────────────────────────────────────────────────────────

/**
 * Nearest-rank quantile of a numeric sample; null when the sample is empty.
 * @param {number[]} values
 * @param {number} q
 * @returns {number|null}
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = values.slice().sort((left, right) => left - right);
  return sorted[Math.ceil(q * sorted.length) - 1];
}

/**
 * The three left rotations of the keys.
 * @param {string[]} keys
 * @returns {string[][]}
 */
export function rotations(keys) {
  return [0, 1, 2].map((r) => [...keys.slice(r), ...keys.slice(0, r)]);
}

/**
 * Flat option args that label each key, disambiguating equal descriptions.
 * @param {string[]} keys
 * @param {(key: string) => string} describe
 * @param {string[]} cluster
 * @returns {string[]}
 */
export function optionArgs(keys, describe, cluster) {
  return keys.flatMap((key) => {
    if (key === 'none') return ['-o', `none=${NONE_DESCRIPTION}`];
    const text = describe(key);
    const clash = cluster.some((other) => other !== key && describe(other) === text);
    return ['-o', `${key}=${text}${clash ? ` [${key}]` : ''}`];
  });
}

/**
 * Probability map from a classifier answer on stdout, with the raw and full-coverage views.
 * @param {string} stdout
 * @param {string[]} keys
 * @returns {{ raw: Record<string, number>|null, full: Record<string, number>|null }}
 */
export function readProbabilities(stdout, keys) {
  let raw = null;
  try {
    const probabilities = JSON.parse(stdout).answers.answer.probabilities;
    if (probabilities !== null && typeof probabilities === 'object' && !Array.isArray(probabilities)) {
      raw = probabilities;
    }
  } catch {
    return { raw: null, full: null };
  }
  if (raw === null) return { raw: null, full: null };
  for (const key of keys) {
    const value = raw[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return { raw, full: null };
  }
  const full = {};
  for (const key of keys) full[key] = raw[key];
  return { raw, full };
}

/**
 * First key in keys order that holds the highest value.
 * @param {Record<string, number>} map
 * @param {string[]} keys
 * @returns {string}
 */
export function topKey(map, keys) {
  let best = keys[0];
  for (const key of keys) {
    if (map[key] > map[best]) best = key;
  }
  return best;
}

// ───────────────────────────────────────────────────────────────────
// 4. CALL AND GATE HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired.
 * The timer kills the child and resolves at once, without waiting for close:
 * a grandchild can hold the pipes open past the kill. Stdin is closed after
 * the write because the jev CLI reads stdin to EOF and exits 2 on an
 * inherited terminal. A spawn error is code 127 with the message as stderr.
 * @param {string} file
 * @param {string[]} args
 * @param {string} stdinText
 * @param {Record<string, string | undefined>} env
 * @param {number} timeoutMs
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>}
 */
export function spawnCall(file, args, stdinText, env, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A child that exits before reading stdin cannot fail the call through
    // the pipe: its exit code is the outcome the caller needs.
    child.stdin.on('error', () => {});
    child.stdin.end(stdinText);

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      settle(null, true);
    }, timeoutMs);

    function settle(code, timedOut) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
    }

    child.on('close', (code) => settle(code === null ? -1 : code, false));
    child.on('error', (error) => {
      stderr = error.message;
      settle(127, false);
    });
  });
}

/**
 * Append one call record as a JSON line to calls.jsonl under outDir.
 * A missing or empty outDir means the run keeps no records, so nothing is
 * created. One line per call keeps a killed arm's earlier records readable.
 * @param {string|undefined} outDir
 * @param {object} record
 * @returns {void}
 */
export function writeCall(outDir, record) {
  if (typeof outDir === 'string' && outDir !== '') {
    mkdirSync(outDir, { recursive: true });
    appendFileSync(join(outDir, 'calls.jsonl'), `${JSON.stringify(record)}\n`);
  }
}

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 * @param {string} name
 * @param {{ PATH?: string }} env
 * @returns {string|null}
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(delimiter)) {
    if (dir.length === 0) continue;
    const candidate = join(dir, name);
    try {
      if (statSync(candidate).isFile()) {
        accessSync(candidate, constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Identity line, then the pinned version and a credential check.
 * A miss prints a skip line and leaves the census text already written.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, timeoutMs: number }} ctx
 * @returns {{ passed: boolean, path: string | null, provider: string }}
 */
export function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const path = which('jev', ctx.env);
  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
  if (path === null) {
    ctx.out('jev arm skipped: jev not on PATH');
    return { passed: false, path, provider };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs,
  };
  const version = spawnSync(path, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    ctx.out('jev arm skipped: version');
    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
    return { passed: false, path, provider };
  }

  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    ctx.out('jev arm skipped: no credential');
    return { passed: false, path, provider };
  }
  return { passed: true, path, provider };
}

// ───────────────────────────────────────────────────────────────────
// 5. CENSUS LOADER
// ───────────────────────────────────────────────────────────────────

/**
 * Scores the corpora once under the baseline capture's env.
 * @returns {Promise<{ holdoutTop1: { correct: number, total: number }, rows: object[], labels: Array<{ id: string, prompt: string, yes: boolean }>, isMatch: (actual: string|null, goldRaw: string) => boolean, describe: (skill: string) => string }>}
 */
export async function loadCensus() {
  process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-jev-tiebreak-'));
  process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
  process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
  process.env.PYTHONDONTWRITEBYTECODE = '1';
  // Match the test-harness regime: the semantic-shadow lane substitutes
  // deterministic fixture vectors under the harness flag (real embeddings are not
  // reproducible in CI), so every scorer gate runs this way. The baseline must be
  // captured under the same regime the ratchet re-scores it in.
  process.env.VITEST = 'true';
  delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
  delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

  const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
  const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));
  const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));
  const { loadAdvisorProjection } = await import(join(DIST, 'lib/scorer/projection.js'));

  const workspaceRoot = findAdvisorWorkspaceRoot(CORPORA_DIR, { maxDepth: 14, sentinel: SENTINEL });
  const projection = loadAdvisorProjection(workspaceRoot);

  const corpora = {};
  for (const [name, [file, n]] of Object.entries(CORPORA)) {
    const rows = readFileSync(join(CORPORA_DIR, file), 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
    if (rows.length !== n) {
      throw new Error(`${file}: expected ${n} rows, got ${rows.length}`);
    }
    corpora[name] = rows;
  }

  function isMatch(actual, goldRaw) {
    const gold = goldRaw === 'none' ? null : goldRaw;
    const expected = gold === null ? null : mergedSkillForAlias(gold);
    const canonical = actual === null ? null : mergedSkillForAlias(actual);
    return canonical === expected
      || (canonical !== null && expected !== null && skillMatchesAlias(canonical, expected));
  }

  function scorePrompt(prompt) {
    return scoreAdvisorPrompt(prompt, { workspaceRoot, projection });
  }

  let correct = 0;
  for (const row of corpora.holdout) {
    if (isMatch(scorePrompt(row.prompt).topSkill, row.skill_top_1)) correct += 1;
  }
  const holdoutTop1 = { correct, total: corpora.holdout.length };

  const tauIds = new Set(corpora.ambiguity.map((row) => String(row.id)));

  const rows = [];
  for (const file of ['labeled', 'holdout']) {
    const kept = corpora[file]
      .filter((row) => row.prompt && String(row.skill_top_1 ?? 'none') !== 'none')
      .sort((left, right) => String(left.id).localeCompare(String(right.id)));
    for (let index = 0; index < kept.length; index += 1) {
      const row = kept[index];
      const split = index % 2 === 0 ? 'train' : 'test';
      const result = scorePrompt(row.prompt);
      const order = result.recommendations.map((r) => r.skill);
      const top = result.recommendations[0];
      const members = new Set(top ? [top.skill, ...(top.ambiguousWith ?? [])] : []);
      rows.push({
        id: String(row.id),
        file,
        split,
        prompt: row.prompt,
        gold: row.skill_top_1,
        goldKey: mergedSkillForAlias(row.skill_top_1),
        order,
        cluster: order.filter((s) => members.has(s)),
        confidence: Object.fromEntries(result.recommendations.map((r) => [r.skill, r.confidence])),
        score: Object.fromEntries(result.recommendations.map((r) => [r.skill, r.score])),
        tau03: tauIds.has(String(row.id)),
      });
    }
  }

  const labels = corpora.labeled.map((row) => ({
    id: String(row.id),
    prompt: row.prompt,
    yes: row.gate3_triggers === 'yes',
  }));

  function describe(skill) {
    const entry = projection.skills.find((item) => item.id === skill);
    return entry ? entry.description : '';
  }

  return { holdoutTop1, rows, labels, isMatch, describe };
}
