# Constitutional-Memory DEPRECATION-COMPLETENESS Audit — Final Research Synthesis

**Lineage:** `deepseek-flash-audit` (cli-devin, deepseek-v4-flash-max) · session `fanout-deepseek-flash-audit-1787763040724-qklgls`
**Spec target:** `specs/system-speckit/037-decisions-memory-redesign/004-rehome-rules-content`
**Loop:** 10 iterations, max-iterations stop policy (convergence treated as telemetry; angles broadened each round)
**Status:** COMPLETE — inventory, checklist, retarget set, assertions, consumers, dist/daemon note all produced.

---

## 1. EXECUTIVE VERDICT

The constitutional-memory layer is **decorative but deeply wired**: 61 deduped touchpoints across code, commands, tests, docs, the folder, and the DB. Enforcement never lived in the rule files — it lives in the hardcoded directive capsule in `system-skill-advisor/mcp-server/lib/render.ts` (which STAYS) and in the hooks/classifiers (which STAY). The committed search flip (a1d2b84a1e) covered 3 of ~7 `includeConstitutional` default/hardcode sites; **4 production sites still pass `true`** (tools/memory-tools.ts:81, cli.ts:489, shadow-evaluation-runtime.ts:200, active-row-predicate.ts:61), **3 tool-schema defaults still say `true`** (tool-schemas.ts:221,267,761), the **indexer still defaults `include_constitutional = true`** (memory-index.ts:624), and the **compiled dist is mixed** (search flip present, indexer flip absent) — so the committed change has **no runtime effect until dist is rebuilt and the daemon restarted**. The 21 DB rows are exactly the 20 rule files + folder README, all in `spec_folder='system-spec-kit'`; learned-triggers confirmed 0 rows (system C, out of scope).

---

## 2. DEDUPED INVENTORY (touchpoint | file:line | class | action)

Classes: **DONE** = already flipped (a1d2b84a1e) · **TODO** = change required · **KEEP** = stays (enforcement/history/out-of-scope) · **KEEP-AS-DOC** = stays as unindexed plain doc · **DELETE** = remove.

### A. CODE — search & pipeline
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| A1 | memory_search includeConstitutional default | handlers/memory-search.ts:1321 (decl 686,1659,1715) | DONE | default false committed; remove param when flag removed |
| A2 | memory_context includeConstitutional defaults | handlers/memory-context.ts:1192,1222 (decl 96,134) | DONE | default false committed |
| A3 | vector-index-queries includeConstitutional default | lib/search/vector-index-queries.ts:409 | DONE | default false committed |
| A4 | **Tool schemas still default TRUE** | tool-schemas.ts:221-223 (context), 267-269 (search), 761 (index_scan) | TODO | flip to false or remove property; schema layer contradicts committed flip |
| A5 | memory-tools dispatch hardcodes TRUE | tools/memory-tools.ts:81 | TODO | drop `includeConstitutional: true` |
| A6 | CLI scan hardcodes TRUE | cli.ts:489 | TODO | drop |
| A7 | shadow-evaluation feedback search TRUE | lib/feedback/shadow-evaluation-runtime.ts:200 | TODO | drop |
| A8 | ACTIVE_POPULATION_SQL includes constitutional | lib/search/active-row-predicate.ts:56-63 (ranked lane :48-53 already false) | TODO | drop include at :61; remove lane type :7,44-46,71-73 |
| A9 | stage1 candidate-gen injection (3 paths + limit) | lib/search/pipeline/stage1-candidate-gen.ts:30,683,847-859,1256,1300,1373-1472, CONSTITUTIONAL_INJECT_LIMIT :1399 | TODO | remove injection block + invariant comment |
| A10 | vector-index-queries constitutional merge/tier branch | lib/search/vector-index-queries.ts:437-442,453-456,476-480,504,516-522 | TODO | remove constitutional_results path + tier branch + isConstitutional + public wrapper |
| A11 | vector-index-store get_constitutional_memories | lib/search/vector-index-store.ts:1963 (+1770-2048,2411) | TODO | remove function + cache + validation |
| A12 | importance-tiers constitutional tier | lib/scoring/importance-tiers.ts:21,34-42,181-183,259 | TODO | remove tier from union/config/filter/DOC_TYPE_TIERS |
| A13 | shouldAlwaysSurface + getConstitutionalFilter (NO prod callers) | lib/scoring/importance-tiers.ts:194-197,206-208 | TODO | delete (test-only consumers) |
| A14 | formatters constitutionalCount | formatters/search-results.ts:997,1015-1016,1301-1303,1364,1381 | TODO | remove count + "(M constitutional)" summary |
| A15 | canonical source-kind 'constitutional' | handlers/memory-search.ts:205,348-349,391 | TODO | remove kind + counter |
| A16 | retrieval-directives enrichment | lib/search/retrieval-directives.ts:6,28,43,210-336 | TODO | remove module (consumer memory-surface.ts:346-348) |

