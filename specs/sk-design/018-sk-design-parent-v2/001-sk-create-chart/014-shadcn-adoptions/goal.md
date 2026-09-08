---
title: "Goal: shadcn adoptions"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/014-shadcn-adoptions"
    last_updated_at: "2026-09-07T21:48:13Z"
    last_updated_by: "verification-leaf"
    recent_action: "Re-verified the final corpus: render gate, mutated copies, corrected evidence cites"
    next_safe_action: "Conductor review and commit the scoped packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-phase-014-shadcn-adoptions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: shadcn adoptions

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Land the three shadcn chart decisions phase 13 judged worth adopting, series-key token indirection, local readout knobs and declared curve intent, as checker-held contracts across the 26 standalone templates, without loosening any gate or adopting anything the research said to keep out.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Assertion first: each adoption is a checker assertion proven by a failing mutation before any template is edited to pass it |
| D2 | Nothing the research said to keep changes: no radar, no pie, no natural curves, no five-token ramp, no external reference |
| D3 | The four policy-gated items stay operator decisions in spec.md section 10; no assertion is written for them here |
| D4 | Every reference edit cites phase 13's research record rather than restating its argument |

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

- [x] `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` prints `RESULT: PASSED` with zero errors
- [x] Three new assertions exist in `check-corpus.cjs`, each recorded with the mutation that made it fail first
- [x] Every multi-series template declares its series by key, every tooltip form carries `READOUT`, every time-path form declares `CURVE`
- [x] `template-contract.md`, `catalog.md` and `color-system.md` state the contracts and the kept decisions, citing phase 13
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this packet
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
| Packet opened with the three adoptions as scope | Done | this file; `spec.md` section 3 |
| Checker contracts and corpus consumers landed | Done | `check-corpus.cjs`; 26 templates; six deliveries |
| Negative controls captured | Done | `scratch/mutations.md`; three isolated copies each returned `RESULT: FAILED` |
| Reference and gallery updates landed | Done | `template-contract.md`, `catalog.md`, `color-system.md`; `assets/gallery.html` |
| Review fix: wire `READOUT.key` to the registered datum | Done | 22 tooltip-bearing files read `datum[READOUT.key]` or a keyed record; the semantic mutation returned the recorded `FAIL [number-format]` line; final corpus returned `RESULT: PASSED` |
| Final verification | Done | static checker, `--render` and strict packet validation each `RESULT: PASSED` |
| Independent verification of the final corpus | Done | `--render` returned `RESULT: PASSED` with the five render-dependent families at zero failures (card-readout 22, pointer-reach 22, settled-render 70, dark-render 35, render 35); the three mutated copies were recreated from the final corpus and each produced exactly one recorded failure; the decorative wiring control was reproduced separately; four stale evidence line cites in `acceptance-criteria.md` were corrected |

### Deviations and findings

| Item | Note |
|------|------|
| Render-dependent checks | First runs aborted (exit 134, no document) and were recorded unknown; a later independent `--render` run of the final corpus returned `RESULT: PASSED` with every render-dependent family at zero failures |
| Mutation chronology | Assertions were written before consumer edits; the required negative controls were captured before the final gate, but not before the first consumer edit. The contract checks and exact failures remain valid, and the final verification pass reproduced every recorded control against the final corpus, one failure each. |
<!-- /ANCHOR:log -->
