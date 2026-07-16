Read-only verification mode. I’ll run the required context/routing gates, then execute the requested `rg` command before inspecting and classifying every returned file.

---

The requested `rg -l` command has been run and returned the migration hit set. I’m now using the hits plus targeted reads of each file’s reference context to classify the set without editing anything.

---

The full match-line output was too large for inline display, so I’ll inspect the saved tool-output file to avoid missing lower lines or extra files.

---

I’ve inspected the first chunk of full match output; continuing through the saved output to cover the complete set before reading individual files.

---

The saved match output confirms several large command-contract files have references beyond the default read window, so I’m continuing the output inspection in chunks before the final classification.

---

The match output continues into advisor corpus and scoring sources; I’m reading the remaining saved chunk, then I’ll verify agent file independence with `ls -la` and `readlink` as requested.

---

The saved output still has one more chunk. I’m finishing that pass now; no files have been modified.

---

The live hit set contains `.opencode/agents/**` hits but no `.claude/agents/**` hits from the requested command. I’ll still verify the on-disk agent-pair relationship directly with `ls -la` and `readlink` on the matching agent names.

---

Direct `ls -la` shows `.claude/agents` exists and the checked agent files are regular files, not symlinks; the requested `rg -l` hit set still only includes `.opencode/agents/**`, so I’m checking whether the Claude agent duplicates contain old references at all.

---

I’m opening the returned files in batches around their reference contexts now. This is read-only and includes command assets, docs, tests, and graph/advisor corpus files from the live list.

---

Batch 1 is complete. I’m continuing with command/router assets, system-spec-kit references, graph metadata, and test fixtures.

---

Batch 2 is complete. I’m continuing with manual testing playbooks, advisor scorer/code fixtures, and system-skill-advisor generated/corpus files.

---

Batch 3 is complete. I’m continuing with remaining tests, parity fixtures, advisor routing files, and parent-skill example docs.

---

Batch 4 is complete. I’m opening the final live-list files and the extra `.claude/agents` hits found during the duplication check.

---

All live-list files are opened. I’m doing one final targeted check for the `.claude/agents` match line numbers and symlink status so the duplication finding is precise.

---

The extra `.claude/agents` hits are confirmed by targeted `rg -n`. I’m checking the pair files themselves for symlink status now.

---

The checked agent pairs are regular files; `readlink` returned no symlink targets. I’m doing one count check on the original hit command output before composing the final table.

---

**Verification Result**
Exact command returned `137` files. I inspected all returned files read-only. No files were edited.

