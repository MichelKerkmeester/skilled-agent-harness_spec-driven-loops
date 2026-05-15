# Iteration 022 - VERIFICATION of iter 006-010 Persistence

The file exists but is nearly empty (prior incomplete write). I'll overwrite it with the full verification output and append to the JSONL.
Iteration 022 complete. Summary:

- **CRITICAL**: 0
- **HIGH**: 1 — Plaintext Voyage API key in LaunchAgent plist (V-022-H1, confirmed from iters 006/007, still active)
- **MEDIUM**: 4 — Group-writable Homebrew path, shadow binaries (python3/uv/pip3), dead PATH entries hijackable, duplicate PATH config
- **LOW**: 2 — Empty global git hooksPath, cargo env sourcing
- **INFO**: 5 — Clean cron, no systemd, git hooks are samples, shell files clean, all LaunchAgents from known vendors

**Convergence**: INDICATORS-PRESENT (newInfoRatio 0.20). No active compromise. The API key exposure from iters 006/007 is verified as still present — key rotation and plist removal recommended.
tc/cron.hourly`, `/etc/cron.weekly`, `/etc/cron.monthly` (none exist, exit 0)
- `~/.zshrc` (35 lines, scanned for persistence patterns)
- `~/.zshenv` (1 line, sources `~/.cargo/env`)
- `~/.bashrc` (1 line, sets ENABLE_EXPERIMENTAL_MCP_CLI=true)
- `~/.profile` (1 line, sources `~/.cargo/env`)
- `~/.bash_profile` (not found)
- `git config --show-origin --get-all core.hooksPath` (2 entries)
- `.git/hooks/` (14 sample files, all inactive .sample suffix)
- `~/.config/git/hooks/` (empty directory)
- `which -a npm npx node git gh codex claude devin gemini python3 uv pip pip3 docker` (shadow binary detection)
- PATH directory traversal (24 entries, permissions + ownership audit)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-022-H1 | Plaintext Voyage API key in LaunchAgent plist (CONFIRMED from iter 006/007) | `~/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist:12`: `pa-[REDACTED_FOR_REPO_SAFETY]` exposed as `launchctl setenv VOYAGE_API_KEY <key>`. File perms `0600` (rw-------), owned by uid 501. `RunAtLoad: true` means key is loaded into every user session environment. | Move key to macOS Keychain or `.env` file with `0600` perms sourced only by consuming apps. Unload and delete the plist: `launchctl unload ~/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist && rm ~/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist`. Rotate key immediately. |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-022-M1 | `/opt/homebrew/bin` is group-writable by admin group | `stat -f '%p' /opt/homebrew/bin` = `40775` (0775 octal). Owner uid=501 (user), gid=80 (admin). Any admin-group process could replace binaries with trojaned versions. Standard Homebrew default but not security-optimal. | `chmod 755 /opt/homebrew/bin` to remove group-write. Verify no Homebrew dependency requires 0775 before changing. |
| V-022-M2 | Shadow binaries: python3, uv, pip3 present in multiple PATH locations | `which -a python3`: `/usr/bin/python3` (macOS system) and `/opt/homebrew/bin/python3` (Homebrew). `which -a uv`: `/Users/michelkerkmeester/.local/bin/uv` and `/opt/homebrew/bin/uv`. `which -a pip3`: `/usr/bin/pip3` and `/opt/homebrew/bin/pip3`. Non-deterministic resolution depends on PATH order. | Audit PATH order in `~/.zshrc` to prefer Homebrew over system for development tools. Remove unused duplicate installations. |
| V-022-M3 | Six nonexistent PATH directories could be hijacked via directory creation | Nonexistent PATH entries: `/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin`, `/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin`, `/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin`, `/opt/pkg/env/active/bin`, `/opt/pmk/env/global/bin`, `/Library/Apple/usr/bin`. If any parent path becomes writable, an attacker could create the directory and drop malicious binaries that shadow system tools. | Remove dead PATH entries from `~/.zshrc` or verify their source and ensure parent directories are root-owned and not user-writable. Check `/var/run/com.apple.security.cryptexd/` — likely from Codex CLI or Xcode toolchain. |
| V-022-M4 | Duplicate PATH entries in `.zshrc` | `.antigravity/antigravity/bin` exported at lines 26, 29, 35. `.opencode/bin` exported at lines 3, 32. Increases PATH length unnecessarily and complicates troubleshooting. | Deduplicate `~/.zshrc` PATH exports. Retain only one instance per directory. |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-022-L1 | Global git hooksPath configured but empty | `git config --show-origin --get-all core.hooksPath` shows `file:/Users/michelkerkmeester/.gitconfig -> /Users/michelkerkmeester/.config/git/hooks` (global). Local repo override: `file:.git/config -> /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.git/hooks`. Global hooks dir is empty (no active hooks). Local hooks are all `.sample` files. | No action required currently. Remove global hooksPath if unused: `git config --global --unset core.hooksPath`. |
| V-022-L2 | `.zshenv` and `.profile` source `~/.cargo/env` | `~/.zshenv:2` and `~/.profile:2`: `. "$HOME/.cargo/env"`. Standard Rust toolchain bootstrap. If `~/.cargo/env` were modified by an attacker, it could inject into every shell session. | Verify `~/.cargo/env` is owned by user and has no unexpected content. Standard Rust install; low risk but worth periodic audit. |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| V-022-I1 | No cron jobs configured | `crontab -l`: "no crontab for michelkerkmeester". `/etc/cron.*` directories do not exist (standard for macOS). | None — clean state. |
| V-022-I2 | No systemd user services | `~/.config/systemd/user`: No such file or directory. macOS does not use systemd. | None — clean state. |
| V-022-I3 | All local git hooks are sample files (inactive) | `.git/hooks/` contains 14 files, all `.sample` suffix. None are executable without the suffix. No custom hooks deployed. | None — clean state. |
| V-022-I4 | Shell startup files are minimal and clean | `.zshenv` (1 line, cargo env), `.bashrc` (1 line, env var), `.profile` (1 line, cargo env). `.bash_profile` not found. No `curl | bash`, `eval`, `base64`, `launchctl`, `systemctl` patterns detected outside expected PATH exports. | None — clean state. |
| V-022-I5 | All LaunchAgents/Daemons from known vendors | 19 agents/daemons from: Adobe (3), Bitdefender (2), Docker (2), Elgato (1), Google (1), CleanMyMac (2), Homebrew/Ollama (1), MEGA (1), Pritunl (1), Razer (1), TeamViewer (3), user session-env (1). No unknown or suspicious plist files. | None — clean state. |

## Convergence Signal
newInfoRatio: 0.20 — mostly confirmation of findings documented in iterations 006-010 with new observations: group-writable Homebrew path (V-022-M1), dead PATH entries (V-022-M3), dual git hooksPath configuration detail (V-022-L1), and exact PATH directory permissions audit. The HIGH finding (API key in LaunchAgent) from iters 006/007 is re-verified as still present. No new compromise indicators. Verdict: INDICATORS-PRESENT — defensive gaps confirmed, no active compromise detected in persistence dimension.
