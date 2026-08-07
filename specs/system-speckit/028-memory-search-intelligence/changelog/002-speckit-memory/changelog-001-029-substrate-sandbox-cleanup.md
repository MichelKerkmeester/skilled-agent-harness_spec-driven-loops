---
title: "Changelog: Substrate Stress Harness Sandbox Cleanup [001-speckit-memory/029-substrate-sandbox-cleanup]"
description: "Chronological changelog for the substrate stress harness sandbox cleanup phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

The substrate stress harness wrote its evidence and scratch into `_sandbox/24--local-llm-query-intelligence/` at the repository root and never cleaned it, so every run left the folder behind. The summary TSV is a harness-to-test contract that `substrate-runner-harness.vitest.ts` reads after the harness subprocess exits, so the cleanup cannot live in the harness `finally` without deleting the TSV before the test reads it. This phase added a fail-safe cleanup that removes the throwaway hermetic code-graph DB on every run, a `--clean` flag that drops the whole sandbox for standalone runs and a test `afterAll` that clears the sandbox once the suite has read the TSV. No memory or code-graph behavior changed.

### Added

- Added the `--clean` CLI flag to the harness for standalone runs that need no persisted evidence.
- Added the `cleanupSandbox` helper, called at the end of the harness `main` finally block.
- Added an `afterAll` cleanup in `substrate-runner-harness.vitest.ts` that removes the sandbox after the suite reads the summary TSV.

### Changed

- Derived `SANDBOX_EVIDENCE_DIR` from a new `SANDBOX_RUN_DIR` constant so the run directory has a single source of truth.

### Fixed

- Fixed the harness leaving `_sandbox/24--local-llm-query-intelligence/` at the repository root after every run. The throwaway code-graph DB is now always removed, and both the `--clean` flag and the test `afterAll` drop the whole sandbox including the now-empty `_sandbox` parent, which `rmdir` removes fail-closed so a shared or non-empty parent is left in place.

### Verification

- `node --check` on the harness: PASS, no syntax errors.
- Comment-hygiene on both edited files: PASS, exit 0.
- Standalone `--clean` run (`--scenarios 410`): PASS, exit 0. The connection and scenario rows SKIP because a live operator daemon holds the single-writer lease during an interactive session, and `_sandbox` is fully removed afterward.
- `npm run stress:substrate` over `substrate-runner-harness.vitest.ts`: PASS, Test Files 1 passed and Tests 1 passed, with `_sandbox` gone afterward, proving the `afterAll` cleanup fired.

### Files Changed

- `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`: the `SANDBOX_RUN_DIR` constant, the `--clean` flag, the `cleanupSandbox` helper and the finally call.
- `mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts`: the `afterAll` sandbox cleanup and its import.

### Follow-Ups

- A standalone manual run leaves the evidence in place unless `--clean` is passed, by design, so an operator can inspect the summary TSV after a manual run.
