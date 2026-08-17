---
title: "src: Fast Mode extension source"
description: "Raw-TypeScript source for the Pi Fast Mode extension: lifecycle wiring, config, handoff, payload gate, status, and commands."
trigger_phrases:
  - "fast mode extension source"
  - "pi fast mode src"
---

# src: Fast Mode extension source

`src/` holds the raw-TypeScript source Pi loads through jiti. `index.ts` is the only entry Pi calls. Every other file is a single-responsibility unit it composes.

---

## 1. OVERVIEW

`src/` owns the extension's runtime logic. It maps a Pi session's lifecycle events to Fast Mode behavior: resolve the enabled state, gate provider requests, render status, and handle the `/fast` command.

Current state:

- Loaded as raw TypeScript through jiti, with no build step and no compiled output.
- Fast Mode injects `service_tier: "priority"` only for configured provider and model targets.
- State persists across sessions and propagates to child subagents through an environment variable.

---

## 2. ARCHITECTURE

```text
Pi host
  index.ts  createPiFastModeExtension
    session_start            -> config.ts (load state) + handoff.ts (read env) -> resolve enabled
    before_provider_request  -> payload.ts (match target, inject service_tier)
    /fast <arg>              -> commands.ts (parse) -> config.ts (save) + handoff.ts (write env) + status.ts + notify
    status render            -> status.ts
  types.ts  shared types and constants, imported by all units
```

Precedence at `session_start`: an explicit `--fast` flag wins, then the inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT` value, then persisted config.

---

## 3. KEY FILES

| File | Responsibility |
|------|----------------|
| `index.ts` | Extension entry (`createPiFastModeExtension`). Wires the Pi lifecycle: resolves the enabled state at `session_start`, gates provider requests, renders status, posts the toggle notification, and owns the `/fast` handler. |
| `types.ts` | Shared types and constants: `PACKAGE_NAME`, `LEGACY_PACKAGE_NAME`, `HANDOFF_ENV`, `FastModeConfig`, `FastModePreference`, and `DEFAULT_CONFIG`. Imported by every other file. |
| `config.ts` | Persisted state. Loads and saves config, selects user versus project scope, resolves the flat `<name>-config.json` path, migrates a legacy file once, and writes atomically through a temp-file rename. |
| `handoff.ts` | The subagent handoff contract. `readHandoff` and `writeHandoff` read and write the strict `PI_FAST_MODE_W_SUBAGENT_SUPPORT` environment value (`1`, `0`, or unset). |
| `payload.ts` | The request gate. Matches the request provider and model against a configured target and injects `service_tier`, skipping any request that already sets a tier or is off-target. |
| `status.ts` | The TUI indicator. Computes the right-aligned `fast` text and sets or clears it, only when the runtime supports TUI status. |
| `commands.ts` | `/fast` parsing. Defines the usage string, the usage error, `parseFastCommand`, and completion suggestions. |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|------------|------|---------|
| `createPiFastModeExtension` | Function | Factory Pi imports to register commands, lifecycle hooks, and the provider-request gate. |
| `index.ts` | Module | Default export and the file a reader opens first. No other file is called by the host directly. |

---

## 5. VALIDATION

Run from the repo root:

```bash
npm --prefix .pi/extensions/pi-fast-mode-w-subagent-support run check
```

Expected output:

```text
Test Files  7 passed (7)
     Tests  77 passed (77)
```

`check` runs `tsc --noEmit` then the vitest suite.

---

## 6. RELATED

- `../README.md` for install, usage, and the handoff contract.
- `../tests/README.md` for the test suite layout.
