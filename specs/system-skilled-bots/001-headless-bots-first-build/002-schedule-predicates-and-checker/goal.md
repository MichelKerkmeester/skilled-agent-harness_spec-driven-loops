---
title: "Goal: Phase 2: schedule-predicates-and-checker"
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
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/002-schedule-predicates-and-checker"
    last_updated_at: "2026-11-22T16:57:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-002-schedule-predicates-and-checker"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: schedule-predicates-and-checker

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Turn every cron string into launchd calendar entries that fire as cron would, or refuse it with a named invariant id, and check every `BOT.md` with one script that imports the same predicates the installer will use.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The `Weekday`-only cron rule follows what a live probe job observed across a matching and a non-matching day (ADR-001). |
| D2 | The slot lister is built from the translator's expanded dictionaries, never from a second cron evaluator. |
| D3 | The checker prints `PASS\|FAIL\|WARN\|INFO: <id>: <message>` lines, exits 0, 1 or 2, and restates no executor kind, budget bound or cron rule. |
| D4 | A definition set in a repository with no remote and no `identity` in `bots/config.json` is a `FAIL` with its own invariant id. |
| D5 | This phase installs no bot plist and calls no `launchctl bootstrap`. The probe job is removed before close. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -n 'Probe observation' decision-record.md` in this phase folder finds the probe record, and `rg -n 'Weekday' implementation-summary.md` finds one result line naming the observed dates
- [ ] The translator tests exit 0, and they assert 48 dictionaries for `*/15 0-23/2 * * *`, 1 dictionary for `0 9 1 * 1`, and four distinct refusal ids for `@reboot`, `@AppleNotOnBattery`, a percent-stdin cron and a cron past the dictionary cap
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <fixtures>/clean` exits 0, each defect fixture exits 1 with its invariant id on a `FAIL:` line, and a missing path exits 2
- [ ] In a scratch repository with no remote, `bot-check.cjs` exits 1 with the no-identity invariant id when `bots/config.json` has no `identity`, and prints no line with that id once `"identity": "local/tool"` is set
- [ ] The lister and translator agreement test exits 0 over a fixture set with one daylight-saving boundary under a fixed `TZ`, including the `StartInterval 60` case
- [ ] `rg -n 'launchctl bootstrap' .skilled/skills/system-skilled-bots` prints no code line, and `ls ~/Library/LaunchAgents | rg com.skilled.probe` prints nothing
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
| Weekday probe read and removed | done | fired Mon 2026-11-23 only; SINGLE_DAY_FIELD_RULE emit; AC-001/002/011 Met |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
