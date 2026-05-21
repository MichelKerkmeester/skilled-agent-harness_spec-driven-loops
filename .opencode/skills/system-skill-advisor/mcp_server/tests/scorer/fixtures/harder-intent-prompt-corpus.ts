// ───────────────────────────────────────────────────────────────
// MODULE: Harder Advisor Intent Prompt Corpus
// ───────────────────────────────────────────────────────────────

export interface HarderIntentEntry {
  readonly prompt: string;
  readonly expectedSkill: string;
  readonly category: 'lexical-mis-route';
  readonly reason: string;
}

export const HARDER_INTENT_PROMPT_CORPUS: ReadonlyArray<HarderIntentEntry> = [
  {
    prompt: 'Before the next handoff, rebuild the work packet ledger and prove the closure gates are internally consistent.',
    expectedSkill: 'system-spec-kit',
    category: 'lexical-mis-route',
    reason: 'Uses git/review-like closure language while avoiding spec, memory, context, and validation terms.',
  },
  {
    prompt: 'Capture the current operating state so a later session can resume without rereading every artifact.',
    expectedSkill: 'system-spec-kit',
    category: 'lexical-mis-route',
    reason: 'Intent is continuity preservation, but wording avoids save memory/context and may look like generic docs.',
  },
  {
    prompt: 'Turn this scattered onboarding note into a polished operator-facing playbook with examples and stable headings.',
    expectedSkill: 'sk-doc',
    category: 'lexical-mis-route',
    reason: 'Playbook and headings hint docs, but onboarding/operator terms can drift toward system workflow skills.',
  },
  {
    prompt: 'Rework this usage narrative so it reads like an install path people can follow without extra explanation.',
    expectedSkill: 'sk-doc',
    category: 'lexical-mis-route',
    reason: 'Avoids README, markdown, and documentation while describing guide authoring.',
  },
  {
    prompt: 'Package these local edits into a reviewable change with a clean history and remote branch ready for handoff.',
    expectedSkill: 'sk-git',
    category: 'lexical-mis-route',
    reason: 'Reviewable change and handoff can pull toward review/spec skills without explicit git terms.',
  },
  {
    prompt: 'Set up an isolated lane for this risky experiment, then publish the final patch series for maintainers.',
    expectedSkill: 'sk-git',
    category: 'lexical-mis-route',
    reason: 'Isolated lane and patch series describe branch/worktree flow but avoid the strongest git trigger words.',
  },
  {
    prompt: 'Rewrite these instructions so a smaller model follows the constraints instead of improvising around them.',
    expectedSkill: 'sk-prompt',
    category: 'lexical-mis-route',
    reason: 'Instruction rewriting is prompt work, but smaller model/constraints may look like code-agent governance.',
  },
  {
    prompt: 'Score this task brief for ambiguity, missing inputs, and whether the requested behavior is testable.',
    expectedSkill: 'sk-prompt',
    category: 'lexical-mis-route',
    reason: 'Quality scoring of a brief avoids prompt/CLEAR terms and may route to review because of testability.',
  },
  {
    prompt: 'I only know the behavior in plain language; locate the implementation without relying on symbol names.',
    expectedSkill: 'mcp-coco-index',
    category: 'lexical-mis-route',
    reason: 'Semantic code discovery intent avoids code-search/Coco terms and may be pulled by implementation/code words.',
  },
  {
    prompt: 'Find modules that behave like this description even if their filenames and exported functions say something else.',
    expectedSkill: 'mcp-coco-index',
    category: 'lexical-mis-route',
    reason: 'Natural-language retrieval is implied, but find/modules/functions can strengthen sk-code lexical matching.',
  },
  {
    prompt: 'Bundle several connector calls into one typed execution and return only the compact structured result.',
    expectedSkill: 'mcp-code-mode',
    category: 'lexical-mis-route',
    reason: 'Typed execution and connector calls describe Code Mode while avoiding MCP/tool-chain trigger phrases.',
  },
  {
    prompt: 'Drive the external integrations through a single script so the transcript stays small.',
    expectedSkill: 'mcp-code-mode',
    category: 'lexical-mis-route',
    reason: 'External integrations and script may pull toward sk-code without explicit Code Mode terms.',
  },
  {
    prompt: 'Open the local interface, reproduce the broken interaction, and capture the page evidence from the runtime.',
    expectedSkill: 'mcp-chrome-devtools',
    category: 'lexical-mis-route',
    reason: 'Runtime page evidence implies browser tooling, but broken interaction can route to sk-code/sk-code-review.',
  },
  {
    prompt: 'Inspect what the rendered page actually did after the click, including network and visual proof.',
    expectedSkill: 'mcp-chrome-devtools',
    category: 'lexical-mis-route',
    reason: 'Avoids Chrome/DevTools/console while using page/network terms that overlap frontend code work.',
  },
  {
    prompt: 'Ask the search-grounded external model to sweep the architecture and report what this repo is missing.',
    expectedSkill: 'cli-gemini',
    category: 'lexical-mis-route',
    reason: 'Search-grounded external model implies Gemini, but repo architecture terms can route to cli-codex/sk-code.',
  },
  {
    prompt: 'Use the Google-backed second opinion for a wide-context read before we decide on the design.',
    expectedSkill: 'cli-gemini',
    category: 'lexical-mis-route',
    reason: 'Google-backed wide-context read describes Gemini CLI but avoids its explicit skill and CLI phrases.',
  },
  {
    prompt: 'Run repeated evidence-gathering passes until the question stops producing new information, then synthesize.',
    expectedSkill: 'deep-research',
    category: 'lexical-mis-route',
    reason: 'Convergent investigation is research-loop work, but evidence passes may look like review/audit.',
  },
  {
    prompt: 'Keep an external state trail while investigating this unknown area across multiple fresh passes.',
    expectedSkill: 'deep-research',
    category: 'lexical-mis-route',
    reason: 'Avoids deep research wording while describing its externalized iterative workflow.',
  },
  {
    prompt: 'Make several independent passes over this change, stop when findings converge, and rank the release risks.',
    expectedSkill: 'deep-review',
    category: 'lexical-mis-route',
    reason: 'Uses generic risk language that may route to sk-code-review without explicit deep-review triggers.',
  },
  {
    prompt: 'Audit the implementation repeatedly with a persistent state log until only residual issues remain.',
    expectedSkill: 'deep-review',
    category: 'lexical-mis-route',
    reason: 'Audit and implementation can pull toward sk-code-review/sk-code, while repeated stateful passes are deep-review.',
  },
  {
    prompt: 'Have multiple perspectives argue the plan, compare tradeoffs, and leave the decision artifacts in the packet.',
    expectedSkill: 'sk-ai-council',
    category: 'lexical-mis-route',
    reason: 'Planning and packet terms can route to system-spec-kit, but multi-perspective deliberation belongs to council.',
  },
  {
    prompt: 'Stage a structured design deliberation with separate seats and converge on the least risky option.',
    expectedSkill: 'sk-ai-council',
    category: 'lexical-mis-route',
    reason: 'Design deliberation may match architecture/code planning; separate seats/convergence is council-owned.',
  },
];
