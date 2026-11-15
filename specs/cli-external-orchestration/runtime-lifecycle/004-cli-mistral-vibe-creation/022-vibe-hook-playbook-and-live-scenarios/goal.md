---
title: "Goal: Phase 22: vibe-hook-playbook-and-live-scenarios"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe hook playbook and live scenarios goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios"
    last_updated_at: "2026-11-15T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ran every Vibe hook scenario live as a multi-turn conversation; 26 PASS"
    next_safe_action: "None: all four completion criteria are met"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md"
      - ".vibe/hooks.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Can the runner's restart action resume an interactive Vibe session with vibe --resume? Yes: VIB-HK-021, VIB-HK-022 and VIB-HK-024 restart and pass live."
      - "Can a mirrored .vibe/prompts prompt be invoked by name in an interactive session? Only through an agent profile whose system_prompt_id names it; VIB-HK-025 passes that way."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 22: vibe-hook-playbook-and-live-scenarios

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every Mistral Vibe hook, hook part, generated mirror and the hooks renderer has a playbook conversation scenario that a live Vibe session passed, and the branch carries no open in-scope alignment finding.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Scenarios run through the shared sk-doc conversation runner with a new `vibe` adapter, not through a one-off script, so every runtime's scenarios share one runner and one evidence shape. |
| D2 | A scenario passes only on a journal record its check reads, never on the exit code or the reply text alone, because a Vibe deny leaves the run at exit 0. |
| D3 | OPERATOR-ONLY is allowed only where the runner has no path to drive the behavior, and each one carries a written procedure; a scenario is never marked passed on a guess. |
| D4 | The alignment pass runs once over the finished branch with the `opencode-go` lane preset (DeepSeek V4.1 Flash max), and only findings the triage confirms in scope are fixed here. A lane that times out on that preset reruns on the `codex` preset (amended 2026-11-15 by operator decision). |
| D5 | The phase is executed by a DeepSeek V4.1 Flash max swarm across OpenCode and pi on the `llmgateway`, `opencode-go` and `mistral` providers, one scenario per worker task. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook` prints `PASS` with `scenarios=51` and `violations=0`.
- [x] `scratch/verdicts.md` has 26 `VIB-HK` rows and `rg -c '\| FAIL \|' scratch/verdicts.md` exits 1.
- [x] The alignment recheck's `recheck.md` lists no confirmed in-scope finding as still open.
- [x] `node --test .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` prints `fail 0`.
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
| Spec, plan, tasks and goal | Done | `validate.sh <this folder> --strict --quiet` printed `RESULT: PASSED` |
| Inventory gap at authoring | Measured | 18 hook entries; 17 have no conversation scenario, 14 are named in no scenario at all (spec.md Measured Behavior) |
| Alignment pass, triage, fixes, recheck and suites | Done | 58 findings triaged (51 fixed, 6 out of scope, 1 deferred); recheck still_open=8, none in scope; probes pass=10; 15 suites exit 0 |
| Live verdicts | Done | `scratch/verdicts.md`: 26 rows, 26 PASS, no FAIL and no OPERATOR-ONLY row; 25 from runner rows, VIB-HK-026 from a hop run by hand |
| Multi-turn conversions | Done | Every runner scenario sends two or more user messages; the last ten each passed 3/3 on 2026-11-15 |
| Criterion 1 | Met at `af1a00789b8` | `scenarios=51 violations=0`. The merge of origin/main as `2d4fb4d0f92` brought VIB-HK-027, the automatic handover tier, from separate work, so the merged tree prints `scenarios=52 violations=0`; this phase owns 26 scenarios and does not run VIB-HK-027 |
| Criteria 2 to 4 | Met | 26 `VIB-HK` rows with no FAIL; recheck lists no in-scope finding still open; runner suite 27 PASS, 0 FAIL |
| Review fixes, 2026-11-15 | Done | A fresh review found one P1, the manual claim command dropping launch flags, now fixed. Its P2 items were applied as T097 to T103. The five hardened scenarios passed live on the rerun (T104), after the first attempt stopped on Mistral's `402 API budget exhausted`; runner suite 29 PASS, 0 FAIL |

### Deviations and findings

| Item | Note |
|------|------|
| Runner has no Vibe adapter | `CONVERSATION_RUNTIMES` lists five runtimes and not Vibe, so this phase adds the adapter before any scenario can run |
| Phase 021 T008 | 021's playbook task now hands the per-hook scenarios to this phase |

Answered: the runner's restart action resumes an interactive Vibe session. VIB-HK-021, VIB-HK-022 and VIB-HK-024 restart and pass live.

Answered: a mirrored `.vibe/prompts` prompt runs by name only through an agent profile whose `system_prompt_id` names it, because Vibe 3.1.2 treats a top-level `system_prompt_id` as an experiment variant. VIB-HK-025 writes that profile with `launch_setup` and passes.
<!-- /ANCHOR:log -->
