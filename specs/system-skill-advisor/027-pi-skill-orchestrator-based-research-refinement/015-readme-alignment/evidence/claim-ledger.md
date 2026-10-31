---
title: "Claim Ledger: Root and Skill Advisor README Alignment"
description: "Every README claim the check marked inaccurate, stale or unverified, the source that decided it and what this phase did about it."
trigger_phrases:
  - "readme claim ledger"
  - "readme drift ledger"
importance_tier: "normal"
contextType: "general"
---
# Claim Ledger: Root and Skill Advisor README Alignment

Four read-only Opus agents checked 404 claims in the root README: 69 in lines 1-217, 120 in lines 218-629, 87 in lines 742-1034 and 128 in lines 1035-1508. The orchestrator checked the root README Skill Advisor section (lines 630-741) and the whole skill advisor README. Each suspected drift below was opened at its source before an edit. Line numbers are the pre-edit numbers from the baseline blobs in `baselines.txt`. The `Recheck` column names the check in `final-checks.txt` that passed from the final state.

## 1. Root README, fixed

| Line | Claim before | Source that decided it | Fix | Recheck |
|------|--------------|------------------------|-----|---------|
| 60 | The daemon "renders a one-line brief" | `runtime/lib/render.ts:446-449` appends a `Directives:` block to the route line | "renders its pick as a one-line route" | read of the new line |
| 66 | Runtimes "can dispatch five more AI CLIs" | `cli-external-orchestration/mode-registry.json` lists seven modes | Seven CLI bridges dispatch other AI CLIs | R23 |
| 70, 806 | "Every skill refuses to call itself" | `cli-external-orchestration/SKILL.md:37,188`: `cli-pi` may dispatch Pi from inside Pi | Every bridge but `cli-pi` refuses, and lineages and dispatch stacks stay bounded | R23 |
| 80, 1037 | 32 command entry points | `git ls-files .skilled/commands` gives 33 grouped plus 3 root, 36 in all | 36 | R01 |
| 80 | "Code Mode MCP single-tool interface" | `mcp-code-mode/mcp-server/index.ts:214-323` registers seven tools, and section 12 already says so | "the Code Mode MCP server" | read of the new line |
| 145, 371 | `specs/###-feature/` and `specs/022-big-feature/` | `AGENTS.md` section 6 and README line 247 use `specs/<track>/<###-name>/` | Track level added | read of the new lines |
| 146, 391, 396, 753 | 38 validation rules | `validator-registry.json` holds 40 rules | 40 | R02 |
| 161 | "The launcher binaries vendor their own dependencies" | Only `system-skill-advisor-launcher.cjs:1245-1248` runs `npm ci` and `npm run build`. `mcp-code-mode-launcher.cjs:73` spawns a prebuilt `dist/index.js` | The builds use the spec-kit workspace TypeScript, and only the advisor launcher installs and builds its runtime | R40 |
| 168-169 | Step 2 runs `npm install` at the root | The root has no `package.json`, removed in `740e36a1a5a` | Step 2 installs the spec-kit workspace: `npm --prefix .skilled/skills/system-spec-kit install` (inferred, see section 5) | R39 |
| 172 | "Code Mode boots from its launcher when a runtime needs it" | `mcp-server/` tracks no `package.json` and no `dist/`, and its install guide asks for `npm install` first | Code Mode needs its own server build, see its install guide | read of the new line |
| 182 | The Code Mode config grep names four files | `.mcp.json`, `.codex/config.toml` and `.devin/mcp_config.json` also wire the launcher | Grep names all seven, and all seven match | R41 |
| 199 | `/speckit:complete` "Runs research" | `speckit-complete.yaml:436` runs it only with `:with-research` or confidence below 60% | Says so | R42 |
| 211 | The "other shipped skills" list names six | Fifteen skills ship, and the list left out eight | "The other 14 shipped skills, such as ..." | R20 |
| 238, 287 | `implementation-summary.md` is required only after implementation completes | `spec-kit-docs.json` `afterImplementationStarts`, `check-files.sh:64-81` and `create.sh:430-453`: scaffolded at creation, required once a task is checked | Says so | R11 |
| 364 | `AC_CLOSURE` fails on any unmet criterion | `check-ac-closure.sh:8-13,350-362` fails only a packet that claims completion, and older packets stay advisory | Says so | R10 |
| 384, 395 | `create.sh --phase` makes a parent with its first child | `create.sh:62,292` defaults to three children | Three child phases, with `--phases <N>` or `--phase-names` | R09 |
| 414 | "Strict validation of a Level 3 packet runs in ~108 ms" | Two Level 3 packets took 1.12 s and 2.30 s here. The figure comes from an older measurement quoted at `validation-rules.md:741` | Drops the number and keeps the single-orchestrator fact from `validate.sh:5-8` | read of the new line |
| 417 | Parallel saves are serialized by an advisory lock on two files | `generate-context.ts:58,575-579` holds a packet-level lock, and a second save fails fast | Says so | R14 |
| 435 | "Three further gates run after execution" | `AGENTS.md` lists four rules under the post-execution gates, the fourth being goal posture | Four, named | R12 |
| 458 | Gate 3 box: "Only if file modification detected" | `AGENTS.md` section 2: Gate 3 is "ASKED FIRST" | "Asked first when a file write is coming" | read of the new line |
| 464 | Gate 4 "(REQUIRED)" | `AGENTS.md` gives Gate 4 no block label | Label dropped | read of the new line |
| 508 | `/speckit:save` refreshes metadata on every invocation | `save.md:17-19,43-44`: the default returns a plan, and apply or full-auto writes | Says so | R13 |
| 509 | Copilot shares the compact-cache provenance path | No Copilot hook ships under `system-spec-kit/runtime/hooks/` | Sentence removed | read of the new line |
| 523, 561 | All loops share one runtime loop contract | `mode-registry.json` gives research, review and council a `runtimeLoopType`. `SKILL.md:111`: every mode consumes `runtime/` and improvement stays host-driven | All consume `runtime/`, the improvement lanes drive their own loop host | R16 |
| 543 | Diagram step `legal_stop_evaluated` | That event exists only in the improvement lanes | "legal stop" | R17 |
| 566 | The runtime has "no reach-ins into a sibling skill" | `runtime/package.json` depends on `@spec-kit/shared` and type-checks with spec-kit's `tsc` | Names that one sibling dependency | R15 |
| 586, 801 | Adding a model is "a config choice" | `fanout-run.cjs:2248-2439` keeps Cursor, Pi and Devin allowlists in code | "a list edit", with the allowlist named | R18 |
| 624 | Benchmarks use pattern or 5-dimension scoring | `model-benchmark.md:110`: `pattern`, `5dim` or `reviewer` | Three scorers | R19 |
| 638, 696 | Eight public commands plus a trusted-only `skill_graph_propagate_enhances` | `skill-advisor-cli.ts:726-744` gates `advisor_rebuild`, `skill_graph_scan` and apply-mode propagation, and propagation reads freely | Four `advisor_*` and five `skill_graph_*`, three writes gated | A02 |
| 676-682 | Render step: "one-line hook brief" and `"Advisor: live, use ..."` | `render.ts:446-449`: `Advisor: <state>; use <skill> ... pass.` plus directives | Brief with one route line, and the real separator | read of the new lines |
| 693-700 | Layout: `config/` holds lane configuration, and `data/` and `scripts/` are missing | `config/` tracks route exclusions only. Lane weights live in `lib/scorer/lane-registry.ts`. `data/` holds the prompt policy and `scripts/` the Python scorer | Layout corrected | A03 |
| 703-712 | "The nine commands" lists eight | `list-tools` returns nine | `skill_graph_propagate_enhances` added | A02 |
| 707 | `advisor_status` reports "background daemon status" | The payload carries no daemon field. `trust-state.ts:104-111` sets the trust state to `unavailable` when the daemon is down | Says so | A01 |
| 744 | "15 advisor skill identities" loaded by Gate 2 | `route-exclusions.json` holds `sk-communication` out of routing | 15 skills, 14 routable | R20 |
| 768 | OBSIDIAN covers plugin development, vault tooling and the Desktop API | `sk-code-obsidian/SKILL.md:3`: read-only evidence for the Note Database plugin | Says so | R21 |
| 774-777 | sk-git "orchestrates three sub-skills" `git-worktree`, `git-commit`, `git-finish` | `sk-git/SKILL.md:330-336`: three phases backed by three reference files | Three phases, each with its reference | R22 |
| 783-786 | "Two skills power the autonomous loops" | `system-deep-loop/SKILL.md:12`: one skill with a nested `runtime/` layer | One skill in two layers | R16 |
| 788, 1109 | `/create:sk-skill-parent` | `.skilled/commands/create/skill-parent.md` | `/create:skill-parent` | R03 |
| 842, 1357 | mcp-tooling has ten modes including `mcp-orca-cli` | `mode-registry.json` lists nine, and mcp-tooling v1.8.0.0 moved Orca out | Nine modes | R06 |
| 857 | 42 check families, three browser-backed | `check-corpus.cjs` `FAMILY_NAMES` has 49, `NEEDS_A_BROWSER` names five | 49 and five | R05 |
| 866, 1125 | DQI weights 40/35/25 | `extract_structure.py:1151-1155`: 40/30/30 | 40/30/30 | R04 |
| 899 | mcp-tooling hands Orca prompts to cli-orca | mcp-tooling routes no Orca prompt. `advisor_recommend` on an Orca prompt returned `cli-orca` 0.91 | Orca work routes to cli-orca directly | read of the new line |
| 912 | The orchestrator is "read-only by design" | `.skilled/agents/orchestrate.md:11-12` allow write and edit | Delegates by design and keeps write and edit | R24 |
| 946 | `/prompt-improve` agent mode | The command is `/prompt:improve --agent`, and `/prompt-improve` is the mirror name on four runtimes | Both named | R25 |
| 989 | A binding row naming a missing child goal fails | `check-goal.cjs:241-266` flags an existing child that has no row | Direction corrected | R26 |
| 998 | `prompt-advisor` equivalents on OpenCode | No such plugin exists under `.opencode/plugins/` | Removed | read of the new line |
| 1001 | Every plugin uses `hook-flags.cjs` and none writes to stdout or stderr | 12 of 15 use `hook-flags.cjs`. The goal and vision plugins write to stderr only under a debug variable | Says so | R27 |
| 1037 | Every command has a behavioral execution spec | 7 of the 36 entry points own no YAML | "most are backed by a YAML execution spec" | R01 |
| 1052, 1060, 1066 | Modes omit `:autopilot`, `:unattended`, `:with-context` and `:with-phases` | The argument hints of `complete.md`, `plan.md` and `implement.md` | Modes and modifiers listed | R28 |
| 1093 | "There is no separate index to refresh afterwards" | `save.md:20`: regenerate the trigger index when `trigger_phrases` change | Says so | R13 |
| 1104, 1454 | `/create:sk-skill` | `.skilled/commands/create/skill.md` | `/create:skill` | R03 |
| 1107 | `/create:skill` "Registers in the skill catalog" | `create-skill-auto.yaml:466-472`: it mutates no advisor state | Registers nothing | R29 |
| 1121-1123 | `/create:readme` covers install guides | `readme.md:2-3`: folder READMEs only | Says so | R30 |
| 1131 | "matching 370+ existing entries" | 604 changelog entries outside `specs/` today | Count dropped | read of the new line |
| 1137 | "the 290-entry catalog structure across 22 categories" | No catalog in the repository has that size | "the package structure and its root catalog document", per `create-feature-catalog-auto.yaml:10-18` | read of the new line |
| 1139 | `/create:testing-playbook` | `.skilled/commands/create/manual-testing-playbook.md` | `/create:manual-testing-playbook` | R03 |
| 1183 | Doctor has 9 subsystems starting with `memory` | `_routes.yaml` defines 10 targets, `speckit-retrieval` and `router-reach` among them | 10 targets named | R07 |
| 1185 | `assets/doctor_<target>.yaml` | The files are hyphenated | `assets/doctor-<target>.yaml` | R07 |
| 1187 | `/doctor speckit-retrieval --dry-run` | `_routes.yaml:36` allows only `--incremental` there, and `--dry-run` belongs to `skill-advisor` | `/doctor skill-advisor --dry-run` | R08 |
| 1192-1193 | `/doctor:mcp` installs and debugs the Skill Advisor | `doctor-mcp-install.yaml` and `doctor-mcp-debug.yaml` cover `code_mode` only | Code Mode only | read of the new lines |
| 1203 | Every doctor YAML declares `invariants` and seven other keys | None declares `invariants`, and three lack other keys | Four common keys, the rest on most | read of the new line |
| 1210-1212 | The agent router hands requests to external AIs such as Claude Code | `agent-router.md:44-53`: the current agent adopts the target system's skill identity | Says so | R31 |
| 1220-1223 | Root utility `/goal` | The root utilities are `agent-router`, `goal-opencode` and `vision` | `/goal-opencode` and `/vision` | R32 |
| 1154, 783, 960-972, 1480 | Links to `#6-deep-loop` and `#12-code-mode-mcp` | GitHub's heading slugs drop the emoji and keep both spaces (inferred, see section 5) | `#6--deep-loop` and `#12--code-mode-mcp` | R43 |
| 1258 | `webflow` is MCP/remote with Webflow auth | `.utcp_config.json`: stdio through `npx`, needs `WEBFLOW_TOKEN` | Says so | R33 |
| 1287 | `SPECKIT_AUTOSYNC=0` "for one publish" | sk-git v1.5.0.0: it disables the publish leg | "for the publish leg" | R34 |
| 1381 | `CLAUDE.md` is a symlink to `AGENTS.md` | `0c40639821` removed it, and Claude Code loads the root `AGENTS.md` as project instructions in this session | Folded into the `AGENTS.md` line | R35 |
| 1382 | `opencode.json` holds model configuration and launcher notes | Its keys are `$schema`, `permission`, `mcp` and `experimental` | Says so | R36 |
| 1499 | Scripts runbook covers "Claude cleanup" | `.skilled/scripts/README.md` lists `session-cleanup.sh` | "session cleanup" | R37 |
| 1508 | "full-parity CLI front doors over the warm daemons" | `daemon-cli-reference.md:3`: one advisor front door | Says so | R38 |

