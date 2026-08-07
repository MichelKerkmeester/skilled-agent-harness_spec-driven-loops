DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 16 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 14, 15, and 17 (same wave, Wave 4) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 16 of 20
Dimension: traceability + maintainability + sk-doc conformance — design-md-generator/backend/ ONLY
Prior Findings: read `review/deep-review-findings-registry.json` before starting, do not assume this is stale
Dimension Coverage: hub tier, design-interface, design-foundations, design-audit, design-motion complete (Waves 1-3)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 16 of 20 (Wave 4 of 6, parallel with iterations 14/15/17)
Mode: review
Review Target: `.opencode/skills/sk-design/design-md-generator/backend/` (113 files) ONLY
Prior Findings: see registry (P1-001 = standalone artifact writers bypassing output boundary, in this same dir but a different dimension)

## WAVE 4 ASSIGNMENT (disjoint — DO NOT review files outside this list)

- `.opencode/skills/sk-design/design-md-generator/backend/**`

Iteration 15 covers the SAME `backend/` dir's correctness/security dimensions in parallel — do not duplicate that focus, stay on traceability+maintainability+sk-doc only. Iteration 17 covers `design-md-generator`'s NON-backend surfaces — do not touch those. Iteration 14 covers `design-mcp-open-design` — unrelated packet.

## REVIEW CHARTER (task-specific)

`design-md-generator/backend/` is the highest-risk area in sk-design (113 files, mostly executable TypeScript). Iteration 1's inventory already spot-checked several files here — read `review/deep-review-strategy.md` for full context.

## THIS ITERATION'S FOCUS (backend/ — traceability + maintainability + sk-doc conformance)

1. **sk-doc structural conformance**: `design-md-generator` is the largest and most complex mode packet — run `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-md-generator --check` and read its output. Report any error/warning as a finding with the exact rule it violates.
2. **Traceability**: does `mode-registry.json`'s `design-md-generator` entry (`backendKind:"playwright-extract"` presumably, or check the actual claim) accurately describe what `backend/` implements? Does the pipeline's own internal documentation (any README in `backend/`) match the actual script call graph (does `guided-run.ts` genuinely orchestrate `extract.ts` → `build-write-prompt.ts` → `report-gen.ts`/`preview-gen.ts`/`proof.ts` as documented, or has the code drifted from its own docs)?
3. **Maintainability**: 113 files is a lot for one backend — is there genuine dead code (unreferenced scripts, orphaned test fixtures)? Is `output-policy.ts` (the central boundary module referenced by P1-001) itself well-documented so a future contributor would know to route new artifact writers through it?
4. Any genuine bug (structural nonconformance, stale cross-reference, orphaned content, undocumented architectural drift) is a finding — cite exact file:line evidence.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

traceability, maintainability (this iteration's assigned focus, plus sk-doc structural conformance; correctness/security covered by iteration 15 in parallel)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-016.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-016.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 14/15/17 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-016.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-016.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-016.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":16,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-016","status":"complete","focus":"traceability-maintainability-skdoc-md-generator-backend","dimensions":["traceability","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-016.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
