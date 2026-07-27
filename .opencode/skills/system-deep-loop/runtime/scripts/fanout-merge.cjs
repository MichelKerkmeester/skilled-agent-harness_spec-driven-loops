// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Fan-Out Cross-Lineage Merge                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--loop-type, --artifact-dir).                          ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=ok, 1=script error, 3=input validation error.                 ║
// ║                                                                          ║
// ║ Reads every {artifact-dir}/lineages/{label}/ sub-packet and produces:   ║
// ║   research: deduplicated deep-research-findings-registry.json +          ║
// ║             fanout-attribution.md                                        ║
// ║   review:   severity-rollup deep-review-findings-registry.json           ║
// ║             (strongest-restriction: any lineage P0 → merged FAIL) +     ║
// ║             fanout-attribution.md                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SEVERITY_RANK = { P0: 3, P1: 2, P2: 1 };

// ─────────────────────────────────────────────────────────────────────────────
// 1. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');

// The merged registry and attribution share the runtime's atomic-state helpers,
// which are TypeScript ESM. Re-exec once under the tsx loader so the dynamic
// import below resolves them; mirrors convergence.cjs. Only the CLI entrypoint
// re-execs — module consumers (unit tests) import the pure helpers directly.
if (require.main === module && process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  const child = spawnSync(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
      encoding: 'utf8',
    },
  );
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  process.exit(child.status === null ? 1 : child.status);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw inputError(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function ensureString(args, key) {
  if (!args[key] || typeof args[key] !== 'string') {
    throw inputError(`${key} is required`);
  }
  return args[key];
}

function isWithinRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function requireRealDirectory(root, directoryPath, label) {
  if (!fs.existsSync(directoryPath)) {
    throw inputError(`${label} does not exist: ${directoryPath}`);
  }
  const stat = fs.lstatSync(directoryPath);
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    throw inputError(`${label} must be a real directory: ${directoryPath}`);
  }
  const realDirectory = fs.realpathSync(directoryPath);
  if (!isWithinRoot(root, realDirectory)) {
    throw inputError(`${label} resolves outside the artifact root: ${directoryPath}`);
  }
  return realDirectory;
}

function resolveOptionalRealFile(root, filePath, label) {
  if (!fs.existsSync(filePath)) return null;
  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw inputError(`${label} must be a real file: ${filePath}`);
  }
  const realFile = fs.realpathSync(filePath);
  if (!isWithinRoot(root, realFile)) {
    throw inputError(`${label} resolves outside the artifact root: ${filePath}`);
  }
  return realFile;
}

function assertSafeOutputPath(root, filePath, label) {
  requireRealDirectory(root, path.dirname(filePath), `${label} parent`);
  if (!fs.existsSync(filePath)) return;
  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw inputError(`${label} must be a real file when it already exists: ${filePath}`);
  }
  const realFile = fs.realpathSync(filePath);
  if (!isWithinRoot(root, realFile)) {
    throw inputError(`${label} resolves outside the artifact root: ${filePath}`);
  }
}

function readJsonFile(root, filePath, label) {
  const realFile = resolveOptionalRealFile(root, filePath, label);
  if (!realFile) return null;
  try {
    return JSON.parse(fs.readFileSync(realFile, 'utf8'));
  } catch (error) {
    throw inputError(`${label} contains invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function readStateLog(root, stateLogPath, label) {
  const realFile = resolveOptionalRealFile(root, stateLogPath, label);
  if (!realFile) return [];
  const records = [];
  const lines = fs.readFileSync(realFile, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      throw inputError(`${label} contains invalid JSONL at line ${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  return records;
}

function parseIterationMarkdownFindings(content, run, sourcePath) {
  const lines = content.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => /^##\s+Findings\s*$/i.test(line.trim()));
  if (headingIndex < 0) return [];
  const sectionLines = [];
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (/^##\s+/.test(line)) break;
    sectionLines.push(line);
  }
  const subheadingFindings = sectionLines.flatMap((line) => {
    const match = line.match(/^###\s+\d+\.\s+(.+)$/);
    return match ? [match[1]] : [];
  });
  const findingTexts = subheadingFindings.length > 0
    ? subheadingFindings
    : sectionLines.flatMap((line) => {
      const match = line.match(/^\d+\.\s+(.+)$/);
      return match ? [match[1]] : [];
    });
  return findingTexts.map((text, index) => ({
      id: `iteration-${run}-finding-${index + 1}`,
      title: text,
      text,
      addedAtIteration: run,
      _iteration_source: sourcePath,
    }));
}

function loadIterationFindings(root, lineageDir, label) {
  const iterationsDir = path.join(lineageDir, 'iterations');
  if (!fs.existsSync(iterationsDir)) return new Map();
  requireRealDirectory(root, iterationsDir, `lineage ${label} iterations directory`);
  const findingsByRun = new Map();
  for (const entry of fs.readdirSync(iterationsDir, { withFileTypes: true })) {
    if (!/^iteration-\d+\.md$/.test(entry.name)) continue;
    if (entry.isSymbolicLink() || !entry.isFile()) {
      throw inputError(`lineage ${label} iteration source must be a real file: ${path.join(iterationsDir, entry.name)}`);
    }
    const sourcePath = path.join(iterationsDir, entry.name);
    const realFile = resolveOptionalRealFile(root, sourcePath, `lineage ${label} iteration source`);
    const run = Number(entry.name.match(/^iteration-(\d+)\.md$/)[1]);
    findingsByRun.set(run, parseIterationMarkdownFindings(
      fs.readFileSync(realFile, 'utf8'),
      run,
      path.relative(root, realFile).replace(/\\/g, '/'),
    ));
  }
  return findingsByRun;
}

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

function contentSortKey(record) {
  const durableText = [
    record.title,
    record.summary,
    record.description,
    record.finding,
    record.question,
    record.direction,
    record.severity,
    record.status,
  ].map(normalizeSortText).filter(Boolean).join('\u0001');
  return durableText || stableStringify({ ...record, _lineages: undefined });
}

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
    severity: undefined,
    status: undefined,
  });
}

function nearDuplicateContentKey(record) {
  const durableText = [
    record.summary,
    record.description,
    record.finding,
    record.question,
    record.direction,
  ].map(normalizeSortText).filter(Boolean).join('\u0001');
  return durableText || contentIdentityKey(record);
}

// Stopwords stripped before comparing titles so the overlap signal keys on the content
// nouns/verbs that distinguish one finding from another, not on filler.
const TITLE_STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'of', 'for', 'and', 'or', 'with', 'without',
  'is', 'are', 'was', 'were', 'be', 'no', 'not', 'so', 'that', 'this', 'it', 'its', 'as',
  'by', 'from', 'into', 'after', 'before', 'when', 'where', 'which', 'has', 'have',
]);

