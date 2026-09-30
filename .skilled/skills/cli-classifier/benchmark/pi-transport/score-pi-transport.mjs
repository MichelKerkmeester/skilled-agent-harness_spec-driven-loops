#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Transport Benchmark
// ───────────────────────────────────────────────────────────────────
// Measures whether Pi's own classifier runtime matches the jev CLI on the
// advisor's recorded choice calls, and at what latency and cost. The default
// run is a zero-call census: it prints what is installed, spawns nothing and
// writes no file. The script holds and reads no credential.
//
// Usage:
//   node score-pi-transport.mjs
//   node score-pi-transport.mjs --pi --out <dir>
//   node score-pi-transport.mjs --cli --out <dir>
//
// Exit codes: 0 = census printed, or an arm printed its columns and verdict;
// 1 = the baseline file is missing, empty or unparseable; 2 = bad invocation.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

// The CLI's own option arguments, rotations, top-key tie rule and probability
// reader, imported rather than copied so both sides ask the same questions and
// read a row's maps alike.
import { nearestRank, optionArgs, readProbabilities, rotations, topKey } from '../../../system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs';

// The call log writer, the shared jev gate and the bounded child spawner come
// from the eval's own module, so a rerun shares the recorded run's call shape
// and its version and credential rules.
import { jevGate, spawnCall, writeCall } from '../../../system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const PI_PACKAGE_NAME = '@earendil-works/pi-coding-agent';

// The classifier both sides ask, on Pi's provider id. Fixed as module constants
// so the gate, the built questions and every recorded call name one model.
const PI_PROVIDER = 'openrouter';
const PI_MODEL_ID = 'typesafe/jev-1.13';

// The CLI version the shared gate pins and every rerun record names, in the
// recorded file's own text shape so a rerun sits beside it under one value.
const JEV_VERSION = '0.6.2';

// Copied verbatim from the suggested-order eval (`score-suggested-order.mjs:25-26`),
// which keeps both strings module-private. The classifier must be asked the CLI's
// own question and offered the CLI's own abstain text, or the two sides are not
// comparable.
export const CHOICE_QUESTION = 'Which skill should handle this request?';
export const NONE_DESCRIPTION = 'None of these skills fits the request';

// One bound for both sides, so a stalled backend cannot stretch the run without limit.
export const CALL_TIMEOUT_MS = 30000;

// The CLI answer is unnamed in its payload; Pi names every question, so the two
// shapes line up on one name.
export const QUESTION_NAME = 'answer';

// The keep rule's bounds, fixed before the first live call: coverage and
// agreement as percentages, Pi's p95 latency as a multiple of the CLI's. They
// live together here so the judge and the line it feeds cannot drift apart.
const MIN_COVERAGE_PCT = 90;
const MIN_AGREEMENT_PCT = 95;
const MAX_LATENCY_RATIO = 1.5;

// The recorded CLI run a replay is measured against: the answers and timings
// this comparison treats as the CLI side. Repo-relative, so a printed line or
// report names the same artifact wherever the worktree sits.
const BASELINE_PATH = 'specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl';

// The repository root, derived from this file's own location so the recorded
// baseline resolves the same no matter which directory a run starts in.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');

// ───────────────────────────────────────────────────────────────────
// 3. PROCESS DISCOVERY
// ───────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string | null} First executable match, or null when none is executable.
 */
