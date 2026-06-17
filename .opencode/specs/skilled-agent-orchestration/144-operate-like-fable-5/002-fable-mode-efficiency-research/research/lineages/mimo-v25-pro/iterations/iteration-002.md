# Iteration 2 — mimo-v25-pro lineage
**Focus:** Surface map gaps — agent prompts, constitutional memories, deep-loop runtime integration
**Model:** xiaomi/mimo-v2.5-pro via cli-opencode
**Timestamp:** 2026-06-15T12:35:00Z

---

## Findings

### M6: All 12 agent prompts carry hook-Injected advisor context — but it's routing-only, not behavioral

Every agent prompt (orchestrate, code, review, context, debug, deep-research, deep-review, deep-context, deep-improvement, ai-council, markdown, prompt-improver) contains the identical boilerplate:

> "Treat hook-injected skill-advisor recommendations as routing hints only. They never override explicit user instructions..."

**Source:** grep across `.opencode/agents/*.md` — 12 of 12 agents matched

This hook surface is the **only cross-runtime, per-prompt injection point that reaches subagents** (since the opus source's G2 notes "the hook does NOT fire for subagents — inject into agent briefs separately"). The agent prompts ARE the separate injection surface. But currently they only receive skill-advisor routing context, not behavioral governors.

**Implication:** Tier B should include "inject fable-5 governor rules into agent prompts" as a mechanism. The `Hook-Injected Advisor Context` section could be extended to include a compact behavioral governor alongside the routing hints. This is architecturally cleaner than modifying the hook itself, because it reaches subagents (which the hook doesn't).

### M7: There are 17 constitutional memories, not 16 — the count in the merged research is stale

The merged research states "the ~17 `system-spec-kit/constitutional/` memories" but the actual count from glob is 17 files (excluding README.md):

1. cli-dispatch-skill-preload.md
2. code-graph-scope-intent.md
3. comment-hygiene.md
4. entity-cooccurrence-is-not-causal.md
5. finding-is-a-hypothesis.md
6. gate-enforcement.md
7. gate-tool-routing.md
8. main-branch-direct-push.md
9. memory-system-spec-kit-only.md
10. post-implementation-deep-review.md
11. regression-baseline-and-delta.md
12. spec-folder-naming.md
13. verify-before-completion-claims.md
14. deep-skill-workflow-required.md
15. bash-output-truncation-verdict-visibility.md
16. automated-writers-never-overwrite-manual.md
17. README.md (not a rule)

**Source:** glob `*.md` in `.opencode/skills/system-spec-kit/constitutional/`

16 rule files + 1 README = 17 total. The merged research's "~17" is actually correct (counting README), but the real adjustable surface is 16 rule files. Two of these are round-1 products (`main-branch-direct-push.md` and `comment-hygiene.md`).

**Implication:** 14 pre-existing constitutional rules are potential fable-5 adoption surfaces. The most relevant for fable-5 efficiency: `finding-is-a-hypothesis.md` (directly maps to Fable's "green is a hypothesis"), `regression-baseline-and-delta.md` (maps to "get the baseline before claiming no regressions"), `verify-before-completion-claims.md` (maps to "run the real thing before calling it done").

### M8: The deep-loop runtime's `renderPromptPack` is a behavioral injection point the prior lineages didn't name

`renderPromptPack` in `deep-loop-runtime/lib/deep-loop/prompt-pack.ts` renders iteration prompts from templates with variable substitution. Every deep-loop iteration (research, review, context, ai-council, improvement) passes through this function.

**Source:** `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts:55`

This is an **enforcement surface** (Tier B) — it runs on every dispatch, is template-driven, and already supports variable injection. A fable-5 behavioral directive could be injected as a template variable (e.g., `{governor_block}`) that renders into every iteration prompt.

**Implication:** This is the programmatic equivalent of the opus `reinject.sh` thermostat, but it runs inside the deep-loop runtime rather than at the OS hook level. It's more targeted (only deep-loop iterations, not every user prompt) but more reliable (template-driven, not hook-dependent).

### M9: The `post-dispatch-validate` surface could enforce behavioral checks on iteration outputs

`post-dispatch-validate.ts` validates iteration markdown + JSONL after each dispatch. It currently checks structural completeness (file exists, JSONL has required fields, delta present).

**Source:** `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`

This is a **measurement surface** (Tier C) — it already runs after every iteration and could be extended to check behavioral metrics:
- Tool:text ratio (is the iteration too narratey?)
- Result-first openings (does the iteration start with findings or with "I'll investigate"?)
- Caveat density (is the iteration armor-hedged?)

These are the same metrics `leak_test.py` measures post-hoc; `post-dispatch-validate` could measure them in real-time per iteration.

**Implication:** Tier C should include "behavioral quality gates in post-dispatch-validate" as a measurement surface. This gives real-time feedback rather than post-hoc log analysis.

### M10: The `executor-config.ts` schema could carry a per-lineage governor block

The executor config already has per-lineage settings (model, kind, reasoning effort, sandbox). Adding a `governor` field to the lineage schema would allow behavioral directives to be passed per-executor:

```json
{
  "kind": "cli-opencode",
  "model": "xiaomi/mimo-v2.5-pro",
  "governor": "fable-5-compact"
}
```

**Source:** `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` — schema at executor-config.md:40

This is architecturally the cleanest attachment point for Tier B because:
1. It's per-lineage (each fan-out lineage can have its own governor)
2. It's per-executor (different models can get different governors — solving M3's transferability gap)
3. It's template-driven (the governor block is selected by config, not hardcoded)

**Implication:** The governor-on-hook recommendation should be split into two sub-recommendations: (a) hook-level injection for user-facing sessions, (b) executor-config-level injection for deep-loop iterations.

---

## Ruled Out
- Treating the hook-Injected advisor context as a governor surface without modification (it's routing-only)
- Modifying constitutional memories to carry fable-5 rules (they're rule-level, not behavioral-level)
- Using `renderPromptPack` as the ONLY governor surface (it only covers deep-loop iterations, not user-facing sessions)

## Assessment
- **newInfoRatio:** 0.80 (5 findings, all net-new surfaces not in the merged research)
- **Status:** complete
- **Focus for next iteration:** Implementation path — how would the top recommendation (governor-on-hook + executor-config) actually be implemented? What's the minimal viable change per surface?
