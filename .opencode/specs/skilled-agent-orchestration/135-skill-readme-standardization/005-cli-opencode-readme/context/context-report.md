# Context Report: cli-opencode README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only) plus host verification against `.opencode/skills/cli-opencode/SKILL.md` (v1.3.13.0). All seats converge with the host read and flagged the same stale facts.

---

## 1. PURPOSE

`cli-opencode` dispatches OpenCode's `opencode run` from an external runtime so a task gets the project's full plugin, skill, MCP and Spec Kit Memory runtime in one shot, and it also covers in-OpenCode parallel detached sessions and cross-AI handback. The calling AI stays the conductor.

## 2. PROBLEM

A Claude Code, Codex or Gemini session that needs the project's whole runtime (the memory database, the code graph, every plugin and skill) cannot load it natively. It would hand-build an `opencode run` invocation, pick a model and provider, and remember the non-obvious traps (closed stdin, no top-level `--agent`, the provider auth pre-flight). If the caller is itself OpenCode, a self-dispatch loops. The skill standardizes the dispatch across three documented use cases and refuses self-invocation.

## 3. MODES & CAPABILITIES (3 use cases)

- External dispatch: from Claude Code / Codex / Gemini / raw shell into OpenCode's full runtime in a one-shot `opencode run`.
- Parallel detached session: an operator already inside OpenCode spawns a separate session with its own id and state (ablation, worker farm, parallel research, share URL).
- Cross-AI handback: a non-Anthropic CLI uses OpenCode as the bridge to a project subsystem (spec-kit, memory, code-graph, advisor).
- Agent dispatch (`--agent plan|orchestrate|ai-council`) and cross-repo / remote dispatch (`--dir`, `--attach`).

## 4. INVOCATION (verified)

Default (SKILL.md:255):

```bash
opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root> "<prompt>"
```

Trigger keywords: delegate to opencode, opencode run, full plugin runtime, parallel detached, cross-ai handback. Two non-obvious rules the README must state: append `</dev/null` to every non-interactive `opencode run` (without it the dispatch hangs at 0% CPU), and do NOT pass a top-level `--agent` (current opencode rejects `--agent general`; state the role in the prompt body). A provider auth pre-flight (`opencode providers list`) runs once per session. Self-invocation guard: `$OPENCODE_CONFIG_DIR` or any `OPENCODE_*` env, `opencode` ancestry, or `~/.opencode/state/<id>/lock`; the one exception is an explicit parallel-detached request.

## 5. PROVIDER & MODEL ROSTER (7 providers)

SKILL.md §3 documents seven configured providers: `opencode-go` (DEFAULT, gateway, `opencode-go/deepseek-v4-pro`), `deepseek` (direct API), `minimax-coding-plan` (MiniMax Token Plan default, `minimax-coding-plan/MiniMax-M3`), `minimax` (Direct API), `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe, `xiaomi-token-plan-ams/mimo-v2.5-pro`), `xiaomi` (Direct API), `openai` (`openai/gpt-5.5`). Default is `opencode-go/deepseek-v4-pro --variant high`.

## 6. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions, smart router, dispatch contract |
| `references/cli_reference.md` | Full subcommands, flags, models, version drift |
| `references/integration_patterns.md` | The three use cases, self-invocation guard, the silent-stdin trap |
| `references/opencode_tools.md` | Unique value vs sibling cli-* skills |
| `references/agent_delegation.md` | Agent roster, leaf-agent constraints |
| `references/destructive_scope_violations.md` | The RM-8 incident and four-layer prevention |
| `assets/prompt_quality_card.md` | Executor-specific model overrides + CLEAR |
| `assets/prompt_templates.md` | Copy-paste templates per use case |

## 7. BOUNDARIES

Self-invocation prohibited unless the request is an explicit parallel-detached session. Not for simple tasks, raw model dispatch (a sibling cli-* is leaner), already-loaded context, or interactive TUI. Sibling skills: `cli-claude-code` (Anthropic), `cli-codex` (OpenAI), `cli-devin` (Cognition). Related: `system-spec-kit`, `sk-code`, `mcp-code-mode`.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- Dispatch hangs at 0% CPU: missing `</dev/null` on a non-interactive run.
- `--agent general` fails: do not pass a top-level `--agent`; state the role in the prompt body.
- `provider/model not found` or 401: run the provider auth pre-flight (`opencode providers list`); the default `opencode-go` may not be configured.
- Empty event stream: force `--format json`.
- FAQ: what the full-runtime dispatch buys over a sibling cli-*; when to use a parallel detached session; why no top-level --agent; the closed-stdin requirement.

## 9. STALE FACTS (must fix on rewrite)

1. The current README claims skill version 1.0.0; SKILL.md is 1.3.13.0. The new template carries no version line.
2. The current README claims "three providers" in §1 and "two" in the FAQ; SKILL.md documents seven. The rewrite lists the seven accurately and drops any count contradiction.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered the three use cases and invocation; iteration 2 verified flags, the provider roster and stale facts cited to file lines. Host has the full SKILL.md in context. Converged before the 3-iteration ceiling.
