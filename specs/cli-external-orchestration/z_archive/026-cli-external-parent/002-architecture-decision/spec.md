---
title: "Feature Specification: Phase 2: architecture-decision"
description: "Freeze the approved cli-external parent-hub architecture before any scaffold, move, or scorer-rewrite work starts. This phase records the five operator-approved ADRs, including the load-bearing hub-aware rewrite of the executor-delegation scorer, and the frozen registry/router/graph target shapes."
trigger_phrases:
  - "cli-external parent architecture decision"
  - "cli-opencode cli-claude-code mode registry"
  - "architecture decision gate"
  - "executor-delegation scorer rewrite"
  - "phase 002 architecture-decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the five-ADR decision gate and frozen target shapes"
    next_safe_action: "Human review before phase 003 hub scaffold"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the shared dispatch-preflight hook lifts to hub root cli-external/scripts/ (ADR-002 sub-decision, resolved at phase 003/004 execution)"
    answered_questions:
      - "Both modes are packetKind:workflow; transport rejected because both orchestrate and their dispatched writes land in this repo"
      - "family cli forces the scorer rewrite (ADR-004 + ADR-005 are paired and atomic in phase 005)"
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

This gate freezes the cli-external parent-hub architecture: one hub, two `packetKind:"workflow"` modes (`cli-opencode`, `cli-claude-code`), zero named extensions, full `git mv` rename for both packets, no command created, identity dissolution into one hub `graph-metadata.json` with `family: cli`, and — the load-bearing decision — a hub-aware rewrite of the executor-delegation scorer so delegation prompts keep resolving after the leaf skills dissolve. Five ADRs in `decision-record.md` cover hub topology, full rename, command binding, identity dissolution plus family choice, and the scorer rewrite. The scorer rewrite (ADR-005) is paired with and atomic to the identity dissolution (ADR-004) because setting the hub's family to `cli` makes the scorer's `family === 'cli'` filter match the hub instead of the leaves, silently degrading delegation routing: the hub's `external` noun enters the orchestrator-noun table (resolving prompts to the non-executor `cli-external`) and the model-alias backstop drops via the `activeExecutorIds` guard. Operator approval of this gate is the sole blocker before phase 003 scaffolds the hub skeleton.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-research-and-context |
| **Successor** | 003-scaffold-hub |
| **Handoff Criteria** | Operator accepts the frozen five-ADR decision record and phase 003 can scaffold `mode-registry.json`, `hub-router.json`, and the single hub `graph-metadata.json` without re-litigating packet shape, command ownership, graph identity, family choice, or the scorer-rewrite contract. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: Decision-gate documentation only. This phase records the target architecture for the cli-external parent hub and does not rename, move, or edit live `.opencode/skills/cli-opencode/`, `.opencode/skills/cli-claude-code/`, advisor code, hooks, or CI.

**Dependencies**:
- Phase 001 research and the operator-approved locked decisions supplied in the dispatch context.
- Parent-hub doctrine from the sk-doc parent-skill references: one hub identity, one `modes[]` registry, required `hub-router.json`, and base router outcomes only for workflow-only hubs.
- Human approval of this decision gate before phase 003 starts.

**Deliverables**:
- Formal architecture decision record content for the phase 002 gate: five ADRs.
- Frozen target shapes for the future `mode-registry.json`, `hub-router.json`, and hub `graph-metadata.json`.
- The scorer-rewrite contract (ADR-005) recorded precisely enough that phase 005 can implement it and phase 007 can re-baseline its parity fixtures without re-deriving intent.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The program has approved high-impact structural decisions for folding `.opencode/skills/cli-opencode/` and `.opencode/skills/cli-claude-code/` into a single `.opencode/skills/cli-external/` parent hub, but phase 003 cannot safely scaffold the hub until those decisions are frozen in one architecture record. Without a concrete target for `mode-registry.json`, `hub-router.json`, the single hub `graph-metadata.json`, command ownership, and — above all — the hub-aware scorer contract, the scaffold and fold-in phases could re-open settled questions or create a change that silently breaks delegation routing.

### Purpose
Produce an operator-approvable architecture decision record for phase 002 so every later phase can build against one frozen parent-hub target, and so the scorer rewrite is specified precisely enough to land atomically with the identity dissolution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the five locked operator decisions as formal ADRs with rationale: hub topology, full rename, command binding, identity dissolution plus family choice, and the hub-aware scorer rewrite.
- State the family-cli-to-scorer consequence explicitly and pair ADR-004 and ADR-005 as one atomic change.
- Freeze concrete target appendices for the future `mode-registry.json` and `hub-router.json` scaffolds, including base three router outcomes only and `routerPolicy.defaultMode`.
- Record the scorer-rewrite contract: source aliases from the hub `mode-registry.json`, resolve to the `EXECUTOR_KINDS` strings, do not derive an orchestrator noun from the hub id, refresh dist, and re-baseline the 11 parity fixtures (preserving the negatives; no scenario resolves to `cli-external`).
- Record the shared-hook-lift question as an open ADR-002 sub-decision owned by phase 003/004.

