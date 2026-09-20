---
title: "Goal: V4 Documentation Freshness"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "v4 doc freshness goal"
  - "release doc verdict directive"
  - "documentation freshness completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/042-v4-doc-freshness"
    last_updated_at: "2026-09-19T18:39:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run the ten-iteration research lane, then apply verdict-confirmed corrections"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-19-v4-doc-freshness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: V4 Documentation Freshness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

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

**Objective:** Decide, claim by claim with cited evidence, whether the v4 changelog and the root README still tell the truth after the last hundred commits, and correct only what a verdict confirms is wrong.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The research runs ten iterations on the `cli-devin` executor through the deep-research workflow; convergence is telemetry, never an early stop. |
| D2 | The verdict documents are the deliverable. A correction is applied only where a verdict row names the current truth, and a rewrite recommendation stops at the recommendation. |
| D3 | Nothing is committed or pushed; the tree is left for an sk-git pass. |

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

- [ ] Ten non-empty iteration files exist and the convergence report reads total 10 with stop reason `max_iterations`
- [ ] Both verdict documents exist and every row carries a resolvable citation
- [ ] Every applied correction traces to a verdict row, and the diff holds no path outside this packet and the two release documents
- [ ] `validate.sh --strict` returns `RESULT: PASSED` for this packet
- [ ] Three sampled corrections reproduce against the cited commit or file
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
| Packet scaffolded at Level 2 | Done | `validate.sh --strict` on this folder |
| Research lane | Pending | `research/iterations/` |
| Verdicts | Pending | `research/verdict-changelog.md`, `research/verdict-readme.md` |
| Corrections | Pending | `git diff` scoped to the two release documents |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
