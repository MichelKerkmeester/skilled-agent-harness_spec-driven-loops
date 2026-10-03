// ───────────────────────────────────────────────────────────────────
// MODULE: score-fanout-pairs
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Census recorded fan-out lineage registries: report the near-line and
 * cross-body candidate pairs and the merge's own decision on each, then
 * score one backend's answers against the operator's labels when an arm is
 * named. The default run makes no model call and writes no file.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const { parseArgs } = require('node:util');

// The merge itself is the oracle: the census must compare a backend against the
// rule that actually ships, so it calls the merge's exported functions rather
// than keeping a second copy of the collapse rule here.
const { mergeResearchRegistries, mergeReviewRegistries } = require('./fanout-merge.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Registry file a settled lineage is expected to have written, per loop. Research also
// has a legacy name read only as a fallback, so either name counts as the lineage's
// registry; the order below is that reader's own probe order.
const LINEAGE_REGISTRY_FILES = {
  research: ['findings-registry.json', 'deep-research-findings-registry.json'],
  review: ['deep-review-findings-registry.json'],
};

// The findings field each loop's registry aggregates. Reading one loop's field for
// the other would report every lineage that did register findings as empty.
const LINEAGE_REGISTRY_FINDINGS_FIELDS = {
  research: 'keyFindings',
  review: 'openFindings',
};

// The same-body title-overlap band the census calls near-line. It brackets the
// merge's own single collapse threshold, so the census records both the restatements
// the merge collapses and the near misses whose titles have drifted apart.
const NEAR_LINE_MIN_OVERLAP = 0.05;
const NEAR_LINE_MAX_OVERLAP = 0.30;

// Two different bodies never share a body key, so the merge cannot see a problem
// stated twice in different words; this is the text overlap at which the census
// records that pair as a cross-body candidate.
const CROSS_BODY_MIN_OVERLAP = 0.5;

// The label floors: below either count no arm can be scored, because the sign
// test needs enough labeled pairs on each class for its tails to mean anything.
const LABEL_GATE = 40;
const CROSS_BODY_LABEL_GATE = 10;

// The sheet is what one operator fills by hand, so each class is capped; the
// first by hash keeps the sample the same for the same corpus.
const SHEET_PER_CLASS = 60;

// A baseline already right on more than nine pairs in ten leaves no room for a
// backend to show a gain; the comparison stays strict so exactly ninety percent
// still opens the gate.
const HEADROOM = 0.9;

// Stopwords stripped before titles are compared, copied from the merge's own list so
// the census scores titles exactly as the collapse does.
const TITLE_STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'of', 'for', 'and', 'or', 'with', 'without',
  'is', 'are', 'was', 'were', 'be', 'no', 'not', 'so', 'that', 'this', 'it', 'its', 'as',
  'by', 'from', 'into', 'after', 'before', 'when', 'where', 'which', 'has', 'have',
]);

// The one judgment question the arms ask, fixed before any run; the answer's
// noul counts as "same" from one half upward.
const NOUL_QUESTION = 'Do these two findings describe the same problem?';

// The first two orders swap the findings; only a split pays for a third order.
const JEV_INITIAL_ORDERS = ['AB', 'BA'];
const JEV_MAX_ORDERS = 3;

// Zero-call comparators and the displayed calibration cuts stay fixed across runs.
const LEXICAL_JACCARD_AT = 0.4;
const CUT_SWEEP = [0.4, 0.45, 0.5];

// The pinned client version the gate accepts.
const JEV_VERSION = 'jev 0.6.2';

// Every measured call is bounded so one hung spawn cannot hang the run, and
// the backoff is the single retry wait a transient Jev failure gets.
const JEV_CALL_TIMEOUT_MS = 90000;
const JEV_BACKOFF_MS = 2000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List every tracked file under a repository root.
 *
 * The census judges the published corpus, not a working tree that may hold
 * scratch registries no run ever committed, so it asks git for the tracked set.
 * A repository git cannot read is a census over nothing rather than a crash.
 *
 * @param {string} root - Repository root the walk runs under
 * @param {Function} [run] - spawnSync-shaped runner, injected in tests
 * @returns {string[]} Repo-relative tracked paths, sorted; empty on a git failure
 */
function listTrackedFiles(root, run = spawnSync) {
  // The repository's path list exceeds the 1 MB spawnSync default, whose ENOBUFS would read as no files.
  const result = run('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 268435456 });
  if (!result || result.error || result.status !== 0 || typeof result.stdout !== 'string') {
    return [];
  }
  return result.stdout.split('\0').filter((entry) => entry !== '').sort();
}

/**
 * Group the tracked lineage registries into the runs that produced them.
 *
 * A run is one fan-out, laid out as `<runDir>/<loop>/lineages/<label>/<registry>`.
 * A run with fewer than two lineages never had a merge to shadow. One lineage that
 * wrote both research registry names is still one lineage: the names are two
 * spellings of one registry, and keeping both would pair a lineage with itself.
 *
 * @param {string} root - Repository root the tracked paths are relative to
 * @param {Object} [deps] - Injected collaborators
 * @param {Function} [deps.listTracked] - Returns the tracked path list
 * @returns {Array<Object>} Runs with 2+ lineages, each `{key, loop, runDir, lineages}`
 */
function walkRuns(root, { listTracked } = {}) {
  const tracked = typeof listTracked === 'function' ? listTracked() : listTrackedFiles(root);
  const runsByKey = new Map();
  for (const relPath of tracked) {
    const parts = relPath.split('/');
    const registryFile = parts[parts.length - 1];
    const label = parts[parts.length - 2];
    const loop = parts[parts.length - 4];
    if (parts[parts.length - 3] !== 'lineages' || !label) continue;
    const registryFiles = LINEAGE_REGISTRY_FILES[loop];
    if (!Array.isArray(registryFiles) || !registryFiles.includes(registryFile)) continue;
    const runDir = parts.slice(0, parts.length - 4).join('/');
    if (!runDir) continue;
    const key = `${loop}:${runDir}`;
    if (!runsByKey.has(key)) runsByKey.set(key, { key, loop, runDir, byLabel: new Map() });
    const byLabel = runsByKey.get(key).byLabel;
    const rank = registryFiles.indexOf(registryFile);
    const previous = byLabel.get(label);
    const previousRank = previous ? registryFiles.indexOf(previous.split('/').pop()) : -1;
    // The contract puts the canonical name first and the fallback second, so a
    // stale fallback copy can never stand in for the live registry.
    if (previous && previousRank <= rank) continue;
    byLabel.set(label, relPath);
  }
  return [...runsByKey.values()]
    .map((run) => ({
      key: run.key,
      loop: run.loop,
      runDir: run.runDir,
      lineages: [...run.byLabel.entries()]
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([label, registry]) => ({ label, registry })),
    }))
    .filter((run) => run.lineages.length >= 2)
    .sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
}

