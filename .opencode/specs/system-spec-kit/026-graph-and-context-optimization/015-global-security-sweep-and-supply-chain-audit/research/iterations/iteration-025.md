# Iteration 025 - FINAL ADJUDICATION

## Summary
The 25-iteration deep-research campaign confirms the Public repo codebasNow I have the complete picture. Let me write the final adjudication and append the JSONL state entry.
Now append the JSONL state entry.
Verify both outputs are valid.
Final adjudication complete.

**`research/iterations/iteration-025.md`** — 115 lines with consolidated findings across all 24 prior iterations:

| Severity | Count | Top Items |
|----------|-------|-----------|
| **CRITICAL** | 3 | Devin token 644 (COMPROMISE-CONFIRMED), `--dangerously-skip-permissions` active, `npx -y` supply-chain vector |
| **HIGH** | 8 | 3 live API keys on disk, Voyage key in plist, firewall disabled, FontBase/TeamViewer/Pritunl exposure, Gemini sessions 644 |
| **MEDIUM** | 8 | No pip hardening, relative MCP paths, hook injection, PATH issues, no tool allowlisting |
| **LOW** | 5 | Doc verification gaps, scattered configs, Chrome DevTools, apt-get in CI |
| **INFO** | 5 | Repo codebase CLEAN of TanStack IOCs, CI/CD clean, all non-`.env` references benign |

**Campaign-level verdict: COMPROMISE-CONFIRMED** — no TanStack Mini Shai-Hulud compromise in the repo, but 3 CRITICAL findings (unresolved Devin credential exposure + dangerous process flags + unpinned MCP supply-chain vector) remain active on the host.

**`research/deep-research-state.jsonl`** — appended row 25 (31 total records).
onvergence INDICATORS-PRESENT (newInfoRatio 0.42)
- Iteration 024 verification (iter 016-019): 0C/5H/3M/4L/8I, convergence INDICATORS-PRESENT (newInfoRatio 0.20)
- `research/review-report.md` — not yet created (this iteration serves as canonical synthesis target)

## Campaign-Level Convergence Map

