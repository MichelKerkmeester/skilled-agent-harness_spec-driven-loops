# Deep Research Iteration 19 of 25 - Hidden Network Exposure

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 19 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the hidden network exposure dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. Listening TCP sockets and owning processes
2. Established outbound connections for developer CLIs and MCP servers
3. LaunchAgents/Daemons and shell startup files that start listeners or tunnels
4. Repo scripts that bind `0.0.0.0`, expose public ports, or start tunnels
5. Docker/Colima/Kubernetes port exposure if present
6. Firewall or sharing state where readable

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
lsof -nP -iTCP -sTCP:LISTEN 2>&1
lsof -nP -iTCP -sTCP:ESTABLISHED 2>&1 | grep -Ei "(node|python|npm|npx|uvx|codex|claude|devin|gemini|mcp|ssh|ngrok|cloudflared)" 2>&1
netstat -anv 2>&1 | grep -E "LISTEN|ESTABLISHED" | sed -n "1,240p"
ps auxww 2>&1 | grep -Ei "(serve|listen|http-server|vite|next|webpack|ngrok|cloudflared|ssh -R|socat|docker|kubectl|colima|mcp)" | grep -v grep 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!**/node_modules/**" "(0\.0\.0\.0|listen\(|--host|host 0\.0\.0\.0|ngrok|cloudflared|ssh -R|socat|EXPOSE |ports:|localhost.run|serveo)" . 2>&1
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}" 2>&1
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>&1
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

Write to `research/iterations/iteration-019.md` with EXACT structure:

```markdown
# Iteration 019 - Hidden Network Exposure

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
`{"type":"iteration","run":19,"focus":"Hidden Network Exposure","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
