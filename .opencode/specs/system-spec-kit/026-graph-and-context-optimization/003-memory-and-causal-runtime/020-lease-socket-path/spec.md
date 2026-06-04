---
title: "Feature Specification: Lease Socket-Path Persistence"
description: "Store the daemon owner's ACTUAL IPC socket path in the mk-spec-memory lease file and make the launcher bridge PREFER that stored path over recomputing one from env. Closes the deferred item (c) from packet 018: a secondary launcher under a divergent SPECKIT_IPC_SOCKET_DIR (worktree env) recomputes a socket path the owner does not listen on, fails fs.existsSync, and false-reports 'no-bridge-socket' instead of bridging to the live daemon. Schema change is additive/optional; old leases without socketPath keep working via a recompute fallback."
trigger_phrases:
  - "lease socket path"
  - "no-bridge-socket worktree divergence"
  - "ipc socket dir mismatch lease"
  - "prefer stored socket path bridge"
  - "secondary launcher cannot bridge"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/020-lease-socket-path"
    last_updated_at: "2026-06-04T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented lease.socketPath + bridge prefer-fallback; tests green"
    next_safe_action: "Deploy on next launcher spawn"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Schema is additive/optional: leases without socketPath fall back to env recompute, so the other two launchers (skill-advisor, code-index) are unaffected."
      - "socketPath is written ONLY into mk-spec-memory's lease; the shared read/prefer logic is generic with a fallback."
---
# Feature Specification: Lease Socket-Path Persistence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This packet closes defect **(c)**, deferred as a follow-up in packet 018 (front-proxy recycle hardening).

When a secondary `mk-spec-memory` launcher finds a live lease, it bridges its client stdio to the owner's IPC socket. To locate that socket it **recomputes** the path from env via `getIpcSocketPath('mk-spec-memory', { dbDir })`, which prefers `SPECKIT_IPC_SOCKET_DIR` when set. If the secondary launcher runs under a **different** `SPECKIT_IPC_SOCKET_DIR` than the owner (a worktree-env divergence), the recompute yields a path the owner is *not* listening on. The `fs.existsSync(socketPath)` guard in `maybeBridgeLeaseHolder` then fails and the launcher writes `LEASE_HELD_BY:… (no-bridge-socket)` — reporting a dead bridge even though the daemon is alive and reachable at the path the owner actually opened.

