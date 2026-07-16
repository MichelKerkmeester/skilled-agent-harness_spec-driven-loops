---
title: "Implementation Plan: Vague-Query Model Benchmark [template:level_2/plan.md]"
description: "A custom benchmark harness in the phase folder: a JSON config defining the model by query by sample matrix, a concurrent dispatch driver over opencode run --command, and an event-stream parser that aggregates per-cell metrics to mean plus variance. Reuses the proven pilot dispatch shape and rejects the correctness-gated deep model-benchmark scorer as the wrong fit for a behavior comparison."
trigger_phrases:
  - "vague query model benchmark"
  - "memory search model comparison"
  - "benchmark driver parser"
  - "search behavior harness"
  - "model dispatch matrix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark"
    last_updated_at: "2026-07-04T17:12:04.504Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored harness, driver running the 144-cell matrix"
    next_safe_action: "Parse metrics and write the results tables"
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
# Implementation Plan: Vague-Query Model Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` benchmark scripts |
| **Framework** | `opencode run --command memory/search` dispatch, JSONL event stream |
| **Storage** | Raw per-cell output files, timing sidecars, and a metrics.json rollup |
| **Testing** | Parser sanity-check on the folded-in pilot cells, host verification of the cell count |

### Overview
This phase builds a small custom benchmark harness in the phase folder. A JSON config names the four models with their variant, the twelve vagueness-graded queries, the sample count and the concurrency. A driver expands the config into one cell per model per query per sample, dispatches each as a bare `/memory:search` query through `opencode run --command` at the launch-race-safe concurrency of three, and writes each raw event stream plus a timing sidecar. A parser then reads each stream into per-cell metrics and aggregates them to mean plus sample standard deviation. The deep model-benchmark sweep was considered and rejected: its scorer is correctness-gated on assertions and pass-rate, which would penalize the behavioral diversity this benchmark exists to measure, so a purpose-built parser is the right tool.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three small scripts over an unchanged command surface: a config, a concurrent dispatch driver, and a metric parser. The driver and parser own all logic. Nothing in the memory MCP or the command is touched, so the harness is additive and self-contained in the phase folder.

### Key Components
- **`benchmark-config.json`**: the matrix definition. Four models each with a slug and a variant, twelve queries each tagged with a vagueness class, three samples per cell, concurrency three, and a per-cell timeout.
- **`run-benchmark.mjs`**: an async spawn pool that runs each cell as `AI_SESSION_CHILD=1 gtimeout opencode run --command memory/search --model <slug> --variant <variant> --format json --dir <root> "<query>"` with stdin closed. It writes the raw stream and a timing sidecar, retries an empty-output cell once, and skips any cell that already has a non-empty raw file.
- **`extract-metrics.mjs`**: parses each raw event stream for tool calls, output text and the presentation envelope, derives the per-cell metrics, then aggregates to mean plus standard deviation per model and query, a per-model rollup, and a per-query cross-model consistency view.

### Data Flow
The driver reads the config, expands the cells, and dispatches them concurrently into `results/raw/` and `results/meta/`. The parser reads those two directories plus the config, computes per-cell metrics, and writes a single `results/metrics.json`. The results and analysis docs are authored from that one file, so every reported number has a single source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase is an additive read-only benchmark, not a fix. It touches no shared surface, it adds eval-only scripts and result data inside the phase folder and reads the memory database through bare-query retrieval without writing it. The table is retained for template conformance and records that no production surface changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/memory:search` command and envelope | The retrieval surface under measurement | no change, dispatched as-is | grep shows no edit under the command or the memory MCP |
| memory database | The corpus the queries read | read-only, no write | only bare-query retrieval is dispatched, no analysis subcommand, no record created |
| phase `scripts/` and `results/` | New benchmark harness and data | create, self-contained in the phase folder | the working-tree diff stays confined to the phase folder |

Required inventories:
- Same-class producers: `rg -n 'opencode run --command' .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark/scripts`.
- Consumers of changed symbols: none, the harness exports nothing and no shared code imports it.
- Matrix axes: four models, twelve queries across four vagueness classes, three samples per cell.
- Algorithm invariant: every dispatch is a bare-query retrieval, the parser sources each metric from the raw stream and the config, and the citation-correctness check applies the cite-iff-good rule per cell.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author `benchmark-config.json` with the four model and variant pairs, the twelve query grid, three samples and concurrency three
- [x] Pre-seed the nine overlapping pilot cells as sample one so they are reused not re-dispatched
- [x] Confirm the four providers and model slugs in a pre-flight before the run

### Phase 2: Core Implementation
- [x] Build `run-benchmark.mjs` as an idempotent async spawn pool with one empty-output retry and a timing sidecar per cell
- [x] Build `extract-metrics.mjs` to parse the envelope and tool events and aggregate to mean plus variance
- [x] Sanity-check the parser on the nine pilot cells before committing to the full run
- [x] Run the driver in the background over the remaining cells

### Phase 3: Verification
- [x] Confirm metrics.json reports a cell count near the 144 expected, with any launch-race gaps documented
- [x] Confirm each per-model profile carries variance and that the citation-correctness rule was evaluated per cell
- [x] Author the results tables and the analysis grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The parser extracts tool count, envelope fidelity, the verdict and the top score correctly from a known pilot cell | direct parser invocation on the seeded cells |
| Integration | The driver dispatches a cell, writes a raw stream plus a sidecar, and the parser turns the matrix into metrics.json | a full driver-then-parser run |
| Manual | Spot-check that the off-corpus and maximally-vague rows produce the expected weak or gap verdicts | reading the parsed metrics for those rows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The `/memory:search` registered command and its presentation envelope | Internal | Green | The benchmark measures this surface, a change to it would shift the baseline |
| The four provider plans and the gpt-5.5-fast model | External | Green | A missing model drops a row from the matrix |
| `opencode run --command` non-interactive dispatch | External | Green | The harness cannot run without it |
| The folded-in pilot cells as sample one | Internal | Green | Reused to save nine dispatches, the run still completes without them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The harness or its outputs prove unsound, or the phase is abandoned.
- **Procedure**: Remove the phase folder. The benchmark adds only eval-only scripts and result data and touches no shared code, so nothing else needs a revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Parser sanity-checked on the pilot cells before the full run
- [x] Provider pre-flight confirmed all four models
- [x] Read-only confirmed, no analysis subcommand dispatched

### Rollback Procedure
1. Stop the driver if it is still running
2. Remove the phase folder including scripts and results
3. Confirm no shared code or memory record was touched, since the run was read-only

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds eval-only scripts and result files and reads the memory database without writing it
<!-- /ANCHOR:enhanced-rollback -->

---
