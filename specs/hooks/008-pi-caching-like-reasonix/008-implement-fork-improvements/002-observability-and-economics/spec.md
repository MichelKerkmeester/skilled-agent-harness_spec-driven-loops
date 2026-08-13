---
title: "Feature Specification: Observability and Economics"
description: "Implemented observability and economics for deep-pi: versioned atomic stats, a structured report snapshot and renderer, honest cache accounting, completed-turn telemetry guards, surfaced counters, and a measured session-bounded hot-path investigation."
trigger_phrases:
  - "observability and economics"
  - "deep-pi stats file"
  - "structured deeppi report"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/008-implement-fork-improvements/002-observability-and-economics"
    last_updated_at: "2026-08-08T09:43:42Z"
    last_updated_by: "codex"
    recent_action: "Verified observability and economics implementation"
    next_safe_action: "Proceed to phase 003 maintainability and provenance"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stats live at <cwd>/.pi/deep-pi-stats.json with independent schemaVersion 1, session records keyed by session id, and cumulative daily records keyed by UTC date; updates use atomicWriteFile with expectedContent CAS."
      - "estimatedSavings was renamed to noCacheCounterfactualSavings and renders as No-cache counterfactual savings; actualInputCost now includes cache-write cost."
      - "Pi's ExtensionContext and ExtensionCommandContext require ctx.ui; ctx.hasUI is the capability flag, so the transport writes the snapshot always and notifies only when hasUI is true."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Observability and Economics

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-correctness-floor |
| **Successor** | 003-maintainability-and-provenance |
| **Handoff Criteria** | deep-pi's telemetry survives a session, its report is readable without a TUI, its cost numbers are honestly labeled and account for cache-write cost, and the hot-path digest question is answered with a measurement rather than a guess |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the 008 "Implement Fork Improvements" decomposition. It owns the five P1 items (action-list items 5 through 9) from `../../007-research-fork-improvements/research/research.md`. Every one of them is an observability or cost-accounting concern: none is a crash, and none blocks a session today.

**Scope Boundary**: This phase is implemented. The changed code is limited to `.pi/extensions/deep-pi/`, its standalone benchmark harness, and this phase's evidence documents. `pi-cache-optimizer` was read-only reference material and was not modified.

**Dependencies**:
- **Phase 001 must land first.** Two items depend on it directly: the crossover benchmark design (REQ-007) is worthless until `recordUsage` stops discarding the session's first cache-write turn, and the `stopReason` work (REQ-004) sits on the same guard 001 rewrites
- `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` disclosed the two limitations REQ-002 exists to close: `/deeppi`'s report is not observable through `pi --print`, and `pi --mode rpc` confirmed only a status-bar-level signal rather than the report body

**Seam with phase 001** (stated identically in both specs so neither assumes the other closed it): phase 001 stops a cache-write-only turn from being *discarded*. This phase decides what the recorded numbers *mean* — where cache-write tokens land in `ModelTotals`, whether `actualInputCost` includes `usage.cost.cacheWrite`, and which denominator `cacheHitRate` should use.

