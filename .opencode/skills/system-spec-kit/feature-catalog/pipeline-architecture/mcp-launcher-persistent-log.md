---
title: "MCP launcher persistent log"
description: "The mk-spec-memory launcher writes a bounded, best-effort durable line to a log file alongside its stderr output, so daemon flaps and owner-disposal races stay attributable from disk after the host drops stderr. Rotates one previous generation at a size cap and ships on by default."
trigger_phrases:
  - "launcher persistent log"
  - "daemon flap attributable from disk"
  - "launcher log file rotation"
  - "SPECKIT_LAUNCHER_LOG"
  - "persistLauncherLogLine"
version: 3.6.0.2
---

# MCP launcher persistent log

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The mk-spec-memory launcher logs lifecycle events to stderr, but MCP hosts often discard a child's stderr once they dispose the session. That is exactly when daemon flaps and owner-disposal races happen, so the most diagnostic lines are the ones most likely to be lost.

The persistent log makes the launcher's `log()` also append the same line to a durable file. The write is best-effort: a failed disk write never breaks launcher operation, it just falls back to stderr alone. The file is bounded, rotating to a single previous generation once it crosses a size cap, so it stays attributable without growing without limit. The feature ships on by default and can be disabled, repointed, or resized through environment variables.

## 2. HOW IT WORKS

### Best-effort durable append

`persistLauncherLogLine` writes each launcher log line to the resolved log path. The append is wrapped so any filesystem error is swallowed and the launcher continues, keeping stderr as the always-on channel and the file as the durable supplement.

### Enablement gate

`launcherLogIsEnabled` reads `SPECKIT_LAUNCHER_LOG`. The feature is on by default. Setting the variable to `0` disables the durable append entirely while leaving stderr logging intact.

### Path resolution

`resolveLauncherLogPath` resolves the destination. By default it writes to `<dbDir>/.mk-spec-memory-launcher.log`, keeping the log next to the database directory the launcher already owns. `SPECKIT_LAUNCHER_LOG_PATH` overrides the destination when an operator wants the log elsewhere.

### Bounded single-generation rotation

`shouldRotateLauncherLog` checks the current file size against the cap from `SPECKIT_LAUNCHER_LOG_MAX_BYTES`, which defaults to 1048576 bytes. When the file exceeds the cap, the launcher rotates it to a single previous generation before continuing to append, so disk use stays bounded to roughly two generations.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Script | Defines `persistLauncherLogLine`, `launcherLogIsEnabled`, `resolveLauncherLogPath` and `shouldRotateLauncherLog`. Reads `SPECKIT_LAUNCHER_LOG`, `SPECKIT_LAUNCHER_LOG_PATH` and `SPECKIT_LAUNCHER_LOG_MAX_BYTES`. Calls the durable append from the launcher `log()` path |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/launcher-persistent-log.vitest.ts` | Automated test | Unit-tests enablement, path resolution, the durable append and single-generation rotation at the size cap |

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pipeline-architecture/mcp-launcher-persistent-log.md`
Related references:
- [mcp-launcher-front-proxy.md](../../feature-catalog/pipeline-architecture/mcp-launcher-front-proxy.md) — MCP launcher front-proxy (reconnecting session proxy)
