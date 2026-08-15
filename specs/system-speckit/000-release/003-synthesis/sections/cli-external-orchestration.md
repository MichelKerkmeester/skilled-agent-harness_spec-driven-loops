### External CLI Orchestration

- **Six fail-closed CLI executors.** Dispatch coding, review, and deep-loop work through Codex, Claude Code, OpenCode, Cursor, Devin, and Pi — every mode fails closed before dispatch when its binary is missing, and all six share the framework's full hook lifecycle, scope-lock, and spec gates.
- **One model catalog per mode.** Each CLI mode now carries a dedicated `providers-and-models.md` catalog (canonical provider/model/effort-tier lists in one place), and the hub's smart router covers all six modes instead of the previous three.
- **Expanded, live-verified model rosters.** New dispatch options include GPT-5.6 Luna/Terra/Sol (with per-model reasoning-effort ceilings), GPT-5.6 Luna Max, DeepSeek V4 Flash/Pro Max/Flash Max, Qwen 3.8 Max, GLM 5.3, Kimi K2.7 Code, MiniMax, MiMo-V2.5-Pro, and GLM-5.2 — every id verified against the live CLI before shipping.
- **Cross-runtime agent and hook consistency.** Codex agents are generated from your canonical OpenCode agent set, Devin uses all 13 repo agents as subagents, and Cursor sessions enforce spec gates through native `hooks.json` adapters that are live-verified to actually block denied tool calls.
- **Opt-in plain-English output projection.** Enable `sk-communication` per machine to rewrite terse CLI output into readable prose while preserving the exact original underneath, with an automatic original-only fallback and a compatibility doctor.
- **Reduced dispatch hangs.** Deep-research/deep-review scripted dispatch now appends `</dev/null>`, cutting a 12+ minute stall to ~16 seconds and a full 10-iteration loop from ~3 hours to ~50 minutes.

**Breaking:** The `cli-gemini` and `cli-copilot` executors are removed — route those workflows through `cli-codex` or `cli-claude-code` instead. `cli-opencode` now defaults to the opencode-go/deepseek-v4-pro gateway (the `github-copilot` provider is no longer documented), and Kimi K2.7 Code replaces the retired K2.6 registration.
