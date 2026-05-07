---
title: "Feature Specification: Phase 002 Skill Folder Rename"
description: "Rename the two deep loop skill folders from sk-deep-* to deep-* and update the advisor skill graph JSON so the new IDs are canonical before downstream reference-update phases."
trigger_phrases:
  - "070 phase 002"
  - "skill folder rename"
  - "sk-deep-review -> deep-review"
  - "sk-deep-research -> deep-research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename"
    last_updated_at: "2026-05-05T19:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 002 folder rename and internal reference cleanup"
    next_safe_action: "Start Phase 003"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Phase 002 Skill Folder Rename

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 002 of 006 |
| **Handoff Criteria** | Skill folders are renamed with `git mv`; `skill-graph.json` uses `deep-review` and `deep-research`; internal files in the renamed folders contain no `sk-deep-review` or `sk-deep-research`; advisor rebuild is run or explicitly deferred; child and parent strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 measured 130 Phase 002 files: the two old skill folder roots and `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`. The folders must be physically renamed before downstream phases update references elsewhere, and the advisor graph JSON must recognize the new IDs as canonical.

### Purpose
Phase 002 performs the concrete folder rename and local content cleanup for the renamed skills. It also updates the skill advisor graph source so the advisor can rebuild against `deep-review` and `deep-research`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Phase 002 Level 2 planning artifacts.
- Rename `.opencode/skills/sk-deep-review/` to `.opencode/skills/deep-review/` using `git mv`.
- Rename `.opencode/skills/sk-deep-research/` to `.opencode/skills/deep-research/` using `git mv`.
- Replace quoted `sk-deep-review` and `sk-deep-research` IDs in `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`.
- Update internal files inside the renamed folders so they no longer self-reference either old skill name.
- Run the advisor rebuild script when available.
- Validate this child spec folder and the packet parent with strict validation.

### Out of Scope
- Updating references outside the renamed skill folders except `skill-graph.json`.
- Updating `.opencode/agent`, `.opencode/command`, MCP scorer code, tests, root docs, runtime mirrors, configs, active spec folders, or archives.
- Editing binary SQLite databases directly.
- Changing behavior of either skill.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/spec.md` | Create/Update | Phase 002 requirements and scope |
| `specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/plan.md` | Create/Update | Rename and verification plan |
| `specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/tasks.md` | Create/Update | Concrete execution task list |
| `specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/checklist.md` | Create/Update | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/graph-metadata.json` | Create/Update | Canonical graph metadata for the phase |
| `.opencode/skills/sk-deep-review/` | Rename | Rename to `.opencode/skills/deep-review/` |
| `.opencode/skills/sk-deep-research/` | Rename | Rename to `.opencode/skills/deep-research/` |
| `.opencode/skills/deep-review/**` | Update | Replace internal old-name references after rename |
| `.opencode/skills/deep-research/**` | Update | Replace internal old-name references after rename |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Update | Replace old skill IDs in graph keys and signal references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folders with Git tracking | `git mv` produces `deep-review/` and `deep-research/`; old `sk-deep-*` folders are absent |
| REQ-002 | Update advisor graph JSON source | `skill-graph.json` parses as JSON and contains new signal keys without old signal keys |
| REQ-003 | Update internal renamed-folder references | `grep -rl "sk-deep-review\\|sk-deep-research" .opencode/skills/deep-review .opencode/skills/deep-research` returns no rows |
| REQ-004 | Rebuild advisor graph | Build script runs, or absence is explicitly flagged for orchestrator MCP rebuild |
| REQ-005 | Preserve phase scope | Git diff touches only Phase 002 artifacts, the two renamed skill roots, their internal files, and `skill-graph.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep execution order stable | Rename folders before patching internal contents |
| REQ-007 | Validate documentation | Child and parent strict validation exit 0 |
| REQ-008 | Record verification evidence | `tasks.md` and `checklist.md` include command evidence for completed work |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase folder contains Level 2 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json`.
- **SC-002**: `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` exist, with no old folder roots remaining.
- **SC-003**: `skill-graph.json` contains `deep-review` and `deep-research` keys in `signals` and no old signal keys.
- **SC-004**: Internal renamed-folder grep for old skill names returns no rows.
- **SC-005**: Advisor rebuild is run or explicitly deferred with a warning.
- **SC-006**: Strict validation exits 0 for both this child folder and the parent folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Folder rename temporarily breaks references outside Phase 002 | Medium | Keep downstream phases sequenced after Phase 002 and do not broaden this phase |
| Risk | macOS `sed -i` backup files pollute the tree | Low | Remove `.backup` and `.bak` files after replacements |
| Risk | Advisor graph SQLite remains stale | Medium | Run build script when present; otherwise flag orchestrator MCP rebuild |
| Risk | Internal cross-reference between deep-review and deep-research keeps an old name | High | Grep both renamed folders for both old identifiers |
| Dependency | Phase 001 inventory | High | Use `inventory.tsv` phase `002` rows as the measured ownership set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Scope Safety**: No references outside Phase 002 ownership are changed.
- **Traceability**: Every content edit has a verification command.
- **Reversibility**: Folder moves use `git mv` so Git tracks renames cleanly.
- **Parser Safety**: `skill-graph.json` must remain valid JSON.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Internal path links inside the renamed folders still pointing to `.opencode/skills/sk-deep-*`.
- `graph-metadata.json` files inside the renamed folders carrying old `skill_id` or adjacency targets.
- Cross-references from `deep-review` to old `deep-research`, or from `deep-research` to old `deep-review`.
- Backup files from `sed -i` containing stale old names.
- Advisor rebuild script missing from the expected path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | Medium | Phase 001 measured 130 Phase 002 files |
| Behavioral Risk | Medium | Folder IDs and advisor graph affect routing, even though behavior is unchanged |
| Coordination Risk | Medium | Later phases depend on the renamed folders existing |
| Verification Risk | Low | Exact grep, JSON parse, folder existence, and strict validation are deterministic |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None for Phase 002. If the advisor build script is missing, the only deferral is the already-authorized orchestrator MCP `advisor_rebuild({force: true})` follow-up.
<!-- /ANCHOR:questions -->
