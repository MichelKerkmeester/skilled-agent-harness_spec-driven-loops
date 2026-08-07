DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is iteration 14 of a 20-iteration comprehensive review of sk-design, dispatched in parallel waves. You are running CONCURRENTLY with iterations 15, 16, and 17 (same wave, Wave 4) — each has a DISJOINT assignment; do not review files outside your assignment below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 14 of 20
Dimension: correctness + security + traceability + maintainability (combined single pass) — design-mcp-open-design transport packet
Prior Findings: P0=0 P1=~7-9 P2=~10-13 (exact count grows each wave — read `review/deep-review-findings-registry.json` before starting, do not assume this is stale)
Dimension Coverage: hub tier, design-interface, design-foundations, design-audit, design-motion complete (Waves 1-3)
Coverage Age: 1
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 14 of 20 (Wave 4 of 6, parallel with iterations 15/16/17)
Mode: review
Review Target: `.opencode/skills/sk-design/design-mcp-open-design/` (33 files) ONLY
Prior Findings: read the registry — do not assume a stale count

## WAVE 4 ASSIGNMENT (disjoint — DO NOT review files outside this packet)

- `.opencode/skills/sk-design/design-mcp-open-design/**`

Iterations 15/16/17 cover `design-md-generator` in parallel — different packet entirely, do not touch it.

## REVIEW CHARTER (task-specific)

`design-mcp-open-design` is the ONLY `packetKind:"transport"` packet in sk-design — per project convention ("Pure transport is exempt" from full design-judgment review scrutiny, `.opencode/skills/sk-design/mode-registry.json`'s `extensions.transport-axis`), it gets ONE combined pass across all 4 dimensions rather than a split pass like the workflow-judgment modes. Wave 1's cross-hub iteration (5) already confirmed `mutatesWorkspace:false` looks correctly honored at a coarse level (its scripts are install/verify/report-only, routing mutating Open Design operations to the external app). This iteration goes deeper into the packet's own content.

## THIS ITERATION'S FOCUS (design-mcp-open-design — combined pass)

1. **Correctness**: read `SKILL.md` — does it accurately describe the transport's actual capabilities (bridging to the external Open Design app's `od` CLI and stdio MCP server)? Per project CLAUDE.md: "Open Design dispatch MUST co-load sk-design's own workflow modes first (the transport never decides taste)" — does this packet's own docs correctly state that mandatory-pairing requirement, or could a reader mistakenly believe the transport can be used standalone for design decisions?
2. **Security**: read `scripts/install.sh` and any other `.sh`/executable scripts. Any unsafe construction (unvalidated input into shell commands, unsafe curl/download patterns, missing integrity checks)?
3. **Traceability**: does `mode-registry.json`'s transport entry (`toolSurface.allowed:[Read,Bash]`, `forbidden:[Write,Edit,Task]`, `mutatesWorkspace:false`) match the packet's actual scripts and any MCP server config?
4. **Maintainability**: is the packet self-documenting? Any dead/orphaned file?
5. **sk-doc conformance**: run `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-mcp-open-design --check` and report any error/warning.
6. Any genuine bug is a finding — cite exact file:line evidence.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability (combined — this is the ONLY iteration covering this packet)

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-014.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-014.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- You are running IN PARALLEL with iterations 15/16/17 this wave. Do NOT edit `review/deep-review-strategy.md` or `review/deep-review-findings-registry.json` — those are updated ONCE after the whole wave completes, not per-iteration, to avoid concurrent-write races.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-014.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-014.jsonl`
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary.**

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-014.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":14,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-014","status":"complete","focus":"combined-design-mcp-open-design","dimensions":["correctness","security","traceability","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-014.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