/**
 * Read one lineage registry's findings.
 *
 * An unreadable or malformed registry cannot evidence a pair, and one bad file
 * must not sink a census over hundreds of runs, so it reads as a lineage that
 * registered nothing, the same treatment the run-time census gives it.
 *
 * @param {string} root - Repository root the registry path is relative to
 * @param {string} loop - `research` or `review`
 * @param {string} registry - Repo-relative registry path
 * @returns {Array<Object>} Findings that carry an identity, in registry order
 */
function findingsOf(root, loop, registry) {
  const field = LINEAGE_REGISTRY_FINDINGS_FIELDS[loop];
  if (typeof field !== 'string') return [];
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(path.join(root, registry), 'utf8'));
  } catch {
    return [];
  }
  const rows = parsed && Array.isArray(parsed[field]) ? parsed[field] : [];
  return rows.filter((finding) => findingId(loop, finding) !== null);
}

/**
 * The identity the merge keys a finding by: its own id, or its title when the
 * producer left the id off. The merge accepts either as the key, so the census
 * reads them the same way; otherwise a title-only finding would be nameless on
 * one side and named on the other, and the two sides would judge different pairs.
 *
 * @param {string} loop - `research` or `review`
 * @param {Object} finding - One registry finding
 * @returns {string|null} The id, the title fallback, or null when neither exists
 */
function findingId(loop, finding) {
  if (!finding || typeof finding !== 'object') return null;
  const id = loop === 'review' ? finding.findingId : finding.id;
  return (id || finding.title) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SELECTION
// ─────────────────────────────────────────────────────────────────────────────

// The merge's own stable serializer and text normalizer, copied with the body key
// below so the census reads a finding exactly as the merge reads it. A local variant
// would make the shadow record measure a different rule than the one it shadows.
function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value && typeof value === 'object') {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = stableValue(value[key]);
    }
    return sorted;
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

function normalizeSortText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase().replace(/\s+/g, ' ') : '';
}

// The merge's identity for the rare finding whose body and title are both empty: its
// content identity with the merge's own annotations stripped, so annotating a finding
// never moves its key. `_lineage` joins that strip list because the census attaches it,
// and a marker the census added must not change the key the census computes.
function contentIdentityKey(record) {
  const durableText = [
    record.title,
    record.summary,
    record.description,
    record.finding,
    record.question,
    record.direction,
  ].map(normalizeSortText).filter(Boolean).join('\u0001');
  return durableText || stableStringify({
    ...record,
    _conflictOf: undefined,
    _conflict_id: undefined,
    _conflicts: undefined,
    _lineages: undefined,
    _lineage: undefined,
    severity: undefined,
    status: undefined,
  });
}

// The fields, in the merge's own order, whose normalized text makes up a finding's
// durable body.
function durableBodyText(record) {
  return [
    record.summary,
    record.description,
    record.finding,
    record.question,
    record.direction,
  ].map(normalizeSortText).filter(Boolean).join('\u0001');
}

/**
 * The body identity the merge keys a finding by, copied from its own
 * `nearDuplicateContentKey`: the durable body fields joined, else the content identity.
 *
 * The census must see the same body key the merge collapses on, so this is the merge's
 * function rather than a second implementation; the two change together.
 *
 * @param {Object} record - One registry finding
 * @returns {string} Joined durable body text, or the content identity
 */
function bodyKey(record) {
  return durableBodyText(record) || contentIdentityKey(record);
}

function contentTokens(text) {
  const raw = typeof text === 'string' ? text : '';
  return new Set(normalizeSortText(raw).split(/[^a-z0-9]+/).filter((token) => token && !TITLE_STOPWORDS.has(token)));
}

/**
 * The content tokens of a finding's title: lowercased words with the stopwords
 * stripped, as the merge tokenizes titles before measuring their overlap.
 *
 * @param {Object} record - One registry finding
 * @returns {Set<string>} The title's content tokens
 */
function titleTokens(record) {
  const raw = record && typeof record.title === 'string' ? record.title : '';
  return contentTokens(raw);
}

/**
 * Jaccard overlap of two token sets, as the merge measures title overlap.
 *
 * Two empty sets score 1 and one empty set scores 0: with no title tokens there is no
 * signal to tell the findings apart, which is how the merge reads a title-less pair.
 *
 * @param {Set<string>} aTokens - One token set
 * @param {Set<string>} bTokens - The other token set
 * @returns {number} Shared tokens over union, 1 when both sets are empty
 */
function overlap(aTokens, bTokens) {
  if (aTokens.size === 0 && bTokens.size === 0) return 1;
  if (aTokens.size === 0 || bTokens.size === 0) return 0;
  let shared = 0;
  for (const token of aTokens) if (bTokens.has(token)) shared += 1;
  const union = aTokens.size + bTokens.size - shared;
  return union === 0 ? 1 : shared / union;
}

/**
 * The text a model reads for one finding, the durable signal first: its body text,
 * else its title, else the record's own JSON so a caller always has text.
 *
 * @param {Object} record - One registry finding
 * @returns {string} Body text, title, or the stringified record
 */
function findingText(record) {
  const body = durableBodyText(record);
  if (body) return body;
  const title = record && typeof record.title === 'string' ? record.title : '';
  return title || JSON.stringify(record);
}

/**
 * The overlap the census falls back to when a title cannot carry the signal: the
 * title overlap when both findings have title tokens, else the overlap of the text a
 * model would read for them.
 *
 * @param {Object} a - One finding
 * @param {Object} b - The other finding
 * @returns {number} Jaccard overlap of the chosen text
 */
function titleOrTextOverlap(a, b) {
  const aTitleTokens = titleTokens(a);
  const bTitleTokens = titleTokens(b);
  if (aTitleTokens.size > 0 && bTitleTokens.size > 0) return overlap(aTitleTokens, bTitleTokens);
  return overlap(contentTokens(findingText(a)), contentTokens(findingText(b)));
}

/**
 * Class a pair of findings from two lineages, or null when neither class fits.
 *
 * Near-line is the same-body class: one body identity and a title overlap inside the
 * band, which brackets the merge's own single collapse threshold so the record holds
 * both the pairs the merge collapses and the near misses it does not. Cross-body is
 * the pair a body-only key never sees: two different bodies whose text still points
 * at one problem.
 *
 * @param {Object} a - One finding
 * @param {Object} b - The other finding
 * @returns {'near-line'|'cross-body'|null} The pair's class
 */
function classifyPair(a, b) {
  if (bodyKey(a) === bodyKey(b)) {
    const titleScore = overlap(titleTokens(a), titleTokens(b));
    return titleScore >= NEAR_LINE_MIN_OVERLAP && titleScore < NEAR_LINE_MAX_OVERLAP ? 'near-line' : null;
  }
  return titleOrTextOverlap(a, b) >= CROSS_BODY_MIN_OVERLAP ? 'cross-body' : null;
}

/**
 * The stable identity of one candidate pair.
 *
 * A pair must key the same whichever lineage is read first, so the two sides are
 * ordered by lineage label and then by finding id; the sheet, the label file and the
 * merge oracle all join on this string.
 *
 * @param {string} loop - `research` or `review`
 * @param {string} runDir - Run directory relative to the repository root
 * @param {Object} a - One finding, carrying its lineage label as `_lineage`
 * @param {Object} b - The other finding, carrying its lineage label as `_lineage`
 * @returns {string} `<loop>:<runDir>#<label>@<id>|<label>@<id>`
 */
