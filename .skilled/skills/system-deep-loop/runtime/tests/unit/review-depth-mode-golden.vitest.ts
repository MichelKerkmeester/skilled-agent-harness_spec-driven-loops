// ───────────────────────────────────────────────────────────────────
// TEST: Review default-path golden byte identity
// ───────────────────────────────────────────────────────────────────
// The opt-in expansive depth mode touches the review reducer, the stop
// decision, the review prompt pack, the review pivot seeds and the fan-out
// lineage prompt. A review run that never asks for it must render the same
// bytes, so this suite renders those default-path artifacts for one fixed
// review packet and compares them to baselines captured before any review
// depth-mode code existed.
//
// Regenerate the baselines only on a tree that predates the review depth-mode code:
//   GOLDEN_UPDATE=1 npx vitest run review-depth-mode-golden.vitest
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { renderPromptPack } from '../../lib/deep-loop/prompt-pack';
import { buildReviewPivotPreparationInput } from '../../../deep-review/scripts/divergent-review-pivot';

const nodeRequire = createRequire(import.meta.url);
const testDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(testDir, '..', '..', '..');
const baselineDir = resolve(testDir, '..', 'fixtures', 'golden-review-default');
const templatePath = join(skillRoot, 'deep-review', 'assets', 'prompt-pack-iteration.md.tmpl');

const { reduceReviewState } = nodeRequire(join(skillRoot, 'runtime', 'scripts', 'reduce-state.cjs')) as {
  reduceReviewState: (specFolder: string, options?: Record<string, unknown>) => {
    registry: Record<string, unknown>;
    strategy: string;
    dashboard: string;
  };
};
const { buildStopDecisionInput } = nodeRequire(join(skillRoot, 'runtime', 'scripts', 'convergence.cjs')) as {
  buildStopDecisionInput: (
    args: Record<string, unknown>,
    loopType: string,
    files: Record<string, unknown>,
    graph: Record<string, unknown>,
  ) => { config: Record<string, unknown> };
};
const { buildLoopPrompt, buildNativeCommandInput } = nodeRequire(join(skillRoot, 'runtime', 'scripts', 'fanout-run.cjs')) as {
  buildLoopPrompt: (...args: unknown[]) => string;
  buildNativeCommandInput: (...args: unknown[]) => string;
};

const ARTIFACTS = [
  'registry.json',
  'dashboard.md',
  'next-focus.txt',
  'prompt-pack.md',
  'pivot-seeds.json',
  'lineage-prompt.txt',
  'stop-decision-config.json',
] as const;

type Artifact = (typeof ARTIFACTS)[number];

// A default review written before the flag existed carries no depth keys; one
// written after it carries the explicit default. Both must render the same bytes.
type Variant = {
  name: string;
  configExtras: Record<string, unknown>;
  convergenceArgs: Record<string, unknown>;
  loopOptions: Record<string, unknown>;
};

const VARIANTS: Variant[] = [
  { name: 'depthMode absent', configExtras: {}, convergenceArgs: { convergenceMode: 'default' }, loopOptions: {} },
  {
    name: 'explicit --depth-mode=default',
    configExtras: {
      antiConvergence: { convergenceMode: 'default', depthMode: 'default' },
      expansiveDepth: { maxDepth: 3, maxChildrenPerNode: 6 },
    },
    convergenceArgs: { convergenceMode: 'default', depthMode: 'default' },
    loopOptions: { depthMode: 'default' },
  },
];

const DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];

const tempRoots: string[] = [];

afterEach(() => {
  while (tempRoots.length > 0) rmSync(tempRoots.pop() as string, { recursive: true, force: true });
});

function strategyText(): string {
  return [
    '# Deep Review Strategy',
    '',
    '<!-- ANCHOR:review-dimensions -->',
    '## 3. REVIEW DIMENSIONS (remaining)',
    ...DIMENSIONS.map((dimension) => `- [ ] ${dimension}`),
    '<!-- /ANCHOR:review-dimensions -->',
    '',
    '<!-- ANCHOR:completed-dimensions -->',
    '## 4. COMPLETED DIMENSIONS',
    '[None yet]',
    '<!-- /ANCHOR:completed-dimensions -->',
    '',
    '<!-- ANCHOR:running-findings -->',
    '## 5. RUNNING FINDINGS',
    '- P0 (Blockers): 0',
    '<!-- /ANCHOR:running-findings -->',
    '',
    '<!-- ANCHOR:exhausted-approaches -->',
    '## 9. EXHAUSTED APPROACHES (do not retry)',
    '[None yet]',
    '<!-- /ANCHOR:exhausted-approaches -->',
    '',
    '<!-- ANCHOR:ruled-out-directions -->',
    '## 11. RULED OUT DIRECTIONS',
    '[None yet]',
    '<!-- /ANCHOR:ruled-out-directions -->',
    '',
    '<!-- ANCHOR:next-focus -->',
    '## 12. NEXT FOCUS',
    '[None yet]',
    '<!-- /ANCHOR:next-focus -->',
    '',
  ].join('\n');
}

