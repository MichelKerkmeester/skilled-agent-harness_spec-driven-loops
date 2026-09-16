---
title: "Deep Research: Per-Runtime Reference Map [system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/research]"
description: "Reconciled, row-level map of every symlink, runtime file and tracked reference that a .opencode to .skilled source-root move touches, classified per runtime and per area, merged from two model families and settled against the tree."
trigger_phrases:
  - "skilled reference map findings"
  - "per runtime symlink map"
  - "stale opencode references map"
  - "reconciled migration map"
importance_tier: "important"
contextType: "research"
---
# Per-Runtime Reference Map: Merged Findings

## 1. Executive Summary

The complete map exists, one row per link and per file, in four tab-separated files under `maps/`. It covers 435 symlinks, 231 runtime configuration files, 36 home-level paths and 4,029 other tracked files. That is every tracked file outside `specs/` that names `.opencode` — 4,260 in all, two more than the seed inventory held (§7).

Most of the move is mechanical, but the rows that are not decide how it has to be done:

- **Links.** 168 of the 435 are produced by one generator, `sync-runtime-mirrors.cjs`, so they are retargeted by changing its inputs and re-running it rather than by editing links. 266 are hand-made, including every `.pi` link, both `.hermes` links and `.claude/skills`. 203 of the 208 links inside `.opencode/` need no change at all, because link and target move together. [SOURCE: maps/map-a-symlinks.tsv]
- **Runtime files.** 198 of the 231 are generator output: prompts, agents, copied Hermes skills, hook registrations and Gate 1 pointer blocks. Editing them by hand either gets overwritten or fails the mirror-parity check. [SOURCE: maps/map-b-runtime-files.tsv] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:144-157]
- **Everything else.** 2,938 references are plain path rewrites and 968 are historical records that must not be rewritten. 98 need a decision, led by the files that define what `.opencode` means and the 19 CI workflows that scope on it. 25 are generated and have to be rebuilt, including a tracked SQLite database that no text rewrite should touch. [SOURCE: maps/map-c-references.tsv]
- **Outside the repository.** The only hard blockers in the whole map are the seven global git hooks, which are absolute symlinks into the main checkout. [SOURCE: maps/map-b-home.tsv]

## 2. How To Use The Maps

| File | One row per | Key columns |
|---|---|---|
| `maps/map-a-symlinks.tsv` | symlink | `root`, `link`, `raw_target`, `dangling`, `origin`, `class`, `target_if_opencode_compat_kept`, `target_if_no_compat` |
| `maps/map-b-runtime-files.tsv` | non-symlink file under a runtime root | `area`, `path`, `hit_lines`, `what_it_is`, `origin`, `needed_change`, `class` |
| `maps/map-b-home.tsv` | home-level path | `path`, `is_symlink`, `link_target`, `opencode_occurrences`, `class` |
| `maps/map-c-references.tsv` | other tracked file | `area`, `subarea`, `path`, `hit_lines`, `md_fenced_lines`, `md_inline_lines`, `what_it_is`, `origin`, `needed_change`, `class` |

Every row carries `class_basis`, which says why the class is trustworthy: `both-lanes` (two model families agreed), `swe2 only` (only one lane mapped the row individually), or `rule:<name>` (the lanes disagreed and the tree settled it, §5). `reconciliation.json` holds the counts behind every table here.

The classes mean what the brief defined. `mechanical`: a scripted rewrite or retarget handles it. `regenerate`: a named command produces it, so rebuild it. `manual`: someone has to decide. `freeze`: a historical record that must not be rewritten. `none`: needs no change. `blocker`: cannot be done as proposed. Where a link's target depends on whether a compatibility `.opencode` survives, the two target columns give both answers; phase 003 chooses the layout.

`hit_lines` counts matching lines, not occurrences. For markdown the count is split between lines inside code fences, which are usually runnable instructions, and inline prose.

## 3. Map A — Symlinks

