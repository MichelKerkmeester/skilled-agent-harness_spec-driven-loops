# Residual broken links (210) — what I left and why

These are the links the audit left broken on disk after fixing everything reliably-fixable.
None are P0 (runtime-breaking) — those are all fixed. Plain-terms reason per group below.

---

## 1. Template placeholders — LEAVE (96)
**Why:** these live in `*_template.md` / template files. The "broken" link is a fill-in-the-blank
example (e.g. `../skill-name/SKILL.md`) that the template author copies and replaces. Making it
point at a real file would defeat the template. Not a real bug.

**sk-doc/assets/benchmark/benchmark_report_template.md** (9)
- `./SOURCE.md`
- `./results.csv`
- `./per-probe.jsonl`
- `./runtime-measurements.md`
- `./SOURCE.md`
- `./results.csv`
- `./per-probe.jsonl`
- `./runtime-measurements.md`
- `../README.md`

**sk-doc/assets/changelog_template.md** (6)
- `./readme_template.md`
- `./install_guide_template.md`
- `../../references/global/hvr_rules.md`
- `../../references/global/core_standards.md`
- `../../../../command/create/changelog.md`
- `../../../system-spec-kit/references/workflows/nested_changelog.md`

**sk-doc/assets/command_template.md** (3)
- `./skill_md_template.md`
- `../../references/global/core_standards.md`
- `../../references/global/validation.md`

**sk-doc/assets/frontmatter_templates.md** (4)
- `../skill/skill_md_template.md`
- `../command_template.md`
- `../../references/global/core_standards.md`
- `../../references/global/validation.md`

**sk-doc/assets/llmstxt_templates.md** (29)
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `url`
- `../docs/guide.md`
- `/docs/guide.md`
- `url`
- `../skill/skill_md_template.md`
- `../../references/global/core_standards.md`

**sk-doc/assets/readme/install_guide_template.md** (4)
- `./MCP%20-%20New%20Tool.md`
- `./frontmatter_templates.md`
- `../../../../install_guides/MCP%20-%20Spec%20Kit%20Memory.md`
- `../../../../install_guides/MCP%20-%20Code%20Mode.md`

**sk-doc/assets/readme/readme_code_template.md** (3)
- `../README.md`
- `../../ARCHITECTURE.md`
- `../sibling/README.md`

**sk-doc/assets/readme/readme_template.md** (2)
- `../skill-name/SKILL.md`
- `./path/to/doc.md`

**sk-doc/assets/skill/skill_md_template.md** (9)
- `frontmatter_templates.md`
- `./references/workflow-details.md`
- `./references/reference-name.md`
- `./references/workflow-name.md`
- `./assets/template-name.md`
- `./assets/checklist-name.md`
- `INSTALL_GUIDE.md`
- `./references/reference-name.md`
- `./assets/template-name.md`

**sk-doc/assets/skill/skill_readme_template.md** (3)
- `./SKILL.md`
- `./references/[name].md`
- `./assets/[name].md`

**sk-doc/assets/skill/skill_reference_template.md** (10)
- `./standard_file.md`
- `../scripts/script_name.js`
- `../assets/template_name.md`
- `../scripts/workflow_name.py`
- `../assets/workflow_config.yaml`
- `../scripts/script_name.py`
- `../assets/config.yaml`
- `./scripts/workflow_router.py`
- `../scripts/`
- `../assets/`

**sk-doc/assets/testing_playbook/manual_testing_playbook_template.md** (3)
- `../../template_rules.json`
- `../../../references/global/core_standards.md`
- `../../../SKILL.md`

**sk-git/assets/pr_template.md** (6)
- `./screenshots/login.png`
- `./screenshots/dashboard.png`
- `./screenshots/before.png`
- `./screenshots/after.png`
- `./screenshots/mobile.png`
- `./docs/migration.md`

**system-spec-kit/references/templates/template_guide.md** (5)
- `plan.md`
- `spec.md`
- `../spec.md`
- `../template-marker-system/`
- `../hybrid-validation/`


---

## 2. Changelog history — LEAVE (1)
**Why:** old changelog entries. The link was correct when written; the target moved/renamed later.
Rewriting a historical record is revisionist, so it stays as the record of that release.

**sk-code/changelog/v3.3.0.0.md** (1)
- `code_quality_standards.md`


---

## 3. Dead catalog/playbook listings — NEEDS YOUR DECISION (84)
**Why:** a feature catalog or testing playbook lists a snippet that no longer exists under ANY name
(the feature was removed, deprecated, or renamed beyond recognition). The fix is either to delete the
stale list line OR recreate the snippet — a content decision. I did NOT auto-delete documentation.
These are concentrated in the playbook/catalog ROOT docs.

