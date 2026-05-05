// ───────────────────────────────────────────────────────────────
// MODULE: Explicit Author Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';
import { matchesPhraseBoundary, phraseSpecificity, skillNameVariants, tokenize } from '../text.js';

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
  css: [['sk-code', 0.55]],
  dashboard: [['sk-code', 0.35]],
  debug: [['sk-code', 0.25]],
  devtools: [['mcp-chrome-devtools', 1]],
  docs: [['sk-doc', 0.8]],
  documentation: [['sk-doc', 0.85]],
  findings: [['sk-code-review', 0.85]],
  frontend: [['sk-code', 0.7]],
  git: [['sk-git', 1]],
  github: [['sk-git', 0.95]],
  grep: [['mcp-coco-index', 0.45]],
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
  prompt: [['sk-improve-prompt', 0.75]],
  prompts: [['sk-improve-prompt', 0.75]],
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
  semantic: [['mcp-coco-index', 0.8]],
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
  // sk-code surface keywords: WEBFLOW frontend + OPENCODE system code.
  webflow: [['sk-code', 0.95]],
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
  lenis: [['sk-code', 0.85]],
  swiper: [['sk-code', 0.85]],
  hls: [['sk-code', 0.85]],
  filepond: [['sk-code', 0.85]],
  gsap: [['sk-code', 0.75]],
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
  '/spec_kit:deep-research': [['sk-deep-research', 1.6], ['command-spec-kit', 0.45]],
  '/spec_kit:deep-review': [['sk-deep-review', 1.6], ['command-spec-kit', 0.45]],
  '/spec_kit:resume': [['system-spec-kit', 0.9], ['command-spec-kit', 0.75]],
  'auto review release readiness': [['sk-deep-review', 1]],
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
  'cleaner prompt': [['sk-improve-prompt', 1]],
  'code review': [['sk-code-review', 1]],
  'classifier vocabulary': [['sk-code-review', 0.9]],
  'commonjs helper': [['sk-code', 1]],
  'create a prompt': [['sk-improve-prompt', 0.95]],
  'deep research': [['sk-deep-research', 1]],
  'deep review': [['sk-deep-review', 1]],
  'deep-research': [['sk-deep-research', 1.3]],
  'deep-review': [['sk-deep-review', 1.3]],
  'gate 3': [['system-spec-kit', 0.35], ['sk-code', 0.25]],
  'gate-3-classifier': [['sk-code', 1]],
  'generate implementation-summary': [['system-spec-kit', 1]],
  'implementation-summary.md': [['system-spec-kit', 0.8]],
  'continuation prompts': [['system-spec-kit', 0.9]],
  'first-100 predictions': [['system-spec-kit', 0.8]],
  'improve my prompt': [['sk-improve-prompt', 1]],
  'manual testing playbook': [['sk-doc', 1]],
  'negative-trigger whitelist': [['sk-code', 0.9]],
  'list any mismatches': [['sk-code-review', 0.8]],
  'pull request': [['sk-code-review', 0.45], ['sk-git', 0.45]],
  'resume deep research': [['sk-deep-research', 1]],
  'resume deep review': [['sk-deep-review', 1]],
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
  'semantic code search': [['mcp-coco-index', 1]],
  'source-type mix': [['system-spec-kit', 0.35]],
  'system prompt': [['sk-improve-prompt', 0.8]],
  'prompt variant': [['sk-improve-prompt', 1]],
  'user prompt': [['sk-improve-prompt', 0.9]],
  'cleaner user prompt': [['sk-improve-prompt', 1]],
  'vector-search': [['mcp-coco-index', 1]],
  // sk-code phrases: WEBFLOW frontend + OPENCODE system code.
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
  'webflow hero animation timing': [['sk-code', 0.95]],
  'lenis scroll lock': [['sk-code', 0.85]],
  'swiper carousel': [['sk-code', 0.85]],
  'hls video player': [['sk-code', 0.85]],
  'filepond upload': [['sk-code', 0.85]],
  'parallel routes': [['sk-code', 0.85]],
  'route handler': [['sk-code', 0.7]],
  'metadata api': [['sk-code', 0.65]],
};

const WRITE_VERBS = /\b(add|build|change|configure|create|edit|fix|generate|implement|modify|patch|refactor|rename|replace|run|update|write)\b/;
const MEMORY_PRESERVATION_SESSION_INTENT = /\b(preserve|remember|capture|keep|store)\b.*\b(next|future|later)\s+session\b|\b(next|future|later)\s+session\b.*\b(lose|lost|preserve|remember|capture|keep|store)\b/;

function push(scores: Map<string, { score: number; evidence: string[] }>, skillId: string, amount: number, evidence: string): void {
  const current = scores.get(skillId) ?? { score: 0, evidence: [] };
  current.score += amount;
  current.evidence.push(evidence);
  scores.set(skillId, current);
}

export function scoreExplicitLane(prompt: string, projection: AdvisorProjection): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = tokenize(prompt, true);
  const scores = new Map<string, { score: number; evidence: string[] }>();

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
  // F-013-C3-01: Review-plus-write disambiguation. When the prompt contains
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
  if (/\b(continue|resume|launch|kick off|overnight|convergence|iteration)\b/.test(lower) && /\bresearch\b/.test(lower)) {
    push(scores, 'sk-deep-research', 0.85, 'research-loop');
  }
  if (/\b(continue|resume|launch|start|convergence|iteration)\b/.test(lower) && /\breview\b/.test(lower)) {
    push(scores, 'sk-deep-review', 0.85, 'review-loop');
  }
  if (/\b(figure out|find|diagnose|debug)\b.{0,40}\b(wrong|broken|failing|bug|issue)\b.{0,40}\bcode\b|\b(wrong|broken|failing)\b.{0,30}\bcode\b/.test(lower)) {
    push(scores, 'sk-code-review', 0.9, 'ambiguous-code-problem');
    push(scores, 'sk-deep-review', 0.45, 'ambiguous-code-problem');
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
        push(scores, skill.id, phraseSpecificity(phrase), `author:${phrase}`);
      }
    }
  }

  return [...scores.entries()].map(([skillId, value]) => ({
    skillId,
    lane: 'explicit_author' as const,
    score: Math.min(value.score, 1),
    evidence: value.evidence.slice(0, 6),
  }));
}
