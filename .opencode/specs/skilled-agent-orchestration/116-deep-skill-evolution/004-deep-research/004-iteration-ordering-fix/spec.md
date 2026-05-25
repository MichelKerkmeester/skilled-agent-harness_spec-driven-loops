---
title: "Feature Specification: 120 — Deep-Research Iteration Ordering Fix (DR-006)"
description: "Numeric-sort fix at reduce-state.cjs:874 to prevent lexical ordering bug where iteration-10.md sorts before iteration-2.md. Per 119 deep-research uplift packet 1."
trigger_phrases:
  - "DR-006 lexical sort fix"
  - "deep-research iteration ordering"
  - "120 deep-research"
importance_tier: "important"
contextType: "fix"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/004-deep-research/004-iteration-ordering-fix"
    last_updated_at: "2026-05-23T05:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Fix applied + DR-006 vitest passing."
    next_safe_action: "Commit + push."
    blockers: []
    completion_pct: 100
    key_files:
      - ".opencode/skills/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1201201201201201201201201201201201201201201201201201201201200000"
      session_id: "116-deep-skill-evolution/004-deep-research/004-iteration-ordering-fix"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 120 — Deep-Research Iteration Ordering Fix

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented (test passing); awaiting commit |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Predecessor** | 119/001/research-report.md (Theme A — Chronological State Correctness) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`reduce-state.cjs:874` uses default `.sort()` (lexical) on iteration filenames. For runs with ≥10 iterations using unpadded names (`iteration-1.md`, `iteration-2.md`, ..., `iteration-10.md`), lexical sort places `iteration-10.md` between `iteration-1.md` and `iteration-2.md`. Dashboards + chronological synthesis get out-of-order entries.

Surfaced by deep-review iter-5 (`DR-006`); confirmed by iter-7 + iter-8.

### Purpose

Fix the sort to be numeric on the trailing iter number. Add a regression test exercising unpadded names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Modify `.opencode/skills/deep-research/scripts/reduce-state.cjs` sort comparator
- Add regression test exercising unpadded iter filenames

### Out of Scope
- 121 + 122 follow-ons (separate packets)
- Renaming any existing iter file
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Numeric sort on `iteration-NNN.md` | DR-006 test PASS |
| REQ-002 | No regression in existing 5 tests | Existing tests still pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: DR-006 test PASS in `deep-research-reducer.vitest.ts`
- SC-002: Strict-validate PASS
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Test depends on `makeFixtureSpecFolder` template | Test reuses fixture strategy via fs.copyFileSync |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01** (Performance): comparator runs once per reducer invocation; O(n log n) on ≤100 iter files; negligible.
- **NFR-R01** (Reliability): regex `?? '0'` fallback prevents crash on unexpected filenames.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Mixed padded + unpadded (`iteration-001.md`, `iteration-2.md`): both extract numerically → correct order.
- Files matching regex but with leading zeros (`iteration-007.md`): `parseInt` handles octal-look safe (radix 10 explicit).
- Empty iterations dir: handled by upstream `existsSync` check.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Single-file fix |
| Risk | 4/25 | Test-covered regression fix |
| Research | 2/20 | Root cause documented in 119 packet |
| Multi-Agent | 1/15 | Single-author |
| Coordination | 2/15 | None |
| **Total** | **14/100** | **Level 2** |
<!-- /ANCHOR:complexity -->
