DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 5 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 2, 3, and 4 (same wave) — each has a DISJOINT primary file assignment; you may read (but not deeply re-review) mode packet entrypoints only as needed to verify a hub-level claim.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 5 of 20
Dimension: security + traceability — cross-hub routing consistency
Prior Findings: P0=0 P1=1 P2=0 (read the findings registry before starting — do not assume this is stale)
Dimension Coverage: inventory only
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 5 of 20 (Wave 1 of 6, parallel with iterations 2/3/4)
Mode: review
Review Target: cross-hub routing consistency — see WAVE 1 ASSIGNMENT below
Prior Findings: P0=0 P1=1 P2=0

## WAVE 1 ASSIGNMENT (primary focus — cross-references only, no deep mode-internal review)

- `.opencode/skills/sk-design/hub-router.json`, `mode-registry.json`, `command-metadata.json` — the routing/discriminator layer (already reviewed for internal correctness by iteration 2; your job is to verify these against the ACTUAL mode packets, not re-review them standalone).
- Read-only entrypoint checks in each of the 6 mode packets: does `design-interface/SKILL.md`, `design-foundations/SKILL.md`, `design-motion/SKILL.md`, `design-audit/SKILL.md`, `design-md-generator/SKILL.md`, `design-mcp-open-design/SKILL.md` each declare a `name`/frontmatter identity that matches what `mode-registry.json` claims as `packetSkillName`? Do the `proceduresPath`/`toolSurface.allowed` claims in `mode-registry.json` match reality (does the procedures dir exist at the claimed path; do the packets' own tool-usage match the declared allowed/forbidden lists)?

Iterations 2, 3, and 4 own hub tier, `shared/+benchmark/`, and `feature_catalog/+changelog/+manual_testing_playbook/` respectively — this iteration is the ONLY one doing cross-file linkage verification; do not duplicate their standalone reviews of those files.

## REVIEW CHARTER (task-specific)

Iteration 1 (inventory) confirmed the tree shape — read `review/deep-review-strategy.md` for the full corrected rotation and the one P1 already found (standalone md-generator artifact writers). That P1 is in a DIFFERENT area than your assignment; do not re-investigate it.

## THIS ITERATION'S FOCUS (cross-hub routing consistency — security + traceability)

1. **Routing table accuracy**: for each of the 6 modes declared in `mode-registry.json`, confirm the packet folder exists, its `SKILL.md` exists and is internally consistent with the registry's claims (packetSkillName, backendKind, toolSurface).
2. **Transport-axis boundary**: `design-mcp-open-design` is `packetKind:"transport"`, `mutatesWorkspace:false` per the registry — confirm this claim against its actual `SKILL.md`/scripts (does it genuinely never write inside this repo, only to the external Open Design app?). If it CAN mutate the workspace despite the declared `false`, that's a security-relevant traceability mismatch.
3. **Tool-surface enforcement**: for each mode with `toolSurface.forbidden` listing `Write`/`Edit`/`Bash` (e.g. `design-interface` per iteration 2's likely findings), is there any actual code path in that mode's own scripts/procedures that would need a forbidden tool — i.e. does the registry's declared surface match what the packet can actually do, or is there a doc/reality mismatch?
4. Any genuine bug (stale routing claim, mismatched tool surface, transport boundary violation) is a finding — cite exact file:line evidence.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

security, traceability (this iteration's assigned focus; correctness/maintainability covered by sibling wave-1 iterations)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-005.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 2/3/4 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-005.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-005.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-005.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":5,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-005","status":"complete","focus":"security-traceability-cross-hub-routing","dimensions":["security","traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-005.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
