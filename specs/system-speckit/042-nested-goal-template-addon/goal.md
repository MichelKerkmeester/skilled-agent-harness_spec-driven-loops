---
title: "Goal: Nested Goal Addon"
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
    packet_pointer: "system-speckit/042-nested-goal-template-addon"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive and its phase binding"
    next_safe_action: "Execute the remaining phases against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-042-nested-goal-template-addon"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Goal: [NAME]

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a packet a short durable directive naming its phases, so a set objective stays small and true while its detail grows freely.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Lazy add-on only; the collector walks lazy and skips optional |
| D2 | Only the durable slice is capped; a growing log is not a defect |
| D3 | No fabricated goal adapters; a runtime without one hands off |
| D4 | Criteria are copied into the objective; nothing dereferences a path |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-manifest-and-goal-template | `001-manifest-and-goal-template/goal.md` |
| 002-durable-slice-validator | `002-durable-slice-validator/goal.md` |
| 003-runtime-neutral-goal-dispatch | `003-runtime-neutral-goal-dispatch/goal.md` |
| 004-parent-set-string-playbook | `004-parent-set-string-playbook/goal.md` |

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `validate.sh --strict` recursive over this packet exits 0
- [ ] Every phase reports its acceptance criteria closeable
- [ ] The document resolves to a template at 1/2/3/3+/phase and to nothing at review
- [ ] A packet with no goal document validates exactly as before
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
| 001 contract entry, template and mapping | Done | Resolver: path at five levels, null at review; renders 53/68/0 |
| 002 durable-slice validator | Pending | - |
| 003 runtime-neutral dispatch | Pending | - |
| 004 set-string playbook | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| Placement moved from optional to lazy | The document collector spreads the lazy bucket and skips optional except two hardcoded names; an optional entry would have needed a third |
<!-- /ANCHOR:log -->
