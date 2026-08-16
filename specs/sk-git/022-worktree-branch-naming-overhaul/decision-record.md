---
title: "Decision Record: Worktree/Branch Naming Overhaul [template:level-3/decision-record.md]"
description: "Level 3 decision record for the naming overhaul: two flat numbered namespaces, per-namespace counters, sourceable validators, backup/wrapper gate handling, and a dry-run migration helper."
trigger_phrases:
  - "decision"
  - "record"
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
    recent_action: "Author the Level 3 decision record for the naming overhaul"
    next_safe_action: "Reference these ADRs when the migration runs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-decision-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Worktree/Branch Naming Overhaul

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Two Flat Numbered Namespaces Instead of Owner-First Prefixes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-16 |
| **Deciders** | sk-git maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The owner-first grammar (`OWNER/NNNN-SLUG`) made the Git-UI branch tree read as a per-skill pile and coupled branch identity to a single clone-wide 4-digit counter. The frozen contract replaces it with two flat, spec-style namespaces so the branch tree reads as a few clean folders, and so worktree-backed and dedicated branches are visibly distinct.

### Constraints
- Must preserve `skilled/v*` releases, `main`, `backup/*`, and the `work/*` wrapper lane.
- Must remove the owner argument, `is_valid_owner`, `load_skill_ids`, and the 4-digit counter.
- Must keep the validators sourceable by the pre-push hook.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Use `worktrees/NNN-slug` for worktree-backed branches (directory `.worktrees/NNN-slug`) and `branches/NNN-slug` for dedicated branches with no worktree.

**Details**: The directory mirrors the branch tail exactly (owner dropped). `skilled/vA.B.C.D`, `main`, `backup/<anything>`, and `work/RUNTIME/slug` stay legal-but-distinct lanes.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two flat numbered namespaces** | Clean Git-UI tree; worktree vs dedicated visible | Two counters to track | 9/10 |
| Owner-first with per-owner counter | Groups by skill | No cross-prefix uniqueness; per-skill piles persist | 4/10 |
| Single clone-wide counter with namespace prefix | One counter | Re-introduces coupling; `worktrees/003` + `branches/003` impossible | 3/10 |

**Why Chosen**: Two flat namespaces directly fix the legibility problem and keep the numbering independent.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Git-UI branch tree reads as a few clean folders.
- A `worktrees/003` and a `branches/003` may coexist.

**Negative**:
- Docs, validators, the pre-push gate, and the test harness had to be rewritten.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Docs leave owner-first references | M | Grep sweep over the sk-git tree + root agent files |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | Owner-first piles are the exact legibility problem being fixed |
| Beyond Local Maxima | Pass | Per-owner and single-counter alternatives compared |
| Sufficient | Pass | Both worktree and dedicated branch shapes covered |
| Fits Goal | Pass | Branch tree becomes a few clean folders |
| Open Horizons | Pass | `backup/*` and wrapper lanes remain distinct |

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

**Affected Systems**:
- `.opencode/skills/sk-git/scripts/worktree-naming.sh`
- `.opencode/scripts/git-hooks/pre-push`
- sk-git docs, feature catalog, manual-testing-playbook, root agent files

**Rollback**: `git checkout` on the touched files; no refs or worktrees are mutated.

<!-- /ANCHOR:adr-001-impl -->

---

<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Independent Per-Namespace Counters with No-Skip Allocation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-16 |
| **Deciders** | sk-git maintainers |

---

<!-- ANCHOR:adr-002-context -->
### Context

A `worktrees/003` and a `branches/003` must coexist, and a freed number must never be reissued (gaps are never back-filled). Git cannot enforce this itself.

### Constraints
- Next number in a namespace = max-in-use + 1, zero-padded 3-digit.
- Allocation holds a lock; the AI/human never hand-picks a number.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Each namespace owns an independent 001..999 sequence seeded from its own high-water file + every matching local/remote ref + (worktrees/) every registered `.worktrees/NNN-*` basename.

