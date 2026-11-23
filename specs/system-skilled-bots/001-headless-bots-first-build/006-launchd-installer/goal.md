---
title: "Goal: Phase 6: launchd-installer"
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
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/006-launchd-installer"
    last_updated_at: "2026-11-22T16:57:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-006-launchd-installer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: launchd-installer

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Let an operator install a bot's schedule as a disabled launchd agent, enable it on purpose, see it fire with the slot it stood for, stop it at the scheduler, and learn from an install record when the schedule needs a reinstall.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Install renders to a temp path, runs `plutil -lint`, boots out the old service, moves the file into place, then runs `launchctl bootstrap` and `launchctl print`, with every path absolute and resolved at install time. |
| D2 | The install preflight refuses when the runner, the switches, repository identity, the definition checker or the posture check fails (ADR-001). |
| D3 | A first install is held disabled, a kill-switch label is never re-enabled silently, and no code path calls `launchctl load` in any form (ADR-003, ADR-004). |
| D4 | The next fire time is reported as UNKNOWN (ADR-005). |
| D5 | One queue-drain agent runs per repository identity (ADR-006), and a moved checkout or changed `.skilled` is repaired by reinstalling, never by a shim (ADR-002). |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] A harmless cron bot installs disabled, fires once after `bots enable <id>`, and its run record carries `scheduled_at` and a lateness class, and `launchctl print` shows the absolute interpreter path
- [x] `rg -n --glob '!tests/**' 'launchctl|bootstrap|LaunchAgents' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints lines from `installer.ts` only, and `rg -n 'launchctl load|"load"' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints nothing
- [x] A lint failure, a failing preflight and a kill-switch label each leave `~/Library/LaunchAgents` byte-identical to its state before the command
- [x] In stubbed trees, a removed runner, a retargeted `.skilled` link and a changed vendored `pin.commit` each make the check return `needs-reinstall` with the matching reason, and a reinstall returns `ok`
- [x] The slot-accounting tests exit 0, with a sleep-gap case that leaves exactly one run with a skipped-slot summary and no backfill, and a case where a fire for a bot with an open needs-you item dispatches nothing and records the slot as skipped with reason `held-needs-you`
- [x] With the drain agent enabled, one request dropped into `<state root>/<repository identity>/requests/inbox/` produces one run record, and `ls -A` of that folder prints nothing afterwards
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
| Criterion 1, real fire | Done | Live, 2026-11-23: held disabled with no fire across one slot, then enabled; one fire wrote firedSlot 10:35:00Z, latenessSeconds 6, on-time (`scratch/live-install-result.txt:25`, `:29`, `:51` to `:56`); the XDG pass repeated it (`scratch/live-install-result-xdg.txt:50` to `:58`) |
| Criterion 2, grep gates | Done | `scratch/grep-gates.txt`: 28 matches, all in `installer.ts`; the load grep exit 1 |
| Criterion 3, byte-identical | Done | Shown on the stand-in agents folder the installer is handed (`tests/installer.vitest.ts:268`, `:380` to `:411`, `:347`); the real `~/Library/LaunchAgents` hash was unchanged across the build (`scratch/entry-conditions.txt`) |
| Criterion 4, needs-reinstall | Done | `tests/installer.vitest.ts:590` to `:633` |
| Criterion 5, slot accounting | Done | `tests/slot-accounting.vitest.ts:103` (one run, 2015 skipped, no backfill) and `:135` (`held-needs-you`); 8 of 8 pass |
| Criterion 6, live drain | Done | Live, 2026-11-23: the inbox emptied and one more record appeared (`scratch/live-install-result.txt:106`, `:107`) |

### Deviations and findings

| Item | Note |
|------|------|
| Acceptance rows without a status | Rows AC-015, AC-016 and AC-017 carried four cells; the Status and Waiver cells were added on 2026-11-23 |
| T003 probe not run | No real launchctl call was allowed; ADR-003 records the mechanism built without it |
<!-- /ANCHOR:log -->
