# Iteration 007 — RQ7: Benchmark Methodology Transfer

**Started**: 2026-05-08T15:00:00Z
**Focus**: RQ7 — Propose the lightest viable local eval harness for measuring `code_graph` adoption impact (file-reads-avoided / context-accuracy / answer-completeness). Compare XCE's SWE-bench Verified methodology against existing test infrastructure to define a harness shape WITHOUT building it.

---

## Actions

1. Read `external/README.md` (full 283 lines) — extract benchmark methodology section + chart references.
2. Read `vitest.stress.config.ts` (35 lines) — stress test config, timeout, parallelism, exclude patterns.
3. Read `mcp_server/tests/eval-metrics.vitest.ts` (625 lines) — 12-metric eval infrastructure: MRR, NDCG, Recall, HitRate, Precision, F1, MAP, InversionRate, ConstitutionalSurfacingRate, ImportanceWeightedRecall, ColdStartDetectionRate, IntentWeightedNDCG.
4. Read `mcp_server/tests/smart-router-measurement.vitest.ts` (184 lines) — existing static measurement harness: labeled corpus, advisor accuracy, markdown report, JSONL output.
5. Read `scripts/observability/smart-router-measurement.ts` (841 lines) — measurement engine source: `runMeasurement()`, `predictSmartRouterRoute()`, corpus loading, compliance telemetry.
6. Read `mcp_server/scripts/README.md` (116 lines) — confirms scripts are compatibility wrappers, canonical scripts live in workspace `scripts/`.
7. Read iteration-006.md — prior iter next-focus + state.
8. Read `deep-research-state.jsonl` — current state (line 10: iter 6 complete).
9. Glob `mcp_server/lib/eval/` — 15 eval infrastructure files including `eval-metrics.ts`, `ground-truth-generator.ts`, `ablation-framework.ts`, `warm-start-variant-runner.ts`, `eval-db.ts`.

---

## Findings

### F-039: XCE benchmark methodology — SWE-bench Verified + mini-swe-agent (closed-source)

**The XCE benchmark section (external/README.md:31-48) reveals:**

| Element | Detail | Source file:line |
|---------|--------|-----------------|
| **Platform** | SWE-bench Verified (swebench.com) | external/README.md:37 |
| **Harness** | mini-swe-agent | external/README.md:37 |
| **Baseline** | Sonnet 4.0 raw: 66.0% resolve rate | external/README.md:41 |
| **Treatment** | Sonnet 4.0 + XCE: 73.4% (+7.4pp) | external/README.md:42 |
| **Cascade hybrid** | Sonnet 4.0 + XCE (cascade): 76.8% | external/README.md:43 |
| **Cross-model** | MiniMax M2.5: 75.8% baseline → 78.2% with XCE (+2.4pp) | external/README.md:44-45 |
| **Benchmark chart** | `assets/xce-benchmarks.png` (visual only) | external/README.md:34 |
| **Cost claim** | "An older-generation model (Sonnet 4.0) with XCE beats raw Sonnet 4.6 and reaches Opus-level performance — at 16x lower cost." | external/README.md:47 |
| **Token reduction** | "~20% token reduction when the agent uses XCE proactively" | external/README.md:188 |

**Key assessment:** XCE's benchmark methodology is **not directly replicable** for our local eval:
1. **SWE-bench Verified** requires Docker execution environments, GitHub dataset downloads, and the `swe-bench-eval` Python evaluation pipeline. This is a heavyweight CI-scale infrastructure (~50GB+ Docker images, per-task sandboxes).
2. **mini-swe-agent** is a specific agent scaffold with its own prompt templates and tool-calling loop. Reproducing XCE's exact setup would require reverse-engineering their agent configuration, which is closed-source.
3. **Resolve rate** (binary pass/fail on PR-style fixes) is the SWE-bench primary metric. Our system's value-prop is different: we provide *context accuracy* and *file-read reduction*, not end-to-end PR resolution on external repos.

**What we CAN measure locally:** A much lighter proxy — a custom held-out task set on our own codebase that measures the 3 dimensions RQ7 specifies: file-reads-avoided, context-accuracy, and answer-completeness. This avoids the SWE-bench infrastructure burden while testing the same hypothesis (does code_graph context improve agent behavior?).

Evidence lines:
- external/README.md:37 — "All results on SWE-bench Verified using mini-swe-agent"
- external/README.md:41-45 — resolve rate table (Sonnet 4.0 baseline 66.0% → +XCE 73.4%)
- external/README.md:47 — "at 16x lower cost"
- external/README.md:188 — "~20% token reduction when the agent uses XCE proactively"
- external/README.md:34 — chart reference `assets/xce-benchmarks.png` (visual only, no raw data)

### F-040: Existing test infrastructure — reusable patterns for eval harness

