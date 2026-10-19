---
title: "Goal: Session relaunch loop"
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
    packet_pointer: "hooks/023-session-relaunch-loop"
    last_updated_at: "2026-10-19T16:50:17Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed phase 008, the third deep review's fifteen fixes"
    next_safe_action: "Operator decides on merging worktree 148 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "5820adf5-6b90-452d-9421-385ec95d7f40"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Session relaunch loop

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Sessions on the repository's CLI runtimes hand off near the context limit and continue in a fresh session in the same terminal, automatically where a runtime exposes usage and by command where it does not.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Phases close in order: Claude Code, then Pi and OpenCode, then Codex, Cursor, Devin and Hermes, then review and closure. Read-only spikes of the next phase may run while the current phase closes. |
| D2 | The trigger is 80% of the effective window and coexists with auto-compaction, which stays the fallback. `autoCompactEnabled` and `autoCompactWindow` never change. |
| D3 | The handoff is a standalone note. When a spec packet is bound, `/speckit:save` runs before the hop, the claim seed carries the packet as the session's Gate 3 answer, and `/speckit:resume` runs after the claim. A sender that answered Gate 3 with Skip records `none`, and the seed carries that Skip. |
| D4 | A runtime gets an automatic trigger only on a spike-verified event. Otherwise it enters the loop through `/speckit:handoff`. |
| D5 | Luna (cli-codex) builds, SWE (cli-devin) reviews and the orchestrator verifies. While Luna's quota is out, SWE builds and a fresh SWE session reviews. Code follows sk-code-opencode and docs go through sk-doc modes. |
| D6 | Work stays on `worktrees/142-session-relaunch-loop`. Nothing is committed, pushed or merged without the operator. |
| D7 | Live runs and probes that need a model provider use the OpenAI provider with `gpt-6-luna`, the only provider with usage. The one exception is Devin's live run, which uses `swe-2-max`. A live OpenCode run that proves the repo default model runs `llmgateway/deepseek-v4.1-flash` with variant `max`, the default the operator set on 2026-10-19. No other provider or model is substituted. Hermes and Cursor have no live run. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-claude-relaunch-loop | `001-claude-relaunch-loop/goal.md` |
| 002-pi-opencode-adapters | `002-pi-opencode-adapters/goal.md` |
| 003-command-trigger-runtimes | `003-command-trigger-runtimes/goal.md` |
| 004-integration-review-and-docs-closure | `004-integration-review-and-docs-closure/goal.md` |
| 005-deep-review-remediation | `005-deep-review-remediation/goal.md` |
| 006-deep-review-2-remediation | `006-deep-review-2-remediation/goal.md` |
| 007-handoff-gate-exemptions | `007-handoff-gate-exemptions/goal.md` |
| 008-review-3-remediation | `008-review-3-remediation/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] All eight phase folders print `RESULT: PASSED` under `validate.sh --strict`, with every row in their `acceptance-criteria.md` files Met
- [x] `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` prints `RESULT: PASSED`
- [x] A live Claude Code relaunch through `skilled-loop` is recorded with its `relaunch.log` hop line
- [x] `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` and `run-all-drift-guards.sh` all exit 0
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
| Parent goal authored | Done | Orchestrator, 2026-10-16 |
| Phase 001 complete, live Claude hop recorded | Done | 001 goal and acceptance-criteria.md, run-ledger.md live run 1 |
| Phase 002 complete | Done | 002 strict PASSED 0/0, AC 6/6 Met, goal 5/5; live hops on Pi (runs 1, 2) and OpenCode (runs D, E, F; F unattended after relaunch) |
| D7 added | Done | Operator, 2026-10-17: "only gpt provider has usage" |
| Phases 003 and 004 complete, all criteria met | Done | Every phase strict PASSED with all rows Met (26/26); recursive strict PASSED; final gate green (004 closure-evidence.md, Closure section) |
| Phase 005 complete | Done | 005 acceptance-criteria 7/7 Met; final gate node 375/375; recursive strict PASSED |
| Phase 008 complete | Done | 008 acceptance-criteria 7/7 Met; full gate rc 0, node 455/455; recursive strict nine PASSED |
| Phase 007 complete | Done | 007 acceptance-criteria 9/9 Met. Live run 10 on Claude, Pi and OpenCode with zero operator prompts (`007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/`). Recursive strict PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| D1 amendment | Operator, 2026-10-17: "Increase parallelization". Phase 003 spikes overlap phase 002 closure; parallel dispatch on disjoint files, more than one Luna or SWE at a time |
| D3 amendment | Operator, 2026-10-17: "Carry it in the seed". Relaunched sessions stopped at Gate 3; the seed now carries the note's spec folder and AGENTS.md treats a hop as the same session |
| D7 amendment | Added after the operator reported that only the OpenAI provider has usage; children 002 and 003 carry it as D5 |
| D5 amendment | Operator, 2026-10-17: Codex quota out until Oct 22 08:13; "I build these two fixes", then SWE takes the Luna lanes |
| D7 amendment 2 | Operator, 2026-10-18: Codex live run waits for its reset; "Skip hermes"; "Devin can use swe2 skip cursor"; Cursor stays command-only |
| D3 amendment 2 | Live Codex hop 2026-10-18: the sender answered Gate 3 Skip, the seed carried nothing and the receiver asked again; an explicit `none` now carries the Skip, and an empty field still asks |
| Phase 005 added | Deep review 2026-10-18 (deepseek-v4.1-flash max, 7 iterations, converged): PASS with 12 P2 advisories; phase 005 fixes them, so criteria 1, 2 and 4 reopen until it closes |
| Nothing deferred | Operator, 2026-10-18: "Get to perfection nothing deferred or not tested". Every carried P2 is fixed in this run |
| Binding rows 006 and 007 | The binding table had no 006 row, which parent-and-nested-goals §3 step 6 requires. Both rows are now present. The chat slice changed, so it is resent |
| D7 amendment 3 | Operator, 2026-10-19: "make default model Deepseek v4.1 flash max" in the repo `opencode.json`. A live OpenCode run that proves that default launches without `-m` and runs `llmgateway/deepseek-v4.1-flash` with variant `max`. Every other live run keeps `gpt-6-luna` |
| Phase 008 added | Third deep review 2026-10-19 (DeepSeek V4.1 Flash max and Luna max fast, 5 iterations each): CONDITIONAL, 2 P1 and 13 P2, all confirmed. Operator chose "Fix all as phase 008", which also moves criterion 1 from seven to eight folders. Criteria 1, 2 and 4 reopen until 008 closes |
| D6 amendment | Operator, 2026-10-19: the third review and phase 008 run in a fresh worktree, `worktrees/148-session-relaunch-deep-review`, because the DeepSeek lineage runs with permissions skipped |
<!-- /ANCHOR:log -->
