// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Memory Upsert YAML Contract Test
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

describe('deep research per-iteration memory upsert YAML contract', () => {
  it('orders memory upsert after reducer and graph persistence but before iteration evaluation', () => {
    const text = readWorkflowYaml();

    expect(stepIndex(text, 'step_reduce_state')).toBeLessThan(stepIndex(text, 'step_graph_upsert'));
    expect(stepIndex(text, 'step_graph_upsert')).toBeLessThan(stepIndex(text, 'step_memory_upsert_iteration'));
    expect(stepIndex(text, 'step_memory_upsert_iteration')).toBeLessThan(stepIndex(text, 'step_refresh_memory_context'));
    expect(stepIndex(text, 'step_refresh_memory_context')).toBeLessThan(stepIndex(text, 'step_evaluate_results'));
  });

  it('declares a non-fatal memory_save upsert for the canonical iteration evidence file', () => {
    const block = stepBlock(readWorkflowYaml(), 'step_memory_upsert_iteration');

    expect(block).toContain('mcp_tool: memory_save');
    expect(block).toContain('memory_save({ filePath: "{state_paths.iteration_pattern}" })');
    expect(block).toContain('timeout_seconds: 5');
    expect(block).toContain('mcp_error: "non-fatal; log advisory warning and continue"');
    expect(block).toContain('timeout: "non-fatal after timeout_seconds; log advisory warning and continue"');
    expect(block).toContain('memory_upsert_status: "upserted | advisory_error"');
  });

  it('refreshes memory context before the next rendered prompt can consume it', () => {
    const text = readWorkflowYaml();
    const readStateBlock = stepBlock(text, 'step_read_state');
    const dispatchBlock = stepBlock(text, 'step_dispatch_iteration');
    const refreshBlock = stepBlock(text, 'step_refresh_memory_context');

    expect(readStateBlock).toContain('memory_context_prompt_line');
    expect(dispatchBlock.indexOf('{memory_context_prompt_line}')).toBeGreaterThanOrEqual(0);
    expect(dispatchBlock.indexOf('{memory_context_prompt_line}')).toBeLessThan(dispatchBlock.indexOf('render_prompt_pack:'));
    expect(refreshBlock).toContain('mcp_tool: memory_context');
    expect(refreshBlock).toContain('memory_context({ input: "{research_topic}", mode: "focused", intent: "understand", includeContent: true })');
    expect(refreshBlock).toContain('mcp_error: "non-fatal; log advisory warning and continue with the previous memory_context_prompt_line"');
  });
});
