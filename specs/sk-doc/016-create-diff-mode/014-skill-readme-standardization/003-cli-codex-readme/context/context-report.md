# Context Report: cli-codex README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only) plus host verification against `.opencode/skills/cli-codex/SKILL.md` (v1.4.10.0). All four seats converge with the host read.

---

## 1. PURPOSE

`cli-codex` lets an external AI assistant dispatch a task to OpenAI's Codex CLI (`codex exec`) for coding, repo analysis, diff-aware code review, live web research or a second-model opinion. The calling AI stays the conductor.

## 2. PROBLEM

An assistant working alone cannot browse the live web mid-task, has no diff-aware review subcommand and no sandbox to isolate file operations. To reach Codex it must hand-build `codex exec` with the right model, reasoning effort, service tier and sandbox, and a wrong flag makes the task silently no-op (the worst trap: `codex exec` defaults to a read-only sandbox, so edit tasks fail quietly). The skill standardizes the dispatch, runs an auth pre-flight and refuses self-invocation.

## 3. MODES & CAPABILITIES

- Cross-AI review: a second perspective, security audit, and the `/review` diff-aware workflow.
- Web research: live browsing during execution via `--search`.
- Code generation: workspace-write sandboxed edits, with `--image`/`-i` for design-to-code.
- Agent delegation: profile routing via `-p <profile>` (profiles in `.codex/config.toml`).
- Session continuity: `codex resume` and `codex fork`.
- Native hooks, `codex mcp` and `codex cloud` for startup context, MCP servers and remote runs.

## 4. INVOCATION (verified)

Default dispatch shape (SKILL.md:209-216):

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "<prompt>"
```

Trigger keywords: codex, codex cli, openai, web search, code review, second opinion, cross-validate. Model is always `gpt-5.5`; only reasoning effort varies across `none`, `minimal`, `low`, `medium` (default), `high`, `xhigh`. Sandbox levels: `read-only`, `workspace-write`, `danger-full-access` (the last needs explicit user approval). Approval modes: `untrusted`, `on-request`, `never`. `--full-auto` is workspace-write plus on-request approval. Two gotchas the README must state: `codex exec` defaults to `read-only` so edit tasks need `--sandbox workspace-write` or `--full-auto`, and `-c service_tier="fast"` must be passed explicitly for cross-AI delegation. Non-existent flags: `--reasoning`, `--reasoning-effort`, `--quiet`. Auth: `OPENAI_API_KEY` or ChatGPT OAuth via `codex login`.

## 5. PROFILE ROSTER

Profiles shape how Codex processes a task and live in `.codex/config.toml` `[profiles.<name>]`. SKILL.md §3 documents: `review` (code review / security audit), `context` (architecture exploration), `research` (technical research, pair with `--search`), `write` (documentation), `debug` (fresh-perspective debugging), `ai-council` (multi-strategy planning). Route with `-p <profile>`. The built-in `codex exec review` subcommand does git-diff review directly.

## 6. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions, smart router, invocation rules |
| `references/cli_reference.md` | Full subcommands, flags, sandbox modes, config |
| `references/integration_patterns.md` | Cross-AI orchestration patterns |
| `references/codex_tools.md` | Built-in capabilities (/review, --search, MCP, sessions) |
| `references/hook_contract.md` | Native hook contract and Spec Kit Memory startup wiring |
| `references/agent_delegation.md` | Profile roster, routing table, invocation patterns |
| `assets/prompt_quality_card.md` | Fast-path prompt discipline |
| `assets/prompt_templates.md` | Copy-paste prompt templates |

## 7. BOUNDARIES

Self-invocation prohibited: if the caller IS Codex (`$CODEX_SESSION_ID` or any `CODEX_*` env, `codex` ancestry, or `~/.codex/state/<id>/lock`), the skill refuses to load. Not for simple tasks, the full-screen TUI (use `codex` directly) or already-loaded context. Sibling skills: `cli-claude-code` (Anthropic extended reasoning), `cli-opencode` (full OpenCode runtime), `cli-devin` (autonomous coding). Related: `sk-code` for code standards, `system-spec-kit` for handback.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- CLI not installed: `npm i -g @openai/codex`.
- `OPENAI_API_KEY` not set: export it or `codex login`.
- Task ran but no files changed: `codex exec` defaulted to read-only; add `--sandbox workspace-write` or `--full-auto`.
- Agent asks for spec folder / approval: non-interactive exec cannot answer; include `(pre-approved, skip Gate 3)` and use `--full-auto`.
- Context too large: name files with `@./path` instead of broad prompts.
- FAQ: read-only-default trap; why pass service_tier=fast; the three non-existent flags; `/review` versus a read-only review prompt; when Codex over a sibling CLI.

## 9. STALE FACTS

Verify on rewrite that the current README cites `gpt-5.5` (not an older id), the `-c model_reasoning_effort` form (not a `--reasoning-effort` flag), and the three-level sandbox. Carry no stale flag from the old README.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only seats). Iteration 1 gathered purpose, modes, invocation; iteration 2 verified flags, sandbox and profile roster cited to file lines. Host cross-read SKILL.md directly. Converged before the 3-iteration ceiling.
