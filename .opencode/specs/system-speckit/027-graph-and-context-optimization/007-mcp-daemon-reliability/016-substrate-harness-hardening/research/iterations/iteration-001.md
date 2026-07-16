# Iteration 001 — Q1: Does `liveOwnerForService` null path catch genuine crashes?

## Focus

Q1 (primary): Do genuine daemon crashes still FAIL the suite via `liveOwnerForService` returning null? The claim is that when a daemon genuinely crashes, no live process holds the lease, so `liveOwnerForService` returns null and `connectSharedClient` emits FAIL — not SKIP.

## Actions Taken

1. Read `run-substrate-stress-harness.mjs` — located `isPidAlive` (line 321), `liveOwnerForService` (line 339), and the `connectSharedClient` catch block (line 394).
2. Read `substrate-runner-harness.vitest.ts` — confirmed the relaxed 410 false-green guard.
3. Read `daemon-detect.ts` — compared `isProcessAlive` (which uses `code !== 'ESRCH'`) against `isPidAlive` (which uses `error.code === 'EPERM'`); also identified the `childPid` field (DR-016) absent from harness lease reads.
4. Traced all conditions under which FAIL → SKIP reclassification occurs in the catch block.

## Findings

### F-001: Null-return path is the sole FAIL arbiter (run-substrate-stress-harness.mjs:394-416)

The catch block at line 394 calls `liveOwnerForService(name)` and branches on null vs non-null:
- `liveOwner !== null` → verdict = SKIP (line 400-404)
- `liveOwner === null` → verdict = FAIL (line 405-410)

A genuine crash does NOT automatically yield FAIL. It yields FAIL only when `liveOwnerForService` returns null. The null path requires both: (a) the lease file is absent/unreadable/unparseable, OR (b) the lease file exists but **all** pid fields (`ownerPid`, `pid`) fail `isPidAlive`.

**Evidence**: `run-substrate-stress-harness.mjs:358-364`
```
for (const field of pidFields) {
  const pid = lease?.[field];
  if (isPidAlive(pid)) return { ownerPid: pid, leasePath };
}
return null;
```

---

### F-002: `isPidAlive` correctly handles ESRCH (run-substrate-stress-harness.mjs:321-330)

```
function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error && typeof error === 'object' && error.code === 'EPERM';
  }
}
```

- ESRCH (no such process): `process.kill(pid, 0)` throws with code `ESRCH`; the catch does NOT match `error.code === 'EPERM'` → returns `false` → correctly treated as dead.
- EPERM (process exists, owned by another UID): `process.kill(pid, 0)` throws with code `EPERM`; the catch matches → returns `true` → correctly treated as alive.
- Normal (process exists, we own it): no throw → returns `true` → correctly treated as alive.

The EPERM treatment matches the semantic in `daemon-detect.ts:88` (`code !== 'ESRCH'`) and the launcher-lease.vitest.ts comment at line 71: `EPERM → held: true, staleReclaimable: false`.

---

### F-003: DR-016 `childPid` is NOT checked by harness (daemon-detect.ts:25-28, run-substrate-stress-harness.mjs:343-344)

For `mk-spec-memory`, the lease file (`.mk-spec-memory-launcher.json`) contains three pid fields:
- `pid` (legacy alias: `ownerPid`): the launcher process
- `childPid`: the spawned SQLite writer daemon (DR-016 addition)

`liveOwnerForService` only checks `['ownerPid', 'pid']` (line 344). It does NOT check `childPid`. If the launcher (parent) crashes but the child daemon stays alive, `isSpecMemoryDaemonAlive` (daemon-detect.ts:128-133) would return `{ alive: true, pid: childPid }`, but `liveOwnerForService` would return null → FAIL.

This is **not** a false-green (SKIP masking real crash); it is the correct behavior: a live child daemon means the service is up, but `liveOwnerForService` only tracks the launcher lease, so the harness would still report FAIL. The harness's purpose is to detect "can we spawn a dedicated child?" — if the launcher is dead, the answer is no (FAIL), regardless of child aliveness.

---

### F-004: TOCTOU window exists in theory but not in practice (run-substrate-stress-harness.mjs:394)

The adversarial probe asks: can the lease be released between the failed connect and the lease read?

The catch block at line 394 is entered **after** `client.connect(transport)` fails. The `liveOwnerForService` call is **synchronous** and immediate — no await between connect failure and lease read. The only async boundary between connect failure and the lease read is `await client.close().catch(() => {})` at line 395, which runs **before** `liveOwnerForService` is called. So there is no meaningful TOCTOU gap.

