---
title: "Global Security Sweep + Supply-Chain Audit (20 iter cli-devin SWE-1.6 + 5 iter cli-opencode deepseek-v4-pro)"
description: "Deep-research security audit of the entire Public repo + host environment after the 2026-05-15 TanStack Mini Shai-Hulud npm worm disclosure. Specifically checks for the dead-man's-switch payload (`gh-token-monitor.sh` + LaunchAgent), broader supply-chain compromise, credential exposure, persistence mechanisms, MCP/auth surface, and CI/CD/git-hook attack vectors. 25 iterations total: 20 cli-devin SWE-1.6 primary + 5 cli-opencode deepseek-v4-pro verification."
trigger_phrases:
  - "015 global security sweep"
  - "Mini Shai-Hulud audit"
  - "TanStack supply-chain check"
  - "Public repo security audit"
  - "dead-man switch IOC scan"
  - "post-2026-05-15 security review"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/001-dependency-security-supply-chain-audit"
    last_updated_at: "2026-05-15T18:30:00Z"
    last_updated_by: "claude-opus-4-7-015-scaffold"
    recent_action: "packet_scaffolded_post_tanstack_shai_hulud_disclosure"
    next_safe_action: "dispatch_iteration_001"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-research-state.jsonl"
      - "research/prompts/iteration-001.md..iteration-025.md"
      - "research/iterations/"
      - "research/review-report.md (final synthesis target)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-015-global-security-sweep"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Global Security Sweep + Supply-Chain Audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | **P0 (security-gating; check for active malware on host)** |
| **Status** | Planned — awaiting iteration 001 dispatch |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Trigger event** | TanStack npm supply-chain attack disclosed 2026-05-15: "Mini Shai-Hulud" — 42 official tanstack npm packages, 84 malicious versions, dead-man's-switch payload `gh-token-monitor.sh` planted as `~/.local/bin/gh-token-monitor.sh` + LaunchAgent `com.user.gh-token-monitor` (macOS) / systemd user service (Linux). Polls `api.github.com/user` every 60s; if token revoked (HTTP 40x), runs `rm -rf ~/`. Claimed to have infected 518M computers. |
| **Initial host IOC sweep result** | ✅ No `gh-token-monitor.sh` on this host; ✅ no `com.user.gh-token-monitor*` LaunchAgents; ✅ no `@tanstack/*` packages in the Public repo. Repo is NOT directly exposed. This packet does the BROADER sweep beyond TanStack to ensure no other supply-chain vectors are compromising the host. |
| **Executor (primary)** | `cli-devin --print --model swe-1.6 --permission-mode dangerous` (READ-ONLY review; writes confined to `research/`) |
| **Executor (verification)** | `cli-opencode run --model deepseek/deepseek-v4-pro --pure` (per memory `feedback_opencode_pure_flag_required_for_deepseek.md` + `feedback_opencode_run_requires_dev_null_stdin.md`) |
| **Iterations** | 20 primary + 5 verification = **25 total** |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 2026-05-15 TanStack Mini Shai-Hulud disclosure is a watershed npm supply-chain event: first documented npm worm shipping with valid SLSA provenance signatures. The compromised packages' release pipeline was hijacked, and the malicious versions look 100% legitimate to standard supply-chain defenders. 2FA didn't help; SLSA didn't help. Affected ~518M computers per the disclosure. The dead-man's-switch design means revoking a stolen token TRIGGERS the payload (`rm -rf ~/`), making remediation actively dangerous.

This is NOT a TanStack-specific incident — it's a proof-of-concept for an attack class. The repo and host need a comprehensive sweep checking BOTH:
1. **Direct exposure**: any `@tanstack/*` dependencies, the specific IOCs (`gh-token-monitor.sh`, LaunchAgent, systemd unit).
2. **Adjacent supply-chain risk**: every other entry point that could plant similar payloads — package-lock files across npm/pip/cargo/uv, MCP servers' binaries, plugin auto-loads, postinstall scripts, git hooks, GH Actions workflows, persistence mechanisms (LaunchAgents/Daemons + systemd + cron + shell startup files), auth-state files (gh tokens, npm tokens, API keys), suspicious commits in history.

### Purpose

Run 20 cli-devin SWE-1.6 deep-research iterations across 20 distinct security dimensions, then 5 cli-opencode deepseek-v4-pro verification iterations, producing a `research/review-report.md` with severity-ranked findings + actionable remediation playbook. Goal: **prove the host + repo are clean OR produce a contained incident-response plan**.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Host filesystem**: `~/Library/LaunchAgents/`, `/Library/LaunchAgents/`, `/Library/LaunchDaemons/`, `~/.config/systemd/user/`, `~/.local/bin/`, shell startup files (`.zshrc`, `.bashrc`, `.zprofile`, `.zshenv`, `.bash_profile`, `.profile`).
- **Auth state files**: `~/.claude/`, `~/.codex/`, `~/.config/devin/`, `~/.local/share/devin/`, `~/.gemini/`, `~/.npm/_authToken*`, `~/.npmrc`, `~/.netrc`, `~/.config/gh/`.
- **Repo-rooted attack surfaces**:
  - All `package-lock.json` / `package.json` under `.opencode/skills/**` and root.
  - `.github/workflows/*.yml` CI/CD pipelines.
  - `.git/hooks/` + `~/.gitconfig` `core.hooksPath`.
  - `.opencode/plugins/*.js`, `.opencode/skills/*/SKILL.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`, `.devin/config*.json`, `.gemini/settings.json`, `.vscode/mcp.json`, `.utcp_config.json`.
  - All `**/*postinstall*`, `**/scripts/*.sh`, `**/scripts/*.js`, `**/bin/*` referenced from package.json.
  - Recent git commits (last 30 days) for suspicious patterns: base64 blobs, `eval`, `curl|sh`, `wget|bash`, unexpected `chmod +x`, hidden binary additions.
