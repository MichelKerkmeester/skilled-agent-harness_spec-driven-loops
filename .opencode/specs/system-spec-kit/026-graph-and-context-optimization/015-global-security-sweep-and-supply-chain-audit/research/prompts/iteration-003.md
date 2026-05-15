# Deep Research Iteration 3 of 25 - Supply-Chain npm

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 3 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the npm supply-chain dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. All package manifests and lockfiles in Public
2. `~/.npm/_npx/` transient execution cache inventory
3. Known TanStack references and versions
4. Lifecycle scripts in package manifests
5. Lockfile resolved tarball URLs and non-npm registries
6. Recently modified npm cache entries from 2026-05-15 onward

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find . -name node_modules -prune -o \( -name package.json -o -name package-lock.json -o -name npm-shrinkwrap.json -o -name pnpm-lock.yaml \) -print 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find . -name node_modules -prune -o -name package-lock.json -print 2>&1 | xargs -I {} rg -n "@tanstack/|resolved|integrity|postinstall|preinstall|prepare|install" {} 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "@tanstack/" . --glob "package*.json" --glob "pnpm-lock.yaml" 2>&1
find ~/.npm/_npx -maxdepth 4 \( -name package.json -o -name package-lock.json \) -print 2>&1 | xargs -I {} rg -n "@tanstack/|postinstall|preinstall|prepare|install" {} 2>&1
find ~/.npm -type f -newermt "2026-05-15 00:00" 2>&1 | head -200
npm config list --json 2>&1 | sed -E "s/(token|password|_authToken)/[REDACTED_KEY]/Ig"
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

Write to `research/iterations/iteration-003.md` with EXACT structure:

```markdown
# Iteration 003 - Supply-Chain npm

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
`{"type":"iteration","run":3,"focus":"Supply-Chain npm","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
