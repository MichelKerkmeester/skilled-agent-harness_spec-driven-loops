// ───────────────────────────────────────────────────────────────────
// MODULE: Prompt Pack Renderer Tests
// ───────────────────────────────────────────────────────────────────
import { describe, expect, it } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

import { PromptPackError, renderPromptPack, validatePromptPackTemplate } from '../../lib/deep-loop/prompt-pack';

/**
 * Creates a temporary template file for prompt-pack tests.
 */
function withTempTemplate(content: string, run: (templatePath: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'prompt-pack-'));
  const templatePath = join(tempDir, 'template.md.tmpl');

  try {
    writeFileSync(templatePath, content, 'utf8');
    run(templatePath);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('prompt-pack', () => {
  it('renderPromptPack substitutes a single {topic} token with the variable value', () => {
    withTempTemplate('Topic: {topic}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'Graph Coverage' })).toBe('Topic: Graph Coverage');
    });
  });

  it('substitutes multiple different tokens in one render', () => {
    withTempTemplate('Topic: {topic} | Iteration: {iteration}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'Review', iteration: 2 })).toBe('Topic: Review | Iteration: 2');
    });
  });

  it('substitutes the same token appearing multiple times', () => {
    withTempTemplate('{topic} -> {topic}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'Repeat' })).toBe('Repeat -> Repeat');
    });
  });

  it('throws PromptPackError with the missing variable listed when a token lacks a binding', () => {
    withTempTemplate('Topic: {topic} | Focus: {focus}', (templatePath) => {
      try {
        renderPromptPack(templatePath, { topic: 'Bound' });
        throw new Error('Expected renderPromptPack to throw');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(PromptPackError);
        if (error instanceof PromptPackError) {
          expect(error.missingVariables).toEqual(['focus']);
        }
      }
    });
  });

  it('renderPromptPack returns identical output for identical inputs', () => {
    withTempTemplate('State: {state}', (templatePath) => {
      const first = renderPromptPack(templatePath, { state: 'stable' });
      const second = renderPromptPack(templatePath, { state: 'stable' });

      expect(first).toBe(second);
    });
  });

  it('numbers are coerced to strings', () => {
    withTempTemplate('Iteration {iteration}', (templatePath) => {
      expect(renderPromptPack(templatePath, { iteration: 5 })).toBe('Iteration 5');
    });
  });

  it('validatePromptPackTemplate returns all three arrays for a mixed case', () => {
    withTempTemplate('{topic} {iteration} {focus}', (templatePath) => {
      expect(validatePromptPackTemplate(templatePath, ['topic', 'status', 'iteration', 'mode'])).toEqual({
        present: ['topic', 'iteration'],
        missing: ['status', 'mode'],
        extra: ['focus'],
      });
    });
  });

  it('tokens with invalid variable-name syntax are not matched and are treated as literal text', () => {
    withTempTemplate('Literal {foo.bar} token and valid {topic}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'bound' })).toBe('Literal {foo.bar} token and valid bound');
    });
  });

  it('empty template renders as empty string', () => {
    withTempTemplate('', (templatePath) => {
      expect(renderPromptPack(templatePath, {})).toBe('');
    });
  });

  it('template with no tokens renders unchanged', () => {
    withTempTemplate('No substitutions required.', (templatePath) => {
      expect(renderPromptPack(templatePath, {})).toBe('No substitutions required.');
    });
  });

  it('both production templates load and render successfully with the expected bound variables', () => {
    const deepLoopRoot = join(import.meta.dirname, '..', '..', '..');
    const researchTemplatePath = join(
      deepLoopRoot,
      'deep-research',
      'assets',
      'prompt-pack-iteration.md.tmpl',
    );
    const reviewTemplatePath = join(
      deepLoopRoot,
      'deep-review',
      'assets',
      'prompt-pack-iteration.md.tmpl',
    );

    const researchRendered = renderPromptPack(researchTemplatePath, {
      state_summary: 'Summary block',
      research_topic: 'Deep loop coverage',
      current_iteration: 2,
      max_iterations: 5,
      max_tool_calls_per_iteration: 24,
      next_focus: 'Graph event capture',
      remaining_questions_list: '- Q1\n- Q2',
      carried_forward_open_questions: '- Runtime helper ownership? (iteration 1)',
      last_3_summaries: 'Iter 1: baseline',
      state_paths_config: '.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json',
      state_paths_state_log: '.skilled/skills/system-deep-loop/deep-research/runtime/state.jsonl',
      state_paths_strategy: '.skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md',
      state_paths_registry: '.skilled/skills/system-deep-loop/deep-research/runtime/registry.json',
      state_paths_iteration_pattern: '.skilled/skills/system-deep-loop/deep-research/runtime/iteration-002.md',
      state_paths_delta_pattern: '.skilled/skills/system-deep-loop/deep-research/runtime/deltas/iter-002.jsonl',
      pivot_lineage: 'Pivot pivot-1-abc123def456 selected candidate-001 from source iteration 2.',
      saturated_directions: '- Graph event capture',
    });

    const reviewRendered = renderPromptPack(reviewTemplatePath, {
      state_summary: 'Review summary block',
      current_iteration: 3,
      max_iterations: 6,
      max_tool_calls_per_iteration: 24,
      next_dimension: 'traceability',
      review_target: 'lib/deep-loop',
      review_scope_files: 'file-a.ts, file-b.ts',
      p0_count: 0,
      p1_count: 1,
      p2_count: 2,
      state_paths_config: '.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json',
      state_paths_state_log: '.skilled/skills/system-deep-loop/deep-review/runtime/state.jsonl',
      state_paths_findings_registry: '.skilled/skills/system-deep-loop/deep-review/runtime/findings.json',
      state_paths_strategy: '.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md',
      state_paths_iteration_pattern: '.skilled/skills/system-deep-loop/deep-review/runtime/iteration-003.md',
      state_paths_delta_pattern: '.skilled/skills/system-deep-loop/deep-review/runtime/deltas/iter-003.jsonl',
      pivot_lineage: 'Pivot pivot-1-fed654cba321 selected candidate-001 from source iteration 3.',
      saturated_directions: '- traceability',
      review_focus_block: '',
      unfinished_core_protocols_block: '',
    });

    expect(researchRendered).toContain('Research Topic: Deep loop coverage');
    expect(researchRendered).toContain('Max 24 tool calls total.');
    expect(researchRendered).toContain('put the finding statement there');
    expect(researchRendered).toContain('NO OPERATOR IS PRESENT');
    expect(researchRendered).toContain('WRITE UNDER THE LINEAGE DIRECTORY');
    expect(researchRendered).toContain('Runtime helper ownership?');
    expect(researchRendered).toContain('State Log: .skilled/skills/system-deep-loop/deep-research/runtime/state.jsonl');
    expect(reviewRendered).toContain('Dimension: traceability');
    expect(reviewRendered).toContain('Max 24 tool calls total.');
    expect(reviewRendered).toContain('Findings Registry: .skilled/skills/system-deep-loop/deep-review/runtime/findings.json');
  });
});