function titleContentTokens(record) {
  const raw = typeof record.title === 'string' ? record.title : '';
  return new Set(
    normalizeSortText(raw)
      .split(/[^a-z0-9]+/)
      .filter((tok) => tok && !TITLE_STOPWORDS.has(tok)),
  );
}

// Jaccard overlap of two title token sets. 1 when both are empty (no title signal to
// distinguish on → fall back to body-only collapse, the original contract for title-less
// findings).
function titleOverlap(aTokens, bTokens) {
  if (aTokens.size === 0 && bTokens.size === 0) return 1;
  if (aTokens.size === 0 || bTokens.size === 0) return 0;
  let shared = 0;
  for (const tok of aTokens) if (bTokens.has(tok)) shared += 1;
  const union = aTokens.size + bTokens.size - shared;
  return union === 0 ? 1 : shared / union;
}

// Below this title overlap two same-body findings are treated as DISTINCT (their titles
// name substantively different things — e.g. a generic "missing auth check" body whose
// titles name two different endpoints with no shared subject). At or above it the titles
// are paraphrases of one point that share their subject noun, and the same-body findings
// collapse, preserving the designed-for restatement collapse. The threshold is low because
// legitimate restatement titles often share only the one key subject noun ("cache",
// "retry") while genuinely-distinct titles share no content token at all.
const TITLE_DISTINCT_OVERLAP_THRESHOLD = 0.15;

// Title-aware near-dup match (deep-review P2-15 fix): two findings are near-duplicates
// only if their body-content key matches AND their titles are not substantively divergent.
// This closes the title blind spot — genuinely-distinct findings that share an identical
// body but carry different distinguishing titles no longer collapse — without breaking the
// designed-for collapse of restatements that share a body and paraphrase the same title.
function nearDuplicateMatches(a, b) {
  if (nearDuplicateContentKey(a) !== nearDuplicateContentKey(b)) return false;
  return titleOverlap(titleContentTokens(a), titleContentTokens(b)) >= TITLE_DISTINCT_OVERLAP_THRESHOLD;
}

function contentDigest(record) {
  return crypto.createHash('sha256').update(contentIdentityKey(record)).digest('hex').slice(0, 12);
}

function compareByContentThenId(left, right, idKeys) {
  const leftContent = contentSortKey(left);
  const rightContent = contentSortKey(right);
  if (leftContent < rightContent) return -1;
  if (leftContent > rightContent) return 1;

  const leftId = normalizeSortText(idKeys.map((key) => left[key]).find(Boolean));
  const rightId = normalizeSortText(idKeys.map((key) => right[key]).find(Boolean));
  if (leftId < rightId) return -1;
  if (leftId > rightId) return 1;

  const leftFull = stableStringify(left);
  const rightFull = stableStringify(right);
  if (leftFull < rightFull) return -1;
  if (leftFull > rightFull) return 1;
  return 0;
}

function sortByContentThenId(records, idKeys) {
  return [...records].sort((left, right) => compareByContentThenId(left, right, idKeys));
}

function addLineage(existing, label) {
  if (!existing._lineages) existing._lineages = [];
  if (!existing._lineages.includes(label)) existing._lineages.push(label);
  existing._lineages.sort();
}

function mergeLineageLabels(existing, incoming, label) {
  const lineages = new Set([...(existing._lineages || []), ...(incoming._lineages || []), label].filter(Boolean));
  return [...lineages].sort();
}

function comparableRecord(record) {
  const copy = { ...record };
  delete copy._conflictOf;
  delete copy._conflict_id;
  delete copy._conflicts;
  delete copy._lineages;
  return copy;
}

function replaceRecord(target, source, lineages) {
  const next = { ...source, _lineages: lineages };
  for (const key of Object.keys(target)) {
    delete target[key];
  }
  Object.assign(target, next);
}

function chooseCanonicalRecord(existing, incoming, idKeys) {
  return compareByContentThenId(comparableRecord(incoming), comparableRecord(existing), idKeys) < 0
    ? incoming
    : existing;
}

function chooseReviewCanonicalRecord(existing, incoming, idKeys) {
  const incomingRank = SEVERITY_RANK[incoming.severity] ?? 0;
  const existingRank = SEVERITY_RANK[existing.severity] ?? 0;
  if (incomingRank > existingRank) return incoming;
  if (incomingRank < existingRank) return existing;
  return chooseCanonicalRecord(existing, incoming, idKeys);
}

