Multi-agent system upgrade introducing **7 specialized agents** with enterprise orchestration patterns. Adds 5 new sub-agents integrated into spec_kit commands, Circuit Breaker isolation, Saga Compensation for rollback, and Quality Gates at execution checkpoints.

## Highlights

### 🤖 Agent System (7 Agents)

**5 New Sub-Agents** (integrated into commands):
- **@research**: Technical investigation with evidence gathering → `/spec_kit:research` (Steps 3-7)
- **@speckit**: Spec folder documentation for Level 1-3+ → `/spec_kit:plan` (Step 3)
- **@review**: Code review with pattern validation (READ-ONLY) → `/spec_kit:implement` (Step 11)
- **@debug**: 4-phase methodology (Observe → Analyze → Hypothesize → Fix) → `/spec_kit:debug`
- **@handover**: Session continuation specialist (Sonnet default) → `/spec_kit:handover`

**2 Enhanced Agents**:
- **@orchestrate**: Senior orchestration with task decomposition, delegation, quality evaluation
- **@write**: Documentation generation and maintenance

### 🏗️ Enterprise Orchestration Patterns

- **Circuit Breaker**: 3-state isolation (CLOSED → OPEN → HALF_OPEN), 3-failure threshold, 60s timeout
- **Saga Compensation**: Reverse-order rollback on multi-task failures with logged compensation actions
- **Quality Gates**: Pre/mid/post execution scoring with 70-point threshold rubrics
- **Resource Budgeting**: 50K token default budget with 80% warning and 100% halt thresholds
- **Conditional Branching**: IF/THEN/ELSE logic in task decomposition with 3-level nesting
- **Incremental Checkpointing**: Every 5 tasks or 10 tool calls for recovery

### 📋 Command Integration

- **13 YAML configs updated**: All include `agent_routing`, `quality_gates`, `circuit_breaker` blocks
- **Model standardization**: Opus 4.5 for complex analysis, Sonnet for cost-efficient structured tasks
- **Dual subagent_type**: Cross-environment compatibility (`general-purpose` for Claude Code, `general` for OpenCode)

## Files Changed

- **5 new agent files**: `debug.md` · `handover.md` · `research.md` · `review.md` · `speckit.md`
- **2 enhanced agents**: `orchestrate.md` · `write.md`
- **13 YAML configs**: All spec_kit workflow configs updated
- **6 command files**: `complete.md` · `debug.md` · `handover.md` · `implement.md` · `plan.md` · `research.md`
- **+6,699 lines** added, **-365 lines** removed

## Upgrade

No action required. Pull latest to get the new agent system. The `/spec_kit:debug` command now prompts for model selection before delegating to the debug sub-agent.

**Full Changelog**: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.6.1...v1.0.7.0
