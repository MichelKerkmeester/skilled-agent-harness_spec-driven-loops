---
title: "Goal: Pre-existing test repair"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/012-pre-existing-test-repair"
    last_updated_at: "2026-09-07T04:35:00Z"
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
# Goal: Pre-existing test repair

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the two test suites the program recorded as pre-existing failures pass for the reason their subjects define, without changing any rule, script or packet outside the two test files.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A stale edit in the freshness fixture lands on the document the rule hashes, the implementation summary; the retired checklist leaves the fixture |
| D2 | The manifest suite owns every manifest it asserts on; another packet's goal manifest is never a test input |
| D3 | The deep-loop packet's stale goal manifest is reported to the operator, not edited here |

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

- [x] The continuity-freshness suite and the recursive-child-manifest suite pass in isolation
- [x] The full CLI vitest project reports zero failures
- [x] Only the two test files changed
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
| Both failures reproduced | Done | freshness: expected warn, received pass; manifest: expected exit 0, received 1 |
| Root causes traced | Done | the rule hashes the implementation summary only; the goal manifest lists 369 files a later refactor removed |
| Repair and gates | Done | `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| The deep-loop packet's goal manifest is stale | 369 of its 2,016 entries are no longer tracked, most under the removed deep-alignment mode and the runtime tree; its owner should regenerate it. |
<!-- /ANCHOR:log -->
