---
title: "Decision Record: Durability Stress Domain"
description: "Decision record for the four pressure-tested choices behind the durability stress domain: reuse public APIs over a daemon, assert durability invariants over raw throughput, isolate every case hermetically, and keep -32001 asserted live."
trigger_phrases:
  - "durability stress decisions"
  - "public api reuse over daemon harness"
  - "durability invariant over throughput"
  - "hermetic stress isolation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored durability stress domain (4 cases) + stress:durability script"
    next_safe_action: "None binding; durability domain green (12/12)"
    blockers: []
    key_files:
      - "mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts"
      - "mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts"
      - "mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "durability-stress-domain-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Durability Stress Domain

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse public APIs over spinning up a daemon

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The durability surfaces are reachable two ways: through their storage-layer/proxy public APIs, or through a full daemon over a socket. The substrate stress domain already owns the daemon harness (`run-substrate-stress-harness.mjs`) and pays the cost of real daemon spin-up plus live-owner lease contention. A durability domain that re-spun a daemon per case would be slow, flaky against a live operator session, and duplicative.

### Constraints

- The cases must be safe to run while a live operator daemon holds the single-writer lease.
- The checkpoint and index-scan surfaces are reachable as plain storage-layer functions; the recycle path exposes pure-logic `__testing` helpers.
- The instruction set forbids re-inventing the substrate daemon spin-up.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Drive each durability surface through its real public API against a throwaway database (`mkdtemp`/`:memory:`) or, for the recycle path, the front-proxy's exported `__testing` helpers — with no daemon spin-up.

**How it works**: The checkpoint case uses the injectable `reopen` hook to do an in-process file swap; the enrichment case calls `repairIncompleteMarkers` with the enrichment runtime mocked; the index-scan case injects a throwaway DB into `db-state.init`; the recycle case drives `createPendingRequestsTracker`/`classifyFrame` directly.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Public-API reuse (chosen)** | Fast, deterministic, hermetic; safe against a live session; no duplication | The real `reopenActiveDatabase` and a live socket recycle stay the live-verification's job | 9/10 |
| Re-run the substrate daemon harness | Exercises the real socket end to end | Slow; contends with the live owner lease; duplicates existing coverage; forbidden by the instructions | 2/10 |

**Why this one**: The public APIs are the exact code paths the durability fixes touch, and exercising them against throwaway DBs is both faithful and hermetic, while the daemon harness already exists for end-to-end socket coverage.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The whole domain runs in a few seconds with no daemon startup and is safe to run during a live operator session.
- No duplication of the substrate daemon harness.

**What it costs**:
- The real `reopenActiveDatabase` coordinator and a true socket recycle are not exercised here. Mitigation: those remain covered by the live verification and the substrate domain.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The in-process swap diverges from the real coordinator | M | Reuse the exact `flatReopen` pattern the v2 restore unit tests use |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The durability surfaces have no load coverage today. |
| 2 | **Beyond Local Maxima?** | PASS | Daemon-harness reuse considered and rejected. |
| 3 | **Sufficient?** | PASS | The public APIs are the exact paths the fixes touch. |
| 4 | **Fits Goal?** | PASS | Delivers contention/flood/burst/recycle coverage. |
| 5 | **Open Horizons?** | PASS | A soak variant can raise the counts behind an env flag. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Four new test files under `mcp_server/stress_test/durability/` plus a README.
- One `stress:durability` script in `mcp_server/package.json`.

**How to roll back**: Remove the directory and the script line; the change is purely additive.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Assert durability invariants over raw throughput

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

A stress test can assert two kinds of thing: a raw performance number (X ops/sec) or a durability invariant (memory stays lossless, the backlog drains, exactly one writer wins). Raw numbers are machine-dependent and flaky in CI; invariants are deterministic and catch the actual failure modes these surfaces were built to prevent.

### Constraints

- The gate must be stable across developer machines and CI.
- The checkpoint-v2 restore intentionally merges the snapshot's catalog rows back in, so the catalog row count is NOT a bounded invariant — the on-disk snapshot set is.

### Decision

**We chose**: Assert durability invariants — lossless round-trips with no orphan dirs, a bounded-and-draining marker backlog, single-writer admission with clean back-off, transparent recycle replay — rather than throughput numbers.

**How it works**: Each case applies a load pattern and asserts the surface's correctness property holds under that load, with bounded, deterministic counts.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Invariant assertions (chosen)** | Deterministic; catches real failure modes; stable in CI | Does not produce a throughput benchmark | 9/10 |
| Raw throughput thresholds | Surfaces perf regressions | Machine-dependent; flaky; misses correctness-under-load | 3/10 |

**Why this one**: The failure modes these surfaces prevent (lossy restore, leaked snapshot dirs, an E429 storm, a wedged writer, a dropped in-flight read) are correctness invariants, not throughput numbers.

### Consequences

**What improves**:
- The gate is deterministic and stable, asserting exactly the properties the durability fixes guarantee.

**What it costs**:
- No throughput regression signal. Mitigation: a future perf benchmark can live in a separate domain if needed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Asserting a false invariant (e.g. catalog bounded post-restore) | M | Trace each invariant to source; assert on-disk snapshot set, not catalog count |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The real risks are correctness-under-load, not raw speed. |
| 2 | **Beyond Local Maxima?** | PASS | Throughput thresholds considered and rejected. |
| 3 | **Sufficient?** | PASS | Invariants cover the documented failure modes. |
| 4 | **Fits Goal?** | PASS | Delivers a stable durability gate. |
| 5 | **Open Horizons?** | PASS | A perf domain can be added separately later. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: Each case asserts a durability property with bounded counts; the checkpoint case asserts the on-disk snapshot set is bounded by `MAX_CHECKPOINTS` rather than the (intentionally merged) catalog row count.

