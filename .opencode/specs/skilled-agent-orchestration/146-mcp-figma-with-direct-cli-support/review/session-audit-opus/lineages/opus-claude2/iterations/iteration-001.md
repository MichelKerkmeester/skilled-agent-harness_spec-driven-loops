# Iteration 001 — Correctness

**Dimension**: D1 Correctness
**Focus files**: the eight scripts under `.opencode/skills/mcp-figma/scripts/`
**Session**: fanout-opus-claude2-1781464600582-ntawto

## Scope

Logic of the install/connect/daemon/doctor/unpatch scripts and the shared `_common.sh`. Does each script do what it claims, fail closed, and handle the documented edge cases (missing binary, non-interactive shell, stale npm build, missing consent)?

## What I checked

- `_common.sh:19-23` — `figma_bin()` resolves `figma-ds-cli` first, then `figma-cli`, never a bare `figma`. Correct and matches the naming-trap contract. [SOURCE: .opencode/skills/mcp-figma/scripts/_common.sh:19-23]
- `install.sh:54` — `version_lt` uses `sort -V`; the `auto` path (`install.sh:150-163`) installs npm, then upgrades to the repo build when the version is `< 1.2.0`. Correct staleness handling for the documented minimal-npm trap. [SOURCE: .opencode/skills/mcp-figma/scripts/install.sh:150-163]
- `connect-safe.sh:20` — `if [ ! -t 0 ]; then ... exit 0; fi` guards the interactive `read` on line 22. The non-interactive path exits cleanly **before** the read. This is correct EOF handling. [SOURCE: .opencode/skills/mcp-figma/scripts/connect-safe.sh:20-23]
- `connect-yolo.sh:10-27` — fails closed: without `--i-understand-this-patches-figma` it prints the effect/risk/rollback to stderr and `exit 2`. Correct consent gate. [SOURCE: .opencode/skills/mcp-figma/scripts/connect-yolo.sh:10-27]
- `daemon.sh:11-15` — verb allowlist; unknown verb errors to stderr `exit 2`, help to stdout `exit 0`. Correct. [SOURCE: .opencode/skills/mcp-figma/scripts/daemon.sh:11-15]
- `set -euo pipefail` is set in every script. Good failure posture.

## Adversarial check of the sibling lineage's correctness findings

The `deepseek-v4-pro` lineage raised F001 ("connect-safe.sh stdin read without EOF guard") and F002 ("daemon.sh inconsistent help output"). I re-read both cited locations:
- F001 is a **false positive**: `connect-safe.sh:20` explicitly guards `[ ! -t 0 ]` and exits 0 before the `read` on line 22. There is no unguarded stdin read.
- F002 is **cosmetic at most**: `daemon.sh` routes help to stdout (exit 0) and errors to stderr (exit 2), which is the conventional split, not an inconsistency.

I do not carry either forward as a finding.

## Findings

### F-OPUS-001 (P2, correctness) — `install.sh` leaks `v` to global scope
`main()` assigns `v="$(installed_version)"` in the `auto` branch without a `local` declaration, so `v` leaks out of the function. Harmless (the script exits after `main`), but inconsistent with the `local`-scoped helpers elsewhere.
[SOURCE: .opencode/skills/mcp-figma/scripts/install.sh:156]

### Claim adjudication
No P0/P1 in this iteration; no typed packet required.

## Coverage

- Dimensions covered so far: D1
- New findings this iteration: 1 (P2)
- newFindingsRatio: 0.20

Review verdict: PASS
