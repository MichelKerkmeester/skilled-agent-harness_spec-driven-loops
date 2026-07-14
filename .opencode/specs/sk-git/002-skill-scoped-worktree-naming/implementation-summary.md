---
title: "Implementation Summary: Skill-Scoped Worktree and Branch Naming"
description: "Interim closeout: the owner-first grammar and cleanup design are frozen and the first safe cleanup slice (six merged branches) is executed; the sk-git codification, allocator, wrapper/reaper hardening, enforcement, and remaining cleanup are deferred for operator review."
trigger_phrases:
  - "skill scoped worktree summary"
  - "owner first branch summary"
  - "sk-git naming closeout"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-git/002-skill-scoped-worktree-naming"
    last_updated_at: "2026-07-14T07:40:00Z"
    last_updated_by: "claude"
    recent_action: "Froze the design and executed the first cleanup slice"
    next_safe_action: "Implement the sk-git codification after operator review"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
      - "sol-worktree-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Skill-Scoped Worktree and Branch Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `sk-git/002-skill-scoped-worktree-naming` |
| **Level** | 3 (cross-cutting policy + executable tooling) |
| **Status** | In Progress (design frozen; first cleanup slice executed; implementation deferred) |
| **Updated** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Delivered now

- An owner-first branch/worktree naming design (grammar, migration rule, wrapper exemption) reconciling the operator's rule with the numbered counter.
- A frozen decision record resolving the `wt/`-vs-`<skill>/` contradiction and recording the cleanup posture.
- The first safe cleanup slice: six merged, not-checked-out branches deleted with live re-checks and a recovery record.

### Files Changed

| File | Change | Purpose |
|------|--------|---------|
| `spec.md` / `plan.md` / `tasks.md` / `checklist.md` | Create | L3 charter, phased plan, task queue, QA gates |
| `decision-record.md` | Create | ADR-001..004 (grammar, wrapper exemption, cleanup, packet) |
| `implementation-summary.md` | Create | This interim closeout |
| `sol-worktree-plan.md` | Add | GPT-5.6-SOL check/refine/plan artifact (analysis of record) |
| `deleted-branches-recovery.txt` | Add | Recovery OIDs for the six deleted merged branches |
| local branches (6) | Delete | `system-speckit/023\|024\|026`, `wt/0030\|0031\|0032` (merged into v4) |

### Deferred (operator review)

The sk-git SKILL.md/reference codification, the `worktree-naming.sh` allocator/validator, the wrapper/reaper hardening, the `pre-push` enforcement hook, and the remaining cleanup (worktree removals, detached adjudication, unmerged decisions).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Reconciled the operator's rule against the sk-git contract; dispatched GPT-5.6-SOL (max/fast, read-only) to check, refine, and plan against a verified branch/worktree snapshot.
2. Independently verified SOL's load-bearing claims: the reaper tests `merge-base --is-ancestor "$branch" main` (a base ~1400 commits behind v4), the skill dir is `system-spec-kit` (so `system-speckit/*` is a wrong ID), and the six deletion candidates are ancestors of v4 and not checked out.
3. Executed the six branch deletions with per-branch live re-checks (ancestor + not-checked-out + tip-unchanged), recording OIDs; no working tree was touched.
4. Froze the design at Level 3 under the existing `sk-git` track.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Where | Summary |
|----------|-------|---------|
| Owner-first grammar, no `wt/` lane | ADR-001 | `<skill>/{NNNN}-{slug}` or `skilled/{NNNN}-{slug}`; operator chose the shorter form |
| Wrapper lane exempt | ADR-002 | `work/{runtime}/{slug}` stays machine-owned + hardened |
| Evidence-gated cleanup | ADR-003 | Control worktree; merged-only `-d`; unmerged bundle-gated; six branches done |
| New L3 packet under sk-git | ADR-004 | Sibling of `001-continuous-integration-workflow`; not a child of 137 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Design claims verified against source/live state:** reaper base bug (`.opencode/bin/worktree-reaper.sh` line 86), wrong skill ID (`system-spec-kit` exists, `system-speckit` does not), and all six delete candidates confirmed ancestor-of-v4 + not-checked-out.
- **Cleanup safety:** each deletion re-checked live; OIDs recorded; ref-only deletes reachable from `origin/skilled/v4.0.0.0` (nothing orphaned); dirty primary untouched.
- **Structural:** `validate.sh --recursive --strict` on the `sk-git` track → Errors 0 (recorded at close in `checklist.md` CHK-024).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Implementation deferred:** the sk-git code changes are designed but not written; they await operator approval of scope (Phases 2-4).
- **Cleanup is partial:** only the six-branch slice ran; ~30 stale worktrees, six detached worktrees, and 11 unmerged branches remain, each behind its own operator gate.
- **Snapshot is point-in-time:** the concurrent tree moves; the execution phase must re-check live before acting.
- **Wrapper/reaper bugs are real but unfixed:** the reaper's stale base and missing activity marker remain until Phase 3 lands.
<!-- /ANCHOR:limitations -->
