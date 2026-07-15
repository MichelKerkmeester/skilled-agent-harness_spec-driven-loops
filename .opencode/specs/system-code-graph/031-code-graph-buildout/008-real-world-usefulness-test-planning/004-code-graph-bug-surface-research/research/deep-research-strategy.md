# Deep Research Strategy: Code Graph + Hooks/Plugin + Advisor Bug-Surface

## Topic
Investigate ALL potential issues in the code-graph + hooks/plugin + advisor system, with primary focus on the 4 native-rerun findings from packet 012/002 + adjacent questions.

## Research Charter
**Goal**: Produce a concrete remediation backlog (P0/P1/P2 with file:line citations) that a follow-up packet can implement.

**Non-goals**:
- Fixing bugs (read-only research)
- Re-running the 012/002 measurements
- Investigating skills outside the code_graph + hooks + advisor surfaces

**Stop conditions**:
- 10 iterations exactly (do NOT converge early — wide bug-surface sweep)
- New-findings rate per iteration drops below 0.10 of prior iteration → flag but continue

## Per-Iteration Focus Dimensions (rotate)
1. Issue A — default scope policy + SPECKIT_CODE_GRAPH_INDEX_SKILLS verification
2. Issue B — drift detector code path trace (handlers/query.ts → lib/index-scope-policy.ts → readiness-contract.ts)
3. Issue C — index-wipe regression (when scan returns 0 nodes; persistence path)
4. Issue D — tree-sitter parser crashes on the 10 affected files
5. Hook payload formatting beyond codex-session-start (gemini, claude, copilot)
6. Advisor staleness ("context-server-startup-scan") + advisor_rebuild E040 history
7. CocoIndex ↔ code_graph ↔ memory seed contract consistency
8. readiness contract auto-rescan opportunity
9. code_graph_verify coverage of scope mismatches + tests/ coverage gaps
10. Recent commits to code_graph/ + final synthesis

## Known Context (prior work)
- Phase 026/007/{001..011}: code-graph package phases, including Phase 011 (broader-scope-excludes-and-granular-skills)
- Phase 012/001 (sandbox campaign): Code graph judged USEFUL under sandbox
- Phase 012/002 (native rerun): Code graph DOWNGRADED to OVERHEAD with 3 P0 + 1 P1 findings
- Phase 026/008 (skill-advisor)
- Phase 026/009 (hook-parity)

## Deliverables
- 10 × iteration-NNN.md
- 10 × delta JSONL
- Final research/research.md synthesis
- Final research/resource-map.md (file:line citations)
