---
title: "Goal: angle driven review"
description: "Twenty review iterations in angle-driven waves over the deep-loop system, half on DeepSeek and half on GLM, every finding of any severity bound to a phase."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review"
    last_updated_at: "2026-09-15T09:48:34Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: angle driven review

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

**Objective:** Run twenty review iterations in angle-driven waves over the deep-loop system and its neighbours, expanding the angles between waves, and hand every confirmed finding of any severity, P0 through P3, to a phase of the parent.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Four lanes of five iterations as two waves of two at concurrency two; per wave one lane on DeepSeek V4.1 Flash at max and one on GLM 5.3 Flash at max, both via the gateway on cli-pi; stop policy max-iterations, convergence off. |
| D2 | Each lane reads this phase's spec, which names its five angles in order; wave-two angles are rewritten in the spec from wave-one findings before wave two launches. |
| D3 | Every finding cites file and line, is rated P0 to P3, and is verified by the orchestrator against the tree before binding; nothing is fixed inside the review. |

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

- [x] Twenty iterations completed across four lanes in two waves, each numbered record carrying the route-proof fields
- [x] The wave-two angles in the spec differ from the seeds, rewritten from wave-one findings, and the rewrite is committed before wave two ran
- [x] Every finding verified against the tree and bound to a parent phase or recorded as refuted with the reason
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
| Wave one | Done | DeepSeek and GLM lanes, angles 1 to 10, 40 findings: 1 P0, 14 P1, 25 P2 |
| Angle rewrite | Done | Angles 11 to 20 rewritten from wave one and committed before wave two ran |
| Wave two | Done | DeepSeek and GLM lanes, angles 11 to 20, 58 findings including wave-one carries; merged 4 lanes, verdict FAIL, P0 2, P1 34 |
| Binding | Done | Eight phases scaffolded under the parent, one per finding class |

### Deviations and findings

| Item | Note |
|------|------|
| One retry | The wave2-deepseek lane exited zero without its report on the first attempt; the retry produced it, and the runner's artifact gate caught the miss |
| Memory pressure | Three desktop applications held six gigabytes during wave two; the run was unaffected, only the orchestrator's waiters were reclaimed |
<!-- /ANCHOR:log -->
