---
title: "Research: Rerank-Sidecar Three-Layer Reaper Architecture"
description: "Lifecycle synthesis, failure-mode inventory, and ADR-ready design for owner-liveness, launcher pre-flight, and idle-timeout reaping."
trigger_phrases:
  - "rerank sidecar three layer reaper research"
  - "owner liveness idle timeout preflight reap"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-reaper-research-synthesis"
    next_safe_action: "use-research-for-010-005"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/iter-001.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100040010100040010100040010100040010100040010100040010100040010"
      session_id: "010-004-001-rerank-reaper-design"
      parent_session_id: null
    completion_pct: 100
---
# Research: Rerank-Sidecar Three-Layer Reaper Architecture

<!-- ANCHOR:lifecycle-map -->
## 1. Lifecycle Map

The accumulation is explained by detached launch plus missing owner reaping. CocoIndex MCP ensures the sidecar before creating the MCP server: `cli.py:1191-1197`. That ensure path is default-on for CocoIndex, bypassing the spec-memory gate by passing `skip_if_disabled=False`: `cli.py:139-168`. The Python sidecar launcher then spawns `bash start.sh` with `start_new_session=True`: `ensure_rerank_sidecar.py:263-270`, records the sidecar PID in the ledger: `ensure_rerank_sidecar.py:271-280`, and `start.sh` execs one uvicorn worker: `start.sh:88-89`.

Spec-memory follows the JS twin. `mk-spec-memory-launcher.cjs` imports `ensureRerankSidecar`: `mk-spec-memory-launcher.cjs:9-12`, calls it before launching the server: `mk-spec-memory-launcher.cjs:442-453`, and the JS helper spawns a detached child with `detached: true`, `child.unref()`, and a ledger row: `ensure-rerank-sidecar.cjs:391-409`. [SOURCE: .opencode/bin/lib/ensure-rerank-sidecar.cjs:392]

The current stale memory pointer to `client.py:325` is off by two lines in this checkout. The current CocoIndex daemon detach is at `client.py:327`, inside `_spawn_daemon_process()`: `client.py:295-331`. That daemon detach is part of the broader lifecycle, but rerank sidecar detach also exists directly in the Python and JS rerank launchers: `ensure_rerank_sidecar.py:269`, `ensure-rerank-sidecar.cjs:392-400`.

Ledger reuse is sidecar-process-centric. The row schema records `pid`, `port`, `ownerToken`, timestamps, executable path, and config hash: `sidecar_ledger.py:32-69`. Existing cleanup removes dead sidecar PID rows: `sidecar_ledger.py:263-273`, `ensure-rerank-sidecar.cjs:332-350`. It does not record or reap by owner identity.
<!-- /ANCHOR:lifecycle-map -->

## 2. Failure-Mode Inventory

| Failure Mode | Current Behavior | Required Reaper Behavior |
|--------------|------------------|--------------------------|
| Multi-owner partial death | Ledger cannot represent multiple owners: `sidecar_ledger.py:32-69`. | Prune dead owner identities but keep sidecar for any live owner. |
| Last owner dies during request | `/rerank` uses model locks but no in-flight counter: `rerank_sidecar.py:298-304`. | Delay self-exit until in-flight count reaches zero. |
| PID reuse | Current `kill(0)` liveness lacks create-time identity: `ensure-rerank-sidecar.cjs:320-329`, `sidecar_ledger.py:150-167`. | Compare recorded `(pid, lstart, comm)` with current `ps` data. |
| Sidecar in SIGSTOP/event-loop hang | PID remains alive but HTTP health can fail; current cleanup does not kill alive rows: `ensure-rerank-sidecar.cjs:332-350`. | Launcher pre-flight can terminate stale unresponsive sidecar PIDs. |
| Ledger race | Existing writes are locked/atomic: `sidecar_ledger.py:94-104`, `ensure-rerank-sidecar.cjs:287-311`. | Reaper must use the same locks and atomic writes. |
| Operator-spawned debug | JS returns `unknown-healthy-port`; Python chooses another port: `ensure-rerank-sidecar.cjs:381-383`, `ensure_rerank_sidecar.py:247-249`. | Launcher reaps ledger-managed sidecars only; manual debug can opt out of idle self-exit. |
| Owner alive but inactive | Healthy reusable sidecars can persist indefinitely: `ensure-rerank-sidecar.cjs:376-378`, `ensure_rerank_sidecar.py:239-245`. | Idle backstop exits after configured inactivity. |
| Warmup timeout after ledger row | Ledger is written before health succeeds; cleanup is best effort: `ensure-rerank-sidecar.cjs:401-423`, `ensure_rerank_sidecar.py:271-299`. | Pre-flight reap removes stale failed-start rows and terminates any surviving process. |
| Config-hash mismatch | Python keeps mismatched alive rows: `sidecar_ledger.py:256-260`, `sidecar_ledger.py:300-314`. | Pre-flight reap may terminate mismatched/unreachable stale rows after identity checks. |
| Python unknown liveness error | Intended stderr logging path references `sys` without importing it: `sidecar_ledger.py:6-15`, `sidecar_ledger.py:165-167`. | Follow-on should import `sys` or route logging through a passed logger while adding new reasons. |

