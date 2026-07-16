Now I have all evidence. Let me write the iteration output.
Iteration 024 complete. Summary:

**Verdict: INDICATORS-PRESENT** — no CRITICAL IOCs.

**Verified findings:**
- **Iter 016 (Git history)**: Clean confirmed — 4 commits today, all deep-research campaign, zero suspicious patterns
- **Iter 017 (CI/CD)**: `apt-get` finding is factually correct but severity downgraded MEDIUM→LOW (no token exposure, PR-only trigger). CI has zero dangerous patterns (`pull_request_target`, `secrets.*`, `id-token: write`)
- **Iter 018 (Plugin/Skill/Agent)**: Both MEDIUM findings confirmed — unpinned `npx -y` in `.devin/config.json:4` and `.gemini/settings.json:22`; `bash -c` with env interpolation in `.devin/hooks.v1.json:8,20`
- **Iter 019 (Network)**: 5 HIGH confirmed — firewall disabled (State=0), FontBase on `*:27715`, TeamViewer/Pritunl LaunchDaemons present. No active tunnels. All MCP processes legitimate.

**Outputs:**
- `research/iterations/iteration-024.md` — written
- `research/deep-research-state.jsonl` — appended (row 24: 0C/5H/3M/4L/8I, newInfoRatio 0.20)
|curl|wget|bash|sh -c|uses: [^@]+$|persist-credentials|id-token: write)" .github/workflows` (EXIT 1 — no dangerous patterns)
- `rg "(allowed-tools|permission|dangerous|full-auto|curl|wget|npx|uvx|docker|http://|https://|token|secret|MCP|mcp|eval|base64)" .opencode/plugins .opencode/skills .claude/agents .codex/agents .gemini .devin` (147+ lines; all false-positives in agent docs, skill configs, and command TOML)
- `.devin/config.json` (line 4: `npx` command; line 58: local `.venv/bin/ccc`)
- `.devin/hooks.v1.json` (lines 8, 20: `bash -c` with `${DEVIN_PROJECT_DIR}` interpolation)
- `.gemini/settings.json` (line 22: `npx -y @modelcontextprotocol/server-sequential-thinking`, unpinned)
- `lsof -nP -iTCP -sTCP:LISTEN` (33 listeners; 4 on `*`, 29 on 127.0.0.1/::1)
- `ps auxww | grep -Ei "(ngrok|cloudflared|ssh -R|socat|serve|listen|mcp)"` (no tunnels; MCP processes all legitimate)
- `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate` (Firewall is disabled. State = 0)
- `ls /Library/LaunchDaemons/ | grep -iE "(teamviewer|pritunl|docker)"` (6 plist files found)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-019-H1 | macOS Application Firewall disabled | `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate`: "Firewall is disabled. (State = 0)" | Enable: `sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on` |
| V-019-H2 | Third-party service listening on all interfaces (FontBase) | `lsof -nP -iTCP -sTCP:LISTEN`: `FontBase 989 ... TCP *:27715 (LISTEN)` — third-party font manager bound to `0.0.0.0` | Bind to 127.0.0.1 or remove FontBase if unused |
| V-019-H3 | TeamViewer LaunchDaemon installed | `com.teamviewer.Helper.plist`, `com.teamviewer.UninstallerHelper.plist`, `com.teamviewer.UninstallerWatcher.plist` in `/Library/LaunchDaemons/` | Uninstall TeamViewer if not actively used: `sudo rm /Library/LaunchDaemons/com.teamviewer.*.plist` |
| V-019-H4 | Pritunl VPN daemon installed | `com.pritunl.service.plist` in `/Library/LaunchDaemons/` | Uninstall Pritunl if not actively used |
| V-019-H5 | Apple services on all interfaces (rapportd, ControlCenter AirPlay) | `rapportd *:49152`, `ControlCenter *:7000`, `ControlCenter *:5000` — Apple trusted services but exposed | Disable AirPlay Receiver in System Settings; verify rapportd is necessary |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-018-M1 | npx -y installs unpinned MCP server (supply-chain risk) | `.devin/config.json:4`: `"command": "npx"` (no version); `.gemini/settings.json:22`: `npx -y @modelcontextprotocol/server-sequential-thinking` (no `@version`) | Pin exact versions: `@modelcontextprotocol/server-sequential-thinking@X.Y.Z` |
| V-018-M2 | bash -c with shell variable interpolation (command injection surface) | `.devin/hooks.v1.json:8`: `"bash -c 'cd \"${DEVIN_PROJECT_DIR}\" && /opt/homebrew/bin/node ...'"`; line 20 duplicates pattern | Quote `${DEVIN_PROJECT_DIR}` with `printf %q` or use `exec` without shell |
| V-019-M1 | Docker LaunchDaemons installed (com.docker.socket.plist, com.docker.vmnetd.plist) | Present in `/Library/LaunchDaemons/` but no Docker process running — residue from prior install | Uninstall Docker if unused: follow Docker Desktop uninstall procedure |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-017-L1 | apt-get in CI workflow (severity downgrade from prior MEDIUM) | `.github/workflows/isolation-check.yml:18`: `sudo apt-get update && sudo apt-get install -y ripgrep` — benign: PR-triggered, no token exposure, trusted package | Use pre-installed ripgrep on ubuntu-latest or cache via `actions/cache` |
| V-017-L2 | No explicit `permissions:` block in CI workflow | `.github/workflows/isolation-check.yml`: no top-level permissions declaration; safe defaults but implicit | Add `permissions: read-all` or explicit `contents: read` |
| V-018-L1 | Broad agent tool permissions (design observation) | `.claude/agents/deep-ai-council.md:4`: `mcp__mk_spec_memory__*` wildcard; similar patterns in orchestrate, deep-research, deep-review agents | Audit MCP tool grants and narrow to minimum required methods |
| V-018-L2 | Curl pipe-to-bash install patterns in skill documentation | `.devin/config.json:64`: `"_NOTE_1": "Install: bash .opencode/skills/mcp-coco-index/scripts/install.sh"` — local script execution, not curl|pipe | Document as informational; no auto-execution path exists |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-016-I1 | Git history clean for 30-day window | `git log --since="30 days ago" -p --all` returned 4 commits (all 2026-05-15 deep-research); no `eval(`, `new Function`, `curl | sh`, `base64 -d`, `chmod +x`, `rm -rf` patterns | None needed |
| V-017-I1 | CI workflow positive: no dangerous patterns | `rg "(pull_request_target|secrets\.|GITHUB_TOKEN|persist-credentials|id-token: write)" .github/workflows` — EXIT 1 (no matches) | None needed |
| V-017-I2 | CI workflow uses versioned actions/checkout@v4 | `.github/workflows/isolation-check.yml:14`: `uses: actions/checkout@v4` | None needed |
| V-018-I1 | `.claude/agents/code.md` has bash-write-bypass guardrail | Line 61: "No Bash write bypass: no shell redirection, sed -i, eval..." — positive security control documented | None needed |
| V-018-I2 | `.claude/agents/code.md` blocks Task tool at runtime | Line 31: `permission.task: deny` — runtime-level restriction | None needed |
| V-019-I1 | No active tunnels (ngrok, cloudflared, ssh -R, socat) | `ps auxww | grep -E "(ngrok|cloudflared|ssh -R|socat)"` returned EXIT 0, no matches | None needed |
| V-019-I2 | All MCP processes resolved to legitimate OpenCode infrastructure | `ps auxww | grep -i mcp` shows chrome-devtools-mcp, clickup-mcp-server, figma-developer-mcp, server-github, server-sequential-thinking, mk-spec-memory, ccc mcp, code-mode server — all local/npx from declared config | None needed |
| V-019-I3 | Repo-local ports all on localhost | 29 of 33 listeners on 127.0.0.1/::1; ollama:11434, MCP code-mode:local, Windsurf:127.0.0.1, etc. | None needed |

## Convergence Signal
newInfoRatio: 0.20 — Most iter 016-019 findings confirmed verbatim. New signal: FontBase on `*:27715` identified as the specific third-party service on all interfaces; LaunchDaemon enumeration confirmed TeamViewer/Pritunl/Docker presence; CI workflow verified to have NO dangerous GitHub Actions patterns (positive). Verdict: INDICATORS-PRESENT for the code/history/CI/network dimension. No CRITICAL IOCs or compromise indicators in the Public repo itself. Real OS-level exposure (disabled firewall, TeamViewer/Pritunl, FontBase on `*`) exists but is host configuration, not repo compromise.
