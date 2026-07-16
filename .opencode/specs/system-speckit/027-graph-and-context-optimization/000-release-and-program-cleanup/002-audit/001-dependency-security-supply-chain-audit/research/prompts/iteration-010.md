# Deep Research Iteration 10 of 25 - PATH Integrity + Shadow Binaries

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 10 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the PATH integrity and shadow binary dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. All PATH entries in interactive shell order
2. `which -a` and `type -a` for developer commands
3. Writable PATH directories before system directories
4. Unexpected binaries in user bin paths
5. Recently modified executable files in user bin directories
6. Hash comparison of repeated binary names where feasible

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
zsh -lic "echo PATH=$PATH; for c in npm npx node git gh codex claude devin gemini python3 pip uv cargo brew; do echo ===$c===; type -a $c; which -a $c; done" 2>&1
find ~/.local/bin ~/bin /usr/local/bin /opt/homebrew/bin -maxdepth 1 -type f -perm +111 -print 2>&1 | sort | sed -n "1,300p"
find ~/.local/bin ~/bin /usr/local/bin /opt/homebrew/bin -maxdepth 1 -type f -perm +111 -newermt "2026-05-15 00:00" -ls 2>&1
for c in npm npx node git gh codex claude devin gemini python3 pip uv cargo brew; do which -a "$c" 2>/dev/null | xargs -I {} shasum -a 256 {} 2>/dev/null; done 2>&1
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

Write to `research/iterations/iteration-010.md` with EXACT structure:

```markdown
# Iteration 010 - PATH Integrity + Shadow Binaries

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
`{"type":"iteration","run":10,"focus":"PATH Integrity + Shadow Binaries","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
