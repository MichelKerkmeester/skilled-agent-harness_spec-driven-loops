---
title: "Decision Record: Rerank-Sidecar Reaper Investigation and Architecture"
description: "Proposed ADRs for the three-layer rerank_sidecar reaper, identity-verified owner liveness, ledger schema, defaults, parity tests, telemetry, and in-flight gating."
trigger_phrases:
  - "arc 010 004 001 decision record"
  - "rerank sidecar reaper ADRs"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-7-proposed-reaper-adrs"
    next_safe_action: "implementation packet 010/005 should ratify or supersede these Proposed ADRs"
    blockers: []
    key_files:
      - "decision-record.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0100040010100040010100040010100040010100040010100040010100040010"
      session_id: "010-004-001-rerank-reaper-design"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Rerank-Sidecar Reaper Investigation and Architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Three-Layer Reaper Architecture

**Status:** Proposed

<!-- ANCHOR:adr-001-context -->
### Context

The sidecar is launched detached by both runtimes: Python uses `start_new_session=True` at `ensure_rerank_sidecar.py:269`, while JS uses `detached: true` and `child.unref()` at `ensure-rerank-sidecar.cjs:392-400`. Current cleanup removes dead sidecar PID rows, not alive sidecars whose owners died: `sidecar_ledger.py:263-273`, `ensure-rerank-sidecar.cjs:332-350`. The FastAPI app releases models only during shutdown and has no self-reaper: `rerank_sidecar.py:230-235`.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Adopt the refined three-layer reaper:

- **Layer B:** managed sidecar self-checks owner liveness every 45 seconds and exits when all registered owners are dead and no request is in flight.
- **Layer D:** JS and Python launchers always run pre-flight reap/migration before reuse or spawn.
- **Layer A:** managed sidecar exits after 30 minutes idle, with timeout `0` disabling idle exit for manual debug.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**
- Covers all-owner-dead without future launcher, next-launch cleanup, stopped/hung sidecars, and owner-alive inactivity.
- Preserves detached warm-model reuse.
- Localizes implementation to existing launcher/app/ledger surfaces.

**Negative**
- Adds app lifecycle work and JS/Python parity burden.
- Needs careful legacy-row migration to avoid false-positive kills.

**Neutral**
- Existing `start_new_session=True` and JS detached spawn stay unchanged.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Remove detach:** rejected because warm-model reuse is intentional and both current launch paths are designed around detached service reuse: `ensure_rerank_sidecar.py:263-280`, `ensure-rerank-sidecar.cjs:391-409`.
- **Launcher-only reaper:** rejected because it cannot clean sidecars when no later launcher invocation occurs.
- **Self-check-only reaper:** rejected because it cannot handle SIGSTOP/event-loop hangs.
- **Idle-only reaper:** rejected because it does not distinguish live multi-owner workloads from ownerless stale workers.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Check Review

| Check | Result |
|-------|--------|
| Clarity | Three layers map to three separate failure classes. |
| Systems | Keeps launcher/app/ledger responsibilities separated. |
| Bias | Rejects single-layer shortcut because coverage is not subsumed. |
| Sustainability | Requires parity fixtures to prevent JS/Python drift. |
| Value | Directly targets the 25-process, 16 GB accumulation failure. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

Follow-on packet `010/005` should implement B, D, and A in one packet because partial implementation leaves known gaps. The minimum viable source set is listed in `implementation-summary.md`.
<!-- /ANCHOR:adr-001-impl -->

### Evidence

- `ensure_rerank_sidecar.py:263-280`
- `ensure-rerank-sidecar.cjs:391-409`
- `sidecar_ledger.py:263-273`
- `rerank_sidecar.py:230-235`
- `research/research.md` section 6
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Identity-Verified PID Liveness Contract

**Status:** Proposed

### Context

Current liveness checks use `kill(pid, 0)` only: JS at `ensure-rerank-sidecar.cjs:320-329`, Python at `sidecar_ledger.py:150-167`. `kill(0)` cannot detect PID reuse by itself.

### Decision

Record owner identity at ledger-write time as `(pid, create_timestamp, comm)`. On macOS/BSD, capture identity with:

```bash
ps -p "$PID" -o lstart= -o comm=
```

Parse the first 24 characters as `create_timestamp` and the trimmed remainder as `comm`. A PID is live only when `kill(pid, 0)` succeeds or returns EPERM and the current `ps` identity matches the recorded tuple. Reasons are:

- `ok`
- `pid-recycled`
- `kill-0-eperm`
- `kill-0-esrch`
- `unknown`

Unknown/unparseable states fail open as alive with `reason:"unknown"` and `errorCode`.

### Consequences

**Positive**
- Protects against PID reuse false liveness.
- Extends the existing structured liveness precedent from F88/F102.
- Creates fixtureable behavior across JS and Python.

**Negative**
- Adds platform-specific `ps` parsing.
- Needs fallback handling for systems where `ps` output differs.

**Neutral**
- EPERM remains alive when identity matches, preserving the prior fail-open safety policy.

### Alternatives Considered