const nodeRequire = createRequire(import.meta.url);
const deepLoopRootDir = join(import.meta.dirname, '..', '..', '..');
// The env override lets a scratch copy of the pack stand in, which is how the
// lockstep case is shown to fail when a pack line goes missing.
const researchPackPath = process.env.DEEP_RESEARCH_PACK_TEMPLATE
  ?? join(deepLoopRootDir, 'deep-research', 'assets', 'prompt-pack-iteration.md.tmpl');
const researchAgentPath = join(deepLoopRootDir, '..', '..', 'agents', 'deep-research.md');

function hasSynthesisWriteRule(text: string): boolean {
  return text.split('\n').some((line) => /research\.md/.test(line) && /progressiveSynthesis/.test(line));
}

function allowedWriteBlock(rendered: string): string {
  const start = rendered.indexOf('ALLOWED WRITE PATHS');
  expect(start).toBeGreaterThanOrEqual(0);
  const rest = rendered.slice(start);
  const end = rest.indexOf('\n- **', 1);
  return end === -1 ? rest : rest.slice(0, end);
}

function researchBindings(iterationPattern: string): Record<string, string | number> {
  return {
    state_summary: 'Summary block',
    research_topic: 'Deep loop coverage',
    current_iteration: 2,
    max_iterations: 5,
    max_tool_calls_per_iteration: 24,
    next_focus: 'Graph event capture',
    remaining_questions_list: '- Q1',
    carried_forward_open_questions: '- none',
    last_3_summaries: 'Iter 1: baseline',
    state_paths_config: 'specs/demo/research/deep-research-config.json',
    state_paths_state_log: 'specs/demo/research/deep-research-state.jsonl',
    state_paths_strategy: 'specs/demo/research/deep-research-strategy.md',
    state_paths_registry: 'specs/demo/research/findings-registry.json',
    state_paths_iteration_pattern: iterationPattern,
    state_paths_delta_pattern: 'specs/demo/research/deltas/iter-002.jsonl',
    pivot_lineage: 'none',
    saturated_directions: '- none',
  };
}

