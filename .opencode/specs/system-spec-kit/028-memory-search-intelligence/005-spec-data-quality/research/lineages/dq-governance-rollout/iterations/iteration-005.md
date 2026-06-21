# Iteration 005 — KQ5: The consolidated NO-GO list and anti-patterns

## Focus

Merge every lineage's NO-GO into one authoritative list, and distill the cross-cutting traps into a set of governance anti-patterns (the meta-NO-GOs that explain WHY each concrete item is rejected).

## The consolidated NO-GO list (merged, de-duplicated, with the deciding reason)

| # | NO-GO item | Deciding reason | Source |
|---|---|---|---|
| 1 | libSQL / DiskANN / sqlite-vec swap | RRF + sqlite-vec already shipped; the swap moves nothing measurable and re-pays the migration | parent |
| 2 | LightRAG incremental set-merge | freshness-only, premature; full rebuild is cheap at this scale, no rollup substrate to keep fresh | parent |
| 3 | Quantization tiers (F8, F1BIT) | premature on a ~2022-row corpus; brute-force scan already sub-ms; a 100k+-vector lever | parent |
| 4 | Ed25519 signing | wrong threat model for single-author local memory; signing buys provenance theatre | parent |
| 5 | A new rollup node type / new index lane | the first-class embedded rollup record already exists; a parallel lane duplicates it + risks a self-referential community cycle | parent + dq-deep |
| 6 | A second / parallel quality scorer or quality DB/lane | extend the live `quality-loop.ts` pure scorer; a parallel scorer risks divergent verdicts | dq-deep + dq-probe |
| 7 | Extend the DESTRUCTIVE `runQualityLoop` onto authored docs | `attemptAutoFix` substring budget-trim amputates 8KB+ docs (005 spec.md is 10.6KB) | dq-automation-impl (corrects dq-deep's literal A1) |
| 8 | Retrieval-driven AUTO-rewriting of authored bodies | reward-hacks a proxy on the source of truth; unprovable per-change; crosses RAIL-1 | dq-novel-oob |
| 9 | Auto-summarization rollup nodes | the rejected new-node-type + an LLM infidelity multiplier on the parent's one net-negative seam | dq-novel-oob |
| 10 | Doc-quality leaderboard / dashboard service | presentation of existing signals, redundant with the B1 sweep report; fold in | dq-novel-oob |
| 11 | Score-changing context-budget optimizer | the qualityScore reranker in disguise; retrieval-class, C2-gated, not novel | dq-novel-oob |
| 12 | CI that auto-commits fixes | corpus-wide blast radius; CI stays report-only | dq-automation-impl |
| 13 | post-merge hook as the PRIMARY sweep trigger | per-dev / unenforced; the corpus property needs a CI `schedule:` | dq-automation-impl |
| 14 | `/doctor memory` or `/memory:manage` as a content-quality tool | read-only by contract; index/DB-hygiene axis, not source-doc quality | dq-probe + dq-deep |
| 15 | `advisor_validate` / `skill_graph_validate` reused as doc DQI | routing/graph-integrity, orthogonal to document quality | dq-probe |
| 16 | Re-spec a skill `[[wikilink]]` validator | already built, fence-aware, exit-coded, AND CI-wired; only the pre-commit timing is missing | dq-skilldoc (corrects dq-probe F5) |
| 17 | Auto-gen `answerable_questions`/`semantic_intent` without building the fusion consumer | dropped no-op on disk (the 028 silent-drop trap) | parent + dq-novel-oob |
| 18 | SLAs that auto-remediate on breach | crosses RAIL-1; a breach files a report-only item only | dq-novel-oob |

## The governance anti-patterns (the ten meta-traps)

Each concrete NO-GO is an instance of one of these. The anti-patterns are the reusable governance lens:

1. **The eval-mode saturation trap.** Promoting a retrieval candidate on eval-mode recall@K or an external @5/@10/@20 benchmark. The K=3 prod floor hides exactly that band. → Read the prod column. (The single most seductive trap; parent §3.)
2. **The silent-drop trap (the 028 trap).** Writing a field with no live consumer; it persists on disk and is dropped from the vector. → Build the consumer or don't write the field.
3. **The destructive auto-fix trap.** Running a content-removing fix on an authored body. → Quarantine to memory-save; authored surface is score+suggest only (RAIL-1).
4. **The net-negative rollup trap.** A rollup that wins a broad query by displacing a real specific child on a mis-classified narrow query. → Measure the narrow-query regression in the SAME pass as the broad-query win. (The one candidate that can go net-negative, not merely inert; parent §3.)
5. **The mixed-vector confound trap.** Trusting a recall number while embedding coverage < 100% under the current version. → Coverage guard + drift monitor first.
6. **The rebuild-shipped-machinery trap.** Re-speccing a validator that already exists + is CI-wired (wikilink), a new prod@3 harness (`run-eval-v2` is already dual-mode), a new quality scorer, a new decay model (FSRS ships). → Grep before building.
7. **The five-engines trap.** Per-surface ad-hoc fix engines that diverge in classification. → One engine + one frozen deny-by-default registry.
8. **The premature-error trap.** Flipping a gate to error before its backfill clears. → WARN → backfill → re-measure to zero → ERROR.
9. **The change-triggered blind spot.** Relying only on pre-commit + CI path-gates; latent defects in untouched files and cross-surface coherence escape. → The scheduled sweep is the only tier that catches all three escape classes at once.
10. **The proxy-as-truth trap.** Treating a high form-only quality score as a retrieval win, or a quality target (SLA) as auto-remediable. → Proxies gate report-only.

## The anti-pattern that subsumes the rest

The deepest one is #1 + #10 together: **mistaking a proxy or an off-floor metric for the prod reader's outcome.** Every retrieval NO-GO and every CONDITIONAL freeze traces back to it. The governance counter is RAIL-2 made into a review boundary: a release reviewer reads the prod-mode completeRecall@3 column or repeats the 028 saturation mistake.

## Dead Ends

- Treating the NO-GO list as a static blocklist. It is a derived consequence of the ten anti-patterns; a new candidate is judged by which anti-pattern it would trip, not by list membership.
- Re-litigating items 7/16 (the cross-lineage corrections). They are settled: the destructive loop is quarantined; the wikilink validator is not rebuilt.

## Sources

- `../../research.md` §2 Tier NO-GO, §3 (net-negative caution)
- `../dq-deep/research.md` §4, Tier D NO-GO
- `../dq-automation-impl/research.md` §6 (eliminated alternatives)
- `../dq-novel-oob/research.md` §2 Tier NOVEL-NO-GO, §5
- `../dq-probe/research.md` §4; `../dq-skilldoc-cmd-ctx/research.md` §5 (wikilink correction)

## Assessment

newInfoRatio 0.40 — the NO-GO consolidation is largely a merge of known items, so novelty drops. The new contribution is the ten anti-patterns as the GENERATIVE lens: the concrete list is a derived consequence, and a future candidate is judged by which anti-pattern it trips. The two cross-lineage corrections (items 7, 16) are folded in as settled NO-GOs.
