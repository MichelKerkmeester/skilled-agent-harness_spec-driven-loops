# Iteration 010 -- Traceability (core protocol closure)

## Dispatcher
- Iteration 10 of 10, the last under the cap. Dimension traceability. Focus: finish `checklist_evidence` against the parent and child tasks.md checklists with file:line evidence, re-record `spec_code`, and run `agent_cross_runtime` over the deep-review agent mirrors.
- Operator focus addressed: code and runtime files were used as the ground truth for every checklist claim checked (frontier-admit.cjs, both workflow YAMLs, divergent-pivot.ts, reduce-state.cjs). Packet docs were read only to pull the claims. No overengineering pass this iteration: the budget went to closing the core protocol, and the overengineering findings already open (R5-P2-001, R5-P2-002, R8-P2-001 to R8-P2-004) are left as recorded.
- State read: config (sessionId 2026-11-19T04:20:12.962Z, generation 1, lineageMode new), registry (P0=0 P1=2 P2=14), strategy, iteration-009, iteration-003 checklist notes. JSONL count is 9 iteration records, so this is iteration 10 and agrees with the dispatch.

## Files Reviewed
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/tasks.md:48-75 (parent T004-T010 and completion rows)
- 001-014 child tasks.md checkbox counts (open/done per phase)
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/tasks.md:175-192, :204; spec.md:37
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/tasks.md:122-125, :181-276, :208
- 004, 008, 012, 013, 014 tasks.md ticked rows (T001-T014 samples)
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:440-460, :505-528
- .skilled/commands/deep/assets/deep-research.yaml:1818, .skilled/commands/deep/assets/deep-review.yaml:1932 (redispatch_once clause)
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts (unreachable comparison removed)
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:24, :993, :1225-1247
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2608
- .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts:183-189
- .skilled/agents/deep-review.md:170, :189, :343; .claude/agents/deep-review.md; .pi/agents/deep-review.md; .codex/agents/deep-review.toml:160, :179, :333; .vibe/agents/deep-review.toml:4; .dsh/agents/deep-review.patch.yml

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Research admission never checks proposal scope against the root scope, so 010 CHK-032 is unmet in code, not just unticked** -- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:525 -- Refines R3-P2-002, which left this row as "not verified". The relevance check in `checkProposal` requires a question, evidence and a non-empty scope (:520-522), then tests scope only when `reviewConfig` is set (:525). A research run passes no review config, so any non-empty scope string passes relevance. The 010 checklist row CHK-032 [P1] "Proposal scope must intersect the root scope, so a leaf cannot steer the run outside its target" (010 tasks.md:204) is therefore not met by the code, while 011's equivalent row is ticked and backed by `scopeInsideReviewTarget` plus a test case (011 tasks.md:208; frontier-admit-review.vitest.ts:183-189). The 010 spec.md and implementation-summary.md hold no requirement or waiver for the intersection, so the gap is a checklist claim with no owner rather than a broken REQ. That keeps it at P2. The remaining budget, depth and fan-out caps still bound how far a leaf can steer.
   Finding class: checklist_evidence_drift
   Scope proof: frontier-admit.cjs and 010/011 tasks.md are in reviewScopeFiles; the research path reaches checkProposal with options.reviewConfig undefined (frontier-admit.cjs:515).
   Affected surface hints: frontier-admit.cjs checkProposal relevance block; 010-research-frontier-mode/tasks.md CHK-032; 010 implementation-summary.md known limitations
   Case: a research leaf writes a frontier_proposal with parentId root, a question and evidence, and scope set to an unrelated topic; checkProposal finds no relevance failure and admits it as a depth-1 node.

