---
title: Deep Review Strategy
description: Cross-check lineage plan for the v4.0.0.3 release review.
trigger_phrases:
  - "luna-opencode deep review strategy"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

This lineage independently cross-checks prior lineage findings, then reviews additional release-manifest areas. The review target stays read-only. All state and synthesis output stays in this lineage directory.

## 2. TOPIC

Review `v4.0.0.2..v4.0.0.3` with a cross-check emphasis. The scope manifest contains 1,997 release paths. Each iteration takes a bounded slice and records exact file:line evidence.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, logic errors, state transitions, invariants, edge cases
- [ ] D2 Security, trust boundaries, input handling, secrets, permissions
- [ ] D3 Traceability, spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, patterns, documentation quality, safe follow-on changes
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Implementing fixes or editing files under review.
- Running repository validation, build, or test suites.
- Writing outside this lineage directory or saving packet continuity.

## 5. STOP CONDITIONS

- Continue through all 10 iterations. Convergence is telemetry only under `max-iterations`.
- Synthesis records `stopReason: maxIterationsReached`.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- P0: 0 active
- P1: 0 active
- P2: 0 active
- Delta this iteration: +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

[No iteration evidence yet]

## 9. WHAT FAILED

[No iteration evidence yet]

## 10. EXHAUSTED APPROACHES (do not retry)

[None yet]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: review manifest areas not covered by prior lineages
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

[None yet]

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: correctness
- Focus: independently replay the lead-steered cross-lineage findings.
- Reason: validate high-impact claims against current sources before broadening.
- Rotation status: first pass
- Blocked/productive carry-forward: productive, direct source reads and counterevidence checks
- Required evidence: source lines, release diff where relevant, explicit failure scenario
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Target: `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review`.
- Scope: `goal-file-manifest.txt`, 1,997 paths, release range `v4.0.0.2..v4.0.0.3`.
- Required core protocols: `spec_code`, `checklist_evidence`.
- Applicable overlays: `feature_catalog_code`, `playbook_capability`; additionally review requested agent/mirror and skill surfaces as release cross-checks.
- Resource map: absent at initialization, so the resource-map coverage gate is skipped.
- Prior review inputs: the `deepseek-flash-max` report and `swe2-max` iteration files. Their claims remain unverified until re-read against their cited sources.
- Graph and semantic retrieval: unavailable in this inline lineage. Use direct reads and exact lexical searches; mark graphless fallback in review-depth records.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Compare packet requirements with release evidence. |
| `checklist_evidence` | core | pending | - | Verify checklist claims against visible artifacts. |
| `skill_agent` | overlay | pending | - | Review only when the selected slice includes a skill/agent contract. |
| `agent_cross_runtime` | overlay | pending | - | Cross-check requested mirrors as selected. |
| `feature_catalog_code` | overlay | pending | - | Audit catalog claims where selected. |
| `playbook_capability` | overlay | pending | - | Audit playbook commands where selected. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Manifest: `goal-file-manifest.txt` (1,997 paths); per-iteration targets are listed in each record.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|--------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.1, telemetry only before the cap
- Stop policy: max-iterations
- Session lineage: sessionId=`fanout-luna-opencode-1791264733860-t333md`, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release readiness: in-progress until synthesis
- Review target type: spec-folder
- Executor: `cli-opencode`, `openai/gpt-6-luna-fast`, effort `max`
- Started: 2026-10-06T06:46:41Z
<!-- MACHINE-OWNED: END -->
