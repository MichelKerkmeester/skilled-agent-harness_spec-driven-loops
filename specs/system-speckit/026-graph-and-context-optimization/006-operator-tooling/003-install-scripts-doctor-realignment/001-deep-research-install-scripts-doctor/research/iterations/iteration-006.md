# Iteration 6: Exhaustive Net-New Long-Tail Sweep

## Focus

Exhaustive net-new sweep across install guides, scoped scripts, doctor routes/assets/scripts, and runtime mirrors for stale tool-count, CocoIndex-era, 116 rename, stale DB path, and advisor-ownership tokens. Known hits from the 18-item catalog were subtracted before classification.

## Actions Taken

- Ran a scoped ripgrep sweep over `.opencode/skills/*/INSTALL_GUIDE.md`, `.opencode/skills/*/mcp_server/INSTALL_GUIDE.md`, `.opencode/scripts/`, `.opencode/skills/*/scripts/`, `.github/hooks/`, `.opencode/commands/doctor/`, `.claude/commands/doctor/`, `.gemini/commands/doctor/`, `.gemini/commands/deep/`, `.codex/config.toml`, and `.codex/agents/`.
- Verified candidate lines with `nl -ba` reads before classifying them.
- Subtracted cataloged canonical hits and rechecked mirror/back-up adjacent lines that were not explicitly in the catalog.
- Cross-checked the code-graph DB path against `.opencode/bin/mk-code-index-launcher.cjs:97-99`, which currently sets `.opencode/.spec-kit/code-graph/database` as the runtime default.

## Findings

- **[P1 / STALE-LIVE]** `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:83` — `│    mcp_server/database/code-graph.sqlite   (structural graph)   │`.
- **[P1 / STALE-LIVE]** `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:114` — ``| `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite` | Default repo-local structural code-graph database used by the checked-in configs |``.
- **[P1 / STALE-LIVE]** `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1113` — ``| `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite` | Structural code-graph database |``.
- **[P2 / SHARED-STALE]** `.opencode/commands/doctor/assets/doctor_update.yaml:101` — `- "mcp_server/database/code-graph.sqlite.pre-doctor-update.*.bak"`.
- **[P2 / SHARED-STALE]** `.opencode/commands/doctor/assets/doctor_update.yaml:107` — `- "mcp_server/database/deep-loop-graph.sqlite.pre-doctor-update.*.bak"`.
- **[P1 / MIRROR-DRIFT]** `.claude/commands/doctor/assets/doctor_update.yaml:100` — `- "mcp_server/database/code-graph.sqlite"  # structural code graph DB`.
- **[P2 / MIRROR-DRIFT]** `.claude/commands/doctor/assets/doctor_update.yaml:101` — `- "mcp_server/database/code-graph.sqlite.pre-doctor-update.*.bak"`.
- **[P1 / MIRROR-DRIFT]** `.claude/commands/doctor/assets/doctor_update.yaml:106` — `- "mcp_server/database/deep-loop-graph.sqlite"  # research/review coverage graph DB`.
- **[P2 / MIRROR-DRIFT]** `.claude/commands/doctor/assets/doctor_update.yaml:107` — `- "mcp_server/database/deep-loop-graph.sqlite.pre-doctor-update.*.bak"`.
- **[P2 / SHARED-STALE]** `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:79` — `- "mcp_server/database/deep-loop-graph.sqlite.pre-doctor-deep-loop.*.bak"  # deep-loop snapshot files only`.
- **[P1 / MIRROR-DRIFT]** `.claude/commands/doctor/assets/doctor_deep-loop.yaml:78` — `- "mcp_server/database/deep-loop-graph.sqlite"  # coverage graph DB`.
- **[P2 / MIRROR-DRIFT]** `.claude/commands/doctor/assets/doctor_deep-loop.yaml:79` — `- "mcp_server/database/deep-loop-graph.sqlite.pre-doctor-deep-loop.*.bak"  # deep-loop snapshot files only`.
- **[P1 / MIRROR-DRIFT]** `.claude/commands/doctor/assets/doctor_deep-loop.yaml:162` — `- "Bash: stat -f '%m %z' mcp_server/database/deep-loop-graph.sqlite when present."`.
- **[P3 / HISTORICAL]** `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1197` — ``| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |``.

## Ruled Out

- Clean after subtracting cataloged hits: `\b11 (graph )?tools\b`, `\b39 tools\b`, `\b64 tools\b`, `\bccc\b`, `coco.?daemon`, `\b8765\b`, `semantic search daemon`, `sk-research`, `sk-review`, `sk-agent-improvement`, and `mcp__mk_spec_memory__advisor`.
- `cocoindex` net-new matches were generated inventories or fixtures only: `.no-frontmatter-list.txt`, `.unscanned.txt`, `.folder-list.txt`, and memory-quality fixture expected trigger strings. Classification: HISTORICAL/CORRECT, not fix targets.
- `rerank` net-new matches outside cataloged cross-encoder lines were MMR references, legacy model-name detectors, migration owner-map keys, generated folder inventories, or kept historical measurement outputs. Classification: CORRECT/HISTORICAL.
- `sidecar` net-new matches referenced the active embedder sidecar (`sidecar-client.ts`) or skill-advisor Python fallback behavior, not the deleted rerank sidecar. Classification: CORRECT.
- `.spec-kit/code-graph/database` net-new matches were ruled CORRECT because `.opencode/bin/mk-code-index-launcher.cjs:97-99` sets that directory as the current standalone shared default.
- `.codex/agents/ai-council.toml:20` matched `sk-ai-council` only as a substring inside the valid command `/deep:ask-ai-council`. Classification: CORRECT.

## Questions Answered

The long-tail pass found net-new stale live references only in system-spec-kit install-guide code-graph paths and doctor YAML backup/mirror lines. Tool counts, CocoIndex daemon/port, advisor ownership, and most 116 rename tokens have no net-new live hits beyond the catalog.

## Questions Remaining

The provided state says the current code-graph DB is `.opencode/skills/system-code-graph/database/code-graph.sqlite`, but checked-in runtime code uses `.opencode/.spec-kit/code-graph/database`. Future consolidation should reconcile that current-truth line before treating `.spec-kit/code-graph/database` hits as stale.

## Next Focus

Patch target list is now closed for install/scripts/doctor: update the three system-spec-kit install-guide code-graph DB rows and the doctor YAML backup/mirror DB path tails, then rerun the same stale-token sweep.
