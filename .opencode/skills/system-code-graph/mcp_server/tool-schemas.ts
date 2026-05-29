// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tool Schemas
// ───────────────────────────────────────────────────────────────
// Standalone mk-code-index MCP server owns these schemas.

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

const codeGraphScan: ToolDefinition = {
  name: 'code_graph_scan',
  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      rootDir: { type: 'string', description: 'Root directory to scan (default: workspace root)' },
      includeGlobs: { type: 'array', items: { type: 'string' }, description: 'Glob patterns for files to include' },
      excludeGlobs: { type: 'array', items: { type: 'string' }, description: 'Additional glob patterns to exclude' },
      incremental: { type: 'boolean', default: true, description: 'Skip unchanged files (default: true)' },
      includeSkills: {
        oneOf: [
          { type: 'boolean' },
          { type: 'array', items: { type: 'string', pattern: '^sk-[a-z0-9-]+$' } },
        ],
        default: false,
        description: 'Include all .opencode/skills files with true, or only named sk-* skills with an array; default false keeps end-user code scope',
      },
      includeAgents: { type: 'boolean', default: false, description: 'Include .opencode/agent files in this scan; default false keeps end-user code scope' },
      includeCommands: { type: 'boolean', default: false, description: 'Include .opencode/command files in this scan; default false keeps end-user code scope' },
      includeSpecs: { type: 'boolean', default: false, description: 'Include .opencode/specs files in this scan; default false keeps end-user code scope' },
      includePlugins: { type: 'boolean', default: false, description: 'Include .opencode/plugins files in this scan; default false keeps end-user code scope' },
      verify: { type: 'boolean', default: false, description: 'Run the gold-query verification battery after an explicit full scan (default: false)' },
      persistBaseline: { type: 'boolean', default: false, description: 'Persist the current edge-distribution baseline after a full scan even when one already exists' },
      forceZeroNodeReset: { type: 'boolean', default: false, description: 'Allow an explicit destructive reset when a full scan produces zero indexed nodes over a populated graph' },
      forceScopeChange: { type: 'boolean', default: false, description: 'Allow replacing a populated code graph with a full scan from a different scope fingerprint' },
    },
    required: [],
  },
};


const codeGraphQuery: ToolDefinition = {
  name: 'code_graph_query',
  description: '[L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph), and blast_radius (reverse import impact). Use INSTEAD of Grep for structural queries (callers, imports, dependencies). Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      operation: { type: 'string', enum: ['outline', 'calls_from', 'calls_to', 'imports_from', 'imports_to', 'blast_radius'], description: 'Query operation (required)' },
      subject: { type: 'string', minLength: 1, description: 'File path, symbol name, or symbolId to query (required)' },
      subjects: { type: 'array', items: { type: 'string' }, description: 'Optional additional file paths or symbols for blast-radius union mode' },
      unionMode: { type: 'string', enum: ['single', 'multi'], description: 'Blast-radius subject handling mode; use multi to union subject + subjects' },
      edgeType: { type: 'string', description: 'Filter by edge type (optional)' },
      limit: { type: 'number', minimum: 1, maximum: 1000, default: 50, description: 'Max results (handler clamps to 1000)' },
      includeTransitive: { type: 'boolean', default: false, description: 'Enable multi-hop BFS traversal (follows edges transitively)' },
      maxDepth: { type: 'number', minimum: 1, maximum: 20, default: 3, description: 'Max traversal depth when includeTransitive is true (handler clamps to 20)' },
      minConfidence: { type: 'number', minimum: 0, maximum: 1, description: 'Minimum confidence threshold (0-1) for blast_radius dependency edges; defaults to 0 (include all). Filters import-edge confidences before blast-radius assembly.' },
    },
    required: ['operation', 'subject'],
  },
};


