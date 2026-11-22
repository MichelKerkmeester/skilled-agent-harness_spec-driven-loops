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

- [ ] A harmless cron bot installs disabled, fires once after `bots enable <id>`, and its run record carries `scheduled_at` and a lateness class, and `launchctl print` shows the absolute interpreter path
- [ ] `rg -n --glob '!tests/**' 'launchctl|bootstrap|LaunchAgents' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints lines from `installer.ts` only, and `rg -n 'launchctl load|"load"' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints nothing
- [ ] A lint failure, a failing preflight and a kill-switch label each leave `~/Library/LaunchAgents` byte-identical to its state before the command
- [ ] In stubbed trees, a removed runner, a retargeted `.skilled` link and a changed vendored `pin.commit` each make the check return `needs-reinstall` with the matching reason, and a reinstall returns `ok`
- [ ] The slot-accounting tests exit 0, with a sleep-gap case that leaves exactly one run with a skipped-slot summary and no backfill, and a case where a fire for a bot with an open needs-you item dispatches nothing and records the slot as skipped with reason `held-needs-you`
- [ ] With the drain agent enabled, one request dropped into `<state root>/<repository identity>/requests/inbox/` produces one run record, and `ls -A` of that folder prints nothing afterwards
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
| Acceptance rows without a status | Rows AC-015, AC-016 and AC-017 in acceptance-criteria.md carry four cells and no Status or Waiver cell. Reported to the orchestrator, not edited here |
<!-- /ANCHOR:log -->