**Deliverables**:
- A versioned deep-pi stats file with session and cumulative-daily scopes, written atomically
- A versioned report data object, a renderer, and a transport that no longer requires `ctx.ui`
- Cache-write cost in the accounting, and `estimatedSavings` labeled for what it is
- A `stopReason` guard plus numeric validation on the telemetry hook
- A measurement of the `before_provider_request` digest cost, and a decision based on it
- A denominator note documenting the two forks' incompatible cache-hit-rate populations
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**5. deep-pi keeps no persistent stats, unlike its sibling fork** (research Tier 1 #3, all four lineages; action-list item 5). `pi-cache-optimizer` persists versioned buckets to disk and reads them back across sessions — `readPersistedCacheStats` at `.pi/extensions/pi-cache-optimizer/index.ts:4066-4104`, `writePersistedCacheStats` at `:4264-4316`, emitting a `version: 6` payload with `sessions`, `totalsByModel`, and `legacyFamily` at `:4305-4311`. deep-pi holds everything in memory: `TelemetryState` at `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:27-32`, built fresh by `createTelemetryState` at `:38-45`, and wiped by `resetTelemetry` at `:123-128`, which `session_start` calls unconditionally (`.pi/extensions/deep-pi/extensions/deeppi.ts:47`). Every session's cache economics are lost the moment it ends. The 4th lineage added a concrete design constraint (`f-deeppi-stats-design`): the new writer should reuse deep-pi's own `atomicWriteFile` (`hashlines.ts:58-106`) rather than copy pi-cache-optimizer's read-merge-rename cycle, which sol independently found has no cross-process lock (its `createSerializedAsyncRunner` at `index.ts:4215-4222` serializes within one process only), silently treats malformed persisted data as empty (`:4293-4295`), and names its temp file weakly with no guaranteed cleanup (`:4312-4315`). sol separately proposed the scope split (`f-deeppi-dual-scope-stats`): session plus cumulative-daily.

**6. `/deeppi`'s report is UI-notify-only** (research Tier 1 #2, all four lineages; action-list item 6). The command's only output path is `ctx.ui.notify(formatDeepPiReport({...}), "info")` at `deeppi.ts:68-80`, and `formatDeepPiReport` (`telemetry.ts:94-119`) returns an already-joined string — data and its text rendering are fused in one function. Nothing can read the report programmatically, which is exactly the limitation `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` disclosed rather than solved. luna additionally noted (`f-015`) that neither fork's command output carries a `schemaVersion` at all, so even a consumer that could reach the data would have nothing to version against.

**7. Cost arithmetic omits cache-write cost, and the savings number is a counterfactual presented as a result** (research Tier 1 #4, three lineages; sharpened by the 4th; action-list item 7). `recordUsage` accumulates `totals.actualInputCost += usage.cost.input + usage.cost.cacheRead` at `telemetry.ts:64` — `usage.cost.cacheWrite` is present in the `PiUsage` shape (`:10`) and never added. `totals.estimatedSavings += (usage.cacheRead / 1_000_000) * (model.cost.input - model.cost.cacheRead)` at `:65-66` computes what the same tokens would have cost with no cache — a counterfactual, not a measurement — and the report labels it plainly as `Estimated savings:` at `:108`. The 4th lineage's `f-write-cost-is-miss-price` sharpens why the omission matters: DeepSeek has no separate cache-write price tier, so the write is charged at the cache-miss rate and a savings figure that ignores it double-credits a price already paid. A corroborating signal exists in the sibling fork's own source — `index.ts:2183` records that DeepSeek guarantees `prompt_tokens = prompt_cache_hit_tokens + prompt_cache_miss_tokens`, a two-bucket schema with no write bucket, and `:2186` accordingly returns `cacheWrite: 0` for DeepSeek's raw usage shape. That is a strong hint from a sibling implementation, not vendor-authoritative pricing, and REQ-003 requires confirming it against Pi's live model pricing metadata before any number is published.

**8. Cache-write tokens land nowhere, and no `stopReason` guard exists** (research Tier 3, luna `f-005`/`f-006`; Tier 4 `f-stopreason-guard-absent`; action-list item 8). `ModelTotals` (`telemetry.ts:19-25`) has buckets for responses, hit tokens, miss tokens, actual input cost, and estimated savings — none for cache-write — and `recordUsage`'s accumulation block (`:61-66`) never reads `usage.cacheWrite`. Separately, the `message_end` handler (`:135-185`) gates on `ctx.model`, provider match, `id in state.byModel`, message provider and model equality, and the presence of `model.usage` — it never inspects the turn's stop reason, so a failed or aborted turn is recorded as if it completed. luna also found (`f-008`) that deep-pi mutates counters from unvalidated numbers, with no finite or non-negative check, where pi-cache-optimizer routes the same fields through a normalization layer (`getNonNegativeNumber`, used at `index.ts:2151-2153`). A related cheap gap (luna `f-014`): `errorsEnhanced` is declared, initialized, reset, and incremented (`stormbreaker.ts:33`, `:39`, `:51`, `:144`) but never reaches `ReportInput` (`telemetry.ts:80-92`) or the command's call site (`deeppi.ts:68-80`) — and the same is true of `prunedThinking` and `preservedThinking` (`stability.ts:143-144`, incremented at `:170-171`, reset at `deeppi.ts:54-55`). That is the identical silent-counter bug class 006/001 already fixed for `transformErrors`, `usageUnavailable`, and `costMathErrors`.

**9. Every request digests the whole conversation, and the digest array grows with it** (research Tier 4, `f-hotpath-prefix-digest`; action-list item 9). The `before_provider_request` hook deep-clones the payload (`stability.ts:196`), sorts tools (`:197`), and calls `capturePrefixShape` (`:198`), which maps a SHA-256 over `JSON.stringify` across every non-system message (`:121`, digest at `:85-87`). The resulting `messageDigests` array (`:82`) is retained on `state.previousShape` (`:200`). The research calls this unbounded growth; the honest local reading is that it is session-bounded — `deeppi.ts:50` resets `previousShape` to `null` at `session_start` — but the per-request cost still grows linearly with conversation length, on the hot path of every single provider call. Nobody has measured it. This item is an investigation, and the requirement is written that way.

### Purpose
Give deep-pi observability that survives a session and is readable without a TUI, and give its cost numbers meanings that hold up: cache-write cost accounted for, counterfactual estimates labeled as estimates, failed turns excluded, and the one performance question answered with a measurement instead of a guess.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned, atomically-written deep-pi stats file with a session scope and a cumulative-daily scope
- Splitting `/deeppi`'s report into a versioned data object, a renderer that reproduces today's text, and a transport that writes a JSON snapshot regardless of whether a UI is attached
- Adding `usage.cost.cacheWrite` to `actualInputCost`, and relabeling `estimatedSavings` so its counterfactual nature is explicit in both the field name and the rendered report
- Routing cache-write tokens into `ModelTotals`, adding a `stopReason` guard to `message_end`, and validating numeric usage before mutating counters
- Wiring the three unsurfaced counters (`errorsEnhanced`, `prunedThinking`, `preservedThinking`) into the report
- Measuring the `before_provider_request` digest and clone cost against realistic conversation lengths, then deciding on the evidence
- **Designing** a controlled cold/warm crossover benchmark — protocol only. Running it is explicitly deferred

### Out of Scope
- **Any code change during this planning pass.** No file under `.pi/extensions/` is touched while authoring this document set
- Phase 001's four P0 items. In particular, the guard that discards a cache-write-only turn (`telemetry.ts:52-55`) is 001's REQ-001; this phase assumes it already landed
- **Running** the crossover benchmark. It depends on 001's fix landing and on phase 003's `benchmark:live` packaging repair, and publishing a causal savings number without both would be dishonest
- Any change to `pi-cache-optimizer`. Its persistence path is read here as a reference and as the source of the denominator comparison; its own concurrency weaknesses are recorded but not fixed, since it is not the fork adding a stats file
- Normalizing the two forks' cache-hit-rate denominators into one number — REQ-008 documents the asymmetry rather than silently reconciling it
- Extraction, drift checks, and packaging — phase 003

### Files to Change

> On authorized implementation. This planning pass changes none of them.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` | Modify | Cache-write bucket in `ModelTotals`; cache-write cost in `actualInputCost`; counterfactual relabeling; `stopReason` guard and numeric validation on `message_end`; report data separated from rendering |
| `.pi/extensions/deep-pi/extensions/deeppi.ts` | Modify | Report transport writes a snapshot independent of `ctx.ui`; the three unsurfaced counters passed to the report |
| `.pi/extensions/deep-pi/extensions/deeppi/stats.ts` | Create | Versioned stats file, session and cumulative-daily scopes, written through `atomicWriteFile` |
| `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts` | Read-only reuse | `atomicWriteFile` was already exported and was reused without changing rename/verification logic |
| `.pi/extensions/deep-pi/extensions/deeppi/stability.ts` | No change | The measured hot-path cost did not justify an optimization; session reset makes the retained shape session-bounded |
| `.pi/extensions/deep-pi/tests/telemetry.test.ts` | Modify | Cache-write accounting, `stopReason` rejection, numeric validation, counterfactual labeling |
| `.pi/extensions/deep-pi/tests/stats.test.ts` | Create | Round-trip, versioning, corrupt-file, and concurrent-write coverage for the new stats file |
| `.pi/extensions/deep-pi/tests/report.test.ts` | Create | Report layer and UI-less transport/snapshot coverage |
| `.pi/extensions/deep-pi/benchmarks/before-provider-request.mjs` | Create | Standalone clone/digest timing harness outside the assertion suite |
| (new) benchmark protocol document | Create | Crossover experiment design — enabled versus disabled, repeated, randomized — with its preconditions stated |
| (new) denominator note | Create | Records the incompatible cache-hit-rate denominators and normalization requirement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | deep-pi persists versioned stats across sessions, written through its own atomic helper | A stats module writes via `atomicWriteFile` (`hashlines.ts:58-106`), never a hand-rolled read-merge-rename. Tests cover round-trip, an unknown future version, a corrupt file (which must not silently zero real data the way `index.ts:4293-4295` does), and two concurrent writers. Both a session scope and a cumulative-daily scope are readable after a restart |
| REQ-002 | Report data, rendering, and transport are three separable things, and the data carries a version | A versioned data object is produced independently of any renderer; the existing text renderer reproduces today's output byte-for-byte for an unchanged input; a JSON snapshot is written on each report regardless of whether `ctx.ui` exists. A test asserts the snapshot appears with no UI attached |
| REQ-003 | Cache-write cost is accounted for, and the savings figure is labeled as a counterfactual | `actualInputCost` includes `usage.cost.cacheWrite` (`telemetry.ts:64`); the savings field and its rendered label state that it is a no-cache counterfactual rather than a measured delta. DeepSeek's lack of a separate cache-write price tier is confirmed against Pi's live model pricing metadata for both owned model ids before any figure is published — the sibling fork's `index.ts:2183`/`:2186` evidence is treated as a corroborating hint, not as authority |
| REQ-004 | Failed and aborted turns are not recorded, and numeric usage is validated before mutation | `message_end` (`telemetry.ts:135-185`) inspects the turn's stop reason and returns early for non-completed turns; `recordUsage` rejects non-finite or negative values before touching `totals`, following the all-or-nothing shape 006/001's REQ-003 established. Cache-write tokens reach a real bucket in `ModelTotals` rather than being read and dropped |
| REQ-005 | The hot-path digest cost is measured before anything is changed | A reproducible measurement of `before_provider_request`'s clone plus digest cost across realistic conversation lengths, reported as real numbers. The finding's "unbounded" framing is corrected or confirmed against `deeppi.ts:50`'s session reset. A change ships only if the measurement justifies it; if it does not, that conclusion is recorded with its numbers |
| REQ-006 | The three tracked-but-unsurfaced counters reach the report | `errorsEnhanced` (`stormbreaker.ts:33`), `prunedThinking`, and `preservedThinking` (`stability.ts:143-144`) appear in `ReportInput` and in `/deeppi`'s output, shown only when nonzero, and are reset per session — matching exactly how 006/001 handled `transformErrors` and `costMathErrors` |

### P2 - Optional (defer or cut without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | A controlled crossover benchmark is designed, not run | A protocol document specifies the enabled/disabled conditions, repetition count, randomization, and the confounders it controls for, and states its two preconditions plainly: phase 001's REQ-001 must have landed, and phase 003's `benchmark:live` packaging must be fixed before it can run against the shipped package |
| REQ-008 | The two forks' cache-hit-rate denominators are documented, not silently reconciled | A written note records that deep-pi's `cacheHitRate` uses `hitTokens + missTokens` (`telemetry.ts:70-73`, excluding cache-write) while pi-cache-optimizer uses `input + cacheRead + cacheWrite` (`index.ts:2159-2167`), and states that any dashboard combining the two must normalize first |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: deep-pi's cache economics survive a session restart, and the stats file is proven against corruption and concurrent writers rather than assumed safe
- **SC-002**: A non-interactive caller can read the full `/deeppi` report — the limitation 006/003 disclosed is closed, not restated
- **SC-003**: No cost figure deep-pi reports is more confident than its evidence. A counterfactual is labeled as one, and cache-write cost is either counted or its exclusion is justified in writing
- **SC-004**: The digest-cost question is answered with numbers. "Investigated and found not worth changing" is an acceptable outcome; "assumed fine" is not
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's REQ-001 | Until the cold-start turn is recorded, any stats file or benchmark captures the bug rather than the cache | REQ-007 states this as an explicit precondition; phase 001 is this phase's declared Predecessor |
| Risk | The new stats file reproduces pi-cache-optimizer's own persistence weaknesses | A second racy, silently-lossy stats writer instead of one | REQ-001 mandates `atomicWriteFile` and names the three specific behaviors not to copy, each with its line range |
| Risk | Adding cache-write cost to `actualInputCost` changes numbers the 2026-08-08 benchmark artifact already published | Past figures stop matching current output with no explanation | Record the accounting change and its effective date alongside the field, so a reader comparing old and new numbers sees why they differ |
| Risk | The `stopReason` guard is written against a field shape that was assumed rather than read | The guard silently never fires, and failed turns keep being recorded | Read the real `message_end` event shape before writing the guard; add a test that a non-completed turn is rejected and a completed one is still recorded |
| Risk | REQ-005 turns into a speculative optimization | Effort spent on a hot path that was never hot | The requirement is measure-first by construction; a change ships only if the numbers justify it |
| Risk | Separating report data from rendering breaks the existing report text | A working `/deeppi` regresses while being refactored | REQ-002 requires the renderer to reproduce today's output byte-for-byte for unchanged input, pinned by a test written before the split |
| Dependency | `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` | It disclosed the observability limitation REQ-002 closes | Complete and on record, including the `pi --mode rpc` partial result |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Where does the stats file live, and does its schema mirror pi-cache-optimizer's?** It lives at `<cwd>/.pi/deep-pi-stats.json`. The schema is intentionally independent: `schemaVersion: 1`, session records keyed by Pi session id, and cumulative daily records keyed by UTC date. The writer uses `atomicWriteFile` and `expectedContent`; the reader returns `unreadable` for corrupt or future-version data instead of treating it as empty.
- **Should `estimatedSavings` be renamed, or only relabeled in the report?** It was renamed to `noCacheCounterfactualSavings`, and the rendered line is `No-cache counterfactual savings`. The report object is versioned, so the structured-field rename is explicit rather than an accidental compatibility change.
- **Does `ExtensionCommandContext` guarantee `ctx.ui`?** Yes. Pi's installed type definition makes `ui` required on `ExtensionContext`, and `ExtensionCommandContext` extends it. `hasUI` is the capability flag; the transport therefore writes the JSON snapshot unconditionally and calls `notify` only when `hasUI` is true.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../001-correctness-floor/spec.md`
- **Successor**: `../003-maintainability-and-provenance/spec.md`
- **Evidence source**: `../../007-research-fork-improvements/research/research.md` (Tier 1 #2/#3/#4, Tier 3, Tier 4, and action-list items 5-9)
- **Related**: `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/spec.md` (the disclosed report-observability limitation REQ-002 closes)
