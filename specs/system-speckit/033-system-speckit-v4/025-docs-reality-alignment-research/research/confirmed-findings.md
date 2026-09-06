# Confirmed findings: docs versus runtime

Reproduced in the orchestrating session on 2026-09-06 by opening every cited doc line and the runtime file or command it names. Rows marked dropped did not reproduce and are excluded from remediation. The remediation child is `027-doc-path-strict-mode-and-retired-capability-fixes`.

| ID | Sev | Doc | Claim | Actual | Verdict |
|----|-----|-----|-------|--------|---------|
| F3-01 | P1 | `references/validation/validation-rules.md:38-44` | Under `--strict` warnings exit as validation errors | `runtime/lib/validation/orchestrator.ts:984-989` passes on `errors === 0`; `validate.sh:71` help still says "Warnings as errors" | Confirmed |
| F3-02 | P1 | `references/validation/validation-rules.md:122-127` | A stale freshness warn already fails `--strict`; ENFORCE only relabels | A warn passes; `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` escalates it to an error, which fails | Confirmed |
| F1-01 | P1 | `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md:196` | Build runs `node runtime/cli/finalize-dist.mjs` | File lives at `runtime/scripts/finalize-dist.mjs` | Confirmed |
| F2-01 | P1 | `feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md:19` | Descriptions short-circuit full-corpus vector search | Same doc line 44 says that consumer is gone; `generate-description.ts` has no vector code | Confirmed |
| F4-01, F6-02 | P1 | `feature-catalog/doctor-commands/category-overview.md:27`, `feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19` | Five or seven routes including memory, causal-graph, code-graph | `_routes.yaml` has nine targets, none of those three | Confirmed |
| F7-01 | P1 | `README.md:413,434` | Tree lists `runtime/cli/memory/` and `constitutional/` | Neither exists; continuity lives at `runtime/cli/continuity/` | Confirmed |
| F7-02 | P2 | `README.md:415-417,432` | 17 core, 12 extractor, 20 util modules, 27 reference files | 29, 13, 19 TypeScript modules and 41 markdown files | Confirmed |
| F8-01 | P1 | `references/structure/phase-definitions.md:236` | `./scripts/spec/validate.sh` | Path is `runtime/cli/spec/validate.sh` | Confirmed |
| F10-01 | P1 | `phase-definitions.md:119`, `feature-catalog/tooling-and-scripts/template-composition-system.md:51`, `references/templates/level-selection-guide.md:167-171,191`, playbook `template-compliance-contract-enforcement-blocks-non-compliant.md:153,161` | Rule scripts check-anchors, check-section-counts, check-template-headers, check-sections | None exist under `runtime/cli/rules/`; anchors are the native `ANCHORS_VALID` rule, headers are `check-template-source.sh` | Confirmed |
| F9-01 | P1 | `references/workflows/execution-methods.md:234-237` | Save steps 11 and 12 re-index a vector database and drain an embedding retry queue | `generate-context.ts` has no such step; no database exists | Confirmed |
| F2-02 | P2 | `feature-catalog/feature-flag-reference/runtime-config-contract.md:41-63` | `semanticSearch`, `memoryIndex`, `memoryDecay`, `hybridSearch`, `checkpoints` sections retained in `config/config.jsonc` | The file has none of those keys | Confirmed, wider than reported |
| F5-01 | P2 | `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:79` | `rules/check-links.sh` is an orchestrator rule | It is the standalone `runtime/cli/check-links.sh` and is not in the registry | Confirmed |
| F6-01 | P2 | `references/cli/memory-handback.md:3,16,22` | Three cli siblings, `cli-opencode` listed twice | Six cli-* skills | Confirmed |
| F6-03 | P2 | `references/config/environment-variables.md:36` | `MEMORY_BASE_PATH` is used for path validation | `runtime/ENV-REFERENCE.md:138`: nothing imports the constant | Confirmed |
| F8-03 | P2 | `references/templates/level-specifications.md:78` | `check-completion.sh` is missing | It exists at `runtime/cli/spec/check-completion.sh` | Dropped |
| F8-02 | P2 | `level-selection-guide.md:191` | duplicate of F10-01 | folded into F10-01 | Merged |

## Second pass: Gemini 3.8 Flash High, two iterations over documents the first lane never opened

