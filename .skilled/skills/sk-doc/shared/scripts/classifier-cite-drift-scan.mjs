// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Citation Drift Scan
// ───────────────────────────────────────────────────────────────────
// The classifier half of cite-drift-scan.mjs: the pinned Jev gate, the arm
// that measures labeled claims against their cited windows, the advisory
// check the document validator runs, and the scoring, verdict and process
// helpers only that code uses. The host owns the census, the draw and the
// CLI entry point, imports these from here, and is never imported back.
// ───────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { featureSwitch } from '../../../cli-classifier/shared/scripts/jev-features.mjs';
import { spawnClassifierCall } from '../../../cli-classifier/shared/scripts/jev-transport.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Tracked-file citation with an optional inclusive line range. */
export const CITATION_RE = /(?<![\w./-])([A-Za-z0-9_./-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)):(\d+)(?:-(\d+))?/g;

/** Half-width, in lines, of the window a row records. */
export const WINDOW_RADIUS_LINES = 10;

/** A yes probability below this reads as a flagged, drifted window. */
export const FLAG_THRESHOLD = 0.5;

/** Extra reruns are limited to first scores close enough to change the flag. */
const ADAPTIVE_RERUN_MIN = 0.35;
const ADAPTIVE_RERUN_MAX = 0.65;

/** Every keep-rule check in its order, restated for the report reader. */
export const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then precision 5*TP >= 4*(TP+FP) with TP+FP >= 1, then margin 10*(A-B) >= M, then sign test p < 0.05, then for jev flips 10*F <= 3*M';

/** The fixed `-q` text every model call carries, printed before the first call. */
export const INSTRUCTION = 'Does the cited code window still show what the citing sentence claims?';

// ───────────────────────────────────────────────────────────────────
// 2. CENSUS
// ───────────────────────────────────────────────────────────────────

/**
 * Lowercase hex SHA-256 of the UTF-8 text.
 * @param {string} text
 * @returns {string}
 */