The probe asks what happens if the lease is released between failure and read. Since `liveOwnerForService` reads the lease **synchronously** and immediately after the catch, any release that happened earlier would already be reflected in the lease state at read time.

---

### F-005: PID recycling IS the primary residual risk for SKIP-masking genuine crash

The critical adversarial scenario:

1. Daemon crashes without cleaning up lease file (hard crash, no graceful shutdown)
2. `ownerPid` in lease is a positive integer pointing to the crashed daemon's now-recycled PID
3. OS has reassigned that PID to a **different, unrelated live process**
4. Harness calls `isPidAlive(recycledPid)` → `process.kill(recycledPid, 0)` succeeds or EPERM-throws → `isPidAlive` returns `true`
5. `liveOwnerForService` returns non-null → verdict is SKIP (not FAIL)

This requires all three conditions simultaneously:
- Crashed daemon's lease not cleaned (hard crash)
- PID recycled to a **live** unrelated process before harness reads lease
- Harness reads lease **after** PID is live and assigned

This is a real but narrow risk. On macOS/Unix, PIDs are not immediately recycled to unrelated processes; the chance of this exact sequence in a CI/dev environment is low but non-zero.

---

### F-006: EPERM in `isPidAlive` does NOT mask genuine failures beyond normal permission boundaries

The probe asks: can `process.kill(pid, 0)` returning EPERM (foreign-owned PID) wrongly classify a genuine crash as SKIP?

EPERM means "process exists but you cannot signal it." The probe implies this could be a false-positive "alive" signal. However:

- EPERM means the PID refers to a **real, live process** (owned by another user or in another session). The process is legitimately alive.
- If that process is the **original daemon** (never crashed): EPERM correctly yields SKIP — correct behavior.
- If that process is an **unrelated live process** whose PID was recycled from the crashed daemon: EPERM yields SKIP — this is the same PID-recycling issue as F-005, not a distinct EPERM-specific failure mode.
- If the process is **truly dead**: ESRCH is thrown → `isPidAlive` returns `false` → FAIL.

EPERM never returns `false` for a live process. The only way EPERM masks a genuine crash is via PID recycling (F-005), which is the same failure mode as a successful `process.kill(pid, 0)`.

---

### F-007: Lease present but owner is unrelated live process — same as F-005

If the lease file exists with a live `ownerPid`, but that PID belongs to an unrelated process (not the daemon that wrote the lease), this is only possible if:
- The original daemon's lease was not cleaned (hard crash or crash before unlink)
- The PID was recycled to a live unrelated process

The harness sees a live PID via `isPidAlive` → SKIP. This is identical to F-005. There is no other mechanism by which a "wrong owner" produces SKIP without PID recycling.

---

### Ruled Out

- **RO-001**: The EPERM comment at `run-substrate-stress-harness.mjs:327` ("EPERM means it exists but is owned elsewhere (still alive)") is **correct**. EPERM does not indicate a dead process.
- **RO-002**: The `daemon-detect.ts:88` implementation (`code !== 'ESRCH'`) is **consistent** with `isPidAlive` (`error.code === 'EPERM'`). Both treat EPERM as alive and ESRCH as dead.
- **RO-003**: TOCTOU between connect failure and lease read is **not exploitable** because `liveOwnerForService` is called synchronously in the catch block with no await separating connect failure from lease read.
- **RO-004**: `childPid` not being checked by the harness does **not** create a false-green (SKIP masking real crash). The harness correctly FAILs when the launcher is dead, regardless of child aliveness — that is the intended behavior.

## Questions Answered

| Q | Answer |
|---|--------|
| Q1 (focus): genuine crashes still FAIL? | **Yes**, via null path at `run-substrate-stress-harness.mjs:364`. When the daemon crashes and the OS has not yet recycled its PID to a live process, `isPidAlive(ownerPid)` returns false → `liveOwnerForService` returns null → verdict is FAIL. The **residual risk** (not a clean-room failure) is PID recycling (F-005). |

## Questions Remaining

- **Q2**: Does the false-green guard still fire in a clean env (410 PASS/PARTIAL when daemons connect)?
- **Q3**: Does the evidence TSV reproducibly show `runner:*` SKIP with owning pids?
- **Q4**: Is graph-metadata.json churn pre-existing + operator background rescans, not harness-produced?
- **Q5**: Is SPECKIT_CODE_GRAPH_MAINTAINER_MODE leak sidestepped vs merely hidden?

## Next Focus

Q2: Verify the false-green guard behavior when daemons connect cleanly in substrate-runner-harness.vitest.ts lines 75-83. Specifically: when both daemons connect without live-owner SKIP, does scenario 410 actually execute (PASS or PARTIAL), or does the harness silently skip it?