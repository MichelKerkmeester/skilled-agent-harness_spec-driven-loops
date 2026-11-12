---
title: "Scripts"
description: "Package build finalizer, the bounded test runner and the CLI test lane script."
trigger_phrases:
  - "scripts"
  - "finalize dist"
  - "run cli tests"
---

# Scripts

> Package-local scripts for finishing a build and running the test suite within bounds.

---

## 1. OVERVIEW

`runtime/scripts/` holds the scripts that `package.json` invokes. These are package-local by design: each one depends on this package's layout, and none is a general-purpose utility.

One of them exists because the naive version fails in a way that is easy to miss:

- `run-tests.mjs` bounds each invocation with a process-group timeout so a hung run is terminated with its children instead of leaking them.

---

## 2. STRUCTURE

```text
scripts/
+-- finalize-dist.mjs        # Post-build: freshness entries, stale dist pruning, JSON copying
+-- run-cli-tests.sh         # The cli Vitest project as one process (npm run test:cli)
+-- run-tests.mjs            # Bounded default test runner (npm test)
`-- README.md
```

This folder holds scripts only; its one test suite (`resource-map-extractor.vitest.ts`, which actually covered `../cli/resource-map/extract-from-evidence.cjs`, not a script in this folder) now lives at `../tests/resource-map-extractor.vitest.ts`, under a real `vitest.config.ts` include glob.

### File Inventory

| File | Purpose | Key Behavior |
|---|---|---|
| `finalize-dist.mjs` | Completes `npm run build` after `tsc --build` | Records the package build and source-hash cache through `../cli/lib/dist-freshness.cjs`, copies JSON assets into `dist/`, prunes stale dist roots, and checks the required artifacts are present. |
| `run-cli-tests.sh` | Backs `npm run test:cli` | Runs the `cli` Vitest project as one process from the `cli` folder. `npm test` runs this lane through `run-tests.mjs`. |
| `run-tests.mjs` | Backs `npm test` | Routes `npm test -- --run ...` to the requested Vitest lane without running the full core suite first, under a process-group timeout that terminates the whole group on overrun. |

---

## 3. IMPLEMENTED STATE

- `finalize-dist.mjs` runs as the last step of `npm run build` and maintains the `default` and `validation-orchestrator` freshness entries that `../cli/spec/validate.sh` checks before it will run.
- `dist/` is gitignored, so a build is required after pulling source changes; the freshness guard turns a missed rebuild into an explicit error rather than a stale result.
- `run-tests.mjs` is the supported entry point. Invoking Vitest directly bypasses the timeout bound.

---

## 4. USAGE

```bash
# From .skilled/skills/system-spec-kit/runtime
npm run build          # tsc --build, then finalize-dist.mjs
npm test               # bounded default lane
```

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../cli/README.md`](../cli/README.md)
