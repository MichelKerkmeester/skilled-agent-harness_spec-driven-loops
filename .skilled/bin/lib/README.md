---
title: "bin/lib: Launcher Support Libraries"
description: "Shared CommonJS helpers for launcher stdio-to-socket bridging and the compiled-routing serving surface."
trigger_phrases:
  - "launcher session proxy"
  - "launcher ipc bridge"
  - "compiled routing serving surface"
---

# bin/lib: Launcher Support Libraries

## 1. OVERVIEW

`bin/lib/` holds two unrelated groups. The first is the shared CommonJS helpers that the MCP launchers in `bin/` require: it bridges launcher stdio to a running daemon socket and reconnects that bridge transparently across daemon recycles. The second is the compiled-routing serving surface: the activation-manifest library, the runtime-generation selector, and the generated closure the routing hot path loads.

Current state:

- `launcher-session-proxy.cjs` fronts the daemon with a reconnecting stdin/stdout bridge that reattaches and replays in-flight read frames across a daemon recycle, and exposes the `createClassifyFrame` factory each launcher uses to declare its own replayable and unsafe tool sets.

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
┌──────────────────────────────┐
│ launcher-ipc-bridge.cjs      │
│ socket resolve + probe + pipe│
└──────────────┬───────────────┘
               │
               ▼
       ┌───────────────┐
       │ live daemon   │
       │ UDS / TCP     │
       └───────────────┘
```

---

### Compiled routing

- `compiled-route-manifest.cjs` is the activation-manifest library. It mints and refreshes a hub's manifest, answers whether that manifest still matches what the hub's routing inputs compile to, and holds a writer lease so a manifest write cannot race a runtime publication. The 89-line `bin/compiled-route-manifest.cjs` is a CLI over this module, not a second copy of it.
- `compiled-route-layout.cjs` resolves which internal generation a runtime root serves. It accepts one complete generation and refuses a root that mixes two, so a probe never reads one generation's activation state through another generation's resolver. It also exports `AUTHORED_PROGRAM_DIR`, the path of the spec packet that holds the authored routing manifest, which the pre-commit hook, the route guard and the sync tool all read.
- `compiled-routing/` is **generated output**, not source. `compiled-route-sync.cjs` traces the runtime closure from an authored resolver, stages a candidate, verifies every hub against it, and renames it over this directory. Anything written here by hand is erased by the next publication and cannot be promoted back, because only files the trace touches are copied. Change the authored program directory under `specs/` instead, then republish. The directory carries no README for the same reason.

---

## 3. DIRECTORY TREE

```text
lib/
+-- launcher-ipc-bridge.cjs        # Socket path resolution, health probes, lease-probe retry, stdio bridging
+-- launcher-session-proxy.cjs     # Reconnecting stdio-to-daemon proxy: replay + createClassifyFrame factory
+-- compiled-route-manifest.cjs    # Activation-manifest library: mint, refresh, freshness, writer lease
+-- compiled-route-layout.cjs      # Selects one coherent runtime generation, refuses a mixed root
+-- compiled-route-admission.cjs   # Scores a hub's compiled decisions against its playbook routing gold
+-- mirror-sync-verify.cjs         # Verifies each runtime's agent mirrors against their source
+-- node-engine-resolver.cjs       # Finds a Node interpreter that satisfies a package's engines range
+-- node-engine-resolver.test.cjs  # node:test suite for the resolver
+-- compiled-routing/              # GENERATED serving closure, promoted by compiled-route-sync.cjs
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `launcher-ipc-bridge.cjs` | Resolves the per-service IPC socket path, probes daemon health over JSON-RPC, retries the lease-holder probe (`probeLeaseHolderWithRetries` / `resolveLeaseProbeAttempts`) so a slow-but-alive owner is not false-reaped, and bridges launcher stdio to the socket so a non-owning launcher defers to the lease holder. |
| `launcher-session-proxy.cjs` | Fronts the daemon with a reconnecting stdin/stdout bridge that reattaches across a daemon recycle and replays in-flight read frames, and exports the `createClassifyFrame({ replayableToolNames, unsafeToolNames })` factory each launcher passes its own replay set to. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Every module here depends only on Node core (`fs`, `net`, `http`, `path`, `child_process`). No third-party packages. |
| Exports | Each file uses `module.exports`. Launchers in `bin/` import these, and the daemon-backed CLI dist entrypoints require `launcher-ipc-bridge.cjs`. nothing here imports a launcher or a CLI. |
| Ownership | This folder owns IPC bridging and the compiled-routing serving library. It does not own MCP request handling or per-server build logic, which live in each launcher and skill. |

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `maybeBridgeLeaseHolder` | Function | Bridge launcher stdio to an existing lease holder instead of spawning a duplicate. |
| `probeLeaseHolderWithRetries` | Function | Probe the lease holder with bounded retries so a slow-but-alive owner is not false-reaped before a sibling respawns. |
| `createSessionProxy` | Function | Build the reconnecting stdin/stdout proxy that reattaches and replays in-flight read frames across a daemon recycle. |
| `createClassifyFrame` | Function | Build a per-server frame classifier from a replayable and unsafe tool set, deciding which frames are safe to replay. |
| `probeDaemon` | Function | Health-check the MCP daemon socket. |

---

## 7. VALIDATION

Run from the repository root.

```bash
node -e "require('./.skilled/bin/lib/launcher-ipc-bridge.cjs')"
node -e "require('./.skilled/bin/lib/launcher-session-proxy.cjs')"
```

Expected result: each module loads without throwing.

---

## 8. RELATED

- [`bin/`](../README.md)
