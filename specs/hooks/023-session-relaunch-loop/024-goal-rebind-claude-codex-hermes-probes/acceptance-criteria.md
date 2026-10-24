---
title: "Acceptance Criteria: Phase 24: goal-rebind-claude-codex-hermes-probes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal rebind probes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/024-goal-rebind-claude-codex-hermes-probes"
    last_updated_at: "2026-10-25T00:30:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Ran the four probes and met every acceptance row"
    next_safe_action: "Start phase 27 on the recommended path"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-24-goal-rebind-claude-codex-hermes-probes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 24: goal-rebind-claude-codex-hermes-probes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/024-goal-rebind-claude-codex-hermes-probes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four probes, When each has run, Then scratch/ holds a record per probe with the command, output and exit status | Four files under `scratch/` named in `spec.md` section 3, each read for its exit status Evidence (scratch/probe-a-claude-start-prompt.md:9, scratch/probe-b-claude-start-hook.md:23, scratch/probe-c-codex-goal.md:24, scratch/probe-d-hermes-spec-folder.md:24): All four records exist under `scratch/` (`probe-a-claude-start-prompt.md`, `probe-b-claude-start-hook.md`, `probe-c-codex-goal.md`, `probe-d-hermes-spec-folder.md`), each with the command, the output and the exit status where one exists (print-mode runs exit 0; the interactive tmux runs have none, stated in each record). Probe D's model call never succeeded (HTTP 402, exit 1, `scratch/raw/d1.out`), recorded as such. | Met | - |
| AC-002 | REQ-002 | Given each probe, When its negative control runs, Then the control shows the opposite result a failing claim would show | The control section in each record, with the plain-text, silent-hook, empty-ask and no-export result Evidence (scratch/probe-a-claude-start-prompt.md:9, scratch/probe-b-claude-start-hook.md:23, scratch/probe-c-codex-goal.md:24, scratch/probe-d-hermes-spec-folder.md:24): Control runs are in each record: A3 (plain-text start prompt, no goal), B3 (silent hook, no goal, interactive and print) beside the print-mode B1 positive, C4 (silent hook and empty ask, no goal), D3 (no export, `goal_present=false`, no `[active_goal:` section). Each could have shown the opposite and did not. | Met | - |
| AC-003 | REQ-003 | Given the records, When the summary is written, Then it holds one verdict per probe, what each cannot show and the phase 27 path | The verdict table in `implementation-summary.md` Evidence (implementation-summary.md:53): `implementation-summary.md` Probe Verdicts table holds one verdict per probe, a What it cannot show column and the phase 27 path with its selecting probes. | Met | - |
| AC-004 | REQ-004 | Given any probe, When it runs, Then no bypass flag was used without a fresh operator yes | The operator answer recorded in `scratch/` and the command lines in each record Evidence (scratch/operator-approval.md:5): `scratch/operator-approval.md`: the operator approved bypass flags in the dispatch brief, and the run needed none. No command line in any record carries `--permission-mode bypassPermissions`, `--sandbox danger-full-access` or `--yolo`. | Met | - |
| AC-005 | REQ-005 | Given the finished phase, When `git status` runs, Then only this folder changed and no goal, hook or process remains | `git status --short` output and a process list read after the last probe Evidence (implementation-summary.md:115): Process list after the last probe shows no probe process (17 Codex app-server daemons the probes spawned were stopped; the two pre-existing daemons remain) and no tmux server. Scratch dirs, probe Claude project logs, the three Hermes request dumps and the plugin `__pycache__` created by the Hermes run were removed. `git -c core.fsmonitor=false status --short` lists this phase's folder plus tracked files edited by other agents in the same worktree (listed in implementation-summary.md); no file outside this folder was edited by this run. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every row is Met. The four verdicts and the phase 27 path are written in `implementation-summary.md`. Probe D's model reply half stayed unobserved because the provider returned HTTP 402, and that is recorded as a limit, not as a pass.
<!-- /ANCHOR:closure -->