**Details**: Separate high-water files (`worktrees-number.highwater`, `branches-number.highwater`) keep the counters independent; a single mkdir-based lock in the common git dir serializes allocation. A partial scan can never reissue a live number because the persisted high-water is consulted under the lock.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-namespace high-water + scan** | Independent, no-skip, no-reuse | Two files to maintain | 9/10 |
| One shared clone-wide counter | Simple | Cross-namespace coupling; coexistence impossible | 3/10 |
| Back-fill gaps | Reuses numbers | Reissues live numbers; forbidden by the frozen contract | 1/10 |

**Why Chosen**: Per-namespace counters directly satisfy the coexistence and no-reuse requirements.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Delete-then-allocate returns max-in-use + 1 (never the freed slot).
- `allocate [worktrees|branches]` exposes the namespace argument.

**Negative**:
- Two high-water files instead of one; both regenerated on next allocation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Concurrent allocation collision | H | Shared lock serializes; high-water persisted before release |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | Git cannot enforce sequential uniqueness |
| Beyond Local Maxima | Pass | Shared-counter and back-fill alternatives rejected |
| Sufficient | Pass | High-water + refs + registered worktrees cover all in-use sources |
| Fits Goal | Pass | No-skip / no-reuse proven in a sandbox |
| Open Horizons | Pass | Namespaces remain independent as they grow |

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation Notes

**Affected Systems**:
- `.opencode/skills/sk-git/scripts/worktree-naming.sh` (scan/allocate)

**Rollback**: High-water files regenerate on the next allocation; the old single `worktree-number.highwater` is superseded.

<!-- /ANCHOR:adr-002-impl -->

---

<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Validators Stay Sourceable; Strict Mode Scoped to Direct Execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-16 |
| **Deciders** | sk-git maintainers |

---

<!-- ANCHOR:adr-003-context -->
### Context

The pre-push hook sources the allocator file to reuse the grammar validators. A `set -e` leak into the caller would make any validators failure abort the hook mid-run.

### Constraints
- The hook's fail-open load path must stay unchanged.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Apply `set -euo pipefail` only when the script is executed directly (`BASH_SOURCE[0] == $0`).

**Details**: The validators are pure predicates with no external state; `is_valid_slug`, `is_valid_nnn`, `is_valid_branch`, `is_wrapper_branch`, `is_backup_branch`, `is_valid_pair`, and `is_remote_push_allowlisted` all load on `source` without side effects.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Direct-exec-only strict mode** | No leak into callers | Two code paths to reason about | 9/10 |
| Always-on strict mode | Uniform | Any validator failure aborts the hook | 2/10 |

**Why Chosen**: Keeps the hook robust without weakening the validators.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- The hook's fail-open path is preserved; a missing/broken validator warns and skips the gates rather than blocking every push.

**Negative**:
- None material.

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | Sourceable validators are the hook's contract |
| Beyond Local Maxima | Pass | Always-on strict mode rejected |
| Sufficient | Pass | Caller shell survives a failing command after source |
| Fits Goal | Pass | Hook keeps naming + permission gates |
| Open Horizons | Pass | Validator set stays extensible |

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation Notes

**Affected Systems**:
- `.opencode/skills/sk-git/scripts/worktree-naming.sh`

**Rollback**: Revert the strict-mode guard to the previous behavior.

<!-- /ANCHOR:adr-003-impl -->

---

