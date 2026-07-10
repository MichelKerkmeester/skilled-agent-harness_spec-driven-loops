// ───────────────────────────────────────────────────────────────────
// MODULE: Verify Index Identity
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

import { DB_PATH } from '@spec-kit/shared/paths';
import { isMainModule } from '../lib/esm-entry.js';

interface MemoryIndexDbRow {
  id: number;
  specFolder: string;
  filePath: string;
  canonicalFilePath: string | null;
  anchorId: string | null;
  documentType: string | null;
  title: string | null;
  contentHash: string | null;
  importanceTier: string | null;
  parentId: number | null;
}

/** Row evidence retained for an identity finding. */
export interface IdentityRow {
  id: number;
  specFolder: string;
  filePath: string;
  canonicalFilePath: string;
  anchorId: string | null;
  documentType: string | null;
  title: string | null;
  contentHash: string | null;
  importanceTier: string | null;
}

/** Duplicate rows sharing one canonical path. */
export interface CanonicalPathDuplicateCluster {
  canonicalFilePath: string;
  rowCount: number;
  excessRowCount: number;
  rows: IdentityRow[];
}

/** Duplicate rows sharing one canonical document identity. */
export interface DocumentIdentityDuplicateCluster extends CanonicalPathDuplicateCluster {
  anchorId: string | null;
  documentType: string | null;
}

/** Anchor and document type shared by paths in a suspected rename pair. */
export interface DocumentIdentity {
  anchorId: string | null;
  documentType: string | null;
}

/** Non-empty title and anchor identity shared by two candidate paths. */
export interface TitleAnchorIdentity {
  title: string;
  anchorId: string;
  documentType: string | null;
}

export type HistoricalPrefixSignal =
  | 'matching_content_hash'
  | 'matching_title_anchor_identity'
  | 'multi_segment_path_suffix';

/** One canonical path participating in a suspected historical-prefix cluster. */
export interface HistoricalPathEvidence {
  canonicalFilePath: string;
  prefix: string;
  rows: IdentityRow[];
}

/** Two paths with auditable identity evidence under different prefixes. */
export interface HistoricalPrefixPair {
  leftPath: string;
  rightPath: string;
  leftPrefix: string;
  rightPrefix: string;
  sharedIdentities: DocumentIdentity[];
  matchedSignals: HistoricalPrefixSignal[];
  sharedContentHashes: string[];
  sharedTitleAnchorIdentities: TitleAnchorIdentity[];
  sharedPathSuffix: string | null;
}

/** Suspected unreconciled paths grouped by their unchanged path tail. */
export interface HistoricalPrefixCluster {
  tailKey: string;
  parentName: string;
  basename: string;
  paths: HistoricalPathEvidence[];
  pairs: HistoricalPrefixPair[];
}

/** Pair counts by the strong signal that admitted them. */
export interface HistoricalPrefixSignalBreakdown {
  matchingContentHashPairs: number;
  matchingTitleAnchorIdentityPairs: number;
  multiSegmentPathSuffixPairs: number;
}

/** Before/after file evidence that the verifier did not mutate SQLite. */
export interface DatabaseReadOnlySelfCheck {
  sizeBeforeBytes: number;
  sizeAfterBytes: number;
  mtimeBeforeMs: number;
  mtimeAfterMs: number;
  sizeUnchanged: boolean;
  mtimeUnchanged: boolean;
  passed: boolean;
}

/** Exact aggregate counts for an index identity verification run. */
export interface IdentityVerificationSummary {
  rowsScanned: number;
  parentRowsScanned: number;
  canonicalPathDuplicateClusters: number;
  canonicalPathDuplicateRows: number;
  canonicalPathExcessRows: number;
  documentIdentityDuplicateClusters: number;
  documentIdentityDuplicateRows: number;
  documentIdentityExcessRows: number;
  suspectedHistoricalPrefixClusters: number;
  suspectedHistoricalPrefixPairs: number;
  historicalPrefixSignalBreakdown: HistoricalPrefixSignalBreakdown;
}

/** Complete machine-readable index identity verification report. */
export interface IdentityVerificationReport {
  databasePath: string;
  generatedAt: string;
  identityColumns: string[];
  databaseReadOnlySelfCheck: DatabaseReadOnlySelfCheck;
  summary: IdentityVerificationSummary;
  canonicalPathDuplicates: CanonicalPathDuplicateCluster[];
  documentIdentityDuplicates: DocumentIdentityDuplicateCluster[];
  suspectedHistoricalPrefixes: HistoricalPrefixCluster[];
}

