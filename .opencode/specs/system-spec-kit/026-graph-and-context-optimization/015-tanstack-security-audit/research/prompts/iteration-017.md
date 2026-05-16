# Deep Research Iteration 17 of 25 - CI/CD Workflows

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 17 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the CI/CD workflow dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. `.github/workflows/*.yml` and `*.yaml`
2. Workflow permissions and secret exposure risk
3. Unpinned actions, curl|bash, npm install scripts, and pull_request_target
4. Artifact upload/download paths
5. GitHub token permissions and environment scopes
6. Workflow files changed recently

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .github/workflows -maxdepth 1 -type f \( -name "*.yml" -o -name "*.yaml" \) -print 2>&1 | sort
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .github/workflows -maxdepth 1 -type f \( -name "*.yml" -o -name "*.yaml" \) -print 2>&1 | xargs -I {} nl -ba {} 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "(pull_request_target|permissions:|secrets\.|GITHUB_TOKEN|curl|wget|bash|sh -c|npm install|npm ci|pnpm|yarn|actions/checkout@|uses: [^@]+$|upload-artifact|download-artifact|persist-credentials|id-token: write)" .github/workflows 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && git log --since="30 days ago" -- .github/workflows 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "(workflow_dispatch|schedule:|repository_dispatch|environment:|deploy|release|publish)" .github/workflows 2>&1
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

Write to `research/iterations/iteration-017.md` with EXACT structure:

```markdown
# Iteration 017 - CI/CD Workflows

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
`{"type":"iteration","run":17,"focus":"CI/CD Workflows","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
