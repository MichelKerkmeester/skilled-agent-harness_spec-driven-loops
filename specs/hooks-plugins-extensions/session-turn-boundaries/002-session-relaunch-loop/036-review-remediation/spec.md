---
title: "Feature Specification: Remediate the eight findings of the in-session handover review of the session relaunch loop"
description: "Seven child phases fix the eight findings of the 2026-11-12 review of the session relaunch loop: shim wrapper trust, the state-directory read check, launch-flag replay, the Claude window fallback with its README row, sub-agent guard coverage, the append-lock reclaim and the leftover record at wrapper start."
trigger_phrases:
  - "review remediation phase parent spec"
  - "handover review remediation"
  - "relaunch loop review findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation"
    last_updated_at: "2026-11-12T14:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed all seven children and ran the goal gate"
    next_safe_action: "Await the operator's decision on commit and merge of worktree 351"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-review-remediation"
      parent_session_id: null
    completion_pct: 100
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

# Feature Specification: Remediate the eight findings of the in-session handover review of the session relaunch loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop |
| **Predecessor** | 035-known-gap-fixes |
| **Successor** | None |
| **Handoff Criteria** | All seven children are Complete with every acceptance row Met, and `validate.sh 036-review-remediation --recursive --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A code review of the session relaunch loop on 2026-11-12 read 18 files and returned eight findings. The report is kept in `scratch/handover-review.md`. One finding is a blocker: the shell shim runs whichever `.skilled/bin/skilled-loop` sits at or above the current directory (`.skilled/bin/skilled-loop-shell.sh:189`), so an untrusted tree can run code as the operator. Three findings are required fixes. The state directory is checked on writes and trusted on reads (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1059`). A hop drops every launch flag except model, effort, name, provider and Pi extensions (`.skilled/bin/skilled-loop:477`). The Claude window fallback reads current large-window models as 200,000 tokens (`.skilled/hooks/session-relaunch/lib/context-usage.cjs:356`). Four findings are suggestions: the sub-agent guard misses `cancel` and `consume`, the append-lock reclaim checks and then acts, a leftover record is never cleared at wrapper start, and the README says the window switch resolves from `hook-flags.env` when it does not.

### Purpose
Each child phase fixes one finding, or two that share one switch, with a test that fails before the fix, so the loop no longer trusts a wrapper, a state directory or a window size it has not checked.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Review findings 1 to 8, in seven children. Finding 8 rides with finding 4, because both concern `SESSION_RELAUNCH_WINDOW_TOKENS`.
- A failing-first test for every code change.
- The README lines the changed behaviour contradicts.

