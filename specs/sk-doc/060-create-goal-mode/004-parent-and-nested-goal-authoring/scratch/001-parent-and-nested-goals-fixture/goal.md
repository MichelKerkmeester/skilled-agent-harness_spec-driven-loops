---
title: "Goal: Parent and nested goal fixture"
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
    packet_pointer: "sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture"
    last_updated_at: "2026-09-25T20:49:06Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the phase map, child bindings and final validation gate"
    next_safe_action: "Review the parent binding if the phase map or direct folders change"
    blockers: ["Final recursive strict validation"]
    key_files: ["spec.md", "goal.md", "001-source-audit/goal.md", "002-goal-authoring/goal.md", "003-binding-check/goal.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fixture-parent-session"
      parent_session_id: null
    completion_pct: 75
    open_questions: ["Final recursive strict validation result"]
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Parent and nested goal fixture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove that the parent goal binds all three mapped phase folders and that the integrated fixture passes recursive strict validation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Compare the parent Phase Documentation Map with all direct numbered child folders by exact name. |
| D2 | Write exactly one backticked child-goal target for each direct phase folder. |
| D3 | Parent decisions outrank child detail, and child goals remain authoritative within their phases. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| source-audit | `001-source-audit/goal.md` |
| goal-authoring | `002-goal-authoring/goal.md` |
| binding-check | `003-binding-check/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
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

- [ ] The parent binding contains exactly `001-source-audit/goal.md`, `002-goal-authoring/goal.md` and `003-binding-check/goal.md`.
- [ ] The map, direct-child folders and binding targets name exactly the same three folders.
- [ ] Each backticked binding target resolves to an existing child goal file.
- [ ] Recursive strict validation on every rule except the three generated-metadata rules reports `RESULT: PASSED`, with zero `SPECDOC_SUFFICIENCY_006` findings.
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
| Map and direct-folder comparison | Done | The map and disk list the same three folders. |
| Child goal documents | Done | All three backticked targets resolve on disk. |
| Recursive strict validation | In Progress | Run after the final metadata refresh. |

### Deviations and findings

| Item | Note |
|------|------|
| Phase map and disk | No folder-name mismatch was found. |
<!-- /ANCHOR:log -->
