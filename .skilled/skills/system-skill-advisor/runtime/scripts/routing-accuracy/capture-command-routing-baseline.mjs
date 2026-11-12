// ───────────────────────────────────────────────────────────────────
// MODULE: COMMAND ROUTING BASELINE CAPTURE
// ───────────────────────────────────────────────────────────────────
//
// Captures how the built scorer routes the command-prompt corpus under the
// reproducible filesystem projection (empty SYSTEM_SKILL_ADVISOR_DB_DIR →
// SQLite loader returns null → projection built purely from committed graph
// metadata). It answers the questions command surfacing has to hold to: a
// prompt that names a slash command reaches that command's bridge, a prompt
// that must stay quiet offers no command at all, a partial slash mention is
// not routed as if it were complete, and a bridge ranked below the top skill
// is owned by that skill.
//
// It also measures what the compiled route adds on top of that: a hub can name
// the slash command its own routing would take, which reaches a reader who never
// types a slash command. That reach is reported under its own key so every
// existing number keeps the value and the comparability it had before.
//
// The result is the ratchet baseline: the gate re-scores live under the same
// environment and holds every count to it, so any scoring or bridge-metadata
// change that moves a number forces a conscious re-capture rather than
// drifting silently. `corpusSha256` pins the baseline to the exact corpus it
// was captured against, so a corpus edit changes the hash and forces
// re-baselining.
//
// Setup runs on call, never on import: the environment projection, the clock
// pin and the scorer import all live inside scoreCommandCorpus(), so a harness
// may import this module and score in-process without inheriting either.
//
// Usage:
//   node capture-command-routing-baseline.mjs            # print JSON to stdout
//   node capture-command-routing-baseline.mjs --write    # also write the baseline

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { rejectUnknownOptions } from './reject-unknown-options.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_JSONL = resolve(HERE, 'command-prompts.jsonl');
const BRIDGES_JSON = resolve(HERE, '../command-bridges/command-bridges.generated.json');
const SCORER_EVAL_BASELINE_JSON = resolve(HERE, 'scorer-eval-baseline.json');
const OUTPUT_JSON = resolve(HERE, 'command-routing-baseline.json');
const DIST = resolve(HERE, '../../dist/runtime');
const FUSION_MODULE = resolve(DIST, 'lib/scorer/fusion.js');
const WORKSPACE_ROOT_MODULE = resolve(DIST, 'lib/utils/workspace-root.js');
const COMMAND_ATTACH_MODULE = resolve(DIST, 'lib/command-attach.js');
const COMPILED_ROUTING_FLAG_MODULE = resolve(DIST, 'lib/compiled-routing-flag.js');
const DIST_FRESHNESS_MODULE = resolve(HERE, '../../../../system-spec-kit/runtime/cli/lib/dist-freshness.cjs');

const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const COMMANDS_DIR = '.skilled/commands';
// Only the folder-level README is a document; a lowercase `readme.md` shipped
// beside the commands is itself a command, so the skip is case-sensitive.
const COMMAND_DOC_SKIP = 'README.md';
const COMMAND_DOC_SUFFIX = '.md';
// The compiled route is asked for through the public front door a hub's SKILL.md
// calls, so this measures the decision the runtime actually serves rather than a
// second derivation of it that could disagree with the first.
const COMPILED_ROUTE_CLI = '.skilled/bin/compiled-route.cjs';
const COMPILED_ROUTE_TIMEOUT_MS = 5000;

// ───────────────────────────────────────────────────────────────────
// 3. RUNTIME SETUP
// ───────────────────────────────────────────────────────────────────
//
// Only the value lookups live here; the mutations themselves are deferred into
// scoreCommandCorpus() so importing this module has no side effects.

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

