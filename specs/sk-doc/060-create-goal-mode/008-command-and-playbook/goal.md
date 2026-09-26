---
title: "Goal: Phase 8: command-and-playbook"
description: "The durable directive for the command-and-playbook phase and the checks that decide when it is done."
trigger_phrases:
  - "create-goal phase goal"
  - "goal command completion criteria"
  - "goal playbook scenarios"
  - "goal command handoff"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/008-command-and-playbook"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned command and playbook phase"
    next_safe_action: "Implement the command and playbook"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a0d9ec-2944-75e5-9ccb-70819484272a"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Phase 004 operation vocabulary must be confirmed before the argument hint is finalized."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: command-and-playbook

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

**Objective:** Give operators a command and playbook for authoring goals across the supported packet shapes.

### Decisions

Frozen choices for this phase. Changing one requires an amendment to this child goal.

| ID | Decision |
|----|----------|
| D1 | The playbook root indexes eight scenarios, with one canonical per-feature file for each required behavior. |
| D2 | The command argument hint uses the operation names settled by Phase 004; this phase does not invent or rename operations. |
| D3 | The root index owns scenario display order, and scenario-specific execution truth stays in each per-feature file. |
| D4 | This phase validates the playbook package but leaves scenario execution to Phase 009 (specs/sk-doc/060-create-goal-mode/spec.md:127-129). |

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

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] One `/create:goal` entry in `command-metadata.json` names `sk-create-goal` as its owner and has an argument hint of at most 140 characters that includes the command's operation tokens, `:auto` and `:confirm`.
- [ ] All four command mirrors exist at `.claude/commands/create/goal.md`, `.codex/prompts/create-goal.md`, `.pi/prompts/create-goal.md` and `.cursor/commands/create-goal.md`.
- [ ] The create-command README contains exactly one `/create:goal` row.
- [ ] The playbook root indexes eight scenarios: top-level goal, phase parent and nested child goals, missing goal, over-budget parent, leftover placeholder, unbound phase, session-goal route-away and parent resend after child change.
- [ ] The playbook package validator reports `PASS` and counts eight scenarios.
- [ ] Strict validation reports no errors beyond `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT` and `METADATA_DISK_PATH_CONSISTENCY`.
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
| Command package and metadata | Done | Router, auto, confirm and presentation files; one metadata entry with six operations |
| Indexes and runtime copies | Done | Both README indexes, create count 13; all generator checks pass, Hermes included |
| Playbook | Done | Eight scenarios; validator PASS with 0 violations |
| SCG-007 and SCG-008 runs | Done | Both PASS |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-26 |

### Deviations and findings

| Item | Note |
|------|------|
| Repo-wide index amendment | Operator approved on 2026-09-26: this phase also adds the row to `.skilled/commands/README.txt` and raises its create count (REQ-003, T022, AC-008). No parent decision or criterion changed. |
| Hermes mirrors amendment | Operator approved on 2026-09-26: this phase also regenerates the Hermes prompt and skill copies (REQ-003, T021, AC-007). No parent decision or criterion changed. |
| Phase 004 operation vocabulary | Resolved: top-level, phase-parent, child, retrofit, phase-add and amend. |
| Playbook run mode | The playbook workflow ran as `:auto` because a dispatched worker cannot answer checkpoints; the orchestrator reviewed the category and index afterwards. |
<!-- /ANCHOR:log -->
