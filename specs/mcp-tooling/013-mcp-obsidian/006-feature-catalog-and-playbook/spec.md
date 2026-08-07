---
title: "Feature Specification: Phase 6 — Feature catalog + manual-testing playbook for the mcp-obsidian mode"
description: "Author two documentation packages for the mcp-obsidian mode — a feature-catalog/ inventory of CURRENT shipped CLI + MCP behavior and a manual-testing-playbook/ of reproducible scenarios — mirroring the mcp-click-up split."
trigger_phrases:
  - "obsidian feature catalog"
  - "obsidian testing playbook"
  - "mcp-obsidian phase 6"
  - "obsidian catalog and playbook"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/006-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 6 catalog + playbook spec (package shapes + validators)"
    next_safe_action: "Read the two sk-create doctrines, then draft the catalog root inventory"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-feature-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6 — Feature catalog + manual-testing playbook for the mcp-obsidian mode

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
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-skill-authoring |
| **Successor** | 007-hub-registration-and-advisor |
| **Handoff Criteria** | Both `feature-catalog/` and `manual-testing-playbook/` authored and validating: `check_no_hyphenated_catalog_content.py` + `validate_document.py` pass on the catalog, the playbook validates, feature IDs are stable, and the two packages cross-reference each other. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the `mcp-obsidian` mode build. Phase 5 authored the package's routing contract (SKILL.md, README, INSTALL-GUIDE, references, examples). This phase adds the two documentation packages that describe the mode's shipped surface: a **feature catalog** (the single inventory of what the CLI + MCP tools actually do) and a **manual-testing playbook** (reproducible, benchmark-tierable verification scenarios). It mirrors the `mcp-click-up` split exactly.

**Scope Boundary**: Documentation authoring only, contained inside the mode's own package (`mcp-obsidian/feature-catalog/**` and `mcp-obsidian/manual-testing-playbook/**`). This phase does NOT touch hub routing, the skill-advisor, `.utcp_config.json`, or repo docs — that is Phase 7. It documents **CURRENT** behavior, not roadmap.

**Dependencies**:
- `sk-create-feature-catalog` doctrine (feature-catalog package shape: root inventory, kebab-case category subdirs, per-feature cards with an implementation-source table, a validation/test-anchor table, a `## 4. SOURCE METADATA` block, and >=3 `trigger_phrases`).
- `sk-create-manual-testing-playbook` doctrine (playbook shape: root `manual-testing-playbook.md` with EXECUTION POLICY + waves + scenario tables, scenario subdirs, the 9-field SCENARIO CONTRACT, stable IDs, and per-feature `stage:` frontmatter).
- The feature surface decided in Phase 1 `research.md` and locked by Phases 003 (CLI) and 004 (MCP) — the catalog can only inventory what those phases actually shipped.
- `mcp-click-up/{feature-catalog,manual-testing-playbook}/` as the structural template to copy.

**Deliverables**:
- `mcp-obsidian/feature-catalog/` — root inventory + category subdirs + one card per feature (CLI + MCP surfaces).
- `mcp-obsidian/manual-testing-playbook/` — root policy doc + scenario subdirs with the 9-field contract and stable IDs.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 5 the `mcp-obsidian` mode has a routing contract but no single inventory of what its CLI + MCP tools actually do, and no reproducible way to verify them. Without a feature catalog there is no source of truth for "what ships today"; without a manual-testing playbook there is no benchmark-tierable verification and no stable feature IDs for the closeout phase to test against.

### Purpose
Author two mirrored documentation packages — a `feature-catalog/` inventorying CURRENT shipped CLI + MCP behavior and a `manual-testing-playbook/` of reproducible scenarios with stable IDs — so Phase 7 can register a fully documented mode and Phase 8 can verify it against a fixed contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Feature catalog** via `sk-create-feature-catalog`: root `feature-catalog.md` inventory + kebab-case category subdirs + one per-feature file each carrying an implementation-source table (File | Layer | Role), a validation/test-anchor table, a `## 4. SOURCE METADATA` block, and >=3 `trigger_phrases` matching the root H3.
- **Category taxonomy** split like `mcp-click-up`: `<cli-prefix>-*` category dirs for CLI features vs `mcp-high-priority` / `mcp-medium-priority` / `mcp-low-priority` for MCP tool cards. Candidate Obsidian categories: note-crud, search, links-backlinks, daily-notes, tags, frontmatter, templates — FINAL taxonomy comes from the tool's real feature set (Phase 1 research + Phases 003/004).
- **Manual-testing playbook** via `sk-create-manual-testing-playbook`: root `manual-testing-playbook.md` (EXECUTION POLICY, waves, scenario tables) + scenario subdirs; per scenario the 9-field SCENARIO CONTRACT (Feature ID, Feature Name, Scenario Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage); stable `{PREFIX}-{NNN}` IDs (`OBS-###` for CLI, `MCP-H###`/`MCP-M###` for MCP); per-feature `stage:` frontmatter (routing/holdout/negative) for benchmark tiering.
- Cross-references between the catalog and the playbook (each points at the other).

