---
title: "Tasks: Rule-section icon standardization across SKILL.md files"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rule section icons tasks"
  - "014 sk-doc phase 030 tasks"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/030-rule-section-icons"
    last_updated_at: "2026-07-14T17:24:30.985Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete"
    next_safe_action: "Ship with the sk-doc router commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Rule-section icon standardization across SKILL.md files

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Inventory rule-header patterns across all SKILL.md via `grep -hnE "^#{2,4} "`
- [x] T002 Author the idempotent sweep script (`scratchpad/icon-sweep.py`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dry-run the sweep (`icon-sweep.py`) and eyeball the 95 planned header changes
- [x] T004 Apply the sweep via `icon-sweep.py --apply` (42 SKILL.md across 11 hubs; ❌→⛔ unified)
- [x] T005 Re-trim create-benchmark under the cap (`package_skill.py` → 4993 words)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Idempotency re-run (`icon-sweep.py` → 0 changes)
- [x] T007 sk-doc packaging sweep (`package_skill.py --check --strict` → 11/11 PASS)
- [x] T008 `parent-skill-check.cjs` STRICT on sk-doc, sk-design, sk-prompt, system-deep-loop (exit 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (idempotency + packaging + hub checks)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
