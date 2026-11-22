---
title: "Goal: Phase 8: hub-wiring"
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
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/008-hub-wiring"
    last_updated_at: "2026-11-22T16:57:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-hub-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: hub-wiring

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Wire `system-skilled-bots` as a parent hub so a natural request for each of its four modes reaches that mode through both routing stages from every runtime, and a re-pin of a vendored consumer leaves its `bots/` folder untouched.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hub, its commands and its doctor asset are written only through `/create:skill-parent` and `/create:command`, with mirrors from the sync scripts (ADR-005). |
| D2 | The four modes are author, run, schedule and status, each a `metadata` mode packet. `bots inbox` maps onto status and `bots answer` onto run, with no mode or command of their own. |
| D3 | The doctor bots command runs the definition checker read-only (ADR-004). |
| D4 | This phase changes no file under `.skilled/skills/system-skilled-bots/runtime/`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` exits 0, its `INFO: Parent skill:` line names `system-skilled-bots`, and its `10b-byte-drift` line passes
- [ ] One natural prompt per mode (author, run, schedule, status) returns that mode with non-empty intents from `compiled-route.cjs --hub system-skilled-bots` and returns `system-skilled-bots` from `skill_advisor.py --threshold 0.5`, and prompts for `bots inbox` and `bots answer` return status and run
- [ ] Each alias's out-of-domain phrase selects `system-skilled-bots` in neither routing stage
- [ ] `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` each exit 0, and each mirror tree lists every bots command and the doctor bots command
- [ ] After a staged `overlay-engine.cjs repin` of a vendored consumer copy, `diff` of the `shasum` lists of `bots/` taken before the re-pin, from the copy after it and from the staged tree prints nothing, and `bots status` on the staged tree reports the schedule as needing reinstall
- [ ] `git diff --stat -- .skilled/skills/system-skilled-bots/runtime` over this phase's changes prints nothing
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
