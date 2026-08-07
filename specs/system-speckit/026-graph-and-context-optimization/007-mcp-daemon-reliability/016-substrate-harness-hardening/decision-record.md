---
title: "Decision Record: Substrate stress-harness hardening [template:level_3/decision-record.md]"
description: "ADRs for process-start-time identity, run-id TSV with EPERM fallback, and maintainer-mode INDEX-scan suppression."
trigger_phrases:
  - "substrate harness adr"
  - "pid start time identity"
  - "maintainer mode suppression"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/016-substrate-harness-hardening"
    last_updated_at: "2026-05-31T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored three ADRs (Accepted)"
    next_safe_action: "None — decisions accepted and implemented"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-038"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Substrate stress-harness hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Close PID-recycling false-SKIP via process-start-time identity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Maintainer, the deep-research validation in `research/` |

---

<!-- ANCHOR:adr-001-context -->
### Context

`liveOwnerForService` treats any live PID in a daemon lease as the owner and reclassifies a connect failure to SKIP. After a hard crash that leaves the lease behind, the OS can recycle the crashed daemon's PID onto an unrelated live process — masking a genuine crash as SKIP and bypassing the 410 false-green guard.

### Constraints
- Must work for both daemons; must not regress the live-owner case; must fail closed; cross-platform.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

A lease PID is accepted as owner only if it is alive AND its real start time matches the lease's recorded start time within 2s. `processStartedAt(pid)` uses `ps -o lstart=`; on unreadable start time, fall back to liveness-only (no regression).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Start-time identity (chosen)** | Works for both daemons; refutes recycled PID; cheap | `ps` parsing surface | 9/10 |
| Heartbeat-TTL only | Reuses launcher classifier | Only code-graph lease has heartbeat | 6/10 |
| Accept-risk (no code) | Zero effort | Leaves the one real hole open | 3/10 |

**Why Chosen**: Start-time comparison positively identifies the same process for both daemons, on the already-failing path only.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**: recycled PID can no longer mask a crash as SKIP; the 410 guard's last bypass is closed.

**Negative**: one `ps` read on the failure path (negligible); clock skew could in theory false-reject — mitigated by ≤2s tolerance + liveness-only fallback.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| `ps -o lstart` format variance | M | Defensive parse; null on failure |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F-005 is a real (if narrow) crash-masking hole |
| 2 | **Beyond Local Maxima?** | PASS | Heartbeat-only and accept-risk evaluated and rejected |
| 3 | **Sufficient?** | PASS | Start-time match is the minimal positive-identity signal |
| 4 | **Fits Goal?** | PASS | Directly serves trustworthy crash detection |
| 5 | **Open Horizons?** | PASS | Reuses the launcher's existing probe pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `run-substrate-stress-harness.mjs`: new `processStartedAt`, `leaseOwnerMatch`; `liveOwnerForService` gates on identity.

**How to roll back**: remove the `leaseOwnerMatch` start-time branch (revert to liveness-only); no external state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Run-id-stamped TSV with non-clobbering EPERM fallback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Maintainer, the deep-research validation in `research/` |

---

<!-- ANCHOR:adr-002-context -->
### Context

`writeSummary` silently preserves the existing TSV on EPERM lock. If that file is from a prior run, an analyst reads stale pids with no signal that the current run's evidence was dropped.

### Constraints
- Never lose current evidence; keep the canonical TSV path stable; make stale data detectable.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

Stamp each run's TSV with a trailing `run_id` column, and on EPERM write current rows to `${SUMMARY_TSV}.${runId}.tsv` instead of keeping the stale file.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Run-id sidecar (chosen)** | Never loses evidence; stale detectable; canonical path stable | One extra file when locked | 9/10 |
| Throw on EPERM | Loud | Aborts run; loses partial evidence | 5/10 |
| Overwrite-force | Always writes | Could corrupt another writer | 3/10 |

**Why Chosen**: Preserves current evidence and surfaces staleness without fighting another writer.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**: current-run evidence always persisted; run-id identifies the producing run.

**Negative**: possible sidecar files on lock contention — timestamped suffix; operator cleans up.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Sidecar clutter | L | Run-id suffix; documented as expected on lock |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Stale-pid hazard confirmed in this packet's `research/` |
| 2 | **Beyond Local Maxima?** | PASS | Throw and overwrite-force rejected |
| 3 | **Sufficient?** | PASS | Run-id + sidecar covers the failure mode |
| 4 | **Fits Goal?** | PASS | Serves non-misleading evidence |
| 5 | **Open Horizons?** | PASS | Backward-compatible TSV column |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `run-substrate-stress-harness.mjs`: `RUN_ID`, `renderSummaryTsv`, `summarySidecarPath`, refactored `writeSummary`.

**How to roll back**: restore the bare `return` in the EPERM branch and drop the run-id column.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Suppress maintainer-mode INDEX scan in the harness child env

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Maintainer, the deep-research validation in `research/` |

---

<!-- ANCHOR:adr-003-context -->
### Context

`.env.local` sets `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true`. In a clean env the harness-spawned code-index child reaches a forced INDEX scan that rewrites `graph-metadata.json` tree-wide. skip-not-fail is orthogonal and only hides this in interactive sessions.

### Constraints
- No edits to `.env.local` or the launchers; must reliably override `.env.local`; must not change tolerated scenario outcomes.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

The harness sets `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=false` and the five `INDEX_*=false` in the code-index child env. The launcher's `loadEnvFile` is set-if-absent (`mk-code-index-launcher.cjs:52`), so the explicit value wins.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit child-env flags (chosen)** | Minimal, reliable, no launcher edits | empty-graph SKIP (already tolerated) | 9/10 |
| Temp `SPECKIT_CODE_GRAPH_DB_DIR` isolation | Fully hermetic DB | More moving parts; within-root constraint | 7/10 (deferred) |
| Edit `.env.local` | Global | Affects the operator's real daemon | 2/10 |

**Why Chosen**: Smallest reliable change; provably effective given set-if-absent semantics.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**: a clean-env / CI harness run can no longer trigger tree-wide graph-metadata writes.

**Negative**: code-graph scenarios SKIP on an empty graph — already tolerated by the validated guard.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Future launcher override-semantics change | M | env-suppression test asserts the child-env contract |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Clean-env tree-write is a real CI hazard |
| 2 | **Beyond Local Maxima?** | PASS | Temp-DB-dir and .env.local edits evaluated |
| 3 | **Sufficient?** | PASS | Suppression flags stop the forced scan |
| 4 | **Fits Goal?** | PASS | Serves hermetic clean-env runs |
| 5 | **Open Horizons?** | PASS | Temp-DB-dir lever recorded for future |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `run-substrate-stress-harness.mjs`: `CODE_INDEX_INDEX_SUPPRESSION` spread into the code-index `buildDaemonEnv` extras.

**How to roll back**: remove the suppression spread from the child-env extras.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