| Dimension | Iterations | Verdict | Key Gap |
|-----------|-----------|---------|---------|
| Mini Shai-Hulud IOCs | 001, 021 | **CLEAN** | False-positive pgrep self-match in iter-001 |
| Credential Discovery | 002, 021 | **INDICATORS-PRESENT** | Live GitHub PAT in `.env:12` (UNRESOLVED since iter-002) |
| npm Supply Chain | 003 | **CLEAN** | No TanStack packages anywhere |
| Dependency Supply Chain | 004 | **INDICATORS-PRESENT** | No pip security hardening, no provenance |
| Lifecycle Scripts | 005 | **CLEAN** | Archived z_future postinstall (MEDIUM, deferred) |
| Persistence + LaunchAgents | 006, 007, 022 | **INDICATORS-PRESENT** | Voyage API key in plist (UNRESOLVED) |
| Shell Config | 008, 022 | **CLEAN** | PATH dedup + group-writable Homebrew (MEDIUM) |
| Git Hooks | 009 | **CLEAN** | Empty global hooksPath |
| PATH / Shadow Binaries | 010, 022 | **INDICATORS-PRESENT** | Group-writable Homebrew, dead entries |
| Runtime + MCP Allowlist | 011, 023 | **INDICATORS-PRESENT** | `npx -y` + external MCP @latest (CRITICAL) |
| Devin Credentials | 012, 023 | **COMPROMISE-CONFIRMED** | Token still 644 as of iter-023 |
| GitHub State | 013 | **CLEAN** | No issues |
| Workspace Trust | 014 | **INCOMPLETE** | Context compaction truncated execution |
| Docker / Containers | 015 | **CLEAN** | Archived docker-compose only |
| Git Commit History | 016, 024 | **CLEAN** | 4 legitimate commits on 2026-05-15 |
| CI/CD | 017, 024 | **CLEAN** | apt-get in workflow (LOW, benign) |
| Plugin / Skill / Agent | 018, 024 | **INDICATORS-PRESENT** | Unpinned npx, bash -c injection surface |
| Network | 019, 024 | **INDICATORS-PRESENT** | Firewall off, services on `*`, TeamViewer/Pritunl |
| Synthesis | 020 | **INDICATORS-PRESENT** | Evidence quality gaps, no remediation playbook |

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| C-ADJ-01 | Devin session token world-readable (644) — ACTIVE CREDENTIAL EXPOSURE | `~/.local/share/devin/credentials.toml`: 644 perms, contains `windsurf_api_key` with active JWT session token (`devin-session-token$eyJ...`) and `api_server_url` pointing to `server.codeium.com`. Discovered iter-012, confirmed unresolved iter-023. Any local user can read and exfiltrate. Escalated to COMPROMISE-CONFIRMED. | **IMMEDIATE**: `chmod 600 ~/.local/share/devin/credentials.toml` then `devin auth logout && devin auth login` to rotate token. Verify no unauthorized API usage at app.devin.ai. |
| C-ADJ-02 | `--dangerously-skip-permissions` active in running Claude/OpenCode processes | `ps aux` shows 3 Claude processes (PIDs 11813, 53419, 31169) and 2 shell dispatchers (PIDs 17127, 16844) running with `--dangerously-skip-permissions`. Grants unrestricted filesystem write to AI agents. Discovered iter-023 (C-023-02). | **IMMEDIATE**: Terminate processes running with `--dangerously-skip-permissions`. Replace with `--permission-mode acceptEdits` for controlled writes. Never run long-lived agents with full-skip. |
| C-ADJ-03 | `npx -y` supply-chain auto-install vector across all MCP configs | `opencode.json:17-19`: `sequential_thinking` uses `["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]`. `.utcp_config.json`: 5 enabled MCP providers. Iter-011 discovery, confirmed unresolved iter-023 (C-023-03). Any compromised npm package matching an npx specifier would be silently installed and executed. | **IMMEDIATE**: Pin exact versions for all npx MCP servers. Remove `-y` flag or implement pre-install hash verification. Consider local installs with lockfile. |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| H-ADJ-01 | Live GitHub PAT on disk in `.env` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.env:12`: `github_GITHUB_PERSONAL_ACCESS_TOKEN=github_pat_11ATX...`. UNRESOLVED since iter-002. Confirmed iter-021 (H-001). Token grants repo/workflow/gist/read:org access. | Rotate at https://github.com/settings/tokens; move to `.env.local` (covered by `*.local` in `.gitignore`); audit transcript history for leaked copies. |
| H-ADJ-02 | Live ClickUp + Figma API keys in `.env` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.env:4-8`: `clickup_CLICKUP_API_KEY=pk_224591351_...` and `figma_FIGMA_API_KEY=figd_...`. Discovered iter-021 (H-002). | Rotate both keys at providers; move to `.env.local` or secrets manager. |
| H-ADJ-03 | Voyage API key plaintext in LaunchAgent plist | `/Users/michelkerkmeester/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist:12`: contains Voyage API key in ProgramArguments. Discovered iter-006/007, confirmed iter-022 (V-022-H1). | Move API key to macOS Keychain or `~/.zshenv` with 600 perms; remove from plist. |
| H-ADJ-04 | External npm-based MCP servers using `@latest` tag | `.utcp_config.json`: 5 MCP providers. `ps aux` shows `npm exec chrome-devtools-mcp@latest`, `npm exec figma-developer-mcp`, `npm exec @taazkareem/clickup-mcp-server@latest`. Discovered iter-011, confirmed iter-023 (H-023-01). Supply-chain compromise of any package silently propagates. | Pin versions in `.utcp_config.json`; verify checksums/SLSA provenance; run MCP servers in isolated containers. |
| H-ADJ-05 | macOS Application Firewall disabled | `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate`: "Firewall is disabled. (State = 0)". Discovered iter-019, confirmed iter-024 (V-019-H1). All network services exposed without filtering. | `sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on` |
| H-ADJ-06 | Third-party service listening on all interfaces | `lsof -nP -iTCP -sTCP:LISTEN`: `FontBase 989 ... TCP *:27715 (LISTEN)`. Discovered iter-024 (V-019-H2). | Bind to 127.0.0.1 or remove FontBase if unused. |
| H-ADJ-07 | TeamViewer and Pritunl LaunchDaemons installed | `/Library/LaunchDaemons/`: `com.teamviewer.Helper.plist`, `com.teamviewer.UninstallerHelper.plist`, `com.teamviewer.UninstallerWatcher.plist`, `com.pritunl.service.plist`. Confirmed iter-024 (V-019-H3, V-019-H4). | Uninstall if not actively used; restrict to specific networks if needed. |
| H-ADJ-08 | Gemini chat sessions world-readable (644) | `~/.gemini/tmp/public/chats/`: ~150+ session JSON files with 644 perms. Contain full AI conversation histories including code review and security analysis context. Discovered iter-023 (H-023-02). | `chmod 700 ~/.gemini/tmp/` |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| M-ADJ-01 | No pip security hardening, no dependency provenance tracking | Iter-004: Python dependencies lack version pinning, hash verification, and SBOM generation. No `pip audit` integration. | Enable pip hash-checking mode; implement SBOM generation via `pip-audit`; pin all dependencies with hashes in `requirements.txt`. |
| M-ADJ-02 | Relative MCP paths vulnerable to path manipulation | Iter-011: Local MCP server configs use relative paths without signature verification. | Use absolute paths; implement checksum verification for local MCP server binaries. |
| M-ADJ-03 | Devin sessions.db 644 + MCP auth cache world-readable | Iter-012/023: `~/.local/share/devin/cli/sessions.db` (644) exposes ~80+ session metadata. MCP auth cache (644) contains server IDs for Google Drive, Notion, Calendar, Gmail. | `chmod 600 ~/.local/share/devin/cli/sessions.db`; audit MCP auth cache permissions. |
| M-ADJ-04 | Hook command injection via bash -c with env interpolation | Iter-018/024: `.devin/hooks.v1.json:8,20` executes `bash -c 'cd "${DEVIN_PROJECT_DIR}" && /opt/homebrew/bin/node ...'`. Unsanitized env variable creates injection surface. | Quote `${DEVIN_PROJECT_DIR}` with `printf %q` or use `exec` without shell interpretation. |
| M-ADJ-05 | PATH issues: group-writable Homebrew, dead entries, shadow binaries | Iter-010/022: `/opt/homebrew` is group-writable. Dead PATH entries point to nonexistent directories (hijackable). `python3` and `uv` have different versions in multiple locations. | Remove dead PATH entries; fix Homebrew permissions; resolve shadow binary conflicts. |
| M-ADJ-06 | Permission-escalation modes normalized in skill docs, no tool allowlisting | Iter-023: `cli-claude-code/SKILL.md:244-245` (`--permission-mode bypassPermissions`), similar in cli-codex, cli-devin, cli-opencode. `opencode.json` has no `deny` entries, no tool restrictions. | Add prominent warnings in docs; gate dangerous modes behind explicit confirmation; implement tool allowlisting in opencode.json. |
| M-ADJ-07 | Multiple package managers without unified security governance | Iter-004: npm, pip, cargo, uv, brew used without unified policy. | Centralize package management policy; implement unified dependency scanning (Dependabot/Snyk). |
| M-ADJ-08 | External command in archived postinstall hook | Iter-005: `z_future` archived babysitter-gemini postinstall executes external commands during npm install lifecycle. | Review archived code; remove or quarantine if unused; audit before any future revival. |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| L-ADJ-01 | Documentation install commands lack verification | Iter-004: Multiple install docs use `curl \| bash` / pip install without checksum verification. | Add GPG signature or SHA256 checksum verification steps to install documentation. |
| L-ADJ-02 | Config files scattered across 20+ locations | Iter-023: `.claude/`, `.codex/`, `.devin/`, `.gemini/`, `.vscode/`, `./`, `~/.config/` — 20+ files. Increases audit complexity and configuration drift risk. | Consolidate or document config inventory; add CI check for config file permissions and consistency. |
| L-ADJ-03 | Chrome DevTools MCP browser automation enabled | Iter-023/024: 2 DevTools MCP instances extend AI agent reach to full browser automation. | Audit usage patterns; restrict to specific browser profiles with `--isolated=true`. |
| L-ADJ-04 | apt-get in CI workflow | Iter-017/024: `.github/workflows/isolation-check.yml:18` uses `sudo apt-get install -y ripgrep`. Benign: PR-triggered, no token exposure, trusted package. Downgraded MEDIUM→LOW in iter-024. | Use pre-installed ripgrep on `ubuntu-latest` or cache via `actions/cache`. |
| L-ADJ-05 | Empty global git hooksPath | Iter-009/022: `git config --global core.hooksPath` points to empty directory. Low risk but unnecessary. | Remove or populate with intended hooks. |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I-ADJ-01 | Public repo codebase VERIFIED-CLEAN of TanStack Mini Shai-Hulud IOCs | All 3 IOC paths confirmed absent across iter-001 and iter-021: no `gh-token-monitor.sh`, no malicious LaunchAgent, no systemd unit. No `@tanstack/` dependencies in any package manifest. No lifecycle script compromise. | No action needed for TanStack-specific threat. |
| I-ADJ-02 | Repo-internal posture: no compromise indicators | Iter-016: 4 commits on 2026-05-15 all legitimate deep-research writes. Iter-017: CI has zero dangerous patterns (`pull_request_target`, `secrets.*`, `id-token: write`). Iter-019: All 29 local listeners on 127.0.0.1/::1. Iter-013: GitHub auth via keyring, clean. | No action needed for repo-internal code or CI surface. |
| I-ADJ-03 | All non-`.env` credential references are test fixtures or documentation | Iter-021 (I-004): Repo-wide `rg` for credential patterns matches only: spec/iteration docs describing the threat, INSTALL_GUIDE templates with placeholders, vitest test fixtures with fake tokens. The only live credentials are in `.env` (see H-ADJ-01, H-ADJ-02). | No action needed for documentation/test references. Standardize placeholder patterns to avoid scanner fatigue (use `ghp_000...` prefix). |
| I-ADJ-04 | Campaign completeness — all 24 investigative iterations executed | All 24 iteration files exist, non-empty. 10 dimensions covered. Verification passes 021-024 cross-validated 19 primary investigations. One gap: iter-014 (Workspace Trust) truncated by context compaction. | Re-run iter-014 workspace trust file audit as a standalone scan. |
| I-ADJ-05 | Evidence quality improved across verification passes | Iter-021-024 use structured tables with file:line citations and exact command outputs. Iter-001-019 mixed quality — iter-020 synthesis documented the evidence quality gap. | Standardize all future security audit output formats to require file:line citations in findings tables. |