- **PID-only `kill(0)`:** rejected because PID reuse is a named failure mode and current code already uses PID-only checks: `ensure-rerank-sidecar.cjs:320-329`, `sidecar_ledger.py:150-167`.
- **Use process start time only:** rejected because `comm` gives a cheap second discriminator.
- **Use full command args:** rejected because args can be long, mutable-looking, and harder to parse consistently.

### Evidence

- `ensure-rerank-sidecar.cjs:320-329`
- `sidecar_ledger.py:150-167`
- `research/research.md` section 7

---

## ADR-003: Ledger Schema Extension for Owner Identities

**Status:** Proposed

### Context

Current `SidecarLedgerRow` has one `ownerToken`, but no owner identity list: `sidecar_ledger.py:32-69`. JS and Python both record the sidecar process PID, not the launcher owner process PID: `ensure-rerank-sidecar.cjs:401-409`, `ensure_rerank_sidecar.py:271-280`.

### Decision

Move ledger payload to version 2 and add `owners` plus `reaper` fields per sidecar row:

```json
{
  "version": 2,
  "sidecars": [
    {
      "pid": 12345,
      "port": 8765,
      "ownerToken": "state-dir-token",
      "startedAtIso": "2026-05-23T10:00:00Z",
      "lastHealthIso": "2026-05-23T10:05:00Z",
      "executablePath": "/usr/local/bin/node",
      "canonicalConfigHash": "sha256...",
      "owners": [
        {
          "ownerId": "js:98765:Sat May 23 10:01:02 2026:node",
          "pid": 98765,
          "createTimestamp": "Sat May 23 10:01:02 2026",
          "comm": "node",
          "registeredAtIso": "2026-05-23T10:01:03Z",
          "lastSeenIso": "2026-05-23T10:01:03Z",
          "source": "ensure-rerank-sidecar.cjs"
        }
      ],
      "reaper": {
        "policyVersion": 1,
        "heartbeatSeconds": 45,
        "idleTimeoutSeconds": 1800
      }
    }
  ]
}
```

Readers must accept v1 rows. Pre-flight launchers may migrate healthy matching legacy rows by registering the current owner. The sidecar self-check must not immediately kill a legacy no-owner row solely because `owners` is missing.

### Consequences

**Positive**
- Enables all-owners-dead logic.
- Preserves current sidecar metadata used for reuse.
- Allows safe legacy migration.

**Negative**
- Requires schema/dataclass updates in Python and validation in JS.
- Adds ledger churn when multiple owners register or are pruned.

**Neutral**
- The persistent `ownerToken` remains as state-dir/reuse identity, not process liveness.

### Alternatives Considered

- **Replace `ownerToken` with owners:** rejected because current health/reuse validation relies on token hash: `rerank_sidecar.py:257-258`, `ensure-rerank-sidecar.cjs:88-94`, `ensure_rerank_sidecar.py:103-107`.
- **Separate owners file:** rejected because it adds cross-file consistency risk under reap races.

### Evidence

- `sidecar_ledger.py:32-69`
- `ensure-rerank-sidecar.cjs:401-409`
- `ensure_rerank_sidecar.py:271-280`
- `rerank_sidecar.py:247-261`

---

## ADR-004: Tunable Defaults

**Status:** Proposed

### Context

Existing launchers already read rerank env knobs and pass controlled env to the sidecar: JS filters env with allowlisted `RERANK_*` keys at `ensure-rerank-sidecar.cjs:131-147`, and `start.sh` forwards explicit rerank variables at `start.sh:75-86`. The sidecar currently has rate-limit and payload env defaults but no reaper env knobs: `rerank_sidecar.py:48-57`.

### Decision

Use these defaults:

- `RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS=45`
- `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS=1800`
- `RERANK_SIDECAR_REAP_ON_LAUNCH=true` with no disable path for managed launchers
- `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS=0` disables idle timeout for manual debug

### Consequences

**Positive**
- Bounds ownerless orphan lifetime without materially increasing launcher cost.
- Gives operators a simple debug opt-out.
- Uses the existing `RERANK_*` env allowlist family.

**Negative**
- A 30-minute idle timeout may introduce cold-starts after long pauses.
- Operators need documentation for disabling idle during long manual debug.

**Neutral**
- Heartbeat and idle values can be tuned later without schema migration.

### Alternatives Considered

- **30-second heartbeat:** rejected as more frequent than needed for a RAM leak measured over hours.
- **60-second heartbeat:** acceptable, but 45 seconds gives quicker cleanup with negligible extra cost.
- **15-minute idle:** rejected as too aggressive for active development bursts.
- **60-minute idle:** rejected as slower than necessary for reclaiming large model RSS.

### Evidence

- `ensure-rerank-sidecar.cjs:131-147`
- `start.sh:75-86`
- `rerank_sidecar.py:48-57`
- `research/research.md` section 9

---

## ADR-005: JS/Python Parity-Test Contract

**Status:** Proposed

### Context

