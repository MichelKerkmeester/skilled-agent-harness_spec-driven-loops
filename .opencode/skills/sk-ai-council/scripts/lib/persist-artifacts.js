// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ lib/persist-artifacts (library)                                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Council artifact writers, parser, and renderer with scoped writes        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const {
  SCHEMA_VERSION,
  PROTOCOL,
  PRODUCER_VERSION,
  appendArtifactWrittenEvent,
  computeChecksum,
  normalizeEvent,
  normalizeRoundId,
} = require('./audit-trail.js');

// ────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ────────────────────────────────────────────────────────────────────────────

const DEFAULT_TIMESTAMP = '1970-01-01T00:00:00.000Z';
const DEFAULT_MAX_ROUNDS = 3;
const MAX_SLUG_LENGTH = 80;
const OPTIONAL_ALIASES = {
  crossReferences: ['cross-references', 'cross references'],
  droppedAlternatives: ['dropped alternatives'],
  deliberationNotes: ['deliberation notes', 'deliberation notes details'],
  risksMitigations: ['risks & mitigations', 'risks and mitigations', 'risks & mitigations details'],
};

// ────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ────────────────────────────────────────────────────────────────────────────

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeHeading(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/^#+\s*/, '')
    .replace(/^§?\d+[\).\s-]+/, '')
    .replace(/[`:]+$/g, '')
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH) || 'unknown';
}

function metadataEvent(event) {
  const { schema_version, protocol, producer, ...payload } = event || {};
  return normalizeEvent(payload);
}

/**
 * Parse one JSONL state event and preserve legacy schema defaults.
 *
 * @param {string} line - JSONL line to parse
 * @returns {Object} Parsed state event with schema metadata
 * @throws {Error} When the state line is not a JSON object
 */
function parseStateLine(line) {
  const event = JSON.parse(line);
  if (typeof event !== 'object' || event === null || Array.isArray(event)) {
    throw new Error('[ai-council] Expected object state event');
  }
  return {
    schema_version: '1',
    ...event,
  };
}

/**
 * Parse a council JSONL state log into normalized event objects.
 *
 * @param {string} jsonl - State log content
 * @returns {Object[]} Parsed state events
 */
function parseStateLog(jsonl) {
  return String(jsonl || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseStateLine);
}

function roundLabel(round) {
  return normalizeRoundId(round);
}

function splitSections(markdown) {
  const source = String(markdown || '').replace(/\r\n/g, '\n');
  const headingPattern = /^(#{2,6})\s+(.+)$/gm;
  const matches = [...source.matchAll(headingPattern)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    return {
      level: match[1].length,
      heading: normalizeText(match[2]),
      normalized: normalizeHeading(match[2]),
      content: source.slice(start, end).trim(),
      raw: source.slice(match.index, end).trim(),
    };
  });
}

function findSection(sections, aliases) {
  const normalizedAliases = aliases.map(normalizeHeading);
  return sections.find((section) => normalizedAliases.includes(section.normalized)) || null;
}

function parseMarkdownTable(sectionText) {
  const lines = String(sectionText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'));
  if (lines.length < 3) return [];

  const headers = lines[0].split('|').slice(1, -1).map(normalizeHeading);
  return lines.slice(2)
    .filter((line) => !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line))
    .map((line) => {
      const cells = line.split('|').slice(1, -1).map((cell) => normalizeText(cell));
      return headers.reduce((record, header, index) => {
        record[header] = cells[index] || '';
        return record;
      }, {});
    })
    .filter((record) => Object.values(record).some(Boolean));
}

function normalizeSeatId(value, index) {
  const text = normalizeText(value);
  const numberMatch = text.match(/(?:seat[-\s]*)?(\d{1,3})/i);
  const seatNumber = numberMatch ? Number(numberMatch[1]) : index + 1;
  return `seat-${String(seatNumber).padStart(3, '0')}`;
}

function parseCompositionSeats(composition) {
  return parseMarkdownTable(composition ? composition.content : '').map((row, index) => {
    const seatLabel = row.seat || `seat-${String(index + 1).padStart(3, '0')}`;
    return {
      id: normalizeSeatId(seatLabel, index),
      label: seatLabel,
      lens: row['strategy lens'] || row.lens || 'Unknown',
      vantage: row['ai vantage target'] || row.vantage || 'Unknown',
      mandate: row['distinct mandate'] || row.mandate || '',
      confidence: row.confidence || '',
      content: '',
      source: 'composition-table',
    };
  });
}

function parseSeatSections(sections, compositionSeats) {
  const seatSections = sections.filter((section) => /^seat\s+\d{1,3}\b|^seat-\d{1,3}\b/i.test(section.normalized));
  if (!seatSections.length) return compositionSeats;

  return seatSections.map((section, index) => {
    const fallback = compositionSeats[index] || {};
    const id = normalizeSeatId(section.heading, index);
    const title = section.heading.replace(/^Seat\s+\d+\s*[-:—]\s*/i, '');
    const parts = title.split('/').map(normalizeText);
    return {
      id,
      label: id,
      lens: parts[0] || fallback.lens || 'Unknown',
      vantage: parts[1] || fallback.vantage || 'Unknown',
      mandate: fallback.mandate || '',
      confidence: fallback.confidence || '',
      content: section.content,
      source: 'seat-heading',
    };
  });
}

function parsePlanConfidence(section) {
  if (!section) return null;
  const overall = section.content.match(/\*\*Overall\*\*\s*:\s*([0-9]{1,3})%?/i)
    || section.content.match(/Overall\s*:\s*([0-9]{1,3})%?/i)
    || section.content.match(/([0-9]{1,3})\s*\/\s*100/);
  return overall ? Number(overall[1]) : null;
}

function collectOptionalSections(sections) {
  return Object.entries(OPTIONAL_ALIASES).reduce((result, [key, aliases]) => {
    const section = findSection(sections, aliases);
    result[key] = section ? section.content : '';
    return result;
  }, {});
}

function collectExtraSections(sections) {
  const known = new Set([
    'task classification',
    'council composition',
    'strategy comparison',
    'deliberation notes',
    'winning strategy',
    'recommended plan',
    'implementation steps',
    'prerequisites',
    'plan confidence',
    'dropped alternatives',
    'risks & mitigations',
    'risks and mitigations',
    'planning-only boundary',
    'cross-references',
  ]);
  return sections
    .filter((section) => !known.has(section.normalized) && !/^seat\s+\d{1,3}\b|^seat-\d{1,3}\b/i.test(section.normalized))
    .map((section) => section.heading);
}

/**
 * Throw OUT_OF_SCOPE_WRITE if a relative path attempts parent-directory traversal.
 *
 * @param {string} relativePath - Caller-provided relative path
 * @param {string} aiCouncilRoot - Absolute path of the council root
 * @throws {Error} With code 'OUT_OF_SCOPE_WRITE' when traversal is detected
 */
function rejectParentTraversal(relativePath, aiCouncilRoot) {
  if (String(relativePath).split(/[\\/]+/).includes('..')) {
    const error = new Error(`OUT_OF_SCOPE_WRITE: Refusing to write outside ${aiCouncilRoot}: ${relativePath}`);
    error.code = 'OUT_OF_SCOPE_WRITE';
    throw error;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ────────────────────────────────────────────────────────────────────────────

/**
 * Parse a council report into the artifact writer's structured model.
 *
 * @param {string} markdown - Council report markdown
 * @returns {Object} Parsed council report with validation details
 */
function parseCouncilReport(markdown) {
  const sectionsList = splitSections(markdown);
  const title = String(markdown || '').replace(/\r\n/g, '\n').split('\n').find((line) => /^#{1,2}\s+/.test(line));
  const composition = findSection(sectionsList, ['Council Composition']);
  const recommendedPlan = findSection(sectionsList, ['Recommended Plan']);
  const planConfidence = findSection(sectionsList, ['Plan Confidence']);
  const compositionSeats = parseCompositionSeats(composition);
  const seats = parseSeatSections(sectionsList, compositionSeats);

  const missing = [];
  if (!composition) missing.push('Council Composition');
  if (!seats.length) missing.push('Per-seat sections');
  if (!recommendedPlan) missing.push('Recommended Plan');
  if (!planConfidence) missing.push('Plan Confidence');

  return {
    ok: missing.length === 0,
    missing,
    title: title ? normalizeText(title.replace(/^#{1,2}\s+/, '')) : '',
    sections: sectionsList.reduce((result, section) => {
      result[section.heading] = section.content;
      return result;
    }, {}),
    seats,
    composition: composition ? composition.content : '',
    recommendedPlan: recommendedPlan ? recommendedPlan.content : '',
    planConfidence: parsePlanConfidence(planConfidence),
    optionalSections: collectOptionalSections(sectionsList),
    extraSections: collectExtraSections(sectionsList),
    rawMarkdown: String(markdown || '').replace(/\r\n/g, '\n').trim(),
  };
}

function plainText(markdown) {
  return normalizeText(String(markdown || '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, ''));
}

function firstParagraph(markdown) {
  const blocks = String(markdown || '')
    .split(/\n\s*\n/)
    .map(plainText)
    .filter(Boolean);
  return blocks[0] || 'Multi-AI Council completed and produced a recommended plan.';
}

function listItems(markdown) {
  const items = [];
  for (const line of String(markdown || '').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
    if (match) items.push(plainText(match[1]));
  }
  return items.filter(Boolean);
}

/**
 * Build a memory-save payload from a parsed council report.
 *
 * @param {Object} parsed - Parsed council report
 * @param {string} packetSpecFolder - Packet spec folder for the payload
 * @returns {Object} Memory-save payload
 */
function buildMemorySavePayload(parsed, packetSpecFolder) {
  const recommendedPlan = parsed.recommendedPlan || '';
  const droppedAlternatives = parsed.optionalSections.droppedAlternatives || '';
  const risksMitigations = parsed.optionalSections.risksMitigations || '';
  const implementationSteps = parsed.sections['Implementation Steps'] || '';
  const decisions = listItems(recommendedPlan).concat(listItems(droppedAlternatives));
  const followUps = listItems(risksMitigations).concat(listItems(implementationSteps));

  return {
    topic: parsed.title || 'Multi-AI Council',
    spec_folder: path.resolve(packetSpecFolder),
    session_summary: firstParagraph(recommendedPlan),
    decisions,
    files_changed: [],
    follow_ups: followUps,
    tests: [],
    completion_status: followUps.length ? 'complete-with-deferrals' : 'complete',
  };
}

function renderSeatArtifact(seat, round) {
  return `---
round: ${round}
seat: ${seat.id}
executor: ${slugify(seat.vantage)}
lens: ${JSON.stringify(seat.lens)}
status: ok
timestamp: ${DEFAULT_TIMESTAMP}
simulated: false
---

# ${seat.id}: ${seat.lens} / ${seat.vantage}

## Mandate
${seat.mandate || '[No mandate captured]'}

## Confidence
${seat.confidence || '[No confidence captured]'}

## Seat Output
${seat.content || '[No per-seat section was present; derived from Council Composition table]'}
`;
}

function optionalBlock(title, value, strictOutput) {
  if (value) return `## ${title}\n${value}\n`;
  return strictOutput ? '' : `## ${title}\n[Optional section not present in source report]\n`;
}

/**
 * Render parsed council data into all persisted artifact payloads.
 *
 * @param {Object} parsed - Parsed council report
 * @param {Object} [options={}] - Rendering options
 * @param {number} [options.round=1] - Council round number
 * @param {boolean} [options.strictOutput=false] - Omit missing optional blocks
 * @param {string} [options.timestamp] - Artifact timestamp
 * @param {string} [options.specFolder] - Packet spec folder path
 * @param {number} [options.maxRounds] - Configured maximum round count
 * @returns {Object} Rendered artifact payloads and relative paths
 */
function renderArtifacts(parsed, options = {}) {
  const round = Number(options.round || 1);
  const roundDir = roundLabel(round);
  const strictOutput = Boolean(options.strictOutput);
  const timestamp = options.timestamp || DEFAULT_TIMESTAMP;
  const specFolder = options.specFolder || '<packet-spec-folder>';

  const config = `${JSON.stringify({
    spec_folder: specFolder,
    current_round: round,
    max_rounds: options.maxRounds || DEFAULT_MAX_ROUNDS,
    seats_per_round: parsed.seats.length,
    convergence_signal: 'two-of-three-agree',
    created_at: timestamp,
    updated_at: timestamp,
    status: 'complete',
  }, null, 2)}\n`;

  const strategy = `# Multi-AI Council Strategy

## Purpose
Persist a planning-only council report into packet-local ai-council artifacts.

## Composition
${parsed.composition || '[Missing composition]'}

## Recommended Plan
${parsed.recommendedPlan || '[Missing recommended plan]'}
`;

  const seats = parsed.seats.map((seat, index) => ({
    path: `seats/${roundDir}/${seat.id}-${slugify(seat.vantage || `seat-${index + 1}`)}.md`,
    content: renderSeatArtifact(seat, round),
  }));

  const deliberation = `# Multi-AI Council Deliberation ${roundDir}

## Council Composition
${parsed.composition}

${optionalBlock('Deliberation Notes', parsed.optionalSections.deliberationNotes, strictOutput)}
${optionalBlock('Risks & Mitigations', parsed.optionalSections.risksMitigations, strictOutput)}
## Recommended Plan
${parsed.recommendedPlan}

## Plan Confidence
${parsed.planConfidence === null ? '[No numeric confidence captured]' : `${parsed.planConfidence}/100`}
`;

  const stateEvents = [
    { event: 'round_start', round, timestamp, seats: parsed.seats.map((seat) => seat.id) },
    ...parsed.seats.map((seat) => ({ event: 'seat_returned', round, seat: seat.id, timestamp, status: 'ok' })),
    { event: 'deliberation_synthesized', round, timestamp, convergence_score: parsed.planConfidence },
    { event: 'round_end', round, timestamp, new_findings_count: parsed.extraSections.length },
    { event: 'council_complete', timestamp, final_report_path: 'ai-council/council-report.md', convergence: true },
  ].map(metadataEvent);

  const stateLog = `${stateEvents.map((event) => JSON.stringify(event)).join('\n')}\n`;
  const councilReport = `${parsed.rawMarkdown}\n`;
  return { config, strategy, stateLog, seats, deliberation, deliberationPath: `deliberations/${roundDir}.md`, councilReport };
}

function assertInside(baseDir, targetPath) {
  const relative = path.relative(baseDir, targetPath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    const error = new Error(`OUT_OF_SCOPE_WRITE: Refusing to write outside ${baseDir}: ${targetPath}`);
    error.code = 'OUT_OF_SCOPE_WRITE';
    throw error;
  }
}

function statePathFor(aiCouncilRoot) {
  return path.resolve(aiCouncilRoot, 'ai-council-state.jsonl');
}

function writeFileScoped(aiCouncilRoot, relativePath, content, options = {}) {
  const targetPath = path.resolve(aiCouncilRoot, relativePath);
  assertInside(aiCouncilRoot, targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
  if (options.audit !== false) {
    const writtenContent = fs.readFileSync(targetPath);
    appendArtifactWrittenEvent(statePathFor(aiCouncilRoot), {
      path: relativePath.replace(/\\/g, '/'),
      bytes: writtenContent.length,
      checksum: computeChecksum(writtenContent),
      timestamp: options.timestamp || new Date().toISOString(),
      seat_id: options.seat_id || options.seatId || null,
      round_id: options.round_id || options.roundId || 1,
      maxBytes: options.maxBytes,
    });
  }
  return targetPath;
}

function councilRootFor(packetSpecFolder) {
  if (!packetSpecFolder) throw new Error('[ai-council] packet spec folder is required');
  const packetRoot = path.resolve(packetSpecFolder);
  const aiCouncilRoot = path.resolve(packetRoot, 'ai-council');
  assertInside(packetRoot, aiCouncilRoot);
  return { packetRoot, aiCouncilRoot };
}

/**
 * Write the council configuration artifact.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {string} content - Configuration JSON content
 * @param {Object} [options={}] - Scoped write and audit options
 * @returns {string} Absolute path to the written artifact
 */
function writeConfig(packetSpecFolder, content, options = {}) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  return writeFileScoped(aiCouncilRoot, 'ai-council-config.json', content, options);
}

/**
 * Write the council strategy markdown artifact.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {string} content - Strategy markdown content
 * @param {Object} [options={}] - Scoped write and audit options
 * @returns {string} Absolute path to the written artifact
 */
function writeStrategyMd(packetSpecFolder, content, options = {}) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  return writeFileScoped(aiCouncilRoot, 'ai-council-strategy.md', content, options);
}

