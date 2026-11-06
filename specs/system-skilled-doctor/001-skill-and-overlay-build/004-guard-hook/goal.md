---
title: "Goal: Phase 4: guard-hook"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "guard hook goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/004-guard-hook"
    last_updated_at: "2026-11-06T07:23:12Z"
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
# Goal: Phase 4: guard-hook

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Refuse an agent's edit to a file a vendored copy's overlay owns, before it is written, in every runtime the hook registry serves.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hook only asks the engine. It never applies an overlay |
| D2 | A repository with no overlay folder pays two file checks and nothing more |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` prints `fail 0`
- [x] `rg -n "post-edit|--apply|apply --capture" .skilled/hooks/overlay-guard` prints nothing
- [x] `sync-hook-registrations.cjs --check` prints `PASS`
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
| Hook tests | Done | 17 of 17 failed before the core, 18 of 18 pass |
| Registrations | Done | 4 files and 20 Pi extensions in sync |
| Phase 004 docs and save | Done | hook tests 18 of 18; registrations in sync |

### Deviations and findings

| Item | Note |
|------|------|
| Cursor fallback | The envelope fallback swallowed the refusal, so the Cursor binding has none (ADR-001) |
| Other Cursor deny hooks | `spec-gate-enforce` and `task-dispatch-guard` use the same chain and may never refuse in Cursor. Not tested here |
<!-- /ANCHOR:log -->