### B. CODE — surface hooks / prime / compaction
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| B1 | memory-surface constitutional cache/fetch/prime | hooks/memory-surface.ts:33,82-84,155-187,229-234,322-323,346-348,429-456,555 | TODO | remove constitutional from AutoSurfaceResult/cache/prime/enrich |
| B2 | compaction injection (LIVE) | hooks/claude/compact-inject.ts:231-242,410-427 | TODO | remove renderConstitutionalMemories + mergeInput.constitutional |
| B3 | context-server resume/compaction surface (LIVE) | context-server.ts:1066-1072,1975 | TODO | remove constitutional from autoSurfacedContext |
| B4 | session-prime cold-start (DEAD code — docstring only) | hooks/claude/session-prime.ts:188-236 | TODO | fix stale docstring; no code path exists |
| B5 | response-hints constitutional | hooks/response-hints.ts:12-123 | TODO | remove constitutional hint paths |
| B6 | mutation hooks constitutionalCacheCleared | hooks/mutation-feedback.ts:11-60; handlers/mutation-hooks.ts:30,148,234 | TODO | remove field |
| B7 | spec-memory CLI fallback flag | hooks/spec-memory-cli-fallback.ts:74 | TODO | remove |

### C. CODE — indexer / storage / governance / config
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| C1 | **indexer defaults include_constitutional TRUE** | handlers/memory-index.ts:216-219,259,481,**624**,759,791,1369,1374,1400-1404,1459-1460,1524-1529,1549,1635-1641,1829,2054,2174,2183 | TODO | flip default false; remove findConstitutionalFiles + counters + warn-only + error msg |
| C2 | checkpoint restore constitutional governance | lib/storage/checkpoints.ts:2289-2304 | TODO | remove TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH branch |
| C3 | memory_update/delete/bulk-delete constitutional guard | handlers/memory-crud-update.ts:90-140,268-274,540; memory-crud-types.ts:99; memory-crud-delete.ts:315; memory-bulk-delete.ts:111-321 | TODO | remove E_CONSTITUTIONAL_SELF_EDIT + tier guard + bulk-delete protection |
| C4 | memory-save constitutional paths | handlers/memory-save.ts:283,482-492,3250-3306,4094; save/response-builder.ts:663,832; pe-gating.ts:68 | TODO | remove doc-type handling |
| C5 | storage helpers | lib/storage/post-insert-metadata.ts:91,110; document-helpers.ts:35,54; lineage-state.ts:537,1479; schema-downgrade.ts:135; lib/utils/index-scope.ts:247-259 (exported api/index.ts:94) | TODO | remove constitutional branches |
| C6 | scoring/decay/cognitive tier-aware paths (~30 files) | composite-scoring.ts:188-251,666; confidence-tracker.ts:71,217,247; eval-metrics.ts:42-1100; fsrs-scheduler.ts:243-446; attention-decay.ts:39,58; tier-classifier.ts:187-188,499-500; memory-types.ts:113-454; type-inference.ts:60-344; memory-parser.ts:449-1204; hybrid-search.ts:1379,2654; graph-search-fn.ts:608-674; auto-promotion.ts:82; lexical-normalizer.ts:25-29; validation-metadata.ts:25,29; community-summaries.ts:23; scope-governance.ts:178-179,518; memory-retention-sweep.ts:209,271; recovery-hints.ts:232,235; vector-index-schema.ts:370-4044; vector-index-mutations.ts:36-940; pipeline/types.ts:320-430; stage4-filter.ts:355-356; orchestrator.ts:393,407; rerank/retrieval-rescue.ts:513; search-flags.ts:531 | TODO | remove constitutional tier handling (mechanical sweep; count-verified) |
| C7 | api layer | api/indexing.ts:29,117,131; api/index.ts:94 | TODO | remove flag + export |
| C8 | channel weights config | configs/search-weights.json:17 (`"constitutional": 2.0`) | TODO | remove channel |
| C9 | Zod schemas (second schema surface) | schemas/tool-input-schemas.ts:124 ('constitutional' enum), 179,202,513 (includeConstitutional), 638,639,666 (ALLOWED lists) | TODO | remove tier + params |
| C10 | budget allocator constitutional source (700) | shared/budget-allocator.d.ts:20,26 (source under lib/; tests budget-allocator.vitest.ts) | TODO | remove constitutional budget source |
| C11 | learned-feedback (system C, 0 rows) | lib/search/learned-feedback.ts:23,81-84,173-179; lib/feedback/edge-tier-basement.ts:21-72; batch-learning.ts:63; feedback-retention-reducer.ts:15; handlers/memory-learned-maintenance.ts; ENV-REFERENCE.md:466 | KEEP | inventory-only; separate (C) decision; do NOT touch during (A) |
| C12 | stress-test | stress-test/memory/gate-d-benchmark-memory-search.vitest.ts:57,72; durability/embedder-degrade-recall-flood-stress.vitest.ts:31,86 | TODO | update fixtures |

