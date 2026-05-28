---
title: "Implementation Plan: 004 Tests"
description: "Plan for Vitest coverage of deterministic HLD/LLD behavior and wire contracts."
trigger_phrases:
  - "027 phase 002 test plan"
  - "code graph hld lld vitest plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded test plan"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-004-test-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 004 Tests

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | Fixture DB or DB-like contract doubles |
| **Testing** | Vitest |

### Overview

This child extracts the verification slice from the original parent packet. Tests should target the public contract and validate the audit constraints that make deterministic HLD/LLD safe: stable ordering, dangling-edge handling, primary module selection, open role contract, and JSON wire behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-contract` has shipped.
- [ ] Public testable entry points are known.
- [ ] Omni keep/remove decision is known for handler tests.

### Definition of Done
- [ ] Targeted Vitest suite passes.
- [ ] New HLD/LLD code reaches at least 80 percent coverage.
- [ ] Handler serialization is covered if in scope.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-level Vitest coverage with focused fixtures.

### Key Components
- **Fixture graph state**: Files, symbols, and edges that exercise deterministic behavior.
- **Generator tests**: HLD, LLD, classifier, and serialization.
- **Handler tests**: MCP handler success, malformed input, and optional omni JSON path.

### Data Flow
Tests construct deterministic fixture rows, call public contract-backed functions or handlers, and assert stable JSON output without relying on private helper internals.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-graph-hld-lld.vitest.ts` | New coverage | Create | Targeted Vitest run with coverage |
| `code-graph-hld-lld.ts` | Generator under test | Observe | Unit fixtures |
| `handlers/hld-lld.ts` | Handler under test | Observe | Integration fixtures |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import contract exports.
- [ ] Build reusable fixture graph state.
- [ ] Choose handler test path based on omni decision.

### Phase 2: Core Implementation
- [ ] Add deterministic large-symbol fixture.
- [ ] Add dangling-edge fixture.
- [ ] Add primary-module fixture.
- [ ] Add classifier and role fixtures.
- [ ] Add serialization and handler fixtures.

### Phase 3: Verification
- [ ] Run targeted Vitest with coverage.
- [ ] Run `npm run check`.
- [ ] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Generator contract and fixture behavior | Vitest |
| Integration | Handler JSON response and optional omni path | Vitest |
| Validation | Child spec structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Internal | Pending | Tests cannot compile |
| `002-lib-impl` | Internal | Parallel after contract | Generator assertions cannot pass |
| `003-handler` | Internal | Parallel after contract | Handler assertions cannot pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests are flaky or overfit unstable private implementation details.
- **Procedure**: Rework fixtures to assert public contract outputs and stable ordering rules only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Test authoring |
| Test authoring | Setup | Verification |
| Verification | Test authoring plus implementation children | Release |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Test authoring | Medium | 1.5-2 hours |
| Verification | Medium | 45 minutes |
| **Total** | | **2.5-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm tests use public contract imports.
- [ ] Confirm no snapshots capture unstable row order.

### Rollback Procedure
1. Revert flaky fixture changes.
2. Keep deterministic contract assertions.
3. Re-run targeted Vitest and strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