type OutputFormat = 'human' | 'json' | 'both';

interface CliOptions {
  databasePath: string;
  format: OutputFormat;
  help: boolean;
}

const REQUIRED_COLUMNS = [
  'id',
  'spec_folder',
  'file_path',
  'canonical_file_path',
  'anchor_id',
  'document_type',
  'title',
  'content_hash',
  'importance_tier',
  'parent_id',
] as const;

const IDENTITY_COLUMNS = [
  'canonical_file_path',
  'anchor_id',
  'document_type',
  'title',
  'content_hash',
] as const;
const COLD_ARCHIVE_TIERS = new Set(['archived', 'deprecated']);
const MIN_SHARED_SUFFIX_SEGMENTS = 3;
const GENERIC_WORKFLOW_ARTIFACT_BASENAMES = new Set([
  'checklist.md',
  'decision-record.md',
  'description.json',
  'graph-metadata.json',
  'handover.md',
  'implementation-summary.md',
  'plan.md',
  'research.md',
  'resource-map.md',
  'review-report.md',
  'spec.md',
  'tasks.md',
]);
const GENERIC_WORKFLOW_PATH_SEGMENTS = new Set([
  'checklist',
  'decision-record',
  'description',
  'graph-metadata',
  'handover',
  'implementation-summary',
  'plan',
  'research',
  'resource-map',
  'review',
  'review-report',
  'spec',
  'tasks',
]);

const HELP_TEXT = `
verify-index-identity — Report duplicate canonical identities without mutating SQLite

Usage:
  node verify-index-identity.js [--db <path>] [--format human|json|both]

Options:
  --db <path>       SQLite database path (defaults to MEMORY_DB_PATH or the active database)
  --format <value>  Output format: human, json, or both (default: both)
  --help, -h        Show this help text
`;

function normalizeOptionalIdentity(value: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function canonicalizeStoredPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  try {
    return fs.realpathSync(normalized).replace(/\\/g, '/');
  } catch {
    return path.resolve(normalized).replace(/\\/g, '/');
  }
}

function toIdentityRow(row: MemoryIndexDbRow): IdentityRow {
  const storedIdentityPath = row.canonicalFilePath?.trim() || row.filePath;
  return {
    id: row.id,
    specFolder: row.specFolder,
    filePath: row.filePath,
    canonicalFilePath: canonicalizeStoredPath(storedIdentityPath),
    anchorId: normalizeOptionalIdentity(row.anchorId),
    documentType: normalizeOptionalIdentity(row.documentType),
    title: normalizeOptionalIdentity(row.title),
    contentHash: normalizeOptionalIdentity(row.contentHash),
    importanceTier: normalizeOptionalIdentity(row.importanceTier)?.toLowerCase() ?? null,
  };
}

function collectCanonicalPathDuplicates(rows: IdentityRow[]): CanonicalPathDuplicateCluster[] {
  const grouped = new Map<string, IdentityRow[]>();
  for (const row of rows) {
    const existing = grouped.get(row.canonicalFilePath) ?? [];
    existing.push(row);
    grouped.set(row.canonicalFilePath, existing);
  }

  return [...grouped.entries()]
    .filter(([, clusterRows]) => clusterRows.length > 1)
    .map(([canonicalFilePath, clusterRows]) => ({
      canonicalFilePath,
      rowCount: clusterRows.length,
      excessRowCount: clusterRows.length - 1,
      rows: clusterRows.sort((left, right) => left.id - right.id),
    }))
    .sort((left, right) => left.canonicalFilePath.localeCompare(right.canonicalFilePath));
}

function documentIdentityKey(row: Pick<IdentityRow, 'anchorId' | 'documentType'>): string {
  return JSON.stringify([row.anchorId, row.documentType]);
}

