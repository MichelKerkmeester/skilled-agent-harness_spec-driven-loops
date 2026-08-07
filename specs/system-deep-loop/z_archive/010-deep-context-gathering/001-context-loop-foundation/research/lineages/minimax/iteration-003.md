===FINDINGS START===
## PlanningVsImplementingNeeds
**Planning agent** (decides structure, scope, approach):
- Topology: module boundaries, ownership, dependency edges between subsystems
- Decision lineage: why current shape exists (ADRs, prior trade-offs) → prevents re-debating settled choices
- Pattern precedent: 2-3 similar past features + how they were decomposed
- Extensibility seams: where new code SHOULD slot in vs where it would violate architecture
- Open scope questions + risks: what to defer, what is fragile if touched
- Consumes report to PRODUCE a plan (tasks, order, milestones)

**Implementing agent** (edits files, writes code):
- Verified file:line / fqSymbolId targets in dependency order
- Reusable symbols with signatures, import paths, and a one-line "use this when" rule
- Conventions: naming, error handling, logging, test layout, fixture style
- The ONE hard integration point (entry/exit symbol, hook, registry, builder) → miss = contract break
- Concrete snippet to copy-modify, not abstract principle
- Consumes report to EXECUTE the plan

**Key divergence:** planning wants MAPS (topology, decisions, precedent); implementing wants NEEDLES (verified, citable, surgical). Same raw data, different cuts. A single report must serve both via sectioned output, not two reports — context budget is too scarce to fetch twice.

## FailureModes (mode | impact | mitigation)
| Mode | Impact | Mitigation |
|---|---|---|
| **Bloat** (irrelevant volume) | Attention dilutes; agent fixates on noise; tokens wasted on dead context | Hard per-section token cap; relevance gate; "no-action" entries auto-dropped |
| **Stale file:line refs** | WORST — agent trusts ref, edits wrong place, breaks invariants or hallucinates fix | Freshness check at synthesis: symbol must resolve; prefer fqSymbolId over line numbers; label UNVERIFIED entries; freshness timestamp per row |
| **Missing critical integration point** | Agent builds parallel impl, duplicates, breaks contract | Explicit "Integration Points" section, ranked hard-required vs soft; entry/exit symbol resolution; cross-check call sites |
| **False confidence** (comprehensive look, blind spot) | Agent proceeds with broken assumption, late failure | Explicit UNKNOWN list; per-section confidence; mandatory "blind spots" disclosure; gap-finder pass at end |
| **Irrelevant inclusion** ("might be useful") | Agent tries to use it, context-rot, wrong code | Every row must answer "what action does this enable?"; if none → drop at synthesis |
| **Pattern misidentification** | Old pattern shown as prevailing; agent copies dead style | Frequency-based selection (not first match); timestamp pattern against recent commits |
| **Outdated decisions** | Recommendation contradicts current ADR/recent change | Cross-check handover.md / decision-record.md for overrides; date-stamp each decision cite |
| **Over-abstract patterns** | Agent re-derives anyway, no token saved | Concrete snippet (≤15 LOC) per pattern, not principle |
| **Tangled dep graph** | All edges shown, critical path lost | Prune to touch-radius subgraph; show only edges within planned change scope |
| **Convention omission** (test layout, error shape) | Inconsistent code, review churn | Dedicated "Conventions" section with file:line examples, not prose |

## SectionValueRanking (section | marginal value/token | core or optional)
| Section | Marginal value/token | Status |
|---|---|---|
| **Reuse Catalog** (symbol + fqId + signature + 1-line "use when" + freshness) | HIGHEST — prevents duplicate code, prevents wrong-place edits, direct copy-modify target | CORE |
| **Integration Points** (entry/exit symbols, hard vs soft) | HIGHEST — single miss = total failure; cheap to render | CORE |
| **Touch List** (ordered files-to-change by implementation sequence) | HIGH — direct action target, short | CORE |
| **Conventions** (naming/error/log/test layout, with examples) | HIGH — small, pervasive, prevents review churn | CORE |
| **Pattern Precedent** (2-3 worked examples, concrete snippets) | HIGH — copy-modify starter, prevents style drift | CORE |
| **Boundary / Module Map** (ownership + seams) | HIGH for planning, MEDIUM for implementing | CORE |
| **Decision History** (relevant ADRs/decisions, date-stamped) | HIGH for planning (prevents re-debate), MEDIUM for implementing | CORE |
| **Pruned Dependency Graph** (edges within touch radius) | MEDIUM — needed for impact awareness, easy to over-render | CORE (capped) |
| **UNKNOWN / Blind Spots** (explicit gaps + "verify before deciding X") | HIGH — anti-false-confidence, very cheap | CORE |
| **Test Patterns / Fixtures** (how tests are structured here) | MEDIUM — implementing only; planning skips | OPTIONAL (implementing-mode) |
| **Architectural Narrative** (prose overview) | LOW — planning loves it, implementing ignores; prone to bloat | OPTIONAL (planning-mode, capped) |
| **Full File Dumps** | NEAR-ZERO — token hog, agent should re-read on demand | DROP unless cited |
| **Hypothetical Alternatives / "Could also be done as..."** | NEGATIVE — invites scope drift, never an action target | DROP |
| **Generic Best-Practice Lectures** | NEGATIVE — not codebase-specific, not actionable | DROP |