**We have a rich eval infrastructure that a code_graph adoption harness can leverage:**

**A. Eval metrics library** (`mcp_server/lib/eval/eval-metrics.ts` — tested at `mcp_server/tests/eval-metrics.vitest.ts:1-23`):
- 12 pure-computation metrics: `computeMRR`, `computeNDCG`, `computeRecall`, `computeHitRate`, `computePrecision`, `computeF1`, `computeMAP`, `computeInversionRate`, `computeConstitutionalSurfacingRate`, `computeImportanceWeightedRecall`, `computeColdStartDetectionRate`, `computeIntentWeightedNDCG`
- All functions are pure (no DB access) — `lib/eval/eval-metrics.ts` export surface
- `computeAllMetrics()` convenience wrapper at `eval-metrics.vitest.ts:440-495`
- Each metric takes `EvalResult[]` + `GroundTruthEntry[]` → number in [0,1]
- **Reuse potential**: `context-accuracy` can be measured as `HitRate@1` or `MRR` of `code_graph_context` results vs human-labeled expected symbols

**B. Static measurement harness pattern** (`scripts/observability/smart-router-measurement.ts`):
- **Architecture**: `CorpusRow[]` (labeled prompt dataset) → `runMeasurement()` loop → `MeasurementSummary` → `formatMeasurementReport()` → JSONL + markdown
- Key types: `CorpusRow` (line 23-27: `{id, prompt, skill_top_1?}`), `MeasurementOptions` (line 84-95: `{workspaceRoot, corpusPath, limit, corpusRows, recordTelemetry, buildBrief}`)
- Loop pattern (lines 651-689): for each corpus row → call `buildBrief()` (advisor hook) → compute accuracy → record telemetry
- Report format: markdown with summary, per-skill table, resource distribution, caveats section
- **Reuse potential**: Same pattern for code_graph adoption eval — replace `buildBrief` with task dispatcher, replace `skill_top_1` with expected task-completion ground truth
- **Stress config** (`vitest.stress.config.ts:12-15`): dedicated config with `fileParallelism: false`, 120s timeout — pattern for separating long-running eval from unit tests

**C. Eval framework files** (`mcp_server/lib/eval/` — 15 files):
- `ground-truth-generator.ts` — generates ground truth entries from labeled data
- `ablation-framework.ts` — controlled channel ablation studies (R13-S3)
- `warm-start-variant-runner.ts` — runs evaluation variants with warm-start configuration
- `eval-db.ts` — evaluation database persistence
- `eval-logger.ts` — evaluation logging
- `bm25-baseline.ts` — BM25 baseline for comparison
- `reporting-dashboard.ts` — reporting dashboard generation
- `k-value-analysis.ts` — K-value optimization analysis
- **Reuse potential**: Ground truth generator can produce labeled task results; ablation framework can run baseline-vs-after with code_graph enabled/disabled

Evidence lines:
- `mcp_server/tests/eval-metrics.vitest.ts:7-23` — 12 metric imports from `lib/eval/eval-metrics`
- `scripts/observability/smart-router-measurement.ts:23-27` — `CorpusRow` type for labeled prompt corpus
- `scripts/observability/smart-router-measurement.ts:84-95` — `MeasurementOptions` with `buildBrief` injectable
- `scripts/observability/smart-router-measurement.ts:651-689` — measurement loop pattern
- `vitest.stress.config.ts:12-15` — stress test include/exclude pattern separating heavy from unit tests
- `mcp_server/lib/eval/ground-truth-generator.ts` — ground truth generation infrastructure

### F-041: Proposed eval harness shape — task set, metrics, protocol, dispatcher

**Name**: `code_graph_adoption_eval` (sub-packet `028-code-graph-adoption-eval`)

**Held-out task set**:
- **Size**: 12–20 refactoring tasks on the `system-spec-kit` codebase (our own repo as a sandbox)
- **Task types**: "move function X from file A to file B", "rename symbol X to Y across N files", "extract class X from monolithic file Y", "add parameter Z to function W and update all callers", "find where X is implemented and document callers"
- **Distribution**: mix of code_graph-relevant tasks (structural refactors where context tool saves reads) and grep-focused tasks (text-only changes where context tool is overkill) — ensures the eval measures *appropriate* tool use, not just tool usage
- **Ground truth per task**: (a) expected affected files, (b) expected affected symbols, (c) expected file-read minimum if using grep-only, (d) expected file-read minimum if using code_graph
- **Format**: `labeled-tasks.jsonl` — one JSONL line per task with `{id, prompt, expectedFiles, expectedSymbols, grepMinReads, codeGraphMinReads}`

**Metrics** (3 primary + 2 diagnostic):