### Out of Scope
- Live hops on real runtimes. The review ran none, and each child decides whether its change needs one.
- A second operating-system account test for finding 2. The review reproduced the symlink case only.
- The two Codex entry points, `/speckit:handoff` and the style checklists the review did not read.
- A signal trap in the wrapper. Phase 007 removes the leftover record at start and adds nothing else.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/skilled-loop-shell.sh` | Modify | 001 | Run only a wrapper whose real path belongs to the sourced checkout |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | 002, 006 | Directory check in `readRelaunchFile`, rename-then-remove reclaim in `withAppendLock` |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | 002 | `consume` refuses a `handoff` outside the handoffs directory |
| `.skilled/bin/skilled-loop` | Modify | 003, 007 | Full-argument replay with a deny list, leftover-record cleanup at start |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify | 004 | An unconfigured Claude window is unknown |
| `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` | Modify | 004 | Skip and log when the window is unknown |
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modify | 005 | Deny `cancel` and `consume` to a sub-agent |
| `.skilled/hooks/session-relaunch/tests/*` | Modify | all | Failing-first tests |
| `.skilled/hooks/session-relaunch/README.md` | Modify | 001, 003, 004 | Shim trust, the replay deny list, the environment-only window switch |
| `.skilled/bin/README.md` | Modify | 001 | Shim trust paragraph |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-shim-wrapper-trust/ | Finding 1, P0: the shim runs only a wrapper whose real path belongs to the checkout it was sourced from | Complete |
| 2 | 002-state-dir-read-check/ | Finding 2, P1: `readRelaunchFile` applies the state-directory check and `consume` refuses a `handoff` outside the handoffs directory | Complete |
| 3 | 003-launch-flag-replay/ | Finding 3, P1: a hop replays the first launch's full argument list, minus a documented deny list | Complete |
| 4 | 004-claude-window-unknown/ | Findings 4 and 8, P1 and P2: an unconfigured Claude window is unknown and skips the nudge, and the README marks the window switch environment-only | Complete |
| 5 | 005-subagent-guard-cancel-consume/ | Finding 5, P2: the sub-agent guard also denies `cancel`, `consume` and `hand-over` | Complete |
| 6 | 006-append-lock-stale-reclaim/ | Finding 6, P2: one waiter at a time reclaims a stale append lock and reads its age again before removing it | Complete |
| 7 | 007-loop-start-record-cleanup/ | Finding 7, P2: the wrapper removes its own leftover record before the first launch | Complete |
| 8 | 008-alignment-findings/ | The 28 findings of the 2026-11-12 alignment report: two wrapper defects, stale documents, env rows, playbook scenarios, routing signals and the changelog shape ceilings | Complete |

### Dependencies and Parallel Waves

Phases 001 to 005 change separate source files and can start together. Phase 006 edits `relaunch-core.cjs` and `relaunch-core.test.cjs`, which phase 002 changes first. Phase 007 edits `skilled-loop` and `skilled-loop.test.cjs`, which phase 003 changes first. Phases 001, 003 and 004 each change a different part of `.skilled/hooks/session-relaunch/README.md`, so the second and third to land rebase.

| Wave | Phases | Starts when |
|------|--------|-------------|
| 1 | 001, 002, 003, 004, 005 | Now |
| 2 | 006 | 002 is Complete |
| 2 | 007 | 003 is Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-shim-wrapper-trust | 002-state-dir-read-check | No code dependency. Phase 001 is the blocker and closes first | `validate.sh 001-shim-wrapper-trust --strict` prints `RESULT: PASSED` |
| 002-state-dir-read-check | 003-launch-flag-replay | No code dependency. The order follows severity | `validate.sh 002-state-dir-read-check --strict` prints `RESULT: PASSED` |
| 003-launch-flag-replay | 004-claude-window-unknown | No code dependency. Phase 004 rebases its README row on phase 003's paragraph | `validate.sh 003-launch-flag-replay --strict` prints `RESULT: PASSED` |
| 004-claude-window-unknown | 005-subagent-guard-cancel-consume | No code dependency | `validate.sh 004-claude-window-unknown --strict` prints `RESULT: PASSED` |
| 005-subagent-guard-cancel-consume | 006-append-lock-stale-reclaim | Phase 002's edits to `relaunch-core.cjs` are in, because phase 006 changes the same file | `validate.sh 002-state-dir-read-check --strict` prints `RESULT: PASSED`, and `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 |
| 006-append-lock-stale-reclaim | 007-loop-start-record-cleanup | Phase 003's edits to `skilled-loop` are in, because phase 007 changes the same file | `validate.sh 003-launch-flag-replay --strict` prints `RESULT: PASSED`, and `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 |
| 007-loop-start-record-cleanup | 008-alignment-findings | Phases 001 to 007 are committed, because the alignment report read that range | `git log --oneline 5dafa313e8..HEAD` lists commit `e744e80a17` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Finding 3 is P1 on the judgment that a restricted session must stay restricted across a hop. If restricted sessions are out of scope for the loop, phase 003 drops to P2. Decision owner: the operator.
- Phase 001 needs a place for the operator's list of extra trusted checkouts. Phase 003 needs the per-runtime deny list. Phase 004 needs the `/doctor:setup` check that names the missing window. Each child records its own question in its `goal.md` log.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Review report**: See `scratch/handover-review.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