const codeGraphStatus: ToolDefinition = {
  name: 'code_graph_status',
  description: '[L7:Maintenance] Report code graph index health. Returns totalFiles, totalNodes, totalEdges, freshness, readiness, canonicalReadiness, trustState, lastScanAt, lastPersistedAt, lastGitHead, dbFileSize, schemaVersion, nodesByKind, edgesByType, parseHealth, and graphQualitySummary. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};


const codeGraphContext: ToolDefinition = {
  name: 'code_graph_context',
  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods from manual or graph seeds. Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). When readiness requires a full scan, returns an explicit blocked payload with requiredAction `code_graph_scan`, readiness metadata, and lastPersistedAt instead of degraded graph answers. Successful responses include metadata.partialOutput for deadline/budget truncation details (reasons, omittedSections, omittedAnchors, truncatedText). Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      input: { type: 'string', description: 'Natural language context query' },
      queryMode: { type: 'string', enum: ['neighborhood', 'outline', 'impact'], default: 'neighborhood', description: 'Graph expansion mode' },
      subject: { type: 'string', description: 'Symbol name, fqName, or symbolId' },
      seeds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filePath: { type: 'string' },
            startLine: { type: 'number' },
            endLine: { type: 'number' },
            query: { type: 'string' },
            provider: { type: 'string', enum: ['manual', 'graph'], description: 'Seed provider type' },
            source: { type: 'string', description: 'Optional provenance label surfaced on resolved anchors' },
            symbolName: { type: 'string', description: 'Manual seed symbol name' },
            kind: { type: 'string', description: 'Manual seed kind metadata' },
            nodeId: { type: 'string', description: 'Graph seed node identifier' },
            symbolId: { type: 'string', description: 'Graph seed symbol ID' },
          },
        },
        description: 'Seeds from manual input or graph lookups',
      },
      budgetTokens: { type: 'number', minimum: 100, maximum: 4000, default: 1200, description: 'Token budget for response' },
      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
      includeTrace: { type: 'boolean', description: 'Include trace metadata in response for debugging' },
    },
    required: [],
  },
};


const codeGraphClassifyQueryIntent: ToolDefinition = {
  name: 'code_graph_classify_query_intent',
  description: 'Classify a natural-language query for structural code-graph routing. Token Budget: 300.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      query: { type: 'string', minLength: 1, description: 'Natural-language query to classify' },
    },
    required: ['query'],
  },
};


const codeGraphVerify: ToolDefinition = {
  name: 'code_graph_verify',
  description: '[L7:Maintenance] Execute the persisted code-graph gold-query battery against the current index. Returns blocked when readiness is not fresh, supports category filtering, optional per-query details, fail-fast mode, and optional baseline persistence. Token Budget: 1000.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      rootDir: { type: 'string', description: 'Root directory for readiness checks (default: workspace root)' },
      batteryPath: { type: 'string', description: 'Optional path to a gold-query battery JSON file' },
      category: {
        type: 'string',
        enum: ['mcp-tool', 'cross-module', 'exported-type', 'regression-detection'],
        description: 'Optional category filter for the verification battery',
      },
      failFast: { type: 'boolean', description: 'Stop on first failing verification query' },
      includeDetails: { type: 'boolean', description: 'Include per-query verification details in the result payload' },
      persistBaseline: { type: 'boolean', description: 'Persist the verification result as the latest stored baseline' },
      allowInlineIndex: { type: 'boolean', description: 'Allow readiness checks to perform inline indexing before verification' },
    },
    required: [],
  },
};


const codeGraphApply: ToolDefinition = {
  name: 'code_graph_apply',
  description: '[L8:Code Graph] Verification-gated apply-mode for code graph recovery. Runs the gold-query battery before and after typed recovery operations, enforces soft-stale self-healing boundaries, writes JSONL audit logs, and rolls back bad applies. Token Budget: 1000.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      rootDir: { type: 'string', description: 'Workspace root (default: current working directory)' },
      operation: {
        type: 'string',
        enum: ['rescan', 'prune-excludes', 'repair-nodes', 'recover-sqlite-corruption', 'rollback-bad-apply'],
        description: 'Apply operation to run. Defaults to re-scan routing based on staleness state.',
      },
      confirm: { type: 'boolean', description: 'Required for hard-stale recovery before any mutation.' },
      dryRun: { type: 'boolean', description: 'Run pre/post batteries and classification, but skip operation dispatch.' },
      crashRootCauseAddressed: { type: 'boolean', description: 'Required true before repair-nodes re-parses parser_skip_list candidates.' },
      quarantineOlderThanDays: { type: 'number', minimum: 1, maximum: 365, description: 'Minimum parser_skip_list age for repair-nodes eligibility.' },
      lowTierOptIn: { type: 'boolean', description: 'Required to include low-tier exclude-rule patterns.' },
      excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Candidate exclude patterns for prune-excludes classification.' },
      batteryPath: { type: 'string', description: 'Optional gold-query battery path under approved asset roots.' },
      includeDetails: { type: 'boolean', description: 'Include per-query battery details in apply response.' },
    },
    required: [],
  },
};


