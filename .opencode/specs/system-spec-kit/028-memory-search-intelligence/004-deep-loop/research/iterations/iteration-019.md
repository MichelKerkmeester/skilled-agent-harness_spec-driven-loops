# Iteration 19: Round J Build Sequence — Deep Loop (D2 keystone is the long pole)

## Focus
Round J: the ordered build sequence for Deep Loop. Read-only.

## Build sequence (newInfoRatio 0.32)
| Phase | Candidates | Note |
|---|---|---|
| 0 (Wave-0) | Q6-anchor-FIX (template-only), DL-order-independent-merge-tiebreak | true leaf changes, fully reversible |
| 1 (foundation) | DL-failure-class-taxonomy, DL-pool-backlog-gauges, DL-graceful-self-stop | the orchestration-status.log ledger + un-flattened error class that Phase 2 consumes |
| 2 | Q3-fanout-recovery, DL-orphan-lineage-reset (lease/heartbeat first), DL-newInfoRatio-audit | Q3⟵failure-class; orphan-reset⟵gauges+failure-class; newInfoRatio-audit⟵benchmark |
| 3 | D2-reliability (keystone), Q2-quarantine | D2⟵Beta posterior (shared w/ C4) + benchmark; Q2⟵D2 EXISTS (NO-GO otherwise) |

**Critical path:** Beta-posterior (shared w/ C4) → D2 scoring → D2 benchmark gate → Q2-quarantine. D2 is the long pole (WHOLLY ABSENT, must out-earn existing confirmations/relevance signals) — kick off in PARALLEL with Phase 0/1; everything else ships independently and earlier.

## Key note (per J7 re-verify)
- DL-order-independent-merge: WEAKER-THAN-CLAIMED — `finding.id` is NOT always present (key is `id || title`), and it's first-seen-wins Map dedup (fanout-merge.cjs:123-131), NOT a tiebreak comparator. The fix still needs `labelDirs.sort()` (:335) PLUS a proper total comparator on a stable key.
- DL-failure-class-taxonomy: WEAKER — nothing COMPUTES a timeout/exit class in `settleItem`; it flattens to {name,message}. The class is computed UPSTREAM in fanout-run (:484-487) and dropped at the pool boundary — so the fix is "stop flattening + surface the upstream class," not "un-discard a pool-computed class."

## Next Focus
Feeds the roadmap re-sync (Deep Loop build order; D2 as the parallel long pole) + the DL-merge/failure-class evidence corrections.
