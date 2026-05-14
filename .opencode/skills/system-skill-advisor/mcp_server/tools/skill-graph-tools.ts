// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Tool Descriptors
// ───────────────────────────────────────────────────────────────

import {
  handleSkillGraphQuery,
  handleSkillGraphScan,
  handleSkillGraphStatus,
  handleSkillGraphValidate,
} from '../handlers/skill-graph/index.js';

import type { MCPCallerContext } from '../../../system-spec-kit/mcp_server/lib/context/caller-context.js';
import type { ToolDefinition } from './types.js';

type MCPResponse = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

export const skillGraphScanTool: ToolDefinition = {
  name: 'skill_graph_scan',
  description: '[L7:Maintenance] Index or re-index all .opencode/skills/*/graph-metadata.json files into graph-metadata-index.sqlite using the hash-aware SQLite indexer. Token Budget: 800.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      skillsRoot: { type: 'string', description: 'Optional skills root to scan (default: .opencode/skills). Must resolve to a path under the current workspace; paths escaping the workspace are rejected.' },
    },
    required: [],
  },
};

export const skillGraphQueryTool: ToolDefinition = {
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
};

export const skillGraphStatusTool: ToolDefinition = {
  name: 'skill_graph_status',
  description: '[L7:Maintenance] Report skill graph health. Returns totalSkills, totalEdges, lastIndexedAt, families, categories, schemaVersions, staleness, validation, and dbStatus from the live SQLite graph. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

export const skillGraphValidateTool: ToolDefinition = {
  name: 'skill_graph_validate',
  description: '[L7:Maintenance] Validate the live skill graph for schema-version drift, broken edges, recommended weight-band violations, reciprocal symmetry, and lightweight dependency-cycle errors. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

export const skillGraphToolDefinitions: ToolDefinition[] = [
  skillGraphScanTool,
  skillGraphQueryTool,
  skillGraphStatusTool,
  skillGraphValidateTool,
];

export const TOOL_NAMES = new Set(skillGraphToolDefinitions.map((tool) => tool.name));

function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map((entry) => ({ type: 'text' as const, text: entry.text })),
  };
}

function getMissingRequiredStringArgs(args: Record<string, unknown>, requiredKeys: string[]): string[] {
  return requiredKeys.filter((key) => {
    const value = args[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

function validationError(tool: string, missingKeys: string[]): MCPResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'error',
        error: `Missing required field${missingKeys.length === 1 ? '' : 's'}: ${missingKeys.join(', ')}`,
        tool,
      }),
    }],
  };
}

export async function handleTool(
  name: string,
  args: Record<string, unknown>,
  callerContext?: MCPCallerContext | null,
): Promise<MCPResponse | null> {
  switch (name) {
    case 'skill_graph_scan':
      return toMCP(await handleSkillGraphScan(args, callerContext));
    case 'skill_graph_query': {
      const missingKeys = getMissingRequiredStringArgs(args, ['queryType']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleSkillGraphQuery(args as unknown as Parameters<typeof handleSkillGraphQuery>[0]));
    }
    case 'skill_graph_status':
      return toMCP(await handleSkillGraphStatus());
    case 'skill_graph_validate':
      return toMCP(await handleSkillGraphValidate());
    default:
      return null;
  }
}
