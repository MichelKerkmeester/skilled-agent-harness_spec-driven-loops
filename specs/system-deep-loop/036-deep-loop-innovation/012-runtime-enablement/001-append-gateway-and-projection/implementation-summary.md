---
title: "Implementation Summary: Append Gateway and Legacy Projection"
description: "The deep-loop write path now exists: a gateway that binds, validates, authorizes, fences and projects every mode event, reachable from a shell caller, with two proven negative controls and a zero-regression delta."
trigger_phrases:
  - "append gateway implementation summary"
  - "gateway build result"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
    last_updated_at: "2026-08-20T01:17:49Z"
    last_updated_by: "opencode"
    recent_action: "Repaired a mode the authority order named and the CLI could not write"
    next_safe_action: "Begin the deep-research protocol migration"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Projection failure succeeds with a stale marker; the append is already durable"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Append Gateway and Legacy Projection

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection |
| **Status** | Complete |
| **Commit** | `a980092ffe`, then `b0137b9504` for a post-completion defect repair, on `worktrees/022-012-runtime-enablement-build`, not pushed |
| **Completed** | 2026-08-19 |
| **Lines** | 1894 added across 7 files |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A plain JSON record handed to a shell command now becomes an authorized, fenced, receipted ledger
event, and the legacy state file is materialised from that ledger. Neither half existed before.

| Surface | Change |
|---------|--------|
| `runtime/lib/mode-append-gateway/` | New. `appendModeEvent` composes bind, envelope, authorize, fenced append, project |
| `runtime/lib/legacy-projections/deep-research-contract.ts` | New. The first production projection contract in the repository |
| `runtime/lib/legacy-projections/index.ts` | Exports the new contract. No engine or manifest change |
| `runtime/scripts/append-mode-event.cjs` | New CLI, loading TypeScript through the tsx pattern the fan-out scripts already use |
| `runtime/tests/unit/` | Two new suites, 10 tests |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Implementation was delegated to an external model over six dispatches; verification was performed
locally against real command output every time.

That ratio is the finding. The executor reported success on runs that had produced nothing, and once
reported "gaps: None" while its own CLI could not load. Only running the artifact revealed the truth,
which is why the delegated-build-plus-local-verification split held rather than the executor's own
green.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

**Authorization precedes the fence.** An unauthorized event never acquires the fence, so it cannot
delay a legitimate writer.

**A projection refresh failure does not fail the append.** By the time the projection runs the event
is already durable, so reporting failure would misdescribe the ledger. The call succeeds and records
the projection state instead.

**The CLI prepares the envelope on the caller's behalf.** Requiring a shell caller to construct a
typed preflight would defeat the reason the entry point exists.

**One worktree for the packet rather than one per phase.** The phases are serial and each builds on
the last, so per-phase worktrees would add merges without adding isolation.

**The full suite is not re-run per phase.** One run costs 2h 47m and three files account for roughly
68 minutes of it. The delta below is scoped to every affected file instead.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Evidence is command output. Detail in `scratch/suite-baseline-and-delta.md`.

**Executed end to end, outside the test harness.** A plain JSON record through the CLI returned exit
0 and a receipt carrying a real `authorizationRef` (audit sequence, decision digest, policy digest)
and `fence_token: 1`. On disk: a ledger frame, an audit frame, a lock grant journal,
`research/deep-research-state.jsonl` holding a protocol-shaped `type: "config"` row, and a watermark
with a replay fingerprint and output digest.

**Refusals probed directly.** An invented event type returned `Event type does not match the frozen
namespace grammar`; an incomplete payload returned `Required payload field is missing`.

**Negative controls, both genuinely red.**

| Control | Broken | Restored |
|---------|--------|----------|
| Authorization denial disabled | 2 tests red | 10/10 green |
| Projection success path broken | 3 tests red | 10/10 green |
| Fence resource made unique per call | 4 tests red, incl. concurrency | 10/10 green |

