---
title: "Fixtures: static test data for scripts/tests"
description: "Fixed input files and generator helpers consumed by the vitest and node --test suites in scripts/tests/."
---

# Fixtures

---

## 1. OVERVIEW

`scripts/tests/fixtures/` holds static test data and fixture-generating helpers for the test suites in `scripts/tests/`. It owns no test logic itself. Each subfolder groups the fixed inputs one test file reads by path. The loose top-level files are generators or shared factories imported by name.

## 2. CONTENTS

| File or Folder | Purpose |
|------|---------|
| `generate-phase1-5-dataset.ts` | CLI generator that expands a spec folder's `eval-dataset-100.json` into a balanced per-intent evaluation dataset for memory-search ranking tests. |
| `manual-playbook-fixture.ts` / `manual-playbook-fixture.js` | Builds the manual-testing-playbook fixture workspace (target/sandbox spec folders, seeded memories, report directory) for `manual-playbook-runner.vitest.ts`. The `.ts` is the source, the `.js` is a plain-Node copy for runners that cannot load TypeScript directly. |
| `session-data-factory.ts` | Default, overridable `SessionData` builder shared by save-pipeline integration and E2E tests. |
| `deep-loop-optimizer/` | Sample corpus and baseline/candidate config JSON for the deep-loop config-optimizer replay and search tests. |
| `deep-loop-replay/` | Recorded per-packet replay fixtures (`028/`, `040/`) for the optimizer replay corpus test. |
| `is-phase-parent/` | `mixed`/`populated` folder trees exercising phase-parent detection. |
| `memory-quality/` | Numbered `F-AC*`/`F-DUP*`/`F-CHECK-DUP*`/`F-MIG*` fixture files, one behavior each, for the memory-quality gate tests. |
| `multi-ai-council/` | Sample council-output markdown (full, minimal, missing-required) for council artifact-persistence tests. |
| `phase-2/`, `phase-creation/`, `phase-detection/`, `phase-validation/` | Phase-workflow fixture trees (error cases, named/multi/single phase, threshold boundaries, valid/broken structures) for phase decomposition and validation tests. |
| `post-save-render/` | A sample packet and title fixture for post-save render tests. |
| `sync-phase-map-status/` | A mixed-parent fixture for the `sync-phase-map-status.vitest.ts` suite. |

## 3. TESTS

Consuming suites live in the parent [`scripts/tests/`](../README.md) directory, for example `optimizer-replay-runner.vitest.ts`, `manual-playbook-runner.vitest.ts`, `template-structure.vitest.ts` and `sync-phase-map-status.vitest.ts`.

## 4. RELATED

- [`scripts/tests/`](../README.md): the test suites that read these fixtures.
