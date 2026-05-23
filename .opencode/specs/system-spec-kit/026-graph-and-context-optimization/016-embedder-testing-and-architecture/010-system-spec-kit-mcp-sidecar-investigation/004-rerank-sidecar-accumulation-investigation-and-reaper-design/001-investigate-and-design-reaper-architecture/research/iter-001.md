---
executor: cli-codex
model: gpt-5.5
reasoning_effort: xhigh
iter: 1
target_dimension: lifecycle-map
timestamp: "2026-05-23T10:45:00Z"
---
# Iteration 001: Rerank-Sidecar Lifecycle Map

## Lifecycle Map

### Spawn Path A: CocoIndex MCP -> Python Launcher -> Uvicorn

1. CocoIndex MCP calls `_ensure_rerank_sidecar_for_mcp()` before it creates the MCP server: `cli.py:1191-1197`.
2. The helper is default-on through `COCOINDEX_RERANK_VIA_SIDECAR`; the docstring says the CocoIndex gate is default true and bypasses the spec-memory `SPECKIT_CROSS_ENCODER` gate by passing `skip_if_disabled=False`: `cli.py:139-146`.
3. The helper imports `scripts.ensure_rerank_sidecar.ensure_rerank_sidecar` from the `system-rerank-sidecar` skill and calls it with `skip_if_disabled=False`: `cli.py:152-168`.
4. `ensure_rerank_sidecar()` resolves the port, state directory, owner token, and config hash, then asks the ledger for a reusable sidecar: `ensure_rerank_sidecar.py:215-238`.
5. If no reusable sidecar is found and the configured port is already healthy, Python shifts to a new port instead of killing the existing sidecar: `ensure_rerank_sidecar.py:247-249`.
6. Python spawns `bash start.sh` with `start_new_session=True`: `ensure_rerank_sidecar.py:263-270`.
7. Python writes a ledger row using the spawned sidecar process PID, port, owner token, timestamps, executable path, and config hash: `ensure_rerank_sidecar.py:271-280`.
8. `start.sh` scrubs the environment and execs a single uvicorn worker for `scripts.rerank_sidecar:app`: `start.sh:50-67`, `start.sh:75-89`.

### Spawn Path B: mk-spec-memory Launcher -> JS Launcher -> Uvicorn

1. `mk-spec-memory-launcher.cjs` imports the JS launcher helper at startup: `mk-spec-memory-launcher.cjs:9-12`.
2. After lease coordination, the launcher calls `ensureRerankSidecar()` on the configured rerank port: `mk-spec-memory-launcher.cjs:442-453`.
3. `ensureRerankSidecar()` resolves port, timeout, state dir, owner token, and config hash before probing the ledger: `ensure-rerank-sidecar.cjs:353-370`.
4. JS first calls `findReusableSidecar()` and then falls back to a plain health check of the target port: `ensure-rerank-sidecar.cjs:376-383`.
5. JS spawns `bash start.sh` with `detached: true`, ignores stdio through a sidecar log fd, and passes only allowlisted child env plus sidecar overrides: `ensure-rerank-sidecar.cjs:390-399`.
6. JS calls `child.unref()`, then records the sidecar PID and config in the ledger: `ensure-rerank-sidecar.cjs:400-409`.
7. The same `start.sh` uvicorn boot path runs: `start.sh:88-89`.

### Current `client.py:325` Memory Verification

The stale memory pointer is close but not exact in the current checkout. The current CocoIndex daemon detach is `start_new_session=True` at `mcp-coco-index/mcp_server/cocoindex_code/core/client.py:327`; this is inside `start_daemon()` / `_spawn_daemon_process()`, which starts the long-lived CocoIndex daemon: `client.py:263-290`, `client.py:295-331`. This detach is a daemon lifecycle choice, not the only rerank sidecar detach. The rerank sidecar itself also detaches through Python at `ensure_rerank_sidecar.py:269` and through JS at `ensure-rerank-sidecar.cjs:392-400`.

## Ledger Ownership Lifecycle

The current ledger row is sidecar-process-centric. `SidecarLedgerRow` contains `pid`, `port`, `ownerToken`, `startedAtIso`, `lastHealthIso`, `executablePath`, and `canonicalConfigHash`: `sidecar_ledger.py:32-40`. Its serializer writes those same fields and no owner PID identity list: `sidecar_ledger.py:60-69`.

Owner token is not owner identity. Python loads an explicit `RERANK_SIDECAR_OWNER_TOKEN` or creates a persistent state-dir token: `ensure_rerank_sidecar.py:129-133`; JS does the same at `ensure-rerank-sidecar.cjs:216-224`. That token proves state-directory ownership/reuse, not whether the launching process that registered the sidecar remains alive.

