# Deep Research Iteration 15 of 25 - External MCP Transports

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 15 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the external MCP transport dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. Repo and home `.utcp_config.json` files
2. Code-mode and MCP configs with HTTP/SSE/WebSocket transports
3. Remote URLs, hosts, and ports in runtime config
4. Commands that start bridges, proxies, ngrok, cloudflared, or docker exposed ports
5. External transport credentials by name only, values redacted
6. Evidence that no `.utcp_config.json` exists if absent

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ~ -maxdepth 5 -name ".utcp_config.json" -print 2>&1
find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ~ -maxdepth 5 -name ".utcp_config.json" -print 2>&1 | xargs -I {} sed -E "s/(token|secret|key|password)([[:space:]]*[=:][[:space:]]*)[^,}]+/\1\2[REDACTED]/Ig" {} 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!**/node_modules/**" --glob "!**/*.sqlite*" "(utcp|sse|websocket|ws://|wss://|https?://|ngrok|cloudflared|localhost.run|serveo|reverse tunnel|remoteMcp|transport)" .opencode .codex .claude .gemini .vscode 2>&1
ps auxww 2>&1 | grep -Ei "(ngrok|cloudflared|ssh -R|socat|websocket|sse|mcp|utcp|proxy)" | grep -v grep 2>&1
lsof -nP -iTCP -sTCP:LISTEN 2>&1 | grep -Ei "(node|python|uvx|npx|mcp|codex|claude|devin|gemini|cloudflared|ngrok)" 2>&1
```

## CONSTRAINTS

- READ-ONLY (no file mutations outside the iteration output file).
- Cite file:line for every finding.
- Use absolute paths.
- If a command finds NO matches, that's a VERIFIED-CLEAN finding (positive evidence).
- Keep iteration runtime under 6 minutes; stop adding new probes past minute 5 and start writing output.
- Do not revoke tokens, delete files, unload LaunchAgents, kill processes, or change credential state.
- If a CRITICAL direct IOC is found, finish the iteration output and mark the convergence verdict COMPROMISE-CONFIRMED.

## OUTPUT FORMAT

Write to `research/iterations/iteration-015.md` with EXACT structure:

```markdown
# Iteration 015 - External MCP Transports

## Summary
<2-3 sentence verdict>

## Files/Commands Reviewed
- <path or command> (<lines read OR exit code>)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

## Convergence Signal
<newInfoRatio + verdict on whether this dimension is CLEAN / INDICATORS-PRESENT / COMPROMISE-CONFIRMED>
```

Then append to `research/deep-research-state.jsonl`:
`{"type":"iteration","run":15,"focus":"External MCP Transports","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
