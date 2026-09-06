---
title: "Iteration 4: Save Pipeline Stage 2 — extractors/, loaders/, renderers/, templates/"
trigger_phrases: []
---
# Iteration 4: Save Pipeline Stage 2 — extractors/, loaders/, renderers/, templates/

## Focus

Whether any extractor stage went inert after the memory decommission, and which of the four rendering-adjacent directories (extractors 13 files/5893L, loaders 3, renderers 3, templates 3) production actually reaches. This closes Q2.

## Actions Taken

1. Listed all four directories; extracted collect-session-data.ts's full import block (15-62) — the declared extraction surface.
2. Extended the closure a second hop: session-extractor, file-extractor, implementation-guide-extractor import only config/types/utils/lib — the orphan hypothesis formed here.
3. Discovered the SECOND hub: core/workflow.ts:17-48 imports the extractors barrel AND four individual extractors plus the canonical scorer, contamination filter, spec-folder and git-context extractors, and ../lib/validate-memory-quality.js.
4. Read extractors/index.ts (barrel: exports all 12 + lib/session-activity-signal.js at :14); traced who imports the barrel (core/workflow.ts:20 + 2 tests).
5. Traced renderers/ and templates/: repo-wide rg for importers of every spelling; found spec/create.sh:1066 (INLINE_GATE_RENDERER), assets/template-mapping.md:90,101,338, README.md:269, SKILL.md:61; grepped populateTemplate against production (utils/task-enrichment.ts: EMPTY).
6.Audited the registry's declared generate-context dependencies against the observed closure.

## Findings

