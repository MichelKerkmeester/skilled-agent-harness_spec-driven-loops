---
title: "Scripts Internal Library"
description: "CLI-specific infrastructure shared by the runtime/ .cjs scripts: writer locks, exit-code classification, signal handling and namespace validation."
---

# Scripts Internal Library

---

## 1. OVERVIEW

Internal helpers used only by the CLI entry points in `../`. This folder is CLI infrastructure, not domain logic, which is why it stays separate from the domain library at `../../lib/`. Nothing outside `runtime/scripts/` imports from here.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `cli-guards.cjs` | Namespace value validation (path traversal, null bytes, repo-root containment), an exclusive writer lock with stale-lock reclamation over `fs.openSync(path, 'wx')`, lineage failure classification (`timeout`, `exit`, `salvage_miss`, `artifact_miss`) with a transient/fatal retry verdict, exit-code mapping for CLI error objects, `SIGINT`/`SIGTERM` cleanup handler installation and a synchronous sleep built on `Atomics.wait` |

## 3. CONSUMERS

- The `.cjs` scripts in `../` (`convergence.cjs`, `query.cjs`, `status.cjs`, `upsert.cjs`, `fanout-run.cjs`, `fanout-pool.cjs`, `fanout-salvage.cjs`, `fanout-merge.cjs`, `loop-lock.cjs`)

## 4. RELATED

- Parent scripts README: `../README.md`
- Domain library (distinct from this CLI-only folder): `../../lib/`
