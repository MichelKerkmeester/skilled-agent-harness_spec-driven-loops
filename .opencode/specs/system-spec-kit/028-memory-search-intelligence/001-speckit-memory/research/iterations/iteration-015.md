# Iteration 15: External Mining — aionforge core-memory.md + procedural-memory.md → Memory

## Focus
Round B mining: core-memory + procedural-memory for NET-NEW Memory candidates. Read-only. **Procedural memory is a genuinely under-covered area** — internally `procedural` is only a decay/classification label, no track-record machinery.

## Findings — NET-NEW candidates (5; newInfoRatio 0.60)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| procedural-reliability-weighted-recall (record success/fail outcome counters; recall multiplies match by Beta-posterior mean, weak Beta(1,1)→unproven=0.5) | memory-types.ts:93 (decay-only label, no counters) | M/M | BUILD | CONFIRMED-gap |
| bad-pattern-negative-procedural-memory (record_failure stores immutable BadPattern linked HAS_FAILURE, surfaced WITH the procedure before reuse; recall penalty when failure-embedding matches) | causal-edges.ts:72 (edge infra exists; no failure class) | H/M | BUILD | INFERRED |
| skill-induction-from-repetition (off-by-default pass captures an episode recurring ≥3× as a verbatim procedure; content-addressed id; never auto-promoted across trust boundary) | reconsolidation.ts:38 (merge/conflict/complement; no induce) | H/L | BUILD | CONFIRMED-gap |
| never-truncate-always-surface-prefix (the identity/constitutional prefix counts toward limit but is NEVER itself capped — vs a silent truncation) | vector-index-queries.ts:435-436 (constitutional_results.slice(0,limit) silently truncates) | M/S | FIX | CONFIRMED |
| procedural-version-deprecate-reset-track-record (a contract-surface change cuts a new version, deprecates prior atomically, RESETS reliability to zero; description-only edits don't version) | reconsolidation.ts (merges in place, no versioning) | M/L | BUILD | INFERRED |

**Already covered:** core-memory "identity always in context" ≈ constitutional/is_pinned always-surface (maps to C-G core-memory items); `procedural` decay label + per-type decay ≈ retrieval/decay FIX-cluster; stale-embedding-on-edit ≈ memory_embedding_reconcile; reconsolidation merge/conflict/complement ≈ consolidation roadmap.

## Synthesis note
**The never-truncate-always-surface-prefix is a confirmed FIX** (vector-index-queries.ts:435-436 silently slices the constitutional always-surface set to `limit`). The procedural cluster (reliability-weighted recall + bad-pattern + skill-induction) is a coherent under-covered Memory capability — bad-pattern/negative memory (H) and skill-induction (H/L, off-by-default) are the leads.

## Next Focus
Procedural-memory cluster is genuinely net-new. Open: does any roadmap C-item scope a read-hit/usefulness feedback signal (the natural host for procedural reliability)? → Round C. Round B near-converged.
