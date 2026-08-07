# Iteration 25: Round F Verify+Feasibility — Memory Consolidation/Save Remainder

## Focus
Round F verify+feasibility for the iter-13 consolidation/save remainder. Read-only.

## Assessments (newInfoRatio 0.70)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| M-writer-supersedes-hint | PARTIAL | CAUTION | writer-declared oracle-free supersede ALREADY exists via `causal_links.supersedes` (SUPERSEDES edge, existence-only check); only `Origin.supersedes` storage is new, and it overlaps the automatic PE supersede path → two competing supersede mechanisms |
| M-detail-retention-guard | PARTIAL | NEEDS-BENCHMARK | premise partly REFUTED — `ExtractedEntity` has NO confidence field (only text/type/frequency), so the "≥0.9 entities AND mean conf ≥0.6" guard isn't computable today; needs confidence scoring built first |
| M-durable-retry-budget | REAL | CAUTION | retry budget is confirmed in-memory/ephemeral (BoundedMap, MAX_RETRIES=3, no Transient/Fatal split); BUT durability conflicts with the DOCUMENTED intentional process-restart self-heal design. The Transient/Fatal classification alone is clean; bundled durability is the risk |

## Key correction
Memory consolidation remainder is mostly **already-present or design-conflicting**: writer-supersedes exists (overlap risk), detail-retention isn't computable (no entity confidence field), durable-retry conflicts with intentional restart-self-heal. Net survivor: the **Transient/Fatal split** on the retry budget (clean), decoupled from durability.

## Next Focus
Only the Transient/Fatal retry classification is a clean add; the rest overlaps existing mechanisms or conflicts with documented design. Feeds synthesis.
