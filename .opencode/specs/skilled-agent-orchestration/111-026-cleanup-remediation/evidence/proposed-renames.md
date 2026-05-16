# W3.E proposed renames

Scoring rubric: L (length) + R (parent-token redundancy) + G (generic-token density) - I (recall impact). Threshold >= 5 → rename.

## Rename table (score >= 5)

| Current name | Parent path | L | R | G | I | Score | Proposed | Rationale |
|--------------|-------------|---|---|---|---|------:|----------|-----------|
| 021-sk-doc-conformance-sweep | 000-release-cleanup/003-cleanup | 3 | 3 | 1 | 0 | 7 | 021-sk-doc-conformance-sweep | L=3, R=3, G=1 |
| 001-automation-self-management-deep | 000-release-cleanup/006-research | 3 | 3 | 0 | 0 | 6 | 001-automation-self-management-deep | L=3, R=3 |
| 001-docs-and-code-alignment | 008-skill-advisor/005-docs | 3 | 3 | 0 | 0 | 6 | 001-and-code-alignment | L=3.0, R=3 |
| 002-automation-reality-supplemental | 000-release-cleanup/006-research | 3 | 3 | 0 | 0 | 6 | 002-automation-reality-supplemental | L=3, R=3 |
| 002-scaffold-advisor-package | 008-skill-advisor/001-skill-graph/006-system-skill-advisor-extraction | 3 | 3 | 0 | 0 | 6 | 002-scaffold-package | L=3.0, R=3 |
| 002-daemon-and-unification | 008-skill-advisor/001-skill-graph | 3 | 3 | 0 | 0 | 6 | 002-daemon-and-unification | L=3, R=3 |
| 003-deep-review-program | 000-release-cleanup/001-release-readiness | 3 | 3 | 0 | 0 | 6 | 003-deep-review-program | L=3.0, R=3 |
| 003-smart-remediation-and-opencode-plugin | 008-skill-advisor/003-router | 3 | 3 | 0 | 0 | 6 | 003-smart-remediation-and-opencode-plugin | L=3, R=3 |
| 003-system-deep-bugs-and-improvements | 000-release-cleanup/006-research | 3 | 3 | 0 | 0 | 6 | 003-system-deep-bugs-and-improvements | L=3, R=3 |
| 004-synthesis-and-remediation | 000-release-cleanup/001-release-readiness | 3 | 3 | 0 | 0 | 6 | 004-synthesis-and-remediation | L=3, R=3 |
| 006-search-clusters-4-7-remediation | 003-continuity-memory-runtime | 3 | 3 | 0 | 0 | 6 | 006-search-clusters-4-7-remediation | L=3, R=3 |
| 001-consolidation-investigation | 010-template-levels | 2.5 | 3 | 0 | 0 | 6 | 001-consolidation-investigation | L=2.5, R=3 |
| 005-expansion-and-alignment | 000-release-cleanup/005-stress-test | 2 | 3 | 0 | 0 | 5 | 005-expansion-and-alignment | L=2.0, R=3 |
| 005-substrate-stability-instrumentation | 014-local-embeddings-migration/032-substrate-repair-followups | 2 | 3 | 0 | 0 | 5 | 005-stability-instrumentation | L=2.0, R=3 |

## Keep table (score < 5)

