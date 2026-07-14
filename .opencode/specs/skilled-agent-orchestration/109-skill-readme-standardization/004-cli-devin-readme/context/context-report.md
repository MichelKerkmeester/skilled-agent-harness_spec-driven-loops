# Context Report: cli-devin README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only) plus host verification against `.opencode/skills/cli-devin/SKILL.md` (v1.0.13.0). All four seats converge with the host read and flagged the same stale facts.

---

## 1. PURPOSE

`cli-devin` dispatches Cognition AI's "Devin for Terminal" (`devin`) from an external runtime for autonomous coding, and uniquely in the cli-* family it can hand the live session off to a cloud-hosted Devin VM that keeps working after you close your laptop and returns a PR.

## 2. PROBLEM

A calling AI that wants Cognition's coding-specialized model, or wants to offload a multi-hour task and walk away, has no clean path to the `devin` binary. It must hand-build the invocation (model, permission mode, prompt-file), run the auth pre-flight, and decide whether to initiate a cloud handoff that transmits repo state to Cognition's cloud and spends Devin units. If the caller is itself a local Devin session, a self-dispatch loops and burns units. The skill standardizes the dispatch, gates the cloud handoff behind operator confirmation and refuses self-invocation.

## 3. MODES & CAPABILITIES

- Local autonomous coding: `devin` runs locally with full codebase and tool access.
- Local-to-cloud handoff (family-unique): migrate the session to a cloud VM, gated by operator confirmation.
- Four-model preset, switchable per dispatch or mid-session with `/model`.
- ACP server bridge (`devin acp`), MCP ops (`devin mcp`), and persisted rules and skills.
- Session continuity: `--continue` and `--resume <id>`.
- Deep-loop executor role: research-iter / review-iter / synthesis recipes via `--agent-config`.

## 4. INVOCATION (verified)

Default dispatch (SKILL.md:194-204):

```bash
devin --prompt-file /tmp/devin-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  --config "$HOME/.config/devin/config.json"
```

Trigger keywords: devin, devin cli, delegate to devin, swe-1.6, cloud handoff. Flags: `--model`, `--permission-mode auto|dangerous`, `--prompt-file`, `--config`, `--continue`/`-c`, `--resume`/`-r`, `-p`/`--print`, `--sandbox` (research preview), `--agent-config`. No `--reasoning-effort` (model is the lever), no `--full-auto` (closest is `--permission-mode dangerous`). Auth: `devin auth login` (Codeium / Windsurf bridge); pre-flight with `devin auth status`. Self-invocation guard: any `DEVIN_*` env, `devin` ancestry, or `~/.config/devin/sessions/<id>/lock`; the one exception is an explicit cloud-handoff request.

## 5. MODEL ROSTER (4 presets)

| Model | ID | Use |
|------|----|----|
| Cognition SWE-1.6 (default, Free tier) | `swe-1.6` | Context gathering, tool use, clearly-defined simple-to-medium tasks. Does not gate on Pro quota. |
| DeepSeek v4 | `deepseek-v4` | Primary for complex work (ambiguous, multi-step, reasoning-bound). Budget >=25 min. |
| GLM 5.1 | `glm-5.1` | Complex fallback for agentic / tool-use-heavy work. |
| Kimi k2.6 | `kimi-k2.6` | Complex fallback for large-context work. Can hang ~25 min. |

SWE-1.6 needs a caller-side pre-planning block (ordered steps plus acceptance criteria) because it is smaller; the contract is owned by `sk-prompt-models/references/models/swe-1.6.md`.

## 6. KEY FILES (real)

Eight references and two assets exist. The navigable set for a README: `references/cli_reference.md` (flags, subcommands, models, auth), `references/integration_patterns.md` (the three use cases), `references/devin_tools.md` (unique capabilities, cross-CLI comparison), `references/agent_delegation.md` (the model/permission/prompt-file routing analog), `references/cloud_handoff.md` (the local-to-cloud narrative + operator gate), `references/deep-loop-iter-contract.md` and `references/agent-config-recipes.md` (the deep-loop executor recipes), `assets/prompt_quality_card.md` and `assets/prompt_templates.md`.

## 7. BOUNDARIES

Self-invocation prohibited unless the request is an explicit cloud handoff. Not for simple tasks (a sibling cli-* is leaner), raw model dispatch with no agent loop (cli-codex / cli-claude-code), or the interactive TUI slash commands. Sibling skills: `cli-claude-code` (Anthropic), `cli-codex` (OpenAI), `cli-opencode` (full OpenCode runtime). Related: `sk-code`, `system-spec-kit`.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- CLI not installed: `curl -fsSL https://cli.devin.ai/install.sh | bash`.
- Auth missing: `devin auth login` (do not auto-login).
- `Pro · 0% remaining` banner: only Pro models (deepseek-v4, glm-5.1, kimi-k2.6) gate; `swe-1.6` is Free tier and keeps working.
- Task ran but no files changed: `--permission-mode auto` paused; re-dispatch with operator-approved `--permission-mode dangerous` or run interactively.
- FAQ: SWE-1.6 versus the complex models; what cloud handoff does and its cost; auto versus dangerous permission; why devin over a sibling cli-*.

## 9. STALE FACTS (must fix on rewrite)

1. The current README states version 1.0.2.0; SKILL.md is 1.0.13.0. The new template carries no version line, so the rewrite drops the stale number.
2. The current README claims 5 references; the real `references/` directory holds 10. The rewrite lists the navigable references without a wrong count.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, modes and invocation; iteration 2 verified flags, the model roster and stale facts cited to file lines. Host cross-read SKILL.md directly. Converged before the 3-iteration ceiling.
