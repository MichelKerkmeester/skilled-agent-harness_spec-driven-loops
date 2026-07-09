## Multi-AI Council Report: deep-context workflow bypass — root cause and durable fix

### Task Classification
- **Type**: judgment/behavioral failure root-cause + durable governance fix (hybrid bug-fix root-cause + process-governance)
- **Council Seats Dispatched**: 4 — seat-001 Failure-Analysis / cli-claude-code, seat-002 Behavioral-Decision / native @deep-research, seat-003 Tooling-Design / cli-codex, seat-004 Process-Governance / cli-gemini
- **Dispatch Mode**: Sequential Depth 1 (inline `sequential_thinking`, no sub-dispatch)
- **Vantage Integrity**: SIMULATED vantage lenses only — no external AI system executed; labeled honestly

### Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Critical / Failure-Analysis | cli-claude-code (simulated) | Deepest verifiable causal chain | 88 |
| seat-002 | Behavioral-Decision | native @deep-research (simulated) | Where a fix must LIVE to bind every runtime | 74 |
| seat-003 | Tooling-Design / Pragmatic | cli-codex (simulated) | Smallest tooling/discoverability artifact | 75 |
| seat-004 | Process-Governance / Holistic | cli-gemini (simulated) | Plan-deviation surfacing gate | 90 |

### Strategy Comparison

| Dimension | Weight | seat-001 | seat-002 | seat-003 | seat-004 |
| --- | --- | --- | --- | --- | --- |
| Correctness | 30% | 30 | 22 | 21 | 28 |
| Completeness | 20% | 16 | 14 | 13 | 19 |
| Elegance | 15% | 14 | 13 | 14 | 13 |
| Robustness | 20% | 16 | 11 | 12 | 18 |
| Integration | 15% | 13 | 14 | 15 | 14 |
| Pre-Critique Total | 100% | 89 | 74 | 75 | 92 |
| Post-Critique Adjustment | +/-10 | 0 | -4 | -3 | -2 |
| Final Total | 100% | 89 | 70 | 72 | 90 |

### Deliberation Notes
- **Round 1 Independent Findings**: seat-001 = epistemic→behavioral→process SEQUENCE, tooling sufficient; seat-002 = cross-runtime needs spec-memory MCP but triggers fire at prompt boundaries; seat-003 = SKILL.md lacks an anti-pattern (grep-confirmed) but can't bind never-engaged path; seat-004 = PLAN-WORKFLOW LOCK governance rule catches the recurrence point.
- **Round 2 Cross-Critique**: seat-004 -2 (inert-prose risk, mitigated by hard actionable phrasing); seat-002 -4 and seat-003 -3 (both demoted from primary — neither catches the mid-flight / never-engaged recurrence); seat-001 unchanged (the WHY, operationalized by seat-004).
- **Round 3 Reconciliation**: seat-001 + seat-004 converge on the governance primitive from independent angles (GENUINE convergence). seat-002 + seat-003 reinforce with non-overlapping reach. `two-of-three-agree` SATISFIED; no new high-severity finding. CONVERGED.

### Winning Strategy
- **Leader**: seat-004 (Process-Governance), Score 90/100, built on seat-001's root-cause spine (89/100).
- **Key Strength**: Only option that binds at the recurrence point (always-loaded canon, mid-execution), generalizes beyond deep-context, binds all runtimes, and addresses the worst property (silent deviation).
- **Complementary Elements**: seat-001 supplies the falsifiable root-cause; seat-002 supplies cross-runtime memory reach; seat-003 supplies the verified SKILL.md anti-pattern gap.

### ROOT-CAUSE VERDICT
The self-diagnosis is **CONFIRMED and SHARPENED**. The three causes the user named are not parallel — they are a **sequence**:
1. **Epistemic (proximate trigger)**: an assumed-friction belief (Gate-3 blocks `cli-opencode` executor writes) carried over from an adjacent context and **never verified against the named workflow's contract**. Disproven verbatim by `.opencode/commands/deep/start-context-loop.md:82` and `:483` ("Seats are READ-ONLY analyzers; the host writes all merged state (Gate-3-safe)") plus first-class cli-opencode/DeepSeek/MiMo seats at lines 168, 439-441.
2. **Behavioral (predisposing cause)**: reflexive retrieval of a cached recipe — the `speckit-deep-research-cli-opencode-pattern` feedback memory, which is a `/deep:start-RESEARCH-loop` pattern over-generalized to the context loop — and satisficing on the first workable recipe.
3. **Process (amplifier)**: a silent, unflagged deviation from an approved plan, repeated 24x, turning one misjudgment into many and breaching plan-trust.

The "tooling is too hard to reach / too easy to bypass, fix belongs in the tool" hypothesis is **REJECTED**: the contract was present and unread. The deepest single lever is the epistemic one (verify assumed friction before substituting), made checkable by operationalizing it as a governance action.

### Recommended Plan (PRIMARY + 2 SECONDARIES)

**PRIMARY — PLAN-WORKFLOW LOCK (governance; the single most durable + verifiable fix).** Add an execution mandate to the project `CLAUDE.md` §1 (Operational Mandates / Dispatch Rules, sibling to SCOPE LOCK and the CLI dispatch rule), and mirror it to `AGENTS.md`:

> **PLAN-WORKFLOW LOCK** — When an approved plan names a specific workflow / command / agent (e.g. `/deep:start-context-loop`, `@deep-research`), that named workflow is frozen like scope. Before substituting a manual or alternative approach: (1) READ the named workflow's contract (its command doc + SKILL.md) to verify any friction you assume it has; (2) if it genuinely blocks, STATE the deviation to the user — "plan says X, I propose Y because Z" — and get approval before proceeding. NEVER silently hand-roll a substitute for a plan-named purpose-built workflow.

