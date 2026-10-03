---
title: "Implementation Plan: Phase 2: architecture decision"
description: "Record the operator-approved sk-code parent architecture in decision-record.md from the phase 001 evidence, with no skill, advisor, command or agent files touched."
trigger_phrases:
  - "sk-code architecture decision plan"
  - "sk-code decision record plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/002-architecture-decision"
    last_updated_at: "2026-10-03T15:27:06Z"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Reconstructed plan from spec and decision record"
    next_safe_action: "None; phase complete, build continues in 003"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: architecture decision

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Spec-kit markdown only |
| **Framework** | None |
| **Storage** | `decision-record.md` in this phase folder |
| **Testing** | Operator acceptance of the decision record |

### Overview
Phase 001 produced a decision-ready recommendation (`../001-research-and-context/research/research.md`). This phase binds it: `decision-record.md` records the five phase-mode taxonomy over one shared surface router, the structural rules, the `sk-code-review` fold-in as `code-review`, the options considered and the regression-first build sequence for phases 003 to 009. The operator accepted the recommended design ("Go with recommended", 2026-07-03), so the phase records rather than deliberates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 research and context map available as evidence
- [x] Operator decision on the recommended design received (2026-07-03)
- [x] Scope boundary set: capture the decision only

### Definition of Done
- [x] `decision-record.md` accepted by the operator
- [x] Build sequence 003 to 009 defined in `decision-record.md` section 5
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Nested parent hub, mirroring `sk-design`: five phase/activity mode packets over one shared surface router.

### Key Components
- **Mode taxonomy**: `code-implement`, `code-quality`, `code-debug`, `code-verify`, `code-review` (decision record section 3.1).
- **Structural rules**: surface detection in hub `shared/`, exactly one `graph-metadata.json`, `mode-registry.json` plus `hub-router.json`, legacy `sk-code-review` alias kept through cutover (section 3.2).
- **Build sequence**: regression-first, fixtures frozen before phase 003 (section 5).

### Data Flow
Phase 001 evidence feeds the decision record, which governs phases 003 to 009.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a fix. The only surface this phase writes is its own decision record.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `decision-record.md` | Binding architecture decision | create | Status section reads Accepted, 2026-07-03 |
| Skill, advisor, command and agent files | Build targets for 003+ | unchanged | `spec.md` scope boundary |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Review | Decision record content against phase 001 evidence | Operator acceptance |
| Deferred | Routing parity and structural checks | Phases 003 to 009 (`parent-skill-check.cjs`, `validate.sh`) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../001-research-and-context/` evidence | Internal | Green | No basis for the decision |
| Build isolation (worktree or in-place) | Operational | Open question in `spec.md` | Phase 003 shared-file edits wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The operator withdraws or supersedes the accepted architecture.
- **Procedure**: Mark the decision superseded in a new decision record; the build-phase rollback points are in `decision-record.md` section 7.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 evidence | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Not recorded |
| Implementation | Low | Not recorded |
| Verification | Low | Not recorded |
| **Total** | | **Not recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Rollback Procedure
1. Supersede the decision with a new record rather than editing the accepted one.
2. Re-plan the affected build phases from the new record.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
