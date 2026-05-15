# Deep Research Iteration 12 of 25 - Auth State Files

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 12 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the auth state file dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. Claude/Codex/Devin/Gemini/GitHub auth and config files
2. File permissions and last-modified timestamps
3. Token-bearing filenames without printing secret values
4. World/group-readable credential risk
5. Recent changes since disclosure time
6. Repo-local auth files accidentally committed or staged

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f 2>&1 | grep -Ei "(auth|credential|token|secret|key|host|config|json|toml|yaml|yml|db)$" | sort
find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f 2>&1 | grep -Ei "(auth|credential|token|secret|key|host|config|json|toml|yaml|yml|db)$" | xargs -I {} stat -f "%Sp %Su:%Sg %Sm %N" -t "%Y-%m-%dT%H:%M:%S%z" {} 2>&1
find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f -newermt "2026-05-15 00:00" -ls 2>&1
find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f -perm +044 -print 2>&1 | xargs -I {} ls -l {} 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!.git/**" --glob "!**/*.sqlite*" "(auth.json|credentials.toml|hosts.yml|oauth|refresh_token|access_token|api_key|secret_key)" . 2>&1
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

Write to `research/iterations/iteration-012.md` with EXACT structure:

```markdown
# Iteration 012 - Auth State Files

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
`{"type":"iteration","run":12,"focus":"Auth State Files","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