export function sha256Hex(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

// ───────────────────────────────────────────────────────────────────
// 3. DRAW
// ───────────────────────────────────────────────────────────────────

/**
 * Counts the label gate reads: rows carrying a verdict, and the two draw kinds.
 * Constructed rows carry a verdict from the start, so a fresh draw is halfway to
 * the gate and the operator's live labels complete it.
 * @param {Array<{ kind?: string, verdict?: string|null }>} rows
 * @returns {{ labeled: number, live: number, constructed: number }}
 */
export function labelCounts(rows) {
  let labeled = 0;
  let live = 0;
  let constructed = 0;
  for (const row of rows) {
    if (row.verdict !== null && row.verdict !== undefined) labeled += 1;
    if (row.kind === 'live') live += 1;
    if (row.kind === 'constructed') constructed += 1;
  }
  return { labeled, live, constructed };
}

// ───────────────────────────────────────────────────────────────────
// 4. COMPARATORS AND LABEL GATE
// ───────────────────────────────────────────────────────────────────

/** A word inside a code span that names a file rather than code: a slash path, a file name or a bare line reference. */
const PATH_WORD_RE = /^(?:\S*\/\S*|[\w.-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)(?::\d+(?:-\d+)?)?|:?\d+(?:-\d+)?)[,;.]?$/;

/**
 * Claim tokens of a citing sentence: the identifiers its backticked spans name
 * once every citation, path, file name and line reference is removed, kept at
 * two characters or more, never all digits and never a component of the
 * target's own path. A token that names the cited file holds across the whole
 * file, so only the claim's own identifiers can say whether the cited window
 * still shows it.
 * @param {string} sentence
 * @param {string} target Repo-relative target path.
 * @returns {string[]} Unique tokens in sentence order.
 */
export function identifierTokens(sentence, target) {
  const pathParts = new Set(target.split(/[^A-Za-z0-9_]+/));
  const tokens = [];
  for (const match of sentence.matchAll(/`([^`]+)`/g)) {
    const words = match[1].replace(CITATION_RE, ' ').split(/\s+/).filter((word) => !PATH_WORD_RE.test(word));
    for (const token of words.join(' ').split(/[^A-Za-z0-9_]+/)) {
      if (token.length < 2 || /^\d+$/.test(token) || pathParts.has(token) || tokens.includes(token)) continue;
      tokens.push(token);
    }
  }
  return tokens;
}

/**
 * True when the sentence names at least one claim token and no identifier of
 * the window equals any of them. Tokens match whole identifiers, so a token
 * that appears only inside a longer word is absent. A sentence with no claim
 * token is never flagged.
 * @param {string} sentence
 * @param {string} windowText The target's cited line -10..+10, clamped.
 * @param {string} target Repo-relative target path.
 * @returns {boolean}
 */
export function flagByIdentifierOverlap(sentence, windowText, target) {
  const tokens = identifierTokens(sentence, target);
  if (tokens.length === 0) return false;
  const windowTokens = new Set(windowText.split(/[^A-Za-z0-9_]+/));
  return !tokens.some((token) => windowTokens.has(token));
}

/**
 * Accuracy of the two mechanical comparators on identical labeled rows.
 * Flag-nothing never flags; identifier overlap flags when the sentence's code
 * tokens vanish from the window. Labels map supports to clean and anything
 * else to drifted. The baseline is the comparator right on more rows, with
 * flag-nothing winning a tie, so winnable rows are those it gets wrong.
 * @param {Array<{ id?: string, target?: string, verdict?: string|null }>} rows
 * @param {Map<string, { sentence: string, windowText: string }>} windows Keyed by row id.
 * @returns {{
 *   K: number,
 *   flagNothing: { right: number, K: number, ratio: number },
 *   identifierOverlap: { right: number, K: number, ratio: number },
 *   baselineMethod: 'flag-nothing'|'identifier-overlap',
 *   baselineRight: number,
 *   baselineRatio: number,
 *   headroom: boolean,
 *   winnable: number
 * }}
 */
export function scoreComparators(rows, windows) {
  const labeled = rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
  const K = labeled.length;
  let flagNothingRight = 0;
  let identifierOverlapRight = 0;
  for (const row of labeled) {
    const drifted = row.verdict !== 'supports';
    if (!drifted) flagNothingRight += 1;
    const entry = windows.get(row.id);
    const flagged = flagByIdentifierOverlap(entry?.sentence ?? '', entry?.windowText ?? '', row.target ?? '');
    if (flagged === drifted) identifierOverlapRight += 1;
  }
  const baselineMethod = identifierOverlapRight > flagNothingRight ? 'identifier-overlap' : 'flag-nothing';
  const baselineRight = Math.max(flagNothingRight, identifierOverlapRight);
  return {
    K,
    flagNothing: { right: flagNothingRight, K, ratio: K === 0 ? 0 : flagNothingRight / K },
    identifierOverlap: { right: identifierOverlapRight, K, ratio: K === 0 ? 0 : identifierOverlapRight / K },
    baselineMethod,
    baselineRight,
    baselineRatio: K === 0 ? 0 : baselineRight / K,
    // Above 90 percent baseline accuracy a 10-point gain cannot fit.
    headroom: 10 * baselineRight <= 9 * K,
    winnable: K - baselineRight,
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. VERDICT
// ───────────────────────────────────────────────────────────────────

/**
 * One-sided exact tail P(X >= k) for X ~ Binomial(n, 1/2), summed coefficient
 * by coefficient in BigInt. The threshold test is exact too: 20 * num < 2^n is
 * p < 0.05 with no float comparison. No trials give p 1.
 * @param {number} k Successes the tail starts at.
 * @param {number} n Trials.
 * @returns {{ p: number, below: boolean }}
 */
export function binomialTail(k, n) {
  if (n === 0) return { p: 1, below: false };
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= n; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
    if (i >= k) num += coefficient;
  }
  const den = 1n << BigInt(n);
  return { p: Number(num) / Number(den), below: 20n * num < den };
}

/**
 * A column's verdict, the first failed keep-rule check deciding, in this
 * order: coverage, precision, margin, the sign test, then flips for a Jev
 * column. The sign test's p rides on every outcome.
 * @param {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number }} counts
 * @returns {{ verdict: 'keep'|'kill (precision)'|'stop (coverage)'|'stop (margin)'|'stop (sign test)'|'stop (flips)', p: number }}
 */
export function decideVerdict({ backend, K, M, A, B, W, L, TP, FP, F }) {
  const sign = binomialTail(W, W + L);
  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', p: sign.p };
  if (!(TP + FP >= 1 && 5 * TP >= 4 * (TP + FP))) return { verdict: 'kill (precision)', p: sign.p };
  if (!(10 * (A - B) >= M)) return { verdict: 'stop (margin)', p: sign.p };
  if (!sign.below) return { verdict: 'stop (sign test)', p: sign.p };
  if (backend === 'jev' && !(10 * F <= 3 * M)) return { verdict: 'stop (flips)', p: sign.p };
  return { verdict: 'keep', p: sign.p };
}

/**
 * The notice a column prints before its verdict when the report an earlier run
 * left behind names another identity: a changed Jev provider or model. Null
 * when no earlier column exists or it matches the identity this run used.
 * @param {string} backend
 * @param {object|null} stored Parsed report from an earlier run.
 * @param {{ provider?: string, model?: string, instructionSha256?: string, keepRuleSha256?: string, rowSetSha256?: string }} identity
 * @returns {string|null}
 */
function requalifyNotice(backend, stored, identity) {
  const prior = stored?.columns?.[backend];
  if (prior === undefined || prior === null) return null;
  if (backend === 'jev' && (prior.provider !== identity.provider || prior.model !== identity.model)) {
    return 'requalify: model changed';
  }
  const previousMeasurement = stored?.measurement ?? {};
  if (backend === 'jev' && previousMeasurement.instructionSha256 !== identity.instructionSha256) {
    return 'requalify: instruction changed';
  }
  if (backend === 'jev' && previousMeasurement.keepRuleSha256 !== identity.keepRuleSha256) {
    return 'requalify: keep rule changed';
  }
  if (backend === 'jev' && previousMeasurement.rowSetSha256 !== identity.rowSetSha256) {
    return 'requalify: row set changed';
  }
  return null;
}

/** Fingerprint the exact prompt, decision rule and labeled row identities. */
export function measurementIdentity(rows) {
  const rowSet = rows.map((row) => ({
    id: row.id ?? null,
    kind: row.kind ?? null,
    doc: row.doc ?? null,
    doc_line: row.doc_line ?? null,
    target: row.target ?? null,
    target_line: row.target_line ?? null,
    window_start: row.window_start ?? null,
    window_end: row.window_end ?? null,
    commit: row.commit ?? null,
    claim_unit: row.claim_unit ?? 'line',
    claim_sha12: row.claim_sha12 ?? null,
    window_sha12: row.window_sha12 ?? null,
    verdict: row.verdict ?? null,
  })).sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  const counts = labelCounts(rows);
  return {
    instructionSha256: sha256Hex(INSTRUCTION),
    keepRuleSha256: sha256Hex(KEEP_RULE_LINE),
    rowSetSha256: sha256Hex(JSON.stringify(rowSet)),
    rowKinds: { live: counts.live, constructed: counts.constructed },
  };
}

/**
 * One column's verdict line: the verdict, every count, the sign test's p at
 * four significant digits, the labels hash and the column's identity suffix.
 * The flips count is the Jev column's own. A stored report that names another
 * identity puts its requalify notice on the line ahead of the verdict.
 * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, TP: number, FP: number, F: number, p: number, stored?: object|null, model?: string, provider?: string, instructionSha256?: string, keepRuleSha256?: string, rowSetSha256?: string }} summary
 * @param {string} labelsSha Truncated hash of the labels the column measured.
 * @param {string} [suffix] Column identity text, appended when non-empty.
 * @returns {string}
 */
export function verdictLine(summary, labelsSha, suffix = '') {
  const { backend, verdict, K, M, A, B, W, L, TP, FP, F, p } = summary;
  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L}`
    + ` TP=${TP} FP=${FP} F=${F} p=${p.toPrecision(4)} labels_sha256=${labelsSha}`;
  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
  const notice = requalifyNotice(backend, summary.stored, summary);
  return notice === null ? line : `${notice}\n${line}`;
}

/**
 * Mean squared error of a column's probabilities against the outcomes: the
 * Brier score. Each entry pairs the probability the backend gave a row with
 * the row's outcome, 1 for a window that still shows the claim and 0 for a
 * drifted one, since the probability is the model's yes. Entries
 * without a finite probability in [0, 1] are skipped, and nothing counted has
 * no score.
 * @param {Array<{ probability: number, actual: number|boolean }>} probabilities
 * @returns {number|null}
 */
export function brierScore(probabilities) {
  let sum = 0;
  let counted = 0;
  for (const entry of probabilities) {
    const probability = entry.probability;
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) continue;
    sum += (probability - (entry.actual ? 1 : 0)) ** 2;
    counted += 1;
  }
  return counted === 0 ? null : sum / counted;
}