export function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) continue;
    const candidate = path.join(dir, name);
    try {
      if (fs.statSync(candidate).isFile()) {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Directory and version of the Pi coding-agent package that `pi` resolves to,
 * or null when no `pi` on PATH belongs to that package. The executable sits
 * inside the package's own dist tree, so the climb starts at its directory and
 * keeps going until a manifest names the package.
 *
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {{ packageDir: string, version: string | null } | null} Resolved package, or null.
 */
export function resolvePiPackage(env) {
  const found = which('pi', env);
  if (found === null) return null;

  let dir;
  try {
    dir = path.dirname(fs.realpathSync(found));
  } catch {
    return null;
  }

  for (;;) {
    // A manifest that is absent or unparseable says nothing about the executable's
    // package, so the climb continues past it.
    try {
      const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      if (manifest.name === PI_PACKAGE_NAME) {
        return { packageDir: dir, version: typeof manifest.version === 'string' ? manifest.version : null };
      }
    } catch {
      // Keep climbing.
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/**
 * Identity line of the Pi census, printed before any model call or spend.
 *
 * @param {{ packageDir: string, version: string | null } | null} pi Resolved package.
 * @returns {string} One `pi:` line.
 */
export function piLine(pi) {
  if (pi === null || pi === undefined) return 'pi: path=none version=none';
  return `pi: path=${pi.packageDir ?? 'none'} version=${pi.version ?? 'none'}`;
}

// ───────────────────────────────────────────────────────────────────
// 4. BASELINE READER
// ───────────────────────────────────────────────────────────────────

// An unreadable file yields one shape for every cause, so the caller stops with
// a single line instead of letting absent rows read as zeros.
function unreadableBaseline(reason) {
  return { rows: 0, calls: 0, fullRows: 0, unreadable: true, reason, byRow: new Map() };
}

// A probability map is full only when it holds at least one key and every value
// is a finite number; anything else is a partial answer.
function isFullMap(map) {
  if (map === null || typeof map !== 'object' || Array.isArray(map)) return false;
  const keys = Object.keys(map);
  if (keys.length === 0) return false;
  return keys.every((key) => typeof map[key] === 'number' && Number.isFinite(map[key]));
}

// One canonical text for a key set, so two sets can be compared without caring
// about the order their keys were written in.
function keySetText(keys) {
  return [...keys].sort().join('\u0000');
}

// A row is replayable when all three orders arrived and their maps are full over
// one key set. A shorter or differing map means the option list drifted, and the
// row is left out of the full count rather than guessed at.
function isFullRow(records) {
  const byOrder = new Map();
  for (const record of records) byOrder.set(record.order, record);
  if (byOrder.size !== 3) return false;
  let shared = null;
  for (const order of [0, 1, 2]) {
    const record = byOrder.get(order);
    if (record === undefined || !isFullMap(record.probabilities)) return false;
    const keys = keySetText(Object.keys(record.probabilities));
    if (shared === null) shared = keys;
    else if (keys !== shared) return false;
  }
  return true;
}

/**
 * Reads the recorded CLI calls file. A missing, empty or unparseable file is
 * reported as one unreadable result so the caller can stop with a single line
 * naming the path; it never becomes a row of zeros.
 *
 * @param {string} text Contents of the recorded calls file.
 * @returns {{ rows: number, calls: number, fullRows: number, unreadable: boolean, reason: string | null, byRow: Map<string, object[]> }} Counts, plus the choice records grouped by row id for the replay plan.
 */
export function readBaseline(text) {
  if (typeof text !== 'string' || text.trim() === '') return unreadableBaseline('empty');

  const byRow = new Map();
  let calls = 0;
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      return unreadableBaseline('unparseable');
    }
    if (record === null || typeof record !== 'object' || Array.isArray(record)) return unreadableBaseline('unparseable');
    if (record.kind !== 'choice') continue;
    if (typeof record.row_id !== 'string' || record.row_id === '') return unreadableBaseline('unparseable');
    calls += 1;
    const records = byRow.get(record.row_id) ?? [];
    records.push(record);
    byRow.set(record.row_id, records);
  }

  let fullRows = 0;
  for (const records of byRow.values()) {
    if (isFullRow(records)) fullRows += 1;
  }
  return { rows: byRow.size, calls, fullRows, unreadable: false, reason: null, byRow };
}

// Reads the baseline file, keeping a missing file apart from an unreadable one
// so the stop line names the cause the run actually hit.
function readBaselineText(file) {
  try {
    return { text: fs.readFileSync(file, 'utf8'), reason: null };
  } catch (error) {
    const code = error !== null && typeof error === 'object' ? error.code : undefined;
    return { text: null, reason: code === 'ENOENT' ? 'missing' : 'unreadable' };
  }
}

// The census line naming the recorded baseline and how much of it is replayable.
// It prints the file the run actually read, so a run against another calls file
// says so instead of naming the default.
function baselineCensusLine(file, baseline) {
  return `baseline: path=${file} rows=${baseline.rows} choice=${baseline.calls} rows_with_3_full_maps=${baseline.fullRows}`;
}

// The census line stating the replay's size before any call: one call per order
// rotation for every recorded row.
function replayCensusLine(baseline) {
  return `replay: rows=${baseline.rows} calls=${baseline.rows * 3} key_source=recorded`;
}

// The one line the caller prints before exiting 1, naming the file that could
// not be read and why.
function baselineStopLine(file, reason) {
  return `stop: baseline ${file} ${reason}`;
}

// ───────────────────────────────────────────────────────────────────
// 5. BACKEND CENSUS
// ───────────────────────────────────────────────────────────────────

// Identity reads share the classifier call's bound, so a wedged CLI cannot
// stretch the zero-call census without limit.
function jevSpawnOptions(env) {
  return { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: CALL_TIMEOUT_MS };
}

// The CLI prints `jev <version>` on its first version line; anything else is
// reported verbatim, so the census never invents a version it did not see.
function jevVersionFrom(stdout) {
  const first = (stdout ?? '').trim().split('\n')[0];
  if (first === '') return null;
  return first.replace(/^jev\s+/, '');
}

// A credential check has three states here. Exit 0 is the CLI's own "a
// credential is present"; any other exit status is its absent signal; a probe
// that never produced a status (spawn error or timeout) failed.
function jevAuthFrom(status) {
  if (status === 0) return 'ok';
  if (status === null) return 'failed';
  return 'absent';
}

/**
 * Reads the jev identity the census prints: executable path, version and
 * whether the selected provider has a credential. The auth probe contributes
 * its exit code only — `auth status` prints a store path, and this script
 * never reads, prints or passes a credential.
 *
 * @param {Record<string, string | undefined>} env Environment holding PATH and JEV_PROVIDER.
 * @returns {{ path: string | null, version: string | null, provider: string, auth: 'ok' | 'absent' | 'failed' }} One identity read; a machine with no jev reports absent auth, not a failed probe.
 */
export function readJevCensus(env) {
  const provider = env.JEV_PROVIDER || 'official';
  const path = which('jev', env);
  if (path === null) return { path: null, version: null, provider, auth: 'absent' };

  const options = jevSpawnOptions(env);
  const version = spawnSync(path, ['--version'], options);
  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], options);
  return { path, version: jevVersionFrom(version.stdout), provider, auth: jevAuthFrom(auth.status) };
}

/**
 * The two llama.cpp executables the census checks with `which`. Presence only:
 * the census spawns no model server.
 *
 * @param {Record<string, string | undefined>} env Environment holding PATH.
 * @returns {{ server: string | null, cli: string | null }} Absolute paths when present, null otherwise.
 */
export function readLlamaCensus(env) {
  return { server: which('llama-server', env), cli: which('llama-cli', env) };
}

// The version and provider a jev identity line carries; a machine with no jev
// still states the provider its census was about.
function jevCensusLine(jev) {
  return `jev: path=${jev?.path ?? 'none'} version=${jev?.version ?? 'none'} provider=${jev?.provider || 'official'}`;
}

// Separate from the identity line: one states what is installed, the other
// whether a live arm could authenticate.
function jevIdentityLine(jev) {
  return `jev identity: provider=${jev?.provider || 'official'} auth=${jev?.auth ?? 'absent'}`;
}

// Presence line for the local inference runtime; the census checks only
// whether it is installed.
function llamaCensusLine(llama) {
  return `llama.cpp: server=${llama?.server ?? 'none'} cli=${llama?.cli ?? 'none'}`;
}

// The runtime is imported from the package `pi` resolves to, so a census describes
// the install it found rather than a copy of the package the script might be run
// with. create() takes no options: the default runtime does not reach the network,
// and credentials stay in Pi's own store, never in this script.
async function createPiRuntime(packageDir) {
  const entry = pathToFileURL(path.join(packageDir, 'dist', 'index.js'));
  const { ModelRuntime } = await import(entry.href);
  return ModelRuntime.create();
}

// One known/available pair per provider over the classifier catalog. A provider
// named in only one of the two reads still gets a row, so an offer with no
// credential present stays visible instead of vanishing from the census.
async function classifierCounts(runtime) {
  const known = runtime.getModelsOfType('classifier');
  const available = await runtime.getAvailableOfType('classifier');

  const counts = new Map();
  for (const model of known) {
    const entry = counts.get(model.provider) ?? { provider: model.provider, known: 0, available: 0 };
    entry.known += 1;
    counts.set(model.provider, entry);
  }
  for (const model of available) {
    const entry = counts.get(model.provider) ?? { provider: model.provider, known: 0, available: 0 };
    entry.available += 1;
    counts.set(model.provider, entry);
  }
  return [...counts.values()];
}

/**
 * The Pi identity and classifier census: the package `pi` resolves to, and one
 * known/available pair per classifier provider. Only the catalog is read — no
 * classify call — so the census spends nothing. A resolved package whose runtime
 * cannot be read degrades to no classifier rows and one diagnostic, keeping the
 * rest of the census printable on a broken install.
 *
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @param {{ runtime?: object }} [deps] Injected classifier runtime, so a test can exercise the census without a Pi install.
 * @returns {Promise<{ packageDir: string | null, version: string | null, classifiers: Array<{ provider: string, known: number, available: number }> }>} Identity plus per-provider classifier counts.
 */
export async function readPiCensus(env, deps = {}) {
  const pi = resolvePiPackage(env);
  const identity = { packageDir: pi?.packageDir ?? null, version: pi?.version ?? null };

  if (deps.runtime !== undefined) return { ...identity, classifiers: await classifierCounts(deps.runtime) };
  if (pi === null) return { ...identity, classifiers: [] };

  try {
    const runtime = await createPiRuntime(pi.packageDir);
    return { ...identity, classifiers: await classifierCounts(runtime) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    process.stderr.write(`[score-pi-transport] pi classifier census unavailable: ${detail}\n`);
    return { ...identity, classifiers: [] };
  }
}

// One line per provider, sorted by code unit so two runs print the same order,
// then a total summed from the same entries so the rows and the total cannot
// disagree.
function piClassifierLines(pi) {
  const classifiers = [...(pi?.classifiers ?? [])].sort((a, b) => {
    if (a.provider < b.provider) return -1;
    if (a.provider > b.provider) return 1;
    return 0;
  });
  const lines = classifiers.map((entry) => `pi classifier ${entry.provider}: known=${entry.known} available=${entry.available}`);
  const known = classifiers.reduce((sum, entry) => sum + entry.known, 0);
  const available = classifiers.reduce((sum, entry) => sum + entry.available, 0);
  lines.push(`pi classifier total: known=${known} available=${available}`);
  return lines;
}

/**
 * The census block the default run prints before anything can spend: Pi's
 * identity and per-provider classifier census, the jev identity, the llama.cpp
 * executables and the recorded baseline's counts, in that order.
 *
 * @param {{
 *   pi: { packageDir: string | null, version: string | null, classifiers?: Array<{ provider: string, known: number, available: number }> } | null,
 *   jev: { path: string | null, version: string | null, provider: string, auth: 'ok' | 'absent' | 'failed' } | null,
 *   llama: { server: string | null, cli: string | null } | null,
 *   baseline: { rows: number, calls: number, fullRows: number },
 *   baselinePath?: string
 * }} census Reads already taken; this function spawns nothing.
 * @returns {string[]} The census lines in print order.
 */
export function censusLines({ pi, jev, llama, baseline, baselinePath = BASELINE_PATH }) {
  return [
    piLine(pi),
    ...piClassifierLines(pi),
    jevCensusLine(jev),
    jevIdentityLine(jev),
    llamaCensusLine(llama),
    baselineCensusLine(baselinePath, baseline),
    replayCensusLine(baseline),
  ];
}

// ───────────────────────────────────────────────────────────────────
// 6. QUESTION CONSTRUCTION
// ───────────────────────────────────────────────────────────────────

/**
 * Option texts from the CLI's flat `-o key=description` argument list, keyed for
 * the Pi question. Insertion order follows the arguments, so the option order
 * the CLI was given is the order the model sees, and the text keeps any `[key]`
 * disambiguator the CLI added for equal descriptions.
 *
 * @param {string[]} optionPairs Flat arguments from `optionArgs`.
 * @returns {Record<string, string>} Description per option key, in argument order.
 */
export function criteriaMap(optionPairs) {
  const criteria = {};
  for (let index = 0; index + 1 < optionPairs.length; index += 2) {
    const pair = optionPairs[index + 1];
    const separator = pair.indexOf('=');
    if (separator === -1) continue;
    criteria[pair.slice(0, separator)] = pair.slice(separator + 1);
  }
  return criteria;
}

/**
 * The classifier context Pi receives for one option rotation: the prompt as the
 * state, and one named choice question carrying the CLI's own question text and
 * option descriptions. `keys` fixes the option order, so the JSON object the
 * model sees matches the rotation the CLI was given.
 *
 * @param {{ prompt: string, keys: string[], criteria: Record<string, string> }} question One row's prompt, its option keys in rotation order and their descriptions.
 * @returns {{ state: { request: string }, questions: Record<string, { type: 'choice', instructions: string, criteria: Record<string, string> }> }} Context for `classify()`.
 */
export function toClassifierContext({ prompt, keys, criteria }) {
  const ordered = {};
  for (const key of keys) ordered[key] = criteria[key];
  return {
    state: { request: prompt },
    questions: {
      [QUESTION_NAME]: { type: 'choice', instructions: CHOICE_QUESTION, criteria: ordered },
    },
  };
}

/**
 * Probability map from one Pi classifier answer, with the same raw and
 * full-coverage views the CLI reader returns. The full view is null unless every
 * submitted key holds a finite number, so a partial answer stays unmeasured
 * instead of entering a mean as a zero.
 *
 * @param {object} result Classifier result from `classify()`.
 * @param {string} questionName Name of the question the result answers.
 * @param {string[]} keys Option keys that were submitted.
 * @returns {{ raw: Record<string, number> | null, full: Record<string, number> | null }} The answer's raw probabilities, plus those probabilities when they cover every key.
 */
export function probabilitiesFrom(result, questionName, keys) {
  const probabilities = result?.answers?.[questionName]?.probabilities;
  if (probabilities === null || typeof probabilities !== 'object' || Array.isArray(probabilities)) {
    return { raw: null, full: null };
  }
  for (const key of keys) {
    const value = probabilities[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return { raw: probabilities, full: null };
  }
  const full = {};
  for (const key of keys) full[key] = probabilities[key];
  return { raw: probabilities, full };
}

/**
 * Mean probability per option over one row's measured maps. A row's orders ask
 * the same question, so the mean is what its choice is read from.
 *
 * @param {Array<Record<string, number>>} maps One full map per measured order.
 * @param {string[]} keys Option keys to average.
 * @returns {Record<string, number>} Mean probability per key.
 */
export function meanMap(maps, keys) {
  const means = {};
  for (const key of keys) {
    means[key] = maps.reduce((sum, map) => sum + map[key], 0) / maps.length;
  }
  return means;
}

/**
 * The key a row's maps agree on: the highest mean, ties settled by submitted key
 * order. Delegating the tie rule to the CLI's own `topKey` keeps both sides on
 * one implementation.
 *
 * @param {Array<Record<string, number>>} maps One full map per measured order.
 * @param {string[]} keys Option keys in submitted order.
 * @returns {string} The winning key.
 */
export function topKeyByMean(maps, keys) {
  return topKey(meanMap(maps, keys), keys);
}

// ───────────────────────────────────────────────────────────────────
// 7. REPLAY PLAN
// ───────────────────────────────────────────────────────────────────

// A full row's three recorded orders all answer the same option set, so the
// first recorded order carries the set every order repeated.
function recordedMap(records) {
  return records.find((record) => record.order === 0).probabilities;
}

/**
 * The recorded calls a rebuild may replay, one row at a time. A row is planned
 * only when the census still rebuilds the exact option set the CLI was asked:
 * a difference means the cluster or a description moved since the baseline, and
 * the row is excluded rather than asked a question the CLI never saw. Each
 * planned row keeps its recorded order indices, pairing every rotation with the
 * CLI's own option arguments so both sides send the same three questions.
 *
 * @param {{
 *   baseline: {{ byRow: Map<string, object[]> }},
 *   census: {{ rows: Array<{{ id: string, prompt: string, cluster: string[] }}> }},
 *   describe: (skill: string) => string
 * }} input Recorded choice records by row, the rebuild's census rows, and the description reader.
 * @returns {{
 *   plan: Map<string, {{ prompt: string, cluster: string[], keys: string[], orders: Array<{{ order: number, keys: string[], args: string[] }}> }}>,
 *   excluded: string[]
 * }} Planned rows by row id, and the ids no exact rebuild could be made for.
 */
export function buildReplayPlan({ baseline, census, describe }) {
  const censusRows = new Map(census.rows.map((row) => [row.id, row]));
  const plan = new Map();
  const excluded = [];
  for (const [rowId, records] of baseline.byRow) {
    const row = censusRows.get(rowId);
    if (row === undefined || !isFullRow(records)) {
      excluded.push(rowId);
      continue;
    }
    const keys = [...row.cluster, 'none'];
    if (keySetText(keys) !== keySetText(Object.keys(recordedMap(records)))) {
      excluded.push(rowId);
      continue;
    }
    plan.set(rowId, {
      prompt: row.prompt,
      cluster: row.cluster,
      keys,
      orders: rotations(keys).map((rotation, order) => ({
        order,
        keys: rotation,
        args: optionArgs(rotation, describe, row.cluster),
      })),
    });
  }
  return { plan, excluded };
}

// ───────────────────────────────────────────────────────────────────
// 8. PI ARM
// ───────────────────────────────────────────────────────────────────

// The state wrapper is the one part of a call the answer alone cannot prove, so
// its digest travels with every record and names what the model was sent.
function sha12(text) {
  return createHash('sha256').update(text).digest('hex').slice(0, 12);
}

// Cost per hundred calls from the totals the service reported. A call without a
// usage report stays out of the mean, so a missing figure never reads as zero.
function costPerHundred(costs) {
  if (costs.length === 0) return null;
  return (costs.reduce((sum, cost) => sum + cost, 0) / costs.length) * 100;
}

// The model gate reads only the catalog: the availability list with the provider
// fixed, then the one model both sides ask. A model that is listed but cannot be
// resolved fails the gate the same way a missing one does, and no
// classification can run before the gate passes.
async function piModelGate(runtime, out) {
  const models = await runtime.getAvailableOfType('classifier', PI_PROVIDER);
  const listed = models.some((entry) => entry.id === PI_MODEL_ID);
  const model = listed ? runtime.getModelOfType('classifier', PI_PROVIDER, PI_MODEL_ID) : undefined;
  const available = model !== undefined;
  out(`pi gate: model=${PI_PROVIDER}/${PI_MODEL_ID} available=${available ? 'yes' : 'no'} openrouter_models=${models.length}`);
  return { available, model, openrouterModels: models.length };
}

/**
 * The Pi arm: the model gate first, then one classify call per planned order.
 * The gate records the model it resolved before any call can spend, and each
 * call is recorded as it ends so a stopped arm keeps what it measured. A row
 * counts as measured only when every planned order returned a full probability
 * map; a partial map or a timed-out call leaves the row unmeasured rather than
 * entering a mean as a zero.
 *
 * @param {{
 *   env?: Record<string, string | undefined>,
 *   out?: (line: string) => void,
 *   err?: (line: string) => void,
 *   outDir?: string,
 *   plan?: Map<string, { prompt: string, cluster: string[], keys: string[], orders: Array<{ order: number, keys: string[], args: string[] }> }>,
 *   excluded?: string[],
 *   runtime?: object,
 *   timeoutMs?: number,
 *   replay?: 'recorded' | 'fresh'
 * }} [deps] Injectable dependencies; an injected runtime drives the arm without a Pi install.
 * @returns {Promise<{ column?: object, stopped?: string }>} The Pi column when the arm finished, or the stop line when a gate failed or the backend refused.
 */
export async function runPiArm(deps = {}) {
  const env = deps.env ?? process.env;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`[score-pi-transport] ${line}\n`));
  const plan = deps.plan ?? new Map();
  const excluded = deps.excluded ?? [];
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
  const replay = deps.replay ?? 'recorded';

  const pi = resolvePiPackage(env);
  if (pi === null) {
    out('pi arm skipped: package');
    return { stopped: 'pi arm skipped: package' };
  }

  // No planned row means the recorded baseline could not be rebuilt, so there
  // is nothing to ask and the arm stops before a runtime is created.
  if (plan.size === 0) {
    out('pi arm skipped: baseline');
    return { stopped: 'pi arm skipped: baseline' };
  }

  let runtime = deps.runtime;
  if (runtime === undefined) {
    try {
      runtime = await createPiRuntime(pi.packageDir);
    } catch (error) {
      err(`pi runtime unavailable: ${error instanceof Error ? error.message : String(error)}`);
      out('pi arm skipped: package');
      return { stopped: 'pi arm skipped: package' };
    }
  }

  const gate = await piModelGate(runtime, out);
  if (!gate.available) {
    out('pi arm skipped: model');
    return { stopped: 'pi arm skipped: model' };
  }

  const piVersion = pi.version ?? 'none';
  writeCall(deps.outDir, {
    backend: 'pi',
    kind: 'model_check',
    model: PI_MODEL_ID,
    provider: PI_PROVIDER,
    pi_version: piVersion,
    openrouter_models: gate.openrouterModels,
    status: 'measured',
  });

  const byRow = new Map();
  const wallTimes = [];
  const costs = [];
  let calls = 0;
  let timeouts = 0;
  let measured = 0;

  for (const [rowId, row] of plan) {
    const maps = [];
    let stopLine = null;
    for (const order of row.orders) {
      const context = toClassifierContext({
        prompt: row.prompt,
        keys: order.keys,
        criteria: criteriaMap(order.args),
      });
      const signal = AbortSignal.timeout(timeoutMs);
      const started = Date.now();
      let result;
      let failure = null;
      try {
        result = await runtime.classify(gate.model, context, { signal });
      } catch (error) {
        failure = error;
      }
      const callMs = Date.now() - started;
      calls += 1;
      wallTimes.push(callMs);

      let status = 'unmeasured';
      let stopReason = 'error';
      let probabilities = null;
      if (failure !== null) {
        // The bound firing is the timeout; any other rejection is a failed call
        // and stops the arm, because a backend that throws is not answering.
        if (signal.aborted) {
          status = 'unmeasured_timeout';
          stopReason = 'aborted';
          timeouts += 1;
        } else {
          stopLine = 'pi arm stopped: backend error';
          err(`pi call failed: ${failure instanceof Error ? failure.message : String(failure)}`);
        }
      } else {
        stopReason = typeof result?.stopReason === 'string' ? result.stopReason : 'error';
        const views = probabilitiesFrom(result, QUESTION_NAME, order.keys);
        probabilities = views.full ?? views.raw;
        if (views.full !== null) {
          status = 'measured';
          maps.push(views.full);
        }
        if (result?.stopReason === 'error') stopLine = 'pi arm stopped: backend error';
        const cost = result?.usage?.cost?.total;
        if (typeof cost === 'number' && Number.isFinite(cost)) costs.push(cost);
      }

      writeCall(deps.outDir, {
        backend: 'pi',
        kind: 'choice',
        row_id: rowId,
        order: order.order,
        attempt: 1,
        call_ms: callMs,
        exit_code: probabilities !== null ? 0 : null,
        stop_reason: stopReason,
        status,
        probabilities,
        replay,
        model: PI_MODEL_ID,
        provider: PI_PROVIDER,
        pi_version: piVersion,
        state_sha12: sha12(JSON.stringify(context.state)),
      });

      if (stopLine !== null) break;
    }

    if (stopLine !== null) {
      out(stopLine);
      out(`pi: partial_rows=${measured}`);
      return { stopped: stopLine };
    }
    // The row's orders ask one question over one option set, so only a full map
    // from every order makes the row's mean comparable with the CLI's.
    if (maps.length === row.orders.length) {
      byRow.set(rowId, maps);
      measured += 1;
    }
  }

  const column = {
    backend: 'pi',
    rows: plan.size,
    calls,
    measured,
    unmeasured: plan.size - measured,
    timeouts,
    excluded: excluded.length,
    p50_ms: nearestRank(wallTimes, 0.5),
    p95_ms: nearestRank(wallTimes, 0.95),
    cost_per_100: costPerHundred(costs),
    byRow,
    model: PI_MODEL_ID,
    provider: PI_PROVIDER,
    pi_version: piVersion,
  };
  out(`pi: rows=${column.rows} calls=${column.calls} measured=${column.measured} unmeasured=${column.unmeasured} timeouts=${column.timeouts} excluded=${column.excluded}`);
  return { column };
}

// ───────────────────────────────────────────────────────────────────
// 9. CLI ARM
// ───────────────────────────────────────────────────────────────────

/**
 * The CLI arm over the same plan the Pi arm takes: the shared jev gate, then
 * one `jev choice` spawn per planned order carrying the plan's own option
 * arguments. The gate prints its identity and skip lines, and a failed gate
 * stops the arm before any call. Each call is recorded as it ends, and a row
 * counts as measured only when every planned order returned a full probability
 * map, so a partial answer never enters a mean as a zero.
 *
 * @param {{
 *   env?: Record<string, string | undefined>,
 *   out?: (line: string) => void,
 *   outDir?: string,
 *   plan?: Map<string, { prompt: string, cluster: string[], keys: string[], orders: Array<{ order: number, keys: string[], args: string[] }> }>,
 *   excluded?: string[],
 *   timeoutMs?: number
 * }} [deps] Injectable dependencies; a stub jev first on PATH drives the arm without a live backend.
 * @returns {Promise<{ column?: object, stopped?: string }>} The CLI column when the arm finished, or the stop line when a gate failed or the CLI refused.
 */
export async function runCliArm(deps = {}) {
  const env = deps.env ?? process.env;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const plan = deps.plan ?? new Map();
  const excluded = deps.excluded ?? [];
  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;

  // An empty plan means the recorded baseline could not be rebuilt, so there
  // is nothing to ask and the arm stops before the gate spends a probe.
  if (plan.size === 0) {
    out('cli arm skipped: baseline');
    return { stopped: 'cli arm skipped: baseline' };
  }

  // The shared gate prints its own skip line, so this writer captures that
  // line while passing it through: the caller's stop names the refusal the
  // reader saw, and the arm's report stays honest.
  let gateStop = null;
  const gate = jevGate({
    out: (line) => {
      if (line.startsWith('jev arm skipped')) gateStop = line;
      out(line);
    },
    env,
    timeoutMs,
  });
  if (!gate.passed) return { stopped: gateStop ?? 'jev arm skipped' };

  const provider = gate.provider;
  // The auth test names the model every record carries; only its exit code is
  // read as the credential signal, never its store text.
  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', provider], '', env, timeoutMs);
  let model = 'unknown';
  if (auth.code === 0) {
    try {
      const parsed = JSON.parse(auth.stdout).model;
      if (typeof parsed === 'string') model = parsed;
    } catch {
      // A non-JSON body leaves the model unknown.
    }
  }
  writeCall(deps.outDir, {
    backend: 'jev',
    kind: 'auth_test',
    wall_ms: auth.wallMs,
    exit_code: auth.code,
    jev_version: JEV_VERSION,
    provider,
    model,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
  });
  if (auth.code !== 0) {
    let stopLine = 'cli arm stopped: auth test failed';
    if (auth.code === 3) stopLine = 'cli arm stopped: key rejected';
    else if (auth.code === 130) stopLine = 'cli arm stopped: interrupted';
    out(stopLine);
    out('cli: partial_rows=0');
    return { stopped: stopLine };
  }
  out(`jev: auth_test provider=${provider} model=${model}`);

  const byRow = new Map();
  const wallTimes = [];
  let calls = 0;
  let timeouts = 0;
  let measured = 0;

  for (const [rowId, row] of plan) {
    const maps = [];
    let stopLine = null;
    for (const order of row.orders) {
      const args = ['choice', '--provider', provider, '-q', CHOICE_QUESTION, ...order.args];
      const result = await spawnCall(gate.path, args, row.prompt, env, timeoutMs);
      calls += 1;
      wallTimes.push(result.wallMs);

      let status = 'unmeasured';
      let probabilities = null;
      if (result.timedOut) {
        // A killed spawn is its own status so a hang is not read as a miss.
        status = 'unmeasured_timeout';
        timeouts += 1;
      } else if (result.code === 0) {
        const views = readProbabilities(result.stdout, order.keys);
        probabilities = views.raw;
        if (views.full !== null) {
          status = 'measured';
          maps.push(views.full);
        }
      } else if (result.code === 2) {
        stopLine = 'cli arm stopped: usage error';
      } else if (result.code === 3) {
        stopLine = 'cli arm stopped: key rejected';
      } else if (result.code === 130) {
        stopLine = 'cli arm stopped: interrupted';
      }

      writeCall(deps.outDir, {
        backend: 'jev',
        kind: 'choice',
        row_id: rowId,
        order: order.order,
        attempt: 1,
        child_wall_ms: result.wallMs,
        advisor_ms: null,
        health_ms: null,
        call_ms: null,
        exit_code: result.code,
        probabilities,
        status,
        jev_version: JEV_VERSION,
        provider,
        model,
      });

      if (stopLine !== null) break;
    }

    if (stopLine !== null) {
      out(stopLine);
      out(`cli: partial_rows=${measured}`);
      return { stopped: stopLine };
    }
    // The row's orders ask one question over one option set, so only a full
    // map from every order makes the row's mean comparable with Pi's.
    if (maps.length === row.orders.length) {
      byRow.set(rowId, maps);
      measured += 1;
    }
  }

  const column = {
    backend: 'jev',
    rows: plan.size,
    calls,
    measured,
    unmeasured: plan.size - measured,
    timeouts,
    excluded: excluded.length,
    p50_ms: nearestRank(wallTimes, 0.5),
    p95_ms: nearestRank(wallTimes, 0.95),
    byRow,
    jev_version: JEV_VERSION,
    provider,
    model,
  };
  return { column };
}

// ───────────────────────────────────────────────────────────────────
// 10. COMPARISON
// ───────────────────────────────────────────────────────────────────

// One decimal is the resolution the printed percentages carry, so a line never
// implies more precision than the comparison measured.
function round1(value) {
  return Math.round(value * 10) / 10;
}

// The printed form of each metric. A figure the run did not produce stays
// `none` rather than becoming a zero somewhere down the line.
function formatPct(value) {
  return Number.isFinite(value) ? value.toFixed(1) : 'none';
}

function formatDp(value) {
  return Number.isFinite(value) ? value.toFixed(4) : 'none';
}

function formatMs(value) {
  return Number.isFinite(value) ? String(Math.round(value)) : 'none';
}

function formatCost(value) {
  return Number.isFinite(value) ? value.toFixed(4) : 'none';
}

/**
 * The comparison's counts from the two sides' per-row maps. A row counts as
 * measured only when both sides measured it: one side's miss would otherwise
 * enter the agreement as a disagreement and its difference against a
 * probability the other side never reported. Both top keys reduce the same way
 * — mean over the row's orders, ties by the keys' submitted order — so a tie
 * cannot decide a side. The probability difference is read per order and
 * submitted key, over the maps themselves rather than an average of them.
 *
 * @param {{
 *   K: number,
 *   plan: Map<string, { keys: string[], orders: Array<object> }>,
 *   piByRow?: Map<string, Array<Record<string, number>>>,
 *   cliByRow?: Map<string, Array<Record<string, number>>>
 * }} input Planned rows, plus one full map per measured order on each side.
 * @returns {{ K: number, M: number, coverage: number, agreement: number, median_abs_dp: number | null }} The comparison metrics.
 */
export function metricsFor({ K, plan, piByRow, cliByRow }) {
  const piMaps = piByRow ?? new Map();
  const cliMaps = cliByRow ?? new Map();
  let measured = 0;
  let agreeing = 0;
  const differences = [];

  for (const [rowId, row] of plan) {
    const pi = piMaps.get(rowId);
    const cli = cliMaps.get(rowId);
    if (pi === undefined || cli === undefined) continue;

    measured += 1;
    if (topKeyByMean(pi, row.keys) === topKeyByMean(cli, row.keys)) agreeing += 1;
    const orders = Math.min(pi.length, cli.length);
    for (let index = 0; index < orders; index += 1) {
      for (const key of row.keys) differences.push(Math.abs(pi[index][key] - cli[index][key]));
    }
  }

  return {
    K,
    M: measured,
    coverage: K === 0 ? 0 : round1((measured / K) * 100),
    agreement: measured === 0 ? 0 : round1((agreeing / measured) * 100),
    median_abs_dp: nearestRank(differences, 0.5),
  };
}

// A ratio needs a positive CLI bound to compare against; a missing or zero one
// cannot show the bound holds, so the check fails rather than passing by default.
function latencyWithinBound(metrics) {
  const ratio = metrics.p95_ms_pi / metrics.p95_ms_cli;
  return Number.isFinite(ratio) && ratio <= MAX_LATENCY_RATIO;
}

/**
 * The keep rule's three checks, in order, over the run's own metrics. Coverage
 * comes first: a comparison that measured too little stops before the rest is
 * judged. Then agreement and latency, the first failed bound naming the reason.
 * Only when every bound holds does the transport adopt.
 *
 * @param {{ coverage: number, agreement: number, p95_ms_pi: number | null, p95_ms_cli: number | null }} metrics The run's metrics.
 * @returns {{ outcome: 'adopt' | 'keep-cli' | 'stop', reason: 'coverage' | 'agreement' | 'latency' | null }} The judged outcome and the bound that decided it.
 */
export function judge(metrics) {
  if (metrics.coverage < MIN_COVERAGE_PCT) return { outcome: 'stop', reason: 'coverage' };
  if (metrics.agreement < MIN_AGREEMENT_PCT) return { outcome: 'keep-cli', reason: 'agreement' };
  if (!latencyWithinBound(metrics)) return { outcome: 'keep-cli', reason: 'latency' };
  return { outcome: 'adopt', reason: null };
}

/**
 * The one verdict line, its fields in a fixed order so two runs read field by
 * field. A stop carries its reason, because it names what to fix; adopt and
 * keep-cli are already explained by the fields beside them. A cost no run
 * reported prints as `none` and never changes the outcome.
 *
 * @param {{ outcome: string, reason: string | null, K: number, M: number, coverage: number, agreement: number, median_abs_dp: number | null, p95_ms_pi: number | null, p95_ms_cli: number | null, cost_per_100: number | null }} verdict The judged outcome over the run's metrics.
 * @returns {string} The verdict line.
 */
export function verdictLine(verdict) {
  const outcome = verdict.outcome === 'stop' ? `stop (${verdict.reason})` : verdict.outcome;
  return `verdict pi-transport: ${outcome} K=${verdict.K} M=${verdict.M} coverage=${formatPct(verdict.coverage)} agreement=${formatPct(verdict.agreement)} median_abs_dp=${formatDp(verdict.median_abs_dp)} p95_ms=${formatMs(verdict.p95_ms_pi)}/${formatMs(verdict.p95_ms_cli)} cost_per_100=${formatCost(verdict.cost_per_100)}`;
}

/**
 * One arm's summary line: its counts and timing quantiles, plus the field that
 * belongs to that side alone — the cost Pi reports, the call count the CLI
 * needs to explain its own column.
 *
 * @param {{ backend: string, rows: number, calls: number, measured: number, p50_ms: number | null, p95_ms: number | null, cost_per_100?: number | null }} column One arm's column.
 * @returns {string} The column line.
 */
export function columnLine(column) {
  const side = column.backend === 'pi' ? 'pi' : 'cli';
  const tail = side === 'pi' ? `cost_per_100=${formatCost(column.cost_per_100)}` : `calls=${column.calls}`;
  return `column ${side}: rows=${column.rows} measured=${column.measured} p50_ms=${formatMs(column.p50_ms)} p95_ms=${formatMs(column.p95_ms)} ${tail}`;
}

/**
 * The CLI side a Pi-only replay compares against: the recorded calls for the
 * planned rows, read back as maps and timings instead of asking the CLI again.
 * A row whose records fall short of its orders stays unmeasured rather than
 * padded, the same contract the arms hold.
 *
 * @param {{ byRow: Map<string, object[]> }} baseline The recorded calls.
 * @param {Map<string, { prompt: string, cluster: string[], keys: string[], orders: Array<object> }>} plan Planned rows.
 * @param {number} excludedCount Rows the rebuild could not replay.
 * @returns {object} A column shaped like the CLI arm's.
 */
function recordedCliColumn(baseline, plan, excludedCount) {
  const byRow = new Map();
  const callTimes = [];
  let calls = 0;
  let reference = null;

  for (const [rowId, row] of plan) {
    const records = [...(baseline.byRow.get(rowId) ?? [])].sort((left, right) => left.order - right.order);
    const maps = [];
    for (const record of records) {
      if (!isFullMap(record.probabilities)) continue;
      maps.push(record.probabilities);
      calls += 1;
      if (typeof record.call_ms === 'number' && Number.isFinite(record.call_ms)) callTimes.push(record.call_ms);
      if (reference === null) reference = record;
    }
    if (maps.length === row.orders.length) byRow.set(rowId, maps);
  }

  return {
    backend: 'jev',
    rows: plan.size,
    calls,
    measured: byRow.size,
    unmeasured: plan.size - byRow.size,
    timeouts: 0,
    excluded: excludedCount,
    p50_ms: nearestRank(callTimes, 0.5),
    p95_ms: nearestRank(callTimes, 0.95),
    byRow,
    jev_version: reference?.jev_version ?? JEV_VERSION,
    provider: reference?.provider ?? 'official',
    model: reference?.model ?? 'unknown',
  };
}

// A column reduced to what JSON can carry: the per-row maps stay in
// calls.jsonl, so the report carries counts and timings without repeating the
// run's largest artifact.
function columnReport(column) {
  if (column === null || column === undefined) return null;
  return {
    backend: column.backend,
    rows: column.rows,
    calls: column.calls,
    measured: column.measured,
    unmeasured: column.unmeasured,
    timeouts: column.timeouts,
    excluded: column.excluded,
    p50_ms: column.p50_ms,
    p95_ms: column.p95_ms,
    cost_per_100: column.cost_per_100 ?? null,
    model: column.model ?? null,
    provider: column.provider ?? null,
    version: column.pi_version ?? column.jev_version ?? null,
  };
}

// The report lands once the verdict is read, so its fields and the printed
// lines cannot be two different claims about one run.
function writeReport(outDir, report) {
  if (typeof outDir !== 'string' || outDir === '') return;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
}

// ───────────────────────────────────────────────────────────────────
// 11. MAIN
// ───────────────────────────────────────────────────────────────────

// The advisor's census loader is reached only by an armed run: it scores the
// committed prompts and reads the skill projection, work a census-only run must
// not pay for. The dynamic import keeps that module and its build output out of
// this script's own load path.
async function loadCensusDefault() {
  const { loadCensus } = await import('../../../system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs');
  return loadCensus();
}

// A report directory that exists but is not a usable directory is refused
// before any call. A path that does not exist yet is neither: an arm creates it
// when it has something to write.
function outDirProblem(dir) {
  let stat;
  try {
    stat = fs.statSync(dir);
  } catch (error) {
    const code = error !== null && typeof error === 'object' ? error.code : undefined;
    return code === 'ENOENT' ? null : 'cannot be read';
  }
  if (!stat.isDirectory()) return 'is not a directory';
  try {
    fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK);
    return null;
  } catch {
    return 'is not readable and writable';
  }
}

