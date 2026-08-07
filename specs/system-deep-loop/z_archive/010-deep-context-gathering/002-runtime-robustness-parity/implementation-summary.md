---
title: "Implementation Summary"
description: "deep-context reaches runtime-robustness parity: five deep-loop-runtime durability and validation features are wired into the host-driven loop and gated to loop_type='context' — atomic-state, jsonl-repair, post-dispatch-validate, loop-lock, and the executor-audit recursion guard — reusing the runtime helpers in-process with inline fallbacks."
trigger_phrases:
  - "runtime parity implementation"
  - "atomic state summary"
  - "loop lock summary"
  - "implementation"
  - "summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/002-runtime-robustness-parity"
    last_updated_at: "2026-06-06T23:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wired 5 robustness features into the host-driven context loop; verified"
    next_safe_action: "Operator: exercise the 5 robustness features in a live context loop run"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-context/scripts/loop-lock.cjs"
      - ".opencode/commands/deep/assets/deep_start-context-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:2b71f0c4a9d35ee2c6184f93a17d4cb5e820a6713fd9c2ee4407b51a9c6d3e72"
      session_id: "dc-134-002-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All five robustness features wired, gated to loop_type='context', and verified"
      - "bayesian-scorer and fanout-run excluded as non-gaps with rationale"
      - "node --check green on both scripts; fixture smoke run + loop-lock cycle green"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-runtime-robustness-parity |
| **Status** | Complete |
| **Completed** | 2026-06-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

deep-context now carries the same durability and validation guarantees that `deep-research` and `deep-review` get from the shared `deep-loop-runtime`. Phase 001 shipped the loop as a host-driven consumer but skipped the runtime's robustness layer; this phase wires five of those features into the host-driven loop, every one gated to `loop_type='context'` so research and review behavior is untouched. Two further runtime features were evaluated and deliberately excluded as non-gaps.

### Crash-safe atomic state writes

`reduce-state.cjs` no longer risks a half-written report. It writes the findings registry through the runtime `writeStateAtomic` helper and writes the dashboard through an atomic temp-plus-fsync-plus-rename text write. A reader always sees either the previous complete file or the new one, and the fixture smoke run confirmed no `.tmp` file is left behind.

### Corrupt-tail JSONL recovery before read

Before the reducer reads the state log, it calls the runtime `repairJsonlTail` on `deep-context-state.jsonl`. That recovers a crash-corrupted trailing line by truncating anything after the last valid record, and the reducer surfaces the outcome as `registry.stateLogRepair` with `{repaired, droppedBytes}` so the repair is visible rather than silent.

### Seat-output validation before merge

Each seat finding now passes through `validateSeatFinding`, which checks that the finding has a known kind, a path or a symbol, and a numeric relevance before it can be merged. Invalid findings are collected into `registry.seatValidationWarnings` and never silently merged, so a malformed seat output cannot corrupt the registry the next planning run reads.

### Single-writer loop locking

A new `loop-lock.cjs` wraps the runtime `acquireLoopLock`/`refreshLoopLock`/`releaseLoopLock` helpers, giving the host-driven loop the same single-writer advisory lock with stale-lock reclaim the mature loops use. The auto and confirm workflow YAMLs now acquire the lock at `step_acquire_lock` and release it at `step_release_lock` and on every halt or cancel path. Because a host-driven loop is not one long-lived process, the lock owner id is host-provided and reused across the acquire and release calls.

### CLI-dispatch recursion guard

The workflow `cli_contract` now spawns each CLI seat with the runtime executor-audit dispatch env, appending this loop's kind to `SPECKIT_CLI_DISPATCH_STACK` via `buildExecutorDispatchEnv`. A CLI seat therefore cannot recursively launch another deep-context loop, and seat provenance is recorded per the runtime executor-audit contract.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both deep-context `.cjs` scripts import the runtime TypeScript helpers in-process via the tsx CJS register that ships with `system-spec-kit`, with contract-equivalent inline fallbacks, so no runtime file was modified and the scripts stay dual-use. `reduce-state.cjs` memoizes the helper load through `loadStateSafety()` and records which path ran via `stateSafety.source`; `loop-lock.cjs` loads the loop-lock trio the same way. Every wired feature dispatches on `loop_type='context'`, which is what keeps research and review inert.