function pairKey(loop, runDir, a, b) {
  const sides = [
    { label: a && typeof a._lineage === 'string' ? a._lineage : '', id: findingId(loop, a) ?? '' },
    { label: b && typeof b._lineage === 'string' ? b._lineage : '', id: findingId(loop, b) ?? '' },
  ];
  sides.sort((left, right) => {
    if (left.label !== right.label) return left.label < right.label ? -1 : 1;
    if (left.id === right.id) return 0;
    return left.id < right.id ? -1 : 1;
  });
  return `${loop}:${runDir}#${sides[0].label}@${sides[0].id}|${sides[1].label}@${sides[1].id}`;
}

/**
 * Hash text or bytes with SHA-256.
 *
 * @param {string|Buffer} input - Text or bytes to hash
 * @returns {string} Lowercase hex digest
 */
function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Classify every finding pair that spans two lineages of a run.
 *
 * A pair inside one lineage is no candidate: the merge folds a lineage's own rows into
 * one stream, and only a second lineage gives it a cross-lineage collapse to shadow.
 * Every surviving pair carries both findings with their lineage labels, the texts the
 * merge compares and the key the sheet and the labels join on, so each later consumer
 * reads one record shape.
 *
 * @param {string} root - Repository root the registries are relative to
 * @param {Object} [deps] - Injected collaborators, as `walkRuns` takes
 * @returns {{'near-line': Array<Object>, 'cross-body': Array<Object>}} Classed pairs per kind, each `{key, loop, runDir, kind, la, a, lb, b, textA, textB}`
 */
function selectCandidates(root, deps = {}) {
  const byKind = { 'near-line': [], 'cross-body': [] };
  for (const run of walkRuns(root, deps)) {
    const lineages = run.lineages.map((lineage) => ({
      label: lineage.label,
      findings: findingsOf(root, run.loop, lineage.registry),
    }));
    for (let left = 0; left < lineages.length; left += 1) {
      for (let right = left + 1; right < lineages.length; right += 1) {
        const aLineage = lineages[left];
        const bLineage = lineages[right];
        for (const a of aLineage.findings) {
          for (const b of bLineage.findings) {
            const kind = classifyPair(a, b);
            if (kind === null) continue;
            const markedA = { ...a, _lineage: aLineage.label };
            const markedB = { ...b, _lineage: bLineage.label };
            byKind[kind].push({
              key: pairKey(run.loop, run.runDir, markedA, markedB),
              loop: run.loop,
              runDir: run.runDir,
              kind,
              la: aLineage.label,
              a: markedA,
              lb: bLineage.label,
              b: markedB,
              textA: findingText(a),
              textB: findingText(b),
            });
          }
        }
      }
    }
  }
  return byKind;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MERGE ORACLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The merge's own decision on one pair: whether it folds the two findings into
 * one, keeps both, or reads neither.
 *
 * The oracle must read the shipped merge rather than a copy of its rule, so this
 * hands the merge a one-finding registry per side -- the smallest shape its
 * schema normalization accepts -- and counts what comes back. One finding means
 * the merge called the pair the same, two means it kept them apart, and a side the
 * merge drops even on its own (a finding the review marked inactive, or a finding
 * with no identity) leaves the pair undecidable, the third state the census
 * records and keeps out of the classes.
 *
 * @param {string} loop - `research` or `review`
 * @param {string} la - The first lineage's label
 * @param {Object} fa - The first lineage's finding
 * @param {string} lb - The second lineage's label
 * @param {Object} fb - The second lineage's finding
 * @param {boolean} dedup - Whether the merge folds near-duplicates
 * @returns {'same'|'different'|'undecidable'} The merge's decision
 */
function mergeDecision(loop, la, fa, lb, fb, dedup) {
  const field = LINEAGE_REGISTRY_FINDINGS_FIELDS[loop];
  if (typeof field !== 'string') return 'undecidable';
  const merge = loop === 'review' ? mergeReviewRegistries : mergeResearchRegistries;
  const options = { enableNearDuplicateDedup: dedup === true };
  const countOf = (registries) => {
    const merged = merge(registries, options);
    return Array.isArray(merged[field]) ? merged[field].length : 0;
  };
  // A side the merge drops on its own never reaches the comparison, so a lone
  // survivor would read as a fold that never happened.
  if (countOf([{ label: la, registry: { [field]: [fa] } }]) !== 1) return 'undecidable';
  if (countOf([{ label: lb, registry: { [field]: [fb] } }]) !== 1) return 'undecidable';
  const both = countOf([
    { label: la, registry: { [field]: [fa] } },
    { label: lb, registry: { [field]: [fb] } },
  ]);
  if (both === 1) return 'same';
  if (both === 2) return 'different';
  return 'undecidable';
}

/**
 * Score the merge against the operator's labels, under both dedup settings.
 *
 * The merge is the incumbent a backend must beat, so its agreement with the
 * labels is the bar a verdict is read against; counting both settings shows
 * whether the shipped default or near-duplicate folding reads the corpus better.
 * A tie keeps the shipped default, dedup off, so a backend is asked to add
 * signal only where folding measurably helps.
 *
 * @param {Array<Object>} labeled - Classed pair records, each carrying the operator's `label`
 * @returns {{method: 'dedup-on'|'dedup-off', onRight: number, offRight: number,
 *   right: number, rows: Array<{name: string, right: number, total: number,
 *     method?: 'dedup-on'|'dedup-off', rule?: string, threshold?: number}>}} Baseline scores
 */
function readBaseline(labeled) {
  let onRight = 0;
  let offRight = 0;
  let constantSameRight = 0;
  let lexicalRight = 0;
  let total = 0;
  for (const pair of Array.isArray(labeled) ? labeled : []) {
    const label = pair && pair.label;
    if (label !== 'same' && label !== 'different') continue;
    total += 1;
    const onDecision = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, true);
    const offDecision = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, false);
    if (onDecision === label) onRight += 1;
    if (offDecision === label) offRight += 1;
    if (label === 'same') constantSameRight += 1;

    const textA = typeof pair.textA === 'string' ? pair.textA : findingText(pair.a);
    const textB = typeof pair.textB === 'string' ? pair.textB : findingText(pair.b);
    const lexicalDecision = overlap(contentTokens(textA), contentTokens(textB)) >= LEXICAL_JACCARD_AT
      ? 'same'
      : 'different';
    if (lexicalDecision === label) lexicalRight += 1;
  }
  // A tie keeps the shipped default: dedup is off unless a run opts in, so the
  // baseline claims folding helps only when it measurably reads more pairs right.
  const method = onRight > offRight ? 'dedup-on' : 'dedup-off';
  const right = method === 'dedup-on' ? onRight : offRight;
  return {
    method,
    onRight,
    offRight,
    right,
    rows: [
      { name: 'merge-oracle', method, right, total },
      { name: 'constant-same', rule: 'always same', right: constantSameRight, total },
      { name: 'lexical-jaccard', threshold: LEXICAL_JACCARD_AT, right: lexicalRight, total },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PAIR SHEET, LABELS AND GATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Write the pair sheet the operator labels: at most the first 60 pairs of each
 * class by SHA-256 of the pair key, each row carrying both findings' text,
 * their lineages, the run path and an empty label.
 *
 * The per-class cap keeps a hand-labeling task to one sitting, and hashing the
 * key makes the sample the same on every machine for the same corpus. A target
 * that resolves inside the repository root is refused before anything is
 * created: the sheet is the operator's gold and must stay outside the tree it
 * judges.
 *
 * @param {{'near-line': Array<Object>, 'cross-body': Array<Object>}} pairs - Classed pairs from the census
 * @param {string} sheetPath - Destination path for the sheet
 * @param {string} root - Repository root the sheet must stay outside of
 * @returns {number} Rows written
 * @throws {Error} When the target resolves inside the repository root
 */
function writePairSheet(pairs, sheetPath, root) {
  const resolved = path.resolve(sheetPath);
  const boundary = path.resolve(root);
  if (resolved === boundary || resolved.startsWith(`${boundary}${path.sep}`)) {
    throw new Error('refusing to write the pair sheet inside the repository');
  }
  const lines = [];
  for (const kind of ['near-line', 'cross-body']) {
    const classed = pairs && Array.isArray(pairs[kind]) ? pairs[kind] : [];
    const ordered = [...classed].sort((left, right) => {
      const leftHash = sha256Hex(left.key);
      const rightHash = sha256Hex(right.key);
      if (leftHash === rightHash) return 0;
      return leftHash < rightHash ? -1 : 1;
    });
    for (const pair of ordered.slice(0, SHEET_PER_CLASS)) {
      lines.push(JSON.stringify({
        pair_key: pair.key,
        class: kind,
        loop: pair.loop,
        run_dir: pair.runDir,
        lineages: [pair.la, pair.lb],
        text_a: pair.textA,
        text_b: pair.textB,
        label: '',
      }));
    }
  }
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, lines.length === 0 ? '' : `${lines.join('\n')}\n`, 'utf8');
  return lines.length;
}

/**
 * Parse the operator's filled pair sheet into a pair-keyed map.
 *
 * Only keys the sheet still holds are kept: a label left over from an older
 * sheet cannot score a pair the census no longer sees. Any value outside the
 * two gold classes is a typo in the gold itself, so it stops the run instead
 * of silently shrinking the labeled set.
 *
 * @param {string} text - Filled sheet contents, one JSON object per line
 * @param {Map<string, Object>} pairIndex - The sheet's pairs, keyed by pair key
 * @returns {Map<string, 'same'|'different'>} Kept labels, in file order
 * @throws {Error} When a row is not JSON, names no key, carries another value, or repeats a key
 */
function parseLabels(text, pairIndex) {
  const labels = new Map();
  const sheet = pairIndex instanceof Map ? pairIndex : new Map();
  const seen = new Set();
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const row = index + 1;
    if (lines[index].trim() === '') continue;
    let parsed;
    try {
      parsed = JSON.parse(lines[index]);
    } catch {
      throw new Error(`labels row ${row}: not JSON`);
    }
    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    const key = isPlainObject ? parsed.pair_key : undefined;
    if (typeof key !== 'string' || key.length === 0) {
      throw new Error(`labels row ${row}: pair_key must be a pair key`);
    }
    const value = parsed.label;
    if (value !== 'same' && value !== 'different') {
      throw new Error(`labels row ${row}: label must be same or different, got ${JSON.stringify(value)}`);
    }
    if (seen.has(key)) throw new Error(`labels row ${row}: duplicate pair ${key}`);
    seen.add(key);
    if (!sheet.has(key)) continue;
    labels.set(key, value);
  }
  return labels;
}

