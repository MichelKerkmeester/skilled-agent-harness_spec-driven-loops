---
title: "Feature Specification: Phase 2: architecture-decision [template:level_1/spec.md]"
description: "The 001 corpus research recommends an sk-design family structure but does not bind it; the build phases (003-006) need locked, unambiguous decisions on structural model, taxonomy, naming, and migration order before any scaffolding starts."
trigger_phrases:
  - "sk-design architecture decision"
  - "umbrella router design family"
  - "sk-design taxonomy lock"
  - "sk-design structural model"
  - "design parent decision"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/002-architecture-decision"
    last_updated_at: "2026-06-25T12:41:14Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the locked umbrella-router + 5-core-children architecture decision"
    next_safe_action: "Hand off to 003-scaffold-parent to scaffold the umbrella skill and registry"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../001-corpus-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/002-architecture-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Foundations grain (color/layout split) deferred to 005"
      - "Optional sk-design-output child revisit deferred"
    answered_questions:
      - "Structural model: umbrella-router over a sibling family"
      - "Taxonomy: 5 core children, output deferred"
      - "Naming/compat: keep flat sk-design-* names, preserve legacy triggers"
      - "Migration order: 003 scaffold, 004 onboard, 005 build, 006 integrate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-25 |
| **Branch** | `skilled-agent-orchestration/154-sk-design-parent/002-architecture-decision` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | ../001-corpus-research/spec.md |
| **Successor** | ../003-scaffold-parent/spec.md |
| **Handoff Criteria** | Structural model, taxonomy, naming/compat policy, and migration order are each recorded unambiguously with rationale, the rejected hub alternative, and consequences; 003 can scaffold without re-litigating the structure. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Build the sk-design umbrella family from the corpus research specification.

This phase converts the 4-model corpus research in `../001-corpus-research/research/research.md` into the binding architecture decision. The research recommends a direction (umbrella-router majority, 3 of 4 lineages) but stops at recommendation; the operator reviewed it and locked the calls. The deliverable of this phase IS the recorded decision that the downstream build phases consume.

**Scope Boundary**: Lock and document the architecture decisions only. No skills are scaffolded, renamed, or built here; that work is 003-006.

**Dependencies**:
- `../001-corpus-research/research/research.md` (the consolidated 4-model synthesis being converted into a decision)
- Operator review and lock of the structural model, taxonomy, naming, and migration order

**Deliverables**:
- A recorded, unambiguous decision: umbrella-router structural model, 5 core children (+ output deferred), flat-name backward-compat policy, and the 003-006 migration order, each with rationale, the rejected hub alternative, and consequences.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 001 corpus research recommends restructuring `sk-design-interface` into an `sk-design` family but explicitly leaves the call to a decision gate: it surfaces a structural-model split (3 lineages favor umbrella-router, kimi27 dissents toward a hub) and a grain spread (5-7 children) without binding either. The build phases (003-006) cannot scaffold, onboard, or author children against an un-decided structure, so the project stalls until the structural model, taxonomy, naming/compat policy, and migration order are locked.