## 3. Layer B - Owner-Liveness Self-Check

**Design.** `rerank_sidecar.py` starts an asyncio background task from FastAPI lifespan. Every 45 seconds it loads its ledger row, prunes dead owners with identity-verified PID checks, and exits only when all registered owners are dead and in-flight requests are zero. The current lifespan has only `yield` plus model clearing on shutdown: `rerank_sidecar.py:230-235`, so the reaper task is a direct extension point.

**Pros.**
- Covers the no-future-launch case: if the user closes the terminal and never invokes a launcher again, the sidecar can still exit.
- Uses the sidecar's own request counters, so it can avoid killing mid-request.
- Keeps warm-model reuse while bounding orphan lifetime.

**Cons.**
- Requires sidecar app to import/use ledger helpers, which it does not do today: `rerank_sidecar.py:15-31`.
- Needs careful shutdown mechanism. From an asyncio task, sending `SIGTERM` to self is safer than relying on `sys.exit(0)` from a background task because uvicorn already owns normal shutdown and lifespan cleanup: `start.sh:88-89`, `rerank_sidecar.py:230-235`.
- Cannot act while the process is SIGSTOPed or event-loop hung.

**Edge Cases.**
- Multi-owner: prune dead owners and continue while any owner identity is live.
- Last owner during request: mark shutdown-pending and exit after in-flight reaches zero.
- PID reuse: recycled owner PID is dead if `ps` identity differs.
- Missing legacy owner list: do not immediately self-kill a healthy legacy row; allow idle timeout or launcher pre-flight to migrate/register owners.

**Test Contract.**
- Unit-test owner check states: `ok`, `pid-recycled`, `kill-0-esrch`, `kill-0-eperm`, `unknown`.
- Async test: owner dies while one request is in flight; sidecar exits only after request completion.
- Fixture: legacy row without `owners` does not self-kill on first heartbeat.

**Cost.** At 45 seconds, one ledger read plus O(owner count) `kill(0)`/`ps` checks is negligible for the expected owner set. Complexity is medium because it touches app lifecycle and request accounting.

## 4. Layer D - Pre-Flight Reap in Launcher

**Design.** Both launchers run `reap_stale_sidecars(stateDir, currentOwnerIdentity, configHash)` before reuse/spawn. They read the ledger under lock, identity-check all owners, health-probe each sidecar port, SIGTERM/SIGKILL eligible stale sidecar PIDs, remove dead owner entries, and then proceed with reuse/spawn. JS already owns `findReusableSidecar()` before spawn: `ensure-rerank-sidecar.cjs:376-383`. Python already owns `find_reusable_sidecar()` before spawn: `ensure_rerank_sidecar.py:224-238`.

**Pros.**
- Cleans existing stale rows and failed-start leftovers on the next launcher invocation.
- Catches stopped/hung sidecars that Layer B cannot self-reap.
- Keeps launcher twins as the source of reuse and spawn decisions.
- Gives immediate feedback before creating another model-bearing process.

