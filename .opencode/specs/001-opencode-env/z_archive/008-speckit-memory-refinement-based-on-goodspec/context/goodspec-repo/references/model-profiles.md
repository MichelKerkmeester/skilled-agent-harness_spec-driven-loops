# Model Profiles

Model profiles control which model each GoopSpec agent uses. This enables optimal performance by matching cognitive tasks to the best-suited models.

## Default Model Assignments

| Agent | Model | Rationale |
|-------|-------|-----------|
| goop-debugger | openai/gpt-5.2-codex | Best for code-heavy debugging, hypothesis testing, evidence-based analysis |
| goop-designer | anthropic/claude-opus-4-5 | Best for visual design, UI/UX reasoning, component architecture decisions |
| goop-executor | openai/gpt-5.2-codex | Best for code implementation, atomic commits, clean patterns |
| goop-explorer | google/antigravity-gemini-3-flash | Fast codebase mapping, pattern detection, lightweight exploration |
| goop-librarian | openai/gpt-5.2 | Best for information retrieval, documentation search, code search |
| goop-orchestrator | anthropic/claude-opus-4-5 | Complex orchestration, task delegation, context management |
| goop-planner | anthropic/claude-opus-4-5 | Best for complex architecture decisions, goal decomposition, reasoning-heavy planning |
| goop-researcher | openai/gpt-5.2 | Best for research, technology evaluation, knowledge synthesis |
| goop-tester | opencode/kimi-k2.5-free | Cost-effective for test writing, quality assurance, coverage thinking |
| goop-verifier | openai/gpt-5.2-codex | Best for code verification, security analysis, catching subtle bugs |
| goop-writer | google/antigravity-gemini-3-pro-high | Documentation, structured writing, comprehensive coverage |
| memory-distiller | anthropic/claude-haiku-3-5 | Fast, lightweight distillation of events into structured memories |

## Model Selection Philosophy

### Why GPT-5.2-Codex for Code Tasks?
Code-heavy tasks (debugging, execution, verification) benefit from Codex's specialized training. GPT-5.2-Codex excels at:
- Deep code understanding and generation
- Bug detection and hypothesis testing
- Security vulnerability analysis
- Clean, production-quality implementation
- Following coding patterns and conventions

### Why Claude Opus 4.5 for Planning & Orchestration?
Planning and orchestration require complex reasoning and decision-making. Opus 4.5 excels at:
- Complex reasoning about system design
- Identifying genuine dependencies vs false ones
- Creating comprehensive, executable plans
- Goal-backward verification derivation
- Task delegation and context management
- Visual/UI reasoning and component architecture

### Why GPT-5.2 for Research & Information Retrieval?
Research and information tasks benefit from GPT-5.2's broad knowledge and retrieval capabilities:
- Deep domain research and synthesis
- Technology evaluation and comparison
- Documentation and code search
- Information extraction and organization
- Knowledge synthesis across sources

### Why Gemini 3 Flash for Lightweight Tasks?
Fast, lightweight tasks benefit from Gemini 3 Flash's speed and efficiency:
- Fast codebase scanning and mapping
- Quick pattern extraction
- Status checks and session management
- Low cost for frequent operations
- Excellent speed-to-quality ratio

### Why Gemini 3 Pro High for Writing?
Documentation and writing tasks benefit from Gemini 3 Pro High's comprehensive coverage:
- Structured documentation generation
- Technical writing with clarity
- Comprehensive coverage of topics
- Memory persistence and note-taking
- Milestone completion summaries

### Why Kimi K2.5 Free for Testing?
Testing tasks can use cost-effective models while maintaining quality:
- Test writing and quality assurance
- Coverage thinking and edge cases
- Cost-effective for frequent test generation
- Good enough quality for test scenarios

## Override Configuration

Users can override models for specific scenarios in goopspec.json:

```json
{
  "models": {
    "planner": "anthropic/claude-opus-4-5",
    "executor": "openai/gpt-5.2-codex",
    "overrides": {
      "security_review": "openai/gpt-5.2-codex",
      "performance_audit": "openai/gpt-5.2-codex",
      "refactor": "openai/gpt-5.2-codex",
      "quick_fix": "openai/gpt-5.2-codex",
      "research": "openai/gpt-5.2",
      "documentation": "google/antigravity-gemini-3-pro-high"
    }
  }
}
```

## Resolution Logic

1. Check for scenario override (security_review, quick_fix, etc.)
2. If override exists, use that model
3. Otherwise, use default agent model
4. Pass model parameter to Task tool when spawning

## Cost vs Quality Trade-offs

| Scenario | Recommended Model | Reason |
|----------|-------------------|--------|
| Budget constrained | Use Gemini 3 Flash for exploration, Kimi K2.5 Free for testing | Lowest cost while maintaining quality |
| Maximum quality | Use GPT-5.2-Codex for code, Opus 4.5 for planning | Best performance per task type |
| Balanced (default) | As per default assignments | Smart allocation per task type |
| Security critical | Use GPT-5.2-Codex for verification | Strong security analysis capabilities |
| Research intensive | Use GPT-5.2 for research and information retrieval | Best for knowledge synthesis |
| Documentation heavy | Use Gemini 3 Pro High for writing | Comprehensive coverage and clarity |
