---
title: "Tasks: Doctor Cutover Phase 2 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/004-hard-cutover/tasks]"
description: "Decomposed task list for the hard cutover from legacy /doctor:* command files to the consolidated /doctor router surface."
trigger_phrases:
  - "013/005 cutover phase tasks"
  - "doctor hard cutover tasks"
  - "legacy doctor delete tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/004-hard-cutover"
    last_updated_at: "2026-05-11T17:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 2 cutover shipped + verified"
    next_safe_action: "Optional: commit + advisor reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-002-cutover-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor Cutover Phase 2

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[x]` | Complete |
| `[~]` | In progress |
| `[ ]` | Pending |

Task IDs are stable for checklist and implementation-summary references.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

### T-001 - Scaffold 002-cutover-phase packet
- [ ] **Effort:** 25-35 min
- [ ] Create Level 2 docs.
- [ ] Create `scratch/` working directory.
- [ ] Pass strict validation before destructive work.

### T-002 - Close Phase 1 metadata
- [ ] **Effort:** 10 min
- [ ] Static-verify router/manifest YAML table.
- [ ] Run `route-validate.sh`.
- [ ] Run `route-validate.sh --self-test`.
- [ ] Mark 003-skill-advisor-routing-engine-consolidation completion metadata to 100.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### T-101 - Delete legacy `.opencode` markdown command files
- [ ] **Effort:** 5 min
- [ ] Remove the 9 old `.md` files.
- [ ] Verify only `mcp.md` and `update.md` remain in `.opencode/commands/doctor/`.

### T-102 - Delete legacy `.gemini` TOML command files
- [ ] **Effort:** 5 min
- [ ] Remove the 9 old `.toml` files.
- [ ] Preserve `mcp.toml` and `update.toml` if present.

### T-103 - Verify runtime mirror behavior
- [ ] **Effort:** 5 min
- [ ] Verify `.claude/commands/doctor/` mirrors the `.opencode` delete state.
- [ ] Verify no separate `.codex` delete is needed because the command path is symlinked.

### T-104 - Rewrite manual playbook invocations
- [ ] **Effort:** 10-15 min
- [ ] Apply exact old-name substitutions to 23 scenario `.md` files.
- [ ] Verify no stale old-name command strings remain.

### T-105 - Rewrite sandbox harness invocations
- [ ] **Effort:** 10-15 min
- [ ] Apply exact old-name substitutions to `.sh` harness/wrapper files.
- [ ] Run `bash -n` on every `.sh` file.

### T-106 - Audit orchestrator cross-references
- [ ] **Effort:** 5-10 min
- [ ] Check `doctor_update.yaml` for stale old-name command strings.
- [ ] Resolve according to the active asset-editing contract.

### T-107 - Update 013 historical spec docs
- [ ] **Effort:** 10-15 min
- [ ] Add one `Superseded By` row to each selected 013 metadata table.
- [ ] Rewrite inline invocation examples to router form.

### T-108 - Rebuild advisor index
- [ ] **Effort:** 5-10 min
- [ ] Run advisor rebuild after deletes and rewrites.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

### T-201 - Strict validate packets
- [ ] **Effort:** 10-15 min
- [ ] Validate 013 parent, 003-skill-advisor-routing-engine-consolidation, and 004-hard-cutover.

### T-202 - Route and inventory verification
- [ ] **Effort:** 10 min
- [ ] Rerun `route-validate.sh`.
- [ ] Verify markdown counts, router count, and YAML asset count.

### T-203 - Grep and shell gates
- [ ] **Effort:** 10-15 min
- [ ] Run case-insensitive stale invocation grep.
- [ ] Run sandbox shell syntax checks.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] Update `implementation-summary.md` with final evidence.
- [ ] Update checklist items with evidence.
- [ ] Mark 005 and 013 metadata complete only after validation passes.
- [ ] Emit final inventory report.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

| ID | Reference |
|----|-----------|
| `REQ-001` | `spec.md` delete requirements |
| `SC-001` | `.opencode` markdown file count gate |
| `SC-003` | `.gemini` TOML file count gate |
| `SC-006` | stale invocation grep gate |
| `ADR-001` | hard delete without aliases |
| `ADR-003` | advisor rebuild order |
<!-- /ANCHOR:cross-refs -->
