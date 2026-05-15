# Deep Research Iteration 5 of 25 - postinstall Script Audit

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 5 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the package lifecycle script dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. Every `package.json` under Public
2. Nested `node_modules/**/package.json` lifecycle scripts where installed dependencies exist
3. Script targets under `scripts/`, `bin/`, and package `bin` entries
4. Lifecycle commands containing shell pipes, network fetches, chmod, eval, node -e, or base64 decode
5. Package managers that may run scripts automatically
6. Evidence for no lifecycle scripts where none exist

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find . -name package.json -print 2>&1 | wc -l
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "package.json" "(preinstall|postinstall|prepare|curl|wget|chmod|base64|eval|node -e|osascript|launchctl)" . 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find . -path "*/node_modules/*/package.json" -print 2>&1 | head -500 | xargs -I {} rg -n "(preinstall|install|postinstall|prepare|curl|wget|chmod|base64|eval|node -e|bash|sh -c)" {} 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!**/.git/**" --glob "*.sh" --glob "*.js" "(curl|wget).*[|].*(sh|bash)|rm -rf ~|launchctl|systemctl --user|crontab|chmod \+x|base64 -d|eval\(" . 2>&1
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

Write to `research/iterations/iteration-005.md` with EXACT structure:

```markdown
# Iteration 005 - postinstall Script Audit

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
`{"type":"iteration","run":5,"focus":"postinstall Script Audit","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