/**
 * Write the council state JSONL artifact.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {string} content - State JSONL content
 * @param {Object} [options={}] - Scoped write and audit options
 * @returns {string} Absolute path to the written artifact
 */
function writeStateJsonl(packetSpecFolder, content, options = {}) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  return writeFileScoped(aiCouncilRoot, 'ai-council-state.jsonl', content, options);
}

/**
 * Write a seat artifact under the council seats directory.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {string} relativePath - Seat-relative or ai-council-relative path
 * @param {string} content - Seat markdown content
 * @param {Object} [options={}] - Scoped write and audit options
 * @returns {string} Absolute path to the written artifact
 */
function writeSeat(packetSpecFolder, relativePath, content, options = {}) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  rejectParentTraversal(relativePath, aiCouncilRoot);
  const seatPath = relativePath.startsWith('seats/') ? relativePath : path.join('seats', relativePath);
  return writeFileScoped(aiCouncilRoot, seatPath, content, options);
}

/**
 * Write a deliberation artifact under the council deliberations directory.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {string} relativePath - Deliberation-relative or ai-council-relative path
 * @param {string} content - Deliberation markdown content
 * @param {Object} [options={}] - Scoped write and audit options
 * @returns {string} Absolute path to the written artifact
 */
function writeDeliberation(packetSpecFolder, relativePath, content, options = {}) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  rejectParentTraversal(relativePath, aiCouncilRoot);
  const deliberationPath = relativePath.startsWith('deliberations/')
    ? relativePath
    : path.join('deliberations', relativePath);
  return writeFileScoped(aiCouncilRoot, deliberationPath, content, options);
}

