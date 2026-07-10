DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is a 20-iteration comprehensive review of the ENTIRE sk-design skill tree, dispatched in parallel waves after this solo inventory iteration. Write ALL outputs to the state files below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 20
Dimension: Inventory pass — build a real artifact map of the whole sk-design tree, finalize the design-md-generator sampling strategy
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Coverage Age: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 20
Mode: review
Review Target: .opencode/skills/sk-design (the hub + 6 modes: design-interface, design-foundations, design-motion, design-audit, design-md-generator, design-mcp-open-design transport)
Prior Findings: P0=0 P1=0 P2=0

## REVIEW CHARTER (task-specific)

This is a 20-iteration comprehensive bug/correctness/security/traceability/maintainability review of the ENTIRE `sk-design` skill family, dispatched in parallel waves of 3-4 concurrent iterations (not strictly sequential). Planned rotation (documented in `review/deep-review-strategy.md`, read it):
- Iteration 1 (this one, solo): inventory
- Wave 1 (iters 2-5, parallel): hub tier (SKILL.md, mode-registry.json, hub-router.json, description.json, graph-metadata.json, README.md, command-metadata.json) + hub-level cross-cutting dirs (shared/, benchmark/, feature_catalog/, changelog/, manual_testing_playbook/)
- Wave 2 (iters 6-9, parallel): design-interface + design-foundations
- Wave 3 (iters 10-13, parallel): design-audit + design-motion
- Wave 4 (iters 14-17, parallel): design-mcp-open-design (combined, transport-exempt lighter pass) + design-md-generator backend (2847 files — the largest area, prioritizing the executable backend/scripts pipeline)
- Wave 5 (iters 18-20, parallel): design-md-generator remaining coverage + cross-hub routing consistency + final sk-doc template sweep

**KNOWN CONTEXT — read before starting**: a SEPARATE, already-CLOSED review (`.opencode/specs/sk-design/009-sk-design-claude-parity/review/`, status complete, dated 2026-07-06) reviewed the `009-sk-design-claude-parity` packet's own SPEC-FOLDER DOCUMENTATION (spec.md/plan.md/tasks.md/etc. for phases 001-026), NOT the sk-design skill tree's actual content. It found 8 open P1 findings concentrated in `design-md-generator/backend/` (WRITE-prompt provenance, output/sandbox boundary, prompt-data isolation, CSS-context injection). That review is OUT OF SCOPE for this pass — do not re-open, re-litigate, or edit it. However, its P1 findings ARE useful signal: if this iteration's inventory pass touches `design-md-generator/backend/scripts/{build-write-prompt.ts,extract.ts,guided-run.ts,report-gen.ts,preview-gen.ts,proof.ts,css-analyzer.ts}`, note whether those specific findings still look live in the actual code (informs wave 4's dedicated md-generator backend focus) — but do not assume the prior review's findings are already fixed or already tracked in THIS packet's own registry; if still live, they are legitimately NEW findings for this review's own registry too.

## THIS ITERATION'S FOCUS (inventory)

1. Confirm the real shape of the tree: `find .opencode/skills/sk-design -maxdepth 2 -type d | sort` and spot the major structural units (hub, 6 modes, shared/, benchmark/, feature_catalog/, changelog/, manual_testing_playbook/, node_modules/ inside design-md-generator — that last one is NOT in review scope, it's a dependency tree).
2. For each of the 6 modes, get a rough file-type/size breakdown (references/, assets/, procedures/ counts; whether there's a changelog/ and README.md). `design-md-generator` alone is 2847 files (1362 js, 544 ts, 229 md, 201 json, 169 cjs) — confirm this figure and get a breakdown of its subdirs (`backend/`, `assets/`, `procedures/`, `references/`, `feature_catalog/`, `manual_testing_playbook/`, `changelog/`).
3. Identify the highest-risk surfaces to prioritize in later iterations: anything that EXECUTES (`design-md-generator/backend/scripts/*.ts`, any `.cjs`/`.sh` automation across other modes — read a couple to gauge what they do), anything with cross-mode or cross-file references that could drift (hub-router.json/mode-registry.json's routing claims vs actual packet structure), and the specific 7 files named in "KNOWN CONTEXT" above (spot-check whether their claimed P1 issues still look live).
4. Do a FIRST-PASS spot check (not exhaustive): pick 2-3 files across different modes and read them for obvious issues (broken links, wrong file references, inconsistent conventions) to calibrate what "a real finding" looks like here vs. noise.
5. Write a concrete, useful "Next Focus" update in the strategy file — confirm or adjust the planned wave rotation based on what you actually found (if `design-md-generator` looks riskier/larger than the current 4-iteration allocation accounts for, say so explicitly; if `design-mcp-open-design`'s combined single-pass looks insufficient, say so).
6. Confirm wave 1's four disjoint file-set assignments in the strategy file are genuinely non-overlapping (hub tier vs. hub-level cross-cutting dirs) so parallel dispatch doesn't duplicate coverage.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

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
- Write iteration narrative to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/iterations/iteration-001.md`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deltas/iter-001.jsonl`
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md` (in-place updates only)
  - `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json` (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary** — cumulative totals live in the findings registry, not in each iteration's own summary count.

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-001.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":1,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"inventory","dimensions":["inventory"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-09T05:15:59.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