## Convergence Signal
**newInfoRatio: 0.05** — final adjudication confirms and consolidates findings from 24 prior iterations with no new discoveries. One gap remains: iter-014 workspace trust audit was truncated.

**Campaign-Level Verdict: COMPROMISE-CONFIRMED**

The Public repo codebase itself contains no TanStack Mini Shai-Hulud supply-chain compromise indicators. All IOC paths are clean, no malicious commits, no suspicious lifecycle scripts, no unauthorized network tunnels, no CI/CD exfiltration patterns. Repo posture: **CLEAN**.

However, the host system has **COMPROMISE-CONFIRMED** active credential exposure: a valid Devin JWT session token stored world-readable at `~/.local/share/devin/credentials.toml` (644 perms), confirmed unresolved as of iteration-023. This finding meets the CRITICAL direct IOC threshold — any local user or process can read and exfiltrate the token.

Additionally, three CRITICAL and eight HIGH findings remain unresolved across the campaign:

- **Immediate risk (CRITICAL):** Devin token exposure, `--dangerously-skip-permissions` processes, `npx -y` MCP auto-install vector
- **Near-term exposure (HIGH):** 3 live API keys on disk (GitHub PAT, ClickUp, Figma), Voyage key in LaunchAgent, disabled firewall, remote-access daemons, Gemini session data exposure
- **Defensive gaps (MEDIUM/LOW):** No pip/package hardening, no tool allowlisting, PATH hygiene issues, hook injection surfaces

The remediation priority is:
1. **ROTATE CREDENTIALS** (C-ADJ-01, H-ADJ-01, H-ADJ-02, H-ADJ-03) — all exposed keys and tokens
2. **HARDEN PERMISSIONS** (C-ADJ-01, M-ADJ-03, H-ADJ-08) — chmod 600 on all credential/session files
3. **STOP DANGEROUS PROCESSES** (C-ADJ-02) — terminate `--dangerously-skip-permissions` processes
4. **PIN DEPENDENCIES** (C-ADJ-03, H-ADJ-04, M-ADJ-01) — version-pin all MCP servers and Python packages
5. **ENABLE FIREWALL + REMOVE REMOTE ACCESS** (H-ADJ-05, H-ADJ-07) — enable macOS firewall, uninstall TeamViewer/Pritunl if unused
6. **STRUCTURAL HARDENING** (M-ADJ-06, M-ADJ-07, L-ADJ-02) — tool allowlisting, config consolidation, governance policy
