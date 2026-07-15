---
title: "Convergence Math Unification ADR"
description: "Convergence math is fracturing across three files (convergence.cjs, lib/council/convergence.cjs, coverage-graph-signals.ts) with no shared contract. Adding new signals to any one risks silent inconsistency with the others. An ADR must freeze the shared profile shape before more signals accrete."
trigger_phrases:
  - "convergence profile unification"
  - "convergence math ADR"
  - "unified convergence profile"
  - "convergence fracture deep loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iters 41, 42)"
    next_safe_action: "Draft the ADR document and parity test before any migration"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/council/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Convergence Math Unification ADR

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 11 active phases |
| **Predecessor** | 001-anti-convergence-floor |
| **Successor** | 003-cross-mode-anti-convergence-adr |
| **Handoff Criteria** | ADR document present and passes validate.sh; shared parity test runs green on current (pre-migration) code; profile schema fields named and typed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the deep-loop-workflows recommendations.

**Scope Boundary**: Record the ADR and pin a shared parity test. Actual migration of all callers to the new profile shape is a follow-up deep-rewrite outside this packet.

**Dependencies**:
- 001-anti-convergence-floor must be complete first so `minIterations` semantics are settled before the profile schema is frozen

**Deliverables**:
- ADR document recording the decision (shared profile shape, per-loop metric semantics, rejected alternative)
- Shared convergence profile schema (`threshold/weight/role/direction/normalizer`)
- Parity test pinning current threshold traces for all three convergence files
- Explicit rejection of one universal formula documented

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Convergence math is spread across `convergence.cjs`, `lib/council/convergence.cjs`, and `lib/coverage-graph/coverage-graph-signals.ts` with no shared shape, no parity test, and no declared contract. Any new convergence signal added to one file silently diverges from the others. The contract is implicitly per-file, making cross-loop consistency impossible without reading three implementations.

### Purpose
Record an ADR defining a declarative convergence profile (`threshold/weight/role/direction/normalizer`) with a shared parity test pinning current traces before migration begins; the ADR explicitly rejects one universal convergence formula (per-loop metric semantics are preserved; only the profile shape is shared).

> **Reference evidence**: `external/kasper/src/config.ts:26,189` (declarative profile shape with per-loop semantics); `external/loop-cli-main/src/loop-config.ts:86` (per-loop config). Research.md §5.2 + (iters 41, 42).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ADR document recording the decision (profile shape, per-loop metric semantics, rejected alternatives)
- Shared convergence profile schema definition (`threshold/weight/role/direction/normalizer` fields, typed)
- Parity test (`tests/integration/convergence-script.vitest.ts`) pinning current threshold traces for all three files before migration
- Migration guide noting which callers need updates (informational, not execution)
- Explicit documented rejection of a single universal convergence formula

### Out of Scope
- Actually migrating `convergence.cjs`, `lib/council/convergence.cjs`, and `coverage-graph-signals.ts` to the new shape — that is a subsequent hard-migration phase
- Changing any convergence behavior — this is ADR + test-pin only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | Add profile schema comment block and exported profile type; cross-reference to ADR |
| `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs` | Modify | Add profile schema comment block and cross-reference to ADR |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modify | Add profile schema comment block |
| `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` | Create | Parity test pinning current threshold traces for all three convergence files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | ADR records the decision: one shared profile shape (`threshold/weight/role/direction/normalizer`), per-loop metric semantics preserved, one universal formula explicitly rejected | ADR document present; all five profile fields named and typed; rejected alternative documented with rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Parity test pins current threshold traces for all three convergence files; test runs green on the pre-migration codebase as a baseline | `convergence-script.vitest.ts` passes on current code; test covers all three files' threshold code paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ADR is present, all `[...]` placeholders replaced, and `validate.sh` passes; profile schema is documented with `threshold/weight/role/direction/normalizer` fields named and typed; the decision explicitly rejects a single universal formula
- **SC-002**: Parity test `convergence-script.vitest.ts` runs green on the current (pre-migration) codebase for all three convergence file paths; test is checked in and CI-ready
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Migration is rated hard; the ADR is only the decision step — premature migration before the ADR is ratified could create conflicting schemas | High | This phase ends at ADR + parity test; migration is a separate follow-up packet |
| Risk | Parity test might reveal existing bugs in current convergence math, triggering unplanned changes | Med | Pin current behavior as the baseline even if imperfect; note discrepancies as open issues in the ADR |
| Dependency | 001-anti-convergence-floor must be settled first so `minIterations` semantics are not contradicted by the profile schema | Med | Treat `minIterations` as a STOP-guard input to the profile, not a convergence-math parameter |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the right `normalizer` function per loop type — identity for research, Bayesian for council, decay-weighted for coverage? This must be decided in the ADR before migration starts.
- Should the convergence profile be defined as a TypeScript interface in a shared `.ts` file, or as a JSON schema for cross-language accessibility?
- Does the council's `convergence.cjs` use a fundamentally different threshold model (rounds vs iterations) that prevents a shared `normalizer` field, or is a union type sufficient?
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
