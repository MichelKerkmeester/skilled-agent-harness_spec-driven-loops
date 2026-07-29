# Iteration 2: Optimization — Redundant, Unused, Drift-Prone Fields

## Focus
Quantify fields with no consumer, duplication across load-bearing fields, and drift-prone authored-then-stale data. Confirm zero-consumer candidates from iter 1 across the advisor AND the runtime route compiler.

## Findings

### F2.1 — Dead data: `derived.supported_surfaces` and `derived.peer_resource_categories`
sk-code's graph-metadata.json carries `derived.supported_surfaces: ["WEBFLOW","OPENCODE"]` and `derived.peer_resource_categories: ["motion_dev"]`. A producer search (`grep -rln supported_surfaces|peer_resource_categories` across .opencode/skills/**/*.{py,ts,cjs,js}, excluding tests/specs) returned ZERO producers. The compiler's required-derived-fields list does NOT include them (only trigger_phrases, key_topics, key_files, entities, source_docs, causal_summary, created_at, last_updated_at, affordances). The scorer projection.ts does not read them. They are hand-authored, unvalidated, unconsumed.
[SOURCE: .opencode/skills/sk-code/graph-metadata.json:259-265; skill_graph_compiler.py:313-331; projection.ts:200-239; producer grep returned empty]

### F2.2 — Validated-only: `derived.causal_summary`
Generated/hand-written prose string, validated by the compiler ("must be a non-empty string") but with NO routing consumer. Within the advisor mcp-server it appears only at skill_graph_compiler.py:318-320 (validation) and one test fixture. The spec-folder backfill-graph-metadata.ts uses causal_summary for review flags (collectReviewFlags, line 503), but that is the SPEC-FOLDER schema, not the skill-root one — no equivalent skill-root consumer exists.
[SOURCE: skill_graph_compiler.py:318-320; backfill-graph-metadata.ts:503-507 is spec-folder; advisor grep: only validation+test]

### F2.3 — Authored-unused: `manual.related_to` and `manual.depends_on`
init_skill.py scaffolds `manual: {depends_on: [], related_to: []}` (line 284). A consumer search across the advisor mcp-server for `manual.related_to`/`manual.depends_on`/`"manual"` found only a test fixture (skill-graph-db.vitest.ts:71 sets manual empty). Neither the compiler nor the scorer reads `manual.*`. The scorer uses `edges` (depends_on/enhances/siblings/prerequisite_for/conflicts_with) for adjacency, not `manual`. `manual` is a parallel, unconsumed relationship surface.
[SOURCE: init_skill.py:284; skill_graph_compiler.py:939-963 uses edges not manual; advisor grep: only test fixture]

### F2.4 — HIGH-LEVERAGE: no skill-root `derived` regenerator (drift-prone)
The skill-root `derived` block is the densest part of graph-metadata.json. Disambiguation confirmed:
- **spec-folder** graph-metadata.json has a regenerator: `system-spec-kit/scripts/graph/backfill-graph-metadata.ts` (reads spec.md/plan.md, emits derived, runs review flags).
- **skill-root** graph-metadata.json has NO equivalent regenerator. The only writer is `init_skill.py`, which scaffolds a MINIMAL derived block (5 fields: trigger_phrases, key_topics, source_docs, created_at, last_updated_at — lines 287-293 for S, 540-554 for H). The fleet's actual derived blocks are far richer (sk-code has entities, key_files, causal_summary, supported_surfaces, peer_resource_categories, intent_signals) — so they were hand-enriched after scaffold and are hand-maintained.
- `ci-skill-root-metadata.cjs --fix` regenerates only leaf-manifest.json and S-class leaf-aliases.json; it does NOT touch graph-metadata.json or its derived block.
- The contract labels graph-metadata.json producer = "authored" (§3), but the scorer treats `derived.generated_at` as "AUTHOR-TIME, not runtime" sync stamp (projection.ts:236-239) — a tension between the contract's "authored" label and the field structure implying machine-sync.

Consequence: every skill-root `derived` block silently drifts as the skill's references/assets/SKILL.md evolve. There is no freshness gate for the derived block (only leaf-manifest has one). This is the single highest-leverage optimization/automation gap surfaced so far.
[SOURCE: init_skill.py:270-293,535-554; backfill-graph-metadata.ts:485-516 is spec-folder; contract §3 table line 62; projection.ts:236-239; ci-skill-root-metadata.cjs regenerates leaf-manifest only]

