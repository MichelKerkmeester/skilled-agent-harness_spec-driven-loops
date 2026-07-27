# Approved finding set

6 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-01:F15` | CAT-3 | `grep -rn 'benchmark/' .opencode/skills/sk-git/` | grep returns no references to `benchmark/` outside the benchmark folder's own self-references; the two run folders (`2026-07-10--live--glm-5-2-high/`, `2026-07-10--live--kimi-2-7/`) are unreferenced b |
| `devin-01:F9` | CAT-3 | `find .opencode/skills/sk-doc/benchmark/reports/compiled-routing/ -maxdepth 1 -type d` | 5 dated subfolders exist and are committed; claim's example names (`luna-high-acceptance-1784596615522/`) are wrong — actual names are `2026-07-21--acceptance--luna-high/` etc. — but core claim (dated |
| `devin-02:F5` | CAT-3 | `find .opencode/skills/mcp-tooling/benchmark/ -maxdepth 1` | `.gitkeep` exists alongside substantial content (README.md, baseline/, compiled-routing/, multiple run-label folders) — redundant |
| `devin-04:F13` | CAT-3 | `grep -c '^\.opencode/specs/barter$' .gitignore` | 4 pairs of duplicate entries confirmed: `.opencode/specs/barter` (lines 271,272), `.claude/specs/barter` (276,277), `.codex/specs/barter` (281,282), `.agents/specs/barter` (286,287) |
| `devin-04:F8` | CAT-3 | `cat .rename-engine-disposable` + `grep rename-engine .gitignore` | File contains "semantic-rename-engine disposable fixture" (scratch residue); grep returns no match in `.gitignore` — not ignored |
| `fanout:SOL-10` | CAT-3 | `find .opencode/logs/dist-freshness-guard.log*` + `grep '\*.log' .gitignore` | File `dist-freshness-guard.log.1` exists; `.gitignore` line 213 has `*.log` but not `*.log.*` — rotated log extension `.log.1` is not matched |
