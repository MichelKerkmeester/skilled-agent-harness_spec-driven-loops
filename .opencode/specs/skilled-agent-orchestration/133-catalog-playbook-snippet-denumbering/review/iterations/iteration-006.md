# Deep-Review Iteration 006 — skill:system non-playbook refs

**Executor:** DeepSeek-v4-pro (cli-opencode, --pure, read-only)
**Findings:** P0=0 P1=9 P2=13 (total 22)

## Summary
21 flagged links: 9 WRONG_SLUG (target exists at a different path depth or in split-out skill), 5 REAL_BROKEN (target file/dir does not exist anywhere), 5 TEMPLATE_EXAMPLE (intentional placeholder in template guide), 2 FALSE_POSITIVE (URL-encoding artifact and intentional test fixture). No P0 runtime-breaking paths. One additional broken backtick path found that the regex missed. Systemic pattern: several links reference modules (skill_advisor, code_graph) that were split into separate skills but the cross-references under system-spec-kit were never updated.

## Findings
| Sev | Classification | Source | Reference | 133-caused | Recommendation |
|-----|----------------|--------|-----------|-----------|----------------|
| P2 | FALSE_POSITIVE | `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | `../../install_guides/SET-UP%20-%20Code%20Graph.md` | no | Keep as-is; most renderers handle %20. Optionally replace with literal spaces for tooling compatibility. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | `../../<spec-folder>` | no | Replace with actual spec folder path or remove the sentence if the runbook is historical. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md` | `../../skill_advisor/tests/README.md` | no | Change to ../../tests/README.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md` | `../../skill_advisor/lib/README.md` | no | Change to ../../lib/README.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md` | `../feature_catalog/01--daemon-and-freshness/` | no | Change ../ to ../../ |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md` | `../manual_testing_playbook/05--auto-update-daemon/` | no | Change ../ to ../../ |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | `./INSTALL_GUIDE.md` | no | Change to ./mcp_server/INSTALL_GUIDE.md |
| P2 | REAL_BROKEN | `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md` | `../FORMAT.md` | no | Create FORMAT.md in benchmarks/ describing the convention, or remove the link. |
| P2 | REAL_BROKEN | `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/README.md` | `../README.md` | no | Either create a README.md in benchmark-2026-05-20-rerank-ab/ or change link to ../../README.md |
| P1 | REAL_BROKEN | `.opencode/skills/system-spec-kit/mcp_server/lib/enrichment/README.md` | `../../code_graph/README.md` | no | Remove link or point to .opencode/skills/system-code-graph/mcp_server/README.md |
| P2 | REAL_BROKEN | `.opencode/skills/system-spec-kit/mcp_server/lib/providers/README.md` | `../contracts/README.md` | no | Remove link or create the missing contracts/README.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md` | `../skill_advisor/README.md` | no | Change to ../../system-skill-advisor/mcp_server/README.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/README.md` | `../skill-advisor/README.md` | no | Change to ../../system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md` | `../code-graph/README.md` | no | Change to ../../system-code-graph/mcp_server/stress_test/code-graph/README.md |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/system-spec-kit/references/templates/template_guide.md` | `plan.md` | no | Keep as-is; this is instructional example content, not a real link. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/system-spec-kit/references/templates/template_guide.md` | `spec.md` | no | Keep as-is; instructional example content. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/system-spec-kit/references/templates/template_guide.md` | `../spec.md` | no | Keep as-is; instructional example content. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/system-spec-kit/references/templates/template_guide.md` | `../template-marker-system/` | no | Keep as-is; instructional example content. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/system-spec-kit/references/templates/template_guide.md` | `../hybrid-validation/` | no | Keep as-is; instructional example content. |
| P2 | REAL_BROKEN | `.opencode/skills/system-spec-kit/scripts/resource-map/README.md` | `../../templates/level_contract_optional_resource-map.md` | no | Either create the missing template file or remove the link. |
| P2 | FALSE_POSITIVE | `.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/spec.md` | `003-missing/` | no | No fix needed; this is a test fixture for broken-link detection. |
| P2 | - | `.opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/README.md` | `../../skill_advisor/tests/` | no | Change backtick path to reference system-skill-advisor/mcp_server/tests/ or use a markdown link. |

Review verdict: CONDITIONAL