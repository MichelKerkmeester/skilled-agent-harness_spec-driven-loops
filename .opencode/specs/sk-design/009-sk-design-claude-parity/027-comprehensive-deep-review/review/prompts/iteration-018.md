DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 18 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 19 and 20 (same wave, Wave 5, the FINAL wave) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 18 of 20
Dimension: security + maintainability — design-md-generator gap-fill (whole packet, both backend and non-backend)
Prior Findings: read `review/deep-review-findings-registry.json` before starting, do not assume this is stale — Wave 4 (iterations 14-17) already covered correctness/traceability for most of `design-md-generator`; this iteration's job is to fill the SECURITY and MAINTAINABILITY gaps across the whole packet, not re-cover what's done
Dimension Coverage: hub tier, all 4 workflow-judgment modes, design-mcp-open-design complete; design-md-generator correctness/traceability/some-security done (Wave 4)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 18 of 20 (Wave 5 of 6 — FINAL wave, parallel with iterations 19/20)
Mode: review
Review Target: `.opencode/skills/sk-design/design-md-generator/` — SECURITY and MAINTAINABILITY dimensions specifically, whole packet (backend + non-backend), gap-fill only
Prior Findings: read the registry

## WAVE 5 ASSIGNMENT (disjoint by DIMENSION, not by file — you may touch any design-md-generator file, but ONLY for security/maintainability gaps not already covered)

- `.opencode/skills/sk-design/design-md-generator/**` — read `review/iterations/iteration-015.md` and `iteration-016.md` first to see exactly what security/maintainability ground they already covered in `backend/`, then focus on what's NOT yet covered.

Iteration 19 covers cross-hub routing consistency (hub-router.json/mode-registry.json/command-metadata.json vs all 6 modes now that every mode has been individually reviewed) — do not duplicate. Iteration 20 covers the final sk-doc template sweep across the whole tree — do not duplicate.

## REVIEW CHARTER (task-specific)

This is a gap-fill iteration. Read `review/deep-review-strategy.md` and the wave-4 iteration narratives (`iteration-014.md` through `iteration-017.md`) to understand exactly what's already been checked, then focus your limited tool budget on what's genuinely NEW ground.

## THIS ITERATION'S FOCUS (design-md-generator gap-fill — security + maintainability)

1. **Security gap-fill**: iteration 15 covered CSS-injection and prompt-data isolation in `backend/`. Check for OTHER security surfaces not yet covered: does `guided-run.ts` (the orchestrator) validate its own inputs before dispatching to sub-scripts? Are there any config files (`.json`/`.env`-like) in this packet that could leak secrets or unsafe defaults if misconfigured?
2. **Maintainability gap-fill**: is the overall `design-md-generator` packet — now that you've seen its full scope across backend + docs — coherently organized, or does it show signs of organic sprawl (duplicate logic between scripts, inconsistent naming conventions between `backend/scripts/*.ts` files)?
3. Any genuine bug is a finding — cite exact file:line evidence. If you find nothing genuinely new (everything already covered by iterations 1/15/16/17), say so explicitly in your verdict rather than manufacturing weak findings to fill the iteration.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

security, maintainability (gap-fill for design-md-generator; correctness/traceability were Wave 4's focus)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-018.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-018.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 19/20 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-018.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-018.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-018.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":18,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-018","status":"complete","focus":"security-maintainability-md-generator-gapfill","dimensions":["security","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-018.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