Rows are added after spawn. Python adds `SidecarLedgerRow(pid=proc.pid, ...)` after `subprocess.Popen`: `ensure_rerank_sidecar.py:263-280`. JS calls `addLedgerRow()` with `pid: child.pid` after `child.unref()`: `ensure-rerank-sidecar.cjs:400-409`.

Rows are removed only when the sidecar PID itself is dead. Python `reclaim_stale()` filters rows whose `process_liveness(row.pid)["alive"]` is false: `sidecar_ledger.py:263-273`. Python `find_reusable_sidecar()` drops only rows classified as `stale-pid-reclaim`: `sidecar_ledger.py:291-317`. JS `findReusableSidecar()` skips dead sidecar PIDs and rewrites the ledger with still-alive rows: `ensure-rerank-sidecar.cjs:332-350`.

No current code records the launcher/client owner PID, owner start timestamp, or owner command name. No current code removes an owner from a sidecar row when the owner exits, because there is no owner list to mutate: `sidecar_ledger.py:32-69`, `ensure-rerank-sidecar.cjs:401-409`, `ensure_rerank_sidecar.py:271-280`.

## Existing GC Paths

Existing cleanup is ledger-row cleanup, not process reaping.

- JS GC path: `findReusableSidecar()` removes rows whose sidecar PID is already dead, then reuses only rows with matching owner token, config hash, and healthy port: `ensure-rerank-sidecar.cjs:332-350`.
- Python GC path: `reclaim_stale()` keeps only rows whose sidecar PID is alive: `sidecar_ledger.py:263-273`.
- Python reuse path: `find_reusable_sidecar()` classifies sidecar rows by sidecar PID liveness, owner token, config hash, and port health, then drops only `stale-pid-reclaim`: `sidecar_ledger.py:241-260`, `sidecar_ledger.py:276-318`.
- Warmup-failure cleanup kills the freshly spawned sidecar process group in Python and SIGTERMs the freshly spawned JS child, but only for that immediate warmup failure: `ensure_rerank_sidecar.py:288-299`, `ensure-rerank-sidecar.cjs:416-423`.
- The FastAPI sidecar only releases model references during normal shutdown; it does not initiate shutdown on owner death or idle: `rerank_sidecar.py:230-235`.

Search terms `reap`, `reaper`, `idle`, `heartbeat`, `last_request`, `orphan`, and `SIGTERM` across the launcher, app, ledger, and start script found no owner-liveness self-reaper. The only `SIGTERM` paths are warmup failure cleanup: `ensure_rerank_sidecar.py:179-203`, `ensure_rerank_sidecar.py:288-299`, `ensure-rerank-sidecar.cjs:416-423`.

## `start_new_session=True` Verification

- Current CocoIndex daemon equivalent of the memory pointer: `start_new_session=True` at `mcp-coco-index/mcp_server/cocoindex_code/core/client.py:327`.
- Current rerank Python launcher detach: `start_new_session=True` at `ensure_rerank_sidecar.py:269`.
- Current rerank JS launcher detach equivalent: `detached: true` at `ensure-rerank-sidecar.cjs:392` plus `child.unref()` at `ensure-rerank-sidecar.cjs:400`.

## Failure Modes

1. **Multi-owner partial death**: Current ledger has one `ownerToken`, not an owner identity list, so it cannot distinguish one dead owner from one live owner: `sidecar_ledger.py:32-69`.
2. **Last owner dies during request**: Current app has per-model locks around `/rerank`, but no in-flight counter or owner-death shutdown gate: `rerank_sidecar.py:298-304`, `rerank_sidecar.py:289-339`.
3. **PID reuse**: Current liveness is `kill(0)` only, so a recycled PID can be treated as alive if the OS reuses it: `ensure-rerank-sidecar.cjs:320-329`, `sidecar_ledger.py:150-167`.
4. **Sidecar in SIGSTOP or event-loop hang**: Current sidecar PID is alive, but health may not respond; JS keeps alive rows before health matching and does not kill them: `ensure-rerank-sidecar.cjs:332-350`.
5. **Ledger race**: Ledger writes are locked/atomic in current Python and JS paths, so a reaper must reuse those locks instead of bypassing them: `sidecar_ledger.py:94-104`, `ensure-rerank-sidecar.cjs:287-311`.
6. **Operator-spawned debug sidecar**: A manual process may answer `/health` but have no ledger row; JS returns `unknown-healthy-port`, while Python shifts to a new port: `ensure-rerank-sidecar.cjs:381-383`, `ensure_rerank_sidecar.py:247-249`.
7. **Owner alive but inactive**: Existing owner-token reuse keeps the model warm indefinitely while the owner process or daemon remains alive: `ensure-rerank-sidecar.cjs:376-378`, `ensure_rerank_sidecar.py:239-245`.
8. **Warmup timeout after ledger write**: Both launchers write ledger rows before health has succeeded, then perform best-effort cleanup; if cleanup misses, stale records can remain: `ensure-rerank-sidecar.cjs:401-423`, `ensure_rerank_sidecar.py:271-299`.
9. **Config-hash mismatch**: Python classifies mismatched config rows but keeps them because only `stale-pid-reclaim` rows are dropped: `sidecar_ledger.py:256-260`, `sidecar_ledger.py:300-314`.
10. **Unknown liveness error path**: Python liveness intends to log unexpected `OSError`, but `sidecar_ledger.py` does not import `sys` in its import block, so that rare path would fail while reporting unknown liveness: `sidecar_ledger.py:6-15`, `sidecar_ledger.py:165-167`.

