// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scan Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_scan — indexes workspace files.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';
import { buildEdgeDistribution, computeEdgeShare } from '../lib/edge-drift.js';
import {
  hasCrossFileCallResolutionActivity,
  resolveCrossFileCallEdges,
} from '../lib/cross-file-edge-resolver.js';
import { getDefaultConfig, type DetectorProvenance, type CodeEdge } from '../lib/indexer-types.js';
import { indexFiles } from '../lib/structural-indexer.js';
import { resetParserHealth } from '../lib/tree-sitter-parser.js';
import * as graphDb from '../lib/code-graph-db.js';
import { persistIndexedFileResult, recordCandidateManifest } from '../lib/ensure-ready.js';
import {
  DEFAULT_GOLD_BATTERY_PATH,
  executeBattery,
  loadGoldBattery,
  type VerifyResult,
} from '../lib/gold-query-verifier.js';
import { isRecord } from '../lib/query-result-adapter.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';
import { canonicalizeWorkspacePaths, isWithinWorkspace } from '../lib/utils/workspace-path.js';
import { resolveIndexScopePolicy, scopeFingerprintsMatchOrLegacy } from '../lib/index-scope-policy.js';
import { getSkipListSummary } from '../lib/parser-skip-list.js';
import { handleCodeGraphQuery } from './query.js';

export interface ScanArgs {
  rootDir?: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
  incremental?: boolean;
  includeSkills?: boolean | string[];
  includeAgents?: boolean;
  includeCommands?: boolean;
  includeSpecs?: boolean;
  includePlugins?: boolean;
  verify?: boolean;
  persistBaseline?: boolean;
  forceZeroNodeReset?: boolean;
  forceScopeChange?: boolean;
}

export interface ScanResult {
  filesScanned: number;
  filesIndexed: number;
  filesSkipped: number;
  unsupportedLanguageSkipped: number;
  parserSkipListBypassCount: number;
  totalNodes: number;
  totalEdges: number;
  errors: string[];
  durationMs: number;
  fullScanRequested: boolean;
  effectiveIncremental: boolean;
  fullReindexTriggered?: boolean;
  currentGitHead?: string | null;
  previousGitHead?: string | null;
  detectorProvenanceSummary?: graphDb.DetectorProvenanceSummary;
  graphEdgeEnrichmentSummary?: graphDb.GraphEdgeEnrichmentSummary | null;
  tombstones: graphDb.CodeGraphTombstoneSummary;
  parseDiagnostics: graphDb.ParseDiagnosticsSummary;
  parserSkipList: {
    added: number;
    healed: number;
    totalAfterScan: number;
  };
  staleButValidGraphFiles: number;
  failedScan?: graphDb.FailedScanRecord | null;
  warnings: string[];
  capExceeded: {
    maxNodes: boolean;
    depth: boolean;
    gitignoreSize: boolean;
  };
  verification?: VerifyResult;
}

const DEFAULT_FATAL_PARSE_ERROR_RATIO = 0.5;
const PARSER_SKIP_LIST_PREFIX = 'Parser skipped by skip-list';

function summarizeDetectorProvenance(
  results: Array<{ detectorProvenance?: DetectorProvenance }>,
): graphDb.DetectorProvenanceSummary {
  const counts: Partial<Record<DetectorProvenance, number>> = {};
  let dominant: DetectorProvenance | 'unknown' = 'unknown';
  let dominantCount = 0;

  for (const result of results) {
    if (!result.detectorProvenance) {
      continue;
    }
    const nextCount = (counts[result.detectorProvenance] ?? 0) + 1;
    counts[result.detectorProvenance] = nextCount;
    if (nextCount > dominantCount) {
      dominantCount = nextCount;
      dominant = result.detectorProvenance;
    }
  }

  return { dominant, counts };
}

