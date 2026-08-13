---
title: "Implementation Summary: stopping clocks"
description: "Five independent typed clocks, replay-stable earliest-fire arbitration, authorized terminal cause events, and additive-dark legacy compatibility."
trigger_phrases:
  - "stopping clocks implementation"
  - "loop termination cause event"
  - "deep-loop earliest-fire arbiter"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/003-stopping-clocks"
    last_updated_at: "2026-07-21T11:37:00Z"
    last_updated_by: "codex"
    recent_action: "Completed runtime, adversarial verification, metadata, and strict validation"
    next_safe_action: "Keep the module shadow-only until the separate program cutover gates pass"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/stopping-clocks/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/stopping-clocks.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Stopping Clocks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-stopping-clocks |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Authority** | Additive-DARK; `convergence.cjs` remains authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep-loop runs now have five independent, typed stop observations instead of one implicit convergence-shaped stop signal. Budget, novelty decay, path coverage, monotonic wall time, and confirmed cycles retain separate firing states and termination classes. One deterministic arbiter selects the earliest effective elapsed time, uses ledger position and the versioned rank only at ties, and records every same-boundary co-cause without suppressing another clock.

### Typed adapters and profiles

Each adapter consumes its owner's shipped output. Budget preserves the exact token, cost, iteration, or budgeted-wall-time unit and governing scope. Novelty folds semantic-community and evidence yield with integer basis points, a complete observation window, patience, and duplicate-source rejection. Coverage validates the sibling's frozen universe and zero-gap `STOP_ALLOWED` certificate without accepting aggregate scores. Cycle evidence is reminted through the sibling constructor so suspected, stale, cleared, progress-broken, or forged events cannot acquire detector authority in this leaf. Seven exact mode profiles pin every adapter, source version, evaluation boundary, deadline, and tie-rank version.

### Arbitration, persistence, and dark migration

The arbiter validates one five-clock snapshot against a shared ledger head, projection watermark, replay fingerprint, and profile. Invalid or incomplete snapshots reject admission. A valid firing produces a self-hashed `LoopTerminationDeclared` payload with the primary cause, every same-boundary co-cause, all five clock states, the complete comparator trace, final gaps and blockers, last-authorized work, and receipt-linked settle, salvage, or cancel evidence. The writer passes that payload through the authorized-ledger gateway, accepts byte-identical retries, and rejects conflicting payloads at the same terminal identity.

The shadow bridge retains the legacy convergence result by object identity and adds the stopping-clock decision beside it. No code imports or changes `convergence.cjs`; authority remains `legacy-convergence` until a later compatibility and cutover contract changes it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/stopping-clocks/stopping-clock-types.ts` | Created | Common observations, profiles, adapter inputs, arbitration results, terminal event, and in-flight evidence contracts |
| `runtime/lib/stopping-clocks/stopping-clock-profiles.ts` | Created | Exact seven-mode registry, adapter versions, source versions, deadlines, and tie-rank contract |
| `runtime/lib/stopping-clocks/stopping-clock-adapters.ts` | Created | Independent budget, novelty, coverage, wall-time, and cycle adapters |
| `runtime/lib/stopping-clocks/stopping-clock-arbiter.ts` | Created | Fail-closed snapshot validation, deterministic ordering, co-cause preservation, and terminal hashing |
| `runtime/lib/stopping-clocks/stopping-clock-events.ts` | Created | Event registry, shadow authorization policy, canonical preparation, idempotent append, and conflict rejection |
| `runtime/lib/stopping-clocks/stopping-clock-shadow.ts` | Created | Legacy-authoritative additive-dark pairing |
| `runtime/lib/stopping-clocks/index.ts` | Created | Public module surface |
| `runtime/tests/unit/stopping-clocks.vitest.ts` | Created | Per-clock, pairwise, seven-profile, replay, failure, ledger, and migration fixtures |
| `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Updated/Created | Delivered-state contract and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime landed as a new additive module and one focused test suite. Owner modules remain read-only: hierarchical budgets supply typed denials, semantic communities supply novelty projections, path coverage supplies certificates and universe validation, cycle detection supplies health events and its constructor, and the ledger/replay substrate supplies canonical hashing and authorization. The migration posture is dark by construction because every registered adapter/profile is `shadow`, the policy writer permits only legacy-authoritative or shadowing states, and the bridge returns the untouched legacy result as the authoritative value.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep five complete observations through arbitration | A winner may choose the stop class, but it cannot erase a simultaneous or independently fired clock |
| Order by elapsed time, then ledger cursor, then versioned rank | This matches the frozen arbitration contract and makes input ordering irrelevant |
| Pin source versions in each mode profile | A non-empty but unknown budget or clock version must fail closed rather than silently acquire authority |
| Validate coverage paths, not aggregate coverage numbers | Only a fresh owner certificate that closes the frozen universe may produce `converged` |
| Remint cycle health evidence through the sibling constructor | The adapter verifies owner identity and digest without implementing cycle signatures or progress detection |
| Keep wall time separate from budgeted wall time | A hard deadline and a budget denial are distinct facts even when they fire at one boundary |
| Store condition-trace hashes in the terminal event | The full runtime observations retain condition values; compact hashes preserve exact trace identity while keeping canonical bytes inside the ledger gateway's structural limit |
| Bind one terminal identity to run lineage and profile | Exact retries are idempotent; a changed cause, trace, watermark, or evidence payload becomes a conflict |
| Preserve the legacy result by identity | Dark observation must not change current convergence decisions, traces, blockers, scores, or bridge payloads |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, 1 file and 32 tests; the seven profile rows exercise 35 single-clock cases, 70 ordered-pair cases, 70 pair ties, seven all-clock ties, replay/resume, missing-clock, and mixed-watermark failures |
| Runtime TypeScript | PASS, pinned project compiler with `--noEmit`, exit 0 |
| Alignment drift | PASS, 7 runtime files scanned with zero findings, errors, warnings, or violations |
| Comment hygiene | PASS for all eight new TypeScript files |
| Packet validation | PASS, strict validation exits 0 with zero errors and zero warnings |
| Scope and frozen-authority audit | PASS, the leaf-scoped status contains only the new stopping-clock module, its unit suite, and this leaf's documentation; the frozen contract specification and legacy runtime authority have no leaf delta |

The focused suite also covers all four budget units across all four governing scopes, complete-window novelty decay, duplicate and stale novelty evidence, fresh/partial/blocked/stale/score-only coverage certificates, independent hard deadlines, confirmed/suspected/cleared/progress-broken/stale/forged cycles, termination-class preservation, co-cause retention, in-flight disposition evidence, canonical event size, authorized append, crash-before-write state, retry-after-write idempotency, conflicting payload rejection, exact mode profiles, and legacy-result identity.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow-only authority.** The module emits decisions and terminal evidence, but current loop consumers and `convergence.cjs` remain unchanged until the program cutover explicitly moves authority.
2. **Owner evidence remains the semantic boundary.** This leaf validates versions, identity, freshness, and structural consistency. It does not calculate budget availability, semantic communities, path-coverage scores, or cycle signatures.
3. **Condition values live in runtime observations.** The terminal ledger event stores each observation hash, condition-trace hash, failed-condition names, state, cause, cursor, and source IDs rather than duplicating full condition values. This keeps the authorized canonical envelope below its structural node limit while preserving replay identity.
4. **Frozen specification metadata remains read-only.** The execution contract named `spec.md` as a frozen input, so its planned-status field is intentionally unchanged; delivered state is recorded in the implementation summary, tasks, checklist, and generated graph metadata.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
