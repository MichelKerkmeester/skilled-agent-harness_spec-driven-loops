// ───────────────────────────────────────────────────────────────────
// TEST: Research default-path golden byte identity
// ───────────────────────────────────────────────────────────────────
// The opt-in expansive depth mode touches the reducer, the stop decision,
// the prompt pack and the fan-out lineage prompt. A run that never asks for
// it must render the same bytes, so this suite renders the six default-path
// artifacts for one fixed research packet and compares them to baselines
// captured before any depth-mode code existed. One exception: the lineage
// prompt embeds the agent persona, whose leaf contract gained a paragraph that
// applies only to expansive runs. That paragraph alone is stripped before the
// lineage prompt is compared; see withoutExpansiveOnlyPersona below.
//
// Regenerate the baselines only on a tree that predates the depth-mode code:
//   GOLDEN_UPDATE=1 npx vitest run research-depth-mode-golden.vitest
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { renderPromptPack } from '../../lib/deep-loop/prompt-pack';

const nodeRequire = createRequire(import.meta.url);
const testDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(testDir, '..', '..', '..');
const baselineDir = resolve(testDir, '..', 'fixtures', 'golden-research-default');
const templatePath = join(skillRoot, 'deep-research', 'assets', 'prompt-pack-iteration.md.tmpl');

