---
title: "Goal: Decision capture series"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "decision capture goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture"
    last_updated_at: "2026-11-01T21:30:00Z"
    last_updated_by: "series-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 17
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Decision capture series

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every operator answer, in every runtime that offers an answer surface, land once in the right packet as a rewritten decision with its verbatim exchange, and prove it in a live, multi-turn conversation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every child changes the decision-capture pipeline: `.skilled/hooks/decision-capture/`, the decision-record writer or the save step. Other work gets its own packet. Exception (2026-11-03): 010 may change `system-spec-kit` routing metadata. |
| D2 | Children 002 to 005 close only once the 006 conversation scenario re-proves them. |
| D3 | 006 runs on the shared conversation runner from `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios` with no runner of its own. |
| D4 | Live tests run in a scratch project and never write this repository's packets or decision-capture state. |
| D5 | A runtime adapter is registered only after a live probe shows the answers. A runtime with no answer surface is recorded with evidence, never skipped. |
| D6 | Implementation workers run `gpt-6-luna` xhigh, tier fast, via cli-codex. When its quota runs out they use `llmgateway/deepseek-v4.1-flash-1017` max via cli-pi. Luna never runs through a gateway. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-decision-capture-build | `001-decision-capture-build/goal.md` |
| 002-table-row-matching | `002-table-row-matching/goal.md` |
| 003-codex-and-pi-capture | `003-codex-and-pi-capture/goal.md` |
| 004-opencode-devin-live-capture | `004-opencode-devin-live-capture/goal.md` |
| 005-chat-question-detection | `005-chat-question-detection/goal.md` |
| 006-live-conversation-test | `006-live-conversation-test/goal.md` |
| 007-gap-closure | `007-gap-closure/goal.md` |
| 008-project-scoped-state | `008-project-scoped-state/goal.md` |
| 009-chat-answer-evidence | `009-chat-answer-evidence/goal.md` |
| 010-decision-routing-vocabulary | `010-decision-routing-vocabulary/goal.md` |

**Precedence.** Decisions outrank child detail, which outranks any summary of it. Name any conflict, never resolve it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture --strict --recursive` prints `RESULT: PASSED` for `043-decision-capture` and for each of its six children 001 to 006.
- [ ] The phase map in `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/spec.md` lists children 001 to 006, each with Status Complete.
- [ ] The 006 results matrix has one row each for Claude Code, OpenCode, Codex, Pi and Devin, each showing a passing conversation run, or no answer surface backed by a cited probe file or transcript path.
- [ ] The 006 results matrix has a re-proof row for each of children 002, 003, 004 and 005, and all four rows read pass.
- [ ] In the 006 Claude Code run, no key appears twice in the scratch project's queue file, no Gate 3 or other process question appears in that queue file or in the scratch packet's `decision-record.md`, and a second full-auto save changes no byte of that `decision-record.md`.
- [ ] `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` exits 0.
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
| 001 decision capture build | Done | Committed and pushed as `23b4f3d2e7`, `198c922956` and `5ce5feb336` |
| 002 to 006 planned | Done | Level 2 spec, plan, tasks and acceptance criteria in each child, 2026-11-01 |
| 006 shared runner | Pending | 065's scenario contract is Complete; its runner is not built |
| Research folded | Done | 2026-11-01: 002 to 006 docs updated, findings placement in spec.md |
| 002 build | Built | 34 tests pass; real run consumed 31 Barter rows, record 12 saved as 001 Q008, records 1 to 30 none pending; closes after the 006 re-proof |
| 006 scenario files | Written | Both files validate with 0 violations; no runs until the 065 runner exists |
| Children 003 to 005 pre-006 close-out | Done | every non-006 task, checklist and AC row marked on rerun evidence; 003 ADR-001 supersedes AC-001 and AC-003; lib+bin 78 of 78, plugins 60 of 60; 003, 004, 005 validate --strict PASSED |
| 006 live conversations | Blocked | the 065 five-runtime matrix has no clean PASS since matrix2 at 08:38, and the Codex hook-trust rule is not built |
| 006 live conversations | done for 4 of 5 | Claude, OpenCode, Pi, Devin main 14/14 + kill-switch 1/1 on the mirror root; Codex waits on its quota (2026-11-05) and the hook-trust rule (Q012) |
| Children closed after 006 | 004, 005 Complete | 004 and 005 validate --strict PASSED; 002 waits on two operator answers; 003 waits on the Codex run; lib+bin 93/93 |
| All six children Complete | done | Codex ran 2026-11-02; save sufficiency gate fixed; next: deep review, alignment, second live pass, commit list (Q010) |
| Children 008 to 010 Complete | done | 2026-11-03: per-project state, chat-answer evidence and decision routing built and verified; hooks 122/122, writer, matcher and session-stop 52/52; recursive strict 11/11 PASSED; not committed |

### Deviations and findings

| Item | Note |
|------|------|
| Series parent goal | phase-definitions.md gives a series parent no `goal.md` by default. The operator asked for goals on the parent and every child (decision-record.md Q002). |
<!-- /ANCHOR:log -->
