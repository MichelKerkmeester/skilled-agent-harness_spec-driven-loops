---
title: "Goal: Template seams and sentinel repair"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/016-template-seams-and-sentinel-repair"
    last_updated_at: "2026-09-07T07:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed every criterion"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Template seams and sentinel repair

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the template lane's second round so that the completion sentinel, the validators, the scaffolder, the rules, the templates and every document about them agree with the level contract, and every test lane the skill declares runs green in CI, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The verification checklist lives in `tasks.md`; every reader of the retired document, code or test, moves to that section |
| D2 | One continuity set, exported from the structure module; the resource map joins it because its template ships no block |
| D3 | The template-source rule gets its own document list; the file-presence rules keep the required list, because widening it fails packets that were never wrong |
| D4 | A flag whose templates never existed is removed rather than restored |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Every row of the template lane's round-two section names a fix, a document change, a removal or a recorded reason
- [x] The sentinel spawns the checklist evaluation on a tasks.md verification section and its suite proves it
- [x] The runtime, CLI, legacy and validation lanes pass and the workflow runs all four
- [x] validate.sh --strict prints RESULT: PASSED for this child
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
| Packet opened | Done | this file |
| Six P1 and twenty-eight P2 rows censused; three runtime failures traced to the sentinel row | Done | `../004-template-system-and-acceptance-criteria/research/confirmed-findings.md` §6 |
| Sentinel, validator, scaffolder, rule, helper, manifest, template, document and test changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | builds, check gate, dist freshness, four lanes, strict validation over the program and three older packets |

### Deviations and findings

| Item | Note |
|------|------|
| Widening the helper's document list broke the file-presence rules | Three older packets failed their level match on the first attempt; the wider list became its own command that only the template-source rule reads. |
| Literal edits against filtered output failed twice | The test fixtures were edited by line position after the exact lines were printed unfiltered. |
<!-- /ANCHOR:log -->
