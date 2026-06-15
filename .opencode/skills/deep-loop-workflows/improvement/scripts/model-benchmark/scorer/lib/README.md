---
title: "lib: scorer-internal cache"
description: "Atomic append-only cache for deterministic and grader results used inside the scorer."
trigger_phrases:
  - "scorer cache"
  - "grader cache"
  - "cache.cjs"
---

# lib: scorer-internal cache

---

## 1. OVERVIEW

`lib/` holds the scorer-internal cache. `cache.cjs` provides an atomic, append-only store for two cache kinds: `det` for deterministic check results and `grader` for grader-call results. The grader harness uses it to skip repeat dispatches for an identical input bundle.

Current state:

- Blobs are written with a temp-file-then-rename for atomicity and indexed in an append-only `index.jsonl` per kind.
- Cache keys are 32-char SHA-256 prefixes derived from canonicalized input parts.
- Concurrency uses an mkdir-based advisory lock with a 5-minute stale-lock TTL.
- The on-disk `cache/` directory under the scorer is git-ignored runtime state.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `cache.cjs` | Exports `derive_det_key`, `derive_grader_key`, `write_atomic`, `read`, `cache_hit`, `read_index`, `rebuild_index`, plus the `PACKET_ROOT`, `CACHE_ROOT`, and lock-TTL constants. Stores blobs under `cache/<kind>/<key>.out.md` with a `cache-meta` header and indexes them in `cache/<kind>/index.jsonl`. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | `cache.cjs` imports only Node builtins (`fs`, `path`, `crypto`). |
| Consumers | Required by `../grader/harness.cjs`. The cache is internal to the scorer and is not a cross-skill import surface. |
| Storage root | `CACHE_ROOT` resolves to `cache/` one level above this file, under the scorer. That directory is git-ignored runtime state. |
