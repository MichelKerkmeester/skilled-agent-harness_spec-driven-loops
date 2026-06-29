---
title: "Cross-Mode Anti-Convergence Contract ADR"
description: "Anti-convergence floors exist only in the research mode config; review, context, and council modes have no equivalent guard, and the optimizer can tune past any intended floor. A declarative antiConvergence contract projected across all four mode configs is needed."
trigger_phrases:
  - "cross-mode anti-convergence"
  - "antiConvergence contract ADR"
  - "optimizer invariant groups"
  - "stopPolicy fail-closed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/004-deep-loop-workflows/003-cross-mode-anti-convergence-adr"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 44)"
    next_safe_action: "Draft antiConvergence contract schema and project across all four mode configs"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json"
      - ".opencode/skills/deep-loop-runtime/assets/optimizer-manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Cross-Mode Anti-Convergence Contract ADR

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 12 |
| **Predecessor** | 002-convergence-profile-unification-adr |
| **Successor** | 004-injection-inbox-provenance |
| **Handoff Criteria** | All four mode configs have an `antiConvergence` block; `stopPolicy` in runtime_capabilities.json is fail-closed; optimizer invariant group test proves constraint violations are rejected |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the deep-loop-workflows recommendations.

**Scope Boundary**: Project the `antiConvergence` contract into all four mode configs and the optimizer. Does not change any convergence math (that belongs to the 002-migration follow-up).

**Dependencies**:
- 001-anti-convergence-floor (establishes `minIterations` semantics for research mode)
- 002-convergence-profile-unification-adr (profile shape frozen before optimizer constraints reference it)

**Deliverables**:
- `antiConvergence` block in all four `deep_*_config.json` files
- `stopPolicy` capability fail-closed in all `runtime_capabilities.json` instances
- `runtime-capabilities.cjs` updated to enforce `antiConvergence` contract
- `optimizer-manifest.json` invariant group preventing `minIterations > maxIterations` candidates and locking `convergenceMode` as non-tunable
- Council mode `antiConvergence.minRounds` field

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The optimizer can propose a config candidate that satisfies individual parameter ranges while violating `minIterations <= maxIterations`; there is no cross-mode invariant group to catch this. Review, context, and council modes have no `antiConvergence` block at all, so any run in those modes can stop after a single iteration with no floor. The `stopPolicy` capability is missing or undefined for most modes, defaulting to permissive behavior.

### Purpose
Define one `antiConvergence` block (`minIterations`/`minRounds`, `convergenceMode`, `stopPolicy`) projected into all four mode configs, with `stopPolicy` fail-closed in runtime capabilities, and an optimizer invariant group that locks `convergenceMode` as non-tunable and makes `minIterations` tunable only when the paired constraint `minIterations <= maxIterations` is satisfied.

> **Reference evidence**: `external/kasper/src/config.ts:26,46` (antiConvergence contract, stopPolicy fail-closed); `external/loop-cli-main/src/types.ts:27` (optimizer invariant group type). Research.md §5.2 + (iter 44).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `antiConvergence` contract block in all four `deep_*_config.json` files (research, review, context, council)
- Council mode uses `antiConvergence.minRounds` instead of `minIterations` (same semantic, round-based naming)
- `stopPolicy` capability set to `"fail-closed"` in all `runtime_capabilities.json` instances
- `runtime-capabilities.cjs` reads and enforces the `antiConvergence` contract; rejects capability load when `stopPolicy` is missing
- `optimizer-manifest.json` invariant group: `convergenceMode` locked (non-tunable); `minIterations` tunable only with `minIterations <= maxIterations`

### Out of Scope
- Implementing per-mode convergence math changes (belongs to 002-migration follow-up)
- UX for surfacing anti-convergence state in dashboards (belongs to §5.5 UX items)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json` | Modify | Add `antiConvergence` block (`minIterations`, `convergenceMode`, `stopPolicy`) |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json` | Modify | Add `antiConvergence` block (review semantics) |
| `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` | Modify | Add `antiConvergence` block (context semantics) |
| `.opencode/skills/deep-loop-workflows/deep-loop-council/assets/deep_council_config.json` | Modify | Add `antiConvergence` block with `minRounds` for council |
| `.opencode/skills/deep-loop-runtime/assets/runtime_capabilities.json` | Modify | Add `stopPolicy:"fail-closed"` capability |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs` | Modify | Enforce `antiConvergence` contract; reject load when `stopPolicy` is missing |
| `.opencode/skills/deep-loop-runtime/assets/optimizer-manifest.json` | Modify | Add invariant group locking `convergenceMode` and pairing `minIterations <= maxIterations` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `antiConvergence.minIterations` (or `minRounds` for council) and `antiConvergence.convergenceMode` present in all four mode configs; `stopPolicy:"fail-closed"` in runtime capabilities; `runtime-capabilities.cjs` rejects load when `stopPolicy` is missing | All four configs parse without schema errors; `runtime-capabilities.cjs` returns an error when `stopPolicy` is absent from a mode's capabilities |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Optimizer invariant group rejects any candidate satisfying individual parameter ranges while violating `minIterations <= maxIterations`; `convergenceMode` is absent from the tunable parameter list | Test proves a candidate with `minIterations:5, maxIterations:3` is rejected before scoring; `convergenceMode` is not in the tunable params list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four mode configs have an `antiConvergence` block; `runtime-capabilities.cjs` returns a clear error when `stopPolicy` is missing from any mode's capability object
- **SC-002**: Optimizer invariant group test (unit or integration) proves a candidate violating `minIterations <= maxIterations` is rejected before being scored; `convergenceMode` is not tunable
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Touching `optimizer-manifest.json` could break existing optimizer runs if the invariant group name collides | Med | Use a namespaced group key (`anti-convergence-floor`) and verify no collision before writing |
| Risk | Council `minRounds` vs research `minIterations` field name divergence could cause schema confusion | Med | Define `antiConvergence.minRounds` as the canonical council field; document the semantic alias in the schema comment |
| Dependency | Requires 002-convergence-profile-unification-adr to be ratified so `convergenceMode` semantics are stable before the invariant group is written | High | Do not write the optimizer invariant group until 002 ADR is locked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should council mode's `minRounds` be a schema alias of `minIterations` (union type) or a completely separate field with distinct validation?
- What is the correct fail-closed default for `stopPolicy` when the field is absent in older config versions — block all stops, or block only convergence-triggered stops?
- Does `runtime-capabilities.cjs` need a versioned schema check to avoid breaking existing loaded capabilities when the new field appears?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