function iterationRows(): Array<Record<string, unknown>> {
  const shared = { type: 'iteration', mode: 'review', sessionId: 'golden-review-session', generation: 1, lineageMode: 'new' };
  return [
    {
      ...shared,
      run: 1,
      iteration: 1,
      status: 'complete',
      focus: 'correctness',
      dimensions: ['correctness'],
      filesReviewed: ['src/stop.cjs:12'],
      findingsCount: 1,
      findingsSummary: { P0: 0, P1: 1, P2: 0 },
      findingsNew: [],
      findingDetails: [{
        findingId: 'F001',
        severity: 'P1',
        title: 'Stop reason dropped on the error path',
        dimension: 'correctness',
        file: 'src/stop.cjs',
        line: 12,
      }],
      newFindingsRatio: 1,
      timestamp: '2026-06-19T00:10:00.000Z',
      durationMs: 60000,
    },
    {
      ...shared,
      run: 2,
      iteration: 2,
      status: 'complete',
      focus: 'security',
      dimensions: ['security'],
      filesReviewed: ['src/auth.cjs:4'],
      findingsCount: 0,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
      findingsNew: [],
      findingDetails: [],
      newFindingsRatio: 0,
      timestamp: '2026-06-19T00:20:00.000Z',
      durationMs: 60000,
    },
  ];
}

