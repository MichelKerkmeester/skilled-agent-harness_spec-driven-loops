---
title: "Implementation Summary: 023B Fixture Calibration"
description: "Expanded retrieval calibration fixture, repeated-run sweep harness, residual miss taxonomy, and ROBUST verdict gates."
trigger_phrases:
  - "023B complete"
  - "fixture calibration complete"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed expanded fixture and calibration harness"
    next_safe_action: "Schedule full --runs 3 sweep before any ROBUST verdict"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/code-retrieval-fixture-expanded-v2.json"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_calibration_perturbation.py"
      - "evidence/robust-verdict-gates.md"
    session_dedup:
      fingerprint: "sha256:023b000000000000000000000000000000000000000000000000000000000006"
      session_id: "023-deep-research-arc-blind-spots/007-fixture-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration` |
| **Completed** | 2026-05-19 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

023B now gives mcp-coco-index a real calibration surface. The expanded fixture has 73 probes: the original 18-probe corrected fixture, 15 architecture-invariant probes, 10 multilingual/code-switched probes, 5 short probes, 5 long probes, and at least five truth targets for each path class: implementation, tests, docs, generated, vendor, and spec-research.

The phase2 bench folder now has `calibration_perturbation.py` for fixture validation, mean/stddev/CI95 aggregation, RRF flat-line variance checks, and residual miss classification. `run-expanded-bench.sh` is the long runner: it supports `--runs 3`, writes `runs/lane-<id>-run-<n>.json`, and covers RRF K, boost, rerank top-K, and fusion alternative lanes.

Evidence docs define the ROBUST gates, default-change recommendation, and residual miss taxonomy. Defaults stay unchanged because the full n>=3 sweep was not run in this packet.

Findings closed or routed:

| Finding | Closure |
|---|---|
| HIGH FINDING-001-A | Expanded fixture separates regression floor from calibration evidence. |
| HIGH FINDING-003-A | Boost dominance now has a sweep harness and path-class probes. |
| HIGH FINDING-014-B | Architecture-invariant probes added. |
| MED FINDING-001-B | Residual miss taxonomy implemented. |
| MED FINDING-003-B | RRF K sweep defined. |
| MED FINDING-003-C | Rerank top-K sweep defined. |
| MED FINDING-007-A | Fusion alternatives defined. |
| MED FINDING-007-B | n>=3 repeated-run discipline implemented. |
| MED FINDING-007-C | Multilingual/code-switched probes added. |
| MED FINDING-010-B | Fixture amplification measured through broader fixture design and sample smoke. |
| MED FINDING-014-A | RRF flat-line variance assertion added. |
| MED FINDING-016-C | Fusion alternatives provide counter-design baseline lanes. |
| MED FINDING-020-B | ROBUST verdict gates defined. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet is measurement-only. I added the fixture and harness, validated schema counts, ran unit tests, and recorded a five-probe live smoke sample. The full long sweep is documented but deferred because `--runs 3` is expected to take about 60 minutes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep original 18 probes as `original` profile | They remain the regression floor while the expanded fixture measures broader coverage. |
| Add pure Python helper beside shell runner | Unit tests can verify aggregation and taxonomy without a live daemon. |
| Defer default changes | Sample smoke is not enough evidence for production RRF/boost/top-K changes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fixture validation | PASS, 73 probes with required profile/path-class counts. |
| `.venv/bin/python -m pytest tests/test_calibration_perturbation.py -q` | PASS, `4 passed in 0.01s`. |
| Live smoke run | PASS, `3/5` hits in `lane-sample-smoke-run-1.json`. |
| `.venv/bin/python -m pytest tests/ -q` | PASS, `227 passed in 18.65s`. |
| `.venv/bin/ruff check cocoindex_code tests .../calibration_perturbation.py` | PASS, `All checks passed!`. |
| `validate.sh .../023-deep-research-arc-blind-spots/007-fixture-calibration --strict` | PASS, `Errors: 0 Warnings: 0`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full n>=3 sweep not executed.** The harness is ready, but the release-grade run is about 60 minutes.
2. **Fusion alternatives are measurement labels.** Production `query.py` still uses RRF; CombMNZ and average are harness candidates for follow-on wiring.
3. **CLI search does not expose diagnostics directly.** The taxonomy classifier accepts 023C counter-shaped data, but the simple CLI smoke run has empty diagnostics.
<!-- /ANCHOR:limitations -->
