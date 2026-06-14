# Deep Review Report - CocoIndex Dedup From Shared Sidecar

## 1. Executive Summary

Overall verdict: **CONDITIONAL**.

`hasAdvisories`: N/A because active P1 findings remain and the verdict is not PASS.

Final active severity counts: **P0=0 / P1=2 / P2=8**.

Review scope: PROMOTE packet commit `c0941055f` plus docs commit `131838c96`. The review covered the CocoIndex HTTP sidecar adapter/default-dispatch claim, sidecar launch integration, benchmark/report evidence, packet 006 docs, and the `system-rerank-sidecar` feature catalog/manual playbook docs.

Total iterations: **6**. Convergence: **CONVERGED at iteration 6** after all four dimensions were covered and the stabilization pass found no new P0/P1 findings.

The two release-blocking findings both break the PROMOTE/default story: default dispatch still falls back to bundled reranking unless the raw env var is explicitly set, and CocoIndex MCP startup still uses the spec-memory opt-in gate before spawning the shared sidecar.

## 2. Planning Trigger

`/spec_kit:plan [remediation]` **IS REQUIRED**. The PROMOTE/default claim is not true until the two P1 findings are fixed or the docs/config/test contract is deliberately reverted.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "DR-002-P1-001",
      "severity": "P1",
      "title": "PROMOTE default does not reach runtime dispatch",
      "file": ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24",
      "evidenceRefs": [
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:770",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:855",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:390",
        ".opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:240",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:47"
      ],
      "dimensions": ["correctness", "traceability"],
      "findingClass": "cross-consumer"
    },
    {
      "id": "DR-002-P1-002",
      "severity": "P1",
      "title": "CocoIndex MCP auto-ensure is still gated by spec-memory's opt-in flag",
      "file": ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90",
      "evidenceRefs": [
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:151",
        ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:85",
        ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90",
        ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:92",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:198",
        ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:159",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:97"
      ],
      "dimensions": ["correctness", "traceability"],
      "findingClass": "cross-consumer"
    },
    {
      "id": "DR-002-P2-001",
      "severity": "P2",
      "title": "REQ-006 still says to remove the bundled CrossEncoder despite D-004 preserving it as fallback",
      "file": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139",
      "evidenceRefs": [
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:160",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:125",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:149",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:87"
      ],
      "dimensions": ["correctness", "traceability"],
      "findingClass": "matrix/evidence"
    },
    {
      "id": "DR-003-P2-001",
      "severity": "P2",
      "title": "Sidecar child process inherits the full parent environment, including unrelated secrets",
      "file": ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:108",
      "evidenceRefs": [
        ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:107",
        ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:114",
        ".opencode/skills/system-rerank-sidecar/scripts/start.sh:14",
        ".opencode/skills/system-rerank-sidecar/scripts/start.sh:15",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:178",
        ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:201"
      ],
      "dimensions": ["security"],
      "findingClass": "instance-only"
    },
    {
      "id": "DR-003-P1-001",
      "severity": "P2",
      "title": "Localhost sidecar identity is unauthenticated, so a same-host user can spoof or directly consume the rerank channel",
      "file": ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:248",
      "evidenceRefs": [
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:237",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:248",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:294",
        ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:82",
        ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:108",
        ".opencode/skills/system-rerank-sidecar/scripts/start.sh:25",
        ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:49",
        ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:98"
      ],
      "dimensions": ["security"],
      "findingClass": "cross-consumer"
    },
    {
      "id": "DR-003-P1-002",
      "severity": "P2",
      "title": "/rerank accepts unbounded local payloads, allowing same-host callers to exhaust sidecar memory/compute",
      "file": ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:56",
      "evidenceRefs": [
        ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:56",
        ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:110",
        ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:121",
        ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:126",
        ".opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:48",
        ".opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:65"
      ],
      "dimensions": ["security"],
      "findingClass": "cross-consumer"
    },
    {
      "id": "DR-004-P2-001",
      "severity": "P2",
      "title": "Task ledger remains unchecked and stale after the packet claims SHIPPED/PROMOTE",
      "file": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40",
      "evidenceRefs": [