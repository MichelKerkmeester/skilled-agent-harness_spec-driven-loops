---
title: "Implementation Plan: Regression-Harness Alias-Awareness & Stale Test Path"
description: "Apply alias-aware gold matching in both regression harnesses (reusing the phase-001 alias helper) and re-anchor the lane-weight-sweep test on a stable marker."
trigger_phrases:
  - "harness alias plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/007-harness-alias-and-stale-path"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "Specced approach"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Regression-Harness Alias-Awareness & Stale Test Path

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Python |
| **Framework** | system-skill-advisor regression/parity harnesses + vitest |
| **Storage** | regression fixtures JSONL + labeled corpus JSONL |
| **Testing** | skill_advisor_regression.py, advisor-validate evaluateRegressionCases, vitest |

### Overview
Two small, independent fixes: (1) resolve gold and top skill IDs through the published alias groups before comparison in both regression harnesses; (2) re-anchor `lane-weight-sweep.vitest.ts` workspace-root discovery on a stable marker rather than a renamed 026 packet path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause + file:line confirmed (surfaced during phase 002 verification)
- [x] Success criteria measurable (named P1 rows + full-suite green)
- [x] Dependencies identified (phase-001 alias helper)

### Definition of Done
- [ ] deep-* alias P1 rows pass in both harnesses
- [ ] lane-weight-sweep suite runs and passes
- [ ] P0 still 12/12 both scorers; no new regressions
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test/harness-layer fix; two small, independent changes. No scorer behavior change.

### Key Components
- **Regression harnesses**: gold-matching comparison resolved through `aliases.ts`.
- **lane-weight-sweep test**: workspace-root anchor.

### Data Flow
Harness reads fixture/corpus gold -> resolves both gold and scorer top through the alias map -> compares. Test resolves workspace root via a stable marker -> runs the sweep.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill_advisor_regression.py` gold compare | strict equality | resolve via alias map | deep-* P1 rows pass |
| `advisor-validate.ts` evaluateRegressionCases / corpus count | strict equality | apply `skillMatchesAlias` | deep-* P1 rows pass |
| `lane-weight-sweep.vitest.ts` findWorkspaceRoot | renamed packet path anchor | stable-marker anchor | suite runs |

Required inventories:
- Same-class producers: `rg -n 'skillMatchesAlias|canonicalSkillId' .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`.
- Consumers of changed symbols: `rg -n 'findWorkspaceRoot|expected === |=== gold|=== expected' .opencode/skills/system-skill-advisor/mcp_server`.
- Matrix axes: each alias group (deep-research, deep-review, deep-agent-improvement) x each harness (Python, TS).
- Algorithm invariant: alias resolution must be symmetric and limited to published groups; it must NOT collapse unrelated IDs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the alias groups in `aliases.ts` cover the failing labels
- [ ] Locate the gold-compare sites in both harnesses + the test anchor

### Phase 2: Core Implementation
- [ ] Alias-aware compare in `skill_advisor_regression.py`
- [ ] Alias-aware compare in `advisor-validate.ts` harness paths
- [ ] Re-anchor `lane-weight-sweep.vitest.ts` workspace root

### Phase 3: Verification
- [ ] Both regression harnesses: deep-* P1 rows pass; P0 stays 12/12
- [ ] `npm test` zero failed suites; Python unit suite green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | alias P1 rows + P0 | skill_advisor_regression.py |
| Unit | parity + sweep suites | vitest |
| Manual | spot-check alias rows | advisor probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `aliases.ts` alias groups | Internal | Green | Shipped in phase 001 |
| 026 current packet layout | Internal | Green | Needed to pick the new sweep anchor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Alias resolution masks a genuine mis-route, or the new test anchor is unstable.
- **Procedure**: Each change is small and independent; revert the offending harness or the test file separately.
<!-- /ANCHOR:rollback -->
