---
title: "Feature Specification: Phase 005 Root Docs and Configs"
description: "Update the repo-root documentation and listed root configuration files for the deep-loop skill rename to deep-review/deep-research. This phase owns only the listed root files and the Phase 005 spec folder artifacts."
trigger_phrases:
  - "070 phase 005"
  - "root docs config rename"
  - "sk-deep root references"
  - "deep-review deep-research root configs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/031-sk-deep-rename/005-root-and-config"
    last_updated_at: "2026-05-05T19:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 005 root update"
    next_safe_action: "Hand off to Phase 006"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 005 Root Docs and Configs

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
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 005 of 006 |
| **Handoff Criteria** | Listed root docs/configs contain zero active references to the old deep-loop skill IDs; JSON targets parse; child and parent strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 070 renames the old deep-loop skill IDs to `deep-review` and `deep-research`. Phase 001 found Phase 005 references in root-level documentation/config areas, and the user constrained this execution to the listed repo-root files plus this phase folder.

### Purpose
Phase 005 removes stale old-name references from the listed root docs/configs and records verification evidence for handoff into Phase 006.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create/adapt Phase 005 Level 2 artifacts in this folder.
- Check the listed root documentation and configuration files for exact old deep-loop skill ID references.
- Replace old skill names with `deep-review` and `deep-research` in listed files that actually contain them.
- Validate listed JSON configs with Python JSON parsing.
- Run the requested residual grep and strict child/parent spec validation.

### Out of Scope
- Editing `.opencode/`, `.codex/`, `.gemini/`, or runtime mirror references owned by Phases 003 and 004.
- Editing user-global files under `~/.claude/`.
- Renaming skill folders or updating skill-graph data owned by Phase 002.
- Updating historical specs, changelog history, or archived context outside this phase scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Replace remaining old skill display names in the root skill list |
| `AGENTS.md` | Check | Included target; no old-name references found during preflight |
| `AGENTS_Barter.md` | Check | Included target symlink; no old-name references found during preflight |
| `CLAUDE.md` | Check | Included target symlink to `AGENTS.md`; no old-name references found during preflight |
| `opencode.json` | Check | Included JSON target; no old-name references found during preflight |
| `.utcp_config.json` | Check | Included JSON target; no old-name references found during preflight |
| `.claude/settings.json` | Check | Included JSON target; no old-name references found during preflight |
| `.claude/settings.local.json` | Check | Included JSON target; no old-name references found during preflight |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config/spec.md` | Create | Phase 005 requirements and scope |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config/plan.md` | Create | Implementation and verification plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config/tasks.md` | Create | Concrete task checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config/checklist.md` | Create | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config/implementation-summary.md` | Create | Completion summary required by strict validation |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/005-root-and-config/graph-metadata.json` | Create | Phase graph metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root docs/configs use new skill names | Requested grep across listed root files returns no old deep-loop skill ID matches |
| REQ-002 | JSON configs remain valid | Python JSON parser succeeds for `opencode.json`, `.utcp_config.json`, `.claude/settings.json`, and `.claude/settings.local.json` |
| REQ-003 | Scope stays confined | Git diff for this phase contains only `README.md` plus files inside `005-root-and-config/` |
| REQ-004 | Level 2 artifacts validate | Child strict validation exits 0 |
| REQ-005 | Parent packet remains valid | Parent strict validation exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Symlinked root docs are handled deliberately | `AGENTS_Barter.md` and `CLAUDE.md` existence is checked before grep/edit; no out-of-scope target edits occur |
| REQ-007 | Inventory handoff is respected | Phase 001 inventory rows for `phase=005` are read and compared against the user's narrower writable list |
| REQ-008 | Verification evidence is recorded | `tasks.md`, `checklist.md`, and `implementation-summary.md` capture grep, JSON, and validation outcomes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `README.md` uses `deep-research` and `deep-review` in the affected root skill list entries.
- **SC-002**: **Given** the listed root docs/configs, **When** the old-name grep runs, **Then** it returns no matching file paths.
- **SC-003**: **Given** each listed JSON config, **When** Python parses it, **Then** parsing succeeds with no syntax errors.
- **SC-004**: **Given** the Phase 005 folder, **When** strict validation runs, **Then** the child validation exits 0.
- **SC-005**: **Given** the packet parent folder, **When** strict validation runs, **Then** parent validation exits 0.
- **SC-006**: **Given** parallel Phases 003 and 004, **When** Phase 005 completes, **Then** no files from those subtrees are modified by this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inventory includes broader Phase 005 candidates than the user-approved writable list | Medium | Treat the user brief as authoritative for this execution and report only listed root-file residuals |
| Risk | `AGENTS_Barter.md` and `CLAUDE.md` are symlinks | Low | Check with `grep` and avoid editing targets unless old refs are actually present |
| Risk | `.claude/settings.local.json` is already modified by another phase or user | Medium | Do not touch it unless old refs exist; validate JSON read-only |
| Dependency | Phase 001 inventory | Medium | Read `inventory.tsv` filtered for `phase=005` before implementation |
| Dependency | Strict spec validator | Medium | Run child and parent validation before completion claim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Traceability**: Every modified file is listed in this spec and final output.
- **Scope Safety**: No edits occur outside the listed root files and this phase folder.
- **Reviewability**: Replacement is a simple exact text rename with no behavior changes.
- **Determinism**: Verification commands are explicit and reproducible.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `AGENTS_Barter.md` is a symlink into `barter/coder/AGENTS.md`; it is checked because the user listed it, but no write is needed without old refs.
- `CLAUDE.md` is a symlink to `AGENTS.md`; the canonical file has no old-name references.
- `.claude/settings.local.json` may contain unrelated working-tree modifications; Phase 005 only validates JSON unless the exact old names are present.
- Phase 001 also lists `.codex/config.toml` and `.opencode/install_guides/*` as Phase 005 candidates, but those are outside this user's explicit writable list for Packet 070 Phase 005.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | Low | Only `README.md` contains old refs among the listed root targets |
| Behavioral Risk | Low | Text-only rename in docs; no executable behavior change |
| Coordination Risk | Medium | Runs in parallel with phases touching `.opencode/` and runtime mirrors |
| Verification Risk | Low | Residual grep, JSON parse, and strict validation give direct evidence |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None for Phase 005. Broader Phase 005 inventory rows outside the user's listed files should be left to the orchestrator or a separately scoped follow-up, not silently pulled into this execution.
<!-- /ANCHOR:questions -->
