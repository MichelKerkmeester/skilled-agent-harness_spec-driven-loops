// -------------------------------------------------------------------
// MODULE: Code Index CLI Manifest
// -------------------------------------------------------------------

import {
  CODE_GRAPH_TOOL_SCHEMAS,
  type ToolDefinition,
} from './tool-schemas.js';

const EXPECTED_TOOL_NAMES = [
  'code_graph_scan',
  'code_graph_query',
  'code_graph_status',
  'code_graph_context',
  'code_graph_classify_query_intent',
  'code_graph_verify',
  'code_graph_apply',
  'detect_changes',
] as const;

export const CODE_INDEX_CLI_TOOL_DEFINITIONS: readonly ToolDefinition[] = CODE_GRAPH_TOOL_SCHEMAS;

export function assertCodeIndexCliManifest(): void {
  const actualNames = CODE_INDEX_CLI_TOOL_DEFINITIONS.map((tool) => tool.name);
  const actualNameSet = new Set(actualNames);
  const expectedNameSet = new Set<string>(EXPECTED_TOOL_NAMES);
  const missing = EXPECTED_TOOL_NAMES.filter((name) => !actualNameSet.has(name));
  const unexpected = actualNames.filter((name) => !expectedNameSet.has(name));

  if (actualNames.length !== EXPECTED_TOOL_NAMES.length || missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      `code-index CLI manifest mismatch: expected ${EXPECTED_TOOL_NAMES.length} tools; `
      + `actual=${actualNames.length}; missing=${missing.join(', ') || 'none'}; `
      + `unexpected=${unexpected.join(', ') || 'none'}`,
    );
  }
}