const detectChanges: ToolDefinition = {
  name: 'detect_changes',
  description: '[L6:Analysis] Read-only preflight: maps a unified-diff input to the structural symbols it touches via line-range overlap against indexed code_nodes. Refuses to answer when graph readiness is anything other than "fresh" — returns status: "blocked" instead of a false-safe empty affectedSymbols[]. Use BEFORE acting on a diff so callers see hard refuse on stale/empty/error state. Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      diff: { type: 'string', minLength: 1, description: 'Unified-diff text (e.g. `git diff` output) to map onto indexed symbols' },
      rootDir: { type: 'string', description: 'Workspace root (default: process.cwd()). Must resolve under the workspace; symlinks are canonicalized via realpathSync.' },
    },
    required: ['diff'],
  },
};


export const CODE_GRAPH_TOOL_SCHEMAS: ToolDefinition[] = [
  codeGraphScan,
  codeGraphQuery,
  codeGraphStatus,
  codeGraphContext,
  codeGraphClassifyQueryIntent,
  codeGraphVerify,
  codeGraphApply,
  detectChanges,
];

// Compatibility alias for moved tests and local schema smoke checks.
export const TOOL_DEFINITIONS = CODE_GRAPH_TOOL_SCHEMAS;

/**
 * Validate raw MCP input against a tool's published inputSchema (BUG-04 fix).
 *
 * Previously this only checked tool existence and object-shape, so the
 * advertised `additionalProperties:false`, `enum`, and `minLength` constraints
 * were never enforced and malformed calls reached handlers. We now enforce the
 * unambiguous constraints: unknown-key rejection, enum membership, and string
 * minLength. Required-field presence is enforced at the dispatcher
 * (`getMissingRequiredStringArgs`); numeric range is intentionally left to the
 * handler clamps (e.g. `limit`, `maxDepth`) to avoid rejecting values the
 * handler safely coerces and bounds. Throws a field-specific Error on the first
 * violation so the dispatcher can surface a structured validation error.
 */
export function validateToolArgs(toolName: string, rawInput: Record<string, unknown>): Record<string, unknown> {
  const tool = CODE_GRAPH_TOOL_SCHEMAS.find((definition) => definition.name === toolName);
  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  if (!rawInput || typeof rawInput !== 'object' || Array.isArray(rawInput)) {
    throw new Error(`Invalid arguments for ${toolName}: expected object`);
  }

  const schema = tool.inputSchema as {
    properties?: Record<string, Record<string, unknown>>;
    additionalProperties?: boolean;
  };
  const properties = schema.properties ?? {};

  // additionalProperties:false -> reject keys not in the published schema.
  if (schema.additionalProperties === false) {
    const allowed = new Set(Object.keys(properties));
    const unexpected = Object.keys(rawInput).filter((key) => !allowed.has(key));
    if (unexpected.length > 0) {
      throw new Error(
        `Invalid arguments for ${toolName}: unexpected propert${unexpected.length === 1 ? 'y' : 'ies'}: ${unexpected.join(', ')}`,
      );
    }
  }

  // Validate each PRESENT value: enum membership and string minLength only.
  for (const [key, value] of Object.entries(rawInput)) {
    const prop = properties[key];
    if (!prop || value === undefined || value === null) {
      continue;
    }
    const enumValues = prop.enum as unknown[] | undefined;
    if (Array.isArray(enumValues) && !enumValues.includes(value)) {
      throw new Error(
        `Invalid arguments for ${toolName}: field '${key}' must be one of: ${enumValues.map(String).join(', ')}`,
      );
    }
    const minLength = prop.minLength as number | undefined;
    if (typeof minLength === 'number' && typeof value === 'string' && value.length < minLength) {
      throw new Error(
        `Invalid arguments for ${toolName}: field '${key}' must be at least ${minLength} character(s)`,
      );
    }
  }

  return rawInput;
}