const { reduceResearchState } = nodeRequire(join(skillRoot, 'deep-research', 'scripts', 'reduce-state.cjs')) as {
  reduceResearchState: (specFolder: string, options?: Record<string, unknown>) => {
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
const { buildLoopPrompt } = nodeRequire(join(skillRoot, 'runtime', 'scripts', 'fanout-run.cjs')) as {
  buildLoopPrompt: (...args: unknown[]) => string;
};

const ARTIFACTS = [
  'registry.json',
  'dashboard.md',
  'next-focus.txt',
  'prompt-pack.md',
  'lineage-prompt.txt',
  'stop-decision-config.json',
] as const;

type Artifact = (typeof ARTIFACTS)[number];

// A default run written before the flag existed carries no depth keys; one
// written after it carries the explicit default. Both must render the same bytes.
type Variant = {
  name: string;
  configExtras: Record<string, unknown>;
  convergenceArgs: Record<string, unknown>;
};

const VARIANTS: Variant[] = [
  { name: 'depthMode absent', configExtras: {}, convergenceArgs: { convergenceMode: 'default' } },
  {
    name: 'explicit --depth-mode=default',
    configExtras: {
      antiConvergence: { convergenceMode: 'default', depthMode: 'default' },
      expansiveDepth: { maxDepth: 3, maxChildrenPerNode: 6 },
    },
    convergenceArgs: { convergenceMode: 'default', depthMode: 'default' },
  },
];

const tempRoots: string[] = [];

afterEach(() => {
  while (tempRoots.length > 0) rmSync(tempRoots.pop() as string, { recursive: true, force: true });
});

function strategyText(): string {
  return [
    '# Deep Research Strategy',
    '',
    '<!-- ANCHOR:key-questions -->',
    '## 3. KEY QUESTIONS (remaining)',
    '- [ ] Q1: Which module owns the stop decision?',
    '- [ ] Q2: How does the reducer pick the next focus?',
    '- [ ] Q3: What writes the question inbox?',
    '<!-- /ANCHOR:key-questions -->',
    '',
    '<!-- ANCHOR:answered-questions -->',
    '## 6. ANSWERED QUESTIONS',
    '[None yet]',
    '<!-- /ANCHOR:answered-questions -->',
    '',
    '<!-- ANCHOR:what-worked -->',
    '## 7. WHAT WORKED',
    '[None yet]',
    '<!-- /ANCHOR:what-worked -->',
    '',
    '<!-- ANCHOR:what-failed -->',
    '## 8. WHAT FAILED',
    '[None yet]',
    '<!-- /ANCHOR:what-failed -->',
    '',
    '<!-- ANCHOR:exhausted-approaches -->',
    '## 9. EXHAUSTED APPROACHES (do not retry)',
    '[None yet]',
    '<!-- /ANCHOR:exhausted-approaches -->',
    '',
    '<!-- ANCHOR:ruled-out-directions -->',
    '## 10. RULED OUT DIRECTIONS',
    '[None yet]',
    '<!-- /ANCHOR:ruled-out-directions -->',
    '',
    '<!-- ANCHOR:carried-forward-open-questions -->',
    '## 11A. CARRIED-FORWARD OPEN QUESTIONS',
    '[None yet]',
    '<!-- /ANCHOR:carried-forward-open-questions -->',
    '',
    '<!-- ANCHOR:next-focus -->',
    '## 11. NEXT FOCUS',
    '[None yet]',
    '<!-- /ANCHOR:next-focus -->',
    '',
  ].join('\n');
}

function iterationRows(): Array<Record<string, unknown>> {
  const shared = { type: 'iteration', sessionId: 'golden-session', generation: 1, ruledOut: [] };
  return [
    {
      ...shared,
      run: 1,
      iteration: 1,
      status: 'complete',
      focus: 'Which module owns the stop decision?',
      findingsCount: 2,
      newInfoRatio: 0.6,
      keyQuestions: ['Which module owns the stop decision?'],
      answeredQuestions: ['Which module owns the stop decision?'],
      timestamp: '2026-06-19T00:10:00.000Z',
    },
    {
      ...shared,
      run: 2,
      iteration: 2,
      status: 'complete',
      focus: 'How does the reducer pick the next focus?',
      findingsCount: 1,
      newInfoRatio: 0.3,
      keyQuestions: ['How does the reducer pick the next focus?'],
      answeredQuestions: [],
      timestamp: '2026-06-19T00:20:00.000Z',
    },
  ];
}

function writeFixture(variant: Variant): string {
  const root = mkdtempSync(join(tmpdir(), 'research-golden-'));
  tempRoots.push(root);
  const specFolder = join(root, 'spec');
  const researchDir = join(specFolder, 'research');
  mkdirSync(researchDir, { recursive: true });
  writeFileSync(join(specFolder, 'spec.md'), '# Golden Packet\n', 'utf8');
  const config = {
    topic: 'Golden default-path research',
    createdAt: '2026-06-19T00:00:00.000Z',
    status: 'running',
    maxIterations: 10,
    convergenceThreshold: 0.05,
    stuckThreshold: 3,
    stopPolicy: 'convergence',
    resource_map: { emit: false },
    lineage: { sessionId: 'golden-session', generation: 1, lineageMode: 'new' },
    ...variant.configExtras,
  };
  writeFileSync(join(researchDir, 'deep-research-config.json'), `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  writeFileSync(join(researchDir, 'deep-research-strategy.md'), strategyText(), 'utf8');
  writeFileSync(
    join(researchDir, 'deep-research-state.jsonl'),
    `${iterationRows().map((row) => JSON.stringify(row)).join('\n')}\n`,
    'utf8',
  );
  writeFileSync(
    join(researchDir, 'inbox.jsonl'),
    `${JSON.stringify({ text: 'Where are lineage prompts built?', source: 'operator', injectedAtIteration: 2 })}\n`,
    'utf8',
  );
  return specFolder;
}

function nextFocusSection(strategy: string): string {
  const match = strategy.match(/<!-- ANCHOR:next-focus -->([\s\S]*?)<!-- \/ANCHOR:next-focus -->/);
  return match ? match[1] : '';
}

// Temp paths differ per run, so each is replaced with a stable token before comparison.
function normalize(text: string, specFolder: string): string {
  return text.split(specFolder).join('<SPEC>');
}

// The lineage prompt embeds the agent persona verbatim. The persona's leaf
// contract carries one paragraph that applies only when an iteration prompt
// holds a FRONTIER block, which a default run never renders. That paragraph
// alone is removed before comparison; any other persona or prompt byte still
// has to match the baseline.
const EXPANSIVE_ONLY_PERSONA_PARAGRAPH =
  /\n\n\*\*Frontier proposals \(expansive depth runs only\)\.\*\*[^\n]*\n[^\n]*\nYou only propose\.[^\n]*/;

function withoutExpansiveOnlyPersona(prompt: string): string {
  return prompt.replace(EXPANSIVE_ONLY_PERSONA_PARAGRAPH, '');
}

function renderArtifacts(variant: Variant): Record<Artifact, string> {
  const specFolder = writeFixture(variant);
  const researchDir = join(specFolder, 'research');
  const config = JSON.parse(readFileSync(join(researchDir, 'deep-research-config.json'), 'utf8'));
  const reduced = reduceResearchState(specFolder, { write: false });
  const registry = reduced.registry;
  const nextFocus = nextFocusSection(reduced.strategy);
  const openQuestions = Array.isArray(registry.openQuestions) ? registry.openQuestions : [];

  const promptPack = renderPromptPack(templatePath, {
    state_summary: 'Iteration 2 of 10',
    research_topic: config.topic,
    current_iteration: 3,
    max_iterations: config.maxIterations,
    max_tool_calls_per_iteration: 12,
    next_focus: nextFocus.trim(),
    remaining_questions_list: JSON.stringify(openQuestions),
    carried_forward_open_questions: '[None yet]',
    last_3_summaries: '[None yet]',
    pivot_lineage: '[None yet]',
    saturated_directions: '[None yet]',
    state_paths_config: join(researchDir, 'deep-research-config.json'),
    state_paths_state_log: join(researchDir, 'deep-research-state.jsonl'),
    state_paths_strategy: join(researchDir, 'deep-research-strategy.md'),
    state_paths_registry: join(researchDir, 'findings-registry.json'),
    state_paths_iteration_pattern: join(researchDir, 'iterations', 'iteration-{NNN}.md'),
    state_paths_delta_pattern: join(researchDir, 'deltas', 'iter-{NNN}.jsonl'),
    frontier_block: '',
  });

  const lineagePrompt = buildLoopPrompt(
    'research',
    '.opencode/specs/system-speckit/999-golden',
    '.opencode/specs/system-speckit/999-golden/research/lineages/alpha',
    'golden-session',
    { label: 'alpha', kind: 'cli-opencode', model: 'fixture/model', iterations: 3 },
    config.topic,
    { stopPolicy: 'convergence' },
  );

  const stateLogRows = readFileSync(join(researchDir, 'deep-research-state.jsonl'), 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line));
  const decisionInput = buildStopDecisionInput(
    variant.convergenceArgs,
    'research',
    { config, registry, stateLogRows },
    { nodes: [], edges: [] },
  );

  return {
    'registry.json': normalize(`${JSON.stringify(registry, null, 2)}\n`, specFolder),
    'dashboard.md': normalize(reduced.dashboard, specFolder),
    'next-focus.txt': normalize(nextFocus, specFolder),
    'prompt-pack.md': normalize(promptPack, specFolder),
    // The lineage prompt resolves its write surface against the working directory,
    // so that prefix is tokenized and the baseline holds in any checkout.
    'lineage-prompt.txt': withoutExpansiveOnlyPersona(lineagePrompt.split(process.cwd()).join('<CWD>')),
    'stop-decision-config.json': `${JSON.stringify(decisionInput.config, null, 2)}\n`,
  };
}

describe('research default path stays byte-identical without --depth-mode=expansive', () => {
  if (process.env.GOLDEN_UPDATE === '1') {
    it('writes the baselines from the absent-key variant', () => {
      const artifacts = renderArtifacts(VARIANTS[0]);
      mkdirSync(baselineDir, { recursive: true });
      for (const name of ARTIFACTS) writeFileSync(join(baselineDir, name), artifacts[name], 'utf8');
      expect(ARTIFACTS.length).toBe(6);
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