| Root | Rows | `mechanical` | `regenerate` | `manual` | `freeze` | `none` |
|---|---:|---:|---:|---:|---:|---:|
| `.claude` | 57 | 2 | 54 |  |  | 1 |
| `.codex` | 19 | 1 | 18 |  |  |  |
| `.cursor` | 65 | 2 | 51 |  |  | 12 |
| `.devin` | 34 | 1 | 21 |  |  | 12 |
| `.hermes` | 2 | 2 |  |  |  |  |
| `.pi` | 19 | 19 |  |  |  |  |
| `.opencode` | 208 |  | 2 | 3 |  | 203 |
| `specs` | 29 |  |  |  | 7 | 22 |
| `root (CLAUDE.md, .mcp.json)` | 2 |  |  |  |  | 2 |
| **Total** | **435** | **27** | **146** | **3** | **7** | **252** |

- **`.claude`**: 54 links are `sync-runtime-mirrors.cjs` output (33 commands, 21 hooks). The whole-directory `skills` link and the testing-playbook link are hand-made. `.utcp_config.json` does not name `.opencode`.
- **`.codex`**: 18 generated hook links and one hand-made playbook link.
- **`.cursor` and `.devin`**: 12 agent mirrors in each point at `.claude/agents`, which does not move, so they need no change. The remaining mirrors are generated.
- **`.hermes`**: `agents` and the playbook link are hand-made whole-directory links.
- **`.pi`**: all 19 are hand-made. `sync-hook-registrations.cjs` verifies the extension links against the hook registry but does not create them.
- **Inside `.opencode/`**: 203 links need no change. Four are already broken today, independent of any move: `changelog/sk-design-md-generator`, `changelog/sk-doc/create-diagram` and `skills/sk-doc/scripts/validate-flowchart.sh` need a retire-or-restore decision, and `plugins/sk-vision.js` points at an unbuilt `dist/`. `.opencode/specs -> ../specs` is layout-dependent (§5).
- **`specs/`**: 22 links do not touch `.opencode`. 7 sit inside past-run records and are frozen.

## 4. Map B — Runtime Files And Home-Level Configuration

| Runtime | Rows | `mechanical` | `regenerate` | `manual` |
|---|---:|---:|---:|---:|
| `.claude` | 17 | 15 | 1 | 1 |
| `.codex` | 50 | 2 | 47 | 1 |
| `.cursor` | 7 | 4 | 2 | 1 |
| `.devin` | 4 | 2 | 1 | 1 |
| `.hermes` | 103 | 1 | 101 | 1 |
| `.pi` | 50 | 3 | 46 | 1 |
| **Total** | **231** | **27** | **198** | **6** |

**Generators.** Codex prompts and agents come from `sync-prompts.cjs` and `sync-agents.cjs`; Pi prompts and agents from `sync-prompts-pi.cjs` and `sync-agents-pi.cjs`; Hermes prompts and copied skills from `sync-prompts-hermes.cjs` and `sync-skills-hermes.cjs`. The `hooks` block of `.claude/settings.json` and the Codex and Devin hook files are rendered from `hook-registry.json` by `sync-hook-registrations.cjs`. The Gate 1 blocks in `.codex/AGENTS.md` and `.cursor/rules/skill-routing.md` come from `sync-gate1-pointers.cjs`, which copies them out of the root `AGENTS.md`. [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:144-157] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs:24-34]

**Authored files that need a hand edit.** The 12-file `.claude/agents` fork, `.hermes/plugins/repo-guards/__init__.py` (18 matching lines of path constants), the MCP registrations in each runtime, and the six `SYNC.md` manifests, which are `manual` because they describe the mirror contract and only change once the generators do.

| Scope | Rows | `manual` | `none` | `blocker` |
|---|---:|---:|---:|---:|
| `home-level configuration` | 36 | 6 | 23 | 7 |
| **Total** | **36** | **6** | **23** | **7** |

The seven `blocker` rows are the global git hooks under `~/.config/git/hooks/`. The six `manual` rows are `~/.codex/hooks.json` (18 command strings, reinstalled by `install-codex-hooks.mjs`), the `~/.codex/config.toml` trust entry, the `~/.hermes/config.yaml` launcher path, `~/.claude.json`, `~/.zshrc` and `~/.pi/agent/SYNC.md`. `~/.pi/agent/trust.json` names the checkout root rather than `.opencode`, so it survives the move. This map covers this machine only.