## Findings List

1. **F001 / P1 / `lifecycle:cocoindex-client:daemon-detaches-with-start-new-session`** - Current `client.py` detach is at `mcp-coco-index/mcp_server/cocoindex_code/core/client.py:327`, inside the daemon auto-start path at `client.py:263-290`. This explains why caller terminal death does not imply daemon death.
2. **F002 / P1 / `lifecycle:cocoindex-cli:mcp-default-ensures-sidecar`** - CocoIndex MCP auto-ensures the rerank sidecar before server startup and defaults the sidecar gate on: `cli.py:139-168`, `cli.py:1191-1197`, `config.py:747-770`.
3. **F003 / P0 / `lifecycle:python-launcher:detached-sidecar-start-new-session`** - The Python sidecar launcher starts `bash start.sh` with `start_new_session=True`, then records the sidecar PID: `ensure_rerank_sidecar.py:263-280`.
4. **F004 / P0 / `lifecycle:js-launcher:detached-spawn-unref`** - The JS launcher starts a detached child, calls `child.unref()`, then records the sidecar PID: `ensure-rerank-sidecar.cjs:391-409`.
5. **F005 / P1 / `lifecycle:start-sh:uvicorn-single-worker-exec`** - The start script execs one uvicorn worker for `scripts.rerank_sidecar:app`, so each stale process can hold a model copy: `start.sh:88-89`, `rerank_sidecar.py:90-92`.
6. **F006 / P0 / `lifecycle:ledger:schema-lacks-owner-identity-list`** - The ledger schema has sidecar PID and owner token but no owner PID identity array: `sidecar_ledger.py:32-69`.
7. **F007 / P0 / `lifecycle:ledger:reclaim-stale-removes-dead-sidecar-rows-only`** - `reclaim_stale()` removes ledger rows for dead sidecar PIDs, not alive sidecars whose owners died: `sidecar_ledger.py:263-273`.
8. **F008 / P0 / `lifecycle:js-launcher:reuse-gc-keeps-alive-ownerless-sidecars`** - JS `findReusableSidecar()` keeps alive rows and only rewrites the ledger after dropping dead sidecar PID rows: `ensure-rerank-sidecar.cjs:332-350`.
9. **F009 / P0 / `lifecycle:python-launcher:reuse-classification-is-sidecar-process-centric`** - Python classification checks sidecar PID, token, config, and port health, but no owner-death predicate: `sidecar_ledger.py:241-260`, `sidecar_ledger.py:276-318`.
10. **F010 / P0 / `lifecycle:app:no-owner-heartbeat-or-idle-exit`** - The FastAPI sidecar exposes health, warmup, and rerank endpoints and clears models on shutdown, but has no owner heartbeat or idle self-exit: `rerank_sidecar.py:230-235`, `rerank_sidecar.py:247-261`, `rerank_sidecar.py:264-339`.
11. **F011 / P1 / `lifecycle:health:token-and-config-prove-reuse-not-owner-liveness`** - `/health` returns owner token hash and config hash for reuse matching, but no owner-liveness or in-flight metadata: `rerank_sidecar.py:247-261`.
12. **F012 / P1 / `lifecycle:python-launcher:healthy-port-collision-can-spawn-new-port`** - Python shifts to a new port if the requested port is healthy but not reusable, which can preserve a stale worker while starting another: `ensure_rerank_sidecar.py:247-249`.
