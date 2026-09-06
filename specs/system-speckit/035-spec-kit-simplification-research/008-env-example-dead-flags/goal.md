---
title: "Goal: Env example dead flags"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/008-env-example-dead-flags"
    last_updated_at: "2026-09-06T21:10:00Z"
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
# Goal: Env example dead flags

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave the root env template documenting only variables that some code in the real tree reads, described in terms of that code, and remove the stale skill-level template.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A variable is dead only when a census over the real tree, including extension-less hooks and composed flag names, finds no reader |
| D2 | External CLI credentials stay documented, because the external binaries read them |
| D3 | Flags read only by modules that are reachable through nothing but the shared barrel leave the template; the modules themselves are lane 003's decision |

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

- [x] Every variable removed from .env.example had zero production readers in the real tree
- [x] The runtime builds and env-reference-drift.vitest.ts passes after the edits
- [x] The skill-level .env.example is deleted and nothing references it
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
| Packet opened on the operator's observation | Done | this file |
| Census of 216 names | Done | 13 dead, 3 misdescribed, `implementation-summary.md` |
| Edits and gates | Done | `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| The first census counted an ignored copy of the repository under `barter/` and an old worktree under `.worktrees/` | Both are gitignored; the census was rerun over the real tree. |
| Literal matching missed `env.NAME` reads and extension-less hooks | Six variables first looked dead and were kept once the second pass found their readers. |
<!-- /ANCHOR:log -->
