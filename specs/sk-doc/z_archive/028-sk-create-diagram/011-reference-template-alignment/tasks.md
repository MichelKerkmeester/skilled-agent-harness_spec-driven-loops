---
title: "Tasks: sk-create-diagram reference template alignment"
description: "Task queue for the 2-stream reference alignment dispatch."
trigger_phrases:
  - "diagram reference alignment tasks"
importance_tier: "important"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/011-reference-template-alignment"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; overview-section gap documented"
    next_safe_action: "Move to phase 012"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram reference template alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Audit all 10 named files against the template's literal structure; classify each as confirmed-broken or needs-deeper-audit [EVIDENCE: grep-based divider/casing scan on `10/10` files, cross-checked against the template's own body plus 2 already-conformant sibling files.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Dispatch Stream A (deepseek/deepseek-v4-flash): fix dividers + casing in the 4 confirmed-broken files [EVIDENCE: PASS on `4/4` files — 35 dividers inserted total, 43 headers uppercased, self-reported and independently confirmed.]
- [x] T003 Independently verify Stream A's claimed changes [EVIDENCE: re-grepped divider/casing counts on all 4, 0 mismatches; `git diff` shows only header/divider lines changed.]
- [x] T004 Dispatch Stream B (openai/gpt-5.6-luna-fast --variant max): deeper template audit + fix on the 6 remaining files [EVIDENCE: first attempt self-refused (misapplied cli-opencode's self-invocation guard to itself, 0 edits); retried with a corrected prompt — 3/6 FIXED (intro tightened), 3/6 PASS (no defect found).]
- [x] T005 Independently verify Stream B's claimed changes [EVIDENCE: `git diff --stat` confirms exactly 3 files changed (1 line each), 3 files 0 diff; `validate_document.py` re-run directly by orchestrator on all 6, confirms clean.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run `validate_document.py --type reference` on all 10 files [EVIDENCE: 5/10 clean; 5/10 fail a pre-existing, out-of-scope "missing overview section" rule — documented in `implementation-summary.md`, not silently claimed clean.]
- [x] T007 Write `implementation-summary.md`
- [x] T008 Write `checklist.md` [EVIDENCE: `checklist.md` in this folder, `9/9` sections filled, all completed items with `[EVIDENCE: ...]` brackets.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required tasks marked [x]
- [x] No [B] tasks remain
- [x] 10/10 files structurally aligned (dividers, casing, intro de-duplication) — the phase's declared scope; the separate overview-section gap is documented, not silently claimed clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
