---
title: "Goal: Phase 2: pins-imports-dual-export"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pins imports dual export goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/002-pins-imports-dual-export"
    last_updated_at: "2026-10-18T12:45:02Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-pins-imports-dual-export"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: pins-imports-dual-export

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the 11 mechanical OpenCode plugins load and run on both v1 1.19.3 and v2 2.0.32 with the v1 behaviour unchanged, and pin both package folders to the target versions.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | Writes stay inside the file list in `spec.md` section 3. |
| L2 | Module state is created inside `setup` and reset in its cleanup. Per-session state is keyed by session ID. |
| L3 | The v1 hook bodies stay as they are. Only the export wrapper and the v2 `setup` leg change. |
| L4 | Each v2 read uses the raw-query `api GET` form, and each capture records the command that made it. |
| L5 | Each dispatch changes one plugin, and the plugin suite runs before the next dispatch. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `opencode2 api GET /api/plugin` lists all 11 plugins from `scratch/mechanical-11.txt` as active, and `scratch/v1-load-after.txt` lists all 11 with no `failed to load plugin` line.
- [x] `scratch/suite-after.txt` reports zero failures and a pass count at or above `scratch/baseline-floor.txt`.
- [x] `scratch/registration-before.txt` reports 11 failures, and `scratch/registration-after.txt` reports 11 passes.
- [x] `.opencode/package.json` and `.skilled/package.json` pin `@opencode-ai/plugin` to 1.19.3, declare `zod` and list `@opencode/plugin` 2.0.32 as a dev dependency, and both lock files are regenerated.
- [x] `@opencode-ai/plugin/tool` appears in no plugin file outside the phase 3 files, and mechanical entry modules export only `default`.
- [x] `git status --porcelain` adds or changes no path outside `spec.md` section 3, and no step runs `opencode2 service stop`, `opencode2 service start` or `opencode2 service restart`.
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
| Planning documents filled | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and `implementation-summary.md` in this folder |
| Shared v2 bridge and its 17 tests | Done | `scratch/bridge-final.txt:18-21`, decision 8 (`scratch/decisions.txt:9`) |
| Two core modules and the seam moves | Done | `scratch/grep-checks.txt:7`, `scratch/grep-checks.txt:49-50`, decision 12 (`scratch/decisions.txt:13`) |
| 11 plugins ported to the dual export | Done | `scratch/grep-checks.txt:9-19`, `scratch/v2-plugin-final.json:5-83` |
| Tool identity helper | Done | `scratch/grep-checks.txt:51`, `scratch/bridge-final.txt:17` |
| Pins and both lock files | Done | `scratch/install.txt:3-9`, `scratch/grep-checks.txt:1-5`, decision 3 (`scratch/decisions.txt:4`) |
| Classifier import-time fix | Done | decision 10 (`scratch/decisions.txt:11`), `scratch/v2-plugin-final.json:5-8` |
| Before and after numbers | Done | floor 303 (`scratch/baseline-floor.txt:1`) to 331 pass 0 fail (`scratch/suite-final.txt:341-344`), registration 11 fail (`scratch/negative-control-registration.txt:12-15`) to 11 pass (`scratch/registration-final.txt:12-15`), v1 16 of 16 loaded (`scratch/v1-harness-final.jsonl:1-16`), v2 11 active (`scratch/v2-plugin-final.json:5-83`) |
| Bridge review and fixes | Done | `scratch/review-1-bridge.log:87-95`, decision 9 (`scratch/decisions.txt:10`) |
| Phase review and fixes | Done | `scratch/review-2-phase.log:145-153`, decisions 12 to 14 (`scratch/decisions.txt:13-15`) |
| Deviations recorded | Done | the deviation notes in `spec.md` and `plan.md` (decisions 8, 9, 10, 13) |
| Phase docs closed from the evidence | Done | `acceptance-criteria.md` rows, the `tasks.md` ticks and `implementation-summary.md`, each citing `scratch/` |
| Round 2 closeout pass | Done | `scratch/service-state.txt:2-5`, `scratch/scope-check.txt:80-86`, `scratch/status-after.txt:1-82`, `scratch/child-refusals.txt:3-45`, `scratch/doc-agreement.txt:1-22`, decision 15 (`scratch/decisions.txt:16`) |
| v2 execute of a bridged tool not observed live | Owed before phase 3 closes | decision 9 (`scratch/decisions.txt:10`), `scratch/evidence.md:34` |
| v2 session event delivery not observed live | Recorded | decision 13 (`scratch/decisions.txt:14`), `scratch/replay-session-event.txt:1-4` |
| Service-state capture for AC-005 | Done | `scratch/service-state.txt:2-5` records the service as PID 46220, started before the phase and unchanged at close |
| Scope residual for AC-009 | Done | `scratch/scope-check.txt:80-86` attributes every changed path and records the xcrun cache removal |

### Deviations and findings

| Item | Note |
|------|------|
| Import sites | The brief's scope-in replaces three imports here. Two of them sit in phase 3 plugins. The orchestrator's decision 1 replaced all three plus the test stub in this phase (`scratch/decisions.txt:2`). |
| Test seams | The brief says to move `__test`. Two seams move to core modules. Two seams have no reader, so they are removed. |
| Test call sites | Nine test files call default exports. Each one changes in the same task as its plugin. |
| Hard plugins | Hard plugins keep their function defaults in this phase. Only their import lines changed (decision 1), and their other tests stay as they are. |
| Dev dependency placement | `@opencode/plugin` 2.0.32 lives in `.skilled/package.json` devDependencies only, because v1 installs devDependencies from `.opencode/package.json` at startup (`scratch/devdep-probe.txt:26`, decision 3). |
| Shared bridge | Decision 8: one shared bridge, `.opencode/plugins/lib/v2-bridge.js`, builds every v2 `setup` leg from the unchanged v1 `server`, instead of 11 hand-written bodies. |
| Tool-result mapping | Decision 9: tool results convert to the v2 `{ content, metadata }` shape. A live v2 `execute` is not yet observed and is owed before phase 3 closes. |
| Session-event mapping | Decision 13: `session.*` events gain `properties.info = { id: sessionID }`. Live delivery is not observed. |
| Classifier fix | Decision 10: `score-injection-screen.mjs` wraps its import-time `realpathSync(process.argv[1])` in a try/catch for the Bun-compiled v2. |
<!-- /ANCHOR:log -->
