---
title: "Feature Specification: Phase 8 — Finalize + Commit"
description: "Final packet: strict-validate every 014 child packet + parent, refresh memory continuity, write the bundled conventional commit summary, and document the post-merge verification checklist (24h tcpdump, q4 opt-in, 009 follow-on). The actual `git add` + `git commit` is left to the user since commits are auth-bearing actions."
trigger_phrases:
  - "008 finalize commit"
  - "014 bundled commit"
  - "local embeddings final PR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/008-finalize-and-commit"
    last_updated_at: "2026-05-12T22:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Planning scaffold filled"
    next_safe_action: "Run strict-validate on every packet"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140080c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-008-finalize-2026-05-12"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Does Claude auto-commit? → No; user runs the actual git commit since commits are auth-bearing per CLAUDE.md and memory feedback"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8 — Finalize + Commit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-12 |
| **Branch** | `main` (stay on main, no feature branch per memory rule) |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 (last in original sequence; 009 is the follow-on) |
| **Predecessor** | 007-voyage-cleanup-and-egress-monitoring (and 005, 006 where shipped) |
| **Successor** | (none — terminal in 014) |
| **Handoff Criteria** | Every 014 packet strict-validates clean; memory continuity refreshed; commit summary ready in `008/scratch/commit-message.txt`; user runs `git add` + `git commit` themselves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 8** of `014-local-embeddings-setup-a`. The terminal packet. After 001-007 ship and 009 either lands or is documented as a deferred follow-on, this packet does the cross-packet validation, prepares the bundled commit message, and hands the actual `git commit` to the user.

**Scope Boundary**: validation + memory continuity + commit-message authorship. NO actual git mutations from the agent (commits are user-authorized actions per `CLAUDE.md` §1 Safety Constraints).

**Dependencies**: every other 014 packet shipped or documented as deferred-by-design.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
014 touched ~12 source files (TS + Python) plus ~50 spec-doc files plus 4 sqlite deletes plus user-local config (`~/.cocoindex_code/global_settings.yml`). The session ran across multiple wedge-recovery cycles. Without a final consolidation step, the changes ship as a noisy multi-commit chunk that's harder to review and harder to roll back if needed.

### Purpose
One bundled conventional commit on `main`, fully validated, with a complete summary, ready for the user to inspect and run. Plus a tcpdump-style post-merge verification checklist so the user can confirm everything is wired correctly post-ship.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `bash validate.sh --strict` on every 014 child packet + parent
- Refresh `handover.md` to reflect terminal state
- Run `memory_index_scan` to pick up all final-state docs
- Author commit message in `008/scratch/commit-message.txt` (conventional commits format, multi-line, with `Co-Authored-By:` trailer)
- Author post-merge verification checklist in `008/scratch/post-merge-checks.md`
- List files-changed inventory in implementation-summary

### Out of Scope
- Running `git commit` (user does this)
- Running `git push` (user does this; also blocks PR creation until user confirms commit)
- Opening a PR via `gh pr create` (user does this; the agent prepares the message body)
- Squashing or rebasing existing commits (this is a new bundled commit, not history rewrite)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `008/scratch/commit-message.txt` | Create | Multi-line conventional commit body |
| `008/scratch/post-merge-checks.md` | Create | Manual verification checklist for user |
| `008/implementation-summary.md` | Modify | Final files-changed inventory + status |
| `014-local-embeddings-setup-a/handover.md` | Modify | Final state; recommend `/clear` and resume from main |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every 014 packet strict-validates clean | `bash validate.sh <packet> --strict` returns exit 0 for all 9 packets + parent |
| REQ-002 | Commit message authored | `008/scratch/commit-message.txt` exists, ≥1KB, follows conventional commits format |
| REQ-003 | Files-changed inventory accurate | `git status` + `git diff --stat` output matches the inventory in implementation-summary |
| REQ-004 | Memory continuity refreshed | All packet `_memory.continuity` frontmatter blocks reflect terminal state |
| REQ-005 | Post-merge checklist exists | `008/scratch/post-merge-checks.md` enumerates the 24h tcpdump + q4 opt-in + 009 follow-on note |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | PR body prepared | If user requests, write the PR body to `008/scratch/pr-body.md` |
| REQ-007 | Disk reclaim totaled | implementation-summary records ~463MB reclaim across all packets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: User can run `git add -A && git commit -F .opencode/specs/.../008/scratch/commit-message.txt` and it succeeds
- **SC-002**: Resulting commit is a single conventional commit on main
- **SC-003**: Post-merge checklist gives the user a clear "verify 014 actually works" sequence
- **SC-004**: `bash validate.sh <014-parent> --strict` recursive run exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 009 didn't ship → cocoindex search still broken at commit time | Med | Document in commit body; the rest of 014 still works (memory side fully ✓) |
| Risk | One of the spec packets fails strict-validate at the last minute | Med | Run validates incrementally during 008 — fail fast and fix |
| Risk | Some uncommitted unrelated changes get included in `git add -A` | Med | Recommend `git status` review before commit; suggest selective `git add <paths>` |
| Dependency | User must run `git commit` themselves | Hard (by design) | Commit message is pre-authored; user only runs `git commit -F <file>` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
