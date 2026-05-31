---
title: "Substrate stress-harness hardening: start-time identity, run-id TSV, env suppression"
description: "Closed three residual risks in the substrate stress harness: recycled-PID false-SKIP via start-time identity, stale TSV evidence via run-id stamping with EPERM sidecar, plus maintainer-mode INDEX scan leak via child-env suppression. Full stress suite green at 24 files / 90 tests."
trigger_phrases:
  - "substrate harness hardening"
  - "pid recycling false skip"
  - "run-substrate-stress-harness maintainer mode"
  - "liveOwnerForService start time"
  - "harness EPERM sidecar"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/016-substrate-harness-hardening` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The substrate stress harness allowed a recycled PID to mask a genuine daemon crash as a tolerated SKIP. It also silently kept stale TSV evidence when the canonical file was EPERM-locked. It permitted a clean-env run to trigger a maintainer-mode INDEX scan that rewrote `graph-metadata.json` across the entire tree. The deep-research validation in this packet's `research/` surfaced all three risks.

All three fixes landed in `run-substrate-stress-harness.mjs`. A new pure-logic vitest file covers each behavior in isolation. The full `npm run stress` suite passes at 24 files / 90 tests with the existing live-owner SKIP test intact. An opt-in hermetic lever (`SPECKIT_SUBSTRATE_HERMETIC=1`) was also shipped, giving the code-index child its own within-repo throwaway DB directory for clean-env and CI verification.

### Added

- `processStartedAt` helper that reads a PID's start time via `ps -o lstart=` with liveness-only fallback when the read fails
- `leaseOwnerMatch` helper that compares lease and live start times within a 2-second tolerance
- `writeSummaryWithFallback` injectable-writer helper enabling unit-testable EPERM redirect without subprocess overhead
- Opt-in hermetic lever (`SPECKIT_SUBSTRATE_HERMETIC=1`) that gives the code-index child its own within-repo throwaway DB directory
- `substrate-harness-hardening.vitest.ts` with 8 cases covering identity, TSV plus env-suppression behaviors

### Changed

- `liveOwnerForService` now requires start-time match in addition to liveness before classifying a PID as the lease owner. A mismatch yields null and forces verdict FAIL.
- Run-id column appended to all TSV rows so each producing run is distinguishable. On EPERM the current rows go to a run-id sidecar instead of silently preserving the stale canonical file.
- Code-index child env now receives `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=false` plus the five `INDEX_*=false` flags spread from the launcher's set-if-absent env semantics

### Fixed

- Recycled PID with a start time differing from the lease timestamp was accepted as the lease owner, hiding a crash as a tolerated SKIP
- EPERM-locked canonical TSV silently kept prior-run pids in place with no indication the current run's evidence was lost
- `.env.local` maintainer mode bled into the code-index child env and could force a tree-wide graph-metadata rewrite during a clean-env or CI run

### Verification

| Test Type | Status | Details |
|-----------|--------|---------|
| Unit (hardening) | Pass | `substrate-harness-hardening.vitest.ts`: 8 cases (identity, TSV, env suppression) |
| Behavioral (runner) | Pass | `substrate-runner-harness.vitest.ts`: existing live-owner SKIP intact |
| Regression (full) | Pass | `npm run stress`: 24 files / 90 tests green |
| Clean-env (hermetic) | Pass | `SPECKIT_SUBSTRATE_HERMETIC=1` run: isolated temp DB, 403/404/407 PASS, no maintainer-mode forcing line, no tree writes |

| REQ | Status |
|-----|--------|
| REQ-001 start-time mismatch yields FAIL | Pass |
| REQ-002 no silent stale TSV with run-id present | Pass |
| REQ-003 maintainer/INDEX off in child env | Pass |
| REQ-004 existing live-owner SKIP preserved | Pass |
| REQ-005 new behaviors covered by tests | Pass |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | All three fixes plus exported testable helpers (+90/-11 LOC) |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-harness-hardening.vitest.ts` | Created (NEW) | 8-case unit vitest covering identity, TSV plus env-suppression behaviors (83 LOC) |

### Follow-Ups

- Start-time check depends on `ps` availability. When `ps` is absent, `liveOwnerForService` falls back to liveness-only, meaning the recycled-PID guard is inactive on those platforms.
- Linux start-time detection uses `ps -o lstart=`. The `/proc` field-22 path was evaluated and not needed.
- Mem-side clean-env (the 410-run full run) still requires stopping the operator memory daemon. The hermetic lever isolates only the code-index DB because `mk-spec-memory`'s lease path is not env-relocatable. The code-index clean-env path is fully verified.
