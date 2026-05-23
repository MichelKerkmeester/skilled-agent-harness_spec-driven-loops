---
title: "Implementation Plan: 116/007 - Ledger-Led Graph Vocabulary"
description: "Plan for extending review coverage-graph node vocabulary while preserving ledger-led graphless fallback semantics."
trigger_phrases:
  - "review graph vocabulary plan"
  - "ledger-led graph"
  - "BUG_CLASS node"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab"
    last_updated_at: "2026-05-22T12:18:31Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Planned and implemented Phase G graph vocabulary extension."
    next_safe_action: "Commit handoff."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1160077100000000000000000000000000000000000000000000000000000000"
      session_id: "116-007-plan"
      parent_session_id: "116-007-ledger-led-graph-vocabulary"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 116/007 - Ledger-Led Graph Vocabulary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OPENCODE system-spec-kit |
| **Languages** | TypeScript, YAML, Markdown |
| **Runtime** | MCP server coverage graph upsert handler |
| **Testing** | Vitest filters: `review-depth-graph`, `review-depth-`, `coverage-graph` |

### Overview
Phase G adds five ledger-led review node kinds to the coverage graph: `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`. The smallest correct implementation is to extend the central `ReviewNodeKind` type and `VALID_KINDS.review` runtime list, then mirror that vocabulary in both deep-review YAML event filters.

The upsert handler already validates node kinds dynamically through `VALID_KINDS[loopType]`, so no handler rewrite is required. The Phase B graph fixture becomes the positive-path regression test for this contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase context identifies Phase G as graph-vocabulary work after ledger, reducer, and STOP-gate phases.
- [x] Active modification surfaces are explicit and bounded.
- [x] Existing relation vocabulary reviewed before adding any relation.
- [x] Phase B skipped tests identified as the seeded fixture to enable.

### Definition of Done
- [x] New review node kinds added to type and runtime allow-list.
- [x] Auto and confirm YAML event filters accept the same new node kinds.
- [x] Phase B placeholder graph tests are un-skipped and pass.
- [x] Existing `coverage-graph` tests pass.
- [x] Level 2 spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Central allow-list with mirrored workflow filter.

### Key Components
- **Coverage graph DB module**: Owns `ReviewNodeKind`, `VALID_KINDS`, and `VALID_RELATIONS`.
- **Coverage graph upsert handler**: Reads `VALID_KINDS[loopType]` and `VALID_RELATIONS[loopType]` during validation.
- **Deep-review auto workflow**: Normalizes graph event node kinds before MCP upsert.
- **Deep-review confirm workflow**: Mirrors the auto workflow for manual confirmation mode.
- **Review-depth graph fixture**: Proves new review node kinds are accepted by the handler and persistence layer.

### Data Flow
1. A review iteration emits `graphEvents`.
2. YAML workflow normalization uppercases node kind values.
3. Node events are kept only if the kind is in the review event-filter allow-list.
4. The MCP upsert handler validates each node against `VALID_KINDS.review`.
5. Accepted nodes are persisted in the coverage graph database.
6. Existing relation validation continues to control edges.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [x] Read research synthesis and Phase G context.
- [x] Read Level 2 template examples.
- [x] Inspect `coverage-graph-db.ts`, `upsert.ts`, auto YAML, confirm YAML, and `review-depth-graph.vitest.ts`.

### Phase 2: Vocabulary Implementation
- [x] Extend `ReviewNodeKind` with `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`.
- [x] Extend `VALID_KINDS.review` with the same five values.
- [x] Leave `VALID_RELATIONS.review` unchanged because existing relations cover the requested mappings.
- [x] Confirm upsert handler validation remains dynamic.

### Phase 3: Workflow Projection
- [x] Extend `deep_start-review-loop_auto.yaml` graph event node-kind filter.
- [x] Mirror the same extension in `deep_start-review-loop_confirm.yaml`.
- [x] Keep edge relation filtering unchanged.

### Phase 4: Fixture Activation
- [x] Convert the pre-G `BUG_CLASS` failure fixture to a post-G success assertion.
- [x] Remove `.skip()` from the parameterized new-kind fixture tests.
- [x] Assert successful upsert and no validation errors for the new kinds.

### Phase 5: Verification and Documentation
- [x] Run targeted Phase B graph fixture.
- [x] Run all `review-depth-` fixtures.
- [x] Run existing `coverage-graph` tests.
- [x] Populate Level 2 docs and refresh metadata.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Targeted fixture | Phase G graph node vocabulary | `pnpm vitest run --no-coverage review-depth-graph` from `.opencode/skills/system-spec-kit/mcp_server` |
| Fixture sweep | Phase B review-depth fixture family | `pnpm vitest run --no-coverage review-depth-` from `.opencode/skills/system-spec-kit/mcp_server` |
| Regression | Existing coverage graph behavior | `pnpm vitest run --no-coverage coverage-graph` from `.opencode/skills/system-spec-kit/mcp_server` |
| Spec validation | Level 2 packet contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab --strict` |

Positive-path coverage comes from `review-depth-graph.vitest.ts`: it imports the real upsert handler, creates an isolated temporary DB dir, and verifies that each new review node kind persists successfully.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase B seeded graph fixture | Test harness | Green | No positive proof that pre-G graph failures are fixed. |
| Existing coverage graph DB module | Runtime allow-list owner | Green | Upsert validation cannot accept new node kinds. |
| Deep-review auto/confirm YAML mirrors | Workflow projection | Green | Graph events could be accepted by runtime but discarded by workflow filters. |
| Existing review relation vocabulary | Edge semantics | Green | New relation expansion would require ADR-style justification. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New node kinds cause coverage graph regression or command mirror drift.
- **Procedure**: Revert changes to `coverage-graph-db.ts`, both deep-review YAML filters, and `review-depth-graph.vitest.ts`.
- **Preserve**: Earlier ledger, reducer, warning, and STOP-gate phases remain intact because this phase changes only graph vocabulary projection.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase B fixture harness
        |
        v
Phase C-F ledger / persistence / STOP gates
        |
        v
Phase G graph vocabulary projection
        |
        v
Phase H playbooks and defaults
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Pre-approved Phase G scope | Vocabulary Implementation |
| Vocabulary Implementation | Coverage graph allow-list ownership | Workflow Projection, Fixture Activation |
| Workflow Projection | New node-kind list | Verification |
| Fixture Activation | Runtime allow-list update | Verification |
| Verification | Implementation and docs | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | 20 minutes |
| Vocabulary Implementation | Low | 15 minutes |
| Workflow Projection | Low | 10 minutes |
| Fixture Activation | Low | 15 minutes |
| Verification and Documentation | Medium | 45 minutes |
| **Total** | | **1.5-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Runtime allow-list change is isolated to review node kinds.
- [x] Relation allow-list remains unchanged.
- [x] Auto and confirm command assets stay mirrored.

### Rollback Procedure
1. Revert `ReviewNodeKind` and `VALID_KINDS.review` additions.
2. Revert auto and confirm YAML node-kind filter additions.
3. Restore the Phase B graph fixture to skipped future-contract tests if Phase G is withdrawn.
4. Re-run `review-depth-graph` and `coverage-graph` filters.
5. Update this packet's implementation summary with rollback evidence.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: No database migration rollback is required; existing graph rows with new kinds would be legacy data only if generated before rollback.
<!-- /ANCHOR:enhanced-rollback -->
