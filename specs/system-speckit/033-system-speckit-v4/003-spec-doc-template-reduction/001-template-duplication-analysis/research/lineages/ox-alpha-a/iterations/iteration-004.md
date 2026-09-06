---
title: "Iteration 004 — Angle (d): instructional HTML comment leakage into rendered bytes"
trigger_phrases: []
---
# Iteration 004 — Angle (d): instructional HTML comment leakage into rendered bytes

**Focus:** Q-A4 — How many instructional (non-gate, non-anchor, non-marker) HTML comments leak through the renderer into packet bytes? Is anything consuming them? What would out-of-band placement cost?

## Method
Simulated per-level rendering of all manifest templates with a faithful re-implementation of `renderInlineGates` semantics (line-based IF/IF-level gate evaluation; verified against the real grammar at scripts/templates/inline-gate-renderer.ts:33-35), then classified surviving HTML comments. Grep for any validator/test consumer of instructional comment text.

**Method caveat:** my simulator is an approximation of the real renderer (which also handles empty-gate forms and blank-line normalization). Percentages are indicative; exact byte deltas must come from the golden snapshot suite at change time.

## Findings

### F-D1.1 — MEASURED: ~15.5% of an L2 packet's rendered doc bytes are instructional comments [MEASURED]
Per-template L2 render (bytes / instructional-comment bytes / share):
- implementation-summary.md: 4116B / 1795B / **43.6%** (worst offender)
- review.spec.md: 2392B / 546B / 22.8%
- checklist.md: 4285B / 851B / 19.9%
- tasks.md: 2220B / 438B / 19.7%
- spec.md: 4745B / 934B / 19.7%
- plan.md: 6092B / 1030B / 16.9%
- debug-delegation.md: 3886B / 687B / 17.7%
- handover.md: 5694B / 588B / 10.3%
- research.md: 10119B / 610B / 6.0%
- resource-map.md + context-index.md + review.spec.md: remainder
Total across 12 docs: 53,660B rendered, 8,299B instructional comments (**15.5%**). L1 renders are similar for the four core templates (tasks 438B, plan 855B, spec 789B).

### F-D1.2 — The renderer only strips IF gates; every other comment passes into the packet verbatim [CONFIRMED]
[SOURCE: scripts/templates/inline-gate-renderer.ts:182+] `renderInlineGates` evaluates/removes only IF-gate lines. The golden snapshot test asserts NO residual `<!-- IF` markers but imposes no rule on other comments ([SOURCE: scripts/tests/scaffold-golden-snapshots.vitest.ts:44-46]) — so SELF-CHECK / FAILURE-MODES / authoring hints ship to every scaffolded packet.

### F-D1.3 — No validator or runtime consumes the instructional text [CONFIRMED]
Grep across `mcp-server/lib`, `scripts` (excluding tests) for `SELF-CHECK|FAILURE MODES`: zero hits. The anchors (`<!-- ANCHOR:id -->`) are the validation contract; instructional comments are dead weight at render time.
**Implication:** removing them from rendered output breaks nothing downstream EXCEPT the golden snapshots themselves (byte diff → deliberate re-baseline).

### F-D1.4 — Recommendation draft: move instructional prose out-of-band into a template-authoring sidecar keyed by template+section, not by inline comment [RECOMMENDATION-DRAFT]
Options weighed:
- **(i) Delete entirely:** simplest; loses authoring guidance at edit time. Guidance already partially lives in `templates/EXTENSION-GUIDE.md` and `template-guide.md`.
- **(ii) Sidecar file** (`templates/manifest/guidance/<doc>.md` or a section-keyed JSON in the manifest): keeps guidance next to source, zero rendered bytes. Renderer untouched.
- (iii) New renderer feature to strip designated comments (e.g., `<!-- NOTE: ... -->`): expands the trusted render surface for what sidecar files achieve with none.
Recommend (ii): ~8.3KB (~15.5%) of every L2 packet's doc bytes reclaimed — this IS an agent-token win (unlike ADR-004's pure maintainability win), directly serving the small-model legibility goal. Cost: one-time snapshot re-baseline (deliberate, reviewed diff) + moving prose into sidecars. Anchor contract untouched.
Sequencing note: do this AFTER the tasks+checklist merge lands (iteration 001) so snapshots are re-baselined once, not twice.

## Ruled out this iteration
- Ruled OUT (for now): renderer stripping feature (option iii) — unnecessary machinery; sidecar achieves the same with zero render-path changes.
- Ruled OUT: treating SPECKIT_LEVEL/SPECKIT_TEMPLATE_SOURCE markers as leakage — they are consumed by detectLevel ([SOURCE: orchestrator.ts:161]) and the snapshot test ([scaffold-golden-snapshots.vitest.ts:42]).

## Dead ends hit
- First simulator run produced wrong outputs because gate expressions parse as `level:N` (colon-prefixed), not bare level tokens; fixed by prefix-stripping. Recorded so the migration iteration can reuse the harness correctly.

## Open questions carried forward
- None blocking; feeds token-budget math for Q-A5.