function writeFixture(variant: Variant): { specFolder: string; reviewDir: string } {
  const root = mkdtempSync(join(tmpdir(), 'review-golden-'));
  tempRoots.push(root);
  const specFolder = join(root, 'spec');
  const reviewDir = join(specFolder, 'review');
  mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
  writeFileSync(join(specFolder, 'spec.md'), '# Golden Review Packet\n', 'utf8');
  const config = {
    topic: 'Review: golden default path',
    mode: 'review',
    sessionId: 'golden-review-session',
    parentSessionId: null,
    lineageMode: 'new',
    generation: 1,
    createdAt: '2026-06-19T00:00:00.000Z',
    status: 'running',
    reviewTarget: 'src',
    reviewTargetType: 'files',
    reviewDimensions: DIMENSIONS,
    maxIterations: 7,
    convergenceThreshold: 0.1,
    stuckThreshold: 2,
    stopPolicy: 'convergence',
    resource_map: { emit: false },
    ...variant.configExtras,
  };
  writeFileSync(join(reviewDir, 'deep-review-config.json'), `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  writeFileSync(join(reviewDir, 'deep-review-strategy.md'), strategyText(), 'utf8');
  writeFileSync(
    join(reviewDir, 'deep-review-state.jsonl'),
    `${iterationRows().map((row) => JSON.stringify(row)).join('\n')}\n`,
    'utf8',
  );
  writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), [
    '# Iteration 1: Correctness',
    '',
    '## Findings',
    '',
    '### P1',
    '- **F001**: Stop reason dropped on the error path - `src/stop.cjs:12`',
    '',
    '## Recommended Next Focus',
    '',
    'security',
    '',
  ].join('\n'), 'utf8');
  return { specFolder, reviewDir };
}

function nextFocusSection(strategy: string): string {
  const match = strategy.match(/<!-- ANCHOR:next-focus -->([\s\S]*?)<!-- \/ANCHOR:next-focus -->/);
  return match ? match[1] : '';
}

// Temp paths differ per run, so each is replaced with a stable token before comparison.
function normalize(text: string, specFolder: string): string {
  return text.split(specFolder).join('<SPEC>');
}

function renderArtifacts(variant: Variant): Record<Artifact, string> {
  const { specFolder, reviewDir } = writeFixture(variant);
  const config = JSON.parse(readFileSync(join(reviewDir, 'deep-review-config.json'), 'utf8'));
  const reduced = reduceReviewState(specFolder, { write: true, artifactDir: reviewDir });
  const registry = reduced.registry;
  const nextFocus = nextFocusSection(reduced.strategy);

  const promptPack = renderPromptPack(templatePath, {
    state_summary: 'Iteration 2 of 7',
    current_iteration: 3,
    max_iterations: config.maxIterations,
    max_tool_calls_per_iteration: 12,
    next_dimension: 'traceability',
    review_target: config.reviewTarget,
    review_scope_files: 'src/stop.cjs, src/auth.cjs',
    p0_count: 0,
    p1_count: 1,
    p2_count: 0,
    review_dimensions_list: DIMENSIONS.join(', '),
    review_focus_block: '',
    unfinished_core_protocols_block: '',
    pivot_lineage: '[None yet]',
    saturated_directions: '[None yet]',
    state_paths_config: join(reviewDir, 'deep-review-config.json'),
    state_paths_state_log: join(reviewDir, 'deep-review-state.jsonl'),
    state_paths_strategy: join(reviewDir, 'deep-review-strategy.md'),
    state_paths_findings_registry: join(reviewDir, 'deep-review-findings-registry.json'),
    state_paths_iteration_pattern: join(reviewDir, 'iterations', 'iteration-{NNN}.md'),
    state_paths_delta_pattern: join(reviewDir, 'deltas', 'iter-{NNN}.jsonl'),
    frontier_block: '',
  });

  const pivotInput = buildReviewPivotPreparationInput({
    artifactRoot: reviewDir,
    configPath: join(reviewDir, 'deep-review-config.json'),
    stateLogPath: join(reviewDir, 'deep-review-state.jsonl'),
    strategyPath: join(reviewDir, 'deep-review-strategy.md'),
    registryPath: join(reviewDir, 'deep-review-findings-registry.json'),
    currentIteration: 2,
    maxIterations: config.maxIterations,
    triggerReason: 'all_dimensions_clean',
  });

  const lineage = { label: 'alpha', kind: 'cli-opencode', model: 'fixture/model', iterations: 3 };
  const loopOptions = {
    stopPolicy: 'convergence',
    reviewFocus: 'error handling',
    reviewTarget: 'src',
    reviewTargetType: 'files',
    ...variant.loopOptions,
  };
  const lineagePrompt = buildLoopPrompt(
    'review',
    '.opencode/specs/system-speckit/999-golden',
    '.opencode/specs/system-speckit/999-golden/review/lineages/alpha',
    'golden-review-session',
    lineage,
    null,
    loopOptions,
  );
  const nativeInput = buildNativeCommandInput(
    'review',
    '.opencode/specs/system-speckit/999-golden',
    '.opencode/specs/system-speckit/999-golden/review/lineages/alpha',
    lineage,
    loopOptions,
  );

  const stateLogRows = readFileSync(join(reviewDir, 'deep-review-state.jsonl'), 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line));
  const decisionInput = buildStopDecisionInput(
    variant.convergenceArgs,
    'review',
    { config, registry, stateLogRows },
    { nodes: [], edges: [] },
  );

  return {
    'registry.json': normalize(`${JSON.stringify(registry, null, 2)}\n`, specFolder),
    'dashboard.md': normalize(reduced.dashboard, specFolder),
    'next-focus.txt': normalize(nextFocus, specFolder),
    'prompt-pack.md': normalize(promptPack, specFolder),
    // The pivot input echoes the config file verbatim, and the two variants write
    // different config files on purpose, so the echo is left out; every seed,
    // prior direction, seat and usage count the pivot derives is still compared.
    'pivot-seeds.json': normalize(`${JSON.stringify({ ...pivotInput, config: undefined }, null, 2)}\n`, specFolder),
    // The lineage prompt names the repository checkout it runs from, which differs
    // per worktree, so the checkout path is tokenized like the spec folder.
    'lineage-prompt.txt': `${lineagePrompt}\n--- native command input ---\n${nativeInput}\n`.split(process.cwd()).join('<CWD>'),
    'stop-decision-config.json': `${JSON.stringify(decisionInput.config, null, 2)}\n`,
  };
}

describe('review default path stays byte-identical without --depth-mode=expansive', () => {
  if (process.env.GOLDEN_UPDATE === '1') {
    it('writes the baselines from the absent-key variant', () => {
      const artifacts = renderArtifacts(VARIANTS[0]);
      mkdirSync(baselineDir, { recursive: true });
      for (const name of ARTIFACTS) writeFileSync(join(baselineDir, name), artifacts[name], 'utf8');
      expect(ARTIFACTS.length).toBe(7);
    });
    return;
  }

  for (const variant of VARIANTS) {
    for (const name of ARTIFACTS) {
      it(`${variant.name}: ${name} matches the baseline`, () => {
        const artifacts = renderArtifacts(variant);
        expect(artifacts[name]).toBe(readFileSync(join(baselineDir, name), 'utf8'));
      });
    }
  }
});