function collectDocumentIdentityDuplicates(rows: IdentityRow[]): DocumentIdentityDuplicateCluster[] {
  const grouped = new Map<string, IdentityRow[]>();
  for (const row of rows) {
    const key = JSON.stringify([
      row.canonicalFilePath,
      row.anchorId,
      row.documentType,
    ]);
    const existing = grouped.get(key) ?? [];
    existing.push(row);
    grouped.set(key, existing);
  }

  return [...grouped.values()]
    .filter((clusterRows) => clusterRows.length > 1)
    .map((clusterRows) => ({
      canonicalFilePath: clusterRows[0].canonicalFilePath,
      anchorId: clusterRows[0].anchorId,
      documentType: clusterRows[0].documentType,
      rowCount: clusterRows.length,
      excessRowCount: clusterRows.length - 1,
      rows: clusterRows.sort((left, right) => left.id - right.id),
    }))
    .sort((left, right) => {
      const pathOrder = left.canonicalFilePath.localeCompare(right.canonicalFilePath);
      if (pathOrder !== 0) return pathOrder;
      return documentIdentityKey(left).localeCompare(documentIdentityKey(right));
    });
}

function sharedDocumentIdentities(
  leftRows: IdentityRow[],
  rightRows: IdentityRow[],
): DocumentIdentity[] {
  const rightKeys = new Set(rightRows.map(documentIdentityKey));
  const shared = new Map<string, DocumentIdentity>();
  for (const row of leftRows) {
    const key = documentIdentityKey(row);
    if (rightKeys.has(key)) {
      shared.set(key, { anchorId: row.anchorId, documentType: row.documentType });
    }
  }
  return [...shared.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, identity]) => identity);
}

function titleAnchorIdentityKey(
  row: Pick<IdentityRow, 'title' | 'anchorId' | 'documentType'>,
): string | null {
  if (!row.title || !row.anchorId) return null;
  return JSON.stringify([row.title, row.anchorId, row.documentType]);
}

function sharedTitleAnchorIdentities(
  leftRows: IdentityRow[],
  rightRows: IdentityRow[],
): TitleAnchorIdentity[] {
  const rightKeys = new Set(rightRows.map(titleAnchorIdentityKey).filter((key) => key !== null));
  const shared = new Map<string, TitleAnchorIdentity>();
  for (const row of leftRows) {
    const key = titleAnchorIdentityKey(row);
    if (key && rightKeys.has(key)) {
      shared.set(key, {
        title: row.title as string,
        anchorId: row.anchorId as string,
        documentType: row.documentType,
      });
    }
  }
  return [...shared.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, identity]) => identity);
}

function sharedContentHashes(leftRows: IdentityRow[], rightRows: IdentityRow[]): string[] {
  const rightHashes = new Set(
    rightRows.map((row) => row.contentHash).filter((hash): hash is string => hash !== null),
  );
  return [...new Set(
    leftRows
      .map((row) => row.contentHash)
      .filter((hash): hash is string => hash !== null && rightHashes.has(hash)),
  )].sort((left, right) => left.localeCompare(right));
}

function sharedTrailingPathSegments(leftPath: string, rightPath: string): string[] {
  const leftSegments = leftPath.split('/').filter(Boolean);
  const rightSegments = rightPath.split('/').filter(Boolean);
  const shared: string[] = [];
  while (
    shared.length < leftSegments.length
    && shared.length < rightSegments.length
    && leftSegments[leftSegments.length - shared.length - 1]
      === rightSegments[rightSegments.length - shared.length - 1]
  ) {
    shared.unshift(leftSegments[leftSegments.length - shared.length - 1]);
  }
  return shared;
}

function hasDistinctiveSharedPathSuffix(sharedSegments: string[]): boolean {
  if (sharedSegments.length < MIN_SHARED_SUFFIX_SEGMENTS) return false;
  const basename = sharedSegments.at(-1);
  if (!basename || !GENERIC_WORKFLOW_ARTIFACT_BASENAMES.has(basename)) return true;

  return sharedSegments.slice(0, -1).some((segment) => {
    const normalized = segment.replace(/^\d{3}-/, '').toLowerCase();
    return !GENERIC_WORKFLOW_PATH_SEGMENTS.has(normalized);
  });
}

function prefixBeforeSuffix(filePath: string, suffixLength: number): string {
  let prefix = filePath;
  for (let index = 0; index < suffixLength; index += 1) {
    prefix = path.posix.dirname(prefix);
  }
  return prefix;
}

function isIntentionalColdArchive(evidence: HistoricalPathEvidence): boolean {
  const isArchivePath = evidence.canonicalFilePath.split('/').includes('z_archive');
  return isArchivePath
    && evidence.rows.some((row) => (
      row.importanceTier !== null && COLD_ARCHIVE_TIERS.has(row.importanceTier)
    ));
}

