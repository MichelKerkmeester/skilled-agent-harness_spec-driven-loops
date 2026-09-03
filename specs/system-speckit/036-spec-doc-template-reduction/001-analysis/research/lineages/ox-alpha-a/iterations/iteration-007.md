---
title: "Iteration 007 — Versioned-change surface map: content-router, golden snapshots, continuity freshness"
trigger_phrases: []
---
# Iteration 007 — Versioned-change surface map: content-router, golden snapshots, continuity freshness

**Focus:** Enumerate the exact machine surfaces any template change must co-update (the shared fact's "manifest + content-router + spec-doc-structure + golden snapshot + dist"), with file:line precision.

## Findings

### F-G1.1 — Content router routes memory saves to (docPath, anchorId) pairs; anchors in templates ARE routing targets [CONFIRMED]
[SOURCE: mcp-server/lib/routing/content-router.ts:48-50] Hardcoded default anchors: `adr-NNN` (decision), `what-built` (progress), `how-delivered` (delivery). `buildTarget` at lines 1080-1105 maps categories: narrative→implementation-summary.md, decision→decision-record.md at L3/L3+ ELSE implementation-summary.md#'decisions' update-in-place, handover→handover.md, research_finding→research/research.md, task_update→tasks.md phase anchor.
**Implication for merge:** tasks.md anchors survive a checklist merge untouched → zero routing impact from Q-A1 work. Anchor IDs must NEVER be renamed even when surrounding prose is deduped (constraint honored). Any template whose anchors vanish (e.g., dropping `_memory` blocks — not anchors) is safe.

### F-G1.2 — Golden snapshots are ONE file covering all level×doc renders [CONFIRMED]
[SOURCE: scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap, 3955 lines] All per-level renders live here. Re-baseline procedure = run suite with `-u`, then REVIEW the diff as the byte-identical gate's replacement for intentional shape changes (per ADR-004 semantics: refactor changes must diff EMPTY; shape changes get an explicit reviewed re-baseline).
Also relevant: `inline-gate-renderer.vitest.ts` (12 tests) and `research-template-gating.vitest.ts` (4 tests) pin renderer behavior and research.md gating separately.

### F-G1.3 — Continuity freshness gate keys on implementation-summary.md ONLY [CONFIRMED]
[SOURCE: scripts/validation/continuity-freshness.ts:24 (canonical doc list), 356-371 (parses implementation-summary frontmatter; skips with warning if missing)] Under SPECKIT_COMPLETION_FRESHNESS=true, strict-mode completion requires the stored fingerprint there to match recomputed content.
**Implication:** consolidating `_memory.continuity` into implementation-summary alone (F-C1.5) aligns ALL three consumers (resume ladder, deriveStatus, freshness gate) on one doc — the current multi-copy layout serves none of them better.

### F-G1.4 — Full migration surface map (consolidated, per recommendation) [SYNTHESIS]
For each recommended change, exact co-update set:
| Change | Files/rules to co-update | Snapshot impact |
|---|---|---|
| Merge tasks+checklist (Q-A1) | spec-kit-docs.json addon rows + sectionGates; orchestrator.ts:163 detectLevel; orchestrator.ts:550 PRIORITY_TAGS retarget; graph-metadata-parser.ts:1178-1266 deriveStatus (+legacy checklist read-path); check-ac-coverage.sh:54,57,198-200 filename bindings | Deliberate re-baseline (shape change) |
| Checklist/decision-record shared-core dedup (Q-A2) | NONE beyond templates themselves (pure refactor) | Diff MUST be empty (byte-identical gate) |
| _memory consolidation to impl-summary (Q-A3) | spec-doc-structure.ts FRONTMATTER_MEMORY_BLOCK expectations; orchestrator.ts:625-634 session-lineage scan scope | Re-baseline |
| Comment out-of-band relocation (Q-A4) | New sidecar files under templates/manifest/guidance/; renderer UNTOUCHED | Re-baseline |
| Byte-budget assertions (Q-A5) | scaffold-golden-snapshots.vitest.ts new assertions | Additive test only |
| AC matrix relocation (Q-A6) | check-ac-coverage.sh bindings (shared with row 1 if sequenced together) | Covered by row 1 re-baseline |
Plus for every row: `dist/` rebuild of mcp-server/lib + scripts (both dist trees observed: scripts/dist/renderers, mcp-server/dist/lib/routing), and content-router defaults verified unaffected (F-G1.1).

## Ruled out this iteration
- Ruled OUT: treating snapshot `-u` as sufficient without review — that would defeat ADR-004's purpose; review of diff IS the gate for shape changes.

## Dead ends hit
- generate-context.ts delegates doc writes through workflow/loader modules; direct continuity-write target tracing was inconclusive in-session. Marked UNKNOWN: whether full memory saves rewrite `_memory` blocks in multiple docs. Mitigated: verify-index-identity and continuity-freshness both key on implementation-summary.md, and ADR-004's quick-edit path (direct frontmatter edits) is documented as allowed — consolidation remains safe pending one targeted check during implementation planning.

## Open questions carried forward
- Rank all recommendations by value×risk with shipped-packet regression flags (next iteration).
