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
    last_updated_at: "2026-11-14T22:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the phase spec, plan, tasks and goal"
    next_safe_action: "Wait for phases 017 and 021, then run T001"
    blockers:
      - "Phases 017 and 021 must finish before the inventory reads the final hooks.toml and guards-and-hooks.md"
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md"
      - ".vibe/hooks.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Can the runner's restart action resume an interactive Vibe session with vibe --resume?"
      - "Can a mirrored .vibe/prompts prompt be invoked by name in an interactive session?"
    answered_questions: []
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

- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook` prints `PASS` with `scenarios=51` and `violations=0`.
- [ ] `scratch/verdicts.md` has 26 `VIB-HK` rows and `rg -c '\| FAIL \|' scratch/verdicts.md` exits 1.
- [ ] The alignment recheck's `recheck.md` lists no confirmed in-scope finding as still open.
- [ ] `node --test .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` prints `fail 0`.
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

### Deviations and findings

| Item | Note |
|------|------|
| Runner has no Vibe adapter | `CONVERSATION_RUNTIMES` lists five runtimes and not Vibe, so this phase adds the adapter before any scenario can run |
| Phase 021 T008 | 021's playbook task now hands the per-hook scenarios to this phase |

Open question: can the runner's restart action resume an interactive Vibe session? Phase 019 found Vibe refuses `--model` on `--resume`; the interactive adapter passes no `--model`, so T008's probe decides.

Open question: can a mirrored `.vibe/prompts` prompt be invoked by name in an interactive session? `VIB-HK-025` decides, or records OPERATOR-ONLY with the reason.
<!-- /ANCHOR:log -->
