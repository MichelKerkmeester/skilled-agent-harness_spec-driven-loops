---
title: "Tasks: Phase 4: docs-agents-governance-removal"
description: "Task list for cli-devin deprecation phase 4"
trigger_phrases:
  - "phase 4 tasks"
  - "docs-agents-governance-removal tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/111-cli-devin-deprecation/004-docs-agents-governance-removal"
    last_updated_at: "2026-06-08T17:38:17.105Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 4 tasks completed"
    next_safe_action: "Proceed to phase 5"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: docs-agents-governance-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the Context Report §2 cluster + the target files before editing (READ-first, scope-locked)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 deep-context/research/review/improvement agents cleaned across 3 runtimes (mirror parity preserved)
- [x] T003 AGENTS.md + CLAUDE.md (twin) + README.md + skills/README.md updated
- [x] T004 post-implementation-deep-review.md made executor-agnostic (D4)
- [x] T005 cli-* sibling skills + sk-prompt + deep-context refs + scripts README + constitutional + shared cli refs cleaned
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Verify: grep 0 cli-devin in active agent/governance/cross-skill dirs; agent mirrors consistent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Verification passed (see implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation**: See `implementation-summary.md`
- **Authoritative edit list**: `../context/context-report.md` §2
<!-- /ANCHOR:cross-refs -->
