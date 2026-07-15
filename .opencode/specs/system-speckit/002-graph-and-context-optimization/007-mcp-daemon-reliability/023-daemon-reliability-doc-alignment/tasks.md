---
title: "Tasks: Daemon-reliability doc alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "daemon reliability doc alignment tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/023-daemon-reliability-doc-alignment"
    last_updated_at: "2026-06-07T18:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked alignment tasks complete"
    next_safe_action: "Changelog + sk-code/sk-doc cross-check"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-023-daemon-reliability-doc-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Daemon-reliability doc alignment

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Run the gpt-5.5 (cli-codex) doc-alignment audit + a grep pre-scan; confirm 0 doc coverage for 018-022
- [x] T002 Define entry slugs + playbook IDs (422-426) + the index/count invariants
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add 8 launcher/daemon flag rows to `mcp_server/ENV_REFERENCE.md`
- [x] T004 [P] Author 5 feature_catalog entries (@markdown) + add 5 `###` index sections to `feature_catalog.md`
- [x] T005 [P] Author 5 playbook scenarios 422-426 (@markdown) + add 5 big-table rows + bump the file-count self-check (386->391) + add a 419 cross-reference
- [x] T006 Add lifecycle rows / flag pointers to `mcp_server/README.md`, `bin/README.md`, root `README.md`, `database/README.md`, and `SKILL.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Count self-check (391 playbook / 325 catalog) MATCH
- [x] T008 Repo-wide markdown link check: 0 broken
- [x] T009 `validate.sh --strict` for this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Counts + links verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
