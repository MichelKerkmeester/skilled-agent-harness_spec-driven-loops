# Deep Review Resource Map - CocoIndex Dedup From Shared Sidecar

Resource map source: `applied/T-*.md` not present. No applied evidence exists for packet 006 because the implementation was already shipped before this review packet was created.

## Review-Scope Files

| Path | Expected | Reviewed | Notes |
|---|---:|---:|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md` | yes | yes | Packet requirements, success criteria, REQ-006/REQ-010 evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/plan.md` | yes | yes | Implementation plan and stale default/fallback sketches. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md` | yes | yes | Task ledger drift evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md` | yes | yes | Shipped/PROMOTE claims, verification, D-004 fallback decision. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | yes | yes | HTTP adapter, dispatch, fallback, localhost client. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | yes | yes | `COCOINDEX_RERANK_VIA_SIDECAR` config default. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | yes | yes | Adapter tests and default-off test oracle. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py` | yes | yes | A/B arm env overrides and runner integrity. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/benchmark_report.md` | yes | yes | PROMOTE decision evidence and caveats. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | yes | yes | Operator default/auto-ensure dependency claims. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | yes | yes | Skill default sidecar dispatch claim. |
| `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md` | yes | yes | Catalog claims, consumer matrix, security caveats. |
| `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` | yes | yes | RS scenario matrix and capability claims. |

## Supporting Files Read Across Iterations

| Path | Reviewed | Purpose |
|---|---:|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | yes | CocoIndex MCP sidecar ensure call site. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | yes | Python launcher gate, health attach, env inheritance. |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | yes | FastAPI endpoints, payload validation, model prediction. |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | yes | Loopback bind and env sourcing. |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | yes | Sidecar health/rerank/concurrency/shutdown coverage. |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | yes | Feature catalog package contract. |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | yes | Manual playbook package/scenario contract. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability/observability.py` | yes | Fallback diagnostics leakage check. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | yes | Node ensure helper comparison. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | yes | Spec-memory local sidecar consumer comparison. |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | yes | mcp-coco-index dependency declaration check. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/spec.md` | yes | Arc parent phase-map status. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/graph-metadata.json` | yes | Arc parent derived status and child linkage. |
| `.opencode/skills/sk-code-review/references/review_core.md` | yes | Final severity-calibration reference loaded in iteration 6. |
| `.opencode/skills/system-rerank-sidecar/pyproject.toml` | yes | Sibling `httpx` dependency comparison. |

## Review Artifacts

| Path | Status | Notes |
|---|---|---|
| `review/deep-review-config.json` | updated | Synthesis marks `status=complete` and `releaseReadinessState=release-blocking`. |
| `review/deep-review-state.jsonl` | appended | Synthesis completion and config-status events appended. |
| `review/deep-review-findings-registry.json` | updated | Final active registry has 10 open findings, severity mix 0/2/8, and convergence score 1.0. |
| `review/deep-review-strategy.md` | read | Iteration strategy and convergence context. |
| `review/review-report.md` | written | Final 9-section synthesis report. |
| `review/resource-map.md` | written | This resource map. |
| `review/iterations/iteration-001.md` | read | Inventory pass. |
| `review/iterations/iteration-002.md` | read | Correctness pass. |
| `review/iterations/iteration-003.md` | read | Security pass. |
| `review/iterations/iteration-004.md` | read | Traceability pass. |
| `review/iterations/iteration-005.md` | read | Maintainability pass. |
| `review/iterations/iteration-006.md` | read | Adversarial recheck/stabilization pass. |
| `review/deltas/iter-001.jsonl` | read | Iteration 001 delta. |
| `review/deltas/iter-002.jsonl` | read | Iteration 002 delta. |
| `review/deltas/iter-003.jsonl` | read | Iteration 003 delta. |
| `review/deltas/iter-004.jsonl` | read | Iteration 004 delta. |
| `review/deltas/iter-005.jsonl` | read | Iteration 005 delta. |
| `review/deltas/iter-006.jsonl` | read | Iteration 006 delta and classification. |

## Absent / Not Applicable

| Path / Pattern | Status | Notes |
|---|---|---|
| `review/applied/T-*.md` | absent | No applied remediation evidence exists for packet 006; implementation was shipped before review. |
| New agent runtime files | not applicable | `agent_cross_runtime` was not applicable because no new agent definitions shipped in the reviewed commits. |
| External web sources | not used | Review was code/spec/doc local-only. |
