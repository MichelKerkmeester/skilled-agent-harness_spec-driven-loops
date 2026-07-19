---
title: "Implementation Plan: 027/003/004 Trace Tests"
description: "Plan for code-graph-trace.vitest.ts contract tests."
trigger_phrases:
  - "027 003 004 plan"
  - "trace test plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/002-code-graph-trace/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace test plan"
    next_safe_action: "Implement tests after local contract publishes"
    blockers:
      - "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/001-contract"
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-004-test-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 027/003/004 Trace Tests

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Vitest |
| **Storage** | Test code graph fixtures |
| **Testing** | `npx vitest run code-graph-trace.vitest.ts --coverage` |

Build contract-driven tests for the trace resolver. The tests should make the pt-02 findings executable: sparse containment cannot break file/role output, nested classes need fqName matching, and role output must match Phase 001.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Local `001-contract` is complete.
- [ ] Test fixture shape for code graph nodes and edges is known.

### Definition of Done
- [ ] Sparse, nested-class, role-equality, missing-symbol, and depth-cap tests exist.
- [ ] Coverage for new trace code reaches at least 80 percent.
- [ ] Strict child validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-level Vitest suite with focused fixtures.

### Key Components
- **Fixture builder**: creates code nodes and containment edges.
- **Contract assertions**: checks result fields rather than internals.
- **Classifier equality assertion**: compares trace role to Phase 001.

### Data Flow
Fixtures create a minimal graph state, the trace tool runs against that state, and assertions verify public trace output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-graph-trace.vitest.ts` | New test suite | Create | Vitest |
| Trace fixtures | Graph state | Create or extend | Fixture assertions |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import contract and fixture helpers.
- [ ] Identify classifier import for role equality.

### Phase 2: Implementation
- [ ] Add sparse-containment tests.
- [ ] Add nested-class regression test.
- [ ] Add role-equality test.
- [ ] Add depth-cap and missing-symbol tests.

### Phase 3: Verification
- [ ] Run Vitest with coverage.
- [ ] Run `npm run check`.
- [ ] Run strict child validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Trace contract behavior | Vitest |
| Coverage | New trace code | Vitest coverage |
| Validation | Child packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Local | Pending | No stable test target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests are flaky or assert implementation details.
- **Procedure**: Replace brittle assertions with contract-level checks and rerun the suite.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Test implementation |
| Test implementation | Setup | Verification |
| Verification | Test implementation | Phase completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Test implementation | Medium | 1 hour |
| Verification | Low | 30 minutes |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migrations. Revert test file changes or fixture additions, then rerun checks.
<!-- /ANCHOR:enhanced-rollback -->
