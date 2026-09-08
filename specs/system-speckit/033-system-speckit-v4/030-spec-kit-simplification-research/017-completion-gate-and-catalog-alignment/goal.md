---
title: "Goal: Completion gate and catalog alignment"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/017-completion-gate-and-catalog-alignment"
    last_updated_at: "2026-09-07T09:40:00Z"
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
# Goal: Completion gate and catalog alignment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the overengineering lane's second round so that the completion checker and the sentinel enforce the acceptance closure the workflow authors, a hand-written attestation is visible as its own class, the links scan is honestly a tool, and every cited document and catalog entry describes the running system, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The checker reads the acceptance table; the sentinel gains a status, not a second reader |
| D2 | A hand-written stamp is classified, not rewritten: the 27 closed packets keep their text and their generated fingerprints |
| D3 | The links scan stays a standalone tool with no registry row, because its repository-wide run reports memory-name links that are not files |
| D4 | A catalog reference to a removed file is marked removed in place, never deleted, so the entry's history stays readable |

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

- [x] Every row of the overengineering lane's round-two section names a fix, a document change or a recorded reason
- [x] check-completion.sh --json reports AC_UNMET for an Unmet criterion and the sentinel suite proves the advisory
- [x] The freshness suite proves the malformed_fingerprint class
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
| Two P1 and thirteen P2 rows censused; the sentinel row found half-closed by child 016 | Done | `../005-overengineering-simplification/research/confirmed-findings.md` §6 |
| Checker, sentinel, freshness, links, document, catalog and test changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | rebuild, check gate, dist freshness, four lanes, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| The program's own earlier checklists carry no evidence tokens | The checker reports `EVIDENCE_MISSING` on child 016's tasks document because its rows state evidence in prose rather than in a marker; this packet's rows use the marker. Earlier children are closed packets and were left as written. |
| The lane's catalog count was ten stale references in its tree; the main checkout had ten as well after the relative-path form was included | The first scan, which matched only the absolute form, found three. |
<!-- /ANCHOR:log -->
