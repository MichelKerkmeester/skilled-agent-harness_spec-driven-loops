---
title: "Tasks: Skill-Scoped Worktree and Branch Naming"
description: "Task queue for the sk-git owner-first naming packet: design frozen, codification + allocator + wrapper/reaper hardening + push enforcement shipped and verified, first cleanup slice done; the remaining evidence-gated cleanup stays open behind per-item operator gates."
trigger_phrases:
  - "skill scoped worktree tasks"
  - "owner first branch tasks"
  - "sk-git cleanup tasks"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-git/009-skill-scoped-worktree-naming"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Recorded Phase 5 full declutter"
    next_safe_action: "Run operator-gated cleanup from a clean worktree"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 85
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

> Codification, allocator/validator, wrapper/reaper hardening, and push enforcement are shipped and verified on `skilled/v4.0.0.0`. Only the remaining evidence-gated cleanup stays deferred behind per-item operator gates.

### Cleanup slice (done)

- [x] T010 Delete the six merged, not-checked-out branches with per-branch live re-check — evidence in `deleted-branches-recovery.txt` (`git branch -d`; all ancestors of `origin/skilled/v4.0.0.0`)

### Codification + tooling (shipped)

- [x] T020 Rewrite sk-git ALWAYS #4 grammar + add ALWAYS #17 cleanup ordering/reap contract + migration rules in `.opencode/skills/sk-git/SKILL.md` — commit `2eb1bf2974` (ALWAYS #4 owner-first line 302; ALWAYS #17 reap-order line 315)
- [x] T021 Update sk-git references + advisor keywords/`Owns:` + `graph-metadata.json` + `v1.2.0.0` changelog — commit `2eb1bf2974` (SKILL.md `version: 1.2.0.0`; `references/worktree_workflows.md` v1.1.1.0; `graph-metadata.json` owner-first domains/intent_signals; `changelog/v1.2.0.0.md`)
- [x] T022 Add `.opencode/skills/sk-git/scripts/worktree-naming.sh` (locked allocator + validators) with a test harness — commit `bdb31a31db` (`scripts/tests/worktree-naming.test.sh` 31/31 PASS; `bash -n` clean)

### Governance + enforcement (shipped)

- [x] T030 Harden `.opencode/bin/worktree-session.sh` (runtime validation + session marker) — commit `925ca3c738` (runtime charset+resolve guard; active-session `.pid` marker before `exec`)
- [x] T031 Fix `.opencode/bin/worktree-reaper.sh` (live merge base + activity check + human/active protection) — commit `925ca3c738` (integration tip = primary `HEAD`; wrapper-only report-vs-reap; marker-dead gate; never `--force`; `bin/tests/worktree-reaper.test.sh` 9/9 PASS)
- [x] T032 Add versioned `.opencode/scripts/git-hooks/pre-push` (new-branch grammar gate, migration-tolerant) + installer + fixtures — commit `6e6fdfb57d` (new-remote-branch-only gate; fail-open on broken validator; never blocks `skilled/v*`; bypass `SPECKIT_SKIP_PREPUSH_NAMING=1`; `git-hooks/tests/pre-push.test.sh` 8/8 PASS)

### Remaining cleanup (full declutter executed; per-branch merge decisions still open)

- [x] T040 Remove stale registered worktrees — operator-authorized full declutter: **34 worktrees removed** (42→8), each either 0 commits ahead of `origin/skilled/v4.0.0.0` **or** with its branch ref preserved so every commit stays reachable; OIDs recorded in `deleted-branches-recovery.txt`. A few HEADs were ahead of v4 (e.g. `wt/0001` +4, `work/opencode/…092819` +2, detached `view-latest-v4` +1 = `main`'s tip) but none was orphaned — losslessness rests on reachability, not a blanket 0-ahead claim. Used `--force` (dirty trees were stale-base diff, not work) under explicit operator authorization; kept primary, the two active-goal worktrees (`0038`, `0039`), and the five external `/private/tmp/**` worktrees. Wording reconciled by `../010-review-remediation-and-alignment/` after the SOL review.
- [x] T041 Adjudicate detached worktrees — `0024-028-extract` + `0025-028-renumber` proven ancestors of v4 (0 unique commits); `view-latest-v4` HEAD is `main`'s tip (reachable from `main`); all removed with nothing orphaned.
- [x] T042a Delete merged branches — **31 merged branches deleted** with `-d` (33 candidates − 2 still-checked-out preserved = 31; matches the `45→14` count); OIDs recorded; extends the original six-branch slice. `work/021-graph-preservation` + `wt/opencode-doc-readmes` skipped (still checked out in kept external worktrees).
- [ ] T042b [B] Per-branch operator decision on the **11 preserved unmerged branches** (KEEP/RENAME/ARCHIVE/DISCARD) — all kept for now; verified `git bundle` before any future `-D`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Verify SOL's load-bearing claims against source and live state — `.opencode/bin/worktree-reaper.sh` line 86 tested `merge-base --is-ancestor "$branch" main` (since corrected to the live primary `HEAD`); skill dir is `system-spec-kit`; six candidates ancestor-of-v4
- [x] T051 `validate.sh --recursive --strict` on the `sk-git` track exits Errors 0 — run at close (this packet Errors 0; broken 137 provenance links repaired; 137 moved-metadata regenerated)
- [x] T052 Naming/reaper/pre-push test harnesses green; `bash -n` clean on new/changed shell — `worktree-naming.test.sh` 31/31, `worktree-reaper.test.sh` 9/9, `pre-push.test.sh` 8/8; `bash -n` clean on all four shell files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Grammar decided and the `wt/`-vs-`<skill>/` contradiction resolved — `decision-record.md` ADR-001
- [x] First cleanup slice executed safely with a recovery record — `deleted-branches-recovery.txt`
- [x] sk-git codification + allocator landed and verified — commits `2eb1bf2974` (codify) + `bdb31a31db` (allocator, 31/31)
- [x] Wrapper/reaper hardened; enforcement installed — commits `925ca3c738` (wrapper/reaper, 9/9) + `6e6fdfb57d` (pre-push, 8/8)
- [x] Worktree declutter + merged-branch cleanup completed (34 worktrees + 30 branches removed, OID-recorded); a paused-session resume prompt authored (`paused-session-resume-prompt.md`)
- [ ] Per-branch merge/archive decisions on the 11 preserved unmerged branches — open behind per-item operator gates
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision record**: `decision-record.md`
- **External plan artifact**: `sol-worktree-plan.md` (GPT-5.6-SOL check/refine/plan)
<!-- /ANCHOR:cross-refs -->
