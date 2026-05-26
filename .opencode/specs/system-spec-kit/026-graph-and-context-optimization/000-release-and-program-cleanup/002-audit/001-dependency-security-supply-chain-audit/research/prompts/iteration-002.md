# Deep Research Iteration 2 of 25 - Stolen Credential Exposure

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 2 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the stolen credential exposure dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. Repo working tree secret patterns excluding binary database files
2. Recent git history for token-like additions
3. `~/.npmrc`, `~/.netrc`, and GitHub host state metadata
4. Shell environment variable names containing token, key, secret, auth, or password
5. Codex, Claude, Devin, Gemini auth/config filenames and permissions
6. World/group-readable credential file risk

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!.git/**" --glob "!**/*.sqlite*" "(ghp_|github_pat_|npm_|NPM_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY|GEMINI_API_KEY|DEVIN_API_KEY|AWS_SECRET_ACCESS_KEY|BEGIN .* PRIVATE KEY)" . 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && git log --since="30 days ago" -p --all -- . 2>&1 | rg -n "(ghp_|github_pat_|npm_|NPM_TOKEN|API_KEY|SECRET|PRIVATE KEY|AUTH_TOKEN)" 2>&1
ls -la ~/.npmrc ~/.netrc ~/.config/gh/hosts.yml 2>&1
for f in ~/.npmrc ~/.netrc ~/.config/gh/hosts.yml; do [ -f "$f" ] && sed -E "s/(token|password|oauth_token|_authToken)([=: ]+).*/\1\2[REDACTED]/Ig" "$f"; done 2>&1
env | sort | grep -Ei "(token|secret|api[_-]?key|password|auth)" 2>&1 | sed -E "s/=(.*)$/=[REDACTED]/"
find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini -maxdepth 3 -type f 2>&1 | grep -Ei "(auth|credential|token|secret|key|config|json|toml|yaml|yml)$" | xargs -I {} ls -l {} 2>&1
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

Write to `research/iterations/iteration-002.md` with EXACT structure:

```markdown
# Iteration 002 - Stolen Credential Exposure

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
`{"type":"iteration","run":2,"focus":"Stolen Credential Exposure","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
