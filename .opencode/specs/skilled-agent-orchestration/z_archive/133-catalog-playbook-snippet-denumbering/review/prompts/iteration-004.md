When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review/deltas/iter-004.jsonl.

# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES in feature catalogs and manual testing playbooks
(`NN--category/NNN-name.md` → `NN--category/name.md`); category FOLDERS kept their
`NN--` numbers. Link conventions in this repo: a relative link may be resolved against
the source file's own directory OR against the repo root (both are valid).

A deterministic markdown-link checker already ran over the whole active surface. For your
slice — **system-spec-kit manual_testing_playbook** — it flagged these 93 broken markdown links (target
resolves under NEITHER base):

1. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/01--retrieval/memory-search-command-routing.md
     link target: ../../../../command/memory/search.md
2. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/01--retrieval/quick-search-memory-quick-search.md
     link target: ../../../../command/memory/search.md
3. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/graph-degraded-stress-cell-isolation.md
     link target: ../22--context-preservation/277-code-graph-fast-fail.md
4. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/json-mode-hybrid-enrichment.md
     link target: ../../../../<spec-folder>
5. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/json-primary-deprecation-posture.md
     link target: ../../../../<spec-folder>
6. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/memory-manage-command-routing.md
     link target: ../../../../command/memory/manage.md
7. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md
     link target: ../../../../specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md
8. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md
     link target: ../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/
9. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md
     link target: ../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/
10. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md
     link target: ../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/
11. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/doctor-update-G5-confirm-failure-injection.md
     link target: ../../mcp_server/database/migration-manifest.json
12. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/doctor-update-G6-concurrent.md
     link target: ../../mcp_server/database/migration-manifest.json
13. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/doctor-update-G7-sigint.md
     link target: ../../mcp_server/database/migration-manifest.json
14. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/doctor-update-G8-migration-gap.md
     link target: ../../mcp_server/database/migration-manifest.json
15. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/doctor-update-G9-dashboard.md
     link target: ../../mcp_server/database/migration-manifest.json
16. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/doctor-update-tier-aware-default.md
     link target: ../../mcp_server/database/migration-manifest.json
17. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/version-migration-3.3.0.0-to-3.4.1.0.md
     link target: ../../mcp_server/database/migration-manifest.json
18. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/version-migration-cleanup-legacy.md
     link target: ../../mcp_server/database/migration-manifest.json
19. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/version-migration-no-op.md
     link target: ../../mcp_server/database/migration-manifest.json
20. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md
21. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md
22. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 11--scoring-and-calibration/_deprecated/024-cold-start-novelty-boost-n4.md
23. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md
24. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 12--query-intelligence/_deprecated/034-relative-score-fusion-in-shadow-mode-r14-n1.md
25. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md
26. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 14--pipeline-architecture/_deprecated/076-activation-window-persistence.md
27. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/14--pipeline-architecture/_deprecated/09-activation-window-persistence.md
28. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md
29. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 16--tooling-and-scripts/113-standalone-admin-cli.md
30. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md
31. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 13--memory-quality-and-indexing/_deprecated/164-batch-learned-feedback-speckit-batch-learned-feedback.md
32. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md
33. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 13--memory-quality-and-indexing/_deprecated/176-implicit-feedback-log-speckit-implicit-feedback-log.md
34. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md
35. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md
36. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md
37. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/275-code-graph-readiness-contract.md
38. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/24-code-graph-readiness-contract.md
39. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 02--mutation/008-feature-09-direct-manual-scenario-per-record-history-log.md
40. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 11--scoring-and-calibration/_deprecated/024-cold-start-novelty-boost-n4.md
41. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md
42. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 12--query-intelligence/_deprecated/034-relative-score-fusion-in-shadow-mode-r14-n1.md
43. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md
44. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 14--pipeline-architecture/_deprecated/076-activation-window-persistence.md
45. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/14--pipeline-architecture/_deprecated/09-activation-window-persistence.md
46. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md
47. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 16--tooling-and-scripts/113-standalone-admin-cli.md
48. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 05--lifecycle/124-automatic-archival-lifecycle-coverage.md
49. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md
50. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md
51. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 13--memory-quality-and-indexing/_deprecated/164-batch-learned-feedback-speckit-batch-learned-feedback.md
52. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md
53. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 13--memory-quality-and-indexing/_deprecated/176-implicit-feedback-log-speckit-implicit-feedback-log.md
54. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md
55. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 02--mutation/008-feature-09-direct-manual-scenario-per-record-history-log.md
56. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 02--mutation/191-namespace-management-crud-tools.md
57. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/02--mutation/07-namespace-management-crud-tools.md
58. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 10--graph-signal-activation/_deprecated/193-anchor-tags-as-graph-nodes.md
59. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/10--graph-signal-activation/_deprecated/09-anchor-tags-as-graph-nodes.md
60. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 14--pipeline-architecture/_deprecated/201-warm-server-daemon-mode.md
61. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/14--pipeline-architecture/_deprecated/15-warm-server-daemon-mode.md
62. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/254-code-graph-scan-query.md
63. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/08-code-graph-storage-query.md
64. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/255-code-graph-graph-routing.md
65. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/09-code_graph-bridge-context.md
66. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/259-tree-sitter-parser.md
67. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/13-tree-sitter-wasm-parser.md
68. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/260-code-graph-auto-trigger.md
69. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/15-code-graph-auto-trigger.md
70. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/265-gemini-hooks.md
71. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/266-context-metrics.md
72. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md
73. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md
74. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/275-code-graph-readiness-contract.md
75. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/24-code-graph-readiness-contract.md
76. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/281-code-graph-read-path-selective-self-heal.md
77. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/08-code-graph-storage-query.md
78. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/282-code-graph-cell-coverage-evidence.md
79. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/282-code-graph-cell-coverage-evidence.md
80. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/283-skill-graph-status.md
81. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/28-skill-graph-status.md
82. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/284-skill-graph-query.md
83. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/27-skill-graph-query.md
84. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 22--context-preservation/285-skill-graph-validate.md
85. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/22--context-preservation/29-skill-graph-validate.md
86. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 23--doctor-commands/334-doctor-code_graph-daemon-healthy.md
87. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 23--doctor-commands/335-doctor-code_graph-daemon-zombie.md
88. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 23--doctor-commands/336-doctor-code_graph-daemon-unreachable.md
89. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../mcp_server/database/migration-manifest.json
90. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../mcp_server/database/migration-manifest.json
91. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../mcp_server/database/migration-manifest.json
92. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md
93. [catalog-playbook] .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md
     link target: ../feature_catalog/04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md

# ROLE

You are a meticulous path-reference auditor. You verify against the real files on disk —
never guess. You distinguish a genuine broken reference from an intentional template
placeholder or example.

# ACTION

For EACH flagged link above:
1. Read the source file around the link to understand intent.
2. Check the target tree (Grep/Glob/Read) for the real file — it may exist under a slightly
   different slug, a different directory, or not at all.
3. Classify it:
   - severity: P0 (a command/agent/loadable path that breaks runtime), P1 (a real broken
     doc cross-reference a human or tool would follow), or P2 (cosmetic / template example /
     intentional placeholder).
   - classification: REAL_BROKEN | TEMPLATE_EXAMPLE | WRONG_SLUG_TARGET_EXISTS | TARGET_DELETED | FALSE_POSITIVE
   - is_133_caused: true only if the breakage was introduced by the de-numbering migration
     (e.g. the link still points at a numbered path and the de-numbered file exists).
   - if WRONG_SLUG_TARGET_EXISTS, give the correct target path.
4. Then briefly hunt the SAME files for any broken reference the markdown-link regex would
   miss (frontmatter paths, real backtick paths, links that resolve to the WRONG file).

# OUTPUT FORMAT

Return ONLY a single fenced ```json block, no prose before or after, with this shape:

```json
{
  "iteration": 4,
  "slice": "system-spec-kit manual_testing_playbook",
  "verdict": "PASS | CONDITIONAL | FAIL",
  "findings": [
    {"ref":"<link target>","source_file":"<path>","severity":"P0|P1|P2",
     "classification":"REAL_BROKEN|TEMPLATE_EXAMPLE|WRONG_SLUG_TARGET_EXISTS|TARGET_DELETED|FALSE_POSITIVE",
     "is_133_caused":false,"correct_target":"<path or null>","evidence":"<file:line or grep result>",
     "recommendation":"<one line>"}
  ],
  "missed_by_regex": [
    {"ref":"<path>","source_file":"<path>","severity":"P0|P1|P2","evidence":"<file:line>","recommendation":"<one line>"}
  ],
  "summary": "<2-3 sentences: how many real vs noise, any systemic pattern>"
}
```

verdict mapping: FAIL if any P0; CONDITIONAL if any P1 (no P0); PASS otherwise.