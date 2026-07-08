---
title: "Implementation Plan: Validation and Closeout"
description: "Plan for the final recursive validation sweep and commit/push closeout of the system-deep-loop merge."
trigger_phrases:
  - "deep loop unification closeout plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/005-validation-and-closeout"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan, not yet executed"
    next_safe_action: "Wait for 002+003 to land, then run the final sweep"
    blockers:
      - "Depends on 002 and 003 landing first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-005-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Validation and Closeout

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | N/A — validation/process packet |
| **Framework** | `validate.sh --recursive --strict`, `generate-description.js`, `backfill-graph-metadata.js` |
| **Testing** | N/A directly; consumes 002/003/004's own test results |

### Overview
A final sweep, not new implementation. Regenerates the phase-parent's metadata, runs recursive strict validation, and commits/pushes using the repo's established isolated-worktree reconciliation pattern if the shared dev tree has diverged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 002 and 003 (and 004, if in scope) have each passed their own exit gates.

### Definition of Done
- [ ] `validate.sh --recursive --strict` exit 0 on the whole packet.
- [ ] Committed and pushed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standard system-spec-kit completion sweep: regenerate metadata → recursive strict validate → author `implementation-summary.md` per child with real evidence → commit (isolated-worktree reconciliation if the shared tree has unrelated concurrent changes) → push.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 002/003(/004) all report their own exit gates green.

### Phase 2: Core Implementation
- [ ] Regenerate `052-deep-loop-unification/description.json` + `graph-metadata.json`.
- [ ] Author each child's `implementation-summary.md` with real evidence (not placeholder claims).
- [ ] One-paragraph worktree-drift advisory note.

### Phase 3: Verification
- [ ] `bash validate.sh .opencode/specs/system-deep-loop/052-deep-loop-unification --recursive --strict` exit 0.
- [ ] `git status --porcelain` scoped review before commit.
- [ ] Commit + push (isolated-worktree reconciliation pattern if needed).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Recursive strict spec validation | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002, 003 (004 optional) | Internal | Pending | This phase cannot start until they land |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Recursive validation fails.
- **Procedure**: Fix the specific validator complaint in the offending child phase's docs; re-run; this phase makes no code changes of its own to roll back.
<!-- /ANCHOR:rollback -->
