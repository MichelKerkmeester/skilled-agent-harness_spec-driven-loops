## Multi-AI Council Report: 022 Remediation Arc Remaining Execution Strategy

### Task Classification
- **Type**: Architecture / Planning
- **Council Seats Dispatched**: 5: RISK-AVERSE, VELOCITY, ARCHITECTURE, FAILURE-MODE, OPERATIONAL
- **Dispatch Mode**: Sequential Depth 0 (inline deliberation via sequential_thinking MCP, single-agent per operator directive)
- **Vantage Integrity**: All seats deliberated via deepseek-v4-pro primary agent (simulated multi-lens, no external CLI dispatch)

### Council Composition

| Seat | Strategy Lens | Distinct Mandate | Confidence |
|---|---|---|---|
| RISK-AVERSE | Analytical/Critical | Minimize blast radius per phase; accept more phases for safer rollback | 85 |
| VELOCITY | Pragmatic | Close findings fastest; accept larger atomic phases | 75 |
| ARCHITECTURE | Holistic | Proper interface design; RoutingCalibration completeness; ADR governance | 82 |
| FAILURE-MODE | Critical | Detection + recovery; surface silent-failure modes before they happen | 88 |
| OPERATIONAL | Pragmatic/Creative | Repeatable dispatch pattern; reduce per-phase cognitive load | 80 |

### Strategy Comparison

| Dimension | Weight | RISK-AVERSE | VELOCITY | ARCHITECTURE | FAILURE-MODE | OPERATIONAL |
|---|---|---|---|---|---|---|
| Correctness | 30% | 25 | 27 | 26 | 28 | 27 |
| Completeness | 20% | 17 | 16 | 18 | 19 | 17 |
| Elegance | 15% | 12 | 11 | 13 | 10 | 14 |
| Robustness | 20% | 19 | 13 | 15 | 20 | 14 |
| Integration | 15% | 11 | 14 | 14 | 12 | 15 |
| Pre-Critique Total | 100% | 84 | 81 | 86 | 89 | 87 |
| Post-Critique Adjustment | +/-10 | -2 | +2 | -1 | -1 | +1 |
| Final Total | 100% | 82 | 83 | 85 | **88** | **88** |

### Deliberation Notes
- **Round 1 Independent Findings**: 5 seats produced 4 distinct phase orderings, 3 ADR-B positions, and a 2-2-1 split on dispatch atomicity. Strong agreement on convergence gate additions (unanimous) and failure detection chain.
- **Round 2 Cross-Critique**: RISK-AVERSE penalized for deferring critical fix too long. FAILURE-MODE penalized for overcautious ordering. VELOCITY rewarded for strong rebuttal. ARCHITECTURE's prerequisite argument weakened by plan already defining patterns.
- **Round 3 Reconciliation**: Adjudicator merged OPERATIONAL's executor-batched ordering with FAILURE-MODE's preflight checklist and detection chain. Hybrid dispatch model bridges 1-call vs 4-call split. ADR-B resolved as in-place edit with backup safeguard.

### Winning Strategy
- **Co-leaders**: FAILURE-MODE and OPERATIONAL, both at 88/100
- **Key Strengths**: FAILURE-MODE — concrete preflight checklist, 4-point detection chain, 3 silent-failure modes surfaced. OPERATIONAL — executor-batched ordering (adopted), simple rollback rules, minimal operator cognitive load.
- **Complementary Elements**: FAILURE-MODE's detection chain merged into OPERATIONAL's ordering. ARCHITECTURE's cross-ADR consistency check added to convergence gate. VELOCITY's P0-urgency argument kept 004 early in sequence. RISK-AVERSE's 4-call argument partially adopted (per-wave internal gating in prompt).

### Recommended Plan

**Phase ordering:** 002b → 003 → 004 → 005 → 007 → 006 → 008 → 009 → 010

Momentum phases first (002b+003, main-agent direct), then heavy opencode batch (004+005+007, single executor setup), then devin cleanup (006+008+009), then governance closeout (010).

**Phase 004 dispatch:** ONE atomic call via cli-opencode + deepseek-v4-pro with internal 4-wave gating enforced by prompt BUNDLE GATE. Preflight checklist: 10 mandatory steps including zombie process kill, memory check, credit verification, baseline typecheck.

**ADR-B:** In-place edit to ADR-013/014 with mandatory pre-edit backup + post-edit diff verification. Operator approval gate before phase 010.

