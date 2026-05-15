# Deep Research Iteration 11 of 25 - MCP Server Allowlist

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 11 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the MCP server allowlist dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. MCP config files in repo and home config surfaces
2. Command paths and args for configured MCP servers
3. Environment variable names in MCP config, values redacted
4. Network transports and remote URLs in MCP config
5. Executable existence and permission checks for server commands
6. Unexpected server entries outside known local skill/plugin surfaces

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find . ~/.config ~/.claude ~/.codex ~/.gemini -maxdepth 4 \( -name "mcp.json" -o -name "*.mcp.json" -o -name "settings.json" -o -name "config.toml" -o -name "config.json" \) -print 2>&1 | sort
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!**/node_modules/**" --glob "!**/*.sqlite*" "(mcpServers|command|args|env|stdio|sse|http|https://|uvx|npx|node|python|docker)" .opencode .vscode .claude .codex .gemini 2>&1
ps auxww 2>&1 | grep -Ei "(mcp|model.context|mk-code-index|mk-spec-memory|mk-skill-advisor|node|uvx|npx)" | grep -v grep 2>&1
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

Write to `research/iterations/iteration-011.md` with EXACT structure:

```markdown
# Iteration 011 - MCP Server Allowlist

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
`{"type":"iteration","run":11,"focus":"MCP Server Allowlist","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
