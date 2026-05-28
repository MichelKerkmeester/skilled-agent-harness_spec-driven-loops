---
title: "Implementation Plan: 001 Contract"
description: "Plan for publishing the TypeScript contract that unblocks HLD/LLD child phases."
trigger_phrases:
  - "027 phase 002 contract plan"
  - "hld lld contract plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/001-contract"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded contract plan"
    next_safe_action: "Implement contract exports"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-001-contract-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 001 Contract

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
| **Testing** | Typecheck plus downstream Vitest coverage |

### Overview

This child publishes the contract for deterministic HLD/LLD generation before any implementation child writes behavior. It extracts the parent setup slice: interfaces, role domain, unresolved-edge shape, deterministic ordering, and `classifyFileRole` signature.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Parent phase constraints reviewed.
- [ ] Role labels and open-string semantics captured.
- [ ] Stable ordering rule captured.

### Definition of Done
- [ ] Contract exports are importable.
- [ ] `FileRole` enum covers required baseline and reserved labels.
- [ ] Supporting types cover HLD, LLD, dependency, unresolved dependency, and complexity records.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first TypeScript exports.

### Key Components
- **`HldLldClassifier`**: Public interface for classifier behavior.
- **`FileRole`**: Baseline role constants plus reserved empty label.
- **Payload types**: HLD, LLD, dependencies, unresolved edges, and file narrative result.

### Data Flow
Implementation, handler, and tests import these types first. Behavior lands in child phases after contract validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-graph-hld-lld.ts` | New public surface | Create contract exports | Typecheck and import review |
| Phase 003 trace consumers | Downstream user of classifier role labels | Preserve open-string role semantics | Contract review |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Define role labels and open-string role type.
- [ ] Define graph-like DB input contract.

### Phase 2: Core Implementation
- [ ] Export `HldLldClassifier`.
- [ ] Export HLD, LLD, dependency, unresolved dependency, and file narrative types.
- [ ] Export `classifyFileRole(filePath, db)` signature.

### Phase 3: Verification
- [ ] Confirm downstream child specs can cite contract names.
- [ ] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Contract exports compile | TypeScript |
| Validation | Child spec structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent phase parent | Internal | Available | Contract scope unclear |
| Existing code graph row concepts | Internal | Available | Types cannot map to graph data |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Contract names conflict with existing code_graph exports.
- **Procedure**: Rename contract exports before downstream children implement against them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract setup | None | Contract export |
| Contract export | Contract setup | Children 002, 003, 004 |
| Validation | Contract export | Parallel implementation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract setup | Low | 10 minutes |
| Contract export | Low | 20 minutes |
| Validation | Low | 10 minutes |
| **Total** | | **40 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm no behavior is added in this child beyond contract exports.
- [ ] Confirm downstream children have not started against a different shape.

### Rollback Procedure
1. Revert contract export changes.
2. Re-run strict validation for this child.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
