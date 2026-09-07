---
title: "Goal: Template contract alignment"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/010-template-contract-alignment"
    last_updated_at: "2026-09-07T02:20:00Z"
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
# Goal: Template contract alignment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the template lane so that the level contract is the one authority for which documents a packet has, every add-on has a documented creator, and every document describing the template system matches the code, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The `levels` rows of the manifest are the authority; the `documents` index is descriptive and says so |
| D2 | The closure document stays an optional add-on scaffolded at Level 2 and above, because the file-presence rule cannot see the rollout cutoff |
| D3 | `goal.md` gets a scaffold flag rather than an automatic write, so a packet carries a directive only when an operator will set one |
| D4 | Documents that no longer exist are removed from prose everywhere they are presented as current; historical notes keep them |

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
- [x] create.sh --with-goal scaffolds a goal.md that validates, and a Level 2 scaffold still carries acceptance-criteria.md
- [x] The manifest version of every template equals its marker and a test asserts it
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
| Fifteen P1 and twenty P2 rows censused; the operator's four questions answered | Done | `../004-template-system-and-acceptance-criteria/research/confirmed-findings.md` |
| Contract, scaffolder, validator, checker, rule, test and document changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | builds, check gate, 22 targeted tests, runtime structure suites, smoke scaffolds, checker run, residue sweep, sk-doc validator, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| The goal template failed its own scaffold | `last_updated_by: "[AUTHOR]"` is not an actor slug; the smoke scaffold caught it and the template now uses the same slug the closure template uses. |
| Three assets the lane did not list still described the retired checklist | The level-decision matrix, the template mapping and the parallel-dispatch config; found by the residue sweep and corrected. |
| The continuity-freshness test fails before this phase | Its fixture edits a retired `checklist.md`; recorded for the tests lane, not patched here. |
<!-- /ANCHOR:log -->
