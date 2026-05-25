// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Intent Prompt Corpus
// ───────────────────────────────────────────────────────────────

export type IntentPromptCategory = 'today-correct' | 'intent-described';

export const INTENT_PROMPT_CORPUS: ReadonlyArray<{
  readonly prompt: string;
  readonly expectedSkill: string;
  readonly category: IntentPromptCategory;
}> = [
  {
    prompt: 'Use sk-code to implement this TypeScript scorer change and run the verification gate.',
    expectedSkill: 'sk-code',
    category: 'today-correct',
  },
  {
    prompt: 'Run sk-code-review on this pull request and report blocker findings first.',
    expectedSkill: 'sk-code-review',
    category: 'today-correct',
  },
  {
    prompt: 'Use system-spec-kit for the existing spec folder and update implementation-summary.md.',
    expectedSkill: 'system-spec-kit',
    category: 'today-correct',
  },
  {
    prompt: 'Use sk-doc to rewrite this README section and keep the markdown structure clean.',
    expectedSkill: 'sk-doc',
    category: 'today-correct',
  },
  {
    prompt: 'Use sk-git to prepare a conventional commit and finish the pull request workflow.',
    expectedSkill: 'sk-git',
    category: 'today-correct',
  },
  {
    prompt: 'Use sk-prompt to improve this prompt and score it with the CLEAR rubric.',
    expectedSkill: 'sk-prompt',
    category: 'today-correct',
  },
  {
    prompt: 'Use system-code-graph for structural code search across the repository.',
    expectedSkill: 'system-code-graph',
    category: 'today-correct',
  },
  {
    prompt: 'Use mcp-code-mode to call an external MCP tool chain through TypeScript execution.',
    expectedSkill: 'mcp-code-mode',
    category: 'today-correct',
  },
  {
    prompt: 'Use mcp-chrome-devtools to inspect localhost in Chrome DevTools and capture console errors.',
    expectedSkill: 'mcp-chrome-devtools',
    category: 'today-correct',
  },
  {
    prompt: 'Use cli-codex to delegate this coding task to Codex CLI.',
    expectedSkill: 'cli-codex',
    category: 'today-correct',
  },
  {
    prompt: 'Use cli-claude-code to delegate the refactor to Claude Code CLI.',
    expectedSkill: 'cli-claude-code',
    category: 'today-correct',
  },
  {
    prompt: 'Use deep-ai-council for a multi-seat planning council with persistent artifacts.',
    expectedSkill: 'deep-ai-council',
    category: 'today-correct',
  },
  {
    prompt: 'Change the scoring function, add a regression test, and verify the TypeScript build.',
    expectedSkill: 'sk-code',
    category: 'intent-described',
  },
  {
    prompt: 'Inspect this diff for behavioral regressions, security risk, and missing test coverage.',
    expectedSkill: 'sk-code-review',
    category: 'intent-described',
  },
  {
    prompt: 'Create the packet docs, track tasks, and validate the spec folder before closing the work.',
    expectedSkill: 'system-spec-kit',
    category: 'intent-described',
  },
  {
    prompt: 'Turn these rough notes into a clean install guide with headings and examples.',
    expectedSkill: 'sk-doc',
    category: 'intent-described',
  },
  {
    prompt: 'Create a branch, make a conventional commit, push it, and open the pull request.',
    expectedSkill: 'sk-git',
    category: 'intent-described',
  },
  {
    prompt: 'Rewrite this instruction so another model follows the constraints and understands the goal.',
    expectedSkill: 'sk-prompt',
    category: 'intent-described',
  },
  {
    prompt: 'I need to locate where this behavior is implemented without knowing the symbol names.',
    expectedSkill: 'system-code-graph',
    category: 'intent-described',
  },
  {
    prompt: 'Run several MCP calls together through one typed script and return the compact result.',
    expectedSkill: 'mcp-code-mode',
    category: 'intent-described',
  },
  {
    prompt: 'Open the local page, click through the UI, and tell me what appears in the console.',
    expectedSkill: 'mcp-chrome-devtools',
    category: 'intent-described',
  },
  {
    prompt: 'Ask the OpenAI coding CLI for an independent implementation pass on this module.',
    expectedSkill: 'cli-codex',
    category: 'intent-described',
  },
  {
    prompt: 'Have Anthropic\'s coding CLI take a second look at this failing refactor.',
    expectedSkill: 'cli-claude-code',
    category: 'intent-described',
  },
  {
    prompt: 'Compare several planning perspectives, converge on one design, and save the deliberation artifacts.',
    expectedSkill: 'deep-ai-council',
    category: 'intent-described',
  },
];
