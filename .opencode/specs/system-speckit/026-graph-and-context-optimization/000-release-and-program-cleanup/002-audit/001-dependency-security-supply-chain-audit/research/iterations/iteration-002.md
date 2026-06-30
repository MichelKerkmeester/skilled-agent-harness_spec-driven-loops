# Iteration 002 - Stolen Credential Exposure

## Summary
No CRITICAL or HIGH severity findings. One MEDIUM severity finding for hardcoded placeholder token in test file and world-readable task files. LOW and INFO findings include documentation references and properly permissioned credential files. No actual stolen credentials or compromise indicators found.

## Files/Commands Reviewed

### Commands Executed
- `rg -n --hidden --glob "!.git/**" --glob "!**/*.sqlite*" "(ghp_|github_pat_|npm_|NPM_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY|GEMINI_API_KEY|DEVIN_API_KEY|AWS_SECRET_ACCESS_KEY|BEGIN .* PRIVATE KEY)" .` (exit code 0, found documentation references only)
- `git log --since="30 days ago" -p --all -- . | rg -n "(ghp_|github_pat_|npm_|NPM_TOKEN|API_KEY|SECRET|PRIVATE KEY|AUTH_TOKEN)"` (exit code 0, found placeholder tokens only)
- `ls -la ~/.npmrc ~/.netrc ~/.config/gh/hosts.yml` (exit code 1, ~/.netrc not found, others exist with mode 600)
- `for f in ~/.npmrc ~/.netrc ~/.config/gh/hosts.yml; do [ -f "$f" ] && sed -E "s/(token|password|oauth_token|_authToken)([=: ]+).*/\1\2[REDACTED]/Ig" "$f"; done` (exit code 0, redacted content reviewed)
- `env | sort | grep -Ei "(token|secret|api[_-]?key|password|auth)" | sed -E "s/=(.*)$/=[REDACTED]/"` (exit code 0, found MAX_THINKING_TOKENS, SSH_AUTH_SOCK)
- `find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini -maxdepth 3 -type f | grep -Ei "(auth|credential|token|secret|key|config|json|toml|yaml|yml)$" | xargs -I {} ls -l {}` (exit code 0, found 100+ files with various permissions)

### Key Files Reviewed
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts` (line 107)
- `/Users/michelkerkmeester/.npmrc` (mode 600, contains auth token)
- `/Users/michelkerkmeester/.config/gh/hosts.yml` (mode 600, GitHub config)
- `~/.claude/tasks/*/` (multiple files, mode 644 world-readable)
- Multiple documentation files with API key references (instructional only)

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
| 001 | Hardcoded placeholder token in test file | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts:107` contains `process.env.GITHUB_COPILOT_TOKEN = 'ghp_token';` - hardcoded token pattern in test code | Replace with environment variable or mock that doesn't use token-like strings; use `process.env.GITHUB_COPILOT_TOKEN = 'test_token_value';` or mock the env var detection entirely |
| 002 | World-readable task files with potential sensitive content | 100+ files in `~/.claude/tasks/*/` have mode 644 (owner read/write, group/others read-only). While current content appears benign (task metadata), future task data could contain sensitive information | Change default file creation mode to 600 for `~/.claude/tasks/` directory or restrict group/other read permissions on the directory itself |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | Documentation contains API key references | Multiple files (`.vscode/mcp.json:21-22`, `.codex/config.toml:24-26`, `.devin/config.json:19-21`, `.claude/mcp.json:19-21`, `.gemini/settings.json:36-38`, `.opencode/install_guides/README.md:187-191`) reference `VOYAGE_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY` in documentation notes | These are instructional and acceptable; consider adding clear "DO NOT COMMIT REAL TOKENS" warnings if not already present |
| 002 | Environment variables with token-like names | Environment scan found `MAX_THINKING_TOKENS=[REDACTED]` and `SSH_AUTH_SOCK=[REDACTED]` set | These are operational variables, not credential leaks; `SSH_AUTH_SOCK` is a socket path, `MAX_THINKING_TOKENS` is a configuration value - no action needed |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | npmrc auth token properly permissioned | `/Users/michelkerkmeester/.npmrc` exists with mode 600 (owner read/write only), contains `//registry.npmjs.org/:_authToken=[REDACTED]` | Permissions are correct (600); token is properly scoped to npm registry; no action needed |
| 002 | GitHub CLI config properly permissioned | `/Users/michelkerkmeester/.config/gh/hosts.yml` exists with mode 600 (owner read/write only), contains GitHub user configuration but no exposed tokens | Permissions are correct (600); no action needed |
| 003 | netrc file not present | `/Users/michelkerkmeester/.netrc` does not exist | No action needed; absence reduces attack surface |
| 004 | Git history contains only placeholder tokens | Git log search found `ghp_1234567890abcdefghijklmnopqrstuvwxyz` patterns in commits, but these are clearly test placeholders (not valid GitHub token format) | No action needed; these are legitimate test fixtures |
| 005 | No actual secrets in working tree | Ripgrep search found 692 matches for token patterns, but all are in documentation, config comments, or test fixtures - no actual credential values | No action needed; codebase follows good secret hygiene practices |

## Convergence Signal
newInfoRatio=0.15 - INDICATORS-PRESENT

The stolen credential exposure dimension shows defensive gaps (MEDIUM: hardcoded test token, world-readable task files) but no actual compromise indicators. No CRITICAL or HIGH severity findings. Credential files are properly permissioned (600). Git history and working tree are clean of actual secrets. The findings represent best-practice deviations rather than active threats. This dimension does not indicate compromise related to the TanStack Mini Shai-Hulud supply-chain attack.