### Purpose
Persist the owner's *actual* listening socket path in the lease at write time, and make the bridge **prefer** that stored path (when it still exists on disk) over the env recompute. This removes the divergence while keeping the change additive: leases that predate the field, and the other two launchers whose leases never carry it, fall back to the existing recompute behavior unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `model-server-supervision.cjs` — `buildLeaseObject` accepts + emits an optional `socketPath` field, additive, same guard style as the existing optional `childPid`/`modelServerPid` fields.
- `mk-spec-memory-launcher.cjs` — `buildLeaseObject` wrapper + `writeLeaseFile` pass the owner's resolved IPC socket path (`resolveSessionProxySocketPath()`) into the lease; `leaseHeldFromFile` surfaces `lease.socketPath` onto the returned lease-result object.
- `launcher-ipc-bridge.cjs` — `maybeBridgeLeaseHolder` prefers `leaseResult.socketPath` when present AND (tcp:// OR `fs.existsSync`), falling back to `getIpcSocketPath(...)` only when the lease has no usable stored path. The `tcp://` and `no-bridge-socket` branches stay intact.
- Unit tests proving: lease carries socketPath; bridge prefers stored path; legacy lease bridges via recompute; no-socketPath lease (skill-advisor/code-index style) is unaffected.

### Out of Scope
- Changing the bridge/respawn happy paths, the `tcp://` endpoint handling, or the probe/liveness logic.
- Writing `socketPath` into the `mk-skill-advisor` or `mk-code-index` leases (they keep recomputing; the shared read logic must leave them untouched).
- Any dist rebuild or daemon recycle — the change is `.cjs`-only and activates on the next launcher spawn.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: A freshly written `mk-spec-memory` lease records the owner's actual IPC socket path under an additive `socketPath` field.
- R2: A lease *without* `socketPath` (legacy mk-spec-memory writes; every skill-advisor / code-index lease) omits the field entirely; existing readers and the recompute fallback are unaffected.
- R3: When the lease carries a `socketPath` that still exists on disk (or is a `tcp://` endpoint), the bridge uses it instead of the env recompute, even when the recompute would resolve a divergent directory.
- R4: When the stored path is absent or no longer on disk, the bridge falls back to `getIpcSocketPath(...)` and preserves the existing `no-bridge-socket` / `tcp://` behavior.
- R5: The launcher/lease/ipc-bridge suites stay green; new socketPath unit tests pass; all three `.cjs` files syntax-check clean.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `buildLeaseObject(..., socketPath)` emits `socketPath` when a non-empty string is supplied and omits the key entirely otherwise (unit-tested).
- **SC-002**: `maybeBridgeLeaseHolder` bridges to the stored `socketPath` (distinct from a divergent recompute target) when it exists, and falls back to the recomputed path for a legacy / no-socketPath lease (unit-tested both ways).
- **SC-003**: `node --check` clean on all three `.cjs` files; launcher-lease, launcher-ipc-bridge, launcher-ipc-bridge-probe, launcher-recycle-lease, and launcher-session-proxy suites green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stored path leaks into a shared helper that the other two launchers use to read leases | They start preferring a socketPath they never wrote | The read/prefer logic is generic with a fallback; skill-advisor/code-index leases never carry `socketPath`, so `usableStoredSocketPath` is null → recompute path, unchanged. Covered by a dedicated test. |
| Risk | A stale stored path (owner moved/recycled) points at a dead socket | Bridge to a dead path | The prefer guard requires `fs.existsSync` for UDS paths; a missing stored path falls back to recompute (which re-applies the same existence + probe gates). |
| Risk | Old lease files without `socketPath` | Read returns undefined | `leaseHeldFromFile` normalizes a missing/empty value to `null`; the bridge treats null as "no stored path" → recompute. |
| Dependency | `resolveSessionProxySocketPath()` already resolves the owner's path | — | Reused as-is; it wraps `getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() })`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved during implementation: the schema is additive/optional (leases without `socketPath` fall back to recompute), `socketPath` is written only into mk-spec-memory's lease, and the shared bridge read/prefer logic is generic with a fallback so skill-advisor and code-index are unaffected. No open questions remain.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The prefer-stored-path check adds only one `fs.existsSync` stat to a path the bridge already had to stat; no measurable latency change on the bridge hot path.

### Security
- **NFR-S01**: The stored path is validated as a non-empty string and (for UDS) must exist on disk before use; it is only ever used as a socket connection target the owner already opened, never executed or written.

### Reliability
- **NFR-R01**: A stale or missing stored path must always degrade to the previous recompute behavior (no new failure mode introduced for any launcher).
- **NFR-R02**: Old leases without the field and the other two launchers' leases must remain fully readable and unaffected.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/whitespace `socketPath`: normalized to `null` at read, treated as "no stored path" → recompute.
- Absent `socketPath` key (legacy lease): `undefined` → `null` → recompute.

### Error Scenarios
- Stored UDS path no longer on disk (owner recycled/moved): `fs.existsSync` fails → recompute fallback (which re-applies existence + probe gates).
- Stored `tcp://` endpoint: existence check is bypassed; preferred as-is.

### State Transitions
- Owner rewrites the lease after a socket move: the stored path self-corrects on the next write.
- Secondary launcher reads a lease written before this change: no field → recompute, identical to prior behavior.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | ~35 LOC across 3 `.cjs` files + 1 test file; additive field |
| Risk | 12/25 | Shared builder/bridge used by 3 launchers; mitigated by generic-read-with-fallback + dedicated test |
| Research | 4/20 | Defect already root-caused in packet 018; surfaces pre-identified |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
