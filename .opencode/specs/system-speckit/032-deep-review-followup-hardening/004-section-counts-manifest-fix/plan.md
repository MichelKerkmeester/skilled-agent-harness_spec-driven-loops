---
title: "Implementation Plan: Section-Counts Manifest Fix"
description: "Plan for swapping spec.md's expected-section derivation to the per-doc template contract."
trigger_phrases:
  - "section counts plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-deep-review-followup-hardening/004-section-counts-manifest-fix"
    last_updated_at: "2026-07-02T17:59:45Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented plan and verified the corrected section-count behavior"
    next_safe_action: "No follow-up required; packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-004-section-counts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Section-Counts Manifest Fix

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash rule + existing node template-structure helper |
| **Framework** | validate.sh registry-backed shell rules |
| **Testing** | test-validation-extended.sh + live before/after |

### Overview
Swap `_section_expected_spec_h2`'s derivation from the cross-doc `level-contract` sectionGates count to the per-doc `contract spec.md <level>` header count (the exact mechanism plan.md already uses), keep a documented fallback, update any fixtures that encoded the old inflated expectation, and prove the change with live before/after runs on known false-warning folders.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause read from source: sectionGates is cross-doc; plan.md path is the correct pattern.

### Definition of Done
- [x] spec.md expectation derives per-doc with fallback.
- [x] False warning gone on conforming folders; true warning preserved on a thin-spec fixture.
- [x] test-validation-extended.sh fully green; stale suite expectations were updated, no fixture content changed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Make the wrong path identical to the adjacent right path: one derivation mechanism (`_section_expected_template_h2`), parameterized by document.

### Key Components
- **`_section_expected_spec_h2`**: replaced or rewired to call the per-doc helper with `spec.md`.
- **Fallback**: mirrors plan.md's zero-guard with a level-appropriate default documented inline (durable WHY, no artifact ids).

### Data Flow
declared level -> template contract for spec.md -> required-header count -> minimum; actual `##` count compared against it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `check-section-counts.sh` in full; confirm `_section_expected_template_h2 "$helper" "$level" "spec.md"` returns the template's real per-level count for levels 1, 2, 3, 3+.

### Phase 2: Implementation
- [x] Swap the derivation; add the documented fallback default.
- [x] Sweep the fixture suite for encoded old expectations; update stale `053-template-compliant-level2` pass/warn expectations alongside.

### Phase 3: Verification
- [x] Live before/after on two known false-warning folders; thin-spec still warns (created and cleaned a scratch fixture).
- [x] Full test-validation-extended.sh run.
- [x] Docs: implementation-summary, checklist evidence, tasks marked.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Full fixture suite | test-validation-extended.sh |
| Live | Before/after on real folders, both warning directions | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| template-structure.js contract output | Internal | Available | Same dependency the plan.md path uses today |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fixture suite regressions or unexpected repo-wide warning changes in the wrong direction.
- **Procedure**: Revert the one rule file (and fixture updates); shell rules take effect immediately, no rebuild.
<!-- /ANCHOR:rollback -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

| Check | Status |
|-------|--------|
| Required docs read | Complete |
| Helper contract verified | Complete |
| Target rule read before edit | Complete |

### Execution Rules

| Rule | Application |
|------|-------------|
| TASK-SEQ | Read docs, confirm helper truth, edit, verify, document |
| TASK-SCOPE | Keep behavior limited to `SECTION_COUNTS` h2 expectations and stale suite assertions |

### Status Reporting Format

Report helper truth, before/after warning state, thin-spec warning state, suite result, and shellcheck result.

### Blocked Task Protocol

If helper truth or strict validation contradicts the plan, report `BLOCKED` with the exact command output and stop implementation changes.

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1 | None | Entry point |
| Phase 2 | Phase 1 | Helper behavior confirmed before swap |
| Phase 3 | Phase 2 | Verification targets the change |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Basis |
|-------|----------|-------|
| Phase 1 | Small | One file read + four helper invocations |
| Phase 2 | Small | Derivation swap + fixture sweep |
| Phase 3 | Small | Suite + two live checks |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Scenario | Detection | Action |
|----------|-----------|--------|
| Helper returns 0 for a valid level | Phase 1 confirmation step | Use fallback default; investigate helper separately, do not ship a zero minimum |
| Fixtures depended on inflated numbers | Suite failures | Update fixtures with the fix; expectations follow the template truth |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
template contract (spec.md, level) --> expected minimum --> comparison --> warn/pass
fixture suite + live folders --> verification
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Helper confirmation (Phase 1) — everything hangs on the per-doc counts being right.
2. Derivation swap.
3. Suite + live both-directions proof.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition |
|-----------|------------|
| M1: Truth confirmed | Per-doc counts verified for all four levels |
| M2: Swapped | Rule derives per-doc; fallback documented |
| M3: Proven | False warning gone, true warning kept, suite green |
<!-- /ANCHOR:milestones -->
