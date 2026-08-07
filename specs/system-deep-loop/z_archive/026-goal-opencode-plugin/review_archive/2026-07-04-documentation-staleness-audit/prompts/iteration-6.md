DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3 -- proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 6 of a batch covering 4-7). Your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-006.md` and `review/deltas/iter-006.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator will merge your delta file into shared state after this batch completes. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings as of iteration 3, read-only context)

Prior Findings: P0=0 P1=2 P2=0
- P1-001: `ENV_REFERENCE.md:646-660` omits the 3 new `MK_GOAL_STATE_*` env vars.
- P1-002: `references/hooks/goal_plugin.md:33-52` (already touched this session) omits the same 3 env vars plus `store_health`/`mutation=` output coverage.

Do NOT re-emit either as new.

## YOUR ASSIGNED FOCUS FOR THIS ITERATION (correctness + traceability, Finding #6 -- lower priority per operator, but still verify)

Companion research Finding #6 (P3, operator's call): several PACKET-HISTORY docs (not the "related skill documentation and README files" the review topic centers on) still reference the retired `.opencode/commands/goal.md` filename instead of the live `.opencode/commands/goal_opencode.md`:

1. Phase 009's `handover.md` -- check around line 95 for a "cold-read order" that points at the absent `goal.md`.
2. Phase 011's `tasks.md` -- check T001/T004 body text and any completion-criteria claim of "zero stale-reference hits" that may itself now be inaccurate.
3. Phase 003's changelog -- check `changelog-032-003-goal-command.md` around lines 26, 56.
4. `review_archive/2026-07-01-plugin-implementation-review/README.md` around lines 11-12.

For EACH of the 4 locations above:
- Confirm the exact file:line still contains `goal.md` (not `goal_opencode.md`).
- Classify: is this a "here was the bug we were fixing" HISTORICAL narrative (expected, appropriate, no action needed) or a CURRENT operational claim that is now factually wrong (e.g. "cold-read order: read goal.md first" as literal current instructions, or "zero stale-reference hits" claimed as still-true when it is not)?
- The operator explicitly said this class is lower priority and optional/annotate-or-leave is their call -- your job is to give an accurate, evidence-based classification (historical vs current-and-wrong), not to recommend a fix be applied.

Also do a quick independent check: are there ANY OTHER locations in the repo (beyond these 4 + the ones already covered in iterations 1-3) that still reference the bare `goal.md` filename in a plugin/command context? A targeted `grep -r "goal\.md"` sweep scoped to `.opencode/` (excluding node_modules/dist) is appropriate here.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Findings in this class are typically P2/P3 (historical/documentation drift, not correctness-breaking) -- still cite claim/evidenceRefs/finalSeverity/confidence for anything you classify as "current and wrong."

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-006.md`, `review/deltas/iter-006.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (including the shared state files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-006.md`. Structure: Dimension, Files Reviewed, Finding #6 Per-Location Classification (4 locations + any new ones found), Findings by Severity, Traceability Checks, Verdict, Next Dimension. ABSOLUTE FINAL LINE exactly one of: `Review verdict: PASS` / `CONDITIONAL` / `FAIL`.

2. **Delta file** at `review/deltas/iter-006.jsonl`. FIRST line is the canonical `{"type":"iteration",...}` record (do NOT append to state.jsonl). Include `findingsNew` and `findingDetails`, both populated in parallel (or both `[]`). Then per-event structured records.

Required schema for the first line:
```json
{"type":"iteration","iteration":6,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-006","status":"complete","focus":"correctness+traceability (Finding #6, stale filename refs)","dimensions":["correctness","traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back: verdict, count/titles of new findings, confirmation both files written.
