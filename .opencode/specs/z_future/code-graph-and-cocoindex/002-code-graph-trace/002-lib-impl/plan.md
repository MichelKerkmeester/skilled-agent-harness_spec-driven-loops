---
title: "Implementation Plan: 027/003/002 Trace Library"
description: "Plan for code-graph-trace.ts implementation."
trigger_phrases:
  - "027 003 002 plan"
  - "trace library plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace library plan"
    next_safe_action: "Implement resolver after local and upstream dependencies merge"
    blockers:
      - "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/001-contract"
      - "system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/002-lib-impl"
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-002-lib-impl-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 027/003/002 Trace Library

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit code graph |
| **Storage** | Existing code graph SQLite helpers |
| **Testing** | Vitest and `npm run check` |

Implement the resolver behind `code_graph_trace`. The implementation should be conservative: filePath ownership first, containment as display metadata, and Phase 001 as the architectural-role source.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Local `001-contract` is complete.
- [ ] Upstream `027/002/002-lib-impl` exposes the HLD/LLD classifier.

### Definition of Done
- [ ] Resolver conforms to `TraceTool`.
- [ ] Sparse containment, nested class, missing symbol, and depth-cap behavior are covered by tests.
- [ ] Strict child validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Resolver library with helper functions for file ownership, module policy, optional ancestry display, and classifier delegation.

### Key Components
- **Subject lookup**: loads the starting code node.
- **File ownership**: reads `CodeNode.filePath`.
- **Module policy**: maps file paths to module labels.
- **Role classifier**: delegates to Phase 001.

### Data Flow
Symbol id enters `traceSymbol`, the subject node supplies `filePath`, module policy derives the module rung, optional ancestry lookup decorates class display, and Phase 001 returns the architectural role.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-graph-trace.ts` | New resolver | Create | Unit tests |
| Phase 001 classifier | Role source | Consume | Equality test |
| code graph DB helpers | Node/edge access | Reuse | No direct SQL check |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import local contract and Phase 001 classifier.
- [ ] Identify existing DB helper calls.

### Phase 2: Core Implementation
- [ ] Implement subject lookup and filePath ownership.
- [ ] Implement module policy.
- [ ] Implement optional ancestry display and depth cap.
- [ ] Delegate architectural-role lookup to Phase 001.

### Phase 3: Verification
- [ ] Add/coordinate unit tests in `004-test`.
- [ ] Run type checks and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | FilePath ownership, module policy, depth cap | Vitest |
| Contract | Role equality with Phase 001 | Vitest |
| Validation | Child packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Local | Pending | No stable resolver interface |
| `027/002/002-lib-impl` | Cross-packet | Pending | No authoritative classifier |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Resolver returns incorrect ownership or breaks existing checks.
- **Procedure**: Revert `code-graph-trace.ts` and dependent tests before handler registration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Local and upstream contracts | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Handler/test integration |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core implementation | Medium | 2 hours |
| Verification | Medium | 1 hour |
| **Total** | | **~3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No migrations for MVP. Optional cache/package tables require separate rollback notes if added.
<!-- /ANCHOR:enhanced-rollback -->
