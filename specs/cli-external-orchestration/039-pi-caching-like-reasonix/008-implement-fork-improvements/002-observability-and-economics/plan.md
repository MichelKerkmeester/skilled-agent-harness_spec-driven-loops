---
title: "Implementation Plan: Observability and Economics"
description: "Technical approach for the 5 P1 items: a versioned deep-pi stats module built on atomicWriteFile with session and cumulative-daily scopes, a three-layer report split with a schemaVersion, cache-write cost in actualInputCost with the savings figure relabeled as a counterfactual, a stopReason guard plus numeric validation on message_end, and a measure-first investigation of the before_provider_request digest cost."
trigger_phrases:
  - "observability and economics plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/002-observability-and-economics"
    last_updated_at: "2026-08-08T09:43:42Z"
    last_updated_by: "codex"
    recent_action: "Verified implementation against plan"
    next_safe_action: "Proceed to phase 003 maintainability and provenance"
    blockers: []
    key_files: ["plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Observability and Economics

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (the `deep-pi` Pi extension; `pi-cache-optimizer` is read-only reference here) |
| **Framework** | Pi extension hook API, plus `node:fs/promises` for the new stats file |
| **Storage** | New: a versioned JSON stats file written through deep-pi's existing `atomicWriteFile` (`hashlines.ts:58-106`) |
| **Testing** | vitest — deep-pi's existing 8-file suite, extended |

### Overview
Five P1 items, of which four are additive and one is an investigation. Three touch `telemetry.ts` and are best sequenced together because they all move through `recordUsage` and `ReportInput`: cache-write accounting, the counterfactual relabeling, and the `stopReason` guard. One adds a new module (`stats.ts`) whose whole design point is reusing an atomic writer that already exists rather than reinventing a racier one. One measures a hot path and only then decides whether to touch it.

The report split (REQ-002) is the largest change and the one most able to break a working feature, so it is planned last of the code items, behind a characterization test that pins today's exact output first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All P1 citations re-read against the live vendored source during planning
- [x] `atomicWriteFile`'s real guarantees confirmed by direct read, not assumed from its name: `open(..., "wx", 0o600)` at `hashlines.ts:67`, `handle.sync()` at `:71`, symlink refusal at `:75-80`, mode preservation at `:81-82`, optional compare-and-swap at `:83-90`, post-rename verification at `:96-101`, temp cleanup at `:104`, all serialized by `withWriteQueue` at `:41-56`
- [x] The three behaviors not to copy from pi-cache-optimizer's writer identified with line ranges (`index.ts:4215-4222`, `:4293-4295`, `:4312-4315`)
- [x] The three unsurfaced counters confirmed present in state and absent from `ReportInput` by grep, not by assumption
- [x] Phase 001 complete, so cache-write-only turns actually reach `recordUsage` — baseline confirmed at 9 files/66 tests and ownership metadata present
- [x] Operator authorization to modify files under `.pi/extensions/` — user explicitly requested implementation of this phase

### Definition of Done
- [x] REQ-001 through REQ-006 implemented with tests; REQ-007 and REQ-008 delivered as documents
- [x] `npm test` and `npm run typecheck` exit 0 in `.pi/extensions/deep-pi/` — final run: 11 files/76 tests and typecheck exit 0
- [x] The stats file survives a simulated restart and a real interleaved concurrent-write attempt, verified by `stats.test.ts`
- [x] REQ-005 closed with numbers on record; no hot-path change was justified
- [x] `git diff` scoped to the implementation files and phase evidence files; unrelated pre-existing worktree changes were preserved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive modules and additive fields, with one refactor (the report split) gated behind a characterization test. Nothing here changes activation, ownership, or hook registration — this phase changes what gets recorded and what can be read back, not who acts on which model.

### Key Components

**REQ-001 — `stats.ts`, a versioned stats file.** A new module owning three things: a schema, a reader, and a writer.

- Schema: an explicit `schemaVersion` integer, a `session` scope keyed by session, and a `daily` cumulative scope keyed by UTC date, each holding per-model totals mirroring `ModelTotals` (`telemetry.ts:19-25`) plus whatever cache-write bucket REQ-004 adds. Planned independent of pi-cache-optimizer's `version: 6` shape (`index.ts:4305-4311`) — see `spec.md` §7 for the trade-off.
- Writer: serializes the whole document and hands it to `atomicWriteFile(path, content, expectedContent)` for the update path. First-time file creation instead uses `seedFile`, a small separate `open(path, "wx", 0o600)` bootstrap — deliberate, since it only needs OS-level create-if-absent, not `atomicWriteFile`'s CAS/rename machinery; not a duplication of the update-path writer.
- Reader: parses, validates `schemaVersion`, and on an unknown-future version or a parse failure returns an explicit "unreadable" result rather than an empty one. This is the specific behavior not to copy from `index.ts:4293-4295`, whose bare `catch {}` makes a corrupt file indistinguishable from a fresh one and silently discards real history on the next write.
- Concurrency: `atomicWriteFile`'s `withWriteQueue` (`hashlines.ts:41-56`) and `expectedContent` CAS only serialize writers inside the *same* Node process — a genuinely separate OS process reads the same pre-write content, passes its own CAS check, and can still rename after another process already committed, silently losing that process's update. A `withCrossProcessLock` advisory file lock (`stats.ts:223`, `open(lockPath, "wx", 0o600)` retried on `EEXIST`, released in a `finally`) wraps the *whole* read-modify-write cycle — including `seedFile` — so only one process runs it at a time, verified by spawning two real child processes against the same lock and asserting their critical sections never overlap (`stats.test.ts` "cross-process mutual exclusion").
- Lifecycle: flush on `session_shutdown` if deep-pi registers one, and on each `/deeppi` invocation. Do not flush per `message_end` — that puts a file write on the hot path this phase is separately trying to measure.

**REQ-002 — three-layer report.** Today `formatDeepPiReport` (`telemetry.ts:94-119`) both selects the data and joins the strings, and `deeppi.ts:68-80` immediately hands the joined result to `ctx.ui.notify`. Split into:

1. `buildDeepPiReport(input): DeepPiReport` — a plain versioned object (`schemaVersion`, model id, totals, counters, churn). No formatting.
2. `renderDeepPiReport(report): string` — produces today's exact text plus the newly-surfaced counters. A line-by-line diff test against the pre-split renderer's output (frozen from its source at the prior commit, not re-derived from the current one) proves every line is unchanged except the one deliberately relabeled savings line.
3. Transport in `deeppi.ts` — writes the report object as a JSON snapshot unconditionally, and calls `ctx.ui.notify(render(...))` only when a UI is present.

The snapshot path is what closes the limitation `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` disclosed: a caller with no TUI reads the file instead of scraping a notification that never renders. Note the open question in `spec.md` §7 about whether `ExtensionCommandContext` guarantees `ctx.ui` — `deeppi.ts:68` calls it unguarded while `:25` uses optional chaining for the plain `ExtensionContext`. Confirm against Pi's type definitions before building the UI-less test harness.

**REQ-003 — cost accounting and honest labeling.** Two edits in `recordUsage`:

- `totals.actualInputCost += usage.cost.input + usage.cost.cacheRead` (`telemetry.ts:64`) gains `+ usage.cost.cacheWrite`. The field already exists on the `PiUsage` cost shape (`:10`), so this is an omission, not a new dependency.
- `totals.estimatedSavings` (`:65-66`) keeps its arithmetic and gains an unambiguous name and label. It computes what the cache-read tokens would have cost at the uncached input rate — a no-cache counterfactual. The rendered label at `:108` changes to say so.

Before publishing any savings figure, confirm DeepSeek's pricing shape against Pi's live model metadata for `deepseek/deepseek-v4-flash` and `deepseek/deepseek-v4-pro`. The sibling fork's source carries a strong corroborating hint — `index.ts:2183` states DeepSeek guarantees `prompt_tokens = prompt_cache_hit_tokens + prompt_cache_miss_tokens` (two buckets, no write bucket) and `:2186` returns `cacheWrite: 0` for that provider — but a comment in another extension is not a price list.

**REQ-004 — `stopReason` guard, numeric validation, and a cache-write bucket.**

- Guard: the `message_end` handler (`telemetry.ts:135-185`) currently checks model presence, provider, `id in state.byModel`, message provider and model equality, and `model.usage` presence, and nothing about how the turn ended. Add an early return for non-completed turns. Read the real event shape first — the handler already casts `event.message` through an inline structural type at `:142-159`, and the stop-reason field must be added to that type rather than accessed off an `any`.
- Validation: follow the shape 006/001's REQ-003 established — validate before mutating, never try/catch after, so `totals` is never left partially updated. A non-finite or negative value increments an error counter and returns `false`.
- Bucket: add a cache-write total to `ModelTotals` (`:19-25`) and accumulate `usage.cacheWrite` into it. This is what makes phase 001's admitted cold-start turn actually mean something; until it exists, that turn increments `responses` and nothing else.
- Interaction with phase 001 worth stating plainly: after 001, a genuinely zero-token turn still sets `usageUnavailable`, which is correct. The `stopReason` guard is a separate improvement — it stops a failed turn from reaching `recordUsage` at all, so the flag is never consulted for it.

**REQ-006 — surface the three counters.** Purely mechanical, and precedented: `errorsEnhanced` (`stormbreaker.ts:33`, incremented `:144`), `prunedThinking` and `preservedThinking` (`stability.ts:143-144`, incremented `:170-171`) are added to `ReportInput` (`telemetry.ts:80-92`), rendered only when nonzero using the same conditional array-spread already at `:109-111`, and passed at the call site (`deeppi.ts:68-80`). Reset already happens — `resetStormBreaker` (`stormbreaker.ts:49-51`) and `deeppi.ts:54-55` — so no new reset logic is needed; confirm that by reading rather than assuming.

**REQ-005 — measure the hot path.** `before_provider_request` (`stability.ts:192-206`) does a `structuredClone` of the whole payload (`:196`) and a SHA-256 over `JSON.stringify` per non-system message (`:121`, `:85-87`) on every provider call. Method: a benchmark harness that builds synthetic payloads at several conversation lengths, times the clone and the digest separately, and reports real numbers. Correct the finding's framing while measuring: the array is session-bounded, not process-unbounded, because `deeppi.ts:50` resets `previousShape` at `session_start`. Only if the numbers justify it, consider incremental digesting — reusing the previous shape's digests for the unchanged prefix, since `classifyPrefixChurn` (`:133-135`) already compares index-wise and only needs to find the first divergence. If the numbers do not justify it, record them and close the item.

### Data Flow
`message_end` fires, the guard chain (now including stop reason) admits or rejects the turn, `recordUsage` validates then accumulates into `ModelTotals` including a cache-write bucket, and the stats module flushes on shutdown or on report. `/deeppi` builds a versioned report object, writes it as a snapshot unconditionally, and renders it to the UI only when one exists. Activation, ownership, and hook registration are untouched throughout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 001 landed and its tests are green, so cache-write-only turns actually reach `recordUsage`
- [x] Capture a baseline: `npm test` and `npm run typecheck` in `.pi/extensions/deep-pi/`, output and exit status read
- [x] Write the characterization test that pins today's exact `/deeppi` report text before anything is refactored; the pre-refactor test passed with 11 tests
- [x] Confirm `ExtensionCommandContext`'s `ctx.ui` guarantee against Pi's type definitions; `ui` is required and `hasUI` is the capability flag

### Phase 2: Core Implementation
- [x] REQ-004: cache-write bucket, `stopReason` guard, numeric validation — implemented first and covered by rejected-invalid and aborted/completed tests
- [x] REQ-003: cache-write cost into `actualInputCost`; `noCacheCounterfactualSavings` naming and label, after live pricing metadata confirmation
- [x] REQ-006: the three unsurfaced counters into `ReportInput` and the call site, conditional on nonzero
- [x] REQ-001: `stats.ts` with schema, reader, writer, CAS, retry, and lifecycle wiring
- [x] REQ-002: the three-layer report split, behind the characterization test, with a UI-less snapshot test
- [x] REQ-005: build and run the standalone measurement harness

### Phase 3: Verification
- [x] Restart round-trip: `/deeppi` and `session_shutdown` flush session totals; a fresh read sees the cumulative UTC-day scope
- [x] Corrupt-file and unknown-version cases return explicit `unreadable` results and do not destroy existing data on the next write
- [x] Concurrent-writer case fails loudly through compare-and-swap; the transport-level path retries a fresh merge
- [x] Characterization test still green after the report split, proving the renderer is byte-identical for unchanged input
- [x] Snapshot written with no UI attached
- [x] REQ-005's numbers recorded, and the resulting decision is no hot-path change
- [x] Full suite and typecheck re-run from the final state; scoped diff reviewed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Characterization | Today's exact `/deeppi` report text, pinned before the split and re-asserted after | vitest |
| Unit | Cache-write cost in `actualInputCost`; counterfactual field and label; cache-write tokens reaching their bucket | vitest |
| Unit | `stopReason` guard rejects a non-completed turn and still admits a completed one; non-finite and negative usage rejected before any mutation | vitest |
| Unit | The three surfaced counters appear when nonzero and are absent when zero | vitest |
| Integration | Stats round-trip across a simulated restart; corrupt file; unknown future version; two concurrent writers | vitest with a temp directory |
| Integration | Report snapshot written with no UI attached | vitest |
| Benchmark | Clone and digest cost at several conversation lengths, reported as numbers | a standalone harness, not the assertion suite |
| Type check | deep-pi compiles clean under its strict tsconfig | `tsc --noEmit` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001's REQ-001 | Internal (predecessor) | Green and confirmed | The baseline reached `recordUsage`, including cache-write-only coverage |
| Operator authorization to modify `.pi/extensions/` | Process | Granted in the implementation request | The requested phase scope authorized the edits |
| `atomicWriteFile` reachable from a new module | Internal | Green (exported at `hashlines.ts:58`) | Move it to `utils.ts`; never duplicate it |
| Pi's live model pricing metadata for both owned model ids | External | Green and confirmed | Flash: input 0.14/cache-read 0.0028; Pro: input 0.435/cache-read 0.003625; both cache-write 0 |
| Phase 003's `benchmark:live` packaging fix | Internal (successor) | Not started | REQ-007 remains design-only as required |
| `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` | Internal | Green (Complete) | The observability limitation REQ-002 closes would be undocumented |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the characterization test cannot be made green after the report split; the stats file's corrupt-input or concurrency case cannot be made to fail loudly; the `stopReason` guard cannot be written against a real event field; or the diff escapes `spec.md` §3's list
- **Procedure**: working-tree revert of the touched files under `.pi/extensions/deep-pi/`, then re-run the suite and typecheck to confirm the Phase 1 baseline is restored exactly. The new stats file is additive, so rollback also means deleting any stats file it wrote — note that a partially-written file from an aborted run is prevented by `atomicWriteFile`'s temp-and-rename, not by cleanup
- **Partial rollback**: REQ-001, REQ-002, and REQ-005 are independently revertible. REQ-003 and REQ-004 share the `ModelTotals` shape and should be reverted together to avoid a half-applied accounting change, which would be worse than either state
<!-- /ANCHOR:rollback -->

---

## 8. IMPLEMENTATION EVIDENCE

- Baseline before implementation: `npm test` reported `Test Files 9 passed (9)` and `Tests 66 passed (66)`; `npm run typecheck` exited 0. The ownership file existed with direct `deepseek-v4-flash` and `deepseek-v4-pro` entries.
- Final code gate at the last verification pass: `npm test` reported `Test Files 11 passed (11)` and `Tests 76 passed (76)`; `npm run typecheck` exited 0.
- Characterization negative control: the exact old report string test passed before the formatter was changed. The final exact-string assertion also passes after the data/render split; changing the renderer label or whitespace makes that assertion fail.
- REQ-004 negative controls: `aborted` was rejected with zero recorded responses; the same usage with `stop` recorded one response. `NaN` and `-1` usage values each returned false, incremented `costMathErrors`, and left totals unchanged.
- REQ-001 negative controls: corrupt JSON and `schemaVersion: 99` returned `status: "unreadable"`, `updateStatsForSession` raised `StatsUnreadableError`, and the original bytes remained unchanged. Two prepared writers sharing one expected content produced one fulfilled commit and one CAS rejection.
- REQ-005 harness (`node benchmarks/before-provider-request.mjs`, 500 measured rounds, 50 warm-up rounds, Node v25.6.1):

| Conversation turns | Clone ms/op | Digest ms/op | Clone + digest ms/op |
|---:|---:|---:|---:|
| 10 | 0.061804 | 0.017594 | 0.073888 |
| 50 | 0.088483 | 0.060828 | 0.165869 |
| 200 | 0.263095 | 0.203471 | 0.496420 |
| 800 | 0.857471 | 0.904835 | 1.698734 |

  `previousShape` is reset at session start, so the retained digest array is session-bounded. The measured per-request cost did not justify changing the hot path; the harness and numbers are retained for a later decision if workload evidence changes.
