---
title: "Scripts"
description: "Package build finalizer, graph metadata repair, and the bounded test runners."
trigger_phrases:
  - "scripts"
  - "finalize dist"
  - "repair graph metadata"
  - "sharded test runner"
---

# Scripts

> Package-local scripts for finishing a build, repairing generated metadata, and running the test suite within bounds.

---

## 1. OVERVIEW

`runtime/scripts/` holds the scripts that `package.json` invokes plus one maintenance tool. These are package-local by design: each one depends on this package's layout, and none is a general-purpose utility.

Two of them exist because the naive version fails in a way that is easy to miss:

- `run-tests-sharded.mjs` splits the suite because a single reused worker eventually spins on a CPU-bound rehash storm and never returns. The module it stops at is innocent, and so are the ones after it — the cost belongs to the accumulated process. Shards run one at a time on purpose; running them together contends for the same temporary directories and databases and produces failures that belong to the harness rather than the code.
- `run-tests.mjs` bounds each invocation with a process-group timeout so a hung run is terminated with its children instead of leaking them.

---

## 2. STRUCTURE

```text
scripts/
+-- finalize-dist.mjs        # Post-build: freshness entries, stale dist pruning, JSON copying
+-- run-tests.mjs            # Bounded default test runner (npm test)
+-- run-tests-sharded.mjs    # Sharded runner for the full suite (npm run test:sharded)
`-- README.md
```

This folder holds scripts only; its one test suite (`resource-map-extractor.vitest.ts`, which actually covered `../cli/resource-map/extract-from-evidence.cjs`, not a script in this folder) now lives at `../tests/resource-map-extractor.vitest.ts`, under a real `vitest.config.ts` include glob.

### File Inventory

| File | Purpose | Key Behavior |
|---|---|---|
| `finalize-dist.mjs` | Completes `npm run build` after `tsc --build` | Records the package build and source-hash cache through `../cli/lib/dist-freshness.cjs`, copies JSON assets into `dist/`, prunes stale dist roots, and checks the required artifacts are present. |
| `run-tests.mjs` | Backs `npm test` | Routes `npm test -- --run ...` to the requested Vitest lane without running the full core suite first, under a process-group timeout that terminates the whole group on overrun. |
| `run-tests-sharded.mjs` | Backs `npm run test:sharded` | Splits the suite into `SPECKIT_TEST_SHARDS` shards (default 12) and runs them serially, each in its own worker. |

---

## 3. IMPLEMENTED STATE

- `finalize-dist.mjs` runs as the last step of `npm run build` and maintains the `default` and `validation-orchestrator` freshness entries that `../cli/spec/validate.sh` checks before it will run.
- `dist/` is gitignored, so a build is required after pulling source changes; the freshness guard turns a missed rebuild into an explicit error rather than a stale result.
- The test runners are the supported entry points. Invoking Vitest directly bypasses both the shard split and the timeout bound.

---

## 4. USAGE

```bash
# From .opencode/skills/system-spec-kit/runtime
npm run build          # tsc --build, then finalize-dist.mjs
npm test               # bounded default lane
npm run test:sharded   # full suite, sharded serially
```

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../cli/README.md`](../cli/README.md)
