---
title: "Goal: Multiplexed rule split"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "canonical save split goal"
  - "registry one to one directive"
  - "multiplexed rule completion criteria"
  - "orchestrator special case objective"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/002-multiplexed-rule-split"
    last_updated_at: "2026-09-07T19:05:00Z"
    last_updated_by: "scaffold"
    recent_action: "Closed every criterion"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-recorded-findings-closure-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Multiplexed rule split

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each of the five `CANONICAL_SAVE_*` registry rows its own script so `validator-registry.json`'s `script_path` field is a true one-to-one mapping for that family, and remove the orchestrator's basename special case that exists only to route the old multiplex.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the `check-canonical-save.sh` multiplex (5 rows through 1 shell script) is split. The `ts:spec-doc-structure` multiplex (5 rows through 1 TS module with 5 already-dedicated functions) is documented as already attributionally sound and left alone |
| D2 | Shared logic (constants, JSON readers, packet-id normalization) moves into one required-by-all shared module rather than being copy-pasted five times |
| D3 | The old `check-canonical-save.sh` and its helper are deleted only after the five new scripts pass their tests, never before |
| D4 | No registry row's `rule_id`, `severity`, `category` or `description` changes. Only `script_path` values move |

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

- [x] `validator-registry.json`'s five `CANONICAL_SAVE_*` rows each name a distinct `script_path`
- [x] `orchestrator.ts` no longer references `check-canonical-save.sh` by basename
- [x] `validate.sh --help` lists the same 39 rule ids as before the split
- [x] `validate-runs-every-registry-rule.vitest.ts` and `canonical-save-validation.vitest.ts` both exit 0
- [x] `check-canonical-save.sh` and `check-canonical-save-helper.cjs` no longer exist in the tree
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
| Shared context module, five rule modules and wrappers, registry re-pointed, orchestrator special case removed | Done | `implementation-summary.md` Files Changed |
| Gates | Done | four suites 10 tests pass; validation lane 98, 31 and 83 checks pass; builds and check gate exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| The first generated rule modules rewrote words inside their message strings | The context rewrite reached string literals; the messages were restored to the helper's wording before any test ran |
<!-- /ANCHOR:log -->
