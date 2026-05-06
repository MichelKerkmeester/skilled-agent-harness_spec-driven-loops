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
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-06T12:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase spec scaffold"
    next_safe_action: "Rename skill folder and update skill-local sk-prompt metadata"
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
    completion_pct: 0
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
| **Status** | Pending |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 002 of 006 |
| **Handoff Criteria** | `ls .opencode/skill/sk-prompt/` succeeds; advisor status reports generation bumped after rebuild |
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
- Run `git mv .opencode/skill/sk-improve-prompt .opencode/skill/sk-prompt`.
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
| `.opencode/skill/sk-improve-prompt/` -> `.opencode/skill/sk-prompt/` | Rename | Canonical skill folder move |
| `.opencode/skill/sk-prompt/{SKILL.md,README.md,graph-metadata.json}` | Modify | Name, path, and `skill_id` refs |
| `.opencode/skill/sk-prompt/changelog/v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md` | Modify | Changelog headers and self-refs |
| `.opencode/skill/sk-prompt/references/*`, `.opencode/skill/sk-prompt/assets/*` | Modify | Skill-local self-references |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Modify | Graph keys and adjacency IDs |
| `.opencode/changelog/sk-improve-prompt` | Rename/Retarget | Symlink handling after folder move |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:implementation -->
## 4. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should make the folder move first, update all skill-local references and graph JSON keys in one pass, then rebuild advisor state before handing off.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 5. HANDOFF CRITERIA

- `ls .opencode/skill/sk-prompt/` succeeds.
- `rg 'sk-improve-prompt' .opencode/skill/sk-prompt .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` returns 0.
- `.opencode/changelog/sk-improve-prompt` is gone or retargeted by the verified symlink policy.
- `mcp__spec_kit_memory__advisor_rebuild` completes and advisor status reports generation bumped.

```bash
ls .opencode/skill/sk-prompt/
rg 'sk-improve-prompt' .opencode/skill/sk-prompt .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename/002-skill-folder-rename --strict
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: [../001-discovery-impact-map/spec.md](../001-discovery-impact-map/spec.md)
- **Successor Phase**: [../003-opencode-internals/spec.md](../003-opencode-internals/spec.md)
<!-- /ANCHOR:related -->
