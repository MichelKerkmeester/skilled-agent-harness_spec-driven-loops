---
title: "Runtime Surface Parity: commands, skills, agents, goal and hooks across seven runtimes"
session: fanout-deepseek-1789487610012-kymuxs
lineage: deepseek
spec_folder: specs/cli-external-orchestration/071-cli-hermes-creation/012-runtime-surface-parity-research
iterations_completed: 10
stop_reason: maxIterationsReached
---

# Runtime Surface Parity across Seven Runtimes

**Method.** Ten iterations, one angle each, per `research/deep-research-strategy.md`. Every claim is a
read file, a counted tree, or an observed command exit. Counts stated in the repo's own manifests were
re-derived rather than inherited; where they disagreed with the tree, the tree won and the disagreement
is recorded as a correction in §1. Per-iteration evidence lives in `iterations/iteration-001.md` …
`iteration-010.md` with machine-readable summaries in `deltas/`.

**Repository root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Runtimes:** `.opencode` (authored source), `.claude`, `.codex`, `.cursor`, `.pi`, `.hermes`, `.devin`.

---

## 1. Charter corrections

Five starting facts were re-derived. Three needed correction.

| # | Chartered | Verified | Evidence |
|---|---|---|---|
| 1 | `.opencode/commands` holds **46** authored command files | **35** authored commands. 46 is the raw `*.md` count; 11 are asset/contract/README files under `assets/` and `scripts/`. A third number, 39, survives in a stale comment at `command-catalog-mirror-check.cjs:17` | iteration 1; independently confirmed by `command-catalog-mirror-check.cjs` → "canonical: .opencode/commands frontmatter (35 commands)", 35/35 listed, exit 0 |
| 2 | Devin carries **zero** of the authored commands (framed as a gap) | zero **by operator directive**, not by omission. The retired mirror was `.devin/skills/<cmd>/SKILL.md` (35 entries), removed with a BREAKING CHANGE note; Devin's replacement affordance is native discovery of `.opencode/skills/*` as slash commands | `.devin/SYNC.md:20`; `git show --stat a2241041b0` |
| 3 | All seven runtimes carry an `agents/` directory | true, and the roster is **12** agents, not 13 — every manifest's "(13)" counts the source tree's `README.txt` | iteration 5 |
| 4 | Goal adapters exist for cursor, devin, opencode and pi | true, and the goal hub's per-runtime table **omits Hermes**, which has a working binding through the repo plugin | `.opencode/hooks/goal/README.md:71-84`; `.hermes/plugins/repo-guards/__init__.py:124,744,845` |
| 5 | Every dotfolder carries `SYNC.md` except `.opencode` | confirmed: six files, 741 lines | iteration 1 |

Three further manifest claims were falsified outright: that `hooks.json` / `hooks.v1.json` are
hand-authored and "no generator produces them" (`.codex/SYNC.md:120`, `.devin/SYNC.md:31,126`) — one
registry renders all four registration files; that `.cursor/mcp.json` is a symlink
(`.cursor/SYNC.md:36`) — it is a real file; and that the Cursor command mirror holds 36 entries
(`.cursor/SYNC.md:32`) — it holds 35.

**A pattern worth naming:** the failures cluster in *prose about counts and mechanisms*, not in the
mirrors themselves. Eight such drifts were found, and every one of them was written down by a
maintainer who had the right count at the time.

---

## 2. Deliverable 1 — The command matrix

35 authored commands in `.opencode/commands` (families: `create` 12, `speckit` 6, `deep` 5,
`doctor` 3, `design` 3, `rewrite` 2, `prompt` 1, root 3 — `agent-router`, `goal-opencode`, `vision`).

| Authored entry | `.claude/commands` | `.codex/prompts` | `.cursor/commands` | `.pi/prompts` | `.hermes/prompts` | `.devin` |
|---|---|---|---|---|---|---|
| 33 shared commands | present (symlink) | present (copy) | present (symlink) | present (copy) | present (copy) | **absent** |
| `goal-opencode.md` | excluded | excluded | renamed → `goal-cursor.md` (native) | renamed → `goal-pi.md` (native) | excluded | absent |
| `vision.md` | excluded | excluded | present (native, distinct file) | present (native, distinct file) | excluded | absent |
| **Total** | **33** | **33** | **35** | **35** | **33** | **0** |

