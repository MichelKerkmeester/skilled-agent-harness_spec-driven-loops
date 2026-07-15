---
title: "Feature Specification: Phase 002 Skill Folder Rename"
description: "Rename the physical skill folder from sk-improve-prompt to sk-prompt and update skill-local self references. Also updates skill-graph keys and rebuilds advisor state immediately after JSON edits."
trigger_phrases:
  - "082 phase 002"
  - "sk-improve-prompt skill folder rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-06T11:00:06Z"
    last_updated_by: "codex"
    recent_action: "Phase 002 complete: folder renamed, 9 files updated, advisor rebuilt"
    next_safe_action: "Phase 003 opencode internals"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Phase 002 Skill Folder Rename

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 002 of 006 |
| **Handoff Criteria** | `ls .opencode/skills/sk-prompt/` succeeds; advisor status reports generation bumped after rebuild |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The canonical skill directory and skill-local metadata still identify the skill as `sk-improve-prompt`. Consumers cannot safely move to `sk-prompt` until the folder, local self-references, and advisor graph keys agree.

### Purpose
Phase 002 performs the physical `git mv`, updates skill internals and `skill-graph.json`, handles the changelog symlink decision, and rebuilds advisor state before downstream references are changed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `git mv .opencode/skills/sk-improve-prompt .opencode/skills/sk-prompt`.
- Update `SKILL.md` frontmatter `name:` and skill-local `README.md`, `graph-metadata.json`, changelog headers, references, and assets.
- Update `skill-graph.json` keys for signals, families, adjacency, and hub skills.
- Verify `.opencode/changelog/sk-improve-prompt` and recreate or retarget it only if required.
- Run `mcp__spec_kit_memory__advisor_rebuild` immediately after JSON edits.

### Out of Scope
- Updating `.opencode/` consumers outside the renamed skill folder.
- Updating runtime mirrors, root README, install guides, active changelogs outside the skill, or observability files.
- Running final advisor probe battery or editing historical frozen specs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-improve-prompt/` -> `.opencode/skills/sk-prompt/` | Rename | Canonical skill folder move |
| `.opencode/skills/sk-prompt/{SKILL.md,README.md,graph-metadata.json}` | Modify | Name, path, and `skill_id` refs |
| `.opencode/skills/sk-prompt/changelog/v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md` | Modify | Changelog headers and self-refs |
| `.opencode/skills/sk-prompt/references/*`, `.opencode/skills/sk-prompt/assets/*` | Modify | Skill-local self-references |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Modify | Graph keys and adjacency IDs |
| `.opencode/changelog/sk-improve-prompt` | Rename/Retarget | Symlink handling after folder move |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename the physical skill folder to `.opencode/skills/sk-prompt/`. | `ls .opencode/skills/sk-prompt/SKILL.md` succeeds and the old folder path is absent. |
| REQ-002 | Update skill-local references from `sk-improve-prompt` to `sk-prompt`. | Scoped `rg` over `.opencode/skills/sk-prompt` returns no `sk-improve-prompt` matches. |
| REQ-003 | Update advisor graph keys and values for the prompt skill. | Scoped `rg` over `skill-graph.json` returns no `sk-improve-prompt` matches and `jq` passes. |
| REQ-004 | Rebuild advisor state after graph edits. | Advisor rebuild reports a generation bump and status reports freshness `live`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve changelog symlink convention. | `.opencode/changelog/sk-prompt` points to `../skill/sk-prompt/changelog`. |
| REQ-006 | Document completion evidence in the phase folder. | `implementation-summary.md` and `tasks.md` include command evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/skills/sk-prompt/SKILL.md` exists and its frontmatter `name:` field is `sk-prompt`.
- **SC-002**: No `sk-improve-prompt` literal remains in `.opencode/skills/sk-prompt/` or Phase 002's `skill-graph.json` scope.
- **SC-003**: `skill-graph.json` remains valid JSON.
- **SC-004**: Advisor rebuild completes and advisor status reports freshness `live`.
- **SC-005**: Strict validation passes on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dirty worktree contains unrelated edits | Accidental overwrite or scope bleed | Read targeted diffs first and only edit Phase 002 paths. |
| Risk | Advisor cache stays stale | Skill routing may continue seeing old graph state | Force advisor rebuild and verify status `live`. |
| Dependency | Phase 003 references still point at the old skill name | Rebuild diagnostics can contain out-of-scope warnings | Record warnings and leave consumer refs for Phase 003. |
| Dependency | Sandbox blocks `.git/index.lock` | `git mv` cannot stage rename metadata | Use physical move and report the staging limitation. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for Phase 002.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- Preserve JSON syntax in `graph-metadata.json` and `skill-graph.json`.
- Preserve YAML frontmatter syntax in markdown files.
- Keep edits limited to Phase 002 paths and phase documentation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

| Edge Case | Handling |
|-----------|----------|
| Existing changelog symlink is stale after folder move | Retarget to `../skill/sk-prompt/changelog`. |
| MCP advisor tools are unavailable | Use the compiled local advisor rebuild/status handlers. |
| Out-of-scope graph metadata still references old ID | Leave for Phase 003 and document rebuild diagnostics. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Area | Complexity | Notes |
|------|------------|-------|
| Folder rename | Medium | Physical move is simple; staging was blocked by sandbox restrictions. |
| Skill-local replacements | Low | Mechanical literal replacement in a known file list. |
| Advisor graph refresh | Medium | Requires key/value rename plus rebuild/status verification. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:implementation -->
## 11. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should make the folder move first, update all skill-local references and graph JSON keys in one pass, then rebuild advisor state before handing off.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 12. HANDOFF CRITERIA

- `ls .opencode/skills/sk-prompt/` succeeds.
- `rg 'sk-improve-prompt' .opencode/skills/sk-prompt .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` returns 0.
- `.opencode/changelog/sk-improve-prompt` is gone or retargeted by the verified symlink policy.
- `mcp__spec_kit_memory__advisor_rebuild` completes and advisor status reports generation bumped.

```bash
ls .opencode/skills/sk-prompt/
rg 'sk-improve-prompt' .opencode/skills/sk-prompt .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/002-sk-improve-prompt-rename/002-skill-folder-rename --strict
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 13. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: [../001-discovery-impact-map/spec.md](../001-discovery-impact-map/spec.md)
- **Successor Phase**: [../003-opencode-internals/spec.md](../003-opencode-internals/spec.md)
<!-- /ANCHOR:related -->