/**
 * The gate's state and the one line it prints: the two label floors, the
 * baseline's headroom, or the open run with the calls it plans.
 *
 * Every arm stays closed until both floors are met, so a backend is never
 * scored on fewer pairs than the sign test needs. A baseline already right on
 * more than nine pairs in ten leaves no room for a backend to show a gain, and
 * the comparison is strict so exactly ninety percent still opens.
 *
 * @param {Map<string, 'same'|'different'>} labels - Kept labels from the reader
 * @param {Map<string, Object>} pairIndex - The sheet's pairs, keyed by pair key
 * @param {{right: number}} baseline - The baseline an arm must beat
 * @returns {{kind: 'label'|'cross-body'|'headroom'|'open', line: string}} Gate state and printed line
 */
function gateState(labels, pairIndex, baseline) {
  const sheet = pairIndex instanceof Map ? pairIndex : new Map();
  let crossBody = 0;
  for (const key of labels.keys()) {
    const pair = sheet.get(key);
    if (pair && pair.kind === 'cross-body') crossBody += 1;
  }
  const labeled = labels.size;
  if (labeled < LABEL_GATE) {
    return { kind: 'label', line: `stop: fewer than ${LABEL_GATE} labeled pairs` };
  }
  if (crossBody < CROSS_BODY_LABEL_GATE) {
    return { kind: 'cross-body', line: `stop: fewer than ${CROSS_BODY_LABEL_GATE} labeled cross-body pairs` };
  }
  if (baseline.right > HEADROOM * labeled) {
    return { kind: 'headroom', line: 'no headroom' };
  }
  return {
    kind: 'open',
    line: `planned calls: jev up to ${JEV_MAX_ORDERS * labeled + 1} (two initial orders, third on split)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. JEV GATE AND ARM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped; a missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name - Executable file name
 * @param {Record<string, string|undefined>} env - Environment whose PATH is searched
 * @returns {string|null} First executable match, or null when none is executable
 */
function which(name, env) {
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
 * Whether a path exists at the published branch.
 *
 * Only text already committed there may leave the machine for the hosted
 * backend, so the answer comes from git and never from the working tree.
 *
 * @param {string} relPath - Repo-relative path to test
 * @param {{ git?: Function }} [deps] - Injected git runner, as `main` takes
 * @returns {boolean} True when git finds the path at origin/main
 */
function publishedAt(relPath, { git } = {}) {
  const run = typeof git === 'function' ? git : (args) => spawnSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const result = run(['cat-file', '-e', `origin/main:${relPath}`]);
  return Boolean(result) && !result.error && result.status === 0;
}

/**
 * Identity line, then the pinned client version and a credential check under
 * the one provider every later call reuses. A miss prints a skip line and
 * leaves the census text already written; none of the checks sends a payload.
 *
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined>,
 *   timeoutMs?: number }} ctx - Line writer, environment and per-call timeout
 * @returns {{ passed: boolean, path: string|null, provider: string, reason?: string }}
 *   True when the gate passed; a failed gate carries the skip line it printed
 */
function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const jevPath = which('jev', ctx.env);
  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
  if (jevPath === null) {
    const skipLine = 'jev arm skipped: jev not on PATH';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: ctx.timeoutMs ?? JEV_CALL_TIMEOUT_MS,
  };
  const version = spawnSync(jevPath, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    const skipLine = 'jev arm skipped: version';
    ctx.out(skipLine);
    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }

  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    const skipLine = 'jev arm skipped: no credential';
    ctx.out(skipLine);
    return { passed: false, path: jevPath, provider, reason: skipLine };
  }
  return { passed: true, path: jevPath, provider };
}

/**
 * The text one call reads for a pair, the two findings under their own
 * headings. The BA order swaps the two blocks so neither finding keeps the
 * first position across a pair's calls.
 *
 * @param {string} aText - The first finding's text
 * @param {string} bText - The second finding's text
 * @param {'AB'|'BA'} order - The order the pair is asked in
 * @returns {string} `Finding A:` and `Finding B:` blocks, swapped for BA
 */
function stateText(aText, bText, order) {
  const first = order === 'BA' ? bText : aText;
  const second = order === 'BA' ? aText : bText;
  return `Finding A:\n${first}\n\nFinding B:\n${second}\n`;
}

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the CLI reads it to EOF and exits 2 on an inherited terminal.
 * A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file - Executable to spawn
 * @param {string[]} args - Arguments after the executable
 * @param {string} stdinText - Text written to stdin, then closed
 * @param {Record<string, string|undefined>} env - Child environment
 * @param {number} timeoutMs - Kill and resolve after this many milliseconds
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string,
 *   wallMs: number, timedOut: boolean }>} Call outcome
 */
function spawnCall(file, args, stdinText, env, timeoutMs) {
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
    // A child that exits before reading stdin cannot fail the call through the
    // pipe: its exit code is the outcome the caller needs.
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
 * One JSON-line record per model call under outDir. A missing or empty outDir
 * keeps no records, so nothing is created. The file is created on the first
 * append, and one line per call keeps a killed arm's earlier records readable.
 *
 * @param {string|undefined} outDir - Directory that holds calls.jsonl
 * @returns {{ append: (record: object) => void }} Append-only call log
 */
function createCallLog(outDir) {
  let created = false;
  return {
    append(record) {
      if (typeof outDir !== 'string' || outDir === '') return;
      const file = path.join(outDir, 'calls.jsonl');
      if (!created) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(file, '');
        created = true;
      }
      fs.appendFileSync(file, `${JSON.stringify(record)}\n`);
    },
  };
}

/**
 * The Jev arm: the published pairs first, then one auth test and two swapped
 * orders per pair. A third order is requested only when the first two disagree at one of the
 * displayed cuts; its presentation is selected by stable pair identity. A pair whose registries
 * are not both at origin/main is withheld whole and gets no call. A call that
 * exits without a finite noul stays unmeasured, an exit-4 call waits once and
 * retries, and a stop line ends the arm with the pairs it finished.
 *
 * @param {{ rows: Array<{ key: string, label: string, textA: string,
 *   textB: string, registries?: string[] }>,
 *   baselineCalls: Map<string, 'same'|'different'> }} plan - Labeled pairs
 *   with their texts and registries, and the baseline's call per pair
 * @param {{ path: string, provider: string }} gate - Passing jevGate result
 * @param {{ out: (line: string) => void, env: Record<string, string|undefined>,
 *   timeoutMs?: number, backoffMs?: number,
 *   callLog: { append: (record: object) => void }, stored?: object|null,
 *   git?: Function, publishedAt?: (relPath: string) => boolean }} ctx - Line
 *   writer, environment, per-call bounds, call log, the earlier report and the
 *   published-check seam
 * @returns {Promise<{ column: object, requalify: string|null } |
 *   { stopped: string, partialRows: number }>} The finished column or the stop
 *   line with the pairs finished
 */
async function runJevArm(plan, gate, ctx) {
  const jevVersion = JEV_VERSION.split(' ')[1];
  const timeoutMs = ctx.timeoutMs ?? JEV_CALL_TIMEOUT_MS;
  const backoffMs = ctx.backoffMs ?? JEV_BACKOFF_MS;
  const rows = Array.isArray(plan.rows) ? plan.rows : [];
  const isPublished = typeof ctx.publishedAt === 'function'
    ? ctx.publishedAt
    : (relPath) => publishedAt(relPath, { git: ctx.git });

  // Withheld pairs are recorded before the arm spends anything, and a row
  // without registries cannot prove publication, so it is withheld too.
  const callable = [];
  for (const row of rows) {
    const registries = Array.isArray(row.registries) ? row.registries : [];
    if (registries.length > 0 && registries.every((relPath) => isPublished(relPath))) {
      callable.push(row);
    } else {
      ctx.callLog.append({
        pair_key: row.key,
        backend: 'jev',
        order: null,
        wall_ms: 0,
        exit_code: null,
        probability: null,
        status: 'unmeasured_unpublished',
        jev_version: jevVersion,
        provider: gate.provider,
        model: null,
      });
    }
  }

  let chars = 0;
  for (const row of callable) {
    const textA = typeof row.textA === 'string' ? row.textA : '';
    const textB = typeof row.textB === 'string' ? row.textB : '';
    for (const order of JEV_INITIAL_ORDERS) chars += stateText(textA, textB, order).length + NOUL_QUESTION.length;
    chars += stateText(textA, textB, tieBreakOrder(row.key)).length + NOUL_QUESTION.length;
  }
  ctx.out(`jev: payload: published fan-out finding text; planned calls: up to ${JEV_MAX_ORDERS * callable.length + 1}; estimated input tokens: up to ${Math.ceil(chars / 4)}`);

  let finished = 0;
  let model = 'unknown';
  const answers = new Map();

  function stop(line) {
    ctx.out(line);
    ctx.out(`jev: partial rows=${finished}`);
    return { stopped: line, partialRows: finished };
  }

  /**
   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
   * judgment, so its probability and status stay empty.
   */
  function record(row, order, call, probability, status) {
    return {
      pair_key: row.key,
      backend: 'jev',
      order,
      wall_ms: call.wallMs,
      exit_code: call.code,
      probability,
      status,
      jev_version: jevVersion,
      provider: gate.provider,
      model,
    };
  }

  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, timeoutMs);
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
    pair_key: null,
    backend: 'jev',
    order: null,
    wall_ms: auth.wallMs,
    exit_code: auth.code,
    probability: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jev_version: jevVersion,
    provider: gate.provider,
    model,
  });
  if (auth.code !== 0) {
    if (auth.code === 3) return stop('jev arm stopped: key rejected');
    if (auth.code === 130) return stop('jev arm stopped: interrupted');
    return stop('jev arm stopped: usage error');
  }
  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);

  async function ask(row, order) {
    const textA = typeof row.textA === 'string' ? row.textA : '';
    const textB = typeof row.textB === 'string' ? row.textB : '';
    const state = stateText(textA, textB, order);
    const args = ['noul', '--provider', gate.provider, '-q', NOUL_QUESTION];
    let call = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);

    if (!call.timedOut && call.code === 4) {
      ctx.callLog.append(record(row, order, call, null, 'unmeasured'));
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      call = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);
    }

    let probability = null;
    let status = 'unmeasured';
    let stopLine = null;
    if (call.timedOut) {
      status = 'unmeasured_timeout';
    } else if (call.code === 0) {
      let parsed;
      try {
        parsed = JSON.parse(call.stdout);
      } catch {
        // A body that does not parse is an unmeasured call, not a crash.
      }
      const value = parsed?.answers?.answer?.noul;
      if (Number.isFinite(value) && value >= 0 && value <= 1) {
        probability = value;
        status = 'measured';
      }
    } else if (call.code === 2) {
      stopLine = 'jev arm stopped: usage error';
    } else if (call.code === 3) {
      stopLine = 'jev arm stopped: key rejected';
    } else if (call.code === 130) {
      stopLine = 'jev arm stopped: interrupted';
    }

    ctx.callLog.append(record(row, order, call, probability, status));
    return { probability, stopLine };
  }

  for (const row of callable) {
    const values = [];
    for (const order of JEV_INITIAL_ORDERS) {
      const result = await ask(row, order);
      if (result.stopLine !== null) return stop(result.stopLine);
      values.push(result.probability);
    }

    const needsThird = CUT_SWEEP.some((cut) => pairDecision(values, cut)?.needsThird === true);
    if (needsThird) {
      const result = await ask(row, tieBreakOrder(row.key));
      if (result.stopLine !== null) return stop(result.stopLine);
      values.push(result.probability);
    }

    answers.set(row.key, values);
    finished += 1;
  }

  const suffix = `jev_version=${jevVersion} provider=${gate.provider} model=${model}`;
  const cutSweep = CUT_SWEEP.map((cut) => summarizeColumn('jev', plan.rows, answers, plan.baselineCalls, suffix, cut));
  const column = cutSweep.find((entry) => entry.cut === SAME_AT) ?? cutSweep[cutSweep.length - 1];
  const storedJev = ctx.stored?.columns?.jev;
  let requalify = null;
  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
    requalify = 'requalify: model changed';
    ctx.out(requalify);
  }
  for (const sweepColumn of cutSweep) ctx.out(sweepColumn.line);
  return {
    column: { ...column, cutSweep, jevVersion, provider: gate.provider, model },
    requalify,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ARM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parsed report.json written by an earlier run into the same out directory.
 * A later run reads it to requalify a verdict the earlier run measured on a
 * different model pair, before printing its own.
 *
 * @param {string|undefined} outDir - Directory that may hold report.json
 * @returns {object|null} The parsed report, or null when outDir is empty, the
 *   file is missing, or the file does not parse
 */
function readStoredReport(outDir) {
  if (typeof outDir !== 'string' || outDir === '') return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Nearest-rank percentile. An empty list has no rank.
 *
 * @param {number[]} values - Raw values
 * @param {number} q - Quantile in (0, 1]
 * @returns {number|null} The value at the nearest rank, or null for an empty list
 */
function nearestRank(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. KEEP RULE, REPORT AND MAIN
// ─────────────────────────────────────────────────────────────────────────────

// One cut turns each order's probability into the call the modal rule counts
// and decides which side of a pair the column's judgment falls on; keeping it
// here leaves no caller free to score with its own threshold.
const SAME_AT = 0.5;
const RUBRIC = {
  question: NOUL_QUESTION,
  sameAt: SAME_AT,
  cuts: CUT_SWEEP,
  lexicalJaccardAt: LEXICAL_JACCARD_AT,
  initialOrders: JEV_INITIAL_ORDERS,
  maximumOrders: JEV_MAX_ORDERS,
  thirdWhen: 'initial orders disagree at any displayed cut',
  symmetricTiebreak: 'sha256 pair-key parity selects the third order',
};

const USAGE = 'usage: score-fanout-pairs.cjs [--out <dir>] [--labels <file>] [--write-pair-sheet <path>] [--jev]';

/**
 * Resolve the calls available for one pair, requesting a third only when the
 * first two measured answers disagree at the selected cut.
 *
 * @param {Array<number|null>} values - Measured answer probabilities in call order
 * @param {number} [cut] - Probability at or above which one call says `same`
 * @returns {{decision: 'same'|'different'|null, needsThird: boolean}|null} Pick state
 */
function pairDecision(values, cut = SAME_AT) {
  if (!Array.isArray(values) || (values.length !== 2 && values.length !== JEV_MAX_ORDERS)) return null;
  if (!values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) return null;
  const sameVotes = values.filter((value) => value >= cut).length;
  if (values.length === 2 && sameVotes === 1) return { decision: null, needsThird: true };
  const decision = values.length === 2
    ? (sameVotes === 2 ? 'same' : 'different')
    : (sameVotes >= 2 ? 'same' : 'different');
  return { decision, needsThird: false };
}

/**
 * Select a repeat order from stable pair identity so a split does not always
 * give the same finding the first position.
 *
 * @param {string} key - Canonical pair key
 * @returns {'AB'|'BA'} Repeat order for the third call
 */
function tieBreakOrder(key) {
  return Number.parseInt(sha256Hex(key)[0], 16) % 2 === 0 ? 'AB' : 'BA';
}

/**
 * Exact one-sided chance of `successes` or more in `trials` fair coin flips.
 * The tail sum is built coefficient by coefficient in BigInt, and the below
 * 0.05 test stays exact as 20 * num < den, never a float comparison.
 *
 * @param {number} successes - Outcomes whose tail is summed
 * @param {number} trials - Total flips
 * @returns {{ num: bigint, den: bigint, p: number }} Tail numerator over 2^trials
 */
function binomialTail(successes, trials) {
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= trials; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(trials - i + 1)) / BigInt(i);
    if (i >= successes) num += coefficient;
  }
  const den = 1n << BigInt(trials);
  return { num, den, p: Number(num) / Number(den) };
}

/**
 * First failed check decides, in this order: coverage, kill, margin, sign
 * test, flips. `p` is the tail the deciding step read, so a kill prints the
 * loss tail while every other outcome prints the win tail.
 *
 * @param {{ backend: string, K: number, M: number, A: number, B: number,
 *   W: number, L: number, F: number, C: number }} counts - Column counts
 * @returns {{ backend: string, outcome: 'keep'|'kill'|'stop',
 *   reason: 'coverage'|'margin'|'sign test'|'flips'|null, p: number }} Verdict
 */
function decideVerdict({ backend, K, M, A, B, W, L, F, C }) {
  const win = binomialTail(W, W + L);
  const loss = binomialTail(L, W + L);
  if (!(10 * M >= 9 * K)) return { backend, outcome: 'stop', reason: 'coverage', p: win.p };
  if (20n * loss.num < loss.den) return { backend, outcome: 'kill', reason: null, p: loss.p };
  if (!(10 * (A - B) >= M)) return { backend, outcome: 'stop', reason: 'margin', p: win.p };
  if (!(20n * win.num < win.den)) return { backend, outcome: 'stop', reason: 'sign test', p: win.p };
  if (10 * F > C) return { backend, outcome: 'stop', reason: 'flips', p: win.p };
  return { backend, outcome: 'keep', reason: null, p: win.p };
}

/**
 * @param {number} p - Probability in [0, 1]
 * @returns {string} Four significant digits
 */
function formatP(p) {
  return p.toPrecision(4);
}

/**
 * One column's counts and verdict line. A pair is measured when the first two
 * orders agree or all three orders are available with finite probabilities.
 * An unresolved split at a displayed cut stays unmeasured for that cut.
 *
 * @param {'jev'} backend - Backend name, printed on the verdict line
 * @param {Array<{ key: string, label: string }>} rows - Labeled pairs, in file order
 * @param {Map<string, Array<number|null>>} answers - Pair key -> one answer per order
 * @param {Map<string, 'same'|'different'> & { method?: string }} baselineCalls -
 *   Pair key -> the baseline's call, with the setting it was read under riding
 *   on the map so the line can name the baseline it beat
 * @param {string} suffix - Backend identity appended to the line when non-empty
 * @param {number} [cut] - Probability threshold for a call to vote `same`
 * @returns {Object} Counts plus the verdict `line`
 */
function summarizeColumn(backend, rows, answers, baselineCalls, suffix, cut = SAME_AT) {
  const baselineMethod = baselineCalls && typeof baselineCalls.method === 'string' ? baselineCalls.method : 'dedup-off';
  const labeled = Array.isArray(rows) ? rows : [];
  const K = labeled.length;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  let C = 0;

  for (const row of labeled) {
    const values = answers instanceof Map ? answers.get(row.key) : undefined;
    const pair = pairDecision(values, cut);
    if (pair === null || pair.needsThird || pair.decision === null) continue;
    M += 1;

    const sameVotes = values.filter((value) => value >= cut).length;
    const call = pair.decision;
    C += values.length;
    F += call === 'same' ? values.length - sameVotes : sameVotes;

    const columnRight = call === row.label;
    const baselineRight = baselineCalls instanceof Map && baselineCalls.get(row.key) === row.label;
    if (columnRight) A += 1;
    if (baselineRight) B += 1;
    if (columnRight && !baselineRight) W += 1;
    if (baselineRight && !columnRight) L += 1;
  }

  const verdict = decideVerdict({ backend, K, M, A, B, W, L, F, C });
  const outcomeText = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
  let line = `verdict ${backend}: ${outcomeText} cut=${cut} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} C=${C} p=${formatP(verdict.p)} baseline=${baselineMethod} reader=none named`;
  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
  return {
    backend,
    cut,
    K,
    M,
    unmeasured: K - M,
    A,
    B,
    W,
    L,
    F,
    C,
    p: verdict.p,
    outcome: verdict.outcome,
    reason: verdict.reason,
    line,
  };
}

/**
 * Assemble reproducibility hashes, the question, the census, labeled counts,
 * oracle decisions, baseline rows, the gate line and one bucket per arm. A
 * skipped arm lands in `skipped`, a stopped arm in `stopped` with the pairs it
 * finished, and a finished column in `columns` with its verdict line.
 *
 * @param {Object} parts - Run results and reproducibility metadata
 * @returns {Object} Report object ready for JSON.stringify
 */
function buildReport(parts) {
  const report = {
    question: parts.question,
    labelDigest: parts.labelDigest ?? null,
    rubric: parts.rubric,
    rubricHash: parts.rubricHash,
    scorerHash: parts.scorerHash,
    census: parts.census,
    labeled: parts.labeled,
    baseline: parts.baseline,
    oracle: parts.oracle,
    gate: parts.gate,
    columns: {},
    stopped: {},
    skipped: {},
    requalify: {},
  };

  for (const [backend, arm] of [['jev', parts.jev]]) {
    if (!arm) continue;
    if (typeof arm.skipped === 'string') {
      report.skipped[backend] = arm.skipped;
      continue;
    }
    if (typeof arm.stopped === 'string') {
      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
      continue;
    }
    if (!arm.column) continue;
    report.columns[backend] = arm.column;
    report.requalify[backend] = arm.requalify ?? null;
  }

  return report;
}

/**
 * Parse the switches, run the zero-call census, resolve the label gate and,
 * for each requested arm whose own gate passes, score the backend column and
 * record the run. Every refusal returns before the first model call or the
 * report write, and the arms stay independent: one arm's skip or stop never
 * runs the other backend in its place.
 *
 * @param {string[]} argv - Arguments after the script name
 * @param {Object} [deps] - Injected collaborators
 * @param {(line: string) => void} [deps.out] - Line writer, default stdout
 * @param {(line: string) => void} [deps.err] - Error writer, default stderr
 * @param {Record<string, string|undefined>} [deps.env] - Environment, default process.env
 * @param {number} [deps.timeoutMs] - Per-call timeout, both arms
 * @param {number} [deps.backoffMs] - Jev retry wait after an exit-4 call
 * @param {string} [deps.root] - Repository root the census reads, default the repo root
 * @param {Function} [deps.listTracked] - Tracked-path seam handed to the walker
 * @param {Function} [deps.git] - Git runner the published check reads
 * @returns {Promise<number>} Exit code: 0 on a completed run, 2 on a refusal
 *   or unreadable input
 */
async function main(argv, deps = {}) {
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
  const env = deps.env ?? process.env;
  const timeoutMs = deps.timeoutMs ?? JEV_CALL_TIMEOUT_MS;
  const backoffMs = deps.backoffMs ?? JEV_BACKOFF_MS;
  const root = deps.root ?? path.resolve(__dirname, '../../../../..');

  let values;
  try {
    values = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        out: { type: 'string' },
        labels: { type: 'string' },
        'write-pair-sheet': { type: 'string' },
        jev: { type: 'boolean' },
      },
    }).values;
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    err(USAGE);
    return 2;
  }

  // A model arm records every call, so it cannot run without a directory to
  // record into; the refusal comes before the census so nothing is spent or
  // written on a run that can never measure anything.
  const needOut = [];
  if (values.jev === true) needOut.push('--jev');
  if (needOut.length > 0 && (typeof values.out !== 'string' || values.out === '')) {
    err(`${needOut.join(' and ')} ${needOut.length === 1 ? 'needs' : 'need'} --out <dir> so every call is recorded`);
    return 2;
  }

  const runs = walkRuns(root, { listTracked: deps.listTracked });
  const byKind = selectCandidates(root, { listTracked: deps.listTracked });

  const loops = ['research', 'review'];
  const classes = ['near-line', 'cross-body'];
  const runCounts = { research: 0, review: 0 };
  for (const run of runs) runCounts[run.loop] += 1;

  const classCounts = { 'near-line': { research: 0, review: 0 }, 'cross-body': { research: 0, review: 0 } };
  for (const kind of classes) {
    for (const pair of byKind[kind]) classCounts[kind][pair.loop] += 1;
  }
  const pairCounts = {
    research: classCounts['near-line'].research + classCounts['cross-body'].research,
    review: classCounts['near-line'].review + classCounts['cross-body'].review,
  };

  out(`runs: research=${runCounts.research} review=${runCounts.review}`);
  out(`pairs: research=${pairCounts.research} review=${pairCounts.review}`);
  out(`class near-line: research=${classCounts['near-line'].research} review=${classCounts['near-line'].review}`);
  out(`class cross-body: research=${classCounts['cross-body'].research} review=${classCounts['cross-body'].review}`);

  // The merge is the incumbent, so the census reads its own decision on every
  // classed pair under both dedup settings before any backend is measured.
  const decisions = { 'near-line': {}, 'cross-body': {} };
  let undecidable = 0;
  for (const kind of classes) {
    for (const loop of loops) {
      const bucket = { on: { same: 0, different: 0 }, off: { same: 0, different: 0 } };
      decisions[kind][loop] = bucket;
      for (const pair of byKind[kind]) {
        if (pair.loop !== loop) continue;
        const on = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, true);
        const off = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, false);
        if (on === 'undecidable' || off === 'undecidable') undecidable += 1;
        if (on === 'same') bucket.on.same += 1;
        else if (on === 'different') bucket.on.different += 1;
        if (off === 'same') bucket.off.same += 1;
        else if (off === 'different') bucket.off.different += 1;
      }
      out(`merge decisions: ${kind} ${loop} dedup-on same=${bucket.on.same} different=${bucket.on.different} dedup-off same=${bucket.off.same} different=${bucket.off.different}`);
    }
  }

  // How many findings can reach the title rule or the body gate at all: a
  // finding with no title tokens or no body text can only fall back to whole
  // record identity, and these counts keep that blind spot visible.
  const findingsByLoop = { research: [], review: [] };
  for (const run of runs) {
    for (const lineage of run.lineages) {
      for (const finding of findingsOf(root, run.loop, lineage.registry)) findingsByLoop[run.loop].push(finding);
    }
  }
  const titles = {};
  const bodies = {};
  for (const loop of loops) {
    const findings = findingsByLoop[loop];
    titles[loop] = {
      titled: findings.filter((finding) => titleTokens(finding).size > 0).length,
      total: findings.length,
    };
    bodies[loop] = {
      bodied: findings.filter((finding) => durableBodyText(finding) !== '').length,
      total: findings.length,
    };
    out(`title rule: ${loop}=${titles[loop].titled} of ${titles[loop].total} findings carry a title`);
  }
  for (const loop of loops) {
    out(`body fields: ${loop}=${bodies[loop].bodied} of ${bodies[loop].total} findings carry a body field`);
  }
  out(`merge undecidable: ${undecidable}`);

  const census = {
    runs: runCounts,
    pairs: pairCounts,
    classes: classCounts,
    decisions,
    titles,
    bodies,
    undecidable,
  };

  const pairIndex = new Map();
  for (const kind of classes) {
    for (const pair of byKind[kind]) pairIndex.set(pair.key, pair);
  }

  if (typeof values['write-pair-sheet'] === 'string') {
    try {
      writePairSheet(byKind, values['write-pair-sheet'], root);
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
  }

  let labels = new Map();
  let dropped = 0;
  let labelText = null;
  if (typeof values.labels === 'string' && values.labels !== '') {
    let text;
    try {
      text = fs.readFileSync(values.labels, 'utf8');
    } catch (error) {
      err(`cannot read labels: ${error instanceof Error ? error.message : String(error)}`);
      return 2;
    }
    labelText = text;
    try {
      labels = parseLabels(text, pairIndex);
    } catch (error) {
      err(error instanceof Error ? error.message : String(error));
      return 2;
    }
    const rowsRead = text.split('\n').filter((line) => line.trim() !== '').length;
    dropped = rowsRead - labels.size;
  }

  const labeledPairs = [];
  for (const [key, label] of labels) {
    const pair = pairIndex.get(key);
    if (pair) labeledPairs.push({ ...pair, label });
  }
  const baseline = readBaseline(labeledPairs);
  const gate = gateState(labels, pairIndex, baseline);
  out(gate.line);

  const registryByRunLineage = new Map();
  for (const run of runs) {
    for (const lineage of run.lineages) {
      registryByRunLineage.set(`${run.loop}:${run.runDir}:${lineage.label}`, lineage.registry);
    }
  }
  const baselineCalls = new Map();
  const oracleDecisions = [];
  for (const pair of labeledPairs) {
    const dedupOn = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, true);
    const dedupOff = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, false);
    const decision = baseline.method === 'dedup-on' ? dedupOn : dedupOff;
    baselineCalls.set(pair.key, decision);
    oracleDecisions.push({ key: pair.key, label: pair.label, dedupOn, dedupOff, decision });
  }
  const oracle = {
    method: baseline.method,
    decisions: oracleDecisions,
    dropouts: oracleDecisions.filter((entry) => entry.decision === 'undecidable'),
  };
  // The arms read one calls map; the setting those calls were taken under
  // rides on it so each verdict line can name the baseline it was read against.
  baselineCalls.method = baseline.method;
  const plan = {
    rows: labeledPairs.map((pair) => ({
      key: pair.key,
      label: pair.label,
      textA: pair.textA,
      textB: pair.textB,
      registries: [
        registryByRunLineage.get(`${pair.loop}:${pair.runDir}:${pair.la}`),
        registryByRunLineage.get(`${pair.loop}:${pair.runDir}:${pair.lb}`),
      ].filter((relPath) => typeof relPath === 'string'),
    })),
    baselineCalls,
  };

  const stored = typeof values.out === 'string' && values.out !== '' ? readStoredReport(values.out) : null;
  const callLog = createCallLog(values.out);

  let jevResult;
  if (values.jev === true) {
    if (gate.kind !== 'open') {
      const line = gate.kind === 'headroom' ? 'jev arm skipped: no headroom' : 'jev arm skipped: label gate';
      out(line);
      jevResult = { skipped: line };
    } else {
      const check = jevGate({ out, env, timeoutMs });
      jevResult = check.passed
        ? await runJevArm(plan, check, { out, env, timeoutMs, backoffMs, callLog, stored, git: deps.git })
        : { skipped: check.reason };
    }
  }

  if (values.jev === true) {
    const report = buildReport({
      question: NOUL_QUESTION,
      labelDigest: labelText === null ? null : sha256Hex(labelText),
      rubric: RUBRIC,
      rubricHash: sha256Hex(JSON.stringify(RUBRIC)),
      scorerHash: sha256Hex(fs.readFileSync(__filename)),
      census,
      labeled: { K: labels.size, dropped },
      baseline,
      oracle,
      gate: gate.line,
      jev: jevResult,
    });
    fs.mkdirSync(values.out, { recursive: true });
    fs.writeFileSync(path.join(values.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  listTrackedFiles,
  walkRuns,
  findingsOf,
  findingId,
  bodyKey,
  titleTokens,
  overlap,
  findingText,
  titleOrTextOverlap,
  classifyPair,
  pairKey,
  sha256Hex,
  selectCandidates,
  mergeDecision,
  readBaseline,
  writePairSheet,
  parseLabels,
  gateState,
  which,
  publishedAt,
  jevGate,
  stateText,
  spawnCall,
  createCallLog,
  runJevArm,
  readStoredReport,
  nearestRank,
  binomialTail,
  pairDecision,
  tieBreakOrder,
  decideVerdict,
  formatP,
  summarizeColumn,
  buildReport,
  main,
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
