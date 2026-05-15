# Deep Research Iteration 9 of 25 - Git Hooks + core.hooksPath

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 9 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the git hooks persistence dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. Public repo `.git/hooks/` executable hooks
2. `~/.gitconfig` and repo config `core.hooksPath`
3. Nested repo hooks under Public
4. Husky, pre-commit, lefthook, simple-git-hooks configuration
5. Hook scripts that invoke network commands, token access, chmod, or shell eval
6. Recent hook modifications

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && git config --show-origin --get-all core.hooksPath 2>&1
git config --global --show-origin --list 2>&1 | grep -Ei "hooksPath|includeIf|credential|helper" 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .git/hooks -maxdepth 1 -type f -print -exec ls -l {} \; 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .git/hooks -maxdepth 1 -type f -print 2>&1 | xargs -I {} nl -ba {} 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!**/node_modules/**" "(husky|pre-commit|lefthook|simple-git-hooks|core.hooksPath|curl|wget|eval|base64|chmod \+x)" . 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find . -path "*/.git/hooks/*" -type f -newermt "2026-05-15 00:00" -ls 2>&1
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

Write to `research/iterations/iteration-009.md` with EXACT structure:

```markdown
# Iteration 009 - Git Hooks + core.hooksPath

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
`{"type":"iteration","run":9,"focus":"Git Hooks + core.hooksPath","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
