---
title: "Feature Specification: Phase 6: advisor-and-integration"
description: "Author the union hub graph-metadata.json and delete the three child graph files; retarget the advisor routing corpus; repoint doctor_mcp_install.yaml (and fix its stale mcp-open-design entry); update README catalogs; and restate the CLAUDE.md/AGENTS.md figma-transport prose."
trigger_phrases:
  - "mcp-tooling advisor integration"
  - "hub graph-metadata union"
  - "referrer sweep repoint"
  - "labeled-prompts retarget"
  - "phase 006 advisor-and-integration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled integration docs; 2 P1 items stay deferred"
    next_safe_action: "Rebuild advisor skill-graph DB when scheduled"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "doctor_mcp_debug.yaml and mcp-doctor.sh carry no bridge skill_dir refs; only doctor_mcp_install.yaml does"
      - "3 labeled-prompts rows target mcp-chrome-devtools and retarget to mcp-tooling; 0 rows for click-up or figma"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: advisor-and-integration

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
| **Phase** | 6 of 8 |
| **Predecessor** | 005-foldin-clickup-and-figma |
| **Successor** | 007-routing-benchmark-and-review |
| **Handoff Criteria** | One hub `graph-metadata.json` exists (union of the three bridges); the three child graph files are deleted; the functional referrer sweep is complete; a grep for the old skill-folder paths returns zero live hits outside historical spec/changelog text |
| **Execution Note** | REQ-001 and REQ-002 (P0) fully met. REQ-003 (P0) partially met: labeled-prompts retargeted, advisor skill-graph DB rebuild deferred (operator-gated reindex). REQ-004 (P1) partially met: README catalogs done, CLAUDE.md/AGENTS.md prose restatement deferred (operator decision, repo-wide). Both deferrals are operator-approved, not silently dropped — see `implementation-summary.md` Known Limitations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Advisor graph identity and external-referrer integration. This phase authors the hub graph identity, deletes the three child graph files, and repoints every live functional/documentation referrer discovered in phase 001. It does not move packet content (done in phases 004-005) and does not touch `mcp-code-mode`'s live server or the `code_mode` registration — the one exception is the ADR-005 scoped carve-out permitting a metadata-only reverse-edge repoint in `mcp-code-mode/graph-metadata.json` (see §3 Out of Scope and REQ-001 below).

**Dependencies**:
- Phases 004-005 complete: all three bridge trees resolve under the hub with corrected internal self-paths.

