---
title: "Goal: Phase 5: budget-and-chat-slice-handoff"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "phase 005 goal budget"
  - "parent goal character cap"
  - "chat slice handoff"
  - "criterion-preserving trim"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned budget and slice handoff phase"
    next_safe_action: "Implement .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-005-budget-and-chat-slice-handoff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: budget-and-chat-slice-handoff

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails, the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Keep packet-parent goals within the character budget while preserving every completion criterion and giving the operator an accurate goal handoff.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | The observed fixed-text cost is an authoring constraint, not a system-spec-kit amendment by itself: the parent goal was cut from 4,820 to 3,735 characters without dropping a criterion. Raise an amendment only if a future contract conflict cannot be resolved under the current budget (specs/sk-doc/060-create-goal-mode/goal.md:52-54,136, .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71). |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers. The `goal.cjs packet` command prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md exists.
- [ ] The trimmed fixture's goal.cjs packet output reports packet_budget=ok.
- [ ] The fixture's completion-criterion count is equal before and after trimming.
- [ ] The goal.cjs packet output contains both chat_slice and objective_slice.
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
| Phase planned | Done | this folder's spec.md, plan.md, tasks.md |
| Reference | Done | `references/budget-and-handoff.md`: measure, cut order, chat versus objective slice, six-runtime matrix, fixed-text decision |
| Fixture | Done | 5,897 `over` cut to 3,256 `ok`, 5 criteria before and after, then removed |
| Wiring | Done | `SKILL.md` and `references/README.md` load and list the reference |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-26 |

### Deviations and findings

| Item | Note |
|------|------|
| Worker lane | GPT-6 Luna at xhigh on the cli-codex fast tier, after the Codex usage limit reset. |
| Evidence location | The worker ran the temporary fixture under the packet-root `scratch/` and wrote its evidence there; the orchestrator moved the evidence into this phase's `scratch/` and removed the empty root folder. |
| Line-cite drift | The reference cited the parent log by line number; that log grows every phase, so the cite now names the log row instead. |
| Wiring amendment | Operator approved on 2026-09-26: this phase also wires its new file into `SKILL.md` and `references/README.md` (REQ-007). No parent decision or criterion changed. |
| Fixed-text cost | No amendment is planned on current evidence. The parent log records a 3,735-character result with no criterion dropped (specs/sk-doc/060-create-goal-mode/goal.md:136). |
<!-- /ANCHOR:log -->
