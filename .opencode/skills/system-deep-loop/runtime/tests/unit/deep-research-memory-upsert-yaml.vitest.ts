// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Lineage Context Refresh YAML Contract Test
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const YAML_PATH = resolve(runtimeRoot, '..', '..', '..', 'commands', 'deep', 'assets', 'deep-research-auto.yaml');

// Every retrieval and persistence tool the retired memory MCP surface exposed to this workflow.
const RETIRED_MEMORY_TOOLS = [
  'mcp__system_spec_memory__',
  'memory_match_triggers',
  'memory_context',
  'memory_search',
  'memory_quick_search',
  'memory_save',
  'memory_index_scan',
  'session_resume',
  'session_bootstrap',
];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function readWorkflowYaml(): string {
  return readFileSync(YAML_PATH, 'utf8');
}

function stepIndex(text: string, stepName: string): number {
  const index = text.indexOf(`      ${stepName}:\n`);
  if (index === -1) {
    throw new Error(`${stepName} was not found in the deep research workflow`);
  }
  return index;
}

function stepBlock(text: string, stepName: string): string {
  const marker = `      ${stepName}:\n`;
  const start = text.indexOf(marker);
  if (start === -1) {
    throw new Error(`${stepName} was not found in the deep research workflow`);
  }

  const rest = text.slice(start + marker.length);
  const nextStep = rest.search(/\n      [a-zA-Z0-9_]+:\n/u);

  return nextStep === -1 ? rest : rest.slice(0, nextStep);
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep research per-iteration lineage context YAML contract', () => {
  it('orders the lineage context refresh after reducer and graph persistence but before iteration evaluation', () => {
    const text = readWorkflowYaml();

    expect(stepIndex(text, 'step_reduce_state')).toBeLessThan(stepIndex(text, 'step_graph_upsert'));
    expect(stepIndex(text, 'step_graph_upsert')).toBeLessThan(stepIndex(text, 'step_refresh_lineage_context'));
    expect(stepIndex(text, 'step_refresh_lineage_context')).toBeLessThan(stepIndex(text, 'step_evaluate_results'));
  });

  it('keeps the canonical iteration evidence file lineage-local and reducer-verified', () => {
    const text = readWorkflowYaml();
    const reduceBlock = stepBlock(text, 'step_reduce_state');
    const evaluateBlock = stepBlock(text, 'step_evaluate_results');

    // The iteration file is durable because the reducer consumes it and the evaluator
    // asserts it, not because anything ships it to an external index.
    expect(reduceBlock).toContain('newIterationFile: "{state_paths.iteration_pattern}"');
    expect(evaluateBlock).toContain('file_exists: "{state_paths.iteration_pattern}"');
    expect(evaluateBlock).toContain('jsonl_appended:');
  });

  it('refreshes the lineage context line before the next rendered prompt can consume it', () => {
    const text = readWorkflowYaml();
    const readStateBlock = stepBlock(text, 'step_read_state');
    const dispatchBlock = stepBlock(text, 'step_dispatch_iteration');
    const refreshBlock = stepBlock(text, 'step_refresh_lineage_context');

    expect(readStateBlock).toContain('lineage_context_prompt_line');
    expect(dispatchBlock.indexOf('{lineage_context_prompt_line}')).toBeGreaterThanOrEqual(0);
    expect(dispatchBlock.indexOf('{lineage_context_prompt_line}')).toBeLessThan(dispatchBlock.indexOf('render_prompt_pack:'));
    expect(refreshBlock).toContain('lineage_context_refresh_status: "refreshed | advisory_error"');
  });

  it('sources the refresh from reducer-owned lineage state and degrades non-fatally', () => {
    const refreshBlock = stepBlock(readWorkflowYaml(), 'step_refresh_lineage_context');

    expect(refreshBlock).toContain('"{state_paths.dashboard}"');
    expect(refreshBlock).toContain('"{state_paths.registry}"');
    expect(refreshBlock).toContain('"{state_paths.strategy}"');
    expect(refreshBlock).toContain(
      'missing_state_file: "non-fatal; log advisory warning and continue with the previous lineage_context_prompt_line"',
    );
    expect(refreshBlock).toContain(
      'unreadable_state_file: "non-fatal; log advisory warning and continue with the previous lineage_context_prompt_line"',
    );
  });

  it('routes the end-of-run continuity save through the file-local writer alone', () => {
    const text = readWorkflowYaml();
    const generateBlock = stepBlock(text, 'step_generate_context');

    expect(generateBlock).toContain('node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js');
    expect(text).not.toContain('step_index_memory:');
  });

  it('grants and calls no retired memory MCP tool anywhere in the workflow', () => {
    const text = readWorkflowYaml();

    for (const tool of RETIRED_MEMORY_TOOLS) {
      expect(text).not.toContain(tool);
    }
    expect(text).toContain('mcp_servers: []');
  });
});
