---
title: "Feature Specification: Phase 9 — Community plugin support (flat-financing / tables / BRAT) for file-layer operation"
description: "Author references + assets + workflows so the mcp-obsidian AI can operate three community plugins at the vault file layer: obsidian-flat-financing (Beancount), obsidian-tables (.table.md JSON), and obsidian42-BRAT (beta-plugin installer)."
trigger_phrases:
  - "obsidian community plugins"
  - "obsidian beancount flat-financing"
  - "obsidian tables table.md"
  - "obsidian brat beta plugin"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/009-community-plugin-support"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 9 spec: file-layer knowledge for 3 community plugins"
    next_safe_action: "Author references/ (4 docs) + assets/ (examples + workflows)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-community-plugin-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9 — Community plugin support (flat-financing / tables / BRAT) for file-layer operation

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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-verification-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | `references/` (4 docs) + `assets/` (examples + workflows) authored and validated; each plugin's data model documented with a working example; Phase 5 (skill-authoring) folds these into `mcp-obsidian/references/`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** — an **additive knowledge layer** for the `mcp-obsidian` mode. It is independent of the closeout gate and runnable any time after Phase 1; it does not touch shipped runtime. Its outputs are `references/` + `assets/` that **Phase 5 (skill-authoring) folds into the shipped skill's `references/`**.

**Scope Boundary**: Author accurate, file-layer knowledge for three named community plugins. This phase does NOT build, fork, or install the plugins, and does NOT drive their in-app UIs. It documents how an AI operating the vault via the `mcp-obsidian` CLI/MCP surfaces manipulates the *underlying data files* each plugin reads/writes.

**Dependencies**:
- The `mcp-obsidian` mode's file-layer access (Phases 3/4) — CRUD over vault files via CLI/MCP.
- The three plugin sources (verified): `pranjulsingh/obsidian-flat-financing`, `aztekgold/obsidian-tables`, `TfTHacker/obsidian42-brat` (id `obsidian42-brat`, v2.2.0).

**Deliverables**:
- `references/flat-financing.md`, `references/obsidian-tables.md`, `references/obsidian42-brat.md`, `references/plugin-operation-logic.md`.
- `assets/beancount-example.beancount`, `assets/table-example.table.md`, `assets/brat-data-entry.example.json`, `assets/workflows.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-obsidian` mode operates a vault at the **file layer** (read/write/search markdown and data files via CLI/MCP), but it has no knowledge of how specific community plugins encode their data. Without that, the AI cannot leverage those plugins' features — it can't add a Beancount transaction the flat-financing dashboard will render, edit an obsidian-tables `.table.md` JSON row, or install a beta plugin via BRAT.

### Purpose
Give the mode accurate, actionable knowledge — data models, file conventions, commands, and end-to-end workflows — so it can operate `obsidian-flat-financing`, `obsidian-tables`, and `obsidian42-BRAT` purely through vault file operations, without needing the plugin UIs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-plugin reference for each of the three plugins (what it does, data model, file conventions, commands, settings, verified repo identity).
- A `plugin-operation-logic.md` reference that captures the connective logic: an AI with file access manipulates the *underlying data* each plugin reads (Beancount ledger, `.table.md` JSON, BRAT's plugin folder + `data.json`), not the in-app UI.
- Assets: a minimal working example per plugin + a `workflows.md` with step-by-step file-layer procedures (install-via-BRAT, add a transaction, create/query a table).

### Out of Scope
- Building, forking, or modifying any of the plugins — this is documentation only.
- Driving the plugins' in-app UI / command palette programmatically (the mode has no UI bridge; it operates files).
- Plugins beyond these three — but the `plugin-operation-logic.md` pattern is written to generalize.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `009-community-plugin-support/references/flat-financing.md` | Create | Beancount finance plugin knowledge + file-layer ops |
| `009-community-plugin-support/references/obsidian-tables.md` | Create | `.table.md` JSON tables knowledge + file-layer ops |
| `009-community-plugin-support/references/obsidian42-brat.md` | Create | BRAT installer knowledge + install workflow |
| `009-community-plugin-support/references/plugin-operation-logic.md` | Create | The connective file-layer operation logic (generalizable) |
| `009-community-plugin-support/assets/*` | Create | Per-plugin examples + `workflows.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A per-plugin reference for all three, each documenting the data model + file conventions + commands + **verified** repo identity | 3 reference docs exist; each names the verified repo id/author and the exact on-disk file(s) it operates |
| REQ-002 | A `plugin-operation-logic.md` capturing how a file-layer CLI/MCP AI operates each plugin's data WITHOUT the UI | Doc maps each plugin → the file(s) to edit → the operation, and states the "edit the data the plugin reads, not the UI" principle |
| REQ-003 | Every load-bearing claim is grounded (fetched README / official page) or explicitly marked `VERIFY` when unconfirmed | No unmarked guesses; uncertain schemas (BRAT `data.json` keys, tables JSON) flagged `VERIFY at runtime` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A minimal, valid working example asset per plugin | `beancount-example.beancount`, `table-example.table.md`, `brat-data-entry.example.json` present |
| REQ-005 | A `workflows.md` with executable file-layer procedures | Covers install-via-BRAT, add-a-transaction, create/query-a-table — each as CLI/MCP file steps |
| REQ-006 | Phase 5 handoff noted so the skill folds `references/` in | Reference docs carry a note: destined for `mcp-obsidian/references/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 4 references + 4 assets authored; `validate.sh` on this phase passes.
- **SC-002**: Each plugin's data format is documented with a minimal working example an AI could produce via file writes.
- **SC-003**: `workflows.md` procedures are expressed as concrete `mcp-obsidian` CLI/MCP file operations, not UI clicks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Plugin READMEs (flat-financing, tables are new/beta) | Sparse public schema | Document what's confirmed; mark exact schemas `VERIFY at runtime` against a real vault |
| Risk | obsidian-tables `.table.md` JSON schema not fully public | Example may drift from real file | Provide a labelled representative skeleton; verify against a generated `.table.md` in Phase 8 smoke |
| Risk | BRAT `data.json` key names unconfirmed | Install-via-file may need adjustment | Prefer the BRAT command path; document the file path + shape as `VERIFY` |
| Risk | Editing `.beancount` while the dashboard is open | Possible stale render | Note: plugin re-reads the file; safe to append entries, reload dashboard after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact BRAT `data.json` schema under `.obsidian/plugins/obsidian42-brat/` (key names for the beta-plugin list + frozen versions) — VERIFY against installed v2.2.0.
- Exact obsidian-tables `.table.md` JSON schema (columns/rows/views/formulas keys) — VERIFY against a real generated table.
- Is direct `.beancount` append fully safe while the flat-financing dashboard is open, or does it require a reload?
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
