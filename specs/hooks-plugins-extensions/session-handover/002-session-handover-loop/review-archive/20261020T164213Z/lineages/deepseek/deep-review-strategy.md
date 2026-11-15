# Deep Review Strategy

## 1. Review Charter

- Target: `specs/hooks/023-session-relaunch-loop` (spec folder)
- Dimensions requested: correctness, security, traceability, maintainability
- Focus order: correctness, security, traceability, maintainability, then a broadened adapter/evidence pass
- Stop policy: max-iterations, 5 iterations, convergence threshold 0.10
- Executor: cli-opencode, llmgateway/deepseek-v4.1-flash, reasoning max
- Write boundary: `specs/hooks/023-session-relaunch-loop/review/lineages/deepseek`
- Lead steer: `steer.md` was absent at initialization and before iteration 1.

## 2. Non-Goals

- Do not modify reviewed code or packet documents.
- Do not run repository tests, packet validators, context generation, or Git writes.
- Do not migrate or seed shared review state outside this lineage.
- Do not treat the archived generation-1 or generation-2 findings as verified state; this lineage starts fresh.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
None. Iteration 5 is a broadened adapter-parity and evidence pass, not a new primary dimension.
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness — PASS with two P2 advisories (iteration 1)
- [x] security — PASS with one P2 advisory (iteration 2)
- [x] traceability — CONDITIONAL with one P1 and three P2 advisories (iteration 3)
- [x] maintainability — CONDITIONAL (active P1) with two new P2 advisories (iteration 4)
- [x] broadened adapter-parity pass — CONDITIONAL (active P1) with two new P2 advisories (iteration 5)
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 10
- Resolved: 0
- Delta this iteration: +0 P0, +0 P1, +2 P2
<!-- /ANCHOR:running-findings -->

## 6. What Worked

- Reading the planner and the prepare/consume path together exposed two state-ownership gaps that a single-file read would miss (iteration 1).
- Checking the prior short-write and cross-user fixes against the current code confirmed both are present (iteration 1).

## 7. What Failed

- The first-run and repeated-prepare paths are not covered by a test, so the two new advisories were found by code reading only (iteration 1).
- The note path is the one handoff artifact without the private-mode guarantee the core applies to its own state directory and log (iteration 2).
- Checking the acceptance cells against the actual file tree exposed an evidence log that the packet treats as durable but Git ignores (iteration 3).
- The archived generation-2 report and the phase 007 panes are intact; the failure is in the citations, not in the run itself (iteration 3).
- Tracing the killer's crash paths found a leftover that no sweep owns and a freshness sign error; both are contained and fixable without changing the protocol (iteration 4).
- Comparing the five automatic adapters exposed two input-parity gaps that the individual suites and the environment reference do not cover (iteration 5).

## 8. Exhausted Approaches

None.

<!-- ANCHOR:saturated -->
## 8A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:saturated -->

<!-- ANCHOR:ruled-out -->
## 9. RULED OUT DIRECTIONS

- `appendLog` short-write loss: the write byte count is checked and a mismatch throws (iteration 1, evidence: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:598-608`).
- Wrapper seed reconstruction: the per-runtime seed forms and carried values match the adapter tests (iteration 1, evidence: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:401-424`).
<!-- /ANCHOR:ruled-out -->

<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
Synthesis: consolidate the 11 active findings, preserve the P1 as the verdict driver, and produce the review report with the evidence, registry, and coverage replays.
<!-- /ANCHOR:next-focus -->

## 11. KNOWN CONTEXT

- The parent packet is marked complete and contains seven completed child phases. Phase 007 added the spec-gate runtime-state exemption, the two AGENTS.md sentences, and the OpenCode default model pin.
- The prior generation-1 report was archived under `review-archive/20261018T184826Z/`; the generation-2 fan-out report was archived under `review-archive/20261019T144809Z/`. The current `review/` tree contains only orchestration observability and this lineage.
- `resource-map.md` is not present in the packet, so the Resource Map Coverage Gate is skipped.
- `steer.md` is absent; no lead rulings apply.
- The live run 10 evidence under `007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/` contains three pane captures, two receiver captures, and `launch-commands.txt`; the cited `relaunch-run10.log` is absent and the `.gitignore` `*.log` rule excludes it.
- The parent `spec.md` phase map lists seven phases, while its metadata, purpose, In Scope, Files to Change, and 006-to-007 handoff row still describe six or leave the row TBD.

<!-- ANCHOR:cross-reference-status -->
## 12. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | Parent six-child drift (DS-005) and handoff exit-3 drift (DS-007). |
| `checklist_evidence` | core | partial | 3 | Missing run 10 log (DS-004) and absent phase 006 report path (DS-006). |
| `skill_agent` | overlay | notApplicable | - | No skill package is being reviewed directly. |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent definition is the target; adapter parity was checked as behavior. |
| `feature_catalog_code` | overlay | pass | 5 | The catalog's nudge, prepare, killer, wrapper, and seed claims match the code; input documentation is DS-010/DS-011. |
| `playbook_capability` | overlay | partial | 5 | The three playbooks and their commands resolve; the run 10 raw log is missing (DS-004). |
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## 13. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | correctness, security | 2 | 1 P2 | complete |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | correctness, security, maintainability | 4 | 1 P2 | complete |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | correctness, security, maintainability | 4 | 1 P2 | complete |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | correctness, security | 2 | 1 P2 | partial |
| `.skilled/bin/skilled-loop` | correctness | 1 | 0 | complete |
| `.skilled/commands/speckit/handoff.md` | correctness, security | 2 | 1 P2 | partial |
| Runtime adapters under `.skilled/hooks/session-relaunch/` | maintainability, traceability | 5 | 2 P2 | complete |
| `.opencode/plugins/session-relaunch.js` | maintainability, traceability | 5 | 1 P2 | complete |
| Phase and benchmark documentation under the packet | traceability | 3 | 4 findings | partial |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## 14. REVIEW BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1792421295628-xsy88n, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-19T15:06:29Z
<!-- /ANCHOR:review-boundaries -->
