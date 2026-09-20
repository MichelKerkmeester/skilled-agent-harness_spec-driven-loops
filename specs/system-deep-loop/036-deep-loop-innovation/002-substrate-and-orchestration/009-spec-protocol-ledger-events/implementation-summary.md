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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/009-spec-protocol-ledger-events"
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

<!-- ANCHOR:follow-up -->
## Follow-up: route proof after a re-projection

A ten-iteration research run on 2026-09-19 (packet 042) showed two seams this packet left open.
Neither was caused by it; both were found by using the workflow it hardened.

**Route proof did not survive a re-projection.** The gateway re-projects the state log from the
ledger after every append, and the ledger upcast keeps no leaf dispatch fields, so each new append
rebuilt the earlier iteration records without `mode`, `target_agent`, `agent_definition_loaded` or
`resolved_route`. Only the last iteration kept them. Verification then failed on nine iterations
that had, in fact, run correctly, and the run had to restore the fields by hand from the leaf
deltas.

Adding the fields to the ledger payload was measured and rejected: the event framework's
losslessness rule requires every source payload field to map with an identical value, so an
upcaster may not add fields inside `data`, and 419 committed `iteration-completed` frames at
version 1 would otherwise stop validating. The fix is a reader fix instead, which is where the
stronger evidence already was.

- `verify-iteration.cjs` now reads route proof from the leaf's own delta record when the state-log
  projection cannot satisfy it, and names that source as a warning. A mismatch in both places is
  still a failure, and a missing state-log record is still a failure, so the gate did not move.
- The prompt pack now requires `runId`, `sessionId` and `lineageId` on the iteration record. The
  gateway refuses a record without stable identity, so before this every append needed a retry.
- `maxToolCallsPerIteration` rose from 12 to 24 in the config template and the workflow's
  `tool_call_budget`, because the mandatory repo-rule loads alone exceeded 12 on three iterations.

Evidence: the three verifier cases that cover the fallback, 90 tests across the five suites that
touch route proof or dispatch validation, a live behavioural test on the 042 run's own artifacts
(projection stripped → passes and names the delta; both stripped → `route_proof_missing`, exit 1),
the prompt-pack renderer returning the identity fields, and `validate.sh --strict` on the packets
this touched.

Two adjacent documentation defects were repaired at the operator's direction and are recorded in
their own tracks: the roster line in `cli-external-orchestration/cli-devin/SKILL.md`, and the stale
continuity block in the migration packet under the v4 track.
<!-- /ANCHOR:follow-up -->

### Independent verification

The four fixes were re-verified by Gemini 3.8 Flash High on the `cli-devin` route (exit 0, 17
minutes, no write-containment violations; report at `scratch/verification-gemini-3-8-flash-high.md`).
Verdict: four of four confirmed, none wrong, none partial, five further findings.

Three of those five were this work's own loose ends and are now closed:

1. **The compiled command contract had gone stale.** Editing the workflow, the config template and
   the prompt pack left `check-contract-drift.cjs` failing, which would have failed CI. Recompiling
   fixed it. The recorded digest for the research agent file did not match that file at the last
   commit either, so the guard was already red for a reason that predates these edits.
2. **The confirm-flow budget was left behind.** The autonomous workflow was raised to a 24-call
   ceiling while its interactive companion still pinned 12, so a `:confirm` run would still hit the
   ceiling these fixes exist to clear. Both now read 24.
3. **The phase map under the v4 parent carried scaffolding.** Creating the freshness phase had left
   literal placeholder cells for its scope, handoff criteria and verification, and the row above it
   still described the migration as in progress. Both rows now state what shipped.

Two were considered and left alone, with the evidence:

- The migration packet's `Status: Draft` beside a completion of 100 is the repository's convention
  for a closed packet, not drift.
- The review loop's own budget and record identity are not defective: its record carries a
  top-level `sessionId`, and that alone satisfies the ledger's identity predicate because both
  fallback chains end there. The predicate also guards only the research legacy path. The review
  loop keeps its own budget profile.

One item is recorded rather than fixed: `acceptance-criteria.md` in this folder still has no
`file:line` evidence in its verification cells, so the validator reports an advisory coverage floor.
That is pre-existing and independent of these fixes.
