---
title: "Changelog: 006-mcp-launcher-concurrency (single-writer enforcement across 3 MCP launchers)"
description: "Consolidated plain-English changelog for the 13-phase arc that fixed concurrent daemon corruption, propagated single-writer enforcement across mk-skill-advisor, mk-code-index and mk-spec-memory launchers and shipped the multi-client stdio-socket bridge that lets secondary launchers attach to the primary daemon instead of failing with LEASE_HELD_BY errors."
trigger_phrases:
  - "006-mcp-launcher-concurrency changelog"
  - "mcp launcher concurrency arc changelog"
  - "016/006 consolidated changelog"
  - "launcher lease arc changelog"
  - "stdio socket bridge changelog"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

# Changelog: 006-mcp-launcher-concurrency

> Plain-English changelog covering all 13 sub-phases of the MCP launcher concurrency arc. Read this if you want to understand what shipped without diving into the launcher CJS files.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/` (phase parent, 13 sub-phases)
>
> **Stack:** Three MCP (model context protocol) launchers (`mk-skill-advisor-launcher.cjs`, `mk-code-index-launcher.cjs`, `mk-spec-memory-launcher.cjs`) plus the daemon servers they spawn, the shared lease helpers and the stdio-socket bridge.
>
> **Note:** This arc was renumbered from 012 to 006 on 2026-05-18.

---

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/` (Phase Parent)

### Summary

The three MCP launchers all shared the same architectural smell. Nothing prevented multiple launcher instances from running concurrently in the same workspace. Skill-advisor's SQLite quarantine path turned that smell into a visible failure with 1005 `.corrupt` files generated in 6 hours during a benchmark run. Code-graph and spec-memory absorbed the same race silently because their WAL (write-ahead log) plus `busy_timeout` settings happened to mask the symptom, but the same failure class could have triggered under different load conditions. This arc fixed the smell at its source by enforcing single-writer leases at the launcher process boundary and propagating the fix uniformly across all three launchers through 13 focused phases.

The arc delivered two lease invariants future maintainers must preserve. **Invariant 1a** is the inline PID-file lease used by code-graph and spec-memory launchers, which write atomic temp-file-plus-rename PID guards and only proceed if no live owner exists. **Invariant 1b** is the daemon SQLite lease used by skill-advisor, which probes the lease database before opening the skill-graph DB. The arc also delivered `realpath` canonicalization to prevent symlink or alias confusion, the `clearLeaseFile`-before-signal-mirror ordering to prevent race conditions and a multi-client stdio-socket bridge that allows secondary launchers to attach to the primary daemon instead of failing with LEASE_HELD_BY errors.

Review-driven hardening closed 22 P1 findings across race windows, signal coverage, EPERM (permission-denied) handling and test isolation. The arc closed with all 12 implementation phases shipped (001 through 012) plus one planned follow-on (013-launcher-lease-acquisition-reclaim) for the dead-PID auto-reclaim gap surfaced by 011.

### Included Phases

| Phase | Slug | Status | Shipped |
|---|---|---|---|
| 001 | [concurrent-daemon-corruption-fix](./001-concurrent-daemon-corruption-fix/) | Complete | 2026-05-18 |
| 002 | [cross-launcher-lease-propagation](./002-cross-launcher-lease-propagation/) | Complete | 2026-05-18 |
| 003 | [launcher-race-and-error-surface-hardening](./003-launcher-race-and-error-surface-hardening/) | Complete | 2026-05-18 |
| 004 | [launcher-diagnostics-and-signal-coverage](./004-launcher-diagnostics-and-signal-coverage/) | Complete | 2026-05-18 |
| 005 | [lease-correctness-and-arc-traceability](./005-lease-correctness-and-arc-traceability/) | Complete | 2026-05-18 |
| 006 | [lease-canonicalization-and-cleanup-ordering](./006-lease-canonicalization-and-cleanup-ordering/) | Implementation Complete | 2026-05-18 |
| 007 | [skill-advisor-zombie-launcher-fix](./007-skill-advisor-zombie-launcher-fix/) | Complete | 2026-05-18 |
| 008 | [launcher-race-window-and-debug-log-hygiene](./008-launcher-race-window-and-debug-log-hygiene/) | Complete | 2026-05-18 |
| 009 | [launcher-eperm-parity-fix](./009-launcher-eperm-parity-fix/) | Complete | 2026-05-18 |
| 010 | [multi-client-stdio-socket-bridge](./010-multi-client-stdio-socket-bridge/) | Complete | 2026-05-19 |
| 011 | [sun-path-and-stale-lease-followups](./011-sun-path-and-stale-lease-followups/) | Complete | 2026-05-20 |
| 012 | [daemon-bridge-socket-for-skill-advisor-and-code-index](./012-daemon-bridge-socket-for-skill-advisor-and-code-index/) | Complete | 2026-05-20 |
| 013 | [launcher-lease-acquisition-reclaim](./013-launcher-lease-acquisition-reclaim/) | Planned (scaffold only) | not yet |

