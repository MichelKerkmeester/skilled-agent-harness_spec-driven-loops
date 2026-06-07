---
title: "bin/lib: Launcher Support Libraries"
description: "Shared CommonJS helpers for MCP launcher supervision, stdio-to-socket bridging and sidecar env allowlisting."
trigger_phrases:
  - "model server supervision"
  - "launcher ipc bridge"
  - "sidecar env allowlist"
---

# bin/lib: Launcher Support Libraries

## 1. OVERVIEW

`bin/lib/` holds the shared CommonJS helpers that the MCP launchers in `bin/` require. It supervises the lifetime of the hf-model-server, bridges launcher stdio to a running daemon socket, reconnects that bridge transparently across daemon recycles, and constrains the environment passed to the embedding sidecar.

Current state:

- `model-server-supervision.cjs` owns crash-loop guarding, RSS watchdog, respawn-lock liveness, listener re-arm, and reaping the process tree (including the root) when the model server is idle-evicted.
- `launcher-ipc-bridge.cjs` resolves per-service socket paths, probes daemon and model-server health (retrying the lease-holder probe a configurable number of times before reaping a slow-but-alive owner), and bridges stdin/stdout to the live socket so a second launcher hands off to the lease holder.
- `launcher-session-proxy.cjs` fronts the daemon with a reconnecting stdin/stdout bridge that reattaches and replays in-flight read frames across a daemon recycle, and exposes the `createClassifyFrame` factory each launcher uses to declare its own replayable and unsafe tool sets.
- `sidecar-env-allowlist.cjs` is a tiny frozen allowlist that decides which env keys may cross into the embedding sidecar process.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            bin/lib/                              │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────────┐
│ bin/mk-*-launcher.cjs│
└──────────┬───────────┘
           │ require
           ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ model-server-supervision.cjs │   │ launcher-ipc-bridge.cjs      │
│ spawn + watchdog + respawn   │   │ socket resolve + probe + pipe│
└──────────────┬───────────────┘   └──────────────┬───────────────┘
               │                                   │
               ▼                                   ▼
       ┌───────────────┐                   ┌───────────────┐
       │ hf-model-     │                   │ live daemon   │
       │ server child  │                   │ UDS / TCP     │
       └───────────────┘                   └───────────────┘

       ┌──────────────────────────────┐
       │ sidecar-env-allowlist.cjs    │  (consulted before spawning sidecar)
       └──────────────────────────────┘
```

---

## 3. DIRECTORY TREE

```text
lib/
+-- model-server-supervision.cjs   # hf-model-server lifecycle: spawn, watchdog, respawn, reap
+-- launcher-ipc-bridge.cjs        # Socket path resolution, health probes, lease-probe retry, stdio bridging
+-- launcher-session-proxy.cjs     # Reconnecting stdio-to-daemon proxy: replay + createClassifyFrame factory
+-- sidecar-env-allowlist.cjs      # Frozen env-key allowlist for the embedding sidecar
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `model-server-supervision.cjs` | Builds the model-server supervisor: process-tree RSS sampling, crash-loop backoff, RSS watchdog, respawn-lock liveness, descendant snapshotting, give-up cooldown, socket-dir ownership and SUN_PATH limit assertions, and reaping the process tree root on idle eviction. |
| `launcher-ipc-bridge.cjs` | Resolves the per-service IPC socket path, probes daemon and model-server health over JSON-RPC and HTTP, retries the lease-holder probe (`probeLeaseHolderWithRetries` / `resolveLeaseProbeAttempts`) so a slow-but-alive owner is not false-reaped, and bridges launcher stdio to the socket so a non-owning launcher defers to the lease holder. |
| `launcher-session-proxy.cjs` | Fronts the daemon with a reconnecting stdin/stdout bridge that reattaches across a daemon recycle and replays in-flight read frames, and exports the `createClassifyFrame({ replayableToolNames, unsafeToolNames })` factory each launcher passes its own replay set to. |
| `sidecar-env-allowlist.cjs` | Exports `SIDECAR_ENV_ALLOWLIST` and `isAllowedSidecarEnvKey`; only exact keys (`HOME`, `LANG`, `PATH`, `PYTORCH_ENABLE_MPS_FALLBACK`, `TEMP`, `TMP`, `TMPDIR`, `TRANSFORMERS_OFFLINE`) and prefixes (`HF_`, `LC_`, `SPECKIT_`) cross into the sidecar. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | All three modules depend only on Node core (`fs`, `net`, `http`, `path`, `child_process`). No third-party packages. |
| Exports | Each file uses `module.exports`. Launchers in `bin/` import these; nothing here imports a launcher. |
| Ownership | This folder owns model-server lifecycle, IPC bridging and the sidecar env allowlist. It does not own MCP request handling or per-server build logic, which live in each launcher and skill. |

Main flow (supervision):

```text
╭──────────────────────────────────────────╮
│ launcher requests a live model server    │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ probe socket via launcher-ipc-bridge     │
└──────────────────────────────────────────┘
                  │ (absent or dead)
                  ▼
┌──────────────────────────────────────────┐
│ acquire respawn lock, check liveness     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ spawn child, start RSS watchdog          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ on idle evict: reap process tree root    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ launcher proceeds with a healthy server  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `createModelServerSupervisor` | Function | Construct the supervisor that spawns and watches the hf-model-server. |
| `startRssWatchdog` | Function | Sample the child process tree RSS and act on sustained breaches. |
| `reapProcessTreeGroups` | Function | Terminate the model-server process tree, including the root, on shutdown or idle eviction. |
| `maybeBridgeLeaseHolder` | Function | Bridge launcher stdio to an existing lease holder instead of spawning a duplicate. |
| `probeLeaseHolderWithRetries` | Function | Probe the lease holder with bounded retries so a slow-but-alive owner is not false-reaped before a sibling respawns. |
| `createSessionProxy` | Function | Build the reconnecting stdin/stdout proxy that reattaches and replays in-flight read frames across a daemon recycle. |
| `createClassifyFrame` | Function | Build a per-server frame classifier from a replayable and unsafe tool set, deciding which frames are safe to replay. |
| `probeDaemon` / `probeModelServer` | Function | Health-check the MCP daemon socket and the model server endpoint. |
| `isAllowedSidecarEnvKey` | Function | Decide whether an env key may pass into the embedding sidecar. |

---

## 7. VALIDATION

Run from the repository root.

```bash
node -e "require('./.opencode/bin/lib/model-server-supervision.cjs')"
node -e "require('./.opencode/bin/lib/launcher-ipc-bridge.cjs')"
node -e "require('./.opencode/bin/lib/launcher-session-proxy.cjs')"
node -e "require('./.opencode/bin/lib/sidecar-env-allowlist.cjs')"
```

Expected result: each module loads without throwing.

---

## 8. RELATED

- [`bin/`](../README.md)
- [`hf-model-server.cjs`](../hf-model-server.cjs)
