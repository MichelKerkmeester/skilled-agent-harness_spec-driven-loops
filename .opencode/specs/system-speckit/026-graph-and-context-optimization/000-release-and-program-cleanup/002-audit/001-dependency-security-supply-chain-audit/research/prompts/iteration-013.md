# Deep Research Iteration 13 of 25 - GitHub State

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 13 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the GitHub auth and repository permission dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. `gh auth status` scopes and account identity
2. Configured git remotes for Public
3. Git credential helper configuration
4. SSH keys inventory metadata
5. Recent SSH config and known_hosts changes
6. GitHub CLI extension inventory and aliases

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
gh auth status 2>&1
gh api user -q "{login: .login, id: .id}" 2>&1
gh api user/keys --jq ".[] | {id,title,created_at}" 2>&1
gh extension list 2>&1
gh alias list 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && git remote -v 2>&1
git config --global --show-origin --get-regexp "credential|url\..*insteadOf|includeIf|core.sshCommand" 2>&1
ls -la ~/.ssh 2>&1; find ~/.ssh -maxdepth 1 -type f -newermt "2026-05-15 00:00" -ls 2>&1
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

Write to `research/iterations/iteration-013.md` with EXACT structure:

```markdown
# Iteration 013 - GitHub State

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
`{"type":"iteration","run":13,"focus":"GitHub State","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
