---
title: "Feature Specification: Phase 5 — Skill authoring: the mcp-obsidian routing contract + human docs"
description: "Author the mcp-obsidian mode's SKILL.md CLI↔MCP routing contract plus README, INSTALL-GUIDE, changelog, and a references index using sk-create-skill templates and mirroring mcp-click-up, avoiding the dangling references/INSTALL-GUIDE.md staleness trap."
trigger_phrases:
  - "obsidian skill authoring"
  - "mcp-obsidian skill md"
  - "obsidian routing contract"
  - "mcp-obsidian phase 5"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/005-skill-authoring"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 5 skill-authoring spec (SKILL.md router + README + INSTALL-GUIDE)"
    next_safe_action: "Read sk-create-skill templates + mcp-click-up SKILL.md, then draft the CLI↔MCP router"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-skill-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: skill-authoring

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
| **Phase** | 5 of 8 |
| **Predecessor** | 003-cli-tool-integration + 004-mcp-server-integration |
| **Successor** | 006-feature-catalog-and-playbook |
| **Handoff Criteria** | `SKILL.md` (CLI↔MCP router with INTENT_SIGNALS/RESOURCE_MAP, no `parent:` key) + `README.md` (9 sections) + `INSTALL-GUIDE.md` (0–7 + AI-FIRST block, at mode root) + `changelog/v1.0.0.0.md` + `references/` index authored; `validate.sh` passes; every RESOURCE_MAP path and SKILL.md §8 reference resolves on disk with no dangling refs. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the `mcp-obsidian` mode build — it authors the mode's **routing contract and human-facing docs**, the analog of `mcp-click-up`'s SKILL.md + README + INSTALL-GUIDE. It depends on **both** Phase 3 (the CLI surface + `references/<cli>-commands.md`) and Phase 4 (the MCP surface + `references/mcp-tools.md`), because SKILL.md §2 arbitrates *between* those two surfaces and its RESOURCE_MAP points at their references.

**Scope Boundary**: Author mode-local documentation only, using `sk-create-skill` templates. This phase touches **no** shared runtime, shared policy, or hub routing files — hub registration and advisor wiring are Phase 7. It does not build servers (Phases 3/4) and does not author the feature catalog or playbook (Phase 6).

**Dependencies**:
- Phase 3 CLI reference (`references/<cli>-commands.md`) and Phase 4 MCP reference (`references/mcp-tools.md`) — the RESOURCE_MAP targets.
- `sk-create-skill` templates: `assets/skill/skill-md-template.md`, `skill-readme-template.md`, and siblings.
- `mcp-click-up`'s SKILL.md / README / INSTALL-GUIDE as the structural mirror.

**Deliverables**:
- `SKILL.md` — frontmatter (`name`, `description`, `allowed-tools`, `version`; NO `parent:` key), a `<!-- keywords: ... -->` comment, an Obsidian note/frontmatter domain-format contract block, and numbered sections 1–8.
- `README.md` — 9 sections. `INSTALL-GUIDE.md` — sections 0–7 + an AI-FIRST INSTALL GUIDE prompt block at top, at the mode root.
- `changelog/v1.0.0.0.md` and a `references/` index.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phases 3 and 4 the CLI and MCP surfaces exist, but nothing tells an agent or human *when* to use the CLI versus the MCP, how to install the mode, or how to reach its references. The reference build (`mcp-click-up`) also left a staleness trap worth not repeating: its SKILL.md references a `references/INSTALL-GUIDE.md` that does not exist (the real guide lives at the mode root), a dangling reference.

### Purpose
Author the mode's routing contract (`SKILL.md` with a working CLI↔MCP smart router) plus the human docs (README, INSTALL-GUIDE, changelog, references index) using `sk-create-skill` templates, so the mode is usable, installable, and self-consistent — with every reference resolving and no dangling links.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `SKILL.md`: frontmatter (`name`, `description`, `allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]`, `version`; **no** `parent:` key), a `<!-- keywords: ... -->` comment, a top Obsidian note/frontmatter domain-format contract block, and numbered sections `1 WHEN TO USE`, `2 SMART ROUTING` (INTENT_SIGNALS/RESOURCE_MAP pseudocode + Resource Loading Levels), `3 HOW IT WORKS` (CLI-vs-MCP table + inline `.utcp_config.json` block + both step paths), `4 RULES` (ALWAYS/NEVER/ESCALATE), `5 SUCCESS CRITERIA`, `6 INTEGRATION POINTS`, `7 QUICK REFERENCE`, `8 REFERENCES`.
- `README.md`: the 9 sections (AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS).
- `INSTALL-GUIDE.md` at the mode root: sections 0–7 + an AI-FIRST INSTALL GUIDE copy-paste prompt block at top.
- `changelog/v1.0.0.0.md` and a `references/` index, cross-linked with no dangling refs.

