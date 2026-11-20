---
title: "Daemon Lifecycle and Health Reporting"
description: "Daemon boot, shutdown, SIGTERM handling and health reporting that make daemon state observable without coupling readers to writer state."
trigger_phrases:
  - "daemon lifecycle"
  - "daemon boot shutdown"
  - "sigterm daemon"
  - "daemon health"
version: 0.8.3.0
---

# Daemon Lifecycle and Health Reporting

## 1. OVERVIEW

Give operators a predictable daemon lifecycle: graceful boot, graceful SIGTERM shutdown and always-available health reporting exposed through `advisor_status`.

---

## 2. HOW IT WORKS

`lib/daemon/lifecycle.ts` orchestrates daemon boot by acquiring the workspace lease, starting the watcher, warming freshness state and exposing `trustState` to readers. Shutdown responds to SIGTERM, flushes any pending reindex, releases the lease and drains the watcher. `advisor_status` returns `generation`, `skillCount`, `lastScanAt`, `trustState` and `laneWeights` regardless of whether the daemon has a live writer.

The advisor daemon also participates in the shared launcher idle-timeout guardrail. `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` defaults to `30`, accepts fractional values for tests, and `0` disables the monitor. Stdio and IPC socket connect/data/write activity refresh the idle timer so active secondary clients keep the server alive.

The advisor server exits within 30 seconds when its launcher dies and its parent PID changes. The launcher passes its own PID when it spawns the server, so a launcher that dies while the server is still starting is caught too. After opening its database, it starts writing `advisor-server.heartbeat` near the top of startup. It rewrites the file every 15 seconds. The launcher checks every 60 seconds. A heartbeat file older than the server start does not count. If no heartbeat arrives within 5 minutes after spawn, the server is stale. If an existing heartbeat is older than 3 minutes, the launcher sends SIGTERM and then SIGKILL after 5 seconds. When more than two check intervals pass between the launcher's own checks, as across a machine sleep, it skips that check, so the server gets one interval to write before the file is judged. Heartbeat checks use no IPC traffic, so the 30-minute idle exit still works.

After startup IPC is ready, the server starts a shared background refresh without awaiting it. Each watcher reindex starts the same refresh. It checks skill and command vector coverage locally, then probes Ollama once with a 500 ms timeout when coverage is incomplete. Coverage requires at least one embeddable skill, so a command-only index can reach the probe even when its command vectors are current. The refresh runs at any lane weight and can be disabled with `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=off`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/lifecycle.ts` | Daemon | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/lib/ipc/launcher-idle-timeout.ts` | IPC lifecycle | Shared idle-timeout monitor |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Automated test | status envelope assertions |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-freshness-foundation.vitest.ts` | Automated test | boot and shutdown sequence |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-idle-timeout.vitest.ts` | Automated test | idle timeout parsing and shutdown behavior |
| `Playbook scenario [AU-003](../../manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md).` | Manual playbook | Source reference |

---

## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `daemon-and-freshness/lifecycle.md`

Related references:

- [02-lease.md](./lease.md).
- [05-trust-state.md](../../feature-catalog/daemon-and-freshness/trust-state.md).
- [07-cache-invalidation.md](../../feature-catalog/daemon-and-freshness/cache-invalidation.md).