### Added

#### Single-writer lease in skill-advisor (001)

Before this work, multiple skill-advisor daemons could open the same SQLite file at the same time and corrupt it. Phase 001 introduced an `isLeaseHeld()` helper that probes for a live PID owner before any database open, prints `LEASE_HELD_BY:<pid>` and exits with code 0 if one exists. Every database open now sets WAL `journal_mode` plus a 5-second `busy_timeout` with an EACCES (permission-denied) fallback to `journal_mode=DELETE` for read-only filesystems. The combined effect eliminated the `.corrupt` quarantine pathway that produced 1005 files in 6 hours under the multi-daemon regime.

&nbsp;

#### Cross-launcher lease propagation (002)

Phase 001 fixed skill-advisor. Phase 002 propagated the same launcher-boundary single-writer enforcement to code-graph and spec-memory. Both launchers now write inline PID files via atomic temp-file-plus-rename, clean up on `SIGTERM`/`SIGINT`/`exit` and respect env-var gates (`MK_CODE_INDEX_STRICT_SINGLE_WRITER`, `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER`). Spec-memory's `SIGTERM` handler forwards the signal to its child context-server before clearing the lease.

&nbsp;

#### Multi-client stdio-socket bridge (010)

Before this phase, a secondary launcher invocation (e.g. when OpenCode plugin and Claude Code both wanted to use the same MCP) had to either wait or exit with `LEASE_HELD_BY` garbage. Phase 010 added a shared bridge helper at `.opencode/bin/lib/launcher-ipc-bridge.cjs` that resolves `daemon-ipc.sock`, supports a rollback flag and pipes stdio to the lease holder. Spec-memory got a multi-client socket server at `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` with mode `0600`, stale-socket retry, bounded secondary clients, lifecycle logging, message counters and cleanup. Spec-memory's MCP handler registration was refactored so each secondary connection gets an equivalent `Server` instance. Three env vars (`SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_MAX_SECONDARY_CLIENTS`, `SPECKIT_IPC_SOCKET_DIR`) were documented in `ENV_REFERENCE.md`.

&nbsp;

#### Daemon bridge sockets for skill-advisor and code-graph (012)

Phase 010 wired the bridge for spec-memory. Phase 012 closed the daemon-side gap for the other two MCPs. `socket-server.ts` was copied to skill-advisor and code-graph packages. Both daemon entrypoints (`advisor-server.ts` and `system-code-graph/mcp_server/index.ts`) were refactored to a factory pattern plus IPC bridge socket binding after stdio connect. Code-graph also gained `SIGTERM` plus `SIGINT` handlers it had been missing. Skill-advisor's launcher `CHILD_ENV_ALLOWLIST` got three new env vars so the spawned child sees the runtime-config pin.

&nbsp;

#### Skill-advisor zombie launcher fix (007)

A regression surfaced where three `mk-skill-advisor-launcher` processes could survive while only one daemon writer was active. Root cause was that skill-advisor never wrote a PID file as a live guard, it only probed the daemon SQLite lease which is acquired inside the child after startup scan work. Phase 007 added the missing launcher-boundary PID guard. The launcher now checks a live `.mk-skill-advisor-launcher.json` owner before consulting the daemon SQLite lease, serializes the pre-spawn acquisition window with the bootstrap lock, writes its own PID guard before `launchServer()`, re-probes ownership and only then starts `advisor-server.js`.

### Changed

#### Lease hardening from 3-reviewer audit (003)

The 3-reviewer audit of packets 001 and 002 returned 9 P1 findings. Phase 003 closed all 9 in one cleanup. Launchers re-probe lease ownership after writing to catch fast double-spawn races. `SIGTERM` handlers wait for child exit before clearing leases in spec-memory. The env-var helper accepts `0`, `false`, `FALSE`, `False`, `no`, `off` and empty string as disabled values. `EPERM` is treated as lease-held in `isLeaseHeld()`. `busy_timeout` is set before the `journal_mode=WAL` switch (not after, which left the riskiest moment uncovered). The `EACCES` predicate widens to match SQLite `READONLY`, `CANTOPEN` and `IOERR_WRITE` error codes. Test isolation tightens with stdout-close gates and host-env stripping. Skill-advisor gains a subprocess-level test mirroring the shape of phase 002's tests.

&nbsp;

#### Diagnostics and signal coverage (004)

