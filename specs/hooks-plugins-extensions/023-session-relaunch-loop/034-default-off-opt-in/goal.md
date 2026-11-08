---
title: "Goal: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "default off opt in goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/034-default-off-opt-in"
    last_updated_at: "2026-10-25T17:48:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The session-relaunch hooks stay off for anyone who clones the repo and run only for an operator who sets `SYSTEM_SESSION_RELAUNCH_ENABLED`, while every other hook concern keeps running by default.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The shared resolver holds a default-off concern map with one entry, `session-relaunch` to `SYSTEM_SESSION_RELAUNCH_ENABLED`, and the `.cjs`, `.mjs`, `.ts` and `.sh` readers all carry it |
| D2 | The enable flag is read from the environment or the gitignored `.skilled/hooks/hook-flags.env`, and the environment wins for the same key |
| D3 | `SYSTEM_SESSION_RELAUNCH_DISABLED` and the master switch still win over the enable flag |
| D4 | Every other concern stays default-on, and the adapters that call `isHookEnabled('session-relaunch')` stay unchanged, except the Hermes arm path that skips the config file |
| D5 | Tests for the new rule fail before the change, and the existing relaunch tests opt in without any assertion weakened |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/034-default-off-opt-in --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] `node --test .skilled/hooks/shared/hook-flags.test.cjs` exits 0, and its new tests show session-relaunch off with no flag, on with `SYSTEM_SESSION_RELAUNCH_ENABLED=1` from the environment or from the config file, off when `SYSTEM_SESSION_RELAUNCH_DISABLED=1` is also set, and `spec-gate` still on with no flag
- [ ] A parity test gives the same answer from the `.cjs`, `.mjs`, `.ts` and `.sh` readers on every row of one input table, and it fails on the code before the change
- [ ] With the concern not enabled, a test shows the Claude context nudge emits no nudge over the threshold, and a test shows `prepare` inside the loop writes no relaunch record and exits non-zero
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` and `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` both exit 0
- [ ] A grep of README.md, .env.example, .skilled/hooks/hook-flags.env.example, ENV-REFERENCE.md and the session-relaunch, shared and hooks READMEs finds `SYSTEM_SESSION_RELAUNCH_ENABLED` in each and no line saying session-relaunch is enabled by default
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | spec docs in this folder |
| Resolver and tests | Done | `scratch/closeout-flags.txt` 27/27, `scratch/closeout-node.txt` 872/872, `scratch/closeout-vitest.txt` 54/54, all exit 0 |
| Docs | Done | `scratch/closeout-docs-grep.txt` |
| Acceptance criteria | 11 of 11 Met | `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Hermes arm needed no code change | Production calls `armPendingRecord(payload)` with no env seam, so the file is read; probe in `scratch/closeout-hermes-arm.txt`. The file opt-in test is `hermes-adapters.test.cjs:606`, red first in `scratch/red-hermes-arm.txt` |
| Live harness opts in | `run-hop.sh` and `run-codex.sh` in the 028 harness set `SYSTEM_SESSION_RELAUNCH_ENABLED=1` |
<!-- /ANCHOR:log -->
