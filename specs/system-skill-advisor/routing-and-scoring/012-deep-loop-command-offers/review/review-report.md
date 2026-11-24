---
title: "Deep Review Report: deep-loop command offers, seventh traceability rerun"
description: "Three-lineage fan-out review (DeepSeek V4.1 Flash at max thinking through pi, 7 iterations each) after the twelfth fix round. Verdict FAIL on the coverage and scope gates in one lineage, with 0 P0, 1 P1 and 15 P2."
---

# Deep Review Report: deep-loop command offers, seventh traceability rerun

## 1. Executive Summary

- **Verdict:** FAIL on the `coverage` and `scope` gates, both in lineage 2, with no P0 and one P1.
- **Counts:** 0 P0, 1 P1, 15 P2, no search debt.
- **Gates by lineage:** lineages 1 and 3 pass evidence, scope and coverage (`coverage-complete`). Lineage 2 fails coverage as `traceability-incomplete`, because it recorded the four overlay protocols with gate class `hard` and left `feature_catalog_code` and `playbook_capability` partial, and fails scope as `findings-out-of-scope`, because one finding sits on `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md`, which the scope does not list.
- **Dimensions:** every lineage covered correctness, security and maintainability in one iteration each and traceability in four, so the rewritten focus closed generation 8's `missing-dimensions` failure.
- **What it finds:** the P1 is a gate defect in both copies. `isLoopQuestion` tests the digit iteration count over the whole prompt before it reads the question grammar, so "how do I run a deep review on this? it took 5 iterations last time" reads as a run ask. The P2s are a second clause-break gap ("then" without punctuation), a zero-width character gap, a hook-brief owner check, two reducer projection gaps, drift-guard and fixture coverage, and closure-record drift (CHK-001's REQ count, REQ-011's surfaces, AC-011, AC-028, the open questions, four docs still stating the old no-edit rule).
- **Trend:** the seven traceability reruns found 2, 1, 4, 4, 3, 0 and 1 P1s.
- **Run:** generation 9, a restart of generation 8 (archived at `review-archive/20261124T203829Z`). 3 lineages of `cli-pi` on `deepseek-v4.1-flash-1017` at `--thinking max`, stop policy `max-iterations`, 7 iterations each.

## 3. Active Finding Registry

- **1** (P1), `command-attach.ts:1238`: A digit iteration count in an unrelated trailing clause turns a how-to question into a run ask.
- **F-003-002** (P2), `reduce-state.cjs:374`: A confirmed-clean surface is read as an exhausted direction when the iteration carries no Ruled Out heading.
- **5** (P2), `acceptance-criteria.md:68`: AC-011's verification cell describes an unresolved reference the reference check no longer reports.
- **L1-P2-004** (P2), `acceptance-criteria.md:85`: AC-028 cites the eighth-round row for the eleventh round suite counts.
- **4** (P2), `deep-loop-offer-cases.json:1`: Both suites read the same fixture rows, so a misreading shared by the two copies passes the parity test.
- **F-004-001** (P2), `tasks.md:268`: CHK-001 records a REQ count the tree no longer prints.
- **L1-P2-003** (P2), `tasks.md:268`: CHK-001 still counts 52 requirement rows, and the tree has 53.
- **F-006-001** (P2), `advisor-recommend.md:33`: Four documentation surfaces still state the blanket no-edit rule REQ-040 reversed.
- **L1-P2-002** (P2), `spec.md:235`: REQ-011 names DEPTH_WORDING, a surface the tree no longer carries.
- **F-005-001** (P2), `spec.md:235`: REQ-011 reads as a global drop of autonomous research while four surfaces still carry it.
- **3** (P2), `deep-loop-offer-cases.vitest.ts:691`: The drift guard's coverage test only recognizes Python pattern names ending in _RE and never checks an excused name exists.
- **F-002-001** (P2), `render.ts:231`: The hook brief renders a child-supplied command without the owner check the CLI path applies.
- **L1-P2-005** (P2), `spec.md:390`: The open-questions section still carries a decision the packet has since answered.
- **2** (P2), `command-attach.ts:828`: The past-run outranking reads only punctuation as a clause break, so a run ask introduced by then is swallowed.
- **F-003-001** (P2), `reduce-state.cjs:2404`: The reducer writes a ruled-out direction as a heading and drops the reason that closed it.
- **L1-P2-001** (P2), `command-attach.ts:884`: Zero-width format characters inside a loop phrase still lose the offer.

## 7. Traceability Status

- `spec_code` and `checklist_evidence`: pass in all three lineages. Lineage 2's coverage failure comes from the two overlay protocols it classed as hard.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached`, 7 of 7 iterations in every lineage.
- **Orchestration note:** no lineage wrote a `terminal_gates` row, as the focus asked, so `fanout-run.cjs` marked all three incomplete. The orchestrator ran `terminal-gates.cjs` against each lineage's config, registry and state log and appended the computed row through the gateway (sequence 10 in each). The merged verdict comes from `review-verdict.cjs` on the merge's counts.
- **Per-lineage verdicts:** lineages 1 and 3 pass every gate, lineage 3 carrying the P1. Lineage 2 fails two gates.
- **Sources reviewed:** the 72 files in `fanout-review-scope.txt`.
