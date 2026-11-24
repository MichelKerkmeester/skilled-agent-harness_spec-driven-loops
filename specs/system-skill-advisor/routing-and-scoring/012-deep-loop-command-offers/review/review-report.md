---
title: "Deep Review Report: deep-loop command offers, fourth traceability rerun"
description: "Three-lineage fan-out review (DeepSeek V4.1 Flash at max thinking through pi, 7 iterations each) after the ninth fix round. Verdict FAIL on the coverage gate, with 0 P0, 4 P1 and 39 P2."
---

# Deep Review Report: deep-loop command offers, fourth traceability rerun

## 1. Executive Summary

- **Verdict:** FAIL on the `coverage` gate, no P0.
- **Counts:** 0 P0, 4 P1, 39 P2, no search debt.
- **Gates by lineage:** every lineage passes the evidence gate (`all-findings-cited`) and the scope gate (`all-findings-in-scope`). All three fail coverage as `traceability-incomplete`.
- **What it finds:** no new word-rule gap in the gate. One P1 is a parity gap: on a mode-free plural loop ask the Python fallback keeps both run commands, while the native gate and ADR-008 serve none. The other three P1s and most of the P2s are closure records that drifted from the tree: fixture and suite counts from earlier rounds, the drift guard's stated scope, and evidence cells whose cited line moved when later rounds inserted lines above it. One reviewer names that cause directly: closure evidence is cited by line number.
- **Trend:** the four traceability reruns found 2, 1, 4 and 4 P1s. This is the first rerun whose P1s include no word-rule gap in the gate.
- **Run:** generation 6, a restart of generation 5 (archived at `review-archive/20261124T181420Z`). 3 lineages of `cli-pi` on `deepseek-v4.1-flash-1017` at `--thinking max`, stop policy `max-iterations`, 7 iterations each.

## 3. Active Finding Registry

