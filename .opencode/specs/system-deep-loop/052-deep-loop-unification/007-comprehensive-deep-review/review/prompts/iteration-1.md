DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

This is a 20-iteration comprehensive review of the ENTIRE system-deep-loop skill tree. Write ALL outputs to the state files below.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 20
Dimension: Inventory pass — build a real artifact map of the whole system-deep-loop tree
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Coverage Age: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 20
Mode: review
Review Target: .opencode/skills/system-deep-loop (the hub + its 4 workflow packets: deep-research, deep-review, deep-improvement, deep-ai-council)
Prior Findings: P0=0 P1=0 P2=0

## REVIEW CHARTER (task-specific)

This is a 20-iteration comprehensive bug/correctness/security/traceability/maintainability review of the ENTIRE `system-deep-loop` skill family — not a single small packet. Planned rotation (documented in `review/deep-review-strategy.md` section 12, read it):
- Iteration 1 (this one): inventory
- Iterations 2-5: hub tier (SKILL.md, mode-registry.json, hub-router.json, description.json, graph-metadata.json) — correctness/security/traceability/maintainability
- Iterations 6-9: deep-research packet — same 4 dimensions
- Iterations 10-13: deep-review packet — same 4 dimensions
- Iterations 14-17: deep-improvement packet (largest: 459 files, includes the benchmark harness + automation scripts) — same 4 dimensions
- Iterations 18-19: deep-ai-council packet (smallest) — combined correctness+security, then combined traceability+maintainability
- Iteration 20: cross-cutting synthesis — fresh sk-doc template re-checks + final verdict

**KNOWN CONTEXT — read before starting**: a prior packet this session (`052-deep-loop-unification/006-skillmd-template-conformance`, in a sibling folder) already confirmed all 5 SKILL.md files pass `package_skill.py --check` (leaf packets) and `parent-skill-check.cjs` (hub, 34/34 hard invariants) structurally, fixed 131 non-conforming asset filenames across `deep-improvement` plus every reference broken by that rename, fixed changelog frontmatter, and trimmed 3 oversized SKILL.md files. Your job is NOT to re-litigate that structural work — it's to go DEEPER: actual content correctness, security, cross-reference integrity beyond bare structural checks, and maintainability, across the WHOLE tree including references/, assets/, and scripts/ content (not just SKILL.md structure).

## THIS ITERATION'S FOCUS (inventory)

1. Confirm the real shape of the tree: `find .opencode/skills/system-deep-loop -maxdepth 2 -type d | sort` and spot the major structural units (hub, 4 packets, runtime/, shared/, benchmark/, changelog/, manual_testing_playbook/, node_modules/ — the last one is NOT in review scope, it's a dependency tree).
2. For each of the 4 packets, get a rough file-type breakdown (how many .md in references/, how many files in assets/, how many scripts in scripts/, whether there's a changelog/ and README.md).
3. Identify the highest-risk surfaces to prioritize in later iterations: anything that EXECUTES (scripts/*.cjs, *.py, *.sh — read a couple to gauge what they do), anything with cross-packet or cross-file references that could drift, and anything recently modified (the deep-improvement asset rename from the prior packet is the most recently-touched area — worth an early spot-check that nothing was missed).
4. Do a FIRST-PASS spot check (not exhaustive — that's for later iterations): pick 2-3 files across different packets and read them for obvious issues (broken links, wrong file references, inconsistent conventions) to calibrate what "a real finding" looks like here vs. noise.
5. Write a concrete, useful "Next Focus" update for iteration 2 in the strategy file (confirm or adjust the planned rotation based on what you actually found — if one area looks much riskier or cleaner than expected, say so).

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

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-001.md`
  - `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-001.jsonl`
  - `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md` (in-place updates only)
  - `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json` (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- **If a finding is not genuinely new, do not re-count it in findingsSummary** — cumulative totals live in the findings registry, not in each iteration's own summary count.

## OUTPUT CONTRACT

You MUST produce THREE artifacts this iteration.

1. **Iteration narrative markdown** at `review/iterations/iteration-001.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `review/deep-review-state.jsonl` (one single-line JSON object, NOT pretty-printed). The record MUST use `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":1,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"inventory","dimensions":["inventory"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via: `echo '<single-line-json>' >> review/deep-review-state.jsonl`. Do NOT pretty-print.

3. **Per-iteration delta file** at `review/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record plus one line per finding/classification/traceability-check.

All three artifacts are REQUIRED and MUST land in the files.
