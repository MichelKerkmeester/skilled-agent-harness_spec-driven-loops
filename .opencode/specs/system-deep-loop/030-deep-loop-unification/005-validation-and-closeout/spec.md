---
title: "Feature Specification: Validation and Closeout — system-deep-loop"
description: "Final repo-wide validation sweep, worktree-drift check, and commit/push closeout for the deep-loop-workflows + deep-loop-runtime merge into system-deep-loop."
trigger_phrases:
  - "deep loop unification closeout"
  - "system-deep-loop validation"
  - "deep-loop merge final sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/005-validation-and-closeout"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Spec authored"
    next_safe_action: "Wait for 002+003 (and 004 if in scope) to land, then run the final sweep"
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

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Validation and Closeout — system-deep-loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-fallback-router-wiring (optional phase; logical predecessor is 003-external-reference-migration) |
| **Successor** | None — closes the packet |
| **Handoff Criteria** | `validate.sh --strict --recursive` clean on the whole packet; `system-deep-loop` committed and pushed; worktree-drift note published |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002-004 each carry their own exit gates, but nothing has yet confirmed the WHOLE packet is internally consistent, that the phase-parent's own `graph-metadata.json` reflects the final state, and that the merge is safely committed given a shared, actively-used dev tree with concurrent sessions (an established pattern in this repo — see the isolated-worktree commit-reconciliation approach used in prior sk-design phases).

### Purpose
Run the recursive strict validation gate, reconcile the phase-parent's own metadata, confirm the 17 live worktrees don't already show drift, and commit/push using the repo's established reconciliation pattern if the shared tree has diverged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `bash validate.sh .opencode/specs/system-deep-loop/030-deep-loop-unification --recursive --strict` (parent + all children).
- Regenerate the phase-parent's `description.json`/`graph-metadata.json` to reflect final completion state.
- One-line worktree-drift advisory (per spec.md's Risk #4): confirm no worktree merge is imminent that would reintroduce stale references; if one is, flag it rather than pre-emptively touching worktrees out of scope.
- Commit + push via the isolated-worktree reconciliation pattern if the shared tree has unrelated concurrent changes.

### Out of Scope
- Any further file changes beyond what 002/003/004 already produced — this phase verifies and closes, it does not implement.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `030-deep-loop-unification/description.json`, `graph-metadata.json` | Regenerate | Final completion state |
| Each child's `implementation-summary.md` | Create | Standard spec-kit completion doc, authored once that child's work is done |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recursive strict validation clean | `validate.sh --recursive --strict` exit 0 across parent + all children |
| REQ-002 | Committed and pushed | `git log` shows the merge commit(s) on the working branch; `git status --porcelain` clean for this packet's files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Worktree-drift advisory published | A one-paragraph note in this phase's `implementation-summary.md` on the 17-worktree situation |
| REQ-004 | Every child's `implementation-summary.md` reflects real, verified evidence | No carried-over scaffold language ("Planned", "not yet executed") remains in any completed child's final docs |
| REQ-005 | Isolated-worktree reconciliation used if the shared tree has diverged | No blind `git pull`/merge over a concurrent session's unrelated uncommitted changes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-deep-loop` is the only skill_id for this family, everywhere, validated.
- **SC-002**: The full packet (parent + 5 children) closes with `implementation-summary.md` files reflecting real, verified evidence — not placeholder claims.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared dev tree has unrelated concurrent-session changes at commit time | Low-Medium, established pattern | Use the isolated-worktree reconciliation pattern (fetch, confirm zero path overlap, commit own files only, worktree-push, `git update-ref`) rather than a blind pull/merge |
| Dependency | 002 + 003 (and 004 if in scope) must all pass their own exit gates first | This phase is a final sweep, not a fallback fixer | Explicitly sequenced last |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking.
<!-- /ANCHOR:questions -->
