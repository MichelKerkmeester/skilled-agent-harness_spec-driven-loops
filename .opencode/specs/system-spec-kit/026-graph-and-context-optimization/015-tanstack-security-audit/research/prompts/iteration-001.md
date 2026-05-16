# Deep Research Iteration 1 of 25 - Mini Shai-Hulud IOCs

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 1 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the direct Mini Shai-Hulud IOC dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. `~/.local/bin/gh-token-monitor.sh` direct payload path
2. `~/Library/LaunchAgents/com.user.gh-token-monitor*` macOS persistence path
3. `~/.config/systemd/user/gh-token-monitor*` Linux persistence path
4. Running processes matching `gh-token`, `token-monitor`, or `api.github.com/user`
5. TanStack package references under `.opencode/` and lockfiles
6. `launchctl list` entries matching gh-token, token-monitor, shai, or com.user

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
ls -la ~/.local/bin/gh-token-monitor.sh 2>&1
ls -la ~/Library/LaunchAgents/com.user.gh-token-monitor* 2>&1
ls -la ~/.config/systemd/user/gh-token-monitor* 2>&1
pgrep -fa "gh-token|token-monitor|api.github.com/user" 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "@tanstack/" .opencode --glob "*.json" 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find . -name "package-lock.json" -print 2>&1 | xargs -I {} rg -n "@tanstack/" {} 2>&1
launchctl list 2>&1 | grep -iE "gh-token|token-monitor|shai|com\.user" 2>&1
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

Write to `research/iterations/iteration-001.md` with EXACT structure:

```markdown
# Iteration 001 - Mini Shai-Hulud IOCs

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
`{"type":"iteration","run":1,"focus":"Mini Shai-Hulud IOCs","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