## 5. Map C — Skills, Code, Documentation, Root Files And CI

| Area | Rows | `mechanical` | `regenerate` | `manual` | `freeze` |
|---|---:|---:|---:|---:|---:|
| `skill:system-deep-loop` | 788 | 680 | 2 | 7 | 99 |
| `skill:cli-external-orchestration` | 756 | 285 | 1 |  | 470 |
| `skill:system-spec-kit` | 729 | 542 | 3 | 39 | 145 |
| `skill:system-skill-advisor` | 306 | 293 | 1 | 2 | 10 |
| `skill:sk-code` | 282 | 215 | 1 |  | 66 |
| `skill:sk-doc` | 281 | 242 | 1 |  | 38 |
| `skill:mcp-tooling` | 185 | 152 | 1 |  | 32 |
| `opencode:commands` | 148 | 142 | 4 | 2 |  |
| `skill:sk-design` | 108 | 75 | 1 | 1 | 31 |
| `skill:sk-vision` | 68 | 34 | 1 |  | 33 |
| `skill:sk-git` | 60 | 48 | 1 |  | 11 |
| `skill:sk-prompt` | 55 | 32 | 1 |  | 22 |
| `opencode:hooks` | 54 | 50 |  | 4 |  |
| `skill:mcp-code-mode` | 43 | 33 | 1 |  | 9 |
| `skill:sk-communication` | 33 | 30 | 1 |  | 2 |
| `opencode:plugins` | 30 | 30 |  |  |  |
| `opencode:bin` | 29 | 21 | 1 | 7 |  |
| `opencode:scripts` | 25 | 11 |  | 14 |  |
| `ci` | 21 | 2 |  | 19 |  |
| `opencode:agents` | 13 | 13 |  |  |  |
| `root` | 8 | 5 |  | 3 |  |
| `opencode:skills` | 3 | 1 | 2 |  |  |
| `opencode:install-guides` | 2 | 2 |  |  |  |
| `opencode:logs` | 1 |  | 1 |  |  |
| `opencode:package-lock.json` | 1 |  | 1 |  |  |
| **Total** | **4029** | **2938** | **25** | **98** | **968** |

**The rows that need a decision.** These define what `.opencode` means, so a blind rewrite either changes behaviour or silently disables a check:

- **Root discovery**: `system-spec-kit/shared/workspace/repo-root.mjs`, the spec-root resolver, migration and write-guard files under `runtime/cli/core/`, `folder-detector.ts`, `path-utils.ts`, `workspace-identity.ts`, and the advisor's `runtime/lib/utils/workspace-root.ts`.
- **Git hook contract**: the seven hooks under `.opencode/scripts/git-hooks/`, their installers, and the per-runtime `check-git-hooks.sh` adapters. All execute `$REPO_ROOT/.opencode/...` and fail open when the directory is absent.
- **Gates**: `check-contract-drift.cjs`, `check-agent-mirror-sync.cjs` and its verify library.
- **Installers and launchers**: `install-codex-hooks.mjs`, `worktree-session.sh`, `relink-local-specs.sh`, `mcp-code-mode-launcher.cjs`, and `check-no-spec-imports.cjs`, which defines the existing `.opencode/specs` compatibility contract.
- **Root contracts**: `AGENTS.md`, `PUBLIC-RELEASE.md` (a promise to consumer projects) and `opencode.json`.
- **CI**: 19 workflows whose path filters and missing-guard skips key on `.opencode`.
- **Recorded fixtures** (judgment, §6): 35 golden or recorded test fixtures, such as `golden-queries.json`, the retrieval latency and daemon-off proofs, and the session-stop replay. They are rewritten only together with the assertion that reads them.

