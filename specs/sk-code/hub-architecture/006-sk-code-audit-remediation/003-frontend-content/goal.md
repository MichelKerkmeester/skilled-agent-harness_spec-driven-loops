---
title: "Goal: Phase 3: frontend-content"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "frontend content goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/003-frontend-content"
    last_updated_at: "2026-11-14T12:01:52Z"
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
# Goal: Phase 3: frontend-content

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the frontend packet's documents agree with its router, with each rule in one file and a scenario for every intent.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | The router is the authority. A document that disagrees with it changes, the router does not. |
| D2 | A moved rule keeps its wording and its id. |
| D3 | No new framework section is added. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -l 'visual, motion and Figma intents' .skilled/skills/sk-code/sk-code-frontend/SKILL.md .skilled/skills/sk-code/sk-code-frontend/ROUTER.md .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md | wc -l` prints 3, and `rg -c 'web layer before applying a topic reference' .skilled/skills/sk-code/sk-code-frontend/SKILL.md` prints nothing and exits 1.
- [ ] `ls .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/*.md | wc -l` prints 11, and the playbook package validator exits 0.
- [ ] `cat .skilled/skills/sk-code/sk-code-frontend/references/*.md | rg -c '^### M[0-9]+\.'` prints 57, the count before the move, so no motion rule is lost or duplicated.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/003-frontend-content --strict --quiet` prints `RESULT: PASSED`.
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
| Spec, plan, tasks and acceptance criteria authored | Done | Written on 2026-11-14 from the audit evidence in `../001-finding-verification/` |
| Implementation | Pending | Not started |
| Phase 003 content edits | Done, phase not closed | Code 62507384e6. 26 DeepSeek V4.1 Flash dispatches through cli-pi. REQ-001, 002 and 005 to 010 print as written. Playbook validator PASS with 11 scenarios, router-sync 5/5, doc-claims 4/4, tests 53, 154 and 15 pass |
| REQ-003 baseline is wrong | Open, operator decision | The motion rule id count before any move was 57, not 48: rg -c on web-motion-and-interaction.md at ff0673af0a prints 57. After the move the count across references is still 57, so no rule is lost or duplicated, but the criterion as written cannot print 48 |
| REQ-004 is out of reach inside the frozen scope | Open, operator decision | Moving the eight rules row F7 lists takes the motion reference from 642 to 586 lines. 400 or fewer would need about 27 more rules moved, which F7 does not list and decision D2 and the scope do not cover |
| Failure path behaves differently from spec.md | Recorded | A scenario with a wrong expected resource leaves validate-playbook-package.cjs at exit 0. verify-router-sync.cjs check 4 is what fails, with exit 1 and the scenario named. Triggered on web-layout.md and restored |
| File outside the Files to Change table | Recorded | sk-code-skilled/SKILL.md gained one FRONTEND row in its checklist map, because quality-checklist-map.test.cjs compares that table with the registry and REQ-005 needs it to pass. The file is inside the sk-code hub |
| Operator answer 2026-11-14: correct the motion rule id baseline from 48 to 57 | Done | AskUserQuestion answer, Q001 in decision-record.md. The figure changed in goal.md, spec.md, plan.md, tasks.md and acceptance-criteria.md |
| Operator answer 2026-11-14: accept 586 lines for the motion reference | Done | AskUserQuestion answer, Q002 and ADR-001 in decision-record.md. AC-004 is Superseded |
| Phase 003 closed | Done | Code 62507384e6. Nine criteria Met, AC-004 Superseded by ADR-001. Rows F5 to F13 carry fix evidence |

### Deviations and findings

| Item | Note |
|------|------|
| None so far | Nothing has diverged from the directive |
<!-- /ANCHOR:log -->
