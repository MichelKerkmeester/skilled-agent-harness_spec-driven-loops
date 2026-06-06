DEEP-RESEARCH

# Deep-Research Iteration 065 — 026-dedup: 008.1 aggregator vs shipped batch-learning.ts; STATE_LIMITS export

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite every claim `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 027 Phase 008/001-aggregator planned a bounded feedback aggregator reading SQLite `feedback_events` from a feedback ledger.
- The 2026-06-05 audit said: `batch-learning.ts:195-241` ALREADY does overlapping bounded aggregation (`aggregateEvents`/`weightedScore`; `f05bdac2cf` refined its formula) → 001 should REUSE/EXTRACT, not duplicate. Also `STATE_LIMITS` (needed by 008/004 retention reducer) is NOT exported — only `__testables`. VERIFY both against live code.
- Reminder: iteration 061 already determined 008/002-coco-rerank-consumer is DELETE and the surviving family is 001 → {003,004} → 005. Do NOT re-cover the coco purge.

## FOCUS — answer only this
1. What does live `batch-learning.ts` already do (`aggregateEvents`/`weightedScore`/event reading), and how much of 008/001-aggregator's planned scope does it already cover? Reuse-vs-duplicate call.
2. Is `STATE_LIMITS` exported as a production symbol or only via `__testables`? Where is it, and what does 008/004 need?
Read/grep:
- `grep -rn "aggregateEvents\|weightedScore\|batch-learning\|feedback_events" .opencode/skills/system-spec-kit/mcp_server/lib/`
- `grep -rn "STATE_LIMITS\|__testables" .opencode/skills/system-spec-kit/mcp_server/lib/`
- `005-learning-feedback-reducers/001-aggregator/spec.md` and `005-learning-feedback-reducers/004-retention-reducer/spec.md`

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-065-NN] <claim>` + `file:line`. Must answer the reuse/duplicate question for 001 and the STATE_LIMITS export question for 004.

### REUSE_PLAN_008
- 001-aggregator: {REUSE-EXTRACT batch-learning | NEW | HYBRID} + exactly what to reuse vs add (cite).
- 004-retention-reducer: the STATE_LIMITS export fix needed (cite current location + symbol).

### VERDICT
008 family (post-coco) = {…} per child verdict.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