### Purpose
Record the binding architecture decision so 003-006 can build the sk-design family without re-opening the structure: an umbrella-router over a flat sibling family, 5 core children (output deferred), flat names preserved for zero reference rewrites, executed in a fixed 003-006 migration order.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lock and document the **structural model**: umbrella-router over a sibling family. `sk-design` becomes a thin umbrella/router skill; the design sub-skills stay independent top-level skills the advisor routes to directly. Hub-style structure is used only INSIDE the interface child. Rationale: heterogeneous runtimes (md-generator ships a Playwright backend; interface is pure judgment), independently-invokable children, and keeping flat `sk-design-*` names means zero reference rewrites. Record the rejected single-hub alternative (kimi27's dissent on single-advisor-identity grounds), deferred unless future usage telemetry favors it, plus consequences.
- Lock and document the **taxonomy**: 5 core children -- `sk-design-interface` (keep name; folds existing interface), `sk-design-spec` (folds `sk-design-md-generator`, keep that name as alias), `sk-design-foundations` (new; OKLCH color, type, layout, tokens), `sk-design-motion` (new; animation, micro-interactions, transitions), `sk-design-audit` (new; cross-cutting a11y/perf/critique/harden with a P0-P3 + 5-dimension `/20` contract). `sk-design-output` is deferred; its sources become a references library under the interface child for v1.
- Lock and document the **naming and backward-compat policy**: keep flat names, preserve all legacy trigger phrases, and keep `sk-design-interface`'s references (mcp-open-design mandatory co-load, mcp-figma, sk-code, CLAUDE.md gates) resolving unchanged.
- Lock and document the **migration order**: 003 scaffold umbrella -> 004 onboard existing -> 005 build net-new -> 006 integrate/validate.

### Out of Scope
- Building, scaffolding, renaming, or authoring any skill - that is phases 003-006, not this decision phase.
- Re-running or re-litigating the 001 research - the synthesis is treated as the settled input.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| spec.md | Modify | Record the problem, scope, requirements, and risks of the locked architecture decision |
| plan.md | Modify | Record the decision approach and the umbrella architecture |
| tasks.md | Modify | Record the decision-recording steps as completed |
| implementation-summary.md | Modify | Record the locked decision as the completed deliverable with verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The structural model is documented unambiguously as umbrella-router over a sibling family. | spec.md scope states umbrella-router (thin parent, independent siblings, hub-style only inside interface child) as the single chosen model with no remaining either/or. |
| REQ-002 | The taxonomy is documented unambiguously as 5 core children with output deferred. | spec.md scope names all 5 children with scope, the kept/aliased names for the two existing skills, and the deferral of `sk-design-output`. |
| REQ-003 | The naming and backward-compat policy is documented unambiguously. | spec.md scope states flat names kept, legacy trigger phrases preserved, and interface references resolving unchanged. |
| REQ-004 | The migration order is documented unambiguously. | spec.md and plan.md state the 003 scaffold -> 004 onboard -> 005 build -> 006 integrate sequence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The consequences of the umbrella decision are captured. | spec.md risks and the decision narrative record the advisor/usage-telemetry gap and the shared-base coupling consequence. |
| REQ-006 | The rejected hub alternative is captured with rationale. | spec.md and plan.md name the single-hub alternative, kimi27's single-advisor-identity argument, and the deferral condition (future usage telemetry). |
| REQ-007 | Each locked decision is traceable to the 001 research. | implementation-summary.md cites `../001-corpus-research/research/research.md` as the source for the recommendation being bound. |
| REQ-008 | The deferred open questions are recorded rather than silently dropped. | spec.md open questions list the foundations grain (color/layout split, deferred to 005) and the output-child revisit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four locked decisions (structural model, taxonomy, naming/compat, migration order) are documented in this phase with no unresolved either/or remaining, so 003 can scaffold directly.
- **SC-002**: The rejected hub alternative, its rationale, the deferral condition, and the umbrella consequences (telemetry gap, shared-base coupling) are recorded alongside the decision.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../001-corpus-research/research/research.md` | If the synthesis were wrong, the locked decision would inherit the error | The research is a consolidated 4-model fan-out with cross-lineage agreement flags; operator reviewed it before locking |
| Risk | Advisor/usage-telemetry gap could favor a hub later | Med | The decision is reversible by amending this phase; the rejected hub alternative is documented so a flip is cheap if telemetry shows mostly-generic entry |
| Risk | Shared-base coupling across children (hidden dependency) | Med | Keep children self-contained until the parent base resolves; version the shared base and regression-test children on base changes (per opus48 governance flag) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Foundations grain: keep `sk-design-foundations` as one child or split into color/layout - deferred to 005 (structure internals as `color/`, `type/`, `layout/` so a later split is mechanical).
- Optional `sk-design-output` child: revisit whether to promote it from an interface references library to a standalone child after v1.
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
