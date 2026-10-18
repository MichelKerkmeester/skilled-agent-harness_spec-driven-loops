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

- [ ] `opencode2 api GET /api/plugin` lists all 11 plugins from `scratch/mechanical-11.txt` as active, and `scratch/v1-load-after.txt` lists all 11 with no `failed to load plugin` line.
- [ ] `scratch/suite-after.txt` reports zero failures and a pass count at or above `scratch/baseline-floor.txt`.
- [ ] `scratch/registration-before.txt` reports 11 failures, and `scratch/registration-after.txt` reports 11 passes.
- [ ] `.opencode/package.json` and `.skilled/package.json` pin `@opencode-ai/plugin` to 1.19.3, declare `zod` and list `@opencode/plugin` 2.0.32 as a dev dependency, and both lock files are regenerated.
- [ ] `@opencode-ai/plugin/tool` appears in no plugin file outside the phase 3 files, and mechanical entry modules export only `default`.
- [ ] `git status --porcelain` adds or changes no path outside `spec.md` section 3, and no step runs `opencode2 service stop`, `opencode2 service start` or `opencode2 service restart`.
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
| Pins, port, verification and review | Pending | Tasks T001 to T031 in `tasks.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Import sites | The brief's scope-in replaces three imports here. Two of them sit in phase 3 plugins. This goal follows the spec default of one import, and task T003 records the orchestrator's decision. |
| Test seams | The brief says to move `__test`. Two seams move to core modules. Two seams have no reader, so they are removed. |
| Test call sites | Nine test files call default exports. Each one changes in the same task as its plugin. |
| Hard plugins | Hard plugins keep their function defaults in this phase, so their tests stay as they are. |
<!-- /ANCHOR:log -->
