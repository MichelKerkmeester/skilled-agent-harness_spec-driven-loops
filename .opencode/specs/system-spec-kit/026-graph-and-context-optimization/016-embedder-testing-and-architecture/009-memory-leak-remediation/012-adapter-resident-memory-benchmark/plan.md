---
title: "Plan: Adapter Resident-Memory Benchmark"
description: "Implementation plan for Adapter Resident-Memory Benchmark."
trigger_phrases:
  - "adapter-resident-memory-benchmark"
  - "009 phase 012"
  - "adapter rss benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark"
    last_updated_at: "2026-05-22T16:03:59Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-012-adapter-rss-benchmark"
    next_safe_action: "arc-009-complete-or-operator-rss-followup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a02020202020202020202020202020202020202020202020202020202020202"
      session_id: "009-memory-leak-remediation-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Source benchmark-gating decision documented in arc 009 phase 008 implementation-summary.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Adapter Resident-Memory Benchmark

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python benchmark scripts plus existing Node.js process-memory harness |
| **Framework** | CocoIndex reranker adapter and shared rerank sidecar fallback paths |
| **Storage** | Benchmark artifacts under `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/`; phase evidence in this spec folder |
| **Testing** | Python compile, `--help` smoke, sandbox live-run attempt, strict spec validation |

### Overview
This phase adds a reproducible resident-memory benchmark for the two paths left benchmark-gated by arc 009 phase 008:

1. Successful-search RSS slope over repeated `ccc search` calls.
2. Sidecar 5xx fallback RSS slope by forcing `HttpSidecarRerankerAdapter` through its bundled fallback path.

The decision threshold is the phase 008 gate: growth greater than 10 MB per 50 iterations is a P1 escalation candidate; otherwise the default P2 hold remains. If sandbox restrictions block a live run, the benchmark scripts and operator runbook still ship, and the decision is documented as deferred-to-operator rather than claiming P2 evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read the parent arc spec, phase spec, arc 009 phase 008 summary, remediation map item #13, process-memory harness, adapter lifecycle code, sidecar ledger/ensure code, and existing benchmark conventions.
- [x] Confirm benchmark entry points and operator-machine requirements.
- [x] Define the run count, RSS threshold, and output format.

### Definition of Done
- [x] Benchmark methodology is reproducible.
- [x] RSS slope numbers are recorded for both required paths, or sandbox blockers are captured with exact operator-run commands.
- [x] Severity decision is documented with evidence, or explicitly deferred to operator-run evidence.
- [x] This phase and parent arc strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Benchmark Layout

Create:

`/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/`

Files:

| File | Purpose |
|------|---------|
| `bench_successful_search_rss.py` | Runs repeated successful `ccc search` calls and samples RSS/swap/wired memory through `process-memory-harness.js snapshot`. |
| `bench_sidecar_5xx_fallback_rss.py` | Forces sidecar HTTP 5xx responses with mocked HTTP client behavior, exercises the bundled fallback adapter path, and samples RSS over repeated iterations. |
| `methodology.md` | Records threshold, statistics, output shape, sandbox fallback, and operator runbook. |

### Measurement Contract

Each script accepts:

- `--iterations` default `50`, minimum `1`.
- `--sample-every` default `1`.
- `--out` JSON output path.
- `--threshold-mb` default `10.0`.

Each script writes JSON with:

```json
{
  "path": "successful-search",
  "iterations": 50,
  "threshold_mb": 10.0,
  "rss_slope_bytes_per_iter": 0,
  "slope_mb_per_50": 0.0,
  "mean_delta_mb": 0.0,
  "median_delta_mb": 0.0,
  "iqr_mb": 0.0,
  "peak_mb": 0.0,
  "confidence_95_mb_per_iter": [0.0, 0.0],
  "decision": "P2-hold",
  "samples": []
}
```

Decision rule:

- `slope_mb_per_50 > threshold_mb`: `P1-escalate`.
- `slope_mb_per_50 <= threshold_mb`: `P2-hold`.
- Live path cannot execute in sandbox: `deferred-to-operator`.