### Out of Scope
- A `snippets/` subtree - not part of this package shape.
- A packet-local `graph-metadata.json` inside either package - advisor/graph metadata lives at the hub root and is handled in Phase 7.
- Hub registration, advisor, `.utcp_config.json`, repo README - all Phase 7.
- Any new runtime or tool code - this phase only documents what Phases 003/004 shipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/feature-catalog.md` | Create | Root inventory of CLI + MCP features |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/<category>/*.md` | Create | Per-feature cards (impl-source table, test-anchor table, SOURCE METADATA, trigger_phrases) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Create | Root EXECUTION POLICY + waves + scenario tables |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/<scenario>/*.md` | Create | Per-scenario 9-field SCENARIO CONTRACT with stable IDs + stage frontmatter |
| `.../006-feature-catalog-and-playbook/implementation-summary.md` | Modify | Filled on phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author the `feature-catalog/` covering both the CLI and MCP surfaces, per `sk-create-feature-catalog` doctrine | Root inventory + category subdirs + per-feature cards exist; `check_no_hyphenated_catalog_content.py` and `validate_document.py` pass on the package |
| REQ-002 | Author the `manual-testing-playbook/` with the 9-field SCENARIO CONTRACT, stable IDs, and per-feature `stage:` frontmatter, per `sk-create-manual-testing-playbook` doctrine | Root policy doc + scenario subdirs exist; every scenario has all 9 contract fields and a stable ID; the package validates |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The catalog and playbook cross-reference each other | Catalog root links to the playbook; playbook root links to the catalog; links resolve on disk |
| REQ-004 | Feature IDs are stable and the taxonomy mirrors the clickup split | CLI features use `OBS-###`, MCP tools use `MCP-H###`/`MCP-M###`; CLI categories use the `<cli-prefix>-*` form, MCP cards use `mcp-{high,medium,low}-priority` |
| REQ-005 | Content documents CURRENT shipped behavior sourced from research + Phases 003/004 | Each card/scenario maps to a real shipped feature; no roadmap/aspirational entries |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both packages validate — `check_no_hyphenated_catalog_content.py` + `validate_document.py` pass on the catalog and the playbook validates.
- **SC-002**: Feature IDs are stable and the catalog covers both the CLI and MCP surfaces.
- **SC-003**: Catalog <-> playbook cross-references resolve, and every card/scenario reflects a shipped feature (not roadmap).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-create-feature-catalog` / `sk-create-manual-testing-playbook` doctrine | Wrong shape → validators fail | Read both doctrines first; copy the `mcp-click-up` package as the structural template |
| Dependency | Phase 1 research + Phases 003/004 shipped surface | Catalog inaccurate if the feature set is unsettled | Document only what 003/004 shipped; defer unresolved entries |
| Risk | Final category taxonomy unknown until tools lock | Category dirs may need renaming | Derive categories from the real feature set; keep IDs stable even if dirs shift |
| Risk | Hyphenation check false-positives on category names | Validator fails on legitimate kebab dirs | Follow the clickup naming precedent that already passes the check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the FINAL category taxonomy (note-crud, search, links-backlinks, daily-notes, tags, frontmatter, templates, ...)? Resolved from the real feature set in research + Phases 003/004.
- Do the CLI ID prefix (`OBS-###`) and MCP prefixes (`MCP-H###`/`MCP-M###`) match the chosen CLI/MCP tools' surfaces?
- Which features are `stage: routing` vs `holdout` vs `negative` for the Phase 8 benchmark tiering?
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
