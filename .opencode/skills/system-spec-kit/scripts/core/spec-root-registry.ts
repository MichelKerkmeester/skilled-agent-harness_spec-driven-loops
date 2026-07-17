// -------------------------------------------------------------------
// MODULE: Spec Root Registry
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// 1. TYPE DEFINITIONS
// -------------------------------------------------------------------

/** Supported resolution precedence contracts. */
export type SpecRootPrecedence =
  | 'legacy-first'
  | 'canonical-first'
  | 'canonical-only'
  | 'direct-path-first'
  | 'membership-only';

/** Maintained metadata for one grouped spec-root resolver call site. */
export interface SpecRootResolverEntry {
  readonly file: string;
  readonly symbol: string;
  readonly consumerOrEffect: string;
  readonly precedence: SpecRootPrecedence;
}

// -------------------------------------------------------------------
// 2. RESOLVER INVENTORY
// -------------------------------------------------------------------

/** Complete maintained inventory of known spec-root resolution call sites. */
export const SPEC_ROOT_RESOLVERS = [
  {
    file: 'scripts/core/config.ts:321-360',
    symbol: 'getSpecsDirectories / findActiveSpecsDir / getAllExistingSpecsDirs',
    consumerOrEffect:
      'Active root selection and existing-root enumeration; aliases retain their first spelling.',
    precedence: 'legacy-first',
  },
  {
    file: 'scripts/core/subfolder-utils.ts:39-58,129-149',
    symbol: 'findChildFolderSync / findChildFolderAsync',
    consumerOrEffect: 'Synchronous and asynchronous recursive packet lookup with realpath deduplication.',
    precedence: 'legacy-first',
  },
  {
    file: 'scripts/spec-folder/folder-detector.ts:181-186,1121-1139',
    symbol: 'isUnderApprovedSpecsRoots / detectSpecFolder',
    consumerOrEffect: 'Containment accepts both roots; explicit roots are preserved before bare-name lookup.',
    precedence: 'direct-path-first',
  },
  {
    file: 'scripts/memory/generate-context.ts:193-230,269-380,531-549,785-799',
    symbol:
      'isUnderApprovedSpecsRoot / resolveCliSpecFolderReference / resolveExistingSpecFolderPath / '
      + 'getPacketIdFromGraphMetadata / validateArguments',
    consumerOrEffect:
      'Save validation, lookup, packet identity, and diagnostics use exact paths before root search.',
    precedence: 'direct-path-first',
  },
  {
    file: 'scripts/extractors/collect-session-data.ts:1063-1093,1193-1220,1437-1469',
    symbol: 'resolveProvidedSpecFolder / resolveSpecFolderRelative / collectSessionData',
    consumerOrEffect: 'Session packet and related-document resolution retain a matched explicit root.',
    precedence: 'direct-path-first',
  },
  {
    file: 'scripts/core/workflow.ts:1016-1043,1663-1687',
    symbol: 'runWorkflow',
    consumerOrEffect: 'Root-relative identity and description regeneration retain the detected absolute target.',
    precedence: 'direct-path-first',
  },
  {
    file: 'scripts/spec-folder/directory-setup.ts:22-80',
    symbol: 'ensureSpecFolderExists',
    consumerOrEffect:
      'Write-boundary validation accepts either approved root; active-root order affects diagnostics only.',
    precedence: 'membership-only',
  },
  {
    file: 'scripts/spec-folder/nested-changelog.ts:589',
    symbol: 'ensureApprovedSpecFolder',
    consumerOrEffect:
      'Changelog write-boundary validation accepts either approved root without selecting a target.',
    precedence: 'membership-only',
  },
  {
    file: 'mcp_server/handlers/memory-index-discovery.ts:203-223,308-382',
    symbol: 'findSpecDocuments / findGraphMetadataFiles',
    consumerOrEffect: 'Spec-document and graph-metadata discovery use legacy only when canonical is absent.',
    precedence: 'canonical-first',
  },
  {
    file: 'shared/gate-3-classifier.ts:125-137,348-418',
    symbol:
      'SPEC_ROOTS / findWorkspaceRoot / getSpecRoots / collectSpecFolderCandidates',
    consumerOrEffect: 'Workspace root discovery and candidate binding enumerate canonical before legacy.',
    precedence: 'canonical-first',
  },
  {
    file: 'scripts/spec/create.sh:811-819',
    symbol: 'SPECS_DIR selection',
    consumerOrEffect: 'Packet creation uses the requested tracked or untracked destination directly.',
    precedence: 'direct-path-first',
  },
  {
    file: 'scripts/graph/migrate-generated-json.ts:149-170,590-598',
    symbol: 'resolveRepoRoot / parseArgs',
    consumerOrEffect: 'Graph metadata migration defaults directly to the canonical root.',
    precedence: 'canonical-only',
  },
  {
    file: 'scripts/graph/backfill-graph-metadata.ts:238-259,278-319',
    symbol: 'resolveRepoRoot / resolveScopedTarget / planBackfill',
    consumerOrEffect: 'Graph metadata backfill defaults directly to the canonical root.',
    precedence: 'canonical-only',
  },
  {
    file: 'mcp_server/startup-checks.ts:261-292',
    symbol: 'resolveWorkspaceSpecPath / resolveMovedFolder',
    consumerOrEffect: 'Startup drift-marker containment accepts only paths under the canonical root.',
    precedence: 'canonical-only',
  },
  {
    file: 'mcp_server/context-server.ts:1602-1627',
    symbol: 'getPendingRecoveryLocations',
    consumerOrEffect: 'Startup pending-recovery scans the legacy root before the canonical root.',
    precedence: 'legacy-first',
  },
  {
    file: 'mcp_server/lib/search/folder-discovery.ts:1363-1379',
    symbol: 'getSpecsBasePaths',
    consumerOrEffect:
      'Generic MCP spec-base discovery enumerates the legacy root before the canonical root.',
    precedence: 'legacy-first',
  },
  {
    file: 'mcp_server/lib/resume/resume-ladder.ts:863-910',
    symbol: 'resolveFromFolderPath / resolveSpecFolder',
    consumerOrEffect:
      'Resume packet resolution checks canonical before legacy while preserving absolute input.',
    precedence: 'canonical-first',
  },
  {
    file: 'mcp_server/lib/continuity/authored-continuity-snapshot.ts:50-70',
    symbol: 'normalizeSpecFolder / resolveSpecFolderPath',
    consumerOrEffect: 'Authored continuity resolution checks canonical before legacy.',
    precedence: 'canonical-first',
  },
  {
    file: 'mcp_server/api/indexing.ts:68-92',
    symbol: 'resolveSpecFolderPath',
    consumerOrEffect:
      'Indexing resolves existing direct paths, discovery, canonical fallback, then legacy fallback.',
    precedence: 'direct-path-first',
  },
  {
    file: 'scripts/utils/spec-affinity.ts:153-174',
    symbol: 'resolveSpecFolderPathCandidates',
    consumerOrEffect:
      'Spec-affinity candidates preserve direct forms before legacy and canonical root candidates.',
    precedence: 'direct-path-first',
  },
  {
    file: 'scripts/lib/validate-memory-quality.ts:619-651',
    symbol: 'resolveSpecFolderPath',
    consumerOrEffect:
      'Memory-quality resolution checks a direct candidate before legacy and canonical at each ancestor.',
    precedence: 'direct-path-first',
  },
] as const satisfies readonly SpecRootResolverEntry[];

// -------------------------------------------------------------------
// 3. COVERAGE AUDIT
// -------------------------------------------------------------------

const REQUIRED_REGISTRY_FIELDS = [
  'file',
  'symbol',
  'consumerOrEffect',
  'precedence',
] as const satisfies readonly (keyof SpecRootResolverEntry)[];

/** Return stable field paths for incomplete registry entries. */
export function registryCoverageGaps(): string[] {
  return SPEC_ROOT_RESOLVERS.flatMap((entry, index) =>
    REQUIRED_REGISTRY_FIELDS
      .filter((field) => entry[field].trim().length === 0)
      .map((field) => `SPEC_ROOT_RESOLVERS[${index}].${field}`),
  );
}
