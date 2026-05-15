# Iteration 023 - VERIFICATION of iter 011-015 Runtime + Auth

## Summary
Verification of **Iteration 023 complete.** Results:

| Severity | Count | Key Items |
|----------|-------|-----------|
| CRITICAL | 3 | Devin token still 644, `--dangerously-skip-permissions` active in 3+ Claude/OpenCode processes, `npx -y` persists in MCP configs |
| HIGH | 3 | External MCP @latest supply-chain risk, Gemini chat sessions (150+ files) world-readable, opencode.json 644 with full-allow permissions |
| MEDIUM | 3 | Devin sessions.db 644, permission-escalation modes normalized in skill docs, no tool allowlisting |
| LOW | 2 | Scattered config files, Chrome DevTools browser automation |
| INFO | 3 | GitHub auth clean, iter-013 verified, no unexpected transport endpoints |

**Convergence: INDICATORS-PRESENT** (newInfoRatio 0.42) — CRITICAL findings from iter-011/012 confirmed unresolved. New finding C-023-02 documents active `--dangerously-skip-permissions` flags in running processes. No new active compromise IOCs beyond iter-012's COMPROMISE-CONFIRMED Devin token exposure.
 full-allow permission config)
- `.utcp_config.json` (5 enabled external MCP providers)
- `ps aux` for MCP/shell processes (7 running Claude/OpenCode with `--dangerously-skip-permissions`)
- `~/.local/share/devin/credentials.toml` (4 lines, 644 perms, active JWT session token)
- `~/.config/devin/config.json` (600 perms - GOOD)
- `~/.config/gh/config.yml` and `hosts.yml` (600 perms - GOOD)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| C-023-01 | Devin credentials.toml world-readable with active JWT token | `~/.local/share/devin/credentials.toml`: 644 perms (`-rw-r--r--`), 4 lines, contains `windsurf_api_key` with JWT session token (`devin-session-token$eyJ...`) + `api_server_url` pointing to `server.codeium.com` + `devin_webapp_host` pointing to `app.devin.ai`. Any local user can read this file. | `chmod 600 ~/.local/share/devin/credentials.toml` |
| C-023-02 | Multiple `--dangerously-skip-permissions` processes active | `ps aux` shows 3 Claude processes (PIDs 11813, 53419, 31169) running with `--dangerously-skip-permissions` flag; shell processes (PIDs 17127, 16844) dispatching `opencode run --dangerously-skip-permissions`. Grants unrestricted filesystem write to AI agents. | Use `--permission-mode plan` for read-only and `--permission-mode acceptEdits` for controlled writes. Never run long-lived agents with `--dangerously-skip-permissions`. |
| C-023-03 | `npx -y` in MCP configs enables supply-chain auto-install | `opencode.json:17-19`: `sequential_thinking` MCP server uses `["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]`. The `-y` flag auto-confirms npm install without user prompt. In context of TanStack npm Mini Shai-Hulud attack, any compromised package matching an npx specifier would be silently installed and executed. | Replace `npx -y` with version-pinned local installs using `package.json` + lockfile, or use `npx` without `-y` flag. |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| H-023-01 | External npm-based MCP servers via `@latest` tag | `.utcp_config.json`: 5 enabled manual call templates (chrome_devtools_1, chrome_devtools_2, clickup, figma, github). Processes show `npm exec chrome-devtools-mcp@latest`, `npm exec figma-developer-mcp --stdio`, `npm exec @taazkareem/clickup-mcp-server@latest` (PIDs 17046, 17004, 16983, 16962). Supply-chain compromise of any of these packages silently propagates. | Pin versions in `.utcp_config.json` command args, verify checksums/SLSA provenance, consider running MCP servers in isolated containers. |
| H-023-02 | Gemini chat sessions world-readable (644) | `~/.gemini/tmp/public/chats/`: ~150+ session JSON files all with 644 permissions (`-rw-r--r--`). These contain full conversation histories with AI assistants, potentially including code review details, security analysis context, and project architecture discussions. | `chmod 700 ~/.gemini/tmp/` or `chmod 600 ~/.gemini/tmp/**/*.json` |
| H-023-03 | opencode.json with 644 perms grants full-allow permissions | Project root `opencode.json`: 644 perms, explicitly allows `edit`, `bash`, `webfetch`, `doom_loop`, `external_directory` without restrictions. No tool allowlisting, no permission-mode constraints. Any process running in this workspace inherits unrestricted tool access. | Add `permission-mode` restrictions, implement tool allowlisting, set `chmod 600` on config file. |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| M-023-01 | Devin sessions.db world-readable (644) | `~/.local/share/devin/cli/sessions.db`: 644 perms (`-rw-r--r--`). SQLite database containing session metadata, lock files, and logs for ~80+ Devin sessions. Session data exposed to local users. | `chmod 600 ~/.local/share/devin/cli/sessions.db` |
| M-023-02 | Permission-escalation modes documented across AI CLI skills | Skills reference dangerous modes: `cli-claude-code/SKILL.md:244-245` (`--permission-mode bypassPermissions`), `cli-codex/SKILL.md:248` (`--full-auto` + `danger-full-access`), `cli-devin/SKILL.md:232-233` (`--permission-mode dangerous`), `cli-opencode/SKILL.md:293` (`--dangerously-skip-permissions` incident report). Normalizes risky configurations. | Add prominent warnings, restrict documentation to show safe defaults first, gate dangerous modes behind explicit operator confirmation. |
| M-023-03 | No tool allowlisting in opencode.json | `opencode.json`: `permission` block has no `deny` entries, no tool-specific restrictions. All tools available to any session. Contrast with principle of least privilege. | Add `"deny": []` with explicit tool restrictions, or configure `permission-mode: "acceptEdits"` as default. |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| L-023-01 | Config files scattered across multiple directories | 20 config files found across `.claude/` (3), `.codex/` (2), `.devin/` (2), `.gemini/` (3), `.vscode/` (2), `./` (2), `~/.config/` (6). Increases configuration drift risk and makes security auditing harder. | Consolidate or document config inventory; add CI check for config file permissions. |
| L-023-02 | Chrome DevTools MCP provides browser automation | `.utcp_config.json`: 2 Chrome DevTools MCP instances configured with `--isolated=true`. MCP chain: AI -> Code Mode -> Chrome DevTools -> Browser. Extends AI agent reach to full browser automation. | Audit Chrome DevTools MCP usage patterns; restrict to specific browser profiles. |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I-023-01 | GitHub auth clean | `gh auth status`: both accounts authenticated via keyring (not plaintext). `~/.config/gh/config.yml` and `hosts.yml`: 600 perms. Token scopes: `gist`, `read:org`, `repo`, `workflow` — appropriate for development. | No action needed. |
| I-023-02 | Iter-013 GitHub State verified clean | Re-ran `gh auth status` and `gh api user` — exit 0, consistent with iter-013's CLEAN verdict. No new GitHub security concerns. | No action needed. |
| I-023-03 | No unexpected transport endpoints | Search for `ws://`, `wss://`, `sse://` across `.opencode/`, `.claude/`, `.gemini/`, `.vscode/`, `.codex/`, `.devin/` found zero matches. All URLs are well-known MCP documentation/reference links. No rogue websocket or SSE transport configurations. | No action needed. |

## Convergence Signal
**newInfoRatio: 0.42** — verification confirmed 5 existing findings from iter-011/012 and surfaced 3 new findings (C-023-02 active dangerous processes, H-023-02 Gemini sessions world-readable, H-023-03 opencode.json full-allow config). No new direct IOCs of active compromise beyond iter-012's COMPROMISE-CONFIRMED status (Devin token exposure).

**Verdict: INDICATORS-PRESENT** — CRITICAL findings from iter-011 and iter-012 remain unresolved (Devin credentials still 644, `npx -y` still in MCP configs). The dimension has known exposure indicators but no new active compromise evidence discovered during this verification pass.
