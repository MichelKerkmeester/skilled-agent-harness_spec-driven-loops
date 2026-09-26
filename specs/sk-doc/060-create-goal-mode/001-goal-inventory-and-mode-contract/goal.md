---
title: "Goal: Phase 1: goal-inventory-and-mode-contract"
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
    packet_pointer: "sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned phase goal"
    next_safe_action: "Execute phase 001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-001-goal-inventory-and-mode-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: goal-inventory-and-mode-contract

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

**Objective:** Establish a source-backed contract for packet-goal anatomy, ownership, corpus defects, and the sk-create-goal target.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Classify ownership by operation: rendering, runtime goal state, host session-goal setting, or packet-file authoring. |
| D2 | Treat command output as evidence only when the path, exit status, and diagnostic are recorded; assess semantic criterion quality separately. |

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

- [ ] The named artifacts `decision-tests.md`, `goal-anatomy.md`, `goal-corpus-audit.md`, `mode-boundary.md`, and `target-tree.md` exist.
- [ ] `goal-corpus-audit.md` reports the `find` denominator and a successful `goal.cjs packet` result for every included goal.
- [ ] Each defect example in `wave1-goal-system-audit.md` has a reproduction command, output, and exit status recorded in `goal-corpus-audit.md`.
- [ ] `mode-boundary.md` records an owner for each operation and resolves the checker-versus-validator-amendment question.
- [ ] `decision-tests.md` separates packet-file authoring from session-goal operations, and `target-tree.md` names the mode packet paths.
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
| Corpus scan | Done | 296 goals, 296 `goal.cjs packet` exits 0, `scratch/goal-corpus-scan.json` |
| Five artifacts | Done | `goal-corpus-audit.md`, `goal-anatomy.md`, `mode-boundary.md`, `decision-tests.md`, `target-tree.md` |
| Checker verdict | Done | A mode-local checker plus a recorded system-spec-kit amendment request (`mode-boundary.md` §5) |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-25 |

### Deviations and findings

| Item | Note |
|------|------|
| Codex usage limit | The first worker moved from cli-codex to the pi gateway lane after the usage-limit reply. |
| Citation repairs | Two wrong citations fixed after the orchestrator's re-read: a section cross-reference and an audit-file cite. |
| Reference-type doc check | `validate_document.py --type reference` asks for an overview section; the 040 precedent fails it the same way, and `validate.sh` is the gate for these files. |
| Worker halt | The second worker stopped on an edit-string mismatch while chasing that overview check; its three files were already complete and unchanged. |
<!-- /ANCHOR:log -->
