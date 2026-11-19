# Iteration 3 - Traceability

## Dispatcher
- Run 3 of 10, dimension `traceability`, native leaf, session `2026-11-19T04:20:12.962Z`, generation 1, lineageMode new.
- Iteration number derived from the state log (two prior `type:"iteration"` records), matching the dispatch.
- Operator focus: code and runtime files first. The traceability pass anchored each doc claim to the runtime file that should back it (`convergence.cjs`, `frontier-admit.cjs`, the review config asset) before judging the packet docs. Overengineering and sk-code-alignment rubrics do not apply to this dimension.

## Dimension
traceability (core: spec_code, checklist_evidence; overlay run: feature_catalog_code, playbook_capability).

## Files Reviewed
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/spec.md:61, :155-175
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/tasks.md:36-75
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/implementation-summary.md:11-25
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/spec.md:40, :65
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/tasks.md:156-294, spec.md:37
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/implementation-summary.md:14, :157
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/tasks.md:181-276, implementation-summary.md:119
- child spec.md status rows and tasks.md checkbox counts for 001-014
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1195 (plus range diff)
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:450-500
- .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:12
- .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:24, min-iterations-floor.md:16
- .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:35, :49
- playbook directory listings under deep-research, deep-review and runtime manual-testing-playbook

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Parent packet docs still report the program as unstarted** -- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/spec.md:162 -- The Phase Documentation Map lists all 14 phases as `draft` (spec.md:162-175) while every child spec's status row says `Complete`. The parent tasks.md leaves T004-T010 unchecked (tasks.md:48-63), and the parent implementation-summary.md continuity block still reads `recent_action: "Generation 2 research synthesized"`, `next_safe_action: "Plan Slice A completed-run extension"`, `completion_pct: 0` (implementation-summary.md:13-25). Three parent docs disagree with the 14 child docs and with the tip commit about completion state.
   Finding class: doc_state_drift
   Scope proof: parent spec.md, tasks.md and implementation-summary.md are in reviewScopeFiles; child status read from each 0NN/spec.md status row.
   Affected surface hints: parent spec.md Phase Documentation Map status column; parent tasks.md Phase 2/3 checkboxes; parent implementation-summary.md _memory.continuity block
   Case: an operator or resume step that reads the parent packet sees 14 draft phases and completion 0 for a program whose children all claim Complete, and plans Slice A again.

2. **Frontier phases 010 and 011 claim Complete with P0 checklist rows unticked** -- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode/tasks.md:177 -- 010's Verification Checklist leaves CHK-020 [P0] "All acceptance criteria met" (tasks.md:177), CHK-FIX-001..004 [P0] (tasks.md:188-191) and CHK-120 [P0] rollback (tasks.md:269) open, and 011 leaves CHK-020 [P0] open (011 tasks.md:181). Both specs say `Complete` (010 spec.md:37) and both acceptance-criteria tables mark every row Met or Waived, so the checklist and the closure gate contradict each other. CHK-123 "Pilot run steps recorded in implementation-summary.md" is unticked in both (010 tasks.md:271, 011 tasks.md:275) although each summary records the pilot runs (010 implementation-summary.md:157, 011 implementation-summary.md:119). 010's continuity `next_safe_action` still says "run T030 full suite and the T031 pilot" (010 implementation-summary.md:14) after both pilots ran. 010 CHK-032 [P1] scope intersection (tasks.md:204) stays unticked while 011's equivalent is ticked; whether research relevance enforces a root-scope intersection was not verified this iteration.
   Finding class: checklist_evidence_drift
   Scope proof: 010/011 tasks.md and implementation-summary.md are in reviewScopeFiles; acceptance-criteria.md is cited only as context (not in scope list).
   Affected surface hints: 010-research-frontier-mode/tasks.md Verification Checklist; 011-review-frontier-mode/tasks.md Verification Checklist; 010 implementation-summary.md _memory.continuity
   Case: a completion audit reading tasks.md for 010 finds six P0 checklist rows open on a phase marked Complete and cannot tell whether the acceptance-criteria Met rows or the checklist is the truth.

