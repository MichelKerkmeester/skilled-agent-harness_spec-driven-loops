---
title: "Feature Specification: Doctor Cutover Phase 2 [system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec]"
description: "Phase 2 of the doctor command consolidation: hard cutover from legacy /doctor:* files to the shipped /doctor router by deleting old command files, updating playbook and harness invocations, refreshing advisor indices, and closing the 013 phase parent."
trigger_phrases:
  - "005-cutover-phase"
  - "doctor cutover phase 2"
  - "hard cutover"
  - "delete old doctor commands"
  - "10 to 3 doctor commands"
  - "doctor playbook sed"
  - "advisor rebuild after doctor cutover"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase"
    last_updated_at: "2026-05-11T17:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 2 cutover shipped + verified"
    next_safe_action: "Optional: commit + advisor reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-002-cutover-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Hard cutover chosen in 013 phase parent and 2026-05-11 user answer"
      - "No shim aliases; delete old files rather than archive"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Doctor Cutover Phase 2 (Hard Cutover)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (verification gates required) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../003-router-phase/spec.md` |
| **Successor** | None (closes 013's doctor command surface line) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 1 shipped the new `/doctor` router additively. That left the repository in an intentional temporary overlap: the final design wants 3 markdown command entrypoints (`doctor.md`, `doctor/mcp.md`, `doctor/update.md`), but Phase 1 kept the 9 old per-target markdown files in place so validation could compare old and new behavior. The old surface also exists in runtime mirrors: `.claude/commands/doctor/` auto-syncs from `.opencode/commands/doctor/`, `.codex/prompts` symlinks to `.opencode/commands`, and `.gemini/commands/doctor/*.toml` is independent.

### Purpose
Complete the locked 10 -> 3 markdown end state with a hard cutover. Delete the 9 old `.opencode/commands/doctor/*.md` files and the 9 corresponding `.gemini/commands/doctor/*.toml` files, rely on `.claude` and `.codex` propagation where the filesystem already provides it, rewrite manual playbook and harness invocations to the new router form, refresh advisor indices, and close the 013 phase parent. No shim aliases, no archives, no tombstones.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete these `.opencode/commands/doctor/*.md` files: `causal-graph.md`, `cocoindex.md`, `code-graph.md`, `deep-loop.md`, `memory.md`, `skill-advisor.md`, `skill-budget.md`, `mcp_debug.md`, `mcp_install.md`.
- Delete matching `.gemini/commands/doctor/*.toml` files for the same 9 legacy names.
- Verify `.claude/commands/doctor/` mirrors the `.opencode` delete state and `.codex` is covered by its command symlink.
- Rewrite 23 manual playbook scenario files under `.opencode/specs/system-spec-kit/manual_testing_playbook/23--doctor-commands/`.
- Rewrite sandbox harness and wrapper shell scripts under `_sandbox/23--doctor-commands/`.
- Audit `doctor_update.yaml` cross-references for stale legacy invocation strings without changing orchestrator behavior.
- Add concise "Superseded By 013 phases 004 + 005" annotations to the 013 historical spec docs and update invocation examples.
- Rebuild advisor index after deletes so stale command descriptions stop influencing routing.

### Out of Scope
- Modifying `.opencode/commands/doctor.md`, `.opencode/commands/doctor/mcp.md`, `.opencode/commands/doctor/_routes.yaml`, or route validator scripts.
- Changing `/doctor:update` behavior.
- Changing doctor YAML workflow semantics.
- Creating alias shims, archive folders, backup files, or commented-out stubs.

### Files to Change

| Path | Change Type | Notes |
|------|-------------|-------|
| `.opencode/commands/doctor/*.md` legacy files | Delete | 9 old entrypoints only |
| `.gemini/commands/doctor/*.toml` legacy files | Delete | 9 old TOML mirrors only |
| `.opencode/specs/system-spec-kit/manual_testing_playbook/23--doctor-commands/*.md` | Update | Router-form invocations |
| `.opencode/specs/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/**/*.sh` | Update | Router-form invocations |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/**/*.md` selected specs | Update | Historical annotation and invocation strings |
| This packet | Update | Verification evidence and final summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001:** Delete exactly the 9 old `.opencode/commands/doctor/*.md` legacy files listed in scope.
- **REQ-002:** Leave `.opencode/commands/doctor/mcp.md` and `.opencode/commands/doctor/update.md` intact.
- **REQ-003:** Leave `.opencode/commands/doctor.md`, `_routes.yaml`, and `route-validate.{sh,py}` intact.
- **REQ-004:** Delete exactly the 9 old `.gemini/commands/doctor/*.toml` legacy files listed in scope.
- **REQ-005:** Do not delete `.gemini/commands/doctor/mcp.toml` or `update.toml` when present.
- **REQ-006:** Rewrite old invocation forms in the 23 manual playbook scenario files: `/doctor:memory` -> `/doctor memory`, `/doctor:mcp_debug` -> `/doctor:mcp debug`, and equivalent mappings for every old target.
- **REQ-007:** Rewrite the same old invocation forms in sandbox harness shell scripts and keep every `.sh` file syntax-valid.
- **REQ-008:** Do not rewrite `/doctor:mcp`, `/doctor:update`, or unrelated `/doctor:mcp-*` strings.
- **REQ-009:** Add one concise "Superseded By" annotation to each of the three 013 historical spec docs listed in the plan.
- **REQ-010:** Refresh advisor indexing after deletes and reference rewrites.
- **REQ-011:** Close the 013 phase parent only after strict validation, route validation, file-count gates, and grep gates pass.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001:** `.opencode/commands/doctor/` contains only `mcp.md` and `update.md` as markdown files.
- **SC-002:** `.opencode/commands/doctor.md` remains the single top-level router markdown file.
- **SC-003:** `.gemini/commands/doctor/` contains only `mcp.toml` and optionally `update.toml` after legacy TOML deletes.
- **SC-004:** `.opencode/commands/doctor/assets/` still contains 10 YAML workflow assets.
- **SC-005:** `route-validate.sh` exits 0 and reports 7 routes validated.
- **SC-006:** Case-insensitive stale invocation grep over `.opencode`, `.claude`, `.gemini`, and `.codex` returns zero non-archival matches.
- **SC-007:** Every sandbox `.sh` file under `_sandbox/23--doctor-commands/` passes `bash -n`.
- **SC-008:** 013 parent, 003-router-phase, and 005-cutover-phase all pass strict validation with zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:effort -->
## 6. EFFORT