/**
 * Nearest-rank percentile. Empty lists have no rank.
 * @param {number[]} values Raw values.
 * @param {number} q Quantile in (0, 1].
 * @returns {number|null}
 */
export function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

// ───────────────────────────────────────────────────────────────────
// 6. BACKEND PROCESS HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped, and a missing path, a directory or a file
 * that cannot be executed is not a match.
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string|null}
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
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads stdin to EOF. A spawn error is code 127 with the
 * message as stderr.
 * @param {string} file Executable to spawn.
 * @param {string[]} args Arguments after the executable.
 * @param {string} stdinText Text written to stdin, then closed.
 * @param {Record<string, string|undefined>} env Child environment.
 * @param {number} timeoutMs Kill and resolve after this many milliseconds.
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
 * Probability of one noul answer. A body that does not parse, or a noul that
 * is not a finite number in [0, 1], is an unmeasured call, not a crash.
 * @param {string} stdout Raw stdout of one noul call.
 * @returns {number|null}
 */
function parseNoul(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  const value = parsed?.answers?.answer?.noul;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) return null;
  return value;
}

// ───────────────────────────────────────────────────────────────────
// 7. JEV ARM
// ───────────────────────────────────────────────────────────────────

// The gate reads the pinned version and the credential the binary resolves
// itself; the arm asks every row three times so a flip rate can be read from
// the repeated answers, and every call carries the same provider.

