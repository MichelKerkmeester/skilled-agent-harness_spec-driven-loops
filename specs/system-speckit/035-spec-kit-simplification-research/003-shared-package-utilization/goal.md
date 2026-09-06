---
title: "Goal: Shared package utilization"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/003-shared-package-utilization"
    last_updated_at: "2026-09-07T00:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed every criterion after remediation"
    next_safe_action: "None; the lane is closed"
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
# Goal: Shared package utilization

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Establish what every module of @spec-kit/shared is for, who consumes it, what is residue of the retired memory database, and what should be removed, merged or moved to its sole consumer.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research is read-only; remediation lands in a sibling child created after synthesis |
| D2 | A module counts as live only with an importer outside the package |
| D3 | Boundary findings cite the importing line and the exported symbol |

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

- [x] 10 iteration files and 10 state events exist under research/lineages/glm-5-3-flash-shared-package/
- [x] research.md carries a per-module consumer census
- [x] Every P0 and P1 finding reproduces in-session
- [x] A ranked remove, merge or move list with evidence
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
| Lane ran 10/10, synthesis written | Done | `research/lineages/glm-5-3-flash-shared-package/research.md`, stop reason maxIterationsReached; the first launch was paused by the operator before any iteration and relaunched clean at 22:17 |
| Census | Done | `research/confirmed-findings.md`: 6 of 10 P1 rows confirmed, 3 corrected, 1 dropped |
| Remediation | Done | `../009-shared-package-dead-half-removal` closed every row |

### Deviations and findings

| Item | Note |
|------|------|
| Worktree artifacts | The stale-dist, unprovisioned-root, broken-resolution and missing-directory claims held only in worktree 046; recorded as environment facts. |
| Predicate module kept | Zero code importers, but four command contracts cite it as their predicate grammar. |
<!-- /ANCHOR:log -->
