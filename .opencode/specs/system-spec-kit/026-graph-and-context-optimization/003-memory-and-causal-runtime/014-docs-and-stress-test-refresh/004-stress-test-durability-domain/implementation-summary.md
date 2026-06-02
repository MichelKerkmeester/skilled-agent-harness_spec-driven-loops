---
title: "Implementation Summary"
description: "The durability stress domain is shipped and green. Four cases under mcp_server/stress_test/durability load/soak/concurrency-test the 013 durability surfaces (checkpoint-v2, schema-v30 enrichment markers, the index_scan lease, and the front-proxy recycle path) against throwaway isolated databases, plus a stress:durability npm script. npm run stress:durability passes 12/12 and runs green alongside an existing domain (no config breakage)."
trigger_phrases:
  - "durability stress implementation summary"
  - "durability stress domain status"
  - "stress durability evidence"
  - "checkpoint contention stress result"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain"
    last_updated_at: "2026-06-02T11:22:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Durability stress domain shipped; npm run stress:durability green 12/12"
    next_safe_action: "None binding; durability domain complete and isolated"
    blockers: []
    key_files:
      - "mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts"
      - "mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts"
      - "mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts"
      - "mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "durability-stress-domain-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 004-stress-test-durability-domain |
| **Completed** | 2026-06-02 — shipped and green (12/12) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new `mcp_server/stress_test/durability/` domain with four load/soak/concurrency cases over the 013 durability surfaces, plus a `stress:durability` npm script that runs through the unchanged `vitest.stress.config.ts`. No production runtime code was touched — the domain adds tests and one script only, and every case is hermetically isolated.

### Cases

| Case | Surface | Load pattern | Durability invariant asserted |
|------|---------|--------------|-------------------------------|
| `checkpoint-v2-contention-stress.vitest.ts` | `lib/storage/checkpoints.ts` | 40 interleaved create+restore round-trips against one `mkdtemp` DB (in-process `reopen`) | Memory returns to a fixed baseline every cycle; no orphaned snapshot/`.tmp-` dirs; on-disk snapshot set bounded by `MAX_CHECKPOINTS`; `E_RESTORE_IN_PROGRESS` barrier observable during the swap and cleared after |
| `enrichment-marker-backfill-stress.vitest.ts` | `handlers/save/enrichment-state.ts` (schema-v30 markers) | 300-row `pending` marker flood drained via repeated bounded `repairIncompleteMarkers` passes (`:memory:` DB) | Markers converge to `complete`; incomplete (partial-index-eligible) set drains to zero; each row repaired once; per-pass work bounded by the limit |
| `index-scan-coalescing-stress.vitest.ts` | `core/db-state.ts` lease primitives | 64-wide concurrent `acquireIndexScanLease` burst (throwaway DB injected via `db-state.init`) | Exactly one writer admitted; the rest back off with a structured `lease_active`/`cooldown` reason; cooldown coalesces immediate re-acquisitions; an expired lease is reclaimable |
| `daemon-recycle-transparency-stress.vitest.ts` | `.opencode/bin/lib/launcher-session-proxy.cjs` `__testing` | 200 in-flight requests across a simulated backend RSS-recycle (pure logic, no socket) | Replayable reads survive the recycle; unsafe mutations refused with the retryable `-32001` signal; pending set drains with no leak; `-32002` terminal |

### Accuracy notes (guardrails honored)

- **`-32001` is asserted LIVE**, not removed. The recycle case pins `-32001` as the launcher `RETRYABLE_RECYCLE_ERROR` (the retryable recycle signal) and `-32002` as the terminal `PROTOCOL_MISMATCH_ERROR`, reading both from the proxy source because the constants are module-private.
- **No count drift**: the README "36-tool" count and `SCHEMA_VERSION` were not altered. The packet adds behaviors (coverage), not number bumps.
- **True invariants only**: a v2 restore intentionally merges the snapshot's catalog rows back in, so the bounded property asserted is the on-disk snapshot directory set (`MAX_CHECKPOINTS`), not the catalog row count.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored directly as additive tests plus one script (no per-phase CLI executor dispatch was needed, since there is no production runtime code to change and the four cases are independent). Each case reuses the real public API of its durability surface against a throwaway database or the proxy's pure-logic helpers — never the production DB at `~/.mk-spec-memory` and never the live `daemon-ipc` socket. The orchestrator owns all git writes.

