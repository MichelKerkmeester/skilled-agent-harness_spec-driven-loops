# Iteration 004 — Deep-Loop Reducer and Findings Parser (correctness)

## Dimension
correctness (iteration 4 of 10; orchestrator-assigned focus: 0221336dd4, 900d0bcf85, 77df558665)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:229,305-329,971-1009 (yield rule at 1002-1003)
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs:7-31 (margin rule, F### shape, one shape per section)
- .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:359,376,417
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:2,148
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/goal.md:92 and specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/implementation-summary.md:82,101,117
- specs/mcp-tooling/z_archive/013-mcp-obsidian/025-plugin-coverage-review/review/lineages/luna-max/iterations/iteration-002.md:34,55,75; specs/mcp-tooling/z_archive/013-mcp-obsidian/025-plugin-coverage-review/review/lineages/luna-max/deltas/iter-002.jsonl:1

## Claim Adjudication — 146 folders, 1906 -> 1207
CONFIRMED, with one nuance. Per-folder sums over specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt give 146 changed folders whose open findings total 1906 before and 1207 after; the tail line reads mode=after dirs=499 same=310 changed=146 raised=0 liveErrors=43 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:148]. No folder increased. Nuance: 1207 holds only for the final commit content. The intermediate build (before the T035/T036 review units that are part of 0221336dd4) measured 1189 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after.txt:2]), so the same commit both lost 18 and recovered them; the claim as stated matches HEAD.

## Decision — Correct Deduplication or Lost Findings?
Both, historically; correct for the drop that remains. The pre-fix build dropped narrative-only findings (luna-max open 12 -> 5, F005/F006 lost, [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/goal.md:92]). The review fix restored them (luna-max 12 -> 8, [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt:2]). The remaining luna-max drop is same-id restatement dedup: iteration-002.md:34,55,75 narrates F004/F005/F006 as bullets and iter-002.jsonl:1 records findingDetails with the same F004/F005/F006 ids under other wording, so one copy is redundant [SOURCE: specs/mcp-tooling/z_archive/013-mcp-obsidian/025-plugin-coverage-review/review/lineages/luna-max/iterations/iteration-002.md:34] [SOURCE: specs/mcp-tooling/z_archive/013-mcp-obsidian/025-plugin-coverage-review/review/lineages/luna-max/deltas/iter-002.jsonl:1]. Residual imperfection is documented, not lost: one folder still counts 3 duplicates whose rows carry different ids (open 12 -> 9) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/implementation-summary.md:117]. Conclusion: the 1906 -> 1207 aggregate is deduplication of restatements, not finding deletion; the only silent-loss vector left is the numbered-narrative one reported below.

## Findings by Severity

### P0
None.

### P1
None.

### P2
1. **Numbered narrative-only findings are still dropped by the reducer yield rule** -- .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002 -- An F### narrative finding yields to a structured row only when that run records the same id (line 1003), but a numbered narrative finding, whose id is built as R<run>-<severity>-<NNN> at line [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:321], yields to any structured run unconditionally. An iteration that records fewer rows than it narrates therefore still loses its extra numbered findings: the exact case the F### arm was fixed for at lines 971-975 [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:973].
   Finding class: correctness — silent loss of derived finding state.
   Scope proof: file is inside the declared review scope and inside the focused reducer/pait of this iteration.
   Affected surface hints: /deep:review reducer, deep-review-findings-registry.json consumers, dashboards built from openFindings.
   Case: an iteration narrates 5 numbered findings while its delta or state record carries only 3 structured rows; findings 4 and 5 are skipped at lines 1004-1006 and exist in no other source.
   Evidence: [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1003] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:321] the fix rationale states the risk verbatim [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:973]; the suite has a numbered full-restatement case and an F### keep-case, but no numbered keep-case [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:359] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:417].
   Claim adjudication: {"type":"correctness","claim":"A numbered narrative finding whose id no structured row carries is skipped whenever the run has structured rows","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1002",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1003",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:321"],"counterevidenceSought":"Checked whether numbered narrative is guaranteed to restate rows: the luna-max recovery proves narratives can exceed rows for F### ids, and nothing in the parser ties numbered counts to row counts","alternativeExplanation":"Every well-formed iteration writes the same number of numbered findings and structured rows, so the mismatch only signals a malformed iteration that is recovered elsewhere","finalSeverity":"P2","confidence":0.85,"downgradeTrigger":"A test or live folder shows every numbered narrative finding also has a same-id structured row, or the reducer treats a count mismatch as malformed input"}

## Traceability Checks
- Core (spec_code, checklist_evidence): not exercised this iteration; correctness focus only, core protocol rows remain on the strategy rotation for later iterations.
- Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not exercised this iteration.

## Edge Cases
1. Stale scratch artifact: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after.txt still holds the pre-fix numbers (luna-max 12 -> 5) while specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt holds the final ones (12 -> 8). A reader who opens the wrong file can misjudge the fix as absent; recorded, not a finding (untracked scratch).
2. liveErrors=43 folders fail to reduce in both before and after builds; pre-existing, baseline triage owns it.
3. Status bullets without the colon after the id (for example luna-max iteration-010.md:50) are deliberately unread after the T037 colon rule; verified they are status restatements whose finding text lives in iteration-002 and the delta record.
4. Dispatch iteration number (4) matches the record count derivation (3 iteration records plus 1).

## Confirmed-Clean Surfaces
- iteration-findings.cjs margin rule and one-shape-per-section selection are correct at HEAD: indented numbered steps no longer open a finding, F### colon bullets are read, and the first present shape wins so a restated finding counts once (lines 23-31) [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs:23].
- F### same-id dedup is correct for luna-max; narrative-only F### findings are kept (12 -> 8 vs 5).
- No folder raised (raised=0 across 499 folders).
- findingDetails ids are normalized before the structured-id set is built [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:994].
- The 77df558665 Case-line rule is reducer-neutral: its test asserts an iteration with case lines reduces to the same findings as one without.

## Ruled Out
- "The 1906 -> 1207 drop is mass finding loss": refuted for the remaining drop — same-id restatements, a recovery inside the same commit, and no folder increased.
- "The margin rule breaks the shared parser callers": the packet probe reports 8,552 files, changed=0; not independently rerun here (packet evidence).
- "F### double counting persists": no; the structured-id match at line 1002 resolves it.

## Not Proven
- No live folder is demonstrated to lose a NUMBERED narrative-only finding; the code path is proven, the live occurrence is not. This bounds finding R4-COR-001 to P2.
- Reader-regression suites and the parser real-data probe were not rerun in this iteration; only their recorded artifacts were read.

## Scope Violations
None. No out-of-scope mutation was attempted.

## Next Dimension
security (per strategy rotation), unless the orchestrator re-assigns.

Review verdict: PASS
