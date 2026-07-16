---
title: "Plan: Phase 6: delete-skill-directory-and-verify"
description: "Technical plan for cli-devin deprecation phase 6"
trigger_phrases:
  - "phase 6 plan"
  - "delete-skill-directory-and-verify plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/022-cli-devin-deprecation/006-delete-skill-directory-and-verify"
    last_updated_at: "2026-06-08T17:36:07.655Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 6 plan executed"
    next_safe_action: "Operator commits change-set"
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
# Plan: Phase 6: delete-skill-directory-and-verify

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Delete the cli-devin skill directory and verify zero active references, sound dispatch, clean CI — closed by adversarial deep review. Verified line-resolved edit list: ../context/context-report.md §2.
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

1. rm -rf .opencode/skills/cli-devin/
2. Global verification grep (active surface = 0)
3. Run touched test suites + CI gate
4. 4-seat adversarial deep review + fix confirmed findings
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification command:

```bash
rg -n 'cli-devin/' (active, excl historical/provenance) = 0; deep-loop-runtime 56 + deep-improvement 23 + advisor 5 tests pass; CI exit 0
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
