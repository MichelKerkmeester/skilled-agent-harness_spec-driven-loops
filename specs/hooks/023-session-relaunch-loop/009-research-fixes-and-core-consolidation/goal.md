---
title: "Goal: Phase 9: research-fixes-and-core-consolidation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "research fixes and core consolidation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/009-research-fixes-and-core-consolidation"
    last_updated_at: "2026-10-19T19:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Checked all four completion criteria"
    next_safe_action: "Operator decides on merging worktree 148 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: research-fixes-and-core-consolidation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every verified finding of the session relaunch research is fixed with a test that fails without it, each decision the adapters shared has one owner in the core, and one conformance table holds every adapter to it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Scope is the verified findings and the architecture recommendation in `../research/research.md`, as the operator chose on 2026-10-19 ("Phase 009 incl. architecture"). The deep-loop projection bug stays with system-deep-loop. |
| D2 | The killer keeps accepting any descendant of the loop. Tightening it to the direct child would break in-process runtimes started through a shim. |
| D3 | Work stays in `worktrees/148-session-relaunch-deep-review`. The merge to main follows this phase, and the merge, the push and the worktree removal each wait for the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Each code finding's test fails on the pre-phase sources, and every session-relaunch suite and the Pi suite end with no failures (AC-001, AC-005)
- [x] No adapter sends a placeholder claim command or an unchecked spec folder, and the wrapper relaunches only an open note (AC-002, AC-003)
- [x] The shared decisions live once in the core, and the docs the research named match the code (AC-004, AC-006)
- [x] The full gate exits 0 and `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` prints `RESULT: PASSED` (AC-007)
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
| Research verified | Done | `../research/research.md` section 1, every finding read at its cited line |
| Red tests | Done | Pre-phase sources: node 49 of 510 failing, Pi 3 of 34 |
| Fixes, shared helpers and conformance | Done | node 510/510, Pi 34/34, conformance 28/28 |
| Phase closed | Done | AC 7/7 Met; full gate rc 0; recursive strict ten PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Pi and OpenCode keep their own pid as the kill target | The plan named `resolveKillerTarget` for them too. Both run in process, so their pid is the runtime by construction, and the killer already refuses a pid outside the loop. Their suites use non-numeric loop ids that a resolver would reject, so moving them would test the resolver's refusal instead of the arm path. Codex and Hermes keep `findLoopChildPid`, which the resolver wraps |
| Changed tests | Seeds without a note path, notes without a status and an `existsSync` spy pinned the old behavior. They now use real seeds, open notes and a behavioral check |
<!-- /ANCHOR:log -->
