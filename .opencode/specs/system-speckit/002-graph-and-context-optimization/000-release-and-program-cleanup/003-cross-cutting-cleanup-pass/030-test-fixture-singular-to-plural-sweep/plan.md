---
title: "Implementation Plan: 056 Test Fixture Singular→Plural Sweep"
description: "Two-pass perl sweep across 7 advisor test files: single-line `.opencode', 'skill'` and multi-line split form, then verify advisor-suite failure count drops."
trigger_phrases:
  - "030-test-fixture-singular-to-plural-sweep plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/030-test-fixture-singular-to-plural-sweep"
    last_updated_at: "2026-05-08T10:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author plan for two-pass perl sweep"
    next_safe_action: "Apply sweep, capture before/after"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-test-fixture-singular-to-plural-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 056 Test Fixture Singular→Plural Sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript test fixtures (vitest) |
| **Storage** | In-memory + tmpdir |
| **Testing** | Vitest |

### Overview
Apply two-pass perl substitution across 7 advisor test files: pass 1 catches single-line forms (`'.opencode', 'skill'`, `'.opencode/skill/`), pass 2 catches multi-line split form using `-0777` slurp mode. After both passes: zero singular `.opencode/skill` references remain in the affected tests. Build dist, rerun advisor suite, capture before/after failure counts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec authored with file list and occurrence counts
- [x] Pre-change baseline captured: 37 advisor failures across 10 files

### Definition of Done
- [x] All path occurrences replaced (zero singular refs in affected files)
- [x] `npm run build` exits 0
- [x] Post-change advisor failure count ≤ 5 (target 0); residual unrelated to path rename documented
- [ ] `validate.sh --strict` exits 0
- [ ] implementation-summary.md filled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical sed/perl across test fixtures. No production code touched. No new modules.

### Key Components
- 7 test files in `mcp_server/skill_advisor/tests/`
- 2 perl invocations: single-line `sed -i ''` and multi-line `perl -i -0777 -pe`

### Data Flow
1. Pre-change: `rg "'\\.opencode/skill\\b\\|'\\.opencode', 'skill'" tests/` returns 30 hits.
2. Pass 1: single-line sed handles 23 hits.
3. Pass 2: multi-line perl handles 7 hits (split-line forms).
4. Verify: `rg` returns 0; `npx vitest run skill_advisor/tests/` reports failure count.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec authored
- [x] Plan authored
- [x] Pre-change baseline captured (37 failures)

### Phase 2: Implementation
- [x] Pass 1: single-line sed across 7 test files
- [x] Pass 2: multi-line perl across the same 7 test files
- [x] Verify zero residual singular references

### Phase 3: Verification
- [x] `npm run build` exits 0
- [x] `npx vitest run skill_advisor/tests/` reports 4 failures (down from 37; residual 4 are alias-canonicalization/Python-parity, unrelated to path rename)
- [ ] `validate.sh --strict` exits 0
- [ ] implementation-summary.md filled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | advisor-suite failure-count delta | `npx vitest run skill_advisor/tests/` |
| Manual | grep verification of zero residual singular refs | rg / grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 096 path-residue rename | Internal | Green (committed) | Pre-condition; without it the sweep is unnecessary |
| Packet 054 strict-sentinel hardening | Internal | Green (committed `88051ebaa`) | Sets the resolver expectation that tests must satisfy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Sweep introduces unexpected new failures (worst case ≤ 30 reverted lines).
- **Procedure**: `git checkout -- mcp_server/skill_advisor/tests/`; tests return to pre-sweep state.
<!-- /ANCHOR:rollback -->

---
