# Iteration 002 — Angle (b) part 1: renderer mechanics, byte-identical gate, checklist duplication quantified

**Focus:** Q-A2 groundwork — what shared-core mechanism exists, what does 033's ADR-004 gate actually assert, and how big is the checklist.md.tmpl duplication really?

## Method
Read `scripts/templates/inline-gate-renderer.ts`, `scripts/tests/scaffold-golden-snapshots.vitest.ts`, `scripts/tests/template-structure.vitest.ts`; packet 033 tasks/decision-record; measured level-body duplication in `checklist.md.tmpl` and `decision-record.md.tmpl` via line-diff analysis.

## Findings

### F-B1.1 — The renderer supports ONLY inline `<!-- IF level:N -->` gates; there is NO cross-file include/partial mechanism [CONFIRMED]
[SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:33-35,166,182] Grammar = GATE_OPEN/GATE_CLOSE/GATE_EMPTY on IF expressions over levels; `renderInlineGates(template, level)` is the whole transform (297 lines total).
**Implication:** "shared-core + gated-addenda" must be implemented as ungated core lines + IF-gated addendum lines WITHIN each template file (exactly how 033's T020 did it), not as shared partials across files. Any cross-file dedup idea needs new renderer features (out of scope; higher risk).

### F-B1.2 — The byte-identical gate is a vitest snapshot suite [CONFIRMED]
[SOURCE: scripts/tests/scaffold-golden-snapshots.vitest.ts:31-52] For every level × required doc it renders via `renderInlineGates`, asserts frontmatter starts with `---`, contains `SPECKIT_TEMPLATE_SOURCE`, contains NO residual `<!-- IF` / `<!-- /IF -->` markers, then `toMatchSnapshot(`${level}-${docName}`)`. Phase-parent spec has its own snapshot. 033's T050 recorded "25/25 render hashes match baseline" plus `template-structure` 8/8, `inline-gate-renderer` 12/12, `scaffold-golden-snapshots` 6/6 [SOURCE: specs/system-speckit/033-spec-template-context-optimization/tasks.md:77].
[SOURCE: specs/system-speckit/033-spec-template-context-optimization/decision-record.md:72-85] ADR-004: consolidation is gated on **byte-identical per-level render output vs pre-change baseline; any diff blocks the change**.
**Implication:** A merge of tasks+checklist CANNOT pass this gate unchanged — rendered output necessarily changes (new merged doc). The gate protects refactors; content-shape changes need an explicit snapshot re-baseline step (regenerate snapshots + review diff) plus manifest/content-router/spec-doc-structure sync. This is the exact procedure 033 used for its own template restructures (T010 research.md gating shipped with a NEW gating test instead).

### F-B1.3 — checklist.md.tmpl duplication MEASURED: 585 body lines collapse to 80 unique lines [MEASURED]
Level bodies (top-level IF blocks): L2=147 lines, L3=219, L3+=219 (total 585).
Pairwise identical-line matches: L2↔L3=142, L2↔L3+=142, **L3↔L3+=214 of 219**.
Union of unique body lines across all three: **80** → ~505 duplicated lines (~86% of body bytes are copies). The L3+ block differs from L3 by only ~5 lines.
**Implication:** Restructuring to ungated shared core + small gated deltas reduces source by ~500 lines while rendering byte-identical output at every level (F-B1.2 gate applies cleanly because this is a pure refactor — rendered bytes unchanged). This is exactly the class of change ADR-004 was written for.

### F-B1.4 — decision-record.md.tmpl: L3 and L3+ bodies are 138/142 identical [MEASURED]
Two top-level blocks only ('3'=142 lines, '3+'=142 lines; matching=138). The entire L3+ block could be `core + tiny addendum`.
**Implication:** same refactor pattern, trivial risk under snapshot gate.

### F-B1.5 — research.md.tmpl structure: 948 lines, 40 anchors, deep level gating already present [OBSERVED]
[SOURCE: templates/manifest/research.md.tmpl anchor map, lines 22-936] Anchors include core-architecture (gated level:2,3,3+,phase), integration-patterns (gated level:3,3+,phase), plus always-on widgets: executive-overview, technical-specifications, constraints-limitations, implementation-guide, code-examples, testing-debugging, performance-optimization, security-considerations, future-proofing-maintenance, api-reference, troubleshooting-guide, acknowledgements, appendix, changelog-updates. 033 T010 already made L1 render 175 lines with L3/3+/phase byte-identical, guarded by `scripts/tests/research-template-gating.vitest.ts` (4/4) [SOURCE: 033/tasks.md:55].
**Implication:** the remaining cost is the WIDGET TAXONOMY itself (fixed 14-section shape applied to all domains), not per-level duplication. Domain-neutralizing means shrinking the always-on widget list — which CHANGES rendered bytes and anchor set → content-router/versioning implications (see F-B1.2). Higher value-per-risk than pure dedup? Deferred to ranking iteration.

## Ruled out this iteration
- Ruled OUT: cross-file shared partials/includes for templates — renderer has no such feature; adding one expands the trusted render surface for marginal gain over in-file core+gates (F-B1.1).

## Dead ends hit
- Initial grep looked for renderer under scripts/src/renderers (stale); actual location scripts/templates/inline-gate-renderer.ts. Corrected via dist artifact trace.

## Open questions carried forward
- What does content-router actually key on (anchors vs docs)? Needed before recommending anchor-set changes for Q-A2/Q-A4.
