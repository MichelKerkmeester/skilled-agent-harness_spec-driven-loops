---
title: "Goal: worktree removal"
description: "Phase 007 of the fan-out containment work: Remove the per-lineage worktree mechanism entirely, since attribution is not a requirement and preserve-by-default plus never-fatal meet the operator's need."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal"
    last_updated_at: "2026-09-14T09:09:01Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-007-worktree-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: worktree removal

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

**Objective:** Remove the per-lineage worktree mechanism entirely, since attribution is not a requirement and preserve-by-default plus never-fatal meet the operator's need.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The five worktree modules, their wiring in the runner, the worktrees flag and config field, the launch-wrapper split-link provisioning, their tests, and the skip-worktree cone plan are deleted rather than left dormant. |
| D2 | Lineage path resolution collapses to the shared-checkout mapping that predates isolation. Publication by run-keyed name stays, because it is what keeps concurrent runs from colliding on one checkout. |
| D3 | This is the last phase: every other fix lands on the runner first, so the removal is verified against a repaired runner. |
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

- [ ] No file under runtime/lib/deep-loop matches worktree-* and no flag or config key named worktrees remains
- [ ] The deep-loop suite and the launch-wrapper tests exit zero after removal
- [ ] A fan-out on the shared checkout with a neighbour writing mid-run completes with every lane fulfilled and every out-of-scope file preserved, run live on this checkout
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