<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: backup/* Passes the Naming Gate; Wrapper Refs Are Checked First

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-16 |
| **Deciders** | sk-git maintainers |

---

<!-- ANCHOR:adr-004-context -->
### Context

`backup/<anything>` is a legal-but-not-numbered safety ref. Under the old grammar a backup push had no legal shape; under the new grammar it must not be mis-flagged as a malformed new branch. Conversely, `work/*` wrapper refs are legal grammar names but must never be pushed as feature branches.

### Constraints
- Do not weaken the remote-push-permission gate.

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: `is_backup_branch` recognizes `backup/<non-empty>`; `is_valid_branch` accepts it. The pre-push naming gate checks `is_wrapper_branch` before `is_valid_branch`, so a legal wrapper name is still blocked with the dedicated message.

**Details**: `backup/*` passes the naming gate and reaches the remote-push-permission gate like any other branch — gated on permission, not grammar.

<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **backup passes naming; wrapper checked first** | Backup gated on permission; wrapper never pushed | Two lanes to keep distinct | 9/10 |
| Block backup at naming too | Simplest | Blocks legitimate safety refs | 3/10 |
| Add backup to the permission allowlist | No ask-first friction | Weakens the permission gate | 2/10 |

**Why Chosen**: Preserves the safety-ref lane without weakening the permission gate.

<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- A backup push is gated on permission (operator asks / allowlist / bypass), not on grammar.
- The wrapper lane keeps its "never push" invariant.

**Negative**:
- None material.

<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | Backup pushes previously had no legal grammar shape |
| Beyond Local Maxima | Pass | Allowlisting backup would weaken the permission gate |
| Sufficient | Pass | Naming + permission gates both proven in a sandbox |
| Fits Goal | Pass | Backup legal, wrapper never pushed |
| Open Horizons | Pass | Gate behavior is testable and explicit |

<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation Notes

**Affected Systems**:
- `.opencode/skills/sk-git/scripts/worktree-naming.sh`
- `.opencode/scripts/git-hooks/pre-push`

**Rollback**: Revert the pre-push gate ordering.

<!-- /ANCHOR:adr-004-impl -->

---

<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005: Migration Helper Is Dry-Run-First and Never Executed by Tooling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-16 |
| **Deciders** | sk-git maintainers |

---

<!-- ANCHOR:adr-005-context -->
### Context

The live clone holds legacy owner-first worktree branches (`OWNER/NNNN-SLUG` pairs). Renaming them must be operator-driven and reviewable; a tool-driven rename would bypass the review that branch renames warrant.

### Constraints
- `git branch -m` / `git worktree move` only — never history rewrites.
- Written, not executed, during this task.

<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**Summary**: `migrate-legacy-branch-names.sh` scans local branches checked out in `.worktrees/*` matching the legacy grammar, sorts by ascending original number, and renumbers to `worktrees/001..`.

**Details**: `--dry-run` prints the plan and changes nothing; the helper is idempotent (already-renumbered names are never touched) and collision-safe (a target conflict prints `SKIP`). The helper is written during this task and never executed; all verification runs in throwaway sandboxes.

<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dry-run-first helper** | Reviewable, idempotent | Operator must run it | 9/10 |
| Auto-run renumbering in the task | Zero operator steps | Bypasses review; mutates live refs | 2/10 |
| Manual `git branch -m` per branch | No new script | Error-prone; no stable ordering | 4/10 |

**Why Chosen**: Branch renames are operator decisions; the helper makes them deterministic and reviewable.

<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**Positive**:
- The 13 original legacy pairs map to `worktrees/001..013` in a stable order.
- WIP and unpushed commits are preserved (branch renames only).

**Negative**:
- The operator must remember to run the helper after this task lands.

<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary | Pass | Live legacy branches need a deterministic rename path |
| Beyond Local Maxima | Pass | Auto-run and manual alternatives rejected |
| Sufficient | Pass | Idempotent, collision-safe, dry-run-first |
| Fits Goal | Pass | Operator review before any live rename |
| Open Horizons | Pass | Helper runs again after a partial rename |

<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation Notes

**Affected Systems**:
- `.opencode/skills/sk-git/scripts/migrate-legacy-branch-names.sh`

**Rollback**: Not executed during this task; when the operator runs it, each rename is a reversible `git branch -m` / `git worktree move`.

<!-- /ANCHOR:adr-005-impl -->

---

<!-- /ANCHOR:adr-005 -->