The proof is the real stress run plus a mixed-domain run proving the shared config still works:

```
$ cd .opencode/skills/system-spec-kit/mcp_server && npm run stress:durability
 RUN  v4.1.6
 Test Files  4 passed (4)
      Tests  12 passed (12)
   Duration  ~2.9s

$ npx vitest run --config vitest.stress.config.ts \
    stress_test/durability \
    stress_test/substrate/query-expansion-bound-stress.vitest.ts \
    stress_test/substrate/v-rule-save-flood-stress.vitest.ts \
    stress_test/substrate/substrate-harness-hardening.vitest.ts
 Test Files  7 passed (7)
      Tests  31 passed (31)
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse public APIs over spinning up a daemon | The public APIs are the exact paths the durability fixes touch; the substrate domain already owns daemon-harness coverage, and re-inventing it would be slow and contend with a live owner. |
| Assert durability invariants over raw throughput | The real risks are correctness-under-load (lossy restore, leaked dirs, an E429 storm, a wedged writer, a dropped read), which are deterministic invariants — not machine-dependent throughput numbers. |
| Isolate every case hermetically | A stress gate must be safe to run anytime, including during a live operator session; only `mkdtemp`/`:memory:`/pure-logic isolation guarantees the production store is never touched. |
| Keep `-32001` asserted live | `-32001` is still the launcher `RETRYABLE_RECYCLE_ERROR`; the case proves it stays live (read from source, since the constant is module-private) and never claims removal. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS |
| `npm run stress:durability` | PASS — 12/12 (4 files), ~2.9s |
| Durability + an existing pure-logic domain through the shared config | PASS — 31/31 (7 files), no config breakage |
| Checkpoint contention: lossless round-trips, no orphan/`.tmp-` dirs, bounded on-disk snapshot set, barrier observable | PASS |
| Enrichment backfill: 300 `pending` markers drained to `complete`, incomplete set reached zero, each repaired once | PASS |
| index-scan coalescing: exactly one writer admitted under a 64-wide burst; clean `lease_active`/`cooldown` back-off; cooldown + stale-lease reclaim | PASS |
| Daemon-recycle transparency: reads replay, mutations refused with `-32001`, pending drains, `-32002` terminal | PASS |
| Isolation: no case touches `~/.mk-spec-memory` or the live socket (mkdtemp/`:memory:`/pure-logic) | PASS |
| Isolated typecheck of the four stress files (`tsc --noEmit`) | PASS — 0 errors (stress files are excluded from the project tsconfig, consistent with existing substrate stress files) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Real coordinator not exercised here.** The contention case uses an in-process `flatReopen` file swap (the pattern the v2 restore unit tests use), not the real `reopenActiveDatabase` coordinator; the real coordinator and a true socket recycle stay covered by the live verification and the substrate domain. Non-blocking.
2. **No throughput benchmark.** The domain asserts durability invariants, not ops/sec; a perf-regression signal would need a separate benchmark domain. Documented in decision-record.md (ADR-002).
3. **Soak counts are fixed.** The load counts (40 round-trips, 300-row flood, 64-wide burst, 200 in-flight) are bounded constants. An opt-in env-gated soak variant with larger counts for nightly runs remains an open question (see spec.md Open Questions). Non-blocking.
4. **Recycle codes read from source.** The `-32001`/`-32002` assertion reads the proxy source text because the constants are module-private and the proxy is outside the allowed write paths; if the constants are exported later, the test can switch to importing them. Non-blocking.
<!-- /ANCHOR:limitations -->
