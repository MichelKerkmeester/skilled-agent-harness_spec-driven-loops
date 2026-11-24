---
title: "Deep Review Report: deep-loop command offers, traceability rerun"
description: "Three-lineage fan-out review (DeepSeek V4.1 Flash at max thinking through pi, 5 iterations each) with traceability as its focus, run after the sixth fix round. Verdict FAIL on the coverage gate, with 0 P0, 2 P1 and 12 P2, almost all of them closure-doc drift."
---

# Deep Review Report: deep-loop command offers, traceability rerun

## 1. Executive Summary

- **Verdict:** FAIL. The `coverage` gate fails, and there is no P0.
- **Counts:** 0 P0, 2 P1, 12 P2, 1 search debt item.
- **Why it fails:** both P1s are closure-doc statements that contradict the built tree, so `spec_code` cannot finish. Lineages 2 and 3 record `traceability-incomplete`, and lineage 1 records `coverage-too-young`.
- **What it does not find:** no defect in the code the sixth round changed. Every finding is in packet docs, the changelog or the coverage of the TS/Python vocabulary drift guard.
- **Run:** generation 3, a restart of generation 2 (archived at `review-archive/20261124T090549Z`). 3 lineages of `cli-pi` on `deepseek-v4.1-flash-1017` at `--thinking max`, stop policy `max-iterations`, 5 iterations each.

## 2. Planning Trigger

The two P1s block task T084 and AC-040, which wait on this review finishing `spec_code` and `checklist_evidence`. A seventh fix round should correct the closure docs and widen the drift guard, then rerun this review.

## 3. Active Finding Registry

### P1

- **R1-P1-001**, `implementation-summary.md:247`: limitation 8 places the gap in the wrong layer. The Python gate (`_apply_deep_loop_offer_gate`) keeps the run row whenever `asks_for_loop_run` is true, typed or not. The command is lost later: `analyze_request` serves the `system-deep-loop` hub, and `degradedRecommendations` attaches only a typed command. The served fallback brief still carries no command for an untyped ask. The gap is real and predates the round, but the limitation's wording is wrong.
- **R3-P2-001** (raised P1 on refinement), `spec.md:223`: REQ-011 is contradicted by the tree and no acceptance row owns it.

### P2

- **R3-P2-003--f5960ef9e383**, `spec.md:223`: REQ-011 names a third hub alias the tree does not carry, and no ADR amends it.
- **R3-P2-003--9fc68403427e**, `tasks.md:36`: a ticked task's stated verification no longer holds.
- **R4-P2-001--17d99d69800b**, `acceptance-criteria.md:89`: AC-032 and T069 cite a blank line for `typedCommandIn`.
- **R3-P2-002** and **R4-P2-004**, `acceptance-criteria.md:58`: eleven to thirteen Met rows cite an `implementation-summary.md` line that does not hold their evidence. These are one issue.
- **R4-P2-002**, `implementation-summary.md:13`: the continuity metadata of both closure docs predates the sixth round.
- **R3-P2-004** and **R4-P2-001--83aef84e72cd**, `.skilled/changelog/skilled/v4.2.0.0.md:759`: the changelog quotes the fifth-round advisor suite count. One issue.
- **R5-P2-001** and **R1-P2-002**, `command-attach.ts:580` and `deep-loop-offer-cases.vitest.ts:62`: the drift guard does not see the refusal-lead alternation (`RUN_ASK_NEGATED_SOURCE`), which is inline in both copies. One issue.
- **R1-P2-001**, `deep-loop-offer-cases.vitest.ts:206`: the per-entry fixture rule covers three of the five lists REQ-031 names. `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS` have no per-entry case check.
- **R5-P2-005**, `command-attach.ts:592`: two constants are duplicated as literals in both copies with no parity assertion.

## 4. Remediation Workstreams

1. **Closure docs:** reword limitation 8 to the layer the gap is in, amend or retire REQ-011 with an ADR and an owning AC row, repoint every AC evidence cell and the T069 citation to the line that holds its evidence, fix the ticked task at `tasks.md:36`, refresh the continuity metadata and correct the changelog count.
2. **Drift guard:** export the refusal-lead alternation as a list on both sides and add it to the drift table, extend the per-entry rule to the two missing lists, and pin the two duplicated constants.
3. **Rerun this review** with the same focus, so T084 and AC-040 can close.

## 5. Spec Seed

No new requirement. REQ-011 needs an amendment or a recorded retirement, and REQ-031's coverage claim needs the two missing lists.

## 6. Plan Seed

One docs pass and one code pass of the drift guard, each checked by the advisor suites and `validate.sh --strict`, then this review again.

## 7. Traceability Status

### Core Protocols

- `spec_code`: partial in lineages 2 and 3, because of the two P1s. Lineage 1 mapped REQ-001 to REQ-034 and ADR-005 and ADR-006 but its coverage gate read the run as too young.
- `checklist_evidence`: still incomplete, because of the AC evidence pointers above.

### Overlay Protocols

Recorded per lineage in each `lineages/*/review-report.md`. None is a gate here.

`AC_COVERAGE`: advisory. AC-032, AC-040 and the Met rows citing `implementation-summary.md` are the rows this review contradicts.

## 8. Deferred Items

- Known limitations 1 to 7 were treated as known context.
- The pre-existing fallback gap behind limitation 8 is not a finding of this review. Only the limitation's wording is.

## Dimension Expansion Map

No pivots ran: convergence mode `default`, stop policy `max-iterations`.

## 9. Search Ledger

One search debt item is open in the merged registry. Per-lineage search ledgers are in `lineages/*/deep-review-state.jsonl`.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached` in every lineage, 5 of 5 iterations each, all four dimensions covered.
- **Terminal gates:** evidence pass and scope pass in all three lineages. Coverage fails: `traceability-incomplete` in lineages 2 and 3, `coverage-too-young` in lineage 1.
- **Orchestration note:** the first runner pass rejected lineage 1, because its iteration 4 record claims 09:24:30 while the gateway committed it at 09:15:00 and the lineage process ended at 09:19:17. The model wrote a wrong timestamp into a real iteration. A rerun with `--only-lineage deepseek-max-1` marked the lineage `skipped_complete`, so its five iterations stand as written. Its terminal gate row reads run 6, which matches the timestamp fault.
- **Per-lineage verdicts:** FAIL in all three. The merged verdict uses strongest restriction plus the failed coverage gate.
- **Sources reviewed:** the 46 files in `fanout-review-scope.txt`, the previous 32 plus every file the sixth round touched.
