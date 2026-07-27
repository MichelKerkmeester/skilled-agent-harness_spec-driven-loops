# Iteration 5 (final): Archival Boundary, Generated Artifacts, Ordering, Rollback, Negative-Knowledge Sweep

## Focus
(1) Negative-knowledge repo-wide sweep with `rg --hidden --no-ignore` (the methodologically correct form — `--no-ignore` alone skips dotfile dirs). (2) Archival boundary enumeration. (3) Generated-artifact generators. (4) Ordering graph + per-consumer rollback risk. This iteration broadened the angle per the dispatch contract (convergence was telemetry-only) and surfaced a **third runtime (`.codex/`)** and **cross-daemon coupling** missed by iters 1-4.

## Findings

### F5.1 — METHODOLOGICAL: `rg --no-ignore` alone is insufficient — `--hidden` is required
A repo-wide `rg --no-ignore` sweep WITHOUT `--hidden` returned only 4 files (it skips `.claude/`, `.opencode/`, `.devin/`, `.cursor/`, `.codex/` — all dotfile dirs). The correct form is `rg --hidden --no-ignore`. Iters 1-4 still found those hits because they passed the dotfile paths as explicit arguments, but any future verification sweep MUST use `--hidden --no-ignore` or it will silently miss the entire `.codex/` runtime and all dotfile configs. [SOURCE: comparison of `rg --no-ignore -l` (4 files) vs `rg --hidden --no-ignore -l` (575 live-surface files after exclusions)]
- **Implication for REQ-001**: the spec's "`--no-ignore`" mandate is necessary but not sufficient. Recommend phase 002 ratify `--hidden --no-ignore` as the verification standard.

### F5.2 — `.codex/config.toml` is a THIRD MCP registration file (BLOCKING — missed in iter 1)
`.codex/config.toml:31-41` — `[mcp_servers.mk_code_index]` with `args = [".opencode/bin/mk-code-index-launcher.cjs"]` and `[mcp_servers.mk_code_index.env]` including `SPECKIT_IPC_SOCKET_DIR = "/tmp/mk-code-index"`. [SOURCE: file:.codex/config.toml:31,33,35,41]
- **Failure mode**: codex runtime tries to spawn a missing server. Must be removed with the skill.
- **Iter 1 gap**: iter 1 only checked `opencode.json` + the `.mcp.json`/`.cursor/mcp.json`/`.claude/mcp.json` symlink chain. The codex TOML registration is a separate real file. **Three real registration files total**: `.claude/mcp.json`, `opencode.json`, `.codex/config.toml`.

### F5.3 — `.codex/hooks.json` codex PostToolUse freshness hook (BLOCKING — third-runtime hook)
`.codex/hooks.json:101` — PostToolUse hook runs `node .opencode/skills/system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs` with a fallback message. [SOURCE: file:.codex/hooks.json:101]
- **Failure mode**: codex edit events fire a hook against a missing script. Remove with the skill. (Parallel to the Devin hook F3.2 and the OpenCode plugin F3.3 — three runtimes each have a freshness hook.)

### F5.4 — `.codex/agents/*.toml` — 8 codex agent files with grants + Wedged-daemon doctrine (BLOCKING)
Codex agent files: `ai-council.toml`, `context.toml`, `debug.toml`, `deep-alignment.toml`, `deep-improvement.toml`, `deep-research.toml`, `deep-review.toml`, `review.toml`. [SOURCE: `rg --no-ignore -l ... .codex/agents/`]
- `context.toml:42,62,68-70,72,91,92,116,138,171,175,413,415` — heavy `code_graph_*` tool doctrine + Wedged-daemon paragraph (line 72).
- `review.toml:42,44,89,91` — `detect_changes` doctrine + Wedged-daemon paragraph.
- `deep-review.toml:161,162` — `detect_changes` doctrine.
- **Failure mode**: codex agents reference non-existent tools. Strip grants + doctrine with the skill. This is a **third runtime** parallel to the claude (iter 1) and opencode (iter 1) agent surfaces — total agent files with Wedged-daemon/code-graph doctrine now 24 (8 claude + 8 opencode + 8 codex).

