---
title: "Feature Specification: Phase 2: architecture-decision"
description: "Freeze the deep-alignment architecture before any mode-packet scaffolding starts: new-packet-vs-review-mode, the scoping decision tree, the pluggable per-authority adapter contract, the alignment contract, the state machine, artifact layout, and the boundaries against parent-skill-check.cjs and deep-review. Records the frozen brief's locked decisions as accepted ADRs and its open questions as explicitly open ADRs."
status: planned
trigger_phrases:
  - "deep-alignment architecture decision"
  - "alignment adapter contract freeze"
  - "deep-alignment state machine"
  - "deep-alignment vs deep-review boundary"
  - "phase 002 architecture-decision"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/002-architecture-decision"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the architecture-decision gate scaffold"
    next_safe_action: "Route decision-record.md for operator approval"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "sk-code adapter automatability limits"
      - "sk-design live-render audit v2+ scope"
      - "exact deep-review runtime reuse boundary"
      - "non-interactive lane-arg schema"
      - "new-authority adapter registration governance"
    answered_questions:
      - "New mode-packet, not a deep-review mode (ADR-001)"
      - "Adapter contract is discover/standardSource/check (ADR-003)"
      - "Alignment contract is verify-first, suppression-aware, read-only default, gated remediation (ADR-005)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This gate freezes the deep-alignment architecture: a new `system-deep-loop` mode-packet (not a `deep-review` mode), a structured three-axis scoping decision tree with a non-interactive arg form, a pluggable per-authority adapter contract (`discover`/`standardSource`/`check`), an alignment contract (verify-first, known-deviation suppression, read-only default, gated remediation), a seven-state loop (`INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> optional REMEDIATE`), and an explicit boundary against `parent-skill-check.cjs` (hub structure) and `deep-review` (general correctness). Seven ADRs in `decision-record.md` record these as Accepted, reflecting decisions already locked in the frozen design brief. Five further ADRs record the brief's open questions as explicitly Open, owned by later phases. This spec.md itself has not yet been walked through a human-approval sitting — that approval is the sole blocker before phase 003 scaffolds the mode-packet skeleton.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Phase** | 2 of 9 |
| **Predecessor** | 001-research-and-context |
| **Successor** | 003-scaffold-mode-packet |
| **Handoff Criteria** | Operator accepts the frozen architecture decision record and phase 003 can scaffold `SKILL.md` and the `mode-registry.json` entry without re-litigating packet shape, adapter contract, state machine, or authority sequencing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the deep-alignment mode-packet specification.

**Scope Boundary**: Decision-gate documentation only. This phase records the target architecture for the `deep-alignment` mode-packet and does not create, move, or edit any live `.opencode/skills/system-deep-loop/` file, `mode-registry.json` entry, or command.

**Dependencies**:
- Phase 001's confirmed research/context map, including the shared-vs-mode-local script inventory and the 130/131 reference-implementation summary.
- The frozen design brief's locked decisions and open questions, supplied as the authoritative input to this gate.
- Human approval of this decision gate before phase 003 starts.

**Deliverables**:
- Twelve ADRs in `decision-record.md`: seven Accepted (the brief's locked decisions) and five explicitly Open (the brief's open questions).
- A frozen target shape for the state machine, adapter contract, and artifact layout that phase 003 can scaffold against directly.
- An explicit, written boundary against `parent-skill-check.cjs` and `deep-review` so later phases do not re-derive it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The frozen design brief locks five architecture-level decision clusters for `deep-alignment` and names five open questions it explicitly defers rather than resolves. Phase 003 cannot safely plan the mode-packet skeleton until those clusters are written down as individually traceable, auditable decisions with rationale, alternatives, and rollback — and until the five deferred questions are recorded as open rather than silently assumed one way or the other.

### Purpose
Produce an operator-approvable architecture decision record for phase 002 so every later phase builds against one frozen deep-alignment target without re-litigating the brief's locked decisions, and so the five genuinely open questions stay visibly open and owned by the correct later phase.

