---
title: "Feature Specification: Phase 2: architecture-decision"
description: "Freeze the approved sk-prompt parent-hub architecture before any scaffold or rename work starts. This phase records the operator-approved decisions, resolves the two decision questions that can be resolved now, and defers the routing-class question to the empirical benchmark phase."
trigger_phrases:
  - "sk-prompt parent architecture decision"
  - "prompt-improve prompt-models mode registry"
  - "architecture decision gate"
  - "hub-router target shape"
  - "phase 002 architecture-decision"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Confirmed gate: 4 ADRs approved, zero drift in phase 001"
    next_safe_action: "Proceed to phase 003 hub scaffold"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether prompt-models needs a lexical routing-class carve-out is deferred to phase 007 benchmark evidence"
    answered_questions:
      - "prompt-improve manual_testing_playbook remains packet-local after the full rename"
      - "prompt-models visible version metadata normalizes to 0.9.0.0 while the parent hub releases the fold-in as 1.0.0.0"
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

This gate freezes the sk-prompt parent-hub architecture: one hub, two `packetKind:"workflow"` modes (`prompt-improve`, `prompt-models`), zero named extensions, full `git mv` rename for both packets, `/prompt` renamed to `/prompt-improve` with no command for `prompt-models`, and identity dissolution for `sk-prompt-models/graph-metadata.json` with its edges folded into the hub's. Four ADRs in `decision-record.md` cover hub topology, naming, command binding, and the two resolvable open questions (playbook ownership, version reconciliation). One question — whether `prompt-models` needs a lexical routing-class carve-out — is explicitly deferred to phase 007's empirical benchmark, not decided here. Operator approval of this gate is the sole blocker before phase 003 scaffolds the hub skeleton.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Approved |
| **Created** | 2026-07-09 |
| **Branch** | `not inspected; git commands intentionally not run for this drafting dispatch` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-research-and-context |
| **Successor** | 003-scaffold-hub |
| **Handoff Criteria** | Operator accepts the frozen architecture decision record and phase 003 can scaffold `mode-registry.json` and `hub-router.json` without re-litigating packet shape, command ownership, graph identity, or benchmark path ownership. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: Decision-gate documentation only. This phase records the target architecture for the sk-prompt parent hub and does not rename, move, or edit live `.opencode/skills/sk-prompt/` or `.opencode/skills/sk-prompt-models/` files.

**Dependencies**:
- Phase 001 research and the operator-approved locked decisions supplied in the dispatch context.
- Parent-hub doctrine from the sk-doc parent-skill references: one hub identity, one `modes[]` registry, required `hub-router.json`, and base router outcomes only for workflow-only hubs.
- Human approval of this decision gate before phase 003 starts.

**Deliverables**:
- Formal architecture decision record content for the phase 002 gate.
- Frozen target shape for the future `mode-registry.json` and `hub-router.json` files.
- Explicit disposition for the two resolvable open questions and explicit deferral of the empirical routing-class question to phase 007.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The program has approved high-impact structural decisions for folding `.opencode/skills/sk-prompt/` and `.opencode/skills/sk-prompt-models/` into a single `.opencode/skills/sk-prompt/` parent hub, but phase 003 cannot safely scaffold the hub until those decisions are frozen in one architecture record. Without a concrete target for `mode-registry.json`, `hub-router.json`, packet ownership, command ownership, graph identity, benchmark path ownership, and version reconciliation, the scaffold phase could re-open already-settled questions or create incompatible router metadata.

### Purpose
Produce an operator-approvable architecture decision record for phase 002 so every later phase can build against one frozen parent-hub target without re-litigating the approved merge decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the five locked operator decisions as formal architecture decisions with rationale.
- Resolve the two open questions that can be decided now: prompt-improve manual-testing-playbook ownership and prompt-models version-bump reconciliation.
- Record the third open question, prompt-models lexical routing-class carve-out, as explicitly deferred to phase 007 empirical benchmark evidence.
- Freeze a concrete target appendix for the future `mode-registry.json` and `hub-router.json` scaffolds, including base three router outcomes only and `routerPolicy.defaultMode: "prompt-improve"`.
- Preserve the constraint that `prompt-models` remains read-only with `mutatesWorkspace:false`, Read/Grep/Glob allowed, and Write/Edit/Task forbidden.

