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
| AC-002 | REQ-001 | Given the same lane, When the guard runs, Then a quarantine directory exists under the lineage directory holding a manifest, the file's content and a patch against HEAD | `runtime/tests/unit/write-containment.vitest.ts:1405` names the captured diff for the preserve remedy, and `runtime/tests/unit/write-containment.vitest.ts:1750` keeps the failure on the path entry when the quarantine destination is unwritable.  | Met | - |
| AC-003 | REQ-001 | Given the same lane, When the guard runs, Then a containment finding is appended to the status ledger and to the observability stream, carrying the quarantine location | `runtime/tests/stress/cli-adapter/fanout.vitest.ts:391` asserts a `containment_violation` event on the status ledger for the lane. Suite: 19 passed, 1 skipped | Met | - |
| AC-004 | REQ-001 | Given a run with no restore opt-in, When the fan-out config is parsed, Then the containment mode is preserve | `runtime/lib/deep-loop/executor-config.ts:688` defaults the mode to preserve and rejects an unknown value, covered by a case in `runtime/tests/unit/executor-config.vitest.ts`. Suite: 271 passed with fanout-run and write-containment | Met | - |
| AC-005 | REQ-002 | Given a tracked file already dirty before dispatch, When restore is opted into and the lane changes that file further, Then the file is restored to the pre-dispatch bytes and not to HEAD | `runtime/tests/unit/write-containment.vitest.ts:231` asserts the remedy is `restored_from_baseline` and the bytes equal the pre-dispatch baseline, not HEAD. Suite: 54 passed | Met | - |
| AC-006 | REQ-002 | Given a baseline file larger than the per-file bound, When the baseline is captured, Then the path is recorded as baseline-truncated and is preserved rather than restored even under restore mode | `runtime/tests/unit/write-containment.vitest.ts:172` covers the over-bound file and `:180` asserts `baselineTruncated`, with no bytes stored. Suite: 54 passed | Met | - |
| AC-007 | REQ-003 | Given a lane whose artefacts are complete and which also has containment findings, When the lane settles, Then its terminal state is `completed_with_containment_advisory` rather than failed | `runtime/tests/stress/cli-adapter/fanout.vitest.ts:411` asserts the lane settles `completed_with_containment_advisory` rather than rejected. Suite: 19 passed, 1 skipped | Met | - |
| AC-008 | REQ-003 | Given that lane, When the orchestration summary is written, Then the summary counts the advisory outcome separately from success and failure, and the max-iterations policy check accepts it | `runtime/tests/unit/fanout-pool.vitest.ts:238` asserts the advisory lane counts as a success AND increments the separate advisory counter. Suite: 34 passed | Met | - |
| AC-009 | REQ-005 | Given a fan-out with the worktree option on and a packet that is not yet committed, When the run completes, Then every lineage directory is published into the main checkout and no worktree **of this run** remains except those in a retained state | `runtime/tests/unit/fanout-run.vitest.ts:4147` runs the lane in its own worktree and asserts no worktree of this run remains after publication, scoped to this run rather than to the shared prefix.  | Met | - |
| AC-010 | REQ-004 | Given a lane running while a neighbouring session dirties tracked files above the threshold, When the next progress heartbeat samples, Then `shared_checkout_detected` is emitted and the run is latched to preserve mode | `runtime/tests/unit/fanout-run.vitest.ts:2963` asserts a burst above the threshold emits the event and latches preserve; `runtime/tests/unit/fanout-run.vitest.ts:2981` asserts the requested mode is left alone at or below it. Two cases in `runtime/tests/unit/fanout-run.vitest.ts` share one fixture and differ only in churn count: above the threshold emits `shared_checkout_detected` and forces preserve even when restore was requested; at or below it leaves the requested mode alone and restore still returns committed bytes. Suite: 276 passed | Met | - |
| AC-011 | REQ-006 | Given the four command YAMLs and the five documentation surfaces, When searched for the superseded containment wording, Then none remains and each names the current behaviour | manual-infeasible: a repository-wide absence is established by sweeping the surfaces, not by a test that could only ever assert one of them. The sweep and its zero-result output are recorded in the implementation summary. Sweep across the five documentation surfaces and four command workflows returns zero occurrences of the superseded wording; the hub skill, the research loop protocol and the runtime library README now state preserve-by-default and the baseline-targeted opt-in | Met | - |
| AC-012 | REQ-005 | Given run A with live lineages, When run B starts and performs its startup reclamation, Then every one of A's worktrees survives with byte-identical contents and B records a keep decision naming the reason for each | `runtime/tests/unit/fanout-run.vitest.ts:4262` plants a live peer run's worktree and asserts it survives byte-identical with its keep reason; `runtime/tests/unit/fanout-run.vitest.ts:4318` reclaims the same peer once its owner is gone, so the liveness check is what kept it.  | Met | - |
| AC-013 | REQ-005 | Given a completed lane, When its lineage directory is published into the main checkout, Then the published contents hash-equal the worktree source | `runtime/tests/unit/fanout-run.vitest.ts:4366` re-hashes every published file against the entry the manifest recorded for it, because a removed worktree proves nothing about whether its contents arrived.  | Met | - |
| AC-014 | REQ-005 | Given a lane running inside its own worktree, When it writes outside its lineage directory but inside that worktree, Then containment still reports a violation naming the worktree root; and when a neighbouring session writes in the main checkout during that run, Then no violation is attributed to the lane and those files stay byte-identical | `runtime/tests/unit/fanout-run.vitest.ts:4409` asserts both halves in one run: the lane writing outside its lineage directory inside its own worktree is caught, and a neighbour writing to the main checkout mid-lane is neither attributed nor altered.  | Met | - |
| AC-015 | REQ-005 | Given a lane whose worktree has diverged from the main checkout, When code inside the lane imports a first-party workspace package, Then the bytes loaded are the lane's own and not the main checkout's | `runtime/tests/unit/worktree-lifecycle.vitest.ts:531` spawns a child rooted in the lane and asserts on the value the module exported; `runtime/tests/unit/worktree-lifecycle.vitest.ts:547` is the negative control at the main checkout, proving the probe can tell the two apart.  | Met | - |
| AC-016 | REQ-005 | Given a generator the runner invokes after a run settles, When the build directory it lives in is reached through a link, Then the generator still performs its work rather than exiting 0 having done nothing | `runtime/tests/unit/fanout-run.vitest.ts:3970` asserts the planned invocation path is canonical and that the checkout to act on still travels in the arguments.  | Met | - |

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
