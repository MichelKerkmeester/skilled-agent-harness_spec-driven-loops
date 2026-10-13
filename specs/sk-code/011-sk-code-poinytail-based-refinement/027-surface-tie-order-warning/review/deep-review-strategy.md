---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
commit a682c06d3d on branch worktrees/131-tieorder-warning (diff c62d7d1399..a682c06d3d): doctor check 5l in parent-skill-check.cjs reports, on the sk-code hub only and as a softFail, any surface mode listed after sk-code-opencode in routerPolicy.tieBreak other than sk-code-obsidian and sk-code-webflow, naming the two fixes; three invariant tests and an addNamedSurfaces fixture helper pin it; the section heading range reads 5a-5l; the root README sk-code guide gains one sentence for a hand edit of tieBreak.

Dimensions, risk-ordered: correctness, security, traceability, maintainability. Max iterations 5, convergence threshold 0.1, stop policy max-iterations. The full diff is specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/scratch/review-diff.patch. The phase's decisions are in specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md (ADR-001 source of truth for native and example names, ADR-002 softFail severity).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The 026 scaffold placement rule and the rest of the README guide, which shipped in earlier phases.
- Other doctor checks than 5l, except where 5l interacts with 5e and 5i.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: run all 5 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **checklist_evidence: partial.** Carried from iteration 2 (CHK-030..032); the closure rows stay open by design mid-phase. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **checklist_evidence: partial.** Carried from iteration 2 (CHK-030..032); the closure rows stay open by design mid-phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence: partial.** Carried from iteration 2 (CHK-030..032); the closure rows stay open by design mid-phase.

### **Overlays** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not exercised; pending as recorded. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Overlays** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not exercised; pending as recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlays** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not exercised; pending as recorded.

### **spec_code: pass.** REQ-001 → the FAIL message names both fixes [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]; REQ-002 → the shipped-order test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:487-493] plus the PASS line [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1176]; REQ-003 → the examples-removed test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:495-501]; REQ-004 → the basename gate [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] with the global no-FAIL/WARN assertion [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315]. The three edge-case clauses [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:156-158] were re-read against the return paths [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1168] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171] and match. ADR-001's constants and ADR-002's `softFail` choice [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:62-64] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:158-160] are what the code does; the heading [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1019] and the README sentence [SOURCE: README.md:1468] are in place. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **spec_code: pass.** REQ-001 → the FAIL message names both fixes [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]; REQ-002 → the shipped-order test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:487-493] plus the PASS line [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1176]; REQ-003 → the examples-removed test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:495-501]; REQ-004 → the basename gate [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] with the global no-FAIL/WARN assertion [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315]. The three edge-case clauses [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:156-158] were re-read against the return paths [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1168] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171] and match. ADR-001's constants and ADR-002's `softFail` choice [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:62-64] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:158-160] are what the code does; the heading [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1019] and the README sentence [SOURCE: README.md:1468] are in place.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code: pass.** REQ-001 → the FAIL message names both fixes [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]; REQ-002 → the shipped-order test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:487-493] plus the PASS line [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1176]; REQ-003 → the examples-removed test [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:495-501]; REQ-004 → the basename gate [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] with the global no-FAIL/WARN assertion [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315]. The three edge-case clauses [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:156-158] were re-read against the return paths [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1168] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171] and match. ADR-001's constants and ADR-002's `softFail` choice [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:62-64] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:158-160] are what the code does; the heading [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1019] and the README sentence [SOURCE: README.md:1468] are in place.

### `checklist_evidence`: partial. CHK-030 (no hardcoded secrets) and CHK-031 (the check reads two JSON files it already parses and executes nothing new) were verified against the live code; CHK-032 (no auth surface) is consistent. The closure rows (CHK-010 onward) remain open by design; the traceability iteration picks them up. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: partial. CHK-030 (no hardcoded secrets) and CHK-031 (the check reads two JSON files it already parses and executes nothing new) were verified against the live code; CHK-032 (no auth surface) is consistent. The closure rows (CHK-010 onward) remain open by design; the traceability iteration picks them up.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. CHK-030 (no hardcoded secrets) and CHK-031 (the check reads two JSON files it already parses and executes nothing new) were verified against the live code; CHK-032 (no auth surface) is consistent. The closure rows (CHK-010 onward) remain open by design; the traceability iteration picks them up.

### `checklist_evidence`: partial. The phase is mid-review: tasks.md closure rows (T007-T009, CHK-010 onward) are open by design, and the evidence documents outside the review scope (implementation-summary.md, acceptance-criteria.md) were not opened this iteration. Deferred to the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: partial. The phase is mid-review: tasks.md closure rows (T007-T009, CHK-010 onward) are open by design, and the evidence documents outside the review scope (implementation-summary.md, acceptance-criteria.md) were not opened this iteration. Deferred to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. The phase is mid-review: tasks.md closure rows (T007-T009, CHK-010 onward) are open by design, and the evidence documents outside the review scope (implementation-summary.md, acceptance-criteria.md) were not opened this iteration. Deferred to the traceability iteration.

