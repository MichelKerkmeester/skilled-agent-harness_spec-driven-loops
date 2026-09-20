---
title: "Feature Specification: Phase 2: architecture-decision"
description: "Freeze the approved mcp-tooling parent-hub architecture before any scaffold or move work starts. This phase records the operator-locked decisions as ADRs (topology, figma transport, cross-hub pairing, naming, identity dissolution, code-mode exclusion, versioning) and gives phase 003 a concrete registry/router target."
trigger_phrases:
  - "mcp-tooling parent architecture decision"
  - "mcp-tooling mode registry"
  - "figma transport axis decision"
  - "code-mode exclusion rationale"
  - "phase 002 architecture-decision"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored planned decision-gate spec and six ADRs"
    next_safe_action: "Operator reviews the decision gate before phase 003"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the figma transport needs any lexical routing carve-out is deferred to phase 007 benchmark evidence"
    answered_questions:
      - "packetKind topology: chrome-devtools and click-up as workflow, figma as transport, one transport-axis extension"
      - "Naming keeps the mcp- prefix under the hub; mcp-code-mode is excluded and stays flat"
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

This gate freezes the mcp-tooling parent-hub architecture: one hub, three modes — two `packetKind:"workflow"` bridges (`mcp-chrome-devtools`, `mcp-click-up`) and one `packetKind:"transport"` bridge (`mcp-figma`) declared on a `transport-axis` extension — plus a full `git mv` rename that keeps the `mcp-` prefix, identity dissolution of the three children's graph metadata into one hub graph identity, and an explicit exclusion of `mcp-code-mode` (which stays a flat standalone skill). Six ADRs in `decision-record.md` cover topology/packetKind, the figma transport plus its cross-hub pairing to `sk-design`, naming/prefix-keep, identity dissolution, the code-mode exclusion rationale, and versioning/command binding. One question — whether the figma transport needs any lexical routing carve-out beyond hub-membership metadata routing — is explicitly deferred to phase 007's routing benchmark. This is a PLAN: no skill files move in this phase, and operator approval of the gate is the sole blocker before phase 003 scaffolds the hub skeleton.
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
| **Handoff Criteria** | Operator accepts the frozen decision record and phase 003 can scaffold `mode-registry.json` and `hub-router.json` without re-litigating packet shape, transport axis, naming, graph identity, or the code-mode exclusion. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Decision-gate documentation only. This phase records the target architecture for the mcp-tooling parent hub and does not move, rename, or edit any live `.opencode/skills/mcp-chrome-devtools/`, `.opencode/skills/mcp-click-up/`, `.opencode/skills/mcp-figma/`, or `.opencode/skills/mcp-code-mode/` files.

**Dependencies**:
- Phase 001 research and the operator-locked decisions supplied in the dispatch context.
- Parent-hub doctrine from the sk-doc parent-skill references, and `sk-design`'s live mixed workflow-plus-transport hub as the transport-axis precedent.
- Human approval of this decision gate before phase 003 starts.

**Deliverables**:
- Formal architecture decision record content for the phase 002 gate (six ADRs).
- Frozen target shape for the future `mode-registry.json` (with a `transport-axis` extension) and `hub-router.json`.
- Explicit deferral of the empirical routing carve-out question to phase 007.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The program has operator-locked structural decisions for bringing `.opencode/skills/mcp-chrome-devtools/`, `.opencode/skills/mcp-click-up/`, and `.opencode/skills/mcp-figma/` under a single `.opencode/skills/mcp-tooling/` parent hub, but phase 003 cannot safely scaffold the hub until those decisions are frozen in one architecture record. Without a concrete target for `mode-registry.json` (including the `transport-axis` extension), `hub-router.json`, packet naming, graph identity dissolution, and the boundary that keeps `mcp-code-mode` out, the scaffold phase could re-open settled questions or produce incompatible router metadata.

