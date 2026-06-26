// ───────────────────────────────────────────────────────────────
// MODULE: Explicit Author Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';
import { matchesPhraseBoundary, phraseSpecificity, skillNameVariants, tokenize } from '../text.js';

interface ExplicitLaneOptions {
  readonly includeProducerIdentity?: boolean;
}

interface ExplicitScoreEntry {
  score: number;
  readonly evidence: string[];
  readonly producerSkillIds: Set<string>;
}

const TOKEN_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
  audit: [['sk-code-review', 0.75]],
  branch: [['sk-git', 0.45]],
  browser: [['sk-code', 0.55]],
  checklist: [['system-spec-kit', 0.55]],
  chrome: [['mcp-chrome-devtools', 0.95]],
  codex: [['cli-codex', 0.9]],
  commit: [['sk-git', 0.65]],
  commonjs: [['sk-code', 0.75]],
  context: [['system-spec-kit', 0.65]],
  corpus: [['system-spec-kit', 0.45]],
  council: [['deep-loop-workflows', 0.9]],
  css: [['sk-code', 0.55]],
  dashboard: [['sk-code', 0.35]],
  deliberation: [['deep-loop-workflows', 0.8]],
  debug: [['sk-code', 0.25]],
  devtools: [['mcp-chrome-devtools', 1]],
  docs: [['sk-doc', 0.8]],
  documentation: [['sk-doc', 0.85]],
  findings: [['sk-code-review', 0.85]],
  frontend: [['sk-code', 0.7]],
  git: [['sk-git', 1]],
  github: [['sk-git', 0.95]],
  grep: [['system-code-graph', 0.45]],
  har: [['mcp-chrome-devtools', 0.75]],
  html: [['sk-code', 0.55]],
  javascript: [['sk-code', 0.65]],
  json: [['sk-code', 0.4]],
  jsonl: [['sk-code', 0.45], ['system-spec-kit', 0.35]],
  layout: [['sk-code', 0.45]],
  mcp: [['sk-code', 0.65], ['mcp-code-mode', 0.45]],
  memory: [['system-spec-kit', 0.95]],
  mobile: [['sk-code', 0.45]],
  opencode: [['sk-code', 1]],
  packet: [['system-spec-kit', 0.55]],
  playbook: [['sk-doc', 0.75]],
  pr: [['sk-code-review', 0.5], ['sk-git', 0.35]],
  prompt: [['sk-prompt', 0.75]],
  prompts: [['sk-prompt', 0.75]],
  python: [['sk-code', 0.7]],
  readme: [['sk-doc', 0.95]],
  rebase: [['sk-git', 0.85]],
  reducer: [['sk-code', 0.35]],
  regression: [['sk-code-review', 0.55]],
  responsive: [['sk-code', 0.55]],
  review: [['sk-code-review', 0.85]],
  reviewer: [],
  routing: [['system-spec-kit', 0.25]],
  save: [['system-spec-kit', 0.6]],
  semantic: [['system-code-graph', 0.55]],
  shell: [['sk-code', 0.55]],
  staging: [['mcp-chrome-devtools', 0.35]],
  style: [['sk-code', 0.4]],
  taxonomy: [['sk-doc', 0.45]],
  tests: [['sk-code', 0.35]],
  typescript: [['sk-code', 0.75]],
  vitest: [['sk-code', 0.85]],
  viewport: [['sk-code', 0.45]],
  vscode: [['sk-code', 0.75]],
  web: [['sk-code', 0.5]],
  worktree: [['sk-git', 1]],
  delete: [['system-spec-kit', 0.45]],
  scratch: [['system-spec-kit', 0.45]],
  // sk-code surface keywords: frontend and system-code surfaces.
  animation: [['sk-code', 0.75]],
  flicker: [['sk-code', 0.4]],
  minify: [['sk-code', 0.65]],
  cdn: [['sk-code', 0.55]],
  lighthouse: [['sk-code', 0.65]],
  pagespeed: [['sk-code', 0.65]],
  tbt: [['sk-code', 0.65]],
  inp: [['sk-code', 0.65]],
  lcp: [['sk-code', 0.55]],
  fcp: [['sk-code', 0.55]],
  cls: [['sk-code', 0.55]],
  motion: [['sk-code', 0.6]],
  observer: [['sk-code', 0.4]],
  intersection: [['sk-code', 0.4]],
  classifier: [['sk-code', 0.45]],
  fixture: [['sk-code', 0.55]],
  'gate-3-classifier': [['sk-code', 0.95]],
  'negative-trigger': [['sk-code', 0.8]],
};