/**
 * Write a critique artifact under the council critiques directory.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {string} relativePath - Critique-relative or ai-council-relative path
 * @param {string} content - Critique markdown content
 * @param {Object} [options={}] - Scoped write and audit options
 * @returns {string} Absolute path to the written artifact
 */
function writeCritique(packetSpecFolder, relativePath, content, options = {}) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  rejectParentTraversal(relativePath, aiCouncilRoot);
  const critiquePath = relativePath.startsWith('critiques/') ? relativePath : path.join('critiques', relativePath);
  return writeFileScoped(aiCouncilRoot, critiquePath, content, options);
}

/**
 * Write the final council report artifact.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {string} content - Council report markdown content
 * @param {Object} [options={}] - Scoped write and audit options
 * @returns {string} Absolute path to the written artifact
 */
function writeReport(packetSpecFolder, content, options = {}) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  return writeFileScoped(aiCouncilRoot, 'council-report.md', content, options);
}

/**
 * Write all rendered council artifacts and collect conflict messages.
 *
 * @param {string} packetSpecFolder - Packet spec folder to write into
 * @param {Object} rendered - Rendered artifact payloads
 * @returns {Object} Written paths and conflict messages
 */
function writeArtifacts(packetSpecFolder, rendered) {
  const { packetRoot, aiCouncilRoot } = councilRootFor(packetSpecFolder);

  const written = [];
  const conflicts = [];
  fs.mkdirSync(packetRoot, { recursive: true });
  fs.mkdirSync(aiCouncilRoot, { recursive: true });

  const roundId = rendered.deliberationPath
    ? path.basename(rendered.deliberationPath, '.md')
    : 'round-001';
  const files = [
    () => writeStateJsonl(packetRoot, rendered.stateLog, { round_id: roundId, timestamp: DEFAULT_TIMESTAMP }),
    () => writeConfig(packetRoot, rendered.config, { round_id: roundId, timestamp: DEFAULT_TIMESTAMP }),
    () => writeStrategyMd(packetRoot, rendered.strategy, { round_id: roundId, timestamp: DEFAULT_TIMESTAMP }),
    () => writeDeliberation(packetRoot, rendered.deliberationPath || 'deliberations/round-001.md', rendered.deliberation, { round_id: roundId, timestamp: DEFAULT_TIMESTAMP }),
    () => writeReport(packetRoot, rendered.councilReport, { round_id: roundId, timestamp: DEFAULT_TIMESTAMP }),
    ...rendered.seats.map((seat) => () => writeSeat(packetRoot, seat.path, seat.content, {
      round_id: roundId,
      seat_id: path.basename(seat.path).replace(/\.md$/, '').split('-').slice(0, 2).join('-'),
      timestamp: DEFAULT_TIMESTAMP,
    })),
  ];

  for (const writeFile of files) {
    try {
      written.push(writeFile());
    } catch (error) {
      conflicts.push(error instanceof Error ? error.message : String(error));
    }
  }

  return { written, conflicts };
}

