---
title: "Implementation Plan: 023B Fixture Calibration"
description: "Plan for expanded retrieval fixture, repeated-run calibration sweeps, residual taxonomy, and ROBUST verdict gates."
trigger_phrases:
  - "023B plan"
  - "fixture calibration plan"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned and executed calibration harness"
    next_safe_action: "Run full sweep with --runs 3"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:023b000000000000000000000000000000000000000000000000000000000002"
      session_id: "023-deep-research-arc-blind-spots/007-fixture-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 023B Fixture Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, Bash, JSON fixture data |
| **Storage** | Packet-local evidence JSON/Markdown |
| **Testing** | pytest and ruff in mcp-coco-index package |
| **Primary Risk** | Treating regression-grade fixture evidence as production coverage |

The implementation keeps production ranking code untouched. It adds measurement surfaces that can exercise RRF K, hybrid boosts, rerank top-K, and fusion alternatives over a broader fixture.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 pre-bound to option E.
- [x] 023C implementation summary read for diagnostic counter names.
- [x] Existing corrected fixture and phase2 bench scripts read before editing.

### Definition of Done

- [x] Expanded fixture validates.
- [x] Harness unit tests pass.
- [x] Rerank/default code remains unchanged.
- [x] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Components

- **Expanded fixture**: JSON probe list with profiles, truth sets, path-class breakdown, and predicted failure mode.
- **Calibration helper**: pure Python functions for validation, aggregation, CI95, RRF flat-line variance, and miss classification.
- **Shell runner**: long-run executor that restarts the daemon between lanes and writes per-run JSON.
- **Evidence docs**: gates, recommendation, summary, and taxonomy artifacts.

### Data Flow

The shell runner executes `ccc search` per probe, writes run JSON, then the helper aggregates lane metrics and taxonomy tables. Unit tests exercise the helper without requiring a live daemon.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Existing corrected fixture | Regression floor | Read and preserve original 18 probes with extra annotations. | `test_expanded_fixture_loadable`. |
| `phase2-bench` | Existing calibration bench area | Add separate 023B runner/helper. | pytest imports helper by path. |
| Benchmark folder | Historical bench outputs | Add expanded fixture folder. | fixture validation command. |
| mcp-coco-index tests | Package verification | Add harness tests. | `pytest tests/test_calibration_perturbation.py -q`. |
| Packet docs | Continuity and evidence | Add Level 3 docs and evidence. | strict validation. |

Producer inventory: `rg -n "RetrievalDiagnostics|boost_flip_count|rerank_input_count|COCOINDEX_HYBRID_RRF_K|COCOINDEX_RERANK_TOP_K" .opencode/skills/mcp-coco-index/mcp_server`.

Consumer inventory: phase2 runner, calibration helper, test module, and evidence markdown.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read 023C implementation summary.
- Read corrected fixture and phase2 bench scripts.
- Confirm packet directory and dirty worktree state.

### Phase 2: Implementation
- Create expanded fixture.
- Add aggregation/taxonomy helper and long-run script.
- Add focused tests.
- Produce evidence docs.

### Phase 3: Verification
- Run fixture validation.
- Run targeted and full pytest.
- Run ruff.
- Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Aggregator, CI95, classifier, fixture schema | pytest |
| Smoke | Live `ccc search` subset | sample run JSON |
| Lint | Python code and tests | ruff |
| Spec | Level 3 docs and metadata | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 023C diagnostics | Prerequisite | Shipped | Taxonomy loses stage counters. |
| 023A1/A2/A3/D/F | Prerequisite | Shipped per request context | Fixture truth targets and metadata gates depend on these packets. |
| Local ccc index | Runtime | Available for smoke | Full sweep can run later. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the 023B fixture folder, phase2 helper/runner, test file, and packet docs. No production defaults or ranking code were changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L3: PHASE DEPENDENCIES

```text
023C counters -> 023B taxonomy
023A metadata/model packets -> 023B truth targets
023B full sweep -> future default-change packet
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L3: EFFORT ESTIMATION

| Phase | Complexity | Notes |
|-------|------------|-------|
| Fixture design | Medium | 73 probes with annotations. |
| Harness | Medium | Pure helper plus long shell runner. |
| Verification | Medium | Full sweep deferred by runtime cap. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L3: ENHANCED ROLLBACK

Rollback does not require database migration. The only runtime side effect from verification is daemon search activity and packet-local sample evidence.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

| Node | Depends On | Provides |
|------|------------|----------|
| Fixture v2 | Corrected fixture, shipped 023A/023C/023D/023F targets | Calibration probes |
| Runner | `ccc search`, fixture v2 | Per-run JSON |
| Helper | Per-run JSON, fixture v2 | Summary and taxonomy |
| Recommendation | Helper outputs | Default-change decision boundary |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Preserve original fixture floor.
2. Add expanded probes with path-class coverage.
3. Add repeatable run artifacts.
4. Add pure aggregation and taxonomy logic.
5. Verify without changing defaults.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Fixture validates | fixture validation JSON output |
| Harness tests pass | `4 passed in 0.01s` targeted |
| Live smoke recorded | `evidence/runs/lane-sample-smoke-run-1.json` |
| Defaults unchanged | `calibration-recommendation.md` |
<!-- /ANCHOR:milestones -->