This surface already has twin JS and Python implementations. Config hash parity is explicitly mirrored: `ensure-rerank-sidecar.cjs:249-263`, `ensure_rerank_sidecar.py:136-151`. Prior F69/F102 decisions require ledger locking and structured liveness parity across runtimes: `decision-record.md` in arc 010/002/004 records JS ledger locking at lines 105-128 and Python structured liveness mirror at lines 155-177.

### Decision

Follow-on implementation must add a shared fixture matrix consumed by both JS and Python tests. The matrix covers:

- `ok`
- `pid-recycled`
- `kill-0-eperm`
- `kill-0-esrch`
- `unknown`
- owners-all-dead
- one-owner-live
- legacy-row-migrate
- health-unreachable
- config-hash-mismatch

Both launchers must return identical classifications and reap decisions for the same ledger/health/liveness fixture inputs.

### Consequences

**Positive**
- Prevents semantic drift between launcher twins.
- Makes identity-check behavior reviewable without live process control.
- Extends existing parity practice.

**Negative**
- Adds fixture maintenance in two test stacks.
- Requires a small shared JSON fixture contract.

**Neutral**
- Does not force a shared runtime library between JS and Python.

### Alternatives Considered

- **Comment-only parity:** rejected because this surface has already needed parity hardening.
- **One implementation shells out to the other:** rejected because launcher startup should not depend on cross-runtime execution.

### Evidence

- `ensure-rerank-sidecar.cjs:249-263`
- `ensure_rerank_sidecar.py:136-151`
- `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity/decision-record.md:105`
- `../../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity/decision-record.md:155`

---

## ADR-006: Reaper Telemetry JSONL

**Status:** Proposed

### Context

The sidecar already supports optional request logging with `RERANK_LOG_PATH`: `rerank_sidecar.py:49-51`, `rerank_sidecar.py:312-333`. Reaper decisions need separate forensic logging because they affect process lifetime rather than request scoring.

### Decision

Add `RERANK_SIDECAR_REAPER_LOG_PATH`, defaulting to `$stateDir/sidecar-reaper.jsonl` for managed launchers. Each event writes one JSON line:

```json
{
  "ts": "2026-05-23T10:45:00Z",
  "event": "self-exit-all-owners-dead",
  "sidecarPid": 12345,
  "port": 8765,
  "configHash": "sha256...",
  "owners": [
    {
      "pid": 98765,
      "reason": "kill-0-esrch",
      "recordedCreateTimestamp": "Sat May 23 10:01:02 2026",
      "recordedComm": "node"
    }
  ],
  "inFlight": 0,
  "idleSeconds": 1842,
  "actor": "rerank_sidecar.py"
}
```

### Consequences

**Positive**
- Gives operators evidence for automatic kills.
- Makes false-positive investigations possible.
- Can feed future memory saves if needed.

**Negative**
- Adds another bounded log path to document and rotate.
- Needs privacy review if commands are considered sensitive; store `comm`, not full args.

**Neutral**
- Request logs remain separate from process lifecycle logs.

### Alternatives Considered

- **Only stderr:** rejected because detached launchers send stderr to a sidecar log fd and JSONL is easier to correlate.
- **Memory-save every reap:** rejected as too heavy and outside runtime source responsibility.

### Evidence

- `rerank_sidecar.py:49-51`
- `rerank_sidecar.py:312-333`
- `ensure-rerank-sidecar.cjs:390-399`
- `ensure_rerank_sidecar.py:256-270`

---

## ADR-007: In-Flight Request Gate Before Self-Exit

**Status:** Proposed

### Context

`/rerank` performs model loading/prediction under a per-model lock: `rerank_sidecar.py:298-304`. `/warmup` can also load a model under lock: `rerank_sidecar.py:274-281`. The current app does not track in-flight requests or pending shutdown: `rerank_sidecar.py:289-339`.

### Decision

Layer B and Layer A self-exit must be gated by a shared app-local in-flight counter. `/warmup` and `/rerank` increment before work and decrement in `finally`. If a reaper condition fires while in-flight is non-zero, set `shutdownPendingReason` and exit only after the counter returns to zero.

Graceful exit should signal the current process with SIGTERM rather than relying on `sys.exit(0)` from a background task, so uvicorn can run lifespan shutdown and clear model references: `rerank_sidecar.py:230-235`.

### Consequences

**Positive**
- Prevents mid-request termination.
- Gives Layer B and A one shared safety primitive.
- Preserves existing lifespan cleanup.

**Negative**
- Requires careful exception-safe counters.
- Adds state to an otherwise simple FastAPI module.

**Neutral**
- Does not change `/health` response model unless ADR-006 telemetry or optional reaper status is added.

### Alternatives Considered

- **Immediate `sys.exit(0)` from heartbeat task:** rejected because background task exit behavior is less explicit under uvicorn.
- **Wait for model lock only:** rejected because multiple model locks exist and `/warmup` and `/rerank` need one consistent app-level gate.

### Evidence

- `rerank_sidecar.py:230-235`
- `rerank_sidecar.py:274-281`
- `rerank_sidecar.py:298-304`
- `rerank_sidecar.py:289-339`