## 2. Skill advisor README, fixed

| Line | Claim before | Source that decided it | Fix | Recheck |
|------|--------------|------------------------|-----|---------|
| 10 | `version: 0.11.0.0` | `frontmatter-version.mjs compute`: anchor 0.12.0.0 and 53 real edits before this commit | `0.12.0.54`, the value the phase commit makes true | `compute` after the commit |
| 156 | `advisor_status` reports "daemon info" | The payload has no daemon field. The trust state reads `unavailable` when the daemon is down | Says so | A01 |
| 217 | "The source adapters live under `.skilled/skills/system-skill-advisor/hooks/`" | `hooks/` holds the Claude-shape handler, the Pi extension and the CLI fallback. The Claude, Codex, Cursor and Devin entry shims live in `system-spec-kit/runtime/hooks/<runtime>/`, and the plugin lives in `.skilled/plugins/` | Says so | A04 |
| 86, 99, 132 | Four semicolons, which HVR bans as hard blockers | `hvr_scan.py` baseline | Split into sentences | A05 |

## 3. Kept as written, with the reason

| Where | Suspected drift | Why it stays |
|-------|-----------------|--------------|
| Root 77 | "our custom Pi extension package" for a fork | Section 10 already says it is a fork of `jiangge/pi-cache-optimizer`, and the local patches make it custom |
| Root 77, 1008 | The "Cache Pi" nickname appears only in the README | A label, not a claim a source can contradict |
| Root 210 | Only `sk-code` carries stack-specific patterns | No skill doc read shows stack-specific framing. Not disproven |
| Root 664 | Diagram lists `live / stale / absent / archived` | A gloss over two vocabularies that both exist: freshness states and the lifecycle status `archived` |
| Root 770, 929, 1304, 1375 | `code-review` mode for the registry id `sk-code-review` | `.skilled/agents/review.md:31,47,82` names it the code-review mode too |
| Root 986 | Claude Code and Codex have a native `/goal` | This session ran under Claude Code's native `/goal` |
| Root 1270 | Figma example passes `fileKey` | Needs a live Code Mode `tool_info` call to settle |
| Advisor 146 | The advisor "owns" the embedder layer while line 176 says it depends on system-spec-kit for it | `embedder-pluggability.md:113,192` says the advisor owns the embedding stack operationally, and the code lives in spec-kit's shared package, so both lines hold |