Operators now see `LEASE_HELD_BY:<pid> startedAt=<iso>` diagnostics. `SIGQUIT` and crash cleanup coverage is tighter. Readonly lease probes no longer mutate schema. SQLite integrity checks wait up to 5 seconds before `quick_check`. The `DELETE`-mode fallback now logs the concurrency cost. Test coverage discriminates stale-reclaim from clean-exit behaviour. Code-index no longer writes a diagnostic state payload to the same path it uses as its lease file (a collision that had snuck through 002).

&nbsp;

#### Lease canonicalization and cleanup ordering (005, 006)

Phase 005 closed 13 P1 deep-review findings across arc documentation, launcher lease correctness, SQLite fallback handling and verification evidence. The launcher lease boundary follows the resolved database directory where overrides can redirect storage. The SQLite WAL fallback predicate is resilient to base plus extended result codes. Phase 006 closed the remaining load-bearing lease gaps. Lease ownership follows canonical filesystem identity via `realpathSync.native()` so symlinks cannot trick the probe. Live legacy owners block rolling-start duplicates with `(legacy path)` diagnostics. Launchers clear leases before any child signal mirror can terminate the parent. Inline lease files use `0600` permissions. Owned lease or DB directories use `0700`. Skill-advisor's lease DB `chmod`s to `0600`. The arc parent invariant splits into 1a (inline PID-file leases) and 1b (skill-advisor daemon SQLite lease DB) so future maintainers can reason about each path independently.

&nbsp;

#### Race-window tightening and debug-log hygiene (008)

Single-file edit on `mk-skill-advisor-launcher.cjs` closing two P2 findings from the 007 deep-review. `writeLeaseFile()` plus the re-probe relocated inside the `if (lockHeld)` block so the bootstrap-lock critical section visually equals the actual lock-held region. A new `debug(message)` helper gated on `MK_SKILL_ADVISOR_DEBUG === '1'` routes four log sites that previously emitted stacks or paths. Two specific lines (384 and 478) keep actionable `log()` summaries so operators still see when something fails.

&nbsp;

#### EPERM parity fix (009)

Phase 003 had given skill-advisor an `EPERM` handler. Phase 009 propagated it to spec-memory and code-graph launchers via two single-line additions in `leaseHeldFromFile()` that treat `EPERM` as lease-held (process exists but the probe lacks permission, as inside a sandbox). The change is byte-equivalent to skill-advisor's pattern.

&nbsp;

#### macOS sun_path pin and stale-lease recovery (011)

Intermittent MCP handshake failures were tracing back to Unix socket paths overflowing the macOS `sun_path` 104-byte limit. Phase 011 pinned `SPECKIT_IPC_SOCKET_DIR` to short `/tmp/<service>` directories in four runtime config files (`.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`). It also documented the manual lease-clear recipe operators use to recover from stale leases after non-clean shutdowns and backfilled the arc parent with 6 missing phase-map rows and 4 missing `children_ids`.

### Fixed

- **Concurrent daemon corruption** that produced 1005 `.corrupt` files in 6 hours on skill-advisor (001).
- **Silent multi-daemon races** in code-graph and spec-memory that WAL plus `busy_timeout` masked but did not fix (002).
- **Fast double-spawn race window** via re-probe after lease write (003).
- **Slow child shutdown in spec-memory** via `SIGTERM` child-exit handler (003).
- **EPERM misinterpreted as stale lease** across all launchers (003 then propagated by 009).
- **Env-var helper rigidity** that accepted only `0` as a disabled value (003).
- **WAL pragma set after `busy_timeout`** leaving the riskiest moment uncovered (003).
- **`EACCES` predicate** missing SQLite `READONLY` and extended error codes (003).
- **Test isolation leakage** via host-env stripping and stdout-close gates (003).
- **Skill-advisor zombie launcher** via the missing parent PID guard (007).
- **macOS `sun_path` 104-byte limit** causing socket bind failures (011).
- **Missing daemon-side bridge sockets** for skill-advisor and code-graph (012).
- **Code-index state file collision** with lease file path (004).
- **Signal-handler parity gaps** for `SIGQUIT` and `uncaughtException` (004, 005).
- **Lease cleanup ordering** before signal mirror to prevent parent termination (005, 006).

### Verification

- **Typecheck** passes across all three packages (skill-advisor, code-graph, spec-memory) in every phase that touched TS source.
- **Vitest `launcher-lease` suites** in all three MCPs cover spawn-twice, stale reclaim and env-var disable. Phase 005 reports 17+7+6=30 tests across the three packages.
- **Vitest `launcher-bootstrap` suite** in skill-advisor covers WAL pragma assertions across 6 tests.
- **Vitest `launcher-ipc-bridge` suite** in spec-memory covers socket server behaviour across 8 tests.
- **Manual spawn-twice probes** confirm exit code 0 and `LEASE_HELD_BY` diagnostics on every launcher.
- **Smoke probes** confirm bridge socket binding and secondary attachment with canonical diagnostics.
- **Strict spec validation** passes for the arc parent and every shipped child packet.
- **24-hour zero-zombie soak** and **24-hour zero-corrupt soak** are operator-deferred. Both are listed in the arc invariants as the durable proof points but neither has been collected on this machine yet.

