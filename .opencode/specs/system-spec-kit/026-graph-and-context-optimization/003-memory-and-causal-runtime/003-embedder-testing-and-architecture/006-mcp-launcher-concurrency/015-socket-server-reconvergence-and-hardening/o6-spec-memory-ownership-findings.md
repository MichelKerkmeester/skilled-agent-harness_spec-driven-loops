---
title: "O6 Findings: mk-spec-memory residual launcher-ownership risk (post 014/015)"
description: "Read-only investigation (O6) of whether mk-spec-memory has residual disconnect/wedge/spurious-spawn risk after 014/015. Verdict: 014/015 cover the IPC bridge + liveness probe, but mk-spec-memory still lacks the exclusive owner-lease + respawn-reap discipline that code-index/advisor have. Recommends a dedicated launcher-ownership hardening packet. Not implemented (out of this run's scope)."
trigger_phrases:
  - "o6 spec-memory ownership findings"
  - "spec-memory duplicate owner race"
  - "spec-memory respawn relaunch race"
  - "launcher ownership hardening followup"
importance_tier: "important"
contextType: "general"
---
# O6 Findings — mk-spec-memory residual launcher-ownership risk

<!-- SPECKIT_LEVEL: 1 -->

## Scope & method

Read-only source trace of the launcher coordination layer after 014 (probe-marker spawn guard) + 015 (canonical race-safe `socket-server.ts`), asking: does mk-spec-memory still have a residual disconnect/wedge/spurious-spawn risk under heavy concurrent multi-session use? No code was changed.

## Confirmed covered by 014/015 (non-findings)

- **Probe → no spawn:** `probeModelServer()` sends `X-Speckit-Probe: liveness` (`.opencode/bin/lib/launcher-ipc-bridge.cjs:230-243`); the demand listener honors it before spawning (`.opencode/bin/lib/model-server-supervision.cjs:1204-1217`).
- **Canonical race-safe socket routed through spec-memory:** `context-server.ts:114-119` → `mcp_server/lib/ipc/socket-server.ts:10-16` re-exports `@spec-kit/shared/ipc/socket-server.ts` (ENOENT-safe `canUnlinkExistingSocket`, `:147-178`).

## Findings (recommend a follow-up hardening packet)

| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| O6-1 | P1 (90%) | **Duplicate owner on concurrent cold start.** Lease is checked *before* the bootstrap lock; a loser can skip the lock when artifacts look ready, then both write a self-owned lease and launch. | `mk-spec-memory-launcher.cjs:984-1005` (pre-lock lease check), `:806-842` (loser skips lock), `:1031-1038` (unconditional write/reprobe/launch). Contrast: code-index exclusive heartbeat lease `mk-code-index-launcher.cjs:347-386`; advisor re-checks inside the lock `mk-skill-advisor-launcher.cjs:635-640`. |
| O6-2 | P1 (85%) | **Dead-socket respawn races the owner's scheduled relaunch.** Owner child-exit schedules `setTimeout(launchServer, backoff)` without clearing ownership; a secondary seeing the dead socket can rewrite the lease and `launchServer()` with no relaunch-cancel or lease-revalidation. | `mk-spec-memory-launcher.cjs:875-890`, `:851-873`, `:390-419`. Contrast: code-index reaps the recorded owner before takeover `mk-code-index-launcher.cjs:537-580`. |
| O6-3 | P2 (75%) | **Boot-gap plaintext can corrupt the client MCP stream.** If the lease exists but the socket isn't up yet, `maybeBridgeLeaseHolder()` writes plaintext `LEASE_HELD_BY... (no-bridge-socket)` then a JSON-RPC retryable error — the plaintext is not a JSON-RPC frame. Fail-fast, not a durable wedge, but can corrupt the stream during the owner boot gap. | `launcher-ipc-bridge.cjs:338-353`, `mk-spec-memory-launcher.cjs:989-1004`. |

## Verdict

mk-spec-memory is **not fully covered** by 014/015. The IPC/probe layer is sound; the gap is **launcher ownership**. Recommended follow-up packet (3 concrete changes): (1) add an exclusive/heartbeat owner lease or serialize lease-write/reprobe inside the bootstrap lock; (2) make `launchServer()` fail closed unless the current lease still belongs to the caller; (3) on dead-socket respawn, terminate/cancel the recorded owner launcher before a secondary takes over. Source: read-only investigation lane A2 (gpt-5.5), takeover session 2026-06-05.
