---
title: "Goal: Phase 1: second-pass-subjects-and-attribution"
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
    packet_pointer: "sk-git/028-crawlable-commit-history/008-second-pass-subjects-and-attribution"
    last_updated_at: "2026-09-11T17:06:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: second-pass-subjects-and-attribution

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

**Objective:** A second rewrite pass that normalizes every subject to the grammar with a packet keyword, adds one Spec line per touched packet, strips every Co-Authored-By, Claude-Session and Anthropic attribution line from history, and forbids them in the hooks.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Subjects change by deterministic rules recorded in the phase spec; what the rules cannot decide goes to a DeepSeek V4.1 Flash swarm in shards, and every new subject must pass the commit-msg grammar before the plan is frozen. |
| D2 | The operator reviews the before-and-after table of subjects before the rewrite runs. |
| D3 | Attribution lines are stripped from trailers only; prose mentions of Anthropic are listed for a separate decision. |
| D4 | The same window discipline as phase 005: pin, rehearse, invariants, fresh yes, push, remap citations again. |

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

- [ ] subject-plan.jsonl holds one row per non-exempt commit and every subject_new passes the hook grammar
- [ ] The operator approved the before-and-after table
- [ ] On origin after the push: zero Co-Authored-By, Claude-Session or Anthropic trailer lines; every non-exempt subject passes the grammar; every multi-packet commit carries one Spec line per packet
- [ ] commit-msg refuses the forbidden lines and prepare-commit-msg strips them, with harness cases
- [ ] Citations remapped again with zero old prefixes, and validate.sh --strict --recursive PASSED for the packet
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
| [Item] | [Pending/In Progress/Done] | [Command output, file:line, or artifact] |

### Deviations and findings

| Item | Note |
|------|------|
| [What diverged from the directive] | [Why, and what was done instead] |
<!-- /ANCHOR:log -->
