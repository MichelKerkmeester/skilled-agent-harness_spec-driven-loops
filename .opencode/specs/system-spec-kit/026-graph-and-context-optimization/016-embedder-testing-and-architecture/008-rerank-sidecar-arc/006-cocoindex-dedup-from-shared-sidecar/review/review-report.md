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
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:47"
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
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:97"
      ],
      "dimensions": ["correctness", "traceability"],
      "findingClass": "cross-consumer"
    },
    {
      "id": "DR-002-P2-001",
      "severity": "P2",
      "title": "REQ-006 still says to remove the bundled CrossEncoder despite D-004 preserving it as fallback",
      "file": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139",
      "evidenceRefs": [
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:160",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:125",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:149",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:87"
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
      "file": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40",
      "evidenceRefs": [
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:82",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:23",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:44",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:107"
      ],
      "dimensions": ["traceability"],
      "findingClass": "matrix/evidence"
    },
    {
      "id": "DR-004-P2-002",
      "severity": "P2",
      "title": "system-rerank-sidecar SKILL.md still says CocoIndex repointing is future work",
      "file": ".opencode/skills/system-rerank-sidecar/SKILL.md:170",
      "evidenceRefs": [
        ".opencode/skills/system-rerank-sidecar/SKILL.md:167",
        ".opencode/skills/system-rerank-sidecar/SKILL.md:170",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:273",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:276",
        ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:40",
        ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:43",
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:221"
      ],
      "dimensions": ["traceability", "maintainability"],
      "findingClass": "matrix/evidence"
    },
    {
      "id": "DR-005-P2-001",
      "severity": "P2",
      "title": "httpx is a hidden mcp-coco-index dependency",
      "file": ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28",
      "evidenceRefs": [
        ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:246",
        ".opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py:15",
        ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28",
        ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:46",
        ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:64",
        ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:71",
        ".opencode/skills/system-rerank-sidecar/pyproject.toml:13"
      ],
      "dimensions": ["maintainability"],
      "findingClass": "cross-consumer"
    },
    {
      "id": "DR-005-P2-002",
      "severity": "P2",
      "title": "Sidecar catalog/playbook diverge from sk-doc split-package and evergreen contracts",
      "file": ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46",
      "evidenceRefs": [
        ".opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:18",
        ".opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:27",
        ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:18",
        ".opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:30",
        ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:14",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:233",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:275",
        ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:276",
        ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:43",
        ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:201"
      ],
      "dimensions": ["maintainability", "traceability"],
      "findingClass": "matrix/evidence"
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Runtime dispatch",
      "findingIds": ["DR-002-P1-001"],
      "action": "Make _rerank_via_sidecar_enabled() consume Config.rerank_via_sidecar or revert the PROMOTE/default docs and tests."
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "title": "Launcher ensure",
      "findingIds": ["DR-002-P1-002"],
      "action": "Pass skip_if_disabled=false from cli.py or teach the helper to honor COCOINDEX_RERANK_VIA_SIDECAR separately."
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "title": "Spec wording",
      "findingIds": ["DR-002-P2-001"],
      "action": "Rewrite REQ-006/SC-005 around no eager bundled load while preserving lazy fallback."
    },
    {
      "id": "WS-4",
      "priority": "P2",
      "title": "Task ledger",
      "findingIds": ["DR-004-P2-001"],
      "action": "Update T001-T025 evidence or mark the ledger superseded by implementation-summary.md."
    },
    {
      "id": "WS-5",
      "priority": "P2",
      "title": "sk-doc compliance",
      "findingIds": ["DR-005-P2-002"],
      "action": "Split catalog/playbook or document a lightweight exception; remove mutable packet-history wording."
    },
    {
      "id": "WS-6",
      "priority": "P2",
      "title": "Direct dependency",
      "findingIds": ["DR-005-P2-001"],
      "action": "Declare httpx in mcp-coco-index's pyproject.toml."
    },
    {
      "id": "WS-7",
      "priority": "P2",
      "title": "Security caveats",
      "findingIds": ["DR-003-P1-001", "DR-003-P1-002"],
      "action": "Document solo-Mac assumptions and local localhost/payload caveats; defer credential gate to a future multi-user packet."
    },
    {
      "id": "WS-8",
      "priority": "P2",
      "title": "Environment hardening",
      "findingIds": ["DR-003-P2-001"],
      "action": "Replace full env inheritance with a sidecar child-env allowlist."
    },
    {
      "id": "WS-9",
      "priority": "P2",
      "title": "Stale skill text",
      "findingIds": ["DR-004-P2-002"],
      "action": "Update system-rerank-sidecar/SKILL.md:167-170 to reflect current CocoIndex consumer state and caveats."
    }
  ],
  "specSeed": [
    "Correct the PROMOTE/default dispatch contract so code, tests, SKILL.md, INSTALL_GUIDE.md, feature catalog, and implementation summary agree.",
    "Correct the CocoIndex MCP cold-start launcher contract and verify the sidecar spawn path without SPECKIT_CROSS_ENCODER=true.",
    "Rewrite REQ-006/SC-005 to preserve lazy bundled fallback while prohibiting eager default-path model load.",
    "Record the solo-Mac security posture explicitly and mark localhost identity/payload bounds as advisory unless deployment expands.",
    "Bring the sidecar catalog/playbook into sk-doc compliance or document an intentional lightweight exception."
  ],
  "planSeed": [
    "Patch reranker dispatch/config source of truth and update test_dispatch_off_by_default.",
    "Patch CocoIndex MCP ensure call or helper gate and add a cold-start ensure test.",
    "Update docs that currently claim default-on/auto-ensure behavior after code truth is fixed.",
    "Rewrite REQ-006/SC-005 wording and update packet cross references.",
    "Refresh task ledger T001-T025 or add explicit supersession note.",
    "Add httpx as a direct mcp-coco-index dependency and run package tests.",
    "Update system-rerank-sidecar SKILL.md consumer wording.",
    "Document solo-Mac auth/payload caveats in feature_catalog.md and manual_testing_playbook.md.",
    "Harden child env allowlist or record it as a follow-on packet if out of scope.",
    "Validate packet docs and reranker/sidecar tests."
  ],
  "findingClasses": ["cross-consumer", "matrix/evidence", "instance-only"],
  "affectedSurfacesSeed": [
    {
      "file": ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py",
      "remediationSurface": "runtime dispatch and HTTP adapter"
    },
    {
      "file": ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py",
      "remediationSurface": "configuration default source of truth"
    },
    {
      "file": ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py",
      "remediationSurface": "MCP cold-start sidecar ensure"
    },
    {
      "file": ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py",
      "remediationSurface": "launcher gate, attach identity, child env"
    },
    {
      "file": ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py",
      "remediationSurface": "payload bounds and optional future auth"
    },
    {
      "file": ".opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py",
      "remediationSurface": "dispatch and fallback tests"
    },
    {
      "file": ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml",
      "remediationSurface": "direct dependency declaration"
    },
    {
      "file": ".opencode/skills/system-rerank-sidecar/SKILL.md",
      "remediationSurface": "consumer-state docs"
    },
    {
      "file": ".opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md",
      "remediationSurface": "catalog current-state claims and security caveats"
    },
    {
      "file": ".opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md",
      "remediationSurface": "manual scenarios and caveats"
    },
    {
      "file": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md",
      "remediationSurface": "REQ-006/REQ-010 wording"
    },
    {
      "file": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md",
      "remediationSurface": "task ledger evidence"
    },
    {
      "file": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md",
      "remediationSurface": "PROMOTE claim reconciliation"
    }
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:Line | Evidence | Impact | Fix Recommendation | Disposition | FindingClass | ScopeProof | AffectedSurfaceHints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DR-002-P1-001 | P1 | PROMOTE default does not reach runtime dispatch | correctness | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24` | `config.py:770`, `reranker.py:24`, `reranker.py:390`, `test_http_sidecar_adapter.py:240`, `implementation-summary.md:47` | Default-on sidecar dispatch is false when the env var is unset. | Make dispatch consume `Config.rerank_via_sidecar` or revert default/PROMOTE claims; update `test_dispatch_off_by_default`. | active | cross-consumer | Exact search found config parsing and raw-env dispatch, with no bridge into `get_reranker_adapter()`. | `reranker.py`, `config.py`, `test_http_sidecar_adapter.py`, `SKILL.md`, `INSTALL_GUIDE.md` |
| DR-002-P1-002 | P1 | CocoIndex MCP auto-ensure is still gated by spec-memory's opt-in flag | correctness | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:90` | `cli.py:151`, `ensure_rerank_sidecar.py:85`, `ensure_rerank_sidecar.py:90`, `feature_catalog.md:198`, `manual_testing_playbook.md:159`, `implementation-summary.md:97` | Cold CocoIndex MCP startup does not spawn the sidecar unless `SPECKIT_CROSS_ENCODER=true`. | Pass `skip_if_disabled=False` from CocoIndex or gate helper behavior on `COCOINDEX_RERANK_VIA_SIDECAR`. | active | cross-consumer | Launcher path and docs are in the review scope/support set and directly back REQ-010. | `cli.py`, `ensure_rerank_sidecar.py`, feature catalog, playbook, install guide |
| DR-002-P2-001 | P2 | REQ-006 still says to remove the bundled CrossEncoder despite D-004 preserving it as fallback | correctness | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/spec.md:139` | `spec.md:139`, `spec.md:160`, `reranker.py:125`, `reranker.py:149`, `implementation-summary.md:87` | Future validation is aimed at the wrong contract. | Rewrite REQ-006/SC-005 around no eager bundled load on the default path while keeping lazy fallback. | active | matrix/evidence | Runtime and D-004 agree; spec wording is the drift point. | packet `spec.md`, `implementation-summary.md`, `reranker.py` |
| DR-003-P2-001 | P2 | Sidecar child process inherits the full parent environment, including unrelated secrets | security | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:108` | `ensure_rerank_sidecar.py:107`, `ensure_rerank_sidecar.py:114`, `start.sh:14`, `start.sh:15`, `feature_catalog.md:178`, `manual_testing_playbook.md:201` | Sidecar child receives unrelated secret-bearing env vars. | Spawn with a minimal allowlist and exclude common API keys. | active | instance-only | Exact search found the full-env Python spawn and shell env sourcing, but no scrubber. | `ensure_rerank_sidecar.py`, `start.sh`, catalog/playbook caveats |
| DR-003-P1-001 | P2 | Localhost sidecar identity is unauthenticated | security | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:248` | `reranker.py:237`, `reranker.py:248`, `reranker.py:294`, `rerank_sidecar.py:82`, `rerank_sidecar.py:108`, `start.sh:25`, `ensure_rerank_sidecar.py:49`, `ensure_rerank_sidecar.py:98` | Advisory under solo-Mac; would become required if multi-user localhost is supported. | Document single-user-loopback contract; consider credential/owner verification in future packet. | downgraded | cross-consumer | Iteration 6 tied downgrade to the supported solo-Mac deployment note. | `reranker.py`, `rerank_sidecar.py`, `ensure_rerank_sidecar.py`, catalog/playbook |
| DR-003-P1-002 | P2 | `/rerank` accepts unbounded local payloads | security | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:56` | `rerank_sidecar.py:56`, `rerank_sidecar.py:110`, `rerank_sidecar.py:121`, `rerank_sidecar.py:126`, `test_rerank_sidecar.py:48`, `test_rerank_sidecar.py:65` | Advisory under solo-Mac; direct local callers can self-DoS the sidecar. | Add max docs, query length, doc length/bytes, total payload, and bounded `top_k` limits. | downgraded | cross-consumer | Normal CocoIndex path caps candidates; direct HTTP endpoint remains unbounded. | `rerank_sidecar.py`, sidecar tests, catalog/playbook |
| DR-004-P2-001 | P2 | Task ledger remains unchecked and stale after the packet claims SHIPPED/PROMOTE | traceability | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40` | `tasks.md:40`, `tasks.md:82`, `implementation-summary.md:23`, `implementation-summary.md:44`, `implementation-summary.md:107` | Packet evidence surfaces conflict. | Mark T001-T025 with shipped evidence or note that implementation-summary supersedes the ledger. | active | matrix/evidence | Packet-local docs only; strict Level 1 validation still passes. | `tasks.md`, `implementation-summary.md` |
| DR-004-P2-002 | P2 | `system-rerank-sidecar` SKILL.md still says CocoIndex repointing is future work | traceability | `.opencode/skills/system-rerank-sidecar/SKILL.md:170` | `SKILL.md:167`, `SKILL.md:170`, `feature_catalog.md:46`, `feature_catalog.md:273`, `feature_catalog.md:276`, `manual_testing_playbook.md:40`, `manual_testing_playbook.md:43`, `reranker.py:221` | Canonical skill guidance contradicts current docs/code. | Update Consumers section to reflect CocoIndex adapter/current caveats. | active | matrix/evidence | Cross-document drift inside the same sidecar skill package. | `system-rerank-sidecar/SKILL.md`, catalog, playbook |
| DR-005-P2-001 | P2 | httpx is a hidden mcp-coco-index dependency | maintainability | `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28` | `reranker.py:246`, `test_http_sidecar_adapter.py:15`, `pyproject.toml:28`, `pyproject.toml:46`, `pyproject.toml:64`, `pyproject.toml:71`, `system-rerank-sidecar/pyproject.toml:13` | mcp-coco-index runtime/tests rely on a sibling package dependency. | Add `httpx` as a direct runtime dependency of mcp-coco-index. | active | cross-consumer | Dependency search under mcp-coco-index found no direct `httpx` declaration. | `pyproject.toml`, `reranker.py`, tests |
| DR-005-P2-002 | P2 | Sidecar catalog/playbook diverge from sk-doc split-package and evergreen contracts | maintainability | `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:46` | `feature_catalog_template.md:18`, `feature_catalog_template.md:27`, `manual_testing_playbook_template.md:18`, `manual_testing_playbook_template.md:30`, `manual_testing_playbook.md:14`, `feature_catalog.md:46`, `feature_catalog.md:233`, `feature_catalog.md:275`, `feature_catalog.md:276`, `manual_testing_playbook.md:43`, `manual_testing_playbook.md:201` | Docs will be harder to maintain and carry mutable packet-history claims. | Split into per-feature files or document a lightweight exception; remove mutable packet-history wording. | active | matrix/evidence | `rg --files` found only two root markdown files, not split packages. | catalog/playbook, sk-doc templates |

## 4. Remediation Workstreams

**WS-1 (P1 - runtime dispatch).** Fix `_rerank_via_sidecar_enabled()` to consume `Config.rerank_via_sidecar`, or revert the PROMOTE/default doc claims. Update `test_dispatch_off_by_default` to assert the chosen contract.

**WS-2 (P1 - launcher ensure).** Pass `skip_if_disabled=False` in `cli.py::_ensure_rerank_sidecar_for_mcp()`, or refactor the helper gate to consider both `SPECKIT_CROSS_ENCODER` and `COCOINDEX_RERANK_VIA_SIDECAR`.

**WS-3 (P2 - spec wording).** Rewrite REQ-006/SC-005 to require no eager bundled load on the default path while preserving the lazy fallback class.

**WS-4 (P2 - task ledger).** Mark T001-T025 with shipped evidence and links, or add a note that the ledger was superseded by `implementation-summary.md`.

**WS-5 (P2 - sk-doc compliance).** Split sidecar catalog/playbook into per-feature files or document a lightweight-skill exception. Remove mutable packet-history wording from evergreen claims.

**WS-6 (P2 - dependency).** Add `httpx` to `mcp-coco-index` `pyproject.toml` as a direct dependency.

**WS-7 (P2 - security advisories).** Document the unauthenticated-localhost and unbounded-payload contracts in `feature_catalog.md` and `manual_testing_playbook.md` as accepted-under-solo-Mac caveats. Consider a local credential gate as a future packet.

**WS-8 (P2 - env inheritance).** Tighten the child-env allowlist in `ensure_rerank_sidecar.py`; exclude `OPENAI_*`, `VOYAGE_*`, `SLACK_*`, and unrelated secret-bearing keys.

**WS-9 (P2 - stale skill text).** Update `system-rerank-sidecar/SKILL.md:167-170` to reflect the current CocoIndex consumer state.

## 5. Spec Seed

- State the remediation objective as: make the PROMOTE/default sidecar claim true in runtime or formally revert that claim.
- Require dispatch to use a single source of truth for `COCOINDEX_RERANK_VIA_SIDECAR`.
- Require cold CocoIndex MCP startup to either auto-ensure the sidecar under the CocoIndex flag or document that it does not.
- Keep D-004 fallback semantics: no eager bundled model load on default sidecar path, but lazy bundled fallback remains available.
- Require docs to explicitly name the solo-Mac security posture and caveat the unauthenticated loopback/payload-bounds behavior.
- Require mcp-coco-index to declare direct runtime dependencies introduced by the HTTP sidecar adapter.
- Require sidecar catalog/playbook docs to either satisfy sk-doc split package conventions or record a lightweight exception.

## 6. Plan Seed

1. Patch CocoIndex dispatch so the unset-env path follows the intended `Config.rerank_via_sidecar` default, or intentionally revert config/docs to opt-in.
2. Update `test_dispatch_off_by_default` and add/adjust tests for unset, explicit true, and explicit false dispatch.
3. Patch CocoIndex MCP ensure to pass `skip_if_disabled=False`, or make the helper gate recognize `COCOINDEX_RERANK_VIA_SIDECAR`.
4. Add a cold-start unit/smoke test where `COCOINDEX_RERANK_VIA_SIDECAR=true` and `SPECKIT_CROSS_ENCODER` is unset.
5. Reconcile `mcp-coco-index` SKILL.md, INSTALL_GUIDE.md, feature catalog, playbook, and implementation summary with the fixed dispatch/launcher truth.
6. Rewrite REQ-006/SC-005 to preserve lazy bundled fallback while avoiding eager default-path model load.
7. Update task ledger evidence or add the explicit supersession note.
8. Add `httpx` to mcp-coco-index's direct runtime dependencies.
9. Update `system-rerank-sidecar/SKILL.md` consumer text for CocoIndex's current adapter/default claim and caveats.
10. Add solo-Mac caveats for sidecar auth/payload bounds to catalog/playbook.
11. Decide whether to implement child-env allowlist now; if yes, add launcher tests for allowed and excluded env names.
12. Decide whether to split catalog/playbook per sk-doc; if not, document a lightweight exception.
13. Run targeted reranker/sidecar tests plus packet strict validation and capture evidence in the remediation packet.

## 7. Traceability Status

Per iteration 004, the six cross-reference protocols ended as:

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | REQ-010 requires cold CocoIndex MCP startup to spawn the sidecar, but `cli.py:152-155` calls the helper with default `skip_if_disabled=True`, and `ensure_rerank_sidecar.py:85-96` returns unless `SPECKIT_CROSS_ENCODER=true`. REQ-006 is also partial because `spec.md:139` conflicts with D-004 at `implementation-summary.md:87-89`. |
| `checklist_evidence` | fail | `tasks.md:40-82` remains unchecked while `implementation-summary.md:23` and `implementation-summary.md:107-131` claim shipped validation. |
| `skill_agent` | fail | `mcp-coco-index/SKILL.md:29` repeats the default dispatch claim; `system-rerank-sidecar/SKILL.md:170` still says CocoIndex repointing is future work. |
| `agent_cross_runtime` | notApplicable | No new agent definitions shipped in either reviewed commit. |
| `feature_catalog_code` | fail | Catalog default/launcher claims inherit DR-002-P1-001/002; security posture lacks the now-P2 identity/auth and payload-bound caveats. |
| `playbook_capability` | fail | RS-009/RS-010 rely on failing auto-ensure/default-dispatch contracts, and RS-021..RS-023 do not cover forged listener or oversized-payload scenarios. |

## 8. Deferred Items

- n=3 confirmation benchmark, already called out in `implementation-summary.md:141`.
- 30/73 to 15/73 baseline drift investigation, deferred to packet 007.
- Promotion of sidecar identity/auth and payload bounds to required fixes if a multi-user deployment is ever supported.

## 9. Audit Appendix

Convergence summary: 6 iterations, converged at iteration 6. `newFindingsRatio=0` after stabilization, all four dimensions were covered, and iteration 6 evidence/scope/coverage/downgrade/duplicate gates passed.

Coverage summary: all 13 review-scope files were read, plus supporting launcher/runtime/test/docs files: `cli.py`, `ensure_rerank_sidecar.py`, `rerank_sidecar.py`, `start.sh`, sidecar tests, sk-doc templates, `observability.py`, `ensure-rerank-sidecar.cjs`, `cross-encoder.ts`, `pyproject.toml`, arc parent `spec.md` and `graph-metadata.json`, and `review_core.md`.

Ruled-out claims: none significant for final synthesis. Iteration 6 ruled out missed P0/P1 risk in fallback parsing, secret-value logging, requirement coverage beyond the active findings, and benchmark arm integrity.

Sources reviewed: 6 iteration narratives, 6 delta files, and the full state log.

Core cross-reference appendix:

| Protocol | Final Status | Primary Findings |
|---|---|---|
| `spec_code` | fail | DR-002-P1-001, DR-002-P1-002, DR-002-P2-001 |
| `checklist_evidence` | fail | DR-004-P2-001 |

Overlay cross-reference appendix:

| Protocol | Final Status | Primary Findings |
|---|---|---|
| `skill_agent` | fail | DR-002-P1-001, DR-004-P2-002 |
| `agent_cross_runtime` | notApplicable | None |
| `feature_catalog_code` | fail | DR-002-P1-002, DR-003-P1-001, DR-003-P1-002, DR-005-P2-002 |
| `playbook_capability` | fail | DR-002-P1-002, DR-003-P1-001, DR-003-P1-002, DR-005-P2-002 |