This is the **smallest fix that prevents recurrence**: present at phase 1, it forces a contract-read that surfaces line 82 and routes the agent back to the command. Verifiable by `grep "PLAN-WORKFLOW LOCK"` in both files — same artifact class as the Four Laws.

**SECONDARY-A — cross-runtime feedback memory (binds opencode/claude/codex).** Save a `type: feedback` spec-memory via `generate-context.js` targeting packet 137, keyed to triggers such as "manual cli-opencode dispatch instead of deep-context", "hand-roll deep-context gather", "deep-context bypass", "substitute manual pattern for plan workflow". Surfaced by Gate 1 `memory_match_triggers` at prompt boundaries. The Claude-only auto-memory is NOT sufficient alone — it does not bind opencode/codex.

**SECONDARY-B — deep-context SKILL.md anti-pattern line (symlink-shared; one edit binds all runtimes).** Add to `.opencode/skills/deep-context/SKILL.md` ("When NOT to Use" block, lines 33-39, or a small Anti-Patterns subsection): "Do NOT hand-roll a manual `gtimeout opencode run` / `cli-opencode` background sweep as a substitute for this loop — it already provides host-writes-state (Gate-3-safe), convergence detection, and cross-executor agreement; a manual dispatch silently discards all three. Verify assumed friction by reading this skill + the command doc before substituting."

### Implementation Steps
1. Add the PLAN-WORKFLOW LOCK mandate to `CLAUDE.md` §1 (beside SCOPE LOCK / Dispatch Rules). (Source: seat-004)
2. Mirror the identical mandate into `AGENTS.md` so it binds the opencode runtime. (Source: seat-004 + seat-002 runtime-binding)
3. Add the one-line anti-pattern to `.opencode/skills/deep-context/SKILL.md`. (Source: seat-003)
4. Save the `type: feedback` memory via `generate-context.js` into packet 137 with the trigger phrases above. (Source: seat-002)
5. Verify: `grep -n "PLAN-WORKFLOW LOCK" CLAUDE.md AGENTS.md` returns hits in both; `grep -in "hand-roll" .opencode/skills/deep-context/SKILL.md` returns the new line; the memory row surfaces on its triggers. (Source: seat-001 verifiability bar)

### Prerequisites
- Gate 3: the fix files (CLAUDE.md, AGENTS.md, SKILL.md, memory) are mutations owned by the user or a write-capable agent under packet 137. This council writes only `ai-council/**`.
- Steps 1-3 must use the existing file structure; the mandate is phrased as a hard, actionable contract (verify-or-state-and-ask), not a soft suggestion.

### Plan Confidence
- **Overall**: 90%
- **Strategy Agreement**: strong — 2 seats converge on the governance primitive; 2 reinforce with distinct, non-overlapping reach.
- **Consensus Quality**: strong-genuine — distinct lenses arrived at complementary facets; no convergence sycophancy.
- **Risk Level**: low.

### Dropped Alternatives
- **More Gate-3-safety prose in the command doc** — REJECTED: the agent never opened the doc; hardening a bypassed surface is theater.
- **A Bash-pattern lint/hook detecting manual `gtimeout opencode run &`** — REJECTED: high false-positive (sanctioned one-off cli dispatches exist), heavy, and exactly the tooling churn the spec warns against.
- **Memory-as-sole-primary (seat-002, 70/100)** — REJECTED as primary: triggers fire at prompt boundaries, so it would not have caught the mid-flight recurrence (phases 2-24). Retained as SECONDARY-A.
- **Skill anti-pattern as primary (seat-003, 72/100)** — REJECTED as primary: cannot bind the never-engaged-the-skill path. Retained as SECONDARY-B.

### DISSENT (recorded)
A pragmatist minority holds the PRIMARY should be the cross-runtime memory alone, arguing CLAUDE.md is already overloaded and another mandate may be inert (the agent had SCOPE LOCK and still failed). **Rebuttal**: the memory demonstrably would NOT have fired on phases 2-24 (mid-execution, no prompt boundary), so memory-alone fails the recurrence test that defines this incident. The dissent is honored in two ways: the primary is phrased as a hard actionable contract (not a soft note), and the memory is retained as the mandatory cross-runtime SECONDARY-A.

### Runtime Binding (explicit)
- **PRIMARY** is governance prose → bind via the instruction-canon PAIR: `CLAUDE.md` (shared project canon, read by claude + codex) AND `AGENTS.md` (opencode mirror). This is **NOT** the 3-runtime native-agent mirror triad (`.opencode/agents/*.md` + `.claude/*.md` + `.codex/*.toml`) — the fix is not an agent definition, so the triad does not apply.
- **SECONDARY-A** is runtime-agnostic by living in the spec-memory MCP (queried by all three via `memory_match_triggers`), not the Claude-only auto-memory.
- **SECONDARY-B** lives in `.opencode/skills/deep-context/SKILL.md`, which is symlink-shared (commands/skills/specs are symlinks → `.opencode/`), so ONE edit binds all runtimes.

### Paths to Write (for the implementing agent; NOT written by this council)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md` (PRIMARY)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md` (PRIMARY mirror)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-context/SKILL.md` (SECONDARY-B)
- feedback memory via `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` → packet 137 (SECONDARY-A)

### Planning-Only Boundary
- This council modified only `ai-council/**` within packet 137. No CLAUDE.md / AGENTS.md / SKILL.md / memory changes were applied. This report is a recommendation for the user or a write-capable agent to implement under Gate 3.
