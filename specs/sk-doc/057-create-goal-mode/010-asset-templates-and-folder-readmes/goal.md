---
title: "Goal: Phase 10: asset-templates-and-folder-readmes"
description: "The durable directive for phase 010: per-kind goal templates, code-folder READMEs and the references index removal."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/010-asset-templates-and-folder-readmes"
    last_updated_at: "2026-09-26T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every completion criterion"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: asset-templates-and-folder-readmes

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

**Objective:** Give `sk-create-goal` a checked blank for each goal kind, README coverage for its code folders and no references index.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The templates keep `goal.md.tmpl` fixed text word for word; only placeholder wording differs |
| D2 | `goal.md.tmpl` and the renderer stay unchanged |

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

- [ ] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes 15 of 15
- [ ] `check-goal.cjs --all` gives the same report under the old and new checker
- [ ] Both code-folder READMEs pass `validate_document.py --type code_folder` with 0 issues
- [ ] `references/README.md` does not exist and `compiled-route-guard.cjs` reports every hub fresh
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
| Templates and parity test | Done | 15 of 15 tests pass |
| Checker and corpus | Done | Identical report over 302 goals |
| READMEs and index removal | Done | 0 issues on both; router, manifest and route republished |

### Deviations and findings

| Item | Note |
|------|------|
| Parent D2 amended | The operator chose checked per-kind copies on 2026-09-26, which replaces the render-only decision |
<!-- /ANCHOR:log -->
