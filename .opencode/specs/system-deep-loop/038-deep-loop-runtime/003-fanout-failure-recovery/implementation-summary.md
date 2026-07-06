---
title: "Implementation Summary: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)"
description: "Implementation summary for the deep-loop resilience GO cluster (C1-C5): bounded failure-class taxonomy, transient/fatal retry with durable budget, orphan-lineage marker and explicit recover-vs-fresh resume gate."
trigger_phrases:
  - "fanout failure recovery summary"
  - "deep loop resilience implementation"
  - "transient fatal retry status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/003-fanout-failure-recovery"
    last_updated_at: "2026-07-06T16:24:27.369Z"
    last_updated_by: "codex"
    recent_action: "Implemented C1-C5 fan-out failure recovery with deterministic unit coverage"
    next_safe_action: "Run strict spec validation and report final verification delta"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "C4 implemented detect + marker, auto-redispatch remains lease/heartbeat-gated."
      - "C5 uses explicit --require-existing-state / requireExistingState mode."
      - "fanout maxRetries defaults to 5 and remains config-overridable, direct pool callers stay no-retry unless opted in."
---
# Implementation Summary: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-deep-loop/038-deep-loop-runtime/003-fanout-failure-recovery` |
| **Status** | complete |
| **Completed** | 2026-06-19 |
| **Level** | 2 |
| **Actual Effort** | C1-C5 implemented surgically across fan-out pool/run, CLI guards, fan-out config, reducer gate and tests |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the Level 2 deep-loop **resilience GO cluster**. The change keeps the runtime fire-and-exit shape and adds only bounded, deterministic recovery behavior:

| # | Candidate | What was built | Status |
|---|-----------|-----------------|--------|
| C1 | DL-failure-class-taxonomy | `settleItem` preserves `error:{name,message}` and adds bounded `failure_class`, `buildPoolSummary` emits fixed `failure_classes` rollup | DONE |
| C2 | Q3-fanout-recovery | `classifyLineageFailure` derives transient/fatal verdicts from `timedOut`, `exitCode` and `salvage` only, unknown/default exit remains fatal | DONE |
| C3 | Q3-fanout-transient-fatal-retry | `runCappedPool` requeues only the failed transient lineage, honors `maxRetries`, reads prior retry count from `orchestration-status.log` and preserves final summary counts | DONE |
| C4 | DL-orphan-lineage-reset | status-ledger scan detects started-without-terminal lineages and appends `orphan_requeued` markers, auto-redispatch remains lease/heartbeat-gated | DONE |
| C5 | DL-recover-vs-fresh-gate | `reduce-state.cjs` supports explicit `--require-existing-state` / `requireExistingState` mode and refuses missing, empty or corrupt state logs distinctly from fresh starts | DONE |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | failure-class rollup, retry queue, durable retry count reader, orphan marker helpers |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | passes fan-out retry budget, reads ledger retry counts, marks orphaned lineages, carries orphan summary |
| `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | Modified | bounded failure classifier and transient/fatal verdict helper |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | `fanout.maxRetries` schema default 5, config-overridable |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modified | explicit validate-existing-state resume gate |
| `.opencode/skills/deep-loop-runtime/tests/unit/*.vitest.ts` | Modified / Added | deterministic unit and integration-style coverage for all candidates |
| `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Updated | candidate status and verification evidence |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the planned C1 -> C2 -> C3 dependency chain, then added the independent C4/C5 resume guards. The pool changed from a one-way dispatch index to an ordered queue so a failed transient lineage can be requeued without redispatching siblings. Retry counts come from durable `retry_scheduled` ledger rows, and direct pool callers remain no-retry unless they pass `maxRetries`. The reducer gate uses an explicit mode flag so normal fresh initialization is byte-compatible at the behavior level.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| All 5 candidates implemented in this sub-phase | The prerequisite fan-out infrastructure was present, this phase added the still-missing recovery behavior |
| D2/D3/Q2 (reliability-weighted learning) explicitly OUT OF SCOPE | D2 is a wholly-absent net-new build (every input `r=0.5`), NO-GO until built AND benchmarked [iter-13] |
| C4 scoped to detect + marker (GO), auto-redispatch deferred | auto-redispatch without a lease/heartbeat risks re-running live work |
| Default-conservative classification (unknown → fatal) | a misclassification must not cause a runaway retry loop (NFR-R02) |
| Explicit recover-vs-fresh flag | inferring from config/state presence risks refusing legitimate fresh starts, explicit mode is safer and testable |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Baseline typecheck | Pass | canonical OpenCode TypeScript gate | `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server` before edits: 0 errors |
| Baseline fanout suite | Pass | fanout-related runtime tests | `npm test -- tests/unit/executor-config.vitest.ts tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/fanout-salvage.vitest.ts tests/unit/fanout-merge.vitest.ts`: 5 files / 96 tests |
| Syntax checks | Pass | touched `.cjs` files | `node --check` on `fanout-pool.cjs`, `fanout-run.cjs`, `cli-guards.cjs` and `reduce-state.cjs` |
| Focused implementation tests | Pass | C1-C5 | `npm test -- tests/unit/executor-config.vitest.ts tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/fanout-salvage.vitest.ts tests/unit/fanout-merge.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts`: 6 files / 110 tests |
| Canonical typecheck | Pass | post-implementation | `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server`: 0 errors |
| Broad related Vitest | Pass | full deep-loop-runtime suite through system-spec-kit config | `npx vitest run ../../deep-loop-runtime/tests --reporter=default`: 49 files / 403 tests |
| Comment hygiene | Pass | touched production and test code | `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` on all touched code/test files |
| Strict validation | Pass | this sub-phase spec-doc set | `validate.sh --strict`: 0 errors / 0 warnings |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Fan-out pool/run | Unit + stub CLI | Retry, summary counts, fatal/no-retry, salvage-miss retry | Deterministic temp dirs only |
| Reducer gate | Unit | missing/empty/corrupt refusal + fresh path unaffected | No live state or DB |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Durable retry budget survives crash-replay | Attempt count read from ledger/audit | PASS |
| NFR-R02 | Unknown failure → fatal (no retry loop) | Default-conservative classifier | PASS |
| NFR-C01 | `error:{name,message}` shape preserved | Failure-class is additive | PASS |
| NFR-C02 | No schema migration / no daemon | Runtime stays fire-and-exit batch | PASS |
| NFR-O01 | Low-cardinality failure-class rollup | Fixed `{timeout, exit, salvage_miss}` label set | PASS |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No measured benefit number.** No candidate has a before/after benchmark delta, this phase shipped correctness and reversibility only.
2. **C4 auto-redispatch remains lease/heartbeat-gated.** The implemented GO scope is detect + marker (`orphan_requeued`) only.
3. **Reliability-weighted learning remains out of scope.** No D2/D3/Q2 reliability signal was introduced or consumed.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| One commit per candidate | Shipped together in commit `c1f2466811` | The 028 build batched this phase (fanout-pool + fanout-run + cli-guards) into one commit |
| External adversarial review seat | Skipped | User constrained this run to code + unit tests, local adversarial tests cover retry-success, retry-exhaustion, fatal no-retry, durable budget, salvage-miss retry and all-fatal behavior |

<!-- /ANCHOR:deviations -->