function conflictSafeRecord(record, baseId, idKey) {
  const conflictId = `${baseId}--${contentDigest(record)}`;
  return {
    ...record,
    [idKey]: conflictId,
    _conflictOf: baseId,
    _conflict_id: conflictId,
  };
}

function attachConflictMarkers(records, baseId, idKey) {
  if (records.length < 2) return records;
  return records.map((record) => ({
    ...record,
    _conflicts: records
      .filter((other) => other !== record)
      .map((other) => ({
        relation: 'CONTRADICTS',
        originalId: baseId,
        peerId: other[idKey],
        peerLineages: other._lineages || [],
        basis: 'same-id-different-content',
      })),
  }));
}

function parseBooleanOption(value) {
  if (value === true) return true;
  if (typeof value !== 'string') return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function resolveMergeOptions(options = {}) {
  return {
    enableNearDuplicateDedup: parseBooleanOption(
      options.enableNearDuplicateDedup ?? process.env.SPECKIT_FANOUT_NEAR_DUP_DEDUP,
    ),
  };
}

function createFindingBucketIndex() {
  return {
    buckets: [],
    byContent: new Map(),
    byId: new Map(),
  };
}

function getFindingBucket(index, id, finding, enableNearDuplicateDedup) {
  const contentKey = enableNearDuplicateDedup ? nearDuplicateContentKey(finding) : '';
  const exactBucket = index.byId.get(id);
  if (exactBucket) {
    return exactBucket;
  }

  // Title-aware bucketing (deep-review P2-15 fix): a content key can host MORE than one
  // bucket when several genuinely-distinct findings share an identical body but carry
  // divergent titles. byContent maps a content key to the LIST of buckets seen for it; a
  // same-body finding joins the bucket whose records its title actually matches, and
  // otherwise opens a new bucket. Without this a distinct finding would share a bucket with
  // a different finding and be mis-tagged as a same-id conflict variant by
  // flattenFindingBucketIndex.
  const candidateBuckets = contentKey ? index.byContent.get(contentKey) : undefined;
  if (candidateBuckets) {
    const titleMatch = enableNearDuplicateDedup
      ? candidateBuckets.find((b) => b.records.some((entry) => nearDuplicateMatches(entry, finding)))
      : candidateBuckets[0];
    if (titleMatch) {
      index.byId.set(id, titleMatch);
      return titleMatch;
    }
  }

  const bucket = { baseId: id, records: [] };
  index.buckets.push(bucket);
  index.byId.set(id, bucket);
  if (contentKey) {
    if (candidateBuckets) candidateBuckets.push(bucket);
    else index.byContent.set(contentKey, [bucket]);
  }
  return bucket;
}

function flattenFindingBucketIndex(index, idKey, sortKeys) {
  const records = [];
  for (const { baseId, records: bucket } of index.buckets) {
    const variants = sortByContentThenId(bucket, sortKeys);
    if (variants.length === 1) {
      records.push(variants[0]);
      continue;
    }
    records.push(...attachConflictMarkers(
      variants.map((variant) => conflictSafeRecord(variant, baseId, idKey)),
      baseId,
      idKey,
    ));
  }
  return sortByContentThenId(records, sortKeys);
}

function addResearchFinding(bucket, finding, label, options = {}) {
  const matches = options.enableNearDuplicateDedup
    ? (entry) => nearDuplicateMatches(entry, finding)
    : (entry) => contentIdentityKey(entry) === contentIdentityKey(finding);
  const existing = bucket.find(matches);
  if (existing) {
    if (options.enableNearDuplicateDedup) {
      replaceRecord(existing, chooseCanonicalRecord(existing, finding, ['id', 'title']), mergeLineageLabels(existing, finding, label));
      return;
    }
    addLineage(existing, label);
    return;
  }
  bucket.push({ ...finding, _lineages: [label] });
}

function addReviewFinding(bucket, finding, label, options = {}) {
  const matches = options.enableNearDuplicateDedup
    ? (entry) => nearDuplicateMatches(entry, finding)
    : (entry) => contentIdentityKey(entry) === contentIdentityKey(finding);
  const existing = bucket.find(matches);
  if (!existing) {
    bucket.push({ ...finding, _lineages: [label] });
    return;
  }

  if (options.enableNearDuplicateDedup) {
    replaceRecord(
      existing,
      chooseReviewCanonicalRecord(existing, finding, ['findingId', 'title']),
      mergeLineageLabels(existing, finding, label),
    );
    return;
  }

  const incomingRank = SEVERITY_RANK[finding.severity] ?? 0;
  const existingRank = SEVERITY_RANK[existing.severity] ?? 0;
  if (incomingRank > existingRank) {
    Object.assign(existing, {
      ...finding,
      _lineages: mergeLineageLabels(existing, finding, label),
    });
    return;
  }
  addLineage(existing, label);
}

function flattenFindingBuckets(findingById, idKey, sortKeys) {
  const records = [];
  for (const [baseId, bucket] of findingById) {
    const variants = sortByContentThenId(bucket, sortKeys);
    if (variants.length === 1) {
      records.push(variants[0]);
      continue;
    }
    records.push(...attachConflictMarkers(
      variants.map((variant) => conflictSafeRecord(variant, baseId, idKey)),
      baseId,
      idKey,
    ));
  }
  return sortByContentThenId(records, sortKeys);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2b. SCHEMA NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a registry object so that the canonical findings key is populated,
 * tolerating known aliases (e.g. `findings` → `keyFindings` for research,
 * `findings` → `openFindings` for review).
 *
 * Returns { registry, warnings } where warnings is an array of structured
 * schema_mismatch events for every alias hit or unusable-registry skip.
 *
 * @param {object|null} registry
 * @param {{ canonicalKey: string, aliases: Record<string, string>, lineage: string }} opts
 * @returns {{ registry: object|null, warnings: object[] }}
 */
function normalizeRegistrySchema(registry, { canonicalKey, aliases, lineage }) {
  if (!registry) return { registry, warnings: [] };
  const warnings = [];

  // Prefer a populated canonical array, but allow a populated alias to repair
  // an initialized-yet-empty canonical projection.
  if (Array.isArray(registry[canonicalKey]) && registry[canonicalKey].length > 0) {
    return { registry, warnings };
  }

  // Try each alias in priority order.
  for (const [aliasKey, targetKey] of Object.entries(aliases)) {
    if (Array.isArray(registry[aliasKey]) && registry[aliasKey].length > 0) {
      // Alias found — coerce to canonical key.
      registry[targetKey] = registry[aliasKey];
      warnings.push({
        type: 'schema_mismatch',
        severity: 'warn',
        lineage,
        message: `Registry uses non-canonical key "${aliasKey}" instead of "${targetKey}"; coerced ${registry[aliasKey].length} entries.`,
        aliasKey,
        canonicalKey: targetKey,
        coercedCount: registry[aliasKey].length,
      });
      return { registry, warnings };
    }
  }

  if (Array.isArray(registry[canonicalKey])) {
    return { registry, warnings };
  }

  // No usable findings array found — registry will be skipped.
  // We cannot count entries that don't exist, but report the skip.
  warnings.push({
    type: 'schema_mismatch',
    severity: 'warn',
    lineage,
    message: `Registry has no usable "${canonicalKey}" array (checked aliases: ${Object.keys(aliases).join(', ')}); lineage findings will be skipped.`,
    aliasKey: null,
    canonicalKey,
    coercedCount: 0,
  });

  return { registry, warnings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESEARCH MERGE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge research findings registries from all lineages.
 * Deduplicates by findingId; cross-model attribution via lineage labels.
 * Returns the merged registry object.
 */
function mergeResearchRegistries(lineageData, options = {}) {
  const mergeOptions = resolveMergeOptions(options);
  const findingById = mergeOptions.enableNearDuplicateDedup ? createFindingBucketIndex() : new Map();
  const schemaWarnings = [];

  for (const { label, registry: rawRegistry } of lineageData) {
    const { registry, warnings } = normalizeRegistrySchema(rawRegistry, {
      canonicalKey: 'keyFindings',
      aliases: { findings: 'keyFindings' },
      lineage: label,
    });
    for (const w of warnings) {
      schemaWarnings.push(w);
      process.stderr.write(JSON.stringify(w) + '\n');
    }
    if (!registry || !Array.isArray(registry.keyFindings)) continue;
    for (const finding of registry.keyFindings) {
      const id = finding.id || finding.title;
      if (!id) continue;
      if (mergeOptions.enableNearDuplicateDedup) {
        addResearchFinding(getFindingBucket(findingById, id, finding, true).records, finding, label, mergeOptions);
      } else {
        if (!findingById.has(id)) findingById.set(id, []);
        addResearchFinding(findingById.get(id), finding, label, mergeOptions);
      }
    }
  }

  const mergedFindings = mergeOptions.enableNearDuplicateDedup
    ? flattenFindingBucketIndex(findingById, 'id', ['id', 'title'])
    : flattenFindingBuckets(findingById, 'id', ['id', 'title']);
  const openQuestionsById = new Map();
  const resolvedQuestionsById = new Map();
  const ruledOutById = new Map();

  for (const { label, registry } of lineageData) {
    if (!registry) continue;
    for (const q of registry.openQuestions ?? []) {
      const id = q.id || q.question || q.text;
      if (!id) continue;
      if (!openQuestionsById.has(id)) openQuestionsById.set(id, { ...q, _lineages: [label] });
      else {
        const existing = openQuestionsById.get(id);
        addLineage(existing, label);
      }
    }
    // Resolved questions are produced per-lineage by the research reducer but
    // were previously dropped here, under-reporting answered coverage in the
    // merged registry. Collect them with the same id/_lineages discipline.
    for (const q of registry.resolvedQuestions ?? []) {
      const id = q.id || q.question || q.text;
      if (!id) continue;
      if (!resolvedQuestionsById.has(id)) resolvedQuestionsById.set(id, { ...q, _lineages: [label] });
      else {
        const existing = resolvedQuestionsById.get(id);
        addLineage(existing, label);
      }
    }
    for (const d of registry.ruledOutDirections ?? []) {
      const id = d.id || d.direction;
      if (!id) continue;
      if (!ruledOutById.has(id)) ruledOutById.set(id, { ...d, _lineages: [label] });
    }
  }

  const totalIters = lineageData.reduce((sum, { registry }) => {
    return sum + (registry?.metrics?.iterationsCompleted ?? 0);
  }, 0);

  const avgConvergence =
    lineageData.length > 0
      ? lineageData.reduce((sum, { registry }) => sum + (registry?.metrics?.convergenceScore ?? 0), 0) /
        lineageData.length
      : 0;

  return {
    mergedFrom: lineageData.map(({ label }) => label).sort(),
    openQuestions: sortByContentThenId([...openQuestionsById.values()], ['id', 'question', 'text']),
    resolvedQuestions: sortByContentThenId([...resolvedQuestionsById.values()], ['id', 'question', 'text']),
    keyFindings: mergedFindings,
    ruledOutDirections: sortByContentThenId([...ruledOutById.values()], ['id', 'direction']),
    metrics: {
      iterationsCompleted: totalIters,
      openQuestions: openQuestionsById.size,
      resolvedQuestions: resolvedQuestionsById.size,
      keyFindings: mergedFindings.length,
      sourceFindings: lineageData.reduce(
        (sum, { registry }) => sum + (Number(registry?.metrics?.sourceFindings) || registry?.keyFindings?.length || 0),
        0,
      ),
      reconstructionGaps: lineageData.reduce(
        (sum, { registry }) => sum + (Number(registry?.metrics?.reconstructionGaps) || 0),
        0,
      ),
      convergenceScore: Math.round(avgConvergence * 1000) / 1000,
      coverageBySources: {},
    },
    ...(schemaWarnings.length > 0 ? { schema_mismatch: schemaWarnings } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REVIEW MERGE  (strongest-restriction)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge review findings registries with strongest-restriction severity rollup.
 * Any lineage with an active P0 finding causes the merged result to be FAIL.
 * Deduplication is by findingId; cross-lineage P0 wins if any lineage reports it.
 */
function mergeReviewRegistries(lineageData, options = {}) {
  const mergeOptions = resolveMergeOptions(options);
  const findingById = mergeOptions.enableNearDuplicateDedup ? createFindingBucketIndex() : new Map();
  const schemaWarnings = [];

  for (const { label, registry: rawRegistry } of lineageData) {
    const { registry, warnings } = normalizeRegistrySchema(rawRegistry, {
      canonicalKey: 'openFindings',
      aliases: { findings: 'openFindings' },
      lineage: label,
    });
    for (const w of warnings) {
      schemaWarnings.push(w);
      process.stderr.write(JSON.stringify(w) + '\n');
    }
    if (!registry || !Array.isArray(registry.openFindings)) continue;
    for (const finding of registry.openFindings) {
      if (finding.status !== 'active') continue;
      const id = finding.findingId || finding.title;
      if (!id) continue;
      if (mergeOptions.enableNearDuplicateDedup) {
        addReviewFinding(getFindingBucket(findingById, id, finding, true).records, finding, label, mergeOptions);
      } else {
        if (!findingById.has(id)) findingById.set(id, []);
        addReviewFinding(findingById.get(id), finding, label, mergeOptions);
      }
    }
  }

  // Resolved findings are tracked separately per lineage and were previously
  // dropped here, zeroing the merged resolved coverage. Collect them by id with
  // _lineages attribution, without touching open-finding/verdict semantics.
  const resolvedFindingById = mergeOptions.enableNearDuplicateDedup ? createFindingBucketIndex() : new Map();
  for (const { label, registry } of lineageData) {
    if (!registry || !Array.isArray(registry.resolvedFindings)) continue;
    for (const finding of registry.resolvedFindings) {
      const id = finding.findingId || finding.title;
      if (!id) continue;
      if (mergeOptions.enableNearDuplicateDedup) {
        addReviewFinding(getFindingBucket(resolvedFindingById, id, finding, true).records, finding, label, mergeOptions);
      } else if (resolvedFindingById.has(id)) {
        addLineage(resolvedFindingById.get(id), label);
      } else {
        resolvedFindingById.set(id, { ...finding, _lineages: [label] });
      }
    }
  }
  const mergedResolvedFindings = mergeOptions.enableNearDuplicateDedup
    ? flattenFindingBucketIndex(resolvedFindingById, 'findingId', ['findingId', 'title'])
    : sortByContentThenId([...resolvedFindingById.values()], ['findingId', 'title']);

  const mergedFindings = mergeOptions.enableNearDuplicateDedup
    ? flattenFindingBucketIndex(findingById, 'findingId', ['findingId', 'title'])
    : flattenFindingBuckets(findingById, 'findingId', ['findingId', 'title']);
  const activeP0 = mergedFindings.filter((f) => f.severity === 'P0' && f.status === 'active').length;
  const activeP1 = mergedFindings.filter((f) => f.severity === 'P1' && f.status === 'active').length;
  const activeP2 = mergedFindings.filter((f) => f.severity === 'P2' && f.status === 'active').length;

  // Strongest-restriction verdict
  let mergedVerdict;
  if (activeP0 > 0) {
    mergedVerdict = 'FAIL';
  } else if (activeP1 > 0) {
    mergedVerdict = 'CONDITIONAL';
  } else {
    mergedVerdict = 'PASS';
  }

  return {
    mergedFrom: lineageData.map(({ label }) => label).sort(),
    mergedVerdict,
    openFindings: mergedFindings,
    resolvedFindings: mergedResolvedFindings,
    findingsBySeverity: { P0: activeP0, P1: activeP1, P2: activeP2 },
    openFindingsCount: mergedFindings.length,
    resolvedFindingsCount: mergedResolvedFindings.length,
    activeP0,
    activeP1,
    activeP2,
    ...(schemaWarnings.length > 0 ? { schema_mismatch: schemaWarnings } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ATTRIBUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build fanout-attribution.md summarizing per-lineage convergence, iters, salvage, model.
 */
function buildAttributionMd(lineageData, loopType) {
  const lines = [
    `# Fan-Out Attribution`,
    ``,
    `Loop type: **${loopType}**  |  Lineage count: **${lineageData.length}**`,
    ``,
    `| Label | Kind | Model | Iterations | Convergence | Salvaged | Verdict |`,
    `|-------|------|-------|-----------|-------------|----------|---------|`,
  ];

  for (const { label, registry, stateRecords, kind, model } of lineageData) {
    const iters = stateRecords.filter((r) => r.type === 'iteration').length;
    const salvage = stateRecords.filter((r) => r.type === 'event' && r.event === 'salvaged_from_stdout').length;
    const convergenceScore = registry?.metrics?.convergenceScore ?? registry?.convergenceScore ?? 'n/a';
    const verdict =
      loopType === 'review'
        ? registry?.findingsBySeverity?.P0 > 0
          ? 'FAIL'
          : registry?.findingsBySeverity?.P1 > 0
          ? 'CONDITIONAL'
          : 'PASS'
        : 'n/a';
    lines.push(`| ${label} | ${kind ?? 'unknown'} | ${model ?? 'default'} | ${iters} | ${convergenceScore} | ${salvage} | ${verdict} |`);
  }

  lines.push('');
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reconstruct a minimal review findings registry from a lineage state log.
 *
 * Leaf-only review lineages may carry active findings only in their state log
 * iteration records (`findingDetails`), with no registry file on disk. This maps
 * those findingDetails into the openFindings shape mergeReviewRegistries consumes,
 * so registry-absent lineages are not silently dropped from merge/synthesis.
 *
 * @param {Array<Object>} stateRecords - Parsed JSONL state records.
 * @param {string} label - Lineage label, for attribution.
 * @returns {{openFindings:Array,Object}|null} Reconstructed registry, or null when no findings exist.
 */
function reconstructReviewRegistryFromState(stateRecords, label) {
  if (!Array.isArray(stateRecords)) return null;
  const openFindings = [];
  const resolvedFindings = [];
  for (const record of stateRecords) {
    if (!record || record.type !== 'iteration' || !Array.isArray(record.findingDetails)) continue;
    for (const detail of record.findingDetails) {
      if (!detail || typeof detail !== 'object') continue;
      const id = detail.id || detail.findingId || detail.title;
      if (!id) continue;
      const isActive = (detail.disposition || detail.status || 'active') === 'active';
      const mapped = {
        findingId: id,
        title: detail.title || id,
        severity: detail.severity || 'P2',
        status: isActive ? 'active' : 'resolved',
        ...(detail.dimension ? { dimension: detail.dimension } : {}),
        ...(detail.file ? { file: detail.file } : {}),
        ...(detail.recommendation ? { recommendation: detail.recommendation } : {}),
        _lineages: [label],
        _reconstructed_from_state: true,
      };
      if (isActive) openFindings.push(mapped);
      else resolvedFindings.push(mapped);
    }
  }
  if (openFindings.length === 0 && resolvedFindings.length === 0) return null;
  const bySeverity = {
    P0: openFindings.filter((f) => f.severity === 'P0').length,
    P1: openFindings.filter((f) => f.severity === 'P1').length,
    P2: openFindings.filter((f) => f.severity === 'P2').length,
  };
  return { openFindings, resolvedFindings, findingsBySeverity: bySeverity, _reconstructed: true };
}

function firstNonEmptyString(values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const objectText = firstNonEmptyString([value.title, value.summary, value.text, value.finding, value.description]);
      if (objectText) return objectText;
    }
  }
  return '';
}

function normalizeResearchFindingCandidate(candidate, record, index) {
  const run = Number.isFinite(Number(record.run ?? record.iteration)) ? Math.floor(Number(record.run ?? record.iteration)) : 0;
  if (typeof candidate === 'string') {
    const text = candidate.trim();
    if (!text) return null;
    return {
      id: `state-finding-${run}-${index + 1}-${crypto.createHash('sha256').update(text).digest('hex').slice(0, 12)}`,
      title: text,
      text,
      addedAtIteration: run,
      _reconstructed_from_state: true,
    };
  }
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;
  const text = firstNonEmptyString([candidate.title, candidate.summary, candidate.text, candidate.finding, candidate.description]);
  if (!text) return null;
  return {
    id: candidate.id || candidate.findingId || `state-finding-${run}-${index + 1}-${crypto.createHash('sha256').update(text).digest('hex').slice(0, 12)}`,
    title: candidate.title || text,
    ...(candidate.summary ? { summary: candidate.summary } : {}),
    ...(candidate.text ? { text: candidate.text } : { text }),
    ...(candidate.confidence ? { confidence: candidate.confidence } : {}),
    addedAtIteration: candidate.addedAtIteration ?? run,
    ...(candidate._iteration_source ? { _iteration_source: candidate._iteration_source } : {}),
    _reconstructed_from_state: true,
  };
}

function researchCandidatesFromIteration(record, iterationFindingsByRun = new Map()) {
  if (!record || record.type !== 'iteration') return [];
  const run = Number.isFinite(Number(record.run ?? record.iteration)) ? Math.floor(Number(record.run ?? record.iteration)) : 0;
  const expectedCount = Number(record.findingsCount);
  const structured = [record.keyFindings, record.findings, record.findingDetails]
    .find((value) => Array.isArray(value) && value.length > 0);
  if (Array.isArray(structured)) {
    if (Number.isFinite(expectedCount) && expectedCount > 0 && structured.length !== Math.floor(expectedCount)) {
      throw inputError(`iteration ${run} findingsCount=${Math.floor(expectedCount)} does not match ${structured.length} structured finding(s)`);
    }
    return structured;
  }

  const iterationFindings = iterationFindingsByRun.get(run) ?? [];
  const graphFindings = Array.isArray(record.graphEvents)
    ? record.graphEvents
      .filter((event) => event?.type === 'node' && event?.kind === 'FINDING' && firstNonEmptyString([event.label, event.title, event.text]))
      .map((event, index) => ({
        id: event.id || `state-finding-${run}-${index + 1}`,
        title: firstNonEmptyString([event.label, event.title, event.text]),
        text: firstNonEmptyString([event.text, event.label, event.title]),
        addedAtIteration: run,
      }))
    : [];
  if (Number.isFinite(expectedCount) && expectedCount > 0) {
    const normalizedExpectedCount = Math.floor(expectedCount);
    if (iterationFindings.length === normalizedExpectedCount) return iterationFindings;
    if (graphFindings.length === normalizedExpectedCount) return graphFindings;
    if (iterationFindings.length > 0 || graphFindings.length > 0) {
      throw inputError(
        `iteration ${run} findingsCount=${normalizedExpectedCount} does not match markdown=${iterationFindings.length} or graph=${graphFindings.length} finding evidence`,
      );
    }
    throw inputError(`iteration ${run} reports ${normalizedExpectedCount} finding(s) without structured, markdown, or graph finding evidence`);
  }

  if (iterationFindings.length > 0) return iterationFindings;
  if (graphFindings.length > 0) return graphFindings;
  return [];
}

/**
 * Reconstruct a minimal research findings registry from a lineage state log.
 *
 * Leaf-only research lineages may have substantive iteration records but no
 * registry file on disk. This maps state-log findings into keyFindings so the
 * research merge does not silently drop a registry-absent lineage.
 *
 * @param {Array<Object>} stateRecords - Parsed JSONL state records.
 * @param {string} label - Lineage label, for attribution.
 * @returns {{keyFindings:Array,Object}|null} Reconstructed registry, or null when no findings exist.
 */
function reconstructResearchRegistryFromState(stateRecords, label, iterationFindingsByRun = new Map()) {
  if (!Array.isArray(stateRecords)) return null;
  const keyFindings = [];
  for (const record of stateRecords) {
    const candidates = researchCandidatesFromIteration(record, iterationFindingsByRun);
    candidates.forEach((candidate, index) => {
      const mapped = normalizeResearchFindingCandidate(candidate, record, index);
      if (!mapped) return;
      keyFindings.push({ ...mapped, _lineages: [label] });
    });
  }
  if (keyFindings.length === 0) return null;
  const iterationsCompleted = stateRecords.filter((record) => record?.type === 'iteration').length;
  const latestIteration = stateRecords.filter((record) => record?.type === 'iteration').at(-1);
  const convergenceScore = latestIteration?.convergenceSignals?.compositeStop
    ?? latestIteration?.newInfoRatio
    ?? 0;
  return {
    keyFindings,
    openQuestions: [],
    resolvedQuestions: [],
    ruledOutDirections: [],
    metrics: {
      iterationsCompleted,
      openQuestions: 0,
      resolvedQuestions: 0,
      keyFindings: keyFindings.length,
      convergenceScore,
      coverageBySources: {},
    },
    _reconstructed: true,
  };
}

function hasUsableResearchFindings(registry) {
  return Boolean(registry && [registry.keyFindings, registry.findings]
    .some((findings) => Array.isArray(findings) && findings.length > 0));
}

function mergeReconstructedResearchRegistry(registry, reconstructed) {
  if (!registry) return reconstructed;
  return {
    ...registry,
    ...reconstructed,
    openQuestions: Array.isArray(registry.openQuestions) ? registry.openQuestions : reconstructed.openQuestions,
    resolvedQuestions: Array.isArray(registry.resolvedQuestions) ? registry.resolvedQuestions : reconstructed.resolvedQuestions,
    ruledOutDirections: Array.isArray(registry.ruledOutDirections) ? registry.ruledOutDirections : reconstructed.ruledOutDirections,
    metrics: {
      ...(registry.metrics && typeof registry.metrics === 'object' ? registry.metrics : {}),
      ...reconstructed.metrics,
    },
  };
}

async function main() {
  const { writeStateAtomic, writeTextAtomic } = await import('../lib/deep-loop/atomic-state.ts');
  const args = parseArgs();
  const loopType = ensureString(args, 'loopType');
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'context') {
    throw inputError('loopType must be "research", "review", or "context"');
  }
  const artifactDir = path.resolve(ensureString(args, 'artifactDir'));
  if (!fs.existsSync(artifactDir)) {
    throw inputError(`artifactDir does not exist: ${artifactDir}`);
  }
  const artifactStat = fs.lstatSync(artifactDir);
  if (artifactStat.isSymbolicLink() || !artifactStat.isDirectory()) {
    throw inputError(`artifactDir must be a real directory: ${artifactDir}`);
  }
  const artifactRoot = fs.realpathSync(artifactDir);
  const lineagesDir = path.join(artifactDir, 'lineages');

  if (!fs.existsSync(lineagesDir)) {
    jsonOut({ status: 'ok', message: 'no lineages directory — nothing to merge', merged: 0 });
    return;
  }

  requireRealDirectory(artifactRoot, lineagesDir, 'lineages directory');
  const lineageEntries = fs.readdirSync(lineagesDir, { withFileTypes: true });
  const linkedLineage = lineageEntries.find((entry) => entry.isSymbolicLink());
  if (linkedLineage) {
    throw inputError(`lineage directory entries must not be symbolic links: ${path.join(lineagesDir, linkedLineage.name)}`);
  }
  const labelDirs = lineageEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (labelDirs.length === 0) {
    jsonOut({ status: 'ok', message: 'no lineage subdirs found', merged: 0 });
    return;
  }

  // Load per-lineage data
  const registryName = loopType === 'review' ? 'deep-review-findings-registry.json' : 'findings-registry.json';
  const compatibilityRegistryName = loopType === 'research' ? 'deep-research-findings-registry.json' : null;
  const stateLogName = loopType === 'review' ? 'deep-review-state.jsonl' : 'deep-research-state.jsonl';
  const summaryPath = path.join(artifactDir, 'orchestration-summary.json');
  const orchestrationSummary = readJsonFile(artifactRoot, summaryPath, 'orchestration summary') ?? {};

  const lineageData = labelDirs.map((label) => {
    const lineageDir = path.join(lineagesDir, label);
    requireRealDirectory(artifactRoot, lineageDir, `lineage ${label} directory`);
    let registry = readJsonFile(artifactRoot, path.join(lineageDir, registryName), `lineage ${label} registry`);
    if (!registry && compatibilityRegistryName) {
      registry = readJsonFile(artifactRoot, path.join(lineageDir, compatibilityRegistryName), `lineage ${label} compatibility registry`);
    }
    const stateRecords = readStateLog(artifactRoot, path.join(lineageDir, stateLogName), `lineage ${label} state log`);
    const iterationFindingsByRun = loadIterationFindings(artifactRoot, lineageDir, label);
    // Leaf-only review/research lineages (orchestrator-managed direct-leaf convention) may carry
    // active findings only in their state log's findingDetails, with no registry file.
    // Without a registry, such a lineage was silently skipped by the registry-only merge,
    // dropping its findings from synthesis. Reconstruct a minimal registry from the
    // state log so leaf-only lineages reach merge without a separate reducer step.
    if (!registry && loopType === 'review') {
      registry = reconstructReviewRegistryFromState(stateRecords, label);
    }
    if (loopType === 'research' && !hasUsableResearchFindings(registry)) {
      const reconstructed = reconstructResearchRegistryFromState(stateRecords, label, iterationFindingsByRun);
      if (reconstructed) {
        reconstructed.metrics.sourceFindings = reconstructed.keyFindings.length;
        reconstructed.metrics.reconstructionGaps = 0;
        registry = mergeReconstructedResearchRegistry(registry, reconstructed);
      }
    }
    // Infer kind/model from state log executor records
    const executorRecord = stateRecords.find((r) => r.type === 'event' && r.event === 'executor_start');
    return {
      label,
      lineageDir,
      registry,
      stateRecords,
      kind: executorRecord?.kind ?? orchestrationSummary?.[label]?.kind ?? 'unknown',
      model: executorRecord?.model ?? orchestrationSummary?.[label]?.model ?? 'unknown',
    };
  });

  const lineagesWithRegistry = lineageData.filter((d) => d.registry !== null);

  let mergedRegistry;
  if (loopType === 'review') {
    mergedRegistry = mergeReviewRegistries(lineagesWithRegistry, resolveMergeOptions(args));
  } else {
    mergedRegistry = mergeResearchRegistries(lineagesWithRegistry, resolveMergeOptions(args));
  }

  // Write merged registry to base artifact dir (replacing single-executor path).
  // Atomic temp+fsync+rename so a mid-write kill never hands synthesis a
  // truncated registry — readers see the prior file or the complete new one.
  const mergedRegistryPath = path.join(artifactDir, registryName);
  let compatibilityRegistryPath = null;
  if (compatibilityRegistryName) {
    const serializedRegistry = `${JSON.stringify(mergedRegistry, null, 2)}\n`;
    compatibilityRegistryPath = path.join(artifactDir, compatibilityRegistryName);
    assertSafeOutputPath(artifactRoot, mergedRegistryPath, 'merged registry');
    assertSafeOutputPath(artifactRoot, compatibilityRegistryPath, 'compatibility registry');
    writeTextAtomic(mergedRegistryPath, serializedRegistry);
    writeTextAtomic(compatibilityRegistryPath, serializedRegistry);
  } else {
    assertSafeOutputPath(artifactRoot, mergedRegistryPath, 'merged registry');
    writeStateAtomic(mergedRegistryPath, mergedRegistry);
  }

  // Write attribution markdown atomically (same torn-write guarantee; text, not JSON).
  const attributionPath = path.join(artifactDir, 'fanout-attribution.md');
  assertSafeOutputPath(artifactRoot, attributionPath, 'fan-out attribution');
  writeTextAtomic(attributionPath, buildAttributionMd(lineageData, loopType));

  jsonOut({
    status: 'ok',
    loop_type: loopType,
    merged_lineages: lineagesWithRegistry.length,
    skipped_no_registry: lineageData.length - lineagesWithRegistry.length,
    merged_registry_path: mergedRegistryPath,
    ...(compatibilityRegistryPath ? { compatibility_registry_path: compatibilityRegistryPath } : {}),
    attribution_path: attributionPath,
    ...(loopType === 'review'
      ? { merged_verdict: mergedRegistry.mergedVerdict, active_p0: mergedRegistry.activeP0, active_p1: mergedRegistry.activeP1 }
      : { key_findings: mergedRegistry.keyFindings?.length ?? 0 }),
  });
}

// Exports for unit testing
module.exports = { mergeResearchRegistries, mergeReviewRegistries, buildAttributionMd, reconstructReviewRegistryFromState, reconstructResearchRegistryFromState, normalizeRegistrySchema };

if (require.main === module) {
  main().catch((err) => {
    const code = err && err.code === 'INPUT_VALIDATION' ? 3 : 1;
    jsonOut({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
      code: err && err.code ? err.code : 'SCRIPT_ERROR',
    });
    if (code === 1) {
      process.stderr.write(
        JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n',
      );
    }
    process.exit(code);
  });
}
