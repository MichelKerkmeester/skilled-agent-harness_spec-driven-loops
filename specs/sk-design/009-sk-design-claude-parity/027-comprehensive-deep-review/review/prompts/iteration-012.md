DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 12 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 10, 11, and 13 (same wave, Wave 3) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 12 of 20
Dimension: correctness + security — design-motion mode packet
Prior Findings: P0=0 P1=6 P2=8 — read `review/deep-review-findings-registry.json` before starting, do not assume this is stale
Dimension Coverage: hub tier, design-interface, design-foundations complete (Waves 1-2); design-audit in progress (iterations 10/11, parallel)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 12 of 20 (Wave 3 of 6, parallel with iterations 10/11/13)
Mode: review
Review Target: `.opencode/skills/sk-design/design-motion/` (33 files) ONLY
Prior Findings: P0=0 P1=6 P2=8

## WAVE 3 ASSIGNMENT (disjoint — DO NOT review files outside this packet)

- `.opencode/skills/sk-design/design-motion/**`

Iteration 13 covers the SAME packet's traceability/maintainability/sk-doc dimensions in parallel — do not duplicate its dimension focus, stay on correctness+security only. Iterations 10/11 cover `design-audit` in parallel — different packet, do not touch it.

## REVIEW CHARTER (task-specific)

Waves 1-2 found 6 P1s and 8 P2s — read `review/deep-review-strategy.md` for full context, including a repeated P1 pattern of `/design:*` command-metadata omitting packet procedure surfaces.

## THIS ITERATION'S FOCUS (design-motion — correctness + security)

1. **Correctness**: read `SKILL.md` and `procedures/` — does the documented motion/animation-design methodology actually match what the reference-base citations support? Motion mode often deals with timing/easing specs and CSS animation properties — check for accuracy of any technical claims (easing curve math, duration conventions, accessibility/reduced-motion guidance).
2. **Correctness**: cross-check `references/` — broken internal links, references to non-existent files/sections, outdated claims.
3. **Security**: confirm `toolSurface.allowed`/`forbidden` for `design-motion` in `mode-registry.json` — does anything in this packet's own docs/procedures imply an action requiring a forbidden tool? If motion mode generates any CSS/animation code snippets as output guidance, check whether any example demonstrates unsafe patterns (e.g. unsanitized dynamic values in generated CSS).
4. **Command metadata check**: does `/design:motion` in `command-metadata.json` correctly enumerate this packet's actual `procedures/` (checking for the omission pattern found in `design-foundations`, P1-009-001)?
5. Any genuine bug is a finding — cite exact file:line evidence.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security (this iteration's assigned focus; traceability/maintainability/sk-doc covered by iteration 13 in parallel)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-012.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-012.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 10/11/13 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-012.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-012.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-012.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":12,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-012","status":"complete","focus":"correctness-security-design-motion","dimensions":["correctness","security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-012.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
