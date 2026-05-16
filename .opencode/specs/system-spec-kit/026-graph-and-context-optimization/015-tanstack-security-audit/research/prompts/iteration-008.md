# Deep Research Iteration 8 of 25 - Shell Startup Files

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 8 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the shell startup persistence dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. User zsh/bash/profile startup files
2. System shell startup files where readable
3. PATH manipulation and alias/function shadowing
4. Network fetch, eval, base64 decode, LaunchAgent/systemd/cron writes
5. Recently modified shell startup files
6. References to repo-local scripts in startup path

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
ls -la ~/.zshrc ~/.zprofile ~/.zshenv ~/.bashrc ~/.bash_profile ~/.profile /etc/zshrc /etc/zprofile /etc/profile /etc/bashrc 2>&1
for f in ~/.zshrc ~/.zprofile ~/.zshenv ~/.bashrc ~/.bash_profile ~/.profile /etc/zshrc /etc/zprofile /etc/profile /etc/bashrc; do [ -f "$f" ] && nl -ba "$f" | sed -n "1,220p"; done 2>&1
for f in ~/.zshrc ~/.zprofile ~/.zshenv ~/.bashrc ~/.bash_profile ~/.profile /etc/zshrc /etc/zprofile /etc/bashrc; do [ -f "$f" ] && rg -n "(curl|wget|eval|base64|launchctl|systemctl|crontab|rm -rf|api.github.com|PATH=|alias |function )" "$f"; done 2>&1
find ~ -maxdepth 1 -type f \( -name ".zsh*" -o -name ".bash*" -o -name ".profile" \) -newermt "2026-05-15 00:00" -ls 2>&1
zsh -lic "type -a npm node git gh codex claude devin gemini; echo PATH=$PATH" 2>&1
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

Write to `research/iterations/iteration-008.md` with EXACT structure:

```markdown
# Iteration 008 - Shell Startup Files

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
`{"type":"iteration","run":8,"focus":"Shell Startup Files","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
