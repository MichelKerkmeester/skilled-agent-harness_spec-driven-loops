---
title: "Goal: Command surface contract realignment"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/011-command-surface-contract-realignment"
    last_updated_at: "2026-09-07T03:45:00Z"
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
# Goal: Command surface contract realignment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the overengineering lane so that the command surface, the validator's help output and the documents that describe them match the system that runs, with every kept row carrying its reason and nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The acceptance-criteria document and the tasks.md verification checklist take the closure role the retired checklist held in the workflow assets; the P0/P1 protocol survives in the tasks checklist |
| D2 | Workflow assets name templates by their real repository paths, never by a symbolic convention |
| D3 | A row the lane put on its keep-list stays, and the confirmed-findings document records why; a kept row is a decision, not a deferral |
| D4 | The optimizer directory stays because its manifest has a cross-skill reader; its README states adoption to date |

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

- [x] Every row of the research lane's confirmed-findings table names a fix, a document change or a recorded decision
- [x] No /speckit:* asset names checklist.md, a level_contract_* symbol or a ticket id, and every asset parses
- [x] validate.sh --help prints every registry rule and a test asserts it
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
| Thirty findings and eight moves censused; one missed finding added | Done | `../005-overengineering-simplification/research/confirmed-findings.md` |
| Asset, printer, test and document changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | asset parse, printer syntax and count, help test, parity suite, drift guard, check gate, full CLI project, sk-doc validator, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| The rewrite script tripped on its own probe | The sk-code authoring checklist is named `spec-folder-authoring-checklist.md`; the residue probe matched it, the probe was narrowed to exclude that name, and the run was repeated from a clean tree. |
| The symbolic names were wider than the finding | The lane cited the four optional names; every core name used the same convention, so all 155 occurrences were replaced. |
| The yaml comments carried ticket ids | Eighteen comment lines named ticket and slice ids; the ids were dropped and the reasons kept, since the hygiene rule binds what the commit carries. |
<!-- /ANCHOR:log -->
