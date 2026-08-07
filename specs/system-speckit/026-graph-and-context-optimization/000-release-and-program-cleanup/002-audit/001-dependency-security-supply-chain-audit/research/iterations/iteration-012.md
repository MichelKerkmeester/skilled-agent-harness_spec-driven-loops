# Iteration 012 - Auth State Files

## Summary
CRITICAL credential exposure identified: Devin session token stored in world-readable file. Multiple other auth/config files have overly permissive permissions but do not contain credentials. No repo-local auth files accidentally committed.

## Files/Commands Reviewed
- `find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f 2>&1 | grep -Ei "(auth|credential|token|secret|key|host|config|json|toml|yaml|yml|db)$" | sort` (exit code 0, found 1257+ auth/config files)
- `find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f 2>&1 | grep -Ei "(auth|credential|token|secret|key|host|config|json|toml|yaml|yml|db)$" | xargs -I {} stat -f "%Sp %Su:%Sg %Sm %N" -t "%Y-%m-%dT%H:%M:%S%z" {} 2>&1` (exit code 0, permissions and timestamps retrieved)
- `find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f -newermt "2026-05-15 00:00" -ls 2>&1` (exit code 0, 1010 files modified since disclosure)
- `find ~/.claude ~/.codex ~/.config/devin ~/.local/share/devin ~/.gemini ~/.config/gh -maxdepth 4 -type f -perm +044 -print 2>&1 | xargs -I {} ls -l {} 2>&1` (exit code 0, 13055+ world-readable files)
- `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!.git/**" --glob "!**/*.sqlite*" "(auth.json|credentials.toml|hosts.yml|oauth|refresh_token|access_token|api_key|secret_key)" . 2>&1` (exit code 0, no credential files in repo)
- `/Users/michelkerkmeester/.claude/settings.json` (323 lines, configuration only)
- `/Users/michelkerkmeester/.config/gh/hosts.yml` (6 lines, GitHub user config, mode 600)
- `/Users/michelkerkmeester/.claude/mcp-needs-auth-cache.json` (1 line, MCP server IDs, mode 644)
- `/Users/michelkerkmeester/.local/share/devin/credentials.toml` (4 lines, contains session token, mode 644)
- `/Users/michelkerkmeester/.config/devin/config.json` (13 lines, configuration only, mode 600)
- `/Users/michelkerkmeester/.codex/config.toml` (122 lines, configuration only, mode 600)
- `git status --porcelain` (exit code 0, no auth files staged)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 012-001 | Devin session token exposed via world-readable file | `/Users/michelkerkmeester/.local/share/devin/credentials.toml` contains `windsurf_api_key = "devin-session-token$eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` (JWT session token) with permissions `-rw-r--r--` (644), allowing any user on the system to read the credential. File modified 2026-05-12T11:11:29+0200. | Run `chmod 600 ~/.local/share/devin/credentials.toml` immediately. Rotate the session token via Devin CLI (`devin auth logout` then `devin auth login`) after fixing permissions. |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 012-002 | MCP auth cache file world-readable | `/Users/michelkerkmeester/.claude/mcp-needs-auth-cache.json` has permissions `-rw-r--r--` (644). Contains MCP server IDs for Google Drive, Notion, Google Calendar, Gmail services. While not direct credentials, this metadata could aid in targeted attacks. File modified 2026-05-15T14:32:04+0200. | Run `chmod 600 ~/.claude/mcp-needs-auth-cache.json`. Review if MCP server IDs are sensitive. |
| 012-003 | Extensive world-readable auth/config files | 13055+ files across ~/.claude, ~/.codex, ~/.config/devin, ~/.local/share/devin, ~/.gemini, ~/.config/gh have world-readable permissions (644). While most do not contain credentials, this creates unnecessary attack surface. Examples include session files, task files, cache files, and project metadata. | Audit and restrict permissions on sensitive files. Use `find` with `-perm +044` to identify world-readable files, then apply `chmod 600` or `chmod 640` as appropriate. Consider umask configuration. |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 012-004 | Recent file modifications post-disclosure | 1010 files modified since 2026-05-15 00:00 (disclosure time) across Claude, Codex, Devin directories. These include session files, task files, cache files, and project metadata. All modifications appear to be normal development activity, not suspicious. | No action needed. Continue monitoring for unusual patterns. |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 012-005 | GitHub CLI config properly permissioned | `/Users/michelkerkmeester/.config/gh/hosts.yml` exists with mode 600 (owner read/write only), contains GitHub user configuration but no exposed tokens. Permissions are correct. | No action needed. |
| 012-006 | No repo-local auth files committed | Ripgrep search found no auth.json, credentials.toml, hosts.yml, oauth, refresh_token, access_token, api_key, or secret_key patterns in the repository (excluding .git and SQLite files). Git status shows no auth files staged. | No action needed. |
| 012-007 | Devin config properly permissioned | `/Users/michelkerkmeester/.config/devin/config.json` has mode 600, contains only configuration (org_id, shell setup, theme, agent model) without credentials. | No action needed. |
| 012-008 | Codex config properly permissioned | `/Users/michelkerkmeester/.codex/config.toml` has mode 600, contains only configuration (personality, model, projects, profiles, plugins) without credentials. | No action needed. |
| 012-009 | Claude settings properly permissioned | `/Users/michelkerkmeester/.claude/settings.json` contains only configuration (env vars, permissions, hooks, status line) without credentials. | No action needed. |

## Convergence Signal
newInfoRatio: 0.85 (HIGH - CRITICAL credential exposure discovered)

Verdict: COMPROMISE-CONFIRMED - Direct credential exposure identified (Devin session token in world-readable file). Immediate remediation required. The world-readable permissions on the credentials.toml file represent an active security threat where any user on the system could extract and use the session token.
