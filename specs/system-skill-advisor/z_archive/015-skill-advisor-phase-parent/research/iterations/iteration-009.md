# Iteration 9: External Mining — galadriel harness → Skill Advisor (mostly saturated)

## Focus
Round B mining: galadriel harness (palace search/taxonomy, scheduler reflection) for NET-NEW Skill Advisor candidates. Read-only.

## Findings — NET-NEW candidates (3; newInfoRatio 0.25 — mostly saturated)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| scoped-hard-filter-with-documented-lane-degradation (a category-scoped query bypasses full fusion to a native topic filter, explicitly documenting the dropped lanes) | advisor-recommend.ts:167 (category_hint emitted, soft-boost only) | M/S | BUILD | INFERRED |
| keyword-derived-category-fallback + declared-vs-derived drift check (derive category from SKILL.md keywords when absent; FLAG drift when declared ≠ content-derived) | derived/extract.ts; skill-graph/status.ts:103-106 | L/M | FIX | INFERRED |
| scheduler-driven ambient recalibration tick (idempotent (date,slot) fire keys, grace window, bounded fired-set — IF a periodic promotion/recalibration tick is ever wanted) | GAP (advisor daemon is request-scoped) | L/M | BUILD | INFERRED |

**Already covered / saturated:** category facet + category-distribution surface (skill-graph/status.ts ≈ galadriel taxonomy()); ambiguity clustering + abstention; keyword→skill explicit/lexical mapping (≈ galadriel keyword halls); C1-C5/QCR/C4 + trust/promotion cluster.

## Honest bottom line
galadriel is **largely saturated for the advisor** — its core "hall auto-classification + taxonomy" already has internal analogs. The 3 candidates are honest residue; strongest is scoped-hard-filter (M/S). The scheduler-tick reusable residue (idempotent-fire/bounded-set infra) feeds the trust/promotion cluster IF a periodic recalibration tick is wanted.

## Next Focus
galadriel saturating for advisor. Advisor net-new is concentrated in the trust/promotion gate cluster (iter-7) + the contamination/drift families (iter-8). Round B converging → Round C.
