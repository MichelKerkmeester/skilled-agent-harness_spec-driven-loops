# Implementation Plan: Command Alignment for Spec 138 Features

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML |
| **Framework** | OpenCode SpecKit command system |
| **Storage** | File-based (.md, .yaml) |
| **Testing** | Manual verification (command execution) |

### Overview
This implements documentation-only updates to 14 command/skill files to align them with spec 138's skill graph architecture and unified graph intelligence features. Changes are split into 3 workstreams: Create commands (graph architecture support), Memory commands (graph flag documentation), and SKILL.md (feature flag table update). All changes are additive — existing behavior preserved for non-graph skills.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (spec 138 phases 001-003 complete)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-009)
- [ ] YAML structure valid (indentation, syntax)
- [ ] Auto/confirm pairs consistent
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only modifications to existing command system files.

### Key Components
- **Create Commands**: `skill.md`, `skill_reference.md`, `skill_asset.md` + their YAML assets (auto/confirm)
- **Memory Commands**: `context.md`, `manage.md`, `continue.md`, `learn.md`
- **System Config**: `system-spec-kit/SKILL.md` feature flag table

### Data Flow
No data flow changes. Commands read templates and produce files. The graph-mode detection adds a filesystem check (`ls [skill_path]/index.md`) to determine integration target.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Create Command Updates
- [ ] Update `create/skill.md` with graph architecture decision gate
- [ ] Update `create_skill_auto.yaml` Steps 5/6/8 with graph scaffolding
- [ ] Update `create_skill_confirm.yaml` Steps 5/6/8 with graph scaffolding
- [ ] Update `create/skill_reference.md` Step 5 for graph-mode detection
- [ ] Update `create_skill_reference_auto.yaml` + `create_skill_reference_confirm.yaml`
- [ ] Update `create/skill_asset.md` Step 5 + graph node type
- [ ] Update `create_skill_asset_auto.yaml` + `create_skill_asset_confirm.yaml`

### Phase 2: Memory Command Updates
- [ ] Update `memory/context.md` with graph weight dimension and flags
- [ ] Update `memory/manage.md` with SPECKIT_GRAPH_* flags and graph health/stats
- [ ] Update `memory/continue.md` adaptive fusion from 2→3 channel
- [ ] Update `memory/learn.md` consolidation pipeline graph note

### Phase 3: System Config + Verification
- [ ] Update `system-spec-kit/SKILL.md` feature flag table with 3 SPECKIT_GRAPH_* flags
- [ ] Verify all auto/confirm pairs are consistent
- [ ] Verify no broken markdown structure
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Verify markdown renders correctly | Read tool |
| Manual | Verify YAML syntax valid | Read tool |
| Manual | Verify auto/confirm pair consistency | Diff comparison |
| Manual | Verify feature flag table completeness | Read SKILL.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 138 Phase 001 | Internal | Green | Context for hybrid RAG features |
| Spec 138 Phase 002 | Internal | Green | Context for skill graph architecture |
| Spec 138 Phase 003 | Internal | Green | Context for unified graph intelligence |
| Graph templates exist | Internal | Green | `skill_graph_node_template.md`, `skill_graph_index_template.md` confirmed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Command syntax breaks or YAML parsing fails
- **Procedure**: `git checkout -- .opencode/command/ .opencode/skill/system-spec-kit/SKILL.md`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Create Commands) ──┐
                             ├──► Phase 3 (Verify)
Phase 2 (Memory Commands) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Create Commands | None | Verify |
| Memory Commands | None | Verify |
| Verify | Create, Memory | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Create Commands | Medium | Moderate (7 files) |
| Memory Commands | Low-Medium | Moderate (4 files) |
| System Config | Low | Small (1 file) |
| Verification | Low | Small |
| **Total** | | **14 files, ~300-400 LOC** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git clean state before changes
- [ ] All files read before modification

### Rollback Procedure
1. `git checkout -- .opencode/command/create/` — restore Create commands
2. `git checkout -- .opencode/command/memory/` — restore Memory commands
3. `git checkout -- .opencode/skill/system-spec-kit/SKILL.md` — restore SKILL.md
4. Verify commands render correctly

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
