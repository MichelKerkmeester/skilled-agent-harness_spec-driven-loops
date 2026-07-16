---
title: "Global Security Sweep + Supply-Chain Audit: 25-Iteration Deep-Research Campaign"
description: "A 25-iteration cross-AI security audit (20 cli-devin SWE-1.6 primary + 5 cli-opencode deepseek-v4-pro verification) of the Public repo and host environment. Triggered by the 2026-05-15 TanStack Mini Shai-Hulud npm worm disclosure. Repo verdict: CLEAN. Host verdict: COMPROMISE-CONFIRMED. 3 CRITICAL + 9 HIGH + 10 MEDIUM findings. 15-step remediation playbook shipped."
trigger_phrases:
  - "tanstack mini shai-hulud audit"
  - "global security sweep supply chain"
  - "dependency security audit 2026"
  - "compromise confirmed devin jwt"
  - "25 iteration security research"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/001-dependency-security-supply-chain-audit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit`

### Summary

The 2026-05-15 TanStack Mini Shai-Hulud disclosure (42 official npm packages, 84 malicious versions, dead-man's-switch payload that triggers `rm -rf ~/` on token revocation, 518M reported infections) required a comprehensive security sweep of the Public repo and host environment before any remediation could safely proceed. No prior audit record existed. Several attack surfaces (MCP server binaries, shell startup files, LaunchAgents, credential files, CI/CD pipelines) had never been formally inspected.

A 25-iteration deep-research campaign ran across 19 security dimensions using two independent AI executors. 20 primary iterations used cli-devin SWE-1.6. 5 cross-AI verification iterations used cli-opencode with deepseek-v4-pro to independently re-check every CRITICAL and HIGH finding. The operator switched the verification executor mid-run (from cli-codex to cli-opencode with deepseek-v4-pro) at iteration 14. The dispatcher was restarted cleanly with no data loss.

The repo was confirmed CLEAN: no TanStack worm IOCs, no `@tanstack/*` in active package manifests, no malicious commits, no dangerous CI patterns. The host was classified COMPROMISE-CONFIRMED: a Devin JWT session token at `~/.local/share/devin/credentials.toml` was world-readable (mode 644) from iteration 012 through the end of the campaign. 3 CRITICAL, 9 HIGH, 10 MEDIUM, 6 LOW and 7+ INFO findings were produced. A 15-step prioritized remediation playbook shipped in `research/review-report.md`. Cross-AI verification produced zero hallucinations and corrected two partial findings.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| All 25 iteration files present and non-empty | PASS. `ls research/iterations/` returns 25 files. iter-025 is 122 lines. Minimum iter-019 is 5 lines (cli-devin terse style, adequate per prompt-output contract). |
| `research/deep-research-state.jsonl` event count | PASS. 31 events recorded: 1 campaign_start, 25 iterations, 5 progress events. |
| `research/review-report.md` authored | PASS. 9 sections including executive verdict, severity-ranked findings, 15-step remediation playbook. |
| Strict validate Level 1 | PASS. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0 with zero errors and zero warnings. |
| Cross-AI verification hallucination count | PASS. 0 hallucinated findings. 2 PARTIAL corrections: iter-001 pgrep self-match false positive. iter-005 package.json count inflation (1489 vs 123 actual). |
| New findings surfaced in verification only | PASS. 5 net-new findings: H-2 ClickUp/Figma keys on disk, H-7 Gemini sessions at mode 644, H-8 opencode.json full-allow, M-3 Homebrew group-writable dirs, M-8 dead PATH entries. |
| Mini Shai-Hulud IOC absence verified twice | PASS. iter-001 and iter-021 both confirm `gh-token-monitor.sh` absent, no `com.user.gh-token-monitor` LaunchAgent, no `@tanstack/*` in active deps. |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `research/review-report.md` | Created | Executive verdict. Severity-ranked findings. 15-step remediation playbook. |
| `research/iterations/iteration-001.md` to `iteration-025.md` | Created | Per-dimension audit outputs across 19 security dimensions (25 files). |
| `research/deep-research-state.jsonl` | Appended | 31 events: campaign_start, 25 iteration records, 5 progress markers. |

### Follow-Ups

- Run `iter-014` (Workspace Trust scan) as a standalone pass to close the one campaign gap left by a context compaction event that truncated the original output.
- Open a follow-on packet for active remediation of OPERATOR-PENDING items: macOS firewall enable and FontBase network exposure (commands provided in `research/review-report.md` section 8.5).
- Conduct a transitive dependency audit for external MCP server binaries beyond the declared configs in `.utcp_config.json` as part of supply-chain hardening.
- Add SBOM and SLSA provenance checks as a follow-on supply-chain hardening packet.