### Out of Scope
- `feature-catalog/` + `manual-testing-playbook/` — Phase 6.
- Hub registration (mode-registry / hub-router / advisor / leaf-manifest / smart-routing) — Phase 7.
- Building the CLI/MCP surfaces — Phases 3/4.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Create | CLI↔MCP routing contract (no `parent:` key) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | Create | 9-section README |
| `.opencode/skills/mcp-tooling/mcp-obsidian/INSTALL-GUIDE.md` | Create | Sections 0–7 + AI-FIRST block, at mode root |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v1.0.0.0.md` | Create | Initial-version changelog |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/*` | Create | References index (cross-links `<cli>-commands.md` + `mcp-tools.md`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author `SKILL.md` with a working CLI↔MCP smart router: frontmatter (`name`, `description`, `allowed-tools`, `version`; NO `parent:` key), a `<!-- keywords: ... -->` comment, an Obsidian note/frontmatter domain-format contract block, and numbered sections 1–8 including §2 SMART ROUTING with INTENT_SIGNALS/RESOURCE_MAP pseudocode + Resource Loading Levels | SKILL.md present; §2 router selects CLI vs MCP by intent; no `parent:` key; `allowed-tools` matches the required set |
| REQ-002 | Author `README.md` with the 9 sections (AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS) | All 9 section headings present and in order |
| REQ-003 | Author `INSTALL-GUIDE.md` at the mode root with sections 0–7 plus an AI-FIRST INSTALL GUIDE copy-paste prompt block at the top | File at mode root (not `references/`); §0 AI-FIRST block + sections 1–7 present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Author `changelog/v1.0.0.0.md` for the initial mode version | File present and versioned `v1.0.0.0` |
| REQ-005 | Author the `references/` index and cross-link SKILL.md §8 with NO dangling references — do NOT create `references/INSTALL-GUIDE.md` then dangling-ref it (the clickup trap) | Every referenced path resolves on disk; no reference to a missing file; INSTALL-GUIDE referenced at its mode-root path |
| REQ-006 | Every RESOURCE_MAP path in SKILL.md §2 resolves on disk | Each path named in RESOURCE_MAP exists (`<cli>-commands.md`, `mcp-tools.md`, etc.) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh` on the package docs passes.
- **SC-002**: SKILL.md §2 router arbitrates CLI vs MCP via INTENT_SIGNALS, and every RESOURCE_MAP path resolves on disk.
- **SC-003**: No dangling references anywhere — INSTALL-GUIDE.md lives at the mode root and is referenced there; the clickup `references/INSTALL-GUIDE.md` staleness trap is avoided.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dangling `references/INSTALL-GUIDE.md` (the clickup staleness trap) | Med | Keep INSTALL-GUIDE.md at the mode root; reference it there; grep every SKILL.md §8 link resolves |
| Risk | Adding a `parent:` key to SKILL.md frontmatter | Med | Mode membership is declared in the hub registry (Phase 7), not in SKILL.md; omit `parent:` |
| Dependency | Phase 3 CLI + Phase 4 MCP references | The router has nothing to point at | Author after both land; RESOURCE_MAP targets `<cli>-commands.md` + `mcp-tools.md` |
| Dependency | `sk-create-skill` templates | Structural drift from house style | Copy `skill-md-template.md` / `skill-readme-template.md` shapes; mirror mcp-click-up |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which Obsidian note/frontmatter conventions belong in the domain-format contract block (YAML frontmatter, wikilinks `[[...]]`, tags, callouts)?
- In the §2 router, which surface owns note-search vs note-create vs note-update — settled from the Phase 3/4 capability surfaces?
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