| ID | Sev | Doc | Claim | Actual | Verdict |
|----|-----|-----|-------|--------|---------|
| G-P0-01 | P0 | `manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md:81-87,100` | Script declares its fixtures | `level2Incomplete` is never declared and both fixture packets no longer exist | Confirmed; the path-prefix part was wrong, `.opencode/specs` is a symlink |
| G-P0-02 | P1 | `references/memory/save-workflow.md:144` | `/speckit:search` offers epistemic baselines, causal graph, evaluation | The command declares those unsupported | Confirmed |
| G-P1-01 | P1 | `manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md:41` | `cd .opencode/skills/runtime/` | Directory is `system-deep-loop/runtime` | Confirmed |
| G-P1-02 | P1 | `manual-testing-playbook/plugins-and-hooks/dist-freshness-guard.md:27-29,107` | Seven watched packages, five listed | `DIST_PACKAGES` has six | Confirmed |
| G-P1-03 | P1 | `manual-testing-playbook/ux-hooks/comment-hygiene-checker-baseline.md:31,52` | Runs the checker on `runtime/context-server.ts` | File retired with the memory server | Confirmed |
| G-P1-04 | P1 | `manual-testing-playbook/ux-hooks/comment-hygiene-claude-code-hook.md:52,56,75` | Hook is `claude-posttooluse.sh` | `.claude/settings.json` wires `claude-posttooluse.cjs`, which does not call the script | Confirmed |
| G-P1-05 | P1 | `references/memory/epistemic-vectors.md:210,315,333,338,390-392` | Search memory; dual-threshold readiness in Gate 1 | Memory search is retired; Gate 1 is one scale | Confirmed |
| G-P1-06 | P1 | `references/templates/template-guide.md:619-620` | Save re-indexes and touches `DB_UPDATED_FILE` | The continuity writer does neither | Confirmed |
| G-P1-07 | P1 | `references/templates/template-style-guide.md:213,217-229` | `memory/*.md` frontmatter for semantic search | Surface retired; continuity block replaces it | Confirmed |
| G-P1-08 | P1 | `references/templates/level-specifications.md:420` | Verify the `memory/` folder | Folder retired | Confirmed |
| G-P1-09 | P1 | `references/memory/trigger-config.md:220-241` | `config.jsonc` memory trigger section | No reader exists; phrases come from frontmatter | Confirmed |
| G-P1-10 | P1 | `references/debugging/troubleshooting.md:155-183` | `.opencode/specs` commands fail | `.opencode/specs` is a symlink to `specs`; the commands run | Dropped |
| G-P2-01 | P2 | `manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md:59,92` | Two hooks; session-prime uses warm paths | One hook runs; session-prime has no warm path | Confirmed |
| G-P2-02 | P2 | `manual-testing-playbook/context-preservation/resource-map-template.md:76,80` | `CLAUDE.md` matches `resource-map.md` | Zero matches | Confirmed |
| G-P2-03 | P2 | `manual-testing-playbook/feature-flag-reference/authored-continuity-snapshot.md:87` | `openltm-continuity-resilience.vitest.ts` | Retired; `thin-continuity-record.vitest.ts` survives | Confirmed |
| G-P2-04 | P2 | `runtime/cli/retrieval/lookup-trigger-index.mjs:6-8` and three retrieval docs | Cites `runtime/lib/search/hybrid-search.ts` | File retired | Confirmed, widened to the READMEs and the catalog example |
| G-P2-05 | P2 | `references/debugging/troubleshooting.md:355` | CONTINUE SESSION section | Removed from the ladder | Confirmed |
| G-P2-06 | P2 | `references/cli/daemon-cli-reference.md:114` | Duplicate env var | Listed twice | Confirmed |
| G-P2-07 | P2 | `references/templates/level-specifications.md:32-33,191-192,237-238`, `level-selection-guide.md:210-211` | Duplicate lines | Present | Confirmed |

## Third pass: DeepSeek V4 Flash max, five iterations over the families the first two passes never opened

