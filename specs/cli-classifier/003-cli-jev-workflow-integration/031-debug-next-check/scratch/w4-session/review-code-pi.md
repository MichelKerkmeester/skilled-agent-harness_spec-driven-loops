# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (DeepSeek V4.1 Flash). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
- `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-build/rulings.md` (rulings override the design) and `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md). This review covers the code only; the docs are reviewed separately. Every code step, including the session's fix briefs, was written by DeepSeek; review the whole of both files. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

## What to look for

- Correctness against each requirement in the phase `spec.md`.
- Dormancy (parent D1): with neither Jev nor Deem available, behavior is exactly today's. A Jev arm runs only behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0. A Deem arm runs only behind `--deem` after `cli-deem health` passes. Either failing prints one skip line and changes nothing.
- The zero-call first slice runs with no model call.
- The keep rule is fixed in code before any run: coverage, a margin over the baseline, an exact one-sided sign test at 0.05, a flip bound, and one verdict line `verdict <backend>: keep|kill|stop (...)`. Check the sign test arithmetic on one case by hand.
- Label gate: where the scorer needs operator labels, it prints `stop: fewer than N labeled rows` and no label file was written by a model.
- Secrets: no key, token or `.env` read, and no request that sends one. Jev gets no secret.
- Comment hygiene: no spec path, packet or phase number, REQ, task, ADR or finding id in a code comment.
- Tests: happy path plus one edge case per public surface, stubbed backends for both arms, and no test that asserts nothing or mirrors the implementation.
- Docs: each changed skill doc says what the code does, no more, and names the switches and the gate as the code spells them.

Skip style nits a formatter would settle.

## Severity

- P0: wrong behavior, data loss, a secret leak or a broken build.
- P1: a requirement not met, a missing edge case the spec names, a test gap on a changed public surface, dormancy broken, or a doc that states something the code does not do.
- P2: everything else worth fixing.

## Report (under 400 words)

One line per finding: `P0|P1|P2 file:line - what is wrong - the concrete input or state that shows it`. Then one line per requirement: `REQ-xxx met|not met|not checked - why`. End with exactly one line `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.

## Appendix: the diff under review

