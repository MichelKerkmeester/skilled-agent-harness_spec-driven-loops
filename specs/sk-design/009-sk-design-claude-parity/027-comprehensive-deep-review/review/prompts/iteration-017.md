DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 17 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 14, 15, and 16 (same wave, Wave 4) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 17 of 20
Dimension: correctness + traceability — design-md-generator NON-backend surfaces ONLY
Prior Findings: read `review/deep-review-findings-registry.json` before starting, do not assume this is stale
Dimension Coverage: hub tier, design-interface, design-foundations, design-audit, design-motion complete (Waves 1-3); design-md-generator/backend/ in progress (iterations 15/16, parallel)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 17 of 20 (Wave 4 of 6, parallel with iterations 14/15/16)
Mode: review
Review Target: `.opencode/skills/sk-design/design-md-generator/{assets,procedures,references,feature_catalog,manual_testing_playbook,changelog}/` (per iteration 1's inventory: assets 3, procedures 1, references 23, feature_catalog 9, manual_testing_playbook 19, changelog 1 — 56 files total) ONLY — plus `SKILL.md` and `README.md` for this packet.

## WAVE 4 ASSIGNMENT (disjoint — DO NOT review files outside this list)

- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/README.md` (if it exists)
- `.opencode/skills/sk-design/design-md-generator/assets/**`
- `.opencode/skills/sk-design/design-md-generator/procedures/**`
- `.opencode/skills/sk-design/design-md-generator/references/**`
- `.opencode/skills/sk-design/design-md-generator/feature_catalog/**`
- `.opencode/skills/sk-design/design-md-generator/manual_testing_playbook/**`
- `.opencode/skills/sk-design/design-md-generator/changelog/**`

Iterations 15/16 cover `design-md-generator/backend/` in parallel — do NOT touch it, that's a different assignment. Iteration 14 covers `design-mcp-open-design` — unrelated packet.

## REVIEW CHARTER (task-specific)

This iteration covers `design-md-generator`'s documentation/config surfaces (as opposed to iterations 15/16's coverage of the executable `backend/`). This mode packet is the largest and most complex in sk-design — its docs need to accurately describe a genuinely complex pipeline (Playwright extraction → prompt construction → guided generation → report/preview/proof artifacts).

## THIS ITERATION'S FOCUS (design-md-generator non-backend — correctness + traceability)

1. **`SKILL.md` correctness**: does it accurately describe the pipeline stages and what the backend actually does? Cross-check a couple of claims against what iteration 1's inventory found in `backend/scripts/`.
2. **`references/`** (23 files, the largest non-backend dir): broken internal links, references to non-existent backend files, outdated technical claims about the extraction/generation process.
3. **`feature_catalog/`** (9 files): does it accurately catalog what this mode can do? Any entry referencing a removed/renamed backend capability?
4. **`manual_testing_playbook/`** (19 files): do documented test scenarios match actual current backend behavior?
5. **`changelog/`** (1 file): correct `version:` frontmatter?
6. Any genuine bug (stale claim, broken reference) is a finding — cite exact file:line evidence.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, traceability (this iteration's assigned focus; security/maintainability of this packet's non-backend surfaces are lower-priority given no execution surface here — flag anything genuinely security-relevant you notice, but don't force a search)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-017.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-017.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 14/15/16 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-017.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-017.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-017.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":17,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-017","status":"complete","focus":"correctness-traceability-md-generator-nonbackend","dimensions":["correctness","traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-017.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