| Current name | Score | Reason kept |
|--------------|------:|-------------|
| 001-clean-room-license-audit-tier2-pt-01 | 4 | L=2.5, R=3, G=1, I=-2 |
| 003-resource-map-deep-loop-integration | 4 | L=1.5, R=3 |
| 004-retroactive-phase-parent-migration | 4 | L=1.5, R=3 |
| 008-skdoc-legacy-template-debt-cleanup | 4 | L=1.5, R=3 |
| 002-code-graph-context-and-scan-scope | 4 | L=1, R=3 |
| 002-copilot-hook-parity-remediation-tier2-pt-01 | 4 | L=3, R=3, I=-2 |
| 002-stress-test-pattern-documentation | 4 | L=1, R=3 |
| 003-skill-advisor-standards-alignment | 4 | L=1, R=3 |
| 004-deep-research-finding-remediation | 4 | L=1, R=3 |
| 005-opencode-plugin-loader-remediation-tier2-pt-01 | 4 | L=3, R=3, I=-2 |
| 008-move-skill-graph-tools-to-advisor | 4 | L=1, R=3 |
| 021-stress-test-v1-0-3-with-w3-w13-wiring | 4 | L=3, R=3, I=-2 |
| 022-stress-test-results-deep-research | 4 | L=1, R=3 |
| 030-v1-0-4-full-matrix-stress-test-design | 4 | L=3, R=3, I=-2 |
| 002-advisor-phrase-booster-tailoring | 4 | L=0.5, R=3 |
| 002-mcp-runtime-improvement-research | 4 | L=0.5, R=3 |
| 003-move-advisor-source-db-and-tests | 4 | L=0.5, R=3 |
| 004-claude-hook-findings-remediation | 4 | L=0.5, R=3 |
| 017-cli-copilot-dispatch-test-parity | 4 | L=0.5, R=3 |
| 001-deferred-remediation-and-telemetry-run | 3 | L=3 |
| 001-reverse-parent-research-review-folders | 3 | L=3 |
| 002-code-graph-phase-runner-and-detect-changes | 3 | L=3 |
| 003-code-graph-edge-explanation-and-impact-uplift | 3 | L=3 |
| 004-standalone-mcp-launcher-and-runtime-configs | 3 | L=3 |
| 005-populate-intent-signals-and-relationships | 3 | L=3 |
| 005-vestigial-embedding-readiness-gate-removal | 3 | L=3 |
| 006-validation-cleanup-and-deprecation-removal | 3 | L=3 |
| 007-runtime-command-agent-alignment-review | 3 | L=3 |
| 010-broader-scope-excludes-and-granular-skills | 3 | L=3 |
| 014-resource-maps-and-memory-finalization | 3 | L=3 |
| 015-code-graph-advisor-refinement-pt-01 | 3 | L=2, R=3, I=-2 |
| 023-pre-existing-test-failure-remediation | 3 | L=3 |
| 025-memory-search-degraded-readiness-wiring | 3 | L=3 |
| 027-memory-context-structural-channel-research | 3 | L=3 |
| 028-generated-js-and-declaration-alignment | 3 | L=3 |
| 030-test-fixture-singular-to-plural-sweep | 3 | L=3 |
| 033-system-code-graph-import-path-cleanup | 3 | L=3 |
| 013-code-graph-hook-improvements-pt-02 | 2 | L=1.5, R=3, I=-2 |
| 015-mcp-server-rename-mk-skill-advisor | 2 | L=1.5, R=3, I=-2 |
| 022-cli-skills-baseline-overlay-contract | 2 | L=2.5 |
| 028-code-graph-hook-improvements-pt-01 | 2 | L=1.5, R=3, I=-2 |
| 030-code-graph-gap-investigation-pt-01 | 2 | L=1.5, R=3, I=-2 |
| 009-fix-iteration-quality-meta-research | 2 | L=2 |
| 018-catalog-playbook-degraded-alignment | 2 | L=2 |
| 003-memory-context-truncation-contract | 2 | L=1.5 |
| 005-opencode-plugin-loader-remediation | 2 | L=1.5 |
| 008-deep-research-review-tier2-pt-01 | 2 | L=0.5, R=3, I=-2 |
| 016-degraded-readiness-envelope-parity | 2 | L=1.5 |
| 023-live-handler-envelope-capture-seam | 2 | L=1.5 |
| 025-architecture-diagrams-and-topology | 2 | L=1.5 |
| 002-rm8-013-remediation-doc-honesty-security | 1 | L=3, I=-2 |
| 004-search-rag-measurement-driven-implementation | 1 | L=3, I=-2 |
| 004-skill-advisor-affordance-evidence | 1 | L=1 |
| 005-hooks-compat-and-consumer-cutover | 1 | L=1 |
| 005-skill-references-assets-alignment | 1 | L=1 |
| 008-z-archive-marker-validation-sweep | 1 | L=1 |
| 019-feature-catalog-shape-realignment | 1 | L=1 |
| 019-search-query-rag-optimization-research | 1 | L=3, I=-2 |
| 020-w3-w7-verification-and-expansion-research | 1 | L=3, I=-2 |
| 027-missing-code-readmes-resource-map | 1 | L=1 |
| 051-runtime-config-mk-code-index-parity-plus-findings | 1 | L=3, I=-2 |
| 004-apply-metadata-fixes-and-resweep | 0 | L=0.5 |
| 006-full-matrix-execution-validation | 0 | L=0.5 |
| 007-voyage-cleanup-and-egress-monitoring | 0 | L=2.5, I=-2 |
| 015-cocoindex-seed-telemetry-passthrough | 0 | L=2.5, I=-2 |
| 018-matrix-runners-snake-case-rename | 0 | L=0.5 |
| 020-catalog-playbook-alignment-audit | 0 | L=0.5 |
| 028-deep-review-skill-contract-fixes | 0 | L=0.5 |
| 028-doc-alignment-and-readme-filling | 0 | L=0.5 |
| 037-llama-cpp-embedding-worker-deep-dive | 0 | L=2.5, I=-2 |
| 031-cocoindex-voyage-only-this-machine | -0 | below threshold |
| 016-llama-cpp-retrieval-quality-probe | -1 | below threshold |
| 024-iter-001-daemon-concurrency-fixes | -1 | below threshold |
| 053-mk-spec-memory-rename-remediation | -1 | below threshold |

## Summary

- Total names evaluated: 88
- Renames proposed: 14
- Average length reduction: 43.4 → 29.9
