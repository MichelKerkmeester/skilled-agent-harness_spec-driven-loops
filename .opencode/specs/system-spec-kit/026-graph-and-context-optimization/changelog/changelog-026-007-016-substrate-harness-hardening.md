---
title: "MCP Daemon Reliability Phase 016: Substrate stress-harness hardened against three residual risks"
description: "A deep-research validation proved the skip-not-fail substrate harness fix is sound but found three residual risks: a recycled PID could mask a crash as SKIP, an EPERM-locked TSV silently kept a prior run's pids, and clean-env maintainer mode could rewrite graph-metadata tree-wide. All three are now closed, plus an opt-in hermetic lever for CI. The validation packet (former 037) and this implementation (former 038) were merged and relocated into 016 under the 007 daemon-reliability phase."
trigger_phrases:
  - "phase 016 changelog"
  - "substrate harness hardening"
  - "pid recycling skip"
  - "maintainer mode leak"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `026-graph-and-context-optimization/007-mcp-daemon-reliability/016-substrate-harness-hardening` (Level 3)
> Parent packet: `026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

This phase merges two pieces of work that belonged together. Former packet `037-substrate-skip-not-fail-validation` was a deep-research **validation** packet, five fresh-context iterations dispatched to MiniMax M2.7-highspeed, that adversarially tested the five behavioral claims of the earlier "skip-not-fail on live owner" substrate-harness fix. Former packet `038-substrate-harness-hardening` was the Level 3 **implementation** that acted on what the validation found. Both are now relocated and renumbered into `016-substrate-harness-hardening` under the `007-mcp-daemon-reliability` phase, with the validation work folded in at `016/research/`.

The validation verdict was that all five claims are **PROVEN**, the fix behaves as advertised (a live operator daemon holding the single-writer lease yields a tolerated SKIP, genuine crashes still FAIL, the 410 false-green guard survives), but it surfaced three residual risks, all in `run-substrate-stress-harness.mjs`:

1. **PID-recycling false-SKIP.** A hard-crashed daemon can leave an un-cleaned lease whose `ownerPid` is reassigned by the OS to a live, unrelated process. The harness then sees a live PID, classifies the failure as SKIP, and masks a genuine crash. This is also the *only* path that can bypass the 410 false-green guard.
2. **Stale-pid TSV evidence.** When the summary TSV is EPERM-locked, the harness returned without writing and silently preserved the prior run's file, so an analyst could be shown stale pids and trust them as current.
3. **Maintainer-mode INDEX-scan leak.** With `.env.local` present in a clean env / CI, `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` triggers a forced INDEX scan that rewrites `graph-metadata.json` across the tree. In interactive sessions this stayed untriggered (the child exits first), but it is live in CI.

This implementation closes all three and adds an opt-in hermetic lever so clean-env / CI verification is safe by default.

### Added

- An opt-in hermetic lever, `SPECKIT_SUBSTRATE_HERMETIC=1`, that gives the code-index child its own within-repo throwaway DB dir (`hermeticCodeIndexDbDir` / `hermeticCodeIndexExtras`). The child acquires its own lease and connects without contending with a live operator daemon, the safe path for clean-env / CI runs.
- A new behavioral test file, `substrate-harness-hardening.vitest.ts` (8 pure-logic cases covering process identity, the TSV sidecar, and env suppression), kept isolated from the existing subprocess test.
- A run-id sidecar TSV path and a trailing `run_id` column on the canonical summary TSV so a run's evidence is always attributable and never silently overwritten.

### Changed

- `liveOwnerForService` now accepts a lease PID as the owner only if it is alive **and** its process start time matches the lease within a 2-second tolerance (`processStartedAt`, `leaseOwnerMatch`). A live-but-mismatched PID is no longer treated as the owner.
- The code-index child env now spreads an explicit `CODE_INDEX_INDEX_SUPPRESSION` constant (maintainer mode plus the five `INDEX_*` flags all set to `false`), so a harness run can never trigger the tree-wide metadata scan.
- The EPERM fallback was refactored into `writeSummaryWithFallback(payload, { write, warn })` with an injectable writer, making the sidecar redirect unit-testable.

### Fixed

- The PID-recycling false-SKIP. A genuine crash whose PID was recycled to a live process now reports FAIL instead of being masked as a tolerated SKIP (closes the single remaining 410 false-green bypass).
- Silent stale-TSV evidence. On EPERM, current rows now land in a run-id sidecar with a warning instead of preserving a prior run's pids.
- The clean-env maintainer-mode INDEX-scan leak. A clean-env / CI harness run can no longer rewrite `graph-metadata.json` tree-wide.

### Verification

- Full stress suite green: `npm run stress` returned **24 files / 90 tests** passing.
- Hardening unit test: `substrate-harness-hardening.vitest.ts`, 8 cases (identity / TSV / env) all pass.
- Existing live-owner SKIP behavior preserved: `substrate-runner-harness.vitest.ts` still passes.
- Clean-env hermetic proof: a `SPECKIT_SUBSTRATE_HERMETIC=1` run had the code-index child connect against an isolated temp DB, 403/404/407 PASS, the daemon reached `ready` with **no maintainer-mode forcing line**, and **zero** tree writes.
- A fabricated lease with a live PID but mismatched start time yields FAIL (verified by test).
- Packet strict-validate: PASS.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | All three fixes plus the opt-in hermetic lever, exported testable helpers (`processStartedAt`, `leaseOwnerMatch`, `writeSummaryWithFallback`, `CODE_INDEX_INDEX_SUPPRESSION`). |
| `mcp_server/stress_test/substrate/substrate-harness-hardening.vitest.ts` | New 8-case pure-logic test covering process identity, TSV sidecar, and env suppression. |

### Follow-Ups

- Mem-side clean-env (the 410 scenario running for real) still requires stopping the operator `mk-spec-memory` daemon, its single-writer lease path is not env-relocatable, so the hermetic lever isolates only the code-index DB. The code-index clean-env path is fully verified.
- The start-time identity check depends on `ps`, when unavailable it falls back to liveness-only (prior behavior), where the recycled-PID guard is inactive.
- Two items initially deferred in the spec, the temp `SPECKIT_CODE_GRAPH_DB_DIR` hermetic lever and the EPERM-fallback test, were both implemented and verified in this phase, so no deferred work remains.