function isSuppressedArchiveToLivePair(
  left: HistoricalPathEvidence,
  right: HistoricalPathEvidence,
): boolean {
  const leftIsArchive = left.canonicalFilePath.split('/').includes('z_archive');
  const rightIsArchive = right.canonicalFilePath.split('/').includes('z_archive');
  if (leftIsArchive === rightIsArchive) return false;
  return leftIsArchive ? isIntentionalColdArchive(left) : isIntentionalColdArchive(right);
}

function collectHistoricalPrefixClusters(rows: IdentityRow[]): HistoricalPrefixCluster[] {
  const grouped = new Map<string, Map<string, HistoricalPathEvidence>>();
  for (const row of rows) {
    const basename = path.posix.basename(row.canonicalFilePath);
    const parentPath = path.posix.dirname(row.canonicalFilePath);
    const parentName = path.posix.basename(parentPath);
    if (!basename || !parentName || parentName === '.') continue;

    const tailKey = `${parentName}/${basename}`;
    const paths = grouped.get(tailKey) ?? new Map<string, HistoricalPathEvidence>();
    const evidence = paths.get(row.canonicalFilePath) ?? {
      canonicalFilePath: row.canonicalFilePath,
      prefix: path.posix.dirname(parentPath),
      rows: [],
    };
    evidence.rows.push(row);
    paths.set(row.canonicalFilePath, evidence);
    grouped.set(tailKey, paths);
  }

  const clusters: HistoricalPrefixCluster[] = [];
  for (const [tailKey, pathMap] of grouped) {
    const paths = [...pathMap.values()]
      .map((evidence) => ({
        ...evidence,
        rows: evidence.rows.sort((left, right) => left.id - right.id),
      }))
      .sort((left, right) => left.canonicalFilePath.localeCompare(right.canonicalFilePath));
    if (paths.length < 2) continue;

    const pairs: HistoricalPrefixPair[] = [];
    for (let leftIndex = 0; leftIndex < paths.length - 1; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < paths.length; rightIndex += 1) {
        const left = paths[leftIndex];
        const right = paths[rightIndex];
        const sharedIdentities = sharedDocumentIdentities(left.rows, right.rows);
        const contentHashes = sharedContentHashes(left.rows, right.rows);
        const titleAnchorIdentities = sharedTitleAnchorIdentities(left.rows, right.rows);
        const sharedSuffixSegments = sharedTrailingPathSegments(
          left.canonicalFilePath,
          right.canonicalFilePath,
        );
        const hasMultiSegmentSuffix = hasDistinctiveSharedPathSuffix(sharedSuffixSegments);
        const matchedSignals: HistoricalPrefixSignal[] = [];
        if (contentHashes.length > 0) matchedSignals.push('matching_content_hash');
        if (titleAnchorIdentities.length > 0) {
          matchedSignals.push('matching_title_anchor_identity');
        }
        if (hasMultiSegmentSuffix) matchedSignals.push('multi_segment_path_suffix');

        const suffixLength = hasMultiSegmentSuffix
          ? sharedSuffixSegments.length
          : 2;
        const leftPrefix = prefixBeforeSuffix(left.canonicalFilePath, suffixLength);
        const rightPrefix = prefixBeforeSuffix(right.canonicalFilePath, suffixLength);
        if (
          leftPrefix === rightPrefix
          || matchedSignals.length === 0
          || isSuppressedArchiveToLivePair(left, right)
        ) continue;
        pairs.push({
          leftPath: left.canonicalFilePath,
          rightPath: right.canonicalFilePath,
          leftPrefix,
          rightPrefix,
          sharedIdentities,
          matchedSignals,
          sharedContentHashes: contentHashes,
          sharedTitleAnchorIdentities: titleAnchorIdentities,
          sharedPathSuffix: hasMultiSegmentSuffix ? sharedSuffixSegments.join('/') : null,
        });
      }
    }
    if (pairs.length === 0) continue;

    clusters.push({
      tailKey,
      parentName: path.posix.dirname(tailKey),
      basename: path.posix.basename(tailKey),
      paths,
      pairs,
    });
  }
  return clusters.sort((left, right) => left.tailKey.localeCompare(right.tailKey));
}

function assertMemoryIndexSchema(database: InstanceType<typeof Database>): void {
  const columns = database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
  if (columns.length === 0) {
    throw new Error('Required table memory_index does not exist');
  }

  const available = new Set(columns.map((column) => column.name));
  const missing = REQUIRED_COLUMNS.filter((column) => !available.has(column));
  if (missing.length > 0) {
    throw new Error(`memory_index is missing required identity columns: ${missing.join(', ')}`);
  }
}

