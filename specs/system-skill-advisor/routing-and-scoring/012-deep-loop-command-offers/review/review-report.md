---
title: "Deep Review Report: deep-loop command offers, fifth traceability rerun"
description: "Three-lineage fan-out review (DeepSeek V4.1 Flash at max thinking through pi, 7 iterations each) after the tenth fix round. Verdict FAIL on the coverage gate in one lineage, with 0 P0, 3 P1 and 14 P2."
---

# Deep Review Report: deep-loop command offers, fifth traceability rerun

## 1. Executive Summary

- **Verdict:** FAIL on the `coverage` gate, no P0.
- **Counts:** 0 P0, 3 P1, 14 P2, no search debt.
- **Gates by lineage:** lineages 1 and 2 pass every gate, coverage `coverage-complete`. Lineage 3 passes evidence and scope and fails coverage as `traceability-incomplete`.
- **What it finds:** one word-rule gap in both gate copies (whitespace other than one plain space inside a loop phrase withholds the command), a scope-definition gap (the seeded review scope omits twelve declared change-set files, so `spec_code` cannot close on four requirements without failing the scope gate), the open rerun requirement itself, and fourteen P2s on closure records, the drift guard's pattern coverage, a negated refusal and the reducer's next-focus projection.
- **Trend:** the five traceability reruns found 2, 1, 4, 4 and 3 P1s. This is the first rerun in which two lineages reach `coverage-complete`.
- **Run:** generation 7, a restart of generation 6 (archived at `review-archive/20261124T190150Z`). 3 lineages of `cli-pi` on `deepseek-v4.1-flash-1017` at `--thinking max`, stop policy `max-iterations`, 7 iterations each.

## 3. Active Finding Registry

- **R4-P1-001** (P1), `command-attach.ts:949`: A doubled space, a tab, a line break or a non-breaking space inside a loop phrase withholds the command, in both gate copies, and no fixture case can catch it.
- **R1-P1-001--df04abfdb93e** (P1), `spec.md:257`: REQ-033's coverage rerun is a required P1 that is neither met nor deferred.
- **R1-P1-001--b9b038cc9d99** (P1), `spec.md:161`: The seeded review scope omits the files four requirements change, so spec_code cannot close on them without failing the terminal scope gate.
- **R6-P2-001--e31518f8a476** (P2), `command-attach.ts:766`: A negated refusal reads as a refusal in both gate copies.
- **R2-P2-001--d272dc5c9910** (P2), `acceptance-criteria.md:77`: AC-020 reads Met while its own verification says the evidence it needs is not in the packet, and REQ-013 rests on the same unkept record.
- **R4-P2-001--9608e620ea00** (P2), `acceptance-criteria.md:91`: AC-034's CLI head scores have no artifact, and the one recorded head shows the pre-fix result.
- **R1-P2-001--9391e82528c7** (P2), `acceptance-criteria.md:97`: AC-040 evidence pointer names the live report path that this rerun restart has already archived.
- **R1-P2-001--cee369c7b4d0** (P2), `acceptance-criteria.md:97`: AC-040's evidence cell cites a review report the packet's restart archived.
- **R2-P2-001--e6534aeee707** (P2), `acceptance-criteria.md:97`: AC-040's evidence cell points at a review report this restart archived.
- **R3-P2-001--279f52d37ee5** (P2), `acceptance-criteria.md:101`: AC-044 and T088 still count thirteen plural loop-name rows where the fixture holds twenty-one.
- **R1-P2-002** (P2), `spec.md:255`: REQ-031's 'every word list' promise is wider than the drift guard it names.
- **R3-P2-001--e01337669dcd** (P2), `tasks.md:184`: T092's no-stale-count claim fails on two counts in its own file.
- **R6-P2-001--3aa740d4e4c5** (P2), `spec.md:195`: The declared change set stops at REQ-046 while its rows serve REQ-047 and REQ-048.
- **R6-P2-002** (P2), `deep-loop-offer-cases.vitest.ts:434`: The drift guard compares one regex pattern while the fallback hand-mirrors eighteen.
- **R6-P2-001--fd1b29976256** (P2), `deep-review-strategy.md:171`: The reducer Next Focus projection captures the iteration verdict and flattens the focus block.
- **R3-P2-002** (P2), `tasks.md:206`: The tail-check script T104 names is not in the tree.
- **R4-P2-001--dac3ea5af011** (P2), `implementation-summary.md:261`: The tenth round's citation claim names a checker that does not exist.

## 7. Traceability Status

- `spec_code` and `checklist_evidence`: complete in lineages 1 and 2, incomplete in lineage 3.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached`, 7 of 7 iterations in every lineage.
- **Orchestration note:** the runner rejected lineage 1 because a model-written timestamp on iteration 2 fell after the process ended, and a single-lineage rerun read it as `skipped_complete`. Lineage 3 ran all 7 iterations but recorded no `terminal_gates` row. The orchestrator ran `terminal-gates.cjs` against the lineage's own config, registry and state log and appended the result through the gateway (sequence 10).
- **Per-lineage verdicts:** lineages 1 and 2 have no failed gate. Lineage 3 fails coverage only.
- **Sources reviewed:** the 54 files in `fanout-review-scope.txt`.
