---
title: "Arc 009 Phase 012: Adapter Resident-Memory Benchmark"
description: "Two benchmark scripts (successful-search RSS slope and sidecar 5xx fallback RSS delta) plus a methodology document shipped for the adapter resident-memory measurement gate. Live RSS runs were blocked by sandbox constraints. Severity decision is operator-deferred, not P2-hold or P1-escalate."
trigger_phrases:
  - "adapter resident memory benchmark"
  - "009 phase 012 adapter rss"
  - "bench successful search rss"
  - "sidecar 5xx fallback rss benchmark"
  - "operator deferred rss severity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Arc 009 phase 008 shipped adapter close idempotence and a fallback RSS gate but kept severity at P2 (default) because growth had not yet been measured. Remediation-map item #13 explicitly deferred escalation pending benchmark evidence. Without measurement, a real resident-memory leak could hide in P2 noise indefinitely.

Two benchmark scripts were created in a new benchmark folder under the mcp-coco-index skill: `bench_successful_search_rss.py` (successful-search RSS slope over N iterations) and `bench_sidecar_5xx_fallback_rss.py` (sidecar HTTP 503 fallback RSS delta). A `methodology.md` recorded the 10 MB per 50 iterations escalation threshold plus statistical methodology (mean, median, IQR, OLS slope, 95 percent confidence interval) and the operator runbook.

Live RSS runs were blocked by the sandbox: `ps` is denied so the process-memory harness returns zero process rows. CocoIndex daemon startup also fails at the spawn-lock path. Scripts now detect that condition and emit blocked JSON with `decision: "deferred-to-operator"` instead of reporting false zero-RSS slopes. The severity stance is operator-deferred. Phase 008's P2 default is unconfirmed rather than newly proven.

### Added

- `bench_successful_search_rss.py` (NEW): N-iteration loop invoking `ccc search`, capturing RSS via the process-memory harness, computing mean/median/IQR/slope/peak statistics and emitting structured JSON output
- `bench_sidecar_5xx_fallback_rss.py` (NEW): same statistical shape as the search benchmark, triggering `HttpSidecarRerankerAdapter` fallback via patched httpx 503 mock over N iterations
- `methodology.md` (NEW): escalation threshold (10 MB per 50 iterations), statistical methodology, sandbox fallback policy. Includes operator runbook with exact commands and expected JSON shape.
- Sandbox-blocker detection path in both scripts: emits `status: blocked` JSON with `decision: "deferred-to-operator"` when `ps` returns zero process rows

### Changed

- `plan.md`: scaffold placeholders replaced with concrete benchmark and verification task details
- `tasks.md`: updated to reflect completed and deferred verification tasks with sandbox-blocker evidence
- Parent arc `spec.md`: phase 012 status updated to Completed

### Fixed

- Remediation-map item #13 annotated with operator-deferred outcome, closing the open escalation gate from phase 008

### Verification

| Check | Result |
|-------|--------|
| Python compile | Passed: `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache python3 -m py_compile bench_successful_search_rss.py bench_sidecar_5xx_fallback_rss.py` |
| Successful-search help | Passed: `python3 bench_successful_search_rss.py --help` |
| Sidecar 5xx fallback help | Passed: `python3 bench_sidecar_5xx_fallback_rss.py --help` |
| Successful-search live run | Blocked: exit 2, JSON status `blocked`, blocker `ps is blocked in this sandbox`. CocoIndex daemon startup also denied at `daemon.spawn-lock`. |
| Sidecar 5xx fallback live run | Blocked under system Python (no `msgspec`). Venv path resolved import but still blocked at process-memory harness (`ps` denied). |
| Severity decision | Deferred to operator-run RSS evidence. No P2 hold or P1 escalation asserted from sandbox data. |
| Phase strict validation | Passed: `validate.sh ... 012-adapter-resident-memory-benchmark --strict` exit 0 |
| Parent arc strict validation | Passed: `validate.sh ... 009-memory-leak-remediation --strict` exit 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py` (NEW) | Successful-search RSS slope benchmark script |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_sidecar_5xx_fallback_rss.py` (NEW) | Sidecar 5xx fallback RSS delta benchmark script |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/methodology.md` (NEW) | Escalation threshold, statistical methodology. Operator runbook included. |

### Follow-Ups

- Run both benchmark scripts on the operator machine to collect live RSS slope numbers and make a final P2 hold or P1 escalation decision.
- If live runs confirm growth above 10 MB per 50 iterations, open a follow-on packet for the underlying adapter memory leak.
- Restore or relocate the benchmark scripts if the mcp-coco-index skill is reconstituted under a new path.
