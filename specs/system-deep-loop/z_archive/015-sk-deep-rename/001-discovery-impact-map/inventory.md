---
title: "Inventory: Phase 001 Discovery Impact Map"
description: "Canonical active-scope inventory for sk-deep-review and sk-deep-research references before packet 070 rename phases."
---
# Inventory: Phase 001 Discovery Impact Map

Generated on 2026-05-05 by cli-codex. Scope includes active text files under `.opencode`, `.claude`, `.codex`, `.gemini`, root `*.md`/`*.json`, and `specs`, excluding `z_archive/`, `.git/`, `node_modules/`, historical changelog folders, binary databases, and generated `dist/` except checked-in `.opencode/skills/system-spec-kit/scripts/dist/*.js`. The Phase 001 output folder itself is excluded so generated inventory files do not inventory themselves.

## Total Reference Counts

| Metric | Files | Text matches |
| --- | --- | --- |
| `sk-deep-review` | 962 | 3687 |
| `sk-deep-research` | 1095 | 12059 |
| Unique union | 1514 | 15746 |
| Review-only files | 419 | - |
| Research-only files | 552 | - |
| Files containing both | 543 | - |

## Category Breakdown

| Area | Files | Text matches | Phase |
| --- | --- | --- | --- |
| `skill-folder-root` | 129 | 1197 | 002 |
| `skill-graph` | 1 | 11 | 002 |
| `opencode-skill-md` | 2 | 6 | 003 |
| `opencode-references` | 11 | 25 | 003 |
| `opencode-agent` | 3 | 5 | 003 |
| `opencode-command` | 6 | 83 | 003 |
| `mcp-server` | 8 | 93 | 003 |
| `script` | 5 | 67 | 003 |
| `test-fixture` | 11 | 66 | 003 |
| `spec-folder-active` | 1324 | 14160 | 003 |
| `runtime-claude` | 3 | 5 | 004 |
| `runtime-codex` | 3 | 5 | 004 |
| `runtime-gemini` | 4 | 15 | 004 |
| `root-doc` | 3 | 7 | 005 |
| `config` | 1 | 1 | 005 |

## Phase Breakdown

| Phase | Files | Text matches |
| --- | --- | --- |
| 002 | 130 | 1208 |
| 003 | 1370 | 14505 |
| 004 | 10 | 25 |
| 005 | 4 | 8 |

## Per-Area Top-10 Files