The fence control matters most. It proves the concurrency test detects a broken fence rather than
passing by luck: with serialisation removed, the test that asserts `min=1, max=2` and a two-event
ledger goes red.

**Reader contract, exercised against a real run scaffold.**

| Consumer | Result |
|----------|--------|
| `reduce-state.cjs` | exit 0, `corruptionCount: 0` |
| `fanout-merge.cjs` | exit 0 |
| `fanout-salvage.cjs` | exit 0 |
| `divergent-research-pivot.ts` | exit 0 |
| `verify-iteration.cjs` | exit 1, structured `iteration_file_missing` — no iterations exist in the scaffold; the projection parsed cleanly |
| `fanout-run.cjs` | not run live: a dispatcher that would spawn real model calls. Its state reads are covered by a unit suite passing in baseline |

A synthetic directory is not sufficient. The scaffold needs the retained legacy inputs — the config
file and the strategy file, the latter built from the shipped template asset because the reducer
requires its anchor sections.

**Suite delta.** Baseline at `e6f17e1cbf5`: 35 failed / 4074 passed / 39 skipped of 4148, across 20
files, in 2h 47m. The targeted delta over every affected file reproduced exactly those failures,
identical by name, and added 10 passing tests. Zero regressions.
**A mode the CLI could not write, found after completion.** The fleet phase recorded that one of the
seven fleet modes had no working name on this CLI and routed the fix here, because the gateway's
surface resolution is this phase's surface. Re-measured by execution before changing anything: every
spelling failed, each refused by the layer the other satisfied — `improvement` and `deep-improvement`
denied because the frozen authority order spells the mode `deep-improvement-common`, and
`deep-improvement-common` refused by the adapter, which had no case for it. A routable mode run the
same way cleared both gates, which is the control that makes the result specific to this mode.

The authority order is the canonical vocabulary, so the CLI's private alias was the defect. Three
sites moved together. The gateway's surface line was required rather than cleanup: without it the
renamed mode falls to the generic tail, which yields a surface id that does not exist, so the write
would have landed elsewhere instead of failing.

The suite could not have caught this, because it was asserting the defect. Its unknown-mode test used
a real fleet mode as its example of an unrecognized one, which can only pass while a mode exists that
the adapter accepts and the order refuses. That branch is now unreachable: the adapter runs first and
the two mode sets hold the same eight modes. Replacing it is a guard that walks the frozen order and
requires every mode in it to route.

| Stage | Result |
|-------|--------|
| Baseline, before any change | 17 passed |
| After the fix | 19 passed |
| Defect reintroduced | 2 failed, 6 passed — guard named `deep-improvement-common` |
| Restored | 19 passed |

Detail, including two assertions prescribed wrong and why: `scratch/unroutable-mode.md`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**Row conformance is justified, not merely enumerated.** `convergenceThreshold`, `stuckThreshold`
and `specFolder` occur zero times in the deep-research ledger schema, so no ledger event carries
them and the projection cannot source them. They live in the config file, which the manifest
classifies `retain-legacy-input` precisely because operator input is not ledger-derived. The
timestamp field name differs from the documented row, and no consumer is affected: the only reader
of `createdAt` takes it from the config file and already falls back when absent.

**The gateway does not verify envelopes; its callers prepare them.** The section labelled as
envelope verification resolves the policy and passes the record through. Malformed input is refused
at the authorization boundary instead, which the authorization control proves red. The CLI does
prepare a typed envelope from raw JSON, so the observable contract — a shell caller needs no runtime
object — holds. The internal division of labour differs from the phase description and is recorded
here rather than reshaped to match it.

**Correction worth keeping.** The missing config file first looked like a projection defect. It is
not; the manifest deliberately excludes it. The projection was right and the test setup was wrong.

**Environment note.** Dispatching the review executor into this worktree rewrites
`.opencode/package.json` to match its own version. It was reverted here and must be swept before any
later commit.
<!-- /ANCHOR:limitations -->
