---
title: "Feature Specification: Phase 5: foldin-clickup-and-figma"
description: "git mv the 154-file mcp-click-up workflow tree and the 40-file mcp-figma transport tree into the hub, rewriting internal self-paths. figma keeps its no-Write/Edit transport surface and its mandatory sk-design pairing; both packets keep their own versions and changelogs."
trigger_phrases:
  - "foldin clickup and figma"
  - "mcp-click-up git mv"
  - "mcp-figma transport fold-in"
  - "figma transport-axis handling"
  - "phase 005 foldin-clickup-and-figma"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled fold-in docs to reflect the executed moves"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-clickup-and-figma"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "figma moves as the transport packet keeping its no-Write/Edit surface, version 1.0.0.0, and sk-design pairing"
      - "click-up moves as a workflow packet keeping version 1.0.0.0 and its changelog"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: foldin-clickup-and-figma

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-onboard-chrome-devtools |
| **Successor** | 006-advisor-and-integration |
| **Handoff Criteria** | The 154-file click-up workflow tree and the 40-file figma transport tree resolve under the hub; internal self-paths rewritten; figma keeps its no-Write/Edit surface and sk-design pairing; both packets keep their own versions and changelogs |
| **Execution Note** | `git status --short` recorded 153 click-up + 39 figma rename entries; `mode-registry.json`'s `mcp-figma` `toolSurface` still grants no `Write`/`Edit` (`mutatesWorkspace: false`) and the `transport-axis.crossHubPairing.mcp-figma: "sk-design"` pairing is intact |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Move the `mcp-click-up` and `mcp-figma` trees. This phase does the `git mv` for the second workflow packet and the transport packet, and rewrites their internal self-paths (absolute and relative, including any `../mcp-*` cross-skill form). It does not touch the advisor graph, `doctor_mcp_install.yaml`, README catalogs, or CLAUDE.md prose (those are phase 006), and it does not touch `mcp-code-mode`.

**Dependencies**:
- Phase 004 complete (chrome-devtools onboarded), so the move procedure is proven and the hub has one packet already resolving.

**Deliverables**:
- The 154-file `mcp-click-up` workflow tree relocated to `.opencode/skills/mcp-tooling/mcp-click-up/`, internal self-paths rewritten, `version: 1.0.0.0` and `changelog/` preserved.
- The 40-file `mcp-figma` transport tree relocated to `.opencode/skills/mcp-tooling/mcp-figma/`, internal self-paths rewritten, `version: 1.0.0.0` and `changelog/` preserved.
- figma's transport posture preserved: `allowed-tools` still grant no `Write`/`Edit` (`mutatesWorkspace:false`); its `depends_on sk-design` pairing content is intact for phase 006's graph union.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub has one workflow packet (chrome-devtools) but still needs its second workflow bridge (click-up) and its transport (figma). click-up is the largest tree (154 files) and figma carries the transport-axis handling — its no-Write/Edit surface and mandatory `sk-design` pairing must survive the move intact so phase 006 can union the graph identity correctly.

### Purpose
Relocate the click-up workflow packet and the figma transport packet under the hub with all internal self-paths corrected and figma's transport posture preserved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` the entire `.opencode/skills/mcp-click-up/` tree (154 tracked files) to `.opencode/skills/mcp-tooling/mcp-click-up/`.
- `git mv` the entire `.opencode/skills/mcp-figma/` tree (40 tracked files) to `.opencode/skills/mcp-tooling/mcp-figma/`.
- Rewrite internal absolute and relative self-paths inside both moved trees to their new nested locations.
- Preserve figma's transport `allowed-tools` (no `Write`/`Edit`, `mutatesWorkspace:false`) and its `sk-design` pairing content; preserve both packets' own versions and changelogs.

### Out of Scope
- Building the hub graph identity, deleting child `graph-metadata.json` files, or retargeting the advisor corpus - phase 006.
- Repointing `doctor_mcp_install.yaml`, README catalogs, or CLAUDE.md prose - phase 006.
- Any change to `mcp-code-mode` or the `code_mode` registration.
- The pre-existing click-up config/doc drift (SKILL.md documents an OAuth `mcp-remote` server while `.utcp_config.json` registers `clickup_official` via `@clickup/mcp-server`) - pre-existing, not caused by this move, deferred as a follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-click-up/*` (154 files) | Move | `git mv` to `.opencode/skills/mcp-tooling/mcp-click-up/*` |
| `.opencode/skills/mcp-figma/*` (40 files) | Move | `git mv` to `.opencode/skills/mcp-tooling/mcp-figma/*` |
| `mcp-tooling/mcp-click-up/**` + `mcp-tooling/mcp-figma/**` | Modify | Rewrite internal absolute and relative self-paths to the nested locations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both trees relocated under the hub | All 154 click-up files and 40 figma files resolve under the hub; `git` records renames |
| REQ-002 | Internal absolute and relative self-paths rewritten in both trees | Greps for the absolute (`.opencode/skills/mcp-click-up/`, `.opencode/skills/mcp-figma/`) AND relative (`../mcp-click-up`, `../mcp-figma`) forms inside the moved trees return zero live self-path hits (excluding historical changelog prose); additionally, each rewritten relative link (including figma's `../sk-design` pairing reference) is resolved from its containing file's directory and confirmed to exist on disk, not just grep-absent |
| REQ-003 | figma transport posture preserved | The moved figma packet's `allowed-tools` still grant no `Write`/`Edit`; `mutatesWorkspace:false`; its `sk-design` pairing content is intact |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Packet identities preserved | Both packets keep their own `version: 1.0.0.0` and their own `changelog/`; no external referrer is touched in this phase |
| REQ-005 | Pre-existing click-up drift documented, not fixed | The OAuth-vs-`@clickup/mcp-server` config/doc drift is noted as a deferred follow-up, not resolved in this move |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both packets resolve cleanly under the hub with corrected internal self-paths.
- **SC-002**: figma's transport surface and `sk-design` pairing survive the move unchanged.
- **SC-003**: No external referrer, advisor graph file, or `mcp-code-mode` file is modified in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 complete | High | Do not start until chrome-devtools is onboarded and the move procedure is proven |
| Risk | figma's transport surface is accidentally altered during the move | High | Move is a pure `git mv`; verify `allowed-tools` byte-unchanged after the move |
| Risk | A live internal self-path is missed in the 154-file click-up tree | Medium | Grep both moved trees for their old paths and rewrite every live hit |
| Risk | The pre-existing click-up config drift gets swept into this move | Medium | Explicitly scope it out as a deferred follow-up; do not touch the OAuth-vs-API-key mismatch here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved by phase 002: figma is the transport packet (no Write/Edit) with a cross-hub `sk-design` pairing; click-up is a workflow packet.
- Deferred: the pre-existing click-up OAuth-vs-`@clickup/mcp-server` config/doc drift is out of scope for this move and tracked as a follow-up.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
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
