# Iteration 1 — Survey of Recent Deep-Review + Deep-Research Updates

## Summary
Catalogued 32 patterns across 6 arcs (117-122) from 18 commits. Survey covered AI Council deliberation, deep-loop FULL_ISOLATE transition, deep-review fix-pack, deep-research uplift investigation, and follow-on hygiene fixes. Deep-agent-improvement skill read confirms it is an evaluator-first 5-dimension scoring system with iterative proposal/benchmark/promotion loop, packet-local candidates, and guarded promotion gates.

## Pattern Inventory

### P-001 — AI Council SPLIT ruling
- Arc: 117
- Type: ADJUDICATION-ITER
- Description: 4-seat AI Council (3 advocates + 1 adjudicator) ruled SPLIT on deep-loop core isolation via cli-codex gpt-5.5
- Evidence: commit 1e35680075, 117/ai-council/council-report.md
- Sibling applicability hint: agent-improvement-candidate

### P-002 — ADR-001 document
- Arc: 117
- Type: ADJUDICATION-ITER
- Description: ADR-001 documented pure runtime libs vs MCP handlers split decision with migration outline
- Evidence: commit 1e35680075, 117/decision-record.md
- Sibling applicability hint: bilateral

### P-003 — Scaffold phased arc
- Arc: 118
- Type: WORKFLOW-YAML
- Description: Phase parent + 8 child folders scaffolded via parallel markdown agents for FULL_ISOLATE_NO_MCP transition
- Evidence: commit bd77886d0a, 118/001-runtime-skill-scaffold/spec.md through 118/008-verification-changelog-closeout/spec.md
- Sibling applicability hint: unknown

### P-004 — Runtime skill scaffold
- Arc: 118
- Type: RUNTIME-RELOCATION
- Description: Created .opencode/skills/deep-loop-runtime/ with SKILL.md v0.1.0, README.md, and lib/scripts/storage/tests subfolders
- Evidence: commit 954702a8f4, .opencode/skills/deep-loop-runtime/SKILL.md:1-71
- Sibling applicability hint: agent-improvement-candidate

