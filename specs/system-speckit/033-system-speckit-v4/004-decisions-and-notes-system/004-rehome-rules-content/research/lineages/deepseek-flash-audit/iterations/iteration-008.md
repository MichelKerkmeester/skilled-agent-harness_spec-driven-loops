---
title: "Iteration 8: Dedup + classification reconciliation — MASTER INVENTORY draft"
trigger_phrases: []
---
# Iteration 8: Dedup + classification reconciliation — MASTER INVENTORY draft

## Focus
Consolidate Iter 1-7 findings into ONE deduped inventory table (touchpoint | file:line | class [DONE|TODO|KEEP-AS-DOC|DELETE] | action). Dedup rule: one row per logical touchpoint; count-only tails merged; spec history excluded.

## Findings

### F8.1 MASTER INVENTORY (deduped; classes: DONE = already flipped by a1d2b84a1e, TODO = change needed, KEEP-AS-DOC = stays as unindexed doc, DELETE = remove)

#### A. CODE — search/pipeline
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| A1 | memory_search includeConstitutional default | handlers/memory-search.ts:1321 | DONE | default=false (committed); remove param at :686,1659,1715 when flag removed |
| A2 | memory_context includeConstitutional defaults | handlers/memory-context.ts:1192,1222 (+interfaces 96,134) | DONE | default=false (committed); remove param |
| A3 | vector-index-queries includeConstitutional default | lib/search/vector-index-queries.ts:409 | DONE | default=false (committed) |
| A4 | tool schemas includeConstitutional default:true | tool-schemas.ts:221-223 (context), 267-269 (search), 761 (index_scan) | TODO | flip default to false or remove property; **schema still advertises true** |
| A5 | memory-tools dispatch hardcodes true | tools/memory-tools.ts:81 | TODO | drop includeConstitutional:true |
| A6 | CLI scan hardcodes true | cli.ts:489 | TODO | drop |
| A7 | shadow-evaluation-runtime hardcodes true | lib/feedback/shadow-evaluation-runtime.ts:200 | TODO | drop |
| A8 | ACTIVE_POPULATION_SQL includes constitutional | lib/search/active-row-predicate.ts:56-63 | TODO | drop includeConstitutional:true at :61 (ACTIVE_ROW_SQL ranked lane :48-53 already false) |
| A9 | stage1 candidate-gen constitutional injection (3 paths) | lib/search/pipeline/stage1-candidate-gen.ts:30,847-859,1256,1300,1373-1472 | TODO | remove injection block + CONSTITUTIONAL_INJECT_LIMIT (:1399) + invariant comment :30 |
| A10 | vector-index-queries constitutional merge + tier branch | lib/search/vector-index-queries.ts:437-442,453-456,476-480,504,516-522 | TODO | remove constitutional_results path, tier='constitutional' branch, isConstitutional marking, get_constitutional_memories_public |
| A11 | vector-index-store get_constitutional_memories | lib/search/vector-index-store.ts:1963 (+1770-2048,2411) | TODO | remove function + cache + validation |
| A12 | importance-tiers constitutional tier | lib/scoring/importance-tiers.ts:21,34-42,181-183,259 | TODO | remove tier from union/config/getSearchableTiersFilter/DOC_TYPE_TIERS |
| A13 | shouldAlwaysSurface + getConstitutionalFilter (NO prod callers) | lib/scoring/importance-tiers.ts:194-197,206-208 | TODO | delete (test-only consumers) |
| A14 | formatters constitutionalCount | formatters/search-results.ts:997,1015-1016,1301-1303,1364,1381 | TODO | remove count + "(M constitutional)" summary |
| A15 | memory-search canonical source-kind 'constitutional' | handlers/memory-search.ts:205,348-349,391 | TODO | remove constitutional source kind + counter |
| A16 | retrieval-directives enrichment | lib/search/retrieval-directives.ts:6,28,43,210-336 | TODO | remove module (consumers: memory-surface.ts:346-348) |

