# Iteration 002 — KQ2: The migration plan for the existing corpus

## Focus

The corpus is not green-field; it carries known defects and a legacy-grandfathered escape hatch. The migration plan is the discipline that takes the existing corpus from its measured Stage-0 state to a fully-gated state WITHOUT breaking the legacy corpus mid-flight. Three mechanisms: warn-then-error staging, backfill ordering, and the coverage-guard gate.

## The four-beat per-gate discipline (it does not compress)

Every prior lineage independently arrives at the same per-gate beat. Consolidated, no gate may skip a beat:

1. **WARN** — land the rule default-off / warn-only; emit a report, never block. (parent Stage 2; dq-skilldoc "default-off warn-only report first"; dq-automation-impl Stage 2.)
2. **BACKFILL** — dry-run report → batched apply through the existing additive write paths (`backfill-frontmatter.ts:131-144` contract: `--dry-run` default / `--apply` / `--report` / `--roots` / `--limit`). (parent Stage 4; dq-automation-impl Stage 7.)
3. **RE-MEASURE TO ZERO** — re-run the warn report; confirm the corpus-wide failing count is 0 before promotion. (parent Stage 2 checkpoint "warn report shows 0 corpus-wide.")
4. **ERROR** — flip warn→error; drop the dormant bypass; verify a deliberately-corrupted scratch packet now exits 2. (parent Stage 3; dq-automation-impl Stage 6.)

This is the answer to "warn-then-error staging": it is not one flip, it is four beats per gate, and BACKFILL sits between WARN and ERROR by hard dependency edge #3.

## The Stage-0 census (the measurement that the migration is built on)

The migration cannot be planned until the real corpus band is counted. The census (S0) is the prerequisite for every later count-to-zero. Known starting numbers already confirmed by prior lineages:

- 11 invalid graph files on the live root, each opening with `Packet:` as plain text instead of JSON, each mis-detected as a Level-1 spec folder (parent Stage 1).
- 0 `legacy_grandfathered` packets — the escape hatch is dormant, so it can be DELETED at the ERROR beat with zero blast radius (parent N7).
- frontmatter/continuity gaps from the dry-run report (parent Stage 4).
- version-grammar divergence: 20 SKILL.md hits, 2 grammars (4-part vs 3-part); only 1/20 carries `argument-hint` (dq-skilldoc S1).
- the per-detector corpus-wide failure counts for the per-surface detectors (D/E/F command checks, trigger-vocab deltas) — explicitly "asserted, not counted" by every prior lineage and DEFERRED to this census.

The census is read-only; it is the only stage with no rollback because it mutates nothing.

## The backfill ordering (which backfill before which gate)

Backfills are not interchangeable; each gate has its own backfill, and they run in the master-sequence order:

| Gate (warn→error) | Its backfill | Runs at |
|---|---|---|
| Invalid-graph-JSON | regenerate valid JSON or remove the stray files | S2 (one-shot, pre-engine) |
| JSON-schema / enum / shape | enum case-normalize + frontmatter→description trigger propagation (the safe-class fixes) | S7 |
| Frontmatter / continuity | `backfill-frontmatter.ts` batched apply through the description/continuity refresh paths | S7 |
| Per-surface (S/C/X) detectors | scope-widen + the detector's own deterministic safe fix where one exists | S7, per detector |

The rule: a gate's backfill ALWAYS precedes its error-flip; the error-flip ALWAYS waits for that gate's re-measure-to-zero. Gates whose backfill has not cleared stay at warn indefinitely — absence of a clean backfill is not a reason to promote, it is a reason to hold.

## The coverage-guard gate (the retrieval-half migration, distinct from the doc-gate migration)

The doc-gate migration (above) is floor-bypassing and ships on cost. The RETRIEVAL migration is a different mechanism entirely and is gated on a guard that does not exist yet:

- The header-path prefix and every retrieval candidate require a FULL re-embed. Partial coverage mixes prefixed and unprefixed vectors under the 3-result floor and confounds every delta (parent Stage 5).
- The guard: a new `embedding_context_version` column + a coverage readout = chunks-embedded-under-current-version / total-chunks. This guard is NET-NEW — `grep embeddingCoverage|coverageThreshold` is empty (parent N7). It is a build dependency for S16, not a flag.
- The dual-cache-key gotcha: the strategy version must be folded into BOTH the persistent cache PK (`embedding-cache.ts:157`) AND the in-process LRU (`shared/embeddings.ts:309-311`), or the re-embed no-ops (parent CONDITIONAL tier).
- The migration rule: refuse to publish or trust any recall number while coverage < threshold. The drift monitor (N6a, S9) is the standing instrument that makes this rule enforceable corpus-wide.

## The legacy-corpus safety invariant

The single migration invariant that protects the existing corpus: **no new hard rule is introduced until its backfill report reads zero.** The legacy corpus predates every rule; a rule that errors before its backfill clears would break unrelated existing packets. This is why the `legacy_grandfathered` bypass stays in place through WARN and BACKFILL and is deleted only at ERROR, after the re-measure confirms 0 packets depend on it.

## Dead Ends

- Compressing warn→error into a single flip "because the corpus looks clean." The census exists precisely because the corpus band is asserted-not-counted; flipping on an assumption is the premature-error trap.
- Treating the retrieval re-index as part of the doc-gate migration. They are disjoint: the doc migration ships on cost; the retrieval migration is frozen behind the coverage guard + C2.

## Sources

- `../../research.md` §4 (Stages 0-5: census, invalid-graph sweep, warn, error, backfill, coverage guard)
- `../dq-automation-impl/research.md` §4 (Stages 0,2,6,7 build instantiation), B1 backfill contract (`backfill-frontmatter.ts:131-144`)
- `../dq-skilldoc-cmd-ctx/research.md` §6 (asserted-not-counted; default-off warn-only first)
- `embedding-cache.ts:157`; `shared/embeddings.ts:309-311` (dual-cache-key); parent N7 (coverage guard absent)

## Assessment

newInfoRatio 0.80 — the migration plan resolves into the four-beat per-gate discipline + the Stage-0 census + the distinct coverage-guard mechanism for the retrieval half. The key consolidation: the doc-gate migration and the retrieval migration are TWO migrations with different gates, not one. The legacy-corpus invariant (no error before backfill-zero) is the single rule that protects the existing corpus.
