---
title: "Goal: Scaffold, placeholder and upgrade truth"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth"
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
# Goal: Scaffold, placeholder and upgrade truth

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the template lane's third round so that a scaffold carries only values it knows, the placeholder rule catches the residue a scaffold should strip, an upgraded packet matches a fresh one, a phase parent fails loudly without its required file, and the templates obey the rules they cite, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A slot the scaffolder cannot fill stays a visible hint; only the feature name, packet id and date are filled |
| D2 | The placeholder rule flags the two fill-token classes only; bracketed hints and the provenance backlog stay with the standalone script, because a rule class for provenance would fail 1,240 closed documents |
| D3 | An upgrade adds what a fresh scaffold has and nothing the contract calls lazy |
| D4 | Review and research packets are the loops' to write; the scaffolder says so instead of learning them |

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

- [x] Every row of the template lane's round-three section names a fix, a document change or a recorded reason
- [x] A fresh scaffold carries no provenance token and no feature name in a slot that is not a name
- [x] The upgrade script creates the lifecycle summary and no longer creates the lazy decision record
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
| Nineteen rows and one parked GLM iteration censused | Done | `../004-template-system-and-acceptance-criteria/research/confirmed-findings.md` §7 |
| Scaffolder, rule, upgrade, resolver, template, reference and test changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | builds, check gate, goldens, parity, registry coverage, upgrade suite, four lanes, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| The lane's placeholder row cited the standalone script's argument block | The rule and the script are different programs; the rule was the narrow one, and the finding held for it |
| The registry-coverage test written for the overengineering child caught a rule id drift here | The protocol rule reported a singular id while the registry carries the plural; the script now reports the registry's id |
| A provenance class in the rule was tried and reverted | The extended suite's fixture failed on it, and 1,240 closed documents would have followed; the scaffold strip and the golden assertion stay |
<!-- /ANCHOR:log -->
