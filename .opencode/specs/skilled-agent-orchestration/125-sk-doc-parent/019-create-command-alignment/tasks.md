---
title: "Tasks: /create command coverage and rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "create command alignment tasks"
  - "125 sk-doc phase 019 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/019-create-command-alignment"
    last_updated_at: "2026-07-07T12:55:35.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-019 tasks"
    next_safe_action: "Finalize surfaces, validate, roll up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: /create command coverage and rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Copy closest 4-file sets (agent→command/flowchart, feature-catalog→benchmark)
- [x] T002 Adapt content to target packets; wire real resource paths (31 paths resolve)
- [x] T003 Normalize to un-numbered thin-router structure; domain-adapt verified flag + path-resolution
- [x] T004 Set the 3 `command` fields in `mode-registry.json` (surgical, compact form preserved)
- [x] T005 Fresh-agent verify the 3 adapted commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 `git mv` 16 files (4 routers + 12 assets); normalize `create_parent_skill_*`→`create_skill_parent_*`
- [x] T007 Fix internal refs in the 16 renamed files (router bodies + asset cross-refs)
- [x] T008 Sweep `mode-registry.json` (4 command fields, surgical)
- [x] T009 Sweep hub `SKILL.md` mode table + packet docs (create-skill/create-readme/create-manual-testing-playbook)
- [x] T010 Fix `README.txt` router filenames + `parent-skill.md` drift + `@general`→`@markdown`
- [x] T011 Fix install-guide command listings
- [ ] T012 Complete enumeration surfaces (README.md, both mirrors, both README.txt): add 3 new + fix counts + bold names
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rename advisor ids across scorer TS + Python mirror + vitests + parity fixture (8 files)
- [x] T014 Capture HEAD baseline; confirm advisor suite is test-neutral (native-scorer 22/22; 4 pre-existing failures unchanged)
- [x] T015 0-leak pathspec commits (adds, command-def rename, advisor)
- [ ] T016 `validate.sh --strict` exit 0; parent 125 rollup
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `mode-registry.json` has zero `"command": null`
- [x] Advisor suite test-neutral vs baseline
- [ ] All enumeration surfaces list 10 commands
- [ ] `validate.sh --strict` exit 0
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