| File path | Stage | One-line reason |
|---|---:|---|
| `README.md` | Stage F | Top-level README prose references both old skill names. |
| `.opencode/hooks/pre-commit` | UNCLASSIFIED | Executable hook script points at old deep-improvement checker path. |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | UNCLASSIFIED | Plugin test fixture constructs old `deep-loop-workflows` registry path. |
| `.opencode/hooks/README.md` | Stage F | README prose documents old mirror-sync checker path. |
| `.opencode/agents/orchestrate.md` | Stage F | OpenCode agent definition prose references old workflow registry/scripts. |
| `.opencode/skills/cli-opencode/SKILL.md` | Stage F | Cross-skill “Related skills” mention uses old `deep-loop-workflows`. |
| `.opencode/plugins/mk-deep-loop-guard.js` | UNCLASSIFIED | Plugin implementation constant hardcodes old mode-registry path. |
| `.opencode/agents/deep-research.md` | Stage F | OpenCode agent definition prose references old deep-research path. |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Stage G | Sibling skill graph edge targets old `deep-loop-workflows`. |
| `.opencode/agents/deep-improvement.md` | Stage F | OpenCode agent definition prose uses old workflow skill identity. |
| `.opencode/agents/ai-council.md` | Stage F | OpenCode agent definition prose references old council/runtime paths. |
| `.opencode/agents/deep-review.md` | Stage F | OpenCode agent definition prose references old review reducer paths. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Stage F | System-spec-kit reference docs cite old runtime path. |
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Stage F | Cross-skill prose link points at old deep-improvement reference. |
| `.opencode/commands/create/skill-parent.md` | Stage H | Grandfather parent-skill example command uses `deep-loop-workflows`. |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Stage G | Sibling graph metadata has duplicate old workflow `related_to` entries. |
| `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` | Stage F | Skill reference prose cites old deep-review prompt template path. |
| `.opencode/skills/cli-opencode/references/permissions-matrix.md` | Stage F | Skill reference prose cites old runtime permissions gate path. |
| `.opencode/commands/deep/skill-benchmark.md` | Stage E | Deep command router/frontmatter uses old skill id and path. |
| `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml` | Stage E | Deep command YAML contract references old workflow/runtime paths. |
| `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml` | Stage E | Deep command YAML contract references old improvement paths. |
| `.opencode/commands/deep/assets/deep_ai-council_presentation.txt` | Stage E | Deep command presentation asset cites old council skill path. |
| `.opencode/commands/deep/assets/deep_agent-improvement_presentation.txt` | Stage E | Deep command presentation asset cites old improvement scripts. |
| `.opencode/commands/doctor/_routes.yaml` | UNCLASSIFIED | Doctor router manifest references old runtime scripts outside named Stage E scope. |
| `.opencode/commands/deep/assets/deep_research_presentation.txt` | Stage E | Deep command presentation asset cites old research/runtime paths. |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Stage E | Deep command YAML contract references old research/runtime paths. |
| `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml` | Stage E | Deep command YAML contract references old benchmark/improvement paths. |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | Stage E | Deep command YAML contract references old review/runtime paths. |
| `.opencode/commands/deep/assets/compiled/deep_research.contract.md` | Stage E | Generated command contract output embeds old source/runtime paths. |
| `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml` | Stage E | Deep command YAML contract references old improvement paths. |
| `.opencode/commands/deep/assets/deep_model-benchmark_presentation.txt` | Stage E | Deep command presentation asset cites old benchmark/improvement paths. |
| `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md` | Stage E | Generated command contract output embeds old council/runtime paths. |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` | Stage E | Deep command YAML contract references old council/runtime paths. |
| `.opencode/commands/deep/assets/deep_review_presentation.txt` | Stage E | Deep command presentation asset cites old review/runtime paths. |
| `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` | Stage E | Deep command YAML contract references old benchmark/improvement paths. |
| `.opencode/commands/deep/assets/compiled/deep_review.contract.md` | Stage E | Generated command contract output embeds old review/runtime paths. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Stage E | Deep command YAML contract references old research/runtime paths. |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | UNCLASSIFIED | Doctor asset YAML references old runtime DB paths outside named stages. |
| `.opencode/commands/deep/assets/legacy/deep_research.body.md` | Stage E | Legacy deep command body references old research protocol path. |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Stage E | Deep command YAML contract references old review/runtime paths. |
| `.opencode/commands/deep/assets/legacy/deep_ai-council.body.md` | Stage E | Legacy deep command body references old runtime name. |
| `.opencode/commands/create/assets/create_skill_parent_auto.yaml` | Stage H | Asset YAML mirrors parent-skill grandfather example. |
| `.opencode/commands/create/assets/create_skill_parent_confirm.yaml` | Stage H | Asset YAML mirrors parent-skill grandfather example. |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Stage F | Skill prose references old runtime helper path. |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | UNCLASSIFIED | Doctor update asset references old runtime DB paths outside named stages. |
| `.opencode/commands/doctor/assets/doctor_parent-skill.yaml` | UNCLASSIFIED | Doctor parent-skill asset uses old workflow as reference implementation. |
| `.opencode/skills/system-spec-kit/references/structure/folder_structure.md` | Stage F | System-spec-kit reference prose cites old research/review protocol paths. |
| `.opencode/skills/system-spec-kit/references/workflows/intake_contract.md` | Stage F | System-spec-kit workflow reference cites old deep-research spec check path. |
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Stage F | System-spec-kit workflow reference cites old runtime module owner. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Stage F | System-spec-kit skill prose and related-skills mentions use old workflow path/id. |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | UNCLASSIFIED | Doctor support script hardcodes old workflow owner/default target. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json` | UNCLASSIFIED | Memory eval corpus/data references old consolidation wording. |
| `.opencode/skills/system-spec-kit/graph-metadata.json` | Stage G | Sibling graph carries edges to both old names and duplicate workflow related entries. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/speckit-autopilot-lifecycle.md` | Stage F | Manual testing prose cites old runtime test location. |
| `.opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md` | Stage F | Constitutional doc frontmatter/prose uses old workflow skill id. |
| `.opencode/skills/system-spec-kit/scripts/ops/README.md` | Stage F | README prose references old runtime helper paths. |
| `.opencode/skills/sk-design/SKILL.md` | Stage F | Cross-skill related resource cites old workflow example path. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | UNCLASSIFIED | Test fixtures assert old deep-loop file paths. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/markdown-link-integrity-guard.md` | Stage F | Manual testing prose includes old broken-link examples. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/code-standards-alignment.md` | Stage F | Manual testing prose lists old runtime files. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts` | UNCLASSIFIED | Test imports old council helper paths. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/graph-degraded-stress-cell-isolation.md` | Stage F | Manual testing prose references old runtime test include path. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` | UNCLASSIFIED | Test imports old review reducer path. |
| `.opencode/skills/sk-design/benchmark/README.md` | Stage F | README benchmark command uses old improvement script path. |
| `.opencode/skills/system-spec-kit/README.md` | Stage F | README prose links to old deep-research protocol. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/memory-quality-and-indexing/description-json-batch-backfill-validation-pi-b3.md` | Stage F | Manual testing evidence includes old runtime spec/description examples. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-deep-loop-convergence.md` | Stage F | Manual testing prose cites old runtime CLI scripts. |
| `.opencode/skills/sk-prompt-models/references/quota_fallback.md` | Stage F | Skill reference prose cites old runtime fallback router. |
| `.opencode/skills/sk-prompt-models/references/pattern_index.md` | Stage F | Skill reference table links old runtime helper paths. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-G5-confirm-failure-injection.md` | Stage F | Manual testing evidence includes old runtime DB path. |
| `.opencode/skills/README.md` | Stage F | Skills README lists old workflow/runtime skill rows. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-tier-aware-default.md` | Stage F | Manual testing evidence includes old runtime DB path. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/doctor-update-G9-dashboard.md` | Stage F | Manual testing evidence includes old runtime DB path. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Stage I | Advisor routing source defines merged old workflow skill id. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Stage I | Advisor explicit scorer lane weights reference old workflow id. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts` | UNCLASSIFIED | System-spec-kit test imports old runtime helper path. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` | Stage I | Advisor lexical scorer category hints reference old workflow id. |
| `.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts` | UNCLASSIFIED | System-spec-kit test resolves old research reducer path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | UNCLASSIFIED | Contract parity test enumerates old review skill paths. |
| `.opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts` | UNCLASSIFIED | Reducer test imports old review reducer path. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Stage I | Advisor fusion scorer checks old workflow id. |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` | UNCLASSIFIED | Test imports old council persist helper path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts` | UNCLASSIFIED | Test reads old runtime fanout path. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` | Stage D | Structured generated skill graph still contains old workflow/runtime identities. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` | Stage I | Advisor routing corpus labels old workflow skill id. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | UNCLASSIFIED | Contract/schema test reads old review assets and reducer. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/ambiguity-prompts.jsonl` | Stage I | Advisor ambiguity corpus labels old workflow skill id. |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | UNCLASSIFIED | Optimizer structured config references old research/review config paths. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Stage I | Python advisor routing source hardcodes old workflow registry/id. |
| `.opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts` | UNCLASSIFIED | Reducer fail-closed test imports old review reducer path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | UNCLASSIFIED | Deep-research reducer test imports old reducer path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts` | Stage I | Advisor handler test expects old workflow skill id with workflowMode. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | UNCLASSIFIED | Contract parity test enumerates old research skill paths. |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-advise-completion.vitest.ts` | UNCLASSIFIED | Council completion test imports old advisor helper path. |
| `.opencode/skills/sk-doc/scripts/tests/test_changelog_validator.py` | UNCLASSIFIED | Changelog validator test points at old council changelog path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` | Stage I | Advisor routing parity test asserts old workflow skill id. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-permission-scope.vitest.ts` | UNCLASSIFIED | Council permission test imports old persist helper path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Stage I | Advisor registry drift guard reads old workflow registry path/id. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts` | Stage I | Advisor council parity test asserts old workflow skill id. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts` | Stage I | Advisor intent fixture expects old workflow skill id. |
| `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md` | Stage H | Grandfather parent-skill nested-packet example row. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Stage I | Advisor native scorer test uses old workflow fixture id. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/continuity-freshness.vitest.ts` | UNCLASSIFIED | Continuity freshness test references old benchmark fixture path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts` | Stage I | Advisor parity test documents old workflow top-1 divergences. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json` | Stage I | Advisor parity fixture records old workflow/runtime divergences. |
| `.opencode/skills/sk-code/manual_testing_playbook/tooling-and-hooks/comment-hygiene-hook.md` | Stage F | Manual testing prose cites old deep-review README paths. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-corpus-parity.vitest.ts` | Stage I | Advisor legacy parity test documents old workflow divergences. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-audit-trail.vitest.ts` | UNCLASSIFIED | Council audit trail test imports old helper paths. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/command-binding-existence.vitest.ts` | Stage I | Advisor command-binding test includes old workflow hub id. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | Stage I | Advisor CLI parity fixture uses old workflow skill id. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-probe-gate.vitest.ts` | UNCLASSIFIED | Security test TODO mentions old runtime sibling scope. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts` | UNCLASSIFIED | Council helper smoke test points at old replay helper path. |
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Stage G | Sibling graph metadata has repeated old workflow edges. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/corpus-df-idf.md` | Stage F | Manual testing prose lists old workflow/runtime SKILL paths. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/native-mcp-tools/skill-graph-query.md` | Stage F | Manual testing prose shows old workflow node in sample output. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/python/test_skill_advisor.py` | Stage I | Python advisor tests accept old workflow merged node. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md` | Stage F | Manual testing prose expects old runtime routed doc signal. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/provenance-and-trust-lanes.md` | Stage F | Manual testing evidence includes old workflow/runtime stale skill ids. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/metadata-sanitizer-entities-guard.vitest.ts` | Stage I | Advisor sanitizer guard test mentions old workflow entity shape. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/native-mcp-tools/skill-graph-status.md` | Stage F | Manual testing prose shows old workflow/runtime skill ids in status output. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/python-compat/regression-suite.md` | Stage F | Manual testing report prose shows old workflow actual-top results. |
| `.opencode/skills/sk-code/graph-metadata.json` | Stage G | Sibling graph metadata prerequisite edge targets old workflow. |
| `.opencode/skills/sk-code/code-review/references/quick_reference.md` | Stage F | Cross-skill reference links old review contract path. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/coverage-graph/deep-loop-graph-upsert-conditional.md` | Stage F | Manual testing prose cites old runtime upsert script. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/coverage-graph/deep-loop-graph-convergence-yaml-fire.md` | Stage F | Manual testing prose/title cites old runtime convergence script. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/lifecycle-routing/age-haircut.md` | Stage F | Manual testing evidence lists old runtime/workflow SKILL paths. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/lifecycle-routing/supersession.md` | Stage F | Manual testing evidence lists old graph-metadata self ids. |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Stage F | Sk-code reference prose cites old skill-benchmark drift guard path. |
| `.opencode/skills/sk-code/benchmark/README.md` | Stage F | README benchmark commands and related links use old workflow path. |
| `.opencode/skills/sk-code/benchmark/d4r-live/README.md` | Stage F | README reproduce command uses old skill-benchmark path. |
| `.opencode/skills/system-code-graph/feature_catalog/coverage-graph/deep-loop-graph-convergence.md` | Stage F | Feature catalog prose cites old runtime convergence script. |
| `.opencode/skills/system-code-graph/feature_catalog/coverage-graph/deep-loop-graph-upsert.md` | Stage F | Feature catalog prose cites old runtime upsert script. |
| `.opencode/skills/system-code-graph/feature_catalog/coverage-graph/deep-loop-graph-query.md` | Stage F | Feature catalog prose cites old runtime query/integration paths. |
| `.opencode/skills/system-code-graph/feature_catalog/coverage-graph/deep-loop-graph-status.md` | Stage F | Feature catalog prose cites old runtime status script. |
| `.opencode/skills/system-code-graph/feature_catalog/mcp-tool-surface/tool-registrations.md` | Stage F | Feature catalog prose cites old runtime script glob. |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Stage F | Feature catalog index prose cites old runtime scripts. |

