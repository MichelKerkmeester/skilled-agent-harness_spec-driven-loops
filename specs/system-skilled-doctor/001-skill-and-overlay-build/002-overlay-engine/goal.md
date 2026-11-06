---
title: "Goal: Phase 2: overlay-engine"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "overlay engine goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/002-overlay-engine"
    last_updated_at: "2026-11-06T07:23:10Z"
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
# Goal: Phase 2: overlay-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give Skilled one overlay engine, reached through `/doctor:overlay status` and `apply`, that keeps Barter's behavior and fixes the six defects the design names.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The straight port passes Barter's own tests before any fix |
| D2 | Each fix has a test recorded failing before the fix |
| D3 | Barter's tree is only read. The parity run uses a scratch copy |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` prints `fail 0`
- [x] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `fail 0`
- [x] `status` on a scratch copy of Barter's tree exits 0 and changes no file
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
| Straight port | Done | 21 of 21 ported tests passed before any fix |
| Fixes | Done | Engine tests 40 of 40, each fix test recorded red first |
| Command | Done | Doctor suite 1051 of 1051, `route-validate.sh` exit 0 |
| Parity | Done | Barter copy: exit 0, `in-sync=445`, unchanged |
| Phase 002 docs and save | Done | tasks, criteria and summary written; save recorded the protectedPaths decision |

### Deviations and findings

| Item | Note |
|------|------|
| Walked token files | The exact-path rule refused Barter's `repo-frontend` walk, so the operator chose a `protectedPaths` list on the entry (ADR-001) |
| Route-guard test | Not ported, because it tests Barter's copy of the routing guard and never calls the engine (ADR-003) |
| Owner fields | The ten moved commands' workflow files still named `system-spec-kit` as owner, so this phase finished that part of phase 001's move |
<!-- /ANCHOR:log -->