function summarizeGraphEdgeEnrichment(
  results: Array<{ edges: CodeEdge[] }>,
): graphDb.GraphEdgeEnrichmentSummary | null {
  let best: graphDb.GraphEdgeEnrichmentSummary | null = null;

  for (const result of results) {
    for (const edge of result.edges) {
      const metadata = edge.metadata;
      if (!metadata || typeof metadata.confidence !== 'number') {
        continue;
      }

      const edgeEvidenceClass = (() => {
        switch (edge.edgeType) {
          case 'IMPORTS':
          case 'EXPORTS':
            return 'import' as const;
          case 'EXTENDS':
          case 'IMPLEMENTS':
          case 'TYPE_OF':
            return 'type_reference' as const;
          case 'TESTED_BY':
            return 'test_coverage' as const;
          default:
            return metadata.detectorProvenance === 'heuristic' || metadata.evidenceClass === 'INFERRED'
              ? 'inferred_heuristic' as const
              : 'direct_call' as const;
        }
      })();

      if (!best || metadata.confidence > best.numericConfidence) {
        best = {
          edgeEvidenceClass,
          numericConfidence: metadata.confidence,
        };
      }
    }
  }

  return best;
}

interface ParseErrorFileClassification {
  cleanCount: number;
  skipListBypassCount: number;
  realErrorCount: number;
}

function classifyParseErrorFiles(
  results: Array<{ parseHealth: string; parseErrors: string[] }>,
): ParseErrorFileClassification {
  return results.reduce<ParseErrorFileClassification>((counts, result) => {
    const hasParseErrors = result.parseErrors.length > 0;
    const hasOnlySkipListBypassErrors = hasParseErrors
      && result.parseErrors.every((error) => error.startsWith(PARSER_SKIP_LIST_PREFIX));
    const hasRealParseErrors = result.parseErrors.some((error) => !error.startsWith(PARSER_SKIP_LIST_PREFIX));

    if (hasOnlySkipListBypassErrors) {
      counts.skipListBypassCount++;
    } else if (result.parseHealth === 'error' || hasRealParseErrors) {
      counts.realErrorCount++;
    } else {
      counts.cleanCount++;
    }

    return counts;
  }, {
    cleanCount: 0,
    skipListBypassCount: 0,
    realErrorCount: 0,
  });
}

function countPersistableNodes(results: Array<{ parseHealth: string; nodes: unknown[] }>): number {
  return results.reduce((total, result) => (
    result.parseHealth === 'error' ? total : total + result.nodes.length
  ), 0);
}

function computeParseErrorRatio(parseErrorCount: number, totalFiles: number): number {
  if (totalFiles === 0) {
    return 0;
  }
  return parseErrorCount / totalFiles;
}

function formatParseDiagnosticMessage(result: { parseErrors: string[] }): string {
  return result.parseErrors.length > 0
    ? result.parseErrors.join('; ')
    : 'Parser returned parseHealth="error" without diagnostics';
}

function recordParseDiagnosticsForResults(
  results: Array<{ filePath: string; parseHealth: string; parseErrors: string[] }>,
): void {
  for (const result of results) {
    if (result.parseHealth !== 'error' && result.parseErrors.length === 0) {
      continue;
    }
    graphDb.recordParseDiagnostic(result.filePath, formatParseDiagnosticMessage(result));
  }
}

