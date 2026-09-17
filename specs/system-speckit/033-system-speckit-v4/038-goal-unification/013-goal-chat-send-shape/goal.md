---
title: "Goal: Phase 13: goal-chat-send-shape"
description: "Make it unmissable that a parent goal sent in chat never exceeds 4,000 characters and carries no anchors, comments, dividers or section numbers."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal chat slice"
  - "parent goal chat send cap"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/038-goal-unification/013-goal-chat-send-shape"
    last_updated_at: "2026-09-16T18:58:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Defined the chat slice and the 4,000-character send cap on every goal send surface"
    next_safe_action: "Operator review of the AGENTS.md goal posture wording, then commit"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-slice.cjs"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Heading section numbers count as file scaffolding: the copy the operator set had unnumbered headings"
---
# Goal: Phase 13: goal-chat-send-shape

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
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

**Objective:** Every surface that tells an agent what goal text to send makes two rules
unmissable: a parent goal sent in chat never exceeds 4,000 characters, and the chat
version carries no anchors, comments, dividers or section numbers.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The chat slice is the durable slice without frontmatter, HTML comments (so every anchor and template marker), `---` dividers and heading section numbers. The title, tables and bullets stay. |
| D2 | A chat slice over 4,000 characters is never sent. Cut the goal file in the set-string playbook's Section 4 order first, then resend. |
| D3 | `renderChatSlice` also drops heading section numbers. No new length enforcement is written: the rule lives in the docs, and the injected resend reminder carries the 4,000 figure. |
| D4 | The `AGENTS.md` goal posture row states both rules and overrides the resend wording inside existing `goal.md` files, which are not rewritten. The ADR text in phase 002 stays as recorded, and this phase's spec records the amendment. |

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

Each checkable without opening another file. Copy them into the objective: nothing
dereferences a path, so criteria left only here are invisible to whatever judges
completion.

- [x] `node --test .opencode/hooks/goal/lib/goal-slice.test.cjs` passes, including a case that failed before the change and proves the chat slice carries no numbered heading, comment or divider
- [x] `scaffold-golden-snapshots.vitest.ts` passes as a whole file after the goal template edit
- [x] `speckit-goal-offer-contract.test.cjs` passes, so the three lifecycle workflows still carry one byte-identical goal block
- [x] `AGENTS.md`, the spec-kit `SKILL.md`, the set-string playbook, the goal template, five speckit workflow assets and the resend reminder each name the chat slice and the 4,000-character cap
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Audit of every goal send surface | Done | Read-only audit, its cited lines re-read by the coordinator before edits were authorized |
| Negative control | Done | Updated goal-slice tests failed 4 of 16 against the unchanged module, the new case at `goal-slice.test.cjs:115` |
| Chat slice drops section numbers | Done | `goal-slice.cjs:31` and `:77`, goal-slice suite 16 of 16 |
| Resend reminder carries the cap | Done | `goal-slice.cjs:211`, asserted at `goal-slice.test.cjs:203` |
| Template and snapshot | Done | `goal.md.tmpl:62-69`, snapshot updated in two hunks, file 12 of 12 |
| Docs and workflow assets | Done | `AGENTS.md:187`, `SKILL.md:483`, playbook Section 5, five YAML assets, offer contract 5 of 5 |
| Parent binding row | Done | Row 013 in the parent `goal.md`, slice 3,990 after compacting two table separator rows |

### Deviations and findings

| Item | Note |
|------|------|
| The binding row crossed the parent budget | Row 013 took the parent slice to 4,014 characters. Compacting the two table separator rows to three-dash cells changes no word and brings it to 3,990, which still warns past 3,000 as it did before. |
| Duplicate YAML keys predate this phase | `speckit-implement.yaml` (22:5) and `speckit-complete.yaml` (35:5) fail a strict YAML parse at HEAD as well. Left untouched. |
| Nested phase parent budget reads unknown | `goal.cjs packet` reports `packet_budget=unknown` for the parent because `isPhaseChild` treats a nested phase parent as a child, while the validator applies the budget to it. Left untouched. |
<!-- /ANCHOR:log -->