### The rule that explains every exclusion

Two sets in `command-scope.cjs` account for every count difference; none of it is drift.

1. `CANONICAL_MIRROR_EXCLUDES = {goal-opencode.md, vision.md}`
   — canonical entries that must not be mirrored into any generated tree.
   [`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:21`]
   Arithmetic: 35 − 2 = **33** for Claude, Codex and Hermes.
2. `RUNTIME_NATIVE_COMMANDS = {'.cursor/commands': {goal-cursor.md, vision.md}, '.pi/prompts': {goal-pi.md, vision.md}}`
   — real, hand-authored entries a generator must never prune nor flag as drift.
   [`command-scope.cjs:27-30`]
   Arithmetic: 33 + 2 = **35** for Cursor and Pi.

The recorded reason is host asymmetry, not packaging taste: "each host reaches the feature differently:
OpenCode uses a plugin hook, Cursor and Devin use an MCP tool, and Pi uses a hidden extension tool.
Claude has no sk-vision integration." [`command-scope.cjs:8-12`]

`vision.md` is provably three distinct files (three MD5s across `.opencode`, `.cursor`, `.pi`), so the
per-host native rule is real and not a duplication artefact.

### Enumeration trap (carried into the method)

`.claude/commands` holds **33 symlinks and 0 regular files**; `.cursor/commands` holds 2 regular files
plus 33 symlinks. A `find -type f` census reports Claude as carrying zero commands. Every count in this
report uses `find`-total **plus** an explicit symlink count.

### Generators and `--check` modes

| Mirror | Generator | `--check` |
|---|---|---|
| `.claude/commands`, `.cursor/commands` (symlinks) | `runtime-mirrors/sync-runtime-mirrors.cjs` | yes |
| `.codex/prompts` (copies) | `codex/sync-prompts.cjs` | yes |
| `.hermes/prompts` (copies) | `hermes/sync-prompts-hermes.cjs` | **unwired** |
| `.pi/prompts` (copies) | `pi/sync-prompts-pi.cjs` | **unwired** |
| `.devin` (none) | — | — |

---

## 3. Deliverable 2 — The surface parity table

`present` = the runtime carries and loads it. `absent-correct` = the runtime cannot load it, cannot
reach it, or a recorded decision removed it. `absent-gap` = reachable, unclaimed, and drift-prone.

| Surface | opencode | claude | codex | cursor | pi | hermes | devin |
|---|---|---|---|---|---|---|---|
| **Commands / prompts** | present (native) | present (33 symlinks) | present (33 stubs) | present (35) | present (35) | present (33) | **absent-correct** — no loader; operator directive |
| **Skills** | present (source) | present (whole-dir symlink) | **absent-correct** — no skills loader in the surface inventory | **absent-correct** — Cursor's skills are user-level | present (whole-dir symlink) | present (68 generated copies; 61 loadable) | present (native discovery of `.opencode/skills/*`) |
| **Agents** | present (source) | present (body twin) | present (12 `.toml`, generated) | present (12 symlinks) | present (12 `.md`, generated) | present (whole-dir symlink) | present (12 nested symlinks) |
| **Goal** | present (native plugin) | present (host-native, unverified) | present (host-native, unverified) | present (injection only) | present (full + verify) | present (plugin section, undocumented) | present (injection only) |
| **Hooks** | present (13 adapters) | present (15) | present (12) | present (14) | present (12 + 1 bundle, hand-authored) | present (plugin bridge, 6 hook points) | present (16, richest event set) |
| **Skills mirror maintenance** | n/a | none needed | none needed | **absent-gap (small)** — `rules/skill-routing.md` lists 8 of 13 packets, no generator | none needed | `--check` unwired | none needed |

