---
title: "Implementation Summary: Skill-Scoped Worktree and Branch Naming"
description: "Closeout: the owner-first grammar is codified in sk-git and backed by a locked allocator/validator, the wrapper/reaper are hardened for safe concurrent reaping, a migration-tolerant pre-push gate is installed, and the first safe cleanup slice (six merged branches) is executed; only the remaining evidence-gated cleanup stays open behind per-item operator gates."
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
    last_updated_at: "2026-07-14T12:20:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded Phase 5 full declutter"
    next_safe_action: "Run operator-gated cleanup from a clean worktree"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
      - "sol-worktree-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-skill-scoped-worktree-naming"
      parent_session_id: null
    completion_pct: 85
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
| **Status** | In Progress (Phases 1-4 shipped + verified; only operator-gated cleanup remains) |
| **Updated** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Delivered now

- **Phase 1 — codify:** sk-git ALWAYS #4 rewritten to the owner-first grammar and a new ALWAYS #17 (reap-before-delete ordering + wrapper-only proven-inactive reap + pre-push contract); references, advisor keywords/`Owns:`, `graph-metadata.json`, and a `v1.2.0.0` changelog updated; the README worktree example + cleanup FAQ rewritten off the forbidden hand-computed counter. (`2eb1bf2974`)
- **Phase 2 — allocator/validator:** `worktree-naming.sh` — a locked, clone-wide high-water-mark allocator plus owner/slug/branch/pair validators and `create`/`create-detached` helpers, with a 31-case hermetic harness. (`bdb31a31db`)
- **Phase 3 — wrapper/reaper hardening:** `worktree-session.sh` gains runtime-input validation and an active-session `.pid` marker; `worktree-reaper.sh` resolves the integration tip from the primary checkout's live `HEAD` (not a stale `main`), auto-reaps ONLY clean+merged+marker-dead wrapper pairs, treats human/detached/marker-ambiguous worktrees as report-only, and never `--force`s. 9-case harness. (`925ca3c738`)
- **Phase 4 — enforcement:** a migration-tolerant `pre-push` hook that gates only brand-new remote branch names against the allocator's validators, fails open on a broken validator, never blocks `skilled/v*`, and carries a `SPECKIT_SKIP_PREPUSH_NAMING=1` bypass; wired into the installer with an 8-case harness. (`6e6fdfb57d`)
- **Cleanup slice:** six merged, not-checked-out branches deleted with live re-checks and a recovery record.
- **Design of record:** a frozen decision record (ADR-001..004) resolving the `wt/`-vs-`<skill>/` contradiction and fixing the cleanup posture.

### Files Changed

