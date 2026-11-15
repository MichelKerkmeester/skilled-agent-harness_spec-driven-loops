---
title: "Goal: Phase 10: hub-registration-and-routing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub registration and routing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/010-hub-registration-and-routing"
    last_updated_at: "2026-11-14T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Registered cli-mistral-vibe as the eighth hub mode"
    next_safe_action: "Phase 011 adds the goal bridge and dist-freshness hooks"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/mode-registry.json"
      - ".skilled/skills/cli-external-orchestration/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 006 ships sync-agents-vibe.cjs --check"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: hub-registration-and-routing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the cli-external-orchestration hub route a request to delegate to Mistral Vibe to the `cli-mistral-vibe` mode at both routing stages.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The mode is `routingClass: "metadata"`, so it gets no advisor entry or projection map of its own |
| D2 | No bare `vibe` alias. Aliases are `mistral vibe`, `vibe -p` and `delegate to vibe` |
| D3 | The mode sits last in `routerPolicy.tieBreak`, after `cli-deepseek-harness` |
| D4 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` prints `"workflowMode":"cli-mistral-vibe"`
- [x] `skill_advisor.py "delegate to vibe" --threshold 0.5` names `cli-external-orchestration`
- [x] `parent-skill-check.cjs .skilled/skills/cli-external-orchestration` reports 8 modes and no hard failure
- [x] "give this landing page a calmer vibe" does not route to `cli-mistral-vibe`
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
| Routing baseline | Done | 7 modes, compiled router served `legacy` with `stale-manifest`, scorer suite 1 failed of 365, executor-delegation 38 passed (`scratch/baseline.txt`) |
| Registration | Done | `mode-registry.json` declares 8 modes; hub-router, ROUTER, graph-metadata, SKILL, README, description and leaf-manifest name the mode; `rg -c '"vibe"' hub-router.json` prints 0 |
| Compiled routing | Done | Authored activation manifest pinned to `3bc7c5fe...`; sync promoted 62 closure files and finalized; manifest tests 48/48; status `"fresh":true`, `compiled-serving` |
| Stage two | Done | "delegate to vibe" routes `cli-mistral-vibe`; "use cli-opencode with mistral deepseek-v4-1-flash-1017" routes `cli-opencode`; "give this landing page a calmer vibe" defers (`scratch/replays.txt`) |
| Stage one | Done | `skill_advisor.py "delegate to vibe" --threshold 0.5` names `cli-external-orchestration` at 0.95, `passes_threshold: true`; the landing-page prompt returns `[]` |
| Advisor suites | Done | card-sync exit 0; executor-delegation 42 passed (baseline 38); scorer 367 passed, 2 skipped, 0 failed (baseline 1 failed) |
| Per-hub gate | Done | `parent-skill-check.cjs` exit 0, 8 modes, 0 failures, 0 warnings |
| Mirrors | Done | `check-agent-mirror-sync.cjs --all` all comparable mirrors in sync; the three `.vibe` sync `--check` commands exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Stage one passes before any edit | The advisor already picks the hub for "delegate to vibe" on generic delegation words, so stage two is the real handoff test |
| Sync failed until finalize | The first sync run failed its move simulation; a rerun after the pin promoted cleanly. The manifest tests then failed 16 with `publication-locked` until `--finalize` released the lock, after which 48/48 passed |
| 13d failures were ours | The three packet-version failures on cli-deepseek-harness, cli-opencode and cli-pi came from this packet's version bumps in phases 002 and 003, not from main. Changelog entries v1.0.1.0, v1.5.11.0 and v1.5.22.0 were added and the gate passed |
| Scorer suite improved | The one scorer failure in the baseline no longer fails after the routing edits; the cause was not traced |
| `.vibe/agents/` generator | Answered: phase 006 ships `sync-agents-vibe.cjs --check`, and it exits 0 |

<!-- /ANCHOR:log -->
