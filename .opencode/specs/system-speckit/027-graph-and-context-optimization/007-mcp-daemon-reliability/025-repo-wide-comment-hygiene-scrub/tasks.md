---
title: "Tasks: Repo-wide comment-hygiene scrub"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "repo-wide comment hygiene tasks"
  - "perishable label scrub tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/025-repo-wide-comment-hygiene-scrub"
    last_updated_at: "2026-06-07T21:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Three gpt-5.5 agents scrubbed 40 live-code files; all clean under the checker"
    next_safe_action: "Reconcile docs, commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-025-repo-wide-comment-hygiene-scrub"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Repo-wide comment-hygiene scrub

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

- [x] T001 Measure the repo-wide backlog with the extended checker
- [x] T002 Choose exclusions and partition into three disjoint clusters
- [x] T003 Scaffold the Level 2 packet (025)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Cluster A: scrub system-spec-kit core (16 files)
- [x] T005 [P] Cluster B: scrub code-graph, advisor, bin, plugins (12 files)
- [x] T006 [P] Cluster C: scrub deep-stack, sk-code, sk-doc (12 files)
- [x] T007 Keep edits comment-only and string literals untouched
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Extended checker clean across all 40 files
- [x] T009 Syntax checks pass for every edited cjs, js, and py file
- [x] T010 Scope and diff spot-checks confirm comments only; update docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
