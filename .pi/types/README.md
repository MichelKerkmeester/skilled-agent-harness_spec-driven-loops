---
title: "Pi Types: Hand-Written Declarations for the Pi Type Check"
description: "Ambient TypeScript declarations that let tsconfig.pi.json type-check the Pi adapters without a Pi install or Node type package in the repository."
trigger_phrases:
  - "pi types"
  - "pi type declarations"
  - "tsconfig.pi.json"
version: 1.0.0.0
---

# Pi Types: Hand-Written Declarations for the Pi Type Check

---

## 1. OVERVIEW

`.pi/types/` holds two ambient declaration files for the Pi type check at the repository root, `tsconfig.pi.json`. That check reads the Pi adapters at their real paths under `.skilled/`. Those adapters import `@earendil-works/pi-coding-agent` and Node built-ins, and neither resolves from the repository, because it has no root `node_modules`.

The declarations are written by hand for that reason. Each file declares only the part of the API the checked adapters use. A call to a member nobody declared then fails the check, instead of passing as `any`.

Pi never reads this folder. It discovers its extensions in `.pi/extensions/`, and at load time the real package supplies the real types.

---

## 2. KEY FILES

| File | What it declares |
|---|---|
| `pi-coding-agent.d.ts` | The module `@earendil-works/pi-coding-agent`. It holds `ExtensionAPI` with `on()` overloads for `input`, `tool_call`, `before_agent_start`, `agent_end` and `message_end`, plus `sendMessage()`. It also holds `ExtensionContext` with its dialog surface and context usage, and the event, message and usage types those handlers receive. |
| `node-globals.d.ts` | The Node surface the adapters touch: the global `process` with `env`, `cwd()`, `pid` and `execPath`, `spawn` from `node:child_process`, and `resolve` and `join` from `node:path`. |

---

## 3. WHO USES THEM

`tsconfig.pi.json` includes both files and three adapters:

- `.skilled/hooks/session-handover/pi/session-handover.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts`

The check also reads the JavaScript modules those adapters import, because the config sets `allowJs`. The five `on()` overloads are the five events these adapters register. The other Pi adapters import the same module, but this config does not include them, so it does not check them.

The two packages under `.pi/extensions/` do not use this folder. `pi-cache-optimizer/` keeps its own declarations in its `types/` folder. `pi-fast-mode-w-subagent-support/` installs the real package as a development dependency.

---

## 4. UPDATING THE DECLARATIONS

Add a member when a checked adapter starts to use it, and declare only that member. Copy its shape from the installed package's own declarations, in `dist/core/extensions/types.d.ts` inside a Pi install, so the check matches what Pi passes at run time. Leave the rest of the API undeclared rather than widening a type to `any`.

Some adapters work around a missing declaration instead of adding one. `session-handover.ts` reads `node:fs` through a dynamic import with a cast, because `node-globals.d.ts` declares no `node:fs`.

When you add an adapter to `tsconfig.pi.json`, run the check and declare what it reports as missing.

---

## 5. VALIDATION

No CI workflow or git hook runs this check, so run it from the repository root after you change a declaration or a checked adapter. The compiler comes with the spec-kit install.

```bash
.skilled/skills/system-spec-kit/node_modules/.bin/tsc -p tsconfig.pi.json
```

Expected result: no output and exit 0. A call to an undeclared member prints a `TS2339` error that names the file and line, and exits 2.

---

## 6. RELATED

- [`../extensions/README.md`](../extensions/README.md): the Pi extension entries and the adapters they re-export
- [`../README.md`](../README.md): what Pi gets from this repository
- [`../../tsconfig.pi.json`](../../tsconfig.pi.json): the type check these declarations serve
