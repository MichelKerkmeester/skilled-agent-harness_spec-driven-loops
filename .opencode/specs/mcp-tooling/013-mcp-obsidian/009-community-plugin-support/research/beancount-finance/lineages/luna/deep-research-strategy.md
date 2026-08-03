---
title: Beancount Ledger Plugin Research Strategy
description: Detached five-iteration research strategy for the Beancount Ledger Obsidian plugin.
---

# Deep Research Strategy - Beancount Ledger / beancount-finance

## 1. OVERVIEW

This strategy tracks a detached lineage whose canonical outputs are confined to this lineage directory. The requested stop policy is `max-iterations`; convergence signals are telemetry only until five iterations are complete.

## 2. TOPIC

Deep-dive research on the Obsidian plugin `Beancount Ledger` (`beancount-finance`, `mkshp`, v2.3.1) and the Beancount v3 / beanquery / beanprice interfaces an AI must operate at the file layer.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] What exact Beancount directives and lot/currency forms does the plugin read and write?
- [ ] What exact settings and persisted state keys does `main.js` use in `data.json`?
- [ ] How are `bean-query`/beanquery, `bean-price`, and BQL invoked and formatted?
- [ ] What are the complete UI features, commands, dashboard queries, and file-layer workflows?
- [ ] Which parser, validation, pricing, and cost-basis edge cases must an AI handle?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not modify plugin source, a real vault, or the target spec documents.
- Do not infer undocumented settings from generic Obsidian conventions when source evidence is available.
- Do not provide personalized tax, investment, or accounting advice.

## 5. STOP CONDITIONS

- Complete exactly five iterations unless an unrecoverable state or source failure makes a valid iteration impossible.
- Require cited primary source evidence for the plugin source and independent official documentation for Beancount and beanquery concepts.
- Synthesize a file-layer knowledge base with explicit unknowns and troubleshooting boundaries.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

Iterations 1–2 resolved the plugin-owned contract and the core Beancount directive/inventory model. Three evidence tracks remain open; synthesis is deferred until iteration 5.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

Initialization complete. Source triangulation will use the pinned GitHub source plus official docs. Iterations 1–2 completed the plugin-source and language-model tracks.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Memory-context retrieval was unavailable in this runtime; no prior context was injected.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

No approaches exhausted.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

No separate beanquery setting key, pad-creation UI, or repository-root compiled `main.js` was verified at the inspected source ref.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 1
- Failed pivots: 0
- Saturated: none
- Remaining frontier: BQL/beanquery surface, dashboards/workflows, and failure handling.
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

Carry forward: BQL surface, dashboards/workflows, and edge cases. Plugin settings/process boundary and directive/inventory semantics are resolved.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Iteration 3: verify beanquery/BQL grammar, plugin query processors, output formats, dashboard query idioms, and bean-price CLI behavior.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Resource map: not present at initialization; skipping the coverage gate.
- Memory context: unavailable; research starts from primary repositories and official documentation.
- Artifact binding: the lineage override is authoritative; the normal artifact-root resolver is intentionally not run.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05, telemetry only under `max-iterations`
- Per-iteration budget: 12 tool calls maximum
- Progressive synthesis: enabled in config; final canonical synthesis occurs after iteration 5
- Source rule: every finding carries `[SOURCE: ...]` or `[INFERENCE: ...]`
- No writes outside this lineage directory
- Current generation: 1
- Started: 2026-08-02T11:52:21Z

## Iteration 3 update

- Answered: the BQL process boundary, current grammar, typed source tables, inventory/date helper surface, dashboard query families, and bean-price stdout contract.
- What worked: pairing plugin `queryRunner.ts`/`queries/index.ts` with beanquery grammar, source adapter, tests, and beanprice CLI source.
- Ruled out: a private query database, a separate beanquery setting, raw-posting queries as transaction-grain results, and plugin use of bean-price update flags.
- Remaining: map UI tabs, commands, settings, structured files, and end-to-end file-layer workflows; then enumerate validation/reconciliation failures.
- Pivot count: 2. Convergence remains telemetry only; iteration 4 broadens to UI/workflow integration.

## Iteration 4 update

- Answered: dashboard tabs/controllers, command IDs, editor/lint behavior, complete structured file routing, settings effects, supported modal writes, and safe mutation order.
- What worked: source inspection of the unified view, file view, modal, structured layout, directive writers, settings, and project documentation.
- Ruled out: a separate dashboard database, a complete UI editor for every directive, and writer-level bean-check guarantees.
- Remaining: validation and recovery catalog, CSV import/reconciliation, bean-check failure classes, and AI recipes.
- Pivot count: 3. Convergence remains telemetry only; iteration 5 broadens to failure handling and operational recipes.

## Iteration 5 update

- Answered: v3 bean-check availability, editor `.errors` behavior, layered parser/accounting/lot/include/process/price/CSV failures, recovery actions, CSV import, reconciliation, and AI recipes.
- What worked: pairing current Beancount packaging with official language/inventory docs and plugin linter/parsers/writers/pricing source.
- Ruled out: a first-class bulk importer, `.errors` as a full validation substitute, and historical price updates through the plugin's no-flag bean-price path.
- Synthesis gate: all five max-iteration records and deltas exist; convergence is telemetry only and did not terminate the loop early.
- Pivot count: 4. Proceed to phase_synthesis within this lineage directory.