const PHRASE_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
  '/create:agent': [['create:agent', 1.6], ['sk-doc', 0.45]],
  '/create:testing-playbook': [['create:testing-playbook', 1.8], ['command-create-testing-playbook', 1.2], ['sk-doc', 0.2]],
  '/memory:save': [['memory:save', 1.6], ['command-memory-save', 1], ['system-spec-kit', 0.45]],
  '/deep:start-research-loop': [['deep-loop-workflows', 1.6], ['command-spec-kit', 0.45]],
  '/deep:start-review-loop': [['deep-loop-workflows', 1.6], ['command-spec-kit', 0.45]],
  '/deep:start-model-benchmark-loop': [['deep-model-benchmark', 1.6], ['command-spec-kit', 0.45]],
  '/deep:start-agent-improvement-loop': [['deep-loop-workflows', 1.6], ['command-spec-kit', 0.45]],
  '/speckit:resume': [['system-spec-kit', 0.9], ['command-spec-kit', 0.75]],
  'auto review release readiness': [['deep-loop-workflows', 1]],
  // Colon-command syntax (":review:auto") is a deep-review LOOP invocation,
  // distinct from natural-language "auto review this PR" (which stays
  // sk-code-review). Strong direct-evidence anchor + a bounded code-review
  // penalty so the loop skill wins the rank.
  ':review:auto': [['deep-loop-workflows', 1.6], ['sk-code-review', -0.6]],
  ':review:confirm': [['deep-loop-workflows', 1.6], ['sk-code-review', -0.6]],
  // Domain phrase anchors (multi-token, so they lift confidence via the direct
  // lane without firing on single tokens like "scan"/"profile"/"search"/"cms").
  'webflow cms': [['mcp-code-mode', 1.5], ['sk-code', -0.5]],
  'cms collection': [['mcp-code-mode', 1.4]],
  'structural search': [['system-code-graph', 1.5]],
  'code graph search': [['system-code-graph', 1.5]],
  'find code that': [['system-code-graph', 1.4]],
  'code that handles': [['system-code-graph', 1.4]],
  '5d scoring': [['deep-loop-workflows', 1.5]],
  '5-dimension agent scoring': [['deep-loop-workflows', 1.6]],
  'integration scan': [['deep-loop-workflows', 1.5]],
  'dynamic profile': [['deep-loop-workflows', 1.5]],
  // Lane B (model-benchmark) command anchors. These benchmark or optimize a
  // model / prompt framework against fixtures, routed by the
  // /deep:start-model-benchmark-loop command (canonical deep-model-benchmark).
  // Lane B runs as a MODE of the agent-improvement skill, now folded into
  // deep-loop-workflows. The projection exposes that merged node, so the
  // disambiguation penalty must target deep-loop-workflows to actually lower the
  // ranked Lane A candidate; an alias-shaped target is not a projection node and
  // its penalty would be inert. The bounded penalty keeps benchmark phrasing
  // from out-ranking deep-model-benchmark.
  'benchmark a model': [['deep-model-benchmark', 1.6], ['deep-loop-workflows', -0.6]],
  'benchmark a prompt framework': [['deep-model-benchmark', 1.6], ['deep-loop-workflows', -0.6]],
  'benchmark a prompt': [['deep-model-benchmark', 1.4], ['deep-loop-workflows', -0.4]],
  'optimize a model': [['deep-model-benchmark', 1.5], ['deep-loop-workflows', -0.6]],
  'optimize a prompt framework': [['deep-model-benchmark', 1.5], ['deep-loop-workflows', -0.6]],
  'model benchmark loop': [['deep-model-benchmark', 1.6], ['deep-loop-workflows', -0.4]],
  'model benchmark': [['deep-model-benchmark', 1.4], ['deep-loop-workflows', -0.4]],
  'benchmark fixtures': [['deep-model-benchmark', 1.3]],
  'prompt framework benchmark': [['deep-model-benchmark', 1.5], ['deep-loop-workflows', -0.4]],
  'chrome devtools': [['mcp-chrome-devtools', 1]],
  'staging url': [['mcp-chrome-devtools', 0.65]],
  'staging site': [['mcp-chrome-devtools', 0.65]],
  'staging website': [['mcp-chrome-devtools', 0.65]],
  'live site': [['mcp-chrome-devtools', 0.65]],
  'live website': [['mcp-chrome-devtools', 0.65]],
  'live url': [['mcp-chrome-devtools', 0.65]],
  'production site': [['mcp-chrome-devtools', 0.65]],
  'production website': [['mcp-chrome-devtools', 0.65]],
  'production url': [['mcp-chrome-devtools', 0.65]],
  'browser console': [['mcp-chrome-devtools', 0.75]],
  'cleaner prompt': [['sk-prompt', 1]],
  'code review': [['sk-code-review', 1]],
  'review the routing': [['sk-code-review', 0.6]],
  'review the taxonomy': [['sk-code-review', 0.6]],
  'review the routing taxonomy': [['sk-code-review', 1.1], ['sk-doc', -0.4]],
  'review the packet docs': [['sk-code-review', 1.2]],
  'audit packet docs': [['sk-code-review', 1.2]],
  'documented consistently': [['sk-code-review', 1]],
  'scoped correctly': [['sk-code-review', 1]],
  'iteration is scoped': [['sk-code-review', 1]],
  'classifier vocabulary': [['sk-code-review', 0.9]],
  'commonjs helper': [['sk-code', 1]],
  'create a prompt': [['sk-prompt', 0.95]],
  'deep research': [['deep-loop-workflows', 1]],
  'deep review': [['deep-loop-workflows', 1]],
  'deep ai council': [['deep-loop-workflows', 1.6]],
  'deep-ai-council': [['deep-loop-workflows', 1.6]],
  'deep-research': [['deep-loop-workflows', 1.3]],
  'deep-review': [['deep-loop-workflows', 1.3]],
  'ai council': [['deep-loop-workflows', 1.4]],
  'planning council': [['deep-loop-workflows', 1.2]],
  'council deliberation': [['deep-loop-workflows', 1.4]],
  'persist council artifacts': [['deep-loop-workflows', 1.2]],
  'ai-council artifacts': [['deep-loop-workflows', 1.2]],
  'multi-ai-council': [['deep-loop-workflows', 1.2]],
  'gate 3': [['system-spec-kit', 0.35], ['sk-code', 0.25]],
  'gate-3-classifier': [['sk-code', 1]],
  'generate implementation-summary': [['system-spec-kit', 1]],
  'implementation-summary.md': [['system-spec-kit', 0.8]],
  'continuation prompts': [['system-spec-kit', 0.9]],
  'first-100 predictions': [['system-spec-kit', 0.8]],
  'improve my prompt': [['sk-prompt', 1]],
  'manual testing playbook': [['sk-doc', 1]],
  'negative-trigger whitelist': [['sk-code', 0.9]],
  'list any mismatches': [['sk-code-review', 0.8]],
  'pull request': [['sk-code-review', 0.45], ['sk-git', 0.45]],
  'resume deep research': [['deep-loop-workflows', 1]],
  'resume deep review': [['deep-loop-workflows', 1]],
  'resume the phase folder': [['system-spec-kit', 1]],
  'phase folder': [['system-spec-kit', 0.75]],
  'routing dashboard': [['sk-code', 0.35]],
  'routing study config': [['system-spec-kit', 0.85]],
  'css layout': [['sk-code', 0.85]],
  'viewport height': [['sk-code', 0.55]],
  'mobile browser': [['sk-code', 0.6]],
  'browser verification': [['sk-code', 0.7]],
  'create a new agent': [['create:agent', 1.6], ['sk-doc', 0.45]],
  'create a test playbook': [['create:testing-playbook', 1.8], ['command-create-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'create a testing playbook': [['create:testing-playbook', 1.8], ['command-create-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'create new agent': [['create:agent', 1.6], ['sk-doc', 0.45]],
  'create test playbook': [['create:testing-playbook', 1.8], ['command-create-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'create testing playbook': [['create:testing-playbook', 1.8], ['command-create-testing-playbook', 1.2], ['sk-doc', 0.2]],
  'save context': [['memory:save', 1.6], ['command-memory-save', 1], ['system-spec-kit', 0.45]],
  'save memory': [['memory:save', 1.6], ['command-memory-save', 1], ['system-spec-kit', 0.45]],
  'semantic code search': [['system-code-graph', 0.8]],
  'source-type mix': [['system-spec-kit', 0.35]],
  'system prompt': [['sk-prompt', 0.8]],
  'prompt variant': [['sk-prompt', 1]],
  'user prompt': [['sk-prompt', 0.9]],
  'cleaner user prompt': [['sk-prompt', 1]],
  'vector-search': [['system-code-graph', 0.6]],
  // sk-code phrases: frontend and system-code surfaces.
  'motion v12': [['sk-code', 0.6]],
  'opencode skill': [['sk-code', 0.95]],
  'opencode agent': [['sk-code', 0.85]],
  'opencode command': [['sk-code', 0.85]],
  'opencode plugin': [['sk-code', 0.85]],
  'smart router': [['sk-code', 0.65]],
  'language standards': [['sk-code', 0.6]],
  'typescript helper': [['sk-code', 0.75]],
  'python script': [['sk-code', 0.75]],
  'shell script': [['sk-code', 0.7]],
  'frontend hero animation timing': [['sk-code', 0.95]],
  'parallel routes': [['sk-code', 0.85]],
  'route handler': [['sk-code', 0.7]],
  'metadata api': [['sk-code', 0.65]],
};

const WRITE_VERBS = /\b(add|build|change|configure|create|edit|fix|generate|implement|modify|patch|refactor|rename|replace|run|update|write)\b/;
const MEMORY_PRESERVATION_SESSION_INTENT = /\b(preserve|remember|capture|keep|store)\b.*\b(next|future|later)\s+session\b|\b(next|future|later)\s+session\b.*\b(lose|lost|preserve|remember|capture|keep|store)\b/;

function push(
  scores: Map<string, ExplicitScoreEntry>,
  skillId: string,
  amount: number,
  evidence: string,
  producerSkillId?: string,
): void {
  const current = scores.get(skillId) ?? { score: 0, evidence: [], producerSkillIds: new Set<string>() };
  current.score += amount;
  current.evidence.push(evidence);
  if (producerSkillId) {
    current.producerSkillIds.add(producerSkillId);
  }
  scores.set(skillId, current);
}

export function scoreExplicitLane(
  prompt: string,
  projection: AdvisorProjection,
  options: ExplicitLaneOptions = {},
): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = tokenize(prompt, true);
  const scores = new Map<string, ExplicitScoreEntry>();

  for (const [phrase, boosts] of Object.entries(PHRASE_BOOSTS)) {
    if (!lower.includes(phrase)) continue;
    for (const [skillId, amount] of boosts) {
      push(scores, skillId, amount, `phrase:${phrase}`);
    }
  }

  for (const token of tokens) {
    for (const [skillId, amount] of TOKEN_BOOSTS[token] ?? []) {
      push(scores, skillId, amount, `token:${token}`);
    }
  }

  if (WRITE_VERBS.test(lower) && /\b(readme|docs|documentation|playbook|taxonomy|markdown|feature_catalog)\b/.test(lower)) {
    push(scores, 'sk-doc', 0.7, 'write-doc-surface');
  }
  if (WRITE_VERBS.test(lower) && /\b(classifier|helper|fixture|json|jsonl|vitest|typescript|python|script|skill_advisor\.py|mcp\.json|commonjs)\b/.test(lower)) {
    push(scores, 'sk-code', 0.7, 'write-system-code-surface');
  }
  if (WRITE_VERBS.test(lower) && /\b(error classes|trigger gap|reporter|mismatches?|bucket|gate 3)\b/.test(lower)) {
    push(scores, 'sk-code', 0.6, 'write-routing-tool-surface');
  }
  if (MEMORY_PRESERVATION_SESSION_INTENT.test(lower)) {
    push(scores, 'memory:save', 1.2, 'memory-preservation-session-intent');
    push(scores, 'command-memory-save', 0.8, 'memory-preservation-session-intent');
    push(scores, 'system-spec-kit', 0.3, 'memory-preservation-session-intent');
  }
  if (lower.includes('/speckit:resume')) {
    push(scores, 'system-spec-kit', 0.4, 'speckit-resume-skill-disambiguation');
    push(scores, 'command-spec-kit', -1.0, 'speckit-resume-skill-disambiguation');
  }
  // Review-plus-write disambiguation. When the prompt contains
  // the word `review` AND any explicit write/edit verb (`update|edit|fix|modify`),
  // the request is implementation work, not a code review. Nudge the explicit
  // lane toward `sk-code` and away from `sk-code-review`. The magnitudes
  // (+3.0 / -2.0) are calibrated to overcome the combined `review` signals
  // (token boost + intent boost + name match + graph sibling/enhances edges
  // to sk-code-review) that otherwise keep sk-code-review on top. The lane's
  // emit clamps with `Math.min(value.score, 1)` so per-skill score stays
  // within [-1, 1]; the wide raw magnitude is needed because graph boosts
  // compound through downstream layers. Pure review prompts (no write verb)
  // are unaffected — they keep routing to `sk-code-review` via the existing
  // `review` token boost above.
  if (/\breview\b/.test(lower) && /\b(update|edit|fix|modify)\b/.test(lower)) {
    push(scores, 'sk-code', 3.0, 'review-plus-write-disambiguation');
    push(scores, 'sk-code-review', -2.0, 'review-plus-write-disambiguation');
  }
  if (/\b(continue|resume|launch|kick off|overnight|convergence|iteration|iterative|multi-pass|loop)\b/.test(lower) && /\bresearch\b/.test(lower)) {
    push(scores, 'deep-loop-workflows', 0.85, 'research-loop');
  }
  // Disambiguation: "cli-opencode" / "cli opencode" / "opencode CLI" routes to the
  // cli-opencode orchestrator skill. Bare "opencode" continues to route to sk-code
  // (the project's primary opencode-stack code-author skill) via the `opencode` token
  // boost above. This regex matches the explicit CLI/orchestrator framing.
  if (/\bcli[-\s]opencode\b|\bopencode[-\s]cli\b/.test(lower)) {
    push(scores, 'cli-opencode', 0.9, 'cli-opencode-orchestrator');
    push(scores, 'sk-code', -0.5, 'cli-opencode-disambiguation');
  }
  if (/\b(continue|resume|launch|start|convergence|iteration|iterative|multi-pass|loop)\b/.test(lower) && /\breview\b/.test(lower)) {
    push(scores, 'deep-loop-workflows', 0.85, 'review-loop');
    if (/\b(audit|spec folder|packet|convergence)\b/.test(lower)) {
      push(scores, 'sk-code-review', -0.6, 'iterative-review-vs-pr-disambiguation');
    }
  }
  if (/\b(figure out|find|diagnose|debug)\b.{0,40}\b(wrong|broken|failing|bug|issue)\b.{0,40}\bcode\b|\b(wrong|broken|failing)\b.{0,30}\bcode\b/.test(lower)) {
    push(scores, 'sk-code-review', 0.9, 'ambiguous-code-problem');
    push(scores, 'deep-loop-workflows', 0.45, 'ambiguous-code-problem');
    push(scores, 'sk-code', -0.45, 'ambiguous-code-problem');
  }

  for (const skill of projection.skills) {
    for (const variant of skillNameVariants(skill.id)) {
      if (matchesPhraseBoundary(lower, variant)) {
        push(scores, skill.id, 1, `explicit:${variant}`);
      }
    }
    for (const phrase of [...skill.intentSignals, ...skill.keywords]) {
      if (matchesPhraseBoundary(lower, phrase)) {
        push(
          scores,
          skill.id,
          phraseSpecificity(phrase),
          `author:${phrase}`,
          options.includeProducerIdentity ? skill.id : undefined,
        );
      }
    }
  }

  return [...scores.entries()].map(([skillId, value]) => {
    const producerSkillIds = [...value.producerSkillIds].sort();
    return {
      skillId,
      lane: 'explicit_author' as const,
      score: Math.min(value.score, 1),
      evidence: value.evidence.slice(0, 6),
      ...(producerSkillIds.length > 0 ? { producerSkillIds } : {}),
    };
  });
}
