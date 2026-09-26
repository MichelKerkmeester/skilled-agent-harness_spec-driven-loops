---
title: "Goal: Phase 2: mode-scaffold"
description: "The phase goal for scaffolding the sk-create-goal nested workflow packet without registering it."
trigger_phrases:
  - "sk-create-goal phase goal"
  - "mode scaffold objective"
  - "nested packet completion criteria"
  - "expected 6a handoff"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/002-mode-scaffold"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned the nested mode scaffold"
    next_safe_action: "Build the packet after phase 001 closes its handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a0da02-83bb-757d-8b3e-505d6ba489e8"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: mode-scaffold

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails. Runtime goal surfaces cap what they
> hold, so truncation can hide criteria at the end (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:33-42`).

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The `sk-create-goal` workflow packet gives later goal-authoring work a phase-ready home while leaving template rendering and runtime goal state with their existing owners (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:49-53`).

### Decisions

These choices govern this scaffold phase only.

| ID | Decision |
|----|----------|
| M1 | Reserve `assets/` for the examples phase. This phase does not author the quality exemplars (`specs/sk-doc/060-create-goal-mode/spec.md:123`). |
| M2 | Create `scripts/` only when phase 001 selects a mode-local checker. Phase 006 writes the checker (`specs/sk-doc/060-create-goal-mode/spec.md:126` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). |
| M3 | Prepare `changelog/` here and leave the release file to phase 009 (`specs/sk-doc/060-create-goal-mode/spec.md:129`). |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers. `goal.cjs packet` prints it as
`chat_slice` (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:61-70`).
Never send more than 4000 characters: cut this file first. Keep reminding while
the copy stays unset, and never stop work for it. A child goal change that alters
a parent decision or criterion is an amendment to the parent: apply it there
first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `SKILL.md`, `README.md`, `references/README.md` and `assets/` exist under `.skilled/skills/sk-doc/sk-create-goal/`.
- [ ] The `changelog/` directory exists under `.skilled/skills/sk-doc/sk-create-goal/`.
- [ ] The strict package check prints `Result: PASS` for `.skilled/skills/sk-doc/sk-create-goal`.
- [ ] The parent-skill check reports only invariant `6a` for `sk-create-goal`.
- [ ] The mode root contains zero `goal.md.tmpl` files.
- [ ] The mode root contains zero `graph-metadata.json` and `description.json` files.
- [ ] The strict phase validator prints `RESULT: PASSED`.
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
| Scaffold built | Done | `.skilled/skills/sk-doc/sk-create-goal/`: `SKILL.md`, `README.md`, `references/README.md`, `assets/`, `changelog/`, `scripts/` |
| Package check | Done | `Result: PASS`, exit 0 |
| Parent-skill check | Done | Exit 1, only `6a` for `sk-create-goal`, as the handoff expects |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-25 |

### Deviations and findings

| Item | Note |
|------|------|
| Checker choice | Phase 001 selected a mode-local checker, so `scripts/` exists with a `.gitkeep`; the package check warns on that file until the checker script replaces it. |
| Worker lane | GPT-6 Luna at xhigh on the pi gateway lane; the Codex plan is at its usage limit. |
<!-- /ANCHOR:log -->
