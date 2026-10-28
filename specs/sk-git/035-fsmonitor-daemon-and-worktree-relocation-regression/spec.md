---
title: "Feature Specification: fsmonitor daemon leak and worktree relocation regression"
description: "Stop git fsmonitor daemons from piling up and wedging, so a pre-push hook can no longer stall for 30 minutes and no daemon outlives its worktree."
trigger_phrases:
  - "fsmonitor daemon and worktree relocation regression phase parent spec"
  - "fsmonitor daemon pile-up"
  - "pre-push hook stall"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression"
    last_updated_at: "2026-10-27T22:15:15Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the permanent core.fsmonitor=false decision and closed the open questions"
    next_safe_action: "Mark phase 002 AC-006 Met once the numbered reaper has removed worktree 217 after it merges"
    blockers: []
    key_files:
      - "scratch/findings.md"
      - "001-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 97
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: fsmonitor daemon leak and worktree relocation regression

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression |
| **Predecessor** | sk-git/026-worktree-hygiene-and-relocation |
| **Successor** | None |
| **Handoff Criteria** | All six phases validate under `--strict`, and no stray or wedged fsmonitor daemon survives a worktree removal |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-10-27 a `git push` sat in the pre-push hook for about 30 minutes. A `git check-ignore` call in the skill-root metadata gate waited forever on the main checkout's fsmonitor daemon, which had stopped answering. The same morning three fresh main daemons wedged in a row, and eleven to twelve daemons were alive at once, the oldest for 16 days. The causes stack: fsmonitor is on for every worktree, the worktrees moved back inside the main checkout so the main daemon receives about 2 million extra files' events, macOS daemons never exit on their own, git's cookie handshake waits without a deadline, and the hook's git call has no timeout. The full record is `scratch/findings.md`, and the root-cause analysis is `001-deep-research/research/research.md`.

### Purpose
Make an unanswered fsmonitor daemon cost seconds instead of half an hour, stop old daemons from running on after their worktree is gone, and move the worktrees back out of the main checkout so the main daemon stops wedging under their event load.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research the root cause and design the fix (phase 001, done).
- Persist the worktree base only when it was chosen on purpose, move the worktrees outside the checkout, and warn from the doctor when they drift back in (phase 002).
- Add a daemon reaper that stops fsmonitor daemons whose worktree is gone, and a wedge probe that replaces a daemon that no longer answers (phase 003).
- Give the pre-push gate's index-reading git calls and their close siblings a timeout and the `-c core.fsmonitor=false` opt-out (phase 004).
- Close the reaper's open review gaps, sweep daemons of deleted repositories on request, and bound the shell hooks' and the launcher's index-reading git calls through one helper (phase 005).
- Remove finished numbered worktrees from a throttled session-start sweep, with every reaper git call and process probe bounded and every doubt keeping the worktree (phase 006).

### Out of Scope
- Patching git itself. The unbounded wait is upstream code, and release notes up to 2.53 carry no fix.
- An exhaustive audit of all of the repository's roughly 59 git-spawning files. Phase 004 fixes the proven path and its close siblings.
- The deep-loop runner's failed `resume` of an interrupted lineage, and its containment guard quarantining a concurrent operator edit. Both were seen while running phase 001 and are recorded as follow-ups for `system-deep-loop`.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/worktree-session.sh` | Modify | 002 | Persist `speckit.worktreeBase` only for an explicitly chosen base |
| `.skilled/bin/tests/worktree-session.test.sh` | Modify | 002 | Assert the new write-back behaviour |
| `.skilled/commands/doctor/` (worktree check) | Modify | 002 | Warn when the worktree base sits inside the checkout |
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Create | 003 | Attribute daemons by socket, stop strays, probe for wedges |
| sk-git worktree finish path | Modify | 003 | Reap the worktree's daemon when the worktree is removed |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | 004 | Timeout and fsmonitor opt-out on `git check-ignore` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | Modify | 004 | Same pair on its `git check-ignore` |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | 004 | Same pair on its `git check-ignore` |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` | Modify | 004 | Same pair on its `git status` |
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Modify | 005 | Start-time recheck, single-owner stop, fresh worktree list for strays, `--orphans` |
| `.skilled/scripts/git-hooks/lib/bounded-git.sh` | Create | 005 | Shared bounded git for the pre-commit and pre-push hooks and the launcher |
| `.skilled/bin/worktree-reaper.sh` | Modify | 006 | Opt-in numbered lane, orphan report, bounded probe and git calls, refusal handling |
| `.skilled/bin/worktree-guard.sh` | Modify | 006 | Throttled detached numbered sweep behind `SPECKIT_WORKTREE_AUTOREAP` |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | 006 | Informational `numbered worktrees:` line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Root cause and four-layer fix design, from 7 DeepSeek V4.1 Flash iterations over three lanes | Complete |
| 2 | 002-worktree-relocation-restore/ | Worktrees back outside the checkout, no silent re-pin of the in-checkout default | In Progress |
| 3 | 003-fsmonitor-daemon-lifecycle/ | Reap daemons whose worktree is gone, and replace wedged daemons | Complete |
| 4 | 004-push-gate-git-timeout/ | Timeout and fsmonitor opt-out on the pre-push gate's git calls | Complete |
| 5 | 005-reaper-hardening/ | Reaper start-time, single-owner stop and mid-run registration guards, `--orphans` for deleted repositories, and one bounded-git helper for the hook and launch git calls | Complete |
| 6 | 006-numbered-worktree-cleanup/ | Opt-in `--numbered` reaper lane for merged, idle sk-git worktrees, a throttled SessionStart sweep, bounded reaper git calls and process probe, and a doctor count | Complete |

