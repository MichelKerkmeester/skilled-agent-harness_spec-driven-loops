#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Skill Integration Rows
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const surface = require('./sk-skill-surface.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A skill that passes the format gate can still be unreachable: the advisor has
// not scanned it, the compiled graph is stale, no regression row names it, the
// Hermes copy is missing and no changelog link points at it. These rows are the
// writes no create script owns, so they carry the whole distance between valid
// and reachable. A failing row reports and lets the others run: each surface is
// independent, and the caller decides what a partial wiring means.
const ROW_TITLES = Object.freeze({
  I1: 'advisor discovery',
  I2: 'compiled skill graph',
  I3: 'router reach and budget',
  I4: 'regression corpus',
  I5: 'runtime mirrors',
  I6: 'changelog',
});

// A manual rebuild is the operator's call, so the row names it and never runs it.
const ADVISOR_REBUILD_FALLBACK = '/doctor:skill-advisor rebuild';
const PROBE_LIMIT = 3;
const DESCRIPTION_BUDGET = 130;
const DEFAULT_VERSION = '1.0.0.0';
const FOUR_PART_VERSION = /^\d+(?:\.\d+){3}$/;
const HERMES_DIRECTORY = '.hermes';
const CHANGELOG_INDEX = ['.skilled', 'changelog'];
const SKILL_GRAPH_LABEL = '.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json';
const FRAMEWORK_CORPUS_LABEL =
  '.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl';
// Runtimes whose skills folder is a whole-directory link to the canonical root.
const LINKED_RUNTIMES = ['Claude', 'OpenCode', 'Pi', 'Devin'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS AND SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class IntegrationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'IntegrationError';
    this.code = code;
  }
}

function firstLine(value) {
  return String(value || '').split(/\r?\n/).find((line) => line.trim()) || '';
}

// A plan line names a path the way the operator reads it: relative to the
// repository when it lives inside it, absolute when it does not.
function pathLabel(repoRoot, target) {
  const relative = path.relative(path.resolve(repoRoot), path.resolve(target));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return path.resolve(target);
  return relative.split(path.sep).join('/');
}

// A folder one level under a root is the only shape a fixed relative path can
// address, so this is the test a path built from a name requires. Both sides are compared
// as real paths, because a skills root reached through a symlinked parent and a skill root
// resolved from it are one folder, not two.
function resolveReal(candidate, fileSystem) {
  try {
    return fileSystem.realpathSync(candidate);
  } catch {
    return path.resolve(candidate);
  }
}

function isDirectChild(parent, child, fileSystem = fs) {
  const relative = path.relative(resolveReal(parent, fileSystem), resolveReal(child, fileSystem));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return false;
  return relative.split(path.sep).filter(Boolean).length === 1;
}