**cli-claude-code/manual_testing_playbook/manual_testing_playbook.md** (2)
- `04--agent-routing/009-write-agent-doc-generation.md`
- `04--agent-routing/009-write-agent-doc-generation.md`

**cli-opencode/manual_testing_playbook/manual_testing_playbook.md** (2)
- `04--agent-routing/004-write-agent-doc-generation.md`
- `04--agent-routing/004-write-agent-doc-generation.md`

**system-spec-kit/feature_catalog/feature_catalog.md** (9)
- `18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md`
- `04--maintenance/035-embedding-status-reconciliation.md`
- `10--graph-signal-activation/_deprecated/09-anchor-tags-as-graph-nodes.md`
- `11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md`
- `12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md`
- `13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md`
- `13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md`
- `14--pipeline-architecture/_deprecated/09-activation-window-persistence.md`
- `14--pipeline-architecture/_deprecated/15-warm-server-daemon-mode.md`

**system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/graph-degraded-stress-cell-isolation.md** (1)
- `../22--context-preservation/277-code-graph-fast-fail.md`

**system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md** (1)
- `../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/`

**system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md** (1)
- `../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/`

**system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md** (1)
- `../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/`

**system-spec-kit/manual_testing_playbook/manual_testing_playbook.md** (67)
- `04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md`
- `../feature_catalog/04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md`
- `11--scoring-and-calibration/_deprecated/024-cold-start-novelty-boost-n4.md`
- `../feature_catalog/11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md`
- `12--query-intelligence/_deprecated/034-relative-score-fusion-in-shadow-mode-r14-n1.md`
- `../feature_catalog/12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md`
- `14--pipeline-architecture/_deprecated/076-activation-window-persistence.md`
- `../feature_catalog/14--pipeline-architecture/_deprecated/09-activation-window-persistence.md`
- `05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md`
- `16--tooling-and-scripts/113-standalone-admin-cli.md`
- `05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md`
- `13--memory-quality-and-indexing/_deprecated/164-batch-learned-feedback-speckit-batch-learned-feedback.md`
- `../feature_catalog/13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md`
- `13--memory-quality-and-indexing/_deprecated/176-implicit-feedback-log-speckit-implicit-feedback-log.md`
- `../feature_catalog/13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md`
- `18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md`
- `../feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md`
- `22--context-preservation/275-code-graph-readiness-contract.md`
- `../feature_catalog/22--context-preservation/24-code-graph-readiness-contract.md`
- `11--scoring-and-calibration/_deprecated/024-cold-start-novelty-boost-n4.md`
- `../feature_catalog/11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md`
- `12--query-intelligence/_deprecated/034-relative-score-fusion-in-shadow-mode-r14-n1.md`
- `../feature_catalog/12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md`
- `14--pipeline-architecture/_deprecated/076-activation-window-persistence.md`
- `../feature_catalog/14--pipeline-architecture/_deprecated/09-activation-window-persistence.md`
- `05--lifecycle/100-async-shutdown-with-deadline-server-lifecycle.md`
- `16--tooling-and-scripts/113-standalone-admin-cli.md`
- `05--lifecycle/124-automatic-archival-lifecycle-coverage.md`
- `../feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md`
- `05--lifecycle/134-startup-pending-file-recovery-lifecycle-coverage.md`
- `13--memory-quality-and-indexing/_deprecated/164-batch-learned-feedback-speckit-batch-learned-feedback.md`
- `../feature_catalog/13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md`
- `13--memory-quality-and-indexing/_deprecated/176-implicit-feedback-log-speckit-implicit-feedback-log.md`
- `../feature_catalog/13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md`
- `02--mutation/191-namespace-management-crud-tools.md`
- `../feature_catalog/02--mutation/07-namespace-management-crud-tools.md`
- `10--graph-signal-activation/_deprecated/193-anchor-tags-as-graph-nodes.md`
- `../feature_catalog/10--graph-signal-activation/_deprecated/09-anchor-tags-as-graph-nodes.md`
- `14--pipeline-architecture/_deprecated/201-warm-server-daemon-mode.md`
- `../feature_catalog/14--pipeline-architecture/_deprecated/15-warm-server-daemon-mode.md`
- `22--context-preservation/254-code-graph-scan-query.md`
- `../feature_catalog/22--context-preservation/08-code-graph-storage-query.md`
- `22--context-preservation/255-code-graph-graph-routing.md`
- `../feature_catalog/22--context-preservation/09-code_graph-bridge-context.md`
- `22--context-preservation/259-tree-sitter-parser.md`
- `../feature_catalog/22--context-preservation/13-tree-sitter-wasm-parser.md`
- `22--context-preservation/260-code-graph-auto-trigger.md`
- `../feature_catalog/22--context-preservation/15-code-graph-auto-trigger.md`
- `18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md`
- `../feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md`
- `22--context-preservation/275-code-graph-readiness-contract.md`
- `../feature_catalog/22--context-preservation/24-code-graph-readiness-contract.md`
- `22--context-preservation/281-code-graph-read-path-selective-self-heal.md`
- `../feature_catalog/22--context-preservation/08-code-graph-storage-query.md`
- `22--context-preservation/282-code-graph-cell-coverage-evidence.md`
- `22--context-preservation/282-code-graph-cell-coverage-evidence.md`
- `22--context-preservation/283-skill-graph-status.md`
- `../feature_catalog/22--context-preservation/28-skill-graph-status.md`
- `22--context-preservation/284-skill-graph-query.md`
- `../feature_catalog/22--context-preservation/27-skill-graph-query.md`
- `22--context-preservation/285-skill-graph-validate.md`
- `../feature_catalog/22--context-preservation/29-skill-graph-validate.md`
- `23--doctor-commands/334-doctor-code_graph-daemon-healthy.md`
- `23--doctor-commands/335-doctor-code_graph-daemon-zombie.md`
- `23--doctor-commands/336-doctor-code_graph-daemon-unreachable.md`
- `04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md`
- `../feature_catalog/04--maintenance/038-embedding-reconciliation-memory-embedding-reconcile.md`