**UNCLASSIFIED / GAPS**
Unclassified returned by exact command:

| File path | Why it is a gap |
|---|---|
| `.opencode/hooks/pre-commit` | Shell hook script, not covered by stages D-I. |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Plugin test, not command-contract/advisor/spec-doc category. |
| `.opencode/plugins/mk-deep-loop-guard.js` | Plugin implementation, not covered by stages D-I. |
| `.opencode/commands/doctor/_routes.yaml` | Doctor router manifest is outside the named deep-command Stage E set. |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` | Doctor YAML asset is outside named Stage E examples. |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Doctor YAML asset is outside named Stage E examples. |
| `.opencode/commands/doctor/assets/doctor_parent-skill.yaml` | Doctor parent-skill asset overlaps examples but is not one of the two Stage H YAMLs. |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Doctor support script is not covered by stages D-I. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json` | Memory eval corpus, not advisor routing corpus. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | System-spec-kit test fixture, not advisor baseline/ratchet. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts` | System-spec-kit test imports old council helpers. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` | System-spec-kit test imports old review reducer. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts` | System-spec-kit test imports old runtime helper. |
| `.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts` | System-spec-kit test resolves old reducer path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | System-spec-kit contract parity test enumerates old paths. |
| `.opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts` | System-spec-kit reducer test imports old reducer path. |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` | System-spec-kit council test imports old helper path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-auto-restart-contract.vitest.ts` | System-spec-kit command-contract test reads old runtime path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | System-spec-kit schema test reads old assets/reducer. |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Optimizer config references old config paths, not identity graph/corpus. |
| `.opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts` | System-spec-kit reducer test imports old reducer path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | System-spec-kit reducer test imports old reducer path. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | System-spec-kit contract parity test enumerates old paths. |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-advise-completion.vitest.ts` | System-spec-kit council test imports old helper path. |
| `.opencode/skills/sk-doc/scripts/tests/test_changelog_validator.py` | Sk-doc test points at old changelog path. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-permission-scope.vitest.ts` | System-spec-kit council test imports old helper path. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/continuity-freshness.vitest.ts` | System-spec-kit validation test references old benchmark fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-audit-trail.vitest.ts` | System-spec-kit council test imports old helper paths. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-probe-gate.vitest.ts` | Security test TODO names old runtime sibling. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts` | System-spec-kit smoke test points at old replay helper. |

Additional gap outside the 137-file command output:

| File path | Stage | Why it matters |
|---|---:|---|
| `.claude/agents/orchestrate.md` | Stage F | Targeted `rg .claude/agents` found old workflow references not returned by the original command. |
| `.claude/agents/deep-research.md` | Stage F | Targeted `rg .claude/agents` found old research path reference. |
| `.claude/agents/ai-council.md` | Stage F | Targeted `rg .claude/agents` found old council/runtime references. |
| `.claude/agents/deep-review.md` | Stage F | Targeted `rg .claude/agents` found old review reducer references. |
| `.claude/agents/deep-improvement.md` | Stage F | Targeted `rg .claude/agents` found old workflow skill references. |

Stage G edge-collapse check:

| Graph file | Finding |
|---|---|
| `.opencode/skills/system-spec-kit/graph-metadata.json` | Carries edges to both old names: `deep-loop-workflows` and `deep-loop-runtime`; should collapse to one new edge. |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Has duplicate `deep-loop-workflows` entries in `manual.related_to`; collapse duplicates. |
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Has repeated `deep-loop-workflows` enhance edges; no `deep-loop-runtime` edge in inspected section. |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Has one old `deep-loop-workflows` sibling edge. |
| `.opencode/skills/sk-code/graph-metadata.json` | Has one old `deep-loop-workflows` prerequisite edge. |

**Agents Duplication Confirmation**
`.opencode/agents/**` and `.claude/agents/**` are real independent files, not symlink pairs, for the checked overlapping hits: `orchestrate.md`, `deep-research.md`, `ai-council.md`, `deep-review.md`, and `deep-improvement.md`.

`ls -la` showed regular files in both trees with different sizes/timestamps, and `readlink` returned no targets for all checked pairs. The important gap is that the original 137-file command did not include the `.claude/agents/**` hits, while targeted `rg -n 'deep-loop-workflows|deep-loop-runtime' ".claude/agents"` found five additional files.