**Cons.**
- Only runs on launcher invocation; it cannot fix a stale sidecar while the machine is idle.
- Must be parity-tested in JS and Python because the two launchers already have separate implementations: `ensure-rerank-sidecar.cjs:249-263`, `ensure_rerank_sidecar.py:136-151`.
- Needs careful policy for unknown healthy ports. JS currently refuses to own them: `ensure-rerank-sidecar.cjs:381-383`; Python shifts ports: `ensure_rerank_sidecar.py:247-249`.

**Edge Cases.**
- SIGSTOP or health timeout: terminate sidecar if all registered owners are dead and port is not healthy or config is stale.
- Config mismatch: if owners are dead and health reports a mismatched config hash, terminate the stale row before starting a new config.
- Operator debug: do not kill processes absent from the ledger.
- Reap race: hold the existing ledger lock during classify/write; signal after choosing victims, then recheck if needed.

**Test Contract.**
- JS and Python fixtures with the same ledger JSON must produce the same owner classifications and reap decisions.
- Health-unreachable + owners-dead -> SIGTERM then ledger removal.
- Owners-live + health-unreachable -> no kill, report not-reaped-live-owner.
- Legacy no-owner row + healthy matching config -> register current owner and reuse.

**Cost.** Adds one ledger scan and bounded health probes to launcher startup. Because launcher already probes health and reads the ledger, the added cost is small and controllable with short per-port timeouts.

## 5. Layer A - Idle Backstop

**Design.** `rerank_sidecar.py` tracks `last_request_monotonic` and in-flight count. `/warmup` and `/rerank` update activity; `/health` should not reset idle because launchers and monitors can poll it forever. If idle exceeds `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS` (default 1800) and no request is in flight, the sidecar gracefully self-terminates.

**Pros.**
- Covers owner-alive-but-inactive cases that owner liveness cannot distinguish.
- Reclaims model memory even if a daemon process remains alive for hours after useful work stops.
- Provides a simple upper bound on stale warm model lifetime.

**Cons.**
- Can surprise manual debug sessions unless configurable. Recommendation: default enabled for launcher-managed sidecars with owner token/config hash; allow `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS=0` for manual opt-out.
- Too-low threshold can increase cold-start pain.
- Requires request accounting in app code that currently only rate-limits and logs requests: `rerank_sidecar.py:125-137`, `rerank_sidecar.py:312-333`.

**Edge Cases.**
- Long model load counts as in-flight; idle timer must not fire during `/warmup`.
- Health polling does not keep sidecar alive.
- Manual debug can opt out with timeout `0`.

**Test Contract.**
- `/health` does not refresh idle timestamp.
- `/warmup` and `/rerank` refresh idle timestamp.
- Idle timeout with in-flight request waits for completion.
- Timeout `0` disables Layer A.

**Cost.** Very low CPU cost. Complexity is low-to-medium because it shares the same in-flight counter as Layer B.

## 6. Layer Interaction Matrix

| Failure Mode | Layer B Owner Self-Check | Layer D Pre-Flight Reap | Layer A Idle Backstop | Marginal Coverage |
|--------------|--------------------------|--------------------------|-----------------------|-------------------|
| All owners dead, no future launch | Yes | No | Eventually, if idle | B uniquely covers prompt cleanup without future launcher. |
| All owners dead, next launch happens | Yes | Yes | Eventually | D uniquely repairs ledger and stale process before spawning another sidecar. |
| Owner alive but inactive | No | No | Yes | A uniquely covers live-but-useless warm model retention. |
| Multi-owner partial death | Yes, prune and keep | Yes, prune and keep | No | B/D both needed; B handles no-launch case, D handles ledger repair at launch. |
| Last owner dies mid-request | Yes with in-flight gate | No direct knowledge | Yes with in-flight gate | B/A share app-local request visibility; D cannot see in-flight safely. |
| PID reuse | Yes via identity | Yes via identity | Not owner-based | B/D must share identity contract. |
| SIGSTOP/event-loop hang | No | Yes | No | D uniquely covers stopped/hung sidecars. |
| Legacy row without owners | Conservative/no immediate kill | Register/reap based on health/config policy | Yes by idle | D uniquely migrates legacy rows on launch. |
| Operator debug sidecar absent from ledger | No ledger row | No kill | Configurable timeout only | A only if managed/default enabled; D respects manual ownership. |