### Out of Scope
- Live skill file changes under `.opencode/skills/sk-prompt/` or `.opencode/skills/sk-prompt-models/` - phase 002 is a decision gate, not the scaffold or rename phase.
- Repointing `/deep:model-benchmark` paths or runtime path-join call sites - those changes must happen atomically with the physical move in the implementation phases.
- Exercising `.github/workflows/prompt-card-sync.yml` - CI validation belongs to the scaffold and verification phases after files exist in the new layout.
- Creating extra workflow, surface, runtime-loop, or transport axes - the approved target is the pure two-tier parent hub shape.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/spec.md` | Modify | Replace scaffold placeholders with the phase 002 problem, scope, requirements, risks, and gate disposition. |
| `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/plan.md` | Modify | Replace scaffold placeholders with the decision-gate process and frozen router/registry target. |
| `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/tasks.md` | Modify | Replace scaffold placeholders with decision-gate task tracking rather than code implementation tasks. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Decision record covers all five locked operator decisions: full `git mv` fold-in, `/prompt` to `/prompt-improve`, both packets as workflow modes, graph identity dissolution with edge preservation, and default routing to `prompt-improve`. | Each locked decision appears in the plan architecture section with rationale and downstream effect on phase 003. |
| REQ-002 | Decision record resolves prompt-improve manual-testing-playbook ownership and prompt-models version reconciliation. | The plan names packet-local playbook ownership and a concrete version strategy: prompt-models metadata normalizes to `0.9.0.0`, while the parent hub fold-in releases as `1.0.0.0`. |
| REQ-003 | Decision record defers the prompt-models lexical routing-class question to phase 007 instead of forcing it in phase 002. | The open-questions section states the empirical deferral and the plan keeps phase 003 scaffolded with metadata routing unless phase 007 evidence later amends it. |
| REQ-004 | Frozen target-shape appendix is concrete enough for phase 003 to scaffold directly. | The plan includes the required future registry and router fields, mode names, packet names, command ownership, tool surfaces, base router outcomes, tie-break order, and default mode. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Capture known implementation risks that later phases must respect. | Risks include the live benchmark write target, silent path-join call sites, prompt-card sync CI, graph edge preservation, and version drift. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operator accepts the phase 002 architecture decision gate before phase 003 starts.
- **SC-002**: Phase 003 has zero remaining ambiguity about packet folder names, `workflowMode` values, router outcomes, default route, command ownership, graph identity, tool permissions, and initial version targets.
- **SC-003**: The only intentionally unresolved architecture question is the prompt-models routing-class carve-out, and it is owned by phase 007 benchmark evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Human approval of the decision gate | Phase 003 must not start with unsettled architecture | Keep this phase in review-gate status until the operator explicitly accepts or amends the decisions. |
| Risk | Under-specified target shape causes phase 003 rework | High | Include concrete registry/router target fields that can be copied into scaffold files with only syntax polishing. |
| Risk | Benchmark directory treated as disposable fixture output | High | Record that `prompt-models/benchmarks/` is the live `/deep:model-benchmark` write target and path repointing must land atomically with the move. |
| Risk | Silent runtime path-join call sites miss the moved `model_profiles.json` | High | Record both known call sites as implementation-phase hazards and require same-change path updates when the assets move. |
| Risk | Version drift survives the fold-in | Medium | Normalize prompt-models visible metadata to `0.9.0.0` and publish the parent hub fold-in as `1.0.0.0`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
Every locked decision must be traceable to a named ADR in `decision-record.md` with an explicit rationale — no decision may be implied or assumed without a written record phase 003+ can cite.

### Reversibility
Because phase 003 has not yet run (additive-only, zero content moved), every ADR in this gate must state a concrete rollback path that costs nothing before phase 003 and remains tractable after it (see each ADR's "How to roll back").

### Auditability
The decision record must let a future reader reconstruct why each choice was made — including alternatives considered and why they were rejected — without needing to re-read the full research conversation that produced this program.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Operator Rejects or Amends an ADR
If the operator does not approve one or more ADRs as written, phase 003 does not start. The rejected ADR is revised in place (same file, same ADR number) rather than creating a competing decision-record.md — this keeps exactly one architecture record per program.

### Partial Approval
If the operator approves ADR-001/002/003 (structural) but wants to revisit ADR-004 (playbook/version), phase 003 can still start on the structural decisions since ADR-004's items (playbook location, version numbers) are phase 004/005 concerns, not phase 003 scaffold blockers. Note this explicitly if it occurs.

### Phase 007 Contradicts a Phase 002 Assumption
If phase 007's benchmark shows `routingClass: "metadata"` measurably regresses `prompt-models` routing accuracy, ADR-001's decision is amended (not silently overridden) with a new dated note referencing the phase 007 evidence, per the Logic-Sync Protocol (implementation evidence conflicting with an approved decision routes through an amendment, not a silent workaround).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 4 spec-doc files this phase, ~2,670 across the whole program; Systems: advisor, CI, 2 skill trees |
| Risk | 18/25 | Auth: N/A, API: N/A, Breaking: Yes — command rename + advisor identity dissolution affect live routing |
| Research | 15/20 | Phase 001 re-verification plus prior-art review of the 121 rename program |
| Multi-Agent | 10/15 | GPT-5.5-fast drafting fleet (this phase + 7 siblings) plus Sonnet verification |
| Coordination | 12/15 | 8-phase sequential gate structure; this phase blocks phase 003 |
| **Total** | **67/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Advisor routing accuracy regresses for small-model-dispatch queries | M | M | Phase 007 Lane-C benchmark gate before cutover |
| R-002 | A referrer to the old `sk-prompt-models/` path is missed and fails silently | H | M | Phase 006's re-run grep sweep as an explicit gate before phase 007 |
| R-003 | `/prompt-improve` stays outside checker 3k's automated tool-grant-drift coverage | L | H (certain, accepted) | Manual review during any future command-surface change |
| R-004 | Version metadata drift resurfaces after the fold-in | L | L | Single-field normalization in phase 005, verified by phase 008's final grep sweep |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator reviewing this gate (Priority: P0)

**As an** operator, **I want** the four ADRs in `decision-record.md` clearly stated with rationale and alternatives, **so that** I can approve or amend the architecture in one pass without re-deriving context.

**Acceptance Criteria**:
1. Given the four ADRs, When I read `decision-record.md`, Then each ADR states its decision, alternatives considered, and rollback path.

---

### US-002: Phase 003 implementer reading the frozen target (Priority: P0)

**As** whoever executes phase 003, **I want** a concrete `mode-registry.json`/`hub-router.json` target appendix, **so that** I can scaffold the hub without re-deriving any structural decision.

**Acceptance Criteria**:
1. Given `plan.md`'s architecture section, When phase 003 starts, Then every registry/router field needed is already named with its target value.

---

### US-003: Phase 007 benchmark result review (Priority: P1)

**As** whoever reviews phase 007's Lane-C benchmark, **I want** the routing-class deferral explicitly flagged as an open, benchmark-owned question, **so that** I know to check it rather than assume ADR-001 is final on that point.

**Acceptance Criteria**:
1. Given phase 007's benchmark report, When `prompt-models` routing accuracy is measured, Then the reviewer confirms or amends ADR-001 citing the evidence.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Resolved: prompt-improve's existing `manual_testing_playbook/` stays packet-local after the full rename; hub-level manual-testing material should cover only parent routing and cross-mode smoke expectations when created.
- Resolved: prompt-models version metadata normalizes to `0.9.0.0` because its latest changelog is already v0.9.0.0; the parent hub fold-in is a breaking architecture release targeted as `1.0.0.0`.
- Deferred to phase 007: whether `prompt-models` stays `routingClass: "metadata"` permanently or needs a lexical carve-out. Phase 002 does not force this decision; phase 003 should scaffold metadata routing and phase 007 benchmark evidence owns any amendment.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Decision Record**: See `decision-record.md` for the four ADRs (hub topology, naming, command binding, playbook/version reconciliation) this gate freezes.
- **Parent Spec**: See `../spec.md` for the full 8-phase program map.
- **Predecessor**: See `../001-research-and-context/` for the re-verified skill state and referrer inventory this gate builds on.
- **Successor**: See `../003-scaffold-hub/` for the phase that scaffolds against this gate's frozen target shape.

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
