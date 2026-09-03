---
title: "Iteration 003 — Angle (c): `_memory.continuity` duplication vs resume-ladder read path"
trigger_phrases: []
---
# Iteration 003 — Angle (c): `_memory.continuity` duplication vs resume-ladder read path

**Focus:** Q-A3 — Is the dispatch claim true that only implementation-summary's continuity is read? Which validators/other consumers depend on the per-doc copies? Can 4-7 copies be dropped?

## Method
Measured `_memory:` frontmatter line counts per template; traced the resume ladder (`mcp-server/lib/resume/resume-ladder.ts`, `handlers/memory-context.ts`), the `FRONTMATTER_MEMORY_BLOCK` + `SESSION_LINEAGE_BROKEN` rules, and deriveStatus consumers.

## Findings

### F-C1.1 — MEASURED: 8 templates carry `_memory` frontmatter; an L2 packet ships ~227 duplicated boilerplate lines [MEASURED]
[SOURCE: templates/manifest/*.md.tmpl measured] `_memory:` line counts: checklist=51, decision-record=34, implementation-summary=42, phase-parent.spec=17, plan=48, review.spec=17, spec=42, tasks=44. An L2 packet renders 5 near-identical copies (spec+plan+tasks+checklist+impl-summary ≈ 227 lines); L3 adds decision-record (≈261). All copies share identical field structure except `packet_pointer`, `recent_action`, and `next_safe_action` prose.
**Implication:** the duplication is real and even larger than the dispatch's "5x" framing (8 templates carry it).

### F-C1.2 — Resume ladder reads continuity from implementation-summary.md ONLY [CONFIRMED with precision]
[SOURCE: mcp-server/lib/resume/resume-ladder.ts:961-964] Docstring: "reads packet-local handover.md and `_memory.continuity` **inside implementation-summary.md**, promotes whichever of those two sources is fresher." Implementation confirms: `continuitySignal = parseContinuitySignal(readStableMarkdownDocument(implementationSummaryPath, ...))` at lines 1012-1019; missing file → hint "continuity tier unavailable". Spec-doc fallback priority puts implementation-summary FIRST ([SOURCE: resume-ladder.ts:127-136]).
**Implication:** the OTHER 7 copies are invisible to the resume ladder. Dispatch claim verified.

### F-C1.3 — But the copies ARE consumed by validation: two live consumers found [CONFIRMED]
1. **SESSION_LINEAGE_BROKEN**: `extractSessionIds` scans 6-space-indented `session_id:` / `parent_session_id:` lines across `docsForLevel(level)` files and warns when a parent id has no known producer anywhere in the specs tree ([SOURCE: mcp-server/lib/validation/orchestrator.ts:563-577, 625-634]). Fewer copies = smaller lineage graph, but the rule keeps working off whichever docs retain the block.
2. **FRONTMATTER_MEMORY_BLOCK**: `validateFrontmatterMemoryBlock` iterates `collectDocuments(folder, level)` = all requiredCoreDocs + requiredAddonDocs + lazyAddonDocs (+ resource-map, context-index) that exist on disk ([SOURCE: spec-doc-structure.ts:189-210]; rule wiring at orchestrator.ts:621-641; failure codes SPECDOC_FRONTMATTER_001..007 + MEMORY_BLOCK_INVALID at spec-doc-structure.ts:109-119).
**Implication:** dropping the block from N templates REQUIRES updating this rule's expectations (which docs must carry the block) or shipped packets fail validate.sh --strict. This is part of the VERSIONED surface named in the shared fact.

### F-C1.4 — deriveStatus consumes completion_pct ONLY from implementation-summary [CONFIRMED]
[SOURCE: graph-metadata-parser.ts:1237-1239] `parseCompletionPct(implementationSummaryDoc.content)` — no other doc's `completion_pct` is read for status derivation.
**Implication:** no status-regression risk from removing other copies' completion fields.

### F-C1.5 — Recommendation draft: keep exactly ONE canonical continuity block (implementation-summary), demote others to pointer stubs or nothing [RECOMMENDATION-DRAFT]
Evidence chain: resume ladder reads only impl-summary (F-C1.2); status reads only impl-summary (F-C1.4); session-lineage works off any subset (F-C1.3); the block exists in every template because templates were copy-derived, not because of a read-path requirement. Safest sequencing: (1) make FRONTMATTER_MEMORY_BLOCK accept block-presence in impl-summary only; (2) shrink other templates' `_memory` to nothing (or 2-line pointer); (3) re-baseline golden snapshots byte-diff review; (4) keep `session_dedup.fingerprint` freshness checks scoped to impl-summary (CONTINUITY_FRESHNESS already keys on stored fingerprint matching recomputed content there).
Risk note: multi-session lineage reconstruction loses per-doc session ids — mitigated because ids repeat identically across copies today (no information loss; one copy suffices).

## Ruled out this iteration
- Ruled OUT: "drop 4 copies with zero code changes" — FRONTMATTER_MEMORY_BLOCK + golden snapshots make that a regression; validator update is mandatory co-change.

## Dead ends hit
- None significant.

## Open questions carried forward
- Does generate-context.js write continuity into multiple docs during saves (would need co-change)? Deferred to migration-surface iteration (007/008).