#### B. CODE — surface hooks / prime / compaction
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| B1 | memory-surface constitutional cache + fetch | hooks/memory-surface.ts:33,82-84,155-187,229-234,322-323,346-348,429-456,555 | TODO | remove constitutional from AutoSurfaceResult + cache + getConstitutionalMemories + primePackage |
| B2 | compaction injection (LIVE) | hooks/claude/compact-inject.ts:231-242,410-427 | TODO | remove renderConstitutionalMemories + mergeInput.constitutional |
| B3 | context-server resume/compaction surface (LIVE) | context-server.ts:1066-1072,1975 | TODO | remove constitutional from autoSurfacedContext |
| B4 | session-prime cold-start (DEAD code) | hooks/claude/session-prime.ts:188-236 | TODO | docstring cleanup; no code path exists (already inert) |
| B5 | response-hints constitutional | hooks/response-hints.ts:12-123 | TODO | remove constitutional hint paths |
| B6 | mutation hooks constitutional cache clear | hooks/mutation-feedback.ts:11-60, handlers/mutation-hooks.ts:30,148,234 | TODO | remove constitutionalCacheCleared field |
| B7 | spec-memory CLI fallback includeConstitutional | hooks/spec-memory-cli-fallback.ts:74 | TODO | remove flag |

#### C. CODE — indexer / storage / governance
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| C1 | memory_index_scan include_constitutional default TRUE | handlers/memory-index.ts:216-219,259,481,624,759,791,1369,1374,1400-1404,1459-1460,1524-1529,1549,1635-1641,1829,2054,2174,2183 | TODO | flip default false or remove; remove findConstitutionalFiles + counters + warn-only path + error msg :1369 |
| C2 | checkpoint restore constitutional governance | lib/storage/checkpoints.ts:2289-2304 | TODO | remove TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH audit branch + isIndexableConstitutionalMemoryPath |
| C3 | memory_update constitutional guard | handlers/memory-crud-update.ts:90-140,268-274,540 + memory-crud-types.ts:99 + memory-crud-delete.ts:315 + memory-bulk-delete.ts:111-321 | TODO | remove E_CONSTITUTIONAL_SELF_EDIT + tier guard + bulk-delete constitutional protection |
| C4 | memory-save constitutional paths | handlers/memory-save.ts:283,482-492,3250-3306,4094; save/response-builder.ts:663,832; pe-gating.ts:68 | TODO | remove constitutional doc-type handling |
| C5 | storage helpers constitutional | lib/storage/post-insert-metadata.ts:91,110; document-helpers.ts:35,54; lineage-state.ts:537,1479; schema-downgrade.ts:135; index-scope.ts:247-259 | TODO | remove constitutional branches |
| C6 | scoring/decay/cognitive tier-aware paths | lib/scoring/composite-scoring.ts:188-251,666; confidence-tracker.ts:71,217,247; eval-metrics.ts:42-1100; fsrs-scheduler.ts:243-446; attention-decay.ts:39,58; tier-classifier.ts:187-188,499-500; memory-types.ts:113-454; type-inference.ts:60-344; memory-parser.ts:449-1204; hybrid-search.ts:1379,2654; graph-search-fn.ts:608-674; auto-promotion.ts:82; lexical-normalizer.ts:25-29; validation-metadata.ts:25,29; community-summaries.ts:23; scope-governance.ts:178-179,518; memory-retention-sweep.ts:209,271; recovery-hints.ts:232,235; vector-index-schema.ts:370-4044; vector-index-mutations.ts:36-940; pipeline/types.ts:320-430; stage4-filter.ts:355-356; orchestrator.ts:393,407; retrieval-rescue.ts:513; search-flags.ts:531 | TODO | remove constitutional tier handling (becomes inert) |
| C7 | learned-feedback (system C, dead) | lib/search/learned-feedback.ts:23,81-84,173-179; feedback/edge-tier-basement.ts:21-72; batch-learning.ts:63; feedback-retention-reducer.ts:15; handlers/memory-learned-maintenance.ts; ENV-REFERENCE.md:466 | KEEP | inventory-only; 0 rows; formal removal is a separate (C) decision; do NOT touch during (A) deprecation |

