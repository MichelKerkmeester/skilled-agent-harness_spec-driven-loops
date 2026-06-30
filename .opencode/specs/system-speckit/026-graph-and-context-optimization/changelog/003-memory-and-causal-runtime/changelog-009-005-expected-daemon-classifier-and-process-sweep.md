---
title: "Phase 005: Expected Daemon Classifier and Process Sweep"
description: "Dry-run process sweep surface shipped with a four-condition eligibility gate that refuses self-PID, ancestors, expected warm daemons and unknown owners. Extended the phase-002 harness with ancestry helpers and an expanded classification taxonomy covering external MCP stdio, browser sessions and ccc-daemon buckets."
trigger_phrases:
  - "expected daemon classifier process sweep"
  - "process-sweep.ts planSweep"
  - "memory leak remediation phase 005"
  - "sweep eligibility gate daemon classifier"
  - "dry-run process sweep sc-001"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/005-expected-daemon-classifier-and-process-sweep` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Broad kill commands in the memory-leak surface could either miss detached helpers or terminate legitimate warm services. No safe, inventory-first cleanup surface existed for classifying daemons, sidecars, browser tooling and CLI leftovers before issuing any termination signal.

Phase 005 delivered `process-sweep.ts` with `planSweep(inventory, options)` that produces per-row eligibility decisions and summary counts without issuing any destructive signals. A four-condition gate refuses self-PID, process ancestors, expected warm daemons and unknown-owner rows by default. Only `stale-pid-lock` and `orphaned-project-daemon` rows with confirmed project identity are marked eligible. The phase-002 process-memory harness was extended with `getProcessAncestry`, `collectInventory` and seven new classification buckets. A 10-test Vitest fixture matrix (SC-001) covers all policy paths including EPERM, sidecars, ccc daemons and browser sessions.

### Added

- `process-sweep.ts` module with `planSweep(inventory, options)` returning rows with `pid`, `ppid`, `command`, `classification`, `eligibleForTermination` and `rationale`
- Default `plan` CLI mode and deterministic `fixture` CLI mode for dry-run evidence
- `getProcessAncestry(pid, rows)` helper exported from `process-memory-harness.ts` using existing `ps` output without re-spawning
- Classification taxonomy extended in `process-memory-harness.ts`: `expected-warm-daemon`, `orphaned-project-daemon`, `external-mcp-stdio`, `browser-session`, `ccc-daemon`, `eperm-alive-unowned`, `stale-pid-lock` and `unknown-owner`
- `process-sweep.vitest.ts` with 10 tests covering SC-001 fixture matrix: current PID, ancestors, EPERM, stale PID locks, sidecars, ccc daemons, external MCP stdio, browser sessions and unknown owners

### Changed

- `process-memory-harness.ts` extended with `Inventory`, `ProcessClassification`, `collectInventory` and `hasKnownProjectOwnerMarker` exports
- `process-memory-harness.vitest.ts` updated to cover new taxonomy assertions and ancestry export regression

### Fixed

- Sweep eligibility had no ancestry check, meaning a caller could mark a process ancestor as eligible. The `getProcessAncestry` integration closes that gap.
- Classification did not distinguish `external-mcp-stdio`, `browser-session` and `ccc-daemon` rows from generic unknowns, causing those rows to fall through to the wrong policy bucket. Explicit taxonomy buckets now preserve all three by default.

### Verification

| Check | Result |
|-------|--------|
| Phase strict validation after `plan.md` authoring | Passed: 0 errors, 0 warnings |
| Phase strict validation after `tasks.md` authoring | Passed: 0 errors, 0 warnings |
| Targeted sweep Vitest (`process-sweep.vitest.ts`) | Passed: 1 file, 10 tests |
| Sweep plus existing harness Vitest | Passed: 2 files, 17 tests |
| Typecheck (`npm run typecheck --workspace=@spec-kit/scripts`) | Passed |
| Build (`npm run build --workspace=@spec-kit/scripts`) | Passed |
| CLI fixture dry run (`node scripts/dist/ops/process-sweep.js fixture --pretty`) | Passed: 11 rows, 3 eligible, 8 preserved, `dryRun: true` |
| OpenCode alignment verification | Passed: 0 errors, 44 pre-existing warnings in broader scan |
| Final strict phase validation | Passed: 0 errors, 0 warnings |
| Final strict parent arc validation | Passed: 0 errors, 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` (NEW) | `planSweep` with four-condition eligibility gate. `plan` and `fixture` CLI modes. No destructive apply path. |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Extended with `Inventory`, `ProcessClassification`, `getProcessAncestry`, `collectInventory` and `hasKnownProjectOwnerMarker`. Seven new classification taxonomy buckets added. |
| `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts` (NEW) | 10-test SC-001 fixture matrix covering all eligibility and preservation policy paths. |
| `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` | Updated to assert new taxonomy exports and ancestry helper regression coverage. |

### Follow-Ups

- EPERM classification depends on inventory rows carrying `eperm: true`. POSIX `ps` output alone does not expose permission-denied liveness.
- Live inventory can be empty in restricted sandboxes when process enumeration is denied. The deterministic fixture and unit tests cover policy behavior in that case.
- No destructive apply command exists. Phase 014 B6 removed the old `apply --confirmed <token>` alias. A future signal-sending command needs a separate operator policy packet and a new command name.
- Sidecar ownership is classified and preserved here. Phase 008 owns the port ledger, health payload, stale exact-PID sidecar cleanup and reuse policy.