function normalizeVersion(candidate) {
  if (typeof candidate !== 'string' || candidate.trim() === '') return DEFAULT_VERSION;
  const value = candidate.trim().replace(/^["']|["']$/g, '');
  if (FOUR_PART_VERSION.test(value)) return value;
  const parts = value.split('.').map((part) => (/^\d+$/.test(part) ? part : '0'));
  while (parts.length < 4) parts.push('0');
  return parts.slice(0, 4).join('.');
}

function readGraphPhrases(skillRoot, fileSystem) {
  const metadata = surface.readJsonFile(path.join(skillRoot, 'graph-metadata.json'), fileSystem);
  if (!metadata || !Array.isArray(metadata.intent_signals)) return [];
  return metadata.intent_signals.filter((signal) => typeof signal === 'string');
}

// The three phrases the reach row probes, in the order the skill approved them.
function selectPhrases(candidates, skillName) {
  const seen = new Set();
  const phrases = [];
  for (const candidate of Array.isArray(candidates) ? candidates : []) {
    if (typeof candidate !== 'string') continue;
    const value = candidate.trim();
    if (value === '' || seen.has(value)) continue;
    seen.add(value);
    phrases.push(value);
    if (phrases.length === PROBE_LIMIT) break;
  }
  if (phrases.length === 0) phrases.push(skillName);
  return phrases;
}

function ensureDirectory(fileSystem, directory) {
  fileSystem.mkdirSync(directory, { recursive: true });
}

// An overwrite is only undoable when the bytes it replaced still exist somewhere.
// The run copies the target beside its other backups first, so the printed undo
// hands back the operator's own version, committed or not, instead of asking
// version control for a state it may never have held.
function backupBeforeWrite({ fileSystem, backupDirectory, target }) {
  if (!backupDirectory || !fileSystem.existsSync(target)) return null;
  const label = path.basename(target).replace(/[^A-Za-z0-9._-]+/g, '_') || 'target';
  const digest = crypto.createHash('sha256').update(path.resolve(target)).digest('hex').slice(0, 12);
  const backup = path.join(backupDirectory, 'integration', `${label}-${digest}`);
  if (!fileSystem.existsSync(backup)) {
    ensureDirectory(fileSystem, path.dirname(backup));
    fileSystem.cpSync(target, backup, { recursive: true });
  }
  return backup;
}

// A row reports a write only for a path it really wrote. The kind says whether
// the undo removes the path or restores it from the backup taken before the row
// ran, and the directory flag tells the printed undo which rm and cp forms to use.
function recordWrite({ fileSystem, target, existedBefore, backup, detail }) {
  let directory = false;
  try {
    directory = fileSystem.lstatSync(target).isDirectory();
  } catch {}
  return {
    kind: existedBefore ? 'overwrite' : 'create',
    file: target,
    directory,
    ...(existedBefore && backup ? { backup } : {}),
    detail,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

function resolveOptions(options = {}) {
  const context = options.context || surface.createContext({
    repoRoot: options.repoRoot,
    skillsDir: options.skillsDir,
    cwd: options.cwd,
    python: options.python,
    env: options.env,
    fs: options.fs,
    runCommand: options.runCommand,
  });
  const fileSystem = context.fs || fs;

  let skillRoot = options.skillRoot ? path.resolve(options.skillRoot) : null;
  if (!skillRoot) {
    if (!options.target) {
      throw new IntegrationError('SKILL_NOT_FOUND', 'A skill root or a skill name is required.');
    }
    try {
      skillRoot = surface.resolveSkillTarget(options.target, context);
    } catch (error) {
      throw new IntegrationError(error.code || 'SKILL_NOT_FOUND', error.message);
    }
  }

  const skill = surface.readSkillFields(skillRoot, fileSystem);
  const name = options.name || skill.fields.name || path.basename(skillRoot);
  if (surface.isReservedSkillName(name) || surface.isReservedSkillName(path.basename(skillRoot))) {
    throw new IntegrationError('RESERVED_PREFIX', 'A local- prefixed skill is filtered by the format and advisor gates.');
  }

  return {
    context,
    fileSystem,
    skillRoot,
    name,
    version: normalizeVersion(options.version || skill.fields.version),
    description: typeof options.description === 'string'
      ? options.description
      : (skill.fields.description || ''),
    phrases: selectPhrases(options.phrases || readGraphPhrases(skillRoot, fileSystem), name),
    backupDirectory: options.backupDirectory ? path.resolve(options.backupDirectory) : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. INTEGRATION ROWS
// ─────────────────────────────────────────────────────────────────────────────

function makeRow(id, planLines, run, extra = {}) {
  return {
    id,
    title: ROW_TITLES[id],
    status: extra.status || 'PLANNED',
    planLines,
    writes: extra.writes || [],
    run,
  };
}

function integrateI1AdvisorScan(options) {
  const { context, fileSystem } = options;
  const advisorLabel = pathLabel(context.repoRoot, context.paths.advisor);
  if (!fileSystem.existsSync(context.paths.advisor)) {
    return makeRow('I1', [
      `I1 ${ROW_TITLES.I1}: n/a - the advisor CLI is absent (${advisorLabel}); nothing is scanned.`,
    ], () => ({ status: 'N/A', lines: [] }), { status: 'N/A' });
  }
  return makeRow('I1', [
    `I1 ${ROW_TITLES.I1}: run node ${advisorLabel} skill_graph_scan --trusted.`,
    `I1 ${ROW_TITLES.I1}: if that scan cannot run, ${ADVISOR_REBUILD_FALLBACK} is the operator's next step; this command never runs it.`,
  ], () => {
    const result = surface.runAdvisorScan(context);
    const detail = firstLine(result.stderr) || firstLine(result.stdout);
    if (result.code === 0) {
      return {
        status: 'DONE',
        lines: [
          `I1 ${ROW_TITLES.I1}: scanned; the advisor reads the new root. `
          + `Manual fallback: ${ADVISOR_REBUILD_FALLBACK}.`,
        ],
      };
    }
    if (result.code === 75) {
      return {
        status: 'UNKNOWN',
        lines: [
          `I1 ${ROW_TITLES.I1}: UNKNOWN - the advisor backend is unavailable (exit 75)`
          + `${detail ? `: ${detail}` : ''}. Fallback: ${ADVISOR_REBUILD_FALLBACK}.`,
        ],
      };
    }
    return {
      status: 'FAILED',
      lines: [
        `I1 ${ROW_TITLES.I1}: FAILED - skill_graph_scan exited ${result.code}`
        + `${detail ? `: ${detail}` : ''}. Fallback: ${ADVISOR_REBUILD_FALLBACK}.`,
      ],
    };
  });
}

function integrateI2CompiledGraph(options) {
  const { context, fileSystem, backupDirectory } = options;
  const compilerLabel = pathLabel(context.repoRoot, context.paths.skillGraphCompiler);
  if (!fileSystem.existsSync(context.paths.skillGraphCompiler)) {
    return makeRow('I2', [
      `I2 ${ROW_TITLES.I2}: n/a - the skill-graph compiler is absent (${compilerLabel}); no compiled graph is refreshed.`,
    ], () => ({ status: 'N/A', lines: [] }), { status: 'N/A' });
  }
  const target = context.paths.skillGraphJson;
  const detail = `Recompiled via ${surface.pythonCommand(context)} ${compilerLabel} --export-json.`;
  return makeRow('I2', [
    `I2 ${ROW_TITLES.I2}: Overwrite ${SKILL_GRAPH_LABEL} by running ${surface.pythonCommand(context)} `
    + `${compilerLabel} --export-json (a tracked-file write).`,
  ], () => {
    const existedBefore = fileSystem.existsSync(target);
    const backup = existedBefore
      ? backupBeforeWrite({ fileSystem, backupDirectory, target })
      : null;
    const result = surface.runSkillGraphCompiler(context);
    const reason = firstLine(result.stderr) || firstLine(result.stdout);
    if (result.code !== 0) {
      return {
        status: 'FAILED',
        lines: [`I2 ${ROW_TITLES.I2}: FAILED - the compiler exited ${result.code}${reason ? `: ${reason}` : ''}.`],
      };
    }
    return {
      status: 'DONE',
      lines: [`I2 ${ROW_TITLES.I2}: recompiled; ${SKILL_GRAPH_LABEL} is current.`],
      writes: fileSystem.existsSync(target)
        ? [recordWrite({ fileSystem, target, existedBefore, backup, detail })]
        : [],
    };
  }, {
    writes: [{
      kind: fileSystem.existsSync(target) ? 'overwrite' : 'create',
      file: target,
      detail,
    }],
  });
}

function advisorEnvelope(result) {
  const payload = surface.parseJsonOutput(result);
  if (!payload || typeof payload !== 'object') return null;
  const data = payload.data && typeof payload.data === 'object' ? payload.data : payload;
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
  const thresholds = data.effectiveThresholds;
  const bar = thresholds && typeof thresholds.confidenceThreshold === 'number'
    ? thresholds.confidenceThreshold
    : 0.8;
  return { recommendations, bar };
}

function probePhrase(context, phrase) {
  const result = surface.runChild(
    context,
    process.execPath,
    [
      context.paths.advisor,
      'advisor_recommend',
      '--json',
      JSON.stringify({ prompt: phrase }),
      '--warm-only',
      '--format',
      'json',
    ],
    { timeoutMs: surface.ADVISOR_TIMEOUT_MS },
  );
  const detail = firstLine(result.stderr) || firstLine(result.stdout);
  if (result.code === 75) {
    return { status: 'UNKNOWN', detail: detail || 'the advisor backend is unavailable (exit 75)' };
  }
  if (result.code !== 0) {
    return { status: 'FAILED', detail: `advisor_recommend exited ${result.code}${detail ? `: ${detail}` : ''}` };
  }
  const envelope = advisorEnvelope(result);
  if (!envelope) return { status: 'FAILED', detail: 'advisor_recommend returned no readable JSON envelope' };
  return { status: 'OK', envelope };
}

function integrateI3ReachAndBudget(options) {
  const { context, fileSystem, name, description, phrases } = options;
  const advisorLabel = pathLabel(context.repoRoot, context.paths.advisor);
  // A repository that ships the doctor command without the advisor has no rank to report,
  // and an absent tool is not a failed probe: the row reports n/a, exactly as I1 does.
  if (!fileSystem.existsSync(context.paths.advisor)) {
    return makeRow('I3', [
      `I3 ${ROW_TITLES.I3}: n/a - the advisor CLI is absent (${advisorLabel}); no phrase is probed.`,
    ], () => ({ status: 'N/A', lines: [] }), { status: 'N/A' });
  }
  const quoted = phrases.map((phrase) => `"${phrase}"`).join(', ');
  const budgetDetail = `description budget ${description.length}/${DESCRIPTION_BUDGET} characters`;
  return makeRow('I3', [
    `I3 ${ROW_TITLES.I3}: probe ${phrases.length} approved phrase(s) with advisor_recommend --warm-only `
    + `and report where ${name} ranks: ${quoted}.`,
    `I3 ${ROW_TITLES.I3}: ${budgetDetail}.`,
  ], () => {
    const lines = [];
    let status = 'DONE';
    for (const phrase of phrases) {
      const probed = probePhrase(options.context, phrase);
      if (probed.status === 'UNKNOWN') {
        status = status === 'FAILED' ? status : 'UNKNOWN';
        lines.push(`I3 ${ROW_TITLES.I3}: "${phrase}" -> UNKNOWN (${probed.detail}); never a pass.`);
        continue;
      }
      if (probed.status === 'FAILED') {
        status = 'FAILED';
        lines.push(`I3 ${ROW_TITLES.I3}: "${phrase}" -> FAILED (${probed.detail}).`);
        continue;
      }
      const above = probed.envelope.recommendations
        .filter((entry) => entry && typeof entry.confidence === 'number' && entry.confidence >= probed.envelope.bar);
      const position = above.findIndex((entry) => entry.skillId === name);
      if (position === -1) {
        const top = above.slice(0, 2).map((entry) => `${entry.skillId}=${entry.confidence.toFixed(4)}`);
        lines.push(`I3 ${ROW_TITLES.I3}: "${phrase}" -> ${name} absent above the bar`
          + `${top.length ? `; top: ${top.join(', ')}` : ''}.`);
        continue;
      }
      lines.push(`I3 ${ROW_TITLES.I3}: "${phrase}" -> ${name} ranks ${position + 1} of ${above.length} above the bar.`);
    }
    lines.push(description.length > DESCRIPTION_BUDGET
      ? `I3 ${ROW_TITLES.I3}: ${budgetDetail}, ${description.length - DESCRIPTION_BUDGET} over.`
      : `I3 ${ROW_TITLES.I3}: ${budgetDetail}.`);
    return { status, lines };
  });
}

// A converted root's scaffold writes every edge group empty, and the advisor graph counts
// a skill with no edges as an orphan and refuses it. The advisor already ranks which skill
// answers a phrase, so its ranking is what the plan proposes: the conversion offers one
// name and the operator approves it, and no edge is ever written on the converter's word.
const EDGE_CANDIDATE_LIMIT = 3;

function proposeEnhanceTargets(options = {}) {
  const { context, excludeName } = options;
  const phrases = selectPhrases(options.phrases, excludeName);
  if (!context.fs.existsSync(context.paths.advisor)) {
    return {
      candidates: [],
      unavailable: true,
      detail: 'the advisor is unavailable (its CLI is absent)',
    };
  }
  const candidates = [];
  const seen = new Set();
  let answered = 0;
  let failureDetail = null;
  for (const phrase of phrases) {
    const probed = probePhrase(context, phrase);
    if (probed.status !== 'OK') {
      failureDetail = probed.detail;
      continue;
    }
    answered += 1;
    // The advisor already ordered its answer, so the first name it returns is the one it
    // ranks highest. The converted skill is never its own candidate, and a private root is
    // skipped because every gate filters it.
    for (const entry of probed.envelope.recommendations) {
      if (!entry || typeof entry.skillId !== 'string' || entry.skillId === '') continue;
      if (typeof entry.confidence === 'number' && entry.confidence < probed.envelope.bar) continue;
      if (entry.skillId === excludeName || surface.isReservedSkillName(entry.skillId)) continue;
      if (seen.has(entry.skillId)) continue;
      seen.add(entry.skillId);
      candidates.push(entry.skillId);
    }
  }
  if (answered === 0) {
    return {
      candidates: [],
      unavailable: true,
      detail: `the advisor is unavailable (${failureDetail || 'no phrase could be scored'})`,
    };
  }
  return {
    candidates: candidates.slice(0, EDGE_CANDIDATE_LIMIT),
    unavailable: false,
    detail: candidates.length ? null : 'the advisor ranked no skill above its threshold',
  };
}

function caseToken(skillName) {
  return skillName.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseCaseRows(text) {
  const rows = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      if (row && typeof row === 'object') rows.push(row);
    } catch {
      // A malformed existing line is not a reason to stop reading the rest; the
      // next id only needs the rows that parsed.
    }
  }
  return rows;
}

// Proposed rows follow the corpus shape the regression harness reads, one row per
// approved phrase, so the convert output is a file the harness can run as is. The
// first phrase is the skill's primary trigger and becomes the P0 gate row, which
// is what lets the dataset carry a meaningful pass rate on its own.
function buildCaseRows(skillName, phrases, existingRows = []) {
  const existing = Array.isArray(existingRows) ? existingRows : [];
  const existingPrompts = new Set(existing
    .map((row) => (row && typeof row.prompt === 'string' ? row.prompt : null))
    .filter(Boolean));
  const token = caseToken(skillName) || 'SKILL';
  const usedIds = new Set(existing
    .map((row) => (row && typeof row.id === 'string' ? row.id : null))
    .filter(Boolean));
  const counters = { P0: 0, P1: 0 };
  for (const id of usedIds) {
    const match = new RegExp(`^(P0|P1)-${token}-(\\d+)$`).exec(id);
    if (match) counters[match[1]] = Math.max(counters[match[1]], Number(match[2]));
  }

  const rows = [];
  for (const phrase of phrases) {
    if (existingPrompts.has(phrase)) continue;
    const priority = rows.length === 0 ? 'P0' : 'P1';
    counters[priority] += 1;
    let id = `${priority}-${token}-${String(counters[priority]).padStart(3, '0')}`;
    while (usedIds.has(id)) {
      counters[priority] += 1;
      id = `${priority}-${token}-${String(counters[priority]).padStart(3, '0')}`;
    }
    usedIds.add(id);
    rows.push({
      id,
      priority,
      prompt: phrase,
      confidence_only: false,
      expect_result: true,
      expected_top_any: [skillName],
      expect_kind: 'skill',
      allow_command_bridge: false,
    });
  }
  return rows;
}

// The framework corpus is the advisor's own regression home, so only a direct
// child of this repository's skills root may append to it. An adopter skill keeps
// its rows in its own folder, where the harness can still be pointed at them.
function isFrameworkSkill({ context, fileSystem, skillRoot }) {
  if (!fileSystem.existsSync(context.paths.regressionCorpus)) return false;
  return isDirectChild(context.skillsDir, skillRoot, fileSystem);
}

function renderCaseRow(row) {
  return JSON.stringify(row);
}

function integrateI4RegressionCases(options) {
  const { context, fileSystem, skillRoot, name, phrases, backupDirectory } = options;
  const framework = isFrameworkSkill(options);
  const target = framework
    ? context.paths.regressionCorpus
    : path.join(skillRoot, 'benchmark', 'advisor-cases.jsonl');
  const targetLabel = framework ? FRAMEWORK_CORPUS_LABEL : pathLabel(context.repoRoot, target);
  const existingText = (() => {
    try {
      return fileSystem.readFileSync(target, 'utf8');
    } catch {
      return '';
    }
  })();
  const proposed = buildCaseRows(name, phrases, parseCaseRows(existingText));
  const datasetCommand = framework
    ? null
    : `${surface.pythonCommand(context)} ${pathLabel(context.repoRoot, context.paths.regressionRunner)} `
      + `--dataset ${targetLabel} --min-total-cases ${parseCaseRows(existingText).length + proposed.length}`;

  const planLines = framework
    ? [
      `I4 ${ROW_TITLES.I4}: append ${proposed.length} case row(s) to ${FRAMEWORK_CORPUS_LABEL} `
      + '(a framework skill in this repository).',
    ]
    : [
      `I4 ${ROW_TITLES.I4}: write ${proposed.length} case row(s) to ${targetLabel} `
      + `and print the dataset command; ${FRAMEWORK_CORPUS_LABEL} stays untouched.`,
    ];
  for (const row of proposed) planLines.push(`I4 proposed row: ${renderCaseRow(row)}`);
  if (datasetCommand) planLines.push(`I4 dataset command: ${datasetCommand}`);
  const plannedWrites = proposed.length === 0
    ? []
    : [{
      kind: fileSystem.existsSync(target) ? 'overwrite' : 'create',
      file: target,
      detail: `Append ${proposed.length} regression case row(s).`,
    }];

  return makeRow('I4', planLines, () => {
    const lines = [];
    if (proposed.length === 0) {
      return {
        status: 'DONE',
        lines: [`I4 ${ROW_TITLES.I4}: every proposed phrase is already a case for ${name}; nothing is appended.`],
      };
    }
    const existedBefore = fileSystem.existsSync(target);
    const backup = existedBefore
      ? backupBeforeWrite({ fileSystem, backupDirectory, target })
      : null;
    ensureDirectory(fileSystem, path.dirname(target));
    const appended = proposed.map(renderCaseRow).join('\n');
    const prefix = existingText === '' || existingText.endsWith('\n') ? '' : '\n';
    fileSystem.appendFileSync(target, `${prefix}${appended}\n`, 'utf8');
    lines.push(`I4 ${ROW_TITLES.I4}: appended ${proposed.length} case row(s) to ${targetLabel}.`);
    if (datasetCommand) lines.push(`I4 ${ROW_TITLES.I4}: run them with ${datasetCommand}`);
    return {
      status: 'DONE',
      lines,
      writes: [recordWrite({
        fileSystem,
        target,
        existedBefore,
        backup,
        detail: `Appended ${proposed.length} regression case row(s).`,
      })],
    };
  }, { writes: plannedWrites });
}

function integrateI5RuntimeMirrors(options) {
  const { context, fileSystem, backupDirectory } = options;
  const hermesDirectory = path.join(context.repoRoot, HERMES_DIRECTORY);
  const outputOverride = context.env && context.env.HERMES_SKILLS_OUTPUT_DIR;
  // The override names where the copies land, so that is the path a caller has to
  // undo; without it the sync regenerates the copy folder inside the runtime's
  // directory, and that folder is the write rather than the directory holding it.
  const hermesTarget = outputOverride
    ? path.resolve(context.repoRoot, outputOverride)
    : path.join(hermesDirectory, 'skills');
  const hermesLabel = pathLabel(context.repoRoot, context.paths.hermesSync);
  if (!fileSystem.existsSync(hermesDirectory) && !outputOverride) {
    return makeRow('I5', [
      `I5 ${ROW_TITLES.I5}: n/a - ${HERMES_DIRECTORY}/ does not exist and HERMES_SKILLS_OUTPUT_DIR is unset; nothing is created.`,
    ], () => ({ status: 'N/A', lines: [] }), { status: 'N/A' });
  }
  const planKind = fileSystem.existsSync(hermesTarget) ? 'overwrite' : 'create';
  return makeRow('I5', [
    `I5 ${ROW_TITLES.I5}: run node ${hermesLabel}, then node ${hermesLabel} --check for Hermes.`,
    `I5 ${ROW_TITLES.I5}: ${LINKED_RUNTIMES.join(', ')} are whole-directory links to .skilled/skills and need no write.`,
  ], () => {
    const existedBefore = fileSystem.existsSync(hermesTarget);
    const backup = existedBefore
      ? backupBeforeWrite({ fileSystem, backupDirectory, target: hermesTarget })
      : null;
    const synced = surface.runHermesSync(context);
    if (synced.code !== 0) {
      const reason = firstLine(synced.stderr) || firstLine(synced.stdout);
      return {
        status: 'FAILED',
        lines: [`I5 ${ROW_TITLES.I5}: FAILED - Hermes sync exited ${synced.code}${reason ? `: ${reason}` : ''}.`],
      };
    }
    const checked = surface.runHermesSync(context, { check: true });
    const detail = firstLine(checked.stdout) || firstLine(checked.stderr);
    if (checked.code !== 0) {
      return {
        status: 'FAILED',
        lines: [`I5 ${ROW_TITLES.I5}: FAILED - Hermes --check exited ${checked.code}${detail ? `: ${detail}` : ''}.`],
      };
    }
    return {
      status: 'DONE',
      lines: [`I5 ${ROW_TITLES.I5}: Hermes synced and checked${detail ? ` (${detail})` : ''}.`],
      // A sync that reports success without writing anything has no path to undo.
      writes: fileSystem.existsSync(hermesTarget)
        ? [recordWrite({
          fileSystem,
          target: hermesTarget,
          existedBefore,
          backup,
          detail: 'Hermes skill copies regenerated.',
        })]
        : [],
    };
  }, {
    writes: [{ kind: planKind, file: hermesTarget, detail: 'Regenerate the Hermes skill copies and check them.' }],
  });
}

// A compact changelog entry that satisfies the versioned-doc contract: the file
// has to carry a four-part version or the package check promotes its absence.
function changelogEntryText(skillName, version) {
  return [
    '---',
    `title: "${skillName} v${version}"`,
    `description: "The first changelog entry for ${skillName}, recording its conversion to a standalone Skilled root."`,
    'trigger_phrases:',
    `  - "${skillName} v${version}"`,
    `  - "${skillName} ${version}"`,
    'importance_tier: "normal"',
    'contextType: "general"',
    `version: ${version}`,
    '---',
    '',
    `The conversion made ${skillName} a standalone Skilled root: its SKILL.md points at a sibling ROUTER.md,`,
    `and its graph metadata, regression cases and changelog live in its own folder from here on.`,
    '',
    "## What's New at a Glance",
    '',
    `- **${skillName} is a standalone root.** It owns its router, its graph metadata and this changelog.`,
    '',
  ].join('\n');
}

function integrateI6Changelog(options) {
  const { context, fileSystem, skillRoot, name, version } = options;
  const changelogDirectory = path.join(skillRoot, 'changelog');
  const entry = path.join(changelogDirectory, `v${version}.md`);
  const indexDirectory = path.join(context.repoRoot, ...CHANGELOG_INDEX);
  const link = path.join(indexDirectory, name);
  const linkTarget = path.relative(indexDirectory, changelogDirectory).split(path.sep).join('/');
  const linkLabel = pathLabel(context.repoRoot, link);
  const entryLabel = pathLabel(context.repoRoot, entry);
  // The index resolves the folder name one level up, so only a root sitting directly
  // in the skills folder is what ../skills/<name>/changelog can reach. A link for any
  // other root would be a path the operator cannot follow, so it is reported instead.
  const linkable = isDirectChild(context.skillsDir, skillRoot, fileSystem);
  const entryExists = fileSystem.existsSync(entry);
  const linkExists = linkable && pathOccupied(fileSystem, link);
  const linkNotApplicable = `I6 ${ROW_TITLES.I6}: n/a - ${pathLabel(context.repoRoot, skillRoot)} is not a direct child of `
    + `${pathLabel(context.repoRoot, context.skillsDir)}, so no index link can point at ../skills/${name}/changelog.`;

  const planLines = [
    entryExists
      ? `I6 ${ROW_TITLES.I6}: keep the existing ${entryLabel}.`
      : `I6 ${ROW_TITLES.I6}: Create ${entryLabel}.`,
    linkable
      ? (linkExists
        ? `I6 ${ROW_TITLES.I6}: keep the existing index link ${linkLabel}; it is never replaced.`
        : `I6 ${ROW_TITLES.I6}: Create the relative link ${linkLabel} -> ${linkTarget}.`)
      : linkNotApplicable,
  ];
  const plannedWrites = [];
  if (!entryExists) {
    plannedWrites.push({ kind: 'create', file: entry, detail: `Create the ${version} changelog entry.` });
  }
  if (linkable && !linkExists) {
    plannedWrites.push({ kind: 'create', file: link, detail: `Link the changelog index to ${linkTarget}.` });
  }

  return makeRow('I6', planLines, () => {
    const lines = [];
    const writes = [];
    ensureDirectory(fileSystem, changelogDirectory);
    if (entryExists) {
      lines.push(`I6 ${ROW_TITLES.I6}: ${entryLabel} already exists.`);
    } else {
      fileSystem.writeFileSync(entry, changelogEntryText(name, version), { encoding: 'utf8', flag: 'wx' });
      lines.push(`I6 ${ROW_TITLES.I6}: created ${entryLabel}.`);
      writes.push({ kind: 'create', file: entry, detail: `Created the ${version} changelog entry.` });
    }
    if (!linkable) {
      lines.push(linkNotApplicable);
    } else if (linkExists) {
      lines.push(`I6 ${ROW_TITLES.I6}: ${linkLabel} already exists and was left as it is.`);
    } else {
      ensureDirectory(fileSystem, indexDirectory);
      fileSystem.symlinkSync(linkTarget, link);
      lines.push(`I6 ${ROW_TITLES.I6}: created ${linkLabel} -> ${linkTarget}.`);
      writes.push({ kind: 'create', file: link, detail: `Linked the changelog index to ${linkTarget}.` });
    }
    return { status: 'DONE', lines, writes };
  }, { writes: plannedWrites });
}

// A dangling link still occupies its name, so it is kept and reported rather than
// replaced: the operator may have pointed it somewhere on purpose.
function pathOccupied(fileSystem, target) {
  try {
    fileSystem.lstatSync(target);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLAN AND APPLY
// ─────────────────────────────────────────────────────────────────────────────

function planIntegration(options = {}) {
  const resolved = resolveOptions(options);
  const rows = [
    integrateI1AdvisorScan(resolved),
    integrateI2CompiledGraph(resolved),
    integrateI3ReachAndBudget(resolved),
    integrateI4RegressionCases(resolved),
    integrateI5RuntimeMirrors(resolved),
    integrateI6Changelog(resolved),
  ];
  return {
    name: resolved.name,
    skillRoot: resolved.skillRoot,
    version: resolved.version,
    rows,
    lines: [`Integration plan: ${resolved.name}`, ...rows.flatMap((row) => row.planLines)],
    writes: rows.flatMap((row) => row.writes),
  };
}

// Writes only under an explicit apply. Planning reads the skill and nothing else,
// so a printed plan never costs the operator a file.
function applyIntegration(options = {}) {
  const plan = planIntegration(options);
  if (options.apply !== true) return { applied: false, ok: false, plan, results: [], writes: [], lines: [] };

  const results = [];
  for (const row of plan.rows) {
    let outcome;
    try {
      outcome = row.run();
    } catch (error) {
      outcome = {
        status: 'FAILED',
        lines: [`${row.id} ${row.title}: FAILED - ${firstLine(error.message)}`],
        writes: [],
      };
    }
    results.push({
      id: row.id,
      title: row.title,
      status: outcome.status,
      lines: outcome.lines || [],
      writes: outcome.writes || [],
    });
  }
  return {
    applied: true,
    ok: results.every((result) => result.status === 'DONE' || result.status === 'N/A'),
    plan,
    results,
    writes: results.flatMap((result) => result.writes),
    lines: results.flatMap((result) => result.lines),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ADVISOR_REBUILD_FALLBACK,
  DESCRIPTION_BUDGET,
  IntegrationError,
  applyIntegration,
  buildCaseRows,
  changelogEntryText,
  integrateI1AdvisorScan,
  integrateI2CompiledGraph,
  integrateI3ReachAndBudget,
  integrateI4RegressionCases,
  integrateI5RuntimeMirrors,
  integrateI6Changelog,
  isFrameworkSkill,
  planIntegration,
  proposeEnhanceTargets,
  selectPhrases,
};
