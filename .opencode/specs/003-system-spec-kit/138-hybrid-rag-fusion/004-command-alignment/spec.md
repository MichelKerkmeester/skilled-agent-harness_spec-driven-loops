# Feature Specification: Command Alignment for Spec 138 Features

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-20 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `003-unified-graph-intelligence` |
| **Successor** | `005-install-guide-alignment` |
| **Phase** | `004-command-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec 138 phases 001-003 introduced 61 features including the Skill Graph architecture (72 nodes, 9 skills), 3 new `SPECKIT_GRAPH_*` feature flags, and 7 intelligence amplification patterns. The Create commands (`/create:skill`, `/create:skill_reference`, `/create:skill_asset`) still assume monolithic SKILL.md architecture and have no awareness of graph-based skill structures. The Memory commands (`/memory:context`, `/memory:manage`, `/memory:continue`, `/memory:learn`) are missing documentation of the 3 new graph feature flags and the 3-channel adaptive fusion model (vector + BM25 + graph).

### Purpose
Align all affected Create and Memory commands with the skill graph architecture and unified graph intelligence features delivered in spec 138, ensuring commands produce correct output for graph-mode skills and document the active graph pipeline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `/create:skill` command + YAML assets with graph architecture decision gate
- Update `/create:skill_reference` command + YAML assets for graph-mode detection
- Update `/create:skill_asset` command + YAML assets for graph-mode detection + graph node type
- Update `/memory:context` with graph weight dimension and flag documentation
- Update `/memory:manage` with SPECKIT_GRAPH_* flags and graph health/stats info
- Update `/memory:continue` adaptive fusion note (2-channel to 3-channel)
- Update `/memory:learn` consolidation pipeline note with graph channel
- Update `system-spec-kit/SKILL.md` feature flag table with 3 new SPECKIT_GRAPH_* flags

### Out of Scope
- `/create:agent` - no graph dependency
- `/create:folder_readme` - low-priority awareness gap only
- `/create:install_guide` - no graph dependency
- `/memory:save` - retrieval-agnostic, no changes needed
- `skill_advisor.py` - reads SKILL.md frontmatter which is unchanged
- Modifying any production TypeScript/MCP code
- Adding new commands or skills

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/skill.md` | Modify | Add graph architecture decision gate |
| `.opencode/command/create/assets/create_skill_auto.yaml` | Modify | Add graph scaffolding to Steps 5/6/8 |
| `.opencode/command/create/assets/create_skill_confirm.yaml` | Modify | Add graph scaffolding to Steps 5/6/8 |
| `.opencode/command/create/skill_reference.md` | Modify | Update Step 5 integration target for graph-mode |
| `.opencode/command/create/assets/create_skill_reference_auto.yaml` | Modify | Update Step 5 graph detection |
| `.opencode/command/create/assets/create_skill_reference_confirm.yaml` | Modify | Update Step 5 graph detection |
| `.opencode/command/create/skill_asset.md` | Modify | Update Step 5 + add graph node asset type |
| `.opencode/command/create/assets/create_skill_asset_auto.yaml` | Modify | Update Step 5 + graph node type |
| `.opencode/command/create/assets/create_skill_asset_confirm.yaml` | Modify | Update Step 5 + graph node type |
| `.opencode/command/memory/context.md` | Modify | Add graph weight dimension, graph flags |
| `.opencode/command/memory/manage.md` | Modify | Add SPECKIT_GRAPH_* flags, graph health/stats |
| `.opencode/command/memory/continue.md` | Modify | Update adaptive fusion from 2 to 3 channel |
| `.opencode/command/memory/learn.md` | Modify | Update consolidation pipeline note |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Add 3 SPECKIT_GRAPH_* flags to feature flag table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `/create:skill` offers graph vs monolithic architecture choice | New skills can be created with `index.md` + `nodes/` structure |
| REQ-002 | `/create:skill_reference` detects graph-mode skills | Step 5 integration routes to `index.md`/node files when graph-mode detected |
| REQ-003 | `/create:skill_asset` detects graph-mode + offers graph node type | Step 5 routes correctly; "Graph Node" offered as asset type |
| REQ-004 | `/memory:context` documents graph weight dimension | Intent weight table includes graph channel weights |
| REQ-005 | `/memory:manage` documents SPECKIT_GRAPH_* flags | All 3 flags with defaults and behavior documented |
| REQ-006 | `SKILL.md` feature flag table includes all 3 graph flags | Table shows SPECKIT_GRAPH_UNIFIED, SPECKIT_GRAPH_MMR, SPECKIT_GRAPH_AUTHORITY |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `/memory:continue` reflects 3-channel adaptive fusion | Note updated to mention graph as third channel |
| REQ-008 | `/memory:learn` reflects graph in consolidation pipeline | Note mentions graph channel participation in dedup |
| REQ-009 | Create command YAML assets (auto + confirm) updated consistently | Both auto and confirm variants reflect the same changes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running `/create:skill` for a complex skill offers graph architecture option and scaffolds `index.md` + `nodes/`
- **SC-002**: Running `/create:skill_reference` or `/create:skill_asset` on a graph-mode skill correctly targets `index.md`/nodes instead of SKILL.md
- **SC-003**: All 3 SPECKIT_GRAPH_* flags documented in SKILL.md and relevant memory commands
- **SC-004**: `/memory:context` intent weight table reflects 3-channel (vector + BM25 + graph) model
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Command markdown syntax errors | Commands fail to render | Manual review of markdown structure |
| Risk | YAML indentation errors | Workflow parsing fails | Validate YAML structure after edits |
| Dependency | Spec 138 phases 001-003 complete | Required for context | Already complete (verified) |
| Risk | Scope creep into production code | Out of scope changes | Strict scope lock on documentation-only changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: All auto/confirm YAML pairs contain identical changes (just different approval gates)
- **NFR-C02**: Feature flag documentation is consistent across SKILL.md and memory commands

### Backward Compatibility
- **NFR-B01**: Monolithic SKILL.md creation remains default for simple skills
- **NFR-B02**: Existing commands continue to work unchanged for non-graph skills
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Graph Detection
- Skill has no `index.md`: Fall back to SKILL.md integration (existing behavior)
- Skill has both `index.md` and full SKILL.md: Prefer graph-mode targeting

### Asset Type
- User selects "Graph Node" for non-graph skill: Warn and offer to scaffold graph structure first
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 14 files, ~300-400 LOC edits |
| Risk | 8/25 | Documentation-only, no production code |
| Research | 18/20 | Research complete (3 agents scanned all features) |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None - research phase completed all findings
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---

## Acceptance Scenarios

1. All targeted command docs contain aligned argument/flow wording.
2. Auto/confirm YAML variants stay content-equivalent.
3. Command docs reference current graph-enabled behavior where applicable.
4. Cross-command consistency checks pass without regressions.

## Acceptance Scenario Details

- **Given** command docs, **When** create workflows are reviewed, **Then** graph mode options are present.
- **Given** auto/confirm YAML pairs, **When** compared, **Then** argument flows are synchronized.
- **Given** memory commands, **When** docs are read, **Then** graph flag behavior is accurately described.
- **Given** command templates, **When** integration checks run, **Then** no conflicting guidance remains.