### Purpose
Produce an operator-approvable architecture decision record for phase 002 so every later phase can build against one frozen parent-hub target without re-litigating the locked decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the operator-locked decisions as six formal ADRs with rationale: topology/packetKind, figma-transport plus cross-hub pairing, naming/prefix-keep, identity dissolution, code-mode exclusion, and versioning/command binding.
- Freeze a concrete target appendix for the future `mode-registry.json` (two workflow modes, one transport mode, a `transport-axis` extension listing `mcp-figma`) and `hub-router.json` (base three outcomes, `defaultMode: "mcp-chrome-devtools"`).
- Record the transport contract adaptation that licenses figma's mandatory cross-hub judgment pairing to `sk-design`.
- Preserve each bridge's `allowed-tools` posture: chrome-devtools and click-up keep Write/Edit (workflow, `mutatesWorkspace:true`); figma keeps a no-Write/Edit surface (`mutatesWorkspace:false`).

### Out of Scope
- Live skill file moves under any of the four `mcp-*` skills - phase 002 is a decision gate, not the scaffold or move phase.
- Repointing `doctor_mcp_install.yaml` path refs or the advisor routing corpus - those changes happen in the implementation phases (004-006).
- Any change to `mcp-code-mode` - it is excluded by ADR-005 and stays a flat standalone skill.
- Creating extra surface-axis or runtime-loop extensions - the approved target is a two-workflow-plus-one-transport hub with a single transport-axis extension.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/spec.md` | Modify | Replace scaffold placeholders with the phase 002 problem, scope, requirements, risks, and gate disposition |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/decision-record.md` | Create | Author the six ADRs freezing the locked architecture |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/plan.md` | Modify | Replace scaffold placeholders with the decision-gate process and frozen registry/router target |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/checklist.md` | Create | Author the Level-3 verification checklist for the decision gate |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/002-architecture-decision/tasks.md` | Modify | Replace scaffold placeholders with decision-gate task tracking |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Decision record covers the topology: two workflow bridges, one figma transport, one transport-axis extension. | ADR-001 states each bridge's packetKind with `allowed-tools`/`mutatesWorkspace` evidence and the downstream effect on phase 003's registry. |
| REQ-002 | Decision record freezes the figma transport plus its cross-hub pairing to `sk-design`. | ADR-002 records the transport-axis contract adaptation that licenses a cross-hub judgment partner, grounded in `sk-design`'s live transport precedent. |
| REQ-003 | Decision record freezes naming (full `git mv`, keep the `mcp-` prefix) and identity dissolution. | ADR-003 and ADR-004 state `folder == packetSkillName == workflowMode`, `grandfatheredFolderMismatch:false`, and the union of edges folded into one hub graph identity. |
| REQ-004 | Decision record records the `mcp-code-mode` exclusion rationale. | ADR-005 states why code-mode stays flat: it is a live `opencode.json` native-MCP server serving manuals beyond this set, so relocating it is a higher-blast-radius change out of scope here. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Decision record freezes versioning and command binding, and a concrete registry/router target. | ADR-006 sets the hub `SKILL.md` at `1.0.0.0`, keeps each child's own version and changelog, records no new commands, and the plan's appendix names every registry/router field phase 003 needs including `defaultMode: "mcp-chrome-devtools"`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operator accepts the phase 002 decision gate before phase 003 starts.
- **SC-002**: Phase 003 has zero remaining ambiguity about packet folder names, `workflowMode`/`packetKind` values, the transport-axis extension, router outcomes, default mode, graph identity, tool surfaces, and initial version targets.
- **SC-003**: The only intentionally unresolved architecture question is the figma transport routing carve-out, owned by phase 007 benchmark evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Human approval of the decision gate | Phase 003 must not start with unsettled architecture | Keep this phase in review-gate status until the operator explicitly accepts or amends the ADRs |
| Risk | Under-specified target shape causes phase 003 rework | High | Include concrete registry/router target fields, including the transport-axis extension, that copy into scaffold files with only syntax polishing |
| Risk | The transport contract adaptation (cross-hub pairing) is treated as a silent deviation | Medium | Record it as an explicit accepted ADR with reasoning grounded in `sk-design`'s live transport precedent and the existing CLAUDE.md framing of figma as the external sibling transport |
| Risk | A functional path referrer to a moved bridge is missed and fails silently | High | Phase 006's re-run grep sweep as an explicit gate before phase 007; ADR-004 names the `doctor_mcp_install.yaml` refs as the primary functional referrers |
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

### Transport Contract Adaptation Is Rejected
If the operator rejects the cross-hub pairing adaptation in ADR-002, the fallback is to keep `mcp-figma` a flat standalone transport skill (not folded into the hub) while chrome-devtools and click-up still form a two-workflow hub. Note this explicitly if it occurs; it does not block the other five ADRs.

### Phase 007 Contradicts a Phase 002 Assumption
If phase 007's routing benchmark shows hub-membership metadata routing measurably regresses figma-transport routing accuracy, ADR-001/ADR-006's routing assumption is amended (not silently overridden) with a new dated note referencing the phase 007 evidence, per the Logic-Sync Protocol.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 6 spec-doc files this phase, ~235 tracked across the three moving bridges; Systems: advisor, doctor command, 3 skill trees |
| Risk | 16/25 | Auth: N/A, API: N/A, Breaking: Yes — advisor identity dissolution and a transport-contract adaptation affect live routing |
| Research | 14/20 | Phase 001 skill-state + referrer inventory plus the `sk-design` transport-axis precedent review |
| Multi-Agent | 8/15 | Planning fleet drafting this phase plus its 7 siblings, with independent verification |
| Coordination | 12/15 | 8-phase sequential gate structure; this phase blocks phase 003 |
| **Total** | **62/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Advisor routing accuracy regresses for the figma transport after identity dissolution | M | M | Phase 007 routing benchmark gate before cutover |
| R-002 | A referrer to an old bridge skill-folder path is missed and fails silently | H | M | Phase 006's re-run grep sweep as an explicit gate before phase 007 |
| R-003 | The cross-hub pairing adaptation drifts from `sk-design`'s transport contract over time | L | L | ADR-002 records the adaptation and its precedent so future readers can reconcile it |
| R-004 | The stale `mcp-open-design` entry in `doctor_mcp_install.yaml` is left uncorrected | L | M | Phase 006 fixes it in passing as a good-hygiene catch |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator reviewing this gate (Priority: P0)

**As an** operator, **I want** the six ADRs in `decision-record.md` clearly stated with rationale and alternatives, **so that** I can approve or amend the architecture in one pass without re-deriving context.

**Acceptance Criteria**:
1. Given the six ADRs, When I read `decision-record.md`, Then each ADR states its decision, alternatives considered, and rollback path.

---

### US-002: Phase 003 implementer reading the frozen target (Priority: P0)

**As** whoever executes phase 003, **I want** a concrete `mode-registry.json`/`hub-router.json` target appendix including the transport-axis extension, **so that** I can scaffold the hub without re-deriving any structural decision.

**Acceptance Criteria**:
1. Given `plan.md`'s architecture section, When phase 003 starts, Then every registry/router field needed, including the transport-axis `transports` list, is already named with its target value.

---

### US-003: Phase 007 benchmark reviewer (Priority: P1)

**As** whoever reviews phase 007's routing benchmark, **I want** the figma-transport routing carve-out flagged as an open, benchmark-owned question, **so that** I know to check it rather than assume ADR-001 is final on that point.

**Acceptance Criteria**:
1. Given phase 007's benchmark report, When figma-transport routing accuracy is measured, Then the reviewer confirms or amends the routing assumption citing the evidence.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Resolved: chrome-devtools and click-up are workflow modes (both grant Write/Edit and mutate the local workspace); figma is a transport mode (no Write/Edit, writes land in Figma Desktop).
- Resolved: the hub keeps the `mcp-` prefix on all three packets; `mcp-code-mode` is excluded and stays flat.
- Deferred to phase 007: whether the figma transport needs any lexical routing carve-out or hub-membership metadata routing suffices. Phase 002 does not force this; phase 003 scaffolds metadata routing and phase 007 benchmark evidence owns any amendment.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Decision Record**: See `decision-record.md` for the six ADRs this gate freezes.
- **Parent Spec**: See `../spec.md` for the full 8-phase program map.
- **Predecessor**: See `../001-research-and-context/` for the verified skill state and referrer inventory this gate builds on.
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
