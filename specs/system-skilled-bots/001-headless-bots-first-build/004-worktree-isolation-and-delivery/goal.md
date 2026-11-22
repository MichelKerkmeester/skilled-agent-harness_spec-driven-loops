---
title: "Goal: Phase 4: worktree-isolation-and-delivery"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery"
    last_updated_at: "2026-11-22T16:57:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-004-worktree-isolation-and-delivery"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: worktree-isolation-and-delivery

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Run a bot that declares `isolation: worktree` in its own numbered worktree outside the checkout, and tell each declared delivery target what happened, at most once, with a record of each send.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The first delivery channels are local-only and the desktop notice, and a notice through `osascript` is recorded as `attempted` only (ADR-001). |
| D2 | The unattended runner never picks a workspace. A definition with no `isolation` and no repository default gets the missing-posture refusal (ADR-002). |
| D3 | A bot worktree is provisioned with links, not a full install, and removal unlinks every link before a plain `git worktree remove` and `git branch -d`, never forced (ADR-003, ADR-005). |
| D4 | A dirty, unmerged or killed run keeps its tree and reports it as kept with its reason (ADR-004). |
| D5 | A run that ends `awaiting-decision` sends one notice per target, keyed by the needs-you item id. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `bots run <id>` on a worktree fixture bot leaves a terminal run record whose evidence locations hold a worktree path outside `git rev-parse --show-toplevel` and a `worktrees/NNN-slug` branch
- [ ] After a clean worktree run is removed, `ls` of each linked dependency folder in the main checkout prints the same entry count it printed before the run
- [ ] A run killed mid-edit leaves its worktree on disk, and `git worktree list` still shows it
- [ ] The delivery tests exit 0, with a forced-uncertain send that leaves one record with state `unknown` and a send counter of 1, and a needs-you case that sends one notice per target across two delivery passes
- [ ] The definition checker exits non-zero on the negative worktree fixture and prints the worktree invariant id
- [ ] `rg -n 'launchctl bootstrap|\.plist' .skilled/skills/system-skilled-bots/runtime/lib` prints nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | Criteria drawn from spec.md section 5 and acceptance-criteria.md |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