### Out of Scope
- Live skill file changes under `.opencode/skills/cli-opencode/` or `.opencode/skills/cli-claude-code/` - phase 002 is a decision gate, not the scaffold, move, or rewrite phase.
- Repointing the PreToolUse hook path, the Python alias maps, or editing the scorer - those changes happen atomically with the physical move in the implementation phases.
- Exercising the CI card-sync gate - CI validation belongs to the integration and cutover phases after files exist in the new layout.
- Creating extra workflow, surface, runtime-loop, or transport axes - the approved target is the pure two-tier parent hub shape.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-architecture-decision/spec.md` | Modify | Replace scaffold placeholders with the phase 002 problem, scope, requirements, risks, and gate disposition. |
| `002-architecture-decision/plan.md` | Modify | Replace scaffold placeholders with the decision-gate process and frozen registry/router/scorer target. |
| `002-architecture-decision/tasks.md` | Modify | Replace scaffold placeholders with decision-gate task tracking rather than code implementation tasks. |
| `002-architecture-decision/decision-record.md` | Create | The five accepted ADRs, each with alternatives, consequences, five-checks, and rollback. |
| `002-architecture-decision/checklist.md` | Create | Level-3 verification checklist for the decision gate. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Decision record covers all five locked operator decisions: hub topology, full `git mv` rename, no command, identity dissolution with family cli, and the hub-aware scorer rewrite. | Each locked decision appears as an ADR with rationale, alternatives, and downstream effect on later phases. |
| REQ-002 | The family-cli-to-scorer consequence is stated and ADR-004/ADR-005 are paired as one atomic change. | The record states that `family: cli` makes the scorer's family filter match the hub, and requires the dissolution and scorer rewrite to land in the same change. |
| REQ-003 | The scorer-rewrite contract is recorded precisely enough to implement and re-baseline. | ADR-005 names the source (hub `mode-registry.json`), the required resolution target (`EXECUTOR_KINDS` strings), the no-hub-noun rule, the dist refresh, and the 11-case parity-fixture re-baseline (6/2/2/1) including the negative-preservation and no-`cli-external` invariants. |
| REQ-004 | Frozen target-shape appendix is concrete enough for phase 003 to scaffold directly. | The plan includes the required future registry and router fields, mode names, packet names, command ownership (none), tool surfaces, base router outcomes, tie-break order, and default mode. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Capture known implementation risks that later phases must respect. | Risks include the fail-open PreToolUse hook, the silent-misroute scorer window, graph-edge preservation, and the shared-hook-lift sub-decision. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operator accepts the phase 002 architecture decision gate before phase 003 starts.
- **SC-002**: Phase 003 has zero remaining ambiguity about packet folder names, `workflowMode` values, router outcomes, default route, command ownership (none), graph identity, family, and initial version targets.
- **SC-003**: The scorer-rewrite contract is unambiguous enough that phase 005 implements it atomically with the dissolution and phase 007 re-baselines the parity fixtures without re-deriving intent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Human approval of the decision gate | Phase 003 must not start with unsettled architecture | Keep this phase in review-gate status until the operator explicitly accepts or amends the decisions. |
| Risk | Under-specified target shape causes phase 003 rework | High | Include concrete registry/router target fields that can be copied into scaffold files with only syntax polishing. |
| Risk | Scorer rewrite split from the dissolution opens a silent-misroute window | High | Pair ADR-004 and ADR-005 as one atomic change; record the requirement in both ADRs. |
| Risk | Fail-open PreToolUse hook loses enforcement if the path is not repointed atomically | High | Record the hook path as an implementation-phase hazard requiring same-change repoint plus an active trigger test at cutover. |
| Risk | A reciprocal advisor edge dangles after dissolution | Medium | Record edge preservation and reciprocal-edge repointing as fold-in / integration obligations. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
Every locked decision must be traceable to a named ADR in `decision-record.md` with an explicit rationale — no decision may be implied or assumed without a written record later phases can cite.

### Reversibility
Because phase 003 has not yet run (additive-only, zero content moved), every ADR must state a concrete rollback path that costs nothing before phase 003 and remains tractable after it — including the atomic scorer/dissolution change, which reverts as one unit.

### Auditability
The decision record must let a future reader reconstruct why each choice was made — including the transport rejection and the family-cli-to-scorer coupling — without re-reading the full research conversation that produced this program.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Operator Rejects or Amends an ADR
If the operator does not approve one or more ADRs as written, phase 003 does not start. The rejected ADR is revised in place (same file, same ADR number) rather than creating a competing decision record — this keeps exactly one architecture record per program.

### Partial Approval
If the operator approves the structural ADRs (001/002/003) but wants to revisit the identity/scorer pair (004/005), phase 003 can still scaffold the registry/router skeleton, but phases 004/005 do not start until 004/005 are settled — because the scorer rewrite and dissolution are atomic and cannot be split.

### Phase 007 Contradicts a Phase 002 Assumption
If phase 007's benchmark shows `routingClass: "metadata"` measurably regresses delegation routing, ADR-001's routing assumption is amended (not silently overridden) with a dated note referencing the phase 007 evidence, per the Logic-Sync Protocol.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 5 spec-doc files this phase, ~120 skill files plus runtime advisor code across the program; Systems: advisor scorer, PreToolUse hook, CI, 2 skill trees |
| Risk | 20/25 | Auth: N/A, API: N/A, Breaking: Yes — identity dissolution plus a runtime scorer rewrite affect live delegation routing that fails silently if wrong |
| Research | 15/20 | Phase 001 skill-state re-verification plus classified referrer inventory and 124 prior-art review |
| Multi-Agent | 8/15 | Drafting plus verification; no live multi-agent loop in this phase |
| Coordination | 13/15 | 8-phase sequential gate structure; this phase blocks phase 003 and specifies the atomic phase-005 bundle |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Delegation prompts silently degrade after the leaves dissolve (resolve to the non-executor `cli-external` or lose resolution) | H | M | Hub-aware scorer rewrite (ADR-005) landed atomically with the dissolution; phase 007 parity re-baseline |
| R-002 | A referrer to an old flat path is missed and fails silently | H | M | Phase 001 classified inventory + phase 006 re-run grep sweep as an explicit gate |
| R-003 | The fail-open PreToolUse hook loses enforcement mid-migration | H | M | Same-change hook repoint + active hard-rule trigger test at phase 008 |
| R-004 | `cli-external` stays outside checker 3k's command coverage | L | H (certain, accepted) | Manual review during any future command-surface change |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator reviewing this gate (Priority: P0)

**As an** operator, **I want** the five ADRs in `decision-record.md` clearly stated with rationale and alternatives, **so that** I can approve or amend the architecture in one pass without re-deriving context.

**Acceptance Criteria**:
1. Given the five ADRs, When I read `decision-record.md`, Then each ADR states its decision, alternatives considered, and rollback path.

---

### US-002: Phase 005 implementer reading the scorer contract (Priority: P0)

**As** whoever executes phase 005, **I want** the scorer-rewrite contract stated precisely, **so that** I can source the alias table from the mode-registry, resolve to the executor-kind strings, refresh dist, and re-baseline the fixtures atomically with the dissolution.

**Acceptance Criteria**:
1. Given ADR-005, When phase 005 starts, Then the source, resolution target, dist refresh, and fixture re-baseline are all named.

---

### US-003: Phase 007 benchmark reviewer (Priority: P1)

**As** whoever reviews phase 007's benchmark, **I want** the routing-class assumption flagged as benchmark-owned, **so that** I know to confirm or amend it rather than assume ADR-001 is final on that point.

**Acceptance Criteria**:
1. Given phase 007's benchmark report, When delegation routing accuracy is measured, Then the reviewer confirms or amends ADR-001 citing the evidence.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Resolved: both modes are `packetKind: "workflow"` with zero extensions; transport was mechanically ruled out.
- Resolved: the hub takes `family: cli`, which is exactly why the scorer rewrite (ADR-005) is mandatory and atomic with the dissolution.
- Open (ADR-002 sub-decision): whether the shared dispatch-preflight hook tree lifts to hub root `cli-external/scripts/` or stays under the `cli-opencode/` packet. Owned by phase 003/004 execution; either placement is acceptable if the hook is made hub-aware in the same change.
- Deferred to phase 007: whether either mode needs a lexical routing carve-out or `routingClass: "metadata"` holds.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Decision Record**: See `decision-record.md` for the five ADRs this gate freezes.
- **Parent Spec**: See `../spec.md` for the full 8-phase program map.
- **Predecessor**: See `../001-research-and-context/` for the re-verified skill state and classified referrer inventory this gate builds on.
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
