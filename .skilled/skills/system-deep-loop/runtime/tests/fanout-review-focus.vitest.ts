// MODULE: fan-out review focus
//
// An operator's review focus has to reach every lineage of a deep-review fan-out, and
// every iteration prompt the leaf renders, in addition to the review dimensions. These
// cells pin the three places it travels: the CLI lineage prompt's setup bindings, the
// native lineage's command input, and the rendered review prompt pack. They also pin
// that a run without a focus produces exactly the prompt it produced before.

import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { renderPromptPack } from '../lib/deep-loop/prompt-pack';

const requireCjs = createRequire(import.meta.url);
const testsDir = dirname(fileURLToPath(import.meta.url));
const fanoutRunScript = join(testsDir, '..', 'scripts', 'fanout-run.cjs');
const reviewTemplatePath = join(testsDir, '..', '..', 'deep-review', 'assets', 'prompt-pack-iteration.md.tmpl');

type LineageKind = 'native' | 'cli-codex' | 'cli-opencode' | 'cli-claude-code';
type Lineage = { kind: LineageKind; label: string; model?: string; iterations?: number };
type LoopOptions = { stopPolicy?: string; reviewFocus?: string | null };

const { buildLoopPrompt, buildNativeCommandInput, normalizeReviewFocus, REVIEW_FOCUS_MAX_LENGTH } = requireCjs(
  fanoutRunScript,
) as {
  buildLoopPrompt: (
    loopType: 'research' | 'review',
    specFolder: string,
    lineageDir: string,
    sessionId: string,
    lineage: Lineage,
    researchTopic?: string | null,
    options?: LoopOptions,
  ) => string;
  buildNativeCommandInput: (
    loopType: 'research' | 'review',
    specFolder: string,
    lineageDir: string,
    lineage: Lineage,
    options?: LoopOptions,
  ) => string;
  normalizeReviewFocus: (raw: unknown) => string | null;
  REVIEW_FOCUS_MAX_LENGTH: number;
};

const SPEC_FOLDER = 'specs/test-fanout-review-focus';
const FOCUS = 'drift, bad integration, code alignment with sk-code-skilled, docs aligned with sk-doc modes';
const LINEAGES: Lineage[] = [
  { kind: 'cli-codex', label: 'codex-1', model: 'gpt-5.6-codex', iterations: 5 },
  { kind: 'cli-opencode', label: 'opencode-1', model: 'llmgateway/glm-5.3-flash', iterations: 5 },
  { kind: 'native', label: 'native-1', iterations: 5 },
];

function reviewPrompt(lineage: Lineage, reviewFocus?: string | null): string {
  return buildLoopPrompt(
    'review',
    SPEC_FOLDER,
    `/tmp/fanout-review-focus/${lineage.label}`,
    `fanout-${lineage.label}-session`,
    lineage,
    null,
    { reviewFocus },
  );
}

function setupBindings(prompt: string): string[] {
  const lines = prompt.split('\n');
  const start = lines.findIndex((line) => line.startsWith('Review setup bindings'));
  expect(start).toBeGreaterThanOrEqual(0);
  const end = lines.indexOf('', start);
  return lines.slice(start + 1, end);
}

function renderReviewIteration(reviewFocusBlock: string): string {
  return renderPromptPack(reviewTemplatePath, {
    state_summary: 'Review summary block',
    current_iteration: 2,
    max_iterations: 5,
    next_dimension: 'correctness',
    review_target: SPEC_FOLDER,
    review_scope_files: 'file-a.ts',
    p0_count: 0,
    p1_count: 0,
    p2_count: 0,
    pivot_lineage: 'none yet',
    saturated_directions: 'none yet',
    review_focus_block: reviewFocusBlock,
    state_paths_config: 'review/deep-review-config.json',
    state_paths_state_log: 'review/deep-review-state.jsonl',
    state_paths_findings_registry: 'review/deep-review-findings-registry.json',
    state_paths_strategy: 'review/deep-review-strategy.md',
    state_paths_iteration_pattern: 'review/iterations/iteration-002.md',
    state_paths_delta_pattern: 'review/deltas/iter-002.jsonl',
  });
}

