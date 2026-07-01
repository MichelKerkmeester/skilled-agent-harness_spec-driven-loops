# Iteration 5 — KQ4 minimal fix: orchestrate already carries the machinery

**Focus:** KQ-OPUS-5 — Is `sonnet-critical`'s Deliverable 3 (add a whole registry-resolution routing rule to orchestrate §2) the *smallest* NDP-safe fix, or does orchestrate already have most of what it needs?

## What was read (this iteration)

- `.opencode/agents/orchestrate.md:95-105` (Priority routing table), `:162-174` (dispatch protocol / subagent_type), `:184-188` (agent definition paths), `:204-217` (dispatch package format incl. Deep Route field)

## Finding 1 — orchestrate is missing only two table rows, not a whole mechanism

Auditing what orchestrate already has for deep dispatch:
- **Agent-definition paths already present** (`:184-185`): `@deep-research → .opencode/agents/deep-research.md`, `@ai-council → …/ai-council.md`.
- **Deep Route field already present** in the dispatch package (`:207`): `Deep Route: [for deep routes only: mode=<workflowMode>; target_agent=@<agent>; execution=<…>; source_of_truth=.opencode/skills/deep-loop-workflows/mode-registry.json | none]`.
- **Deep agents already enumerated** in the Agent line (`:206`): `@code | @context | @markdown | @deep-context | @deep-research | @deep-review | @ai-council | @review | @debug`.

What is missing: the **Priority routing table** (`:97-105`) — which is what a literal model reads to decide *which* agent handles a request — has rows only for `@deep-research` (row 2, "Evidence / iterative investigation") and `@ai-council` (row 3), and **no rows for `@deep-context` or `@deep-review`**. So a literal model routing via the Priority table cannot find deep-context/deep-review and must *infer* them from the Agent line — precisely the "self-derive from a table that doesn't list them" defect the prior research named. [SOURCE: .opencode/agents/orchestrate.md:97-105,206-207]

## Finding 2 — The minimal fix is smaller than Deliverable 3

Given Finding 1, the smallest NDP-safe, literal-model-safe fix is two edits, not a new routing subsystem:
1. **Add two rows** to the Priority table (`:97-105`): `@deep-context` (context loop) and `@deep-review` (code-audit loop), both `LEAF`, `subagent_type "general"`, mirroring the existing `@deep-research`/`@ai-council` rows.
2. **Make the Deep Route field values registry-resolved, not self-derived**: change the `:207` field from a fill-in-the-blank template into an instruction — "resolve `mode`/`target_agent`/`execution`/`artifact_root` by reading `.opencode/skills/deep-loop-workflows/mode-registry.json` for the requested `/deep:*` mode; do NOT infer them from the Priority table." Dispatch the resolved LEAF directly at Depth 1.

This preserves orchestrate's decomposition/evaluation/synthesis authority (only mode-resolution becomes deterministic), never dispatches `@deep` (NDP-safe, iter 4), and matches glm-max's detailed intent (`glm-max/research.md:55` minus its NDP-unsafe "@deep" target). It is strictly smaller than adding a standalone routing rule that re-implements registry reading, because the Deep Route field and agent paths already exist. This SHARPENS sonnet-critical Deliverable 3 (same NDP-safe outcome, fewer new lines, reuses existing fields).

## Finding 3 — A residual ambiguity worth flagging to the implementer

`orchestrate.md:206` lists `@deep-context`/`@deep-review` as dispatchable while `:97-105` does not — the file is already internally inconsistent about whether these are first-class routes. The fix should reconcile that inconsistency explicitly (add the rows), not just patch the Deep Route field, or a literal model will still see the Agent line and the Priority table disagree.

## Ruled out this iteration

- Treating "add a new registry-resolution routing rule to orchestrate" as the minimal fix — RULED OUT; the Deep Route field (`:207`) and agent paths (`:184-185`) already exist, so the minimal fix is two table rows + making the existing field registry-resolved.

## Status

`insight` — reduces the KQ4 fix surface by reading what orchestrate already contains.

newInfoRatio: 0.55 — novelty: shrinks the recommended KQ4 fix and names the pre-existing internal inconsistency (`:206` vs `:97-105`) that the fix must reconcile.
