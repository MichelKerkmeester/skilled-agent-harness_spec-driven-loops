---
title: "Goal: ledger stem producers"
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
    packet_pointer: "scaffold/007-ledger-stem-producers"
    last_updated_at: "2026-09-15T14:23:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: ledger stem producers

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

**Objective:** Reconcile the registered ledger vocabulary with what actually reaches the ledger.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every registered stem either has a producer or is removed from the registry, and every producer's spelling is registered; the census is recorded so the cutover cannot arm silently again. |
| D2 | Where the operative dialect differs from the registered one, one of them changes; the projection's registration-bounded ceiling is stated where a reader meets it. |
| D3 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every stem in both modes' ledger schemas has a producer, or is removed with its reason recorded
- [ ] Every producer's record spelling is registered, proven by a test that fails when a producer emits an unregistered stem
- [ ] The deep-loop suite exits zero
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
| Census and checker | Done | 61 registered, 5 spoken, 56 reserved; `node scripts/check-ledger-stem-producers.cjs` exits 0 with zero violations over nine producer files |
| Adjudication split | Done | The flat gate summary declared canonical in its own right; cross-post rejection at `runtime/tests/unit/deep-review-ledger-schema.vitest.ts:915`, fold case at `runtime/tests/unit/deep-review-projections-contract.vitest.ts:299` |
| Cutover cliff | Done | `ATTRIBUTION_COLLAPSE` guard called at `runtime/lib/legacy-projections/shadow-projection-store.ts:573`, refusal proven at `runtime/tests/unit/legacy-projections.test.ts:661` |
| Reporting | Done | Frames root reported at `runtime/scripts/verify-iteration.cjs:202`; the verify-authority CLI covered by ten cases in `runtime/tests/unit/verify-authority-cli.vitest.ts` |
| Prose | Done | Eight state references carry the vocabulary, the authority-dependent write target and the projection ceiling |
| Touched suites | Green | 8 files and 90 tests pass; `check-contract-drift.cjs` reports `OK commands=3`; comment hygiene clean on fifteen code files; `validate.sh --strict` reports PASSED |
| Full suite | One external red | 153 of 154 files and 2676 of 2685 tests pass. The red asserts at `tests/stress/cli-adapter/fanout.vitest.ts:521` and is stale against the executor probe another session's commit `2a84717ed3` added to `fanout-run.cjs` - the same external condition the sibling packets 005 and 006 recorded in their own logs |

### Deviations and findings

| Item | Note |
|------|------|
| Criterion 3 left unticked | The suite does not exit zero, and the cause is outside this packet's boundary. Recorded rather than ticked so the operator judges at closure; criteria 1 and 2 are met with the evidence above |
| Shared branch | Another session landed this change set inside commit `1735176985` and broke the runtime typecheck at `lib/deep-loop/executor-config.ts:116` mid-phase; that file was not touched here |
| Scope recovery | The dispatch prompt was not recoverable on disk, so the work items were reconstructed from this directive, the stored session memory and the repository state |
<!-- /ANCHOR:log -->
