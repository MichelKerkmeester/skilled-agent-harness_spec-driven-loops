DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 4 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 2, 3, and 5 (same wave) — each has a DISJOINT file assignment; do not review files outside your assignment below, even if they look related.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 4 of 20
Dimension: correctness + traceability — feature_catalog/, changelog/, manual_testing_playbook/ (hub-level) only
Prior Findings: P0=0 P1=1 P2=0 (read the findings registry before starting — do not assume this is stale)
Dimension Coverage: inventory only
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 4 of 20 (Wave 1 of 6, parallel with iterations 2/3/5)
Mode: review
Review Target: `.opencode/skills/sk-design/feature_catalog/` (6 files) + `.opencode/skills/sk-design/changelog/` (7 files) + `.opencode/skills/sk-design/manual_testing_playbook/` (39 files) ONLY — see WAVE 1 ASSIGNMENT below. NOTE: this is the HUB-LEVEL playbook/catalog/changelog, NOT any mode packet's own internal feature_catalog/changelog (those are reviewed in later waves as part of each mode).
Prior Findings: P0=0 P1=1 P2=0

## WAVE 1 ASSIGNMENT (disjoint file set — DO NOT review files outside this list)

- `.opencode/skills/sk-design/feature_catalog/**`
- `.opencode/skills/sk-design/changelog/**`
- `.opencode/skills/sk-design/manual_testing_playbook/**`

Iterations 2, 3, and 5 are reviewing hub tier, `shared/+benchmark/`, and cross-hub linkage respectively, in parallel with you. Do not duplicate their scope.

## REVIEW CHARTER (task-specific)

Iteration 1 (inventory) confirmed the tree shape — read `review/deep-review-strategy.md` for the full corrected rotation and the one P1 already found (standalone md-generator artifact writers). That P1 is in a DIFFERENT area than your assignment; do not re-investigate it.

## THIS ITERATION'S FOCUS (hub-level feature_catalog/ + changelog/ + manual_testing_playbook/ — correctness + traceability)

1. **`feature_catalog/`**: does it accurately describe hub-level capabilities that actually exist? Any catalog entry describing a feature/behavior that doesn't match the current code (e.g. referencing a mode or command that was renamed/removed)?
2. **`changelog/`**: does every changelog file have correct frontmatter (a `version:` field, per this session's established sk-doc requirement)? Do entries plausibly match real history (no contradictions with the current `mode-registry.json` version)?
3. **`manual_testing_playbook/`** (largest of the three, 39 files): for a sample of scenarios, does the documented test procedure actually match current hub behavior (commands, routing, expected outputs)? Flag any playbook scenario that references a removed/renamed mode, command, or file path.
4. Any genuine bug (stale claim, broken reference, contradiction) is a finding — cite exact file:line evidence.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, traceability (this iteration's assigned focus; security/maintainability covered by sibling wave-1 iterations)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-004.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 2/3/5 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-004.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-004.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-004.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":4,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-004","status":"complete","focus":"correctness-traceability-catalog-changelog-playbook","dimensions":["correctness","traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-004.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
