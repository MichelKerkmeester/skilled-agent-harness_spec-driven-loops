# Deep Research Iteration 6 of 25 - LaunchAgents + LaunchDaemons

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 6 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the LaunchAgents and LaunchDaemons persistence dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. `~/Library/LaunchAgents/` user agents
2. `/Library/LaunchAgents/` host agents
3. `/Library/LaunchDaemons/` host daemons
4. Suspicious ProgramArguments paths in user-writable locations
5. Agents modified on or after 2026-05-15
6. Launchctl loaded services matching security keywords

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
find ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons -maxdepth 1 -type f -name "*.plist" -print 2>&1 | sort
find ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons -maxdepth 1 -type f -name "*.plist" -print 2>&1 | xargs -I {} plutil -p {} 2>&1
find ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons -type f -newermt "2026-05-15 00:00" -ls 2>&1
launchctl list 2>&1 | sort | grep -Ei "(token|monitor|update|agent|helper|github|npm|shai|user)" 2>&1
rg -n "(~/.local|/tmp|/private/tmp|curl|wget|bash|sh|python|node|rm -rf|api.github.com)" ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons 2>&1
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

Write to `research/iterations/iteration-006.md` with EXACT structure:

```markdown
# Iteration 006 - LaunchAgents + LaunchDaemons

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
`{"type":"iteration","run":6,"focus":"LaunchAgents + LaunchDaemons","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