### Evidence
- The reference implementation this mode-packet generalizes ran by hand this session: `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-review/review/deep-review-strategy.md` and `.opencode/specs/skilled-agent-orchestration/131-hub-doc-conformance-fixes/spec.md`.
- The runtime engine being reused is `deep-review`'s: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:22-80` (When To Use / Smart Routing) plus `.opencode/skills/system-deep-loop/runtime/scripts/{loop-lock,convergence,verify-iteration,upsert}.cjs`.
- Hub structure checking already exists and is out of scope for this mode: `.opencode/commands/doctor/scripts/parent-skill-check.cjs`.
- The declarative mode-registry that phase 003 will extend: `.opencode/skills/system-deep-loop/mode-registry.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the seven locked-decision clusters from the frozen design brief as formal accepted ADRs with rationale, alternatives, and rollback.
- Record the five open questions from the brief as formal open ADRs, each with the phase that owns its eventual resolution.
- Freeze a concrete target shape for the state machine, the adapter contract, and the packet-local artifact layout (spec-folder-bound, no manual `/tmp` state) that phase 003 can scaffold against directly.
- Freeze the explicit boundary: `deep-alignment` is NOT `parent-skill-check.cjs` (hub structure) and NOT `deep-review` (general correctness) — it audits artifact *content* against a *named* authority's own standards.

### Out of Scope
- Live mode-packet file changes under `.opencode/skills/system-deep-loop/deep-alignment/` or `mode-registry.json` — phase 002 is a decision gate, not the scaffold phase.
- Resolving any of the five open questions — this phase records them as open, owned by later phases, not decided here.
- Designing the exact `SKILL.md` prose, advisor routing weights, or command YAML — those are phase 003 and phase 009 concerns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/spec.md` | Modify | Replace scaffold placeholders with the phase 002 problem, scope, requirements, risks, and gate disposition |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/plan.md` | Modify | Replace scaffold placeholders with the decision-gate process and the frozen state-machine/adapter-contract target |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/tasks.md` | Modify | Replace scaffold placeholders with decision-gate task tracking |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` | Modify | Author the 12 ADRs (7 accepted, 5 open) |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/checklist.md` | Modify | Track pre-approval verification items |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Decision record covers the new-packet-vs-review-mode decision (ADR-001). | ADR-001 states Status: Accepted with context, decision, alternatives, and rollback. |
| REQ-002 | Decision record covers the scoping decision tree and non-interactive arg-form requirement (ADR-002). | ADR-002 states Status: Accepted and names the three scoping axes. |
| REQ-003 | Decision record covers the pluggable per-authority adapter contract (ADR-003). | ADR-003 states Status: Accepted and names the three adapter method signatures. |
| REQ-004 | Decision record covers the v1 authority sequencing (ADR-004). | ADR-004 states Status: Accepted and names the four v1 authorities in determinism order. |
| REQ-005 | Decision record covers the alignment contract's four invariants (ADR-005). | ADR-005 states Status: Accepted and names verify-first, suppression, read-only default, and gated remediation. |
| REQ-006 | Decision record covers the state machine and artifact layout (ADR-006). | ADR-006 states Status: Accepted and names all seven states plus the `alignment/` storage location. |
| REQ-007 | Decision record covers the explicit boundary against `parent-skill-check.cjs` and `deep-review` (ADR-007). | ADR-007 states Status: Accepted and names both adjacent systems by path. |
| REQ-008 | Decision record records all five brief open questions as explicitly Open ADRs, each with an explicit owner. | ADR-008 through ADR-012 carry `Status: Open (Deferred)` with an explicit owner — a named phase (007 for ADR-008, 008 for ADR-010, 004 for ADR-011) or an explicit beyond-this-program deferral (ADR-009, ADR-012, not pre-scoped); none are silently resolved in this gate. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Capture known implementation risks that later phases must respect. | Risks include the `sk-code` adapter's honesty limits, the `sk-design` v1 static-only scope, and the runtime-reuse boundary ambiguity (spec.md §6 and decision-record.md ADR-008/ADR-010). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operator accepts the phase 002 architecture decision gate before phase 003 starts.
- **SC-002**: Phase 003 has zero remaining ambiguity about the mode-packet's state names, adapter contract signatures, and authority set.
- **SC-003**: All five brief open questions are traceable to an explicit owner — a named phase (007/008/004) or an explicit beyond-this-program deferral (ADR-009, ADR-012) — none silently defaulted.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Human approval of the decision gate | Phase 003 must not start with unsettled architecture | Keep this phase in review-gate status until the operator explicitly accepts or amends the ADRs |
| Risk | Under-specified adapter-contract signatures cause phase 005-007 rework | High | Freeze the exact `discover(scope)`/`standardSource(authority)`/`check(artifact, rules)` shapes in `plan.md` §3 |
| Risk | `sk-code` adapter honesty limits get silently dropped in favor of a false-deterministic design | High | Record ADR-004 and open ADR-008 so phase 007 inherits the "honest limits" framing explicitly |
| Risk | Reuse boundary with `deep-review`'s runtime scripts is assumed rather than confirmed | Medium | Record open ADR-010 pointing at the scaffold-time shared-vs-mode-local script finding, which phase 001's research gate re-confirms |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
Every locked decision must be traceable to a named ADR in `decision-record.md` with an explicit rationale — no decision may be implied or assumed without a written record phase 003+ can cite.

