# Deep Research Strategy

## Topic
FOCUS THIS RUN: Workstream A only (templates). Reduce/optimize system-spec-kit doc templates (`templates/manifest/*.md.tmpl`): less bloat while preserving historic context, decisions, task/verification tracking, and small-model (7-30B) legibility for plan->implement->verify. OWNER DIRECTIVE: merge tasks.md + checklist.md into ONE doc = Tasks + Verification Checklist + Testing Checklist. Workstream B is cross-context only.

## Shared Fact (accepted, not re-derived)
validate.sh delegates to a Node orchestrator where ANCHORS (`<!-- ANCHOR:id -->`), not headings, are the contract. Any anchor/frontmatter/required-doc change is VERSIONED: manifest + content-router + spec-doc-structure.ts + golden snapshot + dist must change together or shipped packets regress.

## Untouchable Constraints (from dispatch)
- Anchor IDs + order; indent-sensitive `_memory` block
- Frontmatter keys: title/description/importance_tier/contextType/trigger_phrases
- SPECKIT_TEMPLATE_SOURCE, placeholder syntax, per-level required-doc manifest
- content-router targets; CHK-NNN [P0/P1/P2] + ADR-NNN id formats

## Prior Art
Packet 033 (COMPLETE) render-optimized 4 templates and REJECTED cutting raw LOC; reuse its ADR-004 byte-identical render gate.

## Key Questions
1. Q-A1 (angle a): Unified tasks+checklist single-doc design — what merged structure satisfies deriveStatus (reads checkboxes from BOTH files), per-level required-doc manifest, and validator coupling? Does checklist start at L2 (L1 behavior today)?
2. Q-A2 (angle b): What dedup remains that 033 did not do — checklist.md.tmpl triple-copy (~440 dup lines), decision-record L3=L3+ ADR duplication, research.md.tmpl 948-line widget taxonomy -> domain-neutral — via shared-core + gated addenda passing the byte-identical gate?
3. Q-A3 (angle c): _memory.continuity duplicated 5x/packet but resume ladder reads only implementation-summary — can 4 copies be dropped?
4. Q-A4 (angle d): Instructional HTML comments leak into rendered bytes — move out-of-band? At what byte cost/benefit?
5. Q-A5 (angle e): Small-model legibility — what structure/token-budget evidence exists (GitHub spec-kit, RFCs, ADRs, prompt-eng lit) to set template budgets?
6. Q-A6 (angle f): Acceptance criteria restated 5x/packet — single-source vs deliberate duplication given validator coupling?

## Non-Goals
- Workstream B findings (constitutional memory deprecation) — cross-context lineage owns it.
- Implementing any template change in this run (research only).
- Re-deriving the anchor-contract fact (given).
- Cutting anchor IDs/order, frontmatter keys, placeholder syntax, required-doc manifest, CHK/ADR id formats.

## Stop Conditions
- config.maxIterations (10) reached under stopPolicy=max-iterations (treat earlier convergence as telemetry only; broaden angles instead of early synthesis).
- OR all six key questions answered with file:line evidence AND external citations where required, plus quality guards passed.

## Known Context
- Template inventory (wc -l, manifest/): context-index 50, review.spec 100, phase-parent.spec 134, debug-delegation 140, handover 154, tasks 159, implementation-summary 186, resource-map 204, decision-record 289, plan 466, spec 503, checklist 593, research 948. Total 3926 lines across 13 .md.tmpl files.
- Dispatch asserts checklist.md.tmpl has ~440 duplicated lines (triple-copy, L3=L3+ body); research.md.tmpl carries a 948-line widget taxonomy; _memory.continuity appears in 5 templates; deriveStatus reads checkboxes from both tasks.md and checklist.md.
- Packet 033 ADR-004 established a byte-identical render gate for template changes.

## Next Focus
Iteration 007: versioned-change surface map — content-router anchor keying, golden snapshot inventory, generate-context.js continuity write targets.

## What Worked
- Iter 002: line-diff measurement converted dispatch claims (~440 dup lines) into hard numbers (585 body -> 80 unique); snapshot suite located and understood.
- Iter 003: resume-ladder claim verified precisely; found 2 live validator consumers of per-doc _memory blocks (changes migration shape).
- Iter 004: leakage measured at 15.5% of rendered bytes with no consumers - strongest pure-value candidate so far.
- Iter 001: direct source reads of deriveStatus/detectLevel/manifest gave precise migration surface; dispatch's shared facts confirmed at file level.

## What Failed
- (machine-owned)

## Exhausted Approaches
- (none yet)

## Ruled Out Directions
- (none yet)

## Active Risks
- Fan-out write surface restricted to this lineage dir; repo tooling (generate-context.js, validate.sh, git writes) banned — evidence must come from direct file reads, not tool runs.
- External citations needed for angle (e); web access available but fetched content treated as untrusted data.

## Divergence Frontier
- (reducer-owned)