```diff
diff --git a/.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs b/.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
new file mode 100644
index 0000000000..bf43e472bd
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
@@ -0,0 +1,1564 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Debug Next Check Scorer
+// ───────────────────────────────────────────────────────────────────
+// Measures offline whether a model choice of the cheapest next check for a debug
+// hypothesis beats the best constant answer on operator-labeled rows. The census
+// prints counts and repository paths only, never transcript text, and makes no
+// model call until an arm switch is set and its gate passes.
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+import { spawn, spawnSync } from 'node:child_process';
+import { createHash } from 'node:crypto';
+import {
+  accessSync,
+  appendFileSync,
+  constants as fsConstants,
+  existsSync,
+  mkdirSync,
+  readFileSync,
+  realpathSync,
+  statSync,
+  writeFileSync,
+} from 'node:fs';
+import { basename, delimiter, dirname, join, resolve } from 'node:path';
+import { fileURLToPath } from 'node:url';
+import { parseArgs } from 'node:util';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Repository root, six levels above this file: scripts/<name>/ -> scripts ->
+ * runtime -> system-spec-kit -> skills -> .skilled -> repository. Resolving from
+ * the script path keeps every git command independent of the current directory.
+ */
+const REPO_ROOT = resolve(
+  dirname(fileURLToPath(import.meta.url)),
+  '..',
+  '..',
+  '..',
+  '..',
+  '..',
+  '..',
+);
+
+/** The vendored choice key this census looks for outside the spec tree. */
+const SEAM_PATTERN = 'next_check';
+
+/**
+ * Generated trigger-phrase fixtures mirror spec phrasing, so searching them would
+ * make the seam search find this project's own vocabulary instead of a caller.
+ */
+const SEAM_FIXTURES = ':!.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures';
+
+/** The agent's hypothesis heading, the shape a mined corpus row would have. */
+const HYPOTHESIS_PATTERN = '^### Hypothesis [0-9]';
+
+/** The four constant answers a row can be labeled with, in their fixed order. */
+const LABELS = ['read_code', 'run_test', 'reproduce', 'instrument'];
+
+/** The fixture row schema; a row carrying any other field is refused whole. */
+const FIXTURE_FIELDS = ['id', 'symptom', 'claim', 'evidence', 'label', 'jev_ok'];
+
+/** Fewer labeled rows than this floor cannot support a verdict, so no arm runs. */
+const LABEL_GATE = 30;
+
+/** The three left rotations of the option list; a pick is stable only when all of them agree. */
+const ORDERS = 3;
+
+/** Pinned jev version the gate accepts. */
+const JEV_VERSION = 'jev 0.6.2';
+
+/** Pinned Deem model name the health check accepts. */
+const DEEM_MODEL = 'deem-0.8-v1';
+
+/** Deem p50 latency in milliseconds, used to estimate arm wall time. */
+const DEEM_P50_MS = 65.6;
+
+/** Health probe bound; cli-deem answers within its own shorter request timeout. */
+const HEALTH_TIMEOUT_MS = 10000;
+
+/** Bounds one backend call; past it the call is unmeasured_timeout, not a stop. */
+const CALL_TIMEOUT_MS = 90000;
+
+/** Wait before the single retry of a call that exited 4. */
+const BACKOFF_MS = 2000;
+
+/** The keep rule, fixed before the first model call and stored with every report. */
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M>=9*K, kill P(X>=L)<0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M';
+
+/** The question each choice call answers; fixed before any call so a change is an amendment. */
+const CHOICE_QUESTION = 'What is the cheapest way to confirm or rule out this hypothesis?';
+
+/** The four next-check options in their fixed list order, verbatim from the caller's catalog. */
+const NEXT_CHECK_OPTIONS = [
+  ['read_code', 'Reading more of the existing code settles it, no execution needed'],
+  ['run_test', 'An existing test or a quick one-off run settles it'],
+  ['reproduce', 'It needs a reproduction of the failing scenario'],
+  ['instrument', 'It needs new logging or instrumentation before anything can be seen'],
+];
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. GIT HELPERS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Runs git in the given repository and returns its non-empty stdout lines. Every
+ * search here treats a non-zero exit as no result: git grep exits 1 when nothing
+ * matches, and a repository without the searched path answers the same way.
+ *
+ * @param {string} root - Repository root.
+ * @param {string[]} args - Arguments after the git binary.
+ * @returns {string[]} Output lines, empty when git produced none.
+ */
+function runGitLines(root, args) {
+  const result = spawnSync('git', ['-C', root, ...args], {
+    encoding: 'utf8',
+    maxBuffer: 64 * 1024 * 1024,
+  });
+  if (result.status !== 0 || result.stdout === null) {
+    return [];
+  }
+  return result.stdout.split('\n').filter((line) => line !== '');
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. SEAM SEARCH
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Lists tracked files outside the spec tree that name the next-check choice.
+ * A hit is a potential caller seam; an empty list is the closed result the
+ * census must be able to print.
+ *
+ * @param {string} root - Repository root.
+ * @returns {string[]} Repository-relative hit paths, sorted.
+ */
+export function seamSearch(root) {
+  const hits = runGitLines(root, ['grep', '-l', SEAM_PATTERN, '--', ':!specs', SEAM_FIXTURES]);
+  return hits.sort();
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. MINED CORPUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Counts what the repository itself can contribute to the corpus: tracked
+ * debug-delegation files outside the template tree, tracked spec files holding a
+ * numbered hypothesis heading, and those headings. The headings are counted in
+ * markdown under `specs/` in one pass. Zero is a result here, not an error: it
+ * shows the operator's fixture is the only corpus available.
+ *
+ * @param {string} root - Repository root.
+ * @returns {{ debugDelegation: number, hypothesisFiles: number, rows: number }}
+ *   Source file and heading counts.
+ */
+export function minedCorpus(root) {
+  const delegation = runGitLines(root, ['ls-files', '--', '*debug-delegation.md']).filter(
+    (path) => !path.split('/').includes('templates'),
+  );
+  const hypothesisCounts = runGitLines(root, [
+    'grep',
+    '-cE',
+    HYPOTHESIS_PATTERN,
+    '--',
+    'specs/*.md',
+  ]);
+  const rows = hypothesisCounts.reduce(
+    (sum, line) => sum + Number(line.slice(line.lastIndexOf(':') + 1)),
+    0,
+  );
+  return {
+    debugDelegation: delegation.length,
+    hypothesisFiles: hypothesisCounts.length,
+    rows,
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. REPOSITORY PATH GUARD
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The path with every resolvable prefix followed through symlinks and any
+ * missing tail kept as written. A symlink above the path could otherwise let
+ * an inside file present an outside name.
+ *
+ * @param {string} inputPath - Path to canonicalize.
+ * @returns {string} The resolved path.
+ */
+function canonicalizeExistingPrefix(inputPath) {
+  const missing = [];
+  let current = resolve(inputPath);
+  while (!existsSync(current)) {
+    const parent = dirname(current);
+    if (parent === current) {
+      break;
+    }
+    missing.unshift(basename(current));
+    current = parent;
+  }
+  return resolve(realpathSync(current), ...missing);
+}
+
+/**
+ * Whether a path resolves to the repository root or a path below it. Device
+ * and inode decide containment, so a name trick or a symlink above the path
+ * cannot disguise a file that lives inside the repository.
+ *
+ * @param {string} root - Repository root.
+ * @param {string} candidate - Path to test.
+ * @returns {boolean} True when the resolved path stays inside the repository.
+ */
+export function isInsideRepository(root, candidate) {
+  const rootStats = statSync(canonicalizeExistingPrefix(root));
+  let current = canonicalizeExistingPrefix(candidate);
+  while (true) {
+    if (existsSync(current)) {
+      const stats = statSync(current);
+      if (stats.dev === rootStats.dev && stats.ino === rootStats.ino) {
+        return true;
+      }
+    }
+    const parent = dirname(current);
+    if (parent === current) {
+      return false;
+    }
+    current = parent;
+  }
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. FIXTURE READER
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parses the fixture lines and validates every row against the schema. A
+ * refusal names the physical line and the row id, so the operator can fix that
+ * one row without guessing which one the scorer rejected.
+ *
+ * @param {string} text - Fixture file contents.
+ * @returns {object[]} Validated rows.
+ */
+function parseFixtureRows(text) {
+  const rows = [];
+  const seen = new Set();
+  text.split('\n').forEach((line, index) => {
+    if (line.trim() === '') {
+      return;
+    }
+    const rowNumber = index + 1;
+    let parsed;
+    try {
+      parsed = JSON.parse(line);
+    } catch {
+      throw new Error(`fixture row ${rowNumber}: not JSON`);
+    }
+    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
+      throw new Error(`fixture row ${rowNumber}: not a JSON object`);
+    }
+    if (typeof parsed.id !== 'string' || parsed.id === '') {
+      throw new Error(`fixture row ${rowNumber}: id must be a non-empty string`);
+    }
+    const where = `fixture row ${rowNumber} (id=${parsed.id})`;
+    const missing = FIXTURE_FIELDS.filter((field) => !Object.hasOwn(parsed, field));
+    if (missing.length > 0) {
+      throw new Error(`${where}: missing field ${missing.join(', ')}`);
+    }
+    const extra = Object.keys(parsed).filter((field) => !FIXTURE_FIELDS.includes(field));
+    if (extra.length > 0) {
+      throw new Error(`${where}: unknown field ${extra.join(', ')}`);
+    }
+    if (seen.has(parsed.id)) {
+      throw new Error(`${where}: duplicate id`);
+    }
+    if (!LABELS.includes(parsed.label)) {
+      const label = JSON.stringify(parsed.label);
+      throw new Error(`${where}: label ${label} is not one of ${LABELS.join(', ')}`);
+    }
+    for (const field of ['symptom', 'claim', 'evidence']) {
+      if (typeof parsed[field] !== 'string') {
+        throw new Error(`${where}: ${field} must be a string`);
+      }
+    }
+    if (typeof parsed.jev_ok !== 'boolean') {
+      throw new Error(`${where}: jev_ok must be a boolean`);
+    }
+    seen.add(parsed.id);
+    rows.push({
+      id: parsed.id,
+      symptom: parsed.symptom,
+      claim: parsed.claim,
+      evidence: parsed.evidence,
+      label: parsed.label,
+      jev_ok: parsed.jev_ok,
+    });
+  });
+  return rows;
+}
+
+/**
+ * The fixture digest, so a report can be matched to the exact labeled rows a
+ * run scored without storing any row text.
+ *
+ * @param {string} text - Fixture file contents.
+ * @returns {string} Lowercase hex SHA-256.
+ */
+function sha256Hex(text) {
+  return createHash('sha256').update(text, 'utf8').digest('hex');
+}
+
+/**
+ * Reads the operator's JSON Lines fixture from outside the repository. A path
+ * inside, an unreadable file or a row that breaks the schema refuses the whole
+ * run before any line prints or any call starts.
+ *
+ * @param {string} file - Fixture path as the operator typed it.
+ * @param {string} root - Repository root the fixture must stay outside of.
+ * @returns {{ ok: boolean, message?: string, rows?: object[], sha256?: string,
+ *   counts?: Record<string, number> }} Parsed rows, their digest and label
+ *   counts, or the refusal message.
+ */
+export function readFixture(file, root) {
+  if (isInsideRepository(root, file)) {
+    return { ok: false, message: 'refused: fixture path inside the repository' };
+  }
+  let text;
+  try {
+    text = readFileSync(file, 'utf8');
+  } catch (error) {
+    return { ok: false, message: error instanceof Error ? error.message : String(error) };
+  }
+  let rows;
+  try {
+    rows = parseFixtureRows(text);
+  } catch (error) {
+    return { ok: false, message: error instanceof Error ? error.message : String(error) };
+  }
+  const counts = {};
+  for (const label of LABELS) {
+    counts[label] = rows.filter((row) => row.label === label).length;
+  }
+  return { ok: true, rows, sha256: sha256Hex(text), counts };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. CONSTANT BASELINES
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Counts how many labeled rows each constant answer gets right. A constant that
+ * always answers one key scores exactly on the rows carrying that key, so these
+ * counts are the accuracies a backend has to beat before it is worth calling.
+ *
+ * @param {object[]} rows - Validated fixture rows.
+ * @returns {Record<string, number>} Right count per constant, keyed by LABELS.
+ */
+export function constantAccuracies(rows) {
+  const counts = {};
+  for (const label of LABELS) {
+    counts[label] = rows.filter((row) => row.label === label).length;
+  }
+  return counts;
+}
+
+/**
+ * Picks the strongest constant answer. A tie goes to the earlier key in the
+ * fixed order, so a tie lands on read_code, the cheapest answer this
+ * measurement exists to beat.
+ *
+ * @param {Record<string, number>} counts - Right count per constant.
+ * @returns {{ key: string, right: number }} Best constant and its right count.
+ */
+export function chooseBaseline(counts) {
+  let best = { key: LABELS[0], right: counts[LABELS[0]] };
+  for (const label of LABELS) {
+    if (counts[label] > best.right) {
+      best = { key: label, right: counts[label] };
+    }
+  }
+  return best;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. PAYLOAD GATE AND CALL LOG
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Splits labeled rows by the operator's payload mark. A row marked `jev_ok`
+ * holds debug notes already stripped of secrets and may go to Jev; every other
+ * row stays home. Keeping the decision in one place means a withheld row cannot
+ * reach a call by accident.
+ *
+ * @param {object[]} rows - Validated fixture rows.
+ * @returns {{ accepted: object[], withheld: object[] }} Rows Jev may read and rows held back.
+ */
+export function payloadSplit(rows) {
+  return {
+    accepted: rows.filter((row) => row.jev_ok === true),
+    withheld: rows.filter((row) => row.jev_ok !== true),
+  };
+}
+
+/**
+ * One JSON-line record per model call under outDir. A missing or empty outDir
+ * keeps no records, so nothing is created. The file appears on the first
+ * append, so a run that makes no call leaves no log behind.
+ *
+ * @param {string | null} outDir - Directory that holds calls.jsonl.
+ * @returns {{ append: (record: object) => void }} Append-only call log.
+ */
+export function createCallLog(outDir) {
+  let created = false;
+  return {
+    append(record) {
+      if (typeof outDir !== 'string' || outDir === '') return;
+      const filePath = join(outDir, 'calls.jsonl');
+      if (!created) {
+        mkdirSync(outDir, { recursive: true });
+        writeFileSync(filePath, '');
+        created = true;
+      }
+      appendFileSync(filePath, `${JSON.stringify(record)}\n`);
+    },
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. JEV GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The gate runs only behind --jev and only while a labeled fixture keeps
+// headroom. It reads no key and passes none: jev resolves its own credential,
+// so a skipped arm still writes no file and a passing one keeps the report
+// honest.
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped. A missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ *
+ * @param {string} name - Executable file name.
+ * @param {{ PATH?: string }} env - Environment whose PATH is searched.
+ * @returns {string | null} First executable match, or null when none is executable.
+ */
+export function which(name, env) {
+  for (const dir of (env.PATH ?? '').split(delimiter)) {
+    if (dir.length === 0) continue;
+    const candidate = join(dir, name);
+    try {
+      if (statSync(candidate).isFile()) {
+        accessSync(candidate, fsConstants.X_OK);
+        return candidate;
+      }
+    } catch {
+      continue;
+    }
+  }
+  return null;
+}
+
+/**
+ * Identity line, then the pinned version and a credential check. A miss prints
+ * a skip line and leaves the census text already written.
+ *
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number
+ * }} ctx Line writer, environment and per-call timeout.
+ * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }}
+ *   True when the gate passed; a failed gate carries the skip line it printed.
+ */
+export function jevGate(ctx) {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const path = which('jev', ctx.env);
+  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
+  if (path === null) {
+    const skipLine = 'jev arm skipped: jev not on PATH';
+    ctx.out(skipLine);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+
+  const opts = {
+    env: ctx.env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: ctx.timeoutMs,
+  };
+  const version = spawnSync(path, ['--version'], opts);
+  const trimmed = (version.stdout ?? '').trim();
+  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
+  if (found !== JEV_VERSION) {
+    const skipLine = 'jev arm skipped: version';
+    ctx.out(skipLine);
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+
+  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
+  if (auth.status !== 0) {
+    const skipLine = 'jev arm skipped: no credential';
+    ctx.out(skipLine);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+  return { passed: true, path, provider };
+}
+
+/**
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time, and whether the timeout fired. The timer
+ * kills the child and resolves at once, without waiting for close: a
+ * grandchild can hold the pipes open past the kill. Stdin is closed after the
+ * write because the CLI reads stdin to EOF and exits 2 on an inherited
+ * terminal. A spawn error is code 127 with the message as stderr.
+ *
+ * @param {string} file - Executable to spawn.
+ * @param {string[]} args - Arguments after the executable.
+ * @param {string} stdinText - Text written to stdin, then closed.
+ * @param {Record<string, string | undefined>} env - Child environment.
+ * @param {number} timeoutMs - Kill and resolve after this many milliseconds.
+ * @returns {Promise<{
+ *   code: number | null,
+ *   stdout: string,
+ *   stderr: string,
+ *   wallMs: number,
+ *   timedOut: boolean
+ * }>}
+ */
+export function spawnCall(file, args, stdinText, env, timeoutMs) {
+  return new Promise((resolve) => {
+    const start = Date.now();
+    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
+    let stdout = '';
+    let stderr = '';
+    let settled = false;
+
+    child.stdout.setEncoding('utf8');
+    child.stderr.setEncoding('utf8');
+    child.stdout.on('data', (chunk) => { stdout += chunk; });
+    child.stderr.on('data', (chunk) => { stderr += chunk; });
+    // A child that exits before reading stdin cannot fail the call through
+    // the pipe: its exit code is the outcome the caller needs.
+    child.stdin.on('error', () => {});
+    child.stdin.end(stdinText);
+
+    const timer = setTimeout(() => {
+      child.kill('SIGKILL');
+      settle(null, true);
+    }, timeoutMs);
+
+    function settle(code, timedOut) {
+      if (settled) return;
+      settled = true;
+      clearTimeout(timer);
+      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
+    }
+
+    child.on('close', (code) => settle(code === null ? -1 : code, false));
+    child.on('error', (error) => {
+      stderr = error.message;
+      settle(127, false);
+    });
+  });
+}
+
+/**
+ * The stdin state sent for one row: the symptom, the hypothesis under test and
+ * the evidence gathered so far, one labeled line each. The labels let the
+ * backend tell the fields apart without guessing at free text.
+ *
+ * @param {{ symptom: string, claim: string, evidence: string }} row - Validated fixture row.
+ * @returns {string} Labeled multi-line state text.
+ */
+export function stateText(row) {
+  return `Symptom: ${row.symptom}\nHypothesis: ${row.claim}\nEvidence: ${row.evidence}`;
+}
+
+/**
+ * Left rotation of the option pairs: order 0 leaves the list as given, order 1
+ * moves the first pair to the end. Rotating the list without changing any pair
+ * asks the same row once per order, so a positional preference shows up as
+ * disagreeing picks.
+ *
+ * @param {Array<[string, string]>} pairs - Option key and description pairs.
+ * @param {number} order - Places to rotate left.
+ * @returns {Array<[string, string]>} Rotated pairs.
+ */
+export function rotateOptions(pairs, order) {
+  return [...pairs.slice(order), ...pairs.slice(0, order)];
+}
+
+/**
+ * The chosen key and its probability from one choice body. A body that does
+ * not parse, a pick outside the option keys, or a missing probability is a
+ * missed measurement, not a crash.
+ *
+ * @param {string} stdout - Raw stdout of one choice call.
+ * @param {string[]} keys - Option keys the pick must be one of.
+ * @returns {{ pick: string, pickProb: number | null } | null} Parsed answer,
+ *   or null when the body carries no valid pick.
+ */
+export function parseChoiceAnswer(stdout, keys) {
+  let parsed;
+  try {
+    parsed = JSON.parse(stdout);
+  } catch {
+    return null;
+  }
+  const choice = parsed?.answers?.answer?.choice;
+  if (typeof choice !== 'string' || !keys.includes(choice)) {
+    return null;
+  }
+  const probability = parsed.answers.answer.probabilities?.[choice];
+  return { pick: choice, pickProb: typeof probability === 'number' ? probability : null };
+}
+
+/**
+ * One auth test, then one choice call per accepted row per option order, with
+ * one call-log record per spawn. Exit 4 gets one retry after the backoff,
+ * because a dropped connection is not a judgment. A stop prints its line and
+ * the rows that finished, and leaves the column and verdict unprinted.
+ *
+ * @param {{
+ *   rows: object[],
+ *   pairs: Array<[string, string]>,
+ *   question: string
+ * }} plan Accepted rows, the option pairs and the question text.
+ * @param {{ path: string, provider: string }} gate - Passing jevGate result.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   backoffMs: number,
+ *   callLog: { append: (record: object) => void }
+ * }} ctx Line writer, environment, per-call timeout, retry wait and the call log.
+ * @returns {Promise<{
+ *   stopped: string | null,
+ *   partialRows: number,
+ *   answers: Map<string, Array<string | null>>,
+ *   wallTimes: number[],
+ *   model: string
+ * }>} Collected picks and wall times, or the stop line once an arm stops.
+ */
+export async function runJevArm(plan, gate, ctx) {
+  let chars = 0;
+  for (const row of plan.rows) {
+    chars += stateText(row).length + plan.question.length;
+    for (const [key, description] of plan.pairs) {
+      chars += key.length + description.length + 1;
+    }
+  }
+  chars *= ORDERS;
+  ctx.out(`jev: payload: operator debug notes marked jev_ok; planned calls: ${ORDERS * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const wallTimes = [];
+  const answers = new Map();
+  let model = 'unknown';
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished, answers, wallTimes, model };
+  }
+
+  const auth = await spawnCall(
+    gate.path,
+    ['auth', 'test', '--provider', gate.provider],
+    '',
+    ctx.env,
+    ctx.timeoutMs,
+  );
+  wallTimes.push(auth.wallMs);
+  if (auth.code === 0) {
+    let parsed;
+    try {
+      parsed = JSON.parse(auth.stdout);
+    } catch {
+      // A body that does not parse leaves the model unknown.
+    }
+    if (typeof parsed?.model === 'string') model = parsed.model;
+  }
+  ctx.callLog.append({
+    backend: 'jev',
+    rowId: null,
+    order: null,
+    attempt: 1,
+    wallMs: auth.wallMs,
+    exitCode: auth.code,
+    pick: null,
+    pickProb: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jevVersion: JEV_VERSION,
+    provider: gate.provider,
+    model,
+  });
+  if (auth.code !== 0) {
+    if (auth.code === 3) return stop('jev arm stopped: key rejected');
+    if (auth.code === 130) return stop('jev arm stopped: interrupted');
+    return stop('jev arm stopped: auth test failed');
+  }
+  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);
+
+  const keys = plan.pairs.map(([key]) => key);
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its pick and probability stay empty and its status unmeasured.
+   */
+  function record(rowId, order, attempt, result, pick, pickProb, status) {
+    return {
+      backend: 'jev',
+      rowId,
+      order,
+      attempt,
+      wallMs: result.wallMs,
+      exitCode: result.code,
+      pick,
+      pickProb,
+      status,
+      jevVersion: JEV_VERSION,
+      provider: gate.provider,
+      model,
+    };
+  }
+
+  for (const row of plan.rows) {
+    const picks = [];
+    for (let order = 0; order < ORDERS; order += 1) {
+      const args = ['choice', '--provider', gate.provider, '-q', plan.question];
+      for (const [key, description] of rotateOptions(plan.pairs, order)) {
+        args.push('-o', `${key}=${description}`);
+      }
+      let attempt = 1;
+      let result = await spawnCall(gate.path, args, stateText(row), ctx.env, ctx.timeoutMs);
+      wallTimes.push(result.wallMs);
+
+      if (!result.timedOut && result.code === 4) {
+        ctx.callLog.append(record(row.id, order, attempt, result, null, null, 'unmeasured'));
+        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
+        attempt = 2;
+        result = await spawnCall(gate.path, args, stateText(row), ctx.env, ctx.timeoutMs);
+        wallTimes.push(result.wallMs);
+      }
+
+      let pick = null;
+      let pickProb = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (result.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (result.code === 0) {
+        const answer = parseChoiceAnswer(result.stdout, keys);
+        if (answer !== null) {
+          pick = answer.pick;
+          pickProb = answer.pickProb;
+          status = 'measured';
+        }
+      } else if (result.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (result.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (result.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row.id, order, attempt, result, pick, pickProb, status));
+      if (stopLine !== null) return stop(stopLine);
+      picks.push(pick);
+    }
+    answers.set(row.id, picks);
+    finished += 1;
+  }
+
+  return { stopped: null, partialRows: finished, answers, wallTimes, model };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 11. DEEM GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The gate runs only behind --deem and only while a labeled fixture keeps
+// headroom. Nothing leaves the machine, so the arm needs no payload gate; a
+// failed health check still prints its skip line and starts nothing.
+
+/** Repo copy of the cli-deem entry point, run under node when none is on PATH. */
+const REPO_CLI_DEEM = join(
+  REPO_ROOT,
+  '.skilled',
+  'skills',
+  'cli-classifier',
+  'cli-deem',
+  'scripts',
+  'cli-deem.mjs',
+);
+
+/**
+ * cli-deem on PATH when that file is executable, otherwise the repository copy
+ * under node. Keeping the fallback here means a checked-in install works
+ * without a PATH edit.
+ *
+ * @param {{ PATH?: string }} env - Environment whose PATH is searched.
+ * @returns {string[]} Command and leading arguments for one call.
+ */
+export function deemCommand(env) {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, REPO_CLI_DEEM];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, a wrong model or a
+ * body without both commit hashes is a failed check the caller prints as a
+ * skip.
+ *
+ * @param {string[]} cmd - Command from deemCommand.
+ * @param {Record<string, string | undefined>} env - Environment for the call.
+ * @returns {{ ok: true, backend: string, model: string, modelCommit: string,
+ *   sourceCommit: string } | { ok: false, reason: string, found: unknown }}
+ *   The identity pair when the check passes, and the failure reason otherwise.
+ */
+export function readDeemHealth(cmd, env) {
+  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
+    env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: HEALTH_TIMEOUT_MS,
+  });
+  let errorText = (result.stderr ?? '').trim();
+  try {
+    errorText = JSON.parse(errorText).error;
+  } catch {
+    // Leave the trimmed stderr when it is not JSON.
+  }
+
+  if (result.error || result.status === 4) {
+    return { ok: false, reason: 'not reachable', found: errorText };
+  }
+  if (result.status === 3) {
+    let reason = 'bad health response';
+    if (typeof errorText === 'string' && errorText.includes('stub')) reason = 'stub backend';
+    else if (typeof errorText === 'string' && errorText.includes('refused model')) reason = 'model';
+    return { ok: false, reason, found: errorText };
+  }
+  if (result.status === 0) {
+    const stdoutText = (result.stdout ?? '').trim();
+    let body;
+    try {
+      body = JSON.parse(stdoutText);
+    } catch {
+      return { ok: false, reason: 'bad health response', found: stdoutText };
+    }
+    const backend = body?.backend;
+    if (typeof backend === 'string' && backend.includes('stub')) {
+      return { ok: false, reason: 'stub backend', found: backend };
+    }
+    if (backend !== 'torch' && !(typeof backend === 'string' && backend.startsWith('ensemble:'))) {
+      return { ok: false, reason: 'bad health response', found: String(backend) };
+    }
+    const model = body?.model;
+    if (model !== DEEM_MODEL) {
+      return { ok: false, reason: 'model', found: String(model) };
+    }
+    const modelCommit = body?.model_commit;
+    const sourceCommit = body?.source_commit;
+    if (
+      body?.ok !== true
+      || typeof modelCommit !== 'string'
+      || modelCommit === ''
+      || typeof sourceCommit !== 'string'
+      || sourceCommit === ''
+    ) {
+      return { ok: false, reason: 'bad health response', found: stdoutText };
+    }
+    return { ok: true, backend, model, modelCommit, sourceCommit };
+  }
+  return { ok: false, reason: 'bad health response', found: `exit ${result.status}: ${errorText}` };
+}
+
+/**
+ * Prints the health line, or a skip line when the check fails. A skip line
+ * leaves the census text already written, so a refused backend changes no
+ * earlier line.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx - Line writer and environment.
+ * @returns {{ passed: boolean, cmd: string[], reason?: string }} True when the health check passed; a failed check carries the skip line it printed.
+ */
+export function deemGate(ctx) {
+  const cmd = deemCommand(ctx.env);
+  const health = readDeemHealth(cmd, ctx.env);
+  if (health.ok) {
+    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
+    return { passed: true, cmd, ...health };
+  }
+  const skipLine = `deem arm skipped: ${health.reason}`;
+  ctx.out(skipLine);
+  if (health.reason === 'model' || health.reason === 'bad health response') {
+    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
+  }
+  return { passed: false, cmd, reason: skipLine };
+}
+
+/**
+ * One choice call per labeled row per option order, with one call-log record
+ * per spawn. Exit 4 gets one health recheck before a single retry, because a
+ * dropped connection is not a judgment and a changed model identity must stop
+ * the arm. A stop prints its line and the rows that finished, and leaves the
+ * column and verdict unprinted.
+ *
+ * @param {{
+ *   rows: object[],
+ *   pairs: Array<[string, string]>,
+ *   question: string
+ * }} plan Labeled rows, the option pairs and the question text.
+ * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate - Passing deemGate result.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   callLog: { append: (record: object) => void }
+ * }} ctx Line writer, environment, per-call timeout and the call log.
+ * @returns {Promise<{
+ *   stopped: string | null,
+ *   partialRows: number,
+ *   answers: Map<string, Array<string | null>>,
+ *   wallTimes: number[]
+ * }>} Collected picks and wall times, or the stop line once an arm stops.
+ */
+export async function runDeemArm(plan, gate, ctx) {
+  const planned = ORDERS * plan.rows.length;
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 2-option p50 in deem-local.md`);
+
+  const wallTimes = [];
+  const answers = new Map();
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`deem: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished, answers, wallTimes };
+  }
+
+  const keys = plan.pairs.map(([key]) => key);
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its pick and probability stay empty and its status unmeasured.
+   */
+  function record(rowId, order, attempt, result, pick, pickProb, status) {
+    return {
+      backend: 'deem',
+      rowId,
+      order,
+      attempt,
+      wallMs: result.wallMs,
+      exitCode: result.code,
+      pick,
+      pickProb,
+      status,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    };
+  }
+
+  for (const row of plan.rows) {
+    const picks = [];
+    for (let order = 0; order < ORDERS; order += 1) {
+      const args = [...gate.cmd.slice(1), 'choice', '-q', plan.question];
+      for (const [key, description] of rotateOptions(plan.pairs, order)) {
+        args.push('-o', `${key}=${description}`);
+      }
+      let attempt = 1;
+      let result = await spawnCall(gate.cmd[0], args, stateText(row), ctx.env, ctx.timeoutMs);
+      wallTimes.push(result.wallMs);
+
+      if (!result.timedOut && result.code === 4) {
+        ctx.callLog.append(record(row.id, order, attempt, result, null, null, 'unmeasured'));
+        const health = readDeemHealth(gate.cmd, ctx.env);
+        if (!health.ok) return stop('deem arm stopped: server gone');
+        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+          return stop('deem arm stopped: model commit changed mid-run');
+        }
+        attempt = 2;
+        result = await spawnCall(gate.cmd[0], args, stateText(row), ctx.env, ctx.timeoutMs);
+        wallTimes.push(result.wallMs);
+      }
+
+      let pick = null;
+      let pickProb = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (result.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (result.code === 0) {
+        const answer = parseChoiceAnswer(result.stdout, keys);
+        if (answer !== null) {
+          pick = answer.pick;
+          pickProb = answer.pickProb;
+          status = 'measured';
+        }
+      } else if (result.code === 2) {
+        stopLine = 'deem arm stopped: usage error';
+      } else if (result.code === 3) {
+        stopLine = 'deem arm stopped: backend refused';
+      } else if (result.code === 130) {
+        stopLine = 'deem arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row.id, order, attempt, result, pick, pickProb, status));
+      if (stopLine !== null) return stop(stopLine);
+      picks.push(pick);
+    }
+    answers.set(row.id, picks);
+    finished += 1;
+  }
+
+  return { stopped: null, partialRows: finished, answers, wallTimes };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 12. KEEP RULE AND VERDICT
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The keep rule is fixed before any model run, the counts stay integers and both
+// tails are exact, so no rounding decides a verdict.
+
+/**
+ * One-sided exact tail P(X >= k) for X ~ Binomial(n, 1/2), summed coefficient
+ * by coefficient in BigInt. The threshold test is exact too: 20 * num < den is
+ * p < 0.05 with no float comparison. No trials give p 1.
+ *
+ * @param {number} k - Successes the tail starts at.
+ * @param {number} n - Trials.
+ * @returns {{ p: number, below: boolean }} Tail probability and whether it is below 0.05.
+ */
+export function binomialTail(k, n) {
+  if (n === 0) return { p: 1, below: false };
+  let coefficient = 1n;
+  let num = 0n;
+  for (let i = 0; i <= n; i += 1) {
+    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
+    if (i >= k) num += coefficient;
+  }
+  const den = 1n << BigInt(n);
+  return { p: Number(num) / Number(den), below: 20n * num < den };
+}
+
+/**
+ * The pick at least two option orders name, with its count. One submitted key
+ * is its own winner; three different keys name no winner, so the pick stays
+ * null and the top count stays 1, the unstable case. A missing pick belongs to
+ * a row that is not measured at all.
+ *
+ * @param {Array<string | null>} picks - Keys the option orders submitted for one row.
+ * @returns {{ pick: string | null, top: number }} Modal key and its count.
+ */
+export function modalPick(picks) {
+  if (picks.some((pick) => pick === null)) return { pick: null, top: 0 };
+  const counts = new Map();
+  for (const pick of picks) {
+    counts.set(pick, (counts.get(pick) ?? 0) + 1);
+  }
+  for (const [pick, count] of counts) {
+    if (2 * count > picks.length) return { pick, top: count };
+  }
+  return { pick: null, top: 1 };
+}
+
+/**
+ * First failed check decides, in this order: coverage, kill, margin, sign test,
+ * flips. The p on the line is the deciding tail: 1 for coverage, the loss tail
+ * for a kill, the sign-test tail otherwise.
+ *
+ * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - Row counts the keep rule reads.
+ * @returns {{ verdict: string, p: number }} The verdict and its deciding tail.
+ */
+export function decideVerdict({ K, M, A, B, W, L, F }) {
+  const killP = binomialTail(L, W + L);
+  const signP = binomialTail(W, W + L);
+  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', p: 1 };
+  if (killP.below) return { verdict: 'kill', p: killP.p };
+  if (!(10 * (A - B) >= M)) return { verdict: 'stop (margin)', p: signP.p };
+  if (!signP.below) return { verdict: 'stop (sign test)', p: signP.p };
+  if (!(10 * F <= 3 * M)) return { verdict: 'stop (flips)', p: signP.p };
+  return { verdict: 'keep', p: signP.p };
+}
+
+/**
+ * A probability in the form the verdict line prints it.
+ *
+ * @param {number} p - Probability in [0, 1].
+ * @returns {string} Four significant digits.
+ */
+export function formatP(p) {
+  return p.toPrecision(4);
+}
+
+/**
+ * One backend column's counts and verdict. A row is measured only when all
+ * three option orders submitted a key; a row whose orders name no majority is
+ * unstable and counts as a miss, and the votes its modal pick lacks add to the
+ * flip count.
+ *
+ * @param {{
+ *   backend: string,
+ *   rows: object[],
+ *   baselineKey: string,
+ *   answers: Map<string, Array<string | null>>
+ * }} input - Rows this column may score, the baseline key and each row's picks.
+ * @returns {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, unstable: number, verdict: string, p: number }}
+ *   Counts, the verdict and its deciding tail.
+ */
+export function summarizeColumn({ backend, rows, baselineKey, answers }) {
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+  let unstable = 0;
+  for (const row of rows) {
+    const picks = answers.get(row.id);
+    if (!Array.isArray(picks) || picks.length !== ORDERS || picks.some((pick) => typeof pick !== 'string')) {
+      continue;
+    }
+    const { pick, top } = modalPick(picks);
+    M += 1;
+    F += ORDERS - top;
+    if (pick === null) unstable += 1;
+    const columnRight = pick === row.label;
+    const baselineRight = baselineKey === row.label;
+    if (columnRight) A += 1;
+    if (baselineRight) B += 1;
+    if (columnRight && !baselineRight) W += 1;
+    if (baselineRight && !columnRight) L += 1;
+  }
+  const { verdict, p } = decideVerdict({ K: rows.length, M, A, B, W, L, F });
+  return { backend, K: rows.length, M, A, B, W, L, F, unstable, verdict, p };
+}
+
+/**
+ * The one-line verdict: counts, deciding tail, baseline and backend identity.
+ *
+ * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, p: number }} summary - One column summary.
+ * @param {string} baselineKey - Constant the column was scored against.
+ * @param {string} [suffix] - Identity fields, appended when non-empty.
+ * @returns {string} The verdict line.
+ */
+export function verdictLine(summary, baselineKey, suffix) {
+  const { backend, verdict, K, M, A, B, W, L, F, p } = summary;
+  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p=${formatP(p)} baseline=${baselineKey}`;
+  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
+  return line;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 13. REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The nearest-rank quantile of the measured wall times, or null when none was
+ * recorded. Rounded to whole milliseconds, the unit the call log carries.
+ *
+ * @param {number[]} values - Wall times in milliseconds.
+ * @param {number} q - Quantile in (0, 1].
+ * @returns {number | null} The quantile, or null when values is empty.
+ */
+function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = [...values].sort((left, right) => left - right);
+  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
+}
+
+/**
+ * One column line with both latency quantiles, each printed as `none` when
+ * absent. The Jev line adds how many rows the payload gate withheld, so its row
+ * count covers only rows that backend may read.
+ *
+ * @param {{ backend: string, K: number, M: number, unstable: number }} summary - One column summary.
+ * @param {{ p50: number | null, p95: number | null }} latency - Nearest-rank wall times.
+ * @param {number | null} withheld - Rows held back, or null when the column counts them itself.
+ * @returns {string} The column line.
+ */
+function columnLine(summary, latency, withheld) {
+  const { backend, K, M, unstable } = summary;
+  const withheldField = typeof withheld === 'number' ? ` withheld=${withheld}` : '';
+  return `column ${backend}: rows=${K} measured=${M} unmeasured=${K - M} unstable=${unstable}${withheldField}`
+    + ` latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`;
+}
+
+/**
+ * Parsed report.json written by an earlier run into the same directory.
+ *
+ * @param {string | null} outDir - Directory that may hold report.json.
+ * @returns {object | null} The parsed report, or null when outDir is empty,
+ *   the file is missing, or the file does not parse.
+ */
+function readStoredReport(outDir) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  try {
+    return JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8'));
+  } catch {
+    return null;
+  }
+}
+
+/**
+ * The requalify line when the stored report names another identity, or null
+ * when it names the same one. A keep holds only for the backend it was
+ * measured on, so a changed pair has to be visible before the new verdict.
+ *
+ * @param {string} backend - Arm the line belongs to.
+ * @param {object | null} stored - Parsed report from an earlier run.
+ * @param {{ provider?: string, model?: string, modelCommit?: string, sourceCommit?: string }} identity - Identity this run measured.
+ * @returns {string | null} The requalify line, or null when nothing changed.
+ */
+function requalifyLine(backend, stored, identity) {
+  const column = stored?.columns?.[backend];
+  if (!column) return null;
+  if (backend === 'deem' && (column.modelCommit !== identity.modelCommit || column.sourceCommit !== identity.sourceCommit)) {
+    return 'requalify: model commit changed';
+  }
+  if (backend === 'jev' && (column.provider !== identity.provider || column.model !== identity.model)) {
+    return 'requalify: model changed';
+  }
+  return null;
+}
+
+/**
+ * The report.json body. An arm with no result is left out of every map: a
+ * skipped arm records its line, a stopped arm its line and the rows that
+ * finished, and a column arm its counts, its line and its identity. The report
+ * never holds the fixture path or any row text.
+ *
+ * @param {{
+ *   seam: string[],
+ *   mined: { debugDelegation: number, hypothesisFiles: number, rows: number },
+ *   fixture: { sha256: string } | null,
+ *   labels: Record<string, number> | null,
+ *   constants: Record<string, number> | null,
+ *   baseline: { key: string, right: number } | null,
+ *   jev?: object,
+ *   deem?: object
+ * }} input - Census results, fixture-derived numbers and one arm result per backend.
+ * @returns {object} The report.json body.
+ */
+export function buildReport({ seam, mined, fixture, labels, constants, baseline, jev, deem }) {
+  const report = {
+    seam,
+    mined,
+    fixtureSha256: fixture === null ? null : fixture.sha256,
+    labels,
+    constants,
+    baseline,
+    keepRule: KEEP_RULE_LINE,
+    columns: {},
+    skipped: {},
+    stopped: {},
+    requalify: {},
+  };
+  for (const [backend, arm] of [['jev', jev], ['deem', deem]]) {
+    if (arm === undefined || arm === null) continue;
+    if (arm.skipped !== undefined) report.skipped[backend] = arm.skipped;
+    if (arm.stopped !== undefined) report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
+    if (arm.column !== undefined) {
+      report.columns[backend] = arm.column;
+      report.requalify[backend] = arm.requalify ?? null;
+    }
+  }
+  return report;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 14. CLI
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parses the command line into switch values. No positional arguments are
+ * accepted; a refusal carries its message so the caller can print it before any
+ * work starts.
+ *
+ * @param {string[]} argv - Raw arguments after the script name.
+ * @returns {{ ok: boolean, message?: string, options?: object }} Parsed switches
+ *   or the refusal message.
+ */
+export function parseCliArgs(argv) {
+  let values;
+  try {
+    ({ values } = parseArgs({
+      args: argv,
+      options: {
+        fixture: { type: 'string' },
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+        out: { type: 'string' },
+      },
+      strict: true,
+      allowPositionals: false,
+    }));
+  } catch (error) {
+    return { ok: false, message: `usage error: ${error.message}` };
+  }
+  return {
+    ok: true,
+    options: {
+      fixture: values.fixture === undefined ? null : values.fixture,
+      jev: values.jev === true,
+      deem: values.deem === true,
+      out: values.out === undefined ? null : values.out,
+    },
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 15. MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Runs the census end to end and returns the process exit code.
+ *
+ * @param {string[]} argv - Raw arguments after the script name.
+ * @param {{
+ *   root?: string,
+ *   stdout?: (line: string) => void,
+ *   stderr?: (line: string) => void,
+ *   env?: Record<string, string | undefined>,
+ *   timeoutMs?: number,
+ *   backoffMs?: number
+ * }} [deps] Repository root, line writers and arm process settings, so tests
+ *   can run without the process streams or the default timings.
+ * @returns {Promise<number>} 0 for a printed census or a stopped label gate,
+ *   2 for a refused command line or fixture.
+ */
+export async function main(argv, deps = {}) {
+  const root = deps.root ?? REPO_ROOT;
+  const stdout = deps.stdout ?? ((line) => process.stdout.write(`${line}\n`));
+  const stderr = deps.stderr ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
+  const backoffMs = deps.backoffMs ?? BACKOFF_MS;
+  const parsed = parseCliArgs(argv);
+  if (!parsed.ok) {
+    stderr(parsed.message);
+    return 2;
+  }
+  const { fixture, jev, deem, out } = parsed.options;
+
+  // Both arm switches need a report directory before any work starts, so no call
+  // can run without a record of it.
+  if ((jev || deem) && out === null) {
+    stderr('--jev or --deem need --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  // The fixture is read before any census line prints, so a refused path or a
+  // bad row rejects the run whole instead of leaving half a census on screen.
+  let fixtureData = null;
+  if (fixture !== null) {
+    fixtureData = readFixture(fixture, root);
+    if (!fixtureData.ok) {
+      stderr(fixtureData.message);
+      return 2;
+    }
+  }
+
+  const seam = seamSearch(root);
+  if (seam.length === 0) {
+    stdout('seam: none');
+  } else {
+    for (const hit of seam) {
+      stdout(`seam: ${hit}`);
+    }
+  }
+
+  const mined = minedCorpus(root);
+  stdout(`mined: debug_delegation=${mined.debugDelegation} hypothesis_files=${mined.hypothesisFiles}`);
+  stdout(`mined rows: ${mined.rows}`);
+
+  // The run replaces report.json at the end, so a prior body is read first: it
+  // carries the identity a new column has to match to stay qualified.
+  const stored = readStoredReport(out);
+  const arms = {};
+  let fixtureReport = null;
+
+  if (fixtureData !== null) {
+    const { rows, sha256, counts } = fixtureData;
+    stdout(`fixture: rows=${rows.length} sha256=${sha256}`);
+    const labelCounts = LABELS.map((label) => `${label}=${counts[label]}`).join(' ');
+    stdout(`labels: ${labelCounts}`);
+    const accuracies = constantAccuracies(rows);
+    for (const label of LABELS) {
+      stdout(`constant ${label}: ${accuracies[label]}/${rows.length}`);
+    }
+    const baseline = chooseBaseline(accuracies);
+    stdout(`baseline: ${baseline.key} ${baseline.right}/${rows.length}`);
+    // A constant right on more than nine tenths of the rows leaves no room for
+    // the ten-point gain a verdict needs, so no backend gets called.
+    const headroom = 10 * baseline.right <= 9 * rows.length;
+    if (!headroom) {
+      stdout('no headroom');
+    }
+    if (rows.length < LABEL_GATE) {
+      stdout(`stop: fewer than ${LABEL_GATE} labeled rows`);
+    }
+    // The rule is printed before the first gate, so a verdict can never be read
+    // against a rule the operator did not see fixed first.
+    if (headroom && rows.length >= LABEL_GATE) {
+      stdout(KEEP_RULE_LINE);
+    }
+    fixtureReport = { labels: counts, constants: accuracies, baseline };
+
+    const callLog = createCallLog(out);
+    // The payload gate runs only where the Jev arm would: a stopped run prints
+    // its stop line and composes no payload.
+    if (jev && headroom && rows.length >= LABEL_GATE) {
+      const payload = payloadSplit(rows);
+      if (payload.accepted.length === 0) {
+        const skipped = 'jev arm skipped: payload not accepted';
+        stdout(skipped);
+        arms.jev = { skipped };
+      } else {
+        // A withheld row leaves one record per option order and never reaches a
+        // backend, so the column can account for it without its text.
+        for (const row of payload.withheld) {
+          for (let order = 0; order < ORDERS; order += 1) {
+            callLog.append({
+              backend: 'jev',
+              rowId: row.id,
+              order,
+              attempt: null,
+              wallMs: 0,
+              exitCode: null,
+              pick: null,
+              pickProb: null,
+              status: 'unmeasured_withheld',
+            });
+          }
+        }
+
+        // The payload gate proved at least one row may leave, so the arm can
+        // run; its own gate decides, and a failed gate never starts the other
+        // backend in its place.
+        const gate = jevGate({ out: stdout, env, timeoutMs });
+        if (gate.passed) {
+          const result = await runJevArm(
+            { rows: payload.accepted, pairs: NEXT_CHECK_OPTIONS, question: CHOICE_QUESTION },
+            gate,
+            { out: stdout, env, timeoutMs, backoffMs, callLog },
+          );
+          if (result.stopped !== null) {
+            arms.jev = { stopped: result.stopped, partialRows: result.partialRows };
+          } else {
+            const summary = summarizeColumn({
+              backend: 'jev',
+              rows: payload.accepted,
+              baselineKey: baseline.key,
+              answers: result.answers,
+            });
+            const latency = { p50: nearestRank(result.wallTimes, 0.5), p95: nearestRank(result.wallTimes, 0.95) };
+            stdout(columnLine(summary, latency, payload.withheld.length));
+            const requalify = requalifyLine('jev', stored, { provider: gate.provider, model: result.model });
+            if (requalify !== null) {
+              stdout(requalify);
+            }
+            const line = verdictLine(summary, baseline.key, `jev_version=0.6.2 provider=${gate.provider} model=${result.model}`);
+            stdout(line);
+            arms.jev = {
+              column: { ...summary, latency, line, jevVersion: '0.6.2', provider: gate.provider, model: result.model },
+              requalify,
+            };
+          }
+        } else {
+          arms.jev = { skipped: gate.reason };
+        }
+      }
+    }
+
+    // The Deem arm runs after the Jev arm, on its own gate: a fixture that
+    // keeps headroom and carries the label floor may always be scored locally,
+    // and a failed backend never runs in the other's place.
+    if (deem && headroom && rows.length >= LABEL_GATE) {
+      const deemCheck = deemGate({ out: stdout, env });
+      if (deemCheck.passed) {
+        const result = await runDeemArm(
+          { rows, pairs: NEXT_CHECK_OPTIONS, question: CHOICE_QUESTION },
+          deemCheck,
+          { out: stdout, env, timeoutMs, callLog },
+        );
+        if (result.stopped !== null) {
+          arms.deem = { stopped: result.stopped, partialRows: result.partialRows };
+        } else {
+          const summary = summarizeColumn({ backend: 'deem', rows, baselineKey: baseline.key, answers: result.answers });
+          const latency = { p50: nearestRank(result.wallTimes, 0.5), p95: nearestRank(result.wallTimes, 0.95) };
+          stdout(columnLine(summary, latency, null));
+          const requalify = requalifyLine('deem', stored, {
+            modelCommit: deemCheck.modelCommit,
+            sourceCommit: deemCheck.sourceCommit,
+          });
+          if (requalify !== null) {
+            stdout(requalify);
+          }
+          const line = verdictLine(
+            summary,
+            baseline.key,
+            `model=${deemCheck.model} model_commit=${deemCheck.modelCommit} source_commit=${deemCheck.sourceCommit}`,
+          );
+          stdout(line);
+          arms.deem = {
+            column: {
+              ...summary,
+              latency,
+              line,
+              model: deemCheck.model,
+              modelCommit: deemCheck.modelCommit,
+              sourceCommit: deemCheck.sourceCommit,
+            },
+            requalify,
+          };
+        }
+      } else {
+        arms.deem = { skipped: deemCheck.reason };
+      }
+    }
+  }
+
+  // A named report directory gets the run record even when no arm ran, so a
+  // stopped census is still readable next to the fixture that produced it.
+  if (out !== null) {
+    const report = buildReport({
+      seam,
+      mined,
+      fixture: fixtureData,
+      labels: fixtureReport === null ? null : fixtureReport.labels,
+      constants: fixtureReport === null ? null : fixtureReport.constants,
+      baseline: fixtureReport === null ? null : fixtureReport.baseline,
+      jev: arms.jev,
+      deem: arms.deem,
+    });
+    mkdirSync(out, { recursive: true });
+    writeFileSync(join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
+  }
+  return 0;
+}
+
+// Node sets import.meta.url from the real path while argv keeps the typed path, so a
+// script started through a symlink matches only once both sides are resolved.
+export function isEntryPoint() {
+  try {
+    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
+  } catch {
+    return false;
+  }
+}
+
+if (isEntryPoint()) {
+  process.exitCode = await main(process.argv.slice(2));
+}
diff --git a/.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts b/.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts
new file mode 100644
index 0000000000..fd746e846d
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts
@@ -0,0 +1,738 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Debug Next Check Scorer Tests
+// ───────────────────────────────────────────────────────────────────
+// Synthetic fixtures and temporary repositories only. Stub jev and cli-deem
+// binaries come first on PATH, so no script run here can reach a live backend.
+
+import { execFileSync, spawnSync } from 'node:child_process';
+import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
+import { tmpdir } from 'node:os';
+import { delimiter, dirname, join, resolve } from 'node:path';
+import { fileURLToPath, pathToFileURL } from 'node:url';
+
+import { afterEach, describe, expect, it } from 'vitest';
+
+const HERE = dirname(fileURLToPath(import.meta.url));
+const SCRIPT = resolve(HERE, '../scripts/debug-next-check/score-debug-next-check.mjs');
+const REPO_ROOT = resolve(HERE, '..', '..', '..', '..', '..');
+
+const TEMP_DIRS: string[] = [];
+
+function tempDir(prefix: string): string {
+  const dir = mkdtempSync(join(tmpdir(), prefix));
+  TEMP_DIRS.push(dir);
+  return dir;
+}
+
+/** Writes stub jev and cli-deem binaries whose only side effect is a log line. */
+function makeStubs(): string {
+  const stubDir = tempDir('debug-next-check-stub-');
+  for (const name of ['jev', 'cli-deem']) {
+    writeFileSync(
+      join(stubDir, name),
+      `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\nexit 0\n`,
+      { mode: 0o755 },
+    );
+  }
+  return stubDir;
+}
+
+// Test double for the arm cases: it logs one line per invocation and answers
+// from a small table of STUB_* variables, so no run reaches a live backend.
+function armStubMain(): void {
+  const fs = require('node:fs');
+  const path = require('node:path');
+  const name = path.basename(process.argv[1]);
+  const args = process.argv.slice(2);
+  const env = process.env;
+  const logPath = path.join(path.dirname(process.argv[1]), `${name}.log`);
+  fs.appendFileSync(logPath, `${args.join(' ')}\n`);
+  if (name === 'jev' && args[0] === '--version') {
+    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
+    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
+    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
+  } else if (name === 'jev' && args[0] === 'choice') {
+    const choice = env.STUB_CHOICE || 'read_code';
+    process.stdout.write(`${JSON.stringify({ answers: { answer: { choice, probabilities: { [choice]: 0.9 } } } })}\n`);
+  } else {
+    process.exit(2);
+  }
+}
+
+const ARM_STUB_SOURCE = `#!/usr/bin/env node\n(${armStubMain.toString()})();\n`;
+
+/** Writes the response-table jev and cli-deem stubs used by the arm cases. */
+function makeArmStubs(): string {
+  const stubDir = tempDir('debug-next-check-arm-stub-');
+  for (const name of ['jev', 'cli-deem']) {
+    writeFileSync(join(stubDir, name), ARM_STUB_SOURCE, { mode: 0o755 });
+  }
+  return stubDir;
+}
+
+// Test double for the Deem arm cases: cli-deem only, logging one line per
+// invocation and answering from STUB_* variables so no run reaches a server.
+// A second health check reports a new model commit when STUB_HEALTH_SHIFT is
+// set, which is how a mid-run identity change is exercised.
+function deemStubMain(): void {
+  const fs = require('node:fs');
+  const path = require('node:path');
+  const name = path.basename(process.argv[1]);
+  const args = process.argv.slice(2);
+  const env = process.env;
+  const logPath = path.join(path.dirname(process.argv[1]), `${name}.log`);
+  const prior = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').split('\n') : [];
+  fs.appendFileSync(logPath, `${args.join(' ')}\n`);
+  const healthCalls = prior.filter((line) => line.startsWith('health')).length;
+  const choiceCalls = prior.filter((line) => line.startsWith('choice ')).length;
+  if (name === 'cli-deem' && args[0] === 'health') {
+    if (env.STUB_HEALTH === 'stub') {
+      process.stderr.write('{"ok":false,"error":"refused backend: ensemble:stub"}\n');
+      process.exit(3);
+    }
+    const shifted = env.STUB_HEALTH_SHIFT === '1' && healthCalls > 0;
+    process.stdout.write(`${JSON.stringify({
+      ok: true,
+      backend: 'torch',
+      model: 'deem-0.8-v1',
+      model_commit: shifted ? 'stubmodel-new' : 'stubmodel',
+      source_commit: 'stubsource',
+    })}\n`);
+  } else if (name === 'cli-deem' && args[0] === 'choice') {
+    if (env.STUB_CHOICE_EXIT === '4' && choiceCalls === 0) process.exit(4);
+    process.stdout.write(`${JSON.stringify({ answers: { answer: { choice: 'read_code', probabilities: { read_code: 0.9 } } } })}\n`);
+  } else {
+    process.exit(2);
+  }
+}
+
+const DEEM_STUB_SOURCE = `#!/usr/bin/env node\n(${deemStubMain.toString()})();\n`;
+
+/** Writes the cli-deem stub used by the Deem arm cases. */
+function makeDeemStubs(): string {
+  const stubDir = tempDir('debug-next-check-deem-stub-');
+  writeFileSync(join(stubDir, 'cli-deem'), DEEM_STUB_SOURCE, { mode: 0o755 });
+  return stubDir;
+}
+
+// Test double for the verdict cases: it logs one line per invocation and answers
+// from a pick schedule keyed by call index, so a run can produce a designed
+// column. STUB_ORDER0_EXIT leaves every first option order unanswered, and
+// STUB_UNSTABLE_ROW makes one row name three different keys.
+function pickStubMain(): void {
+  const fs = require('node:fs');
+  const path = require('node:path');
+  const name = path.basename(process.argv[1]);
+  const args = process.argv.slice(2);
+  const env = process.env;
+  const logPath = path.join(path.dirname(process.argv[1]), `${name}.log`);
+  const prior = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').split('\n') : [];
+  fs.appendFileSync(logPath, `${args.join(' ')}\n`);
+  const choiceCalls = prior.filter((line) => line.startsWith('choice ')).length;
+  if (name === 'jev' && args[0] === '--version') {
+    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
+    process.exit(0);
+  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
+    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
+  } else if (name === 'cli-deem' && args[0] === 'health') {
+    process.stdout.write(`${JSON.stringify({
+      ok: true,
+      backend: 'torch',
+      model: 'deem-0.8-v1',
+      model_commit: env.STUB_MODEL_COMMIT || 'stubmodel',
+      source_commit: env.STUB_SOURCE_COMMIT || 'stubsource',
+    })}\n`);
+  } else if (args[0] === 'choice') {
+    const order = choiceCalls % 3;
+    if (env.STUB_ORDER0_EXIT === '1' && order === 0) process.exit(1);
+    const rowIndex = Math.floor(choiceCalls / 3);
+    const schedule = (env.STUB_PICKS || 'read_code').split(',');
+    let pick = schedule[rowIndex % schedule.length];
+    if (env.STUB_UNSTABLE_ROW === String(rowIndex)) {
+      pick = ['read_code', 'run_test', 'reproduce'][order];
+    }
+    process.stdout.write(`${JSON.stringify({ answers: { answer: { choice: pick, probabilities: { [pick]: 0.9 } } } })}\n`);
+  } else {
+    process.exit(2);
+  }
+}
+
+const PICK_STUB_SOURCE = `#!/usr/bin/env node\n(${pickStubMain.toString()})();\n`;
+
+/** Writes the pick-schedule jev and cli-deem stubs used by the verdict cases. */
+function makePickStubs(): string {
+  const stubDir = tempDir('debug-next-check-pick-stub-');
+  for (const name of ['jev', 'cli-deem']) {
+    writeFileSync(join(stubDir, name), PICK_STUB_SOURCE, { mode: 0o755 });
+  }
+  return stubDir;
+}
+
+/** The label order the verdict cases score: read_code is the best constant at 12/30. */
+function verdictLabels(): string[] {
+  return [
+    ...Array.from({ length: 12 }, () => 'read_code'),
+    ...Array.from({ length: 8 }, () => 'run_test'),
+    ...Array.from({ length: 5 }, () => 'reproduce'),
+    ...Array.from({ length: 5 }, () => 'instrument'),
+  ];
+}
+
+/** Thirty labeled rows carrying the verdict label order. */
+function verdictRows(): Array<Record<string, unknown>> {
+  return verdictLabels().map((label, index) => fixtureRow({ id: `verdict-${index}`, label }));
+}
+
+/** Picks right on every read_code and run_test row and wrong on the other rows. */
+function keepSchedule(): string {
+  return verdictLabels().map((label) => (label === 'run_test' ? 'run_test' : 'read_code')).join(',');
+}
+
+/** Picks wrong on every row: run_test on the read_code rows and read_code on the rest. */
+function killSchedule(): string {
+  return verdictLabels().map((label) => (label === 'read_code' ? 'run_test' : 'read_code')).join(',');
+}
+
+/** Lines one stub appended, one per invocation. */
+function stubLines(stubDir: string, name: string): string[] {
+  const logPath = join(stubDir, `${name}.log`);
+  if (!existsSync(logPath)) return [];
+  return readFileSync(logPath, 'utf8').split('\n').filter((line) => line !== '');
+}
+
+/** Runs the scorer with the stubs first on PATH and captures its streams. */
+function runScript(
+  args: string[],
+  stubDir: string = makeStubs(),
+  extraEnv: Record<string, string> = {},
+) {
+  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
+    encoding: 'utf8',
+    timeout: 60_000,
+    env: {
+      ...process.env,
+      PATH: `${stubDir}${delimiter}${process.env.PATH}`,
+      ...extraEnv,
+    },
+  });
+  return {
+    code: result.status,
+    stdout: result.stdout,
+    stderr: result.stderr,
+    lines: result.stdout.trimEnd().split('\n'),
+    stubDir,
+  };
+}
+
+/** Creates a throwaway git repository with nothing committed. */
+function gitRepo(): string {
+  const dir = tempDir('debug-next-check-repo-');
+  execFileSync('git', ['init', '--quiet'], { cwd: dir, stdio: 'ignore' });
+  return dir;
+}
+
+/** One fixture row with every schema field; each case overrides what it breaks. */
+function fixtureRow(overrides: Record<string, unknown> = {}) {
+  return {
+    id: 'row-1',
+    symptom: 'the upload stalls at one hundred files',
+    claim: 'the pool exhausts before the retry starts',
+    evidence: 'two socket resets in the run log',
+    label: 'run_test',
+    jev_ok: true,
+    ...overrides,
+  };
+}
+
+/** Writes JSON Lines rows to a fixture outside the repository. */
+function writeFixture(rows: Array<Record<string, unknown>>): string {
+  const file = join(tempDir('debug-next-check-fixture-'), 'rows.jsonl');
+  writeFileSync(file, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
+  return file;
+}
+
+/** Parses the JSON Lines call log a run wrote under its report directory. */
+function readCallsLog(file: string): Array<Record<string, unknown>> {
+  return readFileSync(file, 'utf8')
+    .trimEnd()
+    .split('\n')
+    .filter((line) => line !== '')
+    .map((line) => JSON.parse(line));
+}
+
+describe('score-debug-next-check', () => {
+  afterEach(() => {
+    for (const dir of TEMP_DIRS.splice(0)) {
+      rmSync(dir, { recursive: true, force: true });
+    }
+  });
+
+  it('default run', () => {
+    const run = runScript([]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines[0]).toBe('seam: none');
+    expect(run.lines).toContain('mined: debug_delegation=1 hypothesis_files=0');
+    expect(run.lines).toContain('mined rows: 0');
+    expect(run.stderr).toBe('');
+    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(run.stubDir, 'cli-deem.log'))).toBe(false);
+  });
+
+  it('seam planted', async () => {
+    const repo = gitRepo();
+    writeFileSync(join(repo, 'planted.md'), 'next_check\n');
+    execFileSync('git', ['-C', repo, 'add', 'planted.md'], { stdio: 'ignore' });
+    const { seamSearch } = await import(pathToFileURL(SCRIPT).href);
+
+    expect(seamSearch(repo)).toEqual(['planted.md']);
+  });
+
+  it('seam clean', async () => {
+    const repo = gitRepo();
+    writeFileSync(join(repo, 'notes.md'), 'unrelated tracked notes\n');
+    execFileSync('git', ['-C', repo, 'add', 'notes.md'], { stdio: 'ignore' });
+    const { seamSearch } = await import(pathToFileURL(SCRIPT).href);
+
+    expect(seamSearch(repo)).toEqual([]);
+  });
+
+  it('mined corpus', async () => {
+    const { minedCorpus } = await import(pathToFileURL(SCRIPT).href);
+
+    expect(minedCorpus(REPO_ROOT)).toEqual({ debugDelegation: 1, hypothesisFiles: 0, rows: 0 });
+  });
+
+  it('--jev without --out', () => {
+    const fixture = writeFixture([fixtureRow()]);
+    const run = runScript(['--jev', '--fixture', fixture]);
+
+    expect(run.code).toBe(2);
+    expect(run.stderr).toContain('--out');
+    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(run.stubDir, 'cli-deem.log'))).toBe(false);
+  });
+
+  it('--deem without --out', () => {
+    const fixture = writeFixture([fixtureRow()]);
+    const run = runScript(['--deem', '--fixture', fixture]);
+
+    expect(run.code).toBe(2);
+    expect(run.stderr).toContain('--out');
+  });
+
+  it('fixture valid', async () => {
+    const fixture = writeFixture([fixtureRow()]);
+    const { readFixture } = await import(pathToFileURL(SCRIPT).href);
+    const result = readFixture(fixture, REPO_ROOT);
+
+    expect(result.ok).toBe(true);
+    expect(result.rows).toHaveLength(1);
+    expect(result.rows[0].id).toBe('row-1');
+    expect(result.counts).toEqual({ read_code: 0, run_test: 1, reproduce: 0, instrument: 0 });
+  });
+
+  it('unknown label', () => {
+    const fixture = writeFixture([fixtureRow({ id: 'row-look', label: 'look' })]);
+    const run = runScript(['--fixture', fixture]);
+
+    expect(run.code).toBe(2);
+    expect(run.stderr).toContain('row-look');
+    expect(run.stderr).toContain('label');
+  });
+
+  it('fixture inside repo', () => {
+    const inside = join(REPO_ROOT, 'specs', 'debug-next-check-fixture.jsonl');
+    const run = runScript(['--fixture', inside]);
+
+    expect(run.code).toBe(2);
+    expect(run.stderr).toContain('refused: fixture path inside the repository');
+  });
+
+  it('gate at 29', () => {
+    const rows = Array.from({ length: 29 }, (_, index) => fixtureRow({ id: `row-${index + 1}` }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(['--fixture', fixture, '--jev', '--deem', '--out', out]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('stop: fewer than 30 labeled rows');
+    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(run.stubDir, 'cli-deem.log'))).toBe(false);
+    expect(existsSync(join(out, 'calls.jsonl'))).toBe(false);
+  });
+
+  it('gate at 30', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({ id: `row-${index + 1}` }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(['--fixture', fixture, '--jev', '--deem', '--out', out]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines.some((line) => /^fixture: rows=30 sha256=[0-9a-f]{64}$/.test(line))).toBe(true);
+    expect(run.lines).toContain('labels: read_code=0 run_test=30 reproduce=0 instrument=0');
+    expect(run.lines.some((line) => line.startsWith('stop:'))).toBe(false);
+  });
+
+  it('baseline best', () => {
+    const rows = [
+      ...Array.from({ length: 20 }, (_, index) =>
+        fixtureRow({ id: `best-run-${index}` }),
+      ),
+      ...Array.from({ length: 4 }, (_, index) =>
+        fixtureRow({ id: `best-code-${index}`, label: 'read_code' }),
+      ),
+      ...Array.from({ length: 3 }, (_, index) =>
+        fixtureRow({ id: `best-reproduce-${index}`, label: 'reproduce' }),
+      ),
+      ...Array.from({ length: 3 }, (_, index) =>
+        fixtureRow({ id: `best-instrument-${index}`, label: 'instrument' }),
+      ),
+    ];
+    const fixture = writeFixture(rows);
+    const run = runScript(['--fixture', fixture]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('constant read_code: 4/30');
+    expect(run.lines).toContain('constant run_test: 20/30');
+    expect(run.lines).toContain('constant reproduce: 3/30');
+    expect(run.lines).toContain('constant instrument: 3/30');
+    expect(run.lines).toContain('baseline: run_test 20/30');
+  });
+
+  it('baseline tie', () => {
+    // A thirty-row fixture can only tie at fifteen each: the four labels
+    // partition the rows, so two counts cannot both exceed half of them.
+    const rows = [
+      ...Array.from({ length: 15 }, (_, index) =>
+        fixtureRow({ id: `tie-code-${index}`, label: 'read_code' }),
+      ),
+      ...Array.from({ length: 15 }, (_, index) =>
+        fixtureRow({ id: `tie-reproduce-${index}`, label: 'reproduce' }),
+      ),
+    ];
+    const fixture = writeFixture(rows);
+    const run = runScript(['--fixture', fixture]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('baseline: read_code 15/30');
+  });
+
+  it('no headroom', () => {
+    const rows = Array.from({ length: 30 }, (_, index) =>
+      fixtureRow({ id: `headroom-${index}`, label: index < 28 ? 'read_code' : 'run_test' }),
+    );
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(['--fixture', fixture, '--jev', '--deem', '--out', out]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('baseline: read_code 28/30');
+    expect(run.lines).toContain('no headroom');
+    expect(existsSync(join(run.stubDir, 'jev.log'))).toBe(false);
+    expect(existsSync(join(run.stubDir, 'cli-deem.log'))).toBe(false);
+    expect(existsSync(join(out, 'calls.jsonl'))).toBe(false);
+  });
+
+  it('withheld row', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `withheld-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+      ...(index === 7 ? { jev_ok: false } : {}),
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(['--fixture', fixture, '--jev', '--out', out]);
+
+    expect(run.code).toBe(0);
+    const logFile = join(out, 'calls.jsonl');
+    expect(existsSync(logFile)).toBe(true);
+    const withheld = readCallsLog(logFile).filter((record) => record.rowId === 'withheld-7');
+    expect(withheld).toHaveLength(3);
+    expect(withheld.map((record) => record.order)).toEqual([0, 1, 2]);
+    for (const record of withheld) {
+      expect(record.status).toBe('unmeasured_withheld');
+      // A withheld row produced no spawn: no wall time and no exit code.
+      expect(record.wallMs).toBe(0);
+      expect(record.exitCode).toBeNull();
+    }
+  });
+
+  it('no accepted row', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `no-accept-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+      jev_ok: false,
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(['--fixture', fixture, '--jev', '--out', out]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('jev arm skipped: payload not accepted');
+  });
+
+  it('jev gate pass', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `gate-pass-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+      jev_ok: index < 12,
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', fixture, '--jev', '--out', out],
+      makeArmStubs(),
+      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
+    );
+
+    expect(run.code).toBe(0);
+    expect(run.lines.some((line) => /^jev: path=.+\/jev provider=official$/.test(line))).toBe(true);
+    expect(run.lines).toContain('jev: auth test provider=official model=stub-model');
+  });
+
+  it('jev gate skip', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `gate-skip-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+      jev_ok: index < 12,
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', fixture, '--jev', '--out', out],
+      makeArmStubs(),
+      { STUB_AUTH_STATUS_EXIT: '3' },
+    );
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('jev arm skipped: no credential');
+    expect(run.lines).not.toContain('jev: auth test provider=official model=stub-model');
+    expect(stubLines(run.stubDir, 'jev').filter((line) => line.startsWith('choice '))).toHaveLength(0);
+  });
+
+  it('jev wrong version', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `wrong-version-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+      jev_ok: index < 12,
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', fixture, '--jev', '--out', out],
+      makeArmStubs(),
+      { STUB_JEV_VERSION: 'jev 0.6.1' },
+    );
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('jev arm skipped: version');
+    expect(run.lines.some((line) => line.startsWith('jev: found="jev 0.6.1" path='))).toBe(true);
+    expect(run.lines).not.toContain('jev: auth test provider=official model=stub-model');
+  });
+
+  // K counts accepted rows, so this case pins the input boundary the eventual
+  // verdict reads: exactly the accepted rows are called, once per option order,
+  // and no withheld row is called.
+  it('jev K', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `k-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+      jev_ok: index < 12,
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', fixture, '--jev', '--out', out],
+      makeArmStubs(),
+      { STUB_JEV_VERSION: 'jev 0.6.2', STUB_AUTH_STATUS_EXIT: '0' },
+    );
+
+    expect(run.code).toBe(0);
+    const records = readCallsLog(join(out, 'calls.jsonl'));
+    const measured = records.filter((record) => record.status === 'measured' && typeof record.rowId === 'string');
+    expect(measured).toHaveLength(36);
+    expect([...new Set(measured.map((record) => record.rowId))].sort()).toEqual(
+      Array.from({ length: 12 }, (_, index) => `k-${index}`).sort(),
+    );
+    for (let index = 0; index < 12; index += 1) {
+      const picks = measured.filter((record) => record.rowId === `k-${index}`);
+      expect(picks.map((record) => record.order)).toEqual([0, 1, 2]);
+    }
+    const withheld = records.filter((record) => record.status === 'unmeasured_withheld');
+    expect(withheld).toHaveLength(54);
+    for (const record of withheld) {
+      expect(record.wallMs).toBe(0);
+      expect(record.exitCode).toBeNull();
+    }
+    expect(stubLines(run.stubDir, 'jev').filter((line) => line.startsWith('choice '))).toHaveLength(36);
+  });
+
+  it('deem gate pass', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `deem-pass-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(['--fixture', fixture, '--deem', '--out', out], makeDeemStubs());
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource');
+    expect(run.lines).toContain('deem: nothing leaves the machine; planned calls: 90; estimated wall time: 5.9 s at 65.6 ms per call, the 2-option p50 in deem-local.md');
+    expect(readCallsLog(join(out, 'calls.jsonl'))).toHaveLength(90);
+  });
+
+  it('deem stub backend', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `deem-stub-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', fixture, '--deem', '--out', out],
+      makeDeemStubs(),
+      { STUB_HEALTH: 'stub' },
+    );
+    const plain = runScript(['--fixture', fixture]);
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('deem arm skipped: stub backend');
+    expect(run.lines.filter((line) => line !== 'deem arm skipped: stub backend')).toEqual(plain.lines);
+  });
+
+  it('deem exit 4 new pair', () => {
+    const rows = Array.from({ length: 30 }, (_, index) => fixtureRow({
+      id: `deem-retry-${index}`,
+      label: ['read_code', 'run_test', 'reproduce', 'instrument'][index % 4],
+    }));
+    const fixture = writeFixture(rows);
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', fixture, '--deem', '--out', out],
+      makeDeemStubs(),
+      { STUB_CHOICE_EXIT: '4', STUB_HEALTH_SHIFT: '1' },
+    );
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain('deem arm stopped: model commit changed mid-run');
+    expect(run.lines).toContain('deem: partial rows=0');
+    expect(run.lines.some((line) => line.startsWith('verdict '))).toBe(false);
+  });
+
+  it('verdict keep', () => {
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', writeFixture(verdictRows()), '--deem', '--out', out],
+      makePickStubs(),
+      { STUB_PICKS: keepSchedule() },
+    );
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain(
+      'verdict deem: keep K=30 M=30 A=20 B=12 W=8 L=0 F=0 p=0.003906'
+      + ' baseline=read_code model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource',
+    );
+  });
+
+  it('verdict kill', () => {
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', writeFixture(verdictRows()), '--deem', '--out', out],
+      makePickStubs(),
+      { STUB_PICKS: killSchedule() },
+    );
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain(
+      'verdict deem: kill K=30 M=30 A=0 B=12 W=0 L=12 F=0 p=0.0002441'
+      + ' baseline=read_code model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource',
+    );
+  });
+
+  it('verdict coverage', () => {
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', writeFixture(verdictRows()), '--jev', '--out', out],
+      makePickStubs(),
+      { STUB_ORDER0_EXIT: '1' },
+    );
+
+    expect(run.code).toBe(0);
+    expect(run.lines).toContain(
+      'verdict jev: stop (coverage) K=30 M=0 A=0 B=0 W=0 L=0 F=0 p=1.000'
+      + ' baseline=read_code jev_version=0.6.2 provider=official model=stub-model',
+    );
+  });
+
+  it('requalify', () => {
+    const out = tempDir('debug-next-check-out-');
+    writeFileSync(
+      join(out, 'report.json'),
+      `${JSON.stringify({ columns: { deem: { modelCommit: 'previous-model', sourceCommit: 'previous-source' } } })}\n`,
+    );
+    const run = runScript(
+      ['--fixture', writeFixture(verdictRows()), '--deem', '--out', out],
+      makePickStubs(),
+      { STUB_PICKS: keepSchedule() },
+    );
+
+    expect(run.code).toBe(0);
+    const requalifyAt = run.lines.indexOf('requalify: model commit changed');
+    const verdictAt = run.lines.findIndex((line) => line.startsWith('verdict deem:'));
+    expect(requalifyAt).toBeGreaterThan(-1);
+    expect(verdictAt).toBeGreaterThan(requalifyAt);
+  });
+
+  it('report line', () => {
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', writeFixture(verdictRows()), '--jev', '--deem', '--out', out],
+      makePickStubs(),
+      { STUB_PICKS: keepSchedule() },
+    );
+
+    expect(run.code).toBe(0);
+    const report = JSON.parse(readFileSync(join(out, 'report.json'), 'utf8'));
+    for (const backend of ['jev', 'deem']) {
+      const stdoutLine = run.lines.find((line) => line.startsWith(`verdict ${backend}:`));
+      expect(stdoutLine).toBeDefined();
+      expect(report.columns[backend].line).toBe(stdoutLine);
+    }
+  });
+
+  it('unstable row', () => {
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', writeFixture(verdictRows()), '--deem', '--out', out],
+      makePickStubs(),
+      { STUB_PICKS: 'run_test', STUB_UNSTABLE_ROW: '0' },
+    );
+
+    expect(run.code).toBe(0);
+    expect(
+      run.lines.some((line) => /^column deem: rows=30 measured=30 unmeasured=0 unstable=1 latency_p50_ms=\d+ latency_p95_ms=\d+$/.test(line)),
+    ).toBe(true);
+    expect(run.lines.some((line) => /^verdict deem: .* F=2 /.test(line))).toBe(true);
+  });
+
+  it('no row text', () => {
+    const rows = verdictRows().map((row, index) => (index === 0
+      ? { ...row, symptom: 'CANARY-2f9d the upload stalls', evidence: 'CANARY-2f9d two socket resets' }
+      : row));
+    const out = tempDir('debug-next-check-out-');
+    const run = runScript(
+      ['--fixture', writeFixture(rows), '--jev', '--deem', '--out', out],
+      makePickStubs(),
+      { STUB_PICKS: 'read_code' },
+    );
+
+    expect(run.code).toBe(0);
+    expect(readFileSync(join(out, 'calls.jsonl'), 'utf8')).not.toContain('CANARY-');
+    expect(readFileSync(join(out, 'report.json'), 'utf8')).not.toContain('CANARY-');
+  });
+});
```
