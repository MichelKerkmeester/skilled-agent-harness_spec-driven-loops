---
title: "Goal: Phase 6: goal-conformance-check"
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
    packet_pointer: "sk-doc/060-create-goal-mode/006-goal-conformance-check"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned goal conformance checks"
    next_safe_action: "Execute after the phase 001 decision and phase 005 handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: null
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: goal-conformance-check

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

**Objective:** Establish that packet goals satisfy phase-binding, content-placeholder, criterion-count and parent-budget requirements.

Completion is judged by these checks:
- `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs` exits 0 with one positive case and six named negative controls.
- That fixture test exits 0 and reports `parent-budget` for fixture `over-budget-parent`.
- That fixture test exits 0 and reports `missing-binding-row` for fixture `binding-row-removed-but-identifier-mentioned`.
- `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` reports `goals_scanned`, `phase_parents_scanned` and four finding counts.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The checker reports findings and never repairs goal files. |
| D2 | Binding coverage matches rows inside the binding table, not mentions elsewhere. |
| D3 | Parent budget measurement uses goal-slice.cjs exports (.skilled/hooks/goal/lib/goal-slice.cjs:431-446). |
| D4 | Keep one positive fixture and one isolated negative control per check on either owner route. |
| D5 | The live-corpus run prints counts and does not alter the corpus. |

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

- [ ] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs` exits 0 with one positive case and six named negative controls.
- [ ] That fixture test exits 0 and reports `parent-budget` for fixture `over-budget-parent`.
- [ ] That fixture test exits 0 and reports `missing-binding-row` for fixture `binding-row-removed-but-identifier-mentioned`.
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` reports `goals_scanned`, `phase_parents_scanned` and four finding counts.
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
| Checker, tests and fixtures built | Done | `node --test` 8 of 8 pass; each negative fails only its named check |
| Live-corpus report | Done | `scratch/corpus-report.txt`: 300 goals, 30 phase parents, counts 203, 83, 35 and 4 |
| Checker wired into the mode | Done | `SKILL.md` step 8 and `references/README.md` |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-26 |

### Deviations and findings

| Item | Note |
|------|------|
| Wiring amendment | Operator approved on 2026-09-26: this phase also wires its new file into `SKILL.md` and `references/README.md` (REQ-007). No parent decision or criterion changed. |
| Criteria-count false positive | The worker's checker read the first "Completion criteria" heading, which some goals use for a numbered list inside the directive. The orchestrator made it read the `completion` anchor first and added a regression control; the corpus count fell from 51 to 35. |
| Extra positive control | A second positive fixture guards that fix, beyond the one positive and six negatives the directive names. No criterion changed. |
| Validator amendment request | Recorded in `implementation-summary.md` under Key Decisions; system-spec-kit is unchanged. |
<!-- /ANCHOR:log -->
