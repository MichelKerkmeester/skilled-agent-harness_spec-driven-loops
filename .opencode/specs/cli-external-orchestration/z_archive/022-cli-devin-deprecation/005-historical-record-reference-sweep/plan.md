---
title: "Plan: Phase 5: historical-record-reference-sweep"
description: "Technical plan for cli-devin deprecation phase 5"
trigger_phrases:
  - "phase 5 plan"
  - "historical-record-reference-sweep plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/022-cli-devin-deprecation/005-historical-record-reference-sweep"
    last_updated_at: "2026-06-08T17:36:07.655Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 5 plan executed"
    next_safe_action: "Proceed to phase 6"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 5: historical-record-reference-sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Apply broad-removal intent within Four-Laws limits: edit coherently-editable refs; preserve immutable records of completed work. Verified line-resolved edit list: ../context/context-report.md §2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every edit applied READ-first, scope-locked to named files.
- No dangling references, no broken syntax, no half-removed blocks.
- Verification command (below) passes before phase is marked complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Surgical reference/edit removal across the cli-devin active-wiring surface; no new abstractions. Canonical content that other skills depend on is re-homed rather than deleted (phase 1). Runtime executor union shrinks from 5 to 4 kinds; remaining executors unaffected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Audit specs/changelog/benchmark historical surface
2. Confirm descriptions.json cli-devin entries are historical spec rows (leave)
3. Preserve ~1760 narrative/benchmark records (editing falsifies completed-work records)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification command:

```bash
rg -l 'cli-devin' .opencode/specs | wc -l  # historical set intentionally preserved (documented carve-out)
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Predecessor phase complete (see ../spec.md phase map).
- Context Report (../context/context-report.md) as the authoritative edit list.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing is committed during execution; `git restore`/`git checkout` reverts the working-tree changes. Re-homed assets and the deleted skill directory are recoverable from git history until the operator commits.
<!-- /ANCHOR:rollback -->
