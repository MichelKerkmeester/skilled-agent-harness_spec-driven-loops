---
title: "Implementation Summary: Ranking Filter Bypass and Score Scale Fixes"
description: "Closed the side doors where trigger-promoted and rescue-injected rows skipped the ranking gates, and unified the mismatched score scales (raw BM25, rrfScore, effective-0) so a real match cannot be outranked by a rescue or surrogate row — plus fixed a circular-import TDZ in db-state that would have crashed the daemon on restart."
trigger_phrases:
  - "ranking filter bypass"
  - "score scale unification"
  - "trigger promotion gating"
  - "db-state circular import tdz"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-04T14:08:38.605Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated 007 (14 REQs) + fixed a db-state circular-import TDZ; 338 tests green"
    next_safe_action: "Phase 008 causal-graph-hygiene-and-entity-linker-noise"
    blockers: []
    key_files:
      - "mcp_server/lib/search/hybrid-search.ts"
      - "mcp_server/lib/search/pipeline/orchestrator.ts"
      - "mcp_server/core/db-state.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-007-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-008 eval-parity baseline must be captured against the live daemon; the vitest baseline runs now that the TDZ is fixed"
      - "A pre-existing db-state circular-import TDZ (daemon-crash on restart) was found and fixed while wiring the eval baseline"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-ranking-filter-bypass-and-score-scale-fixes |
| **Completed** | 2026-07-04 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Rows can no longer sneak into ranking through a side door, and scores are finally on one scale. Trigger-lane promoted rows and rescue-injected rows used to be appended after the gate battery, so a promoted or rescued row skipped the tenant/tier/context/quality checks every other row passes; both now hard-gate on scope and carry the residual soft penalties. And the mixed score scales are unified: `toHybridResult` no longer leaks raw unbounded BM25 into `score`, the degradation-widening check reads the `rrfScore` scale, multi-concept rows get a real similarity instead of effective 0, the keyword lane stops double-counting when BM25 delegates to FTS5, adaptive fusion normalizes the trigger weight through the divisor, and MPAB compresses scores above 1 instead of clamping them. The surrogate path was tightened so a below-threshold intent-adjacent overlap can no longer pin a row above a real semantic match.

### The absorbed defects and the flag root cause

The Group-A flag read now resolves per request, so flipping a search flag changes behavior without a daemon restart instead of being masked by a stale cache. The causal-boost `causalBoosted:0` symptom was traced to the injected-row contribution accounting and fixed, so a row with real causal neighbors gets a non-zero boost. The community-search fallback and contextual tree headers surface when enabled, and the `minState` inversion that let a default/empty state map above HOT priority is corrected.

### A daemon-crash regression, caught in passing

Wiring the eval baseline (REQ-008) exposed a circular-import temporal-dead-zone bug in `db-state.ts`: `graph-search-fn` registers a rebind listener at its own module top level and `db-state` imports it, so the `const` backing set was in its dead zone when that registration ran during load. Any import of `db-state` threw `Cannot access before initialization` — which means the daemon would have crashed on its next restart with a rebuilt dist. `tsc` and the unit suites missed it because it only fires at real module-load time. The fix hoists the backing store with `var` so it is reachable mid-load; db-state, eval-reporting, and their tests all load and pass now.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented the 14 REQs; GPT-5.5-fast (xhigh) passed ten and failed four (the flag per-request read, the causal-boost zero, the surrogate pinning, and the baseline — which was an error because the eval harness was TDZ-blocked). Opus 4.8 fixed the db-state TDZ that blocked the harness, then GPT-high remediated the three code gaps against the file:line evidence; Opus 4.8 final-verified and integrated. Crucially, the score-scale REQs (010-013) all passed independent verification with the reviewer checking specifically that no scale unification inverts sane ranking order — a real semantic match still outranks a rescue or keyword row.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hard-gate promoted/rescued rows, soft-penalize tier/context/quality | Scope is a boundary (a row from another tenant must never appear); tier/context/quality are ranking signals, so a penalty is truer than a hard drop |
| Force final score onto the rrfScore scale | Raw unbounded BM25 leaking into a fused score is what let a keyword row outrank a real match; one scale makes the order meaningful |
| Fix the db-state TDZ with `var` hoisting | The backing set must be reachable while the module is mid-load during a circular import; `var` hoists and initializes to undefined, `let`/`const` do not |
| REQ-008 eval baseline is captured against the live daemon | The harness needs the live index; the isolated worktree has no DB, so the eval-parity numbers are a daemon-side capture, not faked |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (integrated main) | PASS (clean) |
| 007 targeted vitest (13 files) | PASS (338/338, 1 skipped) |
| REQ-001..007, 009..013 xhigh review | PASS (10/14 first pass) |
| REQ-001, 002, 014 remediated | PASS (flag per-request, causal boost, surrogate pinning) |
| Score-scale order preserved (no inversion) | PASS (reviewer confirmed real match outranks rescue/keyword) |
| db-state circular-import TDZ | FIXED (loads clean; would have crashed the daemon on restart) |
| REQ-008 eval-parity baseline | Vitest baseline runs; eval numbers need the live daemon (daemon-side capture) |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The eval-parity numbers are a daemon-side capture.** The vitest baseline runs now that the TDZ is fixed, but the eval harness needs the live index (absent in an isolated worktree), so the before/after ranking metrics are captured when the daemon runs this code.
2. **Ranking effects need the daemon running this code.** Like the earlier phases, the gating and score-scale changes apply on the next daemon-lease restart — which now also carries the db-state crash fix.
<!-- /ANCHOR:limitations -->
