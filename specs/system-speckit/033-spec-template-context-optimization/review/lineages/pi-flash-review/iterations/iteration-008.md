# Iteration 8: REQ-005 scope-adherence rule — behavior verification and false-positive analysis

## Focus
Dimension: correctness (REQ-005 deep check). Verify check-scope-adherence.sh pass/warn behavior against in-scope and out-of-scope change-sets, its validate.sh integration, and the changed-files contract (Open Question 3).

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P1, Required
- **F015**: Scope-adherence rule false-positives on the packet's own docs — every real completion change-set warns, `.opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh:115`, [Evidence: with a combined change-set of one declared implementation path + the packet's own implementation-summary.md and tasks.md, the rule reports `warn` with DETAILS listing the packet's own docs (observed run_check). Root cause: declared scope is parsed exclusively from spec.md §3 "Files to Change", which lists implementation paths only — the packet's own spec docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) are never in the declared set. But the packet's own completion protocol REQUIRES updating those docs (CHK-015 docs updated, CHK-016 read path documented, CHK-018/019 gate evidence). So the canonical completion change-set — implementation + packet docs — always trips the warn. Open Question 3 (canonical changed-files source) is unresolved in the packet (tasks.md T003 open), and the rule's git-diff mode (`git diff --name-only "$scope_base"` at check-scope-adherence.sh:39) needs a scope base that no packet doc defines.]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | observed warn on packet-doc change-set; spec.md Files to Change vs CHK-015/016 | REQ-005 contract produces false positives for the packet's own required doc updates |
| checklist_evidence | pass | hard | checklist.md CHK-005 | Unchecked |

## Assessment
- New findings ratio: 0.50
- Dimensions addressed: correctness
- Novelty justification: F015 is a new behavioral finding from direct fixture execution; REQ-005's "passes on in-scope fixture, warns on out-of-scope fixture" acceptance (spec.md:113) is met mechanically but the in-scope definition excludes the packet's own docs.

## Ruled Out
- "Rule correctly warns on packet doc changes": [the packet's own completion protocol mandates those doc updates (CHK-015/016/018)], [checklist.md sections]
- "git-diff mode resolves the contract": [no scope_base contract defined; MK_SCOPE_BASE env var default empty → rule skips], [check-scope-adherence.sh:31-44]

## Dead Ends
- None.

## Recommended Next Focus
Broaden: checklist_evidence protocol deep pass — verify CHK-001..019 internal consistency, priority tags, and the traceability of each check to spec REQs and plan phases.

Review verdict: CONDITIONAL