### D. COMMANDS
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| D1 | /memory:learn (authoring command) | commands/memory/learn.md:2,9,13,22,34,44-48,54,58,61,80 | TODO | retire or repurpose to plain-doc authoring |
| D2 | learn-presentation.txt | commands/memory/assets/learn-presentation.txt:16,41,72,121 | TODO | rewrite/delete |
| D3 | /memory:manage tier + learned surface | manage.md:2,44-45,70-71,88,99,103 | TODO | strip constitutional tier rows; learned-expire/clear = KEEP (C) |
| D4 | manage-presentation.txt | assets/manage-presentation.txt:8,22,48,71,115,149-183,197,215 | TODO | remove constitutional rows from tier distribution/protected list |
| D5 | /memory:search presentation contract | search.md:159; assets/search-presentation.txt:12,135-137,160,167 | TODO | remove constitutional display contract + forbidden-vocab |
| D6 | /memory:save + memory READMEs | save.md:92; memory/README.txt:3,38,60,80-84,141,144,305,323; commands/README.txt:201 | TODO | rewrite prose; FAQ :305 + troubleshooting :323 retarget |
| D7 | speckit YAML tier_reference ladders (6) | speckit-plan-{confirm,auto}.yaml:760/698; implement-{confirm,auto}:632/603; complete-{confirm,auto}:1141/1180 | TODO | drop 'constitutional' from ladder |
| D8 | create YAML tier_reference blocks (5) | create-readme-{confirm,auto}.yaml:695,1242/695,1150; create-command-auto.yaml:590; create-agent-{confirm,auto}.yaml:726/630 | TODO | drop constitutional line |