## Traceability Checks
- **checklist_evidence** -- partial (final). Ticked-row evidence was spot-checked against current files and holds:
  - 013 T004/T005: the shared redispatch clause is present once in each YAML (.skilled/commands/deep/assets/deep-research.yaml:1818, .skilled/commands/deep/assets/deep-review.yaml:1932). The cited lines 1683 and 1772 have drifted with later phases.
  - 013 T007: "Never re-dispatch a given iteration more than once" counts 1 in each YAML.
  - 012 T003: `remainingIterations < config` no longer appears in divergent-pivot.ts (grep exit 1).
  - 004 T006: a leaf `nextFocus` read outside the parser (deep-research/scripts/reduce-state.cjs:2608).
  - 008 T004: `REQUIRED_DIMENSIONS` is the constant (reduce-state.cjs:24), the universe builder (:1225) and default parameters (:993, :1237, :1247). The task's "only in the universe builder, the constant and the export" is loose but not wrong in effect.
  - 008 T008: the custom-dimension rule is in all six deep-review agent files (see agent_cross_runtime).
  - 014 T001: originally "Open 2026-11-18", then closed "Done 2026-11-19" in the same row (014 tasks.md:37). It is consistent.
  - 010 CHK-023: the cited `scratch/pilot-run-2.md` exists.
  The protocol stays partial, not pass. 010 leaves P0 rows CHK-020 (tasks.md:177) and CHK-FIX-001..004 (tasks.md:188-191) open, and 011 leaves CHK-020 open (011 tasks.md:181), on phases marked Complete (R3-P2-002). 010 CHK-032 is now confirmed unmet in code (R10-P2-001). Parent T004-T010 remain open (tasks.md:48-63; R3-P2-001). Phases 002-009 and 012-014 show zero open rows, and 001 shows one open row.
- **spec_code** -- partial (re-recorded). The run_extended ceiling identity holds between the YAML producer and the schema (.skilled/commands/deep/assets/deep-review.yaml:550), and the review floor change is owned by phase 003. It stays partial because R1-P1-001 is unchanged: `isCommitRange` still requires the whole target to be one token (frontier-admit.cjs:452-454), so a commit-range target written with surrounding text loses its touched-file relevance scope.
- **agent_cross_runtime** -- pass. The custom-dimension rule from 008 is present in the canonical agent and every mirror: .skilled/agents/deep-review.md:170, :189 and :343, matched at .codex/agents/deep-review.toml:160, :179 and :333. The .vibe single-line instructions string carries 3 "configured custom dimension" phrases and 1 "Custom (configured)" row (.vibe/agents/deep-review.toml:4), and .claude, .pi and .dsh each have 3 matching lines.

## Integration Evidence
- Workflow `.skilled/commands/deep/assets/deep-research.yaml:1818` and `.skilled/commands/deep/assets/deep-review.yaml:1932`: `on_failure.redispatch_once` carries the executor_missing / findings_not_enumerated / ledger_backing_missing skip clause word for word.
- Mirrors `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.pi/agents/deep-review.md`, `.vibe/agents/deep-review.toml`, `.dsh/agents/deep-review.patch.yml`: checked for the custom-dimension rule only, as read-only context.

## Edge Cases
- Line drift: the evidence lines in the 013 task rows (1683, 1772) no longer match. Phases 014 and later edits moved the clause. The claim is checked by content, not by line.
- The contradiction between the checklist and acceptance-criteria.md is still not adjudicated, because acceptance-criteria.md is outside reviewScopeFiles. The checklist is treated as the stale side, as in iteration 3.
- Final-line mapping: R1-P1-001 and R2-P1-001 stay active, so the verdict is CONDITIONAL although this iteration raised only a P2.
- `skill_agent`, `feature_catalog_code` and `playbook_capability` were not re-run this iteration and are left out of the record rather than recorded as pending.

## Confirmed-Clean Surfaces
- Deep-review agent mirror parity for the custom-dimension rule (six files).
- 012 unreachable minRemainingIterations comparison removed as the task states. Keeping the field is the task's explicit requirement (012 tasks.md T003), which bears on R8-P2-001. That finding is not re-reported.
- 013 redispatch skip clause and the one-redispatch cap in both YAMLs.

## Ruled Out
- 014 T001 ticked while marked open: the same row records the later close with its command output.
- 008 T004 `REQUIRED_DIMENSIONS` default parameters as a routing leak: every call site that matters passes the universe, and the defaults only serve direct callers of the exported helpers.
- .vibe deep-review mirror missing the custom rule: the low line count comes from a one-line TOML string, and the rule text is present.

## Next Focus
- Dimension: none (cap reached). Synthesis next.
- Focus area: synthesis should carry R1-P1-001 and R2-P1-001 as the release-blocking items, and R3-P2-002 with its refinement R10-P2-001 as the checklist follow-up.
- Reason: iteration 10 is maxIterations.
- Rotation status: 6/6 dimensions covered. Core protocols are recorded: spec_code partial, checklist_evidence partial.
- Blocked/productive carry-forward: exhausted approaches unchanged. Productive: checking checklist claims by content rather than by cited line.
- Required evidence: none further this run.

Review verdict: CONDITIONAL
