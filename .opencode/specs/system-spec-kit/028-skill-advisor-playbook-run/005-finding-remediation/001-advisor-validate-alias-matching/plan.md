---
title: "Implementation Plan: advisor_validate Alias-Aware Gold Matching (F1a)"
description: "Resolve gold labels + topSkill through aliases.ts before comparison at the two advisor_validate match sites; verify the metric lift."
trigger_phrases:
  - "F1a plan alias matching"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/001-advisor-validate-alias-matching"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced approach"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: advisor_validate Alias-Aware Gold Matching (F1a)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server) |
| **Framework** | system-skill-advisor advisor_validate handler |
| **Storage** | corpus JSONL (labeled-prompts.jsonl) |
| **Testing** | advisor_validate MCP call + skill_advisor_regression.py |

### Overview
Introduce an alias-canonicalization step (reuse `lib/scorer/aliases.ts`) and apply it to both sides of the gold-vs-result comparison at the two match sites in `advisor-validate.ts`, so equivalent skill IDs count as matches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed (research/research.md §3 F1a, file:line evidence)
- [x] Target file + match sites identified
- [x] Projected metric lift quantified (74.09% / 65.0%)

### Definition of Done
- [ ] Both match sites alias-aware
- [ ] advisor_validate re-run shows the lift; no regression
- [ ] tsc + advisor-validate vitest pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure metric-layer fix: canonicalize-then-compare. No scorer/fusion change.

### Key Components
- **aliases.ts**: existing curated canonical groups (source of equivalence)
- **advisor-validate.ts**: gold-match sites (~266-275 aggregate, ~361-371 per-skill)

### Data Flow
For each corpus row: `canon(result.topSkill) === canon(expected)` where `canon()` maps a skill ID to its alias-group canonical form.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-validate.ts` gold-match (aggregate + per-skill) | strict `===` comparison | update to canonicalize both sides | re-run advisor_validate; full-corpus ~74% |
| `aliases.ts` | canonical groups | consume (no change) | grep deep-research/deep-review groups present |
| NC-003 scenario baseline (80.5%/77.5%) | documented expected | reconcile to post-fix numbers | doc check |

Inventories:
- Consumers of the gold-match result: aggregate accuracy, per-skill table, slices in the advisor_validate envelope — all benefit additively.
- Invariant: alias canonicalization must be idempotent and only widen matches (never turn a prior hit into a miss).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `advisor-validate.ts` match sites + `aliases.ts` export shape
- [ ] Confirm a canonicalization helper exists or add a small one

### Phase 2: Core Implementation
- [ ] Apply canonicalization to both sides at the aggregate match site
- [ ] Apply at the per-skill match site
- [ ] Ensure semantics are additive (only widen matches)

### Phase 3: Verification
- [ ] Re-run advisor_validate; confirm full-corpus ~74% / holdout ~65%
- [ ] Run skill_advisor_regression.py; confirm no new regressions
- [ ] tsc --noEmit + advisor-recommend/validate vitest
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | advisor_validate accuracy lift | MCP advisor_validate |
| Regression | corpus pass rate | skill_advisor_regression.py |
| Unit | validate handler | vitest tests/handlers/advisor-recommend.vitest.ts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `aliases.ts` groups | Internal | Green | Equivalence source |
| Live skill graph | Internal | Green | Provides topSkill |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Alias-aware matching over-counts or breaks a vitest.
- **Procedure**: Revert the comparison-site change (single file, additive); metric returns to prior behavior.
<!-- /ANCHOR:rollback -->
