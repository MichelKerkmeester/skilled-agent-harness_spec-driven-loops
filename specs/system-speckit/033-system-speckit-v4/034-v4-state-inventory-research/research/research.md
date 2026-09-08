---
title: "Research: v4 state inventory and changelog draft fact-check"
description: "Merged synthesis of the luna (GPT-5.6 Luna, codex) and deepseek (DeepSeek V4 Flash, devin) lanes: what the repository ships on skilled/v4.0.0.0, the ranked drift in the old v4.0.0.0 changelog draft, upgrade-note candidates, and the lane disagreements settled by the reproduction pass."
trigger_phrases:
  - "v4 state inventory"
  - "changelog draft drift table"
  - "what v4 actually ships"
  - "six hubs not seven"
  - "alignment mode removed"
importance_tier: "important"
contextType: "research"
---
# Research: v4 state inventory and changelog draft fact-check

Two independent ten-iteration lanes read branch `skilled/v4.0.0.0` on 2026-09-08 against registries and code, then measured `../CHANGELOG-v4.0.0.0.md` against what they found. This document merges them. Where the lanes disagreed, the reproduction pass in `confirmed-drift.md` settled it; the settled value is what appears below.

---

## 1. INVENTORY

### Skill roots (13 skills + README.txt under `.opencode/skills/`)

| Root | Shape | Modes (workflowMode) | Commands |
|---|---|---|---|
| `cli-external-orchestration` | hub | 6: cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi | none; reached through deep-loop fan-out |
| `mcp-tooling` | hub | 9: mcp-chrome-devtools, mcp-click-up, mcp-obsidian, mcp-aside-devtools, mcp-notion (workflow); mcp-figma, mcp-refero, mcp-mobbin, mcp-magicpath (transport) | none; `/doctor:mcp` is separate |
| `sk-code` | hub | 6: sk-code-quality, sk-code-review (workflow); sk-code-webflow, sk-code-opencode, sk-code-mobile-cli, sk-code-obsidian (surface) | none |
| `sk-design` | hub | 4: sk-design-fundamentals, sk-design-md-generator, sk-design-chart, sk-design-diagram | `/design:chart`, `/design:diagram`, `/design:extract` |
| `sk-doc` | hub | 14: sk-create-skill, -skill-parent, -readme, -agent, -command, -feature-catalog, -manual-testing-playbook, -benchmark, -changelog, -diff, -frontmatter, -quality-control, -repo-rule, -with-human-voice | 12 `/create:*` (frontmatter and quality-control have no command file) |
| `system-deep-loop` | hub | 6: research, review, ai-council (lexical); agent-improvement (alias-fold); model-benchmark, skill-benchmark (command-bridge) | 6 `/deep:*` |
| `mcp-code-mode` | standalone | 1 | none (MCP tools) |
| `sk-communication` | standalone | 1 | `/rewrite:response`, `/rewrite:response-by-external-agent`, `/rewrite:explain-visually` |
| `sk-git` | standalone, no spec | 1 | none |
| `sk-prompt` | standalone leaf (v3.0.0.0) | 1 | `/prompt:improve` |
| `sk-vision` | standalone | 1 | `/vision` |
| `system-skill-advisor` | standalone | 1 (daemon + CLI front door) | none (MCP tools) |
| `system-spec-kit` | standalone | 1 (runtime/cli nested) | 6 `/speckit:*` |

Six hubs carry a `mode-registry.json`; the other seven do not. [SOURCE: `ls .opencode/skills/*/mode-registry.json` → 6]

### Commands, agents, hooks, mirrors, CI