### F5.5 — Cross-daemon coupling: spec-memory launcher references the code-graph DB (BLOCKING — cross-daemon)
`.opencode/bin/mk-spec-memory-launcher.cjs:102,346,1150` — `canonicalCodeGraphDbDir = path.join(skillsDir, 'system-code-graph', 'mcp-server', 'database')` and an env hint `set SPECKIT_CODE_GRAPH_DB_DIR=... for standalone system-code-graph storage`. [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:102,346,1150]
- **Failure mode**: the SPEC-MEMORY launcher (a daemon that is NOT being decommissioned) computes a DB dir under a missing skill path. Must strip the code-graph DB references from the spec-memory launcher in the same phase that removes the skill. This is the most significant cross-daemon coupling found.
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:89,92` — shared bin lib hardcodes `if (serviceName === 'mk-code-index')` and the code-graph DB path. [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:89,92] (shared by all three launchers — BLOCKING)
- `.opencode/bin/lib/launcher-session-proxy.cjs:141` — comment referencing code-graph tools (prose in code). [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:141]

### F5.6 — Constitutional doctrine doc (load-bearing — constitutional tier)
`.opencode/skills/system-spec-kit/constitutional/code-graph-scope-intent.md` — `importanceTier: constitutional`, `title: "Code-Graph Scope — Everything Here Is Intentional"`, `last_confirmed: 2026-05-31`. [SOURCE: file:.opencode/skills/system-spec-kit/constitutional/code-graph-scope-intent.md:1-7]
- **Classification**: constitutional doctrine. Must be retired/removed with the skill (constitutional docs are load-bearing guardrails). Also `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md` references code-graph routing.

### F5.7 — Dedicated install guide (load-bearing docs)
`.opencode/install-guides/SET-UP - Code Graph.md` — user-facing diagnostic guide for `/doctor code-graph`. [SOURCE: file:.opencode/install-guides/SET-UP - Code Graph.md:1-15]
- `.opencode/install-guides/README.md` — install guide index. Remove both with the skill.

### F5.8 — `.opencode/commands/deep/*` command grants + compiled contracts (BLOCKING — command grants)
- `.opencode/commands/deep/ai-council.md`, `alignment.md`, `research.md`, `review.md`, `command-benchmark.md` — deep command files referencing code-graph tools. [SOURCE: `rg --no-ignore -l ... .opencode/commands/deep/`]
- `.opencode/commands/deep/assets/compiled/deep-{ai-council,alignment,research,review}.contract.md` — compiled contract assets (GENERATED — re-rendered by `compile-command-contracts.cjs`).
- `.opencode/commands/deep/assets/deep-review-{auto,confirm}.yaml`, `deep-research-presentation.txt`, etc. — yaml/presentation assets.
- **Failure mode**: deep commands grant/reference non-existent tools. Strip grants; re-render compiled contracts after source SKILL.md files are updated (F5.10 generator).

### F5.9 — `.opencode/commands/create/assets/*-auto.yaml` + `*-confirm.yaml` (command assets with grants)
Create-command yaml assets reference `mcp__mk_code_index__code_graph_query`: `create-agent-{auto,confirm}.yaml`, `create-benchmark-{auto,confirm}.yaml`, `create-changelog-{auto,confirm}.yaml`, `create-feature-catalog-{auto,confirm}.yaml`, `create-manual-testing-playbook-{auto,confirm}.yaml`, `create-readme-{auto,confirm}.yaml`, `create-skill-{auto,confirm}.yaml`, `create-skill-parent-{auto,confirm}.yaml`. [SOURCE: `rg --no-ignore -l ... .opencode/commands/create/assets/`]
- Plus `speckit/assets/speckit-{complete,implement,plan}-{auto,confirm}.yaml` and `speckit/{complete,plan}.md`. [SOURCE: `rg --no-ignore -l ... .opencode/commands/speckit/`]
- **Classification**: command-grant prose in yaml assets. Strip the `mcp__mk_code_index__*` entries with the skill.

### F5.10 — Generated artifacts + their generators (GENERATED — re-render, do not hand-edit)
- `graph-metadata.json` in `system-skill-advisor/` (F2.5), `system-deep-loop/`, `system-spec-kit/` — **Generator**: the skill-advisor's `skill_graph_scan`/propagate flow (re-render after the skill dir is gone; the `system-code-graph` node + edges drop out automatically).
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json` (F2.5) — **Generator**: skill-advisor indexer.
- `.opencode/commands/deep/assets/compiled/*.contract.md` (F5.8) — **Generator**: `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs]
- `.opencode/skills/*/benchmark/reports/compiled-routing/*/skill-benchmark-report.json` — **Generator**: the deep-skill-benchmark / compiled-routing harness (archival benchmark reports — inventory only).
- `.opencode/logs/cli-dispatch-audit.log`, `dist-freshness-guard.log` — runtime-generated logs (not source; regenerate on next run).
- `.opencode/skills/system-skill-advisor/mcp-server/dist/**` — compiled TS dist (GENERATED; re-build after source edits).

### F5.11 — Archival boundary (REQ-004 — inventory only, NEVER propose edits)
- **`.opencode/specs/**`** — 8745 hits across the spec archive, including the entire `.opencode/specs/system-code-graph/` spec folder (035-rust-backend-rewrite, etc.), `.opencode/specs/z-future/code-graph-and-cocoindex/`, `.opencode/specs/z-future/sqlite-to-turso/`, `.opencode/specs/sk-doc/019-skill-routing-refactor/`, and this packet itself (`036-code-graph-decommission/`). **All archival — never edit.** [SOURCE: `rg --no-ignore -c ... .opencode/specs/` → 8745 hit-lines]
- **Changelogs** — `**/changelog/**` across skills (system-skill-advisor, system-spec-kit, cli-opencode, etc.). Archival release history — never edit.
- **Benchmark reports** — `**/benchmark/reports/**` and `**/*.bench.ts` results. Archival — never edit.
- **`.worktrees/main-review-gate/`** — a separate git worktree with its own repo copy; its hits mirror the main tree. Exclude from the main-repo inventory (it is a worktree artifact, not a primary touchpoint).
- **Manual-testing-playbooks** — `**/manual-testing-playbook/**` across skills. These are operator-prose playbooks; classify as live-prose (stale after removal) but low-blast — refresh opportunistically, not blocking.

### F5.12 — Ordering constraints + rollback risk (synthesis-level)

**Ordering graph (what must land before what):**

1. **Phase A (decouple consumers that reference the server by tool-id string)** MUST land before Phase B:
   - Strip `mcp__mk_code_index__*` grants from all agent files (claude/opencode/codex, 24 files) + command yaml assets + `/doctor` commands.
   - Strip `code_graph_*`/`detect_changes` doctrine from agent bodies + AGENTS.md + skill-advisor/cli-opencode/cli-devin SKILL.md + constitutional doc.
   - Rewrite `system-spec-kit/mcp-server/context-server.ts:257,335,336,721,722` (remove `mk_code_index` tool routing).
   - Edit `mcp-code-mode/runtime/lib/mcp-route-guard.cjs:49` (remove `'mk_code_index'` from server list).
   - Edit `mk-spec-memory-launcher.cjs:102,346,1150` + `launcher-ipc-bridge.cjs:89,92` (strip code-graph DB coupling).
2. **Phase B (remove the MCP registrations)** — only after Phase A grants are gone: edit `.claude/mcp.json:58`, `opencode.json:69`, `.codex/config.toml:31`. Remove `.claude/settings.local.json` bash grant.
3. **Phase C (remove hooks/plugins/CI/reapers)** — parallel to Phase B: delete `.devin/hooks.v1.json:109` entry, `.codex/hooks.json:101` entry, `.opencode/plugins/mk-code-graph*.js` + tests + state dir, `.opencode/scripts/git-hooks/post-commit` code-graph block + test, trim `session-cleanup.sh`/`orphan-mcp-sweeper.sh` case branches, remove `isolation-check.yml` code-graph audit steps.
4. **Phase D (delete the skill dir + bin shims + install guide)** — only after Phases A-C: delete `.opencode/skills/system-code-graph/`, `.opencode/bin/code-index.cjs` + `mk-code-index-launcher.cjs` + 6 vitest files + bin/lib code-graph branches, `.opencode/install-guides/SET-UP - Code Graph.md`, `.opencode/skills/.code-graph-freshness-state/`.
5. **Phase E (re-render generated artifacts)** — after Phase D: re-run skill-advisor `skill_graph_scan` (drops the `system-code-graph` node from skill-graph.json + all `graph-metadata.json` files), re-run `compile-command-contracts.cjs` (regenerates deep command contracts), rebuild spec-kit dist.
6. **Phase F (docs)** — README.md (46 lines), AGENTS.md (6 lines), install-guides index, daemon-cli-reference.md, feature-catalog entries — refresh prose last.

**Rollback risk per consumer:**
- **MCP registrations (Phase B)**: low rollback risk — re-adding a registration block restores the server; but if Phase A decoupling already shipped, agents no longer call the tools, so re-adding is inert. **Ordering hazard**: removing registrations BEFORE grants are stripped → every agent dispatch errors at session start. MUST NOT swap B before A.
- **spec-kit context-server (Phase A)**: medium rollback risk — rewriting tool routing changes spec-kit behavior; keep a Grep-fallback branch behind a feature flag until Phase D lands.
- **spec-memory launcher coupling (Phase A)**: high rollback risk — the spec-memory launcher is a KEPT daemon; editing it risks breaking spec-memory. Test the spec-memory launcher independently after stripping code-graph DB refs.
- **Skill dir deletion (Phase D)**: irreversible-ish (git history preserves it, but re-adding requires restoring the dir + rebuilding dist + re-registering). Gate on a green verification sweep: `rg --hidden --no-ignore` finds no live-surface reference after Phase A-C.
- **Generated artifacts (Phase E)**: low rollback risk — re-rendering is idempotent; if a generator produces a stale graph, re-run it.
- **Archival (never touched)**: zero rollback risk — never edit `.opencode/specs/**`, changelogs, benchmark reports.

## Sources Consulted
- `rg --hidden --no-ignore -l "..."` (575 live-surface files after exclusions)
- `rg --no-ignore -n "..." .codex/{config.toml,hooks.json,agents/*.toml}`
- `head -15 ".opencode/install-guides/SET-UP - Code Graph.md"`, `head -10 .opencode/skills/system-spec-kit/constitutional/code-graph-scope-intent.md`
- `rg --no-ignore -n "..." .opencode/bin/lib/launcher-{ipc-bridge,session-proxy}.cjs .opencode/bin/mk-spec-memory-launcher.cjs`
- `rg --no-ignore -c "..." .opencode/specs/` (8745 archival hit-lines)

## Assessment
- **newInfoRatio**: 0.75 — high novelty for a final iteration because the `--hidden` sweep revealed a whole third runtime (`.codex/`), a third MCP registration, cross-daemon coupling (spec-memory launcher), a constitutional doc, and the deep/create command asset surface — all missed by iters 1-4. This validates the dispatch contract's "broaden angles instead of synthesizing early" instruction.
- **Novelty justification**: iters 1-4 used explicit-path sweeps that found their targets but never proved completeness; iter 5's `--hidden` repo-wide sweep is the first completeness check and surfaced 575 live-surface files including a third runtime.
- **Confidence**: high — blocking finds are file:line confirmed; the 575-file count is `rg -l`-confirmed; the 8745 archival count is `rg -c`-confirmed.

## Reflection
- **What worked**: broadening to a `--hidden --no-ignore` repo-wide sweep for the final iteration — this is the only way to prove completeness and it surfaced the `.codex/` runtime and cross-daemon coupling.
- **What failed**: iters 1-4 never ran a completeness sweep, so a whole runtime (`.codex/`) went uncaptured until iter 5. The iter 1 registration sweep was scoped to the `.mcp.json`/`opencode.json` chain and missed the codex TOML. **Lesson for phase 002**: every consumer class needs a `--hidden --no-ignore` completeness sweep, not just targeted path sweeps.
- **Ruled out**: `.worktrees/main-review-gate/` — ruled out as a primary touchpoint (it is a worktree mirror, not a separate consumer); its hits mirror the main tree.

## Recommended Next Focus
Synthesis — compile `research.md` from iters 1-5 with the cited touchpoint inventory, the ordering graph, per-consumer removal-vs-fallback recommendations, and the negative-knowledge list. Hand off to phase 002 (decommission-decision-record).
