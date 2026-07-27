# Triage worklist — composer (20 findings)

Re-test each claim. Record CONFIRMED, REFUTED or DEFERRED with the exact command used.

| # | finding | cat | path | claim |
|---|---|---|---|---|
| 1 | `devin-01:F9` | CAT-3 | `.opencode/skills/sk-doc/benchmark/compiled-routing/ (5 dated subfolders: luna-high-acceptance-1784596615522/, luna-high-` | Dated benchmark output folders committed to repository |
| 2 | `devin-01:F13` | CAT-4 | `.opencode/skills/sk-doc/feature-catalog/` | feature-catalog/ at hub root not documented in SKILL.md layout |
| 3 | `devin-01:F15` | CAT-3 | `.opencode/skills/sk-git/benchmark/{live-glm-5.2-high,live-kimi-2.7}/` | Committed benchmark reports unreferenced by any docs |
| 4 | `devin-01:F18` | CAT-4 | `UNKNOWN — .github/ does not exist under sk-git/` | Changelog documents `.github/workflows/` and `.github/hooks/scripts/` READMEs that do not exist |
| 5 | `devin-02:F5` | CAT-3 | `.opencode/skills/mcp-tooling/benchmark/.gitkeep` | mcp-tooling/benchmark/.gitkeep is redundant — the directory has substantial content |
| 6 | `devin-03:F1` | CAT-3 | `` | Committed `.DS_Store` scratch residue in `commands/` |
| 7 | `devin-03:F9` | CAT-4 | `` | `create/assets/tests/` contradicts the documented `assets/` layout (YAML-only) and has no reachable runner |
| 8 | `devin-03:F10` | CAT-4 | `` | `doctor/scripts/tests/` is omitted from `doctor/scripts/README.md` directory tree and has no reachable runner |
| 9 | `devin-04:F7` | CAT-4 | `karabiner.json` | `karabiner.json` is a personal macOS keyboard config misplaced in a public repo |
| 10 | `devin-04:F8` | CAT-3 | `.rename-engine-disposable` | `.rename-engine-disposable` is scratch residue not in `.gitignore` |
| 11 | `devin-04:F13` | CAT-3 | `.gitignore` | `.gitignore` has stale entries for paths that no longer exist + duplicate entries |
| 12 | `devin-05:F3` | CAT-4 | `.opencode/skills/sk-design/benchmark/{after-009,after-012-routing-rigor,after-016-hub-routing,after-018-transport-integr` | `sk-design/benchmark/after-*` run-labels use `report.json`/`report.md` instead of the storage-standard `skill-benchmark-report.json`/`.md`, and three run-labels are unreferenced by the owning README |
| 13 | `fanout:SOL-09` | CAT-4 | `.opencode/skills/system-spec-kit/scripts/.scan-one.sh` | Committed hidden scan scripts embed one developer workstation's absolute repository and spec paths. |
| 14 | `fanout:SOL-01` | CAT-4 | `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` | Distinct live skill-advisor SQLite state exists under both mcp-server and mcp_server paths while current config names only the canonical hyphenated path. |
| 15 | `fanout:SOL-06` | CAT-4 | `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Generated production routing preserves phase-numbered topology and carries seven distinct hub compilers totaling 3,155 lines. |
| 16 | `fanout:SOL-10` | CAT-3 | `.opencode/logs/dist-freshness-guard.log.1` | The plugin-generated rotated log is not ignored because the repository ignores *.log but not *.log.*. |
| 17 | `fanout:F13` | CAT-3 | `.opencode/install-guides/ (broken symlinks)` |  |
| 18 | `fanout:F21` | CAT-3 | `.opencode/skills/system-spec-kit/node_modules` |  |
| 19 | `fanout:F6` | CAT-3 | `.opencode/skills/system-spec-kit/mcp-server/database/vectors/.gitkeep` |  |
| 20 | `fanout:F16` | CAT-4 | `.opencode/skills/system-spec-kit/scripts/test-fixtures/*/description.json` |  |
