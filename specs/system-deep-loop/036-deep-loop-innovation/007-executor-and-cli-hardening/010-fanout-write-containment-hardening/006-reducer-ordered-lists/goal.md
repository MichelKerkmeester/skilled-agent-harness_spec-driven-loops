---
title: "Goal: reducer ordered lists"
description: "Phase 007 of the fan-out containment work: Register findings a lane wrote as a numbered list, and flag a lane that registered nothing."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/006-reducer-ordered-lists"
    last_updated_at: "2026-09-14T08:26:47Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase fix landed and criteria checked"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-007-reducer-ordered-lists"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: reducer ordered lists

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

**Objective:** Register findings a lane wrote as a numbered list, and flag a lane that registered nothing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lineage reducer already reads numbered lists; the registry went missing because the reducer threw on a strategy file written without anchor markers before it wrote the registry it had built. It now keeps such a strategy file unchanged, records the warning, and writes the registry and dashboard. A fulfilled lane whose registry is empty while its deltas are not is reported on the ledger as a warning, never silently passed. |
| D2 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

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

- [x] The retained SWE-2 lineage re-reduces to a non-empty registry
- [x] A lane with three deltas and an empty registry emits a ledger warning naming the lane
- [x] Bullet-list extraction is unchanged, with the existing cases still green
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; coded anchor errors and the catch in `reduce-state.cjs`, settle advisory in `fanout-run.cjs`, two tests; touched files plus typecheck exit 0 |
| Full suite | Green | `npm test` in the runtime: 156 files, 2670 passed, 7 skipped, exit 0, 1333 s |

### Deviations and findings

| Item | Note |
|------|------|
| Premise corrected | List extraction already read numbered items; the reproduction showed the reducer throwing on the Devin-written strategy file before the registry write. D1 amended before dispatch |
| SWE-2 replay | 27 key findings on a temp copy, strategy file untouched |
<!-- /ANCHOR:log -->
