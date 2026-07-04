---
title: "Spec: Vague-Query Model Benchmark [template:level_2/spec.md]"
description: "A characterization benchmark of how four LLMs drive the /memory:search command on deliberately vague queries, measuring tool efficiency, envelope fidelity, and whether the deterministic retrieval-quality verdict stays stable across models. Runs a 4-model by 12-query by 3-sample matrix of read-only dispatches and reports per-model behavioral profiles plus a model recommendation."
trigger_phrases:
  - "vague query model benchmark"
  - "memory search model comparison"
  - "requestQuality citation robustness"
  - "search behavior benchmark"
  - "model search efficiency"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark"
    last_updated_at: "2026-07-04T17:12:04.504Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the 144-cell matrix, authored results and analysis"
    next_safe_action: "Phase complete, results live in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/benchmark-config.json"
      - "scripts/run-benchmark.mjs"
      - "scripts/extract-metrics.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Vague-Query Model Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-22 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A pilot run showed that four different LLMs drive the `/memory:search` command very differently on the same vague query. One model used a single retrieval tool, another spiked to twenty tool calls while reaching the same verdict, and a third wrote the longest analysis off the fewest calls. The command emits a data-quality signal (`requestQuality` good or weak or gap, derived deterministically from absolute-relevance scores, and `citationPolicy` set to cite only when the verdict is good), but no benchmark had measured whether that signal is model-robust or which model drives the retrieval most efficiently and faithfully.

### Purpose
Characterize, with a replicated and reproducible matrix, how MiMo, Kimi, DeepSeek and gpt-5.5 each drive `/memory:search` on a vagueness-graded query set. Produce a per-model behavioral profile, a finding on whether the quality and citation surface is stable across models, and a recommendation for which model to use for search dispatches.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 4-model by 12-query by 3-sample matrix of bare `/memory:search` dispatches through `opencode run --command`
- Per-cell metrics: tool efficiency, envelope fidelity, the quality verdict and top score, citation correctness, verbosity, intent and latency
- Aggregation to mean plus sample variance, cross-model verdict consistency, and a per-model profile
- A reproducible driver, parser and config committed in the phase folder

### Out of Scope
- Any change to the `/memory:search` command, its envelope, or the underlying retrieval
- The analysis subcommands of the command (preflight, postflight, ablation, dashboard and the rest), since those write to the memory database and a bare query does not
- A pass or fail promotion gate. There is no correct answer to a vague query, so the deliverable is a characterization not a gate

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/benchmark-config.json | Create | The model, query and sampling matrix |
| scripts/run-benchmark.mjs | Create | The concurrent dispatch driver |
| scripts/extract-metrics.mjs | Create | The event-stream parser and aggregator |
| results/ | Create | The raw outputs, timing sidecars and metrics.json |
| benchmark-results.md | Create | The full per-cell and aggregate data tables |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The matrix runs across all four models and twelve queries with three samples each | results/metrics.json reports cellsParsed near the 144 expected, and any launch-race failures are documented not silently dropped |
| REQ-002 | Per-cell metrics extracted with cross-sample variance | metrics.json carries mean plus standard deviation for tool count, top score, chars and latency per model and query |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every analysis claim traces to a measured number | benchmark-results.md and implementation-summary.md cite values present in metrics.json |
| REQ-004 | The benchmark is read-only against the memory database | only bare-query retrieval is dispatched, no analysis subcommand, and the run creates no memory records |
| REQ-005 | The run is reproducible from the committed config | `node scripts/run-benchmark.mjs` regenerates the matrix from benchmark-config.json |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four per-model behavioral profiles documented (tool efficiency, verbosity, envelope fidelity, latency, quality-verdict stability) with variance bars
- **SC-002**: A cross-model robustness finding stating whether the four models agree on the `requestQuality` verdict per query, especially on the off-corpus and maximally-vague rows
- **SC-003**: A model recommendation for `/memory:search` dispatches, grounded strictly in the measured metrics
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The opencode launch-race kills a fraction of simultaneous dispatches | Missing cells | Concurrency held at three, one retry per empty-output cell, and any residual gaps reported |
| Risk | LLM dispatches are non-deterministic | A single number misleads | Three samples per cell with reported variance, not a point estimate |
| Dependency | The three provider plans (Xiaomi, Kimi For Coding, DeepSeek) and the OpenAI gpt-5.5-fast model | The matrix cannot run a missing model | Provider pre-flight confirmed all four before the run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Concurrency capped at three simultaneous dispatches, the cli-opencode launch-race ceiling, so the matrix completes without losing cells to the race
- **NFR-P02**: Each dispatch is wall-clock bounded by a hard timeout so one hung cell cannot stall the matrix

### Security
- **NFR-S01**: Only bare-query retrieval is dispatched, which is read-only, so no benchmark cell mutates the memory database
- **NFR-S02**: The driver passes each query as a quoted argument and reads only the model output, introducing no new untrusted execution surface

### Reliability
- **NFR-R01**: A cell with an empty output is retried once, since an empty stream is the launch-race death and not a model verdict
- **NFR-R02**: The driver is idempotent, skipping any cell that already has a non-empty raw file, so a crashed run resumes without repeating completed cells
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Off-corpus query: a term with no corpus match should score below the floor and earn a gap or weak verdict with a no-cite policy, the discriminating case for false-relevance
- Maximally-vague multi-word query: tests whether a model still returns the contract rather than over-elaborating
- Empty or truncated output: parsed as a failed cell, never counted as a real zero-tool result

### Error Scenarios
- Launch-race empty stream: retried once, then recorded as a failed cell if still empty
- Missing timing sidecar: latency reads as unknown for that cell and the other metrics still parse, which is how the folded-in pilot cells are handled

### State Transitions
- Sample variance: a model that returns different verdicts across its three samples is flagged as unstable rather than averaged into a false single verdict
- Cross-model disagreement: when the four models split on a verdict, the query is marked low-agreement rather than reported as a single consensus
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four models, twelve queries, three samples, one command surface |
| Risk | 7/25 | Read-only dispatches, low blast radius, the only risk is the launch-race |
| Research | 16/20 | A replicated matrix with variance and a cross-model consistency analysis |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether a future pass should add the variant axis (each model at medium and high) to measure how reasoning level changes search-driving
- Whether the off-corpus gap-detection result warrants a standing red-team query in the eval harness
<!-- /ANCHOR:questions -->