- **R3-P1-001** (P1), `decision-record.md:732`: ADR-008 records the mode-free plural ask as no command, but the Python fallback keeps both run commands.
- **R1-P1-002** (P1), `acceptance-criteria.md:84`: Closure records promise a fixture of 285 cases while the shared fixture holds 347.
- **R1-P1-001** (P1), `spec.md:243`: REQ-031 states a guard scope the tree does not hold, and AC-038 repeats it.
- **R1-P1-003** (P1), `acceptance-criteria.md:93`: Several Met evidence cells cite a line that holds unrelated code.
- **R1-P2-001--b5ec561b376b** (P2), `command-attach-guards.vitest.ts:532`: AC-009's depth-word span starts on an unrelated case.
- **R3-P2-002--99e137a7bf3b** (P2), `acceptance-criteria.md:86`: AC-029 and AC-028 quote suite counts the cited changelog row does not carry.
- **R6-P2-001--b1780eb288cf** (P2), `v4.2.0.0.md:759`: AC-029 quotes a changelog suite count the changelog no longer carries.
- **R2-P2-001--d43f251e04c9** (P2), `acceptance-criteria.md:86`: AC-029 records a suite count the changelog no longer carries.
- **R1-P2-002--19c3e480a8ac** (P2), `acceptance-criteria.md:87`: AC-030 refusal-row count is stale (11 vs 12).
- **R3-P2-001--c2e81ddb350a** (P2), `deep-loop-offer-cases.json:129`: AC-030's fixture-grep count no longer matches the fixture.
- **R3-P2-003** (P2), `acceptance-criteria.md:88`: AC-031 counts 26 doctorWithheld fixture rows; the fixture carries 47.
- **R1-P2-001--2f49ad4eca34** (P2), `acceptance-criteria.md:88`: AC-031 doctorWithheld row count is stale (26 vs 47).
- **R3-P2-002--48908ce82065** (P2), `deep-loop-offer-cases.json:138`: AC-031's doctorWithheld population is 47 rows, not 26.
- **R1-P2-004** (P2), `test_skill_advisor.py:2902`: AC-031's Python anchor is a comment.
- **R3-P2-004** (P2), `acceptance-criteria.md:89`: AC-032 says four multi-typed rows pin both loops in both orders; two of the four pin one loop against a non-loop command.
- **R1-P2-003--a15594669af2** (P2), `command-attach-guards.vitest.ts:963`: AC-033 cites a comment line for the deferred-route cases.
- **R3-P2-005** (P2), `acceptance-criteria.md:90`: AC-033's mode-cue anchor lands inside commandOnlyMentioned, not on the loop that skips a subject-read mode name.
- **R3-P2-006** (P2), `acceptance-criteria.md:91`: AC-034's Python anchor is a blank line; the stage-one copy it names is 250 lines further down.
- **R1-P2-002--0c0eb85e7381** (P2), `acceptance-criteria.md:93`: AC-036 cites evidence lines that do not hold the typed-on-stuck evidence it claims.
- **R1-P2-003--a1bff17f98f8** (P2), `acceptance-criteria.md:94`: AC-037 cites the wrong lines for the bounded window and the fixture-parity suite.
- **R1-P2-006** (P2), `test_skill_advisor.py:5009`: AC-037's cost-register anchors do not hold the window or the head call.
- **R4-P2-001--6cc92b6a12a5** (P2), `deep-loop-offer-cases.json:253`: AC-044, AC-045 and AC-046 cite fixture spans the ninth round moved.
- **R6-P2-002--80404db49c86** (P2), `tasks.md:184`: Closure evidence is cited by line number, so every insertion above a cited symbol invalidates a cell.
- **R3-P2-001--630dc3349bc4** (P2), `acceptance-criteria.md:66`: Five acceptance cells quote the Python fixture count as 285 while the tree holds 347 cases.
- **R6-P2-001--8c303f6fd7b4** (P2), `spec.md:243`: Nothing fails when REQ-031 documented counts drift from the guard.
- **R2-P2-001--81ebc8a04e8e** (P2), `spec.md:224`: REQ-012 still states the superseded six-row near-miss check, and its only acceptance row is Superseded.
- **R1-P2-002--757d931f113b** (P2), `command-attach-guards.vitest.ts:866`: REQ-031 and AC-032 point the typed-suffix evidence at lines that do not hold it.
- **R1-P2-001--feacfa49fb29** (P2), `spec.md:243`: REQ-031 and AC-038 describe fifteen compared lists and ten per-entry lists; the drift guard compares twenty-two and pins twelve.
- **R4-P2-001--62750f7372a8** (P2), `test_skill_advisor.py:2902`: servedRun null cannot tell no-mode from both-modes, so the Python suite cannot catch a drop-to-zero regression.
- **R2-P2-001--12e33f8a362b** (P2), `command-attach.ts:581`: T066's three refusal anchors point above the code they name.
- **R2-P2-002** (P2), `command-attach.ts:790`: T067's RUN_REFUSED anchors miss the export, the read site and the Python copy.
- **R2-P2-003** (P2), `command-attach.ts:1453`: T069's deep-gate read site is a comment.
- **R2-P2-004** (P2), `command-attach.ts:1483`: T070's anchors name a different body and a different list.
- **R1-P2-005** (P2), `test_skill_advisor.py:2969`: T072's Python anchors repeat R1-P2-005's two wrong lines.
- **R2-P1-001** (P2), `tasks.md:141`: T074 cites a fixture line that holds a different case.
- **R2-P2-006** (P2), `command-attach-guards.vitest.ts:998`: T075's window anchors and timings disagree with the tree and with AC-037.
- **R2-P2-009** (P2), `tasks.md:245`: T082's CHK-001 pointer no longer holds its number.
- **R3-P2-001--6f5d895c30c3** (P2), `spec.md:181`: The declared change set in spec.md stops at the sixth round.
- **R2-P2-007** (P2), `deep-loop-offer-cases.vitest.ts:80`: The drift-guard citations are stale and the pair count is five short.
- **R2-P2-008** (P2), `deep-loop-offer-cases.json:2`: The packet records two fixture sizes and only the later one matches the tree.
- **R5-P2-001** (P2), `reduce-state.cjs:2580`: The reducer renumbers four machine sections, so every template-derived strategy ends with two section 4, 5, 9 and 11 headings.
- **R3-P2-007** (P2), `acceptance-criteria.md:101`: Three cells in the sixth-round range pin fixture rows eight to thirteen lines away from where they now sit.
- **R6-P2-002--7dac7aee159e** (P2), `timeline.md:18`: timeline.md is an unfilled template, dated and never written.

## 7. Traceability Status

- `spec_code` and `checklist_evidence`: incomplete in all three lineages.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached`, 7 of 7 iterations in every lineage.
- **Orchestration note:** every lineage recorded its own `terminal_gates` row. No lineage was rerun or repaired.
- **Per-lineage verdicts:** FAIL in all three, on coverage only.
- **Sources reviewed:** the 51 files in `fanout-review-scope.txt`.
