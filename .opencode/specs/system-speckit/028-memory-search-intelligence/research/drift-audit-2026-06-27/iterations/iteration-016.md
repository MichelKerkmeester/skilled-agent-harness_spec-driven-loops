# Iteration 16 — kimi

**Angle:** Codex model/reasoning-effort assignment audit — all 13 agents run gpt-5.4 with high effort; check if role-appropriate (e.g., deep-review may benefit from a different model than code)

**Findings:** 3

- **[P1] contradiction** `.opencode/skills/cli-codex/README.md:138` — Codex runtime agents use gpt-5.4 but cli-codex docs claim only gpt-5.5 is supported
  - evidence: README says 'The model stays `gpt-5.5` for every task.' and `assets/prompt_quality_card.md:40` says 'Codex CLI dispatches only `gpt-5.5`', yet every `.codex/agents/*.toml` declares `model = "gpt-5.4"` (e.g. `.codex/agents/deep-review.toml:6`). The Codex session-start hook test also expects `model: 'gpt-5.4'` at `.opencode/skills/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts:136`.
  - fix: Reconcile the model contract: either update cli-codex docs to reflect gpt-5.4 as the supported runtime model, or migrate all `.codex/agents/*.toml` to `gpt-5.5`.
- **[P2] misalignment** `.opencode/skills/cli-codex/SKILL.md:268` — All 13 Codex agents pinned to high reasoning effort despite documented per-role tuning
  - evidence: SKILL.md states 'tune only reasoning effort: `medium` for most delegations (default), `high`/`xhigh` for architecture/security audits/complex planning, `low`/`minimal` for trivial lookups.' In contrast, every `.codex/agents/*.toml` sets `model_reasoning_effort = "high"` identically (e.g. `.codex/agents/context.toml:7`, `.codex/agents/markdown.toml:8`, `.codex/agents/code.toml:7`).
  - fix: Assign role-appropriate effort: medium for code/context/markdown/review, high or xhigh for deep-review/deep-research/ai-council/debug, and low/minimal for simple lookups.
- **[P2] misalignment** `.opencode/skills/cli-codex/README.md:150` — deep-review agent runs on Codex despite skill docs routing deep extended-thinking to Claude Code
  - evidence: README says 'Skip it ... for deep extended-thinking analysis (use `cli-claude-code` instead).' `.codex/agents/deep-review.toml:6-7` assigns `model = "gpt-5.4"` and `model_reasoning_effort = "high"` to the deep-review role, which is exactly the deep extended-thinking class the skill says to delegate away from Codex.
  - fix: Either move the deep-review Codex agent to a runtime/model suited for deep reasoning (per cli-codex's own guidance), or document an explicit exception and rationale for running it on Codex.