### F2.5 — Duplication: `domains` ∩ `intent_signals` double-counting in scorer
Both `domains` and `intent_signals` are load-bearing scorer inputs (projection.ts:231-232). For sk-code: domains=28, intent_signals=64, overlap=8 (e.g. "code", "opencode", "typescript" appear in both). The scorer runs both through `phraseVariants` and into separate arrays, so the 8 shared tokens are scored twice. `intent_signals` ∩ `derived.trigger_phrases` overlap is smaller (3). The three signal arrays (domains, intent_signals, derived.trigger_phrases) are partially redundant with no dedup contract.
[SOURCE: projection.ts:231-232,213-221; sk-code/graph-metadata.json computed counts]

### F2.6 — hub-router.json IS consumed (not dead)
Confirmed consumer: `.opencode/bin/lib/compiled-route-manifest.cjs:405-420` reads hub-router.json + mode-registry.json, cross-checks `registry.skill === hubId && hubRouter.skill === hubId`, and embeds hubRouter into the compiled route manifest. So hub-router.json is load-bearing for runtime route resolution. (skill_advisor.py references it only in a comment at line 1981 — the advisor itself consumes it indirectly via the compiled manifest.)
[SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:405-420]

### F2.7 — Dual signal source with uneven coverage
The scorer reads trigger phrases from TWO sources: (1) graph-metadata.json `derived.trigger_phrases` (line 916) and (2) doc YAML frontmatter `trigger_phrases` via `_load_doc_trigger_phrases` (lines 822-921), which scans a skill's docs. Coverage is uneven: sk-code's SKILL.md has NO trigger_phrases frontmatter (0 matches) and its shared/references/*.md have none either. So for sk-code the doc-frontmatter signal source contributes nothing, and all routing signal comes from graph-metadata. Other skills may rely more on doc frontmatter. There is no gate asserting the two sources stay consistent or that at least one is populated per skill.
[SOURCE: skill_advisor.py:822-921; sk-code SKILL.md head (no trigger_phrases); grep shared/references returned none]

## Sources Consulted
- init_skill.py:270-329, 535-554 (scaffold shapes)
- backfill-graph-metadata.ts:485-516 (spec-folder regenerator, disambiguation)
- skill_graph_compiler.py:294-396, 939-991 (validate vs compile)
- projection.ts:200-239 (load-bearing fields)
- .opencode/bin/lib/compiled-route-manifest.cjs:405-420 (hub-router consumer)
- sk-code/graph-metadata.json overlap computation (python3)
- grep producer/consumer searches across advisor mcp-server

## Assessment
- **newInfoRatio:** 0.85 — six new optimization findings; F2.4 (no skill-root derived regenerator) is the highest-leverage discovery and reframes the automation dimension. Some overlap with iter 1's inventory (consumer map) keeps it below 1.0.
- **Novelty justification:** First time quantifying dead fields, duplication, and the spec-folder-vs-skill-root regenerator asymmetry; the asymmetry is a structural insight not visible from the contract alone.
- **Confidence:** High on F2.1/F2.3/F2.6 (direct grep + read); High on F2.4 (confirmed no writer except init_skill.py, confirmed --fix scope); Medium on F2.5's scoring impact (double-counting inferred from projection.ts structure, not from a scored-output diff — carried to iter 4 effectiveness); Medium on F2.7's fleet-wide unevenness (sk-code is one sample — broadening in iter 4).

## Reflection
- **What worked:** Disambiguating the two graph-metadata.json schemas up front prevented a false "causal_summary has a consumer" claim (it does — but in the spec-folder schema).
- **What failed:** Initially expected a skill-root derived regenerator to exist by analogy with spec-folder; it does not. The contract's "authored" label hid the gap.
- **Ruled out:** hub-router.json as a dead field (F2.6 refutes — it has a compiled-route consumer).

## Recommended Next Focus
Iteration 3 — AUTOMATION GAPS: (a) scope what a skill-root `derived` regenerator would need to emit (can key_files/entities/source_docs/trigger_phrases be derived from SKILL.md + references/ + leaf-manifest.json?); (b) audit scaffolder coverage — does init_skill.py emit all 8 files for both classes, and are templates complete; (c) identify authored files that could be auto-validated or generated (e.g. command-metadata.json ownerMode↔mode-registry cross-check is already gated — what else could be); (d) check whether leaf-manifest.config.json could be derived for S-class instead of authored.
