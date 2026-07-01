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

function tryReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readStateLog(stateLogPath) {
  if (!fs.existsSync(stateLogPath)) return [];
  const lines = fs.readFileSync(stateLogPath, 'utf8').trim().split('\n').filter(Boolean);
  return lines.flatMap((line) => {
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  });
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

  // If canonical key is already present and an array, nothing to do.
  if (Array.isArray(registry[canonicalKey])) {
    return { registry, warnings };
  }

  // Try each alias in priority order.
  for (const [aliasKey, targetKey] of Object.entries(aliases)) {
    if (Array.isArray(registry[aliasKey])) {
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
    _reconstructed_from_state: true,
  };
}

function researchCandidatesFromIteration(record) {
  if (!record || record.type !== 'iteration') return [];
  const structured = [record.keyFindings, record.findings, record.findingDetails]
    .find((value) => Array.isArray(value) && value.length > 0);
  if (Array.isArray(structured)) {
    return structured;
  }

  const findingsCount = Number(record.findingsCount);
  if (!Number.isFinite(findingsCount) || findingsCount <= 0) return [];
  const run = Number.isFinite(Number(record.run ?? record.iteration)) ? Math.floor(Number(record.run ?? record.iteration)) : 0;
  const narrative = firstNonEmptyString([
    record.summary,
    record.findingsSummary,
    record.focus,
    record.nextFocus,
    record.reflection,
  ]);
  return [{
    id: `state-finding-${run}-1-${crypto.createHash('sha256').update(narrative || String(run)).digest('hex').slice(0, 12)}`,
    title: narrative || `Iteration ${run} recorded ${Math.floor(findingsCount)} finding(s)`,
    summary: narrative || `State log recorded ${Math.floor(findingsCount)} finding(s) but no structured finding text.`,
    addedAtIteration: run,
  }];
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
function reconstructResearchRegistryFromState(stateRecords, label) {
  if (!Array.isArray(stateRecords)) return null;
  const keyFindings = [];
  for (const record of stateRecords) {
    const candidates = researchCandidatesFromIteration(record);
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

async function main() {
  const { writeStateAtomic, writeTextAtomic } = await import('../lib/deep-loop/atomic-state.ts');
  const args = parseArgs();
  const loopType = ensureString(args, 'loopType');
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'context') {
    throw inputError('loopType must be "research", "review", or "context"');
  }
  const artifactDir = ensureString(args, 'artifactDir');
  const lineagesDir = path.join(artifactDir, 'lineages');

  if (!fs.existsSync(lineagesDir)) {
    jsonOut({ status: 'ok', message: 'no lineages directory — nothing to merge', merged: 0 });
    return;
  }

  const labelDirs = fs.readdirSync(lineagesDir)
    .filter((entry) => fs.statSync(path.join(lineagesDir, entry)).isDirectory())
    .sort();

  if (labelDirs.length === 0) {
    jsonOut({ status: 'ok', message: 'no lineage subdirs found', merged: 0 });
    return;
  }

  // Load per-lineage data
  const registryName =
    loopType === 'review' ? 'deep-review-findings-registry.json' : 'deep-research-findings-registry.json';
  const stateLogName = loopType === 'review' ? 'deep-review-state.jsonl' : 'deep-research-state.jsonl';
  const summaryPath = path.join(artifactDir, 'orchestration-summary.json');
  const orchestrationSummary = tryReadJson(summaryPath) ?? {};

  const lineageData = labelDirs.map((label) => {
    const lineageDir = path.join(lineagesDir, label);
    let registry = tryReadJson(path.join(lineageDir, registryName));
    const stateRecords = readStateLog(path.join(lineageDir, stateLogName));
    // Leaf-only review/research lineages (orchestrator-managed direct-leaf convention) may carry
    // active findings only in their state log's findingDetails, with no registry file.
    // Without a registry, such a lineage was silently skipped by the registry-only merge,
    // dropping its findings from synthesis. Reconstruct a minimal registry from the
    // state log so leaf-only lineages reach merge without a separate reducer step.
    if (!registry && loopType === 'review') {
      registry = reconstructReviewRegistryFromState(stateRecords, label);
    }
    if (!registry && loopType === 'research') {
      registry = reconstructResearchRegistryFromState(stateRecords, label);
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
  writeStateAtomic(mergedRegistryPath, mergedRegistry);

  // Write attribution markdown atomically (same torn-write guarantee; text, not JSON).
  const attributionPath = path.join(artifactDir, 'fanout-attribution.md');
  writeTextAtomic(attributionPath, buildAttributionMd(lineageData, loopType));

  jsonOut({
    status: 'ok',
    loop_type: loopType,
    merged_lineages: lineagesWithRegistry.length,
    skipped_no_registry: lineageData.length - lineagesWithRegistry.length,
    merged_registry_path: mergedRegistryPath,
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
