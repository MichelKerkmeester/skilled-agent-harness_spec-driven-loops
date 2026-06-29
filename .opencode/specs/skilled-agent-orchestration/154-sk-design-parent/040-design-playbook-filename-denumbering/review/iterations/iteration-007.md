[0m
> build · glm-5.2
[0m
[0m$ [0mgrep -nE 'sk-prompt-small-model|GLM-5.2|zai-coding-plan|active matrix|Configured providers' README.md
941:- Default model: `opencode-go/deepseek-v4-pro` at high reasoning. Configured providers span `opencode-go` (default gateway: DeepSeek + open models), `deepseek` (direct API), `minimax-coding-plan` / `minimax` (MiniMax-M3), `xiaomi` (MiMo-V2.5-Pro), `kimi-for-coding` (Kimi k2.7 Code), `zai-coding-plan` (GLM-5.2) and `openai` (`gpt-5.5` family) — see the skill's provider pre-flight for the live list.
989:- **Covers the active matrix:** DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro and GLM-5.2 via `cli-opencode`
[0m
[0m$ [0mgrep -nc 'sk-prompt-small-model' README.md; grep -nE 'sk-prompt-small-model' README.md; echo "---GLM in provider list---"; grep -nE 'GLM-5.2' README.md
0
---GLM in provider list---
941:- Default model: `opencode-go/deepseek-v4-pro` at high reasoning. Configured providers span `opencode-go` (default gateway: DeepSeek + open models), `deepseek` (direct API), `minimax-coding-plan` / `minimax` (MiniMax-M3), `xiaomi` (MiMo-V2.5-Pro), `kimi-for-coding` (Kimi k2.7 Code), `zai-coding-plan` (GLM-5.2) and `openai` (`gpt-5.5` family) — see the skill's provider pre-flight for the live list.
989:- **Covers the active matrix:** DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro and GLM-5.2 via `cli-opencode`
[0m
{"pass":"readme-accuracy","findings":[]}