function sumClusterRows(clusters: Array<{ rowCount: number }>): number {
  return clusters.reduce((total, cluster) => total + cluster.rowCount, 0);
}

function sumExcessRows(clusters: Array<{ excessRowCount: number }>): number {
  return clusters.reduce((total, cluster) => total + cluster.excessRowCount, 0);
}

function countHistoricalPrefixSignals(
  clusters: HistoricalPrefixCluster[],
): HistoricalPrefixSignalBreakdown {
  const pairs = clusters.flatMap((cluster) => cluster.pairs);
  return {
    matchingContentHashPairs: pairs.filter((pair) => (
      pair.matchedSignals.includes('matching_content_hash')
    )).length,
    matchingTitleAnchorIdentityPairs: pairs.filter((pair) => (
      pair.matchedSignals.includes('matching_title_anchor_identity')
    )).length,
    multiSegmentPathSuffixPairs: pairs.filter((pair) => (
      pair.matchedSignals.includes('multi_segment_path_suffix')
    )).length,
  };
}

function captureReadOnlySelfCheck(
  before: fs.Stats,
  after: fs.Stats,
): DatabaseReadOnlySelfCheck {
  const sizeUnchanged = before.size === after.size;
  const mtimeUnchanged = before.mtimeMs === after.mtimeMs;
  return {
    sizeBeforeBytes: before.size,
    sizeAfterBytes: after.size,
    mtimeBeforeMs: before.mtimeMs,
    mtimeAfterMs: after.mtimeMs,
    sizeUnchanged,
    mtimeUnchanged,
    passed: sizeUnchanged && mtimeUnchanged,
  };
}

/** Verify canonical document identities through a strictly read-only SQLite connection. */
export function verifyIndexIdentity(databasePath: string): IdentityVerificationReport {
  const resolvedDatabasePath = path.resolve(databasePath);
  const beforeStat = fs.statSync(resolvedDatabasePath);
  const database = new Database(resolvedDatabasePath, { readonly: true, fileMustExist: true });
  let report: Omit<IdentityVerificationReport, 'databaseReadOnlySelfCheck'>;
  try {
    database.pragma('query_only = ON');
    assertMemoryIndexSchema(database);

    const countRow = database.prepare(`
      SELECT
        COUNT(*) AS rowsScanned,
        SUM(CASE WHEN parent_id IS NULL THEN 1 ELSE 0 END) AS parentRowsScanned
      FROM memory_index
    `).get() as { rowsScanned: number; parentRowsScanned: number | null };
    const dbRows = database.prepare(`
      SELECT
        id,
        spec_folder AS specFolder,
        file_path AS filePath,
        canonical_file_path AS canonicalFilePath,
        anchor_id AS anchorId,
        document_type AS documentType,
        title,
        content_hash AS contentHash,
        importance_tier AS importanceTier,
        parent_id AS parentId
      FROM memory_index
      WHERE parent_id IS NULL
      ORDER BY id
    `).all() as MemoryIndexDbRow[];
    const rows = dbRows.map(toIdentityRow);
    const canonicalPathDuplicates = collectCanonicalPathDuplicates(rows);
    const documentIdentityDuplicates = collectDocumentIdentityDuplicates(rows);
    const suspectedHistoricalPrefixes = collectHistoricalPrefixClusters(rows);

    report = {
      databasePath: resolvedDatabasePath,
      generatedAt: new Date().toISOString(),
      identityColumns: [...IDENTITY_COLUMNS],
      summary: {
        rowsScanned: countRow.rowsScanned,
        parentRowsScanned: countRow.parentRowsScanned ?? 0,
        canonicalPathDuplicateClusters: canonicalPathDuplicates.length,
        canonicalPathDuplicateRows: sumClusterRows(canonicalPathDuplicates),
        canonicalPathExcessRows: sumExcessRows(canonicalPathDuplicates),
        documentIdentityDuplicateClusters: documentIdentityDuplicates.length,
        documentIdentityDuplicateRows: sumClusterRows(documentIdentityDuplicates),
        documentIdentityExcessRows: sumExcessRows(documentIdentityDuplicates),
        suspectedHistoricalPrefixClusters: suspectedHistoricalPrefixes.length,
        suspectedHistoricalPrefixPairs: suspectedHistoricalPrefixes.reduce(
          (total, cluster) => total + cluster.pairs.length,
          0,
        ),
        historicalPrefixSignalBreakdown: countHistoricalPrefixSignals(
          suspectedHistoricalPrefixes,
        ),
      },
      canonicalPathDuplicates,
      documentIdentityDuplicates,
      suspectedHistoricalPrefixes,
    };
  } finally {
    database.close();
  }

  const databaseReadOnlySelfCheck = captureReadOnlySelfCheck(
    beforeStat,
    fs.statSync(resolvedDatabasePath),
  );
  if (!databaseReadOnlySelfCheck.passed) {
    throw new Error(
      'Read-only self-check failed: database size or mtime changed during verification',
    );
  }
  return { ...report, databaseReadOnlySelfCheck };
}

