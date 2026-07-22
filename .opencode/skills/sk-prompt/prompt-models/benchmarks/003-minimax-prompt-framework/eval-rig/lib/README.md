---
title: "eval-rig/lib: atomic result cache for deterministic checks and the grader"
description: "Shared append-only cache layer keyed by canonicalized input hashes, used by the grader and deterministic checks."
---

# eval-rig/lib

---

## 1. OVERVIEW

`lib/` holds the eval-rig's shared cache layer. Both the grader (`../grader/harness.cjs`) and the rig scripts (`../scripts/dry-run.cjs`, `../scripts/cache-reconstruct.cjs`) store their per-fixture, per-variant results here instead of recomputing or re-dispatching on every run.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `cache.cjs` | Atomic, append-only cache with two kinds side by side under `cache/`: `cache/det/` for deterministic-check results and `cache/grader/` for grader-call results. Storage is an append-only `index.jsonl` plus one blob file per key, written temp-then-rename. Keys are 32-character SHA-256 hex prefixes derived from a canonicalized pipe-delimited input bundle. Concurrency uses mkdir-based advisory locks with a 5-minute stale-lock TTL |

## 3. CONSUMERS

- `../grader/harness.cjs` for grader-call caching, keyed on variant hash, fixture ID, rubric version, grader model build hash and output hash
- `../scripts/dry-run.cjs` for the cache concurrency and cache-reconstruct subtests
- `../scripts/cache-reconstruct.cjs` for rebuilding a corrupted or missing index from the blob files

## 4. RELATED

- [`SKILL.md`](../../../../SKILL.md)
- [`../grader/README.md`](../grader/README.md)