### Implementation Steps
1. **Phase 002b** (main-agent, ~30-60 min): Verify Qwen3-Reranker-0.6B disk footprint + daemon-log identifier. Replace BAAI/bge-reranker-v2-m3 prose in 3 CocoIndex doc files. (Source: FAILURE-MODE preflight + OPERATIONAL ordering)
2. **Phase 003** (main-agent, ~30-60 min): Investigate `.codex/agents/` intent. Populate TOML mirror if needed. Remove `(proposed)` qualifier from 2 agent files. (Source: All seats agree on pre-investigation)
3. **Phase 004** (cli-opencode deepseek-v4-pro, 2-4 hr): 4-wave skill-advisor refactor. 10-step preflight checklist. Per-wave typecheck+vitest+ban-list verification in prompt. (Source: FAILURE-MODE preflight + OPERATIONAL atomic dispatch + VELOCITY bundle-gate)
4. **Phase 005** (cli-opencode deepseek-v4-pro, 1.5-2 hr): Registry consolidation. Same preflight, simplified (executor pattern proven). (Source: OPERATIONAL executor batching)
5. **Phase 007** (cli-opencode deepseek-v4-pro, 1.5-2 hr): Code-graph config extraction. Last opencode phase in batch. (Source: OPERATIONAL executor batching)
6. **Phases 006, 008, 009** (cli-devin SWE-1.6, 45 min – 1 hr each): Python dedup, shell config, cascade thresholds. (Source: OPERATIONAL cleanup batch)
7. **Phase 010** (cli-devin SWE-1.6, 2-3 hr): 4 ADRs + validator script. Operator approval for ADR-B before dispatch. (Source: All seats agree)

### Prerequisites
- 002b: Qwen3-Reranker-0.6B model accessible on disk; CocoIndex daemon running (for log verification)
- 003: `.codex/config.toml` readable; `.opencode/agents/` directory intact
- 004: opencode-go workspace has credits; Mac RSS < 8GB; no zombie opencode-go processes; baseline typecheck passes
- Cross-phase invariant: Each phase's detection chain passes before next dispatch (typecheck + vitest + ban-list grep + git diff)

### Plan Confidence
- **Overall**: 82%
- **Strategy Agreement**: Strong — 6/6 questions converged via adjudicator verdict
- **Consensus Quality**: Strong — genuine diversity (4 orderings, 3 ADR-B positions) resolved through structured critique
- **Risk Level**: MEDIUM — phase 004 touches tuned constants; bench-diff recommended; dispatch reliability on this Mac unproven for opencode-go + deepseek-v4-pro

### Dropped Alternatives
- **RISK-AVERSE** (Score: 82/100): Deferred 004 to position 7 — safer but delayed 14 P0 closure by ~4-5 extra hours. Detection chain contributions incorporated.
- **VELOCITY** (Score: 83/100): Original order (4 executor switches) — faster P0 closure but higher operator fatigue. P0-urgency argument kept 004 early.
- **ARCHITECTURE** (Score: 85/100): 005+007 before 004 — architectural purism, but plan already defines patterns. Cross-ADR consistency check added to convergence.

### Risks & Mitigations
- **Phase 004 silent revert under Mac load** (FAILURE-MODE): Preflight kills zombie processes, verifies RSS < 8GB. Prompt's per-wave verification reports catch failure. Detection chain (4 checks) catches post-dispatch revert.
- **opencode credit exhaustion** (RISK-AVERSE): Verify `opencode providers list` before dispatch. Fallback: cli-devin `--model deepseek-v4-pro` (DeepSeek API direct, separate billing).
- **ADR-B corruption during in-place edit** (FAILURE-MODE): Mandatory pre-edit backup + post-edit diff verification ensures only amendment section changes.
- **Wave 3 silently reverts wave 1** (FAILURE-MODE): Per-wave ban-list verification in prompt catches this. Post-dispatch detection chain (4 checks) provides second line of defense.
- **Phase 002b writes wrong model name** (FAILURE-MODE): Mandatory Qwen3 footprint verification before editing. Read actual model directory + daemon log, don't trust plan values.

### Planning-Only Boundary
- No files were modified outside `ai-council/**`.
- This report is a recommendation for user review or handoff to an implementation agent.
- Artifacts persisted: `ai-council/ai-council-config.json`, `ai-council/ai-council-strategy.md`, `ai-council/ai-council-state.jsonl`, `ai-council/seat-briefs.md`, `ai-council/critique-round.md`, `ai-council/convergence-report.md`, `ai-council/executor-instructions.md`