1. `core/workflow.ts:17-48` vs `continuity/generate-context.ts:15-35` — declared: collect-session-data.ts (1645L) as "Collect Session Data", the extraction orchestrator. Observed: there are TWO import hubs, not one. Hub 1 (generate-context.ts) pulls only 3 extractors directly (session :33, file :39, implementation-guide :41); hub 2 (workflow.ts:17-21) buys extractConversations, extractDecisions, extractDiagrams, enhanceFilesWithSemanticDescriptions FROM the barrel, and :25-47 adds shouldAutoSave+collectSessionData, filterContamination+labels+severity (contamination-filter), scoreMemoryQuality as scoreMemoryQualityV2 (extractors/quality-scorer — the CANONICAL scorer, production name "V2"), determineValidationDisposition+validateMemoryQualityContent (../lib/validate-memory-quality.js), extractSpecFolderContext (spec-folder-extractor), extractGitContext (git-context-extractor), createFilterPipeline (../lib/content-filter.js). Result: ALL TWELVE extractors are production-wired — none went inert in the decommission — but a single-entry dependency audit (iteration 3's method) returns the wrong answer, because the conductor reaches past the orchestrator. Severity P2 (topology trap, not a defect). Recommendation: document the two-hub import topology in core/README.md — it defeated the first-pass liveness method.

2. `core/quality-scorer.ts` (367L) — declared: "Scores the quality of generated memory files" (:4) exporting scoreRenderQuality (:140) and buildRenderQualityScoreFields (:359). Observed: NOT in the extractors barrel (which exports its extractors/ sibling at extractors/index.ts:36 — a RELATIVE './quality-scorer.js' that resolves to extractors/, not core/); production importers: NONE-FOUND (rg over all cli sources, every extension, excluding the dir); its only callers are 2 tests that exist to explain the duplication (tests/quality-scorer-disambiguation.vitest.ts, quality-scorer-calibration.vitest.ts) — a scorer so redundant that the package carries a test-usage-guide for it. Meanwhile the production scorer (extractors/quality-scorer.ts, scoreMemoryQuality, aliased scoreMemoryQualityV2 at workflow.ts:42-43) and the legacy-flavored core/quality-gates.ts (78L, also unaccounted) coexist. Severity P1. Recommendation: merge — fold scoreRenderQuality into the extractors/ canonical (post-save-review.ts is the only plausible consumer and currently imports neither) or remove; retire the disambiguation test.

3. `renderers/template-renderer.ts` (231L) + `renderers/index.ts` — declared: "Template rendering module" (cli/README.md:72). Observed: production importers NONE-FOUND anywhere (repo-wide rg, all spellings, '.ts/.cjs/.mjs/.sh', excluding its own directory — only tests/task-enrichment.vitest.ts:13 imports populateTemplate and :118 vi.mocks it); its exported populateTemplate appears in NO production module (utils/task-enrichment.ts: grep EMPTY). Actual template rendering in production runs through templates/inline-gate-renderer.sh, wired at THREE lanes: spec/create.sh:1066 (readonly INLINE_GATE_RENDERER=... — the Gate 3 production flow), the operator contract assets/template-mapping.md:90,101,338 (explicit bash invocations), and the AI contract (SKILL.md:61 "through create.sh or the inline renderer"; README.md:269 "the inline renderer expands only the sections allowed for that level"). Severity P1 (231L + barrel stranded next to a wired mechanism that does the same job). Recommendation: merge — one template mechanism: either renderers/populateTemplate becomes the implementation behind the inline-gate renderer, or renderers/ is removed.

4. `scripts-registry.json:37-38` (generate-context.dependencies: ["lib/embeddings.js", "lib/anchor-generator.js", "lib/content-filter.js"]) — declared: the save writer's dependencies. Observed: the generate-context.ts:15-35 import list contains NONE of the three directly; anchor-generator arrives via extractors/file-extractor.ts:26, content-filter via core/workflow.ts:48 (createFilterPipeline), and lib/embeddings.js arrives NOWHERE in the two-hub closure (its in-package importer: iteration-6 question). The declared dependency set is 2/3 stale-at-the-entrypoint and 3/3 indirect. Severity P2. Recommendation: fix — declare the true transitive closure (or drop the field, which duplicates what imports already prove).

## Positive Controls (verified, not findings)

- templates/inline-gate-renderer.{sh,ts} — NOT dead (the iteration-3-adjacent temptation): create.sh:1066 wires the .sh; the .ts (250L-class) is its source; three independent documentation lanes agree on the invocation. CalledBy: create.sh (production) + the AI at prompt time (documented).
- loaders/data-loader.ts — the intake-parsing stage, 2 productive files, wired at generate-context.ts:31; handles "file path, --stdin, or --json" (its header :3) and carries isLegacySharedSaveContextPath (the LEGACY_SHARED_DATA_FILE rejection, loaders/data-loader.ts:18, matching README.md:95). Mode-2 (spec-folder) responsibility continues in extractors (detectSpecFolder via spec-folder/index at workflow.ts:23 and collect-session-data.ts:22) — the "loaders" name undercounts, but nothing here is inert.
- implementation-guide-extractor.ts:11-12 — imports its sibling (file-extractor's detectObservationType) — the 3rd-hub-of-2 confirms even the "direct" extractor imports share internals; no fourth layer.
- extractors/index.ts:14 — exports lib/session-activity-signal.js THROUGH the extractors barrel (a lib module surfaced as an extractor): noted for the iteration-6 lib/ audit.

## Questions Answered

- Q2 (FULL): which save-pipeline stages still execute post-decommission — intake (schema + LEGACY_SHARED_DATA_FILE + duplicate detection via workflow→find-predecessor), extraction (all 12 extractors, 2-hub), routing, post-save review (post-save-review.ts via workflow), lock/liveness (workflow.ts:104 → daemon-detect) — ALL EXECUTE; the inert material is the residue around the pipeline, not in it: continuity/{rank-memories, fix-memory-h1+ast-parser, backfill×2, migrate-trigger-phrase-residual}, continuity/validate-memory-quality.ts's CLI-entry role, core/quality-scorer.ts, renderers/. The documented 3-layer gate (ARCHITECTURE.md:182) survives the decommission INTACT; the "memory" naming survives as vocabulary, not as machinery.

## Questions Remaining

- Q1 (residual directories: spec-folder/, graph/, retrieval/, utils/, lib/, types/, config/, setup/, ops/, codex/, pi/, mirrors, evals, observability, kpi, metrics, optimizer, resource-map, sweep); Q3 (parity lanes beyond the validation one); Q4 (zero-caller entries); Q5 (codex/pi/mirrors/evals invocation); Q6 (framing verdict + ../lib + shared duplication).

## What Worked / What Failed

- Worked: refusing to stop at the second hop — workflow.ts:17-48 (the conductor) was the difference between "6 extractors dead" (wrong) and "0 extractors dead, 2 hubs" (right).
- Worked: the vi.mock('../renderers') at tests/task-enrichment.vitest.ts:118 flagged that a production import might exist; grepping populateTemplate against production settled it (EMPTY).
- Failed: the tempting "renderers+templates = 577L dead" snapshot missed create.sh:1066; corrected the same iteration — no finding carried forward wrong.

## Ruled Out

- "6 of 12 extractors are unwired" — the workflow.ts:17-48 barrel+direct purchases wire all 12.
- "templates/ is undocumented-AI-only" — create.sh:1066 is a production caller.
- "scoreRenderQuality vs scoreMemoryQuality are rival implementations of one function" — different function names and scoring layers; the duplication finding survives via the 0-caller evidence, not via twin-implementation similarity.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts:17-48,104] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:15-35] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/extractors/collect-session-data.ts:15-62,1037] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/extractors/index.ts:8-38] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/quality-scorer.ts:4,140,359] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/extractors/session-extractor.ts:17-18; extractors/file-extractor.ts:10-34; extractors/implementation-guide-extractor.ts:11-12] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:1066] [SOURCE: .opencode/skills/system-spec-kit/assets/template-mapping.md:90,101,338] [SOURCE: .opencode/skills/system-spec-kit/README.md:269] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:61] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/tests/task-enrichment.vitest.ts:13,118] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/loaders/data-loader.ts:3-24] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:37-38]

## Next Iteration

Iteration 5: retrieval/ (31 files, 6287L) + graph/ (3, 1423L) — the 001 packet's replacement lane: which retrieval modules the mandated commands actually execute, whether the parity/retrofit/residue machinery has any caller, and whether graph/ (backfill + migrate) is wired beyond README:§7's own documentation.
