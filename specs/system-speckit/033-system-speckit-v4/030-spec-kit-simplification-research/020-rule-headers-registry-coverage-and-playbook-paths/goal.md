---
title: "Goal: Rule headers, registry coverage and playbook paths"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/020-rule-headers-registry-coverage-and-playbook-paths"
    last_updated_at: "2026-09-07T15:20:00Z"
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
# Goal: Rule headers, registry coverage and playbook paths

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the overengineering lane's third round so that every registry rule is proven to run, sibling rules name their split, dead windows are gone, playbook commands run, and the routing claim is true, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A rule is proven by validation output on a real scaffold, never by a name search |
| D2 | Sibling rules that divide one zone document the split; they are not merged across the orchestrator boundary |
| D3 | An expired window is removed, not documented |
| D4 | A redesign of the command surface is recorded, not folded into a remediation child |

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

- [x] Every row of the overengineering lane's round-three section names a fix, a document change or a recorded reason
- [x] The registry-coverage test passes with every id seen
- [x] The canonical-save helper carries no allowlist
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
| Nineteen rows and two parked GLM iterations censused | Done | `../005-overengineering-simplification/research/confirmed-findings.md` §7 |
| Test, rule, helper, playbook, routing and reference changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | coverage suite, syntax checks, four lanes, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| The coverage test caught a drift the lane did not name | The protocol rule's reported id differed from the registry row by one letter |
| The placeholder-convention row did not reproduce | Neither token the row cites occurs in the six assets in the main checkout |
<!-- /ANCHOR:log -->