### P-005 — Lib migration
- Arc: 118
- Type: RUNTIME-RELOCATION
- Description: git-mv 13 lib .ts files (10 deep-loop + 3 coverage-graph) into deep-loop-runtime/lib/
- Evidence: commit 107c522599, lib/deep-loop/*.ts and lib/coverage-graph/*.ts moved
- Sibling applicability hint: bilateral

### P-006 — Script shims
- Arc: 118
- Type: SCRIPT-SHIM
- Description: 4 .cjs script entry points (convergence, upsert, query, status) replace MCP tool dispatch
- Evidence: commit 107c522599, deep-loop-runtime/scripts/*.cjs:1-353
- Sibling applicability hint: agent-improvement-candidate

### P-007 — DB relocation
- Arc: 118
- Type: RUNTIME-RELOCATION
- Description: deep-loop-graph.sqlite relocated to deep-loop-runtime/storage/ with ADR-001 documenting lifecycle transfer
- Evidence: commit 107c522599, deep-loop-runtime/storage/deep-loop-graph.sqlite
- Sibling applicability hint: bilateral

### P-008 — MCP tool surface removal
- Arc: 118
- Type: MCP-REMOVAL
- Description: Deleted 5 mcp_server/handlers/coverage-graph/*.ts; dropped 4 deep_loop_graph_* tool definitions
- Evidence: commit 107c522599, mcp_server/handlers/coverage-graph/ deleted, tool-schemas.ts:69 lines removed
- Sibling applicability hint: agent-improvement-candidate

### P-009 — YAML workflow update
- Arc: 118
- Type: WORKFLOW-YAML
- Description: 4 workflow YAMLs updated to invoke .cjs scripts via bash instead of MCP tool dispatch
- Evidence: commit 107c522599, spec_kit/assets/spec_kit_deep-{review,research}_{auto,confirm}.yaml:20 lines changed
- Sibling applicability hint: bilateral

### P-010 — Collateral updates
- Arc: 118
- Type: COLLATERAL
- Description: /doctor (3 files) + system-code-graph playbook updated to replace MCP tool references with script invocations
- Evidence: commit e590c12e19, .opencode/commands/doctor.md:8, doctor/_routes.yaml:13, system-code-graph/manual_testing_playbook/009-deep-loop-graph-convergence-yaml-fire.md:12
- Sibling applicability hint: bilateral

### P-011 — Test migration
- Arc: 118
- Type: TEST-MIGRATION
- Description: 13 unit tests + 4 Phase B integration fixtures moved to deep-loop-runtime/tests/{unit,integration,lifecycle}/
- Evidence: commit be2e777a4f, deep-loop-runtime/tests/ created with 22 test artifacts
- Sibling applicability hint: bilateral

### P-012 — sk-doc conformance
- Arc: 118
- Type: DOC-COMPLIANCE
- Description: SKILL.md DQI 74→95, README.md DQI 42→98 via required sections, numbered H2s, expanded content
- Evidence: commit 1a32678e7b, deep-loop-runtime/SKILL.md:202 lines added, README.md:183 lines added
- Sibling applicability hint: agent-improvement-candidate

### P-013 — Canonical companions
- Arc: 118
- Type: CANONICAL-COMPANIONS
- Description: feature_catalog (18 files), manual_testing_playbook (18 files), references (4 files), graph-metadata.json authored
- Evidence: commit 71042e1a33, deep-loop-runtime/feature_catalog/, manual_testing_playbook/, references/ created
- Sibling applicability hint: agent-improvement-candidate

### P-014 — Verification/closeout
- Arc: 118
- Type: VERSION-BUMP
- Description: deep-review v1.3.3.0→v1.4.0.0, deep-loop-runtime v0.1.0→v1.0.0 with changelogs
- Evidence: commit 14b40f23b3, deep-review/SKILL.md:2, deep-loop-runtime/SKILL.md:26, changelog/v1.4.0.0.md and v1.0.0.md
- Sibling applicability hint: bilateral

### P-015 — Deferred items closure
- Arc: 118
- Type: FIX-PACK
- Description: Stripped 4 historical MCP comments from scripts; restored 117 description.json keywords
- Evidence: commit d485837718, deep-loop-runtime/scripts/*.cjs:1 line removed each, 117/description.json:8 lines changed
- Sibling applicability hint: unknown

### P-016 — Deep-review iter-1 findings
- Arc: 118
- Type: FIX-PACK
- Description: 0 P0 / 2 P1 / 2 P2 findings on correctness + security via cli-devin SWE-1.6
- Evidence: commit f8f3bdcac6, 118/review/iterations/iteration-001.md:50
- Sibling applicability hint: review-only

### P-017 — Deep-review iter-2 findings
- Arc: 118
- Type: FIX-PACK
- Description: 0 P0 / 2 P1 / 3 P2 findings on traceability + maintainability via cli-devin SWE-1.6
- Evidence: commit f8f3bdcac6, 118/review/iterations/iteration-002.md:54
- Sibling applicability hint: review-only

### P-018 — Deep-review iters 3-10
- Arc: 118
- Type: ADJUDICATION-ITER
- Description: 10-iter deep-review with adjudication in iter-9; 13 P1 confirmed, 1 false-positive, 1 duplicate
- Evidence: commit aa593eb897, 118/review/iterations/iteration-009.md:107
- Sibling applicability hint: agent-improvement-candidate

### P-019 — Deep-review fix-pack
- Arc: 118
- Type: FIX-PACK
- Description: 20 of 27 findings fixed across 4 groups (docs accuracy, phase metadata, code hardening, ADR/changelog)
- Evidence: commit 56456514ce, deep-loop-runtime/references/state_format.md:30, scripts/_lib/cli-guards.cjs:131 added
- Sibling applicability hint: bilateral

### P-020 — Deep-research iter-1 catalog
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 47 changes catalogued, 11 types, 18 bilateral applicability via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-002.md:188
- Sibling applicability hint: research-only

### P-021 — Deep-research iter-2 mapping
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 3 APPLY P1 / 7 ADAPT / 10 SKIP / 27 ALREADY-DONE mapping via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-002.md:188
- Sibling applicability hint: research-only

### P-022 — Deep-research iter-3 bilateral verify
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 27/27 ALREADY-DONE confirmed via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-003.md:98
- Sibling applicability hint: research-only

### P-023 — Deep-research iter-4 DR-specific gaps
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 5 findings (DR-001..005) on DR-specific gaps via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-004.md:159
- Sibling applicability hint: research-only

### P-024 — Deep-research iter-5 adversarial code
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 3 findings (DR-006..008) including DR-006 lexical sort bug via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-005.md:36
- Sibling applicability hint: research-only

### P-025 — Deep-research iter-6 changelog accuracy
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 0 findings on changelog accuracy via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-006.md:33
- Sibling applicability hint: research-only

### P-026 — Deep-research iter-7 adjudication
- Arc: 119
- Type: ADJUDICATION-ITER
- Description: 11 P1s adjudicated: 2 CONFIRMED / 4 OUTDATED / 2 MISCATEGORIZED / 9 FALSE-POSITIVE via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-007.md:129
- Sibling applicability hint: agent-improvement-candidate

### P-027 — Deep-research iter-8 final devin adversarial
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 2 P1 + 3 P2 findings via cli-devin SWE-1.6
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-008.md:108
- Sibling applicability hint: research-only

### P-028 — Deep-research iter-9 cli-codex synthesis
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: 3-packet roadmap authored via cli-codex gpt-5.5 high fast
- Evidence: commit f02c9425c8, 119/003-uplift-recommendations/uplift-roadmap.md:108
- Sibling applicability hint: research-only

### P-029 — Deep-research iter-10 convergence claim
- Arc: 119
- Type: MIXED-EXECUTOR
- Description: Convergence claim test PASS hasAdvisories=true via cli-codex gpt-5.5
- Evidence: commit f02c9425c8, 119/research/iterations/iteration-010.md:75
- Sibling applicability hint: research-only

### P-030 — DR-006 numeric sort fix
- Arc: 120
- Type: NUMERIC-SORT-FIX
- Description: Replaced lexical .sort() with regex-based numeric comparator in reduce-state.cjs line ~874
- Evidence: commit d35834d321, deep-research/scripts/reduce-state.cjs:7, deep-research-reducer.vitest.ts:32 added
- Sibling applicability hint: agent-improvement-candidate

### P-031 — DR-003 uncovered questions
- Arc: 121
- Type: CONVERGENCE-TRANSPARENCY
- Description: Surfaces uncovered questions in dashboard for debugging stuck convergence at 85% threshold
- Evidence: commit 21a9a9ad73, deep-research/scripts/reduce-state.cjs:67, 2 unit tests added
- Sibling applicability hint: agent-improvement-candidate

### P-032 — DR-005 negative-knowledge dedup
- Arc: 122
- Type: CONTENT-HASH-DEDUP
- Description: reduce-state.cjs collapses duplicate ruledOut rows by content-hash preserving first-seen iter
- Evidence: commit 21a9a9ad73, deep-research/scripts/reduce-state.cjs:67
- Sibling applicability hint: agent-improvement-candidate

### P-033 — C-008 YAML script verification
- Arc: 122
- Type: YAML-SCRIPT-VERIFY
- Description: verify-yaml-script-paths.sh greps bash:node-invocation in 4 workflow YAMLs confirming .cjs exists
- Evidence: commit 21a9a9ad73, deep-research/scripts/verify-yaml-script-paths.sh:44
- Sibling applicability hint: bilateral

### P-034 — DR-008 SKILL.md pruning
- Arc: 122
- Type: FIX-PACK
- Description: Verified SKILL.md allowed-tools already clean (no deleted deep_loop_graph_* tools present)
- Evidence: commit 21a9a9ad73, 122/checklist.md:123
- Sibling applicability hint: bilateral

### P-035 — Folder rename
- Arc: 119+121+122
- Type: FOLDER-NAMING
- Description: 3 packet folders renamed for system-spec-kit naming compliance (NNN-short-name pattern)
- Evidence: commit 5fe6cc4c1e, 119-deep-research-uplift (24 chars), 121-deep-research-uncovered-questions (37), 122-deep-research-hygiene-fix-pack (33)
- Sibling applicability hint: unknown

### P-036 — Memory save metadata refresh
- Arc: 119
- Type: COLLATERAL
- Description: generate-context.js refreshed description.json + graph-metadata.json derived fields after rename
- Evidence: commit 156c514989, 119/description.json:10, graph-metadata.json:99
- Sibling applicability hint: unknown

## Type Distribution

| Type | Count | Agent-improvement-candidate count |
|------|-------|-----------------------------------|
| ADJUDICATION-ITER | 3 | 2 |
| RUNTIME-RELOCATION | 3 | 1 |
| SCRIPT-SHIM | 1 | 1 |
| WORKFLOW-YAML | 2 | 0 |
| COLLATERAL | 2 | 0 |
| TEST-MIGRATION | 1 | 0 |
| DOC-COMPLIANCE | 1 | 1 |
| CANONICAL-COMPANIONS | 1 | 1 |
| FIX-PACK | 5 | 0 |
| VERSION-BUMP | 1 | 0 |
| MIXED-EXECUTOR | 8 | 0 |
| MCP-REMOVAL | 1 | 1 |
| CONVERGENCE-TRANSPARENCY | 1 | 1 |
| FOLDER-NAMING | 1 | 0 |
| CONTENT-HASH-DEDUP | 1 | 1 |
| YAML-SCRIPT-VERIFY | 1 | 0 |
| NUMERIC-SORT-FIX | 1 | 1 |
| **Total** | **32** | **10** |

## Deep-Agent-Improvement Skill Read

Deep-agent-improvement is an evaluator-first bounded agent improvement system with 5-dimension dynamic scoring (structural integrity, rule coherence, integration consistency, output quality, system fitness). It operates as an iterative loop: INIT → PROPOSE → SCORE/BENCHMARK → REDUCE/DECIDE → PROMOTE. The workflow uses packet-local candidates under `{spec_folder}/improvement/candidates/`, deterministic benchmark runs, and guarded promotion gates requiring operator approval. Scoring profiles are generated on-the-fly from target agent files via `scripts/generate-profile.cjs`. The system includes mutation coverage tracking, trade-off detection, dimension trajectory analysis, and an append-only journal for audit trails. Current release supports single-lineage `new` mode sessions only; multi-generation resume/restart modes are planned but not yet wired.

## Next-Iter Suggestions

- Probe adjudication-iter patterns (P-001, P-002, P-018, P-026) for applicability to deep-agent-improvement's trade-off detector and promotion gates
- Investigate script-shim pattern (P-006) for potential benchmark materialization improvements
- Examine convergence-transparency (P-031) for dashboard rendering patterns applicable to improvement-session visibility
- Review content-hash-dedup (P-032) for mutation signature dedup (already implemented in deep-agent-improvement via packet 110 M-3)
- Assess numeric-sort-fix (P-030) for iteration file ordering in improvement sessions
- Map bilateral patterns (P-005, P-007, P-009, P-010, P-011, P-014, P-019, P-033) to determine if deep-agent-improvement has equivalent consumer surfaces

## Convergence Signal (self-report)

- newPatterns catalogued: 32
- coverage gate: PASS (all 18 commits surveyed)
