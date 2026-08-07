# Deep Research Iteration 24 of 25 - VERIFICATION of iter 016-019 Code + History + CI + Network

## SITUATION

You are running as cli-opencode + deepseek-v4-pro in non-interactive print mode, dispatched as iteration 24 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the verification of code, history, CI, and network findings from iterations 016-019 dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. `research/iterations/iteration-016.md` through `iteration-019.md`
2. Suspicious commit, workflow, plugin/skill/agent, and network exposure findings
3. Direct re-run of git history and CI pattern checks
4. Direct re-run of plugin runtime and network listener checks
5. Classification of false positives vs verified exposures
6. Adjusted code/history/CI/network verdict

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit && for f in research/iterations/iteration-0{16..19}.md; do echo "## $f"; test -s "$f" && rg -n "(CRITICAL|HIGH|MEDIUM|Evidence|Remediation|Convergence|COMPROMISE|INDICATORS|CLEAN)" "$f" || echo "MISSING_OR_EMPTY $f"; done 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && git log --since="30 days ago" -p --all -- . 2>&1 | rg -n "(^commit |^Date:|^\+.*(eval\(|new Function|curl .*\| *(sh|bash)|wget .*\| *(sh|bash)|base64 -d|chmod \+x|rm -rf|api.github.com/user|gh-token-monitor))" 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "(pull_request_target|permissions:|secrets\.|GITHUB_TOKEN|curl|wget|bash|sh -c|uses: [^@]+$|persist-credentials|id-token: write)" .github/workflows 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!**/node_modules/**" "(allowed-tools|permission|dangerous|full-auto|curl|wget|npx|uvx|docker|http://|https://|token|secret|MCP|mcp|eval|base64)" .opencode/plugins .opencode/skills .claude/agents .codex/agents .gemini .devin 2>&1
lsof -nP -iTCP -sTCP:LISTEN 2>&1; ps auxww 2>&1 | grep -Ei "(ngrok|cloudflared|ssh -R|socat|serve|listen|mcp)" | grep -v grep 2>&1
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

Write to `research/iterations/iteration-024.md` with EXACT structure:

```markdown
# Iteration 024 - VERIFICATION of iter 016-019 Code + History + CI + Network

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
`{"type":"iteration","run":24,"focus":"VERIFICATION of iter 016-019 Code + History + CI + Network","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-opencode","model":"deepseek/deepseek-v4-pro","durationSec":N,"timestamp":"ISO8601"}`