/**
 * Append one normalized event to the packet council state log.
 *
 * @param {string} packetSpecFolder - Packet spec folder containing ai-council
 * @param {Object} event - State event payload
 * @returns {string} Absolute path to the state JSONL file
 */
function appendStateLine(packetSpecFolder, event) {
  const { aiCouncilRoot } = councilRootFor(packetSpecFolder);
  const statePath = path.resolve(aiCouncilRoot, 'ai-council-state.jsonl');
  assertInside(aiCouncilRoot, statePath);
  fs.mkdirSync(aiCouncilRoot, { recursive: true });
  fs.appendFileSync(statePath, `${JSON.stringify(metadataEvent(event))}\n`, 'utf8');
  return statePath;
}

function parseArgs(argv) {
  const args = {
    packetSpecFolder: null,
    round: 1,
    inputFile: null,
    strictOutput: false,
    force: false,
    memorySavePayloadOut: null,
  };
  const rest = [...argv];
  args.packetSpecFolder = rest.shift() || null;
  while (rest.length) {
    const flag = rest.shift();
    if (flag === '--round') args.round = Number(rest.shift());
    else if (flag === '--input-file') args.inputFile = rest.shift();
    else if (flag === '--memory-save-payload-out') args.memorySavePayloadOut = rest.shift();
    else if (flag === '--strict-output') args.strictOutput = true;
    else if (flag === '--force') args.force = true;
    else throw new Error(`[ai-council] Unknown argument: ${flag}`);
  }
  if (!args.packetSpecFolder) {
    throw new Error('Usage: node persist-artifacts.cjs <packet-spec-folder> [--round NNN] [--input-file FILE] [--memory-save-payload-out FILE] [--strict-output] [--force]');
  }
  if (args.memorySavePayloadOut === undefined) {
    throw new Error('[ai-council] --memory-save-payload-out requires a file path');
  }
  roundLabel(args.round);
  return args;
}

