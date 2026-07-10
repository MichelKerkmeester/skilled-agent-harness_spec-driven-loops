DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 19 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 18 and 20 (same wave, Wave 5, the FINAL wave) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 19 of 20
Dimension: correctness + traceability — cross-hub routing consistency, RE-VERIFICATION pass
Prior Findings: read `review/deep-review-findings-registry.json` before starting — this is a re-verification pass now that every mode has been individually reviewed (iteration 5 did an early cross-hub pass in Wave 1, before most mode-level findings existed)
Dimension Coverage: all 6 modes + hub tier now individually reviewed (Waves 1-4)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 19 of 20 (Wave 5 of 6 — FINAL wave, parallel with iterations 18/20)
Mode: review
Review Target: cross-hub routing/metadata files, re-checked against the FULL findings picture now available
Prior Findings: read the registry

## WAVE 5 ASSIGNMENT (disjoint — cross-reference verification only)

- `.opencode/skills/sk-design/hub-router.json`, `mode-registry.json`, `command-metadata.json`, `description.json`, `graph-metadata.json` — re-check these against the NOW-COMPLETE picture of all 6 modes' actual behavior (as established by iterations 6-17), not a fresh standalone review.

Iteration 18 covers `design-md-generator` security/maintainability gap-fill — do not duplicate. Iteration 20 covers the final sk-doc template sweep — do not duplicate.

## REVIEW CHARTER (task-specific)

Iteration 5 (Wave 1) did an early cross-hub pass and found `packetSkillName`/router-table/tool-surface parity mostly PASS, with one PARTIAL flag on `design-foundations` tool-surface that iteration 8/9 later confirmed as a real P1 (`/design:foundations` command metadata omitting the procedures/ surface, P1-009-001). Now that iterations 6-18 have individually reviewed every mode, this iteration's job is to check whether that SAME command-metadata-omission bug pattern recurs in OTHER modes (design-interface iteration 7 flagged a related PARTIAL on transform-verb projections; design-audit iteration 10/11 and design-motion iteration 12/13 were asked to check for it too — read their narratives and see what they found) and whether any NEW cross-hub inconsistency emerged from the accumulated mode-level findings that a single early pass (iteration 5) couldn't have seen.

## THIS ITERATION'S FOCUS (cross-hub routing consistency — re-verification)

1. **Command-metadata pattern check**: read iterations 7, 9, 10, 11, 12, 13's narratives (or the findings registry) for any command-metadata-omission findings across `design-interface`/`design-audit`/`design-motion`. Is this a systemic pattern across `command-metadata.json` (e.g. a generation/maintenance process that doesn't keep pace with new procedures), or isolated to `design-foundations`? If systemic, that elevates it from an isolated P1 to a maintainability-process finding worth calling out explicitly.
2. **Full router-table re-check**: with all 6 modes now individually verified, does `hub-router.json`'s routing signals still hold for every mode, or did any mode-level review surface something that changes the routing-correctness picture?
3. **description.json/graph-metadata.json freshness**: iteration 2 (Wave 1) checked these — do their `keywords`/`trigger_phrases` still look complete now that 18 iterations of deep findings exist (unrelated to this — just confirming no genuinely new staleness surfaced)?
4. Any genuine bug (a real cross-cutting pattern, not just a re-statement of an already-filed finding) is a finding — cite exact file:line evidence across the relevant modes.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, traceability (re-verification focus)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-019.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-019.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 18/20 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-019.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-019.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-019.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":19,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-019","status":"complete","focus":"correctness-traceability-cross-hub-reverify","dimensions":["correctness","traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-019.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