### Successful-Search Path

The script mirrors `benchmark-2026-05-21/run_ab.py` conventions:

- Resolve `REPO_ROOT` and `CCC` relative to the benchmark file.
- Default fixture: `../benchmark-2026-05-21/fixture-subset-18.json`.
- Reuse one representative query by default, or rotate through fixture queries when `--fixture` is passed.
- Invoke `ccc search "<query>" --limit 5`.
- Treat a zero return code and non-empty stdout as a successful search call.
- Capture process inventory snapshots through:

```bash
node .opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js snapshot
```

### Sidecar 5xx Fallback Path

The fallback script should avoid a real localhost bind in the sandbox. It imports `HttpSidecarRerankerAdapter` directly, patches the HTTP client to return status `503`, and patches the fallback adapter loader so the fallback path is exercised without loading the full model. It then captures the same RSS/swap/wired snapshots after each iteration.

This path proves the code path and output mechanics in sandbox. Operators can remove `--mock-fallback` only if they want the heavier real model fallback benchmark outside the sandbox.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/` | Benchmark workspace | Add two scripts and methodology | `py_compile`, `--help`, live attempt or sandbox-blocked runbook |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Process memory helper | Read only; no helper change planned | Existing compiled JS snapshot command used as subprocess |
| `implementation-summary.md` | Phase evidence ledger | Record methodology, numbers, and severity decision | Strict spec validation |
| `../spec.md` | Parent arc control file | Mark phase 002 complete and arc completion 100 percent | Strict parent validation |
| `../../009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/remediation-map.md` | Source remediation map | Update item #13 implementation outcome | Strict validation plus direct evidence link |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the child spec and source phase 008 evidence.
- [x] Identify benchmark entry points for successful-search and fallback paths.
- [x] Replace scaffold placeholders with this concrete benchmark plan.

### Phase 2: Implementation
- [x] Add or reuse a benchmark runner for successful-search RSS slope.
- [x] Add or reuse a benchmark runner for sidecar 5xx fallback RSS delta.
- [x] Add methodology documentation and output schema.
- [x] Capture before, after, delta, slope, IQR, peak, and 95 percent confidence interval statistics.

### Phase 3: Verification
- [x] Run benchmark commands in the supported operator environment, or capture sandbox blocker output.
- [x] Update `implementation-summary.md` with results and decision.
- [x] Strict-validate this phase and the parent arc.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | Benchmark scripts | `python3 -m py_compile` |
| CLI smoke | Benchmark help surfaces | `python3 <script> --help` |
| Benchmark | Successful-search RSS slope | `bench_successful_search_rss.py --iterations 50 --out /tmp/bench-search-rss.json` |
| Benchmark | Sidecar 5xx fallback RSS delta | `bench_sidecar_5xx_fallback_rss.py --iterations 50 --out /tmp/bench-fallback-rss.json` |
| Analysis | Severity decision against threshold | Recorded benchmark output |
| Documentation | Phase and parent validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 009 phase 008 implementation summary | Source evidence | Available | Required to recover the P2-default benchmark gate. |
| Process-memory harness | Measurement helper | Available from predecessor work | Required or useful for RSS snapshots and slope calculation. |
| Local sidecar/network environment | Runtime dependency | Known sandbox risk | If blocked, scripts and methodology ship with operator-run commands and no false P2 evidence claim. |
| CocoIndex venv and `ccc` CLI | Runtime dependency | Present in existing benchmark conventions | Required for live successful-search benchmark. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark scripts are noisy, non-reproducible, or change runtime behavior outside measurement scope.
- **Procedure**: Revert only benchmark and helper changes, preserve observed output in `implementation-summary.md`, and replan the measurement path.
- **Non-trigger**: A sandbox blocker does not invalidate the scripts; document the blocker and provide the operator runbook.
<!-- /ANCHOR:rollback -->