### skill-folder-root

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/skills/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md` | 84 | 84 | 0 | 002 |
| `.opencode/skills/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md` | 77 | 0 | 77 | 002 |
| `.opencode/skills/sk-deep-review/README.md` | 25 | 21 | 4 | 002 |
| `.opencode/skills/sk-deep-review/graph-metadata.json` | 20 | 19 | 1 | 002 |
| `.opencode/skills/sk-deep-research/graph-metadata.json` | 18 | 1 | 17 | 002 |
| `.opencode/skills/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md` | 16 | 0 | 16 | 002 |
| `.opencode/skills/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md` | 15 | 15 | 0 | 002 |
| `.opencode/skills/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md` | 15 | 15 | 0 | 002 |
| `.opencode/skills/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md` | 14 | 0 | 14 | 002 |
| `.opencode/skills/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md` | 14 | 0 | 14 | 002 |
### skill-graph

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | 11 | 6 | 5 | 002 |
### opencode-skill-md

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/skills/system-spec-kit/SKILL.md` | 4 | 1 | 3 | 003 |
| `.opencode/skills/cli-opencode/SKILL.md` | 2 | 1 | 1 | 003 |
### opencode-references

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/skills/README.md` | 8 | 4 | 4 | 003 |
| `.opencode/skills/sk-code/manual_testing_playbook/04--skill-advisor-integration/001-advisor-probe-battery.md` | 6 | 4 | 2 | 003 |
| `.opencode/skills/system-spec-kit/README.md` | 2 | 0 | 2 | 003 |
| `.opencode/skills/system-spec-kit/references/structure/folder_structure.md` | 2 | 1 | 1 | 003 |
| `.opencode/skills/sk-code-review/graph-metadata.json` | 1 | 1 | 0 | 003 |
| `.opencode/skills/sk-code-review/references/quick_reference.md` | 1 | 1 | 0 | 003 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md` | 1 | 0 | 1 | 003 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md` | 1 | 0 | 1 | 003 |
| `.opencode/skills/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md` | 1 | 0 | 1 | 003 |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | 1 | 1 | 0 | 003 |
### opencode-agent

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/agents/deep-review.md` | 3 | 3 | 0 | 003 |
| `.opencode/agents/deep-research.md` | 1 | 0 | 1 | 003 |
| `.opencode/agents/orchestrate.md` | 1 | 0 | 1 | 003 |
### opencode-command

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` | 17 | 0 | 17 | 003 |
| `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` | 17 | 0 | 17 | 003 |
| `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` | 15 | 15 | 0 | 003 |
| `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` | 15 | 15 | 0 | 003 |
| `.opencode/commands/speckit/deep-research.md` | 10 | 2 | 8 | 003 |
| `.opencode/commands/speckit/deep-review.md` | 9 | 6 | 3 | 003 |
### mcp-server

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | 47 | 24 | 23 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py` | 15 | 2 | 13 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | 12 | 7 | 5 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | 10 | 3 | 7 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts` | 4 | 2 | 2 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | 2 | 1 | 1 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | 2 | 1 | 1 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/scoring-constants.ts` | 1 | 0 | 1 | 003 |
### script

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/skills/system-spec-kit/scripts/.folder-list.txt` | 24 | 1 | 23 | 003 |
| `.opencode/skills/system-spec-kit/scripts/.scan-lines.txt` | 24 | 1 | 23 | 003 |
| `.opencode/skills/system-spec-kit/scripts/.unscanned.txt` | 11 | 0 | 11 | 003 |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | 6 | 3 | 3 | 003 |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md` | 2 | 1 | 1 | 003 |
### test-fixture

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/prompt-pack.vitest.ts` | 16 | 8 | 8 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | 10 | 5 | 5 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | 9 | 9 | 0 | 003 |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | 9 | 0 | 9 | 003 |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | 8 | 8 | 0 | 003 |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | 6 | 6 | 0 | 003 |
| `.opencode/skills/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts` | 3 | 3 | 0 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/remediation-008-docs.vitest.ts` | 2 | 1 | 1 | 003 |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | 1 | 1 | 0 | 003 |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | 1 | 0 | 1 | 003 |
### spec-folder-active

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/runs/I2/cli-codex-1/output.txt` | 2240 | 76 | 2164 | 003 |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/runs/I2/cli-codex-1/output.txt` | 2240 | 76 | 2164 | 003 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/runs/Q2/cli-codex-1/output.txt` | 685 | 109 | 576 | 003 |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/runs/Q2/cli-codex-1/output.txt` | 685 | 109 | 576 | 003 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/Q2/cli-codex-1/output.txt` | 673 | 16 | 657 | 003 |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/runs/Q2/cli-codex-1/output.txt` | 673 | 16 | 657 | 003 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration/research/findings-registry.json` | 214 | 96 | 118 | 003 |
| `specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration/research/findings-registry.json` | 214 | 96 | 118 | 003 |
| `.opencode/specs/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md` | 159 | 44 | 115 | 003 |
| `specs/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md` | 159 | 44 | 115 | 003 |
### runtime-claude

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.claude/agents/deep-review.md` | 3 | 3 | 0 | 004 |
| `.claude/agents/deep-research.md` | 1 | 0 | 1 | 004 |
| `.claude/agents/orchestrate.md` | 1 | 0 | 1 | 004 |
### runtime-codex

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.codex/agents/deep-review.toml` | 3 | 3 | 0 | 004 |
| `.codex/agents/deep-research.toml` | 1 | 0 | 1 | 004 |
| `.codex/agents/orchestrate.toml` | 1 | 0 | 1 | 004 |
### runtime-gemini

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.gemini/commands/speckit/deep-research.toml` | 10 | 2 | 8 | 004 |
| `.gemini/agents/deep-review.md` | 3 | 3 | 0 | 004 |
| `.gemini/agents/deep-research.md` | 1 | 0 | 1 | 004 |
| `.gemini/agents/orchestrate.md` | 1 | 0 | 1 | 004 |
### root-doc

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.opencode/install_guides/SET-UP - AGENTS.md` | 3 | 1 | 2 | 005 |
| `.opencode/install_guides/README.md` | 2 | 1 | 1 | 005 |
| `README.md` | 2 | 1 | 1 | 005 |
### config

| File | Matches | Review | Research | Phase |
| --- | --- | --- | --- | --- |
| `.codex/config.toml` | 1 | 1 | 0 | 005 |

## Edge Cases Discovered

| Edge case | Count | Expected handling |
| --- | --- | --- |
| Filename embeds | 6 | Rename paths in Phase 002/003 as applicable; changelog embeds are intentionally excluded as historical. |
| MCP TS/JS constants | 6 | Update in Phase 003 with scorer/test fixture expectations. |
| SQLite/database indexed entries | 7 | Do not edit binaries directly; rebuild/re-index in Phase 006. |
| Snapshot fixtures with old names | 0 | Update in Phase 003 when expected outputs change. |
| Graph metadata files | 43 | Update active metadata in Phase 003 or phase-local closeout. |
| Markdown/path links to old skill roots | 1032 | Update with content references in owning phase. |
| Code graph database surfaces | 2 | Refresh index after rename; exclude DB binaries from TSV. |

See `edge-cases.md` for annotated paths and snippets.

## Recommended Phase Ordering

The parent 002-005 partition is valid with one amendment: Phase 002 should own both old skill folder roots and `skill-graph.json`, while Phase 003 should be prepared for the largest blast radius in active spec outputs and MCP/advisor fixtures. The measured ownership is:

| Phase | Ownership | Measured files |
| --- | --- | --- |
| 002 | Skill folder roots and skill graph | 130 |
| 003 | .opencode internals, scripts, MCP server, test fixtures, active spec folders | 1370 |
| 004 | .claude/.codex/.gemini runtime mirrors | 10 |
| 005 | Root docs and config files | 4 |

Phase 003 is materially larger than the parent pre-discovery estimate because active `.opencode/specs/**/runs/**/output.txt` files contain dense historical test output references. Those are active by path policy unless the orchestrator chooses to treat run outputs as historical artifacts in a later packet decision.