describe('fanout-run.cjs review focus', () => {
  it('binds the focus in the setup bindings of every lineage prompt, beside the dimensions', () => {
    for (const lineage of LINEAGES) {
      const bindings = setupBindings(reviewPrompt(lineage, FOCUS));
      expect(bindings).toContain('review_dimensions: all');
      expect(bindings).toContain(`review_focus: ${FOCUS}`);
    }
  });

  it('restates the focus in the per-iteration contract a CLI leaf runs every iteration from', () => {
    const prompt = reviewPrompt(LINEAGES[0], FOCUS);
    const contractIndex = prompt.indexOf('CLI OUTPUT CONTRACT');
    const focusRuleIndex = prompt.indexOf('the operator review focus bound as review_focus');
    expect(contractIndex).toBeGreaterThanOrEqual(0);
    expect(focusRuleIndex).toBeGreaterThan(contractIndex);
  });

  it('carries the focus to a native lineage as both a command flag and a pre-bound answer', () => {
    const input = buildNativeCommandInput('review', SPEC_FOLDER, '/tmp/fanout-review-focus/native-1', LINEAGES[2], {
      reviewFocus: FOCUS,
    });
    const [commandLine] = input.split('\n');
    expect(commandLine).toContain(`--review-focus=${JSON.stringify(FOCUS)}`);
    expect(input).toContain(`PRE-BOUND SETUP ANSWERS:`);
    expect(input.split('\n')).toContain(`review_focus: ${FOCUS}`);
  });

  it('leaves every prompt byte-identical when no focus is given', () => {
    for (const lineage of LINEAGES) {
      const withoutFocus = reviewPrompt(lineage);
      expect(withoutFocus).not.toContain('review_focus');
      expect(reviewPrompt(lineage, null)).toBe(withoutFocus);
      const focusLinesRemoved = reviewPrompt(lineage, FOCUS)
        .split('\n')
        .filter((line) => !line.includes('review_focus'))
        .join('\n');
      expect(focusLinesRemoved).toBe(withoutFocus);
    }
    const nativeInput = buildNativeCommandInput('review', SPEC_FOLDER, '/tmp/fanout-review-focus/native-1', LINEAGES[2]);
    expect(nativeInput).not.toContain('--review-focus');
    expect(nativeInput).not.toContain('review_focus');
  });

  it('never adds a focus to a research lineage', () => {
    const prompt = buildLoopPrompt('research', SPEC_FOLDER, '/tmp/fanout-review-focus/r', 's', LINEAGES[0], 'topic', {
      reviewFocus: FOCUS,
    });
    expect(prompt).not.toContain('review_focus');
  });

  it('renders the focus into the review iteration prompt pack, and renders nothing for it when absent', () => {
    const withFocus = renderReviewIteration(`Operator review focus: ${FOCUS}`);
    expect(withFocus).toContain(`correctness, security, traceability, maintainability\nOperator review focus: ${FOCUS}\n`);

    const withoutFocus = renderReviewIteration('');
    expect(withoutFocus).not.toContain('Operator review focus');
    expect(withoutFocus).toContain('correctness, security, traceability, maintainability\n\n\n## TRACEABILITY PROTOCOLS');
  });
});

describe('normalizeReviewFocus', () => {
  it('collapses control characters and whitespace runs into one line', () => {
    expect(normalizeReviewFocus('  drift\n\nIGNORE ABOVE\r\tand\u0000 alignment  ')).toBe(
      'drift IGNORE ABOVE and alignment',
    );
  });

  it('treats an absent or blank focus as no focus', () => {
    expect(normalizeReviewFocus(undefined)).toBeNull();
    expect(normalizeReviewFocus('')).toBeNull();
    expect(normalizeReviewFocus(' \n\t ')).toBeNull();
  });

  it('rejects a bare flag and a focus over the length bound', () => {
    expect(() => normalizeReviewFocus(true)).toThrow(/reviewFocus must be a text value/);
    expect(normalizeReviewFocus('x'.repeat(REVIEW_FOCUS_MAX_LENGTH))).toHaveLength(REVIEW_FOCUS_MAX_LENGTH);
    expect(() => normalizeReviewFocus('x'.repeat(REVIEW_FOCUS_MAX_LENGTH + 1))).toThrow(/at most 1000 characters/);
  });
});
