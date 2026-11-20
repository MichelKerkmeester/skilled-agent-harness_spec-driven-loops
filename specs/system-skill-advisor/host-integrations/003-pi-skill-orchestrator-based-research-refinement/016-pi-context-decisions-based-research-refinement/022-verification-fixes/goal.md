---
title: "Goal: Phase 22: verification-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "verification fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/022-verification-fixes"
    last_updated_at: "2026-11-20T15:31:24Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 22: verification-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every defect the phase 021 verification named, so the launcher never kills a healthy daemon after a sleep and the semantic lane, refresh, hook and DSH boundary behave as their docs say.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each behavior fix lands with a test seen failing on the worktree base `24749648b24`; the watcher test is shown failing with the refresh call removed |
| D2 | The last-marker strip rule stays; the fixture pins its miss with an `ideal` answer |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `acceptance-criteria.md` in this phase has every row `Met`
- [ ] The runtime `npx vitest run` after `skill_graph_scan --trusted` reports no failure absent from the 2559-passed baseline
- [ ] `node --test .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs` reports 0 failures
- [ ] `git merge-base --is-ancestor worktrees/489-advisor-verification-fixes origin/main` exits 0
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
| Baseline | Done | Worktree 489 at `24749648b24`: 195 files, 2559 passed, 8 skipped |
| Fixes | Done | eleven 021 findings and three review follow-ups fixed test first; runtime 2570, bin 97, DSH 25, Python 123; @review APPROVED |

### Deviations and findings

| Item | Note |
|------|------|
| Code written natively, not by Luna | Operator chose "Native, as 020" for this phase; parent D2 amended |
<!-- /ANCHOR:log -->
