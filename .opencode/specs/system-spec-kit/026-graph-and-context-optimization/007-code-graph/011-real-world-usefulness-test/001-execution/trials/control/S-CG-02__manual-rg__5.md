# Control: .opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts

## Import/header lines
```
6:import { execSync } from 'node:child_process';
7:import { existsSync } from 'node:fs';
8:import { basename, isAbsolute, relative, resolve } from 'node:path';
9:import { buildEdgeDistribution, computeEdgeShare } from '../lib/edge-drift.js';
14:import { getDefaultConfig, type DetectorProvenance, type CodeEdge } from '../lib/indexer-types.js';
15:import { indexFiles } from '../lib/structural-indexer.js';
16:import * as graphDb from '../lib/code-graph-db.js';
17:import { persistIndexedFileResult, recordCandidateManifest } from '../lib/ensure-ready.js';
24:import { isRecord } from '../lib/query-result-adapter.js';
25:import { buildReadinessBlock } from '../lib/readiness-contract.js';
26:import { canonicalizeWorkspacePaths, isWithinWorkspace } from '../lib/utils/workspace-path.js';
27:import { resolveIndexScopePolicy } from '../lib/index-scope-policy.js';
28:import { handleCodeGraphQuery } from './query.js';

```

## Basename dependents
```
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:34:// Handler modules (only indexSingleFile needed directly for startup scan)
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:227:  'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:802:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:809:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:815:  // session-snapshot. 'empty' recommends code_graph_scan (graph absent);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:824:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:847:  lines.push('- If "absent" (empty/missing graph): run code_graph_scan first, then session_bootstrap');
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:849:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:853:  // 'stale' (queryable). 'empty' → recommend code_graph_scan; 'error' →
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:865:      routingRules.push('Structural queries → unavailable: run code_graph_scan first (graph is absent)');
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1233:  const scanLocations: string[] = [];
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1235:    scanLocations.push(path.join(root, 'specs'));
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1236:    scanLocations.push(path.join(root, '.opencode', 'specs'));
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1243:        if (fs.existsSync(constDir)) scanLocations.push(constDir);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1249:  return Array.from(new Set(scanLocations.filter((location) => fs.existsSync(location))));
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1263:    // BUG-028 FIX: Restrict scan to known memory file locations to prevent OOM when scanning large workspaces.
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1308:    console.error('[context-server] Startup scan already in progress, skipping');
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1317:    console.error('[context-server] Starting background scan for spec documents and constitutional memories...');
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1318:    const scanRoots = Array.from(
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1328:    for (const root of scanRoots) {
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1369:      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1371:      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1376:        runPostMutationHooks('scan', {
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1381:          operation: 'startup-scan',
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1384:        // Non-fatal: startup scan must continue even if invalidation hooks fail.
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1395:    console.error(`[context-server] Startup scan error: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1423:  if (trigger === 'startup-scan') {
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1426:      console.error(`[context-server] Skill graph: created fresh (${result.scannedFiles} skills indexed)`);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1431:      console.error(`[context-server] Skill graph: loaded existing (${result.scannedFiles} skills, 0 stale)`);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1445:      console.error(`[context-server] Skill graph: new skill detected - ${skillName} (${result.scannedFiles} total)`);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1450:      console.error(`[context-server] Skill graph: skill removed - ${skillName} (${result.scannedFiles} total)`);
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1459:    '[context-server] Skill graph %s: scanned=%d indexed=%d skipped=%d edges=%d rejected=%d deleted=%d',
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1461:    result.scannedFiles,
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1502:        void runSkillGraphIndex('queued-rescan');
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1520:  await runSkillGraphIndex('startup-scan');
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2070:                  runPostMutationHooks('scan', {
.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2128:  // Background startup scan
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:60:function scanSkillMetadataFiles(
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:105:    const sourceScan = scanSkillMetadataFiles(skillRoot, args.maxMetadataFiles ?? DEFAULT_MAX_METADATA_FILES);
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:107:      errors.push(`advisor_status metadata scan capped at ${sourceScan.count} files`);
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:162:    const sourceScan = scanSkillMetadataFiles(skillRoot, args.maxMetadataFiles ?? DEFAULT_MAX_METADATA_FILES);
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:503:  | 'spec_kit.graph.scan_duration_ms'
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:527:  { name: 'spec_kit.graph.scan_duration_ms', type: 'histogram', labels: ['outcome'] },
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:75:  // so refreshTargets() can prune paths that disappeared between scans. Test
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:353:  // metadata callback (used by the initial discoverWatchTargets() scan below)
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts:52:// (corrupt DB, schema mismatch, etc.) and we degraded to filesystem scan; the
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/scoring-constants.ts:103: * `routing.` namespace keeps the calibration surface scannable as a single
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:31:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/bench/code-graph-parse-latency.bench.ts:40:    f('.opencode/skills/system-spec-kit/scripts/.scan-validate-all.py', 'python'),
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:108:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:291:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:22:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/auth/trusted-caller.ts:33:    error: 'skill_graph_scan requires trusted caller context',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:196:  nextTool: 'code_graph_scan' | 'code_graph_query' | 'rg';
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:197:  reason: 'full_scan_required' | 'selective_reindex' | 'scan_failed' | 'scan_declined';
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:198:  retryAfter?: 'scan_complete';
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:420:// code-graph handlers (scan, status, context, ccc-status,
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:788:  return readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true;
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:795:      reason: 'scan_failed',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:799:  if (readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true) {
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:801:      nextTool: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:802:      reason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:803:      retryAfter: 'scan_complete',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:818:    message: `code_graph_full_scan_required: ${readiness.reason}`,
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:825:      requiredAction: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:826:      blockReason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/api/indexing.ts:25:/** Arguments for memory index scan requests. */
.opencode/skills/system-spec-kit/mcp_server/api/indexing.ts:61:/** Runs a memory index scan with the provided arguments. */
.opencode/skills/system-spec-kit/mcp_server/api/indexing.ts:103:/** Reindexes canonical spec docs for a spec folder using the standard incremental scan. */
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4:export { handleCodeGraphScan } from './scan.js';
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:501:  name: 'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:503:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skills/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md, resource-map.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:563:  name: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:568:      rootDir: { type: 'string', description: 'Root directory to scan (default: workspace root)' },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:580:      includeAgents: { type: 'boolean', default: false, description: 'Include .opencode/agent files in this scan; default false keeps end-user code scope' },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:581:      includeCommands: { type: 'boolean', default: false, description: 'Include .opencode/command files in this scan; default false keeps end-user code scope' },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:582:      includeSpecs: { type: 'boolean', default: false, description: 'Include .opencode/specs files in this scan; default false keeps end-user code scope' },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:583:      includePlugins: { type: 'boolean', default: false, description: 'Include .opencode/plugins files in this scan; default false keeps end-user code scope' },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:584:      verify: { type: 'boolean', default: false, description: 'Run the gold-query verification battery after an explicit full scan (default: false)' },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:585:      persistBaseline: { type: 'boolean', default: false, description: 'Persist the current edge-distribution baseline after a full scan even when one already exists' },
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:619:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). When readiness requires a full scan, returns an explicit blocked payload with requiredAction `code_graph_scan`, readiness metadata, and lastPersistedAt instead of degraded graph answers. Successful responses include metadata.partialOutput for deadline/budget truncation details (reasons, omittedSections, omittedAnchors, truncatedText). Token Budget: 1200.',
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:693:  name: 'skill_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:698:      skillsRoot: { type: 'string', description: 'Optional skills root to scan (default: .opencode/skill). Must resolve to a path under the current workspace; paths escaping the workspace are rejected.' },
.opencode/skills/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skills/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:246:      ? 'Run code_graph_scan to populate structural context, then re-run session_bootstrap.'
.opencode/skills/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:247:      : 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/index.ts:4:export { handleSkillGraphScan } from './scan.js';
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:58:  nextTool: 'rg' | 'code_graph_scan';
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:72:  return readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true;
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:79:  // - full_scan required (no inline performed) → run `code_graph_scan`
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:89:  if (readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true) {
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:91:      nextTool: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:92:      reason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:188:      // the standard full_scan-required envelope so operators see WHY graph
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:195:        : `code_graph_full_scan_required: ${readiness.reason}`;
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:196:      const requiredAction = isCrash ? 'rg' : 'code_graph_scan';
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:197:      const blockReason = isCrash ? 'readiness_check_crashed' : 'full_scan_required';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2034:  return options.origin ?? (options.fromScan ? 'scan' : 'direct');
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2431:      if (indexingOrigin !== 'scan' && embedding) {
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2675:    origin: 'scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3361:const index_memory_file_from_scan = indexMemoryFileFromScan;
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3369:  index_memory_file_from_scan,
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:682:  memory_index_scan: memoryIndexScanSchema as unknown as ToolInputSchema,
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:687:  code_graph_scan: codeGraphScanSchema as unknown as ToolInputSchema,
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:693:  skill_graph_scan: skillGraphScanSchema as unknown as ToolInputSchema,
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:745:  memory_index_scan: ['specFolder', 'force', 'includeConstitutional', 'includeSpecDocs', 'incremental', 'tenantId', 'userId', 'agentId', 'sessionId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:750:  code_graph_scan: ['rootDir', 'includeGlobs', 'excludeGlobs', 'incremental', 'includeSkills', 'includeAgents', 'includeCommands', 'includeSpecs', 'includePlugins', 'verify', 'persistBaseline'],
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:756:  skill_graph_scan: ['skillsRoot'],
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:8://   When the graph readiness requires a full scan (or readiness
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:100: *   - 'stale'  → block (a full or selective scan is needed first)
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:215:  // SECURITY (parity with handlers/scan.ts): canonicalize via realpathSync
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:248:  // Operators choose when scans run via `code_graph_scan`.
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:260:      `graph readiness is "${blockedFreshness}" (action: ${readiness.action}); run code_graph_scan before detect_changes. Reason: ${readiness.reason}`,
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:4:// MCP tool handler for skill_graph_scan — indexes skill metadata.
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:28:/** Handle skill_graph_scan tool call */
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:45:        `Refusing to scan outside workspace: ${redactDiagnosticText(skillsRoot)} is not under ${redactDiagnosticText(cwd)}`,
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:49:    const scanResult = indexSkillMetadata(skillsRoot);
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:54:      reason: 'skill_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:61:      ...scanResult,
.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:65:      `Skill graph scan failed: ${redactDiagnosticText(err instanceof Error ? err.message : String(err))}`,
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2053: * Phases that compose the scan flow.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2079:  scanOutcomeRef: { value: 'success' | 'error' },
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2118:      console.info(`[structural-indexer] scanned ${allFiles.size} files (excluded: gitignored=${excludedByGitignore}, default=${excludedByDefault})`);
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2171:          'spec_kit.graph.scan_duration_ms',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2173:          { outcome: scanOutcomeRef.value },
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2195:  const scanOutcomeRef: { value: 'success' | 'error' } = { value: 'success' };
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2197:  const phases = buildIndexPhases(config, options, speckitScanStart, scanOutcomeRef);
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2200:  // emit the spec_kit.graph.scan_duration_ms histogram. The emit-metrics
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2209:    // historical inline flow so existing callers (handlers/scan.ts,
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2217:    scanOutcomeRef.value = 'error';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2221:          'spec_kit.graph.scan_duration_ms',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:10:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:18:const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:217:    console.warn(`[memory-index-scan] Alias conflict detection skipped: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:141:    console.error(`[code-graph-scan] Failed to read git HEAD for ${rootDir}: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:219:/** Handle code_graph_scan tool call */
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:276:    console.error(`[code-graph-scan] Git HEAD changed (${previousGitHead} -> ${currentGitHead}); forcing full reindex`);
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:344:  // F-014-C4-03: refresh candidate manifest after a successful full scan so
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:347:  // very next call after an explicit user-triggered scan.
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:352:      // Best-effort: manifest recording must never block a successful scan
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:385:  // FIX-011-FOLLOWUP-1: report POST-PERSIST DB counts so the scan response
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:390:  // scan response and immediate status. The DB read is cheap (2 COUNT(*)
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:396:  const scanResult: ScanResult = {
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:423:    scanResult.verification = verification;
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:428:    action: fullReindexTriggered || !effectiveIncremental ? 'full_scan' : 'selective_reindex',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:431:      ? 'scan completed and persisted current graph state'
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:432:      : 'scan completed but no graph data was persisted',
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:441:          ...scanResult,
.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:483: * Extract trigger phrases from content by scanning headings and the title.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:52:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:23:export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:79: * full-scan behavior — no regression). Returns an empty array when both shas
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:104: *     existing full-scan behavior so we never silently downgrade safety)
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:141:// scan. We persist a compact `{count, digest}` manifest of the indexable file
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:144:// full_scan. The manifest is bounded (no per-path storage) so monorepos with
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:177: * scan so the next `detectState()` has a baseline to compare against.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290:    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'graph is empty (0 nodes)' };
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:295:  // FIX-009-v3: env-vs-stored drift only blocks reads when the prior scan
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:296:  // took its policy from env (`env`/`default`). When the prior scan was an
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:297:  // explicit per-call override (`scan-argument`), the index contains exactly
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:300:  // contract while restoring read-after-scan semantics for explicit probes.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:301:  const storedFromPerCall = storedScope.source === 'scan-argument';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:306:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:309:      reason: `code graph scope changed: stored=${storedLabel}; active=${activeScope.label}; run code_graph_scan with incremental:false`,
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:325:    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'no tracked files in code_files table' };
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329:  // triggers full_scan if the diff touches no path in `getTrackedFiles()`.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:342:  // baseline, flip to stale + full_scan even when individual mtimes look fine.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:349:        action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:361:        action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:364:        reason: 'candidate manifest drift: indexable file set has changed since last scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:386:  // Too many stale files => full scan is more efficient
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:390:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:440:        // (mtime=0 from Stage 1) so the next scan will retry structural rows.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:462: * same DB are not starved during a long scan.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:527:  if (state.action === 'full_scan' && !allowInlineFullScan) {
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:532:      reason: appendCleanupReason(`${state.reason}; inline full scan skipped for read path`, removedDeletedCount),
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:537:  // Honor the last explicit scan's stored scope so per-call disabled scans are
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:539:  // this, a `code_graph_scan({includeSkills:false,...})` followed by any read
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:541:  // mismatch, and immediately blocks reads with `requiredAction:"code_graph_scan"`.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:549:    if (state.action === 'full_scan') {
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:554:      // Update stored git HEAD after full scan
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:557:      // F-014-C4-03: refresh candidate manifest after a full scan so the next
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:562:        // Best-effort: manifest recording must never block a successful scan
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:586:      // (the tracked-file set may have grown if the scan added new files).
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:590:        // Best-effort: manifest recording must never block a successful scan
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:667:// "needs full scan" vs "needs selective reindex" vs "fresh"
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:668:// without invoking `code_graph_scan` (which mutates).
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:52:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:101:/** Individual file result from a memory index scan. */
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:114:  scanned: number;
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:195:/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:200:      tool: 'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:204:        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:205:        actions: ['Wait for the restore to finish', 'Retry the index scan'],
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:227:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:231:    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:236:  // L15/T303: Atomic scan lease check.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:237:  // Reserve scan_started_at up front to avoid check-then-set race windows.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:246:      tool: 'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:254:        hint: `Please wait ${waitTime} seconds before scanning again`,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:255:        actions: ['Wait for cooldown period', 'Consider using incremental=true for faster subsequent scans'],
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:307:    console.error(`[memory-index-scan] Canonical dedup skipped ${dedupDuplicatesSkipped} alias path(s) (${mergedFiles.length} -> ${files.length})`);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:334:              'mcp:memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:353:      runPostMutationHooks('scan', context);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:355:      console.warn('[memory-index-scan] Post-mutation invalidation failed:', toErrorMessage(error));
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:375:      tool: 'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:379:        scanned: 0,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:400:    scanned: files.length,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:453:    console.error(`[memory-index-scan] Incremental mode: ${filesToIndex.length}/${files.length} files need indexing (categorized in ${categorizeTime}ms)`);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:454:    console.error(`[memory-index-scan] Fast-path skips: ${results.incremental.fast_path_skips}, Mtime changed: ${results.incremental.mtime_changed}`);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:460:  // Or 'new' on the next scan, ensuring automatic retry. Moving this update
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:464:  const scanBatchSize = BATCH_SIZE;
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:477:    }, scanBatchSize);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:558:  // Failed files keep their old mtime so they are retried on next scan.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:559:  // This is the ONLY place where scan-triggered mtime updates occur.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:573:      console.warn('[memory-index-scan] Deferring stale cleanup because one or more replacement files failed to index');
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:581:      // Determine which spec folders had spec document changes in this scan.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:608:        // Build full per-folder document map from DB (not just this scan's files).
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:638:          console.error(`[memory-index-scan] Spec 126: Created ${chainsCreated} causal chain edges across ${foldersProcessed} spec folders`);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:643:      console.warn('[memory-index-scan] Spec 126: Causal chain creation failed:', message);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:702:    tool: 'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:706:      batchSize: scanBatchSize,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:741:const handle_memory_index_scan = handleMemoryIndexScan;
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:750:  handle_memory_index_scan,
.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:338:// Entry. This replaces an O(n) full-scan with O(1) eviction.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:60:      hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:61:      actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts:18:  it('backfills previously rejected edges when the target appears on a later scan', () => {
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts:88:      expect(result.scannedFiles).toBe(2);
.opencode/skills/system-spec-kit/mcp_server/handlers/save/types.ts:66:  tool?: 'memory_save' | 'memory_index_scan' | 'refreshGraphMetadata' | 'reindexSpecDocs' | 'runEnrichmentBackfill';
.opencode/skills/system-spec-kit/mcp_server/handlers/save/types.ts:251:// do not expose scan-originated transactional bypass control.
.opencode/skills/system-spec-kit/mcp_server/handlers/save/types.ts:252:export type IndexingOrigin = 'direct' | 'scan';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:295:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:296:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:322:    hints.push('Run memory_index_scan() to regenerate embeddings');
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts:4:// Reconciles conservative per-file call edges after all scan results have
.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:606:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:6:// query handler and its 6 siblings (scan, status, context,
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:61: * session_resume, so aligning query / scan / status / context
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:128: * last-persisted scan, returning an envelope that pairs the
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:130: * graph is empty (no scan has occurred) or when the db reports
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:157:      detectorProvenanceSource: 'last-persisted-scan',
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/daemon-watcher-resource-leaks-049-005.vitest.ts:132:  it('calls watcher.unwatch() for paths that disappear between scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/handlers/index.ts:271:export const handle_memory_index_scan = lazyFunction(getMemoryIndexModule, 'handle_memory_index_scan');
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:65:  scannedFiles: number;
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:271:  return getMetadata('last_scan_timestamp');
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:530:      scannedFiles: discoveredFiles.length,
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:540:    setMetadata('last_scan_timestamp', new Date().toISOString());
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:541:    setMetadata('last_scan_skill_dir', skillDir);
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:542:    setMetadata('last_scan_summary', JSON.stringify(summary));
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:619:    // rejected edges can backfill when a target skill appears in a later scan.
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:651:    scannedFiles: discoveredFiles.length,
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:661:  setMetadata('last_scan_timestamp', new Date().toISOString());
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:662:  setMetadata('last_scan_skill_dir', skillDir);
.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:663:  setMetadata('last_scan_summary', JSON.stringify(summary));
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:24://   A. Empty graph state           -> fallbackDecision.nextTool === 'code_graph_scan'
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:25://   A'. Broad-stale (>50 stale)    -> fallbackDecision.nextTool === 'code_graph_scan'
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:34://   - We do NOT trigger `code_graph_scan` from inside the test - the entire
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:42://   - mcp_server/code_graph/lib/ensure-ready.ts:151-217 (full-scan state
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:195:  // Bucket A - Empty graph routes to code_graph_scan
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:197:  it('routes empty-graph reads to code_graph_scan via fallbackDecision', async () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:213:      nextTool: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:214:      reason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:215:      retryAfter: 'scan_complete',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:218:    expect(parsed.data?.requiredAction).toBe('code_graph_scan');
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:223:  // routes to code_graph_scan
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:226:  // `detectState` returns `action: 'full_scan'`, which the read-path
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:231:  it('routes broad-stale graphs to code_graph_scan via fallbackDecision', async () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:241:    // scan branch without rewriting the test.
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:286:      nextTool: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:287:      reason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:288:      retryAfter: 'scan_complete',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:336:      reason: 'scan_failed',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:27:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:28:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts:132:  it('caps metadata scanning when requested to avoid unbounded status walks', () => {
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts:133:    const root = workspace('scan-cap');
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts:143:      expect.stringContaining('metadata scan capped at 1 files'),
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:144:            data: { fallbackDecision: { nextTool: 'code_graph_scan', reason: 'full_scan_required' } },
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:66:    expect(parsed.data?.blockReason).toBe('full_scan_required');
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:68:      nextTool: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:69:      reason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:70:      retryAfter: 'scan_complete',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:82:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:88:      requiredAction: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:152:    return 'Run `code_graph_scan` to populate structural context, then re-run `session_bootstrap`.';
.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:156:    return 'Run `code_graph_scan` if the graph needs a broader refresh, then re-run `session_bootstrap`.';
.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:394:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:220:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:222:    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:262:    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:271:/** Compute freshness metadata from DB scan timestamps */
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:406:    const indexer = vi.fn(async () => ({ scannedFiles: 1 }));
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:413:    expect(result.summary).toEqual({ scannedFiles: 1 });
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:424:    const indexer = vi.fn(async () => ({ scannedFiles: 1 }));
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:163:    expect(response.message).toContain('code_graph_full_scan_required');
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:165:      requiredAction: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:167:      blockReason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/workspace-path.ts:40: * `handlers/scan.ts`, `handlers/verify.ts`, and `handlers/detect-changes.ts`.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:99:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:19:  status: 'active' | 'needs_full_scan';
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:48:    return { ...DEFAULT_ACTIVE_SCOPE, status: 'needs_full_scan' };
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:55:      return { ...DEFAULT_ACTIVE_SCOPE, status: 'needs_full_scan' };
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:70:    status: values.get('mcp-coco-index') === 'excluded' ? 'active' : 'needs_full_scan',
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:134:    expect(autoYaml).toContain('invoke_code_graph_scan_in_phase_a');
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:136:    expect(confirmYaml).toContain('invoke_code_graph_scan_in_phase_a');
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:203:  it('cg-017 treats v2 activeScope as parseable and v1 scope as a full-scan requirement', () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:218:      status: 'needs_full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:84:    return 'last scan unknown';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:87:  const scanDate = new Date(lastScan);
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:88:  if (Number.isNaN(scanDate.getTime())) {
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:89:    return 'last scan unknown';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:93:  const sameDay = scanDate.getFullYear() === now.getFullYear()
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:94:    && scanDate.getMonth() === now.getMonth()
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:95:    && scanDate.getDate() === now.getDate();
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:97:    return 'scanned today';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:100:  return `last scan ${scanDate.toISOString().slice(0, 10)}`;
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:131:    codeGraphLine = 'empty -- run `code_graph_scan`';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:227:      `Last scan: ${stats.lastScanTimestamp ?? 'unknown'}`,
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:231:        lines.push('Freshness: stale - graph scope changed; run code_graph_scan with incremental:false.');
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:233:        lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts:179:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts:181:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:18:import { handleCodeGraphScan } from '../../code_graph/handlers/scan.js';
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:40:describe('cg-003 — code_graph_scan', () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:90:  it('indexes a 1000+ file tree through the full-scan handler', async () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:111:  it('runs the verifier only for explicit full scans with verify=true', async () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:130:  it('keeps concurrent scans callable against the same graph database', async () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:134:    expect(parsed.blockedReason).toMatch(/run code_graph_scan before detect_changes/i);
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:498:          `Run memory_index_scan with force:true to rebuild FTS5 index.`
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/query-result-adapter.ts:61: * `handlers/scan.ts`, `handlers/status.ts`, and `lib/ensure-ready.ts` instead
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts:4:// Exercises fixture metrics for full-scan-required fallback envelopes.
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts:12:describe('W7 full-scan-required code-graph readiness stress cell', () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts:13:  it('preserves harness metrics for full-scan-required fallback envelopes', async () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts:15:    const testCase = measurement.cases.find((item) => item.caseId === 'w7-code-graph-full-scan-required');
.opencode/skills/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:4:// Dispatch for skill graph MCP tools: scan, query, status, validate.
.opencode/skills/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:18:  'skill_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:58:    case 'skill_graph_scan':
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:185:/** Arguments for memory index scan requests. */
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:59:      query: 'code graph full scan required fallback decision',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:61:      expectedRelevantIds: ['code-graph-full-scan-fallback'],
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:64:        requiredIds: ['code-graph-full-scan-fallback'],
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:156:    query: 'code graph empty readiness full scan fallback',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:167:    id: 'w7-code-graph-full-scan-required',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:168:    query: 'code graph full scan required fallback envelope survives harness',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:171:    expectedRelevantIds: ['code-graph-full-scan-required-fallback'],
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:174:      requiredIds: ['code-graph-full-scan-required-fallback'],
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:176:    notes: 'W7 explicit full-scan-required fallback cell.',
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:552:  // fresh as long as the content hash matches. Avoids gratuitous full-scans
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:900:  // Last scan timestamp
.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:4:// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:40:  'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:57:    case 'memory_index_scan':          return handleMemoryIndexScan(parseArgs<ScanArgs>(validateToolArgs('memory_index_scan', args)));
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:24:export type IndexScopePolicySource = 'default' | 'env' | 'scan-argument';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:60:  return value === 'default' || value === 'env' || value === 'scan-argument';
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:176:    ? 'scan-argument'
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/baseline.vitest.ts:34:      candidate('code-graph-full-scan-fallback', 'Code graph full scan fallback', 'code_graph_query', 1),
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.ts:42:  W7: 'W7 degraded-readiness stress cells should preserve recall, citation-quality, and refusal-survival across stale, empty, full-scan-required, and unavailable graph states.',
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.ts:90:  'w7-code-graph-full-scan-required': {
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.ts:92:      candidate('code-graph-full-scan-required-fallback', 'Full scan required fallback envelope', 'code_graph_query', 1),
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/measurement-fixtures.ts:142:    'w7-code-graph-full-scan-required': BASELINE_CANDIDATES['w7-code-graph-full-scan-required'] ?? {},
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:87:const CONFIG_KEY_LAST_INDEX_SCAN = 'last_index_scan';
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:88:const CONFIG_KEY_SCAN_STARTED_AT = 'scan_started_at';
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:365:function clearStaleScanLease(db: DatabaseLike, now: number, scanStartedAt: number, leaseExpiryMs: number): number {
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:366:  if (scanStartedAt <= 0 || now - scanStartedAt < leaseExpiryMs) {
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:367:    return scanStartedAt;
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:379:  scanStartedAt: number;
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:385: * Acquire the index-scan lease atomically.
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:387: * The lease blocks overlapping scans via `scan_started_at` and preserves
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:388: * cooldown via `last_index_scan`. Stale leases are automatically expired.
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:415:        scanStartedAt: 0,
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:431:      let scanStartedAt = 0;
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:437:          scanStartedAt = parseConfigTimestamp(row.value);
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:441:      scanStartedAt = clearStaleScanLease(db, now, scanStartedAt, leaseExpiryMs);
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:443:      if (scanStartedAt > 0 && now - scanStartedAt < leaseExpiryMs) {
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:444:        const waitSeconds = Math.ceil((leaseExpiryMs - (now - scanStartedAt)) / 1000);
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:450:          scanStartedAt,
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:463:          scanStartedAt,
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:479:        scanStartedAt: now,
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:488:    console.error('[db-state] Error acquiring index scan lease:', message);
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:494:      scanStartedAt: 0,
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:501:/** Complete an index scan and convert active lease to last_index_scan timestamp. */
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:522:    console.error('[db-state] Error completing index scan lease:', message);
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:526:/** Retrieve the timestamp of the last index scan from the config table. */
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:542:    console.error('[db-state] Error getting last scan time:', message);
.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:547:/** Persist the timestamp of the last index scan to the config table. */
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:157:      'Run memory_index_scan with force=true to rebuild index',
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:162:    toolTip: 'memory_index_scan({ force: true })'
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:278:      'If no checkpoint available, rebuild index: memory_index_scan({ force: true })'
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:709:        'Run memory_index_scan() to rebuild if needed',
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:713:      toolTip: 'memory_index_scan()'
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:774:  // Memory_index_scan specific hints
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:775:  memory_index_scan: {
.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:780:        'Re-run scan after configuring embeddings',
.opencode/skills/system-spec-kit/mcp_server/tests/history.vitest.ts:359:      'mcp:memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:537:      name: 'code_graph_scan accepts optional scan controls',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:538:      toolName: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:552:      name: 'code_graph_scan accepts granular skill list selection',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:553:      toolName: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:628:      name: 'code_graph_scan rejects non-boolean includeSkills',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:629:      toolName: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:635:      name: 'code_graph_scan rejects invalid granular skill names',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:636:      toolName: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:642:      name: 'code_graph_scan rejects unexpected parameters',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:643:      toolName: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:715:      name: 'skill_graph_scan accepts optional root override',
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:716:      toolName: 'skill_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:115:    expect(brief.startupSurface).toContain('- Code Graph: empty -- run `code_graph_scan`');
.opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:117:    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'code_graph_verify', 'skill_graph_scan', 'skill_graph_status', 'skill_graph_validate', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
.opencode/skills/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:28:  { tool: 'memory_index_scan', handler: 'handleMemoryIndexScan', layer: 'L7' },
.opencode/skills/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:55:  { camel: 'handleMemoryIndexScan', snake: 'handle_memory_index_scan' },
.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:96:  'memory_index_scan'
.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:461:    recommendedCalls.push('code_graph_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:48:      'Continue validating the scan-originated save guard regression.',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:73:      '- The scan path must bypass the transactional complement recheck.',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:74:      '- The non-scan path must still surface candidate_changed.',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:83:      'session_id: "handler-memory-index-fromscan-guard"',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:88:    contentHash: 'fromscan-guard-fixture',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:410:        'handle_memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:584:  describe('scan-originated save guard regressions', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:585:    it('passes fromScan=true for scan-originated saves so the fake recheck never fires', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:586:      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-scan-serial-'));
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:712:    it('keeps non-scan indexSingleFile calls on the normal path so the guard stays conditional', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:748:      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-real-fromscan-'));
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:783:    it('keeps tenant and session scoped scan-originated saves on the scan-only wrapper path', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:784:      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-real-fromscan-scoped-'));
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:805:            tenantId: 'tenant-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:806:            userId: 'user-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:807:            agentId: 'agent-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:808:            sessionId: 'session-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:823:            tenantId: 'tenant-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:824:            userId: 'user-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:825:            agentId: 'agent-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:826:            sessionId: 'session-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:842:      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-real-nonscan-'));
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:884:    it('keeps the scoped transactional recheck active when scan origin is omitted', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:885:      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-real-nonscan-scoped-'));
.opencode/skills/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:208:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skills/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:221:    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
.opencode/skills/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:222:    expect(parsed.data.nextActions).toContain('Run `code_graph_scan` if the graph needs a broader refresh, then re-run `session_bootstrap`.');
.opencode/skills/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:290: * Does NOT modify the database -- read-only scan.
.opencode/skills/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:295:export function scanForPromotions(db: Database): AutoPromotionResult[] {
.opencode/skills/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:335:    console.error(`[auto-promotion] scanForPromotions failed: ${msg}`);
.opencode/skills/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:31:    action: freshness === 'fresh' ? 'none' : 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:108:  it('returns undefined when freshness === "empty" (no scan has occurred)', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:124:      detectorProvenanceSource: 'last-persisted-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:132:      detectorProvenanceSource: 'last-persisted-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts:188:    expect(block.action).toBe('full_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:538:  it('adds stale indexed rows to toDelete even when missing from scan input', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:557:  symlinkIt('does not mark alias rows as stale when canonical path is still present in scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:681:describe('T106: Failed files retried on next scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:682:  it('T106-01: Successfully indexed file skipped on rescan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:699:  it('T106-02: Failed file marked for reindex on rescan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:12:  scanForPromotions,
.opencode/skills/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:117:  it('scanForPromotions only returns rows that meet positive thresholds', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:123:    const eligible = scanForPromotions(db);
.opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:131: * Avoids full-table scan in queryLearnedTriggers / expireLearnedTerms / clearAll.
.opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:474:    // Ensure partial index exists to avoid full-table scan (A2-P2-4)
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:166:  it('still returns the standard full_scan-required envelope when the probe succeeds with action=full_scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:168:    // non-crash full_scan path. Only crash routes to nextTool='rg'.
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:171:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:185:    expect(parsed.message).toMatch(/code_graph_full_scan_required/);
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:186:    expect(parsed.data?.requiredAction).toBe('code_graph_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:187:    expect(parsed.data?.blockReason).toBe('full_scan_required');
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:189:    expect(fallbackDecision?.nextTool).toBe('code_graph_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:190:    expect(fallbackDecision?.reason).toBe('full_scan_required');
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:233:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:259:    expect(readiness.action).toBe('full_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:6:import { handleSkillGraphScan } from '../handlers/skill-graph/scan.js';
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:19:    sessionId: 'trusted-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:88:  it('preserves the live graph when a custom scan root contains no skills', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:115:        scannedFiles: 0,
.opencode/skills/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:380:    it('quarantines malformed sibling files instead of aborting the whole scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:408:          throw new Error('expected valid sibling to survive poisoned scan');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:251:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:269:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:290:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:2:// Covers: contradiction scan, Hebbian strengthening, staleness
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:8:  scanContradictions,
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:109:/* -- T002a: Contradiction scan -- */
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:111:describe('T002a: Contradiction scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:147:  it('T-N3-06: scanContradictions with heuristic (no vec)', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:152:    const pairs = scanContradictions(db);
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:162:  it('T-N3-07: scanContradictions returns empty on no data', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:166:    const pairs = scanContradictions(db);
.opencode/skills/system-spec-kit/mcp_server/tests/folder-scoring-overflow.vitest.ts:17:  // Put the true maximum timestamp at the tail to ensure full-array scanning.
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:91:  it('reindexSpecDocs runs the standard incremental spec-doc scan with explicit follow-up arguments', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:92:    const scanResponse = {
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:93:      content: [{ type: 'text', text: JSON.stringify({ data: { status: 'indexed', scanned: 2 } }) }],
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:96:    const handleMemoryIndexScan = vi.fn(async () => scanResponse);
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:105:    expect(response).toBe(scanResponse);
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:115:  it('runEnrichmentBackfill enables enrichment during the scan and restores the environment afterwards', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:118:    const scanResponse = {
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:119:      content: [{ type: 'text', text: JSON.stringify({ data: { status: 'indexed', scanned: 1 } }) }],
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:124:      return { ...scanResponse, args };
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:134:    expect(response).toEqual(expect.objectContaining(scanResponse));
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:146:  it('runEnrichmentBackfill restores the environment even when the scan throws', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:149:      throw new Error('scan failed');
.opencode/skills/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:160:    ).rejects.toThrow('scan failed');
.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:663: * fidelity gate.  This is the shared scan used by `loadMostRecentState`; we
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:180:          reason: 'scan_failed',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:190:  it('returns an explicit blocked contract when readiness requires a full scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:193:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:205:    expect(parsed.message).toContain('code_graph_full_scan_required');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:212:      requiredAction: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:279:   4. generateFolderDescriptions — file system scanning
.opencode/skills/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:106:    expect(dryRun.scanned).toBe(3);
.opencode/skills/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts:11:    action: freshness === 'fresh' ? 'none' : 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:100:  it('returns stale status when graph scan is old', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:183:    expect(contract.recommendedAction).toContain('code_graph_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:409:describe('scan handler integration - incremental:false', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:459:  it('passes skipFreshFiles=false for caller-requested full scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:460:    const scanResults = Array.from({ length: 3 }, (_, index) => ({
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:471:    const { indexFilesMock } = setupScanMocks(scanResults);
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:473:    const { handleCodeGraphScan } = await import('../code_graph/handlers/scan.js');
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:485:  it('is idempotent for repeated caller-requested full scans with the same indexer results', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:486:    const scanResults = [
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:499:    const { indexFilesMock } = setupScanMocks(scanResults);
.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:501:    const { handleCodeGraphScan } = await import('../code_graph/handlers/scan.js');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:111:import { handleCodeGraphScan } from '../handlers/scan.js';
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts:274:      name: 'scan',
.opencode/skills/system-spec-kit/mcp_server/tests/modularization.vitest.ts:29:  'handlers/memory-index.js': 700,  // actual: 421 — Index operations with scanning + spec document discovery (Spec 126)
.opencode/skills/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:121:        'database optimization', 'query performance', 'index scanning',
.opencode/skills/system-spec-kit/mcp_server/tests/safety.vitest.ts:163:    it('CHK-116: Successful indexing → mtime marker updated → skipped on next scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/safety.vitest.ts:184:    it('CHK-117: Failed file → mtime NOT updated → retried on next scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/safety.vitest.ts:224:    it('T106-PendingRetry: File with pending embedding → reindex on next scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/safety.vitest.ts:239:    it('T106-FailedRetry: File with failed embedding → reindex on next scan', () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-cross-file-edges.vitest.ts:12:import { handleCodeGraphScan } from '../handlers/scan.js';
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-cross-file-edges.vitest.ts:110:  it('rewrites an imported function call to the exported definition after a full scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-cross-file-edges.vitest.ts:180:  it('is idempotent across repeated full scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-cross-file-edges.vitest.ts:234:  it('resolves getDefaultConfig calls from scan and ensure-ready fixtures', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-cross-file-edges.vitest.ts:244:        'mcp_server/code_graph/handlers/scan.ts',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-cross-file-edges.vitest.ts:277:        'mcp_server/code_graph/handlers/scan.ts',
.opencode/skills/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts:10:import { handleSkillGraphScan } from '../../handlers/skill-graph/scan.js';
.opencode/skills/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts:51:describe('skill_graph_scan caller authority', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts:58:    const root = mkdtempSync(join(tmpdir(), 'skill-graph-scan-auth-'));
.opencode/skills/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts:76:        error: 'skill_graph_scan requires trusted caller context',
.opencode/skills/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts:86:  it('allows trusted callers to scan and publish graph data', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts:87:    const root = mkdtempSync(join(tmpdir(), 'skill-graph-scan-auth-'));
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-diagnostic-redaction.vitest.ts:11:import { handleSkillGraphScan } from '../handlers/skill-graph/scan.js';
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-diagnostic-redaction.vitest.ts:31:  it('redacts absolute workspace paths from scan rejection envelopes', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:196:  it('T025: memory_index_scan has tool-specific hints', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:197:    expect(TOOL_SPECIFIC_HINTS.memory_index_scan).toBeDefined();
.opencode/skills/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:198:    expect(typeof TOOL_SPECIFIC_HINTS.memory_index_scan).toBe('object');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts:126:  it('returns an explicit blocked contract when readiness requires a full scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts:129:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts:145:      requiredAction: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:36:        memory_index_scan: 1000,
.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167:    // Cap rows fetched to avoid full-table scans on large databases.
.opencode/skills/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:430:    it('T501-14a: indexed candidate filtering returns the same matches as a full scan', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:458:    it('T501-14b: candidate index narrows the regex scan workload on large caches', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:185:      'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:190:      'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:196:      'skill_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:304:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:305:      'skill_graph_scan', 'skill_graph_query', 'skill_graph_status', 'skill_graph_validate',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1843:      expect(sourceCode).toContain('Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.')
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1853:        ? `Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1860:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1868:      expect(instructions).toContain('Warning: 12 stale memories detected. Consider running memory_index_scan.')
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1880:          ? `Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1887:          'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2188:    it('T28h: L7 budget = 1000 (memory_index_scan)', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2193:      expect(layerDefs!.getTokenBudget!('memory_index_scan')).toBe(1000)
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2221:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2561:    // T56: Startup scan runs in background
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2562:    it('T56: Startup scan runs via setImmediate', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2567:    it('T57: Startup scan re-entry guard', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2619:      'memory_index_scan': '[L7:Maintenance]',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2706:    // T64: Recovery called during startup scan
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2712:      expect(sourceCode).toMatch(/const\s+scanRoots\s*=\s*Array\.from\(\s*new\s+Set\(\s*\[basePath,\s*\.\.\.ALLOWED_BASE_PATHS\]/)
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2716:      expect(sourceCode).toMatch(/for\s*\(const\s+root\s+of\s+scanRoots\)/)
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2820:        ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2827:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2877:      expect(atBoundary).not.toContain('Consider running memory_index_scan')
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2887:      expect(aboveBoundary).toContain('Consider running memory_index_scan')
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2960:      // Warning text must suggest memory_index_scan
.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2961:      expect(fnBody).toMatch(/memory_index_scan/)
.opencode/skills/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:42:      scannedFiles: 1,
.opencode/skills/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:107:      scannedFiles: 1,
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:199:    it('treats missing stored hashes as stale so the next scan can backfill them', () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:315:        [undefined, true, true, 'all', 'scan-argument'],
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:316:        [undefined, false, false, 'none', 'scan-argument'],
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:319:        ['true', true, true, 'all', 'scan-argument'],
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:320:        ['true', false, false, 'none', 'scan-argument'],
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:354:        source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:365:        source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:399:        expect(perCallConfig.scopePolicy.source).toBe('scan-argument');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:419:      expect(noSkills.scopePolicy.source).toBe('scan-argument');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:462:        source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:498:    it('keeps symlinked skill roots excluded when the scan root is canonicalized first', async () => {
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:191:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:203:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:224:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:283:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:304:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:45:        'index_memory_file_from_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:95:        source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:102:  it('requires an explicit full scan when env drift makes stored and active scope fingerprints differ', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:117:        action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:127:        action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:130:      expect(readiness.reason).toContain('inline full scan skipped for read path');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:136:  it('FIX-009-v3: per-call (scan-argument) stored scope is trusted regardless of env drift', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:137:    // When a scan was run with explicit per-call args, the stored scope is the
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:143:      // Stored scope from explicit per-call args (source='scan-argument'):
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:176:        action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:186:        action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:189:      expect(readiness.reason).toContain('inline full scan skipped for read path');
.opencode/skills/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts:152:describe('structural-indexer scan scope', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts:178:  it('respects .gitignore patterns during recursive scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:21:// BuildHierarchyTree does a full scan of spec_folder values on every call.
.opencode/skills/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:353:  it('T197: find_pending_files() scans recursively', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:354:    setup('T197-recursive-scan');
.opencode/skills/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:54:  scanForPromotions,
.opencode/skills/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:798:  it('R11-AP10: scanForPromotions finds eligible memories', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:803:    const eligible = scanForPromotions(testDb);
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:111:import { handleCodeGraphScan, relativizeScanError } from '../handlers/scan.js';
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:345:  it('passes includeSkills through to the indexer config for one-call opt-in scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:359:          source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:368:      source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:372:  it('lets includeSkills false override an env opt-in for one-call end-user scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:387:          source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:396:      source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:415:          source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:463:            source: 'scan-argument',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:472:  it('reports status activeScope from the stored scan scope after an env override scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:551:    expect(payload.data.activeScope.source).toBe('scan-argument');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:648:  it('returns scan warnings without absolute workspace paths', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:700:  it('optionally runs verification for explicit full scans and attaches the result', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:733:  it('does not run verification for incremental scans even when verify is requested', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:748:  it('reseeds the edge distribution baseline on a full scan when the persisted baseline metadata is malformed', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:788:  it('persists a full-scan edge baseline and surfaces the next drift summary in status', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:862:  it('clears the persisted edge-enrichment summary when a later scan reports no summary', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:918:  it('preserves persisted summaries for no-op incremental scans that skip fresh files before parse', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:952:  it('passes the parser content hash into stale checks during incremental scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:967:  it('removes deleted tracked files during incremental scans', async () => {
.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:559:      logger.info('Migration v5: Type inference backfill will run on next index scan');
.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:506: * Build a reusable row predicate for scope filtering without re-normalizing each row scan.
.opencode/skills/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts:241:    const root = path.join(dir, 'specs', 'pending-scan');
.opencode/skills/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:85:/** Maximum characters to scan from the beginning of content for rule extraction. */
.opencode/skills/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:118:  const scan = content.slice(0, MAX_CONTENT_SCAN_CHARS);
.opencode/skills/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:119:  const lines = scan.split('\n');
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:5:// snapshot (full_scan | selective_reindex | none) WITHOUT mutating the
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:16://   B. Empty graph            → readiness.action = "full_scan"
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:17://   C. Broad stale (>50 files)→ readiness.action = "full_scan"
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:24:type ActionFixture = 'none' | 'full_scan' | 'selective_reindex';
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:144:  // ── B. Empty graph → readiness.action = "full_scan" ───────────
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:145:  it('surfaces readiness.action="full_scan" for an empty graph with descriptive reason (criterion B)', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:148:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:154:    expect(readiness.action).toBe('full_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:157:    // without invoking the mutating `code_graph_scan` to find out.
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:161:  // ── C. Broad stale → readiness.action = "full_scan" ───────────
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:162:  it('surfaces readiness.action="full_scan" for broad stale (>50 files) (criterion C)', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:165:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:171:    expect(readiness.action).toBe('full_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:210:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:227://   3. NO inline indexer / scan entry points were called
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:208:          tenantId: 'tenant-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:209:          userId: 'user-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:210:          agentId: 'agent-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:211:          sessionId: 'session-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:227:          tenantId: 'tenant-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:228:          userId: 'user-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:229:          agentId: 'agent-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:230:          sessionId: 'session-scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-candidate-manifest.vitest.ts:6:// drift) flips freshness to stale + full_scan even if individual mtimes
.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:611: * @param specsBasePaths - Array of absolute directory paths to scan.
.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:699: * @param specsBasePaths - Array of absolute directory paths to scan.
.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1028: * across all base paths using recursive depth-limited scan.
.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1031: * @param basePaths - Spec base directories to scan for spec.md files.
.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:1058: * @param basePaths - Spec base directories to scan.
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:99:      const actions: ReadyAction[] = ['none', 'full_scan', 'selective_reindex'];
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:133:    it('returns refreshed readiness after a successful inline full scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:262:    it('keeps git HEAD drift as full-scan territory when tracked files look up-to-date on disk', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:275:      expect(result.action).toBe('full_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:280:      expect(result.reason).toContain('inline full scan skipped for read path');
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:284:    it('refuses inline full scan for read paths even when inline selective refresh is enabled', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:296:      expect(result.action).toBe('full_scan');
.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:299:      expect(result.reason).toContain('inline full scan skipped for read path');
.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:4:// Dispatch for code graph MCP tools: scan, query, status, context, verify, detect_changes.
.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:22:  'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:63:    case 'code_graph_scan':
.opencode/skills/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:246:    // Gap at index 0 = 0.8, but minResults=3 so we start scanning at index 2
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:953:/* --- 010-CHK-029: Full aggregation scan performance benchmark --- */
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:955:describe('CHK-029: generateFolderDescriptions scan performance', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:960:  it('T046-27: generateFolderDescriptions scan completes in <2s for 500 folders', { timeout: 10000 }, () => {
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:963:    // Create 500 spec folders to exercise the scan path at production scale
.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts:389:  it('downgrades invalid constitutional tier for scan-originated saves too', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:162:    tool: 'memory_index_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:238:            startupHint: 'Resume the active packet before running deeper graph scans.',
.opencode/skills/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:280:        'Resume the active packet before running deeper graph scans.',
.opencode/skills/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:311:      // TODO: subprocess test needs hook-state seeded with lastSpecFolder OR a code_graph_scan
.opencode/skills/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:142:        memory_index_scan: 'L7',
.opencode/skills/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:212:        { tool: 'memory_index_scan', expected: '[L7:Maintenance]' },
.opencode/skills/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:        { tool: 'memory_index_scan', expected: 1000 },
.opencode/skills/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:444:                           'memory_index_scan'];
.opencode/skills/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:134:      detectorProvenanceSource: 'last-persisted-scan',
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:45:  it('acquires scan lease once and rejects a concurrent fresh lease', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:68:  it('expires stale scan lease and allows a fresh reservation', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:72:    db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(staleStartedAt));
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:86:    const startedRow = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string };
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:92:  it('completes lease by moving scan_started_at to last_index_scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:96:    db.prepare('INSERT INTO config (key, value) VALUES (?, ?)').run('scan_started_at', String(startedAt));
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:109:    const lastScan = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan') as { value: string };
.opencode/skills/system-spec-kit/mcp_server/tests/db-state.vitest.ts:110:    const activeLease = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at') as { value: string } | undefined;
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:235: * N3-lite: Consolidation engine — contradiction scan, Hebbian strengthening,
.opencode/skills/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:152:  it('returns null for memory_index_scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:153:    const result = await autoSurfaceAtToolDispatch('memory_index_scan', { specFolder: 'specs/001' });
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:5:  action: 'none' | 'full_scan' | 'selective_reindex';
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:43:    operation: readiness.action === 'full_scan' ? 'calls_from' : 'outline',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:76:  it('routes empty graph reads to code_graph_scan before retrying the query', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:79:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:86:      nextTool: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:87:      reason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:88:      retryAfter: 'scan_complete',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:92:  it('routes stale full-scan states to code_graph_scan before retrying the query', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:95:      action: 'full_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:102:      nextTool: 'code_graph_scan',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:103:      reason: 'full_scan_required',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:104:      retryAfter: 'scan_complete',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:132:  it('routes readiness errors to rg after scan diagnostics fail', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:158:      reason: 'scan_failed',
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:162:  it('preserves the read-path full-scan boundary', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:44:    expect(TOOL_NAMES.has('skill_graph_scan')).toBe(true);
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:53:  it('routes skill_graph_scan to handleSkillGraphScan', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:54:    const result = await handleTool('skill_graph_scan', {});
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:119:    const scanResult = await handleTool('skill_graph_scan', {});
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:123:    for (const result of [scanResult, statusResult, validateResult]) {
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:133:  it('skill_graph_scan passes skillsRoot to handler', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:134:    await handleTool('skill_graph_scan', { skillsRoot: '/custom/path' });
.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:30:  // Default: graph is fresh, no inline scan
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:137:      scanStartedAt: 0,
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:181:      scanStartedAt: 0,
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:197:  it('sets cooldown timestamp after successful scan response', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:229:    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:261:    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:273:  it('tracks stale delete failures without aborting scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:296:    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', {
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:304:  it('defers stale deletion when replacement indexing fails in the same scan', async () => {
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:492: * SQL shape intentionally restricts edge scan to candidate-adjacent rows:
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:4:// Lightweight graph maintenance: contradiction scan, Hebbian
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:88:export function scanContradictions(
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:99:      pairs.push(...scanContradictionsVector(database));
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:101:      pairs.push(...scanContradictionsHeuristic(database));
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:105:    console.warn(`[consolidation] scanContradictions error: ${msg}`);
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:123: * Vector-based contradiction scan using sqlite-vec cosine similarity.
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:125:function scanContradictionsVector(
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:148:  // O(n^2) pairwise scan capped at 500 memories (up to 124,750 pairs).
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:157:        console.warn('[consolidation] Contradiction scan timed out after 5s');
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:185: * Heuristic-only contradiction scan when vector similarity is unavailable.
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:188:function scanContradictionsHeuristic(
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:208:  // Same 5-second timeout guard as the vector-based scan to prevent
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:216:        console.warn('[consolidation] Contradiction scan (heuristic) timed out after 5s');
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:431: * 1. Contradiction scan
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:439:  // T002a + T002e: Contradiction scan + cluster surfacing
.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:440:  const contradictionPairs = scanContradictions(database);
.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:263:  // Without this pass, removed files never enter toDelete during normal scans
.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:280:function listStaleIndexedPaths(scannedFilePaths: string[]): string[] {
.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:283:  const scannedCanonicalPaths = new Set(scannedFilePaths.map((filePath) => getCanonicalPathKey(filePath)));
.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:308:      if (scannedCanonicalPaths.has(rowCanonicalPath)) {
.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:260:const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';
.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:294:  // Use COUNT(*) with json_extract to filter by path in SQL rather than scanning
.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:295:  // All decision_meta rows in application code (O(1) vs O(n) full-table scan).
.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:313:  // Use COUNT(*) with json_extract to avoid O(n) full-table scan in application code.
.opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:144:  scanned: number;
.opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1060: * @returns Backfill summary including scanned and seeded rows.
.opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1126:      scanned: rows.length,
.opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1205:    scanned: rows.length,
.opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1317: * @returns Backfill summary including scanned and seeded rows.

```