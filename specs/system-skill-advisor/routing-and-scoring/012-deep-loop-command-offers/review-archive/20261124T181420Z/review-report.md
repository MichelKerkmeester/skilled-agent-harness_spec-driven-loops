---
title: "Deep Review Report: deep-loop command offers, third traceability rerun"
description: "Three-lineage fan-out review (DeepSeek V4.1 Flash at max thinking through pi, 7 iterations each) after the eighth fix round. Verdict FAIL on the coverage and scope gates, with 0 P0, 4 P1 and 16 P2."
---

# Deep Review Report: deep-loop command offers, third traceability rerun

## 1. Executive Summary

- **Verdict:** FAIL on the `coverage` and `scope` gates, no P0.
- **Counts:** 0 P0, 4 P1, 16 P2, 1 search debt item.
- **Gates by lineage:** lineage 2 passes every gate, coverage `coverage-complete`. Lineage 3 fails coverage as `traceability-incomplete`. Lineage 1 fails scope (`findings-out-of-scope`) and coverage (`traceability-incomplete`).
- **What it finds:** three P1s in the gate's word rules (a no-edit clause withholding a read-only offer, a refused loop phrase still supplying the mode cue, and REQ-026's deferred-route guard never running for its own prompt), one P1 in REQ-035's plural-prompt promise, eleven code P2s (word-rule edge cases, the strategy updater in the review reducer, the duplicate-command guard) and five doc P2s on evidence cells.
- **Trend:** the three traceability reruns found 2, 1 and 4 P1s. Each fix round closes what the last review named, and each review finds new edge cases in the gate's word rules, so the loop is not converging toward a clean pass.
- **Run:** generation 5, a restart of generation 4 (archived at `review-archive/20261124T111600Z`). 3 lineages of `cli-pi` on `deepseek-v4.1-flash-1017` at `--thinking max`, stop policy `max-iterations`, 7 iterations each.

## 3. Active Finding Registry

- **ITER6-P1-001** (P1), `command-attach.ts:1424`: A no-edit clause withholds a read-only deep-loop offer.
- **ITER3-P1-001** (P1), `command-attach.ts:1489`: A refused loop phrase still supplies the mode cue, so the gate can offer the exact command the prompt refused.
- **ITER1-P1-001** (P1), `command-attach.ts:1408`: REQ-026's deferred-route guard never runs for the prompt it was built for.
- **ITER1-P1-002** (P1), `spec.md:326`: REQ-035 promises a command for eight plural run prompts; two carry none anywhere.
- **R5-P2-002** (P2), `reduce-state.cjs:2363`: A direction ruled out once is rendered as a blocked approach that must not be retried.
- **R5-P2-001** (P2), `reduce-state.cjs:2396`: The strategy updater duplicates a machine-owned heading it was meant to normalize.
- **R6-P2-001** (P2), `advisor-recommend.ts:412`: The duplicate-command guard cannot withhold a command.
- **R1-P2-001** (P2), `command-attach.ts:566`: A pronoun rerun after a symptom is read as a doctor ask.
- **R4-P2-001** (P2), `command-attach.ts:931`: An effort word after the loop name withholds the command even when it is a manner on the request.
- **ITER2-P2-001** (P2), `acceptance-criteria.md:72`: AC-015's evidence line proves the question-tool convention, not the three placements it claims.
- **ITER2-P2-003** (P2), `acceptance-criteria.md:76`: AC-019's Then clause and its own observation disagree on the near-miss count.
- **ITER2-P2-002** (P2), `acceptance-criteria.md:98`: AC-041 and T082 cite a blank line and a neighbouring line for two closure claims.
- **ITER1-P2-003** (P2), `command-attach.ts:563`: A past-run summary carries a doctor run command.
- **ITER4-P2-001** (P2), `command-attach.ts:1401`: A typed /doctor:deep-loop after a comma is read as a mention, not a request.
- **ITER5-P2-002** (P2), `command-attach.ts:450`: Four surfaces each carry their own mode vocabulary, and nothing checks that they agree.
- **ITER3-P2-002** (P2), `command-attach.ts:1489`: Two non-command asks share the plural/cue gap and lose the offer silently.
- **ITER5-P2-001** (P2), `deep-loop-offer-cases.vitest.ts:68`: The drift guard compares vocabulary, not the grammar that carries the exceptions.
- **R2-P2-002** (P2), `acceptance-criteria.md:135`: AC-040 says review/ still holds the pre-fix report, but the report is archived.
- **R2-P2-001--1a841a5ce836** (P2), `acceptance-criteria.md:98`: AC-041's evidence cell cites three lines that do not hold its content.
- **R2-P2-001--f7ce309ae6ab** (P2), `acceptance-criteria.md:58`: Acceptance evidence cells point one row above the closure-pass and limitation rows they cite.

## 7. Traceability Status

- `spec_code` and `checklist_evidence`: complete in lineage 2, incomplete in lineages 1 and 3.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached`, 7 of 7 iterations in every lineage.
- **Orchestration note:** lineage 1 ran all 7 iterations but recorded no `terminal_gates` row, so the runner marked it failed. The orchestrator ran `terminal-gates.cjs` against the lineage's own config, registry and state log and appended the result through the gateway (sequence 10). That row is the one this report cites.
- **Per-lineage verdicts:** FAIL in all three by strongest restriction. Lineage 2 alone has no failed gate.
- **Sources reviewed:** the 46 files in `fanout-review-scope.txt`.