- **37 command files** in 9 families + 3 top-level: `/speckit:*` (6: complete, implement, plan, resume, save, search), `/deep:*` (6), `/create:*` (12), `/design:*` (3), `/doctor:*` (3: mcp, speckit, update), `/prompt:improve`, `/rewrite:*` (3), `/agent-router`, `/goal-opencode`, `/vision`. [SOURCE: `find .opencode/commands -name '*.md'` excluding assets/scripts → 37]
- **12 agents:** ai-council, code, context, debug, deep-improvement, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, review. No `deep` or `deep-loop` router agent. [SOURCE: `ls .opencode/agents/*.md` → 12]
- **Hooks:** 22 concern directories, 102 symlinks; master switch `SYSTEM_HOOKS_DISABLED` (24 files) with `MK_HOOKS_DISABLED` honored as a legacy alias. Goal hooks exist for opencode, cursor and pi only. [SOURCE: `find .opencode/hooks -type l | wc -l` → 102; `.opencode/hooks/shared/hook-flags.cjs:28`; `ls .opencode/hooks/goal/`]
- **Runtime mirrors:** `.claude`, `.codex`, `.cursor`, `.devin`, `.pi`, each SYNC.md-managed; Codex is generated/outbound, Cursor and Devin symlink-shaped, Pi native extensions; Devin carries no command surface. [SOURCE: luna iteration 8; `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`]
- **CI:** 15 workflows including spec-kit-check (with a mirrors-parity job), naming-standard-guard, routing-registry-drift, comment-hygiene, agent-mirror-sync, command-tree-parity. [SOURCE: `ls .github/workflows/*.yml` → 15]

### Key runtime surfaces

- **system-spec-kit:** engine at `runtime/cli/` (spec/validate.sh, create.sh, repair-derived.cjs, recommend-level.sh; continuity/generate-context; spec-folder/generate-description; retrieval/lookup-trigger-index.mjs + rg-wrapper.mjs). Validation: **40 registry entries** over 34 `check-*` rule files (some files carry more than one rule). Core templates 1,275 lines across 4 files; research addon 946 lines, level-gated. Trigger index committed at `runtime/data/trigger-index.json`. Retrieval is lexical; no memory database, embedder or MCP memory server. [SOURCE: `validator-registry.json` length 40; `ls runtime/cli/rules/check-*` → 34; `wc -l templates/core/*.tmpl` → 1275]
- **system-deep-loop:** 6 registry modes; 7 ledger modes (deep-research, deep-review, deep-ai-council, agent-improvement, model-benchmark, skill-benchmark, deep-improvement-common). Executor kinds: native + 6 CLI kinds, **all six wired** in `fanout-run.cjs` (`LINEAGE_COMMAND_ADAPTERS` has cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-opencode, cli-pi). Per-kind allowlists: `PI_SUPPORTED_MODELS` (default deepseek-v4-flash-vision-exp), `CURSOR_SUPPORTED_MODELS` (default composer-2.5), `DEVIN_SUPPORTED_MODELS` (default swe). Fan-out concurrency ≤ 8, default 2; stop policy `convergence` or `max-iterations`. The deep-alignment mode and conformance benchmark were **removed** in `8849444aa61`. [SOURCE: `executor-config.ts:11`; `fanout-run.cjs:2378`; `git log -S'deep-alignment'`]
- **system-skill-advisor:** MCP server `system_skill_advisor`, CLI front door `.opencode/bin/skill-advisor.cjs`, confidence 0.8 / uncertainty 0.35, structural state containment, launched under Codex through `/opt/homebrew/bin/node` pinned to the better-sqlite3 ABI. [SOURCE: `.codex/config.toml:4-9`]
- **sk-git:** `worktrees/{NNN}-{slug}` and `branches/{NNN}-{slug}` grammar, owner-first names rejected by `is_valid_branch`; push allowlist + pre-push hook; **GitKraken MCP integrated** (`references/gitkraken-mcp-integration.md`, 8 SKILL.md lines). [SOURCE: `sk-git/SKILL.md:359`; `scripts/worktree-naming.sh:111`]
- **Benchmarks:** `run-skill-benchmark.cjs` lives under `system-deep-loop/deep-improvement/scripts/skill-benchmark/` and **does** exit 3 on every BLOCKED-BY-* verdict. [SOURCE: `run-skill-benchmark.cjs:691-694`]

---

## 2. RANKED DRIFT TABLE

Verdicts: FALSE = the draft names a surface that does not exist; STALE = name, count or path is wrong; MISSING = a shipped surface the draft omits; TRUE = keep. Every row below reproduced in `confirmed-drift.md`.

