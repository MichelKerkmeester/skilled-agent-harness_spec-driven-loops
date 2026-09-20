---
title: "Feature Specification: Phase 2 — Tool selection and scaffold: lock build-vs-adopt + scaffold the mcp-obsidian skeleton"
description: "Lock Phase 1's build-vs-adopt recommendation into one decision per surface (CLI, MCP), then scaffold the empty mcp-obsidian mode package skeleton mirroring mcp-click-up (no assets/, no mode-root advisor JSON)."
trigger_phrases:
  - "obsidian tool selection"
  - "mcp-obsidian scaffold"
  - "obsidian build vs adopt lock"
  - "mcp-obsidian phase 2"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/002-tool-selection-and-scaffold"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 2 tool-selection + scaffold spec"
    next_safe_action: "Read ../001-deep-research/research.md, then lock CLI + MCP build-vs-adopt decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-tool-selection-and-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Tool selection and scaffold: lock build-vs-adopt + scaffold the mcp-obsidian skeleton

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
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-cli-tool-integration, 004-mcp-server-integration |
| **Handoff Criteria** | Empty `mcp-obsidian` skeleton exists matching the mcp-click-up inventory (no `assets/`, no mode-root JSON), and both surface build-vs-adopt decisions are locked with a named candidate each, traceable to `research.md`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the `mcp-obsidian` mode build. It converts Phase 1's `research.md` recommendation into **locked** build-vs-adopt decisions — one per surface (CLI, MCP) — then scaffolds the empty `mcp-obsidian` mode package skeleton mirroring `mcp-click-up`. It is the **first phase that mutates shipped runtime**: it creates the new mode package tree under `.opencode/skills/mcp-tooling/`.

**Scope Boundary**: Reads `../001-deep-research/research.md`; records the locked decisions in this phase's docs; creates the empty package skeleton under `.opencode/skills/mcp-tooling/mcp-obsidian/`. It authors NO surface logic (CLI install lives in Phase 3; MCP wiring in Phase 4) and adds NO advisor metadata to the mode (that lives ONLY at the hub root).

**Dependencies**:
- Phase 1 `../001-deep-research/research.md` — a decided build-vs-adopt recommendation per surface with verified candidate identities.
- `sk-create-skill` doctrine — its `scripts/init_skill.py` plus skill/README templates — used to scaffold, then adjusted for a nested MODE packet.
- The `mcp-click-up` tree (`.opencode/skills/mcp-tooling/mcp-click-up/`) as the mirror reference for the file inventory.

**Deliverables**:
- Locked CLI and MCP build-vs-adopt decisions, each with a named candidate and rationale, traceable to `research.md`.
- The empty `mcp-obsidian` mode package skeleton matching the mcp-click-up inventory (minus `assets/` and mode-root JSON).
- Optional `decision-record.md` if a surface choice is architecturally heavy (triggers a Level-2/3 bump).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 1 produced a recommendation, but nothing is committed: there is no locked build-vs-adopt choice per surface and no package to build into. Starting phases 3/4 without a locked decision and an agreed skeleton risks divergent surfaces, re-litigating the research, and — as `mcp-click-up` learned — reaching for a package identity that was never verified.

### Purpose
Lock exactly one build-vs-adopt decision per surface (CLI, MCP), traceable to `research.md`, and scaffold the empty `mcp-obsidian` mode package skeleton mirroring `mcp-click-up`, so phases 3 and 4 fill surfaces against a fixed, sibling-consistent layout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `../001-deep-research/research.md` and record the CLI-surface build-vs-adopt decision and the MCP-surface build-vs-adopt decision, each with a named candidate and rationale.
- Scaffold the empty `mcp-obsidian` mode package skeleton at `.opencode/skills/mcp-tooling/mcp-obsidian/`, mirroring the `mcp-click-up` file inventory.
- Choose the scaffolder path — `sk-create-skill`'s `scripts/init_skill.py` + skill/README templates, or a manual mirror of the `mcp-click-up` tree — and justify it.

#### Skeleton inventory (must mirror mcp-click-up)

