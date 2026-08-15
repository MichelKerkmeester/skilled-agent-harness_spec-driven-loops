---
title: "Changelog: Phase 004 Protected Spans, Fidelity, and Render [035-improved-communication/004-protected-spans-fidelity-render]"
description: "Chronological changelog for the Phase 004 Protected Spans, Fidelity, and Render phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-11

> Spec folder: `specs/sk-communication/001-sk-communication-creation/004-protected-spans-fidelity-render` (Level 3)
> Parent packet: `specs/sk-communication/001-sk-communication-creation`

### Summary

Phase 004 adds a deterministic display-projection safety boundary without changing canonical CLI messages, transcripts, tool data or future model context.

### Added

- [P] Create the proposed Phase 004 package surfaces and focused test harness (spec.md, plan.md)
- Pin the dialect and implement collision-safe bijection. (packages/cli-communication-projection/src/fidelity/)
- [P] Implement deterministic vetoes and capability-aware render decisions (packages/cli-communication-projection/src/fidelity/, src/render/)
- Implement typed validator failure, cancellation, timeout, reject-only judge, and exact-original fallback behavior (packages/cli-communication-projection/src/fidelity/, src/render/)
- [P] Implement bijection, corruption, render-decision, exact-fallback, and negative-control tests (packages/cli-communication-projection/test/fidelity/)
- Reconcile checklist, implementation summary, metadata, and 005-provider-adapters-and-privacy handoff (checklist.md)

### Changed

- Confirm 003-core-normalization-and-assembly handoff evidence and capture the baseline (spec.md, plan.md)
- Freeze public contracts, invariants, and independent test-matrix axes (spec.md, plan.md)
- Emit content-free validation and render reason events through the shared evidence boundary (packages/cli-communication-projection/src/render/)
- [P] Run same-class producer and changed-consumer inventories (checklist.md)
- Run focused negative controls and boundary tests (checklist.md)
- Run the authoritative workspace gate and recursive packet validator (checklist.md)

### Fixed

- No fixes recorded.

### Verification

- Phase 003 baseline - PASS: typecheck, build, 12 files and 47 tests, plus public import smoke
- Focused Phase 004 suite - PASS: 4 files and 23 tests
- Whole package gate - PASS: typecheck, build, 16 files and 70 tests, plus public import smoke
- One-mebibyte warm benchmark - PASS: 5 warmups, 30 measured runs, 23.72 ms p50 and 24.83 ms p95 on Apple M5 Max, Node v25.6.1
- Performance repair delta - PASS: observed failing p95 92.86 ms to final 24.83 ms, a 68.03 ms or 73.3% reduction
- Dependency and license boundary - PASS: no production dependencies and npm audit --omit=dev reports 0 vulnerabilities
- Package dry run - PASS: 165 entries, 90,676 bytes packed and 465,840 bytes unpacked
- Scoped source fingerprint - PASS: sha256:923dcc68b3b008facb9576ff35657d645f2ac2a174b7fc60df43688f5be845d3

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Safety-biased heuristics: Deterministic semantic checks intentionally reject some acceptable rewrites and cannot prove unrestricted natural-language equivalence. Phase 007 owns corpus expansion and blinded human parity evaluation.
- No provider transport: OpenCode Go with DeepSeek V4 Flash, other hosted providers, Ollama and llama.cpp remain Phase 005 work behind privacy-first routing.
- No runtime presentation: Claude, Codex, Pi, OpenCode, Devin and Cursor integration remains Phase 006 work. Atomic replacement is a declared capability, not yet a proven runtime fact.
- Index visibility: Canonical packet files and generated metadata are available, but immediate memory indexing may remain unavailable while the configured transport or native SQLite ABI is unhealthy.