#### D. COMMANDS
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| D1 | /memory:learn command | .opencode/commands/memory/learn.md:2,9,13,22,34,44-48,54,58,61,80 | TODO | retire or repurpose to plain-doc authoring (owner: rules stay as plain docs) |
| D2 | learn-presentation.txt | assets/learn-presentation.txt:16,41,72,121 | TODO | rewrite/delete |
| D3 | /memory:manage tier + learned surface | manage.md:2,44-45,70-71,88,99,103 | TODO | remove constitutional tier rows; learned-expire/clear = KEEP (C) |
| D4 | manage-presentation.txt | assets/manage-presentation.txt:8,22,48,71,115,149-183,197,215 | TODO | remove constitutional rows from tier distribution + protected list |
| D5 | /memory:search presentation | search.md:159; assets/search-presentation.txt:12,135-137,160,167 | TODO | remove constitutional display contract + forbidden-vocab rules |
| D6 | /memory:save + memory README | save.md:92; memory/README.txt:3,38,60,80-84,141,144,305,323; commands/README.txt:201 | TODO | rewrite prose; FAQ:305 + troubleshooting:323 retarget |
| D7 | speckit YAML tier_reference ladders (6) | speckit-plan-{confirm,auto}.yaml:760/698; implement-{confirm,auto}:632/603; complete-{confirm,auto}:1141/1180 | TODO | drop 'constitutional' from ladder |
| D8 | create YAML tier_reference blocks (5) | create-readme-{confirm,auto}.yaml:695,1242/695,1150; create-command-auto.yaml:590; create-agent-{confirm,auto}.yaml:726/630 | TODO | drop constitutional line |

