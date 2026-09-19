---
title: "Implementation Summary: Give the deep-research ledger its own spec-protocol events"
description: "Built and closed: seven research event stems let the append gateway record the spec writes a research run makes, and the committed research ledgers replay unchanged."
trigger_phrases:
  - "spec protocol ledger events summary"
  - "packet 050 status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/050-spec-protocol-ledger-events"
    last_updated_at: "2026-09-19T11:15:31Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed the packet: enum field rules, fixture replay, acceptance evidence"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which side changes: the ledger gets its own events (operator, 2026-09-19)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 050-spec-protocol-ledger-events |
| **Completed** | 2026-09-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A research run's spec writes now reach its state log. The append gateway used to refuse all seven spec-protocol rows the research workflows write, so a run that seeded, extended or wrote findings into `spec.md` left no record of it. Each row now upcasts to a research event stem of its own name, is stored as a typed ledger frame, and projects back into the state log as the row the workflow wrote.

### Give the deep-research ledger its own spec-protocol events

The seven stems follow the run-now precedent through the same five tables. Their producers are `reserved`, not `spoken`: the workflows keep writing legacy rows, and the stem census counts only a staged `stem` key as an emitter. Folder states and conflict kinds are closed sets, so a value the classifier does not define is refused before it reaches the ledger.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modified | Stems, wire types, payload and scope types, reserved producers |
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modified | Field rules, a `prose-array` rule, a nullable enum, the folder-state and conflict-kind sets |
| `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modified | Upcast the seven rows instead of pinning them, with named refusals |
| `runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Modified | No-op cases |
| `runtime/lib/legacy-projections/deep-research-contract.ts` | Modified | Rebuild each legacy row in workflow key order |
| `runtime/tests/unit/deep-research-ledger-schema.vitest.ts` | Modified | Payloads, the upcast test, the enum test |
| `runtime/tests/unit/append-mode-event-cli.vitest.ts` | Modified | Eight row round trips and a refusal |
| `runtime/tests/unit/check-ledger-stem-producers.vitest.ts` | Modified | Census counts |
| `deep-research/references/protocol/spec-check-protocol.md` | Modified | §6 names the stems; payload table corrected |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md` | Regenerated | Digests the protocol reference |

Runtime paths are under `.skilled/skills/system-deep-loop/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator asked on 2026-09-19 for DeepSeek V4.1 Flash through cli-pi to build it. The first dispatch read for 41 minutes and wrote nothing: its brief covered the whole build, and pi-blackhole compacted it at about 274,000 tokens. The retry sent eight one-change briefs, five for the runtime files, two for the tests and one for the protocol reference, with pi-blackhole passive in the child. Each diff was reviewed and its checks run before the next brief went out.

Review found the plan's payload table wrong. It came from the protocol reference's minimum schema, not from the rows the workflows write, so it named a `hostAnchor` no row carries and missed `lockPath`. The types, field rules, upcast and plan were corrected against the 15 real `append_to_jsonl` sites.

A concurrent session committed the build as `beb1a0bcc6` and pushed it, after the operator asked it to land everything in the tree. Closure then found the build weaker than the spec: folder state and conflict kind were checked for shape only, while the spec's edge case says an unknown value is refused. The closure commit makes both fields enum rules and tests every value.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One stem per legacy row, named after it | The upcast stays obvious and lossless |
| Keep the workflow rows in their legacy shape | The upcaster already translates legacy rows; the YAML need not change |
| Producers `reserved`, not `spoken` | The census counts a staged `stem` key; these stems arrive only by upcast, as `run_resumed` does |
| Scope from the append context | The rows carry no run or session identity, so the stable-identity check would refuse them; the upcaster checks their payload fields instead |
| Field shapes from the workflow rows | The protocol reference lists a minimum schema that no row matches exactly |
| The timestamp is the append time | The gateway stamps every upcast legacy row, so REQ-002 compares every other field |
| Folder state and conflict kind are closed sets | The classifier emits one of four states; an unknown one should halt the run, not enter the ledger |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Whole deep-loop suite | 2,694 passed, 8 skipped, 154 files |
| The four touched suites | 107 passed |
| `npm run typecheck` | Exit 0 |
| Stem census | 68 registered, 56 reserved, 12 spoken, no violations |
| Append-site checker | 10 sites scanned, no violations |
| Deep command contracts | No drift for research, review and ai-council |
| Fixture replay | 23 committed ledgers, 175 events, before `d71a52c736` and after: heads, event counts, stems and fold outcomes identical |
| The command that failed in phase 15 of packet 041 | The old runtime refuses the `spec_mutation` row as `legacy-record-has-no-lossless-mode-event`; the new one appends it |
| New tests fail before their change | The upcast test on the pre-build runtime, the enum test on the pre-closure schema |
| `validate.sh --strict` on this folder | Passes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No workflow step speaks the stems.** They arrive only by upcast. A workflow that stages them directly would move them from `reserved` to `spoken`.
2. **A new folder state or conflict kind must go into the schema first.** Until it does, the gateway refuses the row, which halts the run.
3. **None of the 23 committed ledgers folds to a projection.** Twelve have no `run_initialized` event and eleven hit the reducer's refusal to move from `planned` to `awaiting-evidence`. That is the same before and after this change, so the replay compares fold outcomes rather than projections. It was not investigated here.
4. **Ten committed ledgers cannot be read in place.** Their frame files check out group-readable and the frame store requires owner-only access, so the replay read owner-only copies.
5. **The CLI tests could not run in an isolated copy of the old runtime.** There they fail even untouched, so their before-state rests on running the old CLI on the same rows.
<!-- /ANCHOR:limitations -->

---