describe('research prompt pack and agent definition lockstep', () => {
  it('agent definition and research pack both carry the progressive-synthesis write rule and the Recommended Next Focus heading', () => {
    const agent = readFileSync(researchAgentPath, 'utf8');
    const pack = readFileSync(researchPackPath, 'utf8');
    expect(hasSynthesisWriteRule(agent)).toBe(true);
    expect(hasSynthesisWriteRule(pack)).toBe(true);
    expect(agent).toContain('Recommended Next Focus');
    expect(pack).toContain('Recommended Next Focus');
  });

  it('rendered research pack allows research.md under progressiveSynthesis and names Recommended Next Focus', () => {
    const rendered = renderPromptPack(
      researchPackPath,
      researchBindings('specs/demo/research/iterations/iteration-002.md'),
    );
    const block = allowedWriteBlock(rendered);
    expect(hasSynthesisWriteRule(block)).toBe(true);
    expect(block).not.toContain('research/research.md');
    expect(rendered).toContain('Questions Remaining, Recommended Next Focus');
    expect(rendered).not.toContain(', Next Focus.');
  });

  it('a lineage render points the research.md entry at the lineage directory', () => {
    const lineageIteration = 'specs/demo/research/lineages/lineage-a/iterations/iteration-002.md';
    const block = allowedWriteBlock(renderPromptPack(researchPackPath, researchBindings(lineageIteration)));
    expect(block).toContain(lineageIteration);
    const entry = block
      .split('\n')
      .find((line) => /research\.md/.test(line) && /progressiveSynthesis/.test(line));
    expect(entry).toBeDefined();
    expect(entry).toContain('specs/demo/research/lineages/lineage-a/iterations/');
    expect(block).not.toContain('research/research.md');
  });

  it('a narrative using the headings the pack names yields a parsed nextFocus', () => {
    const { parseIterationFile } = nodeRequire('../../../deep-research/scripts/reduce-state.cjs');
    const pack = readFileSync(researchPackPath, 'utf8');
    const match = pack.match(/Structure: headings for ([^.]+)\./);
    expect(match).not.toBeNull();
    const headings = (match as RegExpMatchArray)[1].split(',').map((heading) => heading.trim());
    const narrative = ['# Iteration 2: Demo focus', ...headings.map((heading) => `## ${heading}\n- ${heading} detail`)].join('\n\n');
    const tempDir = mkdtempSync(join(tmpdir(), 'prompt-pack-narrative-'));
    try {
      const iterationPath = join(tempDir, 'iteration-002.md');
      writeFileSync(iterationPath, `${narrative}\n`, 'utf8');
      expect(parseIterationFile(iterationPath).nextFocus).not.toBe('');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