// The derived lane halves each skill's score every 90 days of age, measured
// from its derived.generated_at to the scoring clock (floored at 0.1), so
// scores move with the calendar. The scoring date is therefore inherited from
// the scorer-eval baseline and pinned, never read from the wall clock: a
// recapture on any day replays the recorded date and reproduces the same
// numbers, which keeps the two baselines directly comparable.
function readPinnedScoringDate() {
  let recorded;
  try {
    recorded = JSON.parse(readFileSync(SCORER_EVAL_BASELINE_JSON, 'utf8')).capturedAt;
  } catch {
    recorded = undefined;
  }
  if (typeof recorded !== 'string' || !isCalendarDate(recorded)) {
    throw new Error(`scorer-eval baseline has no pinned scoring date (capturedAt): ${SCORER_EVAL_BASELINE_JSON}`);
  }
  return recorded;
}

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function sha256File(path) {
  return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`;
}

// Line numbers are reported as the physical line a bad row sits on, so a
// parse failure points at the line to repair rather than at a row ordinal.
function readCorpus(path) {
  if (!existsSync(path)) throw new Error(`corpus file missing: ${path}`);
  const lines = readFileSync(path, 'utf8').split('\n');
  const rows = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line === '') continue;
    try {
      rows.push(JSON.parse(line));
    } catch (error) {
      throw new Error(`invalid JSON on corpus line ${index + 1} of ${path}: ${error.message}`);
    }
  }
  if (rows.length === 0) throw new Error(`corpus file empty: ${path}`);
  return rows;
}

// Commands live exactly two levels deep, `<namespace>/<name>.md`, and become
// `/<namespace>:<name>`. Anything directly in the commands root is a document
// rather than a command, and deeper nesting is a command's own assets.
function readCommandFileNames(workspaceRoot) {
  const commandsRoot = resolve(workspaceRoot, COMMANDS_DIR);
  const commands = [];
  for (const namespace of readdirSync(commandsRoot, { withFileTypes: true })) {
    if (!namespace.isDirectory()) continue;
    for (const file of readdirSync(join(commandsRoot, namespace.name), { withFileTypes: true })) {
      if (!file.isFile()) continue;
      if (!file.name.endsWith(COMMAND_DOC_SUFFIX) || file.name === COMMAND_DOC_SKIP) continue;
      commands.push(`/${namespace.name}:${file.name.slice(0, -COMMAND_DOC_SUFFIX.length)}`);
    }
  }
  return commands.sort();
}

// The TypeScript inventory id is what the scorer actually emits, and it differs
// from the human command name, so the bridge id is the map key. A command with
// only the Python runtime enabled has no TypeScript id to emit and is reported
// as unreachable instead.
function readBridgeMap(path) {
  const bridges = JSON.parse(readFileSync(path, 'utf8'));
  const idToCommand = new Map();
  for (const entry of bridges.entries ?? []) {
    const typescript = entry.runtime?.typescript;
    if (typescript?.enabled !== true || typeof typescript.id !== 'string') continue;
    idToCommand.set(typescript.id, { command: entry.command, skillId: entry.skillId });
  }
  return { bridgeCounts: bridges.counts ?? {}, idToCommand };
}

function commandOf(idToCommand, id) {
  return idToCommand.get(id)?.command ?? null;
}

// The route arrives from a separate process, so a spawn that fails, times out or
// prints anything unparsable yields no route: a broken read must degrade to "no
// command offered" rather than to an invented one.
function readCompiledRoute(workspaceRoot, hubId, prompt) {
  try {
    const stdout = execFileSync('node', [join(workspaceRoot, COMPILED_ROUTE_CLI), '--hub', hubId, '--prompt-stdin'], {
      cwd: workspaceRoot,
      input: prompt,
      encoding: 'utf8',
      timeout: COMPILED_ROUTE_TIMEOUT_MS,
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const route = JSON.parse(stdout);
    return typeof route === 'object' && route !== null ? route : undefined;
  } catch {
    return undefined;
  }
}

// A bridge that outranks nothing still stays reachable: when the two leaders are
// a bridge and the skill that owns it, the reader gets the command without the
// bridge displacing the skill the prompt actually asked for. The order is
// irrelevant because the scorer's tie-break says nothing about ownership.
function isBridgeOwnerPair(idToCommand, ids, expected) {
  const [first, second] = ids;
  if (first === undefined || second === undefined) return false;
  const leading = idToCommand.get(first);
  if (leading && leading.command === expected && leading.skillId === second) return true;
  const trailing = idToCommand.get(second);
  return Boolean(trailing && trailing.command === expected && trailing.skillId === first);
}

// The scorer reports ranked recommendations when the projection produced a
// list, and only a top pick otherwise; both shapes have to be scorable.
function recommendationIds(result) {
  if (Array.isArray(result?.recommendations)) {
    return result.recommendations.slice(0, 3).map((recommendation) => recommendation.skill);
  }
  return result?.topSkill === null || result?.topSkill === undefined ? [] : [result.topSkill];
}

function emptyTally() {
  return { rows: 0, top1: 0, top3: 0 };
}

function addRow(tally, top1Hit, top3Hit) {
  tally.rows += 1;
  if (top1Hit) tally.top1 += 1;
  if (top3Hit) tally.top3 += 1;
}

// Attached reach is kept apart from bridge reach and only ever counts a row the
// ranked bridge did not already land, so `own` and `attached` partition the rows
// and their sum is real reach rather than one row claimed twice.
function emptyAttachedTally() {
  return { own: 0, attached: 0, total: 0 };
}

function addAttachedRow(tally, ownHit, attachedHit) {
  tally.total += 1;
  if (ownHit) tally.own += 1;
  if (attachedHit) tally.attached += 1;
}

function attachedTallyJson(tally) {
  return { own: tally.own, attached: tally.attached, combined: tally.own + tally.attached, total: tally.total };
}

// Commands are named `<namespace>:<name>`, so the namespace is the workflow
// family a reach number belongs to.
function commandNamespace(command) {
  if (typeof command !== 'string' || !command.startsWith('/')) return null;
  const colon = command.indexOf(':');
  return colon > 1 ? command.slice(1, colon) : null;
}

// Individual rows roll up to a family only when their command names one, so a
// command outside the `<namespace>:<name>` grammar still counts in the split
// total without inventing a family for itself.
function attachedFamilyTally(byFamily, command) {
  const namespace = commandNamespace(command);
  if (namespace === null) return undefined;
  if (!byFamily.has(namespace)) {
    byFamily.set(namespace, { tune: emptyAttachedTally(), holdout: emptyAttachedTally() });
  }
  return byFamily.get(namespace);
}

function readHeadSha(workspaceRoot) {
  const spawned = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: workspaceRoot, encoding: 'utf8' });
  return spawned.status === 0 ? spawned.stdout.trim() : 'unknown';
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export async function scoreCommandCorpus() {
  const RealDate = Date;
  // The projection needs an existing, empty cache directory, and that directory
  // is scratch space this run owns. It is created before the `try` so a failure
  // to create it has nothing left to remove, and removed in the `finally` so
  // repeated captures do not leave one behind per run.
  const dbDir = mkdtempSync(join(tmpdir(), 'advisor-command-routing-'));
  try {
    // Environment projection. That empty directory makes the SQLite loader
    // return null, so the projection is built from committed metadata alone,
    // which is the only state a clean checkout can reproduce.
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir;
    process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
    process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
    process.env.PYTHONDONTWRITEBYTECODE = '1';
    // Match the test-harness regime: the semantic-shadow lane substitutes
    // deterministic fixture vectors under the harness flag (real embeddings are
    // not reproducible in CI), so every scorer gate runs this way. The baseline
    // must be captured under the same regime the ratchet re-scores it in.
    process.env.VITEST = 'true';
    delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
    delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
    delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
    // Private `local-*` skills linked in through this variable live outside the
    // checkout, so a baseline measured on a clean checkout must not see them.
    delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

    // Pin the scoring clock to midnight UTC on the inherited scoring date.
    const capturedAt = readPinnedScoringDate();
    const scoringInstant = Date.parse(`${capturedAt}T00:00:00Z`);
    globalThis.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) super(scoringInstant);
        else super(...args);
      }

      static now() {
        return scoringInstant;
      }
    };

    if (!existsSync(FUSION_MODULE)) {
      throw new Error(`built scorer file missing: ${FUSION_MODULE}`);
    }
    for (const modulePath of [COMMAND_ATTACH_MODULE, COMPILED_ROUTING_FLAG_MODULE]) {
      if (!existsSync(modulePath)) {
        throw new Error(`built command-attach file missing: ${modulePath}`);
      }
    }

    // Imported after the clock is pinned so the compiled scorer initializes
    // against the pinned date, and only after it is known to exist so a missing
    // build is reported as such rather than as a module-resolution failure.
    const { scoreAdvisorPrompt } = await import(pathToFileURL(FUSION_MODULE).href);
    const { findAdvisorWorkspaceRoot } = await import(pathToFileURL(WORKSPACE_ROOT_MODULE).href);
    const { attachCommand } = await import(pathToFileURL(COMMAND_ATTACH_MODULE).href);
    const { COMPILED_ROUTING_HUBS } = await import(pathToFileURL(COMPILED_ROUTING_FLAG_MODULE).href);
    const workspaceRoot = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

    // A missing front door would make every spawn fail and report the same zero
    // as a hub with nothing to attach, so it fails the capture instead.
    if (!existsSync(resolve(workspaceRoot, COMPILED_ROUTE_CLI))) {
      throw new Error(`compiled route front door missing: ${resolve(workspaceRoot, COMPILED_ROUTE_CLI)}`);
    }

    // A build older than its source scores code that no longer exists, so its
    // numbers would describe a scorer nobody can read. Refuse it, and likewise
    // a build whose freshness cannot be assessed.
    const { checkPackageFreshness } = createRequire(import.meta.url)(DIST_FRESHNESS_MODULE);
    const freshness = checkPackageFreshness('system-skill-advisor/runtime', { workspaceRoot });
    if (freshness.status !== 'fresh') {
      throw new Error(freshness.message);
    }

    const commandNames = readCommandFileNames(workspaceRoot);
    const commandSet = new Set(commandNames);
    const { bridgeCounts, idToCommand } = readBridgeMap(BRIDGES_JSON);
    const corpus = readCorpus(CORPUS_JSONL);

    // A label naming a command that does not exist would silently score as a
    // permanent miss, so it fails the capture instead of deflating a metric.
    for (const row of corpus) {
      if (row.expected_command === null || row.expected_command === undefined) continue;
      if (!commandSet.has(row.expected_command)) {
        throw new Error(`corpus row ${row.id} expects ${row.expected_command}, which is not a command file under ${resolve(workspaceRoot, COMMANDS_DIR)}`);
      }
    }

    const perCommand = new Map();
    for (const command of commandNames) {
      perCommand.set(command, { typed: emptyTally(), plain: { tune: emptyTally(), holdout: emptyTally() } });
    }

    const typed = emptyTally();
    const plain = { tune: emptyTally(), holdout: emptyTally() };
    let falseOfferCount = 0;
    let falseOfferTotal = 0;
    let slashReachedTop3 = 0;
    let slashNamedTotal = 0;
    let slashOfferedOnPartial = 0;
    let slashPartialTotal = 0;
    let agreementCorrect = 0;
    let agreementTotal = 0;
    // Per-row results sit beside the totals because a total can hold still
    // while one row is gained and another lost, and a changed label has to
    // surface under the id of the row it belongs to.
    const rows = {};
    // Attached reach: what a hub's own route adds on the same rows, split the
    // same way, plus the rows that had to stay silent and the ties a bridge
    // leaves with its own owner.
    const attachedRows = {};
    const plainAttached = { tune: emptyAttachedTally(), holdout: emptyAttachedTally() };
    const plainAttachedByFamily = new Map();
    const sameOwnerAmbiguous = [];
    let falseOfferAttached = 0;

    for (const row of corpus) {
      const result = scoreAdvisorPrompt(row.prompt, { workspaceRoot });
      const ids = recommendationIds(result);
      const landed = ids.map((id) => commandOf(idToCommand, id));
      const expected = row.expected_command ?? null;
      const top1Hit = expected !== null && landed[0] === expected;
      const top3Hit = expected !== null && landed.includes(expected);
      const offered = landed.some((command) => command !== null);
      const isPlainSplit = row.row_type === 'plain' && (row.split === 'tune' || row.split === 'holdout');

      // A hub can name the slash command its route would take, which is reach a
      // reader otherwise gets only by translating the workflow mode by hand.
      const topId = ids[0];
      const attached = topId !== undefined && COMPILED_ROUTING_HUBS.has(topId)
        ? attachCommand(topId, readCompiledRoute(workspaceRoot, topId, row.prompt), row.prompt)
        : undefined;
      const attachedHit = attached !== undefined && attached === expected && !top1Hit;

      if (row.row_type === 'typed') addRow(typed, top1Hit, top3Hit);
      if (isPlainSplit) {
        addRow(plain[row.split], top1Hit, top3Hit);
        addAttachedRow(plainAttached[row.split], top1Hit, attachedHit);
        const family = attachedFamilyTally(plainAttachedByFamily, expected);
        if (family) addAttachedRow(family[row.split], top1Hit, attachedHit);
      }
      if (attached !== undefined) attachedRows[row.id] = attached;
      if (row.row_type === 'typed' && result?.ambiguous === true && isBridgeOwnerPair(idToCommand, ids, expected)) {
        sameOwnerAmbiguous.push(row.id);
      }

      const commandTally = expected === null ? undefined : perCommand.get(expected);
      if (commandTally) {
        if (row.row_type === 'typed') addRow(commandTally.typed, top1Hit, top3Hit);
        else if (isPlainSplit) addRow(commandTally.plain[row.split], top1Hit, top3Hit);
      }

      rows[row.id] = { expected_command: expected, top: ids[0] ?? null, top1: top1Hit, top3: top3Hit, offered };

      const isSlashVariant = row.row_type === 'slash-variant';
      // Silence is the requirement for a near miss, a prompt that must not
      // trigger a command, and a partial slash mention that names no command.
      const wantsSilence = row.row_type === 'must-not-start'
        || row.row_type === 'near-miss'
        || (isSlashVariant && expected === null);
      if (wantsSilence) {
        falseOfferTotal += 1;
        if (offered) falseOfferCount += 1;
        if (attached !== undefined) falseOfferAttached += 1;
      }

      if (isSlashVariant) {
        if (expected === null) {
          slashPartialTotal += 1;
          if (offered) slashOfferedOnPartial += 1;
        } else {
          slashNamedTotal += 1;
          if (top3Hit) slashReachedTop3 += 1;
        }
      }

      // A bridge offered below a skill is correct when the skill that outranked
      // it is the bridge's own owner: the command stays reachable without the
      // bridge displacing the skill the prompt actually asked for.
      if (!idToCommand.has(ids[0])) {
        const laterBridgeId = ids.slice(1).find((id) => idToCommand.has(id));
        if (laterBridgeId !== undefined) {
          agreementTotal += 1;
          if (idToCommand.get(laterBridgeId).skillId === ids[0]) agreementCorrect += 1;
        }
      }
    }

    const commands = {};
    for (const command of [...perCommand.keys()].sort()) {
      commands[command] = perCommand.get(command);
    }

    const reachableCommands = new Set();
    for (const value of idToCommand.values()) reachableCommands.add(value.command);
    const unreachable = commandNames.filter((command) => !reachableCommands.has(command)).sort();

    const plainByFamily = {};
    for (const namespace of [...plainAttachedByFamily.keys()].sort()) {
      const family = plainAttachedByFamily.get(namespace);
      plainByFamily[namespace] = {
        tune: attachedTallyJson(family.tune),
        holdout: attachedTallyJson(family.holdout),
      };
    }

    return {
      schemaVersion: 1,
      capturedAt,
      capturedAtSha: readHeadSha(workspaceRoot),
      corpusSha256: sha256File(CORPUS_JSONL),
      bridgeCounts,
      metrics: {
        typed_recall_at_1: { correct: typed.top1, total: typed.rows },
        typed_reach_top3: { correct: typed.top3, total: typed.rows },
        plain_recall_at_1: {
          tune: { correct: plain.tune.top1, total: plain.tune.rows },
          holdout: { correct: plain.holdout.top1, total: plain.holdout.rows },
        },
        plain_reach_top3: {
          tune: { correct: plain.tune.top3, total: plain.tune.rows },
          holdout: { correct: plain.holdout.top3, total: plain.holdout.rows },
        },
        false_offer: { count: falseOfferCount, total: falseOfferTotal },
        slash_variant: {
          reached_top3: slashReachedTop3,
          named_total: slashNamedTotal,
          offered_on_partial: slashOfferedOnPartial,
          partial_total: slashPartialTotal,
        },
        agreement: { correct: agreementCorrect, total: agreementTotal },
      },
      unreachable,
      commands,
      rows,
      attachedMetrics: {
        plain: {
          tune: attachedTallyJson(plainAttached.tune),
          holdout: attachedTallyJson(plainAttached.holdout),
        },
        plain_by_family: plainByFamily,
        false_offer_attached: { count: falseOfferAttached, total: falseOfferTotal },
        typed_same_owner_ambiguous: sameOwnerAmbiguous.sort(),
        attachedRows,
      },
    };
  } finally {
    globalThis.Date = RealDate;
    // Removal comes last, after every read that needs the directory has
    // finished; `force` keeps an already-swept directory from turning a
    // completed capture into a failure.
    rmSync(dbDir, { recursive: true, force: true });
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  rejectUnknownOptions(import.meta.url, ['--write']);

  try {
    const baseline = await scoreCommandCorpus();
    const serialized = `${JSON.stringify(baseline, null, 2)}\n`;
    if (process.argv.includes('--write')) {
      writeFileSync(OUTPUT_JSON, serialized, 'utf8');
      console.log(`wrote baseline -> ${OUTPUT_JSON}`);
    }
    console.log(serialized);
  } catch (error) {
    process.stderr.write(`capture-command-routing-baseline.mjs: ${error.message}\n`);
    process.exit(2);
  }
}