### Files Changed

| Area | File | What changed |
|---|---|---|
| Launcher CJS | `.opencode/bin/mk-skill-advisor-launcher.cjs` | Lease check, PID guard, env-var helper, debug routing, bridge wiring, cleanup handlers |
| Launcher CJS | `.opencode/bin/mk-code-index-launcher.cjs` | PID-file lease, env-var helper, EPERM parity, bridge wiring, cleanup handlers |
| Launcher CJS | `.opencode/bin/mk-spec-memory-launcher.cjs` | PID-file lease, child signal forwarding, env-var helper, EPERM parity, bridge wiring, cleanup handlers |
| Shared bridge | `.opencode/bin/lib/launcher-ipc-bridge.cjs` | New shared helper for socket resolution and stdio piping (010) |
| Skill-advisor lease | `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | `isLeaseHeld()` helper, EPERM, canonical path resolution, legacy probes, secure permissions |
| Skill-graph DB | `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | WAL pragma ordering, widened EACCES predicate, busy_timeout placement |
| SQLite integrity | `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/sqlite-integrity.ts` | `busy_timeout=5000` before `quick_check` |
| Daemon servers | `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Factory pattern and IPC bridge socket binding (012) |
| Daemon servers | `.opencode/skills/system-code-graph/mcp_server/index.ts` | Factory pattern, bridge binding, new signal handlers (012) |
| Socket server | `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` | New multi-client socket server (010) |
| Socket server | `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Socket server copy (012) |
| Socket server | `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Socket server copy (012) |
| Tests | `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | WAL pragma tests (001) |
| Tests | `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Subprocess lease tests (003, 007, 008) |
| Tests | `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Spawn-twice tests (002) |
| Tests | `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Spawn-twice tests (002) |
| Tests | `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts` | Bridge tests (010) |
| Reference docs | `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Launcher enforcement and canonical DB-dir docs |
| Reference docs | `.opencode/skills/system-code-graph/references/launcher-lease.md` | Code-graph PID-file lease reference (002) |
| Reference docs | `.opencode/skills/system-spec-kit/references/launcher-lease.md` | Spec-memory PID-file lease reference (002) |
| Reference docs | `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | sun_path limit documentation (011) |
| Reference docs | `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Socket path documentation (011) |
| Runtime configs | `.mcp.json` | `SPECKIT_IPC_SOCKET_DIR` pin (011) |
| Runtime configs | `opencode.json` | `SPECKIT_IPC_SOCKET_DIR` pin (011) |
| Runtime configs | `.gemini/settings.json` | `SPECKIT_IPC_SOCKET_DIR` pin (011) |
| Runtime configs | `.codex/config.toml` | `SPECKIT_IPC_SOCKET_DIR` pin (011) |

### Follow-Ups

- **Phase 013 has not shipped.** The launcher-lease-acquisition-reclaim packet is a pre-implementation scaffold. The dead-PID auto-reclaim gap surfaced in 011 REQ-006 is still open. Acquisition-time atomic reclaim would mean operators no longer need the manual lease-clear recipe to recover from a stale lease after a non-clean shutdown.
- **24-hour zero-zombie soak** has not been collected. Multiple phase implementation-summaries list this as the durable proof point but the soak is operator-deferred on this machine. A single ~24-hour idle run with `MK_*_STRICT_SINGLE_WRITER=1` followed by `ps` and `lsof` snapshots would close the gap.
- **24-hour zero-corrupt soak** has not been collected. Same status as the zero-zombie soak. The original 1005 `.corrupt` files in 6 hours signal needs the corresponding zero-corrupt 24-hour signal to confirm the fix is durable across long-running benchmark loads.
- **Live Unix-socket probe** was blocked by sandbox `EPERM` in phase 010 verification. A clean live test of the multi-client bridge under real OpenCode plus Claude Code dual-attach should run outside the sandbox to confirm the lifecycle and message counters.
- **Cross-launcher LEASE_HELD_BY parity grep** should be added to CI. Phase 002 documented this as a manual check. A line-count comparison across the three launcher CJS files would catch any drift introduced by future edits.
- **EPERM handler unit test.** Phase 009 was a byte-equivalent two-line propagation with no new test. A small vitest covering `leaseHeldFromFile()` returning lease-held when `errno=EPERM` would prevent regression.
