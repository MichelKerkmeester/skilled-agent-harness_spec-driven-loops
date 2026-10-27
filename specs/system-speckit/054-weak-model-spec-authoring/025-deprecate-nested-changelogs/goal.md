---
title: "Goal: Phase 25: deprecate-nested-changelogs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deprecate nested changelogs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/025-deprecate-nested-changelogs"
    last_updated_at: "2026-10-27T12:15:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-025-deprecate-nested-changelogs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 25: deprecate-nested-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Nothing creates a changelog inside a spec folder; release notes live only in `.skilled/changelog/` and the skills' own `changelog/` folders.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Stop generating only: the 64 existing packet changelogs and the generator stay, and the generator prints a deprecation notice. |
| D2 | Component changelogs under `.skilled/changelog/` and every skill's `changelog/` folder, hub member links included, do not change. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -n "nested-changelog" .skilled/commands/speckit/assets/ .skilled/commands/create/` prints nothing, and a fresh `create.sh --phase` child has no `**Changelog**:` line
- [x] The system-spec-kit CLI suite shows no new failure, and the generator test pins the deprecation notice
- [x] Every row of this phase's `acceptance-criteria.md` reads Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Scope chosen | Done | operator, 2026-10-27: stop generating, keep generator and files |
| Built and verified | Done | suite 2241 passed 0 failed, AC-001 to AC-006 Met, 64 packet changelogs unchanged |
| Review | Done | Opus medium: no P0, 2 P1 and 4 P2 fixed (phase child intent, refusal before setup, notice before parsing, doc wording) |

### Deviations and findings

| Item | Note |
|------|------|
| create.sh phase line | Found while scaffolding: the phase context told every child to refresh a packet changelog, so it joined the scope |
<!-- /ANCHOR:log -->
