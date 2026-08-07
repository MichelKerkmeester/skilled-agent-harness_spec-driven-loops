// ───────────────────────────────────────────────────────────────
// MODULE: Advisor RRF Fusion Labeled Routing Set
// ───────────────────────────────────────────────────────────────

// A labeled prompt-to-skill set for the advisor routing benchmark. Each label
// is the correct skill for the prompt, grounded in the advisor's own corpus
// trigger phrases (skill_nodes.derived.trigger_phrases) so the gold answer is
// the routing target the advisor itself declares. Five difficulty bands let
// the benchmark separate trivially-routed prompts from the harder paraphrase
// and near-ambiguous prompts where rank fusion and weighted sum can diverge,
// and add two bands that target the two guard seams directly.
//
//   exact      a verbatim or near-verbatim corpus trigger phrase
//   paraphrase a natural-language restatement of the same intent
//   hard       a realistic multi-concept or near-tie prompt where two skills
//              compete and the gold answer is the dominant intent
//   self_guard an advisor-self-leaning audit or read-only prompt where a real
//              task skill should win, built to make the self-recommendation
//              guard demote system-skill-advisor if the guard has any distinct
//              effect on the production logic
//   conflict   a near-tie prompt whose runner-up is a conflicts_with target of
//              the gold skill, so the conflict-rerank seam has real mass to
//              demote the competitor when the overlay is applied
//
// The conflict band is scored by the harness against the conflict overlay (the
// live corpus carries no conflicts_with edges), every other band is scored
// against the read-only live projection. The set never opens the live corpus
// for writes and never embeds.

