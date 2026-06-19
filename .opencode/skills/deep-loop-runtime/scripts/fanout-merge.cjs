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
    if (contentKey) index.byContent.set(contentKey, exactBucket);
    return exactBucket;
  }

  const contentBucket = contentKey ? index.byContent.get(contentKey) : undefined;
  if (contentBucket) {
    index.byId.set(id, contentBucket);
    return contentBucket;
  }

  const bucket = { baseId: id, records: [] };
  index.buckets.push(bucket);
  index.byId.set(id, bucket);
  if (contentKey) index.byContent.set(contentKey, bucket);
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
  const identityKey = options.enableNearDuplicateDedup ? nearDuplicateContentKey : contentIdentityKey;
  const existing = bucket.find((entry) => identityKey(entry) === identityKey(finding));
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
  const identityKey = options.enableNearDuplicateDedup ? nearDuplicateContentKey : contentIdentityKey;
  const existing = bucket.find((entry) => identityKey(entry) === identityKey(finding));
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

  for (const { label, registry } of lineageData) {
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

  for (const { label, registry } of lineageData) {
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
    const registry = tryReadJson(path.join(lineageDir, registryName));
    const stateRecords = readStateLog(path.join(lineageDir, stateLogName));
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
module.exports = { mergeResearchRegistries, mergeReviewRegistries, buildAttributionMd };

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