**Marginal Coverage Calculation.**

- Layer B has non-zero marginal coverage: all-owners-dead with no future launcher.
- Layer D has non-zero marginal coverage: SIGSTOP/hung sidecar, failed-start rows, and immediate cleanup before new spawn.
- Layer A has non-zero marginal coverage: owner-alive-but-inactive retention.

No layer is fully subsumed. The refined recommendation keeps all three layers.

## 7. Identity-Verified PID Check

Contract:

1. At owner registration, capture current owner identity:
   - `pid`: integer process ID.
   - `create_timestamp`: raw `lstart` string from `ps`.
   - `comm`: raw command string from `ps`.
2. macOS/BSD command:
   - `ps -p "$PID" -o lstart= -o comm=`
   - Parse the first 24 characters as `lstart` (`Sat May 23 10:37:04 2026` shape) and the remainder, trimmed, as `comm`.
3. Liveness check order:
   - Invalid PID -> `{ alive:false, reason:"kill-0-esrch" }`.
   - `kill(pid, 0)` succeeds -> read `ps`; if identity matches, `{ alive:true, reason:"ok" }`; if mismatch, `{ alive:false, reason:"pid-recycled" }`.
   - `kill(pid, 0)` ESRCH -> `{ alive:false, reason:"kill-0-esrch" }`.
   - `kill(pid, 0)` EPERM -> read `ps`; if identity matches, `{ alive:true, reason:"kill-0-eperm" }`; if mismatch, `{ alive:false, reason:"pid-recycled" }`.
   - Any unknown error or unparseable `ps` result -> `{ alive:true, reason:"unknown", errorCode }` fail-open.

Fixture tests should include exact macOS `ps` output, missing process output, command containing path separators, and recycled PID mismatch.

## 8. Ledger Schema Extension

Recommended ledger payload:

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

Backward compatibility:

- Readers accept version 1 rows with no `owners`.
- Launcher pre-flight may attach the current owner to a healthy matching legacy row.
- Self-check must not immediately kill a legacy row solely because `owners` is absent; idle backstop or launcher migration handles it.

## 9. Tunable Defaults

- **Heartbeat:** 45 seconds. This bounds all-owner-dead orphan lifetime to under a minute in normal conditions while keeping `kill(0)`/`ps` overhead negligible. A 30-second heartbeat is faster but not materially safer; 60 seconds is also acceptable but slower after terminal death.
- **Idle threshold:** 30 minutes (`1800` seconds). This preserves warm-model reuse across normal bursts while reclaiming memory after an inactive session. The empirical problem involved idle workers surviving for hours, so 30 minutes cuts the long tail without making every search cold.
- **Reap-on-launch:** always. Both launchers already inspect ledger and health before spawning: `ensure-rerank-sidecar.cjs:376-383`, `ensure_rerank_sidecar.py:224-238`. Pre-flight reap should run before reuse/spawn so stale rows cannot cause another worker to be created first.

## 10. Recommendation

Adopt the refined three-layer architecture:

1. **Layer B:** managed sidecar self-checks owner liveness every 45 seconds and exits when all owners are dead and no requests are in flight.
2. **Layer D:** both launchers always run pre-flight reap/migration before reuse/spawn, with JS/Python parity tests.
3. **Layer A:** managed sidecar exits after 30 minutes idle, with `0` disabling idle exit for manual debug.

Confidence: high (0.84). The root cause is code-evidenced, and the layers have non-subsumed coverage. Main implementation risk is parity drift between JS and Python owner identity checks; ADR-005 makes that a test contract rather than a convention.