**Where the gaps actually are:** not in missing surfaces — every runtime has every surface it can load —
but in **maintenance coverage**: four unwired `--check` modes, one ungated generated agent tree (Pi), one
ungated hand-authored hook layer (Pi), one partial router list (Cursor), and seven Hermes skills that a
runtime-side scanner refuses to load.

### The goal row in detail

The hub's own bar: "A runtime is not called fully supported unless injection and management bind the
same native current-session identity." [`.opencode/hooks/goal/README.md:84`]

- **Full:** OpenCode (native plugin, `bind`/`resent`/`packet`, verifier), Pi (`input` + `session_start` +
  `turn_end`, `/goal-pi`, heuristic verify).
- **Injection only:** Cursor (`sessionStart`; management fails closed on missing native identity),
  Devin (`SessionStart` + `UserPromptSubmit`). Neither is read-only: both record a turn on the bound
  record.
- **Read-only projection:** Hermes (session-start prompt section, per-session goal then packet slice).
- **Native-equivalent, unverified in-repo:** Claude and Codex. Neither `.claude/settings.json` nor
  `.codex/hooks.json` carries a goal registration, so nothing repo-side would fail loudly if the host
  behaviour changed. The repo-side fallback that *is* wired: the speckit goal handover across
  `plan`/`resume`/`implement`/`complete` plus the always-on posture row at `AGENTS.md:185` /
  `CLAUDE.md:185`.

---

## 4. Deliverable 3 — The Devin boundary, with proof per row

| Repo surface | Devin | Proof |
|---|---|---|
| Agents (12) | **yes** — nested directory shape | `.devin/agents/<name>/AGENT.md` → `../../../.claude/agents/<name>.md`; 12/12 resolve, 0 broken |
| Hooks (8 events) | **yes** | `.devin/hooks.v1.json`; **21/21** invoked scripts have resolving symlinks in `.devin/hooks/`, 0 missing, 0 broken |
| MCP servers | **yes**, Devin-owned file | `.devin/mcp_config.json` (real file, `mcpServers.code_mode`) |
| Slash commands | **yes, skill-derived** | `devin --help`: `skills  Manage agent skills (slash commands and agent-triggered context blobs)` |
| Skills mirror | **not needed** | native discovery of `.opencode/skills/*`; no `.devin/skills/` authored |
| Mirrored commands | **no** | no loader in `devin --help`; removed by operator directive |
| Rules | **inherited**, no local dir | `devin rules list` → `skill-routing [Cursor] · CLAUDE · AGENTS · global_rules [Windsurf]` |
| Goal | **injection only** | `.devin/hooks.v1.json:33,55` |
| One-shot prompts | **yes** | `--prompt-file <FILE>`, `[PROMPT]...` after `--` |
| Vision | **yes** | `sk-vision-inject` binding; `.devin/hooks/sk-vision.mjs` |
| Permission modes | **yes — 8 values** | `normal`/`auto`, `accept-edits`, `smart`, `dangerous`/`yolo`/`bypass`, `autonomous`; `--help` prints only 4 |
| Subagents, plugins, cloud, ssh, acp | **yes** | `devin --help` subcommand list; `.devin/agents/<name>/AGENT.md` profiles |

