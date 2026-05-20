---
title: "Feature Specification: 023B Fixture Calibration"
description: "Expand the mcp-coco-index retrieval benchmark from regression fixture to calibration fixture with repeated-run sweeps, residual miss taxonomy, and ROBUST verdict gates."
trigger_phrases:
  - "023B"
  - "fixture calibration"
  - "expanded retrieval fixture"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed 023B fixture calibration harness"
    next_safe_action: "Run full expanded bench when operator allocates about 60 minutes"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/code-retrieval-fixture-expanded-v2.json"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/calibration_perturbation.py"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-expanded-bench.sh"
    session_dedup:
      fingerprint: "sha256:023b000000000000000000000000000000000000000000000000000000000001"
      session_id: "023-deep-research-arc-blind-spots/007-fixture-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "023C diagnostic counters are the taxonomy source."
      - "Defaults stay unchanged until full n>=3 sweep evidence exists."
---
# Feature Specification: 023B Fixture Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

023B turns the corrected 18-probe fixture into a broader calibration asset. It adds architecture-invariant, multilingual/code-switched, short, long, and path-class-stratified probes, plus a repeated-run perturbation harness that reports mean, stddev, and CI95.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The corrected fixture proved regression behavior, but it did not measure production retrieval coverage. It also had only one run, binary top-5 scoring, no residual miss taxonomy, and insufficient evidence for RRF, boost, top-K, and fusion choices.

### Purpose

Provide the fixture, harness, taxonomy, and gates needed to decide whether the current retrieval defaults are robust without changing production defaults inside this measurement packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `benchmark-2026-05-20-expanded/code-retrieval-fixture-expanded-v2.json`.
- Add `run-expanded-bench.sh` and `calibration_perturbation.py`.
- Add unit tests for fixture schema, aggregation, RRF flat-line assertion, and residual miss classification.
- Write residual taxonomy, ROBUST verdict gates, calibration recommendation, and packet docs.

### Out of Scope

- Changing default RRF, boost, rerank top-K, or fusion formula values.
- Embedder or reranker swaps.
- Git commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/` | Create | Expanded benchmark fixture and source note. |
| `011-rerank-model-fit-investigation/research/phase2-bench/calibration_perturbation.py` | Create | Aggregation, CI95, fixture validation, and taxonomy helper. |
| `011-rerank-model-fit-investigation/research/phase2-bench/run-expanded-bench.sh` | Create | Long-run sweep runner with `--runs 3`. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_calibration_perturbation.py` | Create | Unit coverage for the harness. |
| `023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/*.md` | Create | Gates, recommendation, taxonomy, and summary evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Expanded fixture | Fixture validates and includes original, architecture-invariant, multilingual, short, long, and path-class probes. |
| REQ-002 | Repeated-run harness | Runner accepts `--runs 3`, writes `runs/lane-<id>-run-<n>.json`, and documents wall time. |
| REQ-003 | Perturbation sweeps | Runner defines RRF K, hybrid boost, rerank top-K, and fusion-alternative lanes. |
| REQ-004 | Aggregation | Helper computes mean, stddev, and CI95 from per-run JSON. |
| REQ-005 | Residual taxonomy | Miss classifier maps misses to 023C-backed failure modes. |
| REQ-006 | Verdict gates | ROBUST gates are defined with measurable thresholds. |
| REQ-007 | Verification | pytest, ruff, and strict spec validation pass or failures are reported. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Expanded fixture has at least 18 original, 15 architecture-invariant, 10 multilingual/code-switched, 5 short, 5 long probes.
- **SC-002**: Every path class has at least five truth targets.
- **SC-003**: Aggregator reports mean/stddev/CI95 per lane.
- **SC-004**: Residual taxonomy can classify every miss using diagnostics and harness fields.
- **SC-005**: No production default changes are made in this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 023C diagnostics | Taxonomy needs candidate and reranker counters. | Read 023C summary and align classifier fields. |
| Risk | Full sweep runtime | n=3 can take about 60 minutes. | Ship harness and live smoke; document long-run command. |
| Risk | Vendor/generated truth targets | Some are intentionally excluded from index. | Mark expected failure mode and use them to measure path-class behavior. |
| Risk | Env knobs may need production wiring | Fusion alternatives are harness labels first. | Recommend follow-on before default changes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Harness outputs must be deterministic JSON names.
- **NFR-P01**: Single full run should target roughly 20 minutes on the current repo.
- **NFR-O01**: Reports must distinguish sample smoke evidence from release verdict evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Missing truth target path fails fixture validation.
- `success=false` runs remain visible but should not be used for ROBUST release gates.
- Empty diagnostics still classify misses conservatively.
- Full sweep should be resumable through `--resume`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Fixture, shell, Python, tests, evidence docs. |
| Risk | 18/25 | Measurement quality affects future default choices. |
| Architecture | 17/20 | Harness defines release gates but avoids production ranking changes. |
| **Total** | **53/70** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Mistaking sample smoke for release evidence | Medium | Bad ROBUST verdict | Evidence docs explicitly mark sample-only status. |
| Fixture ambiguity | Medium | False miss labels | Per-probe expected failure mode supports `fixture_ambiguity`. |
| Long-run interruption | Medium | Partial evidence | `--resume` skips completed JSON. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-001**: As a maintainer, I want architecture-invariant probes so search quality is not tied to exact class/function names.
- **US-002**: As an operator, I want repeated-run CI95 so a single lucky run does not drive defaults.
- **US-003**: As a reviewer, I want residual miss taxonomy so future fixes target the right retrieval stage.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

The full n>=3 sweep remains an operator-time task, not an unresolved design question.
<!-- ANCHOR:questions -->
Question anchor mirror: no packet-blocking questions remain.
<!-- /ANCHOR:questions -->
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `../023-deep-research-arc-blind-spots/002-retrieval-observability/implementation-summary.md`
- `evidence/robust-verdict-gates.md`
- `evidence/calibration-recommendation.md`
<!-- /ANCHOR:related-docs -->