- **MCP runtime surface**: every registered MCP server's executable path, env vars, network destinations.
- **GitHub state**: `gh auth status`, OAuth grants, recent SSH key activity, repo permissions.

### Out of Scope

- **Active remediation** (this packet is a READ-ONLY audit). Findings produce a remediation plan; the cleanup is a separate follow-on packet 040+ if compromise is found.
- **Non-Public sibling repos** (Barter, MEGA Development root) — covered by sibling sweep packets if pursued.
- **macOS Keychain audit** — out of band; user-driven.
- **Network packet capture / DPI** — beyond CLI tools' reach.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 25 iterations dispatch successfully | `research/iterations/iteration-{001..025}.md` exist and are non-empty. |
| REQ-002 | State JSONL captures every iteration | `research/deep-research-state.jsonl` has ≥25 records (type=iteration, run, focus, findingsCount, severity counts, executor, model, timestamp). |
| REQ-003 | Direct TanStack IOC sweep is FIRST iteration | iter-001 covers Mini Shai-Hulud IOCs explicitly with file-existence + process-listing + LaunchAgent enumeration. |
| REQ-004 | Final synthesis review-report.md is severity-ranked | `research/review-report.md` exists with: Executive verdict (CLEAN / INDICATORS-PRESENT / COMPROMISE-CONFIRMED), severity-ranked findings (CRITICAL / HIGH / MEDIUM / LOW / INFO), dimension-by-dimension summary, remediation playbook per finding. |
| REQ-005 | Cross-AI verification (5 cli-opencode + deepseek-v4-pro iter) follows after the 20 cli-devin iter | Iterations 021..025 use cli-opencode deepseek-v4-pro to verify highest-severity findings. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each iteration writes file:line evidence | All findings cite specific paths or command outputs. |
| REQ-007 | Iteration prompts follow deep-research workflow contract | Each prompt has SITUATION / TASK / SCOPE / CONSTRAINTS / OUTPUT FORMAT sections. |
| REQ-008 | Convergence signal tracked | `newInfoRatio` (or equivalent) in JSONL; trends downward as redundant dimensions confirm clean state. |
| REQ-009 | Findings categorized by attack class | One of: supply-chain, persistence, credential-exposure, code-injection, network-exposure, CI-CD, hooks, MCP-runtime, miscellaneous. |
| REQ-010 | Remediation playbook is actionable | Each CRITICAL/HIGH finding has a specific remediation command sequence (not vague "investigate further"). |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 25 iteration markdown files + 25 JSONL records, no missing artifacts.
- **SC-002**: `review/review-report.md` ships with PASS / CONDITIONAL / FAIL verdict (mirroring 037's verdict scheme).
- **SC-003**: All CRITICAL/HIGH findings have actionable remediation paths.
- **SC-004**: Cross-AI verification reduces HALLUCINATED finding rate to 0 (matching 037's verification gate).
- **SC-005**: Final memory_save records this packet's findings as a persistent audit record.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin SWE-1.6 hallucinations on specific IOC names (e.g. "found gh-token-monitor.sh" when grep returns nothing) | False positives → remediation against non-existent threats | Cross-AI verification (5 iter cli-opencode + deepseek-v4-pro) re-checks every CRITICAL/HIGH finding with file-existence proofs. Same bundle-verification gate that caught 037's P0-3 false TS-error. |
| Risk | The dead-man's-switch design means revoking a stolen token TRIGGERS `rm -rf ~/` | Active remediation could destroy data | **NEVER REVOKE any token during this audit.** Just IDENTIFY exposure and document. Remediation is a separate orchestrated step with safe sequencing. |
| Risk | A still-running malicious process could detect the audit and trigger payload | Worst case: data loss | Audit reads are passive; if a CRITICAL IOC is found, HALT and notify operator immediately for safe remediation sequencing. |
| Risk | 25 iterations × cli credits | Cost | Sequential dispatch; abort early if convergence reached at iter ≤15. |
| Dependency | cli-devin SWE-1.6 + cli-opencode deepseek-v4-pro both available + authenticated | Required for full 25-iter run | Verify at iter 001 prerequisites. |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **If a CRITICAL finding surfaces during the run, do we HALT immediately or continue gathering full picture?** → Default: HALT after the iteration that surfaced it, notify operator, recommend disconnecting from network as the FIRST remediation step (before revoking tokens — to prevent dead-man's-switch trigger).
2. **Do we extend the sweep to ~/MEGA/Development root (parent dir) or stay in Public?** → Default: Public-only for this packet; sibling sweeps as follow-ons if Public is compromised.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN (20 cli-devin + 5 cli-opencode)

| # | Executor | Focus | Tier |
|---|----------|-------|------|
| 001 | cli-devin SWE-1.6 | **Mini Shai-Hulud IOCs**: gh-token-monitor.sh, LaunchAgent com.user.gh-token-monitor, systemd unit, polling-process detection | Active-threat |
| 002 | cli-devin SWE-1.6 | **Stolen credential exposure**: gh tokens, npm tokens, API keys in repo history + env vars | Active-threat |
| 003 | cli-devin SWE-1.6 | **Supply-chain (npm)**: every package-lock.json + ~/.npm/_npx/* for known-bad versions | Active-threat |
| 004 | cli-devin SWE-1.6 | **Supply-chain (pip/cargo/uv/brew)**: Python venvs, uv tools, cargo registries, brew formulae | Active-threat |
| 005 | cli-devin SWE-1.6 | **postinstall script audit**: package.json scripts.postinstall across nested node_modules | Active-threat |
| 006 | cli-devin SWE-1.6 | **LaunchAgents + LaunchDaemons**: full ~/Library/LaunchAgents/ + /Library/* inventory | Persistence |
| 007 | cli-devin SWE-1.6 | **systemd + cron**: crontab -l, ~/.config/systemd/user/, /etc/cron* (mostly N/A on macOS but check anyway) | Persistence |
| 008 | cli-devin SWE-1.6 | **Shell startup files**: .zshrc, .bashrc, .zprofile, .bash_profile, .profile, .zshenv | Persistence |
| 009 | cli-devin SWE-1.6 | **Git hooks**: .git/hooks/ across repos + ~/.gitconfig core.hooksPath + husky/pre-commit chains | Persistence |
| 010 | cli-devin SWE-1.6 | **PATH integrity + shadow binaries**: which -a npm node git gh; binaries shadowing system paths | Persistence |
| 011 | cli-devin SWE-1.6 | **MCP server allowlist**: every MCP binary path + env vars + network destinations across 6 configs | Runtime |
| 012 | cli-devin SWE-1.6 | **Auth state files**: auth.json/credentials.toml inventory + perms + last-modified | Credential |
| 013 | cli-devin SWE-1.6 | **GitHub state**: gh auth status, OAuth grants, recent SSH activity, repo permissions | Credential |
| 014 | cli-devin SWE-1.6 | **Workspace trust files**: trusted_workspaces.json per CLI tool | Runtime |
| 015 | cli-devin SWE-1.6 | **External MCP transports**: .utcp_config.json + code-mode external surfaces | Network |
| 016 | cli-devin SWE-1.6 | **Suspicious commit patterns**: recent commits with base64 blobs / eval / curl\|sh / wget\|bash | Code-injection |
| 017 | cli-devin SWE-1.6 | **CI/CD workflows**: .github/workflows/*.yml for secret-leak steps + unbounded scripts | CI-CD |
| 018 | cli-devin SWE-1.6 | **External-author plugins/skills/agents**: .opencode/plugins/, .opencode/skills/, .claude/agents/ | Runtime |
| 019 | cli-devin SWE-1.6 | **Hidden network exposure**: listening sockets, open ports, MCP servers beyond localhost | Network |
| 020 | cli-devin SWE-1.6 | **Final synthesis + severity-ranked remediation playbook** | Synthesis |
| 021 | cli-opencode + deepseek-v4-pro | **Verification: highest-severity findings from iter 001-005** (active threats) | Verification |
| 022 | cli-opencode + deepseek-v4-pro | **Verification: persistence findings from iter 006-010** | Verification |
| 023 | cli-opencode + deepseek-v4-pro | **Verification: runtime + auth findings from iter 011-015** | Verification |
| 024 | cli-opencode + deepseek-v4-pro | **Verification: code + history + CI/network findings from iter 016-019** | Verification |
| 025 | cli-opencode + deepseek-v4-pro | **Final adjudication**: VERIFIED vs HALLUCINATED vs PARTIAL counts; adjusted remediation playbook | Synthesis |

<!-- /ANCHOR:iteration-plan -->

---

## 9. RELATED DOCUMENTS

- **Trigger event source**: TanStack security disclosure 2026-05-15 (screenshot from operator's feed; Mini Shai-Hulud npm worm; 42 official packages / 84 versions / 518M reported infections).
- **Initial host IOC sweep (clean)**: pre-iter-001 grep + ls confirmed no `gh-token-monitor.sh` and no `@tanstack/*` in repo.
- **037 deep-review pattern**: this packet mirrors 037's 20-iter + verification design (proven workflow).
- **Implementation plan**: this packet uses spec.md alone (Level 1); the per-iteration prompts are the implementation surface.
- **Research output**: `research/review-report.md` (final synthesis), `research/iterations/iteration-{001..025}.md`, `research/deep-research-state.jsonl`.
