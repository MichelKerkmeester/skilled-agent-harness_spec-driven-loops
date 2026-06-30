---
title: "Implementation Plan: design-audit impeccable adoption"
description: "Per-file build plan applying the design-audit slice of the 028 impeccable backlog via cli-codex gpt-5.5 high fast, scope-locked, additive, skip-if-present, with independent fresh-Opus verification."
trigger_phrases:
  - "033-audit-impeccable-adoption plan"
  - "impeccable audit adoption plan"
  - "sk-design impeccable audit plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/033-audit-impeccable-adoption"
    last_updated_at: "2026-06-27T15:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the audit build plan"
    next_safe_action: "Finalize and validate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-033-audit-impeccable-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: design-audit impeccable adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown design-guidance docs in the design-audit mode |
| **Framework** | system-spec-kit phase; cli-codex gpt-5.5 high fast |
| **Storage** | n/a |
| **Testing** | `validate.sh --strict`; per-diff scope-lock; fresh-Opus verification |

### Overview
Apply the audit slice of the 028 backlog into the named live references via one scope-locked cli-codex dispatch, then an independent fresh-Opus reviewer verifies each item landed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 028 backlog names the audit items + files
- [x] Target files confirmed present
- [x] Executor confirmed (cli-codex gpt-5.5 high fast)

### Definition of Done
- [x] Items applied additively; nothing already-present duplicated
- [x] Fresh-Opus reviewer returned PASS
- [x] `validate.sh --strict` clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Anchor-scoped additive edits applied by a scope-locked codex dispatch, then independently verified by a fresh Opus agent.

### Key Components
- **cli-codex gpt-5.5 high fast**: reads each file, adds the named items, skips present content.
- **Fresh Opus reviewer**: zero-context independent verification against the backlog.

### Data Flow
028 backlog -> scope-locked prompt -> codex edit -> diff review -> fresh-Opus verify -> finalize.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/design-audit/references/anti_patterns_production.md` | mode reference | add the named items | diff additive, fresh-Opus PASS |
| `sk-design/design-audit/references/hardening_edge_cases.md` | mode reference | add the named items | diff additive, fresh-Opus PASS |

Required inventories:
- Same-class producers: additive guidance; no shared symbol changes.
- Consumers of changed symbols: none — human-read design docs.
- Matrix axes: backlog audit items x their references; skip-if-present per edit.
- Algorithm invariant: additive, evergreen, no new mode, no ruled-out system.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase folder + spec/plan/tasks scaffolded
- [x] Target files confirmed; executor confirmed

### Phase 2: Core Implementation
- [x] Scope-locked codex dispatch applied the items; skipped present content

### Phase 3: Verification
- [x] Diff scope-lock verified; fresh-Opus reviewer returned PASS
- [x] `validate.sh --strict` clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (doc edits) | n/a |
| Integration | Mode-internal consistency | Read/Grep |
| Manual | Per-diff scope-lock + fresh-Opus verification | git diff, fresh Opus agent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 028 backlog | Internal (read-only) | Green | No spec |
| Live references | Internal | Green | Nothing to edit |
| cli-codex gpt-5.5 high fast | External | Green | Edits cannot apply |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an edit drifts scope, duplicates, or the fresh-Opus reviewer fails it.
- **Procedure**: `git checkout -- <file>` to revert, then re-dispatch with a tighter prompt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup --> Dispatch --> Verify (fresh-Opus) --> Finalize
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verify |
| Verify + finalize | Dispatch | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | scaffolded |
| Dispatch | Med | one focused codex dispatch |
| Verify + finalize | Med | fresh-Opus review + wrapper docs + validation |
| **Total** | | **1 dispatch + fresh-Opus verify** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The 028 deliverable preserved
- [x] Target files under git; per-file revert clean
- [x] Fresh-Opus reviewer passed before finalizing

### Rollback Procedure
1. Identify the flagged file
2. `git checkout -- <file>`
3. Re-dispatch with a tighter scope-locked prompt

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
028 backlog --> codex dispatch --> fresh-Opus verify --> finalize
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 028 backlog | (read-only) | edit spec | the dispatch |
| codex dispatch | backlog | live edits | verification |
| fresh-Opus verify | dispatch | PASS verdict | finalize |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Scope-locked dispatch** - the live edits - CRITICAL
2. **Fresh-Opus verification** - independent confirmation - CRITICAL
3. **Validation** - strict packet validation - CRITICAL

**Total Critical Path**: Setup -> dispatch -> fresh-Opus verify -> validate.

**Parallel Opportunities**:
- This phase ran concurrently with its sibling impeccable phases (disjoint files).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Edits live | named items applied at anchors | Phase 2 |
| M2 | Fresh-Opus verified | reviewer returned PASS | Phase 3 |
| M3 | Validated | strict validation clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---
