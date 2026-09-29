# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the code was written by DeepSeek V4.1 Flash through Devin; you are MiMo through Pi). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs b/.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
new file mode 100644
index 0000000000..80f5e87691
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
@@ -0,0 +1,1566 @@
+#!/usr/bin/env node
+// ╔══════════════════════════════════════════════════════════════════════════╗
+// ║ score-clarify-default — clarify census and default-pick scorer           ║
+// ╚══════════════════════════════════════════════════════════════════════════╝
+'use strict';
+
+/**
+ * score-clarify-default.cjs — replays committed prompts through each compiled
+ * hub engine, read only, and counts clarify outcomes. It never calls a model
+ * unless a later switch asks.
+ */
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const { spawn, spawnSync } = require('child_process');
+const crypto = require('crypto');
+const fs = require('fs');
+const path = require('path');
+
+const scenarios = require('./validate-compiled-routing-scenarios.cjs');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const NONE_KEY = 'none_of_these';
+const SOURCES = Object.freeze(['canary', 'playbook', 'corpus']);
+const ACTIONS = Object.freeze(['route', 'clarify', 'defer', 'reject']);
+const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
+const COMPILED_ROUTE_MODULE = '.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs';
+const CANARY_ROOT = '.skilled/bin/lib/compiled-routing';
+const CORPUS_DIR = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
+const CORPUS_FILES = Object.freeze(['labeled-prompts.jsonl', 'holdout-prompts.jsonl']);
+const USAGE = 'usage: score-clarify-default.cjs [--report <dir>] [--rows-out <file>] [--transcripts <dir>] | --score <rows file> [--jev] [--deem] [--out <dir>]';
+
+// The front door prints `hubId` then `action`; a transcript may hold that line JSON-escaped once or more, so any run of backslashes may precede a quote.
+const FRONT_DOOR_PATTERN = /\\*"hubId\\*"\s*:\s*\\*"([A-Za-z0-9_.-]+)\\*"\s*,\s*\\*"action\\*"\s*:\s*\\*"(route|clarify|defer|reject)\\*"/g;
+
+// These fix the call shape and the keep rule before any model call, so a change here is an amendment.
+const LABEL_GATE = 30;
+const CHOICE_INSTRUCTION = 'Which workflow mode should handle this request?';
+const NONE_DESCRIPTION = 'None of these modes';
+const ORDERS = 3;
+const MARGIN_LINE = 'margin: 0.10';
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M';
+
+const JEV_VERSION = 'jev 0.6.2';
+const DEEM_MODEL = 'deem-0.8-v1';
+const HEALTH_TIMEOUT_MS = 2000;
+const JEV_TIMEOUT_MS = 90000;
+const REPO_CLI_DEEM = '.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs';
+// The measured median wall time of one local choice call on the served model.
+const DEEM_P50_MS = 65.6;
+const DEEM_TIMEOUT_MS = 90000;
+const BACKOFF_MS = 2000;
+const JEV_PAYLOAD = 'committed canary, playbook and routing-corpus prompts and mode descriptions';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. CENSUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Create a zeroed census cell for one hub/source pair.
+ *
+ * @returns {{ prompts: number, unparsed: number, route: number, clarify: number, defer: number, reject: number, clarifyMode: number, clarifyChecklist: number, goldInAlternatives: number }} A fresh counter set.
+ */
+function emptyCell() {
+  return {
+    prompts: 0,
+    unparsed: 0,
+    route: 0,
+    clarify: 0,
+    defer: 0,
+    reject: 0,
+    clarifyMode: 0,
+    clarifyChecklist: 0,
+    goldInAlternatives: 0
+  };
+}
+
+/**
+ * Reduce a clarify decision's alternatives to its mode picks: drop the
+ * none-of-these entry, then keep the list only when something is left and
+ * every entry names a mode the hub declares. Anything else is the checklist
+ * form, which the census counts apart.
+ *
+ * @param {unknown} alternatives - The engine's clarify alternatives list.
+ * @param {Set<string>} modes - The hub's declared workflow modes.
+ * @returns {Array<string> | null} The mode alternatives, or null when this is not a mode-pick list.
+ */
+function modeAlternatives(alternatives, modes) {
+  if (!Array.isArray(alternatives)) return null;
+
+  const picked = alternatives.filter((entry) => entry !== NONE_KEY);
+  if (picked.length === 0) return null;
+  return picked.every((entry) => modes.has(entry)) ? picked : null;
+}
+
+/**
+ * Replay committed prompts through their hub engines and tally what each
+ * engine decided, per hub and source, plus one row per mode-pick clarify.
+ *
+ * @param {Array<{ id: string, hub: string, source: string, prompt: string | null, gold: string | null }>} prompts - The committed prompt records, replayed in order.
+ * @param {(hub: string) => { snapshot: object, evaluate: (snapshot: object, input: { prompt: string }) => object }} engineFor - Resolve a hub's engine; may throw for an unknown hub.
+ * @param {(hub: string) => Set<string>} modesFor - Resolve a hub's declared workflow modes.
+ * @returns {{ cells: Object, rows: Array<object> }} The per-hub/source census cells and the clarify rows.
+ */
+function runCensus(prompts, engineFor, modesFor) {
+  const cells = {};
+  const rows = [];
+
+  for (const record of prompts) {
+    const { id, hub, source, prompt, gold } = record;
+
+    if (!cells[hub]) cells[hub] = {};
+    if (!cells[hub][source]) cells[hub][source] = emptyCell();
+    const cell = cells[hub][source];
+    cell.prompts += 1;
+
+    if (typeof prompt !== 'string' || prompt.length === 0) {
+      cell.unparsed += 1;
+      continue;
+    }
+
+    let result;
+    try {
+      const { snapshot, evaluate } = engineFor(hub);
+      result = evaluate(snapshot, { prompt });
+    } catch {
+      cell.unparsed += 1;
+      continue;
+    }
+
+    const action = result.decision.action;
+    if (!ACTIONS.includes(action)) {
+      cell.unparsed += 1;
+      continue;
+    }
+    cell[action] += 1;
+
+    if (action !== 'clarify') continue;
+
+    const alternatives = modeAlternatives(
+      result.decision.clarify && result.decision.clarify.alternatives,
+      modesFor(hub)
+    );
+
+    if (alternatives === null) {
+      cell.clarifyChecklist += 1;
+      continue;
+    }
+
+    cell.clarifyMode += 1;
+    const keptGold = alternatives.includes(gold) ? gold : null;
+    if (keptGold !== null) cell.goldInAlternatives += 1;
+    rows.push({ id, hub, source, prompt, alternatives, gold: keptGold });
+  }
+
+  return { cells, rows };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. PROMPT SOURCES
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Read one hub's mode registry: the workflow modes it declares and each
+ * mode's packet. A missing or malformed registry contributes nothing rather
+ * than failing the census.
+ *
+ * @param {string} repoRoot - Repository root.
+ * @param {string} hub - Hub id, the directory name under `.skilled/skills`.
+ * @returns {{ modes: Set<string>, packets: Map<string, string> }} Declared modes and their mode-to-packet map; both empty on a read or parse failure.
+ */
+function readRegistry(repoRoot, hub) {
+  try {
+    const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', hub, 'mode-registry.json'), 'utf8'));
+    const modes = new Set();
+    const packets = new Map();
+    for (const entry of registry.modes || []) {
+      if (!entry || typeof entry.workflowMode !== 'string') continue;
+      modes.add(entry.workflowMode);
+      if (typeof entry.packet === 'string') packets.set(entry.workflowMode, entry.packet);
+    }
+    return { modes, packets };
+  } catch {
+    return { modes: new Set(), packets: new Map() };
+  }
+}
+
+/**
+ * Resolve the hub that owns a skill id: the id itself when it names a hub,
+ * otherwise the first hub, in key order, declaring it as a workflow mode or
+ * mode packet.
+ *
+ * @param {string} skill - A skill id from the routing corpus.
+ * @param {Object<string, { modes: Set<string>, packets: Map<string, string> }>} registries - Registries keyed by hub id.
+ * @returns {string | null} The owning hub id, or null when no registry claims it.
+ */
+function hubForSkill(skill, registries) {
+  if (Object.prototype.hasOwnProperty.call(registries, skill)) return skill;
+  for (const [hub, registry] of Object.entries(registries)) {
+    if (registry.modes.has(skill)) return hub;
+    for (const packet of registry.packets.values()) {
+      if (packet === skill) return hub;
+    }
+  }
+  return null;
+}
+
+/**
+ * Load the canary fixtures' prompts for every hub in the compiled-routing
+ * map. A fixture that cannot be read or parsed contributes one unparsed
+ * record, so the census counts it rather than dropping it.
+ *
+ * @param {string} repoRoot - Repository root.
+ * @param {Object<string, string>} hubChild - Hub id -> compiled-routing child path.
+ * @returns {Array<{ id: string, hub: string, source: string, prompt: string | null, gold: null }>} One record per canary case.
+ */
+function loadCanaryPrompts(repoRoot, hubChild) {
+  const records = [];
+  for (const [hub, child] of Object.entries(hubChild)) {
+    let fixture;
+    try {
+      fixture = JSON.parse(fs.readFileSync(path.join(repoRoot, CANARY_ROOT, child, 'fixtures', 'canary-cases.v1.json'), 'utf8'));
+    } catch {
+      records.push({ id: hub + '/fixture', hub, source: 'canary', prompt: null, gold: null });
+      continue;
+    }
+    const cases = Array.isArray(fixture.cases) ? fixture.cases : [];
+    for (const c of cases) {
+      records.push({
+        id: String(c.id),
+        hub,
+        source: 'canary',
+        prompt: typeof c.prompt === 'string' && c.prompt.length > 0 ? c.prompt : null,
+        gold: null
+      });
+    }
+  }
+  return records;
+}
+
+/**
+ * Load the manual-testing-playbook scenarios' prompts for every hub. A
+ * scenario's expected workflow mode is gold only when it names a real mode;
+ * the literal null/unknown placeholders are not gold.
+ *
+ * @param {string} repoRoot - Repository root.
+ * @param {Array<string>} hubs - Hub ids to walk.
+ * @returns {Array<{ id: string, hub: string, source: string, prompt: string | null, gold: string | null }>} One record per scenario file.
+ */
+function loadPlaybookPrompts(repoRoot, hubs) {
+  const records = [];
+  for (const hub of hubs) {
+    const playbookDir = path.join(repoRoot, '.skilled', 'skills', hub, 'manual-testing-playbook');
+    for (const file of scenarios.walkScenarioFiles(playbookDir)) {
+      const parsed = scenarios.parseScenario(file);
+      const expected = parsed.ok ? parsed.expectedWorkflowMode : null;
+      const gold = typeof expected === 'string' && !['null', 'unknown'].includes(expected.toLowerCase())
+        ? expected
+        : null;
+      records.push({
+        id: (parsed.ok && parsed.id) || path.relative(repoRoot, file),
+        hub,
+        source: 'playbook',
+        prompt: parsed.ok ? parsed.prompt : null,
+        gold
+      });
+    }
+  }
+  return records;
+}
+
+/**
+ * Load the routing-accuracy corpus rows whose top skill a compiled hub can
+ * claim. Rows whose skill fires outside the compiled hubs stay in the
+ * summary only and contribute no prompt record.
+ *
+ * @param {string} repoRoot - Repository root.
+ * @param {Object<string, { modes: Set<string>, packets: Map<string, string> }>} registries - Registries keyed by hub id.
+ * @returns {{ records: Array<{ id: string, hub: string, source: string, prompt: string | null, gold: null }>, summary: { rows: number, none: number, skillFiring: number, mapped: number, noCompiledHub: number, unparsedLines: number } }} Corpus prompt records and the corpus tally.
+ */
+function loadCorpusPrompts(repoRoot, registries) {
+  const records = [];
+  const summary = { rows: 0, none: 0, skillFiring: 0, mapped: 0, noCompiledHub: 0, unparsedLines: 0 };
+
+  for (const file of CORPUS_FILES) {
+    let text;
+    try {
+      text = fs.readFileSync(path.join(repoRoot, CORPUS_DIR, file), 'utf8');
+    } catch {
+      continue;
+    }
+    const lines = text.split(/\r?\n/);
+    for (let i = 0; i < lines.length; i += 1) {
+      const line = lines[i].trim();
+      if (line.length === 0) continue;
+      const n = i + 1;
+
+      let row;
+      try {
+        row = JSON.parse(line);
+      } catch {
+        summary.unparsedLines += 1;
+        continue;
+      }
+      if (!row || typeof row.skill_top_1 !== 'string') {
+        summary.unparsedLines += 1;
+        continue;
+      }
+
+      summary.rows += 1;
+      if (row.skill_top_1 === 'none') {
+        summary.none += 1;
+        continue;
+      }
+
+      summary.skillFiring += 1;
+      const hub = hubForSkill(row.skill_top_1, registries);
+      if (hub === null) {
+        summary.noCompiledHub += 1;
+        continue;
+      }
+
+      summary.mapped += 1;
+      records.push({
+        id: String(row.id ?? file + ':' + n),
+        hub,
+        source: 'corpus',
+        prompt: typeof row.prompt === 'string' && row.prompt.length > 0 ? row.prompt : null,
+        gold: null
+      });
+    }
+  }
+
+  return { records, summary };
+}
+
+/**
+ * Serialize clarify rows as JSONL lines, each carrying an empty label slot
+ * for a later labeling pass to fill.
+ *
+ * @param {Array<object>} rows - Census clarify rows.
+ * @returns {Array<string>} One JSON line per row.
+ */
+function rowLines(rows) {
+  return rows.map((r) => JSON.stringify({
+    id: r.id,
+    hub: r.hub,
+    source: r.source,
+    prompt: r.prompt,
+    alternatives: r.alternatives,
+    gold: r.gold,
+    label: ''
+  }));
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. TRANSCRIPTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Count front-door lines across a transcript directory, recursing into
+ * subdirectories. A line counts once when it names at least one hub/action
+ * pair, and each distinct pair on it counts once for its hub. Only counts
+ * leave this function; transcript text never does.
+ *
+ * @param {string} dir - Directory to walk.
+ * @returns {{ files: number, linesMatched: number, byHub: Object<string, { route: number, clarify: number, defer: number, reject: number }>, perFile: Array<{ file: string, lines: number }> }} The transcript count.
+ */
+function countTranscripts(dir) {
+  const files = [];
+  const walk = (cur) => {
+    const entries = fs.readdirSync(cur, { withFileTypes: true })
+      .sort((a, b) => {
+        const left = path.join(cur, a.name);
+        const right = path.join(cur, b.name);
+        return left < right ? -1 : left > right ? 1 : 0;
+      });
+    for (const entry of entries) {
+      const full = path.join(cur, entry.name);
+      if (entry.isDirectory()) walk(full);
+      else if (entry.isFile()) files.push(full);
+    }
+  };
+  walk(dir);
+
+  const byHub = {};
+  const perFile = [];
+  let linesMatched = 0;
+
+  for (const file of files) {
+    const lines = fs.readFileSync(file, 'utf8').split('\n');
+    let matched = 0;
+    for (const line of lines) {
+      const pairs = new Set();
+      for (const match of line.matchAll(FRONT_DOOR_PATTERN)) pairs.add(match[1] + '\t' + match[2]);
+      if (pairs.size === 0) continue;
+      matched += 1;
+      for (const pair of pairs) {
+        const [hub, action] = pair.split('\t');
+        if (!byHub[hub]) byHub[hub] = { route: 0, clarify: 0, defer: 0, reject: 0 };
+        byHub[hub][action] += 1;
+      }
+    }
+    linesMatched += matched;
+    perFile.push({ file: path.relative(dir, file), lines: matched });
+  }
+
+  return { files: files.length, linesMatched, byHub, perFile };
+}
+
+/**
+ * Format the transcript count: the file and matched-line totals, one line
+ * per hub in sorted order, and the real clarify rate the transcripts show.
+ *
+ * @param {{ files: number, linesMatched: number, byHub: Object<string, { route: number, clarify: number, defer: number, reject: number }> }} result - countTranscripts output.
+ * @returns {Array<string>} Transcript report lines.
+ */
+function transcriptLines(result) {
+  const lines = [`transcripts: files=${result.files} lines_matched=${result.linesMatched}`];
+  let clarify = 0;
+  let total = 0;
+  for (const hub of Object.keys(result.byHub).sort()) {
+    const cell = result.byHub[hub];
+    lines.push(`transcript hub=${hub} route=${cell.route} clarify=${cell.clarify} defer=${cell.defer} reject=${cell.reject}`);
+    clarify += cell.clarify;
+    total += cell.route + cell.clarify + cell.defer + cell.reject;
+  }
+  lines.push(`real clarify rate: ${clarify}/${total}`);
+  return lines;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. SCORER
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Read a rows file: one JSON record per non-blank line. A line that does not
+ * parse names its 1-based line number, because skipping it silently would
+ * score a shorter file than the operator believes.
+ *
+ * @param {string} file - Path to the JSONL rows file.
+ * @returns {Array<object>} The parsed rows, in file order.
+ */
+function readRows(file) {
+  const lines = fs.readFileSync(file, 'utf8').split('\n');
+  const rows = [];
+  for (let i = 0; i < lines.length; i += 1) {
+    const line = lines[i].trim();
+    if (line.length === 0) continue;
+    try {
+      rows.push(JSON.parse(line));
+    } catch {
+      throw new Error('line ' + (i + 1) + ' is not JSON');
+    }
+  }
+  return rows;
+}
+
+/**
+ * Resolve each row's pick from its label, else its committed gold, and split
+ * the rows into picks the row itself offers and picks that name something
+ * outside its own alternatives.
+ *
+ * @param {Array<object>} rows - Parsed rows records.
+ * @returns {{ labeled: Array<object>, foreign: Array<{ id: string, value: string }> }} Rows carrying a resolvable value, and the out-of-set picks.
+ */
+function labelRows(rows) {
+  const labeled = [];
+  const foreign = [];
+
+  for (const row of rows) {
+    const label = typeof row.label === 'string' && row.label.trim().length > 0 ? row.label.trim() : null;
+    const gold = typeof row.gold === 'string' && row.gold.length > 0 ? row.gold : null;
+    const value = label !== null ? label : gold;
+    if (value === null) continue;
+
+    if (![...row.alternatives, NONE_KEY].includes(value)) {
+      foreign.push({ id: row.id, value });
+      continue;
+    }
+    labeled.push({ ...row, value, valueSource: label !== null ? 'label' : 'gold' });
+  }
+
+  return { labeled, foreign };
+}
+
+/**
+ * Resolve each mode key to the option text the clarify choice shows: the
+ * packet's own description, with the none key fixed to its constant. Two keys
+ * sharing one text each gain their key, because the local classifier refuses
+ * two options with one description.
+ *
+ * @param {string} repoRoot - Repository root.
+ * @param {string} hub - Hub id, the directory name under `.skilled/skills`.
+ * @param {Array<string>} keys - Mode keys to describe.
+ * @returns {Map<string, string>} Key -> option text.
+ */
+function describeModes(repoRoot, hub, keys) {
+  const packets = readRegistry(repoRoot, hub).packets;
+  const texts = new Map();
+
+  for (const key of keys) {
+    if (key === NONE_KEY) {
+      texts.set(key, NONE_DESCRIPTION);
+      continue;
+    }
+
+    const packet = packets.get(key);
+    if (packet === undefined) throw new Error('no description for mode ' + hub + '/' + key);
+
+    let skill;
+    try {
+      skill = fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', hub, packet, 'SKILL.md'), 'utf8');
+    } catch {
+      throw new Error('no description for mode ' + hub + '/' + key);
+    }
+
+    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skill);
+    const line = frontmatter && /^description:[ \t]*(.*)$/m.exec(frontmatter[1]);
+    if (!line) throw new Error('no description for mode ' + hub + '/' + key);
+
+    let text = line[1].trim();
+    if (text.length >= 2 && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))) {
+      text = text.slice(1, -1);
+    }
+    texts.set(key, text);
+  }
+
+  const counts = new Map();
+  for (const text of texts.values()) counts.set(text, (counts.get(text) || 0) + 1);
+
+  const modes = new Map();
+  for (const [key, text] of texts) modes.set(key, counts.get(text) > 1 ? text + ' [' + key + ']' : text);
+  return modes;
+}
+
+/**
+ * Digest the option set the labeled rows describe: the distinct hub/key/text
+ * triples, sorted, as a count and the sha256 of their newline join, so a
+ * scored run can prove which option texts it measured.
+ *
+ * @param {Array<object>} labeled - labelRows labeled output.
+ * @param {string} repoRoot - Repository root.
+ * @returns {{ count: number, sha256: string }} The distinct option count and digest.
+ */
+function optionsDigest(labeled, repoRoot) {
+  const options = new Set();
+  for (const row of labeled) {
+    for (const [key, text] of describeModes(repoRoot, row.hub, [...row.alternatives, NONE_KEY])) {
+      options.add(row.hub + '/' + key + '=' + text);
+    }
+  }
+  const sorted = [...options].sort();
+  return {
+    count: sorted.length,
+    sha256: crypto.createHash('sha256').update(sorted.join('\n')).digest('hex')
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. VERDICT
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Counts stay integers and every binomial tail is an exact BigInt sum over
+// 2^n, so no rounding decides a verdict.
+
+/**
+ * Exact one-sided binomial tail P(X >= k) for X ~ Binomial(n, 1/2). The
+ * coefficients and their sum stay in BigInt, so p is the exact ratio
+ * num / 2^n, reported as a number and as its own parts.
+ *
+ * @param {number} n - Trial count.
+ * @param {number} k - Tail start; zero or below covers every outcome.
+ * @returns {{ p: number, num: bigint, den: bigint }} The tail probability and its exact num / 2^n ratio.
+ */
+function tailP(n, k) {
+  if (n === 0 || k <= 0) return { p: 1, num: 1n, den: 1n };
+  let coefficient = 1n;
+  let num = 0n;
+  for (let i = 0; i <= n; i += 1) {
+    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
+    if (i >= k) num += coefficient;
+  }
+  const den = 1n << BigInt(n);
+  return { p: Number(num) / Number(den), num, den };
+}
+
+/**
+ * The answer named at least twice, with its count. No key reaching two names
+ * no winner and reports top 0, so an unstable row counts every order as a
+ * non-modal pick.
+ *
+ * @param {Array<string>} answers - Submitted keys in call order.
+ * @returns {{ pick: string | null, top: number }} The modal pick and its count, or no pick and top 0.
+ */
+function modalPick(answers) {
+  const counts = new Map();
+  for (const key of answers) {
+    counts.set(key, (counts.get(key) || 0) + 1);
+  }
+  let pick = null;
+  let top = 0;
+  for (const [key, count] of counts) {
+    if (count > top) {
+      pick = key;
+      top = count;
+    }
+  }
+  if (top < 2) return { pick: null, top: 0 };
+  return { pick, top };
+}
+
+/**
+ * First failed condition decides, in this order: coverage, kill, margin,
+ * sign test, flips. Every outcome carries p, the sign test's exact tail.
+ *
+ * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - The column's counts.
+ * @returns {{ outcome: 'keep' | 'kill' | 'stop', reason: 'coverage' | 'margin' | 'sign test' | 'flips' | null, p: number }} The decision.
+ */
+function decideVerdict({ K, M, A, B, W, L, F }) {
+  const sign = tailP(W + L, W);
+  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: sign.p };
+  const kill = tailP(W + L, L);
+  if (W + L > 0 && 20n * kill.num <= kill.den) return { outcome: 'kill', reason: null, p: sign.p };
+  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', p: sign.p };
+  if (!(W + L > 0 && 20n * sign.num < sign.den)) return { outcome: 'stop', reason: 'sign test', p: sign.p };
+  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: sign.p };
+  return { outcome: 'keep', reason: null, p: sign.p };
+}
+
+/**
+ * One column's counts. A row is measured only when its record holds exactly
+ * one answer per order and every answer is a string; every other row stays
+ * unmeasured. An unstable or abstained pick is wrong for the column, and the
+ * votes a pick lacks add to the flip count.
+ *
+ * @param {Array<{ id: string, alternatives: Array<string>, value: string }>} labeled - Kept rows.
+ * @param {Map<string, Array<string | null>>} answersById - Row id to submitted keys in call order.
+ * @returns {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number, unstable: number, abstained: number }} The column's counts.
+ */
+function scoreColumn(labeled, answersById) {
+  const K = labeled.length;
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+  let unstable = 0;
+  let abstained = 0;
+
+  for (const row of labeled) {
+    const answers = answersById.get(row.id);
+    if (!Array.isArray(answers) || answers.length !== ORDERS) continue;
+    if (!answers.every((answer) => typeof answer === 'string')) continue;
+
+    M += 1;
+    const { pick, top } = modalPick(answers);
+    F += ORDERS - top;
+    if (pick === null) unstable += 1;
+    if (pick === NONE_KEY) abstained += 1;
+
+    const colRight = pick === row.value;
+    const baseRight = row.alternatives[0] === row.value;
+    if (colRight) A += 1;
+    if (baseRight) B += 1;
+    if (colRight && !baseRight) W += 1;
+    if (baseRight && !colRight) L += 1;
+  }
+
+  return { K, M, A, B, W, L, F, unstable, abstained };
+}
+
+/**
+ * @param {number} p - Probability in [0, 1].
+ * @returns {string} Four significant digits.
+ */
+function formatP(p) {
+  return p.toPrecision(4);
+}
+
+/**
+ * One verdict line: the outcome, the counts and the exact p, with the
+ * caller's suffix appended when it has one.
+ *
+ * @param {string} backend - Column name, printed on the line.
+ * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - The column's counts.
+ * @param {{ outcome: 'keep' | 'kill' | 'stop', reason: string | null, p: number }} decision - decideVerdict output.
+ * @param {string} [suffix] - Appended to the line when non-empty.
+ * @returns {string} The verdict line.
+ */
+function verdictLine(backend, counts, decision, suffix) {
+  const label = decision.outcome === 'stop' ? 'stop (' + decision.reason + ')' : decision.outcome;
+  let line = 'verdict ' + backend + ': ' + label
+    + ' K=' + counts.K + ' M=' + counts.M + ' A=' + counts.A + ' B=' + counts.B
+    + ' W=' + counts.W + ' L=' + counts.L + ' F=' + counts.F
+    + ' p=' + formatP(decision.p);
+  if (typeof suffix === 'string' && suffix !== '') line += ' ' + suffix;
+  return line;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. GATES
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped. A missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ * @param {string} name
+ * @param {{ PATH?: string }} env
+ * @returns {string|null}
+ */
+function which(name, env) {
+  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
+    if (dir.length === 0) continue;
+    const candidate = path.join(dir, name);
+    try {
+      if (fs.statSync(candidate).isFile()) {
+        fs.accessSync(candidate, fs.constants.X_OK);
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
+ * Identity line, then the pinned version and a credential check.
+ * A miss prints a skip line and leaves the census text already written.
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx
+ * @returns {{ passed: boolean, path: string | null, provider: string }}
+ */
+function jevGate(ctx) {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const path = which('jev', ctx.env);
+  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
+  if (path === null) {
+    ctx.out('jev arm skipped: jev not on PATH');
+    return { passed: false, path, provider };
+  }
+
+  const opts = {
+    env: ctx.env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: JEV_TIMEOUT_MS,
+  };
+  const version = spawnSync(path, ['--version'], opts);
+  const trimmed = (version.stdout ?? '').trim();
+  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
+  if (found !== JEV_VERSION) {
+    ctx.out('jev arm skipped: version');
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
+    return { passed: false, path, provider };
+  }
+
+  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
+  if (auth.status !== 0) {
+    ctx.out('jev arm skipped: no credential');
+    return { passed: false, path, provider };
+  }
+  return { passed: true, path, provider };
+}
+
+/**
+ * cli-deem on PATH when that file is executable, otherwise the repo copy under node.
+ * @param {{ PATH?: string }} env
+ * @param {string} repoRoot
+ * @returns {string[]}
+ */
+function deemCommand(env, repoRoot) {
+  const found = which('cli-deem', env);
+  if (found !== null) return [found];
+  return [process.execPath, path.join(repoRoot, REPO_CLI_DEEM)];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, or a wrong model
+ * is a failed check the caller prints as a skip.
+ * @param {string[]} cmd
+ * @param {Record<string, string | undefined>} env
+ * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }}
+ */
+function readDeemHealth(cmd, env) {
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
+ * Prints the health line, or a skip line when the check fails.
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, repoRoot: string }} ctx
+ * @returns {{ passed: boolean, cmd: string[] }}
+ */
+function deemGate(ctx) {
+  const cmd = deemCommand(ctx.env, ctx.repoRoot);
+  const health = readDeemHealth(cmd, ctx.env);
+  if (health.ok) {
+    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
+    return { passed: true, cmd, ...health };
+  }
+  ctx.out(`deem arm skipped: ${health.reason}`);
+  if (health.reason === 'model' || health.reason === 'bad health response') {
+    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
+  }
+  return { passed: false, cmd };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. ARMS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time, and whether the timeout fired.
+ * The timer kills the child and resolves at once, without waiting for close:
+ * a grandchild can hold the pipes open past the kill. Stdin is closed after
+ * the write because the local client reads stdin to EOF and exits 2 on an
+ * inherited terminal. A spawn error is code 127 with the message as stderr.
+ *
+ * @param {string} file - Executable to spawn.
+ * @param {Array<string>} args - Arguments after the executable.
+ * @param {string} stdinText - Text written to the child's stdin, then closed.
+ * @param {Record<string, string | undefined>} env - Child environment.
+ * @param {number} timeoutMs - Kill and settle the child after this many milliseconds.
+ * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} The call outcome.
+ */
+function spawnCall(file, args, stdinText, env, timeoutMs) {
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
+ * Append one call record as a JSON line to calls.jsonl under outDir.
+ * A missing or empty outDir means the run keeps no records, so nothing is
+ * created. One line per call keeps a killed arm's earlier records readable.
+ *
+ * @param {string | null | undefined} outDir - Directory that holds calls.jsonl.
+ * @param {object} record - The call record to append.
+ * @returns {void}
+ */
+function writeCall(outDir, record) {
+  if (typeof outDir === 'string' && outDir !== '') {
+    fs.mkdirSync(outDir, { recursive: true });
+    fs.appendFileSync(path.join(outDir, 'calls.jsonl'), JSON.stringify(record) + '\n');
+  }
+}
+
+/**
+ * The three option orders a row is asked in: as given, rotated left by one,
+ * rotated left by two. Rotating moves the option texts against the question
+ * while the key set stays the same, so a position bias cannot pass as a pick.
+ *
+ * @param {Array<string>} keys - Option keys in router order.
+ * @returns {Array<Array<string>>} The three rotations.
+ */
+function rotations(keys) {
+  return [keys, keys.slice(1).concat(keys.slice(0, 1)), keys.slice(2).concat(keys.slice(0, 2))];
+}
+
+/**
+ * Flatten one rotation's keys and their option texts into the local client's
+ * repeated -o pairs.
+ *
+ * @param {Array<string>} keys - Option keys in the order this call shows them.
+ * @param {Map<string, string>} texts - Key -> option text.
+ * @returns {Array<string>} The flat argument list.
+ */
+function optionArgs(keys, texts) {
+  const args = [];
+  for (const key of keys) args.push('-o', key + '=' + texts.get(key));
+  return args;
+}
+
+/**
+ * Judge one choice call: the pick it named, that pick's probability, and
+ * whether the call measured. A timeout is its own status. Any other non-zero
+ * exit, an unparseable body, or a choice outside the offered keys is
+ * unmeasured.
+ *
+ * @param {{ code: number|null, stdout: string, timedOut: boolean }} result - One spawnCall outcome.
+ * @param {Array<string>} keys - The keys this call offered.
+ * @returns {{ pick: string|null, pickProb: number|null, status: string }} The judged fields.
+ */
+function judgeChoice(result, keys) {
+  let pick = null;
+  let pickProb = null;
+  let status = 'unmeasured';
+  if (result.timedOut) {
+    status = 'unmeasured_timeout';
+  } else if (result.code === 0) {
+    /** @type {any} */
+    let parsed;
+    try {
+      parsed = JSON.parse(result.stdout);
+    } catch {
+      // Unparseable stdout is an unmeasured call.
+      parsed = undefined;
+    }
+    const choice = parsed?.answers?.answer?.choice;
+    if (keys.includes(choice)) {
+      pick = choice;
+      pickProb = parsed?.answers?.answer?.probabilities?.[pick] ?? null;
+      status = 'measured';
+    }
+  }
+  return { pick, pickProb, status };
+}
+
+/**
+ * The Deem choice arm: three rotated choice calls per labeled row, then the
+ * verdict. The payload line prints before the first call, so the cost is
+ * visible before anything spends. Exit 4 rechecks health: a dead server or a
+ * commit that changed mid-run stops the arm, otherwise the same call is
+ * spawned once more and judged. Exit 2, exit 3 and exit 130 stop the arm.
+ * Every spawn reaches calls.jsonl before any stop, so a stopped run keeps its
+ * records. A stop prints its line and the finished-row count and returns
+ * without a verdict.
+ *
+ * @param {Array<{ id: string, hub: string, prompt: string, alternatives: Array<string>, value: string }>} labeled - Rows carrying a resolvable label.
+ * @param {{ cmd: Array<string>, model: string, modelCommit: string, sourceCommit: string }} gate - Passed deem health result.
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, outDir: string | null, repoRoot: string, timeoutMs: number }} ctx - Output sink, environment, records directory, repository root and call timeout.
+ * @returns {Promise<object>} The counts with outcome, reason, p and the verdict line, or `{ stopped }`.
+ */
+async function runDeemArm(labeled, gate, ctx) {
+  const { out, env, outDir, repoRoot, timeoutMs } = ctx;
+  const K = labeled.length;
+  out(`deem: nothing leaves the machine planned_calls=${3 * K} est_wall_s=${(3 * K * DEEM_P50_MS / 1000).toFixed(1)}`);
+
+  const picks = new Map();
+
+  /**
+   * Print a stop's line and the rows that finished before it.
+   *
+   * @param {string} line - The stop line to print.
+   * @param {number} finished - Rows that finished before the stop.
+   * @returns {{ stopped: string }} The arm's stop result.
+   */
+  function stop(line, finished) {
+    out(line);
+    out(`deem: partial_rows=${finished}`);
+    return { stopped: line };
+  }
+
+  /**
+   * One choice spawn, with the exit-4 retry. The caller's persist records
+   * every spawn before a stop can be reported, so a stop still leaves that
+   * call on disk.
+   *
+   * @param {Array<string>} args - Arguments after the health command prefix.
+   * @param {string} text - The row prompt, written to stdin.
+   * @param {(result: { code: number|null, stdout: string, wallMs: number, timedOut: boolean }) => void} persist - Records one spawn.
+   * @returns {Promise<{ r: { code: number|null, stdout: string, wallMs: number, timedOut: boolean }, stop?: string }>} The final result and any stop line.
+   */
+  async function deemCall(args, text, persist) {
+    let r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], text, env, timeoutMs);
+    persist(r);
+    if (r.code === 4) {
+      const health = readDeemHealth(gate.cmd, env);
+      if (!health.ok) return { r, stop: 'deem arm stopped: server gone' };
+      if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+        return { r, stop: 'deem arm stopped: model commit changed mid-run' };
+      }
+      r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], text, env, timeoutMs);
+      persist(r);
+    }
+    /** @type {string | undefined} */
+    let stopLine;
+    if (r.code === 2) stopLine = 'deem arm stopped: usage error';
+    else if (r.code === 3) stopLine = 'deem arm stopped: backend refused';
+    else if (r.code === 130) stopLine = 'deem arm stopped: interrupted';
+    return { r, stop: stopLine };
+  }
+
+  let finished = 0;
+  for (const row of labeled) {
+    const keys = [...row.alternatives, NONE_KEY];
+    const texts = describeModes(repoRoot, row.hub, keys);
+    const rowPicks = [];
+    const orders = rotations(keys);
+
+    for (let order = 0; order < orders.length; order += 1) {
+      const args = ['choice', '-q', CHOICE_INSTRUCTION, ...optionArgs(orders[order], texts)];
+      const outcome = await deemCall(args, row.prompt, (result) => {
+        const fields = judgeChoice(result, keys);
+        writeCall(outDir, {
+          kind: 'choice',
+          backend: 'deem',
+          row_id: row.id,
+          order,
+          wall_ms: result.wallMs,
+          exit_code: result.code,
+          pick: fields.pick,
+          pick_prob: fields.pickProb,
+          status: fields.status,
+          model: gate.model,
+          model_commit: gate.modelCommit,
+          source_commit: gate.sourceCommit
+        });
+      });
+      if (outcome.stop) return stop(outcome.stop, finished);
+      rowPicks.push(judgeChoice(outcome.r, keys).pick);
+    }
+
+    picks.set(row.id, rowPicks);
+    finished += 1;
+  }
+
+  const counts = scoreColumn(labeled, picks);
+  const decision = decideVerdict(counts);
+  const line = verdictLine('deem', counts, decision, 'model=' + gate.model + ' model_commit=' + gate.modelCommit + ' source_commit=' + gate.sourceCommit);
+  out(line);
+  return { ...counts, outcome: decision.outcome, reason: decision.reason, p: decision.p, line };
+}
+
+/**
+ * The Jev choice arm: one auth test, then three rotated choice calls per
+ * labeled row, then the verdict. The payload line prints before any call, so
+ * the cost is visible before anything spends. A spawn that exits 4 is
+ * recorded as unmeasured and the same call is spawned once more after the
+ * backoff; the second result is judged. Exit 2, exit 3 and exit 130 stop the
+ * arm. Every spawn reaches calls.jsonl before any stop, so a stopped run
+ * keeps its records. A stop prints its line and the finished-row count and
+ * returns without a verdict.
+ *
+ * @param {Array<{ id: string, hub: string, prompt: string, alternatives: Array<string>, value: string }>} labeled - Rows carrying a resolvable label.
+ * @param {{ path: string, provider: string }} gate - Passed jev gate result.
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, outDir: string | null, repoRoot: string, timeoutMs: number, backoffMs: number }} ctx - Output sink, environment, records directory, repository root, call timeout and exit-4 retry wait.
+ * @returns {Promise<object>} The counts with outcome, reason, p and the verdict line, or `{ stopped }`.
+ */
+async function runJevArm(labeled, gate, ctx) {
+  const { out, env, outDir, repoRoot, timeoutMs, backoffMs } = ctx;
+  const K = labeled.length;
+  const provider = gate.provider;
+  let model = 'unknown';
+
+  let chars = 0;
+  for (const row of labeled) {
+    const keys = [...row.alternatives, NONE_KEY];
+    const texts = describeModes(repoRoot, row.hub, keys);
+    chars += row.prompt.length + CHOICE_INSTRUCTION.length;
+    for (const key of keys) chars += key.length + texts.get(key).length + 1;
+  }
+  chars *= 3;
+  out(`jev: payload=${JEV_PAYLOAD} planned_calls=${3 * K + 1} est_input_tokens=${Math.ceil(chars / 4)}`);
+
+  /**
+   * One spawn with the exit-4 retry. The caller's judge records every spawn
+   * before a stop can be reported, so a stop still leaves that call on disk.
+   *
+   * @param {Array<string>} args - Arguments after the executable.
+   * @param {string} text - Text written to the child's stdin.
+   * @param {{ kind: string, row_id: string | null, order: number | null }} fields - The fields that name this spawn in its record.
+   * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} The final spawn's result.
+   */
+  async function call(args, text, fields) {
+    let result = await spawnCall(gate.path, args, text, env, timeoutMs);
+    if (result.code === 4) {
+      writeCall(outDir, {
+        kind: fields.kind,
+        backend: 'jev',
+        row_id: fields.row_id,
+        order: fields.order,
+        wall_ms: result.wallMs,
+        exit_code: result.code,
+        pick: null,
+        pick_prob: null,
+        status: 'unmeasured',
+        jev_version: '0.6.2',
+        provider,
+        model
+      });
+      await new Promise((done) => { setTimeout(done, backoffMs); });
+      result = await spawnCall(gate.path, args, text, env, timeoutMs);
+    }
+    return result;
+  }
+
+  /**
+   * Print a stop's line and the rows that finished before it.
+   *
+   * @param {string} line - The stop line to print.
+   * @param {number} finished - Rows that finished before the stop.
+   * @returns {{ stopped: string }} The arm's stop result.
+   */
+  function stop(line, finished) {
+    out(line);
+    out(`jev: partial_rows=${finished}`);
+    return { stopped: line };
+  }
+
+  const auth = await call(['auth', 'test', '--provider', provider], '', { kind: 'auth_test', row_id: null, order: null });
+  if (auth.code === 0) {
+    try {
+      const body = JSON.parse(auth.stdout);
+      if (typeof body.model === 'string') model = body.model;
+    } catch {
+      // A non-JSON body leaves the model unknown.
+    }
+  }
+  writeCall(outDir, {
+    kind: 'auth_test',
+    backend: 'jev',
+    row_id: null,
+    order: null,
+    wall_ms: auth.wallMs,
+    exit_code: auth.code,
+    pick: null,
+    pick_prob: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jev_version: '0.6.2',
+    provider,
+    model
+  });
+  if (auth.code === 3) return stop('jev arm stopped: key rejected', 0);
+  if (auth.code === 130) return stop('jev arm stopped: interrupted', 0);
+  if (auth.code !== 0) return stop('jev arm stopped: auth test failed', 0);
+  out(`jev: auth_test provider=${provider} model=${model}`);
+
+  const picks = new Map();
+  let finished = 0;
+  for (const row of labeled) {
+    const keys = [...row.alternatives, NONE_KEY];
+    const texts = describeModes(repoRoot, row.hub, keys);
+    const rowPicks = [];
+    const orders = rotations(keys);
+
+    for (let order = 0; order < orders.length; order += 1) {
+      const args = ['choice', '--provider', provider, '-q', CHOICE_INSTRUCTION, ...optionArgs(orders[order], texts)];
+      const result = await call(args, row.prompt, { kind: 'choice', row_id: row.id, order });
+      const fields = judgeChoice(result, keys);
+      if (fields.status === 'measured') {
+        try {
+          const body = JSON.parse(result.stdout);
+          if (typeof body.model === 'string') model = body.model;
+        } catch {
+          // judgeChoice already parsed this measured body; a failure here leaves the model as it was.
+        }
+      }
+      writeCall(outDir, {
+        kind: 'choice',
+        backend: 'jev',
+        row_id: row.id,
+        order,
+        wall_ms: result.wallMs,
+        exit_code: result.code,
+        pick: fields.pick,
+        pick_prob: fields.pickProb,
+        status: fields.status,
+        jev_version: '0.6.2',
+        provider,
+        model
+      });
+      /** @type {string | undefined} */
+      let stopLine;
+      if (result.code === 2) stopLine = 'jev arm stopped: usage error';
+      else if (result.code === 3) stopLine = 'jev arm stopped: key rejected';
+      else if (result.code === 130) stopLine = 'jev arm stopped: interrupted';
+      if (stopLine !== undefined) return stop(stopLine, finished);
+      rowPicks.push(fields.pick);
+    }
+
+    picks.set(row.id, rowPicks);
+    finished += 1;
+  }
+
+  const counts = scoreColumn(labeled, picks);
+  const decision = decideVerdict(counts);
+  const line = verdictLine('jev', counts, decision, 'jev_version=0.6.2 provider=' + provider + ' model=' + model);
+  out(line);
+  return { ...counts, outcome: decision.outcome, reason: decision.reason, p: decision.p, line };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. CLI
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parse the census CLI flags.
+ *
+ * @param {Array<string>} argv - Arguments after the script name.
+ * @returns {{ report: string | null, rowsOut: string | null, transcripts: string | null, score: string | null, jev: boolean, deem: boolean, out: string | null, error: string | null }} Parsed flags, or the first argument error.
+ */
+function parseArgs(argv) {
+  const args = { report: null, rowsOut: null, transcripts: null, score: null, jev: false, deem: false, out: null, error: null };
+  for (let i = 0; i < argv.length; i += 1) {
+    const token = argv[i];
+    if (token === '--jev' || token === '--deem') {
+      if (token === '--jev') args.jev = true;
+      else args.deem = true;
+      continue;
+    }
+    if (token !== '--report' && token !== '--rows-out' && token !== '--transcripts' && token !== '--score' && token !== '--out') {
+      args.error = 'unknown argument ' + token;
+      return args;
+    }
+    const value = argv[i + 1];
+    if (value === undefined || value.startsWith('--')) {
+      args.error = 'missing value for ' + token;
+      return args;
+    }
+    if (token === '--report') args.report = value;
+    else if (token === '--rows-out') args.rowsOut = value;
+    else if (token === '--transcripts') args.transcripts = value;
+    else if (token === '--out') args.out = value;
+    else args.score = value;
+    i += 1;
+  }
+  if (args.score !== null && (args.report !== null || args.rowsOut !== null || args.transcripts !== null)) {
+    args.error = '--score runs alone';
+  }
+  if ((args.jev || args.deem) && args.score === null) {
+    args.error = '--jev and --deem need --score <file>';
+  }
+  return args;
+}
+
+/**
+ * Format the census report: a header, one line per hub/source cell, the
+ * summed total, and the corpus coverage line.
+ *
+ * @param {Object} census - Cells keyed by hub, then source (runCensus output).
+ * @param {{ rows: number, none: number, skillFiring: number, mapped: number, noCompiledHub: number, unparsedLines: number }} corpusSummary - Corpus tally.
+ * @param {Array<string>} hubs - Hub ids, in report order.
+ * @returns {Array<string>} Report lines.
+ */
+function censusLines(census, corpusSummary, hubs) {
+  const fields = [
+    ['prompts', 'prompts'],
+    ['unparsed', 'unparsed'],
+    ['route', 'route'],
+    ['clarify', 'clarify'],
+    ['defer', 'defer'],
+    ['reject', 'reject'],
+    ['clarifyMode', 'clarify_mode'],
+    ['clarifyChecklist', 'clarify_checklist'],
+    ['goldInAlternatives', 'gold_in_alternatives']
+  ];
+  const pairs = (cell) => fields.map(([key, label]) => `${label}=${cell[key]}`).join(' ');
+
+  const totals = emptyCell();
+  for (const sources of Object.values(census)) {
+    for (const cell of Object.values(sources)) {
+      for (const [key] of fields) totals[key] += cell[key];
+    }
+  }
+
+  const lines = [`census: zero model calls, ${totals.prompts} prompts replayed through each hub's compiled engine`];
+  for (const hub of hubs) {
+    for (const source of SOURCES) {
+      const cell = census[hub] && census[hub][source];
+      if (cell) lines.push(`hub=${hub} source=${source} ${pairs(cell)}`);
+    }
+  }
+  lines.push(`total ${pairs(totals)}`);
+  lines.push(`corpus: rows=${corpusSummary.rows} none=${corpusSummary.none} skill_firing=${corpusSummary.skillFiring} mapped=${corpusSummary.mapped} no_compiled_hub=${corpusSummary.noCompiledHub} unparsed_lines=${corpusSummary.unparsedLines}`);
+  return lines;
+}
+
+/**
+ * Score a labeled rows file: gate the label count, report the first-alternative
+ * baseline and the fixed keep rule, and say whether a ten-point gain still
+ * fits; with --jev and --deem, run the choice arms and file their columns.
+ * Arithmetic over the labels on disk; an arm is the only part that calls a
+ * model.
+ *
+ * @param {{ score: string, jev: boolean, deem: boolean, out: string | null }} args - Parsed CLI flags.
+ * @param {{ out: (line: string) => void, err: (line: string) => void, repoRoot: string, env: Record<string, string | undefined>, timeoutMs: number, jevTimeoutMs: number, backoffMs: number }} deps - Output sinks, repository root, environment, the two call timeouts and the jev retry wait.
+ * @returns {Promise<number>} The process exit code.
+ */
+async function runScoreCommand(args, deps) {
+  const { out, err, repoRoot, env, timeoutMs, jevTimeoutMs, backoffMs } = deps;
+
+  let rows;
+  try {
+    rows = readRows(args.score);
+  } catch (error) {
+    err('error: ' + error.message);
+    return 2;
+  }
+
+  const { labeled, foreign } = labelRows(rows);
+  if (foreign.length > 0) {
+    for (const entry of foreign) {
+      err('error: row ' + entry.id + ' label "' + entry.value + '" is not one of its alternatives or ' + NONE_KEY);
+    }
+    return 2;
+  }
+
+  const K = labeled.length;
+  const operator = labeled.filter((row) => row.valueSource === 'label').length;
+  const committedGold = labeled.filter((row) => row.valueSource === 'gold').length;
+  out('rows: ' + rows.length + ' labeled=' + K + ' operator=' + operator + ' committed_gold=' + committedGold);
+
+  if (K < LABEL_GATE) {
+    out('stop: fewer than 30 labeled rows (' + K + ' labeled)');
+    return 0;
+  }
+
+  const B = labeled.filter((row) => row.alternatives[0] === row.value).length;
+  const digest = optionsDigest(labeled, repoRoot);
+  out('baseline: first alternative right on ' + B + '/' + K);
+  out(MARGIN_LINE);
+  out(KEEP_RULE_LINE);
+  out('instruction: -q "' + CHOICE_INSTRUCTION + '"');
+  out('options: ' + digest.count + ' sha256=' + digest.sha256 + ' none="' + NONE_DESCRIPTION + '"');
+  out('orders: ' + ORDERS + ', router order with none_of_these last, then rotated left by 1 and by 2');
+
+  if (10 * B > 9 * K) {
+    out('no headroom: the first alternative is right on ' + B + '/' + K + ', above 0.90');
+    return 0;
+  }
+  out('headroom: a 10-point gain fits above ' + B + '/' + K);
+
+  const columns = {};
+  if (args.jev) {
+    const gate = jevGate({ out, env });
+    columns.jev = gate.passed
+      ? await runJevArm(labeled, gate, { out, env, outDir: args.out, repoRoot, timeoutMs: jevTimeoutMs, backoffMs })
+      : { skipped: true };
+  }
+  if (args.deem) {
+    const gate = deemGate({ out, env, repoRoot });
+    columns.deem = gate.passed
+      ? await runDeemArm(labeled, gate, { out, env, outDir: args.out, repoRoot, timeoutMs })
+      : { skipped: true };
+  }
+  if (args.jev || args.deem) {
+    fs.mkdirSync(args.out, { recursive: true });
+    fs.writeFileSync(path.join(args.out, 'report.json'), JSON.stringify({ K, B, columns }, null, 2) + '\n');
+  }
+  return 0;
+}
+
+/**
+ * Run the clarify census and emit its report.
+ *
+ * @param {Array<string>} argv - Arguments after the script name.
+ * @param {{ out?: (line: string) => void, err?: (line: string) => void, repoRoot?: string, env?: Record<string, string | undefined>, timeoutMs?: number, backoffMs?: number }} [deps] - Injectable output sinks, repository root, environment, call timeout and exit-4 retry wait.
+ * @returns {Promise<number>} The process exit code.
+ */
+async function main(argv, deps = {}) {
+  const out = deps.out || ((line) => process.stdout.write(line + '\n'));
+  const err = deps.err || ((line) => process.stderr.write(line + '\n'));
+  const env = deps.env || process.env;
+
+  const args = parseArgs(argv);
+  if (args.error) {
+    err('error: ' + args.error);
+    err(USAGE);
+    return 2;
+  }
+
+  if ((args.jev || args.deem) && !args.out) {
+    err('error: --jev and --deem need --out <dir>');
+    return 2;
+  }
+
+  const repoRoot = deps.repoRoot || REPO_ROOT;
+  const timeoutMs = deps.timeoutMs || DEEM_TIMEOUT_MS;
+  const jevTimeoutMs = deps.timeoutMs || JEV_TIMEOUT_MS;
+  const backoffMs = deps.backoffMs || BACKOFF_MS;
+  if (args.score) return await runScoreCommand(args, { out, err, repoRoot, env, timeoutMs, jevTimeoutMs, backoffMs });
+
+  if (args.transcripts) {
+    const stat = fs.statSync(args.transcripts, { throwIfNoEntry: false });
+    if (!stat || !stat.isDirectory()) {
+      err('error: --transcripts is not a directory: ' + args.transcripts);
+      return 2;
+    }
+  }
+  const transcriptCount = args.transcripts ? countTranscripts(args.transcripts) : null;
+
+  const { loadHubEngine, HUB_CHILD } = require(path.join(repoRoot, COMPILED_ROUTE_MODULE));
+  const hubs = Object.keys(HUB_CHILD);
+  const registries = {};
+  for (const hub of hubs) registries[hub] = readRegistry(repoRoot, hub);
+
+  const canary = loadCanaryPrompts(repoRoot, HUB_CHILD);
+  const playbook = loadPlaybookPrompts(repoRoot, hubs);
+  const { records: corpus, summary } = loadCorpusPrompts(repoRoot, registries);
+
+  const { cells, rows } = runCensus(
+    [...canary, ...playbook, ...corpus],
+    loadHubEngine,
+    (hub) => (registries[hub] ? registries[hub].modes : new Set())
+  );
+
+  for (const line of censusLines(cells, summary, hubs)) out(line);
+  if (transcriptCount) {
+    for (const line of transcriptLines(transcriptCount)) out(line);
+  } else {
+    out('real clarify rate: not measured');
+  }
+
+  if (args.rowsOut) {
+    fs.mkdirSync(path.dirname(args.rowsOut), { recursive: true });
+    const lines = rowLines(rows);
+    fs.writeFileSync(args.rowsOut, lines.length > 0 ? lines.join('\n') + '\n' : '');
+    const withGold = rows.filter((r) => r.gold !== null).length;
+    out(`rows written: ${rows.length} with_gold=${withGold} file=${args.rowsOut}`);
+  }
+
+  if (args.report) {
+    fs.mkdirSync(args.report, { recursive: true });
+    const rowsWithGold = rows.filter((r) => r.gold !== null).length;
+    const clarifyTotal = transcriptCount ? Object.values(transcriptCount.byHub).reduce((sum, cell) => sum + cell.clarify, 0) : 0;
+    const actionTotal = transcriptCount ? Object.values(transcriptCount.byHub).reduce((sum, cell) => sum + cell.route + cell.clarify + cell.defer + cell.reject, 0) : 0;
+    const report = {
+      cells,
+      corpus: summary,
+      realClarifyRate: transcriptCount ? { clarify: clarifyTotal, total: actionTotal } : null,
+      transcripts: transcriptCount,
+      rows: rows.length,
+      rowsWithGold
+    };
+    fs.writeFileSync(path.join(args.report, 'report.json'), JSON.stringify(report, null, 2) + '\n');
+    out(`report written: ${args.report}/report.json`);
+  }
+
+  return 0;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 11. EXPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+module.exports = {
+  NONE_KEY,
+  SOURCES,
+  ACTIONS,
+  emptyCell,
+  modeAlternatives,
+  runCensus,
+  readRegistry,
+  hubForSkill,
+  loadCanaryPrompts,
+  loadPlaybookPrompts,
+  loadCorpusPrompts,
+  rowLines,
+  countTranscripts,
+  transcriptLines,
+  readRows,
+  labelRows,
+  describeModes,
+  optionsDigest,
+  tailP,
+  modalPick,
+  decideVerdict,
+  scoreColumn,
+  formatP,
+  verdictLine,
+  which,
+  jevGate,
+  deemCommand,
+  readDeemHealth,
+  deemGate,
+  spawnCall,
+  writeCall,
+  rotations,
+  optionArgs,
+  judgeChoice,
+  runDeemArm,
+  runJevArm,
+  parseArgs,
+  censusLines,
+  main
+};
+
+if (require.main === module) {
+  main(process.argv.slice(2)).then((code) => {
+    process.exitCode = code;
+  });
+}
diff --git a/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs b/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs
new file mode 100644
index 0000000000..66b89261bb
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs
@@ -0,0 +1,646 @@
+#!/usr/bin/env node
+// ╔══════════════════════════════════════════════════════════════════════════╗
+// ║ score-clarify-default.test — census, gate and verdict coverage           ║
+// ╚══════════════════════════════════════════════════════════════════════════╝
+'use strict';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const test = require('node:test');
+const assert = require('node:assert/strict');
+const fs = require('node:fs');
+const os = require('node:os');
+const path = require('node:path');
+const { spawnSync } = require('node:child_process');
+
+const S = require('../score-clarify-default.cjs');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. HELPERS
+// ─────────────────────────────────────────────────────────────────────────────
+
+function engineFrom(map) {
+  return () => ({
+    snapshot: {},
+    evaluate: (snap, input) => {
+      if (input.prompt === 'boom') throw new Error('engine failed');
+      return map[input.prompt];
+    }
+  });
+}
+
+const clarify = (alternatives) => ({ decision: { action: 'clarify', clarify: { alternatives } } });
+const route = () => ({ decision: { action: 'route' } });
+const modes = () => new Set(['mode-a', 'mode-b']);
+
+const SCRIPT = path.join(__dirname, '..', 'score-clarify-default.cjs');
+
+function writeRowsFile(dir, labels) {
+  const lines = labels.map((label, i) => JSON.stringify({
+    id: 'r' + i,
+    hub: 'cli-external-orchestration',
+    source: 'canary',
+    prompt: 'row ' + i + ' pick=' + (label === 'first' ? 'cli-claude-code' : 'cli-codex') + ' first=cli-claude-code',
+    alternatives: ['cli-claude-code', 'cli-codex'],
+    gold: null,
+    label: label === 'second' ? 'cli-codex' : label === 'first' ? 'cli-claude-code' : ''
+  }));
+  const file = path.join(dir, 'rows.jsonl');
+  fs.writeFileSync(file, lines.join('\n') + '\n');
+  return file;
+}
+
+function runScript(args) {
+  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
+}
+
+function makeStubs(opts = {}) {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-stubs-'));
+  const log = path.join(dir, 'calls.log');
+
+  const choice = [
+    '  choice)',
+    '    text=$(cat)',
+    '    case "$text" in *fail*) exit 1 ;; esac',
+    '    if [ -n "$STUB_CHOICE_EXIT" ]; then exit "$STUB_CHOICE_EXIT"; fi',
+    '    if [ "$STUB_PICK" = "first" ]; then',
+    "      key=$(printf '%s' \"$text\" | sed -n 's/.*first=\\([^ ]*\\).*/\\1/p')",
+    '    else',
+    "      key=$(printf '%s' \"$text\" | sed -n 's/.*pick=\\([^ ]*\\).*/\\1/p')",
+    '    fi',
+    '    printf \'{"answers":{"answer":{"choice":"%s","probabilities":{"%s":0.9}}},"model":"stub-jev-model"}\\n\' "$key" "$key"',
+    '    ;;'
+  ];
+
+  const scripts = {
+    jev: [
+      '#!/bin/sh',
+      `printf '%s %s\\n' "jev" "$*" >> "$STUB_LOG"`,
+      'case "$1" in',
+      '  --version) echo "${STUB_JEV_VERSION:-jev 0.6.2}" ;;',
+      '  auth)',
+      '    case "$2" in',
+      '      status) exit "${STUB_AUTH_EXIT:-0}" ;;',
+      '      test) echo \'{"model":"stub-jev-model"}\' ;;',
+      '      *) exit 2 ;;',
+      '    esac ;;',
+      ...choice,
+      '  *) exit 2 ;;',
+      'esac'
+    ].join('\n') + '\n',
+    'cli-deem': [
+      '#!/bin/sh',
+      `printf '%s %s\\n' "cli-deem" "$*" >> "$STUB_LOG"`,
+      'case "$1" in',
+      '  health)',
+      '    case "${STUB_HEALTH:-ok}" in',
+      '      ok) echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"mc1","source_commit":"sc1"}\' ;;',
+      '      stub) echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"mc1","source_commit":"sc1"}\' ;;',
+      '      down) echo \'{"error":"unreachable"}\' >&2; exit 4 ;;',
+      '      model) echo \'{"ok":true,"backend":"torch","model":"deem-9b-v1","model_commit":"mc1","source_commit":"sc1"}\' ;;',
+      '      bad) echo \'not json\' ;;',
+      '    esac ;;',
+      ...choice,
+      '  *) exit 2 ;;',
+      'esac'
+    ].join('\n') + '\n'
+  };
+
+  const write = (name) => {
+    const file = path.join(dir, name);
+    fs.writeFileSync(file, scripts[name]);
+    fs.chmodSync(file, 0o755);
+  };
+  write('cli-deem');
+  if (opts.jev !== false) write('jev');
+
+  return { dir, log };
+}
+
+function runWithStubs(stubs, args, extraEnv = {}) {
+  return spawnSync(process.execPath, [SCRIPT, ...args], {
+    encoding: 'utf8',
+    env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, ...extraEnv }
+  });
+}
+
+function withoutLines(text, drop) {
+  return text.split('\n').filter((line) => !drop.includes(line)).join('\n');
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. TESTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+test('census counts a mode clarify and keeps only gold among its alternatives', () => {
+  const prompts = [
+    { id: 'c1', hub: 'hub-x', source: 'playbook', prompt: 'tie', gold: 'mode-b' },
+    { id: 'c2', hub: 'hub-x', source: 'playbook', prompt: 'tie2', gold: 'mode-z' },
+    { id: 'r1', hub: 'hub-x', source: 'playbook', prompt: 'go', gold: null }
+  ];
+  const engineFor = engineFrom({
+    tie: clarify(['mode-a', 'mode-b', 'none_of_these']),
+    tie2: clarify(['mode-a', 'mode-b', 'none_of_these']),
+    go: route()
+  });
+
+  const { cells, rows } = S.runCensus(prompts, engineFor, modes);
+
+  assert.deepEqual(cells['hub-x'].playbook, {
+    prompts: 3,
+    unparsed: 0,
+    route: 1,
+    clarify: 2,
+    defer: 0,
+    reject: 0,
+    clarifyMode: 2,
+    clarifyChecklist: 0,
+    goldInAlternatives: 1
+  });
+  assert.deepEqual(rows, [
+    { id: 'c1', hub: 'hub-x', source: 'playbook', prompt: 'tie', alternatives: ['mode-a', 'mode-b'], gold: 'mode-b' },
+    { id: 'c2', hub: 'hub-x', source: 'playbook', prompt: 'tie2', alternatives: ['mode-a', 'mode-b'], gold: null }
+  ]);
+});
+
+test('census counts a missing prompt, an engine throw and an unknown hub as unparsed', () => {
+  const prompts = [
+    { id: 'u1', hub: 'hub-x', source: 'canary', prompt: null, gold: null },
+    { id: 'u2', hub: 'hub-x', source: 'canary', prompt: 'boom', gold: null },
+    { id: 'u3', hub: 'hub-gone', source: 'canary', prompt: 'go', gold: null }
+  ];
+  const engineFor = (hub) => {
+    if (hub === 'hub-gone') throw new Error('unknown hub');
+    return engineFrom({ go: route() })();
+  };
+
+  const { cells, rows } = S.runCensus(prompts, engineFor, modes);
+
+  assert.equal(cells['hub-x'].canary.prompts, 2);
+  assert.equal(cells['hub-x'].canary.unparsed, 2);
+  assert.equal(cells['hub-gone'].canary.prompts, 1);
+  assert.equal(cells['hub-gone'].canary.unparsed, 1);
+  assert.equal(rows.length, 0);
+});
+
+test('census keeps checklist alternatives apart and writes no row for them', () => {
+  const prompts = [
+    { id: 'q1', hub: 'hub-x', source: 'canary', prompt: 'ask', gold: null }
+  ];
+  const engineFor = engineFrom({
+    ask: clarify(['Name the matching command.', 'Confirm the target.', 'none_of_these'])
+  });
+
+  const { cells, rows } = S.runCensus(prompts, engineFor, modes);
+
+  assert.equal(cells['hub-x'].canary.clarify, 1);
+  assert.equal(cells['hub-x'].canary.clarifyChecklist, 1);
+  assert.equal(cells['hub-x'].canary.clarifyMode, 0);
+  assert.deepEqual(rows, []);
+});
+
+test('rowLines writes every label empty', () => {
+  const row = { id: 'a', hub: 'h', source: 'canary', prompt: 'p', alternatives: ['m1', 'm2'], gold: 'm2' };
+  const parsed = JSON.parse(S.rowLines([row])[0]);
+
+  assert.deepEqual(parsed, { ...row, label: '' });
+  assert.deepEqual(Object.keys(parsed), ['id', 'hub', 'source', 'prompt', 'alternatives', 'gold', 'label']);
+});
+
+test('parseArgs reads both census flags and refuses an unknown flag or a missing value', () => {
+  const args = S.parseArgs(['--report', 'r', '--rows-out', 'f']);
+  assert.equal(args.report, 'r');
+  assert.equal(args.rowsOut, 'f');
+  assert.equal(args.error, null);
+
+  assert.equal(S.parseArgs(['--bogus']).error, 'unknown argument --bogus');
+  assert.equal(S.parseArgs(['--rows-out']).error, 'missing value for --rows-out');
+});
+
+test('hubForSkill maps a hub id and a mode packet and nothing else', () => {
+  const registries = { 'hub-a': { modes: new Set(['m1']), packets: new Map([['m1', 'pkt-1']]) } };
+
+  assert.equal(S.hubForSkill('hub-a', registries), 'hub-a');
+  assert.equal(S.hubForSkill('pkt-1', registries), 'hub-a');
+  assert.equal(S.hubForSkill('m1', registries), 'hub-a');
+  assert.equal(S.hubForSkill('sk-git', registries), null);
+});
+
+test('countTranscripts counts each front-door line once, escaped or plain', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-tx-'));
+  try {
+    fs.writeFileSync(path.join(dir, 'a.jsonl'), [
+      '{"hubId":"sk-doc","action":"clarify","selectionKind":null,"targets":[]}',
+      JSON.stringify({ content: '{"hubId":"sk-code","action":"route"}', copy: '{"hubId":"sk-code","action":"route"}' }),
+      '{"note":"secret-prompt-text"}'
+    ].join('\n') + '\n');
+
+    const result = S.countTranscripts(dir);
+
+    assert.equal(result.files, 1);
+    assert.equal(result.linesMatched, 2);
+    assert.equal(result.byHub['sk-doc'].clarify, 1);
+    assert.equal(result.byHub['sk-code'].route, 1);
+    assert.deepEqual(result.perFile, [{ file: 'a.jsonl', lines: 2 }]);
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+test('the transcript count prints counts and no transcript text', { timeout: 120000 }, () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-tx-'));
+  try {
+    fs.writeFileSync(path.join(dir, 'a.jsonl'), [
+      '{"hubId":"sk-doc","action":"clarify","selectionKind":null,"targets":[]}',
+      JSON.stringify({ content: '{"hubId":"sk-code","action":"route"}', copy: '{"hubId":"sk-code","action":"route"}' }),
+      '{"note":"secret-prompt-text"}'
+    ].join('\n') + '\n');
+
+    const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'score-clarify-default.cjs'), '--transcripts', dir], { encoding: 'utf8' });
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('transcripts: files=1 lines_matched=2'));
+    assert.ok(result.stdout.includes('real clarify rate: 1/2'));
+    assert.ok(!result.stdout.includes('secret-prompt-text'));
+    assert.ok(!result.stdout.includes('real clarify rate: not measured'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+test('the gate stops at 29 labeled rows', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  try {
+    const file = writeRowsFile(dir, [...Array(29).fill('second'), '', '', '']);
+    const result = runScript(['--score', file]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('rows: 32 labeled=29 operator=29 committed_gold=0'));
+    assert.ok(result.stdout.includes('stop: fewer than 30 labeled rows (29 labeled)'));
+    assert.ok(!result.stdout.includes('margin:'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+test('30 labeled rows pass the gate and print the fixed rule lines', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const result = runScript(['--score', file]);
+
+    assert.equal(result.status, 0);
+    assert.ok(!result.stdout.includes('stop: fewer'));
+    assert.ok(result.stdout.includes('baseline: first alternative right on 0/30'));
+    assert.ok(result.stdout.includes('margin: 0.10'));
+    assert.ok(result.stdout.includes('keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M'));
+    assert.ok(result.stdout.includes('headroom: a 10-point gain fits above 0/30'));
+    assert.match(result.stdout, /^options: 3 sha256=[0-9a-f]{64} none="None of these modes"$/m);
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+test("a label outside the row's alternatives exits 2 and names the row", () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
+    rows[4].label = 'cli-bogus';
+    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
+
+    const result = runScript(['--score', file]);
+
+    assert.equal(result.status, 2);
+    assert.equal(result.stdout, '');
+    assert.ok(result.stderr.includes('row r4 label "cli-bogus"'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+test('a baseline above nine tenths prints no headroom', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  try {
+    const file = writeRowsFile(dir, [...Array(28).fill('first'), 'second', 'second']);
+    const result = runScript(['--score', file]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('no headroom: the first alternative is right on 28/30, above 0.90'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+test('tailP is exact', () => {
+  assert.equal(S.tailP(0, 0).p, 1);
+  assert.equal(S.tailP(20, 20).p, 2 ** -20);
+  assert.equal(S.tailP(10, 5).num, 638n);
+  assert.equal(S.tailP(10, 5).den, 1024n);
+});
+
+test('decideVerdict checks coverage, kill, margin, sign test and flips in order', () => {
+  const cases = [
+    [{ K: 30, M: 26, A: 26, B: 0, W: 26, L: 0, F: 0 }, 'stop', 'coverage'],
+    [{ K: 30, M: 30, A: 0, B: 20, W: 0, L: 20, F: 0 }, 'kill', null],
+    [{ K: 30, M: 30, A: 0, B: 0, W: 0, L: 0, F: 0 }, 'stop', 'margin'],
+    [{ K: 30, M: 30, A: 5, B: 2, W: 5, L: 2, F: 0 }, 'stop', 'sign test'],
+    [{ K: 30, M: 30, A: 30, B: 0, W: 30, L: 0, F: 10 }, 'stop', 'flips'],
+    [{ K: 30, M: 30, A: 30, B: 0, W: 30, L: 0, F: 0 }, 'keep', null]
+  ];
+
+  for (const [counts, outcome, reason] of cases) {
+    const decision = S.decideVerdict(counts);
+    assert.equal(decision.outcome, outcome, JSON.stringify(counts));
+    assert.equal(decision.reason, reason, JSON.stringify(counts));
+  }
+});
+
+test('scoreColumn counts measured, unstable and flips', () => {
+  const labeled = [
+    { id: 'a', alternatives: ['m1', 'm2'], value: 'm2' },
+    { id: 'b', alternatives: ['m1', 'm2'], value: 'm1' },
+    { id: 'c', alternatives: ['m1', 'm2'], value: 'm2' }
+  ];
+  const answers = new Map([
+    ['a', ['m2', 'm2', 'm2']],
+    ['b', ['m1', 'm2', 'none_of_these']],
+    ['c', ['m2', 'm2', null]]
+  ]);
+
+  const counts = S.scoreColumn(labeled, answers);
+
+  assert.deepEqual(counts, { K: 3, M: 2, A: 1, B: 1, W: 1, L: 1, F: 3, unstable: 1, abstained: 0 });
+  assert.equal(
+    S.verdictLine('deem', counts, { outcome: 'stop', reason: 'coverage', p: 0.5 }, 'model=x'),
+    'verdict deem: stop (coverage) K=3 M=2 A=1 B=1 W=1 L=1 F=3 p=0.5000 model=x'
+  );
+});
+
+test('--deem without --out exits 2 before any output', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const result = runScript(['--score', file, '--deem']);
+
+    assert.equal(result.status, 2);
+    assert.equal(result.stdout, '');
+    assert.ok(result.stderr.includes('error: --jev and --deem need --out <dir>'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+  }
+});
+
+test('a stub or unreachable deem backend skips the arm and leaves the rest byte-identical', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const out = path.join(dir, 'out');
+    const base = runWithStubs(stubs, ['--score', file]);
+    assert.equal(base.status, 0);
+
+    const stub = runWithStubs(stubs, ['--score', file, '--deem', '--out', out], { STUB_HEALTH: 'stub' });
+    assert.equal(stub.status, 0);
+    assert.ok(stub.stdout.includes('deem arm skipped: stub backend'));
+    assert.equal(withoutLines(stub.stdout, ['deem arm skipped: stub backend']), base.stdout);
+
+    const down = runWithStubs(stubs, ['--score', file, '--deem', '--out', out], { STUB_HEALTH: 'down' });
+    assert.equal(down.status, 0);
+    assert.ok(down.stdout.includes('deem arm skipped: not reachable'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('a jev without a credential prints its identity and one skip line', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const identity = 'jev: path=' + path.join(stubs.dir, 'jev') + ' provider=official';
+    const base = runWithStubs(stubs, ['--score', file]);
+    const result = runWithStubs(stubs, ['--score', file, '--jev', '--out', path.join(dir, 'out')], { STUB_AUTH_EXIT: '3' });
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes(identity));
+    assert.ok(result.stdout.includes('jev arm skipped: no credential'));
+    assert.equal(withoutLines(result.stdout, [identity, 'jev arm skipped: no credential']), base.stdout);
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('jev off PATH and a wrong jev version each skip', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const absent = makeStubs({ jev: false });
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+
+    const missing = runWithStubs(absent, ['--score', file, '--jev', '--out', path.join(dir, 'out')]);
+    assert.equal(missing.status, 0);
+    assert.ok(missing.stdout.includes('jev: path=none provider=official'));
+    assert.ok(missing.stdout.includes('jev arm skipped: jev not on PATH'));
+
+    const wrong = runWithStubs(stubs, ['--score', file, '--jev', '--out', path.join(dir, 'out')], { STUB_JEV_VERSION: 'jev 0.5.0' });
+    assert.equal(wrong.status, 0);
+    assert.ok(wrong.stdout.includes('jev arm skipped: version'));
+    assert.ok(wrong.stdout.includes('jev: found="jev 0.5.0" path=' + path.join(stubs.dir, 'jev')));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(absent.dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('a deem stub that answers the label keeps', { timeout: 120000 }, () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const out = path.join(dir, 'out');
+    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', out]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('deem: nothing leaves the machine planned_calls=90 est_wall_s=5.9'));
+    assert.ok(result.stdout.includes('verdict deem: keep K=30 M=30 A=30 B=0 W=30 L=0 F=0 p=9.313e-10 model=deem-0.8-v1 model_commit=mc1 source_commit=sc1'));
+    assert.equal(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').length, 90);
+    assert.equal(JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')).columns.deem.outcome, 'keep');
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('a deem stub that answers the first alternative stops on margin', { timeout: 120000 }, () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')], { STUB_PICK: 'first' });
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('verdict deem: stop (margin) K=30 M=30 A=0 B=0 W=0 L=0 F=0'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('a deem stub that loses to the baseline kills', { timeout: 120000 }, () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const rows = [];
+    for (let i = 0; i < 20; i += 1) {
+      rows.push({
+        id: 'r' + i,
+        hub: 'cli-external-orchestration',
+        source: 'canary',
+        prompt: 'row ' + i + ' pick=cli-codex first=cli-claude-code',
+        alternatives: ['cli-claude-code', 'cli-codex'],
+        gold: null,
+        label: 'cli-claude-code'
+      });
+    }
+    for (let i = 20; i < 30; i += 1) {
+      rows.push({
+        id: 'r' + i,
+        hub: 'cli-external-orchestration',
+        source: 'canary',
+        prompt: 'row ' + i + ' pick=cli-claude-code first=cli-claude-code',
+        alternatives: ['cli-claude-code', 'cli-codex'],
+        gold: null,
+        label: 'cli-codex'
+      });
+    }
+    const file = path.join(dir, 'rows.jsonl');
+    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
+
+    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('verdict deem: kill K=30 M=30 A=0 B=20 W=0 L=20 F=0'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('four failing deem calls in thirty rows stop on coverage', { timeout: 120000 }, () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
+    for (let i = 0; i < 4; i += 1) rows[i].prompt += ' fail';
+    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
+
+    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('verdict deem: stop (coverage) K=30 M=26'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('the label gate blocks the deem arm before any call', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(29).fill('second'));
+    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('stop: fewer than 30 labeled rows (29 labeled)'));
+    assert.ok(!fs.existsSync(stubs.log) || fs.readFileSync(stubs.log, 'utf8') === '');
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('a jev stub that answers the label keeps', { timeout: 120000 }, () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const out = path.join(dir, 'out');
+    const result = runWithStubs(stubs, ['--score', file, '--jev', '--out', out]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('planned_calls=91'));
+    assert.ok(result.stdout.includes('jev: auth_test provider=official model=stub-jev-model'));
+    assert.ok(result.stdout.includes('verdict jev: keep K=30 M=30 A=30 B=0 W=30 L=0 F=0 p=9.313e-10 jev_version=0.6.2 provider=official model=stub-jev-model'));
+    assert.equal(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').length, 91);
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('with both switches the jev verdict prints before the deem verdict', { timeout: 120000 }, () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const result = runWithStubs(stubs, ['--score', file, '--jev', '--deem', '--out', path.join(dir, 'out')]);
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('verdict jev:'));
+    assert.ok(result.stdout.includes('verdict deem:'));
+    assert.ok(result.stdout.indexOf('verdict jev:') < result.stdout.indexOf('verdict deem:'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('a rejected key stops the jev arm with no verdict', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const file = writeRowsFile(dir, Array(30).fill('second'));
+    const result = runWithStubs(stubs, ['--score', file, '--jev', '--out', path.join(dir, 'out')], { STUB_CHOICE_EXIT: '3' });
+
+    assert.equal(result.status, 0);
+    assert.ok(result.stdout.includes('jev arm stopped: key rejected'));
+    assert.ok(result.stdout.includes('jev: partial_rows=0'));
+    assert.ok(!result.stdout.includes('verdict jev:'));
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
+
+test('a deem stub with another model or an unreadable health answer skips with a details line', () => {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
+  const stubs = makeStubs();
+  try {
+    const rows = writeRowsFile(dir, Array(30).fill('second'));
+    const base = runWithStubs(stubs, ['--score', rows]);
+    assert.equal(base.status, 0);
+
+    const model = runWithStubs(stubs, ['--score', rows, '--deem', '--out', path.join(dir, 'out-model')], { STUB_HEALTH: 'model' });
+    assert.equal(model.status, 0);
+    assert.ok(model.stdout.includes('deem arm skipped: model'));
+    assert.ok(model.stdout.includes('deem: found="deem-9b-v1"'));
+    assert.equal(withoutLines(model.stdout, ['deem arm skipped: model', 'deem: found="deem-9b-v1"']), base.stdout);
+
+    const bad = runWithStubs(stubs, ['--score', rows, '--deem', '--out', path.join(dir, 'out-bad')], { STUB_HEALTH: 'bad' });
+    assert.equal(bad.status, 0);
+    assert.ok(bad.stdout.includes('deem arm skipped: bad health response'));
+    assert.ok(bad.stdout.includes('deem: found="not json"'));
+    assert.equal(withoutLines(bad.stdout, ['deem arm skipped: bad health response', 'deem: found="not json"']), base.stdout);
+  } finally {
+    fs.rmSync(dir, { recursive: true, force: true });
+    fs.rmSync(stubs.dir, { recursive: true, force: true });
+  }
+});
```
