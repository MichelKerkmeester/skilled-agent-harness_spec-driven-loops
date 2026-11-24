---
title: "Deep Review Report: deep-loop command offers, second traceability rerun"
description: "Three-lineage fan-out review (DeepSeek V4.1 Flash at max thinking through pi, 5 iterations each) after the seventh fix round. Verdict FAIL on the coverage gate, with 0 P0, 1 P1 and 18 P2."
---

# Deep Review Report: deep-loop command offers, second traceability rerun

## 1. Executive Summary

- **Verdict:** FAIL. The `coverage` gate fails, and there is no P0.
- **Counts:** 0 P0, 1 P1, 18 P2, no search debt.
- **Why it fails:** lineages 2 and 3 finish traceability this time and fail only as `coverage-too-young`. The gate needs at least one iteration after the one where all four dimensions are first covered, and both lineages first covered the fourth dimension in their fifth and last iteration. Lineage 1 records `traceability-incomplete`.
- **What it finds:** one code-level P1 (plural loop names are not read as loop asks), three code P2s on the gate's word rules and the degraded brief, and fourteen closure-doc P2s, most of them evidence cells and counts that drifted when the seventh round grew the fixture from 203 to 248 cases and the suite from 3029 to 3126 tests.
- **Run:** generation 4, a restart of generation 3 (archived at `review-archive/20261124T095434Z`). 3 lineages of `cli-pi` on `deepseek-v4.1-flash-1017` at `--thinking max`, stop policy `max-iterations`, 5 iterations each.

## 2. Planning Trigger

T084 and AC-040 stay open. A rerun needs more than 5 iterations per lineage for the coverage gate to mature.

## 3. Active Finding Registry

- **ITER3-P1-001** (P1), `command-attach.ts:441`: Plural loop names are never read as loop asks in either copy.
- **R2-P2-001** (P2), `command-attach.ts:1061`: A question that leads with `how do` or `how can` still gets the command attached.
- **ITER3-P2-001** (P2), `command-attach.ts:842`: Complaints about the loop speed or cost are read as run asks.
- **ITER4-P2-001** (P2), `skill-advisor-cli.ts:1554`: The degraded brief renders a fallback-supplied command string without checking it against the tracked table.
- **ITER1-P2-002** (P2), `acceptance-criteria.md:86`: A Met row and its task quote a changelog suite count (2,696) that is no longer in the changelog.
- **iter1-P2-ac012-req-link** (P2), `acceptance-criteria.md:69`: AC-012 is linked to REQ-007 while its criterion tests the corpus recapture.
- **iter4-P2-ac014-evidence-pointer** (P2), `acceptance-criteria.md:71`: AC-014 cites a config field where its completed-message clause is checked at a different line.
- **R3-P2-001** (P2), `acceptance-criteria.md:86`: AC-029 quotes a suite count the changelog no longer carries.
- **iter1-P2-fixture-count** (P2), `acceptance-criteria.md:87`: AC-030, AC-037 and AC-042 quote cases=203 while the shared fixture holds 248 cases.
- **ITER2-P2-001** (P2), `acceptance-criteria.md:88`: AC-031 evidence lines land beside the cases they describe (196 is a comment, 239 a fixture property; cases open at 199 and 250).
- **ITER1-P2-001** (P2), `acceptance-criteria.md:87`: Closure evidence states a fixture size the fixture no longer has (203 stated, 248 on disk).
- **R5-P2-001** (P2), `acceptance-criteria.md:11`: The acceptance criteria still carry the scaffold's continuity block while the body is at round seven.
- **ITER1-P2-003** (P2), `acceptance-criteria.md:99`: Two closure rows state different suite totals for the same tree (3029 vs 3,126).
- **iter5-P2-continuity-metadata** (P2), `decision-record.md:11`: The decision record continuity block is still template scaffold and the implementation summary continuity is one round behind.
- **R3-P2-003** (P2), `spec.md:213`: REQ-006 and the Edge Cases name a test file that holds none of the cases they describe.
- **iter1-P2-req006-test-file** (P2), `spec.md:213`: REQ-006 names a test file that does not hold the loop-ask and depth-word cases it describes.
- **ITER5-P2-001** (P2), `spec.md:213`: REQ-006 points a maintainer at command-attach.vitest.ts, which holds none of the loop-ask or depth-word cases it names.
- **R3-P2-002** (P2), `spec.md:243`: REQ-031 promises a fixture case for every list entry, and four of the twelve compared lists have none.
- **iter2-P2-suite-counts** (P2), `tasks.md:163`: The closure docs disagree on the final advisor suite counts.

## 4. Remediation Workstreams

1. **Word rules:** plural loop names, `how do` and `how can` questions, and complaints about loop speed or cost, in both copies with shared fixture rows.
2. **Degraded brief:** check a fallback-supplied command against the tracked table before rendering it.
3. **Closure docs:** one pass over every count and evidence cell against the final tree, including REQ-006's test-file pointer and REQ-031's per-entry promise.

## 7. Traceability Status

- `spec_code` and `checklist_evidence`: complete in lineages 2 and 3, incomplete in lineage 1.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached` in every lineage, all four dimensions covered.
- **Terminal gates:** evidence pass and scope pass in all three lineages. Coverage: `traceability-incomplete` in lineage 1, `coverage-too-young` in lineages 2 and 3.
- **Orchestration note:** the runner rejected lineage 1 again, because its iteration 3 record claims 10:07:40 while the gateway committed it at 10:01:39 and the lineage ended at 10:05:32. The model wrote a wrong timestamp into a real iteration, the same fault as generation 3.
- **Per-lineage verdicts:** FAIL in all three.
- **Sources reviewed:** the 46 files in `fanout-review-scope.txt`.
