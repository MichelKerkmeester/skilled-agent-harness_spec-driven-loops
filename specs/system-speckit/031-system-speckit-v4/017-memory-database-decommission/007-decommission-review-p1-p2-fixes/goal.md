---
title: "Goal: Phase 7: decommission-review-p1-p2-fixes"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/017-memory-database-decommission/007-decommission-review-p1-p2-fixes"
    last_updated_at: "2026-09-26T08:20:00Z"
    last_updated_by: "mimo-v2.6-pro"
    recent_action: "Authored the phase goal from the phase documents"
    next_safe_action: "None. The phase is complete and its evidence is recorded"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a0dcc1-243c-710f-add4-a1c450d02284"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: decommission-review-p1-p2-fixes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
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

**Objective:** Verify every deep-review finding at the files it cites and close it with evidence, fixing the one runtime gap so a parseable but malformed trigger index fails closed instead of silently returning fewer candidates.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every finding is re-read at its cited location before anything changes |
| D2 | One shared `assertTriggerIndexShape` in `lib/artifact.mjs` serves both the generator's publish gate and the reader's load gate |
| D3 | Document findings close with recorded evidence, never by deleting rows or scrubbing evidence the parent decided to keep |
| D4 | The alignment sweep covers every live document, command, agent, hook and code comment; changelogs, benchmark reports and negative-guard tests keep the literal retired prefix |
| D5 | Installing the missing main-checkout dependency stays the operator's work |

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

- [ ] The trigger-index and parity suites pass with 76 tests including the four fail-closed reader cases
- [ ] A parseable but malformed index throws on a non-array posting, an out-of-range path id and a wrong schema version, and the published artifact still loads
- [ ] The trigger index regenerates byte-identical after the document edits
- [ ] `validate.sh --strict` recursive over the parent packet reports 0 errors
- [ ] No unchecked completion row remains in phases 001, 002 and 005, and every open decision in the parent log names an owner and a review checkpoint
- [ ] The alignment inventory records 214 hits in 115 live files and the final residue sweep reports 0 live records
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
| Review lineage | Done | ten iterations under `../review/lineages/luna-max/`, verdict CONDITIONAL with P0 0, P1 4, P2 2 |
| F001 shared shape invariant | Done | `assertTriggerIndexShape` in `scripts/retrieval/lib/artifact.mjs`, called by both the generator and the reader; four fail-closed cases in `scripts/tests/trigger-index.vitest.ts`; suites 76 passed |
| F002 to F006 | Done | unchecked rows in phases 001, 002 and 005 closed with evidence, the retired-prefix criterion restated in the parent goal, every open decision given an owner and a review checkpoint |
| Alignment sweep | Done | 214 hits in 115 live files swept across runtime, skill and code surfaces; two broken code seams repaired; final residue sweep reports live 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Iteration 9 landed at the repository root | The model wrote outside the lineage directory; the containment gate preserved both files and the lineage resumed from its nine recorded iterations for the tenth and the synthesis |
| Routing vocabulary still reads "spec kit memory" | A two-stage routing edit with a re-baselined gold phrase is its own packet |
| F006 stays open by design | The main checkout lacks `onnxruntime-common`; the caveat is recorded beside the advisor decision |
<!-- /ANCHOR:log -->