## 4. Follow-ups outside this phase

| Where | Drift | Evidence |
|-------|-------|----------|
| `system-spec-kit/references/validation/validation-rules.md:741` | Still cites about 108 ms for a fresh Level 3 strict run | 1.12 s and 2.30 s measured on two Level 3 packets |
| `system-skill-advisor/INSTALL-GUIDE.md:63-64` | Omits the spec-kit workspace install the advisor build needs | The advisor `build` script calls `../../system-spec-kit/node_modules/.bin/tsc` |
| `mcp-code-mode/mcp-server/package.json` | Not tracked, since `.skilled/.gitignore:2` ignores it, while `package-lock.json` is tracked | `doctor-mcp-debug.yaml:106` runs `npm install && npm run build` there, which needs the manifest |
| `commands/doctor/assets/doctor-mcp-presentation.txt:67,100,145,166` | Skill Advisor rows the install and debug workflows no longer run | Neither YAML mentions the advisor |
| Advisor skill counts | `advisor_status` reports `skillCount` 21 and `skill_graph_status` reports `totalSkills` 15. Six of the 21 tracked `graph-metadata.json` files are spec-kit test fixtures. The cause is not verified | Both commands' output from 2026-09-28 |

## 5. Inferred fixes

- **The Quick Start install steps.** A fresh clone was not run, because it installs packages. The fix follows `system-spec-kit/package.json` (a workspace root over `shared`, `runtime` and `runtime/cli` with `typescript` in `devDependencies`) and the advisor `build` script, which runs spec-kit's shared build and spec-kit's `tsc`. A fresh-clone run of the three commands would confirm it.
- **The in-page anchors.** GitHub builds a heading slug by lowercasing, dropping punctuation and emoji and turning each space into a hyphen, so `## 6. 🔄 DEEP LOOP` becomes `6--deep-loop`. Opening the rendered README on GitHub would confirm it.
