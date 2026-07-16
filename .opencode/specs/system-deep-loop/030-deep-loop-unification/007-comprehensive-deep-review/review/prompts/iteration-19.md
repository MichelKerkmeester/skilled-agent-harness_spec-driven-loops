DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (19 of 20)

## STATE

Iteration: 19 of 20
Dimension: traceability + maintainability — deep-ai-council packet
Prior Findings: read `review/deep-review-findings-registry.json` for the current cumulative count before starting — do not assume 0.
Review Target: .opencode/skills/system-deep-loop/deep-ai-council/

## READ FIRST

Read `review/deep-review-strategy.md` section 12 (Next Focus) and the LATEST iteration record(s) in `review/deep-review-state.jsonl` before starting — do not re-discover an already-registered finding as new; you may reference/reconfirm it if directly relevant, but only NEW findings belong in this iteration's `findingsNew`.

## THIS ITERATION'S FOCUS (deep-ai-council packet, traceability + maintainability combined)

This is the LAST deep-ai-council iteration. Recap in the strategy file whether this packet is clean or carries findings forward.

**Traceability**:
1. Run `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/system-deep-loop/deep-ai-council --check` fresh, report exact output, confirm PASS.
2. Does `.opencode/commands/deep/ai-council.md` correctly reference this packet's current layout?
3. README/changelog currency check.

**Maintainability**:
1. Is the multi-seat deliberation design documented clearly enough for a future maintainer to add a new "seat" type?
2. Any duplication between SKILL.md and references/?

**Also**: this is iteration 19 of 20 — after this, only the cross-cutting synthesis iteration (20) remains. Write a clear, honest interim summary in the strategy file of the packet-by-packet verdicts so far (hub, deep-research, deep-review, deep-ai-council all done; deep-improvement done in the prior 4 iterations) — this will directly inform iteration 20's synthesis.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-019.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-019.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-019.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-019.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-019.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":19,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-019","status":"complete","focus":"traceability-maintainability-deep-ai-council","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-019.jsonl` — the iteration record plus one line per finding.
