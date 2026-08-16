---
title: "Feature Specification: Worktree/Branch Naming Overhaul [template:level-3/spec.md]"
description: "Replace the owner-first branch grammar with two flat, spec-style numbered namespaces (worktrees/NNN-slug, branches/NNN-slug) with independent no-skip counters, a sourceable validator set, a pre-push gate update, and a dry-run migration helper."
trigger_phrases:
  - "feature"
  - "specification"
  - "worktree"
  - "branch"
  - "naming"
  - "grammar"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/022-worktree-branch-naming-overhaul"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "sk-git"
    recent_action: "Author the Level 3 packet docs for the naming overhaul"
    next_safe_action: "Run strict validation for the 022 packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-packet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Worktree/Branch Naming Overhaul

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Replace the owner-first branch grammar (`OWNER/NNNN-SLUG`, one clone-wide 4-digit counter) with two flat, spec-style numbered namespaces: `worktrees/NNN-slug` for worktree-backed branches (directory `.worktrees/NNN-slug`) and `branches/NNN-slug` for dedicated branches with no worktree. Each namespace owns an independent 001..999 counter that is strictly sequential, never skipped, and never reuses or back-fills a number.

**Key Decisions**: Two independent per-namespace counters with per-namespace high-water files; `skilled/v*`, `main`, `backup/*`, and the `work/*` wrapper lane unchanged; a dry-run migration helper renumbers legacy owner-first pairs into `worktrees/NNN-slug`.

**Critical Dependencies**: `worktree-naming.sh` (allocator + validators), the pre-push hook that sources it, and the self-test harness that proves the numbering and grammar behavior in a throwaway repo.

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `worktrees/NNN-slug` (allocated) |
| **Owner track** | sk-git |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The owner-first grammar scatters the Git-UI branch tree into a per-skill pile and couples every branch to a single clone-wide 4-digit counter that cannot be scoped per namespace. A `worktrees/003` and a `branches/003` must be allowed to coexist, but the current grammar forces global uniqueness and back-fills gaps only by hand.