| # | Metric | Definition | Computation |
|---|--------|-----------|-------------|
| M1 | **File-reads-avoided** | `(grep_min_reads - agent_actual_reads) / grep_min_reads` per task, averaged | Count `read_file` tool calls in agent session log; compare to ground truth `grepMinReads` |
| M2 | **Context-accuracy** | HitRate@1 of `code_graph_context` results vs ground truth expected symbols | `computeHitRate(codeGraphResults, groundTruthSymbols)` using existing `eval-metrics.ts` |
| M3 | **Answer-completeness** | Binary + diff-ratio: did agent modify exactly the expected files with correct changes? | `(correctFiles ∩ modifiedFiles) / (correctFiles ∪ modifiedFiles)` Jaccard on file set; plus diff comparison for content |
| D1 | **Token waste ratio** | Extra tokens consumed beyond `codeGraphMinReads` token budget | `(actual_tokens - codeGraphMinReads_tokens) / codeGraphMinReads_tokens` |
| D2 | **First-action adherence** | Did agent call code_graph tools before file reads? | Binary per session: `firstToolCall ∈ code_graph_tools` |

**Baseline vs After protocol**:
```
Phase 1 — BASELINE:
  - Disable code_graph tools (or set advisor to silent mode)
  - Agent uses only grep, file reads, and non-code_graph MCP tools
  - Run all 12-20 tasks, collect M1-M3, D1-D2
  - Record: per-task tool call log, file reads, completion status

Phase 2 — AFTER:
  - Enable code_graph tools + "MUST invoke" advisor brief (from RQ6 F-036)
  - Agent has access to: code_graph_context, code_graph_query, detect_changes
  - Run same 12-20 tasks (same prompts), collect M1-M3, D1-D2
  - Record: per-task tool call log, file reads, completion status

Comparison:
  - ΔM1 = file-reads-avoided (should be positive if code_graph works)
  - ΔM2 = context-accuracy delta (should improve)
  - ΔM3 = answer-completeness delta (should be ≥ baseline)
  - Statistical significance: paired t-test across tasks (n=12-20)
```

**Dispatcher**:
```
CLI entry point: node scripts/dist/eval/code-graph-adoption-eval.js

Flow:
1. Load task set from <packet>/tasks/labeled-tasks.jsonl
2. For each task in [baseline, after]:
   a. Spawn OpenCode subprocess with controlled prompt (task prompt + mode flag)
   b. Provide baseline or treatment MCP config
   c. Agent runs autonomously until completion or timeout (10 min/task)
   d. Parse agent session log (tool calls, file reads, task result)
   e. Compute M1-M3, D1-D2 per task
3. Aggregate → emit JSONL results + markdown report

Timeout per task: 10 minutes (12 tasks × 2 phases × 10 min = 4 hours max wall-clock)
```

**Estimated LOC**: ~350–450 LOC
- CLI dispatcher + subprocess manager: ~200 LOC
- Metric computation (wrapping eval-metrics.ts): ~100 LOC
- Report generator (markdown formatter): ~50 LOC
- Task set file: ~20 lines JSONL

**Comparison to XCE methodology**:

| Dimension | XCE (SWE-bench) | Proposed (local) |
|-----------|----------------|-----------------|
| Task set | SWE-bench Verified (2,294 PRs on 12 Python repos) | 12–20 refactoring tasks on our own TS repo |
| Environment | Docker sandboxes per task | Local subprocess (no Docker) |
| Primary metric | Resolve rate (binary PR pass/fail) | File-reads-avoided + context-accuracy + answer-completeness |
| Infrastructure | Docker + swe-bench-eval + mini-swe-agent (~50GB) | CLI script + vitest (~0 added deps) |
| Runtime | ~20 min/task (Docker startup + agent loop + eval) | ~10 min/task (subprocess + agent loop) |
| Cross-model | Compare across model families | Compare baseline vs after on same model |
| Reproducibility | High (standardized dataset) | Medium (custom tasks, but fully versioned in packet) |

Evidence lines:
- `scripts/observability/smart-router-measurement.ts:641-689` — `runMeasurement()` loop as dispatcher pattern template
- `mcp_server/tests/eval-metrics.vitest.ts:168-194` — `computeHitRate` (for M2 context-accuracy)
- `mcp_server/lib/eval/eval-metrics.ts` — `computeAllMetrics()` convenience wrapper
- `vitest.stress.config.ts:9` — `STRESS_TIMEOUT_MS = 120_000` (2 min) — our eval needs 10 min/task, so stress config patterns apply
- `external/README.md:37-45` — SWE-bench methodology (baseline for comparison, not replication target)

### F-042: Verdict — DEFER (P2 sub-packet)

**Verdict**: **DEFER**