export const LABELED_ROUTING_SET = [
  // ---- exact band: verbatim or near-verbatim corpus triggers ----
  { id: 'q01', band: 'exact', prompt: 'claude code cli orchestration', skill: 'cli-claude-code' },
  { id: 'q02', band: 'exact', prompt: 'codex pr review', skill: 'cli-codex' },
  { id: 'q03', band: 'exact', prompt: 'opencode run parallel detached session', skill: 'cli-opencode' },
  { id: 'q04', band: 'exact', prompt: 'chrome devtools dom inspect', skill: 'mcp-chrome-devtools' },
  { id: 'q05', band: 'exact', prompt: 'clickup task management work queue', skill: 'mcp-click-up' },
  { id: 'q06', band: 'exact', prompt: 'figma-ds-cli render in figma', skill: 'mcp-figma' },
  { id: 'q07', band: 'exact', prompt: 'open design od cli design system', skill: 'mcp-open-design' },
  { id: 'q08', band: 'exact', prompt: 'sk-code surface-aware code implementation', skill: 'sk-code' },
  { id: 'q09', band: 'exact', prompt: 'code review security review findings', skill: 'sk-code-review' },
  { id: 'q10', band: 'exact', prompt: 'extract design system generate design.md from url', skill: 'sk-design-md-generator' },
  { id: 'q11', band: 'exact', prompt: 'create readme install guide documentation quality', skill: 'sk-doc' },
  { id: 'q12', band: 'exact', prompt: 'git worktree create a git worktree', skill: 'sk-git' },
  { id: 'q13', band: 'exact', prompt: 'improve prompt clear score prompt framework', skill: 'sk-prompt' },
  { id: 'q14', band: 'exact', prompt: 'code graph scan structural code indexing', skill: 'system-code-graph' },
  { id: 'q15', band: 'exact', prompt: 'spec folder save context memory search', skill: 'system-spec-kit' },

  // ---- paraphrase band: natural-language restatements ----
  { id: 'q16', band: 'paraphrase', prompt: 'hand this task off to the codex command line tool for a repository analysis', skill: 'cli-codex' },
  { id: 'q17', band: 'paraphrase', prompt: 'open the browser developer tools and inspect why the page network requests are slow', skill: 'mcp-chrome-devtools' },
  { id: 'q18', band: 'paraphrase', prompt: 'pull this site css into a reusable style reference document', skill: 'sk-design-md-generator' },
  { id: 'q19', band: 'paraphrase', prompt: 'set up a new worktree and a feature branch for this change', skill: 'sk-git' },
  { id: 'q20', band: 'paraphrase', prompt: 'tighten up this prompt and score how clear it is', skill: 'sk-prompt' },
  { id: 'q21', band: 'paraphrase', prompt: 'write an install guide and a readme for this package', skill: 'sk-doc' },
  { id: 'q22', band: 'paraphrase', prompt: 'route this request to the right skill, which skill should handle it', skill: 'system-skill-advisor' },
  { id: 'q23', band: 'paraphrase', prompt: 'mark the current task done in the work queue', skill: 'mcp-click-up' },
  { id: 'q24', band: 'paraphrase', prompt: 'gather codebase context across the repository before planning', skill: 'deep-loop-workflows' },
  { id: 'q25', band: 'paraphrase', prompt: 'run an mcp tool chain through code mode', skill: 'mcp-code-mode' },
  { id: 'q26', band: 'paraphrase', prompt: 'dispatch this to a small model like kimi for the cheap pass', skill: 'sk-prompt-models' },
  { id: 'q27', band: 'paraphrase', prompt: 'this interface looks templated, make the visual design more distinctive', skill: 'sk-design-interface' },

  // ---- hard band: multi-concept or near-tie, dominant-intent gold ----
  { id: 'q28', band: 'hard', prompt: 'review this pull request for correctness bugs and security regressions before we merge', skill: 'sk-code-review' },
  { id: 'q29', band: 'hard', prompt: 'implement the new typescript handler and run the vitest suite for it', skill: 'sk-code' },
  { id: 'q30', band: 'hard', prompt: 'save the conversation context into the spec folder and refresh the implementation summary', skill: 'system-spec-kit' },
  { id: 'q31', band: 'hard', prompt: 'find every caller of this function and the structural impact of renaming it', skill: 'system-code-graph' },
  { id: 'q32', band: 'hard', prompt: 'commit these staged changes with a conventional commit and open a pull request', skill: 'sk-git' },
  { id: 'q33', band: 'hard', prompt: 'run a figma design export of the component tokens from the desktop app', skill: 'mcp-figma' },

  // ---- self_guard band: advisor-self-leaning, a real task skill is gold ----
  // These audit-recommendation-quality prompts make system-skill-advisor a
  // strong candidate. The correct route is the review skill, so the guard would
  // earn its keep by demoting the advisor self-recommendation. They are scored
  // against the live projection under RRF with the guard off and on.
  { id: 'q34', band: 'self_guard', prompt: 'audit the skill advisor recommendations for routing quality', skill: 'sk-code-review' },
  { id: 'q35', band: 'self_guard', prompt: 'review the recommendation quality the router produces', skill: 'sk-code-review' },
  { id: 'q36', band: 'self_guard', prompt: 'audit the routing quality and the recommendations it makes', skill: 'sk-code-review' },
  { id: 'q37', band: 'self_guard', prompt: 'audit the recommendation quality of the skill router and rate it', skill: 'sk-code-review' },

  // ---- conflict band: near-tie, runner-up is a conflicts_with target ----
  // Scored against the conflict overlay. The runner-up under plain RRF is a
  // conflicts_with target of the gold skill, so the conflict-rerank seam has
  // real mass to demote it. The structural-impact prompt is the case where the
  // wrong skill wins under plain RRF and the conflict mass corrects the top-1.
  { id: 'q38', band: 'conflict', prompt: 'find the structural impact of this code change across callers', skill: 'system-code-graph' },
  { id: 'q39', band: 'conflict', prompt: 'review this code change for quality and correctness', skill: 'sk-code-review' },
  { id: 'q40', band: 'conflict', prompt: 'do a code review pass over the implementation', skill: 'sk-code-review' },
  { id: 'q41', band: 'conflict', prompt: 'set up a git worktree for this code change', skill: 'sk-git' },
  { id: 'q42', band: 'conflict', prompt: 'save the session context into the spec folder', skill: 'system-spec-kit' },
];

export const CONFLICT_BAND = 'conflict';
export const SELF_GUARD_BAND = 'self_guard';

export const LABELED_SET_SIZE = LABELED_ROUTING_SET.length;
