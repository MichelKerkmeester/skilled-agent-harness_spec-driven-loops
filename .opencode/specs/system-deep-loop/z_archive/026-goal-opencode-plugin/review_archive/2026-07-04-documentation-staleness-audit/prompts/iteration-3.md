DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3)

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 10
Dimension: correctness + traceability (Finding #2: goal_plugin.md gap)
Prior Findings: P0=0 P1=1 P2=0
Dimension Coverage: correctness, security touched (2/4)
Traceability: core=partial overlay=partial
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 2
Last 2 ratios: 1.0 -> 0.0
Stuck count: 0 (iteration 2 was a clean negative result, not stuck -- new dimension covered)
Provisional Verdict: CONDITIONAL hasAdvisories=false

## READ FIRST (in order)

1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl` -- iterations 1-2 full records.
2. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json` -- current open findings (P1-001 only; do not re-emit).
3. `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md` -- charter and known context.

## THIS ITERATION'S FOCUS (iteration 3 of 10 -- correctness + traceability, Finding #2)

The companion research packet's single "standout" finding: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` was ALREADY UPDATED this session for the filename fix (goal.md -> goal_opencode.md), but research claims it is STILL missing the 3 new env vars (`MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`) plus `store_health` and `mutation=` output-field coverage.

1. Read `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` IN FULL -- do not sample, read the whole file, especially any environment-variable table and any output/status-field section.
2. Read `.opencode/plugins/mk-goal.js` lines ~30-42 (env var definitions), ~1602-1675 (store_health / mutation= emission) again directly -- do not rely on iteration 1's citations alone, re-verify line numbers may have shifted are still accurate.
3. Independently assign a verdict: CONFIRMED-P1 (matches research), DOWNGRADED (if partial coverage exists that research missed), or REFUTED (if the env vars/fields are actually documented somewhere in that file research didn't notice). Cite exact line numbers either way.
4. This doc is explicitly IMPORTANT because the operator flagged it as "already updated this session" -- if you confirm the gap, note explicitly that this represents doc work believed complete but is not, which may be a different severity/framing than a doc nobody has touched yet (still same P-level unless evidence suggests otherwise, but call out the "already updated, still wrong" pattern explicitly since it may indicate other "already updated" docs need re-verification, not just trust).
5. If time permits (do not exceed the tool-call budget), quickly check whether `ENV_REFERENCE.md` and `goal_plugin.md` use CONSISTENT variable naming/defaults for the 3 env vars once each is confirmed to have (or lack) them -- a sibling-doc consistency check.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability (this iteration: correctness + traceability)

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

Per-finding verdict: `CONFIRMED-P0 | CONFIRMED-P1 | CONFIRMED-P2 | DOWNGRADED-P{n} | REFUTED`, each with file:line evidence.
Overall iteration verdict: `FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-config.json
- State Log: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS**: `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-003.md`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl` (append-only), `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-003.jsonl`, `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md` (in-place), `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json` (in-place).
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, output-redirect truncate against any non-allowed path, or any delete/rename/replace outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if a plan requires writing outside the allowed list, STOP and record a `## SCOPE VIOLATIONS` finding instead.

## OUTPUT CONTRACT

Produce THREE artifacts:

1. Iteration narrative markdown at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/iterations/iteration-003.md`. Structure: Dimension, Files Reviewed, Finding #2 Audit (verdict + evidence), Sibling-Doc Consistency Check, Findings by Severity, Traceability Checks, Next Dimension. FINAL line exactly one of: "Review verdict: PASS/CONDITIONAL/FAIL".

2. Canonical JSONL record appended to `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl`, `"type":"iteration"` exactly:

```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"correctness+traceability (Finding #2)","dimensions":["correctness","traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

3. Per-iteration delta file at `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deltas/iter-003.jsonl`.

All three artifacts are REQUIRED.
