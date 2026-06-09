// ---------------------------------------------------------------
// MODULE: Skill Advisor CLI Manifest
// ---------------------------------------------------------------

import type { ToolDefinition } from './tools/types.js';

export interface SkillAdvisorCliToolDefinition extends ToolDefinition {
  readonly command: string;
  readonly kebabCommand: string;
  readonly camelCommand: string;
  readonly aliases: readonly string[];
}

function toCamelCommand(name: string): string {
  return name.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

function toKebabCommand(name: string): string {
  return name.replace(/_/g, '-');
}

const SKILL_ADVISOR_TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  {
    name: 'advisor_recommend',
    description: '[L8:Skill Advisor] Recommend skills for a prompt using the native TypeScript advisor scorer. Returns prompt-safe recommendations, lane attribution, lifecycle redirect metadata, cache state, and freshness trust. Raw prompts are never echoed.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        prompt: { type: 'string', minLength: 1, maxLength: 10_000, description: 'Prompt to route through the native skill advisor. The prompt is HMAC-keyed for cache lookup and is not returned.' },
        options: {
          type: 'object',
          additionalProperties: false,
          properties: {
            topK: { type: 'number', minimum: 1, maximum: 10, description: 'Maximum number of recommendations to return.' },
            includeAttribution: { type: 'boolean', description: 'Include per-lane score breakdown and evidence snippets.' },
            includeAbstainReasons: { type: 'boolean', description: 'Include prompt-safe abstain reasons when no recommendation passes thresholds.' },
          },
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'advisor_rebuild',
    description: '[L8:Skill Advisor] Explicitly rebuild the native advisor skill graph from checked-in skill metadata. Use when advisor_status reports stale, absent, or unavailable; pass force:true to rebuild even when status is live.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        force: { type: 'boolean', default: false, description: 'Rebuild even when advisor_status reports live.' },
        workspaceRoot: { type: 'string', description: 'Optional workspace root to rebuild. Use the same workspaceRoot inspected by advisor_status.' },
      },
    },
  },
  {
    name: 'advisor_status',
    description: '[L8:Skill Advisor] Report native advisor freshness, skill-graph generation, trust state, lane weights, and daemon availability without exposing prompt content.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        workspaceRoot: { type: 'string', minLength: 1, description: 'Workspace root used to locate skill graph generation and daemon freshness state.' },
      },
      required: ['workspaceRoot'],
    },
  },
  {
    name: 'advisor_validate',
    description: '[L8:Skill Advisor] Run the native advisor regression bundle and return prompt-safe corpus, holdout, parity, safety, and latency slices. Requires confirmHeavyRun=true because this executes heavier validation work. Accepts an optional skillSlug filter; null or omitted validates all skills.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        confirmHeavyRun: { type: 'boolean', const: true, description: 'Required acknowledgement that this call runs the heavier advisor validation bundle.' },
        skillSlug: { type: ['string', 'null'], minLength: 1, description: 'Optional skill slug to validate; null or omitted validates all skills.' },
      },
      required: ['confirmHeavyRun'],
    },
  },
  {
    name: 'skill_graph_scan',
    description: '[L7:Maintenance] Index or re-index all .opencode/skills/*/graph-metadata.json files into skill-graph.sqlite using the hash-aware SQLite indexer. Token Budget: 800.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        skillsRoot: { type: 'string', description: 'Optional skills root to scan (default: .opencode/skills). Must resolve to a path under the current workspace; paths escaping the workspace are rejected.' },
      },
      required: [],
    },
  },
  {
    name: 'skill_graph_query',
    description: '[L6:Analysis] Query the SQLite-backed skill graph using structural relationship traversals. Supports depends_on, dependents, enhances, enhanced_by, family_members, conflicts, transitive_path, hub_skills, orphans, and subgraph. Token Budget: 1000.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        queryType: { type: 'string', enum: ['depends_on', 'dependents', 'enhances', 'enhanced_by', 'family_members', 'conflicts', 'transitive_path', 'hub_skills', 'orphans', 'subgraph'], description: 'Query type to execute (required)' },
        skillId: { type: 'string', description: 'Skill identifier for single-skill queries' },
        sourceSkillId: { type: 'string', description: 'Source skill identifier for transitive_path' },
        targetSkillId: { type: 'string', description: 'Target skill identifier for transitive_path' },
        family: { type: 'string', enum: ['cli', 'mcp', 'sk-code', 'deep-loop', 'sk-util', 'system'], description: 'Family name for family_members query' },
        minInbound: { type: 'number', minimum: 0, maximum: 200, default: 2, description: 'Minimum inbound edge count for hub_skills query' },
        depth: { type: 'number', minimum: 1, maximum: 10, default: 2, description: 'Traversal depth for subgraph query' },
        limit: { type: 'number', minimum: 1, maximum: 200, default: 50, description: 'Maximum results to return for list queries' },
      },
      required: ['queryType'],
    },
  },
  {
    name: 'skill_graph_status',
    description: '[L7:Maintenance] Report skill graph health. Returns totalSkills, totalEdges, lastIndexedAt, families, categories, schemaVersions, staleness, validation, and dbStatus from the live SQLite graph. Token Budget: 500.',
    inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
  },
  {
    name: 'skill_graph_validate',
    description: '[L7:Maintenance] Validate the live skill graph for schema-version drift, broken edges, recommended weight-band violations, reciprocal symmetry, and lightweight dependency-cycle errors. Token Budget: 800.',
    inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
  },
  {
    name: 'skill_graph_propagate_enhances',
    description: '[L7:Maintenance] Detect, report, and optionally apply missing inbound edges.enhances[] declarations across skills. Default mode: report (no writes).',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        skillsRoot: { type: 'string', description: 'Defaults to .opencode/skills' },
        mode: { type: 'string', enum: ['report', 'propose', 'apply'], default: 'report' },
        minConfidence: { type: 'number', minimum: 0, maximum: 1, default: 0.75 },
        targetSkillIds: { type: 'array', items: { type: 'string' } },
        sourceSkillIds: { type: 'array', items: { type: 'string' } },
        applyCandidateIds: { type: 'array', items: { type: 'string' } },
        applyAllHighConfidence: { type: 'boolean', default: false },
        dryRun: { type: 'boolean', default: true },
      },
    },
  },
];

export const SKILL_ADVISOR_CLI_TOOL_MANIFEST: readonly SkillAdvisorCliToolDefinition[] = SKILL_ADVISOR_TOOL_DEFINITIONS.map((tool) => {
  const kebabCommand = toKebabCommand(tool.name);
  const camelCommand = toCamelCommand(tool.name);
  return {
    ...tool,
    command: tool.name,
    kebabCommand,
    camelCommand,
    aliases: Array.from(new Set([tool.name, kebabCommand, camelCommand])),
  };
});
