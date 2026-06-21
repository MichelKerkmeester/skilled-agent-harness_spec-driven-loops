# Iteration 007 — KQ7: Doc-quality leaderboard/dashboard + per-doc quality SLAs

## Focus

Two operator-facing candidates. (a) A doc-quality leaderboard and dashboard ranking every doc by a composite quality score. (b) Per-doc quality SLAs: each doc carries a target (freshness, completeness, retrievability) and breach triggers an action.

## What the live code actually does

- Quality scores that could feed a leaderboard already exist: the form-only `quality_score` column (`vector-index-schema.ts:643`), the dq-probe DQI scorer, and the ranking-side `specLevel`/`completionStatus`/`hasChecklist` bonuses in `stage2-fusion.ts:277-287`. So a leaderboard is an AGGREGATION VIEW over signals that already exist or are already proposed; it invents no new signal.
- SLA-adjacent signals also exist: `completionStatus`, the FSRS retrievability (freshness), the validator-registry pass/fail. An SLA is a THRESHOLD + an action over those.

## The novel analysis — and the honest limit

1. **A leaderboard/dashboard changes NO reader outcome by itself.** It is pure operator instrumentation. The retrieval reader, the adherence reader, the logic reader never see it; only a human maintainer does. Under the truncation law it is the definition of floor-irrelevant: it neither adds, reorders, nor protects a single returned row. Its value is entirely in steering HUMAN attention to the worst docs — which is real but indirect, and it overlaps heavily with the reuse-first B1 sweep REPORT and the dq-probe DQI output. The novel delta over "the sweep prints a report" is only the persistent ranked VIEW, which is a presentation choice, not a capability.
2. **Per-doc quality SLAs are the same instrumentation with a threshold and a trigger.** The novel part is the binding: a doc declares a target and a breach auto-files a refresh item (into the KQ5 freshness queue / B3 queue). This is slightly more than a dashboard because it CLOSES a loop — but the loop closes onto a report-only queue, never onto an auto-mutation (the rail). So an SLA here is "a named threshold that files a ticket," which is honest governance value but modest.

## Value per reader

- Leaderboard/dashboard: R/A/L all NONE directly; human-maintainer value only, and largely redundant with the B1 sweep report + DQI.
- Per-doc SLAs: L/governance modest (a named, trackable target per doc), R/A none directly.

## Floor survival

Both are floor-irrelevant: they never touch a returned row. They survive the law trivially because they make no retrieval claim — but that same fact caps their value at human instrumentation.

## Go / No-Go

- Doc-quality leaderboard/dashboard: NO-GO as a standalone capability; FOLD into the reuse-first B1 sweep report + dq-probe DQI as a ranked view. It is a presentation of existing signals, not a novel capability, and standing it up separately duplicates the sweep report. The honest verdict: it is the least novel item in the topic.
- Per-doc quality SLAs: GO-on-cost but THIN. Worth it only as a lightweight binding: a per-doc target field (reuse the description.json governance block the reuse-first A8 proposes) plus a breach-files-a-queue-item rule reusing the KQ5/B3 queue. No new machinery; it is a threshold + a ticket. Build only after the queue (KQ5/B3) exists.

## Dead Ends

- A separate quality-dashboard service: duplicates the B1 sweep report and DQI; fold it in.
- SLAs that auto-remediate on breach: crosses the no-body-mutate rail; a breach files a report-only item, nothing more.
- Treating a leaderboard as a reader-facing quality win: it is human instrumentation, floor-irrelevant by definition.

## Sources

- `vector-index-schema.ts:643` (form-only quality_score); dq-probe DQI scorer
- `stage2-fusion.ts:277-287` (specLevel/completionStatus/hasChecklist already feed ranking)
- `fsrs-scheduler.ts` retrievability (the freshness SLA signal)
- Reuse-first A8 (description.json governance block — the host for an SLA target field); B1 sweep report (the leaderboard's natural home)

## Assessment

newInfoRatio 0.34 — both candidates resolve quickly: the leaderboard is the least-novel item (fold into the existing sweep report), per-doc SLAs are a thin GO-on-cost binding over signals and queues that already exist or are already proposed. No new floor-relevant capability here. Novelty is saturating; all 13 candidates now have verdicts.
