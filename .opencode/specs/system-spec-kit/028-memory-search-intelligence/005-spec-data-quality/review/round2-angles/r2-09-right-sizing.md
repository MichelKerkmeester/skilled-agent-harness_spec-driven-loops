# r2-09 Right-Sizing (architecture / slice decomposition)

**Angle summary:** The 28-phase tier split is the right top-level decomposition and traces cleanly to the research, but the program over-scaffolds at the leaf level by giving subsumed, gated, and hard-blocked future phases the same full build-doc weight as the proven ones, which quietly undercuts the prove-first discipline the research itself preaches.

---

## FINDINGS

### F1 (P1) Conditional and subsumed Tier-C phases carry full build-bound scaffolds the research says are unproven

The research is explicit that "Every Tier C item is hypothesis-until-prod-measured" (`research/research.md:51`) and that C4 metadata-fusion is "Subsumed by the C1 prefix in its cheaper deterministic form" (`research/research.md:48`). The 017 scaffold repeats this against itself: it is "subsumed by the cheaper C1 deterministic prefix, so the build cannot start until 014-chunk-prefix shows the prod floor can move" (`017-metadata-fusion/implementation-summary.md:117`). Yet 014, 016, 017, 018 each get the same full five-doc Level-2 set as the one measured GO (A4 / 004). Scaffolding a complete spec plus plan plus tasks plus checklist plus implementation-summary for a candidate the research flags as subsumed and double-gated is the over-engineering the program elsewhere warns against. These four belong behind a single CONDITIONAL Tier-C stub that unlocks only after the 015 C2 prod-mode read moves, not as four peer build packets.

- Evidence: `research/research.md:48`, `research/research.md:51`, `017-metadata-fusion/implementation-summary.md:117`, phase folders 014 / 016 / 017 / 018 each at 5 docs.
- Type: SPEC-PREMISE.

### F2 (P2) All 28 phases ship a hollow implementation-summary that inverts the doc's purpose for a research-only deliverable

Every one of the 28 children carries an `implementation-summary.md` whose `_memory.continuity` block is a placeholder: `completion_pct: 0` and `fingerprint: "sha256:0000...0000"` across all 28 (grep over `0*/implementation-summary.md` matches 28 of 28). The 017 body reads "Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed" (`017-metadata-fusion/implementation-summary.md:54`). The parent mandates this doc per child (`spec.md:153`). An implementation-summary exists to record what was built and the validation evidence, so 28 "nothing was built" summaries invert the artifact. The parent already owns the honest single-pane status in `benchmark-and-test-status.md`. The right-sized scaffold for an unbuilt phase is the spec plus plan plus tasks, with the implementation-summary deferred to build time rather than pre-written as a zero-fingerprint stub.

- Evidence: `spec.md:153`, `017-metadata-fusion/implementation-summary.md:31-54`, zero-fingerprint placeholder present in 28 of 28 phase impl-summaries.
- Type: SPEC-PREMISE.

### F3 (P2) Thin novel phases 024 and 025 are over-decomposed against one queue concern

The research labels both items thin: freshness-decay is "GO-on-cost (thin)... Novel only as the queue wiring" (`research/research.md:79`) and per-doc-SLAs is "GO-on-cost (thin)... Reuses the description.json governance block. Build only after the queue exists" (`research/research.md:80`). The 025 scaffold confirms it is a hard-blocked leaf: "A host queue (freshness decay auto-refresh queue OR B3 `refinement_queue`)... Hard blocker" and "It builds NO queue substrate of its own" (`025-novel-per-doc-quality-slas/spec.md:138`, `:84`). So 024 builds a maintenance queue, 013 B3 builds a refinement queue, and 025 only files report-only tickets into whichever exists. Three Level-2 phases for one queue-plus-tickets surface is finer granularity than a research-only deliverable needs. 025 is a fold candidate into its host queue phase, or at least a deferred sub-item, not a peer build packet.

- Evidence: `research/research.md:79`, `research/research.md:80`, `025-novel-per-doc-quality-slas/spec.md:84`, `025-novel-per-doc-quality-slas/spec.md:138`.
- Type: SPEC-PREMISE.

### F4 (P2, clean-slice positive) The A/B/C/novel/infra tier split is the correct top-level decomposition

The five-tier split maps one-to-one onto the research synthesis sections (`research/research.md:14` Tier A, `:31` Tier B, `:41` Tier C, `:68` novel, `:87` infra). The Tier D NO-GO list of 18 items correctly receives zero phase folders, so the decomposition does not scaffold rejected work. The shared-engine collapse is honored rather than fragmented: the research "ONE engine, three front doors and ONE registry" (`research/research.md:89-93`) is reflected as 026 shipping before its 001 / 011 / 012 consumers, and the parent records that ordering in Build-Order Dependencies (`spec.md:208-212`). At the tier and engine level the program is right-sized. The over-decomposition is purely at the leaf granularity called out in F1 to F3.

- Evidence: `research/research.md:14`, `research/research.md:89-93`, `spec.md:204-212`.
- Type: SPEC-PREMISE.

---

## SLICES CHECKED CLEAN

- Infra tier (026 engine, 027 floor experiment, 028 governance rollout) is three genuinely distinct concerns and is not over-split.
- The parent itself is appropriately scoped as research-only: two P0 requirements that capture the brief and the index (`spec.md:114-118`), with all build work deferred. No under-engineering at the parent.