### Purpose
Replace the owner-first `OWNER/NNNN-SLUG` grammar and its 4-digit counter with two flat, spec-style numbered namespaces so the Git-UI branch tree reads as a few clean folders instead of a per-skill pile. A worktree-backed branch lives under `worktrees/`, a dedicated worktree-less branch under `branches/`, both numbered `001, 002, 003 …` strictly sequentially with no skipped or reused number. `skilled/` (releases) and `backup/` (safety refs) stay.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/sk-git/scripts/worktree-naming.sh` (allocator + validators).
- Update `.opencode/scripts/git-hooks/pre-push` (grammar help text + `backup/*` handling).
- Write `.opencode/skills/sk-git/scripts/migrate-legacy-branch-names.sh` (dry-run).
- Rewrite the self-test harness and the docs that describe the grammar.
- Author the 022 packet docs.

### Out of Scope
- No change to `skilled/*` release branches, `main`, `work/*` wrapper, `backup/*`.
- No history rewriting.
- No rename of the `owner-first-worktree-tooling/` directory or `owner-first-worktree-naming.md` file (structural identifiers kept for stable leaf-manifest/alias references).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Modify | Per-namespace allocator + validators rewrite |
| `.opencode/scripts/git-hooks/pre-push` | Modify | Grammar help text + `backup/*` handling |
| `.opencode/skills/sk-git/scripts/migrate-legacy-branch-names.sh` | Create | Dry-run legacy-name migration helper |
| `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Self-test harness for the new grammar |
| `.opencode/skills/sk-git/SKILL.md`, `README.md`, `references/*`, `scripts/README.md`, `assets/worktree-checklist.md` | Modify | Docs rewrite to the new grammar |
| `AGENTS.md` (and `CLAUDE.md` symlink) | Modify | Git Workspace Safety rows |
| `.opencode/skills/sk-git/feature-catalog/*`, `manual-testing-playbook/*` | Modify | Grammar assertions rewrite |
| `specs/sk-git/022-worktree-branch-naming-overhaul/*` | Create | Packet docs (plan/tasks/checklist/decision-record/implementation-summary) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `worktree-naming.sh` allocates `worktrees/NNN-slug` and `branches/NNN-slug` with independent no-skip 3-digit counters | A delete-then-allocate never reissues or skips; `worktrees/003` and `branches/003` coexist |
| REQ-002 | Sourced validators accept the new grammar + `skilled/v*` + `main` + `work/*` + `backup/*`, reject owner-first and malformed names | Pre-push still sources them without error |
| REQ-003 | Pre-push `_expected_grammar` help text shows the new grammar; `backup/*` is not mis-flagged as malformed; the remote-push-permission gate is unweakened | Sandbox pre-push proof |
| REQ-004 | Migration helper written with `--dry-run`, idempotent, collision-safe; never executed by tooling | File exists; no live renames run |
| REQ-005 | Docs describe only the new grammar; no owner-first references remain in the changed docs | Grep over the sk-git tree + root agent files |
| REQ-006 | Packet validates `--strict` with 0 errors / 0 warnings | `validate.sh specs/sk-git/022-worktree-branch-naming-overhaul --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `is_valid_nnn` is exactly 3-digit base-10 001..999 | Rejects `000`, `40`, `1000`, non-numeric |
| REQ-008 | `.opencode/package.json` / `package-lock.json` untouched | Reverted to HEAD if bumped |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash -n` clean on `worktree-naming.sh`, `pre-push`, `migrate-legacy-branch-names.sh`.
- **SC-002**: `worktree-naming.test.sh` ends `FAIL=0`.
- **SC-003**: Validators accept `worktrees/007-foo`, `branches/003-bar`, `skilled/v4.0.0.0`, `main`, `backup/anything`, `work/x/y`; reject `sk-doc/0131-foo`, `worktrees/7-foo`, `worktrees/007-Bad_slug`.
- **SC-004**: No-skip sandbox proof: allocate 001, create 001+002+003, delete 002, allocate returns 004.
- **SC-005**: Packet `validate.sh --strict` reports Errors 0 Warnings 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pre-push sources the validators | Broken source blocks every push's naming + permission gates | Strict mode scoped to direct execution; fail-open load path unchanged |
| Dependency | `worktree-naming.sh` self-test harness | Numbering regressions go undetected | Harness runs in a throwaway repo with 8-way concurrent + stale-lock allocation |
| Risk | `backup/*` conflated with malformed names in pre-push | Backup pushes blocked as malformed; wrapper refs leak | `is_wrapper_branch` checked before `is_valid_branch`; `backup/*` reaches the permission gate |
| Risk | `.opencode/package.json` bumped by tooling | Unwanted dependency change in the diff | Revert both package files; verify `git status` clean |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Allocations complete within the existing lock's 300-retry budget; no per-call O(repo) scans beyond refs + registered worktrees.
- **NFR-P02**: The self-test harness finishes in seconds inside a throwaway repo.

### Security
- **NFR-S01**: No secrets or credentials in any changed file.
- **NFR-S02**: The migration helper never runs destructive git commands without operator execution; `--dry-run` changes nothing.

### Reliability
- **NFR-R01**: Deterministic allocation: the same repo state always yields the same next number under the lock.
- **NFR-R02**: Validators are pure predicates with no side effects; sourcing them never mutates state.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Number `000` is invalid; `001` is the minimum; `999` is the maximum (allocation at 999 refuses).
- 2-digit (`40`) and 4-digit (`1000`) numbers are rejected.
- Empty or non-lowercase slugs, and leading/trailing/double hyphens, are rejected.

### Error Scenarios
- A deleted middle number is never back-filled (allocate returns max-in-use + 1).
- A lock held by a dead process is reclaimed by ownership transfer, never by unlinking a path another allocator may have just acquired.
- A broken validator fails open in pre-push (warning, not a blocked push).

### Concurrent Operations
- 8 concurrent allocations under lock contention return 8 distinct numbers per namespace.
- `worktrees/` and `branches/` counters allocate concurrently without interference.

<!-- /ANCHOR:edge-cases -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: allocator + pre-push + migration helper + test harness + ~30 docs |
| Risk | 15/25 | Auth: N, API: N, Breaking: Y (branch grammar change) |
| Research | 10/20 | Frozen spec + existing allocator/hook/test-harness contract read |
| Multi-Agent | 5/15 | Single implementation stream |
| Coordination | 8/15 | Dependencies: pre-push sourcing validators, harness assertions |
| **Total** | **56/100** | **Level 3** |

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Pre-push stops sourcing validators after the rewrite | H | L | Direct-exec-only strict mode; validator presence checks |
| R-002 | Number collision under concurrency | H | L | Per-namespace high-water + ref + registered-worktree scan under the lock |
| R-003 | `backup/*` mis-gated in pre-push | M | L | `is_wrapper_branch` first; `backup/*` reaches permission gate |
| R-004 | Docs leave owner-first references | M | M | Grep sweep over the sk-git tree + root agent files |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Allocate a collision-free numbered branch (Priority: P0)

**As a** session operating on a shared repository, **I want** the allocator to hand me `worktrees/NNN-slug` or `branches/NNN-slug` with a number no other session can reuse, **so that** two tasks never claim the same branch and directory.

**Acceptance Criteria**:
1. Given a worktree task, When I run `create <slug>`, Then I get `worktrees/NNN-slug .worktrees/NNN-slug`.
2. Given a dedicated branch task, When I run `create-branch <slug>`, Then I get `branches/NNN-slug` with no worktree.
3. Given a deleted middle number, When I allocate again, Then the number is max-in-use + 1 (never the freed slot).

### US-002: Push a safety ref without a malformed-name block (Priority: P1)

**As a** operator making a `backup/*` safety ref, **I want** the pre-push hook to treat it as a legal-but-not-task branch, **so that** it is gated on remote permission instead of being flagged as a malformed new branch.

**Acceptance Criteria**:
1. Given a new `backup/safety-ref` push, When the pre-push hook runs, Then it reaches the remote-push-permission gate rather than the naming gate.
2. Given a `work/*` wrapper ref, When the pre-push hook runs, Then it is blocked with the dedicated launch-wrapper message.

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None — the grammar and numbering rules are frozen in the spec; all acceptance criteria are objective and machine-checkable.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