**Deliverables**:
- One hub `.opencode/skills/mcp-tooling/graph-metadata.json` unioning the three bridges' `intent_signals`/`trigger_phrases` and OUTWARD edges (figma `depends_on sk-design`, the union of `enhances sk-code`), recording the `mcp-code-mode` dependency as an external cross-skill link.
- Deletion of the three children's `graph-metadata.json` files.
- Repointed inbound/reverse edges in `mcp-code-mode/graph-metadata.json` and `sk-design/graph-metadata.json` (from the bridge ids to `mcp-tooling`), landed atomically with the deletion and hub-identity authoring so the advisor is never rebuilt mid-window.
- Repointed `doctor_mcp_install.yaml` `skill_dir`/`install_guide` refs for the three bridges, plus the stale `mcp-open-design` entry corrected in passing.
- Retargeted advisor routing corpus (3 `labeled-prompts.jsonl` rows `mcp-chrome-devtools` to `mcp-tooling`).
- Updated `.opencode/skills/README.md` and root `README.md` catalog rows/links.
- Restated CLAUDE.md/AGENTS.md figma-transport prose (figma is now `mcp-tooling`'s transport, still cross-hub-paired to `sk-design`).
- Advisor skill-graph DB rebuild so `mcp-tooling` and its packet names are re-keyed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phases 004-005 the content lives under the hub, but the advisor still sees three graph identities and every external referrer still points at the old flat skill-folder paths. Until the graph identity is unified and the functional referrers are repointed, the advisor cannot route to `mcp-tooling` and the `/doctor:mcp` install/debug paths break.

### Purpose
Give the hub one advisor identity and repoint every live functional and documentation referrer so the fold-in is functionally complete before the phase 007 benchmark.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the union hub `graph-metadata.json` and delete the three child graph files.
- Repoint the INBOUND/reverse graph edges that point AT the deleted child identities so they do not dangle: `mcp-code-mode/graph-metadata.json` (`prerequisite_for` for all three bridges, `manual.related_to`) and `sk-design/graph-metadata.json` (`siblings`, `prerequisite_for`, `manual.related_to` for mcp-figma), all repointed to `mcp-tooling`. Editing `mcp-code-mode`'s graph-metadata edges is a metadata edit, not a server relocation, so it is in-bounds despite ADR-005's exclusion (see ADR-005's scoped carve-out).
- The child-identity deletion, the hub-identity authoring, the reverse-edge repoints, and the advisor skill-graph rebuild land as ONE atomic change: the advisor skill-graph is NOT rebuilt in the window between deleting the child identities and authoring the hub identity, or the advisor would transiently lose all three bridges.
- Repoint `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` `skill_dir`/`install_guide` refs for the three bridges to the nested `mcp-tooling/mcp-<x>/` paths; fix the pre-existing stale `mcp-open-design` entry in passing.
- Retarget the 3 `labeled-prompts.jsonl` rows from `mcp-chrome-devtools` to `mcp-tooling`.
- Update `.opencode/skills/README.md` and root `README.md` catalog rows/links.
- Restate the CLAUDE.md/AGENTS.md figma "external sibling Figma transport" framing to "mcp-tooling's transport, cross-hub-paired to sk-design".
- Rebuild the advisor skill-graph DB.

### Out of Scope
- Moving packet content - phases 004-005.
- Any change to `mcp-code-mode`'s live MCP server or the `code_mode` registration key (`opencode.json` / `.claude/mcp.json` are untouched; the `mcp__code_mode__*` tool ids are unchanged). The one exception is metadata: `mcp-code-mode`'s `graph-metadata.json` reverse edges are repointed (in scope above).
- Any change to the name-keyed `.utcp_config.json` manuals (`chrome_devtools_1/2`, `clickup_official`, `figma`) - they are not path-keyed and survive the move.
- `doctor_mcp_debug.yaml` and `mcp-doctor.sh` - planning-time analysis found no bridge `skill_dir` refs in them (phase 001 re-verifies this at execution), so they need no repoint.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Create | Union hub graph identity |
| `mcp-tooling/{mcp-chrome-devtools,mcp-click-up,mcp-figma}/graph-metadata.json` | Delete | Dissolve the three child graph identities |
| `.opencode/skills/mcp-code-mode/graph-metadata.json` + `.opencode/skills/sk-design/graph-metadata.json` | Modify | Repoint inbound/reverse edges from the bridge ids to `mcp-tooling` (metadata-only; no server or registration change) |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Modify | Repoint 3 bridge `skill_dir`/`install_guide` refs; fix stale `mcp-open-design` entry |
| `.opencode/skills/system-skill-advisor/.../routing-accuracy/labeled-prompts.jsonl` | Modify | Retarget 3 rows to `mcp-tooling` |
| `.opencode/skills/README.md` + `README.md` | Modify | Catalog rows/links for the three bridges |
| `CLAUDE.md` + `AGENTS.md` | Modify | Restate the figma-transport prose |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One hub graph identity exists; three child graph files deleted; reverse edges repointed | `mcp-tooling/graph-metadata.json` unions intent signals, trigger phrases, and outward edges (figma to sk-design, union enhances to sk-code); the three child files are gone; the `mcp-code-mode` dependency is recorded as an external cross-skill link; the inbound/reverse edges in `mcp-code-mode` and `sk-design` graph metadata are repointed to `mcp-tooling` with no dangling edge to a deleted identity |
| REQ-002 | Functional path referrers repointed | `doctor_mcp_install.yaml` refs for the three bridges resolve to the nested paths; the stale `mcp-open-design` entry is corrected; a grep for the old flat skill-folder paths returns zero live hits outside historical spec/changelog text |
| REQ-003 | Advisor routing corpus retargeted | The 3 `labeled-prompts.jsonl` rows target `mcp-tooling`; the advisor skill-graph DB is rebuilt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Documentation catalogs and prose updated | `.opencode/skills/README.md`, root `README.md`, CLAUDE.md, and AGENTS.md reference the hub and restate the figma-transport framing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor routes tooling queries to the single `mcp-tooling` identity; the three child graph files are gone.
- **SC-002**: A repo-wide grep for the old flat skill-folder paths returns zero live functional hits (historical spec/changelog text excepted).
- **SC-003**: `mcp-code-mode`, the `code_mode` registration, and the name-keyed `.utcp_config.json` manuals are untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 004-005 complete | High | Do not sweep until all three trees resolve under the hub |
| Risk | A useful outward edge is dropped during the graph union | Medium | Union against the three source graph files inventoried at planning time and re-verified when phase 001 executes; preserve figma to sk-design and the enhances to sk-code edges explicitly |
| Risk | A reverse/inbound edge in another skill's graph file is left dangling after child deletion | High | Repoint the `mcp-code-mode` and `sk-design` reverse edges in the same atomic change; grep for the old bridge ids in all `graph-metadata.json` files returns zero after the sweep |
| Risk | The advisor skill-graph is rebuilt mid-window and transiently loses all three bridges | Medium | Deletion, hub-identity authoring, reverse-edge repoints, and the rebuild land as ONE atomic change; never rebuild between dissolution and hub-identity authoring |
| Risk | A functional referrer is missed and fails silently | High | Re-run the grep sweep as an explicit gate; require zero live hits before phase 007 |
| Risk | Historical spec/changelog prose is blindly rewritten | Low | Repoint only LIVE functional/routing references; leave historical narrative intact with a clarifying note if needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved by phase 002 (ADR-004): the graph union preserves the outward edges and records code-mode as an external cross-skill dependency.
- None open; the referrer set was inventoried in phase 001 and the code-mode/utcp boundaries are confirmed safe.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
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