#### E. TESTS (named; tail in E-tail)
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| E1 | gate-d-regression-constitutional-memory | tests/gate-d-regression-constitutional-memory.vitest.ts:120-267 | TODO | delete or invert (no constitutional rows/injection; discovery gone) |
| E2 | constitutional-filtering | tests/constitutional-filtering.vitest.ts:37-78 | TODO | delete with wrapper |
| E3 | token-budget-constitutional-sync | tests/token-budget-constitutional-sync.vitest.ts:99-140+ | TODO | rewrite without pin/constitutionalCount or delete |
| E4 | scoring-gaps (shouldAlwaysSurface/getConstitutionalFilter) | tests/scoring-gaps.vitest.ts:201-254 | TODO | remove those sections |
| E5 | memory-crud-update-constitutional-guard | tests/memory-crud-update-constitutional-guard.vitest.ts:153-341+ | TODO | rewrite without tier guard; keep source_kind protection tests |
| E6 | retrieval-directives | tests/retrieval-directives.vitest.ts:57-260+ | TODO | delete with module |
| E7 | stage1 tests incl. includeConstitutional:true | stage1-expansion:524; stage1-embedder-degrade:150; stage1-llm-reformulation-trace:91; spec-folder-prefilter:358; retrieval-level:251 | TODO | remove flag/injection assertions |
| E8 | memory-learn-command-docs | scripts/tests/memory-learn-command-docs.vitest.ts:16-58 | TODO | invert/delete (constitutional wording must disappear) |
| E9 | tail ~85 more files (661 constitutional matches) | tests/*.vitest.ts (per-file counts in Iter 3 F3.8) | TODO | no constitutional fixtures/asserts; tier union/schema/decay/surface tests updated |

#### F. DOCS — skill/readme/playbook
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| F1 | render.ts hardcoded directives (enforcement) | system-skill-advisor/mcp-server/lib/render.ts:105,112,117,121,444,452,459 | KEEP | enforcement stays; only docstring :457 ("constitutional context") rename |
| F2 | injection-contract.md stale cold-start claim | .opencode/hooks/injection-contract.md:195-199 (+65-67 accurate) | TODO | rewrite Session Start Context section |
| F3 | system-spec-kit SKILL.md | SKILL.md:8 (keyword), :94 (non-routable) | TODO | drop keyword; adjust exclusion note |
| F4 | mcp-server READMEs | mcp-server/README.md:109; INSTALL-GUIDE.md:5,705,854; hooks/README.md:71,93; lib/search/README.md:178,180; lib/scoring/README.md:21; lib/utils/README.md:59,85-91; core/README.md:24,71; handlers/README.md:119,124,188; schemas/README.md:71,124; tests/README.md:87; scripts/README.md:57; scripts/migrations/README.md:30 | TODO | rewrite/remove constitutional mentions |
| F5 | feature-catalog (47 lines) | feature-catalog/feature-catalog.md:105,107,223,379,383,395,495,557,705,715,816,886,1224,1248,1356,2054,3016-3020,3093-4588 | TODO | rewrite to post-deprecation behavior |
| F6 | memory-system.md (17) | references/memory/memory-system.md:36,54,69,96,146,163,189,207,235-236,258,393,487,502,509-514,645 | TODO | full rewrite without tier |
| F7 | other references | trigger-config.md:110-180; save-workflow.md:367,370,559; troubleshooting.md:65-375; quick-reference.md:119; README.md:461,598 | TODO | remove/rewrite |
| F8 | manual-testing playbooks (10+) | passive-context-enrichment.md:3-233; constitutional-memory-manager-command.md; constitutional-memory-as-expert-knowledge-injection-pi-a4.md; constitutional-sufficiency-gate-exemption.md; dual-scope-memory-auto-surface-tm-05.md; memory-manage-command-routing.md:98-259; + ~12 more 1-6 match files | TODO | re-verify/rewrite scenarios to post-deprecation behavior; mark obsolete |
| F9 | changelogs + benchmarks | changelog/v3.6.0.0.md:95,211; v3.7.0.0.md:72,334; benchmarks/* | KEEP | history, do not rewrite |
| F10 | advisor other (skill_advisor.py:2001 etc.) | system-skill-advisor skill_advisor.py:2001; doc-frontmatter.ts:30; check-skill-doc-frontmatter.mjs:15,30; feature-catalog doc-frontmatter-harvest.md:24; tests (2) | TODO | verify wording in Iter 10; likely keyword/comment only |

#### G. ROOT DOCS
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| G1 | 18 load-bearing links (6 files x 3 docs) | CLAUDE.md:41,71,72,90,116,363; AGENTS.md:41,71,72,90,116,363; BARTER.md:59,89,90,108,134,357 | TODO | retarget to rehomed long-form locations (or drop where inline text complete) |
| G2 | README.md (4) | README.md:403,475,781,978 | TODO | rewrite to post-deprecation |
| G3 | .claude/CLAUDE.md, CONTRIBUTING.md, PUBLIC-RELEASE.md, .opencode/README.md, .cursor/rules | — | DONE (clean) | no action |
| G4 | spec history (~420 raw refs) | specs/** | KEEP | do NOT rewrite |

#### H. THE FOLDER + DB
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| H1 | 6 fully-inlined rule files | comment-hygiene, cli-dispatch-skill-preload, finding-is-a-hypothesis, main-branch-direct-push, regression-baseline-and-delta, gate-tool-routing | DELETE | after pointer retarget |
| H2 | 2 partial-inline rule files | deep-skill-workflow-required, recursion-control | DELETE/KEEP-AS-DOC | rehome 2-line essence then delete, or keep unindexed |
| H3 | 11 unique-content rule files | gate-enforcement, automated-writers, entity-cooccurrence, bash-output-truncation, fable-governor, fable-subagent-model-policy, goal-prompting, post-implementation-deep-review, recorded-failure-must-route, spec-folder-naming, verify-before-completion-claims | KEEP-AS-DOC or REHOME | rehome unique long-forms into root docs, or keep as unindexed reference docs |
| H4 | memory-system-spec-kit-only.md | (44L) | KEEP | owner direction; native-memory ban intact; unindexed reference doc |
| H5 | constitutional/README.md | (237L) | DELETE | with layer (or rewrite as plain-docs index) |
| H6 | DB 21 constitutional rows | context-index.sqlite (20 rules + README) | DELETE | delete rows + vectors + projections + FTS; AFTER C1/A4/A6 flip |
| H7 | learned_triggers (0 rows) | context-index.sqlite | KEEP | system C; out of scope |

### F8.2 Dedup notes
- A10/A11 are one logical unit (constitutional query path across queries+store).
- A14/A15/E3 are one envelope unit (constitutionalCount flows from isConstitutional through formatter to envelope test).
- B1/B2/B3 are one surface unit (auto-surface machinery across memory-surface/compact-inject/context-server).
- H1-H5 folder decisions drive G1 retargets and H6 DB delete.
- Count-only tails (C6 ~30 files, E9 ~85 files) are aggregated per file with grep-count evidence; each file needs a mechanical sweep during implementation, not per-line analysis here.

## Sources Consulted
- Iter 1-7 iteration files (this lineage), per-file grep counts

## Assessment
- newInfoRatio: 0.5 — consolidation; dedup reduces ~120 raw touchpoints to 52 inventory rows.
- Novelty justification: first deduped view; unit-grouping and class assignment complete.
- Confidence: high for named rows; aggregated rows carry count evidence only.

## Reflection
- Worked: class-first grouping (DONE/TODO/KEEP/DELETE) mirrors the deliverable shape.
- Ruled out: per-file line-level detail for aggregated tails — implementation sweep will surface strays.

## Recommended Next Focus
Iter 9: Consumers/breakage analysis + ranked deprecation checklist + load-bearing retarget set + dist rebuild/daemon note.