Two runtime features were assessed and excluded. `bayesian-scorer` stays unwired because neither research nor review uses it, so adopting it would exceed parity rather than reach it. The disjoint-slice `fanout-run`/`fanout-pool`/`fanout-salvage` mode stays unused because deep-context dispatches a heterogeneous pool over a single shared scope by-model by design, which is not the disjoint-slice lineage pattern `fanout-run` serves. Both exclusions are recorded in the decision record so the absence is intentional and auditable.

Verification ran statically and dynamically. `node --check` passes both `reduce-state.cjs` and `loop-lock.cjs`. A fixture smoke run of the reducer reported `stateSafety: "runtime"`, `stateLogRepaired: true`, and `seatValidationWarnings: 1`, with no `.tmp` leftover beside the registry or dashboard. The `loop-lock.cjs` acquire, refresh, and release cycle completed cleanly against a lock file.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Import the runtime helpers in-process via the tsx CJS register, with inline fallbacks | Reuses the trusted runtime contracts unmodified, avoids a per-call TS re-exec, and degrades gracefully when the toolchain is absent |
| Gate every feature on `loop_type='context'` | Keeps research and review behavior unchanged while deep-context gains the robustness layer |
| Make the loop-lock owner id host-provided and reused across acquire/release | A host-driven loop is not one long-lived process, so the owner-scoped runtime release needs a stable shared owner id to match the holder |
| Exclude `bayesian-scorer` as a non-gap | Neither research nor review uses it; wiring it would exceed parity, not reach it |
| Exclude the disjoint-slice `fanout-run` mode as a non-gap | deep-context uses by-model shared-scope council dispatch by design, not disjoint-slice lineages |
| Surface `stateLogRepair`, `seatValidationWarnings`, and `stateSafety` in the registry | Makes the repair, validation, and active-write-path observable instead of silent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on reduce-state.cjs | PASS, green |
| `node --check` on loop-lock.cjs | PASS, green |
| Fixture smoke run: `stateSafety` | PASS, reported `runtime` |
| Fixture smoke run: `stateLogRepaired` | PASS, reported `true` |
| Fixture smoke run: `seatValidationWarnings` | PASS, reported `1` |
| Atomic write leaves no `.tmp` leftover | PASS, confirmed beside registry + dashboard |
| loop-lock acquire/refresh/release cycle | PASS, completed cleanly |
| Research/review unaffected (gated on `loop_type='context'`) | PASS, no runtime file modified |
| `validate.sh --strict` doc reconcile | PASS (0 errors, 0 warnings; 2026-06-06) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live end-to-end loop run yet.** The features are verified by `node --check`, a fixture smoke run of the reducer, and the loop-lock cycle, but they have not yet been exercised inside a full live `/deep:start-context-loop` invocation. That is the remaining operator step.
2. **macOS/BSD file locking is advisory.** Single-writer enforcement relies on stale-lock reclaim plus a stable host-provided owner id rather than a mandatory OS lock; stale-lock override is confirm-only or explicit recovery-only.
3. **The inline fallback path is contract-equivalent, not identical.** When the tsx register or a runtime helper is unavailable, `reduce-state.cjs` runs minimal inline mirrors of `writeStateAtomic`/`repairJsonlTail` and reports `stateSafety.source: "inline"`; the fixture smoke run exercised the `runtime` path.
4. **bayesian-scorer and fanout-run remain unused by design.** They are documented non-gaps, not pending work; a future need for score-based demotion or by-slice fan-out would revisit decision-record ADR-002 and the convergence model.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