---

## 4. Genuinely ambiguous — NEEDS A HUMAN PICK (21)
**Why:** the target filename exists in several different places and there's no reliable signal for
which one was meant (e.g. a bare `README.md` / `SKILL.md` with hundreds of candidates). Auto-picking
would risk pointing at the wrong file.

**deep-loop-runtime/tests/fixtures/council-value/README.md** (1)
- `../README.md`

**sk-code/references/webflow/debugging/debugging_workflows.md** (4)
- `../../assets/checklists/debugging_checklist.md`
- `../../assets/checklists/debugging_checklist.md`
- `../../assets/checklists/debugging_checklist.md`
- `../../assets/checklists/debugging_checklist.md`

**sk-code/references/webflow/implementation/implementation_workflows.md** (7)
- `../../assets/patterns/wait_patterns.js`
- `../../assets/patterns/validation_patterns.js`
- `../../assets/patterns/validation_patterns.js`
- `../../assets/patterns/wait_patterns.js`
- `../../assets/patterns/validation_patterns.js`
- `../../assets/patterns/wait_patterns.js`
- `../../assets/patterns/validation_patterns.js`

**sk-code/references/webflow/performance/webflow_constraints.md** (1)
- `/specs/005-example.com/024-performance-optimization/decision-record.md`

**sk-code/references/webflow/verification/verification_workflows.md** (2)
- `../../assets/checklists/verification_checklist.md`
- `../../assets/checklists/verification_checklist.md`

**system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md** (2)
- `../../skill_advisor/tests/README.md`
- `../../skill_advisor/lib/README.md`

**system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/README.md** (1)
- `../README.md`

**system-spec-kit/mcp_server/lib/enrichment/README.md** (1)
- `../../code_graph/README.md`

**system-spec-kit/mcp_server/lib/providers/README.md** (1)
- `../contracts/README.md`

**system-spec-kit/mcp_server/plugin_bridges/README.md** (1)
- `../skill_advisor/README.md`


---

## 5. Misc dead references — NEEDS A LOOK (8)
**Why:** points at a file/folder that's gone (a moved spec folder, a deleted doc) and isn't a catalog
listing. Each needs a quick individual call: repoint or remove.

**sk-code/assets/webflow/checklists/code_quality_checklist.md** (1)
- `../../references/motion_dev/`

**sk-code/references/webflow/javascript/quality_standards.md** (1)
- `target`

**system-code-graph/INSTALL_GUIDE.md** (1)
- `../../install_guides/SET-UP%20-%20Code%20Graph.md`

**system-skill-advisor/references/runtime/freshness_contract.md** (2)
- `../feature_catalog/01--daemon-and-freshness/`
- `../manual_testing_playbook/05--auto-update-daemon/`

**system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md** (1)
- `../FORMAT.md`

**system-spec-kit/scripts/resource-map/README.md** (1)
- `../../templates/level_contract_optional_resource-map.md`

**system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/spec.md** (1)
- `003-missing/`

