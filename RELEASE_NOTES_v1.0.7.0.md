Multi-agent system upgrade introducing **7 specialized agents** with enterprise orchestration patterns including Circuit Breaker, Saga Compensation, and Quality Gates.

## Highlights

### ✨ Agent System (7 Agents)

- **@review**: Code review specialist with pattern validation and quality scoring (READ-ONLY)
- **@research**: Technical investigation with evidence gathering and pattern analysis
- **@speckit**: Spec folder documentation for Level 1-3+ with template enforcement (Sonnet)
- **@debug**: 4-phase methodology (Observe → Analyze → Hypothesize → Fix) with structured handoff
- **@handover**: Session continuation specialist for context preservation (Sonnet)
- **@orchestrate**: Senior orchestration with task decomposition and quality evaluation (enhanced)
- **@write**: Documentation generation and maintenance (enhanced)

### 🏗️ Enterprise Orchestration Patterns

- **Circuit Breaker**: 3-state isolation (CLOSED → OPEN → HALF_OPEN), 3-failure threshold, 60s timeout
- **Saga Compensation**: Reverse-order rollback on multi-task failures with logged actions
- **Quality Gates**: Pre/mid/post execution scoring with 70-point thresholds
- **Resource Budgeting**: 50K token default, 80% warning, 100% halt
- **Conditional Branching**: IF/THEN/ELSE in task decomposition with 3-level nesting
- **Incremental Checkpointing**: Every 5 tasks or 10 tool calls

### 📋 Command Integration

- **Agent routing**: 4 commands now route to specialized agents
  - `/spec_kit:research` → `@research` (Steps 3-7)
  - `/spec_kit:plan` → `@speckit` (Step 3)
  - `/spec_kit:implement` → `@review` (Step 11)
  - `/spec_kit:handover` → `@handover` (dedicated Sonnet agent)
- **13 YAML configs updated**: All include `agent_routing`, `quality_gates`, `circuit_breaker` blocks
- **Model standardization**: Opus 4.5 for complex analysis, Sonnet for structured tasks

## Files Changed

- **5 new agent files**: `debug.md` · `handover.md` · `research.md` · `review.md` · `speckit.md`
- **2 enhanced agents**: `orchestrate.md` · `write.md`
- **13 YAML configs**: All spec_kit workflow configs
- **6 command files**: `complete.md` · `debug.md` · `handover.md` · `implement.md` · `plan.md` · `research.md`
- **Stats**: +4,010 lines, -365 lines

## Upgrade

No action required. Pull latest to get the new agent system. The `/spec_kit:debug` command now prompts for model selection before delegating to the debug agent.

**Full Changelog**: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.6.1...v1.0.7.0
