// ───────────────────────────────────────────────────────────────────
// MODULE: Code Graph Boundary Contracts
// ───────────────────────────────────────────────────────────────────

// Neutral contracts shared by system-spec-kit and system-code-graph.
// This file intentionally contains no imports from either package.
// ---------------------------------------------------------------

export type GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';
export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
export type StructuralReadiness = 'ready' | 'stale' | 'missing';

export interface ReadinessScopeDiagnostic {
  readonly fingerprint: string | null;
  readonly label: string | null;
  readonly source: string | null;
}

export interface GraphReadinessSnapshot {
  freshness: GraphFreshness;
  action: ReadyAction;
  files?: string[];
  inlineIndexPerformed?: boolean;
  reason: string;
  activeScope?: ReadinessScopeDiagnostic;
  storedScope?: ReadinessScopeDiagnostic;
  manifestCount?: number | null;
  manifestDigest?: string | null;
  parseErrorBacklog?: number;
  autoRescanSafety?: 'allowed' | 'blocked';
  autoRescanBlockReason?: string;
  selfHealAttempted?: boolean;
  selfHealResult?: 'ok' | 'failed' | 'skipped';
  verificationGate?: 'pass' | 'fail' | 'absent';
  lastSelfHealAt?: string;
}

export interface CodeGraphStatsSnapshot {
  totalFiles: number;
  totalNodes: number;
  totalEdges: number;
  nodesByKind: Record<string, number>;
  edgesByType: Record<string, number>;
  parseHealthSummary: Record<string, number>;
  lastScanTimestamp: string | null;
  lastGitHead?: string | null;
  dbFileSize: number | null;
  schemaVersion: number;
  graphQualitySummary?: Record<string, unknown> | null;
}

export interface StartupGraphSummary {
  files: number;
  nodes: number;
  edges: number;
  lastScan: string | null;
}

export interface StartupGraphQualitySummary {
  detectorProvenanceSummary: {
    dominant: string;
    counts: Record<string, number>;
  } | null;
  graphEdgeEnrichmentSummary: {
    edgeEvidenceClass: string;
    numericConfidence: number;
  } | null;
}

export interface StartupBriefResult {
  graphOutline: string | null;
  sessionContinuity: string | null;
  graphSummary: StartupGraphSummary | null;
  graphQualitySummary: StartupGraphQualitySummary | null;
  graphState: 'ready' | 'stale' | 'empty' | 'missing';
  graphTrustState?: string;
  startupSurface: string;
  sharedPayload: unknown | null;
  sharedPayloadTransport: string | null;
}

export interface CodeGraphReadinessMarker {
  schemaVersion: 1;
  generatedAt: string;
  producer: 'mk-code-index';
  workspaceRoot: string;
  graphFreshness: GraphFreshness;
  graphState: 'ready' | 'stale' | 'empty' | 'missing';
  readiness: GraphReadinessSnapshot;
  stats: CodeGraphStatsSnapshot | null;
  startup: StartupBriefResult;
  error?: string;
}

export interface MetadataOnlyPreview {
  mode: 'metadata-only';
  path: string;
  fileName: string;
  kind: 'text' | 'binary' | 'unknown';
  sizeBytes: number | null;
  mimeType: string | null;
  lastModified: string | null;
  rawContentIncluded: false;
}

export interface CodeGraphOpsContract {
  readiness: {
    canonical: StructuralReadiness;
    graphFreshness: GraphFreshness;
    sourceSurface: string;
    summary: string;
    recommendedAction: string;
  };
  doctor: {
    supported: true;
    surface: 'memory_health';
    checks: string[];
    repairModes: string[];
    recommendedAction: string;
  };
  exportImport: {
    rawDbDumpAllowed: false;
    portableIdentityRequired: true;
    postImportRepairRequired: true;
    workspaceBoundRelativePaths: true;
    absolutePaths: 'allowed-for-import-only';
    recommendedAction: string;
  };
  previewPolicy: {
    mode: 'metadata-only';
    rawBinaryAllowed: false;
    recommendedFields: string[];
    recommendedAction: string;
  };
}

export function normalizeStructuralReadiness(graphFreshness: GraphFreshness): StructuralReadiness {
  if (graphFreshness === 'fresh') {
    return 'ready';
  }
  if (graphFreshness === 'stale') {
    return 'stale';
  }
  return 'missing';
}

export function buildCodeGraphOpsContract(args: {
  graphFreshness: GraphFreshness;
  sourceSurface: string;
}): CodeGraphOpsContract {
  const canonical = normalizeStructuralReadiness(args.graphFreshness);
  const readinessSummary = canonical === 'ready'
    ? 'Code graph readiness is unified and structurally usable.'
    : canonical === 'stale'
      ? 'Code graph exists but needs refresh before structural trust is high.'
      : 'Code graph is missing or unusable; fallback and repair flows should be used.';
  const readinessAction = canonical === 'ready'
    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
    : canonical === 'stale'
      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';

  return {
    readiness: {
      canonical,
      graphFreshness: args.graphFreshness,
      sourceSurface: args.sourceSurface,
      summary: readinessSummary,
      recommendedAction: readinessAction,
    },
    doctor: {
      supported: true,
      surface: 'memory_health',
      checks: [
        'fts_consistency',
        'trigger_cache_refresh',
        'orphan_edges',
        'orphan_vectors',
        'orphan_chunks',
      ],
      repairModes: [
        'confirmation-gated autoRepair',
        'best-effort partial success reporting',
      ],
      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
    },
    exportImport: {
      rawDbDumpAllowed: false,
      portableIdentityRequired: true,
      postImportRepairRequired: true,
      workspaceBoundRelativePaths: true,
      absolutePaths: 'allowed-for-import-only',
      recommendedAction: 'Treat export/import as a portable identity flow with post-import repair, never as a raw DB dump.',
    },
    previewPolicy: {
      mode: 'metadata-only',
      rawBinaryAllowed: false,
      recommendedFields: ['path', 'fileName', 'kind', 'sizeBytes', 'mimeType', 'lastModified'],
      recommendedAction: 'Expose metadata-only previews for non-text artifacts and avoid raw binary content in runtime context surfaces.',
    },
  };
}

export function createMetadataOnlyPreview(input: {
  path: string;
  sizeBytes?: number | null;
  mimeType?: string | null;
  lastModified?: string | null;
}): MetadataOnlyPreview {
  const normalizedPath = input.path.replace(/\\/g, '/');
  const fileName = normalizedPath.split('/').filter(Boolean).pop() ?? normalizedPath;
  const kind = input.mimeType?.startsWith('text/')
    ? 'text'
    : input.mimeType
      ? 'binary'
      : 'unknown';

  return {
    mode: 'metadata-only',
    path: normalizedPath,
    fileName,
    kind,
    sizeBytes: input.sizeBytes ?? null,
    mimeType: input.mimeType ?? null,
    lastModified: input.lastModified ?? null,
    rawContentIncluded: false,
  };
}
