---
title: "Tasks: sk-create-diagram import/export tooling"
description: "Task queue for porting the extraction scripts, import/export references, and SKILL.md routing."
trigger_phrases:
  - "diagram import export tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/004-import-export-tooling"
    last_updated_at: "2026-08-12T06:38:42.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue ahead of executor dispatch"
    next_safe_action: "Dispatch after phase 002 lands"
    blockers:
      - "Waiting on phase 002"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram import/export tooling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [B] Confirm phase 002 `SKILL.md` and `references/` exist — blocks the rest of this phase [EVIDENCE: phase 002 `validate_skill_package.py --check --strict` PASS.]
- [x] T002 Compose the dispatch prompt [EVIDENCE: `phase-004-dispatch-prompt.txt`.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Copy `scripts/drawio_extract.py` unchanged [EVIDENCE: `cmp -s` identical to source.]
- [x] T004 [P] Copy `scripts/mermaid_extract.py` unchanged [EVIDENCE: `cmp -s` identical to source.]
- [x] T005 [P] Port `references/import-drawio.md` [EVIDENCE: file exists with valid frontmatter.]
- [x] T006 [P] Port `references/import-mermaid.md` [EVIDENCE: file exists with valid frontmatter.]
- [x] T007 [P] Port `references/export.md` [EVIDENCE: file exists with valid frontmatter.]
- [x] T008 Update `SKILL.md` §11-12 routing to the three new references [EVIDENCE: 3-edit diff removing "later phase" placeholders, `SKILL.md:347,349,369`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `python3 scripts/drawio_extract.py --help` exits 0 [EVIDENCE: exit 0, independently re-run by the orchestrator.]
- [x] T010 `python3 scripts/mermaid_extract.py --help` exits 0 [EVIDENCE: exit 0, independently re-run by the orchestrator.]
- [x] T011 `grep -E '^import|^from'` on both scripts shows no new third-party imports [EVIDENCE: re-run, matches the confirmed stdlib list exactly.]
- [x] T012 Run `validate_skill_package.py --check` [EVIDENCE: `PASS (exit 0)`.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]
- [x] No [B] tasks remain
- [x] Both scripts run without error
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Source manifest**: `../001-inventory-and-skill-contract/resource-map.md` §2
<!-- /ANCHOR:cross-refs -->
