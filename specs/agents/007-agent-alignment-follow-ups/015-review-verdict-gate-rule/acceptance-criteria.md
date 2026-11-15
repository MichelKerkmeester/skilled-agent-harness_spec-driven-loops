---
title: "Acceptance Criteria: Phase 15: review-verdict-gate-rule"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review verdict gate rule acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule"
    last_updated_at: "2026-11-15T05:36:25Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-review-verdict-gate-rule"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: review-verdict-gate-rule

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `015-review-verdict-gate-rule`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the T001 baseline, When the build is done, Then `(cd .skilled/skills/system-deep-loop/runtime && npm test)` and `npm run typecheck` show no failure the baseline lacks | `scratch/baseline.txt` against `scratch/after.txt` | Unmet | - |
| AC-002 | REQ-002 | Given a terminal record with `coverage` failing, When it is prepared through `prepareDeepReviewEvent`, Then it is accepted, and a record naming a passing gate as failed is refused | `deep-review-ledger-schema.vitest.ts` new cases | Unmet | - |
| AC-003 | REQ-002 | Given the new stem, When `node .skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs` runs, Then it exits 0 with 87 registered and 24 spoken review stems | Checker output in `scratch/after.txt` | Unmet | - |
| AC-004 | REQ-003 | Given both review workflows, When `rg -n 'deep_review.terminal_gates_recorded' .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` runs, Then each file prints one `append_jsonl` line inside `step_handle_convergence` `if_stop` | Grep output with line numbers | Unmet | - |
| AC-005 | REQ-004 | Given a review log that stops at max iterations with `coverage` failing and no active P0, When `reduce-state.cjs` reduces it, Then the verdict is FAIL | `deep-review-state-contract.vitest.ts` new case | Unmet | - |
| AC-006 | REQ-004 | Given a log with a blocked stop at one run and a terminal record naming no failed gate, When it is reduced, Then the verdict is PASS | `deep-review-state-contract.vitest.ts` new case | Unmet | - |
| AC-007 | REQ-005 | Given two lineages where one terminal record names a failed gate, When `fanout-merge.cjs` merges them, Then `mergedVerdict` and that lineage's attribution verdict are FAIL | `fanout-merge.vitest.ts` new case | Unmet | - |
| AC-008 | REQ-006 | Given both workflow verdict steps, When `rg -n 'failed_required_gate_ids' .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` runs, Then each `step_derive_verdict` algorithm sets FAIL on it alongside `p0_count > 0` | Grep output with line numbers | Unmet | - |
| AC-009 | REQ-007 | Given the docs and the compiled contract, When `rg -n 'required quality gate' README.md` runs and `check-contract-drift.cjs --command deep/review` runs, Then the search prints a line and the drift check prints `OK` | Command output in `scratch/after.txt` | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

No. The build has not started, so every criterion is Unmet.
<!-- /ANCHOR:closure -->
