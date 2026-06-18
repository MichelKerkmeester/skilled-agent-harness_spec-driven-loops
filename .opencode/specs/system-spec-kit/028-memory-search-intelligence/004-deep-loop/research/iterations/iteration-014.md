# Iteration 14: Round G Completeness Critic — Deep Loop (self-graded newInfoRatio STOP gate unaudited)

## Focus
Round G completeness critic for DEEP LOOP: what did the WHOLE campaign MISS? Read-only.

## Missed items (newInfoRatio 0.45; RESIDUAL_CONFIDENCE 0.72)
| Item | Type | Lev | Evidence |
|---|---|---|---|
| **Self-graded `newInfoRatio` STOP gate is wholly unaudited** — the model REPORTS its own novelty score; the reducer consumes it raw and convergence.cjs:285 gates STOP "pending newInfoRatio agreement," but `computeCompositeScore` (:107-141) has NO newInfoRatio term. The D2/D3 flood thesis hardened only the graph-composite branch; the most gameable input (a model grading its own novelty: over-report→never stops, under-report→stops early) was never examined | internal-gap | **H** | convergence.cjs:285 vs :107-141; SKILL.md:380,386; reduce-state.cjs:763,770,836 |
| Doc-vs-code convergence discrepancy unreconciled — docs describe a 3-signal weighted vote (newInfoRatio 0.30 + MAD 0.35 + entropy 0.35); code's composite is a different formula with NO newInfoRatio term; which surface gates STOP at runtime was never verified | unverified-claim | M | three-signal-model.md:26 vs convergence.cjs:116-127 |
| `content_hash` stored but NOT the dedup key (upsert conflict key is node.id) → Q3 re-dispatch can double-apply findings unless node.id is content-derived (unverified) | unverified-claim | M | coverage-graph-db.ts:461,465,479 |
| Near-dup finding fragmentation inflates flood counts — fanout-merge dedups by exact findingId\|title only, so surface-variant duplicates survive + inflate sourceDiversity/evidenceDepth; D2/D3 reliability WEIGHTING doesn't close a count-inflation vector (it weights, doesn't merge) | internal-gap | M | consolidation.md:110-117; fanout-merge.cjs:216,239 |
| Rule/score-version reprocessing absent — D3 recalibrates the threshold + weights, but nothing tags prior JSONL scores with a rule-version or re-scores on weight change → stale scores mix with new across resumed sessions | unread-external | M | consolidation.md:24-26; grep rule_version=0 |

## Key correction
A genuine **NEW high-leverage gap**: the **self-graded newInfoRatio STOP gate is unaudited** — the entire D2/D3 flood-resistance work hardened the graph composite while the single most gameable STOP input (the model's own novelty self-report) has no verification/bound. (Notably, this very broadening campaign drove its own loop on self-graded newInfoRatios — the gap is real and self-implicating.) Plus content_hash-not-dedup-key (re-dispatch non-idempotency risk) + near-dup fragmentation inflating flood counts.

## Next Focus
NEW candidate for synthesis: **DL-newInfoRatio-audit** (verify/bound the self-graded novelty input to STOP — the keystone the flood thesis omitted). Plus content-hash-as-dedup-key (de-risks Q3 re-dispatch). Feeds the roadmap addendum.
