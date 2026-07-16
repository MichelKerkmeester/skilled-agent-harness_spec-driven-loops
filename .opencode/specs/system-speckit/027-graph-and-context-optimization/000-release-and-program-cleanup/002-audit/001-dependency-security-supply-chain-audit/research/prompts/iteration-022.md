# Deep Research Iteration 22 of 25 - VERIFICATION of iter 006-010 Persistence

## SITUATION

You are running as cli-opencode + deepseek-v4-pro in non-interactive print mode, dispatched as iteration 22 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the verification of persistence findings from iterations 006-010 dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. `research/iterations/iteration-006.md` through `iteration-010.md`
2. LaunchAgents/Daemons, cron/systemd, shell startup, git hooks, and PATH findings
3. Direct file-existence and line-number rechecks for all HIGH+ claims
4. Writable PATH directory risk confirmation
5. Persistence clean-state evidence if no findings exist
6. Adjusted persistence verdict

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit && for f in research/iterations/iteration-0{06..10}.md; do echo "## $f"; test -s "$f" && rg -n "(CRITICAL|HIGH|MEDIUM|Evidence|Remediation|Convergence|COMPROMISE|INDICATORS|CLEAN)" "$f" || echo "MISSING_OR_EMPTY $f"; done 2>&1
find ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons ~/.config/systemd/user -maxdepth 2 -type f -print 2>&1 | sort
crontab -l 2>&1; find /etc/cron.d /etc/cron.daily /etc/cron.hourly /etc/cron.weekly /etc/cron.monthly -maxdepth 2 -type f -print 2>&1
for f in ~/.zshrc ~/.zprofile ~/.zshenv ~/.bashrc ~/.bash_profile ~/.profile; do [ -f "$f" ] && rg -n "(curl|wget|eval|base64|launchctl|systemctl|crontab|PATH=|alias |function )" "$f" 2>&1; done
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && git config --show-origin --get-all core.hooksPath 2>&1; find .git/hooks -maxdepth 1 -type f -print -exec ls -l {} \; 2>&1
zsh -lic "for c in npm npx node git gh codex claude devin gemini python3; do echo ===$c===; which -a $c; done" 2>&1
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

Write to `research/iterations/iteration-022.md` with EXACT structure:

```markdown
# Iteration 022 - VERIFICATION of iter 006-010 Persistence

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
`{"type":"iteration","run":22,"focus":"VERIFICATION of iter 006-010 Persistence","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-opencode","model":"deepseek/deepseek-v4-pro","durationSec":N,"timestamp":"ISO8601"}`
