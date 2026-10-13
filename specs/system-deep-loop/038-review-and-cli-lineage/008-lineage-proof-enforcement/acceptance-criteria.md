---
title: "Acceptance Criteria: Phase 8: lineage-proof-enforcement"
description: "The criteria this packet must satisfy before it may be closed: a lineage without route proof, reducer output, one state row per iteration or in-bounds citations is never reported fulfilled or merged silently."
trigger_phrases:
  - "lineage proof enforcement acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/008-lineage-proof-enforcement"
    last_updated_at: "2026-10-12T12:00:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Build the T001 to T003 fixtures and record each failing against the current code"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-12-lineage-proof-enforcement-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: lineage-proof-enforcement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/038-review-and-cli-lineage/008-lineage-proof-enforcement
**Level:** 2
**Status:** Planned
**Date:** 2026-10-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every command runs from `.skilled/skills/system-deep-loop/runtime`. Each named case is written before the fix and must be seen failing against the current code before it counts.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a CLI lineage whose iteration 3 has no route proof in its state row or its delta, When the runner worker settles it, Then the lineage is rejected with the verifier's reason, not fulfilled | `npx vitest run tests/unit/fanout-run.vitest.ts -t "rejects a lineage that fails the iteration verifier"`. Fails today because `fanout-run.cjs` never calls `verify-iteration.cjs` | Unmet | - |
| AC-002 | REQ-001 | Given a CLI lineage whose every iteration passes the verifier, When the runner worker settles it, Then it is still fulfilled | `npx vitest run tests/unit/fanout-run.vitest.ts -t "fulfills a lineage that passes the iteration verifier"`. The control for AC-001: a gate that rejected everything would pass AC-001 and fail here | Unmet | - |
| AC-003 | REQ-002 | Given a research lineage with a findings registry and no `deep-research-dashboard.md`, When the merge runs, Then that lineage is refused, or the runner has already produced its stamped dashboard | `npx vitest run tests/unit/fanout-merge-reducer-provenance.vitest.ts -t "refuses a research lineage with no reducer dashboard"`. Fails today because `fanout-merge.cjs:719` returns `unverified` and `:1486-1494` merges it with a warning | Unmet | - |
| AC-004 | REQ-003 | Given an `iteration_completed` ledger event carrying route proof, When the research state projection rebuilds the state log, Then the projected row keeps `mode`, `target_agent`, `agent_definition_loaded` and `resolved_route` | A projection unit case named `keeps route proof on the projected iteration row`, run with `npx vitest run -t "keeps route proof on the projected iteration row"`. Fails today because `deep-research-contract.ts:214-224` emits 7 keys and none of the four | Unmet | - |
| AC-005 | REQ-004 | Given the `deepseek-4` fixture with 11 state rows for 5 iterations, When the runner worker settles it, Then the lineage is rejected naming the duplicated iterations | `npx vitest run tests/unit/fanout-run.vitest.ts -t "rejects a state log with two rows for one iteration"`. Fails today because `retainIterationRecords` at `fanout-run.cjs:754-766` collapses the duplicates and the lineage is fulfilled | Unmet | - |
| AC-006 | REQ-005 | Given an iteration citing line 83 and the range 83-84 of an 81-line file, When the citation check runs, Then both are reported past end and an in-bounds citation in the same file is not | `npx vitest run tests/unit/verify-iteration.vitest.ts -t "reports a citation past the end of the cited file"`. Fails today because no deep-loop script compares a cited line with the file's length | Unmet | - |
| AC-007 | REQ-001 | Given the whole deep-loop unit suite, When it runs from the final state, Then it passes and its count differs from the pre-change baseline only by the added cases | `npm test`, with the baseline count captured before T005 and the final count after T011 | Unmet | - |

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

**Closeable:** No

Planned. No criterion has been worked yet.
<!-- /ANCHOR:closure -->