## Traceability Checks
- **spec_code** -- partial. The owner of the review-wide `minIterationsNotReached` widening is now traced: phase 003 scopes it ("Apply the `minIterations` floor check ... to review as well as research", 003 spec.md:65), the range diff drops `loopType === 'research' &&` at convergence.cjs:1195, and the shipped review floor stays 2 (deep-review/assets/deep-review-config.json:12), so default review runs keep their stop point as 003 spec.md:40 argues and the parent spec.md:61 carve-out allows. The earlier partial cause is resolved. Still partial because R1-P1-001 remains active: the commit-range relevance claim is not met for the decorated target form (frontier-admit.cjs:452-454).
- **checklist_evidence** -- partial. Child phases 001-009 and 012-014 leave only the notation legend row unchecked; 010 (34 open) and 011 (19 open) leave P0 rows open on Complete phases (R3-P2-002). Parent tasks.md T004-T010 open (R3-P2-001).
- **feature_catalog_code** -- partial. The review min-iterations-floor catalog matches code (min-iterations-floor.md:16 vs convergence.cjs:1195 and config :12). The frontier-admit catalog says a commit-range target narrows relevance to touched files (frontier-admit-script.md:49), which holds only for a bare single-token range (frontier-admit.cjs:452-454); same root cause as R1-P1-001, not a separate finding. The research `block` command and its `--focus` requirement are documented (frontier-admit-script.md:35).
- **playbook_capability** -- partial. Scenario files exist for the expansive flag, seed, admission, focus, band budget, frontier veto, drained stop, fan-out partition and the review min-iterations floor in the deep-research, deep-review and runtime playbooks. Only presence was checked; scenario steps were not executed or compared to code.

## Integration Evidence
- Workflow surface: `.skilled/commands/deep/assets/deep-research.yaml` searched for the frontier `block` step wording only; no new integration claim made.

## Edge Cases
- The prompt pack's final-line mapping says "this iteration"; the agent contract maps over findings still active. R1-P1-001 and R2-P1-001 stay active, so the verdict is CONDITIONAL although this iteration raised only P2s.
- Contradiction (checklist vs acceptance criteria) recorded on both sides in R3-P2-002 and not adjudicated: implementation evidence in the summaries supports the AC Met rows, so the checklist is treated as the stale side.
- acceptance-criteria.md files are outside reviewScopeFiles; cited only as context.
- skill_agent and agent_cross_runtime overlays not run this iteration.

## Confirmed-Clean Surfaces
- convergence.cjs:1195 floor change is owned and documented by phase 003 and its catalog entry.
- Research frontier `block --focus` command is documented in the runtime catalog.

## Ruled Out
- Undocumented default-path widening of the review floor: owned by 003 (003 spec.md:65), shipped floor 2 unchanged.
- Separate catalog finding for commit-range relevance: duplicate of R1-P1-001's root cause.
- Missing documentation of the research block step: frontier-admit-script.md:35 documents it.

## Verdict
CONDITIONAL: no P0; active P1s R1-P1-001 and R2-P1-001 carry forward; this iteration adds two P2s.

## Next Focus
- Dimension: maintainability.
- Focus area: highest-churn code files (frontier-admit.cjs, reduce-state.cjs, both workflow YAMLs, divergent-pivot.ts).
- Reason: plan rotation; traceability covered.
- Rotation status: correctness, security, traceability covered; maintainability, overengineering, sk-code-alignment remain.
- Carry-forward: spec_code partial (R1-P1-001); checklist_evidence partial; agent_cross_runtime unrun for .codex/.vibe/.dsh agent files; 010 CHK-032 research scope intersection unverified.
- Required evidence: file:line in changed code.

Review verdict: CONDITIONAL
