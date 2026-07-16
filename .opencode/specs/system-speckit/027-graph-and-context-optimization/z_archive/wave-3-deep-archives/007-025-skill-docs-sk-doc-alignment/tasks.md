---
title: "Tasks: System-code-graph skill docs sk-doc alignment"
description: "Task list for the docs-only 011 alignment pass over system-code-graph skill-level documentation."
trigger_phrases:
  - "011 skill docs sk-doc alignment tasks"
  - "system-code-graph docs tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-025-skill-docs-sk-doc-alignment"
    last_updated_at: "2026-05-14T17:43:47Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-011"
    recent_action: "Tracked docs-only alignment tasks"
    next_safe_action: "Commit scoped documentation changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/feature_catalog/"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-011-skill-docs-sk-doc-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet 010 has landed, so live MCP namespace references use mk-code-index."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: System-code-graph skill docs sk-doc alignment

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm 011 packet did not already exist.
- [x] T002 Read sk-doc skill guidance and relevant templates.
- [x] T003 [P] Survey feature catalog, manual playbook and references file list.
- [x] T004 Confirm packet 010 rename landed and live docs should use `mk-code-index`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update `.opencode/skills/system-code-graph/SKILL.md`.
- [x] T006 [P] Update `.opencode/skills/system-code-graph/feature_catalog/**`.
- [x] T007 [P] Update `.opencode/skills/system-code-graph/manual_testing_playbook/**`.
- [x] T008 Confirm `.opencode/skills/system-code-graph/references/` has no authored non-README reference files needing edits.
- [x] T009 Replace 011 packet scaffold placeholders.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run scoped placeholder, stale-namespace and HVR punctuation audits.
- [x] T011 Run sk-doc validation helpers for the skill docs.
- [x] T012 Run strict spec validation for the 011 packet.
- [x] T013 Stage only scoped docs and 011 packet files.
- [x] T014 Commit `docs(011): align system-code-graph skill docs with sk-doc`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] Strict spec validation passes.
- [x] Commit exists or staged changes are left with `COMMIT_SHA=uncommitted` if the sandbox blocks commit.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
