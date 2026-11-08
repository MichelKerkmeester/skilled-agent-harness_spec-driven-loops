---
title: Deep Review Strategy - 044 named sub-tracks and host repositories
description: Review strategy for the named sub-track and host-repository implementation in commits ac32d66fed..7714ff26b1.
---

# Deep Review Strategy

## 1. REVIEW CHARTER

- Target: `specs/system-speckit/044-named-subtracks-and-host-repos` (spec-folder), implementation commits `ac32d66fed..7714ff26b1`
- Dimensions: correctness, security, traceability, maintainability
- Operator focus: review the named sub-track tooling, the doctor `project_owned` entry and host `.skilled` build, and the host trigger-index docs for correctness, flat-track non-regression, path containment, symlink handling and spec/doc alignment. Never open any `.env` file or any Barter file.
- Stop conditions: 5 iterations under `stopPolicy=max-iterations`; convergence is telemetry only.
- Success criteria: every dimension receives one full pass plus the operator focus; P0/P1 findings carry typed claim-adjudication packets; flat-track non-regression is explicitly tested.

## 2. TOPIC

Review of declared named sub-tracks in system-spec-kit track tooling plus the three host-repository fixes shipped in the same packet.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Barter's priority numbering and sub-track map (Barter phase 004 owns them).
- Writes through a linked specs root (packet 037 owns them).
- Implementing fixes: this loop is observation-only.
- Opening any `.env` file or any Barter file.

## 5. STOP CONDITIONS

- Hard ceiling: 5 iterations (`maxIterations: 5`).
- A terminal P0 does not stop the loop early; it is carried to synthesis and forces FAIL.
- Pause sentinel only.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [none yet] | - | - | - |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach stops yielding new findings]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS
[Consolidated after each iteration]

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 1: correctness of declared sub-track discovery, refresh and sweep (track-roots.mjs, refresh-track-roots.mjs, sweep-track-roots.mjs) plus flat-track non-regression.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs`, `runtime/cli/spec/{refresh-track-roots.mjs,sweep-track-roots.mjs,create.sh,validate.sh,archive.sh,repair-derived.cjs}`, `runtime/lib/graph/graph-metadata-parser.ts`, `runtime/lib/validation/orchestrator.ts`, `.skilled/commands/doctor/scripts/symlink-engine.cjs`, `doctor/assets/symlink-manifest.json`, docs under `runtime/data/README.md`, `references/structure/folder-structure.md`, `README.md`, `.skilled/commands/speckit/search.md`, `runtime/data/trigger-index.json`.
- Behavior claims: spec.md REQ-001..REQ-012 and SC-001/SC-002; a declared sub-track is a direct child of a track whose `description.json` has `level: "sub-track"` and holds a `graph-metadata.json` in the track-root shape; undeclared folders and symlinked sub-tracks get advisory diagnostics only; flat tracks must behave byte-identically.
- Reuse and conventions: existing `readWorkingTreeTracks`/`readCommitTracks` shape, `validate_track_value` containment rules, reducer-owned anchors in strategy.
- Review risks and gaps: no `resource-map.md`; compiled `dist` orchestrator is not in the diff; Barter files and `.env` files are out of scope by instruction.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent file changed |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | notApplicable | - | No playbook changed |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [pending first iteration] | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-2-1794073425298-2jo74b, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-07T18:01:38Z
<!-- MACHINE-OWNED: END -->
