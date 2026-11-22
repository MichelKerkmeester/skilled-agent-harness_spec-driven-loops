---
title: "Goal: Phase 1: contracts-and-state-root"
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
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root"
    last_updated_at: "2026-11-22T16:57:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-001-contracts-and-state-root"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: contracts-and-state-root

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Ship the run record, the `BOT.md` definition, the `bots/config.json` reader, repository identity, the needs-you item and the two-root state layout as tested libraries under `.skilled/skills/system-skilled-bots/runtime/`, so every later phase imports one fixed set of contracts.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Code lives in `.skilled/skills/system-skilled-bots/runtime/lib/` as TypeScript, with `*.vitest.ts` tests in `runtime/tests/` run by `npm test` (ADR-003, ADR-004). |
| D2 | The run record sits at `<state root>/<identity key>/records/<run id>.json`, never inside the run folder, and unknown cost is stored as `null`, never `0`. |
| D3 | A bot with no `isolation` value and no `defaultIsolation` is refused with `isolation-undeclared` (ADR-007). |
| D4 | The only status value this phase adds is `awaiting-decision`, which maps to `blockedStop` (ADR-005, ADR-010). |
| D5 | This phase calls no `launchctl` and writes nothing under `LaunchAgents`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` exits 0, with the `run-record`, `definition`, `state-root`, `identity`, `repo-config` and `needs-you` suites all passing
- [x] `git status --short` saved before the full test suite and again after it differ by nothing, and `ls -d .skilled/skills/.state/system-skilled-bots` fails with no such file both times
- [x] `rg -n 'writeFileSync|renameSync|appendFileSync' .skilled/skills/system-skilled-bots/runtime/lib` exits 1, so every state write goes through the atomic helper
- [x] `rg -n 'launchctl|LaunchAgents|\.plist' .skilled/skills/system-skilled-bots/runtime --glob '!node_modules'` exits 1 with no output
- [x] The `identity` suite passes a case where two remote-less temp repositories each get `identity-unknown` from `identityGuard`, and a case where two clones of one origin share one identity folder listed twice in `registered-roots`
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
| Contract libraries and tests | Done | acceptance-criteria.md rows AC-001 to AC-018 read Met on 2026-11-22 |
| Checkout left unchanged | Done | T013: `diff` of `git status --short` before and after the suite printed nothing |
| No scheduler code | Done | T017: the `launchctl` and `LaunchAgents` search printed nothing |

### Deviations and findings

| Item | Note |
|------|------|
| Closure statement in acceptance-criteria.md | Metadata reads Complete and every row reads Met, but the closure statement still reads "Closeable: No" and "Nothing is built yet". Reported to the orchestrator, not edited here |
<!-- /ANCHOR:log -->