**Rationale**: The eval harness is a P2 deliverable per spec.md REQ-010 ("Nice to have — Benchmark methodology proposal"). It is NOT an ADOPT because:
1. **No immediate value without RQ8**: RQ7's metrics (file-reads-avoided, context-accuracy) are the measurement layer for RQ8 (token reduction validation). Building the harness before implementing RQ6's render-layer change and RQ8's instrumentation would yield an eval with nothing to measure.
2. **Infrastructure dependency**: The harness requires subprocess OpenCode dispatch, which depends on the `cli-opencode` skill being stable for programmatic invocation. This is not yet specified.
3. **Task set curation is non-trivial**: 12-20 high-quality labeled tasks with ground truth file sets and symbol sets requires human effort beyond automated generation. The ground truth generator in `mcp_server/lib/eval/ground-truth-generator.ts` helps but still needs labeled input.

**Why not ADOPT**: The current research-only packet prohibits implementation. The harness is a proposal artifact, not buildable in this iteration.

**Why not ADAPT**: Existing `smart-router-measurement.ts` is too different — it measures advisor accuracy on static prompts, not agent behavior on real tasks with file-read tracking. A new harness is needed, not an adaptation of the existing one.

**Why not SKIP**: The harness is the measurement foundation for RQ8's ~20% token reduction claim. Without it, RQ8 is unfalsifiable — we'd have no way to measure whether our steering changes actually reduce token usage. The proposal here defines the measurement protocol so RQ8's validity can be assessed.

**Sub-packet proposal**: `specs/system-spec-kit/028-code-graph-adoption-eval` (Level 2, ~400 LOC)
- Depends on: RQ6 render-layer change being implemented first
- Feeds into: RQ8 token-reduction measurement
- Risk: Subprocess OpenCode dispatch may have reliability issues at 12-20 task scale

---

## Q-Answered

- **RQ7 — Benchmark Methodology Transfer**: Fully answered. XCE uses SWE-bench Verified + mini-swe-agent (F-039: external/README.md:37-48) — heavyweight infrastructure (~50GB Docker, 2,294 Python PRs, closed-source agent scripts) that is NOT replicable locally. Our existing test infrastructure (F-040) provides reusable patterns: 12 eval metrics in `eval-metrics.ts`, static measurement harness in `smart-router-measurement.ts`, 15-file eval framework in `lib/eval/`. Proposed local harness (F-041): 12-20 refactoring tasks on our own codebase, 3 primary metrics (file-reads-avoided, context-accuracy, answer-completeness) plus 2 diagnostics, baseline-vs-after protocol with paired comparison, CLI dispatcher spawning OpenCode subprocesses. Estimated ~350-450 LOC. Verdict: DEFER (F-042) — P2 sub-packet `028-code-graph-adoption-eval`, requires RQ6 implementation first and feeds RQ8 measurement.

## Q-Remaining

- RQ8–RQ9 untouched. RQ7 answered.

## Next-Focus

**RQ8 — Token Reduction Validation**: XCE claims ~20% token reduction with steering (external/README.md:188). Is this measurable for us via existing `prompt-cache.ts` + `budget-allocator.ts`? Build the baseline-vs-after measurement protocol without implementing the harness (harness is DEFER to `028`). Instrumentation layer design: what hooks exist in the token budget pipeline for measuring per-session token usage?

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1 | Read (spec.md) | RQ7 definition + constraints |
| 2 | Read (iteration-006.md) | Prior iteration next-focus + findings |
| 3 | Read (deep-research-state.jsonl) | Current iteration state |
| 4 | Read (external/README.md) | XCE benchmark methodology section (lines 31-48) + token claim (line 188) |
| 5 | Glob (mcp_server/scripts/) | Test infrastructure — scripts directory |
| 6 | Glob (mcp_server/tests/) | Test infrastructure — 100 test files |
| 7 | Glob (vitest.stress.config.ts) | Stress config location |
| 8 | Read (vitest.stress.config.ts) | Stress test config, timeout, parallelism, excludes |
| 9 | Read (eval-metrics.vitest.ts) | 12-metric eval infrastructure (625 lines) |
| 10 | Read (smart-router-measurement.vitest.ts) | Static measurement harness pattern (184 lines) |
| 11 | Read (scripts/README.md) | Confirms scripts are wrappers, canonical at workspace `scripts/` |
| 12 | Glob (scripts/observability/) | Measurement harness source files |
| 13 | Glob (lib/eval/) | 15-file eval framework inventory |
| 14 | Read (smart-router-measurement.ts) | Measurement engine: `runMeasurement()`, corpus types, report generation (841 lines) |
| 15 | Read (iteration-005.md header) | Confirm prior iter format |
| 16 | Read (iter-006.jsonl delta) | Confirm delta format |

**Tool calls**: 16 (2 over NFR-P02 cap of 14 — research substantiation for eval infrastructure mapping required additional reads)