/** Render the exact aggregate counts from an identity verification report. */
export function formatHumanSummary(report: IdentityVerificationReport): string {
  const summary = report.summary;
  const selfCheck = report.databaseReadOnlySelfCheck;
  const signals = summary.historicalPrefixSignalBreakdown;
  return [
    'Index identity verification (read-only)',
    `Database: ${report.databasePath}`,
    `Identity columns: ${report.identityColumns.join(', ')}`,
    `Rows scanned: ${summary.rowsScanned} total, ${summary.parentRowsScanned} parent rows`,
    'Canonical path duplicates: '
      + `${summary.canonicalPathDuplicateClusters} clusters, `
      + `${summary.canonicalPathDuplicateRows} rows, `
      + `${summary.canonicalPathExcessRows} excess rows`,
    'Document identity duplicates: '
      + `${summary.documentIdentityDuplicateClusters} clusters, `
      + `${summary.documentIdentityDuplicateRows} rows, `
      + `${summary.documentIdentityExcessRows} excess rows`,
    'Suspected historical-prefix matches: '
      + `${summary.suspectedHistoricalPrefixClusters} clusters, `
      + `${summary.suspectedHistoricalPrefixPairs} pairs`,
    'Historical-prefix signal pairs: '
      + `content_hash=${signals.matchingContentHashPairs}, `
      + `title_anchor=${signals.matchingTitleAnchorIdentityPairs}, `
      + `path_suffix=${signals.multiSegmentPathSuffixPairs}`,
    `Database read-only self-check: ${selfCheck.passed ? 'PASS' : 'FAIL'}`,
    'Database size (bytes): '
      + `${selfCheck.sizeBeforeBytes} -> ${selfCheck.sizeAfterBytes} `
      + `(${selfCheck.sizeUnchanged ? 'unchanged' : 'changed'})`,
    'Database mtime (ms): '
      + `${selfCheck.mtimeBeforeMs} -> ${selfCheck.mtimeAfterMs} `
      + `(${selfCheck.mtimeUnchanged ? 'unchanged' : 'changed'})`,
  ].join('\n');
}

function readFlagValue(argv: string[], flag: string): string | null {
  const index = argv.indexOf(flag);
  return index >= 0 && argv[index + 1] ? argv[index + 1] : null;
}

function parseCliOptions(argv: string[]): CliOptions {
  const databasePath = readFlagValue(argv, '--db')?.trim()
    || process.env.MEMORY_DB_PATH?.trim()
    || DB_PATH;
  const rawFormat = readFlagValue(argv, '--format')?.trim() ?? 'both';
  if (rawFormat !== 'human' && rawFormat !== 'json' && rawFormat !== 'both') {
    throw new Error(`Invalid --format value "${rawFormat}"; expected human, json, or both`);
  }
  return {
    databasePath,
    format: rawFormat,
    help: argv.includes('--help') || argv.includes('-h'),
  };
}

/** Run the command-line verifier. */
export function main(argv: string[] = process.argv.slice(2)): void {
  try {
    const options = parseCliOptions(argv);
    if (options.help) {
      console.log(HELP_TEXT);
      return;
    }

    const report = verifyIndexIdentity(options.databasePath);
    if (options.format === 'human' || options.format === 'both') {
      console.log(formatHumanSummary(report));
    }
    if (options.format === 'both') {
      console.log('\nJSON report:');
    }
    if (options.format === 'json' || options.format === 'both') {
      console.log(JSON.stringify(report, null, 2));
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[verify-index-identity] ${message}`);
    process.exitCode = 1;
  }
}

if (isMainModule(import.meta.url)) {
  main();
}
