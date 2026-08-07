DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 15 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 14, 16, and 17 (same wave, Wave 4) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 15 of 20
Dimension: correctness + security — design-md-generator/backend/ ONLY (the executable pipeline)
Prior Findings: P0=0 P1=1 already in this exact area (P1-001, standalone artifact writers bypassing output boundary — iteration 1) plus other P1s/P2s elsewhere in the tree; read `review/deep-review-findings-registry.json` before starting, do not re-count P1-001
Dimension Coverage: hub tier, design-interface, design-foundations, design-audit, design-motion complete (Waves 1-3)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 15 of 20 (Wave 4 of 6, parallel with iterations 14/16/17)
Mode: review
Review Target: `.opencode/skills/sk-design/design-md-generator/backend/` (113 files: mostly `backend/scripts/*.ts`) ONLY
Prior Findings: see registry; P1-001 already covers `preview-gen.ts`/`proof.ts`/`report-gen.ts` output-boundary bypass — do not re-file it, but DO look for related/adjacent issues in the SAME files or siblings

## WAVE 4 ASSIGNMENT (disjoint — DO NOT review files outside this list)

- `.opencode/skills/sk-design/design-md-generator/backend/**`

Iteration 16 covers the SAME `backend/` dir's traceability/maintainability/sk-doc dimensions in parallel — do not duplicate that focus, stay on correctness+security only. Iteration 17 covers `design-md-generator`'s NON-backend surfaces (assets/procedures/references/feature_catalog/manual_testing_playbook/changelog) — do not touch those. Iteration 14 covers `design-mcp-open-design` — unrelated packet.

## REVIEW CHARTER (task-specific)

`design-md-generator/backend/` is the highest-risk area in the whole sk-design tree: nearly all executable TypeScript lives here (113 files, mostly `.ts`/`.js`), including a live P1 already found in iteration 1 (`preview-gen.ts`, `proof.ts`, `report-gen.ts` bypass `resolveOutputPath`/`requireOutputPath`). A SEPARATE, already-closed review (`.opencode/specs/sk-design/009-sk-design-claude-parity/review/`, dated 2026-07-06, out of scope for this pass — do not edit it) previously found additional P1s in this exact directory: output/artifact policy mismatches, CSS-context injection surfaces in generated report/preview artifacts, and prompt-data isolation gaps in `build-write-prompt.ts`/`extract.ts`. Iteration 1 (this review's own inventory) already spot-checked `build-write-prompt.ts` and found prompt-data isolation "looks mitigated" (scraped text fenced as inert data, backticks neutralized) — confirm or refute that with a deeper look, and check whether the CSS-injection concern in `css-analyzer.ts`/`report-gen.ts`/`preview-gen.ts` is still live.

## THIS ITERATION'S FOCUS (backend/ — correctness + security)

1. **CSS-context injection**: read `css-analyzer.ts` and how its output feeds `report-gen.ts`/`preview-gen.ts` — is extracted/generated CSS content ever embedded into an HTML/report artifact without escaping, creating a script/style injection surface if the source site's CSS contains malicious content?
2. **Prompt-data isolation (verify, don't re-file if already mitigated)**: read `build-write-prompt.ts` and `extract.ts` more deeply than iteration 1's spot-check — confirm scraped/extracted site content is genuinely fenced as inert data in every prompt-construction path, not just the one iteration 1 sampled.
3. **Output-boundary bypass adjacent scan**: `guided-run.ts` and `extract.ts` correctly call `resolveOutputPath` per iteration 1's finding — scan for any OTHER file in `backend/scripts/` that writes an artifact (search for `writeFileSync`/`fs.write` calls) and check whether it too bypasses the output-policy boundary (this could reveal MORE instances beyond the 3 already named in P1-001, which would matter for how broad the eventual fix needs to be).
4. **Correctness**: any other logic errors, incorrect path handling, or broken assumptions in the pipeline scripts you read?
5. Any genuine bug is a finding — cite exact file:line evidence. If you find MORE files affected by the same bug class as P1-001, note them explicitly (still don't re-file the original 3, but DO register the newly-discovered ones as new evidence/scope on the SAME finding class if the registry format allows, or as a related new finding).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security (this iteration's assigned focus; traceability/maintainability/sk-doc covered by iteration 16 in parallel)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-015.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-015.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 14/16/17 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-015.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-015.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-015.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":15,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-015","status":"complete","focus":"correctness-security-md-generator-backend","dimensions":["correctness","security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-015.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