| Area | Estimate |
|------|----------|
| Spec scaffolding | 25-35 min |
| Deletes and mirror checks | 10-15 min |
| Playbook and harness rewrites | 15-25 min |
| Historical spec annotations | 10-15 min |
| Advisor rebuild and final validation | 15-25 min |
| Total | 75-115 min |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

- **EC-001:** `.claude/commands/doctor/` usually auto-syncs via APFS clone. If stale files remain after a short wait, remove only the same 9 names from `.claude`.
- **EC-002:** `.codex/prompts` is a symlink to `.opencode/commands`; no separate `.codex` delete is needed.
- **EC-003:** `.gemini/commands/doctor/update.toml` may or may not exist. Preserve it if present.
- **EC-004:** Sed must not touch `/doctor:mcp` without `_debug` or `_install`.
- **EC-005:** Sed must not touch `/doctor:update`.
- **EC-006:** Sed must not transform `/doctor:mcp-anything-else`.
- **EC-007:** Case-insensitive grep may find archival records under `_archive`, `z_archive`, or `z_future`; report but do not modify archival history.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001:** No backup files, archive directories, tombstones, or commented-out legacy command stubs.
- **NFR-002:** Keep diffs legible: in-place invocation rewrites only, no playbook regeneration.
- **NFR-003:** Preserve scenario IDs and harness file names.
- **NFR-004:** Avoid touching shipped Phase 1 router files and stable doctor YAML workflow assets unless a grep gate proves an allowed stale reference must be fixed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

- **RISK-001:** Parallel-write race if the user has unrelated work in flight. Baseline assumption follows memory `feedback_worktree_cleanliness_not_a_blocker`: concurrent tracks are normal, so scope edits narrowly and do not revert unrelated changes.
- **RISK-002:** Sed overreach could rewrite `/doctor:mcp` or `/doctor:update`. Mitigation: exact old-name patterns only, then grep verification.
- **RISK-003:** Advisor rebuild before deletes could preserve stale descriptions. Mitigation: rebuild after physical deletes and reference updates.
- **RISK-004:** `.claude` sync lag could leave stale copies. Mitigation: verify and only then apply the narrow fallback delete.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Lens | Assessment |
|------|------------|
| Scope | Medium: many files, narrow transformations |
| Risk | Medium: destructive deletes plus grep-sensitive rewrites |
| Reversibility | Low after hard delete unless restored from git |
| Verification | Strong: file counts, grep gates, route validator, strict spec validation |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

All open questions are resolved by the 013 phase parent spec and Phase 1 ADRs:

- Hard cutover, no shims.
- `/doctor:update` remains standalone.
- `/doctor:mcp` remains the MCP infrastructure command.
- Legacy code/docs are deleted, not archived or commented out.
<!-- /ANCHOR:questions -->
