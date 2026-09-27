---
title: "System Skill Advisor DB Path Policy"
description: "Policy for the package-local skill graph SQLite database path required by ADR-001 constraint A."
trigger_phrases:
  - "system skill advisor db path"
  - "skill-graph.sqlite advisor path"
  - "advisor database policy"
importance_tier: "important"
contextType: "implementation"
version: 0.8.0.9
---

# System Skill Advisor DB Path Policy

Policy for the package-local skill graph SQLite database path required by ADR-001 constraint A.

---

## 1. OVERVIEW

### Purpose

Defines the package-local SQLite database location for the standalone advisor runtime and documents the allowed test/CI override behavior.

### When to Use

- Verifying where `skill-graph.sqlite` and lease sidecars must live.
- Reviewing a database path change, launcher change or runtime ownership question.
- Checking whether a proposed override is limited to tests and CI.

### Core Principle

The advisor owns its SQLite state inside `system-skill-advisor`; adjacent packages must not become competing writers.

### Key Sources

- `runtime/lib/skill-graph/skill-graph-db.ts`
- `runtime/database/README.md`

---

## 2. POLICY

The advisor database lives inside the standalone advisor skill package:

```text
.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite
```

It must not live under:

```text
.skilled/skills/system-spec-kit/runtime/database/
```

SQLite sidecars stay beside the database file:

```text
skill-graph.sqlite-wal
skill-graph.sqlite-shm
```

---

## 3. RATIONALE

ADR-001 constraint A requires DB-local ownership for the extracted advisor. The database is the advisor's runtime state, so it belongs with the skill that reads, writes, validates and rebuilds it.

This separation gives cleaner mutation scope:

- `/doctor:update` and future repair flows can reason per skill package.
- The advisor daemon is the single writer for `skill-graph.sqlite`.
- `system-spec-kit` keeps memory and spec packet state without owning advisor runtime data.
- Backups, cleanup and integrity checks can target the advisor package directly.

---

## 4. TEST AND CI OVERRIDE

`SYSTEM_SKILL_ADVISOR_DB_DIR` is allowed for tests and disposable CI runs only. The retired `MK_SKILL_ADVISOR_DB_DIR` name has no read site of its own. It reaches this variable only in a process that runs the env alias bridge (`.skilled/hooks/shared/env-aliases.cjs`) before the read, and only while `SYSTEM_SKILL_ADVISOR_DB_DIR` is unset.

The override moves these advisor state files and the model server with the database, so a test or CI run keeps them out of the workspace and does not disturb the live advisor:

- **Generation file.** `skill-graph-generation.json` and its lock and temporary files live in the override directory instead of `.skilled/skills/.state/advisor/` (`runtime/lib/freshness/generation.ts`, `getSkillGraphGenerationPath`). Freshness pairs the counter with the database it describes, so a sandboxed daemon never marks the live advisor unavailable when it shuts down.
- **Quarantine store.** The watcher writes `skill-graph-quarantine.sqlite` in the override directory. The workspace default, the `.state/advisor` lease SQLite file, is unchanged, and an explicit store path still wins (`runtime/lib/daemon/watcher.ts`, `quarantineDbPath`).
- **Launcher state and bootstrap lock.** `.system-skill-advisor-launcher.json` and `.system-skill-advisor-launcher.lockdir` sit in the override directory instead of `runtime/database/` (`.skilled/bin/system-skill-advisor-launcher.cjs`, `refreshPaths()`).
- **Model server.** When no `HF_EMBED_SERVER_URL` is given, the launcher sets it to `hf-embed.sock` in the daemon's database-scoped IPC socket directory (`pinModelServerToAdvisorDatabase()`). A sandbox launcher never shares or signals the workspace model server. The pin is skipped when the IPC socket directory is a `tcp://` address.
- **Daemon child address.** With or without the override, when the parent sets no `HF_EMBED_SERVER_URL`, `createChildEnv()` gives the daemon child the socket the launcher's own model-server control arms. The child's embedding client reaches the server the launcher serves, even though the launcher sets the child's `SPECKIT_IPC_SOCKET_DIR` to the daemon's own socket directory.

Production and operator docs should treat the package-local path as the default. A runtime override must not be used to silently re-collocate the advisor DB with `system-spec-kit/runtime/database/`.

### Child-process `MEMORY_DB_PATH` pointer

`system-skill-advisor-launcher.cjs`'s `createChildEnv()` sets the advisor daemon child's `MEMORY_DB_PATH` (the env var `@spec-kit/shared/embeddings/factory.ts` reads to resolve which database's `active_embedder_*` pointer to use) explicitly to this policy's package-local `skill-graph.sqlite` path by default. A bare ambient `MEMORY_DB_PATH` in the parent process is never honored as an override, whoever set it, since that would silently re-collocate the advisor's embedder-pointer resolution with another package's database and defeat this policy's separation. To override for tests/CI only, set the dedicated `SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH` var instead.

---

## 5. MIGRATION NOTES

Current package state keeps the database under `runtime/database/` and serves it through the standalone daemon behind `node .skilled/bin/skill-advisor.cjs`.

The `skill_graph_*` handlers and the lower-level `lib/skill-graph/` database/query library are advisor-owned and package-local.