**Regenerate.** The 13 skill-root `graph-metadata.json` files (`regenerate-skill-derived.cjs`), `system-spec-kit/runtime/data/trigger-index.json` (1,809 matching lines, `generate-trigger-index.mjs`), `bin/lib/compiled-routing/serving-closure.manifest.json` (`compiled-route-sync.cjs`, which records `runtimeRoot: .opencode/bin/lib/compiled-routing`), the compiled deep-loop contracts (`compile-command-contracts.cjs`), and `system-deep-loop/runtime/database/council-graph.sqlite`. That last one is a tracked SQLite database, and the command that rebuilds it is not yet identified (§8). [SOURCE: .opencode/bin/compiled-route-sync.cjs:196] [SOURCE: .opencode/bin/lib/compiled-routing/serving-closure.manifest.json:4]

**Freeze.** Per-skill `changelog/**`, `benchmark/reports/**` and dated run directories, and the grader's content-addressed scorer cache. Rewriting them would falsify records of runs that happened at the old path.

**Mechanical.** Everything else: documentation in fenced instructions and inline prose, path constants built as `join(REPO_ROOT, '.opencode', ...)` across the runtimes and tools, templates, tests and command assets. `mode-registry.json` and `command-metadata.json` are in this class: they are hand-kept copies, and `command-catalog-mirror-check.cjs` states it guards them rather than generating them. [SOURCE: .opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs:4-19]

## 6. How The Two Lanes Were Reconciled

Two lanes from different model families mapped the same seed:

- **`swe2`** (cli-devin, `swe-2-max`): 10 iterations in 69 minutes, stopping at the cap under a convergence policy. It mapped every one of the 4,729 seed rows individually. [SOURCE: lineages/swe2/convergence-report.md]
- **`deepseek-pi`** (cli-pi, `deepseek-v4.1-flash` through the LLM Gateway, thinking `max`): 10 iterations in 14 minutes, reaching the 0.05 convergence threshold on its final iteration. It mapped links, runtime files and code individually (1,881 rows) and grouped documentation by class. [SOURCE: lineages/deepseek-pi/convergence-report.md]

Both lanes built their tables with scripts that apply classification rules over the seed files. That is legitimate, but it means a wrong rule mislabels a whole class of rows at once, so the reconciliation compared the lanes rule against rule, not only row against row.

On the 1,877 rows both lanes mapped individually, they agreed on 1,530 (81.5%). Every one of the 347 disagreements was settled by reading the tree, never by averaging. Each settlement is a named rule, and each row records the rule that decided it:

| Rule | Rows | Settled as | Evidence |
|---|---:|---|---|
| `internal-relative-link` | 201 | `none` (swe2) | deepseek-pi's own rows list both required targets as unchanged, yet classed them `mechanical` |
| `contract-or-ci` | 56 | `manual` (swe2) | `repo-root.mjs:26-45` keys root discovery on `.opencode`; the launcher and `opencode.json` define the namespace; CI skips silently on a stale guard path |
| `generated` | 18 | `regenerate` (deepseek-pi, plus two both lanes missed) | writers verified in `sync-gate1-pointers.cjs`, `compiled-route-sync.cjs:196` and the skill-derived generator; the compiled-routing manifest and the SQLite database were missed by both lanes |
| `recorded-fixture` | 35 | `manual` (deepseek-pi) | **Judgment, not fact**: recorded outputs that tests compare against |
| `specs-link-needs-no-change` | 22 | `none` (swe2) | `specs/` is outside the move and these links do not resolve into `.opencode` |
| `fixture-not-generated` | 5 | `mechanical` (swe2) | the skill-derived generator never reads test fixtures |
| `hand-kept-registry` | 5 | `mechanical` (swe2) | `command-catalog-mirror-check.cjs:15-19` says generating these copies was considered and rejected |
| `false-freeze` | 2 | `mechanical` (deepseek-pi) | a test and its README under `tests/cache/`, frozen by swe2's `cache` pattern |
| `dist-link-travels-intact` | 2 | `none` (swe2) | `runtime/cli/runtime -> ../dist` and `runtime/shared -> ../shared/dist` move with their targets |
| smaller single rows | 4 | mixed | root-keyed Pi trust entry `none`; crash log `none`; benchmark input definitions `mechanical`; `.opencode/specs` layout-dependent |