| ID | Sev | Doc | Claim | Actual | Verdict |
|----|-----|-----|-------|--------|---------|
| F2-01 | P1 | `feature-catalog/memory-quality-and-indexing/post-save-quality-review.md:19,27,64-65` | Review runs at Step 10.5 before `indexMemoryFile()` indexing | Indexing is retired; the review runs at Step 11.75 after the trigger-index freshness check | Confirmed |
| F2-02 | P2 | same doc, line 98 | `workflow-e2e.vitest.ts` covers placement | File does not exist; `post-save-review.vitest.ts` does | Confirmed |
| F2-03 | P2 | same doc, lines 80-81 | Two companion entries | Neither file exists | Confirmed |
| F2-04 | P2 | `feature-catalog/memory-quality-and-indexing/spec-doc-structure-validator.md:46` | `runtime/handlers/memory-save.ts` invokes the validator | Handler gone; the registry runs it | Confirmed |
| F4-01 | P1 | `manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality.md:82-91` | Commands run five named test files | Five files do not exist | Confirmed, widened |
| F4-02 | P2 | same doc, lines 27,130,142 | Save indexes successfully | Index step retired | Confirmed |
| F5-03 | P1 | `manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md:22-41` | Runs two phantom test files, asserts indexing regressions | Files absent, indexing retired | Confirmed |
| F1-01 | P2 | `feature-catalog/governance/feature-flag-governance.md:72` | `ENV-REFERENCE.md` documents the compiled-routing flags | Zero occurrences there | Confirmed |
| F3-01 | P2 | both feature-flag-governance docs | Four cause codes | `compiled-route-status.cjs` assigns eight | Confirmed |
| F5-01 | P2 | `references/workflows/agent-io-contract.md:186` | `runtime//lib/deep-loop/post-dispatch-validate.ts` | Lives under system-deep-loop | Confirmed |
| F5-02 | P2 | `references/workflows/spec-folder-write-recipe.md:83` | `dist/spec-folder/backfill-graph-metadata.js` | `dist/graph/` | Confirmed |
| sweep | P1 | nine docs | 20 test files cited that no longer exist | Same-class inventory over every `tests/*.vitest.ts` citation; nine skill-advisor citations were correctly rooted and kept | Confirmed, widened |

## Verification pass: Claude Fable 5 high through the second account, read-only, against the closed program

| ID | Sev | Doc | Actual | Verdict |
|----|-----|-----|--------|---------|
| V-D1 | P1 | `references/validation/validation-rules.md:689,703` | Still said strict fails on warnings | Confirmed, fixed |
| V-D2 | P1 | `feature-catalog/doctor-commands/category-overview.md:3,19`, `feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:37,45` | Retired routes and mutation classes | Confirmed, fixed from `_routes.yaml` |
| V-D3 | P1 | `manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md:160` | `completion-state.test.mjs` never existed | Confirmed, repointed to the core module |
| V-D4 | P2 | `post-save-quality-review.md:55`, `dist-freshness-guard.md:29`, `spec-folder-description-discovery.md:110` | Step 10.5, wrong package id, wrong test root | Confirmed, fixed |
| V-D5 | P1 | `references/config/hook-system.md:23,46` | Omits the OpenCode spec-gate adapter and the Pi adapter family | Confirmed, fixed |
| V-D6 | P1 | `references/validation/path-scoped-rules.md:114,151` | Strict-mode claim, retired command name | Confirmed, fixed |
| V-D7 | P1 | `references/memory/embedder-pluggability.md:97,202,220` | `UNKNOWN_EMBEDDER` and `ram_mb`/`disk_mb` do not exist | Confirmed, fixed against `registry.ts` |
| V-D8 | P1 | `feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md:39,52,61` | Shim described as the script; wrong packet path | Confirmed, fixed |
| V-D9 | P2 | `feature-catalog/tooling-and-scripts/derived-packet-repair.md:64` | Wrong workflow file name | Confirmed, fixed |
| V-D10 | P1 | `manual-testing-playbook/tooling-and-scripts/validate-sh-dist-freshness-backstop.md:48,75-78` | Retired cache prefix; wrong message text | Confirmed, fixed |
| V-D11 | P1 | `manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md:51-54,192-193` | Stale counts; wrong expected command shape | Confirmed, fixed |
| V-D12 | P2 | `references/workflows/quick-reference.md:415`, `references/cli/shared-smart-router.md:139`, `references/workflows/execution-methods.md:217` | Option D, duplicate slug, twelve steps | Confirmed, fixed |
| V-D13 | P2 | `README.md:417-419` | Counts drifted after the deletions | Confirmed, recounted |
| V-D14 | P2 | `session-capturing-pipeline-quality-coverage.md:120-124` | Recorded output of a retired workspace names two test files | Fixed: the block now carries a note that it predates the CLI nesting and that the check gate passes today |
| V-D15 | P2 | `references/validation/validation-rules.md` | The harness remedy for symlinked dist directories was undocumented | Added: `NODE_OPTIONS` with both preserve-symlinks flags |
