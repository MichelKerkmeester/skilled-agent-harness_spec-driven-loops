# Triage worklist — sol (45 findings)

Re-test each claim. Record CONFIRMED, REFUTED or DEFERRED with the exact command used.

| # | finding | cat | path | claim |
|---|---|---|---|---|
| 1 | `devin-01:F5` | CAT-5 | `.opencode/skills/sk-code/changelog/v4.1.0.0.md:12-13 vs .opencode/skills/sk-code/mode-registry.json:19` | Changelog v4.1.0.0 contradicts mode-registry.json on surface count |
| 2 | `devin-01:F6` | CAT-5 | `.opencode/skills/sk-code/benchmark/ and .opencode/skills/sk-code/code-opencode/benchmark/` | Duplicated benchmark responsibility between hub and code-opencode packet |
| 3 | `devin-01:F10` | CAT-1 | `.opencode/skills/sk-doc/scripts/README.md:69-78` | scripts/README.md documents 10 scripts that do not exist at that location |
| 4 | `devin-01:F11` | CAT-1 | `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` | validate-doc-model-refs.js has no reachable callers |
| 5 | `devin-01:F12` | CAT-5 | `.opencode/skills/sk-doc/SKILL.md:3 vs .opencode/skills/sk-doc/mode-registry.json:17-162` | SKILL.md says "eleven packets" but mode-registry.json lists twelve modes |
| 6 | `devin-01:F14` | CAT-5 | `.opencode/skills/sk-git/SKILL.md:3,252,258,264 and .opencode/skills/sk-git/references/quick-reference.md:3,17,41 *(merge` | SKILL.md claims to "route" to git-worktrees/git-commit/git-finish but no routing infrastructure or packet dirs exist |
| 7 | `devin-01:F16` | CAT-1 | `.opencode/skills/sk-git/scripts/worktree-naming.sh:402,427` | `validate-remote-allowlist` CLI subcommand has no external caller |
| 8 | `devin-01:F17` | CAT-1 | `.opencode/skills/sk-git/scripts/worktree-naming.sh:394,411` | `skill-ids` CLI subcommand has no external caller |
| 9 | `devin-01:F22` | CAT-5 | `.opencode/skills/sk-prompt/prompt-models/benchmarks/ (40+ .cjs/.js files)` | Executable scripts in a packet whose contract forbids Bash |
| 10 | `devin-01:F23` | CAT-5 | `.opencode/skills/sk-prompt/prompt-models/references/models/composer-2.5.md:17,45,141` | composer-2.5.md references non-existent `cli-cursor` executor |
| 11 | `devin-02:F1` | CAT-5 | `.opencode/skills/cli-external-orchestration/SKILL.md, .opencode/skills/cli-external-orchestration/mode-registry.json` | cli-external-orchestration prose says "three"/"four" modes while the authoritative registry ships five |
| 12 | `devin-02:F2` | CAT-5 | `.opencode/skills/mcp-tooling/mode-registry.json` | mcp-tooling/mode-registry.json transport description omits mcp-refero and mcp-mobbin; version field lags SKILL.md/changelog |
| 13 | `devin-02:F3` | CAT-5 | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md (vs. scripts/hooks/devin/ on disk)` | cli-opencode/scripts/hooks/README.md documents the codex/ sibling but omits the live devin/ hook subdir |
| 14 | `devin-02:F6` | CAT-5 | `.opencode/skills/cli-external-orchestration/SKILL.md, .opencode/skills/mcp-tooling/SKILL.md` | both hub SKILL.md §3 Layout diagrams omit live contract files that exist on disk and are referenced elsewhere |
| 15 | `devin-03:F2` | CAT-5 | `` | Canonical `commands/README.txt` omits the entire live `interface/` command group |
| 16 | `devin-03:F3` | CAT-5 | `` | `commands/README.txt` documents `agent_router` (underscore) but the file is `agent-router.md` (hyphen) |
| 17 | `devin-03:F4` | CAT-5 | `` | `create/diff.md` is a live, working command omitted from both the canonical index and `create/README.txt` |
| 18 | `devin-03:F5` | CAT-5 | `` | `deep/alignment.md` and `deep/command-benchmark.md` are live routers omitted from the canonical deep command index |
| 19 | `devin-03:F6` | CAT-5 | `` | `agents/README.txt` inventory omits the live `deep-alignment.md` agent |
| 20 | `devin-03:F7` | CAT-5 | `` | `compiled/README.md` describes `deep-alignment.contract.md` as a non-authority placeholder, but the file is a full generated execution contract recorded in the manifest |
| 21 | `devin-03:F8` | CAT-5 | `` | `commands/scripts/README.md` documents a stale family list (`create, deep, design`) that no longer matches the live tree |
| 22 | `devin-03:F11` | CAT-1 | `` | `commands/scripts/smoke-command-benchmark.cjs` is an undocumented smoke test with no reachable caller |
| 23 | `devin-04:F2` | CAT-5 | `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs` | CI mirror-sync checker misses 12 of 13 drifted agents due to token-set comparison |
| 24 | `devin-04:F3` | CAT-5 | `.github/workflows/agent-mirror-sync.yml:29 + .opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-` | `agent-mirror-sync.yml` detects `.codex/agents/` changes but checker never compares them |
| 25 | `devin-04:F6` | CAT-1 | `karabiner.json (shortcut key Cmd+Ctrl+5)` | `karabiner.json` shortcut #5 references non-existent agent `write.md` |
| 26 | `devin-04:F9` | CAT-5 | `.codex/config.toml` | `.codex/config.toml` MCP config drifted from `opencode.json`/`.claude/mcp.json` — missing 2 servers, different Node version |
| 27 | `devin-04:F10` | CAT-5 | `.claude/mcp.json + opencode.json` | `.claude/mcp.json` duplicates `opencode.json` MCP config — two sources of truth |
| 28 | `devin-04:F11` | CAT-1 | `.github/hooks/scripts/session-start.sh:11 + .github/hooks/scripts/user-prompt-submitted.sh:11` | `.github/hooks/scripts/` reference non-existent `dist/hooks/copilot/` directory |
| 29 | `devin-04:F12` | CAT-1 | `.github/workflows/routing-registry-drift.yml:18 and :33` | `routing-registry-drift.yml` trigger path references non-existent spec directory |
| 30 | `devin-04:F14` | CAT-1 | `.gitignore:22 + .env.example` | `.env.example` is silently ignored by `.gitignore` `.env.*` pattern with no negation |
| 31 | `fanout:SOL-07` | CAT-5 | `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` | Four deep commands retain legacy bodies and compiled contracts, with fix mode concatenating both representations. |
| 32 | `fanout:SOL-08` | CAT-5 | `.opencode/agents/README.txt` | Thirteen agent definitions are packaged in each of three runtime trees, and the two Markdown inventories already omit deep-alignment. |
| 33 | `fanout:SOL-02` | CAT-5 | `.opencode/bin/mk-spec-memory-launcher.cjs` | Three launcher programs plus shared supervision total 8,457 lines and intentionally implement different daemon lifecycle policies. |
| 34 | `fanout:SOL-03` | CAT-5 | `.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts` | Three package-local shared-payload implementations total 2,373 lines and are protected by an isolation policy that creates drift cost. |
| 35 | `fanout:F1` | CAT-1 | `.opencode/bin/cli-exit-taxonomy-smoke.cjs` |  |
| 36 | `fanout:F10` | CAT-1 | `.opencode/skills/system-deep-loop/runtime/scripts/append-state-record.cjs` |  |
| 37 | `fanout:F22` | CAT-1 | `.opencode/bin/check-no-spec-imports.cjs` |  |
| 38 | `fanout:F9` | CAT-1 | `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` |  |
| 39 | `fanout:F11` | CAT-5 | `.opencode/skills/system-deep-loop/**/reduce-state.cjs` |  |
| 40 | `fanout:F14` | CAT-5 | `.opencode/skills/sk-design/mode-registry.json` |  |
| 41 | `fanout:F17` | CAT-5 | `.opencode/bin/lib/compiled-routing/013-live-activation/activation/*/fence-state.json` |  |
| 42 | `fanout:F19` | CAT-5 | `.opencode/agents/ vs .claude/agents/` |  |
| 43 | `fanout:F20` | CAT-5 | `opencode.json vs .cursor/mcp.json` |  |
| 44 | `fanout:F3` | CAT-5 | `.opencode/bin/mk-*-launcher.cjs` |  |
| 45 | `fanout:F8` | CAT-5 | `**/post-compaction.cjs` |  |