**How to roll back**: Not applicable independently of ADR-001.

---

## ADR-003: Isolate every case hermetically

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

A durability stress test that touched the production DB at `~/.mk-spec-memory` or the live `daemon-ipc` socket could corrupt an operator's real memory store or contend with a live session. The substrate harness already deals with live-owner contention; the durability domain must avoid the production store entirely.

### Constraints

- No case may read or write the production database or connect to the live socket.
- The index-scan lease primitives read a process-wide module-global DB handle in `db-state`.

### Decision

**We chose**: Per-test `mkdtemp`/`:memory:` databases for the storage cases, a throwaway DB injected into `db-state.init` for the lease case, and pure-logic proxy helpers (no socket) for the recycle case — with `afterEach` teardown.

**How it works**: Each case constructs its own SQLite handle, drives the load, asserts the invariant, and removes the temp tree. The recycle case opens no socket and spawns no daemon.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hermetic throwaway DBs (chosen)** | Safe against a live session; deterministic; no contention | The lease case must inject a DB into a process-wide module | 9/10 |
| Run against a shared scratch copy of the production DB | Closer to real data shape | Risk of touching the real store; non-deterministic | 2/10 |

**Why this one**: A stress gate must be safe to run anytime, including during a live operator session, which only full isolation guarantees.

### Consequences

**What improves**:
- The domain is safe to run against a live operator session and produces deterministic results.

**What it costs**:
- The lease case couples to the process-wide `db-state` module. Mitigation: inject a throwaway handle per test and rely on per-test setup.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A case leaks state into the production store | H | mkdtemp/:memory: only; no production path is ever constructed |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A live operator store must never be touched. |
| 2 | **Beyond Local Maxima?** | PASS | Shared-scratch-copy considered and rejected. |
| 3 | **Sufficient?** | PASS | Throwaway DBs fully isolate every case. |
| 4 | **Fits Goal?** | PASS | Makes the gate safe to run anytime. |
| 5 | **Open Horizons?** | PASS | Same isolation pattern extends to future cases. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: Each case uses `mkdtemp`/`:memory:` and tears down in `afterEach`; the index-scan case injects a minimal `VectorIndexLike` whose `getDb()` returns the throwaway handle.

**How to roll back**: Not applicable independently of ADR-001.

---

## ADR-004: Keep -32001 asserted live across the recycle path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

A tempting but wrong claim is that `-32001` was removed when the index vector-drain outage path stopped surfacing its own `-32001` class. In fact `-32001` is still LIVE as the launcher `RETRYABLE_RECYCLE_ERROR` (the retryable recycle signal the front-proxy returns for in-flight unsafe mutations during a daemon recycle), while `-32002` is the terminal `PROTOCOL_MISMATCH_ERROR`. The recycle stress case must assert this precisely.

### Constraints

- The recycle constants are module-private (not exported), so the test cannot import them directly.
- The test must not modify the proxy module (outside the allowed write paths).

### Decision

**We chose**: Assert the live codes by reading them from the proxy source text (`-32001` for `RETRYABLE_RECYCLE_ERROR`, `-32002` for `PROTOCOL_MISMATCH_ERROR`) and exercise the replay partition through the exported `__testing` helpers.

**How it works**: A regex over the proxy source pins the two codes; the replay model (faithful to `replaySnapshot`) proves replayable reads survive and unsafe mutations are refused with the retryable signal.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Assert codes from source + drive `__testing` (chosen)** | Proves `-32001` stays live without editing the proxy | Reads source text rather than an exported constant | 8/10 |
| Export the constants from the proxy and import them | Cleaner assertion | Edits a file outside the allowed write paths | 2/10 |

**Why this one**: The guardrail requires proving `-32001` stays live, and the allowed write paths forbid touching the proxy, so reading the source is the faithful, in-scope way to pin the codes.

### Consequences

**What improves**: The domain precisely documents and guards the live `-32001`/`-32002` recycle semantics.

**What it costs**: The source-text assertion is mildly coupled to the constant's declaration shape. Mitigation: the regex matches the stable `Object.freeze({ code: ... })` form.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Falsely claiming `-32001` was removed | H | The test asserts `-32001` is the live retryable recycle code; never claims removal |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The guardrail requires proving `-32001` stays live. |
| 2 | **Beyond Local Maxima?** | PASS | Exporting the constants considered and rejected (out of write scope). |
| 3 | **Sufficient?** | PASS | Source-pin plus replay partition cover the semantics. |
| 4 | **Fits Goal?** | PASS | Documents and guards the recycle contract. |
| 5 | **Open Horizons?** | PASS | If the constants are exported later, the test can switch to importing them. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `daemon-recycle-transparency-stress.vitest.ts` reads the two codes from the proxy source and asserts `-32001` live / `-32002` terminal, then drives the replay partition through `__testing`.

**How to roll back**: Not applicable independently of ADR-001.

---

<!--
Level 3 Decision Record: four ADRs, one per pressure-tested decision behind the durability stress domain.
Human voice: active, direct, specific. HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
