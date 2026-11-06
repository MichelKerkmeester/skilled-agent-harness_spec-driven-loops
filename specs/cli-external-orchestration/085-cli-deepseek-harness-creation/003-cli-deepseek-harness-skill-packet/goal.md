---
title: "Goal: Phase 3: cli-deepseek-harness-skill-packet"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli deepseek harness skill packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/003-cli-deepseek-harness-skill-packet"
    last_updated_at: "2026-11-06T04:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all five completion criteria"
    next_safe_action: "Hand off to phase 004 and phase 011"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-003-cli-deepseek-harness-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: cli-deepseek-harness-skill-packet

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the `cli-deepseek-harness` mode a skill packet whose dispatch contract, roster and hard rules match the observed dsh headless behavior.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The packet is authored with `sk-create-skill`, using `cli-pi` as the shape precedent and none of its flags |
| D2 | No hub, advisor or registry file changes in this phase |
| D3 | A claim only a keyed run can prove is marked `documented, unconfirmed` and the OpenCode Go endpoint is marked UNKNOWN |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-deepseek-harness` reports no errors
- [x] `hard-rules.json` in the packet parses with `node -e` and contains all eleven rule ids from `headless-only` to `mcp-opt-in-only`
- [x] Every flag in the packet's `references/cli-reference.md` is found in `002-dsh-offline-contract-pin/evidence/headless-help.txt` by an `rg` loop that exits 0
- [x] The packet's `references/providers-and-models.md` lists exactly the two roster routes and marks the OpenCode Go endpoint UNKNOWN
- [x] `validate.sh` on the phase folder with `--strict` prints `RESULT: PASSED`
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
| cli-deepseek-harness skill packet | Complete | 13 files under `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/`, listed in `implementation-summary.md` |
| Skill checker | No ERROR row | C3 `Strict package validation passed.`, `Result: FINDINGS (3)` from C8, C9 (fleet-wide, same on `cli-pi`) and C10 (global changelog link, registration work) |
| Hard rules | Met | `node -e` parse exit 0 with 11 rules, eleven-id `rg -q` loop exit 0 |
| Flag loop | Met | 7 app flags found in `headless-help.txt`, exit 0, with the four launcher flags grounded by a second loop |
| Roster | Met | Two roster rows, OpenCode Go endpoint UNKNOWN |
| Strict validation | Met | `validate.sh --strict` printed `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Executor | The plan named the orchestrating Claude session. A sub-agent of that session did the work |
| Flag loop scope | The loop excludes exactly `--patch`, `--dump-config`, `--dump-default-config` and `--version`, launcher flags the headless help cannot hold, and checks them against the research sources instead |
| Dispatch rule-check suite | 42 of 42 before the packet, 40 of 42 after. The CI guard and the bijection guard fail on the eleven unimplemented check ids until phase 007 implements them |
| Hub checker | `parent-skill-check.cjs` on the hub fails only 6a, the unregistered folder, until phase 011 |
| Changelog link | `.skilled/changelog/cli-external-orchestration/cli-deepseek-harness` does not exist, outside this phase's write scope |
<!-- /ANCHOR:log -->
