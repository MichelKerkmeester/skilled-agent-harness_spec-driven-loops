# Iteration 2: D2 Security — Trust boundaries of uncommitted implementation changes

## Focus
Dimension: security. Scope: the uncommitted working-tree changes touching security-relevant surfaces — scope-adherence rule input handling (env var + git diff parsing), memory-search token budget (truncation + feedback ordering), template renderer gate parsing, AC_COVERAGE escape hatch, and the spec's §L2 Security claims.

## Scorecard
- Dimensions covered: security
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60

## Findings

### P1, Required
- **F005**: Budget-enforcement logic duplicated instead of reused — CHK-006 violation, `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:869`, [Evidence: `enforceSearchTokenBudget` is a ~100-line local mirror defined in memory-search.ts:869 and invoked at 2417, while the shared helper `enforceTokenBudget` is exported from memory-context.ts:551/2153 and NOT imported by memory-search.ts (`grep -n "from './memory-context" memory-search.ts` → no hits). REQ-006 acceptance and CHK-006 require "reuses the shared enforceTokenBudget helper, not a reimplementation". The working tree implements the opposite — a duplicate that can drift on drop-order, token estimation, and metadata shape. Budget enforcement is a context-flooding control; duplicated security-sensitive logic doubles the drift surface.]

### P2, Suggestion
- **F006**: `search_shown` feedback events are enqueued BEFORE token-budget truncation, `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:2387`, [Evidence: shownIds/feedbackEvents are built from `responseToReturn` at 2387-2414 and enqueued at 2408-2416, then `responseToReturn = enforceSearchTokenBudget(...)` runs at 2417. Results dropped by the budget are still recorded as `search_shown`, polluting the implicit-feedback loop with results the caller never received.]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md §L2 Security, CHK-006 vs memory-search.ts:869 | "No new external calls or credential surfaces" holds (all imports internal); CHK-006 reuse mandate violated |
| checklist_evidence | pass | hard | checklist.md CHK-014 | Unchecked; no false claims |

## Assessment
- New findings ratio: 0.60
- Dimensions addressed: security
- Novelty justification: F005 contradicts CHK-006's explicit "not a reimplementation" acceptance; F006 is an ordering defect in the new budget path. Both new.

## Ruled Out
- Command injection via scope rule env var: [MK_SCOPE_CHANGED_FILES is split with tr into an array; no eval; git -C "$repo_root" with quoted args], [check-scope-adherence.sh:35-44]
- Renderer gate injection via template content: [fenced-code blocks skip gate parsing; unbalanced markers throw fail-closed], [inline-gate-renderer.ts:200-236]
- Secret exposure in new code: [all new imports resolve to internal lib modules; no external calls], [memory-search.ts imports]

## Dead Ends
- None.

## Recommended Next Focus
D3 Traceability — spec_code protocol: adjudicate the doc-vs-worktree contradiction (docs claim "Planned — no implementation yet" while uncommitted implementations of all four phases exist), AC_COVERAGE warn-status behavior, and REQ-004/REQ-006 acceptance criteria against the working tree.

Review verdict: CONDITIONAL