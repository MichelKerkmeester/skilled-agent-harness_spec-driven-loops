---
title: "Confirmed drift: v4 changelog draft versus the repository"
description: "The numbered table the changelog rewrite consumes: each drift row from the two research lanes reproduced by a direct command in this session, with the command, its observed output, and the verdict, plus the lane findings that were dropped."
trigger_phrases:
  - "confirmed drift table"
  - "changelog rewrite input"
  - "reproduced drift rows"
importance_tier: "important"
contextType: "research"
---
# Confirmed drift: v4 changelog draft versus the repository

Reproduced 2026-09-08 on `skilled/v4.0.0.0` at `d1f75a15f6`. A row is kept only when the command below showed the drift; the two lane findings that did not reproduce are listed at the end.

---

## 1. CONFIRMED ROWS

| # | Sev | Draft says | Command | Observed | Verdict |
|---|---|---|---|---|---|
| 1 | P0 | `memory_search` / `memory_save` daily commands | `rg -l 'memory_search\|memory_save' .opencode/commands .opencode/skills/*/SKILL.md` | 1 hit, a scoring label `memory_saved` in `speckit-complete.yaml:477`; no command | FALSE |
| 2 | P0 | `/interface:*` family | `ls .opencode/commands/interface; ls .opencode/commands/design/` | no such directory; `chart.md diagram.md extract.md` | FALSE |
| 3 | P0 | `/create:diagram`, `sk-create-diagram` | `ls .opencode/commands/create/diagram.md .opencode/skills/sk-doc/sk-create-diagram` | both missing | FALSE |
| 4 | P0 | alignment deep-loop mode, eight ledger modes | `git log --oneline -S'deep-alignment'`; `ls .opencode/commands/deep/` | `8849444aa61 refactor(deep-loop): remove deep-alignment mode and conformance-benchmark`; six command files | FALSE |
| 5 | P0 | sk-prompt two-mode hub; `/prompt-improve` | `ls .opencode/skills/sk-prompt/mode-registry.json; ls .opencode/commands/prompt/` | no registry; `improve.md` only | FALSE |
| 6 | P0 | goals in every tool | `ls .opencode/hooks/goal/` | `cursor opencode pi` (+ bin, lib, docs) | FALSE |
| 7 | P1 | seven hubs | `ls .opencode/skills/*/mode-registry.json \| wc -l` | 6 | STALE |
| 8 | P1 | `MK_HOOKS_DISABLED`; `<skill>/{NNNN}-{slug}` grammar | `rg -l MK_HOOKS_DISABLED .opencode/hooks`; `rg -n 'worktrees/' sk-git/SKILL.md`; `rg -n is_valid_branch scripts/worktree-naming.sh` | 2 files, both the alias (`hook-flags.cjs:28`, 24 files use `SYSTEM_HOOKS_DISABLED`); grammar `worktrees/{NNN}-{slug}` at SKILL.md:359; validator at line 111 | STALE |
| 9 | P1 | `/doc:quality` alias | `ls .opencode/commands/doc` | no such directory | FALSE |
| 10 | P1 | sk-code = webflow + opencode surfaces | registry length | 6 modes | STALE |
| 11 | P1 | mcp-tooling roster | registry length | 9 modes | STALE |
| 12 | P1 | `pi-subagents` directive | `rg -il pi-subagents cli-pi .pi` (excluding changelog/playbook) | 0 | STALE |
| 13 | P1 | phase map ends at 29 | parent `spec.md` rows | 34 rows after commit `d1f75a15f6` | STALE |
| 14 | P2 | templates 1,314 lines; ~96 symlinks; 20 concern dirs | `cat templates/core/*.tmpl \| wc -l`; `find .opencode/hooks -type l \| wc -l`; `ls -d .opencode/hooks/*/ \| wc -l` | 1275; 102; 22 | STALE |
| 15 | P2 | Level-1 research doc 175 lines | `wc -l templates/addons/research.md.tmpl` + IF-level markers | 946-line gated source | TRUE (gated) |
| 16 | P2 | benchmark exits 3 on blocks | `rg -n 'return 3' run-skill-benchmark.cjs` | lines 691-694, four BLOCKED-BY-* verdicts | TRUE |
| 17 | P2 | Codex starts the advisor on the ABI-matching Node | `sed -n 1,9p .codex/config.toml` | node pinned to `/opt/homebrew/bin/node` for the better-sqlite3 ABI | TRUE |

Counts reproduced for the inventory: 37 command files, 12 agents, 15 workflows, 40 validation registry entries over 34 rule files, sk-doc 14 / sk-design 4 / cli 6 / deep-loop 6 modes.

---

## 2. DROPPED LANE FINDINGS

| Lane finding | Command | Observed | Why dropped |
|---|---|---|---|
| deepseek + luna: `cli-claude-code` is reserved but unwired (`ExecutorNotWiredError`) | `rg -n "LINEAGE_COMMAND_ADAPTERS" -A9 fanout-run.cjs`; `rg -n ExecutorNotWiredError runtime` | adapter `'cli-claude-code': buildClaudeLineageCommand` at line 2378; the error class is defined at `executor-config.ts:400` and never instantiated | The draft's six-executor claim is TRUE |
| deepseek: GitKraken MCP has zero references | `rg -c -i gitkraken sk-git/SKILL.md; ls sk-git/references` | 8 lines; `gitkraken-mcp-integration.md` | The draft's claim is TRUE |
| deepseek: 39 validation rules | `python3 -c "len(json.load(open('validator-registry.json')))"` | 40 | Files were counted, not rules |

---

## 3. NOT REPRODUCED, LEFT OPEN FOR THE REWRITE

- The draft's numeric measurements (template byte-identity, design corpus 129 MB / 7,744 files, router 13/13 and 44→71 benchmarks, mass-delete threshold, Refero counts): not re-measured; the rewrite should drop or re-measure them.
- The advisor's residual `.advisor-state` leak from inside a spec folder: structural containment is in code, the leak itself was not exercised.
- The ABI number 141: the Node pin is confirmed; the module version was not read from the built addon.