**The shape rule**: a repo-authored surface reaches Devin only as (1) a nested symlink, (2) a generated
entry in a Devin-owned registry, (3) a `.devin/skills/<name>/SKILL.md` skill-shaped directory, or
(4) nothing at all (native discovery, inheritance, or the host's own file). Shape 3 is the mechanism if
the 35 commands should ever become Devin-reachable again — and the strict-YAML constraint applies to
every file in it.

**The one silent failure mode found anywhere in this research:** Devin drops an entire file whose
unquoted `description` contains a colon, with no warning; it has already hidden 12 of 36 files. There is
no strict-YAML gate. [`.devin/SYNC.md:67-74,128`]

Also recorded, honestly, in the manifest: `PermissionRequest` never fires under `--permission-mode bypass`
(the mode this repo dispatches with), so that adapter is inert; `PostCompaction` has never been observed
firing. `PreToolUse` still fires under bypass, so guard coverage is intact.

---

## 5. Deliverable 4 — Ranked recommendations

Scored by `(operator impact × confidence) / cost`, where impact is the reduction of *silent* failure risk
for a runtime user. Full detail and citations in `iterations/iteration-010.md` §1.

### Do now

| # | Action | Impact | Confidence | Cost |
|---|---|---|---|---|
| R1 | Wire the four unwired `--check` modes into `pre-commit` and `spec-kit-check.yml` (`pi/sync-agents-pi.cjs`, `pi/sync-prompts-pi.cjs`, `hermes/sync-prompts-hermes.cjs`, `hermes/sync-skills-hermes.cjs`) | high | high | low — list edit |
| R2 | Add `sync-gate1-pointers.cjs --check` to `pre-commit` (CI already runs it) | medium | high | trivial |
| R3 | Strict-YAML frontmatter parse gate over canonical agent/command files | high | high | low |
| R4 | Surface-coverage assertion table `(runtime × surface → mirror \| exemption)` | high | medium-high | low |
| R5 | Record the Devin command exemption beside the existing two in `command-scope.cjs` | medium | high | trivial |
| R6 | Correct the eight documentation drifts (`.codex/SYNC.md:120`, `.devin/SYNC.md:31,74,126`, `.cursor/SYNC.md:32,36`, three "(13)" agent counts, `command-catalog-mirror-check.cjs:17`) | medium | high | low |
| R7 | Add the Hermes row to `.opencode/hooks/goal/README.md` and `goal-plugin.md` | medium | high | trivial |

### Do next

| # | Action | Impact | Confidence | Cost |
|---|---|---|---|---|
| R8 | Extend `sync-gate1-pointers.cjs` to render the `.cursor/rules/skill-routing.md` packet list (5 of 13 unrouted; Devin reads the same file) | medium | medium | low-medium |
| R9 | MCP config generator for `.claude` / `.cursor` / `.devin` (3 byte-identical copies, no checker) | low-medium | medium | medium |
| R10 | Probe the Claude and Codex native goal commands on live hosts; scaffold the fallback only if they fail | medium | low until probed | low |
| R11 | Classify the seven Hermes-quarantined skills as rewrite-or-accept | low-medium | medium | unknown |
| R12 | Periodic manual review of Pi's hand-authored guard bridges | medium | medium | low per cycle |

### Do not

| # | Action | Why not |
|---|---|---|
| D1 | Mirror 35 commands into `.devin/commands/` | no loader; the retired mirror was skill-shaped and removed on directive |
| D2 | Add `.cursor/skills/` | Cursor's skills are user-level and Cursor-managed; R8 is the real gap |
| D3 | Mirror `vision.md` into Claude/Codex/Hermes | "Claude has no sk-vision integration"; host asymmetry is the recorded reason |
| D4 | Add goal adapters for Cursor/Devin management | Cursor's limit is a host identity limit; both adapters already write on injection |
| D5 | Write a `.codex/config.toml` generator | no clean single-key merge analogue for TOML + inline MCP |
| D6 | Automate semantic agent-body comparison | token-set equality already hid a real instruction change; the control is a reviewer |
| D7 | Add content gates for Cursor/Devin/Hermes agent trees | symlinks cannot drift; link resolution is already checked |

---

## 6. Deliverable 5 — Phase decomposition

| Phase | Scope (one line) | Dependencies | Gate that closes it |
|---|---|---|---|
| **P1 — Gate coverage close-out** | Make every working `--check` mode reachable by both gates, and make the two gate sets agree | none | Four generators exit 1 on induced drift / 0 on restore; pre-commit and CI lists provably identical |
| **P2 — Silent-failure guard** | Nothing canonical can be silently dropped by a stricter host parser | P1's wiring pattern (or independent) | Fixture with an unquoted colon-bearing `description` fails; quoted passes |
| **P3 — Surface-coverage assertion** | A whole surface cannot go missing without a recorded reason | P1 | Replaying the Devin case fails the assertion; an exemption entry makes it pass |
| **P4 — Documentation reconciliation** | Every manifest states the count and mechanism today's files actually have | none — run first if only one phase lands | Reviewer re-derives each corrected number from the tree |
| **P5 — Cursor routing completeness** | The routing rule Cursor and Devin both read lists every loadable packet | P4 | Adding a skill packet without regenerating fails `--check` |
| **P6 — Host-behaviour probes** | Replace unverifiable host claims with recorded probe outcomes | none; needs live hosts | Each claim is either reproduced or marked unverified with its confirming check |

**The dependency that matters is P1 → P3.** P4 is text-only and independent. P2 and P5 are the two
places where a phase could merge and lose nothing.

**Cost profile of the whole plan:** R1–R7 are list edits and text edits with no new mechanism. The only
genuinely new code worth writing is R3 (a strict frontmatter parse) and R4 (a table plus a walk), and the
pattern for both already exists in the repo — `agent-roster-mirror-check.cjs` for the coverage walk,
`command-scope.cjs` for the exemption registry.

---

## 7. What this lineage could not settle

| Open question | Confirming check |
|---|---|
| Claude's and Codex's native goal commands (operator-confirmed 2026-09-12, re-checkable only on a live host) | a live host probe |
| Codex having no skill loader (inferred from an absence assertion, `.codex/SYNC.md:36`) | enumerate Codex's own loader surfaces |
| Which 35 entries Devin's retired mirror held (the commit states a count) | list deleted paths in `a2241041b0`, diff against the current command tree |
| The measured per-commit cost of new checkers (R3/R4 cost estimated from the closest analogue) | write and time the checker |
| Devin's rules-inheritance and skill-discovery rows (quoted from `.devin/SYNC.md` and the cli-devin packet, not re-probed; only `devin --help`, `skills --help`, `version` were run) | re-run `devin rules list` / `devin skills list` |
| Hermes's post-iteration 3 quarantine figure (61 of 68 loadable, per `.hermes/SYNC.md:24` on 2026-09-15) | re-run `hermes skills list` |

---

## 8. Sources

**Authored source** `.opencode/commands/**` (35 commands), `.opencode/agents/*.md` (12),
`.opencode/skills/**` (56 `SKILL.md`), `.opencode/hooks/**` (20 concerns × per-runtime adapters).

**Generators** `runtime/cli/runtime-mirrors/{sync-runtime-mirrors,sync-hook-registrations,sync-gate1-pointers,command-scope}.cjs`,
`runtime/cli/codex/{sync-prompts,sync-agents,generate-command-routers}.cjs`,
`runtime/cli/pi/{sync-prompts-pi,sync-agents-pi}.cjs`,
`runtime/cli/hermes/{sync-prompts-hermes,sync-skills-hermes}.cjs`,
`deep-improvement/scripts/{check-agent-mirror-sync.cjs,lib/mirror-sync-verify.cjs}`.

**Diagnostics** `.opencode/commands/doctor/scripts/{agent-roster-mirror-check,command-catalog-mirror-check}.cjs`,
`.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml`.

**Gates** `.opencode/scripts/git-hooks/pre-commit`,
`.github/workflows/{spec-kit-check,agent-mirror-sync,command-tree-parity}.yml`
(+17 further workflows guarding quality rather than parity).

**Manifests** six `SYNC.md` files (741 lines total), `hook-registry.json`, `hook-flags.env`,
`.opencode/hooks/goal/{README.md,goal-plugin.md}`, `.hermes/plugins/repo-guards/__init__.py`.

**Runtimes** installed `devin` v3000.10.27 (`bcbe88c7`) via `--help`, `skills --help`, `version`;
read-only `git show --stat a2241041b0`.

**Commands run in this session** (all read-only): `find`/`ls`/`md5`/`diff`/`comm` censuses,
`git log`/`git show`, `node check-agent-mirror-sync.cjs --all` (exit 0),
`node command-catalog-mirror-check.cjs` (exit 0), and a `node -e` computation against the agent
gate's own exported functions. No generator was run in write mode; no file outside this lineage
directory was created, modified or deleted.
