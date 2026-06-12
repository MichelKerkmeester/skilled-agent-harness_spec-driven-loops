# Iteration 049 — Angle 49

**Angle:** Catalog/playbook governance: hand-maintained counts and tables (feature catalog, playbook index, drift-prone self-checks) — generation or CI-guarding.

**Summary:** The highest-risk issue is not the presence of hand-maintained counts by itself, but that executable and documented inventories already disagree in system-spec-kit and system-skill-advisor. The fix direction is a shared generated inventory or CI guard that owns counts, link resolution, and orphan detection for feature catalogs and manual playbooks.

**Findings kept:** 4

## [P1][BUG] Spec-kit playbook runner treats vendored hidden node_modules docs as active scenarios

- Evidence: .opencode/skills/system-spec-kit/scripts/tests/manual-playbook-runner.ts:264-278 recursively walks every directory and only skips _deprecated; read(.opencode/skills/system-spec-kit/manual_testing_playbook/.opencode) shows node_modules/; command output: runnerRecursiveFiles=437 documentedImmediateFiles=410 extraRecursive=.opencode/node_modules/@opencode-ai/plugin/node_modules/zod/README.md,...
- Detail: The executable runner's discovery logic does not match the root playbook's documented scenario-count model. Because a hidden .opencode/node_modules tree exists under manual_testing_playbook, the runner can ingest third-party README/LICENSE markdown as scenario files and turn governance validation into parse noise or false failures.
- Fix sketch: Restrict runner discovery to immediate /^[0-9][0-9]--/ category files or explicitly skip dot directories and node_modules.

## [P1][BROKEN-FEATURE] Spec-kit root playbook release-readiness coverage check does not prove linked scenario coverage

- Evidence: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:138-145 requires 100% coverage and orphan scenario count zero; command output: featureFileRows=226 missing=1 immediateFiles=410 orphanImmediate=185; missing link at manual_testing_playbook.md:2172 and :3658 targets 11--scoring-and-calibration/102-Ollama runtime-optionaldependencies.md
- Detail: The root playbook's deterministic count only proves there are 410 immediate scenario files, not that the root index links every scenario or that links resolve. The current root index has many unlisted immediate scenario files and at least one broken scenario link, so the release-readiness gate is materially weaker than it claims.
- Fix sketch: Add a CI guard that compares root scenario rows to live files, fails on missing targets and orphan files, and derives the displayed totals from that same inventory.

## [P1][DOC-DRIFT] Skill-advisor feature catalog count is internally contradictory and stale

- Evidence: .opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md:21 says 38 features across 7 groups; lines 25-33 table counts sum to 42 and line 32 claims 4 hooks/plugin files; command output: overview=38/7 tableSum=42 ... 07--hooks-and-plugin claimed=4 actual=3, immediate feature files=41
- Detail: The catalog's overview, group table, and live file inventory disagree. Operators using the catalog as a governance inventory cannot tell whether the package has 38, 41, or 42 features.
- Fix sketch: Generate the overview and group counts from the feature_catalog directory tree or add a test that fails when claimed counts diverge from files.

## [P2][DOC-DRIFT] Skill-advisor playbook says its inventory test verifies a 41-scenario package, but the live guard verifies 46

- Evidence: .opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291 says the active inventory check verifies the 41-scenario package count; .opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts:45-55 asserts 46 rows, 46 unique IDs, and 46 files; command output: system-skill-advisor/manual_testing_playbook immediateFiles=46
- Detail: The manual playbook's automated-test cross-reference is stale even though the actual guard appears aligned with the live 46-file inventory. This is a governance documentation error that can mislead reviewers about what the CI check protects.
- Fix sketch: Update the playbook cross-reference to 46 and avoid literal duplicated counts outside the test or generated inventory block.