| # | Sev | Draft claim | Verdict | Actual state | Correction |
|---|---|---|---|---|---|
| 1 | P0 | `memory_search`/`memory_save` are daily commands; a memory engine with retrieval-shape axis, BM25/FTS fallback and bi-temporal edges | FALSE | Memory database and MCP server decommissioned; retrieval is the trigger index + ripgrep behind `/speckit:search`; zero live references in commands or SKILL.md files | Replace the whole "Spec Kit & Memory" engine narrative with the lexical retrieval story and the decommission |
| 2 | P0 | `/interface:*` command family and a nine-stage interface contract | FALSE | No `commands/interface/`; design commands are `/design:chart`, `/design:diagram`, `/design:extract` | Rename throughout; describe the sk-design hub's four modes |
| 3 | P0 | `sk-create-diagram` and `/create:diagram` (27 types) | FALSE | Neither exists; diagrams are `sk-design-diagram` via `/design:diagram` | Move the diagram story to the design section |
| 4 | P0 | A new `alignment` (conformance-audit) deep-loop mode; eight ledger modes on `new_authoritative_final` | FALSE | Removed in `8849444aa61`; six registry modes, seven ledger modes | Delete the alignment paragraphs and the eight-mode count |
| 5 | P0 | `sk-prompt` is a two-mode hub (prompt-improve, prompt-models) with six per-model profiles | FALSE | Standalone single-leaf skill, no mode-registry; command is `/prompt:improve` (draft says `/prompt-improve`) | Rewrite the prompt section as a standalone skill |
| 6 | P0 | Goals carry equal weight in every tool | FALSE | Goal hooks for opencode, cursor and pi only; no claude, codex or devin | Scope the goal claim to the three runtimes |
| 7 | P1 | Seven hubs share the two-axis shape | STALE | Six hubs (sk-prompt is not one) | "Six hubs" |
| 8 | P1 | Hook kill-switch `MK_HOOKS_DISABLED`; branch grammar `<skill>/{NNNN}-{slug}` | STALE | `SYSTEM_HOOKS_DISABLED` (MK_ kept as alias); `worktrees/{NNN}-{slug}` / `branches/{NNN}-{slug}`, owner-first rejected | Update both names |
| 9 | P1 | `/doc:quality` kept as an alias | FALSE | No `commands/doc/`; `sk-create-quality-control` is a mode without a command file | Drop the alias claim |
| 10 | P1 | sk-code has webflow and opencode surfaces | STALE | Six modes: two workflow + four surfaces (adds mobile-cli, obsidian) | List all six |
| 11 | P1 | mcp-tooling roster as drafted | STALE | Nine modes including Notion and MagicPath | List nine |
| 12 | P1 | Pi subagent dispatch through `pi-subagents` | STALE | Directive and injector removed; zero live references | Describe native subagents |
| 13 | P1 | The parent phase map ends at 29 | STALE | 34 children after this session's consolidation | Point at the current map |
| 14 | P2 | Core templates 2,931 → 1,314 lines; ~96 hook symlinks; 20 concern dirs | STALE | 1,275 lines; 102 symlinks; 22 concern dirs | Update the numbers or drop them |
| 15 | P2 | Level-1 research doc is 175 lines instead of 944 | TRUE (gated) | Template is level-gated (946-line source); rendered size not re-measured | Keep, phrased as "level-gated" |
| 16 | P2 | `run-skill-benchmark.cjs` exits 3 on blocks | TRUE | Confirmed at `run-skill-benchmark.cjs:691-694`; path moved under system-deep-loop | Keep; fix the path |
| 17 | P2 | Codex starts the advisor on the ABI-matching Node | TRUE | `.codex/config.toml` pins `/opt/homebrew/bin/node` for the better-sqlite3 ABI | Keep; drop the "141" number unless re-measured |
| 18 | P2 | GitKraken MCP wired into sk-git | TRUE | `references/gitkraken-mcp-integration.md` and 8 SKILL.md lines | Keep (DeepSeek's "zero references" was wrong) |
| 19 | P2 | Any of six external CLIs, including cli-claude-code, is a deep-loop executor | TRUE | All six adapters present in `fanout-run.cjs`; `ExecutorNotWiredError` is defined but never thrown | Keep (both lanes' "unwired" finding was wrong) |

Claims both lanes confirmed TRUE and the rewrite should keep: the `specs/` top-level move with the `.opencode/specs -> ../specs` symlink; the kebab-case guard workflow; `@markdown` replacing `@create`; the `/create:skill` and `/create:readme` renames; retired cli-gemini and cli-copilot; Open Design retired; mcp-figma nested under mcp-tooling; per-workspace goals; executor binary gates; hooks assembled by symlink with `hook-flags.env`; the runtime rename to `runtime/cli/`; `deep-loop-workflows` and `deep-loop-runtime` merged into `system-deep-loop`.

---

## 3. UPGRADE-NOTES CANDIDATES

1. Memory commands and the memory database are gone; use `/speckit:search` (trigger index + ripgrep) and the continuity writer for saves.
2. Spec packets live under top-level `specs/`; `.opencode/specs` is a compatibility symlink.
3. The spec-kit engine moved to `.opencode/skills/system-spec-kit/runtime/cli/`; `scripts/` and `mcp-server` identities are retired.
4. Design commands are `/design:chart`, `/design:diagram`, `/design:extract`; `/interface:*` is gone.
5. `sk-prompt` is standalone; the command is `/prompt:improve`.
6. The deep-alignment mode was removed; six `/deep:*` modes remain.
7. Branch grammar is `worktrees/{NNN}-{slug}` or `branches/{NNN}-{slug}`; owner-first names are rejected; only `skilled/v*` keeps a prefix.
8. Hook master switch is `SYSTEM_HOOKS_DISABLED` (`MK_HOOKS_DISABLED` still honored).
9. `pi-subagents` directive removed; Pi uses native subagents unless a `cli-*` mode is named.
10. `run-skill-benchmark.cjs` moved under `system-deep-loop/deep-improvement/scripts/skill-benchmark/`; blocked verdicts exit 3.
11. `/doc:quality` alias and `/create:diagram` do not exist.
12. Goal hooks cover opencode, cursor and pi only.

---

## 4. LANE DISAGREEMENTS, SETTLED

| Topic | luna | deepseek | Settled by |
|---|---|---|---|
| cli-claude-code executor | wired (listed in six executors) | unwired, `ExecutorNotWiredError` | **luna**: adapter at `fanout-run.cjs:2378`; error class never thrown |
| GitKraken MCP | not flagged | "zero references" FALSE | **draft is TRUE**: 8 lines in `sk-git/SKILL.md`, dedicated reference file |
| Validation rule count | 40 (registry) | 39 (`check-*` files) | **40 registry entries** over 34 rule files; count rules, not files |
| Hook concern dirs | — | 21 | **22** (`ls -d .opencode/hooks/*/`) |
| Benchmark exit 3 | needs reproduction | UNVERIFIED | **TRUE** at lines 691-694 |
| ABI 141 | needs reproduction | unverifiable | Node pin confirmed in `.codex/config.toml`; the number 141 not re-measured |
| Advisor residual-state leak | STALE/MISSING | — | Not reproduced this session; structural containment confirmed in code; treat the draft's "still in progress" as unverified |

---

## 5. METHOD

- Lanes: `luna` = cli-codex `gpt-5.6-luna` xhigh fast; `deepseek` = cli-devin `deepseek-v4-flash-max`. Ten angles each, one per iteration, `--stop-policy max-iterations`, concurrency 2; both reached 10/10 with synthesis. Per-lane outputs: `lineages/{luna,deepseek}/research.md` and `iterations/`.
- Both lineages ended with a write-containment "violation" because this session's uncommitted consolidation edits sat outside the lineage directories; the guard restored them to HEAD and they were replayed and committed. Neither lane wrote outside its directory.
- Reproduction pass: every row in §2 was checked by a direct command in this session; commands and outputs are in `confirmed-drift.md`.
