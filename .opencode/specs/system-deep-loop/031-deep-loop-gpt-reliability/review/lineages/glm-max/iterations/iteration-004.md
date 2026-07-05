# Iteration 4: D4 Maintainability — mirror parity, checklist evidence, cross-doc consistency

## Focus
Dimension: D4 Maintainability. Verify cross-runtime mirror parity claims (.opencode vs .claude), checklist-evidence integrity in an implemented phase, and before-vs-after.md / timeline.md / spec.md narrative consistency.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 6 (before-vs-after.md, 010/decision-record.md, 017/checklist.md, .opencode+.claude deep.md/ai-council.md mirrors)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.09

## Findings

### P1, Required
(none)

### P2, Suggestion

- **F009**: 017 checklist Verification Summary priority counts do not match the checklist body, `017-loop-guard-implementation/checklist.md:121-125`
  - The summary table (lines 123-125) claims `P0 Items 9 (9/9)`, `P1 Items 8 (8/8)`, `P2 Items 1 (1/1)` — total 18. The actual checklist body contains 23 checked `[x]` items: 12 `[P0]`, 10 `[P1]`, 1 `[P2]` (verified via `grep -c "\[P0\]"` = 13 incl. 1 protocol-table header row; 23 `- [x]` lines). The completion claim "9/9 P0" is therefore inaccurate against the real evidence — there are 12 P0 items, all checked.
  - Severity P2: every item IS checked with inline evidence (test-scenario names, exit codes, command names), so the verification *substance* holds; only the summary aggregation is wrong. checklist_evidence protocol passes on evidence density but the reported counts mislead.
  - [SOURCE: 017-loop-guard-implementation/checklist.md:123-125 (summary) vs body items CHK-001..050; grep counts: [P0]=13(-1 header)=12, [P1]=11(-1)=10, [P2]=2(-1)=1, [x]=23]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| checklist_evidence | partial | hard | 017/checklist.md | All 23 [x] items carry inline evidence (scenario names, exit codes); FAILS only on the inaccurate summary count (F009). Substance is strong; aggregation is wrong. |
| agent_cross_runtime | pass | advisory | .opencode/agents/{deep,ai-council}.md vs .claude mirrors | deep.md 104/91-line divergence is intentional runtime-specific frontmatter (OpenCode `mode`/`permission` vs Claude `tools`); ai-council.md `mode: subagent` is OpenCode-only (Claude has no `mode` field, reachability via `tools:`) — matches 010 decision-record rationale. |

## Assessment
- New findings ratio: 0.09 (1 net-new P2; low novelty — the maintainability surface is in good shape)
- Dimensions addressed: maintainability
- Novelty justification: before-vs-after.md (214 lines) is high quality and consistent with timeline.md and spec.md (no drift found). Mirror parity holds with correct runtime-specific divergence. The one finding is a checklist summary-count aggregation error where the substance is otherwise exemplary.

## Ruled Out
- Mirror-parity drift (deep.md / ai-council.md): ruled out — divergence is intentional runtime-specific frontmatter and path conventions, documented in 010/decision-record.md:23 and the deep.md Path Convention lines. (iteration 4, evidence: diff .opencode/agents/deep.md .claude/agents/deep.md; ai-council.md frontmatter in both mirrors)
- before-vs-after.md / timeline.md / spec.md narrative drift: ruled out — all three agree on phase ordering, status, and the "15 of 17 shipped, 1 blocked (005), 1 parked-then-closed (006)" framing. (iteration 4, evidence: before-vs-after.md:12,66; timeline.md epoch table; spec.md phase map)

## Dead Ends
- None this iteration.

## Recommended Next Focus
- All 4 dimensions now have at least one pass. Broaden angles: re-examine the benchmark-results.md (phase 012) measurement claims for correctness, and probe the route-proof validator (phase 002) for false-negative coverage, since both are load-bearing for the packet's central closure decision.

Review verdict: PASS
