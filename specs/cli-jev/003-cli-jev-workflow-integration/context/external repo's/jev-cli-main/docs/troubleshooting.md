# Troubleshooting

| Symptom | Fix |
| --- | --- |
| `No credentials found` | Run `jev auth login`, or export `TYPESAFE_API_KEY`. `jev auth status` shows what was found. |
| `HTTP 401` | The key is wrong or revoked. Check it at console.typesafe.ai and log in again. |
| `HTTP 429` | Rate limited. The TypeSafe provider retries automatically; if it persists, slow down or batch questions. |
| `Malformed response from <model>` | The API (or a proxy in front of it) returned something other than an answer per question. Retry; check `TYPESAFE_BASE_URL` if set. `jev` never treats a missing answer as probability 0. |
| `Request timed out` | Raise `--timeout` or set `JEV_TIMEOUT_MS`. Large evidence takes longer. |
| `Expected ... on stdin but stdin is a terminal` | You used `-` without piping anything. Pass text or `@file`. |
| `Too many candidates` / `exceeds the limit` | `find` and `rerank` take 250 candidates, `match` 200 pairs. Pre-filter or block, then split. |
| `history too large for Jev` (`compact`) | Lower `--preserve-recent` or raise `--max-state-tokens` slightly (hard limit is 32k for state plus the longest question). |
| `Invalid <command> flags` (`batch`) | Sub-command flags go after `--`; do not pass the text argument, rows supply it. |
| Colors in captured output | `--no-color` or `NO_COLOR=1` |
| Want to see the request | `--dry-run` |
| Want a stack trace | `JEV_DEBUG=1` |
| Keychain prompts on every call (macOS) | Click "Always Allow" once, or use `JEV_CREDENTIAL_STORE=file` |