Rank rationale: every CORE section must (a) enable a concrete edit or decision, (b) cost ≤ ~10% of budget, (c) carry a freshness/confidence label. Sections that fail any criterion are demoted to OPTIONAL or DROPPED.

## ActionabilityLevers
1. **Reuse-first rule at top of report**: "Before writing new code, check Reuse Catalog; if a util exists, use it; if not, justify why new." Prevents duplication, the #1 plan-vs-impl drift.
2. **Ordered touch list**: implementation sequence (entry point → direct deps → tests → fixtures). Agent can work top-down without re-deriving order.
3. **Per-entry confidence + freshness**: HIGH (re-verified this pass, symbol resolved) / MEDIUM (likely, not re-checked) / LOW (inferred, must verify). Agent uses confidence to decide whether to re-read before editing.
4. **fqSymbolId over line numbers**: line numbers shift; symbol IDs (e.g., `package::Class::method`) are stable and grep-able.
5. **Explicit UNKNOWN list with consequences**: "Could not determine X → agent must verify Y before deciding Z." Closes false-confidence gap.
6. **One-line TL;DR pointer**: "If you read only 3 things, read: Reuse Catalog row N, Integration Point P, Convention C." Cheap, high payoff.
7. **Convention examples, not rules**: each convention is a file:line exemplar (e.g., "errors thrown: see `src/x.ts:42`, shape `class AppError extends Error`"), not prose.
8. **Negative findings surfaced**: "Codebase has NO precedent for streaming output — first-of-kind, expect design questions." Prevents pattern-misidentification failure mode.
9. **Planned-touch dep subgraph only**: dep graph pruned to files within planned change set + 1-hop neighbors. Full graph = noise; pruned = actionable.
10. **Mode-tagged sections**: each section tagged `[planning]`, `[implementing]`, or `[both]` so each consumer can filter to its cut without re-fetch.

## OpenQuestions
1. **Single report vs dual cut**: same data, two filtered views (planning/implementing) — or one report with mode tags? Single source of truth favors one report; consumer UX favors two views. Cost difference is small (re-render filter).
2. **Cache invalidation key**: if report is incremental across iterations, what's the invalidation trigger — git HEAD, file mtime hash, spec folder fingerprint? Wrong key = stale report served as fresh.
3. **Scoping phase vs execution phase**: when consumer is still scoping ("should we even build X?"), report cannot be targeted. Need an explicit "scoping mode" that emphasizes decision history + precedent + UNKNOWNs, and de-emphasizes touch list.
4. **Multi-language / monorepo slicing**: slice per package boundary or per language? Symbol resolution across slices needs a shared index; duplication of REUSE entries across slices is a real risk.
5. **Negative finding weight**: how to score "no precedent for X" — same as a positive finding, or weighted higher because it changes the planning assumption? Affects convergence gating.
6. **Consumer handoff contract**: is the report consumed as raw markdown by a downstream prompt, or parsed into a structured form? Structured is testable but adds schema surface; raw is flexible but un-testable.
7. **Confidence calibration**: how is HIGH/MEDIUM/LOW determined — by re-read success, by freshness probe, by cross-source agreement? Without a defined probe, labels become noise.
8. **Budget policy under pressure**: when budget is tight and not all CORE sections fit, which CORE section is dropped first? Touch list? Reuse Catalog? Need a defined degradation order.
===FINDINGS END===