Phase 004 has no dependency on 002 or 003. It is the cheapest change and removes the push stall on its own, so it can ship first.

The parent stays In Progress for one reason only: phase 002's AC-006. On 2026-10-27 `git worktree list --porcelain | grep -c '^worktree .*/\.worktrees/'` prints `1`, for `.worktrees/217-weak-model-spec-authoring`, whose session is live and whose branch is 6 commits ahead of `main` and not merged. It is not moved. The numbered reaper's session-start sweep (`.skilled/bin/worktree-guard.sh:53-73`) removes it once it is merged, clean and idle for 48 hours (`.skilled/bin/worktree-reaper.sh:58`), and AC-006 then reads `0`.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-worktree-relocation-restore | All five research questions answered, fix design written per layer | `001-deep-research/research/research.md` sections 5 and 6 |
| 002-worktree-relocation-restore | 003-fsmonitor-daemon-lifecycle | A launch without an explicit base leaves `speckit.worktreeBase` unchanged | `bash .skilled/bin/tests/worktree-session.test.sh` passes |
| 003-fsmonitor-daemon-lifecycle | 004-push-gate-git-timeout | Removing a worktree leaves no daemon attributed to it | The reaper's dry-run lists no stray daemon after a removal |
| 004-push-gate-git-timeout | 005-reaper-hardening | The pre-push skill gate ends within its bound with the daemon stopped | `005-reaper-hardening/acceptance-criteria.md` lists every row Met |
| 005-reaper-hardening | 006-numbered-worktree-cleanup | `lib/bounded-git.sh` exists and the reaper suite passes | `bash .skilled/bin/tests/worktree-reaper.test.sh` prints `FAIL=0` and `006-numbered-worktree-cleanup/acceptance-criteria.md` lists every row Met |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Decided 2026-10-27: this checkout keeps `core.fsmonitor=false` permanently. `.git/config:8` reads `fsmonitor = false`, and no `extensions.worktreeConfig` is set, so every linked worktree inherits it. The reasons and the timing are in `005-reaper-hardening/spec.md` section 10: `git status --porcelain` took a 0.282 s median with fsmonitor off, and five of five calls with it on were killed at the 60 second cap. Git stays at 2.50.1, and the 2.51 to 2.53 release notes carry no fsmonitor fix.
- Closed as UNKNOWN: what unset `speckit.worktreeBase`. The key is unversioned local config, and on 2026-10-27 neither `~/.zsh_history` nor `~/.bash_history` holds a line naming `worktreeBase`, and `.git/` holds no config backup, so it cannot be recovered from disk. Phase 002's guard prevents it going forward: a launch writes the key only for an explicit `SPECKIT_WORKTREE_BASE` (`.skilled/bin/worktree-session.sh:314-315`). The key now reads `~/worktrees/public`.
- Moot after the decision: whether a lost cookie event under event load is the actual trigger of the wedge. It stays INFERRED, and a `GIT_TRACE_FSMONITOR=1` run during a heavy install in a nested worktree would confirm it, but with fsmonitor off no git call here reaches a daemon, so the answer changes no fix. Load was not required: on 2026-10-27 a `git commit` in a one-file scratch repository, started one second after its daemon, waited forever while later calls to that daemon answered.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Findings record**: `scratch/findings.md`
- **Research synthesis**: `001-deep-research/research/research.md`
- **Predecessor**: `../026-worktree-hygiene-and-relocation/`
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