/** Pinned jev version the gate accepts. */
export const JEV_VERSION = 'jev 0.6.2';

/** Maximum calls per row; only a borderline screen uses all three. */
export const JEV_RERUNS = 3;

/** Wait behind the one retry an exit 4 earns. */
export const BACKOFF_MS = 2000;

/**
 * Identity line, then the pinned version and a credential check. A miss prints
 * a skip line and leaves the census text already written.
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number }} ctx Line writer, environment and per-call timeout.
 * @returns {{ passed: boolean, path: string|null, provider: string, reason?: string }} True when the gate passed; a failed gate carries the skip line it printed.
 */
export function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const path = which('jev', ctx.env);
  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
  if (path === null) {
    const skipLine = 'jev arm skipped: jev not on PATH';
    ctx.out(skipLine);
    return { passed: false, path, provider, reason: skipLine };
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
    const skipLine = 'jev arm skipped: version';
    ctx.out(skipLine);
    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
    return { passed: false, path, provider, reason: skipLine };
  }

  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = 'jev arm skipped: no credential';
    ctx.out(skipLine);
    return { passed: false, path, provider, reason: skipLine };
  }
  return { passed: true, path, provider };
}

/**
 * The model that answered one call: the transport outcome's own name when it
 * carries one, else the fallback the caller passes.
 * @param {{ model?: unknown }} call Transport outcome.
 * @param {string} fallback Name used when the outcome carries none.
 * @returns {string}
 */
function answeringModel(call, fallback) {
  return typeof call.model === 'string' && call.model !== '' ? call.model : fallback;
}

/**
 * Token usage an answer's payload carries, or null when it carries none.
 * @param {string} stdout Raw stdout of one call.
 * @returns {object|null}
 */
function payloadUsage(stdout) {
  let usage;
  try {
    usage = JSON.parse(stdout)?.usage;
  } catch {
    return null;
  }
  return usage !== null && typeof usage === 'object' && !Array.isArray(usage) ? usage : null;
}

/**
 * Screen each labeled claim once and rerun only scores in the adaptive band.
 * A row's flag uses its lowest probability while its modal flag and dissent
 * count remain available for reporting. A stop leaves the column unprinted.
 * @param {{ rows: Array<object>, windows: Map<string, { sentence: string, claim?: string, windowText: string }>, labelsSha: string }} plan
 * @param {{ path: string, provider: string }} gate Passing jevGate result.
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, backoffMs: number, callLog: { append: (record: object) => void }, stored: object|null, classify?: Function }} ctx Line writer, environment, timeout, retry wait, the call log, an earlier run's report and an optional classifier seam that defaults to the transport's call.
 * @returns {Promise<{ column: object, outcomes: Array<object> } | { stopped: string, partialRows: number }>}
 */
