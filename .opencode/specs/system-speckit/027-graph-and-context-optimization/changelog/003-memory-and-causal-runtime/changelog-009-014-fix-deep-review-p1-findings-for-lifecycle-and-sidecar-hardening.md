---
title: "Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening"
description: "Six remediation batches (B1-B6) shipped across arc 009 phase 014 to close all 60 deep-review findings. Lease/ledger races, cleanup correctness gaps, sidecar and executor security boundaries, audit data integrity, test fixture validity and doc drift were all resolved. 413 targeted tests passed across all batches."
trigger_phrases:
  - "deep-review p1 findings lifecycle sidecar hardening"
  - "arc 009 phase 014 remediation"
  - "bounded-cache undefined eviction fix"
  - "process-sweep dry-run apply alias removal"
  - "B1 B2 B3 B4 B5 B6 batch remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Arc 009's deep review returned a CONDITIONAL verdict with 40 P1 findings and 20 P2 advisories covering ownership races, cleanup gaps, local-service security boundaries, audit integrity failures and traceability evidence gaps. Phase 014 converted those 60 findings into six bounded implementation batches that closed every active finding or recorded an operator-approved deferral.

Six batches shipped on 2026-05-22: B1 closed lease/ledger race correctness findings. B2 addressed cleanup correctness. B3 hardened sidecar and executor security. B4 repaired audit and JSONL data integrity. B5 restored test fixture validity and carried DR009-TRC-005 as an operator-runbook deferral. B6 closed all 13 doc-drift and maintainability findings including the `BoundedMap` undefined-key eviction bug and the `TtlMap.has()` undefined-value semantics defect.

413 targeted tests passed across all batches. All phase and parent arc 009 docs passed strict validation at exit 0.

### Added

- `bounded-cache.ts` regression coverage for `BoundedMap` oldest-key undefined eviction and `TtlMap.has()` false-positive on stored undefined values
- Cross-process lock race fixture in `loop-lock.vitest.ts` covering true concurrent same-packet acquisition
- Save/search/index retention workload cap fixture in `memory-runtime-retention.vitest.ts`
- Shared RSS snapshot helper (`bench_rss_core.py`) with slope, IQR and confidence measurements for the adapter benchmark suite

### Changed

- `deep_start-review-loop_auto.yaml` and `deep_start-review-loop_confirm.yaml` updated to route cited Codex dispatch through the audited async supervisor
- `process-sweep.ts` dry-run `apply` command alias removed so the command surface no longer misleads operators with a non-destructive `apply` verb
- `system-code-graph` public barrel (`mcp_server/lib/index.ts` and `mcp_server/index.ts`) updated to export lifecycle helpers for consumers
- Lifecycle README surfaces and arc 009 phase docs reconciled to remove stale phase identifiers and update helper maps

### Fixed

- `BoundedMap` overflowed when the oldest key mapped to `undefined`. The eviction path now reads the key correctly before deletion.
- `TtlMap.has()` returned `false` for keys whose stored value was `undefined`. The method now tests key presence rather than value truthiness.
- Phase 011 and phase 013 implementation summaries carried stale phase-number references. Both were corrected to match actual batch evidence.
- Deep-review YAML assets cited Codex dispatch without routing through the supervised executor contract. B5 corrected the routing in both YAML variants.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| B1 Lease/Ledger Race Correctness | Passed | Closed 6 findings. Targeted suites: deep-loop lock 7/7, Code Graph lease/launcher 24/24, cancel protocol 7/7, rerank ledger 11/11. |
| B2 Cleanup Correctness | Passed | Closed 8 findings. Targeted suites: runtime shutdown hooks 4/4, CocoIndex lifecycle 22/22, rerank ledger 12/12. |
| B3 Sidecar + Executor Security | Passed | Closed 18 findings. Targeted suites: rerank sidecar 21/21, Code Graph hardening 37/37, deep-loop executor audit 22/22, ops redaction 18/18. |
| B4 Audit/Data Integrity | Passed | Closed 5 findings. Targeted suites: deep-loop audit/config/JSONL 57/57, process harness/sweep 21/21, Code Graph query/context 39/39. |
| B5 Test Fixture Validity Restoration | Passed | Closed 9 findings. DR009-TRC-005 deferred by operator-runbook policy. Targeted suites: loop-lock 7/7, memory retention 4/4, launcher lease 13/13. |
| B6 Doc Drift + Maintainability Cleanup | Passed | Closed 13 findings. Targeted suites: bounded-cache 5/5, process-sweep 11/11, Code Graph typecheck exit 0. |
| Aggregate batch test count | Passed | 413 targeted tests passed across B1-B6 plus typechecks, shell syntax checks and strict spec validation. |
| OpenCode alignment drift | Passed | Changed skill scopes passed. Pre-existing non-blocking warnings only. |
| Phase 014 strict validation | Passed | `validate.sh .../014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening --strict` exit 0. |
| Touched-phase strict validation | Passed | Phases 001, 005, 007, 010, 011, 012, 013 and 014 all passed `validate.sh --strict` at exit 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Codex dispatch routed through audited async supervisor (B5) |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Codex dispatch routed through audited async supervisor (B5) |
| `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts` | Modified | Cross-process lock race fixture added (B5) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts` | Modified | Save/search/index workload cap fixture added (B5) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts` | Modified | `BoundedMap` undefined-key eviction fix and `TtlMap.has()` undefined-value semantics corrected (B6) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/lib/memory/bounded-cache.vitest.ts` | Modified | Regression coverage for BoundedMap and TtlMap edge cases (B6) |
| `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` | Modified | Dry-run `apply` alias removed (B6) |
| `.opencode/skills/system-code-graph/mcp_server/lib/index.ts` | Modified | Lifecycle helpers exported through public barrel (B6) |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Modified | Lifecycle helpers imported through public barrel (B6) |

### Follow-Ups

- Implement shared lease/ownership helper across TS and CJS runtimes to eliminate the remaining ownership-race risk flagged in ADR-001 (DR009-COR-001 and DR009-COR-002 are deferred to a future arc).
- Restore DR009-TRC-005 RSS slope measurement when an environment with `ps` access and live CocoIndex daemon startup is available.
- Add explicit environment allowlists for subprocess boundaries per ADR-002 once the new sidecar architecture stabilises.
