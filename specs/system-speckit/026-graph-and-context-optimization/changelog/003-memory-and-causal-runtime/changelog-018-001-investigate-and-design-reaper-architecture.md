---
title: "Rerank-Sidecar Reaper Investigation and Three-Layer Architecture Design"
description: "Investigation packet that mapped the full rerank_sidecar lifecycle with file:line citations, confirmed no reaper existed, evaluated the three-layer B+D+A design. Emitted 7 ADRs plus a concrete Files-to-Change list for follow-on implementation."
trigger_phrases:
  - "rerank sidecar reaper investigation"
  - "three-layer reaper architecture"
  - "sidecar accumulation root cause"
  - "owner-liveness gc design"
  - "rerank sidecar lifecycle map"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design`

### Summary

25 stale `rerank_sidecar` uvicorn workers had accumulated on the development machine consuming roughly 16 GB of RAM. No reaper existed: `start_new_session=True` daemonizes the sidecar for warm-model reuse, but nothing cleans up sidecars whose owner-set has emptied. Without a binding investigation deliverable, the follow-on implementation packet had no contract to work from.

This research packet mapped the current lifecycle with file:line citations across all four source twins (`client.py:327`, `ensure_rerank_sidecar.py:269`, `ensure-rerank-sidecar.cjs:392-400`), confirmed no reaper hook existed, then evaluated the three-layer B+D+A design (Layer B owner-liveness self-check inside the sidecar, Layer D launcher pre-flight reap, Layer A idle backstop). It produced 7 ADRs plus a concrete Files-to-Change list with per-file invariants and parity-test requirements. The deliverable unblocks follow-on packet 010/005.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| Source lifecycle reads | PASS. Mandated files read with file:line evidence across `client.py`, `ensure_rerank_sidecar.py`, `ensure-rerank-sidecar.cjs`, `sidecar_ledger.py`. |
| Findings count | PASS. 12 lifecycle findings registered in `research/findings-registry.json`. |
| ADR count | PASS. 7 ADRs in `decision-record.md` covering architecture, identity-verified PID, ledger schema, tunable defaults, parity-test contract, telemetry. Also covers in-flight gate. |
| Marginal layer coverage | PASS. Layers B, D, A each have non-zero marginal coverage documented in `research/research.md`. |
| Edge-case inventory | PASS. 10 failure-mode cases documented in `research/research.md` section 2. 6 required cases met: multi-owner partial death, last-owner-during-request, PID reuse, SIGSTOP sidecar, ledger race, operator-spawned debug. |
| Strict validation | PASS. `validate.sh <packet> --strict` exited 0 with zero errors. |
| Research synthesis | `research/research.md` produced from 1 investigation iteration. `research/iter-001.md` documents lifecycle map, ledger lifecycle, existing GC paths. Findings list with citations included. |

### Files Changed

| File | What changed |
|------|--------------|
| `research/iter-001.md` (NEW) | Lifecycle investigation with frontmatter, lifecycle map, ledger lifecycle, existing GC paths, start-new-session verification. Findings list included. |
| `research/research.md` (NEW) | Synthesis document evaluating Layer B, D, A designs with marginal coverage and failure-mode inventory |
| `research/findings-registry.json` (NEW) | 12 lifecycle findings with file:line citations |
| `decision-record.md` (NEW) | 7 Proposed ADRs covering architecture, identity-verified PID liveness, ledger schema, tunable defaults, parity-test contract, telemetry. Also covers in-flight gate. |
| `plan.md` (NEW) | Canonical arc scaffold for the investigation tasks |
| `tasks.md` (NEW) | Task list using canonical sibling anchors |
| `checklist.md` (NEW) | 33 checklist items, all completed |
| `implementation-summary.md` (NEW) | Completion record with Files-to-Change list for follow-on packet 010/005 |

### Follow-Ups

- Implement the three-layer B+D+A reaper in follow-on packet 010/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper using the Files-to-Change list and ADRs produced here.
- Run the parity fixture matrix after implementation to confirm JS and Python twins agree on identity-check semantics.
- Validate the identity-verified PID check against macOS `ps -p PID -o lstart= -o comm=` format contracts in the implementation test suite.

## Later Update (2026-06-04)

The rerank-sidecar runtime files referenced in this changelog were later removed in cleanup commits 74b9677494, b564013c0e and 696c889887. This entry records the work as it shipped at the time. The parent packet status is now Shipped then removed.
