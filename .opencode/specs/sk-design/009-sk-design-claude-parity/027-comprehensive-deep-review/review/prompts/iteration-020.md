DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 20 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves — the FINAL iteration. You are running CONCURRENTLY with iterations 18 and 19 (same wave, Wave 5) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 20 of 20 (FINAL)
Dimension: cross-cutting synthesis — fresh sk-doc re-checks across the whole tree + final verdict
Prior Findings: read `review/deep-review-findings-registry.json` before starting — by this point the registry should hold the full accumulated findings set from iterations 1-19
Dimension Coverage: all 6 modes + hub tier + cross-cutting dirs fully reviewed (Waves 1-4), gap-fill + re-verification in progress (iterations 18/19, parallel)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 20 of 20 (Wave 5 of 6 — FINAL wave, parallel with iterations 18/19)
Mode: review
Review Target: cross-cutting synthesis across the ENTIRE sk-design tree
Prior Findings: read the registry — this is the last iteration, treat the accumulated findings as authoritative context

## WAVE 5 ASSIGNMENT (disjoint — synthesis and fresh structural re-checks, no new content review)

- Fresh, NOT cached, structural checker runs across the whole hub: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` and `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/<mode> --check` for EACH of the 6 mode packets.
- Synthesis of the accumulated findings registry into a coherent overall verdict.

Iteration 18 covers `design-md-generator` security/maintainability gap-fill — do not duplicate that content review. Iteration 19 covers cross-hub routing re-verification — do not duplicate.

## REVIEW CHARTER (task-specific)

This is the closing iteration of a 20-iteration comprehensive review. Your job is NOT to find new content bugs (that was iterations 1-19's job) — it's to (a) run FRESH structural checks (not trust anything cached from iteration 2's early hub-tier check, since the tree may have accumulated context since then even though no files were actually modified during this read-only review), and (b) produce an honest synthesis of what the full 20-iteration review found.

## THIS ITERATION'S FOCUS (final structural re-check + synthesis)

1. **Fresh hub check**: run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` fresh. Report the exact pass/fail/warning count.
2. **Fresh per-mode checks**: run `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/<mode> --check` for each of `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, `design-mcp-open-design`. Report each result.
3. **Synthesis**: read the full `deep-review-findings-registry.json` (by now it should reflect iterations 1-19's cumulative findings, though 18/19 may still be writing in parallel — note if the registry looks incomplete and account for that in your verdict). Summarize: total P0/P1/P2 count, the dominant risk theme (likely `design-md-generator/backend/`'s output-boundary bypass pattern), and whether the overall verdict is FAIL/CONDITIONAL/PASS.
4. Any NEW structural finding from the fresh checker runs is a finding — cite exact evidence. This iteration's narrative should read as a genuine closing synthesis, not a repeat of prior iterations' content.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability (synthesis across all four, plus a fresh sk-doc conformance pass)

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain. This is the final iteration's verdict — make it count as the review's overall signal.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-020.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-020.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 18/19 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-020.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-020.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-020.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension (write "None — review complete" for this last field).

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":20,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-020","status":"complete","focus":"synthesis-final","dimensions":["correctness","security","traceability","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-020.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