| File | Change | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-git/SKILL.md` | Modify | ALWAYS #4 owner-first + ALWAYS #17 reap contract; version `1.2.0.0`; advisor keywords/`Owns:` |
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Modify | Owner-first examples (v1.1.1.0) |
| `.opencode/skills/sk-git/README.md` | Modify | Owner-first worktree example + cleanup FAQ (v1.1.0.27) |
| `.opencode/skills/sk-git/graph-metadata.json` | Modify | Owner-first domains / intent_signals / causal_summary |
| `.opencode/skills/sk-git/changelog/v1.2.0.0.md` | Create | Grammar, wrapper exemption, migration rule |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` (+`tests/`) | Create | Locked allocator + validators; 31/31 harness |
| `.opencode/bin/worktree-session.sh` | Modify | Runtime validation + session-activity marker |
| `.opencode/bin/worktree-reaper.sh` (+`tests/`) | Modify | Live integration tip + marker gate + report-only; 9/9 harness |
| `.opencode/scripts/git-hooks/pre-push` (+`tests/`, installer) | Create | Migration-tolerant new-branch gate; 8/8 harness |
| `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `decision-record.md` | Create/Modify | L3 charter, phased plan, task queue, QA gates, ADRs |
| `sol-worktree-plan.md` / `deleted-branches-recovery.txt` | Add | SOL analysis of record; recovery OIDs |
| local branches (6) | Delete | `system-speckit/023\|024\|026`, `wt/0030\|0031\|0032` (merged into v4) |

### Cleanup executed (operator-authorized full declutter)

- Proved every registered worktree **0 commits ahead of `origin/skilled/v4.0.0.0`** (the "dirty" trees were stale-base diff, not uncommitted work — HEADs pinned ~750 commits back, pre-rename; spot-checked untracked source already present on v4).
- **Removed 34 stale worktrees (42→8)** — kept primary, the two active-goal worktrees (`0038-codex-hook-parity`, `0039-017-hyphen-naming`), and five external `/private/tmp/**` worktrees.
- **Deleted 30 merged branches (45→14)** with `-d`; OIDs recorded in `deleted-branches-recovery.txt`.
- **Preserved all 11 unmerged branches** + the 2 merged branches still checked out in external worktrees; authored `paused-session-resume-prompt.md`.

### Deferred (operator-gated)

Per-branch merge/archive decisions on the 11 preserved unmerged branches (KEEP/RENAME/ARCHIVE/DISCARD, verified `git bundle` before any `-D`) — from a clean control worktree, never the dirty/concurrent primary.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Reconciled the operator's rule against the sk-git contract; dispatched GPT-5.6-SOL (max/fast, read-only) to check, refine, and plan against a verified branch/worktree snapshot.
2. Independently verified SOL's load-bearing claims: the reaper tested `merge-base --is-ancestor "$branch" main` (a base ~1400 commits behind v4), the skill dir is `system-spec-kit` (so `system-speckit/*` is a wrong ID), and the six deletion candidates are ancestors of v4 and not checked out.
3. Executed the six branch deletions with per-branch live re-checks (ancestor + not-checked-out + tip-unchanged), recording OIDs; no working tree was touched.
4. Built Phases 1-4 under a sonnet-5 sub-agent workflow (one implementer per phase + three adversarial verifiers — runs-green, safety, conformance — that re-ran the harnesses rather than trusting self-reports). Verifier-found blockers were fixed before landing: the `pre-push` errexit fail-safe (`set +e`/capture/`set -e` around `source`), removal of the `backup/*` bypass wildcard, and doc drift.
5. Reconciled all packet docs to the shipped state with commit + test evidence, repaired the provenance links the concurrent spec reorg (`a2817e2c33`) broke by moving `137` into the `sk-git` track, and regenerated metadata last.
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

- **Harnesses (re-run at close):** `worktree-naming.test.sh` 31/31, `worktree-reaper.test.sh` 9/9, `pre-push.test.sh` 8/8; `bash -n` clean on all four shell files.
- **Design claims verified against source/live state:** reaper base bug (`.opencode/bin/worktree-reaper.sh`, since corrected to the live primary `HEAD`), wrong skill ID (`system-spec-kit` exists, `system-speckit` does not), and all six delete candidates confirmed ancestor-of-v4 + not-checked-out.
- **Cleanup safety:** each deletion re-checked live; OIDs recorded; ref-only deletes reachable from `origin/skilled/v4.0.0.0` (nothing orphaned); dirty primary untouched.
- **Structural:** `validate.sh --recursive --strict` → this packet Errors 0. The concurrent reorg (`a2817e2c33`) moved `137-parallel-session-git-autosync` into the `sk-git` track; its broken provenance links into this packet were repaired and its moved auto-metadata regenerated so the whole-track recursive gate is clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Cleanup is now the full declutter:** 34 worktrees + 30 merged branches removed (42→8 worktrees, 45→14 branches); only per-branch merge/archive decisions on the 11 preserved unmerged branches remain (each behind its own operator gate).
- **Snapshot is point-in-time:** the concurrent tree moves; the cleanup phase must re-check live immediately before acting, from a clean control worktree.
- **pre-push not yet blocking:** the hook is installed and migration-tolerant; PR head-name enforcement stays advisory until the legacy `wt/*` PR branches on origin are inventoried.
- **`validate_document.py` not run on the doc surfaces:** its `template_rules.json` config is absent in this environment (CHK-110); README/playbook were instead grammar-consistency-reviewed manually.
<!-- /ANCHOR:limitations -->
