---
title: "Acceptance Criteria: harden fan-out write containment for shared checkouts"
description: "The criteria this packet must satisfy before it may be closed: preserve-by-default quarantine, baseline-targeted restore, separated lane and containment outcomes, per-lineage worktrees and concurrent-editor detection."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening"
    last_updated_at: "2026-09-08T18:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Wrote eleven closure criteria for the four hardening requirements"
    next_safe_action: "Implement Phase 1 and record evidence against the first four criteria"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-045-fanout-write-containment-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether a restore opt-in should be rejected outright once the churn detector fires, or only suppressed for the rest of the run"
      - "Whether per-lineage worktrees become the default or stay opt-in until one full research run is observed on them"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: harden fan-out write containment for shared checkouts

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-deep-loop/045-fanout-write-containment-hardening
**Level:** 3
**Status:** Planned
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a lane on a default-configured run, When it modifies a tracked file outside its lineage directory, Then that file's bytes are unchanged after the guard runs | `runtime/tests/stress/cli-adapter/fanout.vitest.ts:379` asserts the out-of-scope file still holds the lane's bytes after enforcement, and `:395` records the remedy as `preserved_in_head`. Suite: 19 passed, 1 skipped | Met | - |
| AC-002 | REQ-001 | Given the same lane, When the guard runs, Then a quarantine directory exists under the lineage directory holding a manifest, the file's content and a patch against HEAD | `runtime/tests/unit/write-containment.vitest.ts` asserts manifest.json, the content copy and the HEAD patch exist under `containment/quarantine/` and that the stored content hash equals the on-disk hash, plus the over-bound and unwritable-destination cases. Suite: 58 passed | Met | - |
| AC-003 | REQ-001 | Given the same lane, When the guard runs, Then a containment finding is appended to the status ledger and to the observability stream, carrying the quarantine location | `runtime/tests/stress/cli-adapter/fanout.vitest.ts:391` asserts a `containment_violation` event on the status ledger for the lane. Suite: 19 passed, 1 skipped | Met | - |
| AC-004 | REQ-001 | Given a run with no restore opt-in, When the fan-out config is parsed, Then the containment mode is preserve | `runtime/lib/deep-loop/executor-config.ts:688` defaults the mode to preserve and rejects an unknown value, covered by a case in `runtime/tests/unit/executor-config.vitest.ts`. Suite: 271 passed with fanout-run and write-containment | Met | - |
| AC-005 | REQ-002 | Given a tracked file already dirty before dispatch, When restore is opted into and the lane changes that file further, Then the file is restored to the pre-dispatch bytes and not to HEAD | `runtime/tests/unit/write-containment.vitest.ts:231` asserts the remedy is `restored_from_baseline` and the bytes equal the pre-dispatch baseline, not HEAD. Suite: 54 passed | Met | - |
| AC-006 | REQ-002 | Given a baseline file larger than the per-file bound, When the baseline is captured, Then the path is recorded as baseline-truncated and is preserved rather than restored even under restore mode | `runtime/tests/unit/write-containment.vitest.ts:172` covers the over-bound file and `:180` asserts `baselineTruncated`, with no bytes stored. Suite: 54 passed | Met | - |
| AC-007 | REQ-003 | Given a lane whose artefacts are complete and which also has containment findings, When the lane settles, Then its terminal state is `completed_with_containment_advisory` rather than failed | `runtime/tests/stress/cli-adapter/fanout.vitest.ts:411` asserts the lane settles `completed_with_containment_advisory` rather than rejected. Suite: 19 passed, 1 skipped | Met | - |
| AC-008 | REQ-003 | Given that lane, When the orchestration summary is written, Then the summary counts the advisory outcome separately from success and failure, and the max-iterations policy check accepts it | `runtime/tests/unit/fanout-pool.vitest.ts:238` asserts the advisory lane counts as a success AND increments the separate advisory counter. Suite: 34 passed | Met | - |
| AC-009 | REQ-005 | Given a fan-out with the worktree option on and a packet that is not yet committed, When the run completes, Then every lineage directory is present in the main checkout and no ephemeral worktree remains | A manual run recorded in `implementation-summary.md`, plus a Vitest case over the worktree lifecycle helpers asserting create, seed, copy-back and removal | Unmet | - |
| AC-010 | REQ-004 | Given a lane running while a neighbouring session dirties tracked files above the threshold, When the next progress heartbeat samples, Then `shared_checkout_detected` is emitted and the run is latched to preserve mode | Two cases in `runtime/tests/unit/fanout-run.vitest.ts` share one fixture and differ only in churn count: above the threshold emits `shared_checkout_detected` and forces preserve even when restore was requested; at or below it leaves the requested mode alone and restore still returns committed bytes. Suite: 276 passed | Met | - |
| AC-011 | REQ-006 | Given the four command YAMLs and the five documentation surfaces, When searched for the superseded containment wording, Then none remains and each names the current behaviour | Sweep across the five documentation surfaces and four command workflows returns zero occurrences of the superseded wording; the hub skill, the research loop protocol and the runtime library README now state preserve-by-default and the baseline-targeted opt-in | Met | - |

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

Nothing is built yet. The packet is planned, and the eleven criteria above are the gate it will be measured against. Criterion ten is the only one attached to an optional phase: if the operator defers concurrent-editor detection after the worktree phase lands, it becomes the one row that closes as waived rather than met.
<!-- /ANCHOR:closure -->
