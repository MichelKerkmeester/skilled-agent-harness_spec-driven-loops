---
title: "Deep Review Report: deep-loop command offers, eighth traceability rerun"
description: "Three-lineage fan-out review (DeepSeek V4.1 Flash at max thinking through pi, 7 iterations each) after the thirteenth fix round. Verdict FAIL on the coverage gate in all three lineages, with 0 P0, 4 P1 and 13 P2."
---

# Deep Review Report: deep-loop command offers, eighth traceability rerun

## 1. Executive Summary

- **Verdict:** FAIL on the `coverage` gate, with no P0 and four P1s.
- **Counts:** 0 P0, 4 P1, 13 P2, no search debt.
- **Gates by lineage:** every lineage passes evidence and scope and covers all four dimensions. Every lineage fails coverage as `traceability-incomplete`, because each left a core protocol partial or failed on findings of its own. No lineage classed an overlay protocol as hard and no finding fell outside the scope, so the generation 10 focus closed generation 9's lineage-behaviour failures.
- **What it finds:** four P1s. A refused run ask in a loop question's later clause reads as the run the question asks for. A plain loop question whose auxiliary or "how long" shape is outside the question grammar still serves `/deep:review`. The hook brief vets a child-supplied command but keeps the child's policy and owner, where the CLI takes both from the tracked table. The review reducer publishes `findingClass`, `scopeProof` and `affectedSurfaceHints` as null when a delta row omits them. The P2s are two reducer projection gaps from the thirteenth round's own change, the brief test's blind spot, the routed-mode substitution missing from two docs and REQ-047, and closure-record counts in four acceptance rows, the continuity metadata, T053, the lib README and the v4.2.0.0 changelog.
- **Trend:** the eight traceability reruns found 2, 1, 4, 4, 3, 0, 1 and 4 P1s.
- **Run:** generation 10, a restart of generation 9 (archived at `review-archive/20261124T214500Z`). 3 lineages of `cli-pi` on `deepseek-v4.1-flash-1017` at `--thinking max`, stop policy `max-iterations`, 7 iterations each.

## 3. Active Finding Registry

- **R1-P1-001** (P1), `command-attach.ts:1236`: A plain question about the loop still serves /deep:review when its auxiliary or its "how long" shape is outside the question grammar.
- **L1-P1-001** (P1), `command-attach.ts:1303`: A refused run ask in the question's later clause is read as the run the question asks for.
- **R3-P1-001** (P1), `skill-advisor-brief.ts:191`: The hook brief keeps the child policy and owner on a tracked command while the CLI path takes both from the tracked table.
- **R2-P1-001** (P1), `reduce-state.cjs:713`: The reducer publishes findingClass, scopeProof and affectedSurfaceHints as null for a finding whose delta row omits them.
- **L3-P2-001** (P2), `reduce-state.cjs:2396`: A ruled-out reason that quotes a spaced -- inside a code span is cut in two.
- **R3-P2-001** (P2), `advisor-recommend.md:33`: Both in-scope docs omit the routed-mode substitution, so they describe a routed deep-loop route as serving the route's mode.
- **R1-P2-001** (P2), `acceptance-criteria.md:66`: Four acceptance rows state the Python suite prints cases=359 on the final tree, while the shared fixture holds 368.
- **R4-P2-001--5a2f12fc0d2f** (P2), `command-attach.ts:1747`: REQ-047's both-copies clause does not hold on a routed single-target route.
- **L7-P2-001** (P2), `tasks.md:114`: T053 still says AC-008 reads Met, while the row reads Waived.
- **L3-P2-002** (P2), `brief-command-owner-check.vitest.ts:113`: The brief ownership test cannot tell the child's policy and owner from the tracked table's.
- **L4-P2-001** (P2), `implementation-summary.md:13`: The continuity metadata still names generation 8 as the latest round.
- **L2-P2-001** (P2), `skill-advisor-brief.ts:191`: The hook brief vets a child-supplied command but still trusts the child's policy and owner.
- **R4-P2-001--0dfdc05e60e3** (P2), `README.md:146`: The module README states the stuck-run doctor rule without the run-refusing exception REQ-024 built.
- **R5-P2-001--d21a2a836cdb** (P2), `v4.2.0.0.md:759`: The v4.2.0.0 changelog quotes the eleventh round suite and fixture counts while the final tree reads the thirteenth round ones.
- **R6-P2-001** (P2), `v4.2.0.0.md:759`: The v4.2.0.0 changelog's suite row quotes the eleventh round's counts as the release total.
- **R5-P2-001--33e41d329542** (P2), `acceptance-criteria.md:66`: Three acceptance rows state final-tree suite counts the tree no longer has.
- **L1-P2-001** (P2), `reduce-state.cjs:2414`: Two iterations that rule out one direction are written as two one-attempt directions.

## 7. Traceability Status

- `spec_code` and `checklist_evidence`: incomplete in all three lineages, each on its own findings.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached`, 7 of 7 iterations in every lineage.
- **Orchestration note:** no lineage wrote a `terminal_gates` row, as the focus asked, so `fanout-run.cjs` marked all three incomplete. The orchestrator ran `terminal-gates.cjs` against each lineage's config, registry and state log and appended the computed row through the gateway. The merged verdict comes from `review-verdict.cjs` on the merge's counts.
- **Per-lineage verdicts:** FAIL in all three, on the coverage gate.
- **Sources reviewed:** the 77 files in `fanout-review-scope.txt`.
