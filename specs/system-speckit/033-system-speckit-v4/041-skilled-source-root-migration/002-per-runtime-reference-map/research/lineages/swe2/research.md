# Per-Runtime Reference Map — `.opencode` → `.skilled` source-root migration

**Lineage:** `swe2` · **Session:** `fanout-swe2-1789561902822-scse4p` · **Executor:** cli-devin (swe-2-max) · **Stop:** convergence at run 10/10

The proposal: move the real files of the shared AI asset library `.opencode/` → `.skilled/`; every runtime directory (`.opencode/` included) becomes a consumer that links into `.skilled/`. This document is the complete working map: every symlink, every runtime file, and every other tracked reference that names `.opencode`, cited and classified. **No cutover order is proposed** — sequencing is phase 003.

## Coverage proof

Seed inventory (`scratch/seed-inventory/`): 435 symlinks + 4,258 tracked files naming `.opencode` + 36 home-level candidate paths = **4,729 rows**.

| map | rows mapped | seed | status |
|---|---|---|---|
| A — symlinks | 435 | 435 | exact ✓ |
| B — runtime files | 231 | 231 | exact ✓ |
| B — home-level | 36 | 36 | exact ✓ |
| C — all other tracked refs | 4,027 | 4,027 | exact ✓ (231 `runtime:*` seed rows are Map B's; zero B∩C overlap) |
| **total** | **4,729** | **4,729** | **closure verified by `working/verify_coverage.py`** |

Classification totals across all maps: `mechanical` 3,041 · `regenerate` 351 · `freeze` 978 · `none` 274 · `manual` 78 · `blocker` 7 · UNKNOWN 7 (ledger below — claims, not rows).

Full per-row tables: iterations 1–3 (Map A), 4 (Map B), 5–9 (Map C); canonical regenerated tables in `working/map-{a,b,c}-*.md`.

---

# MAP A — symlinks (435/435)

Every link's raw target, `.opencode`-resolution, required post-move target (both compat-branches), origin, and class are in `working/map-a-iter{1,2,3*}.md` + `iterations/iteration-00{1,2,3}.md`.

## Reconciliation by section

| section | seed | mapped | none | mechanical | regenerate | manual | freeze |
|---|---|---|---|---|---|---|---|
| `.claude` | 57 | 57 ✓ | 1 | 2 | 54 | — | — |
| `.codex` | 19 | 19 ✓ | — | 1 | 18 | — | — |
| `.cursor` | 65 | 65 ✓ | 12 | 2 | 51 | — | — |
| `.devin` | 34 | 34 ✓ | 12 | 1 | 21 | — | — |
| `.hermes` | 2 | 2 ✓ | — | 2 | — | — | — |
| `.pi` | 19 | 19 ✓ | — | 19 | — | — | — |
| `.opencode` internal | 208 | 208 ✓ | 203 | — | 2 | 3 | — |
| root (`CLAUDE.md`, `.mcp.json`) | 2 | 2 ✓ | 2 | — | — | — | — |
| `specs/` | 29 | 29 ✓ | 22 | — | — | — | 7 |
| **total** | **435** | **435** | **252** | **27** | **146** | **3** | **7** |

`none` dominates because 203 internal `.opencode` links use relative targets that never spell `.opencode` — they move intact inside the renamed tree. `regenerate` = mirror links owned by `sync-runtime-mirrors.cjs` (+2 generated internal links). `mechanical` = hand-made links needing a one-line retarget (all `.pi`, both `.hermes`, scattered `.claude/.codex/.cursor/.devin`).

## Section findings

- **`.claude` (57):** 54 `regenerate` — 33 command links + 21 hook links owned by `sync-runtime-mirrors.cjs` (cited via `.claude/SYNC.md`); 2 `mechanical` (hand-made `skills -> ../.opencode/skills` whole-dir + `manual-testing-playbook`); 1 `none` (`.utcp_config.json` — relative target, no `.opencode` in it). Whole-dir `skills` link: post-move `../.skilled/skills` direct, or unchanged `../.opencode/skills` under compat — both answers in the table. **Divergence U1:** manifest lists `.claude/specs` + `.claude/changelog`, absent in this worktree.
- **`.codex` (19):** 18 `regenerate` (hook-mirror links, `sync-runtime-mirrors.cjs`) + 1 `mechanical` (hand-made playbook). Agent TOMLs/prompt files are *real files* → Map B.
- **`.cursor` (65):** 51 `regenerate` (agent+command+hook mirrors) + 2 `mechanical` (`rules/sk-vision.md` + hand-made) + 12 `none` (relative targets). **Divergence U2:** `.cursor/SYNC.md` calls `.cursor/mcp.json` a symlink; live file is regular → Map B row.
- **`.devin` (34):** 21 `regenerate` (nested agent/skill/hook mirrors) + 1 `mechanical` + 12 `none` (relative-target mirrors).
- **`.hermes` (2):** `agents -> ../.opencode/agents` + `manual-testing-playbook` — hand-made whole-dir links, no generator → `mechanical` retarget (post-move `../.skilled/agents` direct, or unchanged under compat).
- **`.pi` (19):** all 19 `mechanical` — `skills -> ../.opencode/skills` whole-dir + `extensions/` links; `sync-hook-registrations.cjs` *verifies* them against `hook-registry.json` but does not generate them (hand-made).
- **`.opencode` internal (208):** **zero raw targets spell `.opencode`** — 203 relative links move intact → `none`. `regenerate`: `.opencode/specs -> ../specs` (created by `spec-root-migration.ts`; under compat the *new* `.opencode/` re-creates it there — link resolves outward, not into `.opencode`) and `plugins/sk-vision.js -> ../skills/sk-vision/vision-runtime/dist/plugin.js` (dangling build-artifact link). `manual`: 3 dangling hand-made links (`changelog/sk-design-md-generator`, `changelog/sk-doc/create-diagram`, `skills/sk-doc/scripts/validate-flowchart.sh`) — already broken today; each needs a retarget-or-remove decision.
- **root (2):** `CLAUDE.md -> AGENTS.md` and `.mcp.json -> .claude/mcp.json` — neither names `.opencode` → `none`.
- **`specs/` (29):** 22 `none` (relative spec-internal links); 7 `freeze` — lineage/archive fixture links baked into past-run records (`z_archive/022-hybrid-rag-fusion/*`, `038-goal-unification` review scratch, `sk-git/028` lineage fixture) — rewriting falsifies the record.

## Map A decision rows

| link | raw target | class | why |
|---|---|---|---|
| `.opencode/specs` | `../specs` | regenerate | created by `spec-root-migration.ts` — the precedent compat link; under a root-level `.opencode/` compat layer it must be re-created there |
| `.opencode/plugins/sk-vision.js` | `../skills/sk-vision/vision-runtime/dist/plugin.js` | regenerate | dangling build-artifact link — rebuilds with `bun run build` |
| `.opencode/changelog/sk-design-md-generator` | `../skills/sk-design-md-generator/changelog` | manual | dangling today; retarget-or-remove decision |
| `.opencode/changelog/sk-doc/create-diagram` | `../../skills/sk-doc/sk-create-diagram/changelog` | manual | dangling today; retarget-or-remove |
| `.opencode/skills/sk-doc/scripts/validate-flowchart.sh` | `../sk-create-diagram/scripts/validate-flowchart.sh` | manual | dangling today; retarget-or-remove |
| `.hermes/agents`, `.pi/skills`, `.claude/skills` whole-dir links | `../.opencode/{agents,skills}` | mechanical | hand-made; post-move `../.skilled/…` direct, or unchanged under compat |
| 7 `specs/…` archive/lineage fixture links | mixed | freeze | records inside past-run artifacts — rewriting falsifies them |

---

# MAP B — runtime files + home-level (231 + 36)

Per-file tables: `working/map-b-{claude,codex,cursor,devin,hermes,pi,home}.md`; `iterations/iteration-004.md`.

## Reconciliation

| runtime | seed files | mapped | regenerate | mechanical | manual | none | freeze | blocker |
|---|---|---|---|---|---|---|---|---|
| `.claude` | 17 | 17 ✓ | 1 | 15 | 1 (SYNC.md) | — | — | — |
| `.codex` | 50 | 50 ✓ | 46 (sync-agents/sync-prompts/gate1) | 3 | 1 (SYNC.md) | — | — | — |
| `.cursor` | 7 | 7 ✓ | 1 | 5 | 1 (SYNC.md) | — | — | — |
| `.devin` | 4 | 4 ✓ | 1 | 2 | 1 (SYNC.md) | — | — | — |
| `.hermes` | 103 | 103 ✓ | 101 (copied skills/prompts) | 1 | 1 (SYNC.md) | — | — | — |
| `.pi` | 50 | 50 ✓ | 46 (sync-agents-pi/sync-prompts-pi) | 3 | 1 (SYNC.md) | — | — | — |
| home | 36 | 36 ✓ | — | — | 6 | 22 | 1 | 7 |

## Load-bearing authored rows

| file | lines | behavior | class |
|---|---|---|---|
| `.claude/settings.json` | hook registrations | executes `.opencode/hooks/*`, `.opencode/skills/*` commands | mechanical (rewrite paths; or compat absorbs) |
| `.codex/hooks.json` | hook registrations | executes `.opencode/bin/*`, `.opencode/skills/*` | mechanical |
| `.cursor/hooks.json` | hook registrations | same | mechanical |
| `.devin` hook/plugin code | `REPO_ROOT / ".opencode" / …` | `Path` construction | mechanical |
| `.hermes/plugins/repo-guards/__init__.py` | many constants | hardcodes `.opencode` hook/advisor paths | manual-adjacent mechanical — authored runtime code |
| `.codex/AGENTS.md` Gate-1 block | :41 | generated by `sync-gate1-pointers.cjs` | regenerate |
| all `*/SYNC.md` manifests (6) | mirror tables | generated manifests describing the mirror contract | manual — regenerate after the mirror generator retargets |

## Home-level

- **`blocker` (7):** `~/.config/git/hooks/{commit-msg,post-commit,post-merge,post-rewrite,pre-commit,pre-push,prepare-commit-msg}` — *absolute symlinks* into the main checkout's `.opencode/scripts/git-hooks/`. Not Git-managed; nothing in the repo can rewrite them → each machine must re-run `install-git-hooks.sh` (or keep compat). **This is the only `blocker` class in the whole map.**
- **`manual` (6):** `~/.codex/hooks.json` (installed by `install-codex-hooks.mjs`), `~/.codex/config.toml`, `~/.hermes/config.yaml`, `~/.claude.json`, `~/.zshrc`, `~/.pi/agent/SYNC.md` — live external config naming `.opencode`; machine-local updates.
- **`none` (23):** home files that exist but carry no live `.opencode` dependency (backups, caches, auth, settings w/o path refs) + the 1 missing candidate path.

---

# MAP C — all remaining `.opencode` references (4,027/4,027)

Per-area tables: `working/map-c--*.md`; `iterations/iteration-00{5..9}.md`.

## Reconciliation by area

| area | files | mech | freeze | manual | regen |
|---|---|---|---|---|---|
| skill:system-spec-kit | 729 | 570 | 145 | 13 | 1 |
| skill:system-deep-loop | 787 | 685 | 99 | 3 | — |
| skill:cli-external-orchestration | 756 | 286 | 470 | — | — |
| skill:system-skill-advisor | 306 | 293 | 12 | 1 | — |
| skill:sk-code | 282 | 216 | 66 | — | — |
| skill:sk-doc | 280 | 242 | 38 | — | — |
| skill:mcp-tooling | 185 | 153 | 32 | — | — |
| skill:sk-design | 108 | 77 | 31 | — | — |
| skill:sk-vision | 68 | 35 | 33 | — | — |
| skill:sk-git | 60 | 49 | 11 | — | — |
| skill:sk-prompt | 55 | 33 | 22 | — | — |
| skill:mcp-code-mode | 43 | 34 | 9 | — | — |
| skill:sk-communication | 33 | 31 | 2 | — | — |
| opencode:commands | 148 | 144 | — | — | 4 |
| opencode:hooks | 54 | 50 | — | 4 | — |
| opencode:plugins | 30 | 30 | — | — | — |
| opencode:bin | 29 | 23 | — | 6 | — |
| opencode:scripts | 25 | 11 | — | 14 | — |
| opencode:agents | 13 | 13 | — | — | — |
| opencode:skills | 3 | 1 | — | — | 2 |
| opencode:install-guides | 2 | 2 | — | — | — |
| opencode:logs | 1 | — | — | — | 1 |
| opencode:package-lock.json | 1 | — | — | — | 1 |
| root | 8 | 5 | — | 3 | — |
| ci | 21 | 2 | — | 19 | — |

Totals: `mechanical` 2,985 · `freeze` 970 · `manual` 63 · `regenerate` 9.

## The contract family (all `manual`, enumerated)

These decide what `.opencode` *means* — sentinels, gates, installers, the compat guard. A blind rename here is how the migration silently breaks.

**Root-identity / spec-root sentinel (13, spec-kit):** `shared/workspace/repo-root.mjs`; `runtime/cli/core/spec-root-{canonical-resolver,fixtures,migration,migration-manifest,write-guard}.ts`; `runtime/cli/spec-folder/folder-detector.ts`; `runtime/cli/utils/{path-utils,workspace-identity}.ts`; `runtime/cli/core/config.ts`; + 3 contract docs (`feature-catalog/…/canonical-first-spec-root-resolution.md`, `manual-testing-playbook/…/canonical-first-spec-root-resolution.md`, `runtime/cli/references/spec-root-alias-retirement-runbook.md`).

**Governance gates (deep-loop 3):** `runtime/scripts/check-contract-drift.cjs` (pattern-matches `.opencode` authority paths at :143,:148,:156,:165,:194,:236); `deep-improvement/scripts/check-agent-mirror-sync.cjs` + `scripts/lib/mirror-sync-verify.cjs` (self-disengaging mirror gate + verify lib).

**Advisor sentinel (1):** `system-skill-advisor/runtime/lib/utils/workspace-root.ts`.

**Git-hook contract (≈15):** `scripts/git-hooks/{pre-commit,pre-push,commit-msg,post-commit,post-merge,post-rewrite,prepare-commit-msg}` + `lib/autostash-orphan-guard.sh`; `hooks/git/pre-commit` (legacy shim: "installed Git hook is .opencode/scripts/git-hooks/pre-commit"); `hooks/git/install-hooks.sh`; `hooks/git-hooks-check/{claude,codex,cursor,devin}/check-git-hooks.sh`; `scripts/install-git-hooks.sh`; `bin/check-git-hooks.sh`. All exec `$REPO_ROOT/.opencode/…` and **fail open** when the dir is absent.

**Installers / external-state writers (4):** `bin/install-codex-hooks.mjs`, `bin/worktree-session.sh`, `bin/relink-local-specs.sh`, `bin/mcp-code-mode-launcher.cjs`; `scripts/check-vendored-fork-provenance.mjs`.

**Compat guard (1):** `bin/check-no-spec-imports.cjs` (:26 `specs/ is canonical; .opencode/specs is a compat symlink`) — the file that *defines* the compat contract.

**Machine-local config (2):** `scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` (:31 absolute path) + README.

**Root contracts (3):** `AGENTS.md` (Gate-1 + rules; rewrite + regenerate pointer blocks), `PUBLIC-RELEASE.md` (published external promise — rewriting changes what consumers were told), `opencode.json` (the runtime's own project namespace).

**CI (19 workflows):** all `manual` — path filters + missing-guard skips scope on `.opencode`; rename without filter update = silent skip. (`advisory-checks, agent-mirror-sync, changed-packet-validation, chart-corpus, command-tree-parity, comment-hygiene, diagram-corpus, dispatch-enforcement-guard, markdown-link-integrity, naming-standard-guard, playbook-operator-contract, prompt-card-sync, repo-rules-corpus, routing-registry-drift, rule-canary-sync, runtime-no-spec-import, skill-doc-frontmatter, spec-kit-check, strict-pass-freshness-report`.)

## Regenerate rows (9)

`commands/deep/assets/compiled/{deep-review,deep-ai-council,deep-research}.contract.md` + `compiled/README.md` (`compile-command-contracts.cjs`); `package-lock.json`; `logs/README.md`; `skills/.state/{advisor,smart-router-telemetry}/README.md`.

## Freeze bulk (970)

All `changelog/**` (per-skill history), all `benchmark/reports/**` + dated run dirs (per-skill + nested `cli-*/benchmark/reports/`), `deep-improvement/scripts/model-benchmark/scorer/cache/**` (content-addressed grader cache). Historical run records — never rewritten.

## Mechanical bulk (2,985)

Everything else: ~2,300 doc `md` (fenced runnable + inline prose), ~550 code constant-carriers (`join(REPO_ROOT,'.opencode',…)` path strings across spec-kit runtime CLI, advisor runtime, plugins, hooks, launchers, bin tools), fixtures, tests, templates, command YAML/txt/py/sh. Single rewrite rule + compat fallback covers all.

## Runnable vs prose (doc split)

Seed md columns distinguish fenced from inline hits: runnable instructions live in `manual-testing-playbook/**`, `feature-catalog/**`, SKILL/README fences; prose dominates `references/**`, ARCHITECTURE, changelogs. Every doc row's `file:line` citations + fenced/inline counts are in the working tables.

## Corrections ledger vs phase-001

1. `state-jsonl.md` documents `run`; `fanout-run.cjs` requires integer `iteration` — lineage records carry **both** (verified against validator).
2. `.claude/SYNC.md` lists `.claude/specs` + `.claude/changelog` — **absent in this worktree** (U1).
3. `.cursor/SYNC.md` describes `.cursor/mcp.json` as symlink — **live file is regular** (U2).
4. `.codex/AGENTS.md` word-`opencode` hits are runtime-name examples, not paths — only literal `.opencode` rows counted.
5. `templates/changelog/README.md` is a living template, not history → `mechanical`, not `freeze`.

---

# UNKNOWNs (residual)

| # | claim | settles it |
|---|---|---|
| U1 | `.claude/specs`,`.claude/changelog` manifest-listed but absent in worktree | inspect main checkout |
| U2 | `.cursor/mcp.json` regular file vs manifest's symlink claim | `ls -la` + git log main checkout |
| U3 | runtime discovery through dir symlinks into `.skilled/` (opencode glob, devin scan, cursor rules, codex prompts) | live probe per runtime — phase-001's open probe list |
| U4 | untracked/ignored files naming `.opencode` | unrestricted grep at move time |
| U5 | live `.opencode/logs` + `skills/.state` content at move time | `ls` at cutover; classified `regenerate` regardless |
| U6 | other machines' home state (`~/.codex/hooks.json`, git hooks, …) | per-machine audit — Map B covers this host only |
| U7 | `barter/` + stray ` specs/` pre-ruled-out by task statement | recorded for completeness |

---

# What an executor should know (no sequencing — phase 003)

- **Three semantic layers**, not one: (a) the `.opencode` *name* as repo-root sentinel (13-file contract family + 3 docs), (b) `.opencode` *paths* as string constants (3,315 mechanical + 351 regenerate rows), (c) `.opencode` *records* (985 freeze rows that must not change).
- The only `blocker`s are the 7 global git hooks — outside the repo entirely.
- `check-no-spec-imports.cjs` proves the repo already runs a compat-symlink contract (`.opencode/specs -> specs`) — the same shape the proposal needs at the root.
- ~190 mirror links are one generator (`sync-runtime-mirrors.cjs`) + `hook-registry.json` away from retargeting; ~196 generated runtime files regenerate the same way.
- Every self-disengaging gate (`comment-hygiene`, `agent-mirror-sync`, 19 CI workflows) will *pass silently* if `.opencode` vanishes unannounced — `manual` rows are the announcement list.