### E. TESTS (named suites + tail)
| # | Touchpoint | file:line | Class | Action (post-deprecation must-assert) |
|---|---|---|---|---|
| E1 | gate-d-regression-constitutional-memory | tests/gate-d-regression-constitutional-memory.vitest.ts:120-267 | TODO | delete or invert: no constitutional rows; constitutionalInjected:0; discovery gone; no importanceTier: constitutional frontmatter |
| E2 | constitutional-filtering | tests/constitutional-filtering.vitest.ts:37-78 | TODO | delete with getConstitutionalMemories wrapper |
| E3 | token-budget-constitutional-sync | tests/token-budget-constitutional-sync.vitest.ts:99-140+ | TODO | rewrite without constitutional pin; constitutionalCount always 0 or removed; summary without "(M constitutional)" |
| E4 | scoring-gaps (shouldAlwaysSurface/getConstitutionalFilter) | tests/scoring-gaps.vitest.ts:201-254 | TODO | remove those describe blocks with the helpers |
| E5 | memory-crud-update-constitutional-guard | tests/memory-crud-update-constitutional-guard.vitest.ts:153-341+ | TODO | rewrite: no constitutional tier accepted; E_CONSTITUTIONAL_SELF_EDIT + tier_downgrade audit gone; keep source_kind protection tests |
| E6 | retrieval-directives | tests/retrieval-directives.vitest.ts:57-260+ | TODO | delete with module (T14 "constitutional memory" fallback gone) |
| E7 | stage1 tests with includeConstitutional:true | stage1-expansion.vitest.ts:524; stage1-embedder-degrade.vitest.ts:150; stage1-llm-reformulation-trace.vitest.ts:91; spec-folder-prefilter.vitest.ts:358; retrieval-level.vitest.ts:251 | TODO | no flag; no always-surface injection assertion; degraded-embedder asserts plain lexical fallback |
| E8 | memory-learn-command-docs | scripts/tests/memory-learn-command-docs.vitest.ts:16-58 | TODO | invert/delete: docs must NOT claim constitutional memory management |
| E9 | tail (~85 files, 661 matches) | tests/*.vitest.ts (counts in Iter 3 F3.8; incl. orphan-sweep:13, handler-memory-index*:6-10, context-server:19, importance-tiers:10, tier-classifier:10, decay:11, active-row-predicate:8, eval-metrics:18, learned-feedback:2) | TODO | no constitutional fixtures/asserts; tier union/schema/decay/surface tests updated; learned tests unchanged (C) |

### F. DOCS — skill/readme/hook/advisor/playbook
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| F1 | **render.ts hardcoded directives (enforcement)** | system-skill-advisor/mcp-server/lib/render.ts:105,112,117,121,444,452,459 | KEEP | enforcement stays; only docstring :457 ("constitutional context") rename |
| F2 | injection-contract.md STALE cold-start claim | .opencode/hooks/injection-contract.md:195-199 (65-67 accurate) | TODO | rewrite §4 Session Start Context |
| F3 | system-spec-kit SKILL.md | SKILL.md:8 ('constitutional-tier' keyword), :94 (non-routable note) | TODO | drop keyword; adjust note |
| F4 | mcp-server READMEs (~13 files) | README.md:109; INSTALL-GUIDE.md:5,705,854; hooks/README.md:71,93; lib/search/README.md:178,180; lib/scoring/README.md:21; lib/utils/README.md:59,85-91; core/README.md:24,71; handlers/README.md:119,124,188; schemas/README.md:71,124; tests/README.md:87; scripts/README.md:57; scripts/migrations/README.md:30 | TODO | rewrite/remove mentions |
| F5 | feature-catalog (47 lines) | feature-catalog/feature-catalog.md:105,107,223,379,383,395,495,557,705,715,816,886,1224,1248,1356,2054,3016-3020,3093-4588 | TODO | rewrite to post-deprecation behavior |
| F6 | memory-system.md (17) | references/memory/memory-system.md:36,54,69,96,146,163,189,207,235-236,258,393,487,502,509-514,645 | TODO | full rewrite without tier |
| F7 | other references | trigger-config.md:110-180; save-workflow.md:367,370,559; troubleshooting.md:65-375; quick-reference.md:119; README.md:461,598 | TODO | remove/rewrite |
| F8 | manual-testing playbooks (10+) | passive-context-enrichment.md:3-233; constitutional-memory-manager-command.md (27); constitutional-memory-as-expert-knowledge-injection-pi-a4.md (33); constitutional-sufficiency-gate-exemption.md (15); dual-scope-memory-auto-surface-tm-05.md (3); memory-manage-command-routing.md:98-259; + ~12 more | TODO | re-verify/rewrite scenarios; PASS records (:233) document pre-deprecation behavior |
| F9 | changelogs + benchmarks | changelog/v3.6.0.0.md:95,211; v3.7.0.0.md:72,334; benchmarks/*; cli-claude-code benchmark docs | KEEP | history; do not rewrite |
| F10 | advisor keyword map + other advisor surfaces | skill_advisor.py:2001 ("constitutional memory" → system-spec-kit 1.7); doc-frontmatter.ts:30; check-skill-doc-frontmatter.mjs:15,30; feature-catalog doc-frontmatter-harvest.md:24; changelog v0.8.0.md:17 | TODO | remove keyword entry; verify wording |
| F11 | session-lifecycle doc | .opencode/hooks/session-lifecycle/README.md:42 | TODO | rewrite PreCompact 3-source merge description |
| F12 | .spec-gate-state links | .opencode/skills/.spec-gate-state/README.md:21,109 (→ gate-enforcement.md) | KEEP | valid while gate-enforcement stays as unindexed doc |

### G. ROOT DOCS
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| G1 | **18 load-bearing links (6 files x 3 docs)** | CLAUDE.md:41,71,72,90,116,363; AGENTS.md:41,71,72,90,116,363; BARTER.md:59,89,90,108,134,357 | TODO | retarget per §4 (Option 1 = zero-move; Option 2 = rehome anchors) |
| G2 | root README.md (4) | README.md:403,475,781,978 | TODO | rewrite |
| G3 | .claude/CLAUDE.md, CONTRIBUTING.md, PUBLIC-RELEASE.md, .opencode/README.md, .cursor/rules, .pi/, .codex/ | — | DONE | clean; no action |
| G4 | spec history (~420 raw refs) | specs/** | KEEP | do NOT rewrite |

### H. THE FOLDER + DB
| # | Touchpoint | file:line | Class | Action |
|---|---|---|---|---|
| H1 | 6 fully-inlined rule files | comment-hygiene (76L), cli-dispatch-skill-preload (63L), finding-is-a-hypothesis (33L), main-branch-direct-push (34L), regression-baseline-and-delta (33L), gate-tool-routing (78L) | DELETE | after pointer retarget (content inline at G1 lines) |
| H2 | 2 partial-inline rule files | deep-skill-workflow-required (63L), recursion-control (33L) | DELETE / KEEP-AS-DOC | rehome 2-line essence, then delete — or keep unindexed |
| H3 | 11 unique-content rule files | gate-enforcement (122L), automated-writers-never-overwrite-manual (31L), entity-cooccurrence-is-not-causal (31L), bash-output-truncation-verdict-visibility (36L), fable-governor (34L), fable-subagent-model-policy (32L), goal-prompting-runtime-specific (96L), post-implementation-deep-review (83L), recorded-failure-must-route (33L), spec-folder-naming (39L), verify-before-completion-claims (35L) | KEEP-AS-DOC or REHOME | rehome unique long-forms into root docs, or keep as unindexed reference docs (strip tier frontmatter) |
| H4 | **memory-system-spec-kit-only.md** (44L) | — | **KEEP** | owner direction; native-memory ban intact; unindexed reference doc |
| H5 | constitutional/README.md (237L) | folder README (incl. :199,202 includeConstitutional) | DELETE | with layer (or rewrite as plain-docs index) |
| H6 | **DB: 21 constitutional rows** | context-index.sqlite (20 rules + README; spec_folder='system-spec-kit'; 20/21 in active projection) | DELETE | delete rows + vectors + projections + FTS; AFTER C1/A4/A6 so the indexer can't resurrect them |
| H7 | learned_triggers (0 rows) | context-index.sqlite | KEEP | system C; out of scope |

---

## 3. RANKED DEPRECATION CHECKLIST

Constraints honored: enforcement stays in hooks/render.ts · KEEP memory-system-spec-kit-only · KEEP continuity (spec-folder + memory MCP) · no new DECISIONS.md surface.

1. **Search-surface flags** — flip schema defaults (A4) + drop hardcoded `true` at A5, A6, A7, A8.
2. **Indexer** — flip `include_constitutional` default false + remove discovery/counters/warn-only/error text (C1) + F4 README line. **Must precede step 3.**
3. **DB** — delete the 21 constitutional rows + vector embeddings + active_memory_projection + FTS entries (H6).
4. **Pipeline/query machinery** — stage1 injection block + limit (A9); merge path + tier branch + wrappers (A10, A11).
5. **Tier config** — union/config/filter/DOC_TYPE_TIERS + dead helpers (A12, A13).
6. **Surface hooks** — memory-surface/compact-inject/context-server/response-hints/mutation-feedback/session-prime docstring (B1-B7).
7. **Formatters/envelope** — constitutionalCount + summary + canonical source-kind (A14, A15).
8. **Guards/audits** — memory_update guard + E_CONSTITUTIONAL_SELF_EDIT + checkpoint audit + bulk-delete protection + storage helpers (C2-C5) + api/config/schema surfaces (C7-C10).
9. **Commands** — retire/repurpose /memory:learn (D1, D2); strip tier rows from manage (D3, D4); search presentation (D5); README prose (D6); YAML tier_reference ladders (D7, D8).
10. **Tests** — per E1-E9 must-assert contracts.
11. **Docs** — F1 (docstring only), F2, F3, F4-F8, F10, F11, G2.
12. **Folder** — H1/H2 delete, H3 strip-frontmatter-and-keep or rehome, H4 KEEP, H5 delete/rewrite README.
13. **Root-doc links** — retarget the 18 links (G1) per §4.
14. **Rebuild + restart + verify** — rebuild `mcp-server/dist`; restart the spec-memory daemon; run the post-deprecation gate; live-verify a search returns zero constitutional rows.

---

## 4. LOAD-BEARING LINK RETARGET SET (exact)

| Rule file | Link sites | Retarget |
|---|---|---|
| comment-hygiene.md | CLAUDE:41, AGENTS:41, BARTER:59 | Option 1: keep folder as unindexed reference docs → links stay valid (no edit). Option 2 (folder deleted): drop the pointer (rule text is fully inline) or anchor to the rehomed section. |
| regression-baseline-and-delta.md | CLAUDE:71, AGENTS:71, BARTER:89 | same |
| finding-is-a-hypothesis.md | CLAUDE:72, AGENTS:72, BARTER:90 | same |
| main-branch-direct-push.md | CLAUDE:90, AGENTS:90, BARTER:108 | same |
| cli-dispatch-skill-preload.md | CLAUDE:116, AGENTS:116, BARTER:134 | same; also mirrored by cli-external-orchestration/SKILL.md (already exists) |
| gate-tool-routing.md | CLAUDE:363, AGENTS:363, BARTER:357 (short path) | same; decision tree is inline at CLAUDE:363 |

**Recommendation: Option 1** — keep the folder as the unindexed reference-docs home for the KEEP-AS-DOC files (H3 + H4), strip `importanceTier: constitutional` frontmatter, stop indexing it (C1). Zero link churn, no new surface, owner constraint "keep a few as unindexed reference docs" satisfied. Delete only the 8 fully-inlined files (H1 + H2).

---

## 5. POST-DEPRECATION ASSERTIONS (per constitutional/learned test)

Locked in Iter 10 F10.10; named-suite details in Iter 3. Summary:
1. Zero `includeConstitutional` in production code/schemas/configs (grep assert).
2. Zero `importance_tier = 'constitutional'` production paths; DB count = 0.
3. E1/E2/E6 deleted or inverted; E3 rewritten without pin; E4 sections removed; E5 without tier guard; E7 without injection; E8 inverted (no constitutional claims in command docs).
4. Live search envelope has no constitutionalCount/isConstitutional; summary without "(M constitutional)".
5. Index scan reports no constitutional stats; folder not indexed.
6. render.ts directive capsule byte-identical (enforcement intact).
7. learned-trigger tests unchanged (system C untouched).

---

## 6. CONSUMERS — steering loss / breakage

**Steering: NO loss.** The every-turn directives (hygiene/governor/terminal-proof) are hardcoded in render.ts:105,112,117 and delivered via :444,452,459 — independent of the constitutional layer; rule content is inline in the root docs. The only removed steering is the decorative compaction auto-surface of constitutional rows (duplicate of root-doc content).

**Breakage map** (paired-change table in Iter 9 F9.2): /memory:learn (retire), context-server envelope shape (tests), formatters envelope (presentation + E3), memory-crud guard (E5), checkpoint governance audit (C2 tests), bulk-delete protection, active-row-predicate lane, eval-metrics channels, DB rows (indexer-flip-first), daemon/CLI dist (exit 69 until rebuild), index-scan status displays, feature-catalog/memory-system/playbook docs. Safe-by-design: unknown-param-tolerant schemas (ALLOW_UNKNOWN_PARAMETERS) mean leftover callers of removed flags fail silently, not loudly.

---

## 7. DIST REBUILD + DAEMON RESTART (required for the committed flip)

- `dist/` is MIXED: `dist/handlers/memory-search.js:905` + `dist/lib/search/vector-index-queries.js:293` carry `= false`; `dist/handlers/memory-index.js:323` still `= true`; `dist/handlers/memory-context.js:875,903` still forward the flag. [grep dist, Iter 9]
- `.opencode/bin/spec-memory.cjs` runs `mcp-server/dist/spec-memory-cli.js` and **exits 69 when dist is stale** [.opencode/bin/README.md:105]. The committed a1d2b84a1e flip has NO runtime effect until `dist` is rebuilt and the daemon restarted.

---

## 8. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached` (10/10; stopPolicy max-iterations; convergence treated as telemetry).
- Iterations: 10 (newInfoRatio trend: 1.0, 1.0, 0.9, 0.85, 0.7, 0.8, 0.75, 0.5, 0.65, 0.6 — no convergence candidate before the cap; final sweep still found 6 new surface groups).
- Questions answered: 10/10 (Q1-Q10 all evidence-backed).
- Ruled out: whole-repo greps for inventory (spec-history noise); schema-default injection assumption (left as open item — schema layer still advertises true regardless); budget-allocator source location (d.ts evidence only).

## 9. CONFIRMED vs INFERRED

- **Confirmed** (read/grep/sqlite evidence): all file:line citations in §2; dist mixed state; DB row composition; learned-triggers 0 rows; render.ts directive constants; session-prime dead code; injection-contract stale claim; compaction surface live wiring.
- **Inferred** (labeled): per-file counts for aggregated tails (C6, E9) imply fixture-level content; budget-allocator implementation location; "no steering loss" beyond the cited mechanisms; whether schema-layer defaults are injected into handler args (unresolved — flag for implementation: check the tool-router default application before removing the param).

---

*Generated by the deepseek-flash-audit fan-out lineage. All writes confined to `research/lineages/deepseek-flash-audit/`; no repo state modified.*
