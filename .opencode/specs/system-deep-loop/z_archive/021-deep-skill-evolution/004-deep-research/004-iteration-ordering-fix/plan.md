---
title: "Implementation Plan: 120 DR-006 fix"
description: "Single-file numeric-sort fix + regression test."
trigger_phrases:
  - "120 plan"
importance_tier: "important"
contextType: "fix"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/004-deep-research/004-iteration-ordering-fix"
    last_updated_at: "2026-05-23T05:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored."
    next_safe_action: "Commit + push."
    blockers: []
    session_dedup:
      fingerprint: "sha256:1201201201201201201201201201201201201201201201201201201201200001"
      session_id: "116-deep-skill-evolution/004-deep-research/004-iteration-ordering-fix"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: 120 — DR-006 Numeric Sort Fix

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Replace default `.sort()` with numeric extractor at `reduce-state.cjs:874`. Add 1 regression test to `deep-research-reducer.vitest.ts`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] DR-006 test PASS
- [x] Existing 5 tests still PASS (with vitest filter)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Single comparator change. No new files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Locate bug at reduce-state.cjs:874

### Phase 2: Implementation

- [x] Patch `.sort()` to numeric comparator with regex extractor
- [x] Add DR-006 regression test with unpadded fixture (`iteration-1.md`, `iteration-2.md`, `iteration-10.md`, `iteration-11.md`)

### Phase 3: Verification

- [x] vitest -t "DR-006" PASS
- [x] strict-validate PASS
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

vitest regression test. Manual smoke not needed (pure function fix).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single-file change. No data migration; no schema impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) → Phase 2 (Implementation) → Phase 3 (Verification)
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Setup | 5 min (locate line) |
| Implementation | 10 min (sed + test author) |
| Verification | 5 min (vitest + strict-validate) |
| **Total** | **~20 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] DR-006 test PASS before merge
- [x] No new dependencies

### Rollback Procedure
1. `git revert <commit>` — single-file change, clean revert
2. Re-run existing vitest — confirm no regression in other tests
<!-- /ANCHOR:enhanced-rollback -->
