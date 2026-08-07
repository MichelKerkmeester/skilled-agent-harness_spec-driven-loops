---
title: "Security Sweep Review Report — 015 Global Security Sweep + Supply-Chain Audit"
description: "Executive verdict + severity-ranked findings + remediation playbook for the 25-iteration security audit triggered by the 2026-05-15 TanStack Mini Shai-Hulud disclosure. 20 cli-devin SWE-1.6 primary iterations + 5 cli-opencode + deepseek-v4-pro verification iterations. The Public repo is CLEAN of the Mini Shai-Hulud worm; credential hygiene + host configuration findings remain to be addressed."
trigger_phrases:
  - "015 security sweep report"
  - "TanStack Mini Shai-Hulud audit"
  - "global security review"
importance_tier: "high"
contextType: "review"
---

# Security Sweep Review Report

**Packet**: `015-tanstack-security-audit`
**Trigger**: 2026-05-15 TanStack Mini Shai-Hulud npm worm disclosure (dead-man's-switch payload: `~/.local/bin/gh-token-monitor.sh` + LaunchAgent `com.user.gh-token-monitor` + 518M reported infections)
**Iterations**: 20 cli-devin SWE-1.6 primary + 5 cli-opencode + deepseek-v4-pro verification = 25 total
**Date**: 2026-05-15
**Auditor**: Public repo @ `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## 1. Executive Verdict

**TL;DR**: The Public repo is **CLEAN** of the TanStack Mini Shai-Hulud worm — no IOCs present, no malicious dependencies, no suspicious commits or CI patterns. However, the **host environment** has an active **credential-exposure compromise** (iter-025 campaign-level verdict: **COMPROMISE-CONFIRMED**): the Devin session JWT is world-readable at mode 644 and has been unresolved since iter-012. Three additional CRITICAL findings + 9 HIGH findings require operator action. No remote attacker has been identified, but the credential surface is wide open to any local process or user.

| Dimension | Verdict |
|---|---|
| **Mini Shai-Hulud direct IOCs** | 🟢 **CLEAN** (verified across iter-001 + iter-021) |
| **Public repo dependency tree** | 🟢 **CLEAN** (no `@tanstack/*` in active package manifests) |
| **Credential hygiene (in-repo `.env`, plist, world-readable files)** | 🔴 **COMPROMISE-CONFIRMED** (Devin JWT token exposed world-readable at mode 644 since iter-012, confirmed unresolved iter-023; 3 live API keys leaked to `.env`; Voyage key in plist) |
| **Persistence mechanisms (cron, systemd, LaunchAgents, git hooks)** | 🟢 **CLEAN** (no malicious persistence; all LaunchAgents from known vendors) |
| **Runtime + auth surface (MCP, AI CLI permission modes)** | 🟠 **INDICATORS-PRESENT** (active `--dangerously-skip-permissions` processes, `npx -y` supply-chain vector, world-readable Devin token) |
| **Code/history/CI** | 🟢 **CLEAN** (no dangerous CI patterns, no suspicious commit history) |
| **Host network exposure** | 🟠 **INDICATORS-PRESENT** (firewall disabled, FontBase on `0.0.0.0`, TeamViewer/Pritunl daemons) |

**Cross-AI verification confidence**: HIGH. Five cli-opencode + deepseek-v4-pro verification iterations adjudicated cli-devin SWE-1.6 primary findings. Notable corrections:
- iter-001's "transient process PID 51347" reclassified as **pgrep self-match false positive** (the search pattern matched the iteration's own process argv).
- iter-005's `1489 package.json` count reclassified as **inflated** (real count outside `node_modules` = 123). Findings unchanged.

---

## 2. Mini Shai-Hulud IOC Sweep — CLEAN

| IOC | Result | Evidence |
|---|---|---|
| `~/.local/bin/gh-token-monitor.sh` | ❌ Not present | `ls` exit 1 "No such file" (iter-001, iter-021) |
| `~/Library/LaunchAgents/com.user.gh-token-monitor*` | ❌ Not present | `ls` exit 1 (iter-001, iter-021) |
| `~/.config/systemd/user/gh-token-monitor*` | ❌ Not present | macOS does not use systemd (iter-001, iter-007, iter-022) |
| `launchctl list` for `gh-token` / `token-monitor` / `shai` / `com.user` | ❌ No matches | (iter-001, iter-006) |
| `@tanstack/*` in repo `package.json` / `package-lock.json` | ❌ No matches in active tree | Only hits were in archived `z_future` babysitter externals (out of active dep tree) — iter-001, iter-021 |
| Polling process pattern (api.github.com/user every 60s) | ❌ False positive | iter-001's "transient PID 51347" was iter-001's own `pgrep` argv self-match (verified iter-021) |

**Conclusion**: Zero indicators of active Mini Shai-Hulud worm infection on this host or in this repo's active dependency tree.

---

## 3. Severity-Ranked Findings

### 🔴 CRITICAL (3)

| ID | Finding | Evidence | Verification |
|---|---|---|---|
| **C-1** | Devin credentials.toml world-readable (mode 644) with live JWT session token | `~/.local/share/devin/credentials.toml`: 4 lines, mode `-rw-r--r--`, contains `windsurf_api_key = devin-session-token$eyJ...` | iter-012 → confirmed unresolved iter-023 |
| **C-2** | Multiple `--dangerously-skip-permissions` processes active on host | 3 Claude PIDs (11813, 53419, 31169) + 2 OpenCode shell dispatchers (17127, 16844) running with full bypass; grants unrestricted FS write to AI agents | iter-011 → confirmed iter-023 |
| **C-3** | `npx -y` in MCP configs auto-installs without version pinning (TanStack-class supply-chain vector) | `opencode.json:17-19`, `.devin/config.json:4`, `.gemini/settings.json:22` all use `npx -y` without pinned versions for `@modelcontextprotocol/server-sequential-thinking` | iter-011 → confirmed iter-023, iter-024 |

### 🟠 HIGH (9)

| ID | Finding | Evidence | Verification |
|---|---|---|---|
| **H-1** | Live GitHub PAT on disk in `.env` | `.env:12`: `github_GITHUB_PERSONAL_ACCESS_TOKEN=github_pat_[REDACTED_FOR_REPO_SAFETY]` (full unredacted token) | iter-002 → escalated to HIGH iter-021 |
| **H-2** | Live ClickUp + Figma API keys in `.env` | `.env:4`: `clickup_CLICKUP_API_KEY=pk_[REDACTED_FOR_REPO_SAFETY]`; `.env:8`: `figma_FIGMA_API_KEY=figd_[REDACTED_FOR_REPO_SAFETY]` | iter-021 (new finding) |
| **H-3** | Voyage API key plaintext in LaunchAgent plist (loaded into every session) | `~/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist:12`: `launchctl setenv VOYAGE_API_KEY pa-[REDACTED_FOR_REPO_SAFETY]`; `RunAtLoad: true`; file mode 0600 but key broadcasts to process env | iter-006/007 → confirmed iter-022 |
| **H-4** | macOS Application Firewall disabled | `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate`: "Firewall is disabled. State = 0" | iter-019 → confirmed iter-024 |
| **H-5** | Third-party service (FontBase) listening on all interfaces | `lsof -nP -iTCP -sTCP:LISTEN`: `FontBase 989 TCP *:27715 (LISTEN)` — third-party font manager bound to 0.0.0.0 | iter-019 → confirmed iter-024 |
| **H-6** | TeamViewer + Pritunl LaunchDaemons installed | `/Library/LaunchDaemons/com.teamviewer.*.plist` (3 files) + `com.pritunl.service.plist` | iter-019 → confirmed iter-024 |
| **H-7** | Gemini chat sessions world-readable (~150+ files at mode 644) | `~/.gemini/tmp/public/chats/`: 150+ session JSON files, mode `-rw-r--r--`, contain full AI conversation histories | iter-023 (new finding) |
| **H-8** | `opencode.json` mode 644 with full-allow permissions | Project root `opencode.json` allows `edit`, `bash`, `webfetch`, `doom_loop`, `external_directory` without restrictions; no allowlist; no permission-mode constraints | iter-023 (new finding) |
| **H-9** | External MCP servers via `@latest` (chrome-devtools-mcp, figma-developer-mcp, clickup-mcp-server) | `.utcp_config.json`: 5 enabled manual call templates using `npm exec X@latest` (PIDs 17046, 17004, 16983, 16962) | iter-011 → confirmed iter-023 |

### 🟡 MEDIUM (10)

| ID | Finding | Evidence | Verification |
|---|---|---|---|
| **M-1** | Hardcoded `ghp_token` placeholder in vitest fixture | `.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts:107` uses `'ghp_token'` (real-looking prefix) | iter-002 → confirmed iter-021 |
| **M-2** | `bash -c` with `${DEVIN_PROJECT_DIR}` interpolation in hooks (command injection surface) | `.devin/hooks.v1.json:8,20`: `bash -c 'cd "${DEVIN_PROJECT_DIR}" && /opt/homebrew/bin/node ...'` | iter-018 → confirmed iter-024 |
| **M-3** | `/opt/homebrew/bin` group-writable (admin group, mode 0775) | `stat -f '%p' /opt/homebrew/bin` = `40775`; standard Homebrew default, not security-optimal | iter-022 (new finding) |
| **M-4** | Shadow binaries: `python3`, `uv`, `pip3` present in multiple PATH locations | `which -a python3` returns `/usr/bin/python3` + `/opt/homebrew/bin/python3`; same for `uv` and `pip3` | iter-010 → confirmed iter-022 |
| **M-5** | Devin sessions.db world-readable (mode 644) | `~/.local/share/devin/cli/sessions.db`: `-rw-r--r--`, SQLite metadata for 80+ sessions | iter-023 (new finding) |
| **M-6** | Permission-escalation modes documented across AI CLI skills (normalizes risky configs) | `cli-claude-code/SKILL.md:244-245`, `cli-codex/SKILL.md:248`, `cli-devin/SKILL.md:232-233`, `cli-opencode/SKILL.md:293` all reference dangerous modes | iter-023 (new finding) |
| **M-7** | Docker LaunchDaemons (`com.docker.socket.plist`, `com.docker.vmnetd.plist`) installed but no Docker process | Residue from prior install | iter-019 → confirmed iter-024 |
| **M-8** | Dead PATH entries (6 nonexistent dirs in PATH) — hijack surface if any parent becomes writable | `/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/{local/bin,bin,appleinternal/bin}`, `/opt/pkg/env/active/bin`, `/opt/pmk/env/global/bin`, `/Library/Apple/usr/bin` | iter-022 (new finding) |
| **M-9** | Duplicate PATH exports in `~/.zshrc` | `.antigravity/antigravity/bin` at lines 26/29/35; `.opencode/bin` at lines 3/32 | iter-008/010 → confirmed iter-022 |
| **M-10** | `~/.claude/tasks/` files world-readable (mode 644, 100+ files) | Mode `-rw-r--r--` across `~/.claude/tasks/*.output`; may contain sensitive context | iter-002 (uncontested) |

### 🟢 LOW (6) — see iteration outputs for full list

CI hardening (no explicit `permissions:` block in `.github/workflows/isolation-check.yml`), Razer daemon logging to /tmp, `.zshenv`/`.profile` sourcing `~/.cargo/env`, broad MCP wildcard grants in agent definitions, `.devin/config.json` curl-pipe-bash documentation in `_NOTE_1` (informational only), `.github/workflows/isolation-check.yml` `apt-get` install (severity downgraded MEDIUM→LOW per iter-024 — PR-only, no token exposure, trusted package).

### ℹ️ INFO (7+) — positive evidence

GitHub auth via keyring (clean), no active tunnels (ngrok / cloudflared / ssh -R / socat), all MCP processes resolved to legitimate OpenCode infrastructure, no `pull_request_target` / `secrets.*` / `id-token: write` patterns in CI workflows, `.claude/agents/code.md` has `permission.task: deny` runtime restriction, all LaunchAgents/Daemons from known vendors (Adobe, Bitdefender, Docker, Elgato, Google, CleanMyMac, MEGA, Razer, TeamViewer, Pritunl, user session-env), `~/.config/gh/config.yml` mode 600, ~30-day git log clean (no `eval(`, `new Function`, `curl | sh`, `base64 -d`, `chmod +x`, `rm -rf` patterns).

---

## 4. Remediation Playbook

**Token revocation order** (per memory `feedback_phase_018_autonomous.md` and security-disclosure-aware practice — do NOT revoke GitHub PAT first if Mini Shai-Hulud were present; the dead-man's-switch arms on 40x responses. Since iter-001 + iter-021 confirmed NO worm is present on this host, normal rotation order applies):

1. **C-1 (Devin credentials)** — `chmod 600 ~/.local/share/devin/credentials.toml`; then `devin auth logout && devin auth login` to rotate the JWT.
2. **H-3 (Voyage API key in LaunchAgent)** — `launchctl unload ~/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist && rm ~/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist`; rotate the key at Voyage; re-add via macOS Keychain or `.env.local` (gitignored).
3. **H-1 (GitHub PAT in `.env`)** — Rotate at <https://github.com/settings/tokens>; move secret to `.env.local` (gitignored via `*.local`); audit transcript history for any leaked copies; verify `.env` is in `.gitignore` and was never committed.
4. **H-2 (ClickUp + Figma API keys in `.env`)** — Rotate both at provider portals; same `.env.local` migration.
5. **C-2 (`--dangerously-skip-permissions` processes)** — Identify and terminate the 3 Claude + 2 OpenCode bypass processes if not actively in use; default future invocations to `--permission-mode plan` or `--permission-mode acceptEdits`.
6. **C-3 (`npx -y` MCP configs)** — Pin `@modelcontextprotocol/server-sequential-thinking@<exact-version>` in `opencode.json`, `.devin/config.json`, `.gemini/settings.json`. Remove `-y` flag (require manual confirm) for all MCP server installs.
7. **H-9 (External MCP `@latest`)** — Same pinning treatment for `chrome-devtools-mcp`, `figma-developer-mcp`, `@taazkareem/clickup-mcp-server`. Consider running MCP servers in isolated containers.
8. **H-4 (Firewall disabled)** — `sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on`; configure app-specific rules afterwards.
9. **H-5 (FontBase on 0.0.0.0)** — Bind FontBase to `127.0.0.1` (check FontBase prefs) OR remove if unused.
10. **H-6 (TeamViewer + Pritunl)** — Audit need; uninstall if unused: `sudo rm /Library/LaunchDaemons/com.teamviewer.*.plist` + Pritunl uninstaller.
11. **H-7 (Gemini chat sessions 644)** — `chmod 700 ~/.gemini/tmp/` or `chmod 600 ~/.gemini/tmp/**/*.json`.
12. **H-8 (`opencode.json` 644 + full-allow)** — `chmod 600 opencode.json`; add tool allowlist + permission-mode default.
13. **M-2 (`bash -c` injection surface)** — Quote `${DEVIN_PROJECT_DIR}` with `printf %q` or use `exec` without shell in `.devin/hooks.v1.json:8,20`.
14. **M-1 / M-5 / M-10 (world-readable files)** — `chmod 600` on `~/.local/share/devin/cli/sessions.db`, `~/.claude/tasks/*`; replace `ghp_token` placeholder in `runtime-detection.vitest.ts:107` with `'test_ghp_000000000000000000000000000000000000'`.
15. **M-3 / M-4 / M-8 / M-9 (PATH hygiene)** — `chmod 755 /opt/homebrew/bin` (verify no Homebrew dep requires 0775 first); deduplicate `~/.zshrc` PATH exports; remove dead PATH entries.

**Suggested follow-on packet**: `016-security-hardening-remediation` to track each item with checklist evidence + before/after `stat` / `chmod` / file content snapshots.

---

## 5. Cross-AI Verification Stats

- **Primary**: 20 cli-devin SWE-1.6 iterations (avg ~15 lines each; iter-020 synthesis = 80 lines structured)
- **Verification**: 5 cli-opencode + deepseek-v4-pro iterations (avg ~64 lines each)
- **VERIFIED count**: ~25 findings confirmed across verification passes
- **PARTIAL / corrected count**: 2 (iter-001 process self-match false positive; iter-005 inflated package.json count)
- **HALLUCINATED count**: 0
- **New findings surfaced in verification only**: 5 (H-2 ClickUp/Figma keys, H-7 Gemini sessions 644, H-8 opencode.json full-allow, M-3 Homebrew group-writable, M-8 dead PATH entries)

This matches the 037 deep-review verification pattern (15 VERIFIED / 9 PARTIAL / 0 HALLUCINATED) — the verification-gate methodology reliably catches hallucinations and surfaces additional context.

---

## 6. Methodology Notes

- **Read-only audit**: 25 iterations all writes confined to `research/` packet directory. No source code mutations.
- **Iteration prompts**: 25 prompt files in `research/prompts/iteration-{001..025}.md` (each ~87 lines with SITUATION / TASK / SCOPE / VERIFICATION COMMANDS / CONSTRAINTS / OUTPUT FORMAT).
- **State**: 30 events in `research/deep-research-state.jsonl` (campaign_start + 25 iterations + 4 progress).
- **Dispatchers**: `/tmp/015-dispatch-loop.sh` (initial, killed at iter-14) + `/tmp/015-dispatch-loop-resume.sh` (resumed 15-25; verification phase switched cli-codex → cli-opencode + deepseek-v4-pro per operator pivot).
- **Self-invocation guards**: Both dispatchers guarded against `DEVIN_*` / `OPENCODE_*` env vars to prevent loop recursion.

---

## 7. Final Adjudication (from iter-025)

**iter-025 verdict**: 🔴 **COMPROMISE-CONFIRMED** at the campaign level.

**Rationale**: The Public repo codebase itself contains no TanStack Mini Shai-Hulud supply-chain compromise indicators. All IOC paths are clean, no malicious commits, no suspicious lifecycle scripts, no unauthorized network tunnels, no CI/CD exfiltration patterns. **Repo posture: CLEAN**. However, the host system has **COMPROMISE-CONFIRMED** active credential exposure: a valid Devin JWT session token stored world-readable at `~/.local/share/devin/credentials.toml` (mode 644), confirmed unresolved as of iter-023. This meets the CRITICAL direct-IOC threshold — any local user or process can read and exfiltrate the token.

### Per-Dimension Convergence Map (iter-025 synthesis)

| Dimension | Iterations | Verdict | Key Gap |
|-----------|-----------|---------|---------|
| Mini Shai-Hulud IOCs | 001, 021 | **CLEAN** | False-positive pgrep self-match in iter-001 (corrected) |
| Credential Discovery | 002, 021 | **INDICATORS-PRESENT** | Live GitHub PAT in `.env:12` (UNRESOLVED since iter-002) |
| npm Supply Chain | 003 | **CLEAN** | No TanStack packages anywhere |
| Dependency Supply Chain | 004 | **INDICATORS-PRESENT** | No pip security hardening, no provenance |
| Lifecycle Scripts | 005 | **CLEAN** | Archived z_future postinstall (MEDIUM, deferred) |
| Persistence + LaunchAgents | 006, 007, 022 | **INDICATORS-PRESENT** | Voyage API key in plist (UNRESOLVED) |
| Shell Config | 008, 022 | **CLEAN** | PATH dedup + group-writable Homebrew (MEDIUM) |
| Git Hooks | 009 | **CLEAN** | Empty global hooksPath |
| PATH / Shadow Binaries | 010, 022 | **INDICATORS-PRESENT** | Group-writable Homebrew, dead entries |
| Runtime + MCP Allowlist | 011, 023 | **INDICATORS-PRESENT** | `npx -y` + external MCP @latest (CRITICAL vector) |
| Devin Credentials | 012, 023 | **COMPROMISE-CONFIRMED** | Token still 644 as of iter-023 |
| GitHub State | 013 | **CLEAN** | No issues |
| Workspace Trust | 014 | **INCOMPLETE** | Context compaction truncated execution |
| Docker / Containers | 015 | **CLEAN** | Archived docker-compose only |
| Git Commit History | 016, 024 | **CLEAN** | 4 legitimate commits on 2026-05-15 |
| CI/CD | 017, 024 | **CLEAN** | apt-get in workflow (LOW, benign) |
| Plugin / Skill / Agent | 018, 024 | **INDICATORS-PRESENT** | Unpinned npx, bash -c injection surface |
| Network | 019, 024 | **INDICATORS-PRESENT** | Firewall off, services on `*`, TeamViewer/Pritunl |
| Synthesis | 020 | **INDICATORS-PRESENT** | Evidence quality gaps, no remediation playbook |

### iter-025 Remediation Priority Order

1. **ROTATE CREDENTIALS** (C-1, H-1, H-2, H-3) — all exposed keys and tokens
2. **HARDEN PERMISSIONS** (C-1, M-5, H-7) — `chmod 600` on all credential/session files
3. **STOP DANGEROUS PROCESSES** (C-2) — terminate `--dangerously-skip-permissions` processes
4. **PIN DEPENDENCIES** (C-3, H-9, M-1 + future pip hardening) — version-pin all MCP servers and Python packages
5. **ENABLE FIREWALL + REMOVE REMOTE ACCESS** (H-4, H-6) — enable macOS firewall, uninstall TeamViewer/Pritunl if unused
6. **STRUCTURAL HARDENING** (M-6, M-7 governance, L-2 config consolidation) — tool allowlisting, config consolidation, governance policy

**Final-adjudication newInfoRatio**: 0.05 (confirms + consolidates with minimal new discoveries). One known gap: iter-014 (Workspace Trust) was truncated by context compaction in the primary pass; recommend a standalone re-run.

---

## 8. Limitations

- **Host-level findings are out of repo scope**: H-4 (firewall), H-5 (FontBase), H-6 (TeamViewer/Pritunl) are operating-system + third-party-app configurations. Remediation is operator-driven, not repo-driven.
- **iter-014 (workspace trust) was incomplete**: that iteration's output contains a context compaction summary instead of audit findings. Re-running iter-014 alone would close the gap; not blocking for this report.
- **iter-005 package.json count inflation**: 1489 vs 123 (verified iter-021). Does not change finding severity; only credibility note.
- **No SBOM / SLSA provenance check**: out of scope for this packet; recommended as a follow-on for the supply-chain hardening packet 016.
- **External MCP audit limited to declared configs**: `.utcp_config.json` enumerates 5 enabled providers, but transitive dependencies of `chrome-devtools-mcp@latest`, `figma-developer-mcp`, etc., were not scanned. Pin + audit recommended as part of remediation item 7.

---

## 8.5 Remediation Applied (2026-05-15)

After report-out, the operator reviewed each finding with the auditor and applied the following in the same session:

**Done:**
- Pinned 6 runtime configs (`opencode.json`, `.devin/config.json`, `.gemini/settings.json`, `.claude/mcp.json`, `.codex/config.toml`, `.vscode/mcp.json`) for `@modelcontextprotocol/server-sequential-thinking` → `@2025.12.18`; removed `-y` auto-confirm. Closes part of C-3.
- Pinned `chrome-devtools-mcp@0.26.0` (×2) + `@taazkareem/clickup-mcp-server@0.14.4` in `.utcp_config.json`. Closes part of H-9.

**Declined (with rationale):**
- C-1 (Devin token chmod): solo-user Mac, world-readable risk is theoretical for this host.
- C-2 (`--dangerously-skip-permissions` processes): same solo-user rationale.
- H-1 / H-2 (`.env` credentials): `.env` IS gitignored (line 63 of `.gitignore`) and NOT tracked in git. The original audit overstated the severity by not checking gitignore status. Mode 644 acceptable for solo-user Mac. Findings downgraded.
- `figma-developer-mcp` + `@modelcontextprotocol/server-github`: operator preference to keep at `@latest` (frequent updates, lower supply-chain-vector concern for these specific maintainers).

**Operator-pending:**
- H-4 macOS Firewall enable — requires interactive sudo. Command provided:
  ```
  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on \
    && sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on \
    && sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setallowsignedapp on
  ```
- H-5 FontBase on `*:27715` — auto-mitigated once H-4 firewall is enabled (FontBase's IPC stays local-loopback; external connections drop). Optional explicit block: `sudo socketfilterfw --add /Applications/FontBase.app && sudo --blockapp /Applications/FontBase.app`.

**Audit methodology fix logged:**
The audit should check `.gitignore` status before flagging credentials in `.env` as HIGH. Future packets in this series should add a pre-flight `git check-ignore` step for any flagged secret file. Logged as a memory entry for future audits.

---

## 9. Conclusion

The Public repo and host environment are **NOT compromised** by the TanStack Mini Shai-Hulud worm. All direct IOCs are absent, the active dependency tree contains no `@tanstack/*` packages, and there is no malicious persistence, hook injection, or polling process. The findings in this report are pre-existing credential-hygiene and host-configuration gaps that pre-date the 2026-05-15 disclosure — they should be remediated, but they are not evidence of compromise.

Operator action required for the 3 CRITICAL + 9 HIGH findings before they could be weaponized in a future supply-chain or local-privilege-escalation attack.
