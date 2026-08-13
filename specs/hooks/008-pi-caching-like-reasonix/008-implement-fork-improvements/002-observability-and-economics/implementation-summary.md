---
title: "Implementation Summary: Observability and Economics"
description: "Completed deep-pi observability, cost-accounting, report transport, persistent statistics, and measured hot-path investigation."
trigger_phrases:
  - "deep-pi observability implementation"
  - "deep-pi economics implementation"
  - "deep-pi stats report"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/008-implement-fork-improvements/002-observability-and-economics"
    last_updated_at: "2026-08-11T06:43:14.480Z"
    last_updated_by: "codex"
    recent_action: "Fixed HANDOFF cross-process race and false characterization pin"
    next_safe_action: "Keep cross-process lock test green in future stats.ts edits"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stats use an independent schemaVersion 1 at <cwd>/.pi/deep-pi-stats.json."
      - "The structured savings field is noCacheCounterfactualSavings."
      - "ctx.ui is required by Pi's ExtensionContext type; hasUI gates notification."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-observability-and-economics |
| **Completed** | 2026-08-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

DeepPi now preserves useful economics across sessions, exposes a machine-readable report without requiring a TUI, and distinguishes measured costs from a no-cache counterfactual. Failed turns and invalid numeric usage no longer contaminate telemetry, and the previously silent runtime counters appear when they carry a nonzero value.

### Persistent statistics

`stats.ts` stores schemaVersion 1 at `<cwd>/.pi/deep-pi-stats.json`. It keeps per-session totals and cumulative daily totals keyed by UTC date. Reads return an explicit unreadable result for corrupt or future-version data. The read-modify-write update uses `atomicWriteFile` with `expectedContent` CAS; first-time file creation uses a separate `seedFile` bootstrap. A HANDOFF review correctly found that `atomicWriteFile`'s CAS only serializes writers inside one Node process, so two genuinely separate processes could each pass the check and the later one could silently clobber the earlier one's update — reproduced empirically with an artificially widened race window. `withCrossProcessLock`, an advisory `open(path, "wx")` file lock, now wraps the entire read-modify-write cycle (including `seedFile`), verified by two real child processes racing the same lock and stats file.

### Structured reporting and accounting

`buildDeepPiReport()` produces a plain versioned object, `renderDeepPiReport()` produces the human-readable text, and `deeppi.ts` writes `.pi/deep-pi-report.json` on every `/deeppi` call. UI notification is gated by `hasUI`. Cache-write tokens have their own bucket and cost is included in `actualInputCost`; `noCacheCounterfactualSavings` and its rendered label state the counterfactual explicitly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` | Modified | Totals, validation, stop-reason guard, report schema, renderer, and surfaced counters |
| `.pi/extensions/deep-pi/extensions/deeppi.ts` | Modified | Stats/report transport and session-shutdown flush |
| `.pi/extensions/deep-pi/extensions/deeppi/stats.ts` | Created | Versioned stats reader/writer, CAS, lifecycle paths, and JSON snapshot helper |
| `.pi/extensions/deep-pi/tests/telemetry.test.ts` | Modified | Accounting, guard, numeric negative controls, and exact report text |
| `.pi/extensions/deep-pi/tests/stats.test.ts` | Created | Round-trip, corruption, future schema, and CAS coverage |
| `.pi/extensions/deep-pi/tests/report.test.ts` | Created | Layer separation, UI-less snapshot, and flush lifecycle coverage |
| `.pi/extensions/deep-pi/benchmarks/before-provider-request.mjs` | Created | Standalone clone/digest benchmark outside Vitest |
| `benchmark-protocol.md` | Created | Design-only later crossover protocol |
| `denominator-note.md` | Created | Incompatible cross-fork denominator note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The required order was followed: REQ-004 fixed the totals shape and guard first, then REQ-003 accounting/labeling, REQ-006 counters, REQ-001 persistence, REQ-002 report layers, and REQ-005 measurement. A HANDOFF review correctly found the original characterization test's expected text already contained the post-split relabeled line, so it could not have proven byte-identity with the pre-split renderer as claimed. `telemetry.test.ts` now also carries a line-by-line diff against the actual pre-split renderer's frozen output (read from its source at the prior commit), asserting every line is unchanged except the one deliberately relabeled savings line — reproducing an unrelated line change against the live source made this new test fail correctly, then pass again once reverted. The crossover benchmark protocol was documented but not run because phase 003's packaging precondition remains open.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep an independent stats schema at `.pi/deep-pi-stats.json` | DeepPi's session/daily scopes and totals do not need to inherit the sibling fork's schema or corruption behavior. |
| Rename the structured savings field | `noCacheCounterfactualSavings` prevents consumers from treating an avoided-cost calculation as a measured delta. |
| Use `hasUI`, not `ctx.ui` presence, for transport gating | Pi guarantees the `ui` object in the type; `hasUI` expresses whether notification is available. |
| Do not alter `stability.ts` | At 800 conversation turns the measured clone-plus-digest cost was 1.698734 ms/op on Node v25.6.1, and retained state is session-bounded. The evidence did not justify a riskier incremental-digest change. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `npm test` | PASS: 9 test files and 66 tests, exit 0 |
| Baseline `npm run typecheck` | PASS: exit 0 |
| Final `npm test` | PASS: 11 test files and 76 tests, exit 0; after HANDOFF fixes: 81 tests, exit 0 |
| Final `npm run typecheck` | PASS: exit 0 |
| REQ-001 negative controls | PASS: corrupt/future files unreadable; original bytes preserved; one of two CAS writers rejected. HANDOFF added a real two-OS-process test proving `withCrossProcessLock` serializes the whole cycle, not just same-process writers. |
| REQ-004 negative controls | PASS: `aborted` rejected; `stop` recorded; `NaN` and negative input left totals unchanged |
| REQ-002 negative control | A HANDOFF review correctly found the original exact-text pin's expected text already contained the post-split relabeled line, so it never proved byte-identity with the actual pre-split renderer. `telemetry.test.ts` now also line-diffs against the real pre-split renderer's frozen output (`git show 19ac4a458d`), asserting every line matches except the one deliberately relabeled savings line. |
| Standalone REQ-005 harness | PASS: 10/50/200/800 turns measured; no hot-path change |
| Crossover benchmark | NOT RUN by design; phase 003 packaging fix is not yet available |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The stats file is project-scoped.** It follows the command context's `cwd`, so dashboards spanning projects need an explicit aggregation layer.
2. **The crossover benchmark remains deferred.** Run `benchmark-protocol.md` only after phase 003 fixes and verifies the `benchmark:live` packaging path.
3. **REQ-005 is a local operation benchmark.** It measures clone and digest work, not provider latency or end-to-end task success.
4. **The two fork denominators remain incompatible.** Use `denominator-note.md` and normalize before comparing them.
<!-- /ANCHOR:limitations -->
