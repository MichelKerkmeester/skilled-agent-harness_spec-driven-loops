---
title: "Research: Skill Advisor Extraction Survey"
description: "Structured inventory of current advisor source tree, consumers, tool registrations, runtime configs, and docs references for packet 015/009/001."
trigger_phrases:
  - "skill advisor extraction survey"
  - "advisor consumer inventory"
importance_tier: "important"
contextType: "research"
---
# Research: Skill Advisor Extraction Survey

## Scope

This survey is a point-in-time inventory for ADR-001. It uses the current main-branch workspace and excludes binary SQLite files. Historical spec packets are noisy, so the live consumer table excludes `.opencode/specs/**` and `_sandbox/**`; documentation references are inventoried separately for `feature_catalog/`, `manual_testing_playbook/`, and `references/`.

Commands used:

```bash
git grep -n -E 'skill_advisor/handlers|advisor_(recommend|rebuild|status|validate)|skill_advisor|skill-graph\.sqlite'
git grep -n -E 'advisor|skill_advisor' -- ':(glob)**/feature_catalog/**' ':(glob)**/manual_testing_playbook/**' ':(glob)**/references/**'
```

## Current Advisor Source Tree

| Directory | Purpose |
|-----------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` | Current package root for advisor README, install/setup docs, metadata, and source folders. |
| `bench/` | Latency, scorer calibration, and benchmark helpers. |
| `compat/` | Stable package entrypoints for external callers and plugin bridges. |
| `data/` | Package-local data notes and generated/fixture data ownership. |
| `feature_catalog/` | Current advisor feature inventory grouped by daemon, indexing, lifecycle, scorer, MCP surface, hooks/plugin, and Python compatibility. |
| `handlers/` | MCP handler implementations for `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`. |
| `lib/` | Core implementation: auth, compatibility readers, corpus helpers, daemon lifecycle, derived metadata, freshness, lifecycle routing, scorer fusion, shadow telemetry, utilities, rendering, subprocess fallback. |
| `lib/auth/` | Advisor auth and prompt-safety boundary helpers. |
| `lib/compat/` | Read-only compatibility helpers such as status readers. |
| `lib/corpus/` | Corpus and validation data loaders. |
| `lib/daemon/` | Watcher, lease, lifecycle, and generation publication code. |
| `lib/derived/` | Derived skill metadata extraction and sync helpers. |
| `lib/freshness/` | Rebuild, trust, generation, and freshness calculations. |
| `lib/lifecycle/` | Archive, supersession, rollback, schema migration, and age-haircut routing. |
| `lib/scorer/` | Lane registry, projection, fusion, weights, ambiguity, ablation, and semantic/lexical/graph scoring lanes. |
| `lib/shadow/` | Shadow-lane telemetry sink and diagnostics. |
| `lib/utils/` | Advisor-local utility helpers. |
| `manual_testing_playbook/` | Manual validation scenarios for MCP tools, hooks, compat, daemon, indexing, lifecycle, scorer, and Python paths. |
| `schemas/` | Tool input/output schemas and advisor metadata contracts. |
| `scripts/` | Python shim, regression runner, runtime helpers, corpus scoring, skill graph compiler, initialization scripts, and fixtures. |
| `scripts/fixtures/` | Regression fixtures for Python parity and routing accuracy. |
| `scripts/out/` | Reserved generated output folder. |
| `scripts/routing-accuracy/` | Labeled prompts and scoring scripts for routing corpus checks. |
| `tests/` | Vitest and compatibility coverage grouped by handlers, hooks, schemas, scorer, parity, Python, cache, and fixtures. |
| `tools/` | MCP tool descriptors and contract-key definitions. |

Representative source files: `handlers/advisor-recommend.ts`, `handlers/advisor-rebuild.ts`, `handlers/advisor-status.ts`, `handlers/advisor-validate.ts`, `tools/advisor-recommend.ts`, `tools/advisor-rebuild.ts`, `tools/advisor-status.ts`, `tools/advisor-validate.ts`, `schemas/advisor-tool-schemas.ts`, `scripts/skill_advisor.py`, `lib/skill-advisor-brief.ts`, `lib/scorer/fusion.ts`, and `lib/freshness/rebuild-from-source.ts`.

## Consumer Call Sites

Live grep summary after excluding historical spec packets, sandbox content, tests, feature catalogs, playbooks, references, and SQLite binaries: **607 matching lines across 154 files**. The table below groups the highest-signal live consumers and migration touch points by file with matching line numbers.

| Matches | File | Lines |
|---------|------|-------|
| 1 | `.gemini/commands/doctor/update.toml` | 2 |
| 1 | `.opencode/commands/doctor.md` | 4 |
| 4 | `.opencode/commands/doctor/_routes.yaml` | 126, 127, 128, 129 |
| 12 | `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` | 22, 39, 74, 75, 79, 149, 150, 185, 188, 191, 298, 378 |
| 3 | `.opencode/commands/doctor/assets/doctor_update.yaml` | 104, 105, 441 |
| 4 | `.opencode/commands/doctor/update.md` | 4, 216, 217, 269 |
| 3 | `.opencode/install_guides/README.md` | 1101, 1105, 1196 |
| 14 | `.opencode/install_guides/SET-UP - Skill Advisor.md` | 58, 74, 75, 85, 120, 128, 135, 149, 159, 164, 181, 182, 184, 193 |
| 4 | `.opencode/plugins/spec-kit-skill-advisor.js` | 39, 44, 48, 676 |
| 29 | `.opencode/skills/README.md` | 46, 63, 64, 70, 71, 72, 92, 96, 120, 301, 302, 303, 309, 310, 332, 338, 381, 382, 383, 386, 387, 389, 401, 415, 424, 439, 475, 491, 492 |
| 1 | `.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs` | 21 |
| 31 | `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | 18, 50, 90, 117, 150, 181, 182, 273, 286, 301, 313, 323, 327, 328, 329, 330, 334, 335, 336, 347, 351, 430, 436, 459, 461, 467, 480, 486, 506, 507, 508 |
| 5 | `.opencode/skills/system-spec-kit/README.md` | 97, 131, 133, 135, 137 |
| 9 | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | 444, 445, 446, 448, 518, 519, 520, 522, 555 |
| 11 | `.opencode/skills/system-spec-kit/mcp_server/README.md` | 9, 43, 130, 147, 149, 184, 211, 227, 257, 280, 320 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | 96, 100, 101, 230 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts` | 9, 10, 11 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | 16, 17, 22 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | 22, 23, 28 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | 18, 19, 24 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | 17, 18, 23 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | 5, 19, 104 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | 7, 28, 35, 153 |
| 10 | `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | 12, 20, 794, 795, 796, 797, 865, 866, 867, 868 |
| 23 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/INSTALL_GUIDE.md` | 3, 28, 59, 60, 61, 66, 67, 68, 69, 80, 98, 101, 102, 108, 109, 112, 115, 121, 138, 152, 155, 164, 172 |
| 12 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/README.md` | 6, 32, 78, 110, 126, 162, 163, 164, 165, 166, 180, 181 |
| 7 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts` | 2, 54, 55, 80, 89, 109, 121 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | 2, 341 |
| 7 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | 2, 27, 92, 107, 121, 185, 197 |
| 6 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts` | 2, 162, 190, 285, 286, 579 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/index.ts` | 5, 6, 7, 8 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/compat/advisor-status-reader.ts` | 6, 8 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness.ts` | 90, 98, 105, 106 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts` | 257 |
| 7 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | 132, 275, 309, 378, 379, 380, 381 |
| 28 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | 10, 40, 63, 74, 85, 125, 177, 189, 208, 211, 389, 418, 3132, 3135, 3322, 3323, 3324, 3325, 3326, 3327, 3328, 3329, 3332, 3333, 3336, 3337, 3359, 3361 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_bench.py` | 6, 8, 35, 45 |
| 5 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py` | 6, 8, 32, 42, 47 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_runtime.py` | 6, 8, 302 |
| 7 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | 119, 196, 200, 202, 206, 339, 340 |
| 5 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts` | 2, 9, 10, 15, 16 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-recommend.ts` | 2, 26 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-status.ts` | 2, 8 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-validate.ts` | 2, 17 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | 15, 721 |
| 9 | `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | 18, 85, 86, 87, 88, 92, 94, 96, 98 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | 22, 23, 25, 30 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/vitest.stress.config.ts` | 19, 21 |
| 4 | `.opencode/skills/system-spec-kit/scripts/evals/check-source-dist-alignment.ts` | 24, 143, 144, 145 |
| 1 | `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement.ts` | 15 |
| 4 | `AGENTS.md` | 172, 185, 371, 384 |
| 11 | `README.md` | 313, 649, 691, 700, 712, 713, 714, 715, 729, 740, 1407 |

Remaining live consumer rows from the same grep:

| Matches | File | Lines |
|---------|------|-------|
| 1 | `.gitignore` | 129 |
| 27 | `.opencode/install_guides/SET-UP - AGENTS.md` | 524, 556, 769, 770, 771, 786, 787, 788, 798, 799, 805, 806, 807, 813, 860, 876, 928, 1059, 1061, 1066, 1067, 1070, 1073, 1083, 1084, 1241, 1242 |
| 1 | `.opencode/install_guides/SET-UP - Skill Creation.md` | 657 |
| 1 | `.opencode/skills/cli-claude-code/SKILL.md` | 434 |
| 1 | `.opencode/skills/cli-claude-code/changelog/v1.0.0.0.md` | 41 |
| 1 | `.opencode/skills/cli-claude-code/changelog/v1.1.4.0.md` | 45 |
| 1 | `.opencode/skills/cli-codex/SKILL.md` | 442 |
| 1 | `.opencode/skills/cli-codex/changelog/v1.0.0.0.md` | 34 |
| 1 | `.opencode/skills/cli-gemini/SKILL.md` | 391 |
| 1 | `.opencode/skills/cli-gemini/changelog/v1.0.0.0.md` | 40 |
| 2 | `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md` | 92, 146 |
| 1 | `.opencode/skills/cli-opencode/SKILL.md` | 385 |
| 3 | `.opencode/skills/cli-opencode/changelog/v1.0.0.0.md` | 40, 41, 49 |
| 1 | `.opencode/skills/deep-agent-improvement/README.md` | 370 |
| 1 | `.opencode/skills/deep-agent-improvement/changelog/v1.0.1.0.md` | 35 |
| 2 | `.opencode/skills/deep-ai-council/changelog/v1.0.0.0.md` | 151, 152 |
| 1 | `.opencode/skills/deep-research/SKILL.md` | 371 |
| 1 | `.opencode/skills/deep-research/changelog/v1.3.0.0.md` | 54 |
| 1 | `.opencode/skills/deep-review/SKILL.md` | 447 |
| 1 | `.opencode/skills/deep-review/changelog/v1.0.0.0.md` | 42 |
| 1 | `.opencode/skills/mcp-chrome-devtools/SKILL.md` | 309 |
| 1 | `.opencode/skills/mcp-coco-index/SKILL.md` | 459 |
| 1 | `.opencode/skills/mcp-coco-index/changelog/v1.2.0.0.md` | 34 |
| 1 | `.opencode/skills/mcp-coco-index/graph-metadata.json` | 19 |
| 1 | `.opencode/skills/mcp-code-mode/SKILL.md` | 422 |
| 1 | `.opencode/skills/sk-code/graph-metadata.json` | 31 |
| 1 | `.opencode/skills/sk-git/README.md` | 97 |
| 1 | `.opencode/skills/sk-git/SKILL.md` | 407 |
| 1 | `.opencode/skills/sk-prompt/SKILL.md` | 436 |
| 1 | `.opencode/skills/system-spec-kit/changelog/v1.2.6.0.md` | 131 |
| 1 | `.opencode/skills/system-spec-kit/changelog/v3.3.0.0.md` | 140 |
| 1 | `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` | 180 |
| 1 | `.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md` | 65 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | 25 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts` | 10 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | 25 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts` | 23 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/README.md` | 48 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/README.md` | 38, 49 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/lib/utils/skill-label-sanitizer.ts` | 9, 11 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/lib/utils/sqlite-integrity.ts` | 9, 14 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md` | 81 |
| 28 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/SET-UP_GUIDE.md` | 8, 29, 30, 31, 65, 66, 67, 72, 73, 74, 83, 90, 92, 93, 122, 128, 138, 152, 153, 159, 180, 198, 221, 225, 228, 231, 234, 235 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/bench/README.md` | 26, 102 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/bench/scorer-calibration.bench.ts` | 70 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/compat/README.md` | 25, 85 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/data/README.md` | 25, 85 |
| 14 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | 3, 44, 45, 46, 47, 48, 49, 50, 51, 54, 55, 56, 57, 58 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/README.md` | 26, 98 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/README.md` | 28, 178 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/auth/README.md` | 85 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/compat/README.md` | 95 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/corpus/README.md` | 86 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/README.md` | 98 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/derived/README.md` | 100 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/README.md` | 99 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/README.md` | 100 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/README.md` | 114 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/age-policy.ts` | 5 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | 219 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts` | 40 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/shadow/README.md` | 85 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/subprocess.ts` | 238, 240 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/utils/README.md` | 98 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/schemas/README.md` | 26, 97 |
| 14 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/README.md` | 26, 30, 42, 43, 44, 45, 60, 61, 62, 63, 93, 94, 95, 105 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | 38 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh` | 16, 54, 57, 60 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl` | 4, 13 |
| 5 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/score-routing-corpus.py` | 21, 31, 33, 58, 59 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | 1 |
| 16 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/README.md` | 26, 30, 31, 32, 33, 42, 43, 44, 45, 57, 58, 94, 95, 96, 97, 106 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-contract-keys.ts` | 6, 7 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/README.md` | 59 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts` | 23 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts` | 25 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w5-shadow-learned-weights.vitest.ts` | 12, 13, 38 |
| 6 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/README.md` | 56, 83, 84, 127, 166, 167 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/advisor-recommend-handler-stress.vitest.ts` | 9, 13, 14, 34 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` | 9 |
| 5 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts` | 11, 16, 22, 23, 24 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts` | 7 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` | 7, 8, 12 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts` | 11 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts` | 5, 6, 7 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` | 9, 13, 17 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` | 10, 14 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts` | 17, 18 |
| 6 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/lifecycle-routing-stress.vitest.ts` | 11, 16, 17, 18, 19, 20 |
| 8 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/mcp-diagnostics-stress.vitest.ts` | 10, 11, 12, 35, 56, 82, 85, 100 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | 103, 136, 167 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` | 4, 27 |
| 4 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/python-compat-stress.vitest.ts` | 22, 26, 30, 59 |
| 5 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-extras-stress.vitest.ts` | 7, 8, 9, 10, 11 |
| 3 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts` | 9, 10, 11 |
| 1 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/single-writer-lease-stress.vitest.ts` | 12 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts` | 11, 16 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/skill-projection-stress.vitest.ts` | 8, 9 |
| 2 | `.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/trust-state-stress.vitest.ts` | 7, 11 |
| 4 | `.opencode/skills/system-spec-kit/scripts/evals/check-source-dist-alignment.ts` | 24, 143, 144, 145 |
| 1 | `.opencode/skills/system-spec-kit/scripts/observability/README.md` | 68 |
| 1 | `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md` | 34 |
| 2 | `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` | 4, 198 |

The highest-risk runtime callers are the MCP dispatch layer, hook wrappers, OpenCode plugin bridge, Python shim, doctor workflows, install guides, and runtime config docs.

## Tool Registration Sites

| File | Lines | Current role |
|------|-------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | 11-15 | Imports `advisorRecommendTool`, `advisorRebuildTool`, `advisorStatusTool`, and `advisorValidateTool` from `./skill_advisor/tools/index.js`. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | 1088-1095 | Appends skill graph tools plus the four advisor tool descriptors to `TOOL_DEFINITIONS`. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | 917-930 | Creates the `context-server` MCP server and lists all `TOOL_DEFINITIONS`, including advisor descriptors. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | 1030-1037 | Dispatches tool calls through `dispatchTool`; advisor dispatch currently resolves through `mcp_server/tools/index.ts`. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | 228-230 | Defines current `SKILL_GRAPH_DATABASE_PATH` as `path.join(DATABASE_DIR, 'skill-graph.sqlite')`, binding the DB to the memory MCP database directory. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | 18, 85-98 | Imports advisor handlers and maps the four `advisor_*` names to handler functions. |

## Runtime Configs

All four runtimes currently point at the memory launcher only. Child 004 must add a sibling `system_skill_advisor` entry next to these entries.

| Runtime | File | Current memory entry | Required sibling |
|---------|------|----------------------|------------------|
| OpenCode | `opencode.json:19-24` | `spec_kit_memory` runs `node .opencode/bin/spec-kit-memory-launcher.cjs`. | Add `system_skill_advisor` running `node .opencode/bin/skill-advisor-launcher.cjs`. |
| Codex | `.codex/config.toml:9-12` | `[mcp_servers.spec_kit_memory]` runs the memory launcher. | Add `[mcp_servers.system_skill_advisor]` with the advisor launcher. |
| Claude | `.claude/mcp.json:10-14` | `spec_kit_memory` runs the memory launcher. | Add `system_skill_advisor` with the advisor launcher. |
| Gemini | `.gemini/settings.json:26-31` | `spec_kit_memory` runs the memory launcher. | Add `system_skill_advisor`; later hook paths at `.gemini/settings.json:85,97,109,115,127` also need cutover or wrappers. |

## Documentation References

Documentation reference grep summary for `feature_catalog/`, `manual_testing_playbook/`, and `references/`: **977 matching lines across 183 files**. These docs are not all runtime consumers, but they are migration touch points for child 005/006.

| Area | Files / examples | Migration note |
|------|------------------|----------------|
| Advisor package feature catalog | `skill_advisor/feature_catalog/**`, including MCP surface, hooks/plugin, scorer, daemon, and Python compat docs | Move with package in child 002/003; preserve current feature ids where useful. |
| Advisor package playbook | `skill_advisor/manual_testing_playbook/**` | Move with package and adjust commands/paths for standalone server. |
| System-spec-kit hook references | `references/hooks/skill-advisor-hook.md`, `references/hooks/skill-advisor-hook-validation.md` | Update runtime matrix, server id, tool ownership, and validation commands. |
| System-spec-kit feature/playbook docs | `system-spec-kit/feature_catalog/**`, `system-spec-kit/manual_testing_playbook/**` | Remove or retarget stale claims that advisor is memory-owned. |
| Cross-skill playbooks | `cli-codex`, `cli-opencode`, `mcp-coco-index`, `sk-code`, `deep-ai-council`, `deep-agent-improvement` playbooks/references | Update path references and expected hook/server behavior after the standalone server lands. |
| Generic references with incidental "advisory" wording | `references/intake-contract.md`, `references/validation/*`, external CLI references | Most are not advisor consumers; review only if grep context names the skill advisor or `advisor_*` tool ids. |

## Extraction Implications

- `advisor_*` id stability matters because live callers span MCP dispatch, hooks, plugin bridge, Python shim, doctor workflows, install guides, and playbooks.
- The standalone server must own both descriptor registration and Zod validation; otherwise the process boundary is cosmetic.
- `skill_graph_*` and advisor DB writers need a single-writer policy. Bridge tools must not create a second writer to `skill-graph.sqlite`.
- Runtime configs need exactly four sibling MCP entries in child 004.
- Documentation cleanup is larger than code registration cleanup; child 005/006 should budget for docs and playbook updates.
