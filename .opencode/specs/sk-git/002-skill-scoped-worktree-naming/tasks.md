---
title: "Tasks: Skill-Scoped Worktree and Branch Naming"
description: "Task queue for the sk-git owner-first naming packet: design frozen and first cleanup slice done; codification, allocator, wrapper/reaper hardening, enforcement, and remaining cleanup deferred for operator review."
trigger_phrases:
  - "skill scoped worktree tasks"
  - "owner first branch tasks"
  - "sk-git cleanup tasks"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-git/002-skill-scoped-worktree-naming"
    last_updated_at: "2026-07-14T07:40:00Z"
    last_updated_by: "claude"
    recent_action: "Marked design and the first cleanup slice complete"
    next_safe_action: "Implement the sk-git codification after operator review"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: Skill-Scoped Worktree and Branch Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (artifact)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reconcile the operator rule with the numbered counter and choose the owner-first grammar — recorded in `decision-record.md` ADR-001
- [x] T002 Independent check/refine/plan by GPT-5.6-SOL (max/fast) — captured in `sol-worktree-plan.md`
- [x] T003 Freeze the design in `spec.md` + `plan.md` + `decision-record.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> The only executed implementation is the lowest-risk cleanup slice; codification, tooling, hardening, and the remaining cleanup are deferred for operator review.

### Cleanup slice (done)

- [x] T010 Delete the six merged, not-checked-out branches with per-branch live re-check — evidence in `deleted-branches-recovery.txt` (`git branch -d`; all ancestors of `origin/skilled/v4.0.0.0`)

### Codification + tooling (deferred)

- [ ] T020 [B] Rewrite sk-git ALWAYS #4 grammar + cleanup ordering + migration rules in `.opencode/skills/sk-git/SKILL.md`
- [ ] T021 [B] Update sk-git references + advisor keywords/`Owns:` + `graph-metadata.json` + `v1.2.0.0` changelog
- [ ] T022 [B] Add `.opencode/skills/sk-git/scripts/worktree-naming.sh` (locked allocator + validators) with a test harness

### Governance + enforcement (deferred)

- [ ] T030 [B] Harden `.opencode/bin/worktree-session.sh` (runtime validation + session marker)
- [ ] T031 [B] Fix `.opencode/bin/worktree-reaper.sh` (live merge base + activity check + human/active protection)
- [ ] T032 [B] Add versioned `.opencode/scripts/git-hooks/pre-push` (new-branch grammar gate, migration-tolerant) + installer + CI fixtures

### Remaining cleanup (deferred — per-item operator gates)

- [ ] T040 [B] Remove stale, clean, inactive registered worktrees from a clean control worktree (owner-confirmed; non-force)
- [ ] T041 [B] Adjudicate the six detached worktrees (preserve non-contained commits into a conforming branch first)
- [ ] T042 [B] Per-branch operator decision on the unmerged branches (KEEP/RENAME/ARCHIVE/DISCARD) with verified bundles before any `-D`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Verify SOL's load-bearing claims against source and live state — `.opencode/bin/worktree-reaper.sh` line 86 tests `merge-base --is-ancestor "$branch" main`; skill dir is `system-spec-kit`; six candidates ancestor-of-v4
- [ ] T051 `validate.sh --recursive --strict` on the `sk-git` track exits Errors 0
- [ ] T052 [B] Naming test harness green; `bash -n` clean on new/changed shell (deferred with the implementation)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Grammar decided and the `wt/`-vs-`<skill>/` contradiction resolved — `decision-record.md` ADR-001
- [x] First cleanup slice executed safely with a recovery record — `deleted-branches-recovery.txt`
- [ ] sk-git codification + allocator landed and verified
- [ ] Wrapper/reaper hardened; enforcement installed
- [ ] Remaining cleanup completed per operator decisions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision record**: `decision-record.md`
- **External plan artifact**: `sol-worktree-plan.md` (GPT-5.6-SOL check/refine/plan)
<!-- /ANCHOR:cross-refs -->
