---
title: "Goal: Phase 3: cli-deem-mode-removal"
description: "Delete the cli-deem mode packet and its copies, and leave cli-classifier a valid parent hub whose only mode is cli-jev."
trigger_phrases:
  - "delete cli-deem packet"
  - "one-mode classifier hub"
  - "cli-classifier routing remint"
  - "hermes cli-deem removal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/003-cli-deem-mode-removal"
    last_updated_at: "2026-10-02T13:40:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-003-cli-deem-mode-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: cli-deem-mode-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Delete the `cli-deem` mode packet and its copies, and leave `cli-classifier` a valid parent hub whose only mode is `cli-jev`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `.skilled/skills/cli-classifier/cli-deem/` and `.hermes/skills/cli-deem/` are deleted. The Hermes mirror is regenerated with `sync-skills-hermes.cjs`, never edited by hand |
| D2 | The hub keeps every parent-hub file, each now listing one mode, and gets a new minor version with its changelog entry |
| D3 | Routing fixtures and the advisor graph drop the Deem mode. A fixture that sent a Deem prompt expects what the compiled router now returns, and `implementation-summary.md` records each change |
| D4 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies, runs the suites and makes path-scoped commits. Luna takes the hub and routing edits, and the session re-mints routing |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `.skilled/skills/cli-classifier/cli-deem/` and `.hermes/skills/cli-deem/` do not exist, and `sync-skills-hermes.cjs --check` exits 0
- [x] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0, and `mode-registry.json` lists exactly one mode, `cli-jev`
- [x] `compiled-route-status.cjs --hub cli-classifier --no-probe` reports `compiled-serving`, and the cli-classifier compiled-routing harness passes with 0 failing
- [x] `git grep -n cli-deem -- .skilled/skills/system-skill-advisor .skilled/skills/cli-external-orchestration .skilled/bin ':!*/changelog/*'` prints nothing, and the advisor suite passes with 0 failing
- [x] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this folder
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
| Planned | Done | Scoped 2026-10-02 from the operator's request to remove Deem and keep Jev |
| Removal | Done | Luna 6 max, commit `43598e2c67`: packet and Hermes copy deleted, hub 0.7.0.0 with one mode, routing re-minted |
| Advisor graph | Done | Regenerated with `skill_graph_compiler.py --export-json` in `b338131b67` |
| Checks | Done | Hub check exit 0, `compiled-serving` and `fresh`, harness built, mirror in sync, grep empty, Jev prompt routes `single` to `cli-jev` |
| Review | Done | DeepSeek V4.1 Flash max: no P0 or P1, five P2 below |

### Deviations and findings

| Item | Note |
|------|------|
| Canary fixture | `deem-choice-single` deleted. `deem-verb-narrowness` became `classifier-verb-narrowness` on `judge this plan acceptable and ship it`, same expectation |
| P2 hand-minified graph | Fixed: `b338131b67` uses the canonical exporter. A rerun differs only in `generated_at` |
| P2 stale `derived.last_updated_at` | Fixed in `5aa8b6ed16`. Routing stays `compiled-serving` |
| P2 doc versions | Kept: README and playbook 0.4.0.0, catalog 0.3.0.0, routing files 0.7.0.0. Sibling hubs carry independent doc versions and the doctor version checks pass |
| P2 Hermes mirrors naming Deem | Fixed by phase 004's sweep, mirror `--check` passes |
| P2 dangling generated paths | Phase 004's: README baselines regenerated in `3d4d54d5d8`, the trigger index rebuilt at its close |
| Advisor suite | Two runs under load averages above 20 failed only the freshness bench and native-scorer p95 budgets. Both passed in isolation, and a full run at load 5 to 7 passed 1055 with 0 failed |
<!-- /ANCHOR:log -->
