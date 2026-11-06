# Latency and tokens per route

Recorded 2026-11-06 with dsh 0.2.2-rc.1 (`version.txt`), one short OK prompt per route, `--permission-mode workspace-write --approval-policy never`, a fresh `mktemp -d` cwd and `DSH_HOME`, and the route, lineage and guards patches.

| Route | Model | Status | Task to final | Input tokens | Output tokens | Evidence |
|---|---|---|---|---|---|---|
| LLM Gateway | `deepseek-v4.1-flash-1017` | verified | 4 s | 5574 | 20 | `route-llmgateway.stdout.jsonl`, `route-llmgateway.stderr.txt` (empty), `route-llmgateway.exit.txt` (0) |
| OpenCode Go | `deepseek-v4.1-flash` | configured, not verified | not run | n/a | n/a | `OPENCODE_API_KEY` is unset in the launch environment (presence checked, value never read); no request was sent |

The token counts come from the `status` event's `usage` object in the saved stream. Latency is wall-clock seconds from launch to exit, measured by the shell.
