---
title: "Implementation Plan: 002 Library Implementation"
description: "Plan for implementing deterministic HLD/LLD generation against the contract."
trigger_phrases:
  - "027 phase 002 lib impl plan"
  - "code graph hld lld implementation plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded library plan"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-002-lib-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 002 Library Implementation

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
| **Storage** | Existing code_graph SQLite tables |
| **Testing** | Vitest via child 004 |

### Overview

This child implements the generator slice from the original parent plan. It takes the contract from `001-contract` and fills deterministic HLD/LLD behavior using existing code graph query helpers, stable ordering, and documented unresolved-edge handling.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-contract` has shipped.
- [ ] Dangling-edge policy is selected.
- [ ] Stable sort helper contract is available.

### Definition of Done
- [ ] HLD, LLD, and file narrative generation work.
- [ ] Classifier export matches HLD role output.
- [ ] Implementation remains schema-free and dependency-free.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic generator library.

### Key Components
- **HLD generator**: File role, layer, summary, primary symbols.
- **LLD generator**: Signature, docstring, direct dependencies, complexity hints.
- **Ordering helpers**: Stable sorting before every capped collection.
- **Classifier helpers**: Public `classifyFileRole` and internal layer heuristics.

### Data Flow
The library reads existing graph rows through the accepted DB-like contract, normalizes and sorts candidates, renders template-driven HLD/LLD records, and returns JSON-serializable data.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-graph-hld-lld.ts` | New generator | Create | Unit tests in child 004 |
| Existing code graph DB APIs | Data source | Read only | Typecheck and fixture tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import contract exports.
- [ ] Select dangling-edge policy.
- [ ] Define constants for caps, thresholds, and role priority.

### Phase 2: Core Implementation
- [ ] Implement stable sort helper.
- [ ] Implement `classifyFileRole`.
- [ ] Implement `generateHLD`.
- [ ] Implement `generateLLD`.
- [ ] Implement `generateFileNarrative`.

### Phase 3: Verification
- [ ] Run targeted unit tests from child 004.
- [ ] Run typecheck and strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Generator helpers, classifier, sorting, dangling edges | Vitest |
| Static | Type contract conformance | TypeScript |
| Validation | Child spec structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Internal | Pending | Cannot implement against stable imports |
| Existing code graph query helpers | Internal | Available | Generator cannot read graph state |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Generator breaks typecheck, existing context behavior, or deterministic tests.
- **Procedure**: Revert library implementation while keeping contract child intact if downstream consumers still need it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Handler and tests |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core implementation | Medium | 2-3 hours |
| Verification | Medium | 1 hour |
| **Total** | | **3.25-4.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm no schema migration is introduced.
- [ ] Confirm no parser/indexer code is touched.

### Rollback Procedure
1. Revert `code-graph-hld-lld.ts` implementation.
2. Re-run targeted tests and typecheck.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