| Entry | Type | Notes |
|-------|------|-------|
| `SKILL.md`, `README.md`, `INSTALL-GUIDE.md` | Files | Placeholder docs authored in later phases |
| `mcp-servers/obsidian-cli/`, `mcp-servers/obsidian-mcp/` | Dirs | CLI surface → Phase 3; MCP surface → Phase 4 |
| `references/`, `scripts/`, `examples/` | Dirs | Empty subtrees for later phases |
| `feature-catalog/`, `manual-testing-playbook/`, `changelog/` | Dirs | Empty subtrees for later phases |
| `assets/` | — | **Excluded** — not present in the mirror |
| mode-root `description.json` / `graph-metadata.json` | — | **Excluded** — advisor metadata lives ONLY at the hub root |

### Out of Scope
- Authoring surface logic (CLI install → Phase 3; MCP wiring → Phase 4) - this phase only creates empty/placeholder structure.
- An `assets/` directory and any mode-root `description.json`/`graph-metadata.json` - advisor metadata lives ONLY at the hub root, never in a mode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/` | Create | New mode package root skeleton |
| `.../mcp-obsidian/{SKILL.md,README.md,INSTALL-GUIDE.md}` | Create | Placeholder docs mirroring mcp-click-up |
| `.../mcp-obsidian/mcp-servers/{obsidian-cli,obsidian-mcp}/` | Create | Empty surface dirs for phases 3/4 |
| `.../mcp-obsidian/{references,scripts,examples,feature-catalog,manual-testing-playbook,changelog}/` | Create | Empty skeleton subtrees mirroring mcp-click-up |
| `002-tool-selection-and-scaffold/decision-record.md` | Create (optional) | Only if a surface decision is architecturally heavy (Level-2/3 bump) |
| `002-tool-selection-and-scaffold/implementation-summary.md` | Modify | Filled on phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lock the CLI build-vs-adopt decision, traceable to `research.md`, with a named candidate | `spec.md` records adopt-or-build for the CLI surface, names the candidate, and cites the `research.md` finding |
| REQ-002 | Lock the MCP build-vs-adopt decision, traceable to `research.md`, with a named candidate | `spec.md` records adopt-or-build for the MCP surface, names the candidate, and cites the `research.md` finding |
| REQ-003 | Scaffold the `mcp-obsidian` package skeleton mirroring the mcp-click-up inventory | Skeleton exists with every mirrored entry present, NO `assets/` dir, and NO mode-root `description.json`/`graph-metadata.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Record the rationale for each surface decision | Each decision carries a one-paragraph rationale; a `decision-record.md` is added (Level-2/3 bump) when a choice is architecturally heavy |
| REQ-005 | Choose the scaffolder path (sk-create-skill vs manual mirror) and justify it | Chosen path recorded with justification; mode-illegal artifacts that `init_skill.py` would add are noted for removal |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `mcp-obsidian` skeleton exists matching the mcp-click-up inventory (SKILL.md, README.md, INSTALL-GUIDE.md, `mcp-servers/{obsidian-cli,obsidian-mcp}/`, references/, scripts/, examples/, feature-catalog/, manual-testing-playbook/, changelog/) with NO `assets/` and NO mode-root JSON.
- **SC-002**: Both surface decisions (CLI, MCP) are recorded with a named candidate each, traceable to `research.md`.
- **SC-003**: The scaffolder path is chosen and justified; if a decision is architecturally heavy, a `decision-record.md` is added and this phase is bumped to Level 2/3.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 `research.md` | No locked decision → cannot scaffold with intent | Require a decided recommendation; if research is inconclusive, escalate rather than guess |
| Risk | `sk-create-skill` scaffolds standalone skills, but this is a nested MODE packet | Wrong layout (mode-root JSON / `assets/` added) | Confirm the mode-packet layout before scaffolding; strip advisor metadata + `assets/` that `init_skill.py` would emit |
| Risk | A surface decision is architecturally heavy | Level-1 doc too thin to hold the rationale | Add `decision-record.md` and bump this phase to Level 2/3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `research.md` decide adopt-or-build cleanly for BOTH surfaces, or is one still open? (If open, escalate before scaffolding.)
- Is either decision heavy enough to warrant a `decision-record.md` and a Level-2/3 bump?
- Do we scaffold via `sk-create-skill`'s `init_skill.py` (then strip mode-illegal artifacts) or mirror `mcp-click-up` by hand?
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
