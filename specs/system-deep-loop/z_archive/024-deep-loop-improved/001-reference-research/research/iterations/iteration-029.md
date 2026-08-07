# Iteration 29: S4-05 Question Provenance Dashboard Attribution

## Focus

Dimension D2 target-mapping for S4-05: whether `reduce-state.cjs` should distinguish angle-bank injected questions from analyst-authored strategy questions, then expose that provenance in the registry and dashboard so question coverage can be attributed back to its source.

## Actions Taken

1. Confirmed the deep-research mode contract and output ownership rules.
2. Checked prior S4 coverage. Iteration 25 already mapped durable inbox promotion with `origin`, `source`, `injectedAtIteration`, and `promotedQuestionId`, so this pass stayed on the narrower dashboard-attribution gap.
3. Inspected Kasper's prompt mutation model for per-entry provenance comments, hidden begin/end injected blocks, and regression coverage that guards idempotent provenance placement.
4. Inspected our reducer path for question parsing, registry construction, strategy rewriting, and dashboard rendering.

## Findings

### S4-05A: Carry question origin through `openQuestions` and `resolvedQuestions`

- Reference mechanism: Kasper's section injector appends each new entry with its own timestamp provenance, preserves old section-level provenance during migration, and uses the same per-entry shape when creating a new section (`external/kasper/src/prompt-utils.ts:121-147`, `external/kasper/src/prompt-utils.ts:157-159`, `external/kasper/src/prompt-utils.ts:184-190`). Its accumulation test asserts exactly one provenance line per apply, directly above the entry it belongs to (`external/kasper/tests/e2e/inject-accumulation.test.ts:138-147`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`; `buildRegistry()` currently derives `keyedQuestions` with only `id`, `text`, `addedAtIteration`, `resolvedAtIteration`, and `resolved` (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:594-608`), then strips `openQuestions` and `resolvedQuestions` to the same minimal fields (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:658-684`).
- Why it helps: S4-01 gave injected questions durable records; S4-05 should finish the mapping by preserving `origin: "angle-bank" | "analyst-strategy"`, `source`, and `injectedAtIteration` after resolution, not only while a question is pending.
- Port difficulty: med.
- Tag: quick-win.

### S4-05B: Render dashboard attribution, not just raw question text

- Reference mechanism: Kasper's inline injection mode wraps hidden machine additions in `<!-- kasper-injected:begin -->` and `<!-- kasper-injected:end -->` so later runs can locate, dedupe, and roll them back without a visible heading (`external/kasper/src/agent-prompts.ts:21-32`, `external/kasper/src/agent-prompts.ts:46-48`). The config documents this as the rollback-only inline marker mode (`external/kasper/src/config.ts:254-258`), and the e2e test asserts the markers exist while the visible section header does not (`external/kasper/tests/e2e/inject-mode.test.ts:139-145`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`; `renderDashboard()` currently reports only aggregate open/resolved counts and plain checkbox lines (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:885-895`), while its only coverage rollup is source-file oriented (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:912`).
- Why it helps: the dashboard can show `angleBankQuestions: answered/total` and per-question badges like `[angle-bank iter 25]` or `[analyst]`, letting the reducer prove whether monitor-injected angles are actually improving coverage.
- Port difficulty: easy.
- Tag: quick-win.

### S4-05C: Do not rely on markdown comments inside `key-questions` for durable provenance

- Reference mechanism: Kasper uses begin/end injected markers for locating generated blocks and per-addition comments for attribution, but those markers live in mutation surfaces that Kasper owns and can rewrite intentionally (`external/kasper/src/agent-prompts.ts:21-32`, `external/kasper/src/prompt-utils.ts:157-159`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`; `parseStrategyQuestions()` only reads checkbox bullets and normalized text (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:245-258`), and `updateStrategyContent()` rewrites the whole `key-questions` anchor from parsed entries (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:782-800`).
- Why it helps: HTML comments adjacent to strategy bullets would be erased or ignored by the reducer. The safer port is Kasper-style provenance as structured registry fields plus optional generated dashboard display, not comments embedded in the strategy source block.
- Port difficulty: med.
- Tag: deep-rewrite.

## Questions Answered

- S4-05 answered: yes, `reduce-state.cjs` should stamp injected versus analyst-authored questions, but the durable stamp belongs in reducer state and registry records rather than inline markdown comments.
- The dashboard should attribute coverage by question origin. Minimum useful output: counts for angle-bank versus analyst questions, plus per-question origin badges in the Questions section.

## Questions Remaining

- The exact migration default needs a product decision: pre-existing strategy bullets should likely become `origin: "analyst-strategy"` with `injectedAtIteration: null`, but this should be locked in with a reducer regression test.
- The JSONL/state reference should be updated alongside implementation so `questionOriginCounts` and question-origin fields are documented, not implicit.

## Next Focus

Nearest unexplored follow-up in the same segment: validate the input-safety side of injected questions, especially whether angle-bank entries need sanitizer checks before entering reducer-managed state.
