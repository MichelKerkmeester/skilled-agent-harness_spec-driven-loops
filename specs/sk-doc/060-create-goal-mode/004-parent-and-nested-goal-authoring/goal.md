---
title: "Goal: Phase 4: parent-and-nested-goal-authoring"
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
    packet_pointer: "sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned parent and nested goal workflow"
    next_safe_action: "Execute the planned phase tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "UNKNOWN"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: parent-and-nested-goal-authoring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Provide complete goal authoring for top-level packets, phase parents, and nested phase children.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Retrofitting an existing packet without goal.md is a separately invocable authoring operation (specs/sk-doc/060-create-goal-mode/spec.md:159). |
| D2 | Before writing phase binding rows, compare the parent map with the direct child directories and stop if the sets differ (specs/sk-doc/060-create-goal-mode/spec.md:119-129). |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The parent-and-nested-goals reference exists in the sk-create-goal mode packet.
- [ ] The parent-and-nested-goals fixture has 3 phase-child directories and 3 parent binding rows.
- [ ] The scratch fixture strict validator, run on every rule except the three generated-metadata rules, exits 0, prints RESULT: PASSED, and reports 0 SPECDOC_SUFFICIENCY_006 findings.
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
| Phase planned | Done | this folder's spec.md, plan.md, tasks.md |
| Workflow reference | Done | `references/parent-and-nested-goals.md`, loaded by `SKILL.md` and listed in the index |
| Fixture | Done | 3 folders, 3 exact binding rows, 0 `SPECDOC_SUFFICIENCY_006`, `RESULT: PASSED` on the approved rule scope |
| Phase-add check | Done | rows 3 to 4 for 4 folders on a copy of the fixture (`scratch/phase-add-check.md`) |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-26 |

### Deviations and findings

| Item | Note |
|------|------|
| Fixture criterion amended | The graph-metadata writer excludes every path containing `scratch` (`spec-doc-paths.ts:132`, `backfill-graph-metadata.ts:46`), so a scratch fixture can never pass the three generated-metadata rules. The operator chose, on 2026-09-26, to judge the fixture on every other rule. The last criterion above, REQ-007, SC-005, NFR-R02 and AC-007 now say so. No parent decision or criterion changed. |
| Three worker stops | Worker 1 halted on an edit-string mismatch. Worker 2 wrote one file to a mistyped sibling folder and halted; the orchestrator moved it into the fixture and removed the empty folder. Worker 3 finished from a literal path list and stopped only on the metadata writer rule. |
| No pre-phase copy | T003's rollback copies were not taken before the edit; the rollback is removing the four lines this phase added. |
| HVR repair | Two semicolons and three Oxford commas fixed in the new reference; 0 hard blockers, mechanical ceiling 88/100. |
<!-- /ANCHOR:log -->