function getCurrentGitHead(rootDir: string): string | null {
  try {
    return execSync('git rev-parse HEAD', {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 5_000,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[code-graph-scan] Failed to read git HEAD for ${rootDir}: ${message}`);
    return null;
  }
}

function cleanupMissingTrackedFiles(filePaths: string[]): void {
  for (const filePath of filePaths) {
    if (existsSync(filePath)) {
      continue;
    }

    graphDb.removeFile(filePath, { reason: 'incremental_missing_tracked_file' });
  }
}

function emptyTombstoneSummary(): graphDb.CodeGraphTombstoneSummary {
  return {
    enabled: false,
    retentionLimit: 0,
    retainedRows: 0,
    byKind: {},
    byReason: {},
    recent: [],
  };
}

function summarizeEdgeDistribution(results: Array<{ edges: CodeEdge[] }>) {
  const edgeCounts = buildEdgeDistribution();

  for (const result of results) {
    for (const edge of result.edges) {
      edgeCounts[edge.edgeType] += 1;
    }
  }

  return computeEdgeShare(edgeCounts);
}

function hasUsablePersistedEdgeDistributionBaseline(): boolean {
  const rawBaseline = graphDb.getCodeGraphMetadata('edge_distribution_baseline');
  if (!rawBaseline) {
    return false;
  }

  try {
    const parsedBaseline = JSON.parse(rawBaseline) as unknown;
    if (!isRecord(parsedBaseline)) {
      return false;
    }

    buildEdgeDistribution(parsedBaseline);
    return true;
  } catch {
    return false;
  }
}

function relativize(absPath: string, workspaceRoot: string): string {
  const resolvedPath = resolve(absPath);
  const resolvedWorkspace = resolve(workspaceRoot);
  const workspaceRelative = relative(resolvedWorkspace, resolvedPath);
  if (workspaceRelative === '') {
    return '.';
  }
  if (!workspaceRelative.startsWith('..') && !isAbsolute(workspaceRelative)) {
    return workspaceRelative;
  }
  return basename(resolvedPath);
}

const PATH_DELIMITERS = /([\s:'"`{}\[\],()\x00]+)/;

function relativizeScanMessage(message: string, workspaceRoot: string): string {
  return message.split(PATH_DELIMITERS).map(segment => {
    if (segment.startsWith('/')) {
      return relativize(segment, workspaceRoot);
    }
    return segment;
  }).join('');
}

function relativizeScanWarning(warning: string, workspaceRoot: string): string {
  return relativizeScanMessage(warning, workspaceRoot);
}

export function relativizeScanError(error: string, workspaceRoot: string): string {
  return relativizeScanMessage(error, workspaceRoot);
}

function relativizeParseDiagnostics(
  summary: graphDb.ParseDiagnosticsSummary,
  workspaceRoot: string,
): graphDb.ParseDiagnosticsSummary {
  return {
    affectedFiles: summary.affectedFiles,
    recentErrors: summary.recentErrors.map((diagnostic) => ({
      ...diagnostic,
      filePath: relativize(diagnostic.filePath, workspaceRoot),
      errorMessage: relativizeScanError(diagnostic.errorMessage, workspaceRoot),
    })),
  };
}

/** Handle code_graph_scan tool call */
export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  const startTime = Date.now();
  const rootDir = args.rootDir ?? process.cwd();
  const incremental = args.incremental !== false;
  const resolvedRootDir = resolve(rootDir);

  // SECURITY: Canonicalize paths via realpathSync() to prevent symlink bypass.
  // A symlink inside the workspace pointing outside it would pass a lexical
  // startsWith() check on the resolved (but not canonicalized) path.
  const canonical = canonicalizeWorkspacePaths(resolvedRootDir);
  if (!canonical) {
    // Broken symlink or non-existent path — reject immediately
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `rootDir path is invalid or contains a broken symlink: ${relativize(resolvedRootDir, process.cwd())}`,
        }),
      }],
    };
  }
  const { canonicalWorkspace, canonicalRootDir } = canonical;

  if (!isWithinWorkspace(canonicalWorkspace, canonicalRootDir)) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `rootDir must stay within the workspace root; received: ${relativize(canonicalRootDir, canonicalWorkspace)}`,
        }),
      }],
    };
  }

  const scopePolicy = resolveIndexScopePolicy({
    includeSkills: args.includeSkills,
    includeAgents: args.includeAgents,
    includeCommands: args.includeCommands,
    includeSpecs: args.includeSpecs,
    includePlugins: args.includePlugins,
    includeGlobs: args.includeGlobs,
    excludeGlobs: args.excludeGlobs,
  });
  const config = getDefaultConfig(canonicalRootDir, scopePolicy);
  const initialSkipListCount = getSkipListSummary().count;

  const previousGitHead = graphDb.getLastGitHead();
  const currentGitHead = getCurrentGitHead(canonicalRootDir);
  const gitHeadChanged = previousGitHead !== null
    && currentGitHead !== null
    && previousGitHead !== currentGitHead;
  const effectiveIncremental = incremental;
  const fullReindexTriggered = gitHeadChanged && !effectiveIncremental;

  if (gitHeadChanged && incremental) {
    console.error(`[code-graph-scan] Git HEAD changed (${previousGitHead} -> ${currentGitHead}); honoring incremental content-hash reindex`);
  }

  // An explicit full scan is a deliberate retry, so clear any prior global parser
  // quarantine before indexing. A B2 ("memory access out of bounds") quarantine
  // otherwise persists until a launcher restart, making every full scan return
  // zero nodes (then rejected by the zero-node guard below). resetParserHealth()
  // drops the corrupted parser instance so indexing re-initializes a fresh
  // web-tree-sitter instance. Incremental scans do NOT reset — only an explicit
  // `incremental: false` request signals intent to retry.
  if (args.incremental === false) {
    resetParserHealth();
  }

  const results = await indexFiles(config, { skipFreshFiles: effectiveIncremental });
  const detectorProvenanceSummary = summarizeDetectorProvenance(results);
  let graphEdgeEnrichmentSummary = summarizeGraphEdgeEnrichment(results);
  const preParseSkippedCount = effectiveIncremental ? (results.preParseSkippedCount ?? 0) : 0;
  const forceParsedFiles = new Set(effectiveIncremental ? (results.forceParsedFiles ?? []) : []);
  const unsupportedLanguageSkipped = results.unsupportedLanguageSkipped ?? 0;
  const priorStats = graphDb.getStats();
  const priorNodeCount = priorStats.totalNodes;
  const candidatePersistableNodeCount = countPersistableNodes(results);
  const parseErrorClassification = classifyParseErrorFiles(results);
  const parseErrorCount = parseErrorClassification.realErrorCount;
  const parserSkipListBypassCount = parseErrorClassification.skipListBypassCount;
  // Skip-list bypasses are intentionally not parsed, so exclude them from the
  // ratio denominator. The fatal threshold should measure degradation among
  // files the parser actually attempted, especially in narrow incremental scans.
  const parseErrorRatio = computeParseErrorRatio(parseErrorCount, results.length - parserSkipListBypassCount);
  const severeParseErrorScan = parseErrorRatio > DEFAULT_FATAL_PARSE_ERROR_RATIO;
  const fullScan = !effectiveIncremental;
  const storedScope = graphDb.getStoredCodeGraphScope();
  const candidateFingerprint = scopePolicy.fingerprint;
  const scopeChangePromotionBlocked = fullScan
    && priorStats.totalNodes > 0
    && storedScope?.fingerprint
    && !scopeFingerprintsMatchOrLegacy(storedScope.fingerprint, candidateFingerprint)
    && args.forceScopeChange !== true;
  const zeroNodePromotionBlocked = fullScan
    && candidatePersistableNodeCount === 0
    && priorNodeCount > 0
    && args.forceZeroNodeReset !== true;

  if (scopeChangePromotionBlocked) {
    recordParseDiagnosticsForResults(results);
    const reason = 'scope_change_scan_rejected';
    const failedScan = graphDb.recordFailedScan({
      reason,
      totalFiles: results.length,
      totalNodes: candidatePersistableNodeCount,
      parseErrorCount,
      parseErrorRatio,
      previousGitHead,
      currentGitHead,
      scopeFingerprint: scopePolicy.fingerprint,
      scopeLabel: scopePolicy.label,
      errors: results.flatMap((result) => result.parseErrors).slice(0, 10),
    });
    console.warn(
      `[code-graph-scan] Blocked scope-change full scan promotion over existing graph (${priorNodeCount} prior node(s)); stored scope ${storedScope.fingerprint} differs from candidate scope ${candidateFingerprint}; pass forceScopeChange: true to allow scope replacement.`,
    );
    const parseDiagnostics = relativizeParseDiagnostics(graphDb.getParseDiagnosticsSummary(), canonicalWorkspace);
    const skipListSummary = getSkipListSummary();
    const readinessBlock = buildReadinessBlock({
      freshness: 'stale',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'scope-change scan rejected to preserve existing graph state',
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'blocked',
          reason,
          data: {
            filesScanned: results.length,
            filesIndexed: 0,
            filesSkipped: preParseSkippedCount + unsupportedLanguageSkipped,
            unsupportedLanguageSkipped,
            parserSkipListBypassCount,
            totalNodes: priorStats.totalNodes,
            totalEdges: priorStats.totalEdges,
            errors: results.flatMap((result) => {
              const filePath = relativize(result.filePath, canonicalWorkspace);
              return result.parseErrors.map((error) => `${filePath}: ${relativizeScanError(error, canonicalWorkspace)}`);
            }).slice(0, 10),
            durationMs: Date.now() - startTime,
            fullScanRequested: args.incremental === false,
            effectiveIncremental,
            fullReindexTriggered,
            currentGitHead,
            previousGitHead,
            detectorProvenanceSummary,
            graphEdgeEnrichmentSummary,
            parseDiagnostics,
            parserSkipList: {
              added: Math.max(0, skipListSummary.count - initialSkipListCount),
              healed: 0,
              totalAfterScan: skipListSummary.count,
            },
            staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
            failedScan,
            warnings: [
              `scope-change scan rejected; existing graph has ${priorNodeCount} node(s)`,
              `stored scope fingerprint ${storedScope.fingerprint} differs from candidate scope fingerprint ${candidateFingerprint}; pass forceScopeChange: true if intentional`,
              ...(results.warnings ?? []).map(warning => relativizeScanWarning(warning, canonicalWorkspace)),
            ],
            capExceeded: results.capExceeded ?? { maxNodes: false, depth: false, gitignoreSize: false },
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            lastPersistedAt: priorStats.lastScanTimestamp,
          },
        }, null, 2),
      }],
    };
  }

  if (zeroNodePromotionBlocked) {
    recordParseDiagnosticsForResults(results);
    const reason = 'zero_node_scan_rejected';
    const failedScan = graphDb.recordFailedScan({
      reason,
      totalFiles: results.length,
      totalNodes: candidatePersistableNodeCount,
      parseErrorCount,
      parseErrorRatio,
      previousGitHead,
      currentGitHead,
      scopeFingerprint: scopePolicy.fingerprint,
      scopeLabel: scopePolicy.label,
      errors: results.flatMap((result) => result.parseErrors).slice(0, 10),
    });
    console.warn(
      `[code-graph-scan] Blocked zero-node full scan promotion over existing graph (${priorNodeCount} prior node(s)); pass forceZeroNodeReset:true to allow destructive reset.`,
    );
    const parseDiagnostics = relativizeParseDiagnostics(graphDb.getParseDiagnosticsSummary(), canonicalWorkspace);
    const skipListSummary = getSkipListSummary();
    const readinessBlock = buildReadinessBlock({
      freshness: 'stale',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'zero-node scan rejected to preserve existing graph state',
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'blocked',
          reason,
          data: {
            filesScanned: results.length,
            filesIndexed: 0,
            filesSkipped: preParseSkippedCount + unsupportedLanguageSkipped,
            unsupportedLanguageSkipped,
            parserSkipListBypassCount,
            totalNodes: priorStats.totalNodes,
            totalEdges: priorStats.totalEdges,
            errors: results.flatMap((result) => {
              const filePath = relativize(result.filePath, canonicalWorkspace);
              return result.parseErrors.map((error) => `${filePath}: ${relativizeScanError(error, canonicalWorkspace)}`);
            }).slice(0, 10),
            durationMs: Date.now() - startTime,
            fullScanRequested: args.incremental === false,
            effectiveIncremental,
            fullReindexTriggered,
            currentGitHead,
            previousGitHead,
            detectorProvenanceSummary,
            graphEdgeEnrichmentSummary,
            parseDiagnostics,
            parserSkipList: {
              added: Math.max(0, skipListSummary.count - initialSkipListCount),
              healed: 0,
              totalAfterScan: skipListSummary.count,
            },
            staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
            failedScan,
            warnings: [
              `zero-node scan rejected; existing graph has ${priorNodeCount} node(s)`,
              ...(results.warnings ?? []).map(warning => relativizeScanWarning(warning, canonicalWorkspace)),
            ],
            capExceeded: results.capExceeded ?? { maxNodes: false, depth: false, gitignoreSize: false },
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            lastPersistedAt: priorStats.lastScanTimestamp,
          },
        }, null, 2),
      }],
    };
  }

  let filesIndexed = 0;
  let filesSkipped = preParseSkippedCount + unsupportedLanguageSkipped;
  let totalNodes = 0;
  let totalEdges = 0;
  const errors: string[] = [];
  const structuralErrors: string[] = [];
  const parserSkipWarnings: string[] = [];

  if (effectiveIncremental) {
    cleanupMissingTrackedFiles(graphDb.getTrackedFiles());
  } else if (!severeParseErrorScan) {
    const indexedPaths = new Set(results.map((result) => result.filePath));
    for (const filePath of graphDb.getTrackedFiles()) {
      if (!indexedPaths.has(filePath)) {
        graphDb.removeFile(filePath, { reason: 'full_scan_unindexed_tracked_file' });
      }
    }
  }

  for (const result of results) {
    // Skip unchanged files in incremental mode
    if (
      effectiveIncremental
      && !forceParsedFiles.has(result.filePath)
      && !graphDb.isFileStale(
        result.filePath,
        result.contentHash ? { currentContentHash: result.contentHash } : undefined,
      )
    ) {
      filesSkipped++;
      continue;
    }

    try {
      // Defer the dangling-target edge prune per-file. A full scan
      // persists files one at a time, so a cross-file IMPORTS edge whose target
      // lives in a not-yet-persisted file would be pruned here and never
      // restored. We sweep once with pruneDanglingEdges() after the loop and
      // cross-file resolution, when every target node exists.
      persistIndexedFileResult(result, { deferDanglingTargetPrune: true });

      if (result.parseHealth !== 'error') {
        filesIndexed++;
        totalNodes += result.nodes.length;
        totalEdges += result.edges.length;
      }
    } catch (err: unknown) {
      const filePath = relativize(result.filePath, canonicalWorkspace);
      const message = `${filePath}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(message);
      structuralErrors.push(message);
    }

    if (result.parseErrors.length > 0) {
      const filePath = relativize(result.filePath, canonicalWorkspace);
      // Parser skip-list entries are the designed safety net for grammars that
      // crash on certain inputs (B1: tree-sitter API quirk; B2: WASM trap).
      // Route them to warnings so they do not pollute the error count or
      // obscure real persistence failures in failedScan.errors.
      for (const parseError of result.parseErrors) {
        const message = `${filePath}: ${parseError}`;
        if (parseError.includes('Parser skipped by skip-list')) {
          parserSkipWarnings.push(message);
        } else {
          errors.push(message);
        }
      }
    }
  }

  const scanPromotable = !severeParseErrorScan && structuralErrors.length === 0;
  const failedScanErrors = [
    ...structuralErrors,
    ...errors.filter(error => !structuralErrors.includes(error)),
  ].slice(0, 10);
  const failedScan = scanPromotable
    ? null
    : graphDb.recordFailedScan({
      reason: severeParseErrorScan ? 'parse_error_threshold_exceeded' : 'structural_persistence_error',
      totalFiles: results.length,
      totalNodes: candidatePersistableNodeCount,
      parseErrorCount,
      parseErrorRatio,
      previousGitHead,
      currentGitHead,
      scopeFingerprint: scopePolicy.fingerprint,
      scopeLabel: scopePolicy.label,
      errors: failedScanErrors,
    });

  if (scanPromotable && filesIndexed > 0 && results.length > 0) {
    graphDb.setLastDetectorProvenance(results[0].detectorProvenance);
  }

  if (scanPromotable && currentGitHead) {
    graphDb.setLastGitHead(currentGitHead);
  }
  if (scanPromotable && detectorProvenanceSummary.dominant !== 'unknown') {
    graphDb.setLastDetectorProvenance(detectorProvenanceSummary.dominant);
  }
  if (scanPromotable) {
    graphDb.setLastDetectorProvenanceSummary(detectorProvenanceSummary);
    graphDb.setCodeGraphScope(scopePolicy);
    if (filesIndexed > 0 || !effectiveIncremental) {
      graphDb.bumpCodeGraphGeneration();
    }
  }

  // Refresh candidate manifest after a successful scan so
  // the next detectState() has a current baseline to compare against. Without
  // this, code_graph_status reports stale ("candidate manifest drift") on the
  // very next call after an explicit user-triggered scan. Incremental scans
  // also discover new indexable files via find-candidates, so refresh their
  // manifest after successful promotion too.
  if (scanPromotable) {
    try {
      recordCandidateManifest(graphDb.getTrackedFiles());
    } catch {
      // Best-effort: manifest recording must never block a successful scan
    }
  }

  const hasPersistedBaseline = hasUsablePersistedEdgeDistributionBaseline();
  if (
    !effectiveIncremental
    && scanPromotable
    && (!hasPersistedBaseline || args.persistBaseline === true)
  ) {
    const distribution = summarizeEdgeDistribution(results);
    graphDb.setCodeGraphMetadata('edge_distribution_baseline', JSON.stringify(distribution));
  }

  const crossFileCallResolution = filesIndexed > 0 && scanPromotable
    ? resolveCrossFileCallEdges()
    : { resolved: 0, unresolved: 0, ambiguousSkipped: 0 };
  if (hasCrossFileCallResolutionActivity(crossFileCallResolution)) {
    graphEdgeEnrichmentSummary = {
      ...(graphEdgeEnrichmentSummary ?? {
        edgeEvidenceClass: 'inferred_heuristic' as const,
        numericConfidence: 0.8,
      }),
      crossFileCallResolution,
    };
  }

  if (scanPromotable && filesIndexed > 0 && graphEdgeEnrichmentSummary) {
    graphDb.setLastGraphEdgeEnrichmentSummary(graphEdgeEnrichmentSummary);
  } else if (scanPromotable && filesIndexed > 0) {
    graphDb.clearLastGraphEdgeEnrichmentSummary();
  }

  // Now that every file's nodes are persisted and cross-file CALL
  // edges are resolved, sweep genuinely-dangling edges ONCE. Per-file
  // replaceEdges deferred this prune so forward-referenced cross-file IMPORTS
  // edges (importer persisted before the imported file) survived; here their
  // targets exist, so only truly-orphaned edges are removed.
  if (filesIndexed > 0) {
    graphDb.pruneDanglingEdges();
  }

  // Report POST-PERSIST DB counts so the scan response
  // matches what the next code_graph_status will see. The pre-persist sums
  // (totalNodes/totalEdges accumulated above) double-count edges that get
  // deduped during persistence and miss edges added by enrichment that runs
  // before the response is built — leading to a confusing ~1k delta between
  // scan response and immediate status. The DB read is cheap (2 COUNT(*)
  // queries) and gives a single source of truth for graph cardinality.
  const persistedStats = graphDb.getStats();
  const responseTotalNodes = persistedStats.totalNodes;
  const responseTotalEdges = persistedStats.totalEdges;
  const tombstones = persistedStats.tombstones ?? emptyTombstoneSummary();
  const parseDiagnostics = relativizeParseDiagnostics(graphDb.getParseDiagnosticsSummary(), canonicalWorkspace);
  const skipListSummary = getSkipListSummary();

  const scanResult: ScanResult = {
    filesScanned: results.length,
    filesIndexed,
    filesSkipped,
    unsupportedLanguageSkipped,
    parserSkipListBypassCount,
    totalNodes: responseTotalNodes,
    totalEdges: responseTotalEdges,
    errors: errors.slice(0, 10).map(error => relativizeScanError(error, canonicalWorkspace)),
    durationMs: Date.now() - startTime,
    fullScanRequested: args.incremental === false,
    effectiveIncremental,
    fullReindexTriggered,
    currentGitHead,
    previousGitHead,
    detectorProvenanceSummary,
    graphEdgeEnrichmentSummary,
    tombstones,
    parseDiagnostics,
    parserSkipList: {
      added: Math.max(0, skipListSummary.count - initialSkipListCount),
      healed: 0,
      totalAfterScan: skipListSummary.count,
    },
    staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
    failedScan,
    warnings: [
      ...(severeParseErrorScan
        ? [`scan metadata promotion blocked: real parse error ratio ${parseErrorRatio.toFixed(2)} exceeds ${DEFAULT_FATAL_PARSE_ERROR_RATIO}`]
        : []),
      ...parserSkipWarnings.slice(0, 10),
      ...(results.warnings ?? []).map(warning => relativizeScanWarning(warning, canonicalWorkspace)),
    ],
    capExceeded: results.capExceeded ?? { maxNodes: false, depth: false, gitignoreSize: false },
  };
  const lastPersistedAt = persistedStats.lastScanTimestamp;
  const shouldVerify = args.verify === true && incremental === false;

  if (shouldVerify) {
    const verification = {
      ...(await executeBattery(loadGoldBattery(DEFAULT_GOLD_BATTERY_PATH), handleCodeGraphQuery)),
      batteryPath: DEFAULT_GOLD_BATTERY_PATH,
    };
    graphDb.setLastGoldVerification(verification);
    scanResult.verification = verification;
  }

  const readinessBlock = buildReadinessBlock({
    freshness: lastPersistedAt ? 'fresh' : 'empty',
    action: fullReindexTriggered || !effectiveIncremental ? 'full_scan' : 'selective_reindex',
    inlineIndexPerformed: true,
    reason: lastPersistedAt
      ? 'scan completed and persisted current graph state'
      : 'scan completed but no graph data was persisted',
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'ok',
        data: {
          ...scanResult,
          readiness: readinessBlock,
          canonicalReadiness: readinessBlock.canonicalReadiness,
          trustState: readinessBlock.trustState,
          lastPersistedAt,
        },
      }, null, 2),
    }],
  };
}
