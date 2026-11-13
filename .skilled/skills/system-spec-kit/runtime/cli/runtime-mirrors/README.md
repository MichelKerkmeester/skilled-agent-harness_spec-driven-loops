---
title: "Runtime mirrors"
description: "Authored command-scope policy and the synchronizer that derives runtime mirror links from canonical sources and runtime configuration."
trigger_phrases:
  - "runtime mirrors"
  - "sync runtime mirrors"
  - "runtime-native commands"
---

# Runtime mirrors

---

## 1. OVERVIEW

`runtime-mirrors/` keeps Cursor, Devin, Claude, Codex and related runtime mirror trees aligned with canonical commands, agents and hook configuration. It also keeps the DSH plugin bundle's adapter links aligned with the hook library. The policy module is authored. The synchronizer derives expected links from source trees and runtime configuration.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `command-scope.cjs` | Authored exceptions for runtime-exclusive commands and runtime-native commands. |
| `sync-runtime-mirrors.cjs` | Derives expected mirror links, checks drift and writes missing or stale links when invoked without `--check`. Its `dsh-adapters` tree expects one link in `.dsh/plugins/repo-guards/adapters/` per `.mjs` adapter in a `.skilled/hooks/<concern>/dsh/` folder, aimed at the adapter's real file. |
| `sync-gate1-pointers.cjs` | Writes two pointer blocks into `.cursor/rules/skill-routing.md` from the root `AGENTS.md` lines: the Gate 1 lookup, and the Gate 2 command rule with its direct advisor call. Codex reads the root file as project instructions and needs no block; `--check` reports drift without writing. |
| `hook-registry.json` | The canonical hook set: every hook once, with its concern, script and per-runtime event bindings; Pi's entry file name per hook. |
| `sync-hook-registrations.cjs` | Renders the four JSON hook registration files from the registry in each runtime's shape and verifies the Pi entry files, each a one-line re-export; `--check` reports drift without writing. |

---

## 3. CONTROL FLOW

```text
canonical commands, agents, runtime hook config
and the hook library's dsh/ adapter folders
                         |
                         v
              sync-runtime-mirrors.cjs
                         |
                         +--> expected mirror links
                         +--> drift report with --check
                         `--> link repair without --check
```

The synchronizer reads the runtime's own hook configuration rather than a hand-kept hook list. For DSH it reads the hook library's `dsh/` folders, so a new adapter needs no list edit. An index link there for a skill-owned adapter resolves to the skill's file, and the bundle's link aims straight at that file. `command-scope.cjs` supplies the authored exceptions that must not be mirrored or pruned.

---

## 4. AUTHORED AND DERIVED BOUNDARY

Edit `command-scope.cjs` when a command is runtime-exclusive or a runtime-native command must be preserved. Treat mirror links and the synchronizer's derived expectations as generated behavior. Run the synchronizer in `--check` mode to inspect drift before allowing repair.

---

## 5. VALIDATION

Run the non-mutating check from the repository root:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

---

## 6. RELATED

- [`System-spec-kit scripts`](../README.md)
