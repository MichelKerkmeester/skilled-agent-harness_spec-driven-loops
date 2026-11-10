# Iteration 10 — Convergence: coverage verification + UNKNOWN ledger

**Run:** 10 | **Focus:** no new territory — verify every seed row is mapped exactly once and record the residual UNKNOWNs a cutover executor must resolve.

## Coverage verification (working/verify_coverage.py, read-only)

| map | seed rows | mapped | missing |
|---|---|---|---|
| A — symlinks | 435 | 435 | 0 |
| B — runtime files | 231 | 231 | 0 |
| B — home-level | 36 | 36 | 0 |
| C — all other tracked refs | 4027 | 4027 | 0 |
| B∩C overlap | — | — | 0 (no double-count) |

Total mapped rows: **435 + 267 + 4027 = 4729** across three maps, against a seed of 435 links + 4258 files + 36 home paths = 4729. **Exact closure.**

## UNKNOWN ledger

| # | claim | what would settle it |
|---|---|---|
| U1 | `.claude/specs` and `.claude/changelog` are described by `.claude/SYNC.md` but absent from this worktree — manifest/tree divergence. Would settle: `readlink`/`ls` on the main checkout, or the SYNC manifest's generation log. |
| U2 | `.cursor/mcp.json` is a *regular file* in this worktree while `.cursor/SYNC.md` describes a symlink — divergence. Would settle: `ls -la .cursor/mcp.json` in the main checkout + git log on the file. |
| U3 | Whether each runtime's discovery follows *directory* symlinks into `.skilled/` (OpenCode plugin glob, Devin skill scan, Cursor rule load, Codex prompt dir). Static mapping cannot answer; needs a live probe per runtime (phase-001 probe list, still open). |
| U4 | Whether untracked/ignored files under runtime roots reference `.opencode` (seed scans tracked files only). Would settle: `grep -rlF .opencode` including untracked, on the real checkout at move time. |
| U5 | Live content of `.opencode/logs/` and `.opencode/skills/.state/` at move time — derived state that may need migration or may be abandoned. Would settle: `ls` at cutover; classified `regenerate` regardless. |
| U6 | Home-level machines beyond this host — `home-refs.tsv` covers this machine only; other contributors' `~/.codex/hooks.json`, `~/.config/git/hooks/*` state is unknowable from here. Would settle: per-machine audit at install/migrate time. |
| U7 | `barter/` and the stray leading-space ` specs/` dir were pre-ruled-out by the task statement; no further evidence needed — recorded for completeness. |

## Convergence statement

A further iteration would add no new rows: all 435 links, 231 runtime files, 36 home paths, and 4027 non-runtime tracked refs are enumerated, cited, and classified; every rule-out was recorded inline per iteration. Stop policy `convergence` satisfied at run 10 (of max 10).

## NewInfoRatio

0.0 new rows this iteration — the iteration exists to *verify* closure and fix the UNKNOWN ledger, per the convergence contract.
