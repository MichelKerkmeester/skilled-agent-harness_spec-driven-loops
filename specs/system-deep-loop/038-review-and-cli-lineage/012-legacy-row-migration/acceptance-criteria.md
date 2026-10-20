---
title: "Acceptance Criteria: Phase 12: legacy-row-migration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "legacy row migration acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/038-review-and-cli-lineage/012-legacy-row-migration"
    last_updated_at: "2026-10-20T08:00:00Z"
    last_updated_by: "leaf-worker"
    recent_action: "Added and met the review migration criterion"
    next_safe_action: "Commit and merge worktree 158 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 12: legacy-row-migration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-deep-loop/038-review-and-cli-lineage/012-legacy-row-migration
**Level:** 2
**Status:** Complete
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a legacy pause, recovery, guard, migration, trend advisory, override or pivot row, When the gateway upcasts it, Then it migrates to its own stem and the projection writes back the same row, key for key | Evidence: `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:55` (legacy names), `:183` (row shapes); `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:140`; `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts:1550` and the twelve new round-trip rows in the table it feeds | Met | - |
| AC-002 | REQ-001 | Given a ledger-backed run, When the workflow's guard, recovery, override and pause rows are appended through the gateway CLI and another iteration follows, Then each row is still in the state log field for field | Evidence: `.skilled/commands/deep/assets/deep-research-auto.yaml:1060`, `.skilled/commands/deep/assets/deep-research-confirm.yaml:1072` (rows routed through the gateway); `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts:743`; `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-bookkeeping-emission.vitest.ts:210` | Met | - |
| AC-003 | REQ-002 | Given a legacy config, iteration, resumed or spec-check row with a UTC timestamp, When it is upcast, Then the event time is the row's own timestamp, and the projected config and iteration rows carry it | Evidence: `legacy-compatibility.ts:800`; `deep-research-ledger-schema.vitest.ts:1747`; `deep-research-reduce-state.vitest.ts:743` | Met | - |
| AC-004 | REQ-003, REQ-004 | Given a row with `run: "4"`, When it is upcast, Then it is refused as `idea-observed-fields-mistyped:run`. Given every candidate is rejected, When the auto workflow halts, Then the message and both reference docs give the gateway command in snake_case | Evidence: `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:1042`, `legacy-compatibility.ts:773`; `deep-research-ledger-schema.vitest.ts:1715`; `deep-research-auto.yaml:1106`; `deep-research-bookkeeping-emission.vitest.ts:315`; `.skilled/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:329`, `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:227` | Met | - |
| AC-005 | REQ-005 | Given the final state, When the gates run, Then they pass and the pre-phase sources fail the new tests | Evidence: related sweep 32 files, 578 passed, exit 0; `npm run typecheck` exit 0; stem census 86 registered, 23 spoken, 63 reserved, 0 violations, exit 0; `runtime-bootstrap.test.cjs` 9/9, exit 0. With HEAD's versions of the fourteen changed sources, workflows, contracts and docs swapped in, 38 tests fail across the six touched suites, every new one among them; all fourteen restored and `cmp` identical | Met | - |
| AC-006 | REQ-006 | Given a legacy artifact alias was read, When the run reaches its iteration loop, Then the migration row is appended once through the gateway after session classification and the run opening, in both research workflows, and no `log_only_bookkeeping` list remains | Evidence: `.skilled/commands/deep/assets/deep-research-auto.yaml:278` (detection only), `:597` (append step, after `step_classify_session` at `:302` and `step_create_state_log` at `:387`); `.skilled/commands/deep/assets/deep-research-confirm.yaml:294`, `:631` (after `:317` and `:409`); `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-bookkeeping-emission.vitest.ts:300` (order, directive, no log-only list), `:210` (the rendered row is accepted by the real gateway CLI); `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:75`; compiled research contract rebuilt, contract-drift test green | Met | - |
| AC-007 | REQ-007 | Given a legacy config row with a wrongly typed `generation`, `maxIterations`, `topic` or `executor`, When it is upcast, Then it is refused as `run-initialized-fields-mistyped:<field>`. Given a count written as a plain digit string, When it is upcast, Then it is carried as that number with a warning | Evidence: `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:410` (field check), `:544` (refusal in the config arm), `:564` (conversion warning); `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts:1775`; `.skilled/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:87` | Met | - |
| AC-008 | REQ-008 | Given review state under `scratch/`, When a review run starts, Then the rehome step only moves files and a resume sets the hand-written log aside, opens the run and replays its iteration rows through the gateway. `deep_review.migration` is appended right after the loop's lock refresh and survives the next projection replace. Given a fresh packet, Then the rehome step creates no state log and records nothing | Evidence: `.skilled/commands/deep/assets/deep-review-auto.yaml:265` (move only, marker at `:310`), `:364` (adoption, replay at `:382`), `:648` (migration step, after `:332` and `:529`); `.skilled/commands/deep/assets/deep-review-confirm.yaml:247`, `:348`, `:654` (with its dry-run halt); `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-run-open.vitest.ts:205` (order), `:220` (fresh packet), `:232` (moved log through the real gateway CLI and a projection replace); `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:83`; compiled review contract rebuilt | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eight criteria are Met. The seven pinned row kinds survive a projection replace with their own fields and time. Both research and both review workflows append their migration row through the gateway after session classification. A moved review state log is adopted so the gateway accepts later appends. A mistyped config field is refused by name.
<!-- /ANCHOR:closure -->
