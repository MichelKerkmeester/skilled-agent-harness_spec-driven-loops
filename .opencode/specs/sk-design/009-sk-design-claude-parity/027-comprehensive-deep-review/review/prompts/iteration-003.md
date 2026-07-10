DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 3 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 2, 4, and 5 (same wave) — each has a DISJOINT file assignment; do not review files outside your assignment below, even if they look related.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 20
Dimension: security + maintainability — shared/ and benchmark/ dirs only
Prior Findings: P0=0 P1=1 P2=0 (read the findings registry before starting — do not assume this is stale)
Dimension Coverage: inventory only
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 3 of 20 (Wave 1 of 6, parallel with iterations 2/4/5)
Mode: review
Review Target: `.opencode/skills/sk-design/shared/` (23 files) + `.opencode/skills/sk-design/benchmark/` (15 files) ONLY — see WAVE 1 ASSIGNMENT below
Prior Findings: P0=0 P1=1 P2=0

## WAVE 1 ASSIGNMENT (disjoint file set — DO NOT review files outside this list)

- `.opencode/skills/sk-design/shared/**`
- `.opencode/skills/sk-design/benchmark/**`

Iterations 2, 4, and 5 are reviewing hub tier, `feature_catalog/+changelog/+manual_testing_playbook/`, and cross-hub linkage respectively, in parallel with you. Do not duplicate their scope.

## REVIEW CHARTER (task-specific)

Iteration 1 (inventory) confirmed the tree shape and corrected the `design-md-generator` sampling baseline — read `review/deep-review-strategy.md` for the full corrected rotation and the one P1 already found (standalone md-generator artifact writers). That P1 is in a DIFFERENT area than your assignment; do not re-investigate it.

## THIS ITERATION'S FOCUS (shared/ + benchmark/ — security + maintainability)

1. **`shared/`**: this is cross-cutting infrastructure all 6 modes may depend on. Read its contents — any scripts, reference docs, or shared config. Security-relevant: does anything here construct file paths, shell commands, or write targets from mode-controlled or externally-controlled input without validation? Maintainability-relevant: is it clearly documented what depends on `shared/`, or is it an undocumented implicit dependency risk?
2. **`benchmark/`**: this holds benchmark harness/evidence for sk-design's routing/parity work. Security-relevant: does the benchmark runner (if any script exists here) execute anything unsafely (e.g. eval, unsanitized shell interpolation from fixture data)? Maintainability-relevant: are benchmark baseline artifacts clearly distinguished from live/active config (stale baselines silently trusted as current would be a real bug)?
3. Any genuine bug (broken reference, unsafe construction, stale/misleading artifact) is a finding — cite exact file:line evidence.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

security, maintainability (this iteration's assigned focus; correctness/traceability covered by sibling wave-1 iterations)

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 2/4/5 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-003.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-003.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-003.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"security-maintainability-shared-benchmark","dimensions":["security","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-003.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
