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

`runtime-mirrors/` keeps Cursor, Devin, Claude, Codex and related runtime mirror trees aligned with canonical commands, agents and hook configuration. The policy module is authored. The synchronizer derives expected links from source trees and runtime configuration.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `command-scope.cjs` | Authored exceptions for runtime-exclusive commands and runtime-native commands. |
| `sync-runtime-mirrors.cjs` | Derives expected mirror links, checks drift and writes missing or stale links when invoked without `--check`. |

---

## 3. CONTROL FLOW

```text
canonical commands, agents and runtime hook config
                         |
                         v
              sync-runtime-mirrors.cjs
                         |
                         +--> expected mirror links
                         +--> drift report with --check
                         `--> link repair without --check
```

The synchronizer reads the runtime's own hook configuration rather than a hand-kept hook list. `command-scope.cjs` supplies the authored exceptions that must not be mirrored or pruned.

---

## 4. AUTHORED AND DERIVED BOUNDARY

Edit `command-scope.cjs` when a command is runtime-exclusive or a runtime-native command must be preserved. Treat mirror links and the synchronizer's derived expectations as generated behavior. Run the synchronizer in `--check` mode to inspect drift before allowing repair.

---

## 5. VALIDATION

Run the non-mutating check from the repository root:

```bash
node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

---

## 6. RELATED

- [`System-spec-kit scripts`](../README.md)