### `spec_code`: pass. 5l matches the spec's security-relevant scope: hub-gated [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166], surface-only and strictly-after filter, and both fixes named in the message [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]. SC-001/SC-002, the risks table (PARENT_HUB_CHECK_STRICT=0 downgrades to WARN) and NFR-R01 were re-read in the target diff; the edge-case statements (spec.md:147, spec.md:158) carry iteration-001's verified citations. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: pass. 5l matches the spec's security-relevant scope: hub-gated [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166], surface-only and strictly-after filter, and both fixes named in the message [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]. SC-001/SC-002, the risks table (PARENT_HUB_CHECK_STRICT=0 downgrades to WARN) and NFR-R01 were re-read in the target diff; the edge-case statements (spec.md:147, spec.md:158) carry iteration-001's verified citations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass. 5l matches the spec's security-relevant scope: hub-gated [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166], surface-only and strictly-after filter, and both fixes named in the message [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]. SC-001/SC-002, the risks table (PARENT_HUB_CHECK_STRICT=0 downgrades to WARN) and NFR-R01 were re-read in the target diff; the edge-case statements (spec.md:147, spec.md:158) carry iteration-001's verified citations.

### `spec_code`: pass. REQ-001 -> check 5l body and message (`parent-skill-check.cjs:1165-1177`) plus the failing test (`test file:478-485`); REQ-002 -> shipped-order test (`test file:487-493`); REQ-003 -> examples-removed test (`test file:495-501`); REQ-004 -> the basename gate (`parent-skill-check.cjs:1166`) with the global no-FAIL/WARN assertion (`test file:315`). Spec scope items: heading range corrected (`parent-skill-check.cjs:1019`), README sentence added (`README.md:1468`). Parent bookkeeping in the same commit (goal.md PASSED count 27 -> 28, phase table row, graph-metadata child list) is arithmetically consistent with the new packet. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: pass. REQ-001 -> check 5l body and message (`parent-skill-check.cjs:1165-1177`) plus the failing test (`test file:478-485`); REQ-002 -> shipped-order test (`test file:487-493`); REQ-003 -> examples-removed test (`test file:495-501`); REQ-004 -> the basename gate (`parent-skill-check.cjs:1166`) with the global no-FAIL/WARN assertion (`test file:315`). Spec scope items: heading range corrected (`parent-skill-check.cjs:1019`), README sentence added (`README.md:1468`). Parent bookkeeping in the same commit (goal.md PASSED count 27 -> 28, phase table row, graph-metadata child list) is arithmetically consistent with the new packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass. REQ-001 -> check 5l body and message (`parent-skill-check.cjs:1165-1177`) plus the failing test (`test file:478-485`); REQ-002 -> shipped-order test (`test file:487-493`); REQ-003 -> examples-removed test (`test file:495-501`); REQ-004 -> the basename gate (`parent-skill-check.cjs:1166`) with the global no-FAIL/WARN assertion (`test file:315`). Spec scope items: heading range corrected (`parent-skill-check.cjs:1019`), README sentence added (`README.md:1468`). Parent bookkeeping in the same commit (goal.md PASSED count 27 -> 28, phase table row, graph-metadata child list) is arithmetically consistent with the new packet.

### Deferred this iteration (recorded in the search ledger): `decision-record.md` ADR-001/002 cross-check and the live-hub confirmation of REQ-002/SC-002. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Deferred this iteration (recorded in the search ledger): `decision-record.md` ADR-001/002 cross-check and the live-hub confirmation of REQ-002/SC-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferred this iteration (recorded in the search ledger): `decision-record.md` ADR-001/002 cross-check and the live-hub confirmation of REQ-002/SC-002.

### Deferred this iteration: the live-hub confirmation of REQ-002/SC-002 (reading `.skilled/skills/sk-code/hub-router.json` or running the doctor) and the decision-record.md ADR-001/002 cross-check. Both are recorded in the search ledger. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Deferred this iteration: the live-hub confirmation of REQ-002/SC-002 (reading `.skilled/skills/sk-code/hub-router.json` or running the doctor) and the decision-record.md ADR-001/002 cross-check. Both are recorded in the search ledger.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferred this iteration: the live-hub confirmation of REQ-002/SC-002 (reading `.skilled/skills/sk-code/hub-router.json` or running the doctor) and the decision-record.md ADR-001/002 cross-check. Both are recorded in the search ledger.

### Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): pending; not exercised this iteration. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): pending; not exercised this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): pending; not exercised this iteration.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Target pointers: `checkNativeSurfaceLast` and its call in `checkHubRouter` (.skilled/commands/doctor/scripts/parent-skill-check.cjs), the three `5l` tests and `addNamedSurfaces` (.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs), the "Add your own surface" step 1 of README.md.
- Behavior claims: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md REQ-001 to REQ-004 and edge cases; specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/goal.md criteria.
- Conventions: 5e and 5i are the neighbouring tieBreak checks and both use softFail; VOCABULARY_PARITY_WARN_ONLY is the existing hub-scoped constant.
- Risks: the shipped sk-code order is quality, review, opencode, obsidian, webflow; a sk-code fixture already fails 5k-canary, so test exit codes on sk-code fixtures are not discriminating.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| README.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
| specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/goal.md | none | 0 | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-13T15:53:35.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence, overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-13T15:53:35.000Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