The table totals 350 rows rather than 347 because three of its rows were corrected where the lanes had not disagreed: the compiled-routing manifest and the SQLite database, which both lanes missed, and a README under `tests/cache/` that only swe2 mapped. No disagreement is left unresolved. The rules are applied by `../scratch/build-reconciled-map.py`, so the maps can be rebuilt from the lanes and the seed.

## 7. Corrections Ledger

- **The seed inventory missed two files.** It used `git grep -I`, which skips files git detects as binary. That hid `sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` (2 matching lines), which deepseek-pi found, and `system-deep-loop/runtime/database/council-graph.sqlite` (18), which neither lane found. The true total is 4,260 tracked files, not 4,258.
- **swe2 classed generated files as hand-editable.** The trigger index, 13 skill `graph-metadata.json` files and the compiled-routing manifest were `mechanical` in its tables. Its synthesis also listed the hook registration files as `mechanical` while its own detailed tables said `regenerate`, and two of its summary figures (3,315 mechanical, 985 freeze) did not match its tables (3,041 and 978).
- **deepseek-pi reduced contract files to plain rewrites.** It also marked 201 unchanged internal links `mechanical`, called two hand-kept registries and five test-fixture metadata files generated, and treated two build-output links as needing regeneration.
- **Both lanes missed the compiled-routing manifest,** which `compiled-route-sync.cjs` writes.
- **Two manifest claims are stale.** `.claude/SYNC.md:28-29` lists `.claude/specs` and `.claude/changelog` as whole-directory symlinks, and neither exists in the worktree or the main checkout. `.cursor/SYNC.md:36` calls `.cursor/mcp.json` a symlink; it is a regular file in both.

## 8. Open Questions

- **Can each runtime be pointed at a root other than its own directory name?** Settle with each CLI's loader documentation or source. This decides whether a compatibility `.opencode` is avoidable.
- **Do opencode's plugin glob, Devin's skill scan and Pi's extension imports follow a symlinked directory?** Settle with one probe per runtime in a scratch checkout.
- **Does git fail or skip on a dangling hook under `core.hooksPath`?** Settle with a one-line probe in a scratch repository.
- **With `.opencode` as a link, do gate scripts run while their staged-path filters miss `.skilled` changes?** Settle with a probe commit in a disposable checkout.
- **Which command rebuilds `council-graph.sqlite`, and are its stored paths regenerated or migrated?** Settle by reading the deep-loop council graph writer.
- **Do the spec-kit tests assert absolute paths or path fragments?** Settle by reading the assertions next to the 35 recorded fixtures.
- **Does anything outside this machine bootstrap the hand-made whole-directory links?** Settle with a search of shell profiles and bootstrap repositories on each machine.
- **What untracked or ignored files name `.opencode` at move time,** such as `dist/` trees, logs and `.state`? Settle with an unrestricted search at cutover.

## 9. Lane Status

- **swe2**: 10 of 10 iterations, synthesis written, accepted by the runner. Its per-row tables are the base for every row here.
- **deepseek-pi**: 10 of 10 iterations, converged at 0.05 on the final iteration, accepted by the runner. It is the second lens on 1,881 rows.
- **Scope**: neither lane wrote outside its lineage directory. The runner recorded no containment events, and the worktree's changed files match the state before launch.

## 10. References

- Reconciled maps: `maps/map-a-symlinks.tsv`, `maps/map-b-runtime-files.tsv`, `maps/map-b-home.tsv`, `maps/map-c-references.tsv`, `maps/reconciliation.json`
- Lane syntheses: `lineages/swe2/research.md`, `lineages/deepseek-pi/research.md`
- Lane per-row tables: `lineages/swe2/working/`, `lineages/deepseek-pi/working/`
- Seed inventory and its generator: `../scratch/seed-inventory/`, `../scratch/build-seed-inventory.py`
- Reconciliation script: `../scratch/build-reconciled-map.py`
- Frozen brief: `../scratch/topic.txt`
- Phase 001 findings: `../../001-deep-research/research/research.md`