### Reversibility
Because phase 003 has not yet run (no mode-packet files exist), every ADR in this gate must state a concrete rollback path that costs nothing before phase 003 and remains tractable after it.

### Auditability
The decision record must let a future reader reconstruct why each choice was made — including alternatives considered and why they were rejected — without re-reading the full design-brief conversation that produced this program.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Operator Rejects or Amends an ADR
If the operator does not approve one or more ADRs as written, phase 003 does not start. The rejected ADR is revised in place (same file, same ADR number) rather than creating a competing decision-record.md.

### Partial Approval
If the operator approves the structural ADRs (001-003) but wants to revisit the alignment contract (ADR-005) or the boundary ADR (007), phase 003 can still start scaffolding the skeleton files that do not depend on the contested ADR, provided that dependency is stated explicitly in this phase's approval note.

### A Later Phase Contradicts a Phase 002 Assumption
If phase 007's `sk-code` adapter work shows the chosen adapter contract cannot express a needed check, the affected ADR is amended (not silently overridden) with a new dated note referencing the phase 007 evidence, per the Logic-Sync Protocol.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 5 spec-doc files this phase; 12 ADRs; zero live skill files touched |
| Risk | 15/25 | Auth: N/A, API: N/A, Breaking: No — this is a new subsystem, not a change to a live routed skill yet |
| Research | 14/20 | Phase 001's confirmed research/context map plus the 130/131 reference-implementation review |
| Multi-Agent | 5/15 | Single-agent scaffold authoring dispatch |
| Coordination | 10/15 | 9-phase sequential gate structure; this phase blocks phase 003 |
| **Total** | **54/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `sk-code` adapter's judgment-heavy checks get treated as deterministic in a later phase | H | M | Open ADR-008 keeps the honesty-limits framing explicit through phase 007 |
| R-002 | The state machine gets re-litigated per adapter phase, causing drift | M | M | Freeze the seven-state machine here; adapters implement `check()`, they do not redesign the loop |
| R-003 | The `deep-review` reuse boundary is assumed shared when it is actually mode-local (as a scaffold-time read found for `reduce-state.cjs`; phase 001 re-confirms) | M | M | Open ADR-010 explicitly defers the shared-vs-fork call to phase 008 with that finding cited |
| R-004 | The alignment contract's read-only default gets bypassed by an eager remediation implementation later | H | L | ADR-005 states remediation is opt-in and operator-gated as an architecture invariant, not an implementation detail |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator reviewing this gate (Priority: P0)

**As an** operator, **I want** the twelve ADRs in `decision-record.md` clearly split into Accepted and Open, **so that** I can approve the frozen architecture in one pass without re-deriving which questions are still mine to answer.

**Acceptance Criteria**:
1. Given the twelve ADRs, When I read `decision-record.md`, Then seven are marked Accepted with rationale and five are marked Open, each with an explicit owner or an explicit not-pre-scoped deferral.

---

### US-002: Phase 003 implementer reading the frozen target (Priority: P0)

**As** whoever executes phase 003, **I want** a concrete state-machine and adapter-contract target in `plan.md`, **so that** I can plan the mode-packet skeleton without re-deriving any structural decision.

**Acceptance Criteria**:
1. Given `plan.md`'s architecture section, When phase 003 starts, Then every state name and adapter method signature needed is already named.

---

### US-003: Phase 007 sk-code adapter author (Priority: P1)

**As** whoever executes phase 007, **I want** the `sk-code` honesty-limits question flagged as explicitly open, **so that** I know it is mine to resolve rather than assuming phase 002 already decided it.

**Acceptance Criteria**:
1. Given open ADR-008, When phase 007 starts, Then the adapter design explicitly states what is deterministic and what is judgment-based, closing or amending ADR-008.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- `sk-code` adapter automatability limits — recorded as open ADR-008, owned by phase 007.
- `sk-design` live-render audit scope beyond v1 static-only — recorded as open ADR-009, owned by a later phase (not pre-scoped).
- Exact reuse boundary with the `deep-review` runtime engine (shared scripts vs. an intentional fork) — recorded as open ADR-010, owned by phase 008.
- Non-interactive lane-arg schema for headless/cron invocation — recorded as open ADR-011, owned by phase 004.
- Governance for registering a new authority adapter beyond the v1 four — recorded as open ADR-012, owned by a later phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Decision Record**: See `decision-record.md` for the 12 ADRs (7 accepted, 5 open) this gate freezes.
- **Parent Spec**: See `../spec.md` for the full 9-phase program map.
- **Predecessor**: See `../001-research-and-context/` for the confirmed research/context map this gate builds on.
- **Successor**: See `../003-scaffold-mode-packet/` for the phase that plans against this gate's frozen target shape.

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
