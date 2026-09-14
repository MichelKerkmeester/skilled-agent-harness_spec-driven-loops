---
title: "Goal: iteration record dedupe"
description: "Phase 002 of the fan-out containment work: Stop the runner rejecting a completed lane because its state log holds each iteration record twice."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/002-iteration-record-dedupe"
    last_updated_at: "2026-09-14T08:26:47Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-002-iteration-record-dedupe"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: iteration record dedupe

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Stop the runner rejecting a completed lane because its state log holds each iteration record twice.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The max-iterations validator deduplicates iteration records by iteration number before checking the set, and prefers the record carrying route-proof fields. |
| D2 | Two of four research lanes, on two executor kinds, were rejected this way with three iterations complete; the leaf writes the state file directly as well as through the gateway. The runner tolerates that rather than depending on a contract two models broke. |
| D3 | The three reference lines that told the leaf to append to the state log directly, in quick-reference.md, loop-protocol.md and spec-check-protocol.md, are corrected to name the gateway, which is the single source of the duplicate. |
| D4 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] A state log holding 1,2,3,1,2,3 with routed and unrouted copies passes validation and the routed copies are the ones retained
- [ ] A state log genuinely missing an iteration still fails, with a test proving the deduplication did not mask it
- [ ] No reference under deep-research/references instructs a direct write to deep-research-state.jsonl
- [ ] The retained LUNA and GLM lineages under research/lineages replay as fulfilled
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
| Phase fix | Pending | dispatched to DeepSeek V4.1 Flash max via the gateway on cli-pi when its turn comes |

### Deviations and findings

| Item | Note |
|------|------|
| none yet | - |
<!-- /ANCHOR:log -->
