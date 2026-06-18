# Context Report: cli-claude-code README rewrite

Deep-context gather for the `cli-claude-code` skill README. Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only seats) plus host verification against the real `SKILL.md`. Converged: both models agree on purpose, modes and invocation. Iteration 2 caught one stale fact in the current README.

Source of truth: `.opencode/skills/cli-claude-code/SKILL.md` (v1.1.13.0, 453 lines).

---

## 1. PURPOSE

`cli-claude-code` lets an external AI assistant (Gemini CLI, Codex CLI, Copilot, raw shell) dispatch a task to Anthropic's `claude` CLI for deep reasoning, surgical code edits, schema-validated output or agent delegation. The calling AI stays the conductor and integrates the result.

## 2. PROBLEM

A non-Claude assistant has no built-in way to reach the `claude` binary when a task wants Anthropic-model strengths (extended-thinking analysis, diff-based edits, `--json-schema` output). Without this skill the caller hand-builds fragile `claude -p` invocations, picks model and permission-mode flags by trial, handles auth, and risks a circular self-dispatch if it is itself Claude Code. The skill standardizes the dispatch and guards against self-invocation.

## 3. MODES & CAPABILITIES

- Deep reasoning: extended thinking via `--model claude-opus-4-6 --effort high`.
- Code editing: surgical diff-based edits through Claude Code's built-in Edit tool.
- Structured output: `--json-schema`-validated JSON for pipelines.
- Code review: read-only audits via `--permission-mode plan`.
- Agent delegation: route to a specialized agent via `--agent <name>`.
- Background processing: cost-capped offload with `--max-budget-usd` and shell `&`.
- Session continuity: `--continue` / `--resume SESSION_ID`.
- Memory handback: 7-step extraction back to the caller via `generate-context.js`.

## 4. INVOCATION (verified)

Default dispatch shape (SKILL.md:212-217):

```bash
claude -p "<prompt>" \
  --model claude-sonnet-4-6 \
  --output-format text \
  2>&1
```

Trigger keywords: claude code, claude cli, delegate to claude, extended thinking, deep reasoning, anthropic. Real flags (SKILL.md:237-250 + cli_reference.md): `-p/--print`, `--model`, `--output-format text|json|stream-json`, `--permission-mode plan|bypassPermissions|acceptEdits|dontAsk`, `--json-schema`, `--max-budget-usd`, `--agent`, `--effort high|low`, `--continue`, `--resume SESSION_ID`, `--fork-session`. Auth: `ANTHROPIC_API_KEY`, `claude auth login` (OAuth), or `claude setup-token` (CI/CD).

Models: `claude-sonnet-4-6` (default, balanced), `claude-opus-4-6` (deep reasoning, pair with `--effort high`), `claude-haiku-4-5-20251001` (optional-unverified, fast/batch).

## 5. AGENT ROSTER (use SKILL.md §3 as authoritative)

SKILL.md §3 canonical delegation table = 9 agents: `context` (codebase exploration), `debug` (systematic debugging), `handover` (session state capture), `orchestrate` (multi-agent coordination), `research` (evidence gathering), `review` (code review / audit, pair with `--permission-mode plan`), `speckit` (spec documentation), `ai-council` (multi-strategy planning), `write` (documentation generation). Route via `--agent <name>`.

## 6. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions, smart router, invocation rules |
| `references/cli_reference.md` | Full flag/command/model/auth reference |
| `references/integration_patterns.md` | Cross-AI orchestration patterns (external AI conducts, Claude Code executes) |
| `references/claude_tools.md` | Unique capabilities + 3-way comparison with Gemini and Codex CLIs |
| `references/agent_delegation.md` | Agent roster, routing table, invocation patterns |
| `assets/prompt_quality_card.md` | Fast-path prompt discipline (framework table + CLEAR check) |
| `assets/prompt_templates.md` | Copy-paste prompt templates per task |

## 7. BOUNDARIES

Self-invocation prohibited: if the caller IS Claude Code (`$CLAUDECODE` env set, `claude` in process ancestry, or `~/.claude/state/<id>/lock`), the skill refuses to load. Not for simple tasks, interactive TUI (use `claude` directly), already-loaded context, or real-time web search (Claude Code has no `--search`; use Gemini or Codex). Sibling skills: `cli-codex` (sandboxed OpenAI), `cli-opencode` (full OpenCode runtime), `cli-devin`. Related: `sk-code` for code standards, `system-spec-kit` for handback.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- CLI not installed: `npm install -g @anthropic-ai/claude-code`.
- `ANTHROPIC_API_KEY` not set: export it or `claude auth login`.
- Nested session detected (`$CLAUDECODE`): cannot run `claude` inside Claude Code; use a different runtime or exit first.
- Budget exceeded: raise `--max-budget-usd` or shrink the prompt.
- Context too large: name files with `@./path` instead of broad prompts.
- FAQ: why not self-invoke; when to use plan vs default permission-mode; Sonnet vs Opus; how `--json-schema` guarantees structure; gh `gh` not relevant here.

## 9. STALE FACTS IN CURRENT README (to fix on rewrite)

1. The current `README.md` claims 11 delegatable agents (ai-council, code, context, debug, deep-improvement, deep-research, deep-review, markdown, orchestrate, prompt-improver, review). That is the OpenCode `.claude/agents` set, not what `SKILL.md` §3 documents. The rewrite uses SKILL.md's 9-agent table.
2. Verify the model ids on rewrite against SKILL.md §3 (claude-opus-4-6 / claude-sonnet-4-6 / claude-haiku-4-5-20251001); do not carry any older id from the current README.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Iteration 1 gathered purpose/modes/boundaries (high agreement). Iteration 2 verified flags, the agent roster and stale facts, each claim cited to a file and line. Host cross-checked against `SKILL.md` directly. Converged before the 3-iteration ceiling.