export async function runJevArm(plan, gate, ctx) {
  const labeled = plan.rows.filter((row) => row.verdict !== null && row.verdict !== undefined);
  const classify = ctx.classify ?? spawnClassifierCall;
  const ready = [];
  let chars = 0;
  for (const row of labeled) {
    const entry = plan.windows.get(row.id);
    // Main validates the selected claim unit and window hashes before this arm.
    const claim = entry?.claim ?? entry?.sentence ?? '';
    if (entry === undefined || claim === '' || entry.windowText === '') continue;
    const state = JSON.stringify({ claim, target: row.target, window: entry.windowText });
    ready.push({ row, state });
    chars += state.length + INSTRUCTION.length;
  }
  const K = labeled.length;
  const identity = measurementIdentity(labeled);
  const maxChars = chars * JEV_RERUNS;
  ctx.out(`jev: payload: committed skill-doc claims and tracked-file windows; planned calls: ${ready.length} screening + up to ${ready.length * (JEV_RERUNS - 1)} adaptive + 1 auth; estimated input tokens (max): ${Math.ceil(maxChars / 4)}`);

  const wallTimes = [];
  let finished = 0;

  const stop = (line) => {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  };

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
  wallTimes.push(auth.wallMs);
  let model = 'unknown';
  if (auth.code === 0) {
    let parsed;
    try {
      parsed = JSON.parse(auth.stdout);
    } catch {
      // A body that does not parse leaves the model unknown.
    }
    if (typeof parsed?.model === 'string') model = parsed.model;
  }
  ctx.callLog.append({
    rowId: null,
    rerun: null,
    wallMs: auth.wallMs,
    exitCode: auth.code,
    backend: 'jev',
    probability: null,
    flag: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jevVersion: '0.6.2',
    provider: gate.provider,
    model,
  });
  if (auth.code !== 0) {
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    return stop('jev arm stopped: auth test failed');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  const answers = new Map();
  const answeredBy = new Set();
  for (const { row, state } of ready) {
    const callArgs = ['noul', '--provider', gate.provider, '-q', INSTRUCTION];
    const reruns = [];
    let stopLine = null;
    let rerunLimit = 1;

    for (let rerun = 0; rerun < rerunLimit; rerun += 1) {
      let call = await classify({
        file: gate.path,
        args: callArgs,
        stdin: state,
        env: ctx.env,
        timeoutMs: ctx.timeoutMs,
        report: ctx.out,
      });
      wallTimes.push(call.wallMs);

      if (!call.timedOut && call.code === 4) {
        ctx.callLog.append({
          rowId: row.id,
          rerun,
          wallMs: call.wallMs,
          exitCode: call.code,
          backend: 'jev',
          transport: call.transport,
          probability: null,
          flag: null,
          status: 'unmeasured',
          jevVersion: '0.6.2',
          provider: gate.provider,
          model: answeringModel(call, model),
          usage: payloadUsage(call.stdout),
        });
        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
        call = await classify({
          file: gate.path,
          args: callArgs,
          stdin: state,
          env: ctx.env,
          timeoutMs: ctx.timeoutMs,
          report: ctx.out,
        });
        wallTimes.push(call.wallMs);
      }

      let probability = null;
      let flag = null;
      let status = 'unmeasured';
      if (call.timedOut) {
        status = 'unmeasured_timeout';
      } else if (call.code === 0) {
        probability = parseNoul(call.stdout);
        if (probability !== null) {
          flag = probability < FLAG_THRESHOLD;
          status = 'measured';
          answeredBy.add(answeringModel(call, model));
        }
      } else if (call.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (call.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (call.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
      }

      ctx.callLog.append({
        rowId: row.id,
        rerun,
        wallMs: call.wallMs,
        exitCode: call.code,
        backend: 'jev',
        transport: call.transport,
        probability,
        flag,
        status,
        jevVersion: '0.6.2',
        provider: gate.provider,
        model: answeringModel(call, model),
        usage: payloadUsage(call.stdout),
      });
      if (stopLine !== null) return stop(stopLine);
      reruns.push({ probability, flag, measured: status === 'measured' });
      if (rerun === 0 && status === 'measured'
        && probability >= ADAPTIVE_RERUN_MIN && probability <= ADAPTIVE_RERUN_MAX) {
        rerunLimit = JEV_RERUNS;
      }
    }

    answers.set(row.id, reruns);
    finished += 1;
  }

  // The column names every model that answered a measured call, so a route
  // switch between runs reads as a model change; the auth probe's name stands
  // in only when no call was measured.
  const columnModel = answeredBy.size === 0 ? model : [...answeredBy].sort().join('+');
  const emptyCounts = () => ({ K: 0, M: 0, A: 0, B: 0, W: 0, L: 0, TP: 0, FP: 0, F: 0 });
  const totals = emptyCounts();
  totals.K = K;
  const kinds = { live: emptyCounts(), constructed: emptyCounts() };
  for (const row of labeled) {
    if (Object.hasOwn(kinds, row.kind)) kinds[row.kind].K += 1;
  }
  // B counts the comparator that won the baseline on these labels, so the margin
  // is read against the same method the zero-call run printed.
  const { baselineMethod } = scoreComparators(labeled, plan.windows);
  const scored = [];
  const outcomes = [];
  for (const row of labeled) {
    const entry = plan.windows.get(row.id);
    const reruns = answers.get(row.id) ?? [];
    const measured = reruns.length > 0 && reruns.every((rerun) => rerun.measured);
    if (!measured) {
      outcomes.push({
        id: row.id,
        kind: row.kind ?? null,
        verdict: row.verdict,
        measured: false,
        probabilities: reruns.map((rerun) => rerun.probability),
        minimumProbability: null,
        modalFlag: null,
        flagged: null,
      });
      continue;
    }
    const votes = reruns.filter((rerun) => rerun.flag === true).length;
    const top = Math.max(votes, reruns.length - votes);
    const modalFlag = votes > reruns.length / 2;
    const minimumProbability = Math.min(...reruns.map((rerun) => rerun.probability));
    const flagged = minimumProbability < FLAG_THRESHOLD;
    const dissent = reruns.length - top;
    const kindCounts = Object.hasOwn(kinds, row.kind) ? kinds[row.kind] : undefined;
    const targetCounts = [totals, kindCounts].filter((counts) => counts !== undefined);
    for (const counts of targetCounts) {
      counts.M += 1;
      counts.F += dissent;
    }
    const drifted = row.verdict !== 'supports';
    if (flagged && drifted) targetCounts.forEach((counts) => { counts.TP += 1; });
    if (flagged && !drifted) targetCounts.forEach((counts) => { counts.FP += 1; });
    const modelRight = flagged === drifted;
    const comparatorRight = baselineMethod === 'flag-nothing'
      ? !drifted
      : entry !== undefined && flagByIdentifierOverlap(entry.sentence, entry.windowText, row.target) === drifted;
    if (modelRight) targetCounts.forEach((counts) => { counts.A += 1; });
    if (comparatorRight) targetCounts.forEach((counts) => { counts.B += 1; });
    if (modelRight && !comparatorRight) targetCounts.forEach((counts) => { counts.W += 1; });
    if (!modelRight && comparatorRight) targetCounts.forEach((counts) => { counts.L += 1; });
    outcomes.push({
      id: row.id,
      kind: row.kind ?? null,
      verdict: row.verdict,
      measured: true,
      probabilities: reruns.map((rerun) => rerun.probability),
      minimumProbability,
      modalFlag,
      flagged,
    });
    const meanProbability = reruns.reduce((sum, rerun) => sum + rerun.probability, 0) / reruns.length;
    scored.push({ probability: meanProbability, actual: drifted ? 0 : 1 });
  }

  const { M, A, B, W, L, TP, FP, F } = totals;
  const { verdict, p } = decideVerdict({ backend: 'jev', K, M, A, B, W, L, TP, FP, F });
  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
  ctx.out(`column jev: rows=${K} measured=${M} unmeasured=${K - M} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
  for (const [kind, counts] of Object.entries(kinds)) {
    ctx.out(`column jev.${kind}: rows=${counts.K} measured=${counts.M} unmeasured=${counts.K - counts.M} A=${counts.A} B=${counts.B} W=${counts.W} L=${counts.L} TP=${counts.TP} FP=${counts.FP}`);
  }
  const liveSign = binomialTail(kinds.live.W, kinds.live.W + kinds.live.L);
  ctx.out(`sign test jev.live: W=${kinds.live.W} L=${kinds.live.L} p=${liveSign.p.toPrecision(4)}`);
  const brier = brierScore(scored);
  ctx.out(`brier jev: ${brier === null ? 'none' : brier.toFixed(4)}`);

  const line = verdictLine(
    {
      backend: 'jev', verdict, K, M, A, B, W, L, TP, FP, F, p,
      stored: ctx.stored,
      provider: gate.provider,
      model: columnModel,
      instructionSha256: identity.instructionSha256,
      keepRuleSha256: identity.keepRuleSha256,
      rowSetSha256: identity.rowSetSha256,
    },
    plan.labelsSha,
    `jev_version=0.6.2 provider=${gate.provider} model=${columnModel}`,
  );
  for (const text of line.split('\n')) ctx.out(text);

  return {
    column: {
      backend: 'jev',
      verdict,
      K,
      M,
      A,
      B,
      W,
      L,
      TP,
      FP,
      F,
      p,
      latency,
      jevVersion: '0.6.2',
      provider: gate.provider,
      model: columnModel,
      authModel: model,
      instructionSha256: identity.instructionSha256,
      keepRuleSha256: identity.keepRuleSha256,
      rowSetSha256: identity.rowSetSha256,
      live: { ...kinds.live },
      constructed: { ...kinds.constructed },
      liveSignTest: { W: kinds.live.W, L: kinds.live.L, p: liveSign.p },
      line,
    },
    outcomes,
  };
}

// ───────────────────────────────────────────────────────────────────
// 8. ADVISORY CHECK
// ───────────────────────────────────────────────────────────────────

// Doc validation runs this check on the documents it validates. It never
// blocks: a missing tool, credential or citation is silence, and the caller
// ignores the exit code.

/**
 * The advisory's own switch. Setting it to 0 skips the check entirely, as do
 * the shared JEV_FEATURES master switch and the older SKDOC_CITE_DRIFT_CHECK
 * name the feature table still honors.
 */
export const ADVISE_OPT_OUT_ENV = 'JEV_FEATURE_CITE_DRIFT';

/** Every advisory line starts with this, so a caller can forward only these. */
export const ADVISE_PREFIX = 'cite-drift advisory:';

/** Citations one advisory run asks about at most; the rest count as unchecked. */
export const ADVISE_MAX_CITATIONS = 20;

/** Wall budget for one advisory run's model calls. */
export const ADVISE_BUDGET_MS = 60000;

/**
 * The jev binary and provider when the pinned version answers and a credential
 * is stored, else null. Prints nothing.
 * @param {Record<string, string|undefined>} env
 * @param {number} timeoutMs
 * @returns {{ path: string, provider: string }|null}
 */
function adviseGate(env, timeoutMs) {
  const provider = env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', env);
  if (jevPath === null) return null;
  const opts = { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: timeoutMs };
  const version = spawnSync(jevPath, ['--version'], opts);
  if ((version.stdout ?? '').trim().split('\n')[0] !== JEV_VERSION) return null;
  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
  return auth.status === 0 ? { path: jevPath, provider } : null;
}

/**
 * In-range citations in the prose of the given documents, read from the
 * working tree, each with its resolved target. A document outside the
 * repository resolves its citations from the repository root.
 * @param {string[]} docs Document paths as the caller gave them.
 * @param {string} repoRoot
 * @param {Set<string>} tracked
 * @param {{ extractCitations: Function, resolveCitation: Function }} helpers Citation scanner the host injects.
 * @returns {Array<object>}
 */
function adviseCitations(docs, repoRoot, tracked, { extractCitations, resolveCitation }) {
  const found = [];
  for (const doc of docs) {
    const absolute = path.resolve(doc);
    let text;
    try {
      text = fs.readFileSync(absolute, 'utf8');
    } catch {
      continue;
    }
    const relative = path.relative(repoRoot, absolute);
    const inside = relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
    const docPath = inside ? relative.split(path.sep).join('/') : absolute;
    const parts = docPath.split('/');
    const skillRoot = inside && parts[0] === '.skilled' && parts[1] === 'skills' && parts.length > 3
      ? `.skilled/skills/${parts[2]}`
      : null;
    for (const citation of extractCitations(text, docPath)) {
      const { status, path: resolved } = resolveCitation(citation, { tracked, repoRoot, skillRoot });
      if (status === 'in_range' && resolved !== null) found.push({ ...citation, path: resolved });
    }
  }
  return found;
}

/**
 * The working-tree lines around one cited line, clamped to the file.
 * @param {string} repoRoot
 * @param {string} target Repo-relative tracked path.
 * @param {number} line Cited line, 1-based.
 * @returns {string} Empty when the file cannot be read.
 */
function adviseWindow(repoRoot, target, line) {
  let text;
  try {
    text = fs.readFileSync(path.join(repoRoot, target), 'utf8');
  } catch {
    return '';
  }
  const lines = text.split(/\r?\n/);
  if (lines[lines.length - 1] === '') lines.pop();
  const start = Math.max(1, line - WINDOW_RADIUS_LINES);
  const end = Math.min(lines.length, line + WINDOW_RADIUS_LINES);
  return start > end ? '' : lines.slice(start - 1, end).join('\n');
}

/**
 * Asks Jev about each in-range citation of the given documents with the
 * measured protocol: one screening call, two more only when the first score
 * sits in the adaptive band, and a flag when the lowest score falls below the
 * threshold. The claim is the citing line, as in the measured labels. Prints
 * one line per flagged citation and a summary line, each under ADVISE_PREFIX,
 * and nothing at all when no citation is in range or the gate fails.
 * @param {string[]} docs Document paths as the caller gave them.
 * @param {{ repoRoot: string, out: (line: string) => void, env: Record<string, string|undefined>, timeoutMs: number, callLog: { append: (record: object) => void }, extractCitations: Function, resolveCitation: Function, listTrackedFiles: Function, classify?: Function }} ctx
 *   Line writer, environment, per-call timeout, the call log, the citation
 *   scanner and tracked-file list the host injects, and an optional stand-in
 *   for the transport's call.
 * @returns {Promise<number>} Always 0.
 */
export async function runAdvise(docs, ctx) {
  if (!featureSwitch('cite-drift', ctx.env).enabled) return 0;
  let citations;
  try {
    citations = adviseCitations(docs, ctx.repoRoot, ctx.listTrackedFiles(ctx.repoRoot), ctx);
  } catch {
    return 0;
  }
  if (citations.length === 0) return 0;
  const gate = adviseGate(ctx.env, ctx.timeoutMs);
  if (gate === null) return 0;

  const classify = ctx.classify ?? spawnClassifierCall;
  const deadline = Date.now() + ADVISE_BUDGET_MS;
  const flagged = [];
  let checked = 0;
  let stopped = false;
  for (const citation of citations.slice(0, ADVISE_MAX_CITATIONS)) {
    if (stopped) break;
    const windowText = adviseWindow(ctx.repoRoot, citation.path, citation.targetLine);
    if (windowText === '') continue;
    const state = JSON.stringify({ claim: citation.sentence, target: citation.path, window: windowText });
    const probabilities = [];
    let rerunLimit = 1;
    for (let rerun = 0; rerun < rerunLimit; rerun += 1) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        stopped = true;
        break;
      }
      const call = await classify({
        file: gate.path,
        args: ['noul', '--provider', gate.provider, '-q', INSTRUCTION],
        stdin: state,
        env: ctx.env,
        timeoutMs: Math.min(ctx.timeoutMs, remaining),
        report: () => {},
      });
      const probability = !call.timedOut && call.code === 0 ? parseNoul(call.stdout) : null;
      let status = 'measured';
      if (probability === null) status = call.timedOut ? 'unmeasured_timeout' : 'unmeasured';
      ctx.callLog.append({
        mode: 'advise',
        doc: citation.doc,
        docLine: citation.line,
        target: citation.path,
        targetLine: citation.targetLine,
        rerun,
        wallMs: call.wallMs,
        exitCode: call.code,
        backend: 'jev',
        transport: call.transport,
        probability,
        flag: probability === null ? null : probability < FLAG_THRESHOLD,
        status,
        jevVersion: '0.6.2',
        provider: gate.provider,
        model: answeringModel(call, 'unknown'),
        usage: payloadUsage(call.stdout),
      });
      // A usage error, a rejected key or an interrupt ends the run; any other
      // miss leaves only this citation unchecked.
      if (call.code === 2 || call.code === 3 || call.code === 130) {
        stopped = true;
        break;
      }
      if (probability === null) break;
      probabilities.push(probability);
      if (rerun === 0 && probability >= ADAPTIVE_RERUN_MIN && probability <= ADAPTIVE_RERUN_MAX) {
        rerunLimit = JEV_RERUNS;
      }
    }
    if (probabilities.length === 0 || probabilities.length < rerunLimit) continue;
    checked += 1;
    const lowest = Math.min(...probabilities);
    if (lowest < FLAG_THRESHOLD) flagged.push({ citation, lowest });
  }
  for (const { citation, lowest } of flagged) {
    ctx.out(`${ADVISE_PREFIX} ${citation.doc}:${citation.line} cites ${citation.path}:${citation.targetLine}, whose window may no longer show the claim (p_yes=${lowest.toFixed(2)})`);
  }
  ctx.out(`${ADVISE_PREFIX} checked=${checked} flagged=${flagged.length} unchecked=${citations.length - checked} (never blocks; ${ADVISE_OPT_OUT_ENV}=0 skips it)`);
  return 0;
}