/**
 * Runs the benchmark and returns the process exit code. Usage is settled first,
 * then the recorded baseline, then the census; nothing is spawned before the row
 * set is known, and the default run never leaves the census. An armed run then
 * loads the replay census once and lets each armed arm ask its rows.
 *
 * @param {string[]} argv Command-line arguments after the script path.
 * @param {object} [deps] Injectable dependencies.
 * @param {Record<string, string | undefined>} [deps.env] Environment for any child call. Default process.env.
 * @param {object} [deps.runtime] Classifier runtime, so a test can take the census without a Pi install.
 * @param {string} [deps.baselinePath] Calls file to read, repo-relative or absolute. Default BASELINE_PATH.
 * @param {() => Promise<object>} [deps.loadCensus] Census loader for an armed run. Defaults to the advisor's loader, imported only when an arm is armed.
 * @param {number} [deps.timeoutMs] Per-call bound for the arms. Default CALL_TIMEOUT_MS.
 * @param {(line: string) => void} [deps.out] Stdout line writer. Default writes the line plus a newline to stdout.
 * @param {(line: string) => void} [deps.err] Stderr line writer. Default writes a tagged line to stderr.
 * @returns {Promise<number>} The process exit code.
 */
export async function main(argv, deps = {}) {
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`[score-pi-transport] ${line}\n`));
  const env = deps.env ?? process.env;

  // Usage is settled before the census prints, so a refused invocation leaves no
  // stdout line a reader could mistake for a started run.
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        pi: { type: 'boolean' },
        cli: { type: 'boolean' },
        out: { type: 'string' },
      },
    }));
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const armed = values.pi === true || values.cli === true;
  const outDir = typeof values.out === 'string' && values.out !== '' ? values.out : null;
  if (values.pi === true && outDir === null) {
    err('--pi needs --out <dir> so every call is recorded');
    return 2;
  }
  if (values.cli === true && outDir === null) {
    err('--cli needs --out <dir> so every call is recorded');
    return 2;
  }
  if (!armed && values.out !== undefined) {
    err('--out is only legal with --pi or --cli');
    return 2;
  }
  if (armed) {
    const problem = outDirProblem(outDir);
    if (problem !== null) {
      err(`--out ${outDir} ${problem}`);
      return 2;
    }
  }

  // The baseline fixes the run's row set, so it is read before anything is
  // spawned: an unreadable one stops the run instead of printing a census whose
  // rows do not exist.
  const baselinePath = deps.baselinePath ?? BASELINE_PATH;
  const read = readBaselineText(path.resolve(REPO_ROOT, baselinePath));
  if (read.reason !== null) {
    out(baselineStopLine(baselinePath, read.reason));
    return 1;
  }
  const baseline = readBaseline(read.text);
  if (baseline.unreadable) {
    out(baselineStopLine(baselinePath, baseline.reason));
    return 1;
  }

  const pi = await readPiCensus(env, { runtime: deps.runtime });
  const jev = readJevCensus(env);
  const llama = readLlamaCensus(env);
  const census = censusLines({ pi, jev, llama, baseline, baselinePath });
  for (const line of census) out(line);
  if (!armed) return 0;

  // An armed run needs the prompts and clusters behind the recorded rows; the
  // loader is injected in tests and stays a dynamic import here so a census-only
  // run never loads the scorer or its build output.
  const loadCensus = deps.loadCensus ?? loadCensusDefault;
  const replayCensus = await loadCensus();
  const { plan, excluded } = buildReplayPlan({
    baseline,
    census: replayCensus,
    describe: replayCensus.describe,
  });

  let piColumn = null;
  let cliColumn = null;

  if (values.pi === true) {
    const arm = await runPiArm({
      env,
      out,
      err,
      outDir,
      plan,
      excluded,
      runtime: deps.runtime,
      timeoutMs: deps.timeoutMs,
      replay: values.cli === true ? 'fresh' : 'recorded',
    });
    if (arm.stopped !== undefined) return 0;
    piColumn = arm.column;
  }

  if (values.cli === true) {
    const arm = await runCliArm({ env, out, outDir, plan, excluded, timeoutMs: deps.timeoutMs });
    if (arm.stopped !== undefined) return 0;
    cliColumn = arm.column;
  }

  if (piColumn === null) {
    // A CLI-only rerun has no Pi side to compare against, so its column is all
    // the run can print: no metrics, no verdict and no report.
    out(columnLine(cliColumn));
    return 0;
  }

  out(columnLine(piColumn));
  if (cliColumn === null) cliColumn = recordedCliColumn(baseline, plan, excluded.length);
  out(columnLine(cliColumn));

  // A row the rebuild could not replay is still part of what the run set out to
  // compare, so it stays in the coverage denominator as an unmeasured row.
  const metrics = {
    ...metricsFor({ K: plan.size + excluded.length, plan, piByRow: piColumn.byRow, cliByRow: cliColumn.byRow }),
    p95_ms_pi: piColumn.p95_ms,
    p95_ms_cli: cliColumn.p95_ms,
    cost_per_100: piColumn.cost_per_100,
  };
  out(`metrics: coverage=${formatPct(metrics.coverage)} agreement=${formatPct(metrics.agreement)} median_abs_dp=${formatDp(metrics.median_abs_dp)}`);
  const verdict = { ...metrics, ...judge(metrics) };
  const line = verdictLine(verdict);
  out(line);
  writeReport(outDir, {
    census,
    pi: columnReport(piColumn),
    cli: columnReport(cliColumn),
    metrics,
    verdict: { ...verdict, line },
    stopped: {},
  });
  return 0;
}

// Importing this module from a test or a REPL must not spawn a probe or print a
// census, so the run starts only when this file is the process entry point.
const isEntry = process.argv[1] !== undefined && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (isEntry) process.exitCode = await main(process.argv.slice(2));