function readInput(inputFile) {
  if (inputFile) return fs.readFileSync(inputFile, 'utf8');
  return fs.readFileSync(0, 'utf8');
}

/**
 * Run the council artifact persistence CLI.
 *
 * @param {string[]} [argv=process.argv.slice(2)] - CLI arguments
 * @returns {number} Process exit code
 */
function main(argv = process.argv.slice(2)) {
  let args;
  try {
    args = parseArgs(argv);
    const markdown = readInput(args.inputFile);
    if (!normalizeText(markdown)) throw new Error('[ai-council] No council report input provided');
    const parsed = parseCouncilReport(markdown);
    if (!parsed.ok) {
      console.error(`[ai-council] Missing required section(s): ${parsed.missing.join(', ')}`);
      return 1;
    }
    const rendered = renderArtifacts(parsed, {
      round: args.round,
      strictOutput: args.strictOutput,
      specFolder: path.resolve(args.packetSpecFolder),
    });
    const result = writeArtifacts(args.packetSpecFolder, rendered, { force: args.force });
    if (result.conflicts.length) {
      console.error(`[ai-council] Partial write failure:\n${result.conflicts.join('\n')}`);
      return 2;
    }
    if (args.memorySavePayloadOut) {
      try {
        const payload = buildMemorySavePayload(parsed, args.packetSpecFolder);
        fs.mkdirSync(path.dirname(path.resolve(args.memorySavePayloadOut)), { recursive: true });
        fs.writeFileSync(path.resolve(args.memorySavePayloadOut), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
      } catch (payloadError) {
        console.warn(`[ai-council] Failed to write memory-save payload: ${payloadError instanceof Error ? payloadError.message : String(payloadError)}`);
        return 2;
      }
    }
    console.log(`[ai-council] Wrote ${result.written.length} artifact(s) to ${path.resolve(args.packetSpecFolder, 'ai-council')}`);
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ────────────────────────────────────────────────────────────────────────────

module.exports = {
  SCHEMA_VERSION,
  PROTOCOL,
  PRODUCER_VERSION,
  parseCouncilReport,
  parseStateLine,
  parseStateLog,
  renderArtifacts,
  buildMemorySavePayload,
  writeConfig,
  writeStrategyMd,
  writeStateJsonl,
  writeSeat,
  writeDeliberation,
  writeCritique,
  writeReport,
  writeArtifacts,
  appendStateLine,
  main,
};

if (require.main === module) {
  process.exitCode = main();
}
