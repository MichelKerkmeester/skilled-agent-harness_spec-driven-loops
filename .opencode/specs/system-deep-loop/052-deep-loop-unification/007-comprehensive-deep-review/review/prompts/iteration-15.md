DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (15 of 20)

## STATE

Iteration: 15 of 20
Dimension: security — deep-improvement packet
Prior Findings: read `review/deep-review-findings-registry.json` for the current cumulative count before starting — do not assume 0.
Review Target: .opencode/skills/system-deep-loop/deep-improvement/

## READ FIRST

Read `review/deep-review-strategy.md` section 12 (Next Focus) and the LATEST iteration record(s) in `review/deep-review-state.jsonl` before starting — do not re-discover an already-registered finding as new; you may reference/reconfirm it if directly relevant, but only NEW findings belong in this iteration's `findingsNew`.

## THIS ITERATION'S FOCUS (deep-improvement packet, security)

`deep-improvement` is the ONLY mutating family among the 4 packets (per the hub's own docs: "improvement is the only mutating family") — it can promote candidates and modify live skill/agent files. This makes it the highest-security-stakes packet in the whole tree.

1. **Promotion/mutation guardrails**: read `scripts/shared/promote-candidate.cjs` (seen referenced in iteration 1's inventory) and any related guarded-promotion logic — does it have real, enforced write-boundary checks before mutating anything, or could a bad candidate get promoted without a real gate?
2. **Env-var hardening contract**: `references/model_benchmark/lane_b_mechanics.md` (created during this session's SKILL.md trim) documents `DEEP_AGENT_ALLOW_CRITERIA_EXEC`/`DEEP_AGENT_GRADER_CACHE_RAW` env-var gates — read it and confirm the actual behavior it describes is genuinely a safe default (should default OFF/restrictive) and not something that silently defaults to unsafe.
3. **Script injection surface**: scan `scripts/` for anything that constructs a shell command or file path from benchmark-candidate-controlled data (a benchmark "candidate" is semi-untrusted generated content by design) — any place that could let a malicious/buggy candidate escape its sandbox?
4. **Rollback safety**: read `scripts/lib/rollback.cjs` (seen in iteration 1's inventory) — does it correctly and safely revert a bad promotion, or could a rollback itself be unsafe/partial?

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-015.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-015.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-015.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-015.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-015.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":15,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-015","status":"complete","focus":"security-deep-improvement","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-015.jsonl` — the iteration record plus one line per finding.
