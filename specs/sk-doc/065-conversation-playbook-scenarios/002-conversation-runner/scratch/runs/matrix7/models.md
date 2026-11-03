# Models used in this run

Read from each runtime's status line in `raw-pane.log`, with terminal colour codes removed.

| Runtime | Model | Evidence |
|---------|-------|----------|
| claude-code | Opus 5.5, medium effort | status line `Opus 5.5 with medium effort` |
| opencode | `llmgateway/deepseek-v4.1-flash-1017` | the pane shows `DeepSeek V4.1`; the root `opencode.json` that setup copies pins this model |
| codex | GPT-6-Luna, max, fast tier | status line `GPT-6-Luna max fast` (two early frames read `default fast` before the configured effort loaded) |
| pi | `deepseek-v4.1-flash-1017` | status line `deepseek-v4.1-flash-1017` |
| devin | SWE-2, High | status line `SWE-2 High` |
