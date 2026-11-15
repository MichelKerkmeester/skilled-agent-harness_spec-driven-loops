---
title: "Feature Specification: Phase 24: terminal-gates-script"
description: "When a deep review stops, the agent running the loop judges its evidence, scope and coverage gates from prose, so a gate can pass on judgment alone and the session verdict follows that judgment. This phase computes the three gates with a script from the run's config, state log and registry."
trigger_phrases:
  - "terminal gates script"
  - "phase 24 terminal gates script"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 24: terminal-gates-script

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 25 |
| **Predecessor** | 023-agent-docs-fixes |
| **Successor** | 025-stop-path-live-proof |
| **Handoff Criteria** | `record_terminal_gates` runs `terminal-gates.cjs`, its unit tests pass, the contract drift check passes, the runtime suite fails nothing that passed at baseline, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the agent alignment follow-ups. It closes gap 1 from the earlier analysis: the terminal gates are judged by the executing agent.

**Scope Boundary**: A new runtime script and its test, two exports from `convergence.cjs`, the `record_terminal_gates` step of `deep-review.yaml` and the contracts compiled from it.

**Dependencies**:
- Phase 15's terminal gate record and phase 17's stop paths, which this step serves

**Deliverables**:
- `scripts/terminal-gates.cjs` computing the three gate rows
- The workflow step calling it, failing closed on a script error
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The session verdict fails when a required gate still fails at the terminal stop, but the gate results come from the loop agent reading a prose rule. Two of the rules exist as code for the legal-stop decision, and the third needs only the recorded scope file list, so nothing but habit keeps them in prose.

### Purpose
The recorded terminal gates are computed from the run's state, so the verdict no longer rests on the loop agent's judgment.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 1137,1140p .skilled/commands/deep/assets/deep-review.yaml
            evaluate: |
              evidence: pass when every active P0/P1 finding has concrete file:line evidence and none relies only on inference (the evidenceDensityGate rule).
              scope: pass when every active finding's file lies inside the review target.
              coverage: pass when configured dimensions and required traceability coverage are complete and coverage_age >= 1 (the dimensionCoverageGate rule).
$ ls .skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs
No such file or directory
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `terminal-gates.cjs`, reusing the stop decision's own facts and gate rules for evidence and coverage and matching finding files against `reviewScopeFiles` for scope.
- Export the two state-file readers from `convergence.cjs` for it.
- Replace the prose gate rules in `record_terminal_gates` with a call to the script that fails closed on an error.

### Out of Scope
- The stop paths themselves - phases 15 and 17 built them, and phase 25 proves them.
- The research loop - it records no terminal gates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs` | Create | The gate computation and its CLI |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/terminal-gates.vitest.ts` | Create | Pass, fail and CLI cases |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Export two readers |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | The step calls the script |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Regenerate | Source digests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The script computes the three gate rows from the config, state log and registry. | `terminal-gates.vitest.ts` covers a pass and a fail for each gate and passes |
| REQ-002 | `record_terminal_gates` runs the script and fails closed when it errors. | The step's `bash:` names the script and its `on_error:` binds three failing rows; the YAML parses |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Nothing that passed at baseline fails. | The runtime suite and typecheck match the baseline plus the new tests, and `check-contract-drift.cjs` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The script run on real recorded review packets returns three rows each, with no crash.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `reviewScopeFiles` recorded at init | Medium | Findings with no recorded scope fail the gate as `scope-unrecorded`, so a missing list cannot pass |
| Risk | Finding paths may be absolute paths from another checkout | Medium | An absolute path whose tail is a scope entry counts as in scope; a test covers it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The approach is the earlier analysis's gap 1 proposal; the operator asked to fix the open gaps on 2026-11-15.
<!-- /ANCHOR:questions -->

---